# ATOM v2 — Backend Architecture

> **ATOMic Thinking and Organisational Model**
> The AI thinking partner inside NucleuX Academy.

## Why This Upgrade

ATOM v1 is a naive keyword-based RAG chatbot with a single API endpoint and no memory. It has no vector search, no chunking, no reranking, no subagents, and no room-specific behavior on the backend. This document defines ATOM v2 — a full agentic system inspired by [OpenClaw's](https://openclaw.ai/) orchestration architecture.

### What v1 Has vs What v2 Needs

| Capability | v1 (Current) | v2 (Target) |
|---|---|---|
| Search | Keyword matching (path + first 2KB preview) | Hybrid search (pgvector cosine + Supabase FTS) |
| Embeddings | None | BGE-small-en-v1.5 (384d) via Supabase Edge Function |
| Reranking | None | Cohere Rerank API (`rerank-english-v3.0`) |
| Chunking | None — loads whole files | 512-token semantic chunks with 64-token overlap |
| Memory | Session-only (React useState) | Persistent in Supabase (conversations + user knowledge state) |
| Room Behavior | Uniform system prompt | 9 distinct system prompts with room-specific pipelines |
| Agent System | None — single monolithic endpoint | 5 Core Agents + 10 Plugin Agents (MarketHub-ready) |
| API | `POST /api/chat` (1 endpoint) | `POST /api/atom/chat` + 11 supporting endpoints |
| Plugin System | None | MarketHub — install, configure, sell plugins |

---

## Detailed Specifications

Each architectural layer has a dedicated deep-dive spec with implementable TypeScript interfaces, SQL schemas, algorithms, and error handling. Read these after understanding the overview above.

| Spec Document | Layer | What It Covers |
|---|---|---|
| [ATOM_CHAT_SPEC.md](./specs/ATOM_CHAT_SPEC.md) | Chat Modes | 9 room-specific chat modes, system prompts, context strategies, streaming protocol |
| [ATOM_GATEWAY_SPEC.md](./specs/ATOM_GATEWAY_SPEC.md) | Layer 1 — Gateway | 8-phase request lifecycle, Lane Queue, session state machine, system prompt composition, Heartbeat proactivity |
| [ATOM_RAG_PIPELINE_SPEC.md](./specs/ATOM_RAG_PIPELINE_SPEC.md) | Layer 2 — RAG | 5-stage pipeline, semantic chunking, BGE embeddings, hybrid search, Cohere reranking, context assembly |
| [ATOM_MEMORY_SPEC.md](./specs/ATOM_MEMORY_SPEC.md) | Layer 3 — Memory | 7 memory types, Memorist protocol, semantic search, decay curves, conversation compaction, privacy controls |
| [ATOM_AGENTS_SPEC.md](./specs/ATOM_AGENTS_SPEC.md) | Layer 4 — Agents | 5 core + 10 plugin agents, execution model, Skills-as-Markdown, inter-agent protocol, room activation matrix |
| [ATOM_MARKETHUB_SPEC.md](./specs/ATOM_MARKETHUB_SPEC.md) | Layer 5 — MarketHub | Plugin SDK, publishing workflow, security scanning, revenue model, discovery algorithm, API endpoints |
| [ATOM_FRONTEND_SPEC.md](./specs/ATOM_FRONTEND_SPEC.md) | Frontend/UI | ATOMProvider, Widget v2, Panel v2, all 9 room integrations, Agent Transparency, Proactive Notifications, Memory UI, MarketHub UI, 10 new components |

> **Reading order:** Chat Spec → Gateway → RAG → Memory → Agents → MarketHub → Frontend

---

## System Architecture

```
User Request (from any room + floating widget)
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                    ATOM Gateway (Orchestrator)                │
│                                                              │
│  1. Authenticate user (Supabase JWT)                        │
│  2. Identify room → load room-specific system prompt        │
│  3. Invoke Core Agent: Scribe (intent detection + query     │
│     expansion with medical synonyms)                        │
│  4. Invoke Core Agent: Memorist (read user's persistent     │
│     memory — weak areas, mastered topics, preferences)      │
│  5. Invoke Core Agent: Router (decide which pipeline        │
│     and plugins to activate based on room + intent)         │
│  6. Execute the pipeline (retrieval → rerank → generate)    │
│  7. Stream response via SSE                                 │
│  8. Post-generation: Memorist writes new observations       │
└──────────┬──────────────────────────────────────────────────┘
           │
           │  Pipeline selected by Router:
           │
    ┌──────┼──────────────────────────────┐
    ▼      ▼                              ▼
┌────────────────┐  ┌──────────────┐  ┌──────────────────┐
│  Retrieval      │  │  Reasoning   │  │  Generation      │
│  Pipeline       │  │  Pipeline    │  │  Pipeline        │
│                 │  │              │  │                  │
│  Scribe →       │  │  Plugin      │  │  Claude Sonnet   │
│  Retriever →    │  │  Agents      │  │  + room prompt   │
│  Critic         │  │  execute     │  │  + retrieved ctx │
│  (hybrid search │  │  (Assessor,  │  │  + memory ctx    │
│   + rerank)     │  │  Challenger, │  │  + plugin ctx    │
│                 │  │  etc.)       │  │                  │
└────────────────┘  └──────────────┘  └──────────────────┘
```

---

## Layer 1: ATOM Gateway

The Gateway is the single orchestration process (inspired by OpenClaw's Gateway pattern). Every ATOM request flows through it.

**Responsibilities:**
- Session management and authentication
- Room detection and system prompt assembly
- Core agent orchestration (Scribe → Memorist → Router → Pipeline)
- Plugin activation based on room + user installations
- SSE streaming management
- Error handling and fallback (degrade gracefully if a plugin fails)

**Request format:**

```typescript
// POST /api/atom/chat
interface ATOMRequest {
  messages: Message[];
  room: RoomId;                    // desk | library | classroom | training | cbme | community | arena | backstage | studio
  conversationId?: string;         // resume existing conversation
  context?: {
    topicSlug?: string;            // e.g., "surgery/esophagus/gerd-hiatal-hernia"
    subjectId?: string;
    viewMode?: string;             // explorer, exam-prep, textbook, quiz, cases, roadmap
    deskSources?: string[];        // enabled textbook sources
    cbmeCode?: string;             // e.g., "AN1.1"
    mcqId?: string;
    caseId?: string;
  };
}

type RoomId = 'desk' | 'library' | 'classroom' | 'training' | 'cbme' | 'community' | 'arena' | 'backstage' | 'studio';
```

---

## Layer 2: RAG Pipeline

### Step 1 — Query Expansion (Core Agent: Scribe)

```
Input: Raw user message
Output: { intent, expandedQuery, keywords, medicalSynonyms }

The Scribe:
1. Classifies intent: learn | practice | review | plan | discuss | generate
2. Expands medical terms using synonym map + abbreviation resolution
   e.g., "MI" → "myocardial infarction", "acute coronary syndrome", "STEMI", "NSTEMI"
3. Extracts subject/topic context from the message
4. Determines if retrieval is needed (some intents like "plan my day" don't need RAG)
```

### Step 2 — Hybrid Search (Core Agent: Retriever)

```
Input: { expandedQuery, subjectFilter?, viewModeFilter? }
Output: Top 20 candidate chunks

Two parallel searches:
A) Vector Search (pgvector)
   → Embed the expanded query using BGE-small
   → Cosine similarity against content_chunks.embedding
   → Filter by subject/subspecialty if context provided
   → Return top 15 by similarity score

B) Full-Text Search (Supabase FTS)
   → to_tsquery('english', keywords)
   → Match against content_chunks.fts column
   → Rank by ts_rank_cd
   → Return top 10

Merge: Deduplicate by chunk ID, union results, cap at 20 candidates
```

### Step 3 — Reranking (Core Agent: Critic)

```
Input: { query, 20 candidate chunks }
Output: Top 5 most relevant chunks, reranked

Uses Cohere Rerank API:
POST https://api.cohere.ai/v1/rerank
{
  model: "rerank-english-v3.0",
  query: expandedQuery,
  documents: chunks.map(c => c.content),
  top_n: 5
}

Returns relevance scores 0.0–1.0 per chunk.
Filter: Drop any chunk with score < 0.3 (noise threshold).
```

### Step 4 — Context Assembly

```
Assembled context for Claude:
1. Global ATOM base prompt (identity, principles, rules)
2. Room-specific system prompt (mode, behaviors, active agents)
3. Active plugin system prompts (concatenated)
4. User memory context (from Memorist)
5. Retrieved content chunks (from Critic, top 5)
6. Desk sources (if enabled by student)
7. Topic context (current topic being viewed, if any)
8. Conversation history

Total context budget: ~50,000 tokens
Allocation:
  - System prompts: ~3,000 tokens
  - Memory: ~2,000 tokens
  - Retrieved chunks: ~10,000 tokens (5 × ~2,000)
  - Conversation history: ~30,000 tokens
  - Generation budget: ~5,000 tokens (max_tokens)
```

### Step 5 — Generation (Main ATOM via Claude Sonnet)

```
Model: claude-sonnet-4-20250514
Max tokens: 5,000
Temperature: 0.7 (balanced creativity + accuracy)
Streaming: SSE via Anthropic SDK stream()

Post-generation:
  → Memorist writes observations (new weak areas discovered, topics discussed, confidence signals)
  → Conversation saved to atom_conversations table
```

---

## Layer 3: Memory System

### Short-Term Memory (Session)

Lives in the conversation's message history. Includes:
- All messages in the current conversation
- Current room and topic context
- Active plugin states

### Long-Term Memory (Persistent — Supabase)

Stored in `atom_user_memory` table. The Memorist reads before generation and writes after.

**Memory Types:**

| Type | Example | Written When | Read When |
|---|---|---|---|
| `topic_mastery` | "Student has mastered GERD pathophysiology" | After successful quiz/explanation | Library, Training Centre |
| `weak_area` | "Consistently confuses Type 1 vs Type 2 diabetes pathology" | After repeated wrong answers | All rooms — prioritized in retrieval |
| `preference` | "Prefers mnemonics over diagrams for Pharmacology" | After explicit preference stated | Library, Classroom |
| `insight` | "Student's confidence in Cardiology exceeds actual accuracy by 25%" | After Backstage calibration analysis | Backstage, Desk |
| `goal` | "Target: NEET-PG 2027, aiming for Radiology seat" | From onboarding or explicit statement | Desk, CBME, Arena |
| `study_pattern` | "Most productive between 9-11 PM, averages 45 min sessions" | After analytics pattern detected | Desk |
| `clinical_connection` | "Understood acid-base through ABG case in Emergency" | After a meaningful learning moment | Library, Training Centre |

**Memory Retrieval:**

Before each generation, Memorist performs:
1. Fetch recent memories (last 7 days) for the current room
2. Semantic search: embed the query, find top 5 relevant memories across all types
3. Always include: active weak areas, current goals, active study pattern
4. Budget: ~2,000 tokens of memory context

**Memory Decay:**

`relevance_score` decays over time:
- New memories: score = 1.0
- Daily decay: score × 0.97 (halves in ~23 days)
- Refreshed on access: if ATOM references a memory, reset score to 1.0
- Expired memories (`relevance_score < 0.1`) are archived, not deleted

---

## Layer 4: Subagent System — Core + Plugin Architecture

### Tier 1: Core Agents (Built-in, Non-Removable)

| Core Agent | Skill | Description |
|------------|-------|-------------|
| **Scribe** | Intent Detection & Query Expansion | Understands what the student wants, expands medical queries with synonyms, classifies intent (learn / practice / review / plan / discuss / generate) |
| **Retriever** | Hybrid Search (Vector + FTS) | Fetches relevant content chunks using pgvector cosine similarity + Supabase full-text search, merges and deduplicates results |
| **Critic** | Reranking & Relevance Filtering | Cross-encoder reranking via Cohere API, filters noise, ensures only high-quality context reaches the LLM |
| **Memorist** | Memory Read/Write | Reads student's persistent memory before generation, writes new learnings and observations after generation |
| **Router** | Pipeline Orchestration | Decides which plugin agents to invoke based on room + intent + user installations, manages execution order, handles plugin errors gracefully |

### Tier 2: Plugin Agents (MarketHub — Installable)

| Plugin Agent | Skill Category | Default Rooms | Description |
|-------------|---------------|---------------|-------------|
| **Assessor** | Evaluation & Grading | Training Centre, Arena, Backstage | Scores MCQ responses, evaluates clinical reasoning, grades confidence calibration, tracks Bloom's taxonomy level |
| **Challenger** | Question Generation | Training Centre, Arena, Classroom | Generates MCQs, Socratic questions, viva questions, creates desirable difficulty, adapts to student level |
| **Cartographer** | Knowledge Mapping | Library, CBME, Desk | Builds topic relationship graphs, generates learning roadmaps, maps prerequisites, creates study paths |
| **Analyst** | Performance Analytics | Backstage, Desk, Arena | Interprets study data, identifies patterns, generates insight reports, tracks Ebbinghaus decay curves |
| **Clinician** | Clinical Reasoning | Training Centre, Library | Guides systematic clinical approach (Hx → Ex → Ix → Dx → Rx), builds DDx trees, maps clinical algorithms |
| **Examiner** | Exam Strategy | Training Centre, Arena | Pattern recognition in PYQs, elimination strategies, time management coaching, exam-specific tips (NEET-PG, INICET, USMLE) |
| **Scribe Pro** | Note Generation | Classroom, Library | Generates structured notes from lectures, creates flashcards, builds summary decks, formats for Anki export |
| **Moderator** | Discussion Management | Common Room | Fact-checks claims against textbooks, structures debates, extracts learning takeaways, maintains academic rigor |
| **Wellness Coach** | Wellbeing & Habits | Backstage | BEDS-M tracking, Kolb's cycle guidance, burnout detection, study-life balance recommendations |
| **Curriculum Mapper** | NMC/CBME Mapping | CBME | Maps learning to NMC competency codes, tracks K/KH/SH/P domains, generates competency completion reports |

### Room → Agent Activation Matrix

| Room | Core Agents (Always) | Default Plugins | Optional Plugins |
|------|---------------------|----------------|-----------------|
| **My Desk** | Scribe, Retriever, Critic, Memorist, Router | Cartographer, Analyst | Wellness Coach |
| **Library** | Scribe, Retriever, Critic, Memorist, Router | Cartographer, Clinician | Scribe Pro |
| **Classroom** | Scribe, Retriever, Critic, Memorist, Router | Scribe Pro, Challenger | — |
| **Training Centre** | Scribe, Retriever, Critic, Memorist, Router | Assessor, Challenger, Clinician, Examiner | — |
| **CBME** | Scribe, Retriever, Critic, Memorist, Router | Curriculum Mapper, Cartographer | — |
| **Common Room** | Scribe, Retriever, Critic, Memorist, Router | Moderator | — |
| **Arena** | Scribe, Retriever, Critic, Memorist, Router | Assessor, Examiner, Challenger, Analyst | — |
| **Backstage** | Scribe, Retriever, Critic, Memorist, Router | Analyst, Wellness Coach, Assessor | — |
| **Open Studio** | Scribe, Retriever, Critic, Memorist, Router | ALL installed plugins | ALL |

---

## Layer 5: Plugin Architecture & MarketHub

### Plugin Interface (SDK)

Every plugin agent must implement this TypeScript interface:

```typescript
interface ATOMPlugin {
  // Identity
  id: string;                         // unique ID (e.g., "nucleux.assessor.v1")
  name: string;                       // display name
  description: string;                // what this plugin does
  version: string;                    // semver
  author: string;                     // creator name
  category: PluginCategory;           // evaluation | generation | analytics | clinical | exam | notes | discussion | wellbeing | curriculum

  // Configuration
  defaultRooms: RoomId[];             // rooms where this activates by default
  requiredCoreAgents: CoreAgentId[];  // which core agents this plugin depends on

  // System Prompt Fragment
  systemPrompt: string;               // injected into ATOM's context when this plugin is active

  // Capabilities
  skills: PluginSkill[];              // list of skills this plugin provides

  // Execution
  execute(context: PluginContext): Promise<PluginResult>;

  // Lifecycle hooks
  onActivate?(room: RoomId): void;
  onDeactivate?(room: RoomId): void;
}

interface PluginSkill {
  name: string;                       // e.g., "grade_mcq", "generate_flashcard"
  description: string;
  inputSchema: JSONSchema;            // what data this skill needs
  outputSchema: JSONSchema;           // what it returns
}

interface PluginContext {
  room: RoomId;
  userMessage: string;
  conversationHistory: Message[];
  retrievedChunks: ContentChunk[];    // from Retriever core agent
  userMemory: MemoryEntry[];          // from Memorist core agent
  studentProfile: StudentProfile;     // level, exam target, weak areas
  topicContext?: TopicContext;         // current topic being viewed
}

interface PluginResult {
  contextInjection?: string;          // text to inject into ATOM's context before generation
  directResponse?: string;            // bypass ATOM generation — respond directly
  memoryWrites?: MemoryEntry[];       // new memories to persist
  uiActions?: UIAction[];             // trigger client-side actions (navigate, open panel, etc.)
}

type PluginCategory =
  | 'evaluation'      // grading, scoring, assessment
  | 'generation'      // question generation, content creation
  | 'analytics'       // data interpretation, insights
  | 'clinical'        // clinical reasoning, DDx, management
  | 'exam'            // exam strategy, pattern recognition
  | 'notes'           // note-taking, flashcard creation
  | 'discussion'      // debate moderation, fact-checking
  | 'wellbeing'       // habit tracking, burnout prevention
  | 'curriculum'      // CBME mapping, competency tracking
  | 'subject'         // subject-specific deep expertise
  | 'community';      // third-party community plugins
```

### MarketHub

```
┌──────────────────────────────────────────┐
│            ATOM MarketHub                 │
│                                           │
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Free      │  │ Premium  │  │ Custom │ │
│  │ Plugins   │  │ Plugins  │  │ Builds │ │
│  │           │  │          │  │        │ │
│  │ Assessor  │  │ USMLE    │  │ Your   │ │
│  │ Scribe    │  │ Mastery  │  │ Plugin │ │
│  │ Pro       │  │ Coach    │  │        │ │
│  │ Moderator │  │ Surgery  │  │        │ │
│  │           │  │ Wizard   │  │        │ │
│  └──────────┘  └──────────┘  └────────┘ │
│                                           │
│  Categories:                              │
│  • Evaluation & Grading                  │
│  • Question Generation                   │
│  • Knowledge Mapping                     │
│  • Clinical Reasoning                    │
│  • Exam Strategy (NEET-PG, USMLE, etc.) │
│  • Note & Content Generation             │
│  • Analytics & Insights                  │
│  • Wellbeing & Productivity              │
│  • Subject-Specific (Surgery, Peds, etc.)│
│  • Community Plugins                     │
└──────────────────────────────────────────┘
```

**MarketHub Features:**
- Browse and search plugins by category, rating, install count
- One-click install/uninstall
- Per-room activation toggle (user can disable a plugin in specific rooms)
- User-configurable plugin settings
- Plugin reviews and ratings
- Creator dashboard: publish, version, track installs and revenue
- Revenue share: 70% creator / 30% NucleuX

---

## Room System Prompts

### Global Base Prompt (Prepended to ALL Modes)

```markdown
You are ATOM — ATOMic Thinking and Organisational Model.

You are the AI thinking partner inside NucleuX Academy, a medical education
platform for Indian MBBS/PG/SS students. You were created by two physician
brothers who believe learning should be atomic — breaking the complex into
its fundamental units, then rebuilding understanding from the ground up.

## Core Principles
1. THINK WITH the student, not FOR them — you are a partner, not an answer machine
2. ATOMIC approach — decompose into smallest teachable units, then scaffold up
3. CITE SOURCES — always reference textbooks ("According to Robbins Ch. 3...")
4. CLINICAL CONNECTIONS — link every basic science concept to bedside relevance
5. DESIRABLE DIFFICULTY — the right amount of struggle strengthens learning
6. CALIBRATE — track what the student knows vs thinks they know

## Rules
- Never fabricate clinical data or statistics
- If your context doesn't contain the answer, say so honestly
- Always recommend verifying clinical decisions with standard textbooks
- Use markdown formatting for structure
- Keep responses focused and high-yield

## Student Profile
Level: {student_level}
Exam Target: {exam_target}
Exam Date: {exam_date}
Strong Areas: {strong_subjects}
Weak Areas: {weak_subjects}

## Memory
{memory_context}
```

### Room 1: My Desk — Command Centre

```markdown
## Mode: Command Centre
You are at the student's Desk — their command centre for planning and strategy.

Your role: Help the student plan their day, prioritize topics, and make
strategic study decisions based on their data.

## Behaviors
- Analyze their streak, study minutes, and weak areas to suggest what to study today
- Create time-blocked study plans factoring in spaced repetition due dates
- Flag topics with decaying memory strength (Ebbinghaus curve)
- Celebrate consistency and streak milestones
- Be decisive — give clear recommendations, not vague options
- When asked "what should I study?", consider: weak areas, upcoming exam topics,
  spaced repetition due cards, and time available

## Active Agents: Memorist → Cartographer → Analyst
## Pipeline: Memory Read → Analyze Patterns → Generate Plan
```

### Room 2: Library — Librarian

```markdown
## Mode: Librarian
You are in the Library — the medical knowledge encyclopedia.

Your role: Help the student navigate, understand, and connect medical knowledge
across subjects and topics.

## Behaviors
- When asked about a topic, retrieve and synthesize content from multiple sources
- Build prerequisite chains — "Before understanding X, you need to know Y"
- Highlight high-yield connections between basic science and clinical topics
- Offer 6 view perspectives: concept explanation, exam summary, textbook deep-dive,
  quiz, cases, roadmap
- Cross-reference across subjects (e.g., link Pharmacology of anti-epileptics to
  Physiology of neural transmission)
- When the student is browsing a topic, proactively suggest related topics and
  flag if prerequisites are missing

## Active Agents: Retriever → Critic → Cartographer, Clinician
## Pipeline: Query Expand → Hybrid Search → Rerank → Multi-Source Synthesis → Generate
```

### Room 3: Classroom — Lecture Partner

```markdown
## Mode: Lecture Partner
You are in the Classroom — watching lectures alongside the student.

Your role: Be the perfect study buddy during lectures — take notes, generate
mind maps, explain confusing points, and help the student actively engage
rather than passively watch.

## Behaviors
- When given lecture content, extract key concepts into structured notes
- Generate mind maps (JSON format for Excalidraw) showing concept relationships
- When asked "explain this", break it into atomic units with analogies
- Prime the student before a lecture: "Key things to watch for in this topic..."
- After a lecture: generate retrieval questions to test understanding
- Connect lecture content to textbook references
- Support the Bear Hunter workflow: help with Pre-study priming and Aim question generation

## Active Agents: Retriever → Scribe Pro, Challenger
## Pipeline: Content Extract → Concept Map → Active Recall Prompts → Generate
```

### Room 4: Training Centre — Practice Partner

```markdown
## Mode: Practice Partner
You are in the Training Centre — where the student practices for exams.

Your role: Be a clinical trainer who builds exam readiness through deliberate
practice. Don't just explain — make them THINK.

## Behaviors
- When explaining MCQ answers: break down WHY each option is right/wrong using
  first principles
- Identify the "trap" in questions — what the examiner is testing
- After wrong answers: diagnose the knowledge gap, don't just give the answer
- Adjust difficulty based on performance — step up when they're getting comfortable
- For OSCE/clinical cases: guide through systematic approach
  (History → Exam → Investigations → Diagnosis → Management)
- Pattern recognition: "This question pattern appears in NEET-PG every 2-3 years"
- For Patient Simulator: act as the attending who guides clinical reasoning
- Track which question types the student struggles with (recall vs application vs analysis)

## Active Agents: Assessor → Challenger → Retriever → Clinician, Examiner
## Pipeline: Analyze Question → Retrieve Context → Assess Response → Targeted Feedback → Generate Follow-up
```

### Room 5: CBME — Competency Guide

```markdown
## Mode: Competency Guide
You are in the CBME room — tracking NMC competency-based medical education progress.

Your role: Map the student's learning to NMC competency codes, track mastery levels,
and ensure curriculum coverage.

## Behaviors
- When asked about a competency code (e.g., "AN1.1"), explain what it requires
  and how to achieve it
- Map learning activities to competency domains:
  Knowledge (K), Knowledge-How (KH), Skill-How (SH), Performance (P)
- Track which competencies are completed, in-progress, or not started
- Suggest the most efficient path to cover remaining competencies for their
  current MBBS year
- Explain "Must Know" vs "Should Know" vs "Nice to Know" for each competency
- Connect competencies to Library topics and Training Centre practice
- Show progress percentages and celebrate milestones

## Active Agents: Curriculum Mapper → Cartographer → Memorist
## Pipeline: Competency Lookup → Map to Topics → Check Progress → Suggest Path → Generate
```

### Room 6: Common Room — Debate Moderator

```markdown
## Mode: Debate Moderator
You are in the Common Room — the social space where students discuss and debate.

Your role: Elevate discussions with evidence-based moderation. Add textbook
references, fact-check claims, and help students learn from each other.

## Behaviors
- When students debate a clinical scenario, add relevant textbook citations
- Fact-check medical claims in real-time — "Actually, according to Harrison's..."
- Structure debates: present both sides, then synthesize the evidence
- Extract learning takeaways from discussions
- Encourage healthy scientific disagreement while maintaining accuracy
- Summarize long threads into key points
- Never take sides without evidence — always cite sources

## Active Agents: Retriever → Critic → Moderator
## Pipeline: Analyze Discussion → Fact-Check Claims → Retrieve Evidence → Synthesize → Generate
```

### Room 7: Arena — Competition Coach

```markdown
## Mode: Competition Coach
You are in the Arena — the competitive MCQ battleground.

Your role: Coach the student to WIN. Speed, accuracy, and strategy for
competitive exam performance.

## Behaviors
- Analyze speed vs accuracy tradeoffs
  "You're 85% accurate but too slow on Pharmacology"
- Rapid-fire question coaching: teach elimination strategy, first-pass techniques
- Identify competitive weak spots compared to cohort performance
- Build exam stamina: simulate time-pressure conditions
- Post-match analysis: breakdown of what went wrong and specific fix strategies
- Mental game coaching: confidence management during competitive pressure
- Track performance trends: "Your Anatomy accuracy improved 12% this week"

## Active Agents: Assessor → Memorist → Challenger → Examiner, Analyst
## Pipeline: Performance Analysis → Weakness Detection → Strategy Generation → Targeted Drills → Generate
```

### Room 8: Backstage — Cognitive Coach

```markdown
## Mode: Cognitive Coach
You are in Backstage — the student's private metacognitive laboratory.

Your role: Help the student understand HOW they learn, not just WHAT they learn.
Calibrate confidence, track cognitive patterns, and build self-awareness.

## Behaviors
- Analyze confidence calibration: where do they overestimate vs underestimate?
- Apply Bloom's taxonomy: which cognitive levels are they strong/weak at?
  (Remember → Understand → Apply → Analyze → Evaluate → Create)
- Kolb's learning cycle: guide through experience → reflection → abstraction → experiment
- BEDS-M wellbeing check: Breaks, Environment, Deep sleep, Intentions, Mindfulness
- Track competency ladder: unconsciously incompetent → consciously competent
- Bear Hunter System: which stages of Pre-study/Aim/Shoot/Skin need attention?
- Be honest about blind spots:
  "Your confidence in Cardiology is 80% but your accuracy is 55%"
- Celebrate growth, not just results

## Active Agents: Memorist → Assessor → Analyst, Wellness Coach
## Pipeline: Read Analytics → Identify Patterns → Calibration Analysis → Metacognitive Feedback → Generate
```

### Room 9: /chat — Open Studio

```markdown
## Mode: Open Studio
You are in the Open Studio — unrestricted, full-capability thinking partner mode.

Your role: Be the complete ATOM with no room constraints. Deep dive into any
topic, any subject, any learning mode. This is where the student comes for
extended thinking sessions.

## Behaviors
- No room constraints — full access to all capabilities
- Extended multi-turn reasoning: can go deep on complex topics
- Cross-room context: connect Library knowledge to Training Centre practice
  to Backstage analytics
- Generate any output format: summaries, flashcards, mind maps, presentations,
  audio scripts
- Proactive: suggest next steps, flag gaps, recommend resources
- Source management: respect the student's enabled desk sources
- Long-form teaching: can deliver mini-lectures with structured progression
- When student is stuck, shift to Socratic mode — ask, don't tell

## Active Agents: ALL Core + ALL installed plugins
## Pipeline: Full orchestration — intent detection → retrieval → reasoning → generation → memory write
```

---

## Database Schema

### Migration 009: Vector Search (`009_vector_search.sql`)

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Content chunks with embeddings
CREATE TABLE content_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_slug TEXT NOT NULL,
  subject TEXT NOT NULL,
  subspecialty TEXT NOT NULL,
  source_file TEXT NOT NULL,
  view_mode TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding vector(384),
  metadata JSONB DEFAULT '{}',
  token_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- HNSW index for fast vector search
CREATE INDEX idx_chunks_embedding ON content_chunks
  USING hnsw (embedding vector_cosine_ops);

-- Full-text search column and index
ALTER TABLE content_chunks ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;
CREATE INDEX idx_chunks_fts ON content_chunks USING gin(fts);

-- Filtered search indexes
CREATE INDEX idx_chunks_subject ON content_chunks(subject, subspecialty);
CREATE INDEX idx_chunks_topic ON content_chunks(topic_slug);
CREATE INDEX idx_chunks_view_mode ON content_chunks(view_mode);
```

### Migration 010: ATOM Memory (`010_atom_memory.sql`)

```sql
-- Persistent conversations
CREATE TABLE atom_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  room TEXT NOT NULL,
  title TEXT,
  messages JSONB NOT NULL DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User knowledge state
CREATE TABLE atom_user_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  memory_type TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(384),
  relevance_score FLOAT DEFAULT 1.0,
  source_room TEXT,
  topic_slug TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_memory_user ON atom_user_memory(user_id);
CREATE INDEX idx_memory_embedding ON atom_user_memory
  USING hnsw (embedding vector_cosine_ops);
CREATE INDEX idx_memory_type ON atom_user_memory(user_id, memory_type);

-- RLS
ALTER TABLE atom_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own conversations" ON atom_conversations
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE atom_user_memory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own memory" ON atom_user_memory
  FOR ALL USING (auth.uid() = user_id);
```

### Migration 011: MarketHub (`011_atom_markethub.sql`)

```sql
-- Plugin registry
CREATE TABLE atom_plugins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plugin_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  version TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id),
  category TEXT NOT NULL,
  default_rooms TEXT[] NOT NULL,
  system_prompt TEXT NOT NULL,
  skills JSONB NOT NULL DEFAULT '[]',
  config_schema JSONB DEFAULT '{}',
  is_core BOOLEAN DEFAULT FALSE,
  is_free BOOLEAN DEFAULT TRUE,
  price_cents INTEGER DEFAULT 0,
  install_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User installations
CREATE TABLE user_plugins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plugin_id TEXT REFERENCES atom_plugins(plugin_id),
  is_active BOOLEAN DEFAULT TRUE,
  active_rooms TEXT[],
  config JSONB DEFAULT '{}',
  installed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, plugin_id)
);

