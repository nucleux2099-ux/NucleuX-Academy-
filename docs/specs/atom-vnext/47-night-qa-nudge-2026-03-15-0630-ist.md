# 47) Night QA + Nudge — 2026-03-15 06:30 IST

## Checklist audit

1) `/atom` deployment state + route behavior
- `vercel ls --yes`: latest production deployments are still ~6 days old; one production deploy remains `Error`.
- External fetch of `/atom` on latest ready URL returns **401 Authentication Required** (auth gate present).

2) Chat continuity (`continue` stays on topic)
- `npm run -s test:atom:nightly-gates:smoke-guarded` passed continue continuity check.
- Continue dedup guard also passed.

3) Source grounding + insufficiency when selected books are missing
- Same guarded suite passed strict selected-source insufficiency check.

4) Technical checks (tsc/build where relevant)
- Guarded suite passed: typecheck, lint, build, `/atom` route manifest test.
- `test:smoke` remained skipped because `E2E_EMAIL`/`E2E_PASSWORD` are unset.

## Quality gap(s)
- No fresh production deployment (<24h) for current HEAD validation.
- Auth smoke test is still skipped due to missing E2E credentials.

## Concrete fix task created (immediate nudge)

### TASK-F47 (owner: orchestrator/devops)
1. Set `E2E_EMAIL` and `E2E_PASSWORD` in runtime/CI.
2. Trigger production deploy from current `master`.
3. Re-run `npm run -s test:atom:nightly-gates:smoke-guarded` and confirm `test:smoke` is executed (not skipped).
4. Capture proof: `vercel ls --yes` shows new `<24h` `Ready` deploy + `/atom` auth posture check on fresh URL.

## Exit condition for green status
- Fresh production deploy is `Ready` and <24h old.
- `test:smoke` runs (no skip) and passes.
