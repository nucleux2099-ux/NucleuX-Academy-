# 52) Night QA Nudge — 2026-03-16 01:30 IST

## Scope audited
- Deployment state + `/atom` route behavior
- Chat continuity (`continue` follow-up stays on-topic)
- Source grounding (selected-book insufficiency behavior)
- Quick technical checks (`tsc/build` and guarded smoke)

## Evidence run
- `git status --short --branch`
- `npm run -s test:atom:nightly-gates:smoke-guarded`
- `vercel ls --yes`
- `curl -s -o /dev/null -w '%{http_code} %{url_effective}\n' https://nucleux-academy-lfa3p80qr-aditya-chandrabhatlas-projects.vercel.app/atom`
- `set -a; source .env.local; set +a; npm run -s test:atom:nightly-gates:smoke-guarded`

## Scorecard
1) Deployment state + `/atom` auth posture: **PASS**
- Latest production deploy listed `Ready` (~1h old).
- `/atom` unauthenticated response remains `401`.

2) Chat continuity (`continue` stays on-topic): **PASS**
- Reliability smoke reports: `PASS continue continuity`.

3) Source grounding strict insufficiency behavior: **PASS**
- Reliability smoke reports: `PASS strict source insufficiency language`.

4) Technical checks: **PARTIAL**
- `typecheck` ✅
- `lint` ✅
- `build` ✅
- `test:atom:route-smoke` ✅
- `test:atom:reliability` ✅
- `test:atom:dedup` ✅
- `test:smoke` ❌ (executes with env loaded, fails at desk step waiting for `Start Today’s Plan` button)

## Quality gaps and immediate fix executed
### Gap A — masked smoke failure in guarded script
- Found guard script was printing “Skipping test:smoke…” even when smoke actually failed.
- **Fix executed now:** updated `package.json` script `test:atom:nightly-gates:smoke-guarded` to use explicit `if/else` so real smoke failures surface with non-zero exit.

### Gap B — desk smoke selector drift
- With E2E env loaded, smoke now runs and fails on:
  - `getByRole('button', { name: /Start Today.?s Plan/i })`
- Indicates UI text/flow drift in desk onboarding/start-plan step.

## Explicit next nudge for orchestrator
**Nudge:** Reliability gates are green, but release confidence is blocked by a real E2E smoke regression at desk start-plan CTA. Next cycle should prioritize fixing `scripts/smoke-e2e.mjs` selector/flow (or restoring CTA), then require one full `test:atom:nightly-gates:smoke-guarded` run that includes passing `test:smoke` plus `/atom` `401` check on latest `Ready` deploy.