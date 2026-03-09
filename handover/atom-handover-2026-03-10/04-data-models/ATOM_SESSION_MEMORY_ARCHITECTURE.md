---
title: "Atom Session Memory Architecture"
summary: "Session-memory architecture and storage model."
audience: "engineer"
status: "implemented"
source_path: "docs/specs/atom-session-memory/ATOM_SESSION_MEMORY_ARCHITECTURE.md"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "A/B/C/D/E"
llm_handover_relevance: "high"
---

# ATOM Session + Memory Architecture Blueprint

**Author:** Narasimha  
**Date:** 2026-03-08  
**Status:** Draft for implementation (production-oriented)  
**Audience:** Sarath, core ATOM engineering contributors

---

## 1) Executive summary

ATOM currently has a polished direction but unstable continuity in the simplified `/atom` chat path. The key failure modes observed in production-like usage were:

1. **Stateless follow-ups** (`continue` drifting off-topic)
2. **Long-response truncation** without deterministic resume
3. **Weak source grounding determinism** (book selection not always enforced)
4. **UI/UX mismatch** between conversational expectation and backend memory model

This blueprint defines a robust architecture inspired by OpenClaw session/memory concepts:

- durable **session store** + **append-only transcript**
- strict split between **context** and **memory**
- **continuation cursors** for long outputs
- source-grounded, per-book retrieval constraints
- compaction/pruning design that preserves user continuity

Goal: ATOM should behave like a high-end chat system (ChatGPT/Gemini/Claude UX) with medically reliable, source-aware continuity.

---

## 2) Design principles

1. **Session-first continuity**  
   Every conversation turn belongs to a durable `session_id`.

2. **Transcript is source of truth**  
   Reconstruct model context from persisted turns, not fragile frontend state.

3. **Memory is explicit and layered**  
   - Short-term: session turns + summaries
   - Long-term: curated profile/preferences, optional learning memory

4. **Resume must be deterministic**  
   `continue` should resume the previous response, not reinterpret user intent.

5. **Grounding policy is enforceable**  
   If selected books cannot support answer, ATOM must say so clearly.

6. **Safety over novelty**  
   Keep `/atom` usable at all times; no large risky rewrites in one shot.

---

## 3) Conceptual model

### 3.1 Context vs Memory

- **Context**: prompt payload assembled for current model call (bounded by context window)
- **Session memory**: persisted thread transcript + checkpoints used to rebuild context
- **Long-term memory**: durable, cross-session facts/preferences (optional phase)

### 3.2 Session identity

A user-visible thread maps to exactly one active `session_id` until reset/branch.

`thread_id -> session_id (active)`

Reset creates new session; old session remains auditable.

### 3.3 Turn lifecycle

1. User sends message
2. Message appended as `role=user` turn
3. Retrieval executed with session+book constraints
4. Model streams response
5. Stream captured as assistant turn (with citations + metadata)
6. Optional continuation cursor updated
7. Session state updated (`last_user_query`, `last_heading`, status)

---

## 4) Target data model

## 4.1 `atom_sessions`

Purpose: fast mutable session state for orchestration + recovery.

```sql
create table atom_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  thread_id text not null,
  room_id text not null default 'atom',
  status text not null default 'active',
  selected_book_ids jsonb not null default '[]'::jsonb,
  source_policy jsonb not null default '{}'::jsonb,
  last_user_query text,
  last_assistant_heading text,
  continuation_cursor jsonb not null default '{}'::jsonb,
  retrieval_profile jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index atom_sessions_user_thread_idx on atom_sessions(user_id, thread_id);
create index atom_sessions_user_updated_idx on atom_sessions(user_id, updated_at desc);
```

## 4.2 `atom_session_messages`

Purpose: append-only transcript to reconstruct context and support audits.

```sql
create table atom_session_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references atom_sessions(id) on delete cascade,
  turn_index bigint not null,
  role text not null check (role in ('system','user','assistant','tool')),
  content_md text not null,
  citations jsonb not null default '[]'::jsonb,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(session_id, turn_index)
);

create index atom_session_messages_session_turn_idx on atom_session_messages(session_id, turn_index desc);
```

## 4.3 `atom_session_summaries`

Purpose: compaction artifacts preserving continuity while reducing prompt size.

```sql
create table atom_session_summaries (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references atom_sessions(id) on delete cascade,
  from_turn bigint not null,
  to_turn bigint not null,
  summary_md text not null,
  trigger text not null check (trigger in ('manual','auto')),
  created_at timestamptz not null default now()
);

create index atom_session_summaries_session_idx on atom_session_summaries(session_id, created_at desc);
```

## 4.4 (optional phase) `atom_memory_facts`

Purpose: curated, cross-session durable memory (preferences, learning status).

---

## 5) API contract (v1)

## 5.1 `POST /api/atom/session/start`

Creates or resumes a session for `(user_id, thread_id)`.

### Request
```json
{
  "threadId": "thread-xyz",
  "roomId": "atom",
  "selectedBookIds": ["sabiston-textbook-of-surgery"],
  "sourcePolicy": {
    "strict": true
  }
}
```

### Response
```json
{
  "sessionId": "uuid",
  "threadId": "thread-xyz",
  "status": "active"
}
```

## 5.2 `GET /api/atom/session/:id`

Returns session metadata + recent transcript window.

## 5.3 `POST /api/atom/session/:id/message`

Primary chat endpoint (streaming enabled).

### Request
```json
{
  "message": "Explain trauma chapters in Sabiston",
  "stream": true,
  "mode": "chat"
}
```

