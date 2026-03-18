# 74) Night QA Nudge — 2026-03-19 00:00 IST

## Scope audited
- ATOM reliability gates (route + contracts + dedup + continuity)
- Build/lint/typecheck stability
- Production health route checks (`nucleuxacademy.io`)
- Credentialed auth smoke readiness

## Scorecard
- **Typecheck/Lint/Build:** ✅ PASS  
  - `npm run -s typecheck`  
  - `npm run -s lint`  
  - `npm run -s build`
- **ATOM route + continuity + source grounding + dedup:** ✅ PASS  
  - `npm run -s test:atom:route-smoke`  
  - `npm run -s test:atom:chat-contracts`  
  - `npm run -s test:atom:reliability`  
  - `npm run -s test:atom:dedup`
- **Nightly bundled gate:** ✅ PASS (non-credentialed smoke path)  
  - `npm run -s test:atom:nightly-gates:smoke-guarded`  
  - Result: smoke skipped because `E2E_EMAIL/E2E_PASSWORD` not set in shell during this run.
- **Production health endpoints:** ✅ PASS  
  - `npm run -s test:deploy:health` against `https://nucleuxacademy.io`
- **Credentialed auth probe:** ❌ FAIL  
  - `npm run -s test:auth:probe` -> `400 invalid_credentials`

## What changed this cycle
- Added domain-aware production health script: `scripts/deploy-health-check.mjs`
- Added npm command: `test:deploy:health`
- Added release workflow doc: `docs/product/12-PRODUCTION-RELEASE-WORKFLOW.md`
- Linked release workflow in product/runbook index:
  - `docs/product/00-INDEX.md`
  - `docs/product/07-OPERATIONS-RUNBOOK.md`
- Captured production smoke evidence:
  - `docs/execution/NUC-7-production-smoke-2026-03-18.md`

## Blocker isolation
- App reliability and route behavior are green.
- Remaining red gate is **credentialed auth** (likely stale/invalid smoke credentials).

## Explicit next nudge for orchestrator
1. Refresh `E2E_EMAIL` and `E2E_PASSWORD` in local + CI/secret store.
2. Re-run: `npm run -s test:auth:probe` (must be 2xx token path).
3. Re-run credentialed smoke: `E2E_BASE_URL=https://nucleuxacademy.io npm run -s test:smoke`.
4. Re-run full gate: `npm run -s test:atom:nightly-gates:smoke-guarded`.
5. If green, attach proof in release issue and mark overnight QA fully green.
