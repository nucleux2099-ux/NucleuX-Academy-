# 77) Night Orchestrator Pulse — 2026-03-19 04:10 IST

## Scope this run
- Re-checked overnight reliability/continuity/source-grounding/chat UX gates.
- Focused fallback hardening while credentialed auth remains blocked.

## Highest-impact task(s)
1. Keep nightly gate signal trustworthy (non-credentialed gates + guarded credential preflight).
2. Reduce false auth failures due accidental secret formatting drift.

## Work completed
- Re-ran `test:atom:nightly-gates:smoke-guarded` end-to-end.
  - typecheck/lint/build/route-smoke/chat-contracts/reliability/dedup => ✅ PASS
  - credential preflight (`test:auth:probe`) => ❌ FAIL (`invalid_credentials`)
- Hardened credential handling:
  - `scripts/supabase-auth-probe.mjs`: trim `E2E_EMAIL`/`E2E_PASSWORD` before token probe; warn if whitespace was present.
  - `scripts/smoke-e2e.mjs`: same trim+warning behavior before login run.
- Committed and pushed:
  - `1e4a4bf chore(smoke): trim E2E credentials before auth/login probes`

## Current blocker
- Supabase password grant still fails with `400 invalid_credentials` after trimming.
- Infra path is healthy (`/auth/v1/settings` returns 200).
- Remaining issue is account secret validity (stale/reset mismatch) rather than transport or route health.

## Next fix attempt (priority)
1. Reset/rotate smoke account password in Supabase Auth dashboard.
2. Update both local `.env.local` and CI secret store with the new `E2E_EMAIL`/`E2E_PASSWORD` pair.
3. Re-run, in order:
   - `npm run -s test:auth:probe`
   - `E2E_BASE_URL=https://nucleuxacademy.io npm run -s test:smoke`
   - `npm run -s test:atom:nightly-gates:smoke-guarded`
4. Attach green output artifacts to release thread and mark overnight QA full-green.
