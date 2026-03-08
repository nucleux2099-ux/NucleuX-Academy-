# ATOM v3 — Compatibility Policy (N-1)

Status: **Adopted for Phase 1 freeze**  
Effective date: **2026-03-08**

## 1) Policy statement

ATOM execution contracts follow **N-1 compatibility**:
- Server release `N` must remain compatible with clients on `N` and previous minor (`N-1`).
- Contract-breaking changes require major version bump.

For this freeze:
- Current line: `v3.0.x`
- Must support: `v3.0.x` (N) and `v2.x` bridge expectations where explicitly documented (N-1 bridge).

## 2) What must stay compatible

### API/BFF
- Existing request fields remain accepted (unless explicitly deprecated with sunset date).
- Existing response fields/events remain available with same semantics.
- Additive optional fields are allowed.

### Source schema
- Read path must prefer `source_book_status` (v2 platform)
- Fallback read compatibility to `atom_source_catalog` retained for N-1 bridge
- Write paths must not require dropping old tables in Phase 1

### UX
- Timeline and terminal statuses remain semantically stable
- Client can ignore unknown additive event types/fields safely

## 3) Deprecation protocol

Any field/enum/endpoint deprecation requires:
1. Mark as deprecated in contract docs
2. Keep behavior for at least one minor release window
3. Add telemetry for active usage
4. Remove only after documented sunset and migration notes

## 4) Breaking-change checklist (requires major)

- Removed/renamed JSON keys
- Changed enum values/meaning
- Changed terminal task state semantics
- Incompatible SSE event ordering assumptions
- Mandatory migration removing N-1 fallback path

## 5) Implementation note

Add CI contract checks:
- Snapshot tests for representative responses/events
- Schema guard tests for source projection + fallback
- Lint rule/code review gate: no silent contract breaks in `v3.0.x`
