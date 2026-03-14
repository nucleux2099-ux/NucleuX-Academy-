# Phase 9 LLM Handoff Prompt Pack

Use this pack to hand implementation to another coding LLM (Codex/Claude/etc.).

**Execution rule:** Run prompts sequentially. Do not skip order.
**Guardrail rule:** Keep scope isolation and Phase A–E invariants intact.

---

## 0) Master instruction prompt (use first)

```text
You are implementing Phase 9 for NucleuX Academy ATOM.

Read these files first:
1) docs/phase-9/00-PHASE9-MASTER-PLAN.md
2) docs/phase-9/02-VISHWAKARMA-TECH-ARCHITECTURE.md
3) docs/product/11-CONFORMANCE-CHECK-A-E.md
4) docs/product/05-DATA-MODELS-AND-APIS.md
5) src/lib/atom/orchestrator.ts
6) src/components/atom/LegacyAtomWorkspace.tsx

Constraints:
- Preserve Phase A–E guarantees (scope isolation, RLS, telemetry sanitation).
- Implement incremental commits module-by-module.
- Keep backwards compatibility for /api/atom-v3/* via wrapper routes.
- No broad refactors outside ATOM scope.
- Add/adjust tests for every changed behavior.

At each module completion, provide:
- changed files
- key decisions
- tests run + results
- any follow-up TODOs
```

---

## 1) Prompt A — Runtime state machine foundation

```text
Task: Build Phase 9 runtime foundation.

Implement:
- new folder: src/lib/atom/runtime/
- files:
  - runtime-types.ts
  - state-machine.ts
  - workflow-launcher.ts
  - run-executor.ts
  - event-publisher.ts

Requirements:
- Define run lifecycle statuses and transition guard function.
- Reject invalid state transitions.
- Include idempotency handling hooks for launch requests.
- Reuse existing event append utilities where possible (orchestrator/task events).

Output:
- clean typed APIs for use by route handlers.
- unit tests for state-machine transitions and invalid transition rejection.

Do not modify frontend yet.
```

---

## 2) Prompt B — Orchestrator integration and stub de-prioritization

```text
Task: Integrate orchestrator with new runtime layer.

Modify:
- src/lib/atom/orchestrator.ts
- any supporting types in src/lib/atom/types.ts

Requirements:
- route execution through runtime run-executor abstractions.
- keep deep research logic functional.
- ensure failures emit structured error_code taxonomy.
- keep runAtomOrchestratorStub available only as compatibility fallback, not default production path.

Add tests for:
- deep research success path through runtime
- runtime failure path with proper terminal state and events
```

---

## 3) Prompt C — Canonical API routes under /api/atom

```text
Task: Add canonical Phase 9 workflow APIs.

Create/modify routes:
- src/app/api/atom/workflows/launch/route.ts (new)
- src/app/api/atom/gdd/start/route.ts (new)
- src/app/api/atom/gdd/[sessionId]/route.ts (new)
- src/app/api/atom/gdd/[sessionId]/advance/route.ts (new)

Update existing /api/atom-v3 routes as wrappers:
- src/app/api/atom-v3/launch/route.ts
- src/app/api/atom-v3/gdd/start/route.ts
- src/app/api/atom-v3/gdd/[sessionId]/route.ts
- src/app/api/atom-v3/gdd/[sessionId]/advance/route.ts

Requirements:
- wrappers must call canonical handlers, preserving legacy response shape.
- add deprecation response header: X-ATOM-Deprecated=true.
- keep auth + scope checks equivalent to existing routes.

Add route tests for canonical + wrapper parity.
```

---

## 4) Prompt D — Supabase migration for workflow runs and GDD persistence

```text
Task: Add Phase 9 DB migration.

Create migration:
- supabase/migrations/016_atom_phase9_runtime.sql

Include tables:
- atom_workflow_runs
- atom_gdd_sessions
- atom_gdd_step_events

Requirements:
- proper PK/FK/indexes
- RLS policies matching existing ATOM security model
- idempotency uniqueness for workflow launch keys
- updated_at trigger strategy aligned with repo conventions

Also add:
- repository/helper functions in src/lib/atom/runtime/ for CRUD operations.
- tests (where feasible) or SQL validation notes if test infra for DB migrations is limited.
```

