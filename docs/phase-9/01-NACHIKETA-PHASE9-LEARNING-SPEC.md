---
title: "Nachiketa Phase 9 Learning Spec"
summary: "Implementation-ready learning-science architecture for ATOM/NucleuX Phase 9."
audience: "product, engineering, clinical educators"
status: "proposed"
owner: "Nachiketa (Learning Science)"
last_updated: "2026-03-14"
phase_tags: "Phase-9, learning-science, quality-gates"
llm_handover_relevance: "high"
---

# 1) Why Phase 9

Phases A–E established scope safety, memory, retrieval, artifacts, telemetry, calibration, and ops hardening.  
**Phase 9 adds the missing layer: learning efficacy guarantees** — not just “good answers,” but measurable movement in doctor understanding and application.

In one line:
> **From response quality → to learner calibration + transfer quality.**

---

# 2) Phase 9 Goals and Non-Goals

## 2.1 Goals
1. Convert ATOM sessions into **explicit encode → retrieve → apply** loops.
2. Detect and reduce **fluency illusion** ("looks familiar" ≠ "can use in clinic/exam").
3. Personalize challenge level using existing profile + calibration signals.
4. Introduce objective learning checkpoints without breaking doctor workflow speed.
5. Produce machine-testable outcomes for release gating.

## 2.2 Non-Goals
- Not replacing core consult UX (three-pane model remains).
- Not introducing autonomous clinical decision execution.
- Not requiring full LMS overhaul before launch (Phase 9 is additive and API-first).

---

# 3) Learning Outcomes (LO) for Phase 9

## LO-1: Conceptual Clarity
Learner can explain a topic in atomic, causal terms (not memorized prose).

## LO-2: Retrieval Strength
Learner can recall key discriminators without seeing notes.

## LO-3: Clinical/Exam Transfer
Learner can apply concept to vignette, differential, and next-step logic.

## LO-4: Error Awareness
Learner can identify own uncertainty and common trap pathways.

## LO-5: Durable Progress
Learner shows improved performance across sessions (not one-session spike).

### Operational definitions
- **Mastered concept:** accuracy ≥80% across two separated retrieval checks + one application check.
- **At-risk concept:** confidence high but retrieval/application <60% (fluency-illusion pattern).
- **Needs remediation:** repeated error in same misconception cluster across ≥2 sessions.

---

# 4) Pedagogic Architecture (Doctor-friendly, engineer-usable)

## 4.1 The Phase 9 loop

```text
ASK (diagnose prior knowledge)
  -> TEACH (atomic explanation + source-grounded)
  -> CHALLENGE (desirable difficulty prompt)
  -> VERIFY (retrieval/application check)
  -> CALIBRATE (confidence vs performance)
  -> PLAN (next-step micro-prescription)
```

## 4.2 Instructional policy by learner state

| Learner State | Trigger | System Behavior | Safety Guard |
|---|---|---|---|
| Novice overload risk | low baseline + repeated misses | simplify + worked example + 1-step questions | avoid over-challenge burst |
| Fluency illusion | high self-confidence + low retrieval | force blind recall before further explanation | block “continue summary” shortcut once |
| Stable progress | improving trend | increase desirable difficulty + mixed contexts | cap difficulty jumps to +1 level/session |
| Persistent misconception | same wrong reasoning 2+ times | misconception-specific corrective path | require explicit restatement by learner |

## 4.3 Alignment to existing ATOM stack
- Uses existing scope isolation and source constraints (Phase A/B/C).
- Uses existing feedback/calibration/rollups endpoints (Phase E).
- Adds learning events and checkpoint contracts on top of existing telemetry taxonomy.

---

# 5) User Journeys (Phase 9 overlays)

## Journey A — OPD rapid prep (Dheera)
1. Sets topic + asks focused question.
2. ATOM gives concise source-grounded answer.
3. Before closure, ATOM asks **1 retrieval discriminator** (e.g., “Name 2 red flags that change next step”).
4. Learner self-rates confidence (0–100) and answers.
5. System logs calibration delta and gives 30-second corrective micro-drill if mismatch.

**Success:** <90 sec extra overhead; clearer decision anchors retained.

## Journey B — Exam sprint (Rachit)
1. Requests high-yield revision.
2. ATOM switches to mixed retrieval + trap-aware MCQ mini-set.
3. Requires explanation of why wrong options are wrong.
4. Generates remediation card for weak distractor logic.