-- Plugin reviews
CREATE TABLE plugin_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plugin_id TEXT REFERENCES atom_plugins(plugin_id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, plugin_id)
);

-- RLS
ALTER TABLE atom_plugins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published plugins visible" ON atom_plugins
  FOR SELECT USING (is_published = TRUE OR author_id = auth.uid());
CREATE POLICY "Authors manage plugins" ON atom_plugins
  FOR ALL USING (author_id = auth.uid());

ALTER TABLE user_plugins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage installations" ON user_plugins
  FOR ALL USING (user_id = auth.uid());

ALTER TABLE plugin_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews visible to all" ON plugin_reviews
  FOR SELECT USING (TRUE);
CREATE POLICY "Users manage reviews" ON plugin_reviews
  FOR ALL USING (user_id = auth.uid());
```

---

## Chunking Strategy

| Content Type | Chunk Strategy | Metadata |
|---|---|---|
| **Explorer markdown** | 512 tokens, respect headers, 64-token overlap | heading hierarchy, topic slug, subject |
| **Exam-prep markdown** | 512 tokens, keep mnemonics whole | high_yield: true, exam_tags |
| **Textbook markdown** | 512 tokens, respect headers | textbook_ref, chapter, page range |
| **Retrieval cards JSON** | 1 chunk per Q&A pair | difficulty, tags |
| **Case scenarios** | 1 chunk per case | difficulty, subject, presentation type |
| **Tables** | Keep whole — never split rows | caption, source_section |
| **Mnemonics** | 1 chunk per mnemonic | type: mnemonic |
| **NMC codes** | 1 chunk per competency code | domain (K/KH/SH/P), phase, core status |

**Embedding Model:** BGE-small-en-v1.5 (BAAI) — 384 dimensions
**Runtime:** Supabase Edge Function with ONNX runtime
**Re-embedding trigger:** On content file change (via admin endpoint `POST /api/atom/embed`)

---

## API Endpoints

### Core Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/atom/chat` | Yes | Main ATOM endpoint — Gateway → Pipeline → SSE stream |
| `GET` | `/api/atom/conversations` | Yes | List user's past conversations |
| `GET` | `/api/atom/conversations/[id]` | Yes | Get a specific conversation |
| `POST` | `/api/atom/memory` | Yes | Read/write user memory |
| `POST` | `/api/atom/search` | Yes | Direct vector search (debugging) |
| `POST` | `/api/atom/embed` | Admin | Trigger content re-embedding |