### Streaming events (SSE)
- `message.start`
- `retrieval.scope`
- `assistant.delta`
- `assistant.complete`
- `citations`
- `error`

## 5.4 `POST /api/atom/session/:id/continue`

Deterministic continuation endpoint.

### Behavior
- Uses `continuation_cursor` and latest assistant turn
- Reuses last meaningful user query for retrieval
- Adds hard instruction: continue same output sequence/topic

## 5.5 `POST /api/atom/session/:id/reset`

Starts a new session for same thread (soft archive old).

---

## 6) Prompt assembly strategy

Prompt input order:

1. system base policy (ATOM behavior + medical safety)
2. selected-book source policy (strict/lenient)
3. latest compaction summary (if exists)
4. recent turns (windowed)
5. retrieval snippets (book-constrained)
6. current user turn

Rules:
- preserve identifiers (chapter names, headings)
- enforce citation-friendly answer structure
- continuation requests must maintain prior answer trajectory

---

## 7) Retrieval and source-grounding model

## 7.1 Problem in current approach

Current source routing relies too much on filename keyword overlap; selected-book IDs may not map deterministically to content paths.

## 7.2 Proposed fix

Introduce **book scope map**:

`book_id -> [content path prefixes | catalog refs | embedding namespaces]`

Example:
- `sabiston-textbook-of-surgery` -> `content/surgery/**` + mapped chapter corpus index

Retrieval pipeline:
1. constrain candidates by selected book scopes
2. retrieve top K by semantic + lexical hybrid ranking
3. if strict mode and no evidence, return insufficiency response

## 7.3 Response policy

When strict grounding enabled:
- ATOM must mention evidence origin
- if insufficient scope evidence, explicitly state limitation
- no silent fallback to unrelated books

---

## 8) Continuation/resume architecture

## 8.1 Continuation cursor schema (JSON)

```json
{
  "lastTurnIndex": 42,
  "lastHeading": "Damage Control Surgery",
  "lastOutlineItem": "Slide 8",
  "expectedFormat": "slide-deck",
  "streamCutoffDetected": true
}
```

## 8.2 Resume rules

On `continue`:
1. identify latest assistant turn + cursor
2. detect format (deck/notes/list)
3. continue from next missing segment
4. prohibit topic switches unless user explicitly changes topic

---

## 9) Compaction + pruning strategy for ATOM

## 9.1 Pruning (transient)
- trim large tool outputs from model context
- never mutate transcript history

## 9.2 Compaction (persistent)
- summarize older turns into `atom_session_summaries`
- retain recent raw turns + summary anchor
- run when token threshold crossed

## 9.3 Pre-compaction memory flush
- before compaction, write durable summary/checkpoints
- no user-visible noise unless requested

---

## 10) UI/UX integration plan

Keep center chat simple and premium; backend does heavy lifting.

## Must-have UI states
- Active session badge
- Grounding status (`strict`/`lenient`)
- Sources in scope count
- Continue button/state
- Error state with actionable text

## Left pane contract
- Top: threads (each maps to session)
- Bottom: sources (selected books define retrieval scope)

---

## 11) Overnight autopilot architecture (orchestrator)

The orchestrator should:
1. inspect active sessions + blockers
2. run scoped tasks via isolated runs/sub-agents
3. validate outputs (tsc/build/smoke)
4. commit + push if safe
5. report done/in-progress/blocker/next

QA nudge agent should:
- run scheduled audits on continuity + grounding + deploy correctness
- trigger corrective tasks if regressions detected

---

## 12) Rollout phases

## Phase A (tonight)
- session tables + message persistence
- `/session/start`, `/session/:id/message`, `/continue`
- frontend thread-session binding

## Phase B
- deterministic book scope map
- strict citation + insufficiency policy
- continuation cursor stabilization

## Phase C
- compaction + pruning + pre-compaction checkpoint writes
- long-term memory layer (optional)

## Phase D
- analytics: drift rate, continuation success, grounding precision
- operator dashboards

---

## 13) Acceptance criteria

1. `continue` after long response resumes same topic >95% cases
2. selected-book strict mode blocks unsupported claims
3. reload/page reopen preserves thread continuity
4. long sessions remain usable under compaction pressure
5. no regressions to baseline `/atom` usability

---

## 14) Risks and mitigations

1. **Token blowup from raw history**  
   Mitigation: summary checkpoints + bounded recent window

2. **False strict-grounding negatives**  
   Mitigation: broaden scoped retrieval before insufficiency return

3. **DB migration drift**  
   Mitigation: additive migrations + fallback-safe code paths

4. **UI/backend contract mismatch**  
   Mitigation: typed DTOs and one adapter layer

---

## 15) Immediate engineering checklist

- [ ] Add migration for `atom_sessions`
- [ ] Add migration for `atom_session_messages`
- [ ] Add migration for `atom_session_summaries`
- [ ] Implement session repository layer
- [ ] Implement `POST /api/atom/session/start`
- [ ] Implement `POST /api/atom/session/:id/message` SSE
- [ ] Implement `POST /api/atom/session/:id/continue`
- [ ] Bind UI thread -> session lifecycle
- [ ] Add grounding diagnostics in response metadata
- [ ] Add canary tests for continuation + strict source mode

---

## 16) Final recommendation

Adopt this session-memory architecture before adding additional ATOM modes.  
Without durable session semantics, UX polish will continue to break under real clinical usage patterns.

This blueprint is intentionally implementation-biased so it can be executed incrementally without destabilizing production.
