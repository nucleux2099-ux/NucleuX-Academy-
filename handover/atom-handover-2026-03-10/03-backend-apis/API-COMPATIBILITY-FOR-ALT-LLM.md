---
title: "Api Compatibility For Alt Llm"
summary: "Synthesis document generated for external LLM/frontend handover."
audience: "engineer"
status: "implemented"
source_path: "generated"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "A/B/C/D/E"
llm_handover_relevance: "high"
---

# API Compatibility for Alternate LLM

## Stable surface (should not change)
- Frontend API contracts under `/api/atom/*` and `/api/chat`.
- Session identity model: user + canonical `scopeKey` + `thread_id`.
- Artifact schema and response envelopes expected by current UI.

## LLM-swap impact zones
1. **Provider client layer** (`src/lib/atom/*` and chat runtime):
   - Request format (messages/system prompt/tools)
   - Token limits / context truncation rules
   - Streaming semantics and stop reasons
2. **Grounding/citation formatting**:
   - Ensure citation payload remains UI-compatible.
3. **Safety and quality rubrics**:
   - Maintain quality panel/feedback assumptions from Phase E.

## Adapter pattern recommendation
- Implement `generateResponse()` compatibility shim with:
  - normalized input message list
  - provider-specific request transform
  - normalized output: `{text, citations, usage, model, latencyMs}`
- Keep provider-specific logic behind feature flag.

## Regression contract checklist
- No API field removals.
- Existing telemetry event names retained.
- Feedback endpoints continue writing same rows.
- Phase A scope enforcement untouched.
