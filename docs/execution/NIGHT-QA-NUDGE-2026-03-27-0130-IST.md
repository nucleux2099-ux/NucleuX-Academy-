# Night QA Nudge — 2026-03-27 01:30 IST

## Audit snapshot
- Deployment state (`vercel ls --yes`): latest production deployment is **Ready**
  - `https://nucleux-academy-lfa3p80qr-aditya-chandrabhatlas-projects.vercel.app`
- Route behavior (`npm run -s test:deploy:health`):
  - `/atom` => **200 PASS**
  - auth-gated routes (`/desk`, `/library`, `/mcqs`) => expected **307** redirects
- Continuity checks:
  - `npm run -s test:atom:chat-contracts` => PASS (4/4)
  - `npm run -s test:atom:reliability` => PASS (`continue` stays on-topic)
- Source grounding insufficiency behavior:
  - Covered in chat contracts + reliability checks => PASS
- Technical checks:
  - `npm run -s typecheck` => PASS
  - `npm run -s build` => PASS
  - Route manifest includes `○ /atom` and all `api/atom/*` session endpoints.

## Quality gap detected
- Credentialed auth probe is still failing:
  - `npm run -s test:auth:probe` => `400 invalid_credentials`
  - This blocks confidence in login-dependent production smoke paths.

## Immediate concrete fix task (created now)
Owner: Orchestrator / release owner

1. In Supabase Auth dashboard, locate smoke user (`E2E_EMAIL`) and reset password.
2. Update `.env.local` values in repo (local) to the same valid pair:
   - `E2E_EMAIL`
   - `E2E_PASSWORD`
3. Update CI secret(s) to same pair (if smoke runs in CI).
4. Re-run:
   - `npm run -s test:auth:probe`
   - `E2E_BASE_URL=https://nucleuxacademy.io npm run -s test:smoke`
5. Append output + artifacts to `docs/execution/NUC-7-production-smoke-2026-03-18.md`.

## Exit criterion
- `test:auth:probe` returns token (2xx)
- `test:smoke` passes end-to-end login flow against production
