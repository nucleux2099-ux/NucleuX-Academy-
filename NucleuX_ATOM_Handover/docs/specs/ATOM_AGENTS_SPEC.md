# ATOM Agents — Core & Plugin Agent Specification

> **Layer 4 of 5** | Part of the [ATOM v2 Backend Architecture](../ATOM_V2_BACKEND.md)
> Inspired by [OpenClaw's Pi Agent Core](https://openclaw.ai/) — specialized agents orchestrated by a Router, using Skills-as-Markdown for extensibility.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Agent Execution Model](#2-agent-execution-model)
3. [Core Agents (5)](#3-core-agents)
4. [Plugin Agents (10)](#4-plugin-agents)
5. [Skills-as-Markdown](#5-skills-as-markdown)
6. [Agent Communication Protocol](#6-agent-communication-protocol)
7. [Room → Agent Activation Matrix](#7-room--agent-activation-matrix)
8. [Testing Agents](#8-testing-agents)
9. [Cross-References](#9-cross-references)

---

## 1. Overview

### Philosophy

Agents are **not** independent AI models. They are **specialized functions** that shape ATOM's behavior by:
- Modifying the context window (injecting retrieved content, memory, instructions)
- Processing inputs (expanding queries, classifying intents)
- Post-processing outputs (extracting memories, grading answers)
- Orchestrating flow (deciding which plugins to activate)

### Two Tiers

| Tier | Count | Lifecycle | Examples |
|------|-------|-----------|---------|
| **Core Agents** | 5 | Always active, every request | Scribe, Retriever, Critic, Memorist, Router |
| **Plugin Agents** | 10+ | Installed by user, activated per room | Assessor, Challenger, Clinician, etc. |

---

## 2. Agent Execution Model

### Agent Interface

```typescript
interface Agent {
  id: string;
  name: string;
  type: 'core' | 'plugin';

  /** Execute the agent's logic */
  execute(context: AgentContext): Promise<AgentResult>;

  /** Whether this agent should run for the given request */
  shouldRun(context: AgentContext): boolean;
}

interface AgentContext {
  // Request
  room: ATOMRoom;
  userMessage: string;
  conversationHistory: ATOMMessage[];
  intent?: IntentClassification;

  // Retrieved data (populated by earlier agents)
  retrievedChunks?: ContentChunk[];
  rerankedChunks?: ScoredChunk[];

  // Memory (populated by Memorist pre-read)
  userMemories?: MemoryEntry[];

  // Page context
  topicContext?: ATOMPageContext;

  // Student profile
  studentProfile: StudentProfile;

  // Plugin config
  pluginConfig?: Record<string, unknown>;
}

interface AgentResult {
  /** Text to inject into system prompt / context */
  contextInjection?: string;

  /** Metadata for the response (shown in transparency panel) */
  metadata?: Record<string, unknown>;

  /** Memories to write after generation */
  memoryWrites?: MemoryCandidate[];

  /** SSE events to emit during processing */
  sseEvents?: ATOMSSEEvent[];

  /** Duration in milliseconds */
  durationMs: number;
}
```

### Execution Order

The Gateway orchestrates agents in this fixed order:

```
1. Scribe       → Classify intent, expand query, detect language
2. Retriever    → Hybrid search (vector + FTS) for relevant content
3. Critic       → Rerank retrieved chunks, filter noise
4. Memorist     → Pre-read: fetch relevant memories
5. Router       → Decide which plugins to activate
6. [Plugin 1]   → Plugin-specific processing (e.g., Assessor grades)
7. [Plugin 2]   → Additional plugin processing
8. [Generate]   → Claude API call with assembled context
9. Memorist     → Post-write: extract and persist new memories
```

Steps 1-5 are **always** executed. Steps 6-7 depend on Router's decision. Step 8 is the actual LLM call. Step 9 is async (doesn't block response).

---

## 3. Core Agents

### 3a. Scribe — Intent Detection & Query Expansion

**Purpose:** Understand what the student is asking and prepare the query for retrieval.

**Always runs:** Yes

```typescript
interface ScribeResult extends AgentResult {
  metadata: {
    intent: IntentClassification;
    expandedQuery: string;
    detectedSubject?: string;
    detectedTopic?: string;
    language: 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'ml';
    skipRetrieval: boolean;
  };
}

type IntentClassification =
  | 'learn'       // "Explain portal hypertension"
  | 'practice'    // "Give me MCQs on cardiology"
  | 'review'      // "What did we cover last time?"
  | 'plan'        // "Create a study schedule"
  | 'discuss'     // "What's the debate on laparoscopic vs open?"
  | 'generate'    // "Make flashcards for this topic"
  | 'assess'      // "Grade my answer"
  | 'meta'        // "What are my weak areas?"
  | 'greeting'    // "Hi", "Good morning"
  | 'off_topic';  // Non-medical queries
```

**Intent Detection Prompt:**

```
Classify the student's intent into one of: learn, practice, review, plan,
discuss, generate, assess, meta, greeting, off_topic.

Also extract:
- Subject (if mentioned): anatomy, physiology, pathology, surgery, etc.
- Topic (if specific): portal hypertension, thyroid carcinoma, etc.
- Whether RAG retrieval is needed (skip for greetings, meta, off_topic)

Student message: "{userMessage}"
Room: {room}
```

**Query Expansion:**
- Medical synonym map: `MI → myocardial infarction`, `HTN → hypertension`, `Dx → diagnosis`
- Abbreviation resolution from extensible JSON file
- Add subject context from room/page if not in message

### 3b. Retriever — Content Search

**Purpose:** Find relevant content chunks using hybrid search.

**Always runs:** Yes (unless Scribe sets `skipRetrieval: true`)

```typescript
interface RetrieverResult extends AgentResult {
  metadata: {
    vectorResults: number;
    ftsResults: number;
    mergedResults: number;
    searchQuery: string;
  };
}
```

**Process:**
1. Take Scribe's `expandedQuery`
2. Execute hybrid search (see [RAG Pipeline Spec](./ATOM_RAG_PIPELINE_SPEC.md))
   - Vector search: pgvector cosine similarity, top 15
   - Full-text search: Supabase FTS, top 10
   - Merge: deduplicate, union, cap at 20
3. Apply filters from Scribe's detected subject/topic
4. Emit `atom:source` SSE events for each candidate

### 3c. Critic — Reranking & Quality Filter

**Purpose:** Rerank retrieved chunks using Cohere cross-encoder, filter noise.

**Always runs:** Yes (unless Retriever returned 0 results)

```typescript
interface CriticResult extends AgentResult {
  metadata: {
    inputChunks: number;
    outputChunks: number;
    droppedChunks: number;
    topScore: number;
    cohereFallback: boolean;  // true if Cohere API was unavailable
  };
}
```

**Process:**
1. Take Retriever's merged candidates (up to 20)
2. Call Cohere Rerank API (`rerank-english-v3.0`)
3. Drop chunks below 0.3 relevance threshold
4. Return top 5 chunks, scored and ordered
5. Fallback: if Cohere unavailable, use vector similarity scores

### 3d. Memorist — Memory Read & Write

**Purpose:** Inject relevant memories before generation; extract new memories after.

**Always runs:** Yes

**Two phases:**

#### Pre-Generation Read

```typescript
interface MemoristReadResult extends AgentResult {
  metadata: {
    recentMemories: number;
    semanticMatches: number;
    alwaysIncluded: number;  // weak areas, goals, patterns
    totalTokens: number;
  };
}
```

Process (see [Memory Spec](./ATOM_MEMORY_SPEC.md) for details):
1. Fetch recent memories (last 7 days) for current room
2. Semantic search: embed user message → cosine match top 5 memories
3. Always include: active weak areas, current goals, study patterns
4. Format into memory context block (~2,000 token budget)

#### Post-Generation Write (Async)

After ATOM's response is streamed, Memorist extracts observations:

```
Given this conversation turn, extract any observations about the student:
- New topic mastery indicators
- Weak areas revealed
- Preferences shown (visual, text, examples)
- Goals mentioned
- Clinical connections made
- Study patterns observed

Conversation:
User: {userMessage}
ATOM: {assistantResponse}

Existing memories (avoid duplicates):
{existingMemories}
```

### 3e. Router — Orchestration & Plugin Activation

**Purpose:** Decide which plugin agents to activate based on room, intent, and context.

**Always runs:** Yes

```typescript
interface RouterResult extends AgentResult {
  metadata: {
    activatedPlugins: string[];
    skippedPlugins: string[];
    reason: string;  // human-readable routing explanation
  };
}
```

**Decision Matrix:**

```typescript
function routePlugins(context: AgentContext): string[] {
  const { room, intent, studentProfile } = context;
  const installed = studentProfile.installedPlugins;
  const roomPlugins = installed.filter(p =>
    p.activeInRooms.includes(room)
  );

  // Intent-based filtering
  const activated: string[] = [];

  for (const plugin of roomPlugins) {
    if (shouldActivatePlugin(plugin, intent, room)) {
      activated.push(plugin.pluginId);
    }
  }

  return activated;
}
```

**Room → Plugin Default Map:**

| Room | Default Active Plugins |
|------|----------------------|
| Desk | Cartographer, Analyst |
| Library | Scribe Pro, Cartographer |
| Classroom | Scribe Pro, Challenger |
| Training | Assessor, Challenger, Clinician, Examiner |
| CBME | Curriculum Mapper |
| Common Room | Moderator |
| Arena | Assessor, Analyst |
| Backstage | Analyst, Wellness Coach |
| Studio | All installed plugins |

---

## 4. Plugin Agents

### 4a. Assessor — MCQ Grading & Evaluation

**Skills:**

| Skill | Description | Input | Output |
|-------|-------------|-------|--------|
| `grade_answer` | Grade MCQ with explanation | question, options, selected, correct | score, explanation, concept |
| `detect_bloom` | Bloom's taxonomy level | question text | level (1-6), justification |
| `confidence_score` | Calibrate confidence | answer, confidence% | calibration assessment |

**System Prompt Fragment:**
```
You are the Assessor plugin. When a student answers an MCQ:
1. Confirm if correct/incorrect
2. Explain WHY the correct answer is right (clinical reasoning)
3. Explain WHY each distractor is wrong (common misconceptions)
4. Identify the Bloom's taxonomy level being tested
5. Rate the student's confidence calibration if they provided confidence %
6. Suggest one related concept to review
```

### 4b. Challenger — Question Generation

**Skills:**

| Skill | Description |
|-------|-------------|
| `generate_mcq` | Generate MCQ from topic with specified difficulty |
| `generate_socratic` | Generate Socratic questioning sequence |
| `generate_viva` | Generate viva voce questions |
| `adapt_difficulty` | Adjust question difficulty based on performance |

**System Prompt Fragment:**
```
You are the Challenger plugin. Generate practice questions that:
1. Match the student's current level (use memory of past performance)
2. Target weak areas identified by Memorist
3. Progress through Bloom's levels (start with Remember, move to Analyze)
4. Include clinical scenario questions for higher levels
5. Provide immediate formative feedback
```

### 4c. Cartographer — Knowledge Mapping

**Skills:**

| Skill | Description |
|-------|-------------|
| `build_roadmap` | Generate topic study roadmap |
| `find_prerequisites` | Identify prerequisite topics |
| `knowledge_graph` | Build topic relationship JSON |
| `suggest_next` | Recommend next topic to study |

**System Prompt Fragment:**
```
You are the Cartographer plugin. Map the student's learning journey:
1. Identify prerequisite chains (what must be learned first)
2. Build topic roadmaps with estimated time
3. Generate knowledge graph connections between topics
4. Recommend optimal study order based on prerequisites and exam weightage
```

### 4d. Analyst — Performance Analytics

**Skills:**

| Skill | Description |
|-------|-------------|
| `performance_trends` | Analyze accuracy/speed trends |
| `pattern_detection` | Detect study patterns and habits |
| `ebbinghaus_tracking` | Track forgetting curves per topic |
| `insight_generation` | Generate actionable study insights |

### 4e. Clinician — Clinical Reasoning

**Skills:**

| Skill | Description |
|-------|-------------|
| `build_ddx` | Build differential diagnosis tree |
| `systematic_approach` | Guide systematic clinical approach |
| `algorithm_map` | Map clinical management algorithm |
| `patient_simulator` | Act as attending in patient simulation |

**System Prompt Fragment:**
```
You are the Clinician plugin. Guide clinical reasoning:
1. For case presentations: build DDx tree (most likely → least likely)
2. Ask systematic questions: History → Exam → Investigations → Management
3. Challenge premature closure ("What else could this be?")
4. In Patient Simulator mode: present cases progressively, reveal findings only when asked
5. Map to standard clinical algorithms (ACLS, sepsis bundle, etc.)
```

### 4f. Examiner — Exam Strategy

**Skills:**

| Skill | Description |
|-------|-------------|
| `pyq_patterns` | Analyze previous year question patterns |
| `elimination_coach` | Teach elimination strategy |
| `time_management` | Exam time allocation advice |
| `high_yield_topics` | Identify high-yield topics for specific exam |

### 4g. Scribe Pro — Content Creation

**Skills:**

| Skill | Description |
|-------|-------------|
| `structured_notes` | Generate structured topic notes |
| `create_flashcards` | Create Q&A flashcards (Anki export) |
| `create_summary` | Generate comprehensive summary |
| `create_mnemonic` | Generate mnemonics for lists/sequences |

### 4h. Moderator — Discussion Facilitation

**Skills:**

| Skill | Description |
|-------|-------------|
| `fact_check` | Verify medical claims against sources |
| `debate_structure` | Structure discussion into for/against |
| `evidence_synthesis` | Synthesize evidence from multiple sources |
| `summarize_thread` | Summarize long discussion thread |

### 4i. Wellness Coach — Student Wellbeing

**Skills:**

| Skill | Description |
|-------|-------------|
| `beds_m_checkin` | BEDS-M wellbeing assessment |
| `kolb_guide` | Guide through Kolb's learning cycle |
| `burnout_detect` | Detect burnout indicators from patterns |
| `study_balance` | Recommend study-life balance adjustments |

### 4j. Curriculum Mapper — CBME Tracking

**Skills:**

| Skill | Description |
|-------|-------------|
| `nmc_lookup` | Look up NMC competency codes |
| `domain_tracking` | Track K/KH/SH/P domain progress |
| `competency_report` | Generate competency completion report |
| `phase_progress` | Calculate phase-wise CBME progress |

---

## 5. Skills-as-Markdown

Adapted from OpenClaw's SKILL.md pattern. Plugin system prompts are stored as markdown files.

### File Structure

```
skills/
├── core/
│   ├── scribe/SKILL.md
│   ├── retriever/SKILL.md
│   ├── critic/SKILL.md
│   ├── memorist/SKILL.md
│   └── router/SKILL.md
├── plugins/
│   ├── assessor/SKILL.md
│   ├── challenger/SKILL.md
│   ├── cartographer/SKILL.md
│   ├── analyst/SKILL.md
│   ├── clinician/SKILL.md
│   ├── examiner/SKILL.md
│   ├── scribe-pro/SKILL.md
│   ├── moderator/SKILL.md
│   ├── wellness-coach/SKILL.md
│   └── curriculum-mapper/SKILL.md
└── markethub/
    └── {pluginId}/SKILL.md   ← user-published plugins
```

### SKILL.md Format

```markdown
---
id: nucleux.assessor.v1
name: Assessor
version: 2.1.0
category: evaluation
defaultRooms: [training, arena, studio]
requiredCoreAgents: [scribe, retriever]
permissions: [read_memory, read_mcq_history]
maxPromptTokens: 800
---

## Agent: Assessor

You are ATOM's Assessor — an expert at evaluating student answers
and providing pedagogically sound feedback.

### Core Behaviors
- Grade MCQ answers with detailed explanations
- Identify Bloom's taxonomy level of questions
- Calibrate student confidence

### Skills

#### grade_answer
Input: question, options[], selected, correct
Process:
1. Confirm correct/incorrect
2. Explain correct answer with clinical reasoning
3. Explain why each distractor is wrong
4. Identify the common trap/misconception

#### detect_bloom
Input: question text
Output: Bloom's level (1-6) with justification
```

### Progressive Disclosure

To manage token budget, plugin prompts are loaded in two stages:

1. **Always loaded:** Name + description (from YAML frontmatter) — for Router's decision
2. **Loaded when activated:** Full SKILL.md content — injected into system prompt

### Hot Reload

For development: edit a SKILL.md file → next ATOM request picks up the change. No server restart needed. Core skills are read from filesystem; MarketHub skills from database.

---

## 6. Agent Communication Protocol

### Inter-Agent Data Flow

Agents communicate via the shared `AgentContext` object. Each agent reads from and writes to it:

| Agent | Reads | Writes |
|-------|-------|--------|
| Scribe | `userMessage`, `room` | `intent`, `expandedQuery`, `skipRetrieval` |
| Retriever | `expandedQuery`, `skipRetrieval` | `retrievedChunks` |
| Critic | `retrievedChunks` | `rerankedChunks` |
| Memorist (pre) | `userMessage`, `room` | `userMemories` |
| Router | `intent`, `room`, `installedPlugins` | `activatedPlugins` |
| Plugins | Everything above | `contextInjection`, `memoryWrites` |
| Memorist (post) | `response`, `userMessage` | Memory writes (async) |

### Error Isolation

Each agent is wrapped in a try-catch. If one agent fails:
- Log the error
- Emit `atom:agent` SSE event with `status: 'error'`
- Continue pipeline without that agent's output
- ATOM honestly tells the student if context is limited

---

## 7. Room → Agent Activation Matrix

| Room | Core Agents | Default Plugins | Trigger Conditions |
|------|-------------|-----------------|-------------------|
| **Desk** | All 5 | Cartographer, Analyst | Always on desk load |
| **Library** | All 5 | Scribe Pro, Cartographer | On topic page view |
| **Classroom** | All 5 | Scribe Pro, Challenger | During lecture mode |
| **Training** | All 5 | Assessor, Challenger, Clinician, Examiner | On MCQ attempt |
| **CBME** | All 5 | Curriculum Mapper | On competency view |
| **Common Room** | All 5 | Moderator | On discussion thread |
| **Arena** | All 5 | Assessor, Analyst | During/after competition |
| **Backstage** | All 5 | Analyst, Wellness Coach | On analytics page |
| **Studio** | All 5 | All installed | Always (user's choice) |

---

## 8. Testing Agents

### Unit Test Pattern

```typescript
describe('Scribe Agent', () => {
  it('should classify learn intent', async () => {
    const context = createMockContext({
      userMessage: 'Explain portal hypertension',
      room: 'library',
    });

    const result = await scribeAgent.execute(context);

    expect(result.metadata.intent).toBe('learn');
    expect(result.metadata.expandedQuery).toContain('portal hypertension');
    expect(result.metadata.skipRetrieval).toBe(false);
  });

  it('should skip retrieval for greetings', async () => {
    const context = createMockContext({
      userMessage: 'Hi ATOM!',
      room: 'desk',
    });

    const result = await scribeAgent.execute(context);

    expect(result.metadata.intent).toBe('greeting');
    expect(result.metadata.skipRetrieval).toBe(true);
  });
});
```

### Mock Context Helper

```typescript
function createMockContext(overrides: Partial<AgentContext>): AgentContext {
  return {
    room: 'studio',
    userMessage: 'test message',
    conversationHistory: [],
    studentProfile: {
      id: 'test-user',
      name: 'Test Student',
      examTarget: 'NEET-PG',
      installedPlugins: [],
    },
    ...overrides,
  };
}
```

### Evaluation Criteria Per Agent

| Agent | Metric | Target |
|-------|--------|--------|
| Scribe | Intent classification accuracy | >95% on test set |
| Retriever | Relevant chunks in top 5 | >80% recall |
| Critic | Noise removal rate | >90% irrelevant chunks filtered |
| Memorist | Memory extraction quality | Manual review quarterly |
| Router | Plugin activation accuracy | >95% (correct plugins for intent+room) |

---

## 9. Cross-References

- **Gateway orchestration** → [ATOM_GATEWAY_SPEC.md](./ATOM_GATEWAY_SPEC.md)
- **RAG search used by Retriever** → [ATOM_RAG_PIPELINE_SPEC.md](./ATOM_RAG_PIPELINE_SPEC.md)
- **Memory system used by Memorist** → [ATOM_MEMORY_SPEC.md](./ATOM_MEMORY_SPEC.md)
- **Plugin marketplace** → [ATOM_MARKETHUB_SPEC.md](./ATOM_MARKETHUB_SPEC.md)
- **Frontend agent visualization** → [ATOM_FRONTEND_SPEC.md](./ATOM_FRONTEND_SPEC.md)
- **Room system prompts** → [ATOM_V2_BACKEND.md](../ATOM_V2_BACKEND.md)

---

*ATOM Agents Spec · NucleuX Academy · Last updated: 2026-02-22*
