# NucleuX Academy Product Overview

**Related:** [00-INDEX](./00-INDEX.md) · [02-PERSONAS-AND-USECASES](./02-PERSONAS-AND-USECASES.md) · [03-ATOM-THREE-PANE-UX-SPEC](./03-ATOM-THREE-PANE-UX-SPEC.md)

## 1) Vision (doctor-language first)

NucleuX Academy aims to be a **clinical co-pilot for learning + decision preparation**, not a generic chatbot.

For a doctor, this means:
- Ask one focused clinical or exam question.
- Get grounded, structured, high-yield output.
- Capture that output as reusable artifacts (notes, teaching points, MCQ/flashcard-style transforms).
- Improve over time through your own preferences and feedback.

## 2) Problem Statement

Current medical learning/consult prep is fragmented:
- One tool for reading books,
- one for notes,
- one for making slides,
- one for revision,
- and none that remember personal learning pace across scopes.

ATOM in NucleuX solves this by providing:
1. Scoped session memory,
2. source-aware interaction,
3. artifact outputs,
4. profile personalization,
5. measurable quality + telemetry loops.

## 3) Primary users

See full cohort definitions in [02-PERSONAS-AND-USECASES](./02-PERSONAS-AND-USECASES.md).

Top user categories:
- Product builder-doctors (Sarath, Aditya)
- Faculty / coach workflows (Mouli)
- Resident/junior doctors under time pressure (Dheera, Rehan)
- Exam-focused high-intensity learners (Rachit)

## 4) North Star and Product Success

### North Star
**“A doctor can move from question to confident, source-grounded, reusable output in one ATOM session.”**

### Practical success metrics
- Time-to-useful-output (first clinically useful answer)
- Groundedness/quality trend (from telemetry + feedback calibration)
- Reuse rate of artifacts (download/continuation patterns)
- Reduced correction loops per session

## 5) Scope boundaries (current state)

### In scope (implemented baseline)
- Single active scoped chat lane per user-scope (Phase A)
- Scoped file memory + retrieval injection (Phase B)
- Structured artifact persistence + download APIs (Phase C)
- Adaptive profile + heartbeat API support (Phase D)
- Telemetry, calibration, alerts, rollups, retention/backfill (Phase E)

### Partial / scaffold / flag-dependent
- Atom V3 Guided Deep Dive and advanced launch modes
- Some branch/advanced task controls in UI are scaffold-only
- UX remains labeled “LegacyAtomWorkspace / UX-1 Cockpit shell”

### Out of scope (for now)
- Autonomous clinical decision execution
- Full EHR integration
- Multi-tenant hospital admin dashboards beyond current telemetry contracts

## 6) Product shape in one diagram

```text
Doctor Input
   |
   v
[ATOM Left Cockpit] -- source selection + profile context
   |
   v
[ATOM Center Consult] -- scoped chat + retrieval + policy layering
   |
   v
[ATOM Right Outputs] -- timeline + artifacts + download
   |
   v
Telemetry + Feedback + Rollups -> Quality/ops visibility
```

## 7) Current implementation snapshot

- Frontend primary entry: `src/app/(app)/atom/page.tsx` → `LegacyAtomWorkspace`
- Core APIs: `src/app/api/atom/session/*`, `profile`, `feedback`, `telemetry/*`, `heartbeat/run`
- Runtime modules: `src/lib/atom/*` (scope, memory, telemetry, profile, artifacts)
- DB migrations for ATOM Phase A–E baseline: `009` to `014` (with `015` present as separate competency-progress schema outside ATOM phases)

## Decisions
- Keep ATOM as a doctor workflow engine, not a broad “AI everything” interface.
- Continue with scope isolation as a non-negotiable baseline.

## Actions
- Align all new UX iterations to three-pane workflow behavior.
- Require source-grounding and output artifact pathways in any new mode.

## Open Questions
- Should ATOM V3 replace UX-1 directly, or run as staged cohort rollout?
- Which quality thresholds should block release vs only alert (see [06-QUALITY-SAFETY-GOVERNANCE](./06-QUALITY-SAFETY-GOVERNANCE.md))?
