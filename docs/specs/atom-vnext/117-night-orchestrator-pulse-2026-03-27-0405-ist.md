# 117 — Night Orchestrator Pulse (2026-03-27 04:05 IST)

## Run summary
- `npm run -s test:atom:nightly-gates` ✅ PASS
  - Typecheck, lint, build, /atom route manifest, chat contracts, reliability, and dedup all green.
  - Continue behavior and strict source-grounding insufficiency behavior remain green.
- `npm run -s test:auth:probe` ⚠️ FAIL
  - `error_code: invalid_credentials`
- `npm run -s test:atom:nightly-gates:smoke-guarded` ⚠️ FAIL (expected due auth)
  - Non-credentialed gates passed.
  - Credentialed smoke aborted after auth probe failure.

## Reliability/continuity focus (top tasks)
1. **Preserve /atom reliability lane**
   - Kept nightly gates fully passing to avoid regressions.
2. **Restore credentialed continuity lane**
   - Reconfirmed auth mismatch is the single active blocker for login smoke.

## Blocker
- Supabase password grant rejects configured smoke credentials (`invalid_credentials`) for `E2E_EMAIL`/`E2E_PASSWORD`.

## Next fix attempt (precise)
1. In Supabase Auth dashboard, set a fresh known password for smoke user matching `E2E_EMAIL`.
2. Immediately align credentials in both places (same exact pair):
   - local `.env.local`: `E2E_EMAIL`, `E2E_PASSWORD`
   - CI secrets: `E2E_EMAIL`, `E2E_PASSWORD`
3. Re-run in order:
   - `npm run -s test:auth:probe`
   - `E2E_BASE_URL=https://nucleuxacademy.io npm run -s test:smoke`
   - `npm run -s test:atom:nightly-gates:smoke-guarded`

## Exit criteria
- Auth probe returns token success (2xx).
- Production smoke passes login flow end-to-end.
- Smoke-guarded nightly gates exit 0.
