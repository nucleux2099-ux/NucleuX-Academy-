---
title: "Atom V2 Orchestrator Rfc"
summary: "Orchestrator RFC context for architecture decisions."
audience: "engineer"
status: "partial"
source_path: "docs/specs/ATOM_V2_ORCHESTRATOR_RFC.md"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "A/B"
llm_handover_relevance: "medium"
---

# ATOM v2 RFC — Orchestrator + Event Bus Rebuild

- **Owner:** Sarath + NucleuX team
- **Author:** Narasimha
- **Date:** 2026-03-08
- **Status:** Draft for implementation
- **Decision:** **Option B (Orchestrator + Event Bus)**

---

## 1) Problem Statement

Current ATOM UX is good for short chat but weak for long-running tasks:
- No codex/claude-style step visibility
- Limited resumability/retry semantics
- Artifacts (code/tables/notes) are not first-class persisted outputs
- Source selection is not modeled as a durable task input

We need a full ATOM workspace rebuild with:
1. Real-time process visibility
2. Deterministic task lifecycle
3. Structured artifacts and canvas
4. Dynamic 26-book source selection with level-aware filtering

---

## 2) Goals / Non-goals

### Goals
- Build long-task architecture with evented orchestration
- Keep short-chat latency fast (hybrid path)
- Support Stop/Retry/Continue/Branch controls
- Persist task events + artifacts for replay/audit
- Provide left-pane dynamic source library (26 books) with filters/presets
- Full-focus ATOM workspace UX with pane transitions

### Non-goals (v1)
- Multi-user collaborative editing in same task
- Full websocket infra (SSE first)
- Arbitrary code execution sandbox (view-first canvas in v1)

---

## 3) Final Architecture (Hybrid)

### 3.1 Modes
1. **Quick mode** (simple prompts):
   - Existing direct stream path
   - Low overhead

2. **Task mode** (long/complex):
   - `POST /api/atom/tasks` creates task
   - Orchestrator worker executes phase graph
   - `GET /api/atom/tasks/:id/events` streams structured SSE events
   - Artifacts persisted and shown in right canvas pane

### 3.2 Components
- **API Gateway**: request validation/auth/routing
- **Task Orchestrator**: phase execution + checkpointing
- **Event Store**: ordered task events
- **Artifact Store**: code/tables/notes/citations/outline
- **SSE Streamer**: replay+tail event delivery
- **UI Workspace**: left sources / center process / right artifacts

---

## 4) Data Model (Supabase/Postgres)

## 4.1 `atom_tasks`
- `id uuid pk`
- `user_id uuid not null`
- `status text check (queued|running|needs_input|completed|failed|cancelled)`
- `mode text check (quick|task)`
- `title text`
- `input_message text not null`
- `source_snapshot jsonb not null`  -- selected books/filters at task start
- `current_phase text`
- `error_code text`
- `error_message text`
- `created_at timestamptz default now()`
- `started_at timestamptz`
- `completed_at timestamptz`

Indexes:
- `(user_id, created_at desc)`
- `(status, created_at desc)`

## 4.2 `atom_task_events`
- `id bigserial pk`
- `task_id uuid references atom_tasks(id) on delete cascade`
- `seq int not null` (monotonic per task)
- `type text not null`
- `payload jsonb not null`
- `created_at timestamptz default now()`

Constraints/indexes:
- unique `(task_id, seq)`
- index `(task_id, id)`

## 4.3 `atom_task_artifacts`
- `id uuid pk`
- `task_id uuid references atom_tasks(id) on delete cascade`
- `kind text check (code|table|notes|citations|outline|mindmap|file)`
- `title text`
- `content jsonb not null`
- `version int default 1`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Indexes:
- `(task_id, kind, updated_at desc)`

## 4.4 `atom_task_checkpoints`
- `id uuid pk`
- `task_id uuid references atom_tasks(id) on delete cascade`
- `phase text not null`
- `state jsonb not null`
- `created_at timestamptz default now()`

---

## 5) Event Contract (SSE)

All events include:
```json
{
  "eventId": 102,
  "taskId": "uuid",
  "type": "phase.started",
  "ts": "2026-03-08T08:00:00Z",
  "payload": {}
}
```

Supported `type` values:
- `task.created`
- `task.started`
- `phase.started`
- `phase.completed`
- `tool.started`
- `tool.output`
- `tool.completed`
- `tool.failed`
- `assistant.delta`
- `artifact.created`
- `artifact.updated`
- `task.needs_input`
- `task.completed`
- `task.failed`
- `task.cancelled`

### SSE endpoint behavior
`GET /api/atom/tasks/:id/events?since=<eventId>`
- Replays from `since` if provided
- Then tails live events
- Heartbeat ping every 15s
- Client auto-reconnect with last seen `eventId`

---

## 6) API Contract

