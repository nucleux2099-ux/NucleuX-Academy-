# Phase 9 Master Plan — ATOM V3 Productionization & Unified Consult Stack

**Project:** NucleuX Academy (ATOM)
**Date:** 2026-03-14
**Owner:** Sarath + NucleuX Engineering
**Architect:** Vishwakarma
**Prereq baseline:** Phases A–E complete and conformant (`docs/product/11-CONFORMANCE-CHECK-A-E.md`)

---

## 1) Phase 9 Goal

Phase 9 turns ATOM V3 from feature-gated scaffold into a production path while preserving Phase A–E safety guarantees.

### Success definition
- `/atom` routes doctor traffic through the unified V3 runtime path (with safe fallback to legacy route).
- `atom-v3` APIs are consolidated under `/api/atom/*` contracts.
- Orchestrator moves from stub-first behavior to deterministic production workflow engine with state machine guarantees.
- Telemetry/feedback/alerts cover **all** new V3 workflows (deep research + guided deep dive).
- Rollout is cohort-gated and reversible in <10 minutes by flags.

---

## 2) Why Phase 9 now

From current product docs and codebase:
- `docs/product/08-ROADMAP-NEXT.md` already prioritizes V3 promotion + route consolidation.
- `docs/product/09-DECISIONS-LOG.md` ADR-011 explicitly keeps V3 behind gating as a temporary state.
- Existing code has split paths:
  - Stable `/api/atom/*` conversation pipeline.
  - Gated `/api/atom-v3/*` launch/GDD path.
  - `runAtomOrchestratorStub()` still exists in `src/lib/atom/orchestrator.ts`.

Phase 9 is the bridge from “implemented pieces” to “single production architecture”.

---

## 3) Scope of Phase 9

## In scope
1. **Backend unification**
   - Introduce unified runtime service for mode launch + execution.
   - Move V3 endpoints under `/api/atom/*` namespace (compatibility shim retained).
2. **Data model evolution**
   - Add workflow-run ledger and GDD persistent state in Supabase.
   - Add idempotency + run-key constraints.
3. **Frontend promotion**
   - Promote V3 experience as default shell while keeping legacy fallback.
   - Add explicit quality state badges and run diagnostics in UI.
4. **Observability + operations**
   - Extend telemetry contracts to include workflow-run lifecycle and cohort metrics.
5. **Rollout framework**
   - Cohort-based release plan with rollback switches.

## Out of scope
- Large redesign of non-ATOM LMS modules (MCQ engine, CBME core models, etc.).
- Semantic retrieval provider swap (kept as Phase 10+ unless critical).

---

## 4) Technical deliverables checklist

- [x] Target architecture (backend + frontend + APIs + data model changes)
- [x] Stepwise implementation plan (milestones/dependencies/risks)
- [x] LLM handoff prompt pack
- [x] File-level change map
- [x] Rollout/rollback/observability checklist

Detailed architecture: `02-VISHWAKARMA-TECH-ARCHITECTURE.md`
LLM execution prompts: `04-LLM-HANDOFF-PROMPTS.md`

---

## 5) Stepwise implementation plan (Milestones)

## M0 — Branching, contracts, and safety harness (1 day)
**Objective:** Freeze baseline and contracts before refactor.

Tasks:
- Create Phase 9 branch.
- Add/update contract tests for existing `/api/atom/*` and `/api/atom-v3/*` behavior.
- Capture baseline telemetry snapshots and reliability smoke output.

Dependencies:
- Existing test harness (`test:atom:*`, route tests).

Risks:
- Hidden dependence on current `atom-v3` route shapes.

Exit criteria:
- Baseline tests green.
- Compatibility matrix documented.

---

## M1 — Unified runtime service + state machine hardening (2–3 days)
**Objective:** Replace launch/stub fragmentation with single runtime service.

Tasks:
- Add `src/lib/atom/runtime/` module:
  - mode resolver
  - run lifecycle state machine
  - idempotent executor entrypoint
