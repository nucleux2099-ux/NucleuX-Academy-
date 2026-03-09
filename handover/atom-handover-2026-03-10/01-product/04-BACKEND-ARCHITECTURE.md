---
title: "04 Backend Architecture"
summary: "Canonical product documentation snapshot for ATOM handover."
audience: "product"
status: "implemented"
source_path: "docs/product/04-BACKEND-ARCHITECTURE.md"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "A/B/C/D/E"
llm_handover_relevance: "high"
---

# Backend Architecture (Phase A–E)

**Related:** [03-ATOM-THREE-PANE-UX-SPEC](./03-ATOM-THREE-PANE-UX-SPEC.md) · [05-DATA-MODELS-AND-APIS](./05-DATA-MODELS-AND-APIS.md) · [07-OPERATIONS-RUNBOOK](./07-OPERATIONS-RUNBOOK.md)

## 1) Architecture summary

ATOM backend evolved in explicit phases:
- **A:** scope isolation + workspace bootstrap + single-chat lane
- **B:** scoped memory and retrieval integration
- **C:** artifact v1 contract + secure downloads
- **D:** heartbeat + adaptive profile + prompt assembly v3
- **E:** telemetry, calibration, alerts, rollups, retention, backfill, governance hardening

## 2) Phase map with outcomes

```text
Phase A -> Identity Isolation
Phase B -> Memory Context Layer
Phase C -> Artifact Persistence Layer
Phase D -> Personalization + Heartbeat Layer
Phase E -> Quality/Ops Observability Layer
```

## 3) Multi-user scope isolation model

Canonical scope derivation (`src/lib/atom/user-scope.ts`):
- default strategy: `chan:<channel>:peer:<peer>`
- strict strategy: `acct:<account>:chan:<channel>:peer:<peer>`

Session thread mapping:
- `thread_id = scope:<scopeKey>`
- one active session lane per `user_id + thread_id`

Security effect:
- prevents accidental cross-peer/session blending
- enforced at session route and store access levels

## 4) Workspace bootstrap model

Per-scope workspace root (`src/lib/atom/user-workspace.ts`):
- Root env override: `ATOM_USER_WORKSPACES_ROOT`
- Default path: user home-based root in current implementation

Bootstrap files created idempotently:
- `AGENTS.md`, `SOUL.md`, `TOOLS.md`, `USER.md`, `IDENTITY.md`, `HEARTBEAT.md`
- optional `BOOTSTRAP.md` when enabled

Safety controls:
- sanitized scope path
- root boundary enforcement
- no overwrite on bootstrap writes

## 5) Pipelines

## Memory pipeline (Phase B)

```text
Incoming user message
  -> ensure memory structure
  -> append daily memory
  -> retrieve scoped snippets
  -> build memory context block
  -> inject into prompt assembly
  -> persist assistant output + retrieval meta
```

Key modules:
- `memory-store.ts`
- `memory-retrieval.ts`
- session message routes

## Retrieval pipeline
- currently deterministic keyword provider (pluggable)
- scope-local files only
- snippet metadata includes source file + line ranges + score

## Artifact pipeline (Phase C)

```text
assistant response
   -> artifact extraction/creation
   -> dual write (legacy meta + v1 row)
   -> optional workspace file copy
   -> list via session API
   -> secure download via scoped endpoint
```

Key module: `src/lib/atom/artifacts/service.ts`

## Heartbeat pipeline (Phase D)
- Endpoint: `POST /api/atom/heartbeat/run`
- Reads `HEARTBEAT.md` and optional memory summary
- Writes `memory/heartbeat-state.json`
- Emits `ACTION` vs `HEARTBEAT_OK` with noise suppression

## Adaptive profile pipeline (Phase D)
- table: `atom_scope_profiles`
- API: `GET/POST /api/atom/profile`
- profile applied via policy guardrails and prompt assembly v3

## Telemetry pipeline (Phase E)

```text
Route events -> telemetry logger -> atom_telemetry_events
       -> rollup jobs -> atom_telemetry_rollups
       -> alert evaluation -> atom_telemetry_alerts
       -> calibration service -> trend/confidence summaries
```

Includes:
- redaction/sanitization
- admin-key gated cross-scope reads
- retention + backfill jobs with checkpointing

## 6) Current caveats and pending hardening
- Some ATOM V3/GDD endpoints exist behind flags and are not the default workflow path.
- Branching controls in task management are scaffold-level in current UX.
- Retrieval provider is pluggable but default is deterministic keyword retrieval, not full semantic ranking.

## Decisions
- Preserve phase architecture as additive (no destructive rewrites between phases).
- Keep scoped isolation constraints enforced across every new API.

## Actions
- Move remaining advanced routes to same governance standards (telemetry + scope + fallback behavior).
- Add integration tests for mixed channel/account scope collisions.

## Open Questions
- When to switch from dual-write artifacts to v1-only writes?
- What threshold of calibration confidence should gate personalization intensity?
