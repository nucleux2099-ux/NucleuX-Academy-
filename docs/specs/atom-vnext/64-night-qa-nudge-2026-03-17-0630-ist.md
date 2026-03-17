# 64 — Night QA Nudge (2026-03-17 06:30 IST)

## Scorecard
- ✅ `/atom` deployment route present in prod build manifest (`npm run build` includes `○ /atom`).
- ✅ Chat continuity guard (`continue`) covered and passing (`test:atom:chat-contracts`).
- ✅ Source grounding insufficiency behavior covered and passing (`strict source grounding with no relevant content injects insufficiency guidance`).
- ✅ Technical checks passing: `typecheck`, `build`, `test:atom:route-smoke`, `test:atom:chat-contracts`.
- ⚠️ Gap: auth smoke still blocked by credentials (`test:auth:probe` returns `invalid_credentials`).

## Immediate Fix Task Executed
Ran `npm run -s test:auth:probe` to validate blocker status (still failing with `invalid_credentials`).

## Concrete Next Fix
1. Rotate/sync `.env.local` E2E credentials (valid Supabase user + password).
2. Re-run:
   - `npm run -s test:auth:probe`
   - `npm run -s test:atom:nightly-gates:smoke-guarded`
3. If probe still fails, regenerate E2E user via admin path and update secrets store.

## Next nudge for orchestrator
"Unblock auth smoke by refreshing E2E credentials now; rerun `test:auth:probe` and then `test:atom:nightly-gates:smoke-guarded`."
