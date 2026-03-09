# Data Models and APIs

**Related:** [04-BACKEND-ARCHITECTURE](./04-BACKEND-ARCHITECTURE.md) · [06-QUALITY-SAFETY-GOVERNANCE](./06-QUALITY-SAFETY-GOVERNANCE.md) · [07-OPERATIONS-RUNBOOK](./07-OPERATIONS-RUNBOOK.md)

## 1) Data model overview

This section prioritizes ATOM core entities used in the current product state.

## Core ATOM tables (Supabase)
- `atom_sessions`
- `atom_session_messages`
- `atom_session_summaries`
- `atom_tasks`
- `atom_task_events`
- `atom_task_artifacts` (legacy)
- `atom_task_artifacts_v1` (current structured artifacts)
- `atom_scope_profiles`
- `atom_telemetry_events`
- `atom_feedback`
- `atom_telemetry_rollups`
- `atom_telemetry_alerts`
- `atom_source_catalog` (+ source platform tables)

Other LMS tables (profiles, progress, MCQ, competency) remain active but are outside ATOM core docs.

## 2) Key entity relationships

```text
atom_sessions (1) ---- (N) atom_session_messages
      |                        |
      |                        +--> message meta (policy/retrieval/artifact refs)
      |
      +---- (N) atom_task_artifacts_v1
      |
      +---- (N) atom_feedback
      |
      +---- (N) atom_telemetry_events -> rollups/alerts

scope_key binds sessions, profiles, telemetry, feedback, artifacts.
```

## 3) API catalog (current ATOM)

## Session + conversation
- `POST /api/atom/session/start`
- `GET /api/atom/session/threads`
- `GET /api/atom/session/:sessionId`
- `POST /api/atom/session/:sessionId/message`
- `POST /api/atom/session/:sessionId/continue`
- `GET /api/atom/session/:sessionId/artifacts/:artifactId/download`

## Task endpoints
- `GET /api/atom/tasks`
- `GET /api/atom/tasks/:id`
- `POST /api/atom/tasks/:id/control`
- `GET /api/atom/tasks/:id/events`

## Source endpoints
- `GET /api/atom/sources`
- `GET /api/atom/sources/status-summary`
- `POST /api/atom/sources/qc-import`
- `POST /api/atom/sources/sync-vyasa`

## Profile + heartbeat
- `GET /api/atom/profile`
- `POST /api/atom/profile`
- `POST /api/atom/heartbeat/run`

## Quality/telemetry
- `POST /api/atom/feedback`
- `PATCH /api/atom/feedback/:id`
- `GET /api/atom/telemetry/metrics`
- `GET /api/atom/telemetry/calibration`
- `GET /api/atom/telemetry/alerts`
- `GET /api/atom/telemetry/rollups`
- `GET /api/atom/telemetry/contracts/calibration-trend`
- `GET /api/atom/telemetry/contracts/alert-burndown`
- `GET /api/atom/telemetry/contracts/retention-status`

## Atom V3 (flag/scaffold)
- `POST /api/atom-v3/launch`
- GDD start/advance/load endpoints (present, feature-gated)

## 4) Auth and scope rules

1. **Auth baseline:** Supabase-authenticated user required for protected routes.
2. **Scope derivation:** request envelope (`accountId/channel/peer`) + configured strategy.
3. **Session ownership checks:** enforce user + canonical thread mapping.
4. **Cross-scope reads:** blocked unless admin key header present where supported.
5. **Artifact download:** requires valid scoped session ownership before serving file/inline payload.

## 5) Feature flags and environment variables

## Runtime flags
- `ATOM_V3_ENABLED`
- `ATOM_V3_ADVANCED_VISIBLE`
- `ATOM_V3_GDD_ENABLED`

## Product feature flags
- `FEATURE_ATOM_UX1_COCKPIT_SHELL`
- `FEATURE_ATOM_UX2_COMPOSER_REVAMP`
- `FEATURE_TRACK_A_DEEP_RESEARCH_SCAFFOLD`
- `FEATURE_TRACK_B_GUIDED_DEEP_DIVE_SCAFFOLD`
- plus other `FEATURE_*` keys in `src/lib/features/flags.ts`

## Scope/safety config
- `ATOM_SCOPE_STRATEGY`
- `ATOM_SCOPE_STRICT_MODE`

## Workspace/memory/artifact config
- `ATOM_USER_WORKSPACES_ROOT`
- `ATOM_ENABLE_BOOTSTRAP_FILE`
- `ATOM_PHASE_C_ARTIFACTS_ENABLED`
- `ATOM_ARTIFACT_INLINE_MAX_BYTES`
- `ATOM_ARTIFACT_WRITE_WORKSPACE_COPY`

## Telemetry config
- `ATOM_TELEMETRY_ENABLED`
- `ATOM_TELEMETRY_RETENTION_DAYS`
- `ATOM_ADMIN_KEY`

## Integration keys
- `ANTHROPIC_API_KEY` (+ optional model env)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Decisions
- Keep API docs grouped by doctor workflow rather than internal module names.
- Treat `scope_key` as primary isolation key across entities.

## Actions
- Add explicit OpenAPI/JSON schema export for this catalog.
- Mark deprecated routes (if any) with migration targets.

## Open Questions
- Should atom-v3 endpoints be merged under `/api/atom/*` once stable?
- Should artifact MIME allowlist be tightened in strict mode by default?