### MarketHub Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/atom/plugins` | Yes | Browse published plugins |
| `GET` | `/api/atom/plugins/installed` | Yes | User's installed plugins |
| `POST` | `/api/atom/plugins/install` | Yes | Install a plugin |
| `POST` | `/api/atom/plugins/uninstall` | Yes | Uninstall a plugin |
| `POST` | `/api/atom/plugins/configure` | Yes | Update plugin config per room |
| `POST` | `/api/atom/plugins/publish` | Yes | Publish a new plugin (creator) |

### Legacy (Deprecate after migration)

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/chat` | No | v1 ATOM — keyword RAG, no memory. Deprecate after v2 launch. |

---

## Environment Variables (New)

| Variable | Required | Purpose |
|---|---|---|
| `COHERE_API_KEY` | Yes | Cohere Rerank API for cross-encoder reranking |
| `ATOM_EMBED_SECRET` | Admin only | Secret for triggering re-embedding via `/api/atom/embed` |

Existing variables remain unchanged:
- `ANTHROPIC_API_KEY` — Claude Sonnet for generation
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` — Supabase

---

## Implementation Phases

### Phase 1: Foundation (Vector Search + Memory)
1. Create migrations 009, 010
2. Build chunking pipeline (parse `/content/` → generate chunks)
3. Deploy BGE embedding Edge Function
4. Build hybrid search endpoint (`/api/atom/search`)
5. Replace keyword search in `/api/chat` with vector search

### Phase 2: Gateway + Room Prompts
1. Create `/api/atom/chat` with Gateway orchestration
2. Implement 5 Core Agents (Scribe, Retriever, Critic, Memorist, Router)
3. Deploy 9 room-specific system prompts
4. Add conversation persistence
5. Deprecate old `/api/chat`

### Phase 3: Plugin System + MarketHub
1. Create migration 011
2. Build Plugin SDK interface
3. Implement 10 default plugins as first-party
4. Build MarketHub API endpoints
5. Build MarketHub UI (browse, install, configure)
6. Launch creator dashboard

### Phase 4: Polish
1. Memory decay and relevance tuning
2. Plugin review and rating system
3. Analytics on plugin usage
4. Revenue share system for premium plugins
5. Community plugin submissions and review process
