# 114 — Night Orchestrator Pulse (2026-03-27 00:00 IST)

## Run summary
- `npm run -s atom:sources:validate-sync-candidates` ✅ PASS
  - `discovered=36`
  - `published_flagged=36`
  - `indexed_ready_flagged=36`
  - `qc_signal_present=36`
- `npm run -s test:auth:probe` ⚠️ FAIL
  - `error_code: invalid_credentials`
  - `msg: Invalid login credentials`
- `npm run -s test:atom:nightly-gates` ✅ PASS
  - Typecheck/Lint/Build/Route smoke/Chat contracts/Reliability/Dedup all passed.
  - Continue-behavior and source-grounding checks are green.

## Reliability/continuity focus (top tasks)
1. **Credentialed smoke lane restore (highest impact)**
   - Auth probe is still failing with stale or mismatched smoke credentials.
2. **Fallback continuity validation (completed this run)**
   - Non-credentialed nightly gates re-run passed end-to-end to keep `/atom` stable while smoke creds are fixed.

## Blocker
- Supabase smoke-user password grant failure persists (`invalid_credentials`).

## Next fix attempt
1. Rotate/reset smoke user password in Supabase Auth.
2. Update both local and CI to the same pair:
   - `.env.local`: `E2E_EMAIL`, `E2E_PASSWORD`
   - CI secret store: matching `E2E_EMAIL`, `E2E_PASSWORD`
3. Re-run:
   - `npm run -s test:auth:probe`
   - `npm run -s test:atom:nightly-gates:smoke-guarded`

## Exit criteria
- Auth probe returns token success.
- Smoke-guarded nightly gates exit `0`.
