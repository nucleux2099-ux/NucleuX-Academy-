# 60) Night Orchestrator Pulse — 2026-03-17 01:00 IST

## Objective this cycle
Unblock overnight reliability gates by resolving smoke-login false negatives and confirming guarded checks remain green.

## Work completed
1. **Stabilized login wait semantics in smoke E2E** (`scripts/smoke-e2e.mjs`)
   - Replaced brittle `waitForFunction(done)` completion rule with explicit polling loop.
   - Login now exits only on concrete terminal states:
     - authenticated route reached
     - UI auth error surfaced
     - auth request failure observed
     - auth API rejection observed
     - hard timeout
   - Preserved and reused auth request/response diagnostics for timeout triage.

2. **Validated Supabase auth path independently**
   - Direct token grant check against `${NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password` using E2E credentials returned **HTTP 200** in ~1.2s.
   - Confirms backend auth path/credentials are valid in this environment.

3. **Re-ran core gates**
   - `npm run -s test:smoke` ✅ (all smoke steps passed with autostarted server)
   - `npm run -s typecheck` ✅
   - `npm run -s lint` ✅
   - `npm run -s build` ✅

## Noted follow-up (non-blocking)
During smoke, server logs show analytics insert warnings:
- `Could not find the table 'public.analytics_events' in the schema cache`

This does **not** block core `/atom` usability but indicates migration/feature-flag drift for analytics telemetry.

## Next fix candidate
- Add a guarded analytics fallback (no-op/queued logging) when `analytics_events` is absent, or ship the missing migration consistently across environments.
