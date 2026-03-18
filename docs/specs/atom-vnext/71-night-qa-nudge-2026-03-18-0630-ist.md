# 71) Night QA Nudge — 2026-03-18 06:30 IST

## Scope audited
- Deployment/build health and `/atom` route behavior
- Chat continuity on follow-up `continue`
- Source grounding against selected books + insufficiency fallback
- Quick technical gates (`typecheck`/`build` + atom nightly gates)
- Live auth smoke readiness

## Scorecard
- **Deployment/build state:** ✅ PASS  
  - `npm run -s test:atom:nightly-gates` passed end-to-end (includes `typecheck`, `build`, route + contracts + reliability + dedup).
- **`/atom` route behavior:** ✅ PASS  
  - Build route map includes `○ /atom`; route smoke test passed.
- **Chat continuity (`continue` stays on topic):** ✅ PASS  
  - Contract + reliability checks passed (`continue` resolves retrieval to prior user topic).
- **Source grounding + insufficiency reporting:** ✅ PASS  
  - Contract + reliability checks passed (`No relevant content... selected books do not contain enough support...`).
- **Live login smoke path:** ❌ FAIL  
  - `npm run -s test:auth:probe` returned `invalid_credentials` on password grant.
  - `npm run -s test:smoke` now runs with `.env.local` load and fails at login (`Invalid login credentials`).

## Concrete fix task executed immediately
1. **Fixed smoke runner env loading** so local credentialed smoke can execute without manual shell export:
   - Updated `scripts/smoke-e2e.mjs` to load `.env.local` via `dotenv.config(...)`.
2. Re-ran smoke to validate behavior after fix:
   - Smoke now reaches login attempt and surfaces real backend auth failure (`invalid_credentials`) instead of preflight env-missing stop.

## Remaining blocker
- E2E credentials currently configured are not accepted by Supabase password grant.

## Explicit next nudge for orchestrator
1. Rotate/fix `E2E_EMAIL` + `E2E_PASSWORD` in `.env.local` and CI/runtime secret store.
2. Re-run `npm run -s test:auth:probe` until token probe is 2xx.
3. Run `npm run -s test:smoke` and confirm full flow passes.
4. Then run `npm run -s test:atom:nightly-gates:smoke-guarded` and mark overnight QA fully green only after live smoke passes.
