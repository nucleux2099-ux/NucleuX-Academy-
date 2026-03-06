# Development Guide

## Prerequisites
- Node.js 20+
- npm
- Supabase project (URL + anon key + service role key for admin/seeding workflows)

## Install
```bash
npm ci
```

## Environment Variables
Copy:
```bash
cp .env.local.example .env.local
```

Variables used in code:

| Variable | Required | Used by |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase browser/server clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase browser/server clients |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional (required for admin/seeding scripts) | `scripts/seed-admin.ts`, import scripts |
| `NEXT_PUBLIC_SITE_URL` | Optional | OAuth redirect in `src/lib/auth/actions.ts` |
| `ADMIN_SEED_EMAIL` | Optional | `scripts/seed-admin.ts`, `create-admin.mjs` |
| `ADMIN_SEED_PASSWORD` | Required for admin seed scripts | `scripts/seed-admin.ts`, `create-admin.mjs` |
| `ADMIN_SEED_NAME` | Optional | `scripts/seed-admin.ts`, `create-admin.mjs` |
| `ANTHROPIC_API_KEY` | Required for chat | `src/app/api/chat/route.ts` |
| `SARVAM_API_KEY` | Required for speech APIs | `src/lib/speech/sarvam.ts` |
| `E2E_BASE_URL` | Optional | `scripts/smoke-e2e.mjs` |
| `E2E_EMAIL` | Optional (required for smoke test) | `scripts/smoke-e2e.mjs`, CI smoke job |
| `E2E_PASSWORD` | Optional (required for smoke test) | `scripts/smoke-e2e.mjs`, CI smoke job |
| `BASE_URL` | Optional | `scripts/capture-marketing-screens.ts` |
| `DEMO_EMAIL` | Optional | `scripts/capture-marketing-screens.ts` |
| `DEMO_PASSWORD` | Optional | `scripts/capture-marketing-screens.ts` |

## Supabase Bootstrap
Use Supabase SQL Editor.

1. Run core schema:
- `supabase/combined-migration.sql`

2. Run analytics events migration (recommended):
- `supabase/migrations/004_analytics_events.sql`

3. Optional seed data:
- `supabase/seeds/mcq-seed.sql`
- `supabase/seeds/library_content.sql`
- `supabase/seeds/textbook_content.sql`

4. Optional fix:
- `supabase/fixes/fix_handle_new_user.sql` (if needed)

## Local Run
```bash
npm run dev
```
Default app URL: `http://localhost:3000`.

Production run locally:
```bash
npm run build
npm run start
```

## Build and Validation

### Lint
```bash
npm run lint
npm run lint:stabilization
```

### Content and curriculum consistency
```bash
npm run content:validate
npm run validate:cbme
```

### Production build
```bash
npm run build
```
Note: `build` runs CBME validation before `next build`.

### Smoke e2e
```bash
npx playwright install chromium
npm run test:smoke
```
Requires `E2E_EMAIL` and `E2E_PASSWORD`.

## Admin Seeding
Preferred script:
```bash
npm run seed:admin
```
Requires `SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_SEED_PASSWORD`.

Legacy script warning:
- `create-admin.mjs` is a local helper and now expects `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` in `.env.local`.

## Lifecycle Mock Run (UI)
For rapid end-to-end validation of the learning lifecycle rail:
1. Open any topic route:
   - `/library/{subject}/{subspecialty}/{topic}`
2. Use **Lifecycle Demo Template** panel (above the rail) or the rail header **Mock Run** action.
3. The action seeds one complete demo path:
   - `Prestudy -> Aim -> Shoot -> Skin -> Mindmap`

This writes local method stores and triggers background lifecycle sync/checkpoint updates, so the rail and read-model state can be tested without manual data entry.

### Achalasia Guided Demo (Prefilled Template)
Use this route for a complete prefilled walkthrough suitable for onboarding demos:
- `/library/surgery/esophagus/achalasia?demo=run&mode=explorer`

Behavior:
- Automatically initializes lifecycle row if missing.
- Auto-runs full mock lifecycle generation for the topic.
- Seeds stage-specific content tuned for Achalasia (PreStudy/Aim/Shoot/Skin + checkpoint history + mindmap finalization).

## CI Behavior
From `.github/workflows/ci.yml`:
- `lint-and-build` job:
  - `npm ci`
  - `npm run lint:stabilization`
  - `npm run build`
- Optional `smoke-e2e` job runs only if `E2E_EMAIL` and `E2E_PASSWORD` secrets are configured.

## Workflow Recommendations
- For API changes: update `docs/API-REFERENCE.md` in same change set.
- For content-loader changes: update `docs/CONTENT-SYSTEM.md`.
- For route/module changes: update `docs/CODEBASE-MAP.md`.
- For DB migration/setup changes: update `docs/DATABASE.md`.
- For test flow/coverage changes: update `docs/TESTING.md`.
- For release process changes: update `docs/DEPLOYMENT.md`.
- For recurring issue patterns: update `docs/TROUBLESHOOTING.md`.
