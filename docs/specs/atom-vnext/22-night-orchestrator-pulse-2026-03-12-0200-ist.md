# 22) Night Orchestrator Pulse — 2026-03-12 02:00 IST

## Focus
1. Validate overnight reliability gates for `/atom` continuity.
2. Remove flakiness in nightly gate execution order.

## What I ran
- `npm run -s typecheck`
- `npm run -s lint`
- `npm run -s build`
- `npm run -s test:atom:route-smoke`
- `npm run -s test:atom:dedup`
- `npm run -s test:atom:nightly-gates`

## Issue found
`test:atom:nightly-gates` previously executed `test:atom:route-smoke` before `build`, which can fail when `.next` artifacts are absent.

## Fix shipped
- Updated `package.json` script order:
  - from: `typecheck -> lint -> route-smoke -> dedup -> build`
  - to: `typecheck -> lint -> build -> route-smoke -> dedup`
- Commit: `62bf3dd`
- Branch: `master` (pushed to origin)

## Reliability/continuity status
- `/atom` route manifest smoke: ✅
- Continue dedup behavior: ✅
- Full build health: ✅
- Nightly gate determinism (ordering): ✅ improved

## Next
1. Keep using `npm run -s test:atom:nightly-gates` as the single overnight gate command.
2. If smoke auth creds are provisioned, expand nightly pulse to include `test:smoke` in a guarded stage.
