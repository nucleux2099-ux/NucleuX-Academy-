# ATOM Night QA Nudge — 2026-03-20 01:30 IST

## What was verified now
- `npm run -s test:deploy:health` → PASS on production (`https://nucleuxacademy.io`), including `200 /atom`.
- `npm run -s test:atom:route-smoke` → PASS (`/atom` manifest route exists).
- `npm run -s test:atom:chat-contracts` → PASS
  - continue-style follow-up remains on prior topic
  - strict source-grounding insufficiency language present when sources are missing
- `npm run -s test:atom:reliability` → PASS (continue continuity + insufficiency checks)
- `npm run -s typecheck && npm run -s build` → PASS
- `npm run -s test:auth:probe` → FAIL (`400 invalid_credentials`)

## Immediate gap
Credentialed smoke path remains blocked by invalid Supabase smoke credentials.

## Concrete fix task (execute first)
1. Reset smoke user password in Supabase Auth dashboard.
2. Update `E2E_EMAIL`/`E2E_PASSWORD` to the same pair in:
   - local `.env.local`
   - CI secrets
3. Re-run in order:
   - `npm run -s test:auth:probe`
   - `E2E_BASE_URL=https://nucleuxacademy.io npm run -s test:smoke`
   - `npm run -s test:atom:nightly-gates:smoke-guarded`
4. Record new credential fingerprints from logs and attach to overnight report.

## Current repo state
- Branch: `master`
- HEAD: `8b12381` (`docs(atom-vnext): add 01:00 IST overnight orchestrator pulse`)
