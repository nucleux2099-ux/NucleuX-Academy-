# ATOM v3 Phase 1 — Contract Baseline Freeze

Status: **Frozen (Phase 1)**  
Effective date: **2026-03-08**  
Scope: UX ↔ BFF ↔ API ↔ Source Schema contracts for ATOM v3 execution path.

## 1) Version Matrix (frozen)

| Layer | Contract ID | Version | Freeze Notes |
|---|---|---:|---|
| UX contract (ATOM workspace) | `atom-ux` | `3.0.0` | Three-pane task workspace, process timeline, artifact tabs, deterministic terminal states. |
| BFF contract (Next.js route handlers) | `atom-bff` | `3.0.0` | `/api/atom/tasks` + source selection snapshot + SSE/event endpoints in task mode. |
| API wire contract (JSON/SSE payload shape) | `atom-api` | `3.0.0` | Task create/snapshot/control/events/artifacts payload stability for Phase 1. |
| Source schema contract (Supabase) | `atom-source-schema` | `2.0.0` | Backed by `008_atom_source_platform_v2.sql` (`source_books`, QC, ingestion, projection). |

## 2) Locked interfaces for Phase 1

### UX
- Task states: `queued | running | needs_input | completed | failed | cancelled`
- Timeline event families: `task.*`, `phase.*`, `tool.*`, `assistant.delta`, `artifact.*`
- Left pane source selection is snapshot-bound at task creation time.

### BFF/API
- Create task: `POST /api/atom/tasks`
- Source catalog: `GET /api/atom/sources`
- Payloads are additive-only within v3.0.x (no removals/renames).
- Error response follows unified envelope (see `01-error-envelope-standard.md`).

### Source schema
- Primary serving projection: `source_book_status`
- Compatibility fallback: `atom_source_catalog` remains supported during Phase 1 rollout.
- Version/provenance fields required in projection path:
  - `pipeline_version`, `ocr_model_version`, `prompt_version`
  - `active_index_version`, `candidate_index_version`

## 3) Change control rules (during freeze)

Allowed in Phase 1:
- Additive fields (optional) in responses/events
- New event types that do not alter existing semantics
- Internal implementation/refactors without contract shape changes

Not allowed in Phase 1 (without version bump + migration plan):
- Removing or renaming existing fields
- Changing enum meanings or terminal state semantics
- Replacing error envelope keys
- Breaking `source_book_status`/fallback behavior

## 4) Implementation note

Treat this baseline as the reference for integration tests and release checks. Any exception must be documented as an explicit contract change request (CCR) and mapped to `v3.1+` planning.
