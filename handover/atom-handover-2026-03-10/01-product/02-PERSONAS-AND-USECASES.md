---
title: "02 Personas And Usecases"
summary: "Canonical product documentation snapshot for ATOM handover."
audience: "product"
status: "implemented"
source_path: "docs/product/02-PERSONAS-AND-USECASES.md"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "A/B/C/D/E"
llm_handover_relevance: "high"
---

# Personas and Use Cases

**Related:** [01-PRODUCT-OVERVIEW](./01-PRODUCT-OVERVIEW.md) · [03-ATOM-THREE-PANE-UX-SPEC](./03-ATOM-THREE-PANE-UX-SPEC.md) · [10-DOCTOR-QUICKSTART](./10-DOCTOR-QUICKSTART.md)

## 1) Cohorts

## Sarath (Product Lead, clinician-builder)
- Needs predictable workflow design and product behavior under real clinical pressure.
- Uses ATOM to test end-to-end consult/learning loops and identify UX friction.

## Aditya (Owner, architecture + delivery)
- Needs reliability, instrumentation, and clear decision logs.
- Uses ATOM as both product and operational system with release accountability.

## Mouli (Faculty / educator)
- Needs structured teaching content, slide-friendly outputs, and high-yield explanations.
- Values format control (bullet/narrative/QA) and confidence in references.

## Dheera (Resident, busy trainee)
- Needs fast revision and practical takeaways in low time windows.
- Prefers concise output and minimal UI complexity.

## Rachit (Exam-focused power user)
- Needs high difficulty, trap-aware MCQ framing, and revision loops.
- Wants conversion from consult answer to MCQ/flashcard-ready format quickly.

## Rehan (Early-career learner)
- Needs guided progression and confidence scaffolding.
- Benefits from adaptive difficulty and incremental feedback.

---

## 2) Use-case clusters

1. **Clinical consult preparation**
   - “I have a case or topic; give me grounded differential + next steps.”
2. **Teaching preparation**
   - “Convert topic into faculty-ready teaching structure/slides.”
3. **Exam preparation**
   - “Create high-yield revision, MCQ logic, and retention-oriented summaries.”
4. **Research synthesis**
   - “Combine selected sources into concise, decision-useful synthesis.”
5. **Artifact export & reuse**
   - “Download/share outputs and continue later in same scoped context.”

---

## 3) Priority Matrix (value × urgency)

```text
High Value / High Urgency
- Clinical consult prep
- Exam prep under time pressure
- Reliable source-grounded answers

High Value / Medium Urgency
- Teaching deck generation
- Long-form synthesis and research mode

Medium Value / High Urgency
- Quick profile preference tuning
- Fast continuation in existing session

Medium Value / Medium Urgency
- Advanced branch/task orchestration UX
- Cross-scope admin analytics views
```

---

## 4) Doctor-language workflow narratives

### Narrative A: OPD day consult prep (Dheera)
1. Opens ATOM.
2. Selects relevant books in left cockpit.
3. Asks focused question in center pane.
4. Gets practical, concise response with rationale.
5. Uses right pane artifact download for quick note/reference.

### Narrative B: Evening exam revision sprint (Rachit)
1. Sets goal to exam recall.
2. Requests high-yield summary + common traps.
3. Gives thumbs up/down feedback per response quality.
4. Uses continuation prompts for deeper follow-up.
5. Monitors consistency of answer quality over sessions.

### Narrative C: Faculty teaching prep (Mouli)
1. Defines topic and teaching objective.
2. Requests structured output (outline/pearls/table).
3. Exports output and edits externally for teaching rounds.
4. Marks resolved/unresolved feedback when needed.

---

## 5) User needs mapped to product behavior

- Need: “Don’t mix my contexts.”  
  Product: scope-key isolation in sessions + retrieval + telemetry.

- Need: “Remember how I like answers.”  
  Product: adaptive profile (`/api/atom/profile`) + policy guardrails.

- Need: “Show if quality is improving.”  
  Product: calibration/alerts/rollups endpoints and UI ops cards.

- Need: “I need outputs I can take away.”  
  Product: artifact v1 persistence + download route.

## Decisions
- Keep personas anchored in real named cohorts for product realism.
- Prioritize workflows that map to clinician time constraints.

## Actions
- Use this matrix for sprint prioritization (see [08-ROADMAP-NEXT](./08-ROADMAP-NEXT.md)).
- Validate each major release against at least one workflow per cohort.

## Open Questions
- Which cohort should receive first ATOM V3 rollout?
- Should Rehan-style novice guidance be explicit UI mode or inferred via profile/adaptive difficulty?
