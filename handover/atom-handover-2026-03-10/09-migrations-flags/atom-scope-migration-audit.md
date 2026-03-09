---
title: "Atom Scope Migration Audit"
summary: "Scope migration audit notes and verification details."
audience: "engineer"
status: "implemented"
source_path: "docs/atom-scope-migration-audit.md"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "A"
llm_handover_relevance: "high"
---

# ATOM Scope Migration Audit (Legacy Thread Remaps)

## Purpose
Audit and optionally remap legacy `atom_sessions.thread_id` values to canonical Phase A scoped thread IDs (`scope:<scopeKey>`).

## Tool
- Script: `scripts/atom-scope-migration-audit.ts`
- NPM script: `npm run atom:scope:audit`

## Requirements
Environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Modes
### 1) Audit-only (default)
```bash
npm run atom:scope:audit
```
Outputs:
- JSON report to `reports/atom-scope-migration-audit-<timestamp>.json`
- console summary with remap plan

### 2) Apply remaps
```bash
npm run atom:scope:audit -- --apply
```
Behavior:
- updates legacy `thread_id` values to canonical scoped thread IDs
- only updates rows still matching expected legacy thread id (safe conditional update)

## Report format
Each remap item includes:
- `sessionId`
- `userId`
- `roomId`
- `legacyThreadId`
- `canonicalThreadId`
- `updatedAt`

Top-level stats:
- `totalRows`
- `legacyRows`
- `plannedRemaps`
- `applyMode`
- `applied`

## Notes
- Current canonical reconstruction uses default web channel fallback (`chan:web:peer:<userId>`) for legacy rows with insufficient envelope metadata.
- For channel-rich remap precision, run targeted channel migration jobs with explicit envelope mapping before apply.
- Keep audit JSON artifacts for rollback/change-control traceability.
