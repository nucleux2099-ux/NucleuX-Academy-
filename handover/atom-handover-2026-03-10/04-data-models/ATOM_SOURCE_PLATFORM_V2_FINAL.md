---
title: "Atom Source Platform V2 Final"
summary: "Source platform data model and workflows."
audience: "engineer"
status: "implemented"
source_path: "docs/specs/ATOM_SOURCE_PLATFORM_V2_FINAL.md"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "C/D"
llm_handover_relevance: "high"
---

# ATOM Source Platform V2 — Final RFC

Status: **Locked / Final V2**
Date: 2026-03-08

## 1) Lifecycle States

`cataloged -> qc_pending -> (qc_failed | qc_passed) -> ingestion_running -> indexed_ready -> stale -> archived`

- **cataloged**: source exists but no QC run yet.
- **qc_pending**: QC created, result pending.
- **qc_failed**: QC failed; source blocked.
- **qc_passed**: QC passed and eligible for ingestion.
- **ingestion_running**: ingestion/index pipeline running.
- **indexed_ready**: ingestion complete, candidate index available.
- **stale**: `revalidate_after < now()`; requires revalidation.
- **archived**: intentionally retired.

## 2) Data Model (V2)

### `source_books`
Canonical source record per book.
- identity: `id`, `source_id`, `title`, `domain`, `level_tags`
- lifecycle: `lifecycle_state`
- versioning: `pipeline_version`, `ocr_model_version`, `prompt_version`
- human override: `approved_by`, `approved_at`, `override_reason`
- freshness: `validated_at`, `revalidate_after`
- rollout/rollback: `active_index_version`, `candidate_index_version`, `rollout_state`

### `source_book_qc_runs`
QC run-level ledger.
- status: `pending|passed|failed`
- versioning + override + freshness fields repeated for traceability
- details blob: `details`

### `source_chapter_qc`
Chapter-level QC outcomes tied to a QC run.
- status: `pending|passed|failed|warning`
- scoring + findings per chapter
- freshness fields per chapter

### `source_ingestion_runs`
Ingestion/indexing run ledger.
- status: `queued|running|indexed_ready|failed|rolled_back`
- telemetry: `chunk_count`, `ingest_duration_ms`, `embed_cost_usd`, `index_cost_usd`
- rollout fields: `active_index_version`, `candidate_index_version`, `rollout_state`
- versioning fields mirrored for provenance

### `source_book_status` (projection table)
Serving/status projection for low-latency reads.
- computed dimensions: `qc_passed`, `indexed_ready`, `rollout_state`
- computed serving flag: `selectable = indexed_ready && qc_passed && rollout_state='active'`
- includes availability reason and latest telemetry/version/freshness metadata

## 3) API Contracts

### GET `/api/atom/sources`
- Primary source: `source_book_status`
- Returns source list with:
  - `availability` (`available|unavailable`)
  - `availability_reason`
  - `selectable`
  - lifecycle/rollout/QC/index fields
- Backward compatibility fallback: `atom_source_catalog` when V2 tables absent.

### POST `/api/atom/sources/qc-import`
- Auth required.
- Accepts JSON payload for book + QC run + chapter QC scaffold import.
- Upserts/creates `source_books`, writes `source_book_qc_runs`, optional `source_chapter_qc`, then refreshes projection.
- 503 if V2 relations are missing (migration not applied).

### GET `/api/atom/sources/status-summary`
- Auth required.
- Source: `source_book_status`.
- Returns:
  - `total`
  - `selectable`
  - `byLifecycle`
  - `byRollout`
- Safe zero fallback if V2 not present.

## 4) Revalidation Policy

- Every QC run can define `validated_at` + `revalidate_after`.
- A source becomes **stale** when `revalidate_after` is in the past.
- Projection carries freshness timestamps to API clients for UI badges + filtering.
- Planned scheduler can periodically transition stale records by policy.

## 5) Human Override Policy

- Override represented by `approved_by`, `approved_at`, `override_reason`.
- Overrides can unblock or force rollout transitions, but are fully auditable.
- Override fields are mirrored in projection for transparent serving context.

## 6) Versioning Fields

Version stamps are persisted across book/QC/ingestion/projection:
- `pipeline_version`
- `ocr_model_version`
- `prompt_version`

This enables reproducibility and forensic rollback by version tuple.

## 7) Rollback Serving Strategy

- `candidate_index_version` is produced by ingestion.
- `active_index_version` is only promoted when rollout state is activated.
- `rollout_state` values: `inactive|canary|active|rolled_back`.
- API serving guard uses projection `selectable`; only active rollout is selectable.
- Rollback = set `rollout_state='rolled_back'` and/or switch active index back.

## 8) Migration & Rollout Plan

1. Apply migration `008_atom_source_platform_v2.sql`.
2. Keep existing `atom_source_catalog` reads active (fallback path).
3. Start importing QC runs using `/api/atom/sources/qc-import`.
4. Start writing ingestion runs and projection refresh hooks.
5. Validate `/api/atom/sources` + `/status-summary` behavior in staging.
6. Promote rollout by setting `rollout_state='active'` only for validated sources.
7. Decommission fallback only after full V2 adoption (future phase).

## 9) Security / RLS

RLS enabled on all V2 tables.
- Authenticated read access.
- Authenticated write policies for scaffolding phase.
- Can be tightened to admin/service-role-only writes in hardening phase.
