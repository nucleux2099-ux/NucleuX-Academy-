# 57) Night QA Nudge — 2026-03-16 07:30 IST

## Audit scope
- /atom route state
- continue continuity behavior
- selected-book insufficiency behavior
- quick technical checks

## Verification run
- `npm run -s test:atom:nightly-gates:smoke-guarded`
  - typecheck ✅
  - lint ✅
  - build ✅
  - /atom route smoke ✅
  - continue continuity ✅
  - source insufficiency guard ✅
  - dedup ✅
  - smoke login ❌ (`Auth API: no token response observed` in pre-fix run)

## Immediate fix executed
Updated `scripts/smoke-e2e.mjs` login instrumentation to:
- watch broader auth endpoints (`/auth/v1/*`, `/api/auth/*`)
- capture request-failure events
- distinguish:
  - no auth request observed
  - auth request seen but no response captured
  - explicit request failure

## Post-fix check
- `npm run -s test:smoke` still fails at login, but now emits upgraded signal:
  - `Auth API: request seen but no auth response captured.`

## Current blocker
Auth flow remains pending/disabled with no token response despite request emission (likely backend/env parity or stalled client auth path).

## Next high-impact nudge
Validate E2E auth backend parity now:
1. Confirm `.env.local` auth endpoint/project key matches the account used by `E2E_EMAIL`.
2. Re-seed or reset E2E user credentials for that exact backend.
3. Re-run `npm run -s test:atom:nightly-gates:smoke-guarded` and require smoke login green before commit/push.
