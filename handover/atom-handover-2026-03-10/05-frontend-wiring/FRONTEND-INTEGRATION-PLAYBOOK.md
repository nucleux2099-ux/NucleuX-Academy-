---
title: "Frontend Integration Playbook"
summary: "Synthesis document generated for external LLM/frontend handover."
audience: "engineer"
status: "implemented"
source_path: "generated"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "A/B/C/D/E"
llm_handover_relevance: "high"
---

# Frontend Integration Playbook (Alt-LLM Experiment)

## 1) Baseline capture
- Verify current behavior on `/atom` (single-chat + outputs panel).
- Capture baseline payloads from:
  - `/api/atom/tasks`
  - `/api/atom/sources`
  - `/api/atom/profile`
  - `/api/atom/feedback`

## 2) Keep UI contracts fixed
- Do not change component props in `src/components/atom/LegacyAtomWorkspace.tsx` unless necessary.
- Keep loading/error states identical while backend adapter evolves.

## 3) Introduce provider switch
- Add env-driven provider selector in backend runtime only.
- Preserve message chunking and artifact return format.

## 4) Validate end-to-end
- Start session -> send message -> produce artifact -> submit feedback.
- Confirm telemetry/alerts continue to populate.
- Confirm scoped history isolation across peers/channels.

## 5) Rollback readiness
- One-click rollback via env toggle.
- Keep old provider code path intact until parity signoff.

## UX non-regression focus
- Response speed and typing/stream perception.
- Citations/source links and confidence indicators.
- Right-panel artifact rendering fidelity.
