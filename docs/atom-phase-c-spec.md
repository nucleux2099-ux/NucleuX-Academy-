# Atom Phase C Spec — Structured Artifacts Contract + Downloads

## Goal
Phase C introduces a stable artifact contract independent of parser heuristics, with explicit storage + download semantics while preserving existing behavior during migration.

## 1) Artifact Schema v1

```ts
type AtomArtifactV1 = {
  id: string;                  // stable UUID/ULID
  kind: 'markdown' | 'json' | 'text' | 'table' | 'code' | 'citation-pack' | 'other';
  mime: string;                // e.g. text/markdown, application/json
  title: string;
  content: string;             // canonical payload (UTF-8)
  metadata?: Record<string, unknown>; // optional typed sub-docs in follow-up
  provenance?: {
    taskId?: string;
    sessionId?: string;
    eventId?: number;
    createdBy?: 'assistant' | 'system' | 'user';
    sourceRefs?: string[];     // citation/doc/file refs
  };
  createdAt?: string;
  updatedAt?: string;
};
```

Validation rules:
- `id`, `kind`, `mime`, `title`, `content` required.
- Max content size guard (configurable, default 1 MB).
- Reject unknown mimetypes only in strict mode; warn in compatibility mode.

## 2) Storage Model (DB + workspace artifacts/)

### DB (authoritative index)
Add table `atom_task_artifacts_v1`:
- `id` (pk)
- `task_id`, `session_id`, `scope_key`
- `kind`, `mime`, `title`
- `metadata` jsonb, `provenance` jsonb
- `content_inline` text nullable
- `blob_path` text nullable
- `content_sha256` text
- timestamps

Indexes:
- `(task_id, created_at desc)`
- `(session_id, created_at desc)`
- `(scope_key, created_at desc)`

### Workspace store (artifact files)
Path:
`<workspaceRoot>/artifacts/<scopeKey>/<sessionId>/<artifactId>.<ext>`

Rules:
- Small payloads may stay inline in DB.
- Larger payloads stored in workspace path + DB pointer (`blob_path`).
- Always persist checksum in DB for integrity.

## 3) Download API Contract + auth/scope checks

### Route
`GET /api/atom/session/:sessionId/artifacts/:artifactId/download`

### Behavior
1. Authenticate user.
2. Resolve scope envelope for request.
3. Verify session ownership under resolved scope.
4. Resolve artifact descriptor via service.
5. Return stream/file bytes with safe headers:
   - `Content-Type`
   - `Content-Disposition: attachment; filename="..."`
   - `X-Content-Type-Options: nosniff`

### Error contract
- `401` unauthenticated
- `403` scope mismatch / unauthorized
- `404` artifact or session not found
- `410` stale pointer/missing blob

## 4) UI Rendering Contract + fallback behavior

UI receives `AtomArtifactV1[]`.

Render policy:
- markdown/text/code/table/json get native renderers.
- unknown kinds fallback to text preview card + download button.
- if render fails: show fallback block with title, mime, and “Download raw”.

Backward compatibility:
- Existing parser-based artifacts continue to show.
- New V1 artifacts merge with parser artifacts by stable id priority.

## 5) Migration from parser-based outputs

Phased migration:
1. Dual-write: emit parser payload + v1 payload in metadata.
2. Introduce artifact persistence service behind feature flag.
3. Backfill existing `atom_task_artifacts` rows into v1 table with inferred mime/kind.
4. Switch read path to v1-first, parser fallback.
5. Remove parser-first extraction after burn-in.

Risk controls:
- metrics for fallback hit-rate
- canary rollout by percentage of sessions
- rollback switch to parser-only

## 6) Test Plan + rollout plan

### Tests
- Unit:
  - schema validation for required fields
  - mime/kind fallback handling
  - download auth and scope checks
  - pointer resolution for inline/blob payloads
- Integration:
  - create task -> artifact persisted -> listed -> downloaded
  - cross-scope access blocked (403)
  - missing blob returns 410
- UI:
  - each known kind renderer
  - unknown kind fallback
  - parser+v1 merge behavior

### Rollout
1. Land type/interface scaffolding (no behavior change).
2. Add DB migration + service implementation behind flag.
3. Enable dual-write in staging and run migration/backfill.
4. Canary production (5% -> 25% -> 100%).
5. Remove old parser path after stability window.

## 7) Implemented in this pass
- Runtime adoption now uses `src/lib/atom/artifacts/types.ts` as canonical schema shape.
- `src/lib/atom/artifacts/service.ts` now includes:
  - `SupabaseAtomArtifactService` (DB persistence + optional workspace file copy)
  - `NoopAtomArtifactService` fallback
  - feature-flag factory: `createAtomArtifactService()`
- Session message route now dual-writes:
  - legacy parser artifacts in `atom_session_messages.meta`
  - v1 rows in `atom_task_artifacts_v1` (flag gated)
- Session GET route now reads v1 artifacts first, parser fallback second.
- New scoped download route:
  - `GET /api/atom/session/:sessionId/artifacts/:artifactId/download`
  - scope + session + owner checks + safe headers.
- UI outputs panel download button now prefers the new endpoint and falls back to legacy blob download.
