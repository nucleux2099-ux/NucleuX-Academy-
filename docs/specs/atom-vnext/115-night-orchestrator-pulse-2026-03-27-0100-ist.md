# 115 — Night Orchestrator Pulse (2026-03-27 01:00 IST)

## Run summary
- `npm run -s test:atom:nightly-gates` ✅ PASS
  - Typecheck/Lint/Build/Route smoke/Chat contracts/Reliability/Dedup all passed.
  - Continue behavior and strict source-grounding checks remain green.
- `npm run -s atom:sources:validate-sync-candidates` ✅ PASS
  - `discovered=36`
  - `published_flagged=36`
  - `indexed_ready_flagged=36`
  - `qc_signal_present=36`
- `npm run -s test:auth:probe` ⚠️ FAIL
  - `error_code: invalid_credentials`
  - `msg: Invalid login credentials`

## Reliability/continuity focus (top tasks)
1. **Credentialed smoke lane restore (still highest impact)**
   - Password grant still failing for configured smoke user.
2. **Fallback continuity lane (kept healthy this run)**
   - Non-credentialed nightly gates + source-sync candidate validation passed.

## Blocker
- Supabase Auth password grant for smoke user returns `invalid_credentials`.

## Next fix attempt
1. In Supabase Auth dashboard, reset or rotate password for smoke account (`E2E_EMAIL`).
2. Immediately align the same pair in both places:
   - local `.env.local`: `E2E_EMAIL`, `E2E_PASSWORD`
   - CI secrets: `E2E_EMAIL`, `E2E_PASSWORD`
3. Re-run:
   - `npm run -s test:auth:probe`
   - `npm run -s test:atom:nightly-gates:smoke-guarded`

## Exit criteria
- Auth probe returns token success.
- Smoke-guarded nightly gates exit `0`.
