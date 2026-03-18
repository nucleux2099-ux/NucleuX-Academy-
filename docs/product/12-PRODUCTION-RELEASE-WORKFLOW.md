# Production Release Workflow (Vercel + nucleuxacademy.io)

**Related:** [07-OPERATIONS-RUNBOOK](./07-OPERATIONS-RUNBOOK.md) · [06-QUALITY-SAFETY-GOVERNANCE](./06-QUALITY-SAFETY-GOVERNANCE.md)

This is the release source-of-truth workflow for shipping any change to live users on `https://nucleuxacademy.io`.

## 1) Environment definitions

| Environment | Purpose | URL pattern | Required checks |
| --- | --- | --- | --- |
| Local | Dev and pre-push debugging | `http://127.0.0.1:3000` | lint, typecheck, build, targeted tests |
| Preview | Final validation before production | `https://<preview-deployment>.vercel.app` | smoke + key page checks + issue evidence |
| Production | User-facing release target | `https://nucleuxacademy.io` | production smoke, log scan, verification note |

Rules:
- Treat Vercel deployment URLs as deploy artifacts.
- Treat `https://nucleuxacademy.io` as the final acceptance target.
- No feature issue is complete without both preview and production evidence.

## 2) Required release checklist on every feature issue

Paste this checklist into each feature issue and fill all fields:

```md
## Release Gate Checklist
- [ ] Code scope confirmed and merged to release branch.
- [ ] Preview URL attached: `https://<preview-deployment>.vercel.app`
- [ ] Preview verification note attached (what was tested, by whom, when).
- [ ] Production deployment command executed (`npx vercel --prod --yes`).
- [ ] Production URL verified (`https://nucleuxacademy.io`).
- [ ] Production verification note attached (status + timestamp + owner).
- [ ] Rollback owner confirmed for this release window.
- [ ] Error-log scan completed (`vercel logs --environment production --level error`).
```

Minimum evidence fields:
- Preview URL
- Production verification timestamp (ISO)
- Owner name/role
- Pass/fail summary for smoke checks

## 3) Standard release sequence

1. Local validation
   - `npm run -s lint`
   - `npm run -s typecheck`
   - `npm run -s build`
2. Preview deploy + verify
   - `npx vercel --yes`
   - `E2E_BASE_URL=https://<preview-deployment>.vercel.app npm run -s test:smoke`
   - `HEALTH_BASE_URL=https://<preview-deployment>.vercel.app npm run -s test:deploy:health`
3. Production deploy + verify
   - `npx vercel --prod --yes`
   - `E2E_BASE_URL=https://nucleuxacademy.io npm run -s test:smoke`
   - `HEALTH_BASE_URL=https://nucleuxacademy.io npm run -s test:deploy:health`
4. Log and release gate
   - `npx vercel logs --environment production --since 30m --level error --no-follow`
   - Record verification note in the issue before marking done.

## 4) Rollback checklist and ownership

### Ownership
- Release commander: CEO (final go/no-go, stakeholder updates)
- Deploy executor: assignee engineer on the feature issue
- QA verifier: release assignee (or delegated QA owner)
- Incident comms owner: CEO

### Rollback triggers (execute immediately)
- Auth/login path fails in production smoke.
- Core learning flow (`/desk`, `/library`, `/mcqs`, `/atom`) hard-fails.
- Elevated production error logs with user-impacting failures.
- Critical route returns persistent 5xx after deploy.

### Rollback steps
1. Freeze further deploys.
2. Identify last known good production deployment from `vercel ls`.
3. Roll back alias to known-good deployment:
   - `npx vercel rollback <deployment-url> --yes`
4. Re-run production health checks:
   - `HEALTH_BASE_URL=https://nucleuxacademy.io npm run -s test:deploy:health`
5. Post incident update:
   - impact, root cause hypothesis, rollback timestamp, next mitigation.

## 5) Production QA smoke suite

### Auth checks
- `npm run -s test:auth:probe`
- `E2E_BASE_URL=https://nucleuxacademy.io npm run -s test:smoke`

### Core learning flow checks
- Login
- Desk load
- MCQ submit flow
- Settings save path

(Covered by `test:smoke` when `E2E_EMAIL` and `E2E_PASSWORD` are set.)

### Key page and route checks
- `HEALTH_BASE_URL=https://nucleuxacademy.io npm run -s test:deploy:health`
- Default paths covered: `/`, `/login`, `/desk`, `/library`, `/mcqs`, `/atom`, `/api/streaks`

## 6) Observability hooks

- Deploy health check artifact:
  - `HEALTH_BASE_URL=https://nucleuxacademy.io HEALTH_OUTPUT_FILE=docs/execution/health-check-<date>.json npm run -s test:deploy:health`
- Production error logs:
  - `npx vercel logs --environment production --since 30m --level error --no-follow`
- Deployment-specific logs:
  - `npx vercel logs https://<deployment-url> --since 30m --no-follow`

## Decisions
- Production acceptance is domain-first (`nucleuxacademy.io`), not deployment-URL-only.
- Release evidence is mandatory on every feature issue.

## Actions
- Keep this checklist embedded in every feature issue until automated release gates are added.
- Store each production smoke run under `docs/execution/` for auditability.

## Open Questions
- Should production smoke be enforced in CI with secure non-prod credentials?
- Should release gates auto-block completion if preview/prod evidence fields are missing?
