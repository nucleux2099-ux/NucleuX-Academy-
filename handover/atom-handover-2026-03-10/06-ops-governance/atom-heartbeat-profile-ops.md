---
title: "Atom Heartbeat Profile Ops"
summary: "Heartbeat profile operational guidance."
audience: "ops"
status: "implemented"
source_path: "docs/atom-heartbeat-profile-ops.md"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "D/E"
llm_handover_relevance: "high"
---

# ATOM Heartbeat + Profile Ops Guide

## Heartbeat operations
Endpoint: `POST /api/atom/heartbeat/run`

Body:
```json
{
  "cadenceMinutes": 180,
  "activeHours": { "startHour": 8, "endHour": 22 },
  "scope": { "channel": "telegram", "peer": "442382255" }
}
```

Responses:
- `ACTION` => caller should route actionable follow-up in same scope.
- `HEARTBEAT_OK` => no action, suppress outbound/noise.

State files per scope workspace:
- `HEARTBEAT.md`
- `memory/summary.md` (optional)
- `memory/heartbeat-state.json`

## Adaptive profile operations
Read: `GET /api/atom/profile`

Update (patch):
```json
{
  "patch": {
    "response_style": "concise",
    "difficulty_preference": "hard",
    "format_preference": "bullet"
  },
  "scope": { "channel": "telegram", "peer": "442382255" }
}
```

Update (event):
```json
{
  "event": { "type": "difficulty_feedback", "value": "harder" },
  "scope": { "channel": "telegram", "peer": "442382255" }
}
```

Mirror file per scope:
- `memory/adaptive-profile.json`

## Policy precedence
1. Explicit user instruction override
2. Strict-grounded mode
3. Safety mode
4. Personalization advisory

Policy reason codes are attached in session message `meta.policyDecision`.

## Troubleshooting
- If profile appears missing: ensure migration `011_atom_scope_profiles.sql` ran.
- If heartbeats never run: inspect cadence + active-hours + `memory/heartbeat-state.json`.
- If cross-user leakage is suspected: verify scope envelope and canonical scope key headers/body.