---

## 5) Prompt E — Frontend unified workspace promotion

```text
Task: Promote unified Phase 9 workspace UI.

Modify/create:
- src/app/(app)/atom/page.tsx
- src/components/atom/AtomUnifiedWorkspace.tsx (new)
- src/components/atom/LegacyAtomWorkspace.tsx (extract reusable pieces if needed)
- src/components/atom/GuidedDeepDiveExperience.tsx (if needed for API rewiring)

Requirements:
- default /atom should use unified workspace under PHASE9_UNIFIED_UI_ENABLED flag.
- call canonical /api/atom/workflows/launch and /api/atom/gdd/* endpoints.
- preserve existing core UX behavior (source selection, chat history hydration, outputs panel, feedback).
- add run confidence/state badges (green/amber/red).
- preserve legacy fallback path when flag disabled.

Add UI/route integration tests where available.
```

---

## 6) Prompt F — Telemetry, rollups, and operational metrics extension

```text
Task: Extend telemetry for Phase 9 workflows.

Modify:
- src/lib/atom/telemetry.ts
- src/lib/atom/telemetry-metrics.ts
- src/lib/atom/telemetry-rollups.ts
- src/lib/atom/alerting.ts
- relevant API routes under src/app/api/atom/telemetry/*

Requirements:
- add workflow lifecycle events (launch, phase start/complete, completed/failed).
- include dimensions: workflow_mode, run_id, cohort.
- ensure redaction and admin-access patterns remain compliant.
- update rollup contracts if needed.

Add/extend tests:
- telemetry event validation
- rollup aggregation for workflow dimensions
- alert trigger for failure-rate threshold
```

---

## 7) Prompt G — Flags, rollout controls, docs, and ADR updates

```text
Task: Wire rollout controls and update docs.

Modify:
- src/lib/features/flags.ts
- docs/product/05-DATA-MODELS-AND-APIS.md
- docs/product/09-DECISIONS-LOG.md

Requirements:
- add PHASE9_RUNTIME_ENABLED
- add PHASE9_UNIFIED_UI_ENABLED
- add PHASE9_CANARY_COHORT
- document compatibility/deprecation status of /api/atom-v3 routes
- add new ADR-012 retiring ADR-011 with rationale and guardrails

Do not remove legacy routes yet.
```

---

## 8) Prompt H — End-to-end validation and release prep

```text
Task: Execute Phase 9 validation suite and prepare release notes.

Run (or equivalent):
- npm run typecheck
- npm run lint
- npm run test:atom:route-smoke
- npm run test:atom:dedup
- npm run test:atom:reliability
- newly added runtime/API tests

Produce:
1) test summary table (pass/fail)
2) known issues list
3) rollout checklist confirmation
4) rollback procedure tested evidence

If failures occur, patch and rerun until green or clearly documented blockers remain.
```

---

## 9) One-shot fallback prompt (if module workflow is not possible)

```text
Implement Phase 9 end-to-end in this repo with minimal blast radius:
- unify V3 launch/GDD into canonical /api/atom routes,
- introduce runtime state machine + run ledger tables,
- preserve /api/atom-v3 compatibility wrappers,
- promote unified /atom UI behind feature flag,
- extend telemetry + rollups + alerts for workflow lifecycle,
- keep scope isolation and RLS guarantees intact.

After code changes, run tests, provide diff summary by module, and produce a go-live checklist.
```

---

## 10) Definition of done (for coding LLM)

Phase 9 is done only if:
- canonical workflow routes exist and are used by unified UI,
- wrappers preserve backward compatibility,
- migration `016` exists and is valid,
- telemetry captures workflow lifecycle,
- tests for new runtime/API behavior are green,
- rollout flags and docs are updated.
