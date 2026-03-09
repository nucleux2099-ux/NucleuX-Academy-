# Atom Phase C Rollout

## Feature flag
- `ATOM_PHASE_C_ARTIFACTS_ENABLED=true` enables structured artifact persistence + v1-first reads/downloads.
- Disabled flag keeps noop artifact service and legacy parser-only runtime behavior.

## Migration
- Apply `supabase/migrations/010_atom_task_artifacts_v1.sql`.
- New table: `atom_task_artifacts_v1` with indexes on:
  - `(session_id, created_at desc)`
  - `(scope_key, created_at desc)`
  - `(kind, created_at desc)`
- RLS enforces session-owner access through `atom_sessions.user_id`.

## Runtime behavior
- Message route dual-writes:
  - legacy parser artifacts into `atom_session_messages.meta.artifacts`
  - v1 artifacts via `AtomArtifactService` (when flag enabled)
- Session route reads v1 artifacts first, falls back to legacy parser extraction when none exist.
- Download endpoint is scope/session bound:
  - `GET /api/atom/session/:sessionId/artifacts/:artifactId/download`

## Rollback
1. Set `ATOM_PHASE_C_ARTIFACTS_ENABLED=false`.
2. (Optional) stop using download endpoint in UI; legacy in-browser blob fallback remains.
3. DB rollback (if required): execute rollback notes from migration footer.

## Fallback guarantees
- Existing sessions continue rendering parser-based artifacts.
- Download button still works for legacy artifacts via browser blob fallback when no v1 row exists.
