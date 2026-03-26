# 112 — Night Orchestrator Pulse (2026-03-26 06:00 IST)

## Run summary
- `npm run -s test:atom:nightly-gates` ✅ PASS
- `npm run -s atom:sources:validate-sync-candidates` ✅ PASS
- `npm run -s test:auth:probe` ⚠️ FAIL (`invalid_credentials`)
- `npm run -s test:atom:nightly-gates:smoke-guarded` ⚠️ did not complete in run window (process SIGKILL after long build phase); auth probe confirms same credential blocker

## Reliability/continuity focus (top tasks)
1. **Core reliability + continuity revalidation**
   - `/atom` route still present in build manifest.
   - Continue-memory context reuse checks still green.
   - Strict source-insufficiency language checks still green.
   - Continue dedup-window checks still green.

2. **Source-grounding continuity fallback**
   - Vyasa sync candidate validator still healthy.
   - QC counters unchanged and healthy (`discovered=36`, `published_flagged=36`, `indexed_ready_flagged=36`, `qc_signal_present=36`).

## Blocker
- Supabase smoke-user password grant still failing.
  - `error_code: invalid_credentials`
  - `msg: Invalid login credentials`

## Next fix attempt
1. Reset/rotate Supabase smoke-user password.
2. Update matching `E2E_EMAIL` + `E2E_PASSWORD` in:
   - local `.env.local`
   - CI secret store
3. Re-run in order:
   - `npm run -s test:auth:probe`
   - `npm run -s test:atom:nightly-gates:smoke-guarded`

## Exit criterion
- `test:auth:probe` returns token success.
- `test:atom:nightly-gates:smoke-guarded` exits 0.