**Success:** detects false mastery early; converts to reusable artifacts.

## Journey C — Faculty prep (Mouli)
1. Generates teaching outline.
2. ATOM auto-inserts “checkpoint questions” at 3 points.
3. Faculty can export with answer key + misconception map.

**Success:** teaching output becomes assessment-enabled, not just presentational.

## Journey D — Longitudinal learner (Rehan)
1. Starts with simplified pathway.
2. Weekly check-in uses spaced retrieval from prior weak topics.
3. If stable, difficulty escalates; if mismatch, remediation plan auto-created.

**Success:** trend is visible and actionable, not just session-by-session.

---

# 6) Phase 9 Module Breakdown with I/O Contracts

## M1. Learning State Profiler
**Purpose:** Convert raw telemetry + feedback + performance into learner state.

**Inputs**
- scopeKey, userId
- recent feedback (`/api/atom/feedback`)
- calibration trend (`/api/atom/telemetry/calibration`)
- retrieval/application performance events (new)

**Outputs**
```json
{
  "learnerState": "novice|fluency_risk|stable|misconception_cluster",
  "challengeLevel": 1,
  "confidenceBias": 0.22,
  "priorityConcepts": ["portal_htn_variceal_bleed"]
}
```

---

## M2. Diagnostic Question Generator
**Purpose:** Ask short pre-teach checks to estimate prior knowledge.

**Inputs**
- topic, selectedSources, learnerState, objectiveType

**Outputs**
```json
{
  "diagnosticQuestions": [
    {"id":"dq1","type":"short_recall","prompt":"List 2 causes of..."}
  ],
  "estimatedBaseline": "low|medium|high"
}
```

---

## M3. Atomic Teaching Composer
**Purpose:** Build explanation at right granularity + source grounding.

**Inputs**
- user query
- baseline estimate
- selected sources
- response style preferences

**Outputs**
- markdown answer with: atomic explanation, causal chain, clinical hook, citations.
- optional artifact block (summary/algorithm).

---

## M4. Desirable Difficulty Engine
**Purpose:** Generate challenge tasks immediately after teaching.

**Inputs**
- taught concept IDs
- challengeLevel
- recent error patterns

**Outputs**
```json
{
  "challengeItems": [
    {"kind":"retrieval","difficulty":2,"prompt":"Without looking, name..."},
    {"kind":"apply","difficulty":2,"prompt":"Given this vignette..."}
  ]
}
```

---

## M5. Calibration & Illusion Guard
**Purpose:** Compare learner confidence to demonstrated performance.

**Inputs**
- self-confidence score (0–100)
- retrieval/application score (0–1)
- prior calibration trend

**Outputs**
```json
{
  "calibrationDelta": 0.34,
  "illusionRisk": "low|moderate|high",
  "guardAction": "none|force_blind_recall|micro_remediation"
}
```

**Rule:** if confidence >75 and score <60%, trigger anti-fluency guard.

---

## M6. Remediation Planner
**Purpose:** Give minimal, targeted correction plan.

**Inputs**
- misconception cluster
- available time (quick/standard/deep)

**Outputs**
```json
{
  "plan": [
    {"step":"corrective_atom","durationMin":3},
    {"step":"blind_recall_check","durationMin":2},
    {"step":"transfer_case","durationMin":4}
  ],
  "nextReviewAt": "ISO-8601"
}
```

---

## M7. Learning Telemetry Adapter
**Purpose:** Emit phase-9-specific events into existing telemetry pipeline.

**New event types**
- `learning.diagnostic.completed`
- `learning.challenge.attempted`
- `learning.retrieval.scored`
- `learning.application.scored`
- `learning.calibration.delta`
- `learning.illusion.guard_triggered`
- `learning.remediation.completed`

**Output destination**
- existing raw telemetry store + rollups + alerts pipeline.

---

## M8. Instructor/Doctor Snapshot Generator
**Purpose:** Human-readable progress summary from learning metrics.

**Inputs**
- 7d/30d rollups
- concept-level mastery map

**Outputs**
- concise panel text:
  - what improved,
  - what is risky,
  - what to do next in one session.

---

# 7) Anti-Fluency-Illusion Safeguards (Mandatory)