- Refactor `src/lib/atom/orchestrator.ts`:
  - production paths for deep research and guided deep dive
  - clear terminal states + failure taxonomy
- Keep backward-compatible adapters for task controls.

Dependencies:
- `atom_tasks`, `atom_task_events`, telemetry logger.

Risks:
- Event duplication/reordering.

Exit criteria:
- Deterministic state transitions validated by tests.

---

## M2 — API consolidation under `/api/atom/*` (2 days)
**Objective:** Move v3 launch/GDD into canonical API family.

Tasks:
- Add new canonical routes:
  - `POST /api/atom/workflows/launch`
  - `POST /api/atom/gdd/start`
  - `GET /api/atom/gdd/:sessionId`
  - `POST /api/atom/gdd/:sessionId/advance`
- Convert `/api/atom-v3/*` routes to compatibility wrappers (deprecated headers + same payload).
- Extend request/response schemas and route tests.

Dependencies:
- M1 runtime service.

Risks:
- Frontend expecting old response keys.

Exit criteria:
- Old and new routes both pass compatibility tests.

---

## M3 — Data model migration (1–2 days)
**Objective:** Persist workflow runs + GDD session state with auditable lineage.

Tasks:
- Add migration `016_atom_phase9_runtime.sql` (name suggestion):
  - `atom_workflow_runs`
  - `atom_gdd_sessions`
  - `atom_gdd_step_events`
  - indexes + RLS + run-idempotency unique keys
- Backfill script for active task linkage where possible.

Dependencies:
- Supabase migration chain through `015`.

Risks:
- RLS mistakes causing hidden 403s.

Exit criteria:
- Migration applies cleanly in local + staging.
- RLS tests passing.

---

## M4 — Frontend promotion and UX parity (2–3 days)
**Objective:** Make unified V3 shell default in `/atom`.

Tasks:
- Create `AtomUnifiedWorkspace` and route `/app/(app)/atom/page.tsx` to it behind rollout flag.
- Reuse existing panels but wire to new canonical APIs.
- Add quality confidence state (green/amber/red) and workflow run diagnostics.
- Ensure session hydration, artifact download, and feedback loop still work.

Dependencies:
- M2 canonical API availability.

Risks:
- Regression in legacy chat-only flow.

Exit criteria:
- UX parity checklist complete for 10 doctor quickstart scenarios.

---

## M5 — Telemetry, alerting, rollout, rollback drills (1–2 days)
**Objective:** Operational readiness.

Tasks:
- Add workflow-level telemetry events and contracts.
- Rollup views for cohort success/failure/latency.
- Canary rollout by cohort flags.
- Run rollback simulation.

Dependencies:
- M1–M4 complete.

Risks:
- Alert noise spikes due to new signals.

Exit criteria:
- 72h canary stable with no Sev-1 scope/safety regressions.

---

## 6) File-level change map (what to touch)

## Backend/API
- `src/lib/atom/orchestrator.ts` (refactor to production runtime + remove stub-default behavior)
- `src/lib/atom/types.ts` (new workflow run state/event types)
- **New:** `src/lib/atom/runtime/*` (state machine, executor, adapters)
- `src/app/api/atom/tasks/route.ts`
- `src/app/api/atom/tasks/[id]/control/route.ts`
- **New:** `src/app/api/atom/workflows/launch/route.ts`
- **New:** `src/app/api/atom/gdd/start/route.ts`
- **New:** `src/app/api/atom/gdd/[sessionId]/route.ts`
- **New:** `src/app/api/atom/gdd/[sessionId]/advance/route.ts`
- `src/app/api/atom-v3/launch/route.ts` (shim/deprecation)
- `src/app/api/atom-v3/gdd/start/route.ts` (shim/deprecation)
- `src/app/api/atom-v3/gdd/[sessionId]/route.ts` (shim/deprecation)
- `src/app/api/atom-v3/gdd/[sessionId]/advance/route.ts` (shim/deprecation)

