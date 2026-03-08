# Track B — Guided Deep Dive Runtime Spec (Final)

**Owner:** ATOM v3 execution stream (Track B)  
**Repo:** `/Users/adityachandrabhatla/nucleux-academy`  
**Date:** 2026-03-08  
**Status:** Implementation-ready (coder handoff)

---

## 1) Scope and outcome

This spec finalizes runtime behavior for `guided-deep-dive` by turning current scaffolds into:
1. concrete state machine execution using existing step names,
2. exact adaptive branching thresholds,
3. spaced retrieval schedule defaults,
4. acceptance test matrix + telemetry contract.

Canonical step names (already scaffolded in code):
- `diagnose-gap`
- `atomic-explain`
- `active-recall`
- `clinical-application`
- `reflection`

Source scaffold: `src/lib/atom/guided-deep-dive/session-state.ts`

---

## 2) Runtime state model (mapped to scaffolded names)

## 2.1 Session state shape (v1 runtime)

Extend scaffold state to runtime (additive-safe):

```ts
type GuidedDeepDiveStatus = 'scaffold' | 'running' | 'needs-reinforcement' | 'completed' | 'failed' | 'cancelled';

type StepStatus = 'pending' | 'running' | 'completed' | 'skipped' | 'failed';

type GuidedDeepDiveSessionStateV1 = GuidedDeepDiveSessionState & {
  status: GuidedDeepDiveStatus;
  stepStatus: Record<GuidedDeepDiveStep, StepStatus>;
  attemptsByStep: Record<GuidedDeepDiveStep, number>;
  masteryScoreByStep: Partial<Record<GuidedDeepDiveStep, number>>; // 0..100
  weakConcepts: string[];
  retrievalCheckpoint: {
    dueAt: string[];        // ISO timestamps
    intervalDays: number[]; // mirrors dueAt
    easeFactor: number;     // default 2.5
    reviewCount: number;
  };
  telemetrySessionId: string;
};
```

## 2.2 Deterministic transition graph

```text
start -> diagnose-gap

 diagnose-gap
   ├─ score < 40  -> atomic-explain (remedial mode)
   ├─ 40..69      -> atomic-explain (standard mode)
   └─ >= 70       -> atomic-explain (fast mode)

 atomic-explain
   └─ concept-check >= 70 -> active-recall
      else -> atomic-explain (next micro-chunk), max 3 loops then escalate hints

 active-recall
   ├─ recall >= 80 and confidence-calibrated -> clinical-application
   ├─ 60..79 or overconfident -> atomic-explain (targeted weakConcepts)
   └─ < 60 -> diagnose-gap (reframe + prerequisite check)

 clinical-application
   ├─ application >= 75 -> reflection
   ├─ 50..74 -> active-recall (case-linked retrieval loop)
   └─ < 50 -> atomic-explain (rebuild mechanism chain)

 reflection
   ├─ quality >= 70 -> completed + retrieval schedule created
   └─ < 70 -> active-recall (metacognitive correction loop)
```

Loop safety:
- hard cap `maxTotalLoops = 6`
- hard cap `maxPerStepAttempts = 4`
- if exceeded: set `status='needs-reinforcement'`, generate abbreviated plan + schedule day-1 revisit.

---

## 3) Implementation checklist (coder-ready)

## A. State + runtime contracts
1. **Update** `src/lib/atom/guided-deep-dive/session-state.ts`
   - keep `GUIDED_DEEP_DIVE_STEPS` unchanged,
   - widen `status` union to runtime statuses,
   - add `stepStatus`, `attemptsByStep`, `masteryScoreByStep`, `weakConcepts`, `retrievalCheckpoint`.
2. **Create** `src/lib/atom/guided-deep-dive/runtime-types.ts`
   - `StepEvaluation`, `BranchDecision`, `AdaptiveMode` (`remedial|standard|fast`).

## B. Runtime engine
3. **Create** `src/lib/atom/guided-deep-dive/runtime.ts`
   - `advanceGuidedDeepDive(state, stepInput)` pure transition function,
   - enforce deterministic thresholds from Section 4,
   - enforce loop caps and fallback to `needs-reinforcement`.
