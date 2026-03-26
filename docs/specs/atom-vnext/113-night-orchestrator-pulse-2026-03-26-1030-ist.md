# 113 — Night Orchestrator Pulse (2026-03-26 10:30 IST)

## Run summary
- `npm run -s atom:sources:validate-sync-candidates` ✅ PASS
- `npm run -s test:auth:probe` ⚠️ FAIL (`invalid_credentials`)
- `npm run -s test:atom:nightly-gates` ✅ core gate checks observed PASS (route/reliability/dedup/contracts), but build pipeline run exceeded this orchestrator execution window before clean process exit.

## Reliability/continuity focus (top tasks)
1. **Credentialed smoke lane unblocking (highest impact)**
   - Reconfirmed Supabase password grant failure with current smoke credentials.
   - Existing failure signature unchanged (`error_code: invalid_credentials`).

2. **Source-grounding continuity fallback**
   - Revalidated Vyasa sync-candidate QC signals remain healthy:
     - `discovered=36`
     - `published_flagged=36`
     - `indexed_ready_flagged=36`
     - `qc_signal_present=36`

## Blocker
- Supabase smoke-user credentials are stale/mismatched for password grant.
- Failure signal:
  - `error_code: invalid_credentials`
  - `msg: Invalid login credentials`

## Next fix attempt
1. Reset/rotate smoke user password in Supabase Auth.
2. Update matching `E2E_EMAIL` + `E2E_PASSWORD` in:
   - local `.env.local`
   - CI secret store
3. Re-run in order:
   - `npm run -s test:auth:probe`
   - `npm run -s test:atom:nightly-gates:smoke-guarded`

## Exit criterion
- `test:auth:probe` returns token success.
- `test:atom:nightly-gates:smoke-guarded` exits 0.
