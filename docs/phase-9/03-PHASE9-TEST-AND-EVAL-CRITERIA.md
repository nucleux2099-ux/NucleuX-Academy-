---
title: "Phase 9 Test and Evaluation Criteria"
summary: "Acceptance criteria, test matrix, and evaluation protocols for Phase 9 learning-science implementation."
audience: "QA, product, engineering, medical educators"
status: "proposed"
last_updated: "2026-03-14"
phase_tags: "Phase-9, QA, evaluation"
llm_handover_relevance: "high"
---

# 1) Scope

This document defines how to verify that Phase 9 is:
1. pedagogically correct,
2. operationally safe,
3. measurable,
4. release-ready.

It validates modules M1–M8 and the checkpoints/safeguards defined in:
- `01-NACHIKETA-PHASE9-LEARNING-SPEC.md`

---

# 2) Acceptance Criteria (Release Gates)

## 2.1 Functional gates
- [ ] F1: System assigns learner state (M1) with deterministic output schema.
- [ ] F2: At least one diagnostic prompt generated before full teaching in learning modes.
- [ ] F3: Desirable difficulty challenge emitted post-teach in applicable modes.
- [ ] F4: Calibration delta computed when confidence + score both present.
- [ ] F5: Anti-fluency guard triggers under high-risk mismatch rule.
- [ ] F6: Remediation plan generated for misconception clusters.
- [ ] F7: All Phase 9 events emitted to telemetry and visible in rollups/contracts.

## 2.2 Pedagogic gates
- [ ] P1: Answers remain source-grounded while adding learning checks.
- [ ] P2: Checkpoints do not exceed configured interaction burden caps.
- [ ] P3: “Correct by guessing” is distinguished from “understood reasoning” via explain-why checks.
- [ ] P4: Mastery labels require delayed confirmation (not same-turn only).

## 2.3 Safety/UX gates
- [ ] S1: Scope isolation unaffected by Phase 9 metadata additions.
- [ ] S2: No cross-scope learning-state leakage.
- [ ] S3: Clinical urgent mode can suppress non-critical checkpoint overhead.
- [ ] S4: Failure fallback preserves baseline ATOM behavior when Phase 9 flag off/error.

## 2.4 Outcome gates (pilot)
- [ ] O1: Mean calibration error reduces by ≥20% from pilot week 1 to week 3.
- [ ] O2: Retrieval score improves by ≥15% in repeated weak-topic checks.
- [ ] O3: Session abandonment due to “too many questions” remains <8%.
- [ ] O4: Doctor satisfaction (usefulness rating) does not fall below baseline.

---

# 3) Test Strategy

## 3.1 Test layers
1. **Unit tests:** scoring logic, rule triggers, schema validation.
2. **Contract tests:** module I/O JSON shapes and API compatibility.
3. **Integration tests:** end-to-end user journeys through three-pane flow.
4. **Telemetry tests:** event emission + rollup visibility.
5. **Pilot evaluation:** real-user trend analysis and rubric scoring.

## 3.2 Environments
- Local/staging: deterministic fixtures and synthetic user traces.
- Pilot production: feature-flagged cohorts only.

---

# 4) Detailed Test Matrix

## 4.1 M1 Learning State Profiler

### Test M1-U1 (unit)
**Given:** confidenceBias inputs and score history fixtures  
**When:** profile state computed  
**Then:** `learnerState` maps to expected bucket.

### Test M1-C1 (contract)
Validate response keys/types:
- `learnerState` enum valid
- `challengeLevel` integer range [1..5]
- `priorityConcepts[]` non-null array

### Pass criteria
- 100% deterministic for fixture set.

---

## 4.2 M2 Diagnostic Generator

### Test M2-I1
**Given:** topic + selected sources + objective retrieval  
**When:** generator called  
**Then:** at least 1 diagnostic question and baseline estimate returned.

### Negative test M2-N1
No selected sources in strict mode -> fallback message + no hallucinated diagnostic specifics.

---

## 4.3 M3 Atomic Teaching Composer

### Test M3-I1
Ensure response includes:
- atomic explanation
- causal link sentence
- source citation

### Test M3-N1
If citation unavailable, system must state uncertainty and request source narrowing.

---

## 4.4 M4 Desirable Difficulty Engine

### Test M4-U1
Difficulty progression capped to +1 per session.

### Test M4-I1
Generated challenges include at least one retrieval OR one transfer check depending on mode.

---

## 4.5 M5 Calibration & Illusion Guard

### Rule Test M5-R1 (core)
If `confidence > 0.75` AND `score < 0.60` => `illusionRisk=high` and `guardAction != none`.

### Rule Test M5-R2
If confidence-performance gap <= 0.15 => no forced guard.

### Regression Test M5-R3
Ensure pre-existing calibration endpoint remains backward compatible.

