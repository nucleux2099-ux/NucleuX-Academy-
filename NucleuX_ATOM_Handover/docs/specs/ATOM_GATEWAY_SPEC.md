# ATOM Gateway — Orchestration Layer Specification

> **Layer 1 of 5** | Part of the [ATOM v2 Backend Architecture](../ATOM_V2_BACKEND.md)
> Inspired by [OpenClaw's Gateway Pattern](https://openclaw.ai/) — a single orchestration process that sits between the AI model and the outside world.

---

## Overview

The ATOM Gateway is the single entry point for every AI interaction in NucleuX Academy. It replaces the current naive `POST /api/chat` endpoint with a sophisticated orchestration layer that:

1. **Authenticates** the student (Supabase JWT)
2. **Resolves** the session (room, conversation, context)
3. **Queues** the request (Lane Queue — serial per session)
4. **Orchestrates** core agents (Scribe → Memorist → Router)
5. **Executes** the selected pipeline (retrieval → rerank → generate)
6. **Streams** the response (SSE via Anthropic SDK)
7. **Persists** post-generation state (conversation + memory writes)

Think of it as OpenClaw's Gateway adapted for a Next.js API route — no separate daemon process, but the same architectural discipline.

---

## Request Lifecycle

```
Student clicks "Send" in any ATOM interface
    │
    ▼
┌─────────────────────────────────────────────────────────────────┐
│  Phase 1: AUTHENTICATE                                          │
│  • Extract Supabase JWT from request headers                    │
│  • Validate session via createServerClient()                    │
│  • Load student profile (level, exam target, preferences)       │
│  • Reject if unauthenticated → 401                              │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Phase 2: SESSION RESOLVE                                       │
│  • Parse room from request body                                 │
│  • Generate session key: user:{uid}:room:{roomId}               │
│  • Load or create conversation (conversationId)                 │
│  • Load room-specific system prompt                             │
│  • Load active plugins for this room + user                     │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Phase 3: LANE QUEUE                                            │
│  • Check if this session has an in-flight request               │
│  • If busy → queue this request (max queue depth: 3)            │
│  • If idle → proceed immediately                                │
│  • Prevents race conditions on same conversation                │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Phase 4: AGENT ORCHESTRATION                                   │
│  • Invoke Scribe → intent detection + query expansion           │
│  • Invoke Memorist → read relevant user memories                │
│  • Invoke Router → decide pipeline + plugins to activate        │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Phase 5: PIPELINE EXECUTION                                    │
│  • If retrieval needed:                                         │
│    Retriever (hybrid search) → Critic (rerank) → assemble       │
│  • If plugins activated:                                        │
│    Execute plugin agents → collect context injections            │
│  • Assemble full context (prompt layers + memory + chunks)      │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Phase 6: GENERATION (Claude Sonnet via Anthropic SDK)          │
│  • Stream response via SSE                                      │
│  • Client receives real-time text chunks                        │
│  • Handle abort signal from client                              │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Phase 7: POST-GENERATION PERSIST                               │
│  • Memorist extracts new observations from conversation         │
│  • Save conversation to atom_conversations table                │
│  • Update session state                                         │
│  • Release Lane Queue slot                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Session Management (Adapted Lane Queue)

OpenClaw's Lane Queue enforces **per-session serial execution** — one request at a time per user-room pair. This prevents:
- Race conditions on conversation history
- Duplicate memory writes
- Conflicting agent executions

### Session Key Format

```typescript
type SessionKey = `user:${string}:room:${RoomId}`;

// Examples:
// "user:abc123:room:library"
// "user:abc123:room:training"
// "user:abc123:room:studio"
```

A student can have **concurrent sessions across different rooms** (e.g., Library + Training Centre open in different tabs), but each room's session processes messages **serially**.

### Session State Machine

```
                ┌──────────┐
                │   IDLE   │ ← Ready for new request
                └────┬─────┘
                     │ Request arrives
                     ▼
                ┌──────────────┐
                │  PROCESSING  │ ← Agents executing (Scribe → Memorist → Router)
                └──────┬───────┘
                       │ Pipeline complete, start streaming
                       ▼
                ┌──────────────┐
                │  STREAMING   │ ← Claude generating, SSE active
                └──────┬───────┘
                       │ Stream complete or aborted
                       ▼
                ┌──────────────┐
                │  PERSISTING  │ ← Writing conversation + memory
                └──────┬───────┘
                       │ Done
                       ▼
                ┌──────────┐
                │   IDLE   │
                └──────────┘
```

### Lane Queue Implementation

```typescript
// In-memory queue per session (lives in the API route's module scope)
const sessionQueues = new Map<SessionKey, Promise<void>>();

async function enqueueRequest(
  sessionKey: SessionKey,
  handler: () => Promise<void>
): Promise<void> {
  const currentQueue = sessionQueues.get(sessionKey) ?? Promise.resolve();

  const newQueue = currentQueue.then(handler).catch((err) => {
    console.error(`[Gateway] Session ${sessionKey} error:`, err);
  });

  sessionQueues.set(sessionKey, newQueue);
  await newQueue;

  // Clean up completed sessions
  if (sessionQueues.get(sessionKey) === newQueue) {
    sessionQueues.delete(sessionKey);
  }
}
```

> **Scaling note:** In a single Next.js server instance, this in-memory Map works. For multi-instance deployments, use Supabase advisory locks or a Redis-based queue.

---

## System Prompt Composition

Inspired by OpenClaw's layered prompt assembly (`AGENTS.md` + `SOUL.md` + `TOOLS.md` + dynamic context), ATOM composes its system prompt from 7 layers in strict priority order:

```
┌─────────────────────────────────────────────────┐
│  Layer 1: ATOM_BASE_PROMPT                      │  ~500 tokens
│  Identity, principles, rules                     │
├─────────────────────────────────────────────────┤
│  Layer 2: ROOM_PROMPT                            │  ~300 tokens
│  Room-specific mode, behaviors, active agents    │
├─────────────────────────────────────────────────┤
│  Layer 3: PLUGIN_PROMPTS (concatenated)          │  ~200 tokens per plugin
│  Active plugin system prompt fragments           │
├─────────────────────────────────────────────────┤
│  Layer 4: MEMORY_CONTEXT                         │  ~2,000 tokens
│  Student profile + relevant memories             │
├─────────────────────────────────────────────────┤
│  Layer 5: RETRIEVED_CHUNKS                       │  ~10,000 tokens
│  Top 5 reranked content chunks                   │
├─────────────────────────────────────────────────┤
│  Layer 6: PAGE_CONTEXT                           │  ~500 tokens
│  Current topic, view mode, desk sources          │
├─────────────────────────────────────────────────┤
│  Layer 7: CONVERSATION_HISTORY                   │  ~30,000 tokens
│  Previous messages in this conversation          │
└─────────────────────────────────────────────────┘

Total budget: ~50,000 tokens (Claude Sonnet context)
Generation budget: ~5,000 tokens (max_tokens)
```

### Token Budget Allocation

| Layer | Budget | Priority | Truncation Strategy |
|-------|--------|----------|---------------------|
| Base Prompt | 500 | Never truncated | — |
| Room Prompt | 300 | Never truncated | — |
| Plugin Prompts | 200 × n | Drop lowest-priority plugins | By plugin priority score |
| Memory Context | 2,000 | Reduce to top 3 memories | By relevance_score |
| Retrieved Chunks | 10,000 | Reduce to top 3 chunks | By reranking score |
| Page Context | 500 | Drop optional fields | Keep topic_slug, drop metadata |
| Conversation History | 30,000 | Summarize older messages | Compaction (see Memory Spec) |

### Prompt Assembly Function

```typescript
interface PromptLayers {
  basePrompt: string;
  roomPrompt: string;
  pluginPrompts: string[];
  memoryContext: string;
  retrievedChunks: ContentChunk[];
  pageContext: PageContext;
}

function assembleSystemPrompt(layers: PromptLayers): string {
  const parts: string[] = [];

  // Layer 1: Identity (always included)
  parts.push(layers.basePrompt);

  // Layer 2: Room mode (always included)
  parts.push(layers.roomPrompt);

  // Layer 3: Active plugins (budget-limited)
  if (layers.pluginPrompts.length > 0) {
    parts.push('## Active Plugins\n' + layers.pluginPrompts.join('\n\n'));
  }

  // Layer 4: Memory (budget-limited)
  if (layers.memoryContext) {
    parts.push('## Student Memory\n' + layers.memoryContext);
  }

  // Layer 5: Retrieved content (budget-limited)
  if (layers.retrievedChunks.length > 0) {
    const chunkText = layers.retrievedChunks
      .map((c, i) => `### Source ${i + 1}: ${c.topicSlug} (${c.sourceFile})\n${c.content}`)
      .join('\n\n');
    parts.push('## Library Content\n' + chunkText);
  }

  // Layer 6: Page context
  if (layers.pageContext.topicSlug) {
    parts.push(`## Current Context\nStudent is viewing: ${layers.pageContext.topicSlug}`);
  }

  return parts.join('\n\n---\n\n');
}
```

---

## Heartbeat & Proactivity

Adapted from OpenClaw's `HEARTBEAT.md` pattern — a background check that generates proactive insights for students.

### How It Works

OpenClaw runs a daemon with a configurable heartbeat interval. In NucleuX (serverless Next.js), we adapt this using **Supabase Edge Functions** on a cron schedule + **Supabase Realtime** for delivery.

```
┌──────────────────────────────────────────────────┐
│  Supabase Edge Function (cron: every 30 min)     │
│                                                   │
│  For each active student:                        │
│  1. Check spaced repetition due items            │
│  2. Check streak status (about to break?)        │
│  3. Check exam countdown milestones              │
│  4. Check weak areas with decaying memory        │
│  5. Check study pattern anomalies                │
│                                                   │
│  If insight found:                               │
│  → Insert into atom_proactive_insights table     │
│  → Supabase Realtime broadcasts to client        │
│                                                   │
│  Client receives:                                │
│  → Toast notification + widget badge update      │
└──────────────────────────────────────────────────┘
```

### Proactive Insight Types

| Type | Trigger | Example Message |
|------|---------|-----------------|
| `spaced_repetition_due` | Cards due for review today | "You have 12 Anatomy cards due — 5 min review keeps the Ebbinghaus curve flat" |
| `streak_warning` | No study activity today, streak > 3 | "Your 7-day streak is at risk! Quick 10-min session saves it" |
| `exam_countdown` | Milestone days (30d, 7d, 1d) | "30 days to NEET-PG. Your Surgery is strong but Pharmacology needs 2 more hours" |
| `weak_area_alert` | Accuracy < 50% in recent attempts | "Your Acid-Base Physiology accuracy dropped to 40%. Want to review?" |
| `study_tip` | Pattern detected in study behavior | "You're most productive 9-11 PM. Try scheduling hard topics there" |
| `memory_insight` | Interesting observation from Memorist | "You've mastered 80% of Cardiac Physiology — time to connect it to Pharmacology" |

### Proactive Insights Table

```sql
CREATE TABLE atom_proactive_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,               -- deep link (e.g., "/library/anatomy/cardiac")
  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_insights_user ON atom_proactive_insights(user_id, is_read);
ALTER TABLE atom_proactive_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own insights" ON atom_proactive_insights
  FOR ALL USING (auth.uid() = user_id);
```

---

## Error Handling & Graceful Degradation

The Gateway follows a **progressive fallback** strategy — if a non-critical component fails, ATOM still responds (just with less context).

| Component | Failure Mode | Fallback | User Impact |
|-----------|-------------|----------|-------------|
| **Supabase Auth** | JWT invalid/expired | Return 401 | Must re-login |
| **Scribe** (query expansion) | LLM call fails | Use raw query as-is | Slightly less precise retrieval |
| **Retriever** (vector search) | pgvector/FTS error | Fall back to v1 keyword search | Reduced relevance |
| **Critic** (Cohere rerank) | API timeout/error | Use vector similarity scores as ranking | Slightly less precise |
| **Memorist** (memory read) | DB query fails | Proceed without memory context | No personalization |
| **Router** (pipeline selection) | Decision error | Use default pipeline for room | Correct but not optimized |
| **Plugin** (any plugin agent) | Execution error | Skip plugin, log error | Missing plugin feature |
| **Claude** (generation) | Anthropic API error | Return error message | No response — show retry button |
| **Persist** (conversation save) | DB write error | Log error, response already sent | Conversation not saved (retry on next request) |

### Error Response Format

```typescript
// SSE error event (sent alongside or instead of text)
interface ATOMErrorEvent {
  type: 'error';
  code: 'AUTH_FAILED' | 'RATE_LIMITED' | 'GENERATION_FAILED' | 'PARTIAL_DEGRADATION';
  message: string;
  degraded?: string[];  // list of components that failed gracefully
}

// Example: Critic failed but everything else works
// data: {"type":"error","code":"PARTIAL_DEGRADATION","degraded":["critic"],"message":"Reranking unavailable — using similarity scores instead"}
```

---

## TypeScript Interfaces

### Request

```typescript
interface ATOMRequest {
  messages: ATOMMessage[];
  room: RoomId;
  conversationId?: string;
  context?: ATOMPageContext;
}

interface ATOMMessage {
  role: 'user' | 'assistant';
  content: string | ATOMMultimodalContent[];
}

interface ATOMMultimodalContent {
  type: 'text' | 'image';
  text?: string;
  imageUrl?: string;
  mediaType?: 'image/jpeg' | 'image/png' | 'image/webp';
}

type RoomId =
  | 'desk'
  | 'library'
  | 'classroom'
  | 'training'
  | 'cbme'
  | 'community'
  | 'arena'
  | 'backstage'
  | 'studio';

interface ATOMPageContext {
  topicSlug?: string;
  subjectId?: string;
  viewMode?: 'explorer' | 'exam-prep' | 'textbook' | 'quiz' | 'cases' | 'roadmap';
  deskSources?: string[];
  cbmeCode?: string;
  mcqId?: string;
  caseId?: string;
}
```

### Response (SSE Events)

```typescript
// Text chunk
interface ATOMTextEvent {
  type: 'text';
  text: string;
}

// Agent status update (for transparency panel)
interface ATOMAgentEvent {
  type: 'agent_status';
  agent: string;        // "scribe", "retriever", "critic", "memorist", "router", plugin IDs
  status: 'thinking' | 'done' | 'skipped' | 'error';
  metadata?: Record<string, unknown>;
}

// Source attribution (after retrieval)
interface ATOMSourceEvent {
  type: 'sources';
  chunks: {
    topicSlug: string;
    sourceFile: string;
    relevanceScore: number;
    preview: string;     // first 100 chars of chunk
  }[];
}

// Memory reference (when ATOM uses a memory)
interface ATOMMemoryEvent {
  type: 'memory_used';
  memoryId: string;
  memoryType: string;
  preview: string;
}

// Stream complete
interface ATOMDoneEvent {
  type: 'done';
  conversationId: string;
  tokensUsed: number;
  agentsSummary: Record<string, 'done' | 'skipped' | 'error'>;
}

// Error
interface ATOMErrorEvent {
  type: 'error';
  code: string;
  message: string;
  degraded?: string[];
}

// Union type for all SSE events
type ATOMSSEEvent =
  | ATOMTextEvent
  | ATOMAgentEvent
  | ATOMSourceEvent
  | ATOMMemoryEvent
  | ATOMDoneEvent
  | ATOMErrorEvent;
```

### Gateway Config

```typescript
interface GatewayConfig {
  model: string;                    // "claude-sonnet-4-20250514"
  maxTokens: number;                // 5000
  temperature: number;              // 0.7
  tokenBudget: {
    systemPrompts: number;          // 3000
    memory: number;                 // 2000
    retrievedChunks: number;        // 10000
    conversationHistory: number;    // 30000
    generation: number;             // 5000
  };
  laneQueue: {
    maxQueueDepth: number;          // 3
    requestTimeoutMs: number;       // 60000
  };
  heartbeat: {
    enabled: boolean;
    intervalMinutes: number;        // 30
    checks: HeartbeatCheck[];
  };
}

interface HeartbeatCheck {
  type: 'spaced_repetition_due' | 'streak_warning' | 'exam_countdown' | 'weak_area_alert' | 'study_tip' | 'memory_insight';
  enabled: boolean;
  thresholds?: Record<string, number>;
}
```

### Session State

```typescript
interface SessionState {
  key: SessionKey;
  userId: string;
  room: RoomId;
  conversationId: string;
  status: 'idle' | 'processing' | 'streaming' | 'persisting';
  studentProfile: StudentProfile;
  activePlugins: string[];
  startedAt: Date;
  lastActivityAt: Date;
}

interface StudentProfile {
  id: string;
  username: string;
  level: 'mbbs_1' | 'mbbs_2' | 'mbbs_3' | 'mbbs_4' | 'intern' | 'pg_prep' | 'pg' | 'ss';
  targetExam?: string;            // "NEET-PG", "INICET", "USMLE Step 1"
  targetDate?: string;
  strongSubjects: string[];
  weakSubjects: string[];
  preferences: {
    atomProactive: boolean;
    preferredStudyTime?: string;
    dailyGoalMinutes: number;
  };
}
```

---

## API Route Implementation

### File: `src/app/api/atom/chat/route.ts`

```typescript
// Simplified structure — full implementation in code, not docs

import { createServerClient } from '@/lib/supabase/server';
import { Anthropic } from '@anthropic-ai/sdk';
import { gateway } from '@/lib/atom/gateway';

export async function POST(request: Request) {
  // Phase 1: Authenticate
  const supabase = await createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Parse request
  const body: ATOMRequest = await request.json();

  // Phase 2-7: Gateway handles everything
  const stream = await gateway.process({
    userId: user.id,
    room: body.room,
    messages: body.messages,
    conversationId: body.conversationId,
    context: body.context,
    signal: request.signal,
  });

  // Return SSE stream
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

### Middleware Chain

The Gateway internally runs a middleware chain:

```typescript
const middlewares = [
  authMiddleware,          // validate JWT, load profile
  sessionMiddleware,       // resolve session, load conversation
  laneQueueMiddleware,     // enforce serial execution
  agentOrchestrator,       // run Scribe → Memorist → Router
  pipelineExecutor,        // run Retriever → Critic → Plugins
  contextAssembler,        // build full system prompt
  generator,               // Claude streaming
  persistMiddleware,       // save conversation + memory
];
```

---

## Migration from v1

### Phase 1: Parallel Routes (Backward Compatible)

```
/api/chat          → v1 (existing, unchanged)
/api/atom/chat     → v2 (new Gateway)
```

- Frontend components updated one by one to use `/api/atom/chat`
- `AtomWidget.tsx` → first to migrate (add room parameter)
- `/chat` page → second (add conversationId support)
- `AtomLibrarian.tsx` → third (add topic context)

### Phase 2: Feature Flag Rollout

```typescript
// Feature flag in user_preferences
const useAtomV2 = user.preferences.atom_v2_enabled ?? false;

// In AtomWidget.tsx
const apiEndpoint = useAtomV2 ? '/api/atom/chat' : '/api/chat';
```

### Phase 3: Deprecation

- After 2 weeks of v2 running stable, redirect `/api/chat` → `/api/atom/chat`
- After 4 weeks, remove old endpoint

---

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `ANTHROPIC_API_KEY` | Yes | Claude Sonnet for generation |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-side Supabase operations |
| `COHERE_API_KEY` | Yes (v2) | Cohere Rerank API |
| `ATOM_EMBED_SECRET` | Admin only | Trigger re-embedding endpoint |

---

## Cross-References

- **RAG Pipeline details** → [ATOM_RAG_PIPELINE_SPEC.md](./ATOM_RAG_PIPELINE_SPEC.md)
- **Memory system details** → [ATOM_MEMORY_SPEC.md](./ATOM_MEMORY_SPEC.md)
- **Agent specifications** → [ATOM_AGENTS_SPEC.md](./ATOM_AGENTS_SPEC.md)
- **Plugin marketplace** → [ATOM_MARKETHUB_SPEC.md](./ATOM_MARKETHUB_SPEC.md)
- **Frontend/UI architecture** → [ATOM_FRONTEND_SPEC.md](./ATOM_FRONTEND_SPEC.md)
- **Room system prompts** → [ATOM_V2_BACKEND.md](../ATOM_V2_BACKEND.md#room-system-prompts)
- **Existing chat spec** → [ATOM_CHAT_SPEC.md](./ATOM_CHAT_SPEC.md)
