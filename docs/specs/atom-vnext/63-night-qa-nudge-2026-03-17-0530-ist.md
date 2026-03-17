# 63) Night QA Nudge — 2026-03-17 05:30 IST

## Scope checked
- `/atom` deployment/build route presence
- continue continuity behavior
- selected-book insufficiency behavior
- quick technical gates (`typecheck/lint/build/route/chat-contracts/reliability/dedup`)

## Results
- `test:atom:nightly-gates:smoke-guarded` ✅
  - `typecheck` ✅
  - `lint` ✅
  - `build` ✅
  - `/atom` route in build output ✅ (`○ /atom`)
  - `test:atom:route-smoke` ✅
  - `test:atom:chat-contracts` ✅
  - `test:atom:reliability` ✅
    - continue continuity ✅
    - strict source insufficiency language ✅
  - `test:atom:dedup` ✅

## Quality gap found
- Guarded smoke still skipped in nightly gate path when `E2E_EMAIL/E2E_PASSWORD` are not exported to runtime shell.

## Concrete fix executed immediately
Added direct Supabase auth probe to isolate login blocker before UI smoke:
- New script: `scripts/supabase-auth-probe.mjs`
- New npm command: `npm run -s test:auth:probe`

### Probe outcome (current env)
- `settings` endpoint reachable ✅
- password-grant token call responds quickly but returns `invalid_credentials` ❌
- This reframes blocker from “network stall” to “credential mismatch / stale E2E user”.

## Next nudge for orchestrator
1. Rotate/reset the E2E account password in the same Supabase project used by `.env.local`.
2. Update `.env.local` E2E credentials to match reset user.
3. Run: `npm run -s test:auth:probe` (must return 2xx).
4. Re-run: `npm run -s test:atom:nightly-gates:smoke-guarded` and require login smoke pass.
