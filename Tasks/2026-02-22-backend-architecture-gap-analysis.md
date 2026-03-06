# Backend + UX Gap Analysis Checkpoint (2026-02-22)

Master consolidated log:
- `/Users/sarathchandrabhatla/NucleuX-Academy--master Codex/Tasks/2026-02-22-master-progress-log.md`

## Current Status
Phase 1, Phase 2, and Phase 3 foundation are now in repo.

## Completed in Phase 1 (Persistence Foundation)
1. Added lifecycle schema migration:
- `supabase/migrations/005_learning_lifecycle.sql`
- Tables:
  - `learning_topics`
  - `learning_chunks`
  - `learning_stage_runs`
  - `learning_artifacts`
  - `learning_checkpoints`
- Added indexes, `updated_at` triggers, and RLS policies (owner-only).

2. Added lifecycle contracts/helpers:
- `src/lib/learning/contracts.ts`
- `src/lib/learning/api.ts`

3. Added authenticated API routes:
- `src/app/api/learning/topics/route.ts`
- `src/app/api/learning/topics/[topicId]/chunks/route.ts`
- `src/app/api/learning/stage-runs/route.ts`
- `src/app/api/learning/artifacts/route.ts`
- `src/app/api/learning/checkpoints/route.ts`

## Completed in Phase 2 (Client Store Wiring)
1. Added debounced client sync engine:
- `src/lib/learning/client-sync.ts`
- Behavior:
  - localStorage remains source-of-truth for in-session UX
  - background write-through sync to `/api/learning/*`
  - stage-aware topic upsert/promotion (`prestudy` -> `aim` -> `shoot` -> `skin`)
  - chunk upsert/scaffolding for all method stages
  - artifact snapshots by stage type
  - reduced write spam via debounce + session signature cache

2. Wired existing method stores to cloud sync:
- `src/lib/prestudy/store.ts`
- `src/lib/aim/store.ts`
- `src/lib/shoot/store.ts`
- `src/lib/skin/store.ts`
- `src/lib/mindmap/store.ts`

## Completed in Phase 3 (Hydration + Stage Lifecycle Wiring)
1. Added cloud hydration path (read side):
- `src/lib/learning/hydration.ts`
- Behavior:
  - finds topic lifecycle row from `subject/subspecialty/topic_slug`
  - fetches chunks + artifacts
  - reconstructs PreStudy/Aim/Shoot/Skin/MindMap state into localStorage maps
  - applies remote state only when remote `updatedAt` is newer than local

2. Wired hydration into main topic userflow bootstrap:
- `src/app/(app)/library/[subject]/[subspecialty]/[topic]/TopicClient.tsx`
- On topic load, calls `hydrateTopicLearningState(topicId)`

3. Extended sync engine with stage-run/checkpoint linkage:
- `src/lib/learning/client-sync.ts`
- Behavior:
  - ensures stage run exists per topic+stage
  - attaches `stage_run_id` to artifacts
  - auto-completes run when stage object has `completedAt`
  - posts completion checkpoints (`*_completion_auto`) for stage pass trail

## Validation Run
- `npx eslint 'src/lib/learning/client-sync.ts' 'src/lib/prestudy/store.ts' 'src/lib/aim/store.ts' 'src/lib/shoot/store.ts' 'src/lib/skin/store.ts' 'src/lib/mindmap/store.ts'` ✅
- `npx tsc --noEmit` ✅

## Deep Gap Analysis (Template Ideology vs Current App)

### Backend architecture gaps
1. Artifact versioning strategy is still append-only:
- Current approach records snapshots without a strict per-chunk/current pointer model.
- Result: retrieval logic for “latest canonical stage state” needs a resolver layer.

2. Topic identity normalization is heuristic:
- Topic identity is derived from `subject/subspecialty/topic` string parsing.
- Result: collision risk if slugs diverge from canonical content IDs.

