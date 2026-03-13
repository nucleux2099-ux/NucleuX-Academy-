# Night QA Fix Task — Restore Smoke E2E Coverage (2026-03-09)

## Task ID
VN2-QA-15

## Gap observed
`npm run test:smoke` is blocked because required env vars are missing:
- `E2E_EMAIL`
- `E2E_PASSWORD`

## Objective
Re-enable nightly smoke verification for ATOM critical routes (`/atom`, chat continue flow, source-grounding fallback path) with non-production credentials.

## Minimal runbook (automation-friendly)

### Required secret names
- `E2E_EMAIL`
- `E2E_PASSWORD`

### One-command credentialed smoke run
```bash
E2E_EMAIL='<nonprod_email>' E2E_PASSWORD='<nonprod_password>' npm run -s test:atom:nightly-gates:smoke-guarded
```

### Expected behavior
- If both secrets are set: guarded flow runs full local gates + `test:smoke`.
- If either secret is missing: guarded flow skips `test:smoke` with explicit message.

## Concrete actions
1. Provision a dedicated non-prod test user for smoke tests.
2. Inject `E2E_EMAIL` and `E2E_PASSWORD` into CI/local secret store (not committed).
3. Run `npm run test:smoke` and capture pass/fail artifact.
4. If login instability appears, add deterministic wait/assert checkpoints in `scripts/smoke-e2e.mjs`.

## Acceptance criteria
- Smoke test runs unattended in nightly QA.
- `/atom` route and ATOM chat baseline flow are covered by smoke assertions.
- Failure output clearly identifies auth/setup vs app regressions.

## Suggested owner
Coder-NucleuX (implementation) + Vishwakarma (orchestration)

## Orchestrator nudge
"Please wire non-prod smoke creds now and run one full smoke pass before next cron window; report artifact link + exact failing step if red."

## Execution log (latest)
- Timestamp (IST): `2026-03-12T04:32:31+0530`
- Command:
  ```bash
  npm run -s test:atom:nightly-gates:smoke-guarded
  ```
- Artifact log path:
  - `docs/specs/atom-vnext/artifacts/nightly-gates-smoke-guarded-2026-03-12T04:32:31+0530.log`
- Result:
  - Core gates passed (typecheck/build/route-smoke/reliability/dedup)
  - Credentialed smoke skipped with message:
    - `Skipping test:smoke (E2E_EMAIL/E2E_PASSWORD not set).`

## Pending follow-up (when creds are present)
Re-run:
```bash
E2E_EMAIL='<nonprod_email>' E2E_PASSWORD='<nonprod_password>' npm run -s test:atom:nightly-gates:smoke-guarded
```
Then append artifact path + timestamp in this section.

## Immediate escalation (active)
- Owner to action: runtime/deploy secrets owner for ATOM non-prod.
- Required keys:
  - `E2E_EMAIL`
  - `E2E_PASSWORD`
- Validation command after secret injection:
  ```bash
  npm run -s test:atom:nightly-gates:smoke-guarded
  ```
- Success condition: log contains an actual `test:smoke` run (not the skip line).

## Execution log (most recent)
- Timestamp (IST): `2026-03-13T01:01:14+05:30`
- Command:
  ```bash
  npm run -s test:atom:nightly-gates:smoke-guarded
  ```
- Artifact log path:
  - `docs/specs/atom-vnext/artifacts/nightly-gates-smoke-guarded-2026-03-13T01:01:14+05:30.log`
- Result:
  - Core gates passed (typecheck/build/route-smoke/reliability/dedup)
  - `/atom` route present in build output
  - Continue follow-up continuity check passed
  - Strict selected-source insufficiency language check passed
  - Credentialed smoke still skipped with message:
    - `Skipping test:smoke (E2E_EMAIL/E2E_PASSWORD not set).`
- Delta from previous run:
  - Stability unchanged; blocker remains exclusively missing smoke credentials in runtime secret store.

## Execution log (latest)
- Timestamp (IST): `2026-03-13T01:33:04+05:30`
- Command:
  ```bash
  npm run -s test:atom:nightly-gates:smoke-guarded
  ```
- Artifact log path:
  - `docs/specs/atom-vnext/artifacts/nightly-gates-smoke-guarded-2026-03-13T01:33:04+0530.log`
- Result:
  - Core gates passed (typecheck/build/route-smoke/reliability/dedup)
  - `/atom` route present in build output
  - Continue follow-up continuity check passed
  - Strict selected-source insufficiency language check passed
  - Credentialed smoke still skipped:
    - `Skipping test:smoke (E2E_EMAIL/E2E_PASSWORD not set).`