4. **Create** `src/lib/atom/guided-deep-dive/scoring.ts`
   - score calculators per step (diagnostic, recall, application, reflection quality).

## C. Launch integration
5. **Update** `src/app/api/atom-v3/launch/route.ts`
   - when `mode='guided-deep-dive'`, initialize runtime-ready session object,
   - include `telemetrySessionId` and initial step checkpoint event.

## D. Retrieval scheduler
6. **Create** `src/lib/atom/guided-deep-dive/retrieval-scheduler.ts`
   - implement SM-2 compatible defaults (Section 5),
   - return `dueAt[]`, `intervalDays[]`, `easeFactor`, `reviewCount`.

## E. Telemetry
7. **Create** `src/lib/atom/guided-deep-dive/telemetry.ts`
   - event emit helpers with strict event names/payload schema from Section 7.
8. **Hook** emissions in launch + every state transition + terminal states.

## F. Tests
9. Add unit tests:
   - `src/lib/atom/guided-deep-dive/__tests__/runtime.test.ts`
   - `src/lib/atom/guided-deep-dive/__tests__/scoring.test.ts`
   - `src/lib/atom/guided-deep-dive/__tests__/retrieval-scheduler.test.ts`
10. Add API integration test:
   - `src/app/api/atom-v3/__tests__/launch.guided-deep-dive.test.ts`

---

## 4) Adaptive branching thresholds (exact defaults)

## 4.1 Common scoring inputs
- `accuracyPct` (0..100)
- `hintCount` (integer)
- `avgResponseSec`
- `confidenceSelf` (1..5)

Calibration penalty:
- if `confidenceSelf >= 4` and `accuracyPct < 60` -> `-10`
- if `confidenceSelf <= 2` and `accuracyPct >= 80` -> `-5` (underconfidence)

Hint penalty:
- `-5` per hint, cap `-20`

## 4.2 Step pass criteria
- `diagnose-gap`: diagnostic score only for mode selection (no pass/fail gate)
- `atomic-explain`: pass if `conceptCheckScore >= 70`
- `active-recall`: pass if `recallScore >= 80`
- `clinical-application`: pass if `applicationScore >= 75`
- `reflection`: pass if `reflectionQualityScore >= 70`

## 4.3 Banding rules
- **Strong:** `>= 80`
- **Borderline:** `60..79`
- **Weak:** `< 60`

Branch mapping:
- `active-recall borderline` -> targeted `atomic-explain`
- `active-recall weak` -> `diagnose-gap`
- `clinical borderline` -> `active-recall`
- `clinical weak` -> `atomic-explain`

---

## 5) Spaced retrieval schedule algorithm defaults

Use SM-2-compatible defaults aligned with existing product conventions.

## 5.1 Initialization on `reflection` pass
- `easeFactor = 2.5`
- `reviewCount = 0`
- `intervalDays = [1, 3, 7, 14, 30, 60, 90]` as base ladder

## 5.2 Quality mapping (from step outcomes)
Convert latest performance to quality `q` (0..5):
- score `< 40` -> `q=1`
- `40..59` -> `q=2`
- `60..74` -> `q=3`
- `75..89` -> `q=4`
- `>= 90` -> `q=5`

## 5.3 Update rules per review
- if `q < 3`:
  - `interval = 1`
  - `easeFactor = max(1.3, easeFactor - 0.2)`
- else:
  - `easeFactor = max(1.3, easeFactor + (0.1 - (5-q)*(0.08 + (5-q)*0.02)))`
  - `interval` progression:
    - reviewCount 0 -> 1 day
    - reviewCount 1 -> 3 days
    - reviewCount >=2 -> `round(prevInterval * easeFactor)`

Safety caps:
- min interval = 1 day
- max interval (v1) = 120 days

Due generation:
- produce next **3** due dates at completion (`D+1`, computed next, computed next)
- recompute after each actual review submission.

---

## 6) Bear Hunter + TLS mapping by state

