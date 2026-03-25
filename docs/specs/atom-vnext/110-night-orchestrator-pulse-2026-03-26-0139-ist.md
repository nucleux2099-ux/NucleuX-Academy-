# 110 — Night Orchestrator Pulse (2026-03-26 01:39 IST)

## Run summary
- `npm run -s test:atom:nightly-gates` ✅ PASS
- `npm run -s test:atom:nightly-gates:smoke-guarded` ⚠️ FAIL (`invalid_credentials` during `test:auth:probe`)
- `npm run -s atom:sources:validate-sync-candidates` ✅ PASS

## Reliability/continuity focus (top tasks)
1. **Core reliability + continuity revalidation**
   - Full nightly gates lane remains green (build/route/continue-context/strict source insufficiency/dedup).
   - `/atom` route and continue behavior remain regression-free.

2. **Credentialed smoke lane triage + continuity fallback**
   - Re-ran smoke-guarded gates; auth probe still fails at Supabase password grant.
   - Switched to source-grounding continuity fallback to preserve overnight momentum.

## Blocker
- Supabase smoke-user credentials are stale/mismatched for password grant.
- Failure signal:
  - `error_code: invalid_credentials`
  - `msg: Invalid login credentials`

## Next fix attempt
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
