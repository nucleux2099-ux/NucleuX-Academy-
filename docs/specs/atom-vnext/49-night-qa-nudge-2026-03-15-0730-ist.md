# ATOM Night QA + Nudge — 2026-03-15 07:30 IST

## Scope
- Deployment state + `/atom` route behavior
- Continue continuity behavior
- Source grounding insufficiency behavior
- Quick technical reliability checks

## Evidence
1. `vercel ls --yes`
   - Latest production deployments are still ~6 days old.
   - One production deployment remains in `Error` state.
2. `curl https://nucleux-academy-qmlsjfunz-aditya-chandrabhatlas-projects.vercel.app/atom`
   - Returns `401 Authentication Required` (expected auth gate still active).
3. Reliability checks
   - `npm run -s test:atom:route-smoke` ✅
   - `npm run -s test:atom:reliability` ✅
     - continue continuity check: PASS
     - selected-book insufficiency check: PASS
   - `npm run -s test:atom:dedup` ✅
4. Technical checks
   - `npm run -s typecheck` ✅
   - `npm run -s build` ✅
   - `npm run -s test:atom:nightly-gates:smoke-guarded` ✅ (guarded smoke skipped)

## Quality gap detected
- Credentialed smoke path (`test:smoke`) still skipped due missing runtime secrets:
  - `E2E_EMAIL`
  - `E2E_PASSWORD`
- Fresh production deploy (<24h) not yet present.

## Concrete fix task created (immediate)
- **Task:** Unblock credentialed smoke + redeploy from current `master`.
- **Definition of done:**
  1. `test:smoke` runs (not skipped).
  2. New production deployment is `Ready` and <24h old.
  3. `/atom` route posture re-verified on fresh URL.

### Minimal command plan
```bash
# 1) Set runtime/CI secrets for smoke login
export E2E_EMAIL='<valid test user email>'
export E2E_PASSWORD='<valid test user password>'

# 2) Re-run full guarded gates (now should execute smoke)
npm run -s test:atom:nightly-gates:smoke-guarded

# 3) Trigger production deployment
vercel --prod --yes

# 4) Verify latest deploy + route posture
vercel ls --yes
curl -I "https://<latest-production-url>/atom"
```
