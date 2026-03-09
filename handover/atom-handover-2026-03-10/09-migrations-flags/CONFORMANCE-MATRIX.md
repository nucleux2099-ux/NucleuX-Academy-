---
title: "Conformance Matrix"
summary: "Synthesis document generated for external LLM/frontend handover."
audience: "engineer"
status: "implemented"
source_path: "generated"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "A/B/C/D/E"
llm_handover_relevance: "high"
---

# Conformance Matrix (Docs ⇄ Code ⇄ DB ⇄ API)

| Claim | Doc Evidence | Code / SQL Evidence | API/Runtime Surface | Status |
|---|---|---|---|---|
| Scope-key isolation enforced | `../08-phase-history/atom-phase-a-spec.md` | `src/lib/atom/user-scope.ts`, session guards in atom runtime | `/api/atom/session/*` semantics | Implemented |
| Userspace bootstrap guarded | `../08-phase-history/atom-phase-a-spec.md` | `src/lib/atom/user-workspace.ts` | filesystem bootstrap on session start | Implemented |
| Source platform v2 available | `../04-data-models/ATOM_SOURCE_PLATFORM_V2_FINAL.md` | migrations `006`,`007`,`008` | `/api/atom/sources` | Implemented |
| Telemetry events/rollups active | `../06-ops-governance/atom-telemetry-events.md` | migration `012` + scripts | telemetry contract routes | Implemented |
| Feedback+alerts hardening complete | `../08-phase-history/atom-phase-e-e4-e5-spec.md` | migrations `013`,`014` | feedback and alerting APIs/jobs | Implemented |
| Alt-LLM can be swapped with adapter | `../03-backend-apis/API-COMPATIBILITY-FOR-ALT-LLM.md` | provider adapter layer in runtime (implementation-specific) | `/api/chat`, `/api/atom/tasks` | Partial (experiment path) |
