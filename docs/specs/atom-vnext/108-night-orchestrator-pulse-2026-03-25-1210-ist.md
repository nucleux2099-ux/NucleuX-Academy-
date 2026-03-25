# 108 — Night Orchestrator Pulse (2026-03-25 12:10 IST)

## Run summary
- `npm run -s test:atom:nightly-gates` ✅ PASS
- `npm run -s test:auth:probe` ⚠️ FAIL (`invalid_credentials`)
- `npm run -s atom:sources:validate-sync-candidates` ✅ PASS

## Reliability/continuity focus (top tasks)
1. **Core reliability gate revalidation (non-credentialed path)**
   - Full lane includes typecheck/lint/build + route/chat/reliability/dedup checks.
   - Result: all green; `/atom` route present and continuity tests passing.

2. **Credentialed smoke lane + fallback continuity/source grounding task**
   - Auth probe still fails at password grant (`Invalid login credentials`).
   - Switched to fallback high-impact task (`atom:sources:validate-sync-candidates`) to preserve grounding pipeline confidence.
   - Result: candidate sync validation remains healthy (`discovered=36`, `published_flagged=36`, `indexed_ready_flagged=36`, `qc_signal_present=36`).

## Blocker
- Supabase smoke-user credentials are stale/mismatched for password grant.
- Failure signal:
  - `error_code: invalid_credentials`
  - `msg: Invalid login credentials`

## Required unblock steps
1. Reset/rotate smoke user password in Supabase Auth.
2. Update matching `E2E_EMAIL` + `E2E_PASSWORD` in:
   - local `.env.local`
   - CI secrets
3. Re-run:
   - `npm run -s test:auth:probe`
   - `npm run -s test:atom:nightly-gates:smoke-guarded`

## Exit criterion
- `test:auth:probe` returns token success.
- `test:atom:nightly-gates:smoke-guarded` exits 0.
