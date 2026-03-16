# 56) Night Orchestrator Pulse — 2026-03-16 07:00 IST

## Objective this cycle
Improve overnight reliability signal quality and isolate login smoke blocker without regressing ATOM continuity checks.

## Work completed
1. **Hardened login submit detection in smoke E2E** (`scripts/smoke-e2e.mjs`)
   - Submit button targeting now supports `button[type="submit"]` (not only text-based “Sign In”).
   - Pre-submit readiness gate now validates actual submit button enabled state even when label text is absent.

2. **Improved login failure state truthfulness** (`scripts/smoke-e2e.mjs`)
   - Outcome state now reflects real pending-submit behavior by checking actual submit control.
   - Blocker now reports correctly as:
     - `login request still pending`
     - instead of ambiguous `login returned without redirect` in this failure mode.

## Validation run
- `set -a; source .env.local; set +a; npm run -s test:atom:nightly-gates:smoke-guarded`
  - `typecheck` ✅
  - `lint` ✅
  - `build` ✅
  - `route smoke` ✅
  - `reliability` ✅ (continue continuity + strict source insufficiency)
  - `dedup` ✅
  - `smoke e2e` ❌ at **Login**:
    - `Login did not complete. Path: /login. State: login request still pending. Error: none. Auth API: no token response observed.`
    - Artifacts captured:
      - `artifacts/smoke-e2e/2026-03-16T01-33-00-185Z-login.png`
      - `artifacts/smoke-e2e/2026-03-16T01-33-00-185Z-login.html`

## Blocker
Auth submit enters pending/disabled state but no observed token API response and no redirect, indicating auth backend/env mismatch or stalled client auth execution path.

## Next fix attempt
1. Add explicit login network tap for broader auth endpoints (`/auth/v1/*`, `/api/auth/*`) + request-failure capture to distinguish "no request fired" vs "request failed".
2. Validate E2E credential/backend parity (current env vs seeded account) and refresh test account if stale.
3. Re-run guarded gates; commit/push only after smoke login passes.
