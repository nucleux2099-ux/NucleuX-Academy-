# Roadmap (Near-Term) and Prioritized Backlog

**Related:** [02-PERSONAS-AND-USECASES](./02-PERSONAS-AND-USECASES.md) · [03-ATOM-THREE-PANE-UX-SPEC](./03-ATOM-THREE-PANE-UX-SPEC.md) · [07-OPERATIONS-RUNBOOK](./07-OPERATIONS-RUNBOOK.md)

## 1) Roadmap principle

Prioritize in this order:
1. clinical reliability,
2. source-grounded quality,
3. doctor workflow speed,
4. advanced mode expansion.

## 2) Now / Next / Later

## NOW (0–2 sprints)
- Finish frontend wiring parity across all active ATOM APIs.
- Stabilize three-pane UX interactions for daily doctor use.
- Close telemetry quality loop visibility gaps (single quality panel view).
- Improve artifact rendering consistency and MIME fallbacks.

## NEXT (2–5 sprints)
- Ship mobile tabbed adaptation for Context/Consult/Outputs.
- Promote selected ATOM V3 components from scaffold to production path.
- Add explicit quality threshold states in UI (green/amber/red confidence).
- Strengthen source management UX (status, indexing health, trust badges).

## LATER (5+ sprints)
- Unified ATOM V2/V3 route consolidation.
- Advanced research mode with stronger semantic retrieval/reranking.
- Cohort-based personalization policies and template packs.

## 3) Prioritized backlog

| Priority | Item | Why now | Owner lane |
|---|---|---|---|
| P0 | UX-2 composer revamp completion | Core consult throughput | Frontend |
| P0 | Session scope strictness audit across clients | Safety critical | Backend |
| P0 | Artifact v1-only read confidence metrics | Output reliability | Backend/QA |
| P1 | Mobile three-tab adaptation | Doctor usability on call | Frontend |
| P1 | Quality dashboard unification | Faster operational decisions | Full stack |
| P1 | Alert threshold tuning by cohort | Reduce noise, improve trust | Ops/Product |
| P2 | Guided Deep Dive productionization | Learning depth | Product/Eng |
| P2 | Semantic retrieval provider upgrade | Better synthesis quality | Backend |

## 4) Frontend wiring completion items (explicit)
- Ensure all task controls map to backed behavior; hide scaffold-only actions.
- Improve session hydration and state recovery messaging.
- Standardize empty states and loading states per pane.
- Add source selection “why unavailable” explanations.
- Add persistent quick templates in composer for 5 common doctor intents.

## 5) UX improvements shortlist
- Auto-open outputs pane when first artifact is created.
- One-click “convert to revision format” action per assistant answer.
- Compact mode for rounds/ward use (single-pane consult focus).
- Better timeline summarization for long sessions.

## 6) Exit criteria for next major milestone
- No known scope isolation regressions.
- <5% unresolved critical feedback on pilot cohort.
- Stable rollup + alert jobs for 14 days.
- Doctor quickstart scenarios executable end-to-end without support.

## Decisions
- Do not expand advanced modes before polishing core consult flow.
- Keep P0 tightly aligned with doctor daily usage, not demo flows.

## Actions
- Turn this backlog into sprint tickets with explicit acceptance tests.
- Tag each item by persona impact (Sarath/Aditya/Mouli/etc.).

## Open Questions
- Should mobile adaptation precede V3 productionization for current user mix?
- What is the minimum cohort size needed before declaring quality-loop stable?
