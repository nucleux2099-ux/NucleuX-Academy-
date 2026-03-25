# 111 — Night Orchestrator Pulse (2026-03-26 04:07 IST)

## Run summary
- `npm run -s test:atom:nightly-gates` ✅ PASS
- `npm run -s atom:sources:validate-sync-candidates` ✅ PASS
- `npm run -s test:atom:nightly-gates:smoke-guarded` ⚠️ FAIL (`invalid_credentials` during `test:auth:probe`)

## Reliability/continuity focus (top tasks)
1. **Core reliability + continuity revalidation**
   - `/atom` route remains present in build manifest.
   - Continue-memory context reuse and strict source-insufficiency behavior are still green.
   - Continue dedup window checks are still green.

2. **Source-grounding continuity fallback (while smoke lane is blocked)**
   - Revalidated Vyasa sync candidate signal path.
   - QC counters remain healthy (`discovered=36`, `published_flagged=36`, `indexed_ready_flagged=36`, `qc_signal_present=36`).

## Blocker
- Credentialed smoke lane remains blocked by Supabase password grant failure:
  - `error_code: invalid_credentials`
  - `msg: Invalid login credentials`

## Next fix attempt
1. Reset/rotate Supabase smoke-user password.
2. Update identical `E2E_EMAIL` + `E2E_PASSWORD` in:
   - local `.env.local`
   - CI secret store
3. Re-run in order:
   - `npm run -s test:auth:probe`
   - `npm run -s test:atom:nightly-gates:smoke-guarded`

## Exit criterion
- `test:auth:probe` returns token success.
- `test:atom:nightly-gates:smoke-guarded` exits 0.