## 7.1 Guardrail Set
1. **Blind recall before summary reuse** on flagged concepts.
2. **Confidence declaration before answer reveal** for high-risk learners.
3. **Explain-why check** after MCQ (correct option alone is insufficient).
4. **Near-transfer mini-case** after factual recall success.
5. **Delayed re-check** (same concept later in session/week) before mastery badge.

## 7.2 Blocked shortcuts when risk high
- Disable immediate “great, next topic” progression if illusion risk = high.
- Replace with 1–2 mandatory micro-checks (<90 sec).

## 7.3 Safety wording
- Non-punitive prompts (“Let’s stress-test this once”) to preserve motivation.

---

# 8) Evaluation Rubrics (Scoring Model)

## 8.1 Response-level rubric (0–4 each)
1. Concept accuracy
2. Causal clarity
3. Source grounding
4. Clinical relevance
5. Cognitive activation (asks learner to think/retrieve)

**Pass for release:** mean ≥3.2 with no dimension <2.8 in pilot cohort.

## 8.2 Learner-performance rubric
| Dimension | Metric | Green | Amber | Red |
|---|---|---|---|---|
| Retrieval | Correct recall % | ≥80 | 60–79 | <60 |
| Application | Case transfer % | ≥75 | 50–74 | <50 |
| Calibration | |confidence - performance| | ≤0.15 | 0.16–0.30 | >0.30 |
| Durability | 7-day retention check | ≥75 | 55–74 | <55 |

## 8.3 Misconception rubric
- 0: none
- 1: isolated slip
- 2: recurring but correctable
- 3: entrenched schema error (requires guided remediation path)

---

# 9) Calibration Checkpoints

## C0 (session start)
- quick confidence baseline + prior weak-topic reminder.

## C1 (post-teach)
- one retrieval question + confidence score.

## C2 (post-challenge)
- one transfer question + confidence score.

## C3 (session close)
- calibrated summary: “what you can reliably do now” vs “what still needs work.”

## C4 (delayed)
- spaced recall check in next session/day for concepts marked “tentative mastery.”

---

# 10) Data Contracts (Minimal additions)

## 10.1 Message meta extension (assistant/user events)
```json
{
  "learning": {
    "conceptIds": ["portal_htn"],
    "objectiveType": "retrieval|application|explanation",
    "checkpoint": "C1",
    "score": 0.66,
    "confidence": 0.9,
    "illusionRisk": "high"
  }
}
```

## 10.2 API compatibility
- Backward compatible: if `learning` block absent, default to current behavior.
- Feature flag: `ATOM_PHASE9_LEARNING_LOOP=true`.

---

# 11) Rollout Plan

## Stage 1 (Pilot, 2 cohorts)
- Dheera + Rachit-style workflows.
- Enable C1/C2 checkpoints only.
- Daily review of illusion triggers and session drop-off.

## Stage 2 (Expanded)
- Add C4 delayed checks and remediation planner.
- Enable faculty export with checkpoint questions.

## Stage 3 (General)
- Enable rubric-based release gates in CI/UAT.
- Promote Phase 9 dashboard in quality panel.

---

# 12) Dependencies and Risks

## Dependencies
- Existing telemetry ingestion and calibration endpoints (Phase E).
- Source-grounded response path (Phase B/C).
- Profile preferences and policy layering (Phase D).

## Risks
1. Over-questioning harms workflow speed.
2. Incorrect difficulty jumps discourage learners.
3. Confidence prompts become noisy if overused.

## Mitigations
- Hard cap: max 2 checkpoint questions per short consult unless exam mode.
- Difficulty delta limited to +1 per session.
- Adaptive checkpoint suppression if urgent clinical mode detected.

---

# 13) Definition of Done (Phase 9)

Phase 9 is done when:
1. All Phase 9 modules (M1–M8) are feature-flagged and integrated.
2. Anti-fluency safeguards trigger correctly under high-risk calibration mismatch.
3. New learning telemetry events appear in rollups/contracts.
4. Pilot cohort shows measurable calibration improvement and retrieval gain.
5. Acceptance tests in `03-PHASE9-TEST-AND-EVAL-CRITERIA.md` pass.

---

# 14) Handover Notes for Implementing LLM

- Keep prompts short, deterministic, and checkpoint-oriented.
- Never trade off scope safety for pedagogy convenience.
- Prefer one precise challenge over five superficial questions.
- If uncertain about learner state, default to **diagnose first** then teach.