3. Checkpoint semantics are still coarse:
- Auto checkpoints track completion events, but rubric-based validation (e.g. VPReFRE/GRINDE score granularity) is not yet first-class.
- Result: stage completion exists, but quality gates are still shallow.

### UI/UX gaps (simplification opportunities)
1. Learning-method flow is not surfaced in primary topic userflow:
- Partially resolved: topic page now includes a Learning Method rail.
- Remaining gap: no dedicated stage workspace yet (stage-specific forms/checklists are still distributed).

2. Multiple ATOM surfaces are mock/static:
- Partially resolved: `ContinueWhereYouLeft` and `ATOMStudyCoach` now consume lifecycle APIs.
- Remaining gap: some dashboard/graph cards still infer progress from non-lifecycle aggregates.

3. Classroom mindmap experiences are split:
- `AtomMindMap` and `ExcalidrawCanvas` offer parallel interactions with no unified lifecycle bridge.
- Result: fragmented mental model and duplicated interaction patterns.

4. Progress semantics are mixed:
- Some pages show “progress” from mock/user-context data, while method data lives elsewhere.
- Result: inconsistent truth source and trust erosion.

## Next Resume Point (Phase 4 - UI Consolidation)
1. Integrate method journey into topic page:
- Single “Learning Method” rail with stepper: Prestudy -> Aim -> Shoot -> Skin -> Mindmap.

2. Simplify UI into one canonical ATOM learning surface:
- One side panel context model, one progress model, one “continue” model.

3. Replace mock recommendation/progress widgets with real lifecycle-backed queries:
- `ContinueWhereYouLeft` + `ATOMStudyCoach` should consume `/api/learning/*` aggregates.

4. Add explicit stage entry/exit UX:
- user-visible controls for run start, pause, completion, checkpoint review.

## Phase 4 Progress Update (In Flight)
1. Implemented unified topic-level Learning Method rail:
- `src/components/library/LearningMethodRail.tsx`
- `src/lib/learning/method-progress.ts`
- `src/app/(app)/library/[subject]/[subspecialty]/[topic]/TopicClient.tsx`
- Capabilities:
  - stage status visualization (locked / ready / in-progress / done)
  - derived completion percentages from current local lifecycle state
  - stage jump actions (view mode routing + mindmap route handoff)

2. Started replacing mock UX with real lifecycle data:
- `src/components/ContinueWhereYouLeft.tsx`
- now reads `/api/learning/topics` and maps active lifecycle topics to resume cards instead of static mock payloads

3. Added stage control + checkpoint visibility in topic rail:
- `src/lib/learning/topic-lifecycle.ts`
- `src/components/library/LearningMethodRail.tsx`
- `src/app/(app)/library/[subject]/[subspecialty]/[topic]/TopicClient.tsx`
- Capabilities:
  - explicit stage actions: start / pause / complete
  - lifecycle patching through `/api/learning/topics`
  - manual transition checkpoints via `/api/learning/checkpoints`
  - latest checkpoint badge per stage (pass/fail + checkpoint code)

4. Converted and integrated `ATOMStudyCoach` to real lifecycle recommendations:
- `src/components/ATOMStudyCoach.tsx`
- `src/app/(app)/desk/page.tsx`
- Capabilities:
  - recommendations built from `/api/learning/topics` + per-topic checkpoints
  - weak-area/pathway/spaced-review cards now data-backed

## Immediate Next Slice (Phase 4 Continuation)
1. Add checkpoint detail drawer (details payload + score trend per stage). ✅
2. Add guardrails for stage completion actions (optional confirmation + fail-path handling). ✅
3. Unify desk graph cards with lifecycle-derived metrics for consistency. ✅

## Phase 4 Progress Update (Latest)
1. Added checkpoint history query support and rail detail drawer:
- `src/lib/learning/topic-lifecycle.ts`
- `src/components/library/LearningMethodRail.tsx`
- Capabilities:
  - fetches recent checkpoint history grouped by stage
  - per-stage "Details" toggle in Learning Method rail
  - checkpoint timeline rows with pass/fail, checkpoint code, score, timestamp, and details summary