## Concrete fix task (ready to execute now)
1. Inject non-prod credentials into runtime secret store as:
   - `E2E_EMAIL`
   - `E2E_PASSWORD`
2. Immediately run:
   ```bash
   npm run -s test:atom:nightly-gates:smoke-guarded
   ```
3. Confirm success by verifying log contains an actual `test:smoke` execution (not skip line).

## Execution log (latest)
- Timestamp (IST): `2026-03-13T02:02:00+05:30`
- Command:
  ```bash
  npm run -s test:atom:nightly-gates:smoke-guarded
  ```
- Artifact log path:
  - `docs/specs/atom-vnext/artifacts/nightly-gates-smoke-guarded-2026-03-13T02:02:00+0530.log`
- Result:
  - Core gates passed (typecheck/build/route-smoke/reliability/dedup)
  - `/atom` route present in build output
  - Continue follow-up continuity check passed
  - Strict selected-source insufficiency language check passed
  - Credentialed smoke still skipped:
    - `Skipping test:smoke (E2E_EMAIL/E2E_PASSWORD not set).`
- Delta from 01:33 run:
  - No regressions detected; blocker remains only missing smoke credentials.

## Execution log (latest)
- Timestamp (IST): `2026-03-13T02:32:44+05:30`
- Command:
  ```bash
  npm run -s test:atom:nightly-gates:smoke-guarded
  ```
- Artifact log path:
  - `docs/specs/atom-vnext/artifacts/nightly-gates-smoke-guarded-2026-03-13T02:32:44+0530.log`
- Result:
  - Core gates passed (typecheck/build/route-smoke/reliability/dedup)
  - `/atom` route present in build output
  - Continue follow-up continuity check passed
  - Strict selected-source insufficiency language check passed
  - Credentialed smoke still skipped:
    - `Skipping test:smoke (E2E_EMAIL/E2E_PASSWORD not set).`
- Delta from 02:02 run:
  - No regressions; credential blocker unchanged.

## Execution log (latest)
- Timestamp (IST): `2026-03-13T03:00:00+05:30`
- Command:
  ```bash
  npm run -s test:atom:nightly-gates:smoke-guarded
  ```
- Artifact log path:
  - `docs/specs/atom-vnext/artifacts/nightly-gates-smoke-guarded-2026-03-13T03:00:00+0530.log`
- Result:
  - Core gates passed (typecheck/build/route-smoke/reliability/dedup)
  - `/atom` route present in build output
  - Continue follow-up continuity check passed
  - Strict selected-source insufficiency language check passed
  - Credentialed smoke still skipped:
    - `Skipping test:smoke (E2E_EMAIL/E2E_PASSWORD not set).`
- Delta from 02:32 run:
  - No regressions; lint also passed in this pulse window.

## Execution log (latest)
- Timestamp (IST): `2026-03-13T07:32:01+05:30`
- Command:
  ```bash
  npm run -s test:atom:nightly-gates:smoke-guarded
  ```
- Artifact log path:
  - `docs/specs/atom-vnext/artifacts/nightly-gates-smoke-guarded-2026-03-13T07:32:01+05:30.log`
- Result:
  - Core gates passed (typecheck/build/route-smoke/reliability/dedup)
  - `/atom` route present in build output
  - Continue follow-up continuity check passed
  - Strict selected-source insufficiency language check passed
  - Credentialed smoke still skipped:
    - `Skipping test:smoke (E2E_EMAIL/E2E_PASSWORD not set).`
- Delta from 03:00 run:
  - No regressions; blocker unchanged (runtime smoke credentials still missing).

## Execution log (latest)
- Timestamp (IST): `2026-03-14T01:11:31+05:30`
- Command:
  ```bash
  npm run -s test:atom:nightly-gates:smoke-guarded
  ```
- Artifact log path:
  - `docs/specs/atom-vnext/artifacts/nightly-gates-smoke-guarded-2026-03-14T01:11:31+05:30.log`
- Result:
  - Core gates passed (typecheck/build/route-smoke/reliability/dedup)
  - `/atom` route present in build output
  - Continue follow-up continuity check passed
  - Strict selected-source insufficiency language check passed
  - Credentialed smoke still skipped:
    - `Skipping test:smoke (E2E_EMAIL/E2E_PASSWORD not set).`
- Delta from 07:32 run:
  - No regressions in ATOM baseline reliability checks; blocker remains missing runtime smoke credentials.