| Runtime state | Primary pedagogy action | Operational meaning |
|---|---|---|
| `diagnose-gap` | **TLS Red** + Bear Hunter **Aim** | define target, reveal misconceptions, pick branch mode |
| `atomic-explain` | **TLS Green** micro-chunks | build minimal accurate mental model |
| `active-recall` | retrieval checkpoint #1 | force generation from memory, score recall |
| `clinical-application` | Bear Hunter **Shoot/Skin** | transfer concept to case decisions |
| `reflection` | TLS metacognitive close + retrieval checkpoint #2 | error audit, commit next-review schedule |

---

## 7) Telemetry contract (events + payload)

All events include: `event`, `timestamp`, `sessionId`, `topic`, `level`, `currentStep`.

1. `gdd_session_started`
   - `{ goal, source: 'atom-v3-launch' }`
2. `gdd_step_started`
   - `{ step, attempt }`
3. `gdd_step_scored`
   - `{ step, score, accuracyPct, hintCount, confidenceSelf, branchDecision }`
4. `gdd_branch_taken`
   - `{ fromStep, toStep, reason: 'strong|borderline|weak|loop-cap', weakConcepts[] }`
5. `gdd_checkpoint_recorded`
   - `{ checkpoint: 'retrieval-1|retrieval-2', score }`
6. `gdd_retrieval_schedule_created`
   - `{ intervals:[...], dueAt:[...], easeFactor, reviewCount }`
7. `gdd_session_completed`
   - `{ totalMinutes, totalLoops, finalMasteryScore, status:'completed' }`
8. `gdd_session_needs_reinforcement`
   - `{ totalLoops, weakConcepts, nextDueAt }`
9. `gdd_session_failed`
   - `{ step, errorCode, retryable:boolean }`

PII rule: do not emit raw free-text learner answers; only derived scores/labels.

---

## 8) Acceptance test matrix

| ID | Scenario | Input/Setup | Expected |
|---|---|---|---|
| B-01 | Launch creates runtime session | valid `guided-deep-dive` payload | response includes session with `currentStep='diagnose-gap'`, `status='running|scaffold'`, telemetry start emitted |
| B-02 | Invalid launch payload | missing topic/goal | 400 error envelope |
| B-03 | Diagnose weak branch | diagnostic score 35 | next step `atomic-explain` in remedial mode |
| B-04 | Diagnose fast branch | diagnostic score 82 | next step `atomic-explain` in fast mode |
| B-05 | Atomic explain pass | concept check 72 | transition to `active-recall` |
| B-06 | Atomic explain repeated weak | score <70 for 3 attempts | hints escalated; 4th failure triggers `needs-reinforcement` or capped loop path |
| B-07 | Recall strong | recall 84, calibrated confidence | transition to `clinical-application` |
| B-08 | Recall borderline | recall 68 | transition to `atomic-explain` with weakConcept targets |
| B-09 | Recall weak | recall 45 | transition to `diagnose-gap` |
| B-10 | Clinical pass | application 78 | transition to `reflection` |
| B-11 | Clinical borderline | application 62 | transition to `active-recall` |
| B-12 | Reflection pass | reflection quality 74 | `status='completed'` + schedule created |
| B-13 | Reflection fail | reflection quality 55 | loops to `active-recall` |
| B-14 | Loop cap safety | force >6 loops | `status='needs-reinforcement'` + day-1 due date present |
| B-15 | Scheduler low quality reset | q=2 | interval resets to 1, EF drops but not below 1.3 |
| B-16 | Scheduler high quality growth | q=5 over 3 reviews | intervals expand monotonic (1 -> 3 -> >=7) |
| B-17 | Telemetry coverage | full happy-path run | all required events 1..7 emitted in order |
| B-18 | Telemetry no-PII | answer text provided in runtime input | emitted payload excludes raw answer text |
| B-19 | Recoverable runtime error | transient step compute error | `gdd_session_failed` emitted with `retryable=true` |
| B-20 | Additive compatibility | existing scaffold consumers | no breaking change to existing step constants; additive fields only |

Done gate for Track B:
- B-01..B-20 green,
- no regression in other quick-start modes,
- contract remains additive-only per Phase 1 policy.

---

## 9) Out of scope (v1)

- LLM semantic rubric grading beyond deterministic score inputs,
- personalized schedule by chronotype/sleep,
- cross-session concept graph optimization.

This completes Track B runtime finalization for coding handoff.
