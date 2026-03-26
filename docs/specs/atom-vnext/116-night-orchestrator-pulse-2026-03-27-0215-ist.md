# 116 — Night Orchestrator Pulse (2026-03-27 02:15 IST)

## Run summary
- `npm run -s test:atom:nightly-gates` ✅ PASS
  - Typecheck, lint, build, /atom route manifest, chat contracts, reliability, and dedup checks all passed.
  - Continue behavior + strict source-grounding insufficiency behavior remained green.
- `npm run -s test:auth:probe` ⚠️ FAIL
  - `error_code: invalid_credentials`
  - password grant still rejected for configured smoke user.

## Reliability/continuity focus (this run)
1. **Continuity lane kept healthy**
   - Full nightly gates succeeded with no regressions in continue/source-grounding/chat UX contract checks.
2. **Credentialed lane still blocked**
   - Auth probe failure persists, so login-dependent smoke confidence remains incomplete.

## Blocker
- Supabase password grant still returns `invalid_credentials` for current `E2E_EMAIL`/`E2E_PASSWORD` pair.

## Next fix attempt
1. Reset/rotate smoke user password in Supabase Auth for `E2E_EMAIL`.
2. Sync exact same credentials into:
   - local `.env.local` (`E2E_EMAIL`, `E2E_PASSWORD`)
   - CI secrets (`E2E_EMAIL`, `E2E_PASSWORD`)
3. Re-run:
   - `npm run -s test:auth:probe`
   - `E2E_BASE_URL=https://nucleuxacademy.io npm run -s test:smoke`

## Exit criteria
- Auth probe returns token success (2xx).
- Production smoke passes login flow end-to-end.
