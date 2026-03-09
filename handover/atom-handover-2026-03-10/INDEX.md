---
title: "ATOM Handover Index"
summary: "Navigation and role-based reading order for handover package."
audience: "product"
status: "implemented"
source_path: "generated"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "A/B/C/D/E"
llm_handover_relevance: "high"
---

# ATOM Handover Index (2026-03-10)

## Reading order by role
- **Product:** `00-overview/README-FIRST.md` -> `01-product/00-INDEX.md` -> `01-product/01-PRODUCT-OVERVIEW.md`
- **Frontend engineer:** `00-overview/ATOM-SYSTEM-MAP.md` -> `05-frontend-wiring/FRONTEND-INTEGRATION-PLAYBOOK.md` -> `03-backend-apis/API-COMPATIBILITY-FOR-ALT-LLM.md`
- **Backend engineer:** `02-architecture/INDEX.md` -> `03-backend-apis/INDEX.md` -> `04-data-models/INDEX.md`
- **Ops/SRE:** `06-ops-governance/INDEX.md` -> `10-checklists/GO-LIVE-AND-VALIDATION-CHECKLIST.md`

## Package map
- `00-overview/` Orientation + system map
- `01-product/` Product canon docs
- `02-architecture/` Runtime and orchestrator architecture
- `03-backend-apis/` API contracts and LLM compatibility guidance
- `04-data-models/` Session/source/data schemas
- `05-frontend-wiring/` UI integration playbook
- `06-ops-governance/` Ops runbooks, telemetry, retention
- `07-openclaw-reference/` OpenClaw operating context
- `08-phase-history/` Phase A-E specs + timeline
- `09-migrations-flags/` Conformance matrix, caveats, migration notes
- `10-checklists/` Go-live + handover QA