2. Added stage-completion confirmation and fail-safe rollback:
- `src/app/(app)/library/[subject]/[subspecialty]/[topic]/TopicClient.tsx`
- Capabilities:
  - explicit confirmation dialog before complete action
  - hard-fail when checkpoint write fails
  - automatic rollback of stage transition if completion checkpoint cannot be written
  - user-visible error state surfaced in Learning Method rail

3. Unified Desk graph cards and chart with lifecycle-derived metrics:
- `src/app/api/learning/overview/route.ts`
- `src/lib/api/hooks.ts`
- `src/app/(app)/desk/page.tsx`
- Capabilities:
  - lifecycle overview aggregation endpoint (topics + checkpoints) for graph metrics
  - graph cards now source connected nodes, retrieval integrity, and core objective from lifecycle state
  - graph bars/dots now reflect lifecycle topic updates + checkpoints
  - crucial deficits now lifecycle-checkpoint driven with deep links to topic quiz mode

## Vision For Phase 5 (Planned Now)
1. Introduce canonical read models:
- server-side materialized view or resolver endpoint for “latest stage state by topic”.

2. Add rubric-driven checkpoint scoring:
- map VPReFRE/GRINDE and method validations to structured scorecards with pass thresholds.

3. Add analytics on method efficacy:
- per-stage latency, completion success, checkpoint fail reasons, and retention outcomes.

## Phase 5 Progress (Current)
1. Implemented canonical topic stage-state read model endpoint. ✅
- `src/app/api/learning/read-model/topics/route.ts`
- Capabilities:
  - returns topic stage/status with latest checkpoint summaries grouped by stage
  - supports optional checkpoint history slices per stage (`include_history`, `history_limit`)
  - exposes canonical state fields: current-stage checkpoint, pass/fail counts, stage progress

2. Migrated key consumers to read-model contract. ✅
- `src/lib/learning/topic-lifecycle.ts`
- `src/app/(app)/library/[subject]/[subspecialty]/[topic]/TopicClient.tsx`
- `src/components/ATOMStudyCoach.tsx`
- `src/components/ContinueWhereYouLeft.tsx`
- Impact:
  - topic lifecycle rail now hydrates from one canonical read model call
  - recommendation widgets no longer stitch topic + checkpoint calls manually
  - reduced client-side derivation drift for latest stage state

3. Added rubric-driven checkpoint scoring with pass thresholds (VPReFRE/GRINDE). ✅
- `src/lib/learning/rubrics.ts`
- `src/lib/learning/client-sync.ts`
- `src/lib/learning/method-progress.ts`
- `src/app/(app)/library/[subject]/[subspecialty]/[topic]/TopicClient.tsx`
- Capabilities:
  - explicit per-criterion scorecards for Shoot (VPReFRE) and Skin (GRINDE)
  - thresholded stage pass/fail with numeric checkpoint score writes
  - automatic rubric checkpoints in lifecycle sync (`shoot_vprefre_rubric_v1`, `skin_grinde_rubric_v1`)
  - manual stage completion now enforces rubric gate before transition

4. Added method-efficacy analytics read model + desk integration. ✅
- `src/app/api/learning/read-model/efficacy/route.ts`
- `src/lib/learning/topic-lifecycle.ts`
- `src/lib/api/hooks.ts`
- `src/app/(app)/desk/page.tsx`
- Capabilities:
  - per-stage latency analytics from stage runs (avg/median minutes, run status counts)
  - completion success and checkpoint pass rates by stage
  - failed-checkpoint reason extraction (including rubric criterion failures)
  - retention outcomes (stable / at-risk / in-progress) + early-vs-late window pass-rate trend
  - Desk graph/analytics surfaces now display stage efficacy, latency, retention delta, and top failure signals

## Risks / Notes
- Migration relies on existing `update_updated_at()` function from prior migrations.
- Current client sync intentionally prioritizes non-breaking behavior (offline-first + background cloud persistence).