## Data model / DB
- **New migration:** `supabase/migrations/016_atom_phase9_runtime.sql`
- Optional follow-up migration for indexes or constraints if needed.

## Frontend
- `src/app/(app)/atom/page.tsx`
- `src/components/atom/LegacyAtomWorkspace.tsx` (extract shared panels)
- **New:** `src/components/atom/AtomUnifiedWorkspace.tsx`
- `src/components/atom/AtomV3Experience.tsx` (reuse/trim)
- `src/components/atom/GuidedDeepDiveExperience.tsx` (canonical API wiring)

## Flags/config/tests/docs
- `src/lib/features/flags.ts` (new rollout/canary/deprecation flags)
- `src/app/api/atom/session/__tests__/*` (scope + artifact invariants)
- `src/app/api/atom-v3/__tests__/gdd.start.test.ts` (compat tests)
- **New tests:** runtime state machine + canonical workflow routes
- `docs/product/05-DATA-MODELS-AND-APIS.md` (post-implementation update)
- `docs/product/09-DECISIONS-LOG.md` (ADR-011 retirement record)

---

## 7) Key dependencies and risk register

| Risk | Impact | Likelihood | Mitigation |
|---|---|---:|---|
| API drift between `/atom-v3` and `/atom` | High | Medium | Compatibility tests + shim layer with strict contract snapshots |
| Event dedup/order issues in task streams | High | Medium | Sequence locks, idempotency keys, replay-safe consumers |
| Scope regression | Critical | Low/Med | Reuse canonical scope derivation (`user-scope.ts`), add new guard tests |
| RLS misconfiguration on new tables | High | Medium | Explicit RLS policies + integration tests per role |
| Rollout UI regression for doctors | High | Medium | Cohort canary + fallback to legacy workspace flag |

---

## 8) Rollout + rollback + observability checklist

## Rollout
- [ ] Deploy migration `016` to staging.
- [ ] Enable `PHASE9_RUNTIME_ENABLED=false` in prod by default.
- [ ] Ship code dark (disabled).
- [ ] Enable for internal cohort only (Sarath + Aditya).
- [ ] Watch 24h metrics; if stable, expand to pilot cohort.
- [ ] Remove legacy default only after 7-day stable window.

## Rollback
- [ ] Flip `PHASE9_RUNTIME_ENABLED=false` (immediate route fallback to legacy).
- [ ] Keep `/api/atom-v3/*` shims active.
- [ ] Disable new workflow launch endpoint if needed.
- [ ] Retain DB schema; avoid destructive rollback migration during incident.
- [ ] Post-incident replay from telemetry + task events.

## Observability SLOs
- [ ] p95 launch latency < 1.5s for API ack
- [ ] task stream disconnect rate < 1%
- [ ] workflow failure rate < 3% excluding user-cancelled
- [ ] zero scope leakage incidents
- [ ] alert dedupe working (no repeated same alert in cooldown window)

## Required dashboards
- [ ] Workflow runs by mode/cohort/status
- [ ] GDD progression funnel (start → advance → complete)
- [ ] Artifact generation success + download success
- [ ] Feedback sentiment + unresolved ratio
- [ ] Scope violation sentinel panel

---

## 9) Phase 9 exit criteria (Go/No-Go)

Phase 9 is complete when:
1. Unified runtime is default for canary cohort and stable.
2. Legacy path remains available but not default.
3. `/api/atom-v3/*` routes are compatibility-only and marked deprecated.
4. New telemetry contracts are consumed by rollup/alerts.
5. Quickstart scenarios execute end-to-end without support.

---

## 10) Implementation order recommendation for coding LLM

Recommended module order:
1. Runtime types + state machine
2. Orchestrator refactor
3. Canonical workflow APIs
4. DB migration + repositories
5. Frontend unified workspace wiring
6. Telemetry/alerts/rollups extension
7. Compatibility shims and docs updates

Use `04-LLM-HANDOFF-PROMPTS.md` exactly in this order.
