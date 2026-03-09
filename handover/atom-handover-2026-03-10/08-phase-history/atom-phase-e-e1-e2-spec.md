---
title: "Atom Phase E E1 E2 Spec"
summary: "Phase E1/E2 implementation specification."
audience: "engineer"
status: "implemented"
source_path: "docs/atom-phase-e-e1-e2-spec.md"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "E"
llm_handover_relevance: "high"
---

# ATOM Phase E (E1 + E2) — Telemetry + Quality Metrics

> Final status: Completed and hardened in Phase E4/E5. See `docs/atom-phase-e-e4-e5-spec.md` for production hardening details.

## Scope delivered
- Event schema with required fields (`eventId`, `ts`, `scopeKey`, `sessionId`, `route`, `mode`, `latencyMs`, `status`, `reasonCode`, `metadata`)
- Pluggable logger service with DB-first sink and file fallback
- PII-minimizing metadata sanitization + truncation
- Instrumentation added to:
  - `/api/atom/session/[sessionId]/message`
  - `/api/atom/session/[sessionId]/continue`
  - `/api/atom/heartbeat/run`
  - `/api/atom/profile` (GET/POST)
  - `/api/atom/session/[sessionId]/artifacts/[artifactId]/download`
  - retrieval + policy decision points inside session message route
- Metrics derivation layer (continuity, grounding, isolation, personalization + ops)
- Admin/internal metrics endpoint with scope-safe behavior:
  - `GET /api/atom/telemetry/metrics?window=1h|24h|7d[&scopeKey=...]`
  - cross-scope access requires `x-atom-admin-key` matching `ATOM_ADMIN_KEY`
- Dashboard-ready JSON contract:
  - `{ kind: "atom.telemetry.summary.v1", summary: ... }`

## Feature flag
- `ATOM_TELEMETRY_ENABLED` (default true)

## Performance posture
- Writes are async fire-and-forget from route hot paths (`void telemetry.log(...)`)
- Metrics aggregation is read-time and bounded by window/scope filters + indexed table

## Extensibility for E3
- Event metadata intentionally generic and typed as JSON object
- `event_name` taxonomy supports adding `feedback.*` / `rating.*` events without schema churn
- Summary contract versioned (`kind`) for backward-compatible dashboard evolution