## 6.1 Create task
`POST /api/atom/tasks`

Request:
```json
{
  "message": "Build a high-yield achalasia revision pack",
  "mode": "task",
  "sourceSelection": {
    "level": "pg",
    "bookIds": ["maingot-12", "shackelford-9", "sleisenger-11"],
    "preset": "clinical-deep-dive"
  },
  "room": "library"
}
```

Response:
```json
{
  "taskId": "uuid",
  "status": "queued",
  "eventsUrl": "/api/atom/tasks/uuid/events"
}
```

## 6.2 Task snapshot
`GET /api/atom/tasks/:id`

Returns status, current phase, latest assistant text, artifact summary.

## 6.3 Task control
`POST /api/atom/tasks/:id/control`

Request:
```json
{ "action": "stop" }
```
Actions:
- `stop`
- `retry`
- `continue`
- `branch` (creates child task with inherited context)

## 6.4 Artifact list
`GET /api/atom/tasks/:id/artifacts`

---

## 7) Orchestrator Phase Graph

Default flow:
1. `plan`
2. `retrieve`
3. `reason`
4. `draft`
5. `finalize`

Each phase emits started/completed events and checkpoint snapshots.

Error policy:
- recoverable -> `tool.failed` + retry policy
- non-recoverable -> `task.failed` with normalized `error_code`

---

## 8) Left Pane Dynamic Library (26 Books)

## 8.1 Source metadata shape
```ts
type SourceBook = {
  id: string;
  title: string;
  domain: 'surgery' | 'medicine' | 'anatomy' | 'obgyn' | 'pediatrics' | 'other';
  levelTags: ('ug' | 'pg' | 'resident' | 'consultant')[];
  priority: 'core' | 'reference';
  asset?: { cover?: string; accent?: string };
}
```

## 8.2 UI requirements
- searchable list of all 26 books
- grouped by domain
- filters: All / UG / PG / Resident / Consultant / Core
- presets:
  - `exam-focus`
  - `clinical-deep-dive`
  - `rapid-revision`
- multi-select with count badge
- selection snapshot locked per task execution

## 8.3 Source service
- `GET /api/atom/sources` returns source catalog + levels + presets
- Optional server-side ranking hints by query/topic

---

## 9) Frontend UX Spec (ATOM Workspace)

## 9.1 Layout
- Left: Source Library
- Center: Conversation + Process Timeline
- Right: Artifacts + Code Canvas

## 9.2 Process timeline
- Chips: Planning → Retrieving → Reasoning → Drafting → Final
- Expandable tool logs
- Final deterministic states: `completed|needs_input|failed|cancelled`

## 9.3 Code Canvas
- auto-collect fenced code blocks from assistant deltas/artifacts
- snippet list + language tag + copy
- read-only preview in v1

## 9.4 Transitions/branding
- Framer-motion pane transitions
- subtle glass cards + branded gradients
- preserve state while switching mobile tabs

---

## 10) Routing Rules (Quick vs Task)

Heuristic (v1):
- quick if prompt length small and no heavy action requested
- task if user asks for generation packages, multi-step outputs, deep comparisons, long summaries, or explicit “long task”

Future: explicit toggle in UI (`Quick` / `Task` mode)

---

## 11) Observability / Reliability

- Structured logs with `taskId`, `phase`, `eventSeq`
- Metrics:
  - time to first delta
  - phase durations
  - task completion rate
  - retry/failure by code
- Reconnect-safe SSE with replay

---

## 12) Security + Compliance

- RLS on task/event/artifact tables (user-scoped)
- redact secrets from logs/events
- patient identifier guardrails in generated content path

---

## 13) Rollout Plan (7 days)

### Day 1
- finalize RFC, DB migration scripts, API types

### Day 2
- implement `atom_tasks`, `atom_task_events`, `atom_task_artifacts`, `atom_task_checkpoints`
- create task endpoints

### Day 3
- orchestrator worker + phase graph + checkpoint writes

### Day 4
- SSE replay+tail endpoint + reconnect behavior

### Day 5
- frontend process timeline + control buttons + state machine

### Day 6
- left dynamic 26-book library + level filters + presets + task snapshot binding

### Day 7
- right artifacts/canvas finalize, polish transitions, QA, launch checklist

---

## 14) Acceptance Criteria

- user can run long task and see live phase/tool events in UI
- user can stop/retry/continue/branch task
- events survive refresh and replay from last event id
- 26 books visible in left panel with filters + presets
- source selection persists into task snapshot and can be audited
- code outputs visible in canvas tab
- no regression for existing quick chat route

---

## 15) Open Questions

1. Should branch task inherit full event history or only final context snapshot?
2. Should source presets be user-editable in v1 or fixed?
3. Need WebSocket in v1 or SSE is sufficient for first release?
4. Should artifacts be immutable versions only, or allow editable drafts?
