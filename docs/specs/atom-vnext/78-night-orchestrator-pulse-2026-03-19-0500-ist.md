# 78) Night Orchestrator Pulse — 2026-03-19 05:00 IST

## Scope this run
- Re-checked overnight reliability/continuity/source-grounding/chat UX gates.
- Improved auth preflight diagnosability so stale-secret incidents are faster to resolve without guesswork.

## Highest-impact task(s)
1. Keep nightly gate signal trustworthy while credentialed auth is blocked.
2. Improve continuity/debug handoff for auth failures (clear credential identity signal + deterministic next action).

## Work completed
- Updated `scripts/supabase-auth-probe.mjs` to print:
  - masked probe email
  - short SHA fingerprints for email/password (safe compare signal across local vs CI)
  - explicit `invalid_credentials` remediation hint
- Re-ran validation:
  - `npm run -s test:auth:probe` => ❌ `400 invalid_credentials` (with new diagnostics)
  - `npm run -s test:atom:nightly-gates:smoke-guarded` => core gates ✅ pass; auth preflight ❌ fails; smoke correctly aborted
- Committed and pushed:
  - `72a07d3 chore(auth-probe): add credential fingerprints and invalid-credential next-step hint`

## Current blocker
- Supabase password grant still returns `invalid_credentials` for the configured smoke account.
- Platform/auth endpoint reachability remains healthy.

## Next fix attempt (priority)
1. Reset/rotate the smoke user password in Supabase Auth.
2. Update `E2E_EMAIL`/`E2E_PASSWORD` in `.env.local` and CI secrets to the same pair.
3. Re-run:
   - `npm run -s test:auth:probe`
   - `E2E_BASE_URL=https://nucleuxacademy.io npm run -s test:smoke`
   - `npm run -s test:atom:nightly-gates:smoke-guarded`
4. If auth still fails, compare the printed email/password SHA fingerprints between local and CI runs to confirm secret parity before deeper debugging.
