---
title: "15 Night Qa Fix Task Smoke Credentials"
summary: "Smoke credentials and QA instructions reference."
audience: "ops"
status: "reference"
source_path: "docs/specs/atom-vnext/15-night-qa-fix-task-smoke-credentials.md"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "E"
llm_handover_relevance: "low"
---

# Night QA Fix Task — Restore Smoke E2E Coverage (2026-03-09)

## Task ID
VN2-QA-15

## Gap observed
`npm run test:smoke` is blocked because required env vars are missing:
- `E2E_EMAIL`
- `E2E_PASSWORD`

## Objective
Re-enable nightly smoke verification for ATOM critical routes (`/atom`, chat continue flow, source-grounding fallback path) with non-production credentials.

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