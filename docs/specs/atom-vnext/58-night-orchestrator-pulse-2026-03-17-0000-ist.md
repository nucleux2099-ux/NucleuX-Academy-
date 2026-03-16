# 58) Night Orchestrator Pulse — 2026-03-17 00:00 IST

## Objective this cycle
Reduce false-negative smoke failures and preserve overnight continuity by making E2E smoke self-sufficient when app server is down.

## Work completed
1. **Hardened smoke runtime bootstrap** (`scripts/smoke-e2e.mjs`)
   - Added reachability preflight for `${BASE_URL}/login`.
   - Added optional autostart (`E2E_AUTOSTART_SERVER`, default enabled) that launches `next start` on target host/port when server is unavailable.
   - Added server lifecycle cleanup (SIGTERM/SIGKILL fallback) on both pass/fail exits.

2. **Validated guarded gates end-to-end**
   - Command run:
     - `set -a; source .env.local; set +a; npm run -s test:atom:nightly-gates:smoke-guarded`
   - Result:
     - `typecheck` ✅
     - `lint` ✅
     - `build` ✅
     - `route smoke` ✅
     - `reliability` ✅
     - `dedup` ✅
     - `smoke e2e` ❌ at Login (auth flow still pending)

## Current blocker
Smoke no longer fails due to missing server, but login remains blocked:
- Error: `Login did not complete. Path: /login. State: login request still pending. Error: none. Auth API: request seen but no auth response captured.`
- Artifacts:
  - `artifacts/smoke-e2e/2026-03-16T18-32-25-238Z-login.png`
  - `artifacts/smoke-e2e/2026-03-16T18-32-25-238Z-login.html`

Interpretation: submit action triggers auth request tracking, but no observable auth response reaches client; likely credential/env mismatch, auth callback misconfiguration, or stalled backend auth path.

## Next fix attempt
1. Add explicit network/event logging around auth responses (status + endpoint + timing) to distinguish timeout vs silent redirect/callback failure.
2. Verify `.env.local` Supabase/auth variables match seeded E2E account environment.
3. Re-seed/reset E2E account credentials and re-run smoke login in isolation.
4. Re-run full guarded gates; commit/push only after smoke login passes.
