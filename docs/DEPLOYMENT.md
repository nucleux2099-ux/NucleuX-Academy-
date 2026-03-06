# Deployment Runbook

## Scope
This repository currently includes:
- application build/start scripts
- CI quality checks (`lint:stabilization`, `build`, optional smoke)

It does **not** include a production deployment workflow definition (for example, no in-repo Vercel/GitHub deploy job, Dockerfile, Helm chart, or Terraform module).

Use this runbook to deploy on your platform of choice.

## 1. Prerequisites
- Node.js 20 runtime on host/runner
- npm available in build/runtime environment
- Supabase project configured and reachable
- Required runtime environment variables set

## 2. Environment Variables (Production)
Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Required if feature is used:
- `ANTHROPIC_API_KEY` (for `/api/chat`)
- `SARVAM_API_KEY` (for `/api/speech/stt` and `/api/speech/tts`)

Recommended:
- `NEXT_PUBLIC_SITE_URL` (OAuth redirect consistency)

Not required for app runtime (only scripts/admin workflows):
- `SUPABASE_SERVICE_ROLE_KEY`
- `E2E_*`, `BASE_URL`, `DEMO_*`

## 3. Database Migration Strategy
Before first production deployment:
1. Run `supabase/combined-migration.sql`
2. Run `supabase/migrations/004_analytics_events.sql`
3. Validate RPC availability used by APIs (`increment_study_time`, `increment_mcq_stats`, `increment_topics_completed`)

If migrating incrementally, use ordered migration application as documented in `docs/DATABASE.md`.

## 4. Pre-Deploy Verification (Local/CI)
Run:
```bash
npm ci
npm run lint:stabilization
npm run validate:cbme
npm run content:validate
npm run build
```
Optional (recommended for release candidates):
```bash
npx playwright install chromium
npm run test:smoke
```

## 5. Build and Release
Standard build/start flow:
```bash
npm ci
npm run build
npm run start
```

Platform notes:
- Any platform that supports Next.js Node runtime can host this app.
- Ensure the process serves port expected by your platform/runtime.
- Keep Node version pinned to 20+ to match CI behavior.

## 6. Post-Deploy Smoke Checks
After release, verify:
1. Public page: `/`
2. Auth page: `/login`
3. Auth callback route health: `/auth/callback` reachable
4. Protected route redirects correctly when unauthenticated: `/desk`
5. API auth behavior: `/api/profile` returns `401` when unauthenticated
6. If configured, `/api/chat` and `/api/speech/*` respond without missing-key errors

## 7. Rollback
If release causes regressions:
1. Roll back app artifact/version on hosting platform.
2. If schema changes were applied, use forward-fix SQL unless explicit rollback SQL exists.
3. Re-run post-deploy smoke checks.

## 8. Operational Risks
- Missing `analytics_events` migration causes degraded analytics event writes.
- Missing RPC functions can break analytics/session updates.
- Mixed mock/data-backed routes can hide integration regressions unless tested by route class (see `docs/ROUTE-STATUS.md`).

## 9. Recommended Next Improvement
Add a dedicated deployment workflow (for the chosen platform) in `.github/workflows` so deploy is reproducible and auditable.
