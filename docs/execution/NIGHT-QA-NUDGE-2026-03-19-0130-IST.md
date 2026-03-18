# Night QA Nudge — 2026-03-19 01:30 IST

## Audit snapshot
- Deployment state (`vercel ls`): latest production deployment is **Ready**
  - `https://nucleux-academy-lfa3p80qr-aditya-chandrabhatlas-projects.vercel.app`
- Route behavior (`HEALTH_BASE_URL=https://nucleuxacademy.io npm run -s test:deploy:health`):
  - `/atom` => **200 PASS**
  - auth-gated routes (`/desk`, `/library`, `/mcqs`) => expected **307** redirects
- Continuity check: `test:atom:chat-contracts` and `scripts/atom-reliability-smoke.ts` both PASS for `continue` staying on topic.
- Source-grounding insufficiency check: PASS (strict selected-source insufficiency instruction present).
- Technical gates: `npm run -s test:atom:nightly-gates` => PASS.

## Gap found
- Credentialed auth probe still failing:
  - `npm run -s test:auth:probe` => `400 invalid_credentials`
  - This blocks credentialed production smoke confidence.

## Immediate concrete fix task (executed now as handoff task)
Owner: Orchestrator / release owner

1. Rotate or re-provision smoke test account credentials in `.env.local`:
   - `E2E_EMAIL`
   - `E2E_PASSWORD`
2. Confirm account is active and password is valid in Supabase Auth.
3. Re-run:
   - `npm run -s test:auth:probe`
   - `E2E_BASE_URL=https://nucleuxacademy.io npm run -s test:smoke`
4. Save artifacts and append results to:
   - `docs/execution/NUC-7-production-smoke-2026-03-18.md`

## Exit criterion
- `test:auth:probe` returns token 2xx and production smoke completes without login failure.
