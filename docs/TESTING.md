# Testing Guide

## Current Testing Surface
This repository currently relies on:
- Linting (`eslint`)
- Build-time checks (including CBME validation)
- Content/curriculum validators
- Smoke e2e script (Playwright)

There is no broad unit/integration test suite checked into this snapshot.

## Commands

### Lint
```bash
npm run lint
npm run lint:stabilization
```

### Validation
```bash
npm run content:validate
npm run validate:cbme
```

### Build
```bash
npm run build
```
Runs `validate-cbme-links.ts` before Next build.

### Smoke E2E
```bash
npx playwright install chromium
npm run test:smoke
```
Required env vars:
- `E2E_BASE_URL` (optional; defaults to `http://127.0.0.1:3000`)
- `E2E_EMAIL`
- `E2E_PASSWORD`

Smoke flow (`scripts/smoke-e2e.mjs`) currently checks:
1. Login
2. `/desk` load + start plan CTA navigation
3. MCQ answer submission interaction
4. Settings save success signal

## CI Coverage
CI workflow (`.github/workflows/ci.yml`) runs:
- `npm run lint:stabilization`
- `npm run build`

Optional CI smoke job runs only when GitHub secrets `E2E_EMAIL` and `E2E_PASSWORD` are configured.

## Testing Gaps to Keep in Mind
- Many room pages still contain static/mock datasets.
- API route contract tests are not automated.
- Content loader edge cases are partially guarded by validators, not by runtime tests.

## Suggested Validation by Change Type
- UI-only changes: `lint` + manual path checks
- API changes: `lint` + endpoint manual verification + smoke if relevant
- Content structure changes: `content:validate` + `validate:cbme`
- Auth/session changes: full login/onboarding/desk flow + smoke
