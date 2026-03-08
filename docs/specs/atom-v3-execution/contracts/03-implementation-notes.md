# ATOM v3 Phase 1 — Concise Implementation Notes

Date: 2026-03-08

## A) Freeze execution checklist

- [x] Baseline contract versions fixed (UX/BFF/API/source-schema)
- [x] Error envelope canonicalized in spec
- [x] N-1 compatibility policy defined
- [x] Source schema fallback expectation explicitly retained

## B) Immediate code alignment actions

1. **Centralize error envelope**
   - Introduce shared API helper and replace ad-hoc `{"error":"..."}` responses.

2. **Tag contract version in responses (optional but recommended)**
   - Add response metadata header or field (e.g., `x-atom-contract: 3.0.0`) for observability.

3. **Protect source fallback behavior**
   - Keep `source_book_status` primary + `atom_source_catalog` fallback until Phase 2 exit criteria.

4. **Contract test harness**
   - Add route-level tests for:
     - `POST /api/atom/tasks`
     - `GET /api/atom/sources`
     - SSE failure event payload shape

## C) Exit criteria to move beyond freeze

- No uncategorized error payloads in ATOM routes
- 100% contract tests passing on baseline snapshots
- Production telemetry confirms negligible N-1 fallback dependency before removal planning

## D) References

- `docs/specs/ATOM_V2_ORCHESTRATOR_RFC.md`
- `docs/specs/ATOM_SOURCE_PLATFORM_V2_FINAL.md`
- `src/app/api/atom/tasks/route.ts`
- `src/app/api/atom/sources/route.ts`
- `supabase/migrations/008_atom_source_platform_v2.sql`
