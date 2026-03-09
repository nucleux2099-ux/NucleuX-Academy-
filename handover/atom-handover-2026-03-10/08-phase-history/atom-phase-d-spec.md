---
title: "Atom Phase D Spec"
summary: "Phase D implementation specification."
audience: "engineer"
status: "implemented"
source_path: "docs/atom-phase-d-spec.md"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "D"
llm_handover_relevance: "high"
---

# ATOM Phase D Spec — Per-user Heartbeat + Adaptive Profile

## Scope
Phase D introduces scope-safe heartbeat execution and adaptive learner profiles per canonical scope key.

## D1: Per-user heartbeat engine
- New service: `src/lib/atom/heartbeat-service.ts`
- Keyed strictly by canonical `scopeKey`.
- Reads only scoped files:
  - `HEARTBEAT.md`
  - optional `memory/summary.md`
- Supports per-user cadence + active-hours.
- Noise suppression contract:
  - no action => `HEARTBEAT_OK`, `shouldEmit=false`
- State persisted in scoped workspace mirror:
  - `memory/heartbeat-state.json`

## D2: Adaptive learner profile
- New model: `atom_scope_profiles` (migration `011_atom_scope_profiles.sql`)
- Runtime service: `src/lib/atom/adaptive-profile.ts`
- Stored fields:
  - `response_style`
  - `difficulty_preference`
  - `weak_topics`
  - `pace`
  - `format_preference`
  - `updatedAt/version`
- Update pathways:
  - direct patch
  - event-based patch (`explicit_feedback`, `difficulty_feedback`, `topic_signal`, `format_request`)
- API:
  - `GET /api/atom/profile`
  - `POST /api/atom/profile`

## D3: Policy guardrails
- Module: `src/lib/atom/policy-guardrails.ts`
- Rules:
  1. Personalization is advisory.
  2. Explicit user instruction override is logged.
  3. Strict grounded / safety mode can disable personalization.
- Decision metadata is written to session message meta (`policyDecision`).

## D4: Prompt assembly v3
- Module: `src/lib/atom/prompt-assembly-v3.ts`
- Deterministic layer order:
  1) safety/system
  2) scoped memory context
  3) compact profile
  4) heartbeat checklist (heartbeat-only)
  5) current query
- Uses deterministic sort for memory formatting and hard char cap.

## Integration changes
- `src/app/api/atom/session/[sessionId]/message/route.ts` now:
  - loads scope profile
  - applies policy guardrails
  - assembles prompt with v3 layering
  - logs policy reason codes
- Added heartbeat execution endpoint:
  - `POST /api/atom/heartbeat/run`

## Rollout
1. Apply migration `011_atom_scope_profiles.sql`
2. Deploy API/runtime changes
3. Monitor session meta for policy reason-code distribution
4. Enable heartbeat caller/orchestrator to use `/api/atom/heartbeat/run`
