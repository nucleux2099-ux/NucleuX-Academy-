# 109 — Night Orchestrator Pulse (2026-03-26 00:00 IST)

## Run summary
- `npm run -s test:atom:nightly-gates` ✅ PASS
- `npm run -s test:atom:nightly-gates:smoke-guarded` ⚠️ FAIL (`invalid_credentials` during `test:auth:probe`)
- `npm run -s atom:sources:validate-sync-candidates` ✅ PASS

## Reliability/continuity focus (top tasks)
1. **Core reliability + continuity gate revalidation**
   - Full lane (typecheck/lint/build + route/chat/reliability/dedup) is green.
   - `/atom` route present; continue behavior and strict source insufficiency checks pass.

2. **Credentialed smoke lane with fallback source-grounding assurance**
   - Smoke-guarded lane failed at Supabase password grant (`invalid_credentials`).
   - Switched to fallback continuity task to keep source pipeline confidence:
     `atom:sources:validate-sync-candidates` passed with full QC signals.

## Blocker
- Supabase smoke-user credentials are stale/mismatched for password grant.
- Failure signal:
  - `error_code: invalid_credentials`
  - `msg: Invalid login credentials`

## Next fix attempt
1. Reset/rotate smoke user password in Supabase Auth.
2. Update matching `E2E_EMAIL` + `E2E_PASSWORD` in:
   - local `.env.local`
   - CI secrets
3. Re-run:
   - `npm run -s test:auth:probe`
   - `npm run -s test:atom:nightly-gates:smoke-guarded`

## Exit criterion
- `test:auth:probe` returns token success.
- `test:atom:nightly-gates:smoke-guarded` exits 0.
