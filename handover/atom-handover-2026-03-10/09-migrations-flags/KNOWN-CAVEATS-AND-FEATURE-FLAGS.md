---
title: "Known Caveats And Feature Flags"
summary: "Synthesis document generated for external LLM/frontend handover."
audience: "engineer"
status: "implemented"
source_path: "generated"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "A/B/C/D/E"
llm_handover_relevance: "high"
---

# Known Caveats and Feature Flags

## Caveats
1. Product docs note that some Guided Deep Dive / Track-A behavior is scaffolded or feature-flagged.
2. `docs/specs/atom-vnext/*` are partly archived/legacy and should be treated as reference only.
3. Current active UX shell is primarily single-chat in `LegacyAtomWorkspace`.

## Feature flags / env controls (observed)
- `ATOM_SCOPE_STRATEGY`
- `ATOM_SCOPE_STRICT_MODE`
- `ATOM_ENABLE_BOOTSTRAP_FILE`
- `ATOM_USER_WORKSPACES_ROOT`
- `ATOM_PHASE_C_ARTIFACTS_ENABLED`
- `ATOM_TELEMETRY_ENABLED`
- `ATOM_TELEMETRY_RETENTION_DAYS`
- `ATOM_V3_ENABLED`
- `ATOM_V3_GDD_ENABLED`
- `ATOM_V3_ADVANCED_VISIBLE`

## Recommendation
Run all alt-LLM experiments behind explicit env-based provider flag and keep default path unchanged until parity signoff.