---

## 4.6 M6 Remediation Planner

### Test M6-I1
For misconception cluster severity >=2, output plan must include:
1) corrective atom, 2) blind recall check, 3) transfer case.

### Test M6-U1
Duration budget respected for quick mode (<=5 min total).

---

## 4.7 M7 Learning Telemetry Adapter

### Test M7-T1
Each checkpoint action emits expected event name.

### Test M7-T2
Event payload includes scopeKey/sessionId and redaction-safe metadata only.

### Test M7-T3
Rollup availability within configured window after ingestion.

---

## 4.8 M8 Snapshot Generator

### Test M8-I1
Snapshot includes exactly:
- improvement summary
- risk summary
- next session prescription

### Test M8-U1
Narrative remains under max doctor-friendly length limit.

---

# 5) End-to-End Scenarios

## Scenario E2E-1: OPD rapid consult
- Mode: quick consult
- Expectation: max 1 checkpoint question unless high-risk trigger.
- Pass if added overhead <90 sec median.

## Scenario E2E-2: Exam mode sprint
- Mode: exam/revision
- Expectation: challenge + explain-why checks active.
- Pass if trap-detection logic identifies distractor misconceptions.

## Scenario E2E-3: Faculty content prep
- Mode: teaching
- Expectation: exportable outline with checkpoint inserts.
- Pass if output reusable with answer keys.

## Scenario E2E-4: Fluency illusion detection
- Synthetic user reports confidence 90%, performs at 40%.
- Expectation: forced blind recall + remediation plan.
- Pass if guard triggers and mastery label blocked.

## Scenario E2E-5: Scope safety regression
- Two scopeKeys same user.
- Expectation: no cross-scope learnerState/past mistakes leakage.
- Pass if strict isolation intact.

---

# 6) Evaluation Rubric for Pilot Review

## 6.1 Session-level rubric (reviewer scored)
Score each 0–4:
1. Diagnostic quality
2. Teaching clarity
3. Challenge appropriateness
4. Calibration integrity
5. Remediation precision
6. Clinical relevance

**Pilot pass threshold:** mean ≥3.2 and no domain <2.8.

## 6.2 Quant metrics dashboard (7d/30d)
- calibration_error_mean
- retrieval_accuracy
- transfer_accuracy
- illusion_trigger_rate
- remediation_completion_rate
- checkpoint_burden_index
- session_abandonment_rate

### Guard thresholds
- checkpoint_burden_index > configured cap for 3 days => rollout pause
- abandonment_rate >8% => rollback to reduced checkpoint policy

---

# 7) Calibration Checkpoint QA

## C0 QA
- Confidence prompt rendered once/session start (where enabled).

## C1 QA
- Post-teach retrieval prompt appears and score persisted.

## C2 QA
- Post-challenge transfer prompt appears and score persisted.

## C3 QA
- Session-end summary separates reliable vs tentative competencies.

## C4 QA
- Delayed check appears in subsequent session and updates mastery status.

---

# 8) Anti-Fluency Safeguard QA Cases

1. **High confidence/low score case** -> guard trigger mandatory.
2. **Low confidence/high score case** -> supportive reinforcement, no punitive guard.
3. **Repeated wrong reasoning** -> misconception cluster increments and remediation intensifies.
4. **Correct answer + poor explanation** -> mastery withheld.
5. **Rapid skip attempts** -> one mandatory micro-check before progression when high risk.

---

# 9) Observability and Logging Requirements

For every Phase 9 session, logs must permit reconstruction of:
- learner state selection reason,
- checkpoint prompts shown,
- confidence/score pairs,
- triggered guard action,
- remediation path completed/skipped.

Minimum fields:
- `scopeKey`, `sessionId`, `conceptId`, `checkpoint`, `score`, `confidence`, `illusionRisk`, `guardAction`, `timestamp`.

---

# 10) Rollback and Safe Failure Criteria

Immediate rollback (or flag disable) if:
1. scope isolation regression detected,
2. event ingestion failure >10% for Phase 9 events,
3. abandonment rises above 12% for two consecutive pilot days,
4. critical doctor workflow latency regresses >20%.

Fallback behavior:
- disable Phase 9 feature flag,
- retain baseline Phase A–E behavior,
- keep non-breaking telemetry collection for debugging.

---

# 11) Sign-off Checklist

## Product
- [ ] Journeys validated with clinician stakeholders.

## Learning Science
- [ ] Rubric and mastery definitions approved.

## Engineering
- [ ] Contracts stable, backward compatible, feature-flagged.

## QA
- [ ] E2E + negative + regression suites passed.

## Ops
- [ ] Dashboard + alerts configured for pilot.

## Final release recommendation
Release Phase 9 only when all four gate families (Functional, Pedagogic, Safety, Outcome) are green in pilot.
