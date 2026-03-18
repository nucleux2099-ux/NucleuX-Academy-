# 76) Night Orchestrator Pulse — 2026-03-19 02:00 IST

## Scope this run
- Re-verify overnight reliability/continuity/source-grounding/chat UX gates.
- Remove false-green path where credentialed smoke was skipped due shell-only env checks.
- Re-test credentialed auth readiness.

## Highest-impact task(s)
1. **Reliability correctness:** ensure `test:atom:nightly-gates:smoke-guarded` reads `.env.local` and does not silently skip smoke checks when credentials are present outside shell env.
2. **Release continuity:** keep credentialed auth probe as explicit precondition before running expensive smoke.

## Changes made
- Added script: `scripts/nightly-gates-smoke-guarded.mjs`
  - Loads `.env.local` via `dotenv`.
  - Runs `test:atom:nightly-gates` first.
  - Checks E2E credentials from resolved env.
  - Runs `test:auth:probe` as hard preflight.
  - Runs `test:smoke` only when auth probe passes.
- Updated `package.json`:
  - `test:atom:nightly-gates:smoke-guarded` now points to the new node script.

## Validation executed
1. `npm run -s test:atom:nightly-gates:smoke-guarded`
   - typecheck/lint/build/route-smoke/chat-contracts/reliability/dedup => ✅ PASS
   - auth preflight => ❌ FAIL (`400 invalid_credentials`)
   - smoke correctly aborted (no false skip)
2. `npm run -s test:deploy:health` (earlier in cycle) => ✅ PASS for route/auth-boundary behavior.

## Current blocker
- **Credentialed auth remains blocked** by stale/invalid E2E account credentials (`invalid_credentials`).
- Infra reachability is healthy (`/auth/v1/settings` and deploy health are green).

## Next fix attempt
1. Rotate/reset smoke account password in Supabase Auth.
2. Update `E2E_EMAIL` / `E2E_PASSWORD` in `.env.local` and CI secrets.
3. Re-run:
   - `npm run -s test:auth:probe`
   - `E2E_BASE_URL=https://nucleuxacademy.io npm run -s test:smoke`
   - `npm run -s test:atom:nightly-gates:smoke-guarded`
4. Attach fresh green artifacts to release thread.
