# 59) Night QA Nudge — 2026-03-17 00:30 IST

## Scope checked
- `/atom` route/build presence
- continue continuity behavior
- selected-book insufficiency behavior
- quick technical gates (`typecheck/build/route/reliability/dedup`) + smoke login

## Results
- `typecheck` ✅
- `build` ✅
- `/atom` route in build output ✅ (`○ /atom`)
- `test:atom:route-smoke` ✅
- `test:atom:reliability` ✅
  - continue continuity ✅
  - strict source insufficiency language ✅
- `test:atom:dedup` ✅
- `continue-prompt.test.ts` ✅
- `prompt-assembly-v3.test.ts` ✅
- `test:smoke` ❌ (login still stalls)

## Concrete fix executed immediately
Updated `scripts/smoke-e2e.mjs` auth instrumentation to emit actionable diagnostics when login hangs:
- capture auth request events timeline
- track pending auth requests with pending duration
- include recent auth network summary in failure message

### New observed signal (post-fix)
Smoke now fails with explicit pending endpoint:
- `Auth API: request seen but no auth response captured.`
- `Pending: POST https://qwkuoygcvkbomunazpce.supabase.co/auth/v1/token?grant_type=password ...`

Artifacts:
- `artifacts/smoke-e2e/2026-03-16T19-03-23-390Z-login.png`
- `artifacts/smoke-e2e/2026-03-16T19-03-23-390Z-login.html`

## Current blocker
E2E login submits and issues Supabase token request, but browser never sees a response event before timeout; likely environment/auth backend mismatch or stalled network path.

## Next nudge for orchestrator
1. Validate Supabase project + keys parity in `.env.local` against E2E account origin (same project as seeded user).
2. Run a direct credential check against Supabase token endpoint (outside UI) to confirm response latency/status.
3. Re-seed/reset E2E user in this exact Supabase project.
4. Re-run `npm run -s test:atom:nightly-gates:smoke-guarded`; only commit/push after smoke login goes green.
