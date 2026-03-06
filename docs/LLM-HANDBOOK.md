# LLM Handbook

This document is optimized for AI assistants operating directly on this repository.

## Minimal Context Pack (Read First)
1. `README.md`
2. `AGENTS.md`
3. `docs/ARCHITECTURE.md`
4. `docs/CODEBASE-MAP.md`
5. `docs/DEVELOPMENT.md`
6. `docs/ROUTE-STATUS.md`
7. `docs/TROUBLESHOOTING.md`

## Task Routing Cheat Sheet
- Route/UI work: `src/app/(app)/*`, `src/components/*`
- Auth/session issues: `src/middleware.ts`, `src/lib/auth-context.tsx`, `src/lib/supabase/*`
- API contract/data issues: `src/app/api/*/route.ts`, `src/lib/api/hooks.ts`
- Library/content issues: `src/lib/content/loader.ts`, `src/lib/data/content-mapping.ts`, `content/*`
- Analytics telemetry/local model: `src/lib/analytics/*`, `/api/analytics*`
- DB schema issues: `supabase/*.sql`, `supabase/migrations/*.sql`

## High-Risk Areas
- Authentication redirects and route protection
- Content resolution across mixed folder/file formats
- API handlers that assume specific table availability
- Analytics dual-source behavior (localStorage + cloud sync)

## Practical Guardrails
- Preserve protected-route behavior in `src/middleware.ts`.
- Keep API routes user-scoped (`auth.getUser()` checks).
- Avoid path assumptions in content code; honor existing fallback logic.
- If changing endpoint shape, update both server and `src/lib/api/hooks.ts` consumers.
- If changing schema assumptions, update SQL migrations/docs together.

## Quick Validation Matrix
After changes, run the subset that matches your task:
- General code quality: `npm run lint`
- Curriculum/content links: `npm run validate:cbme`
- Content structure: `npm run content:validate`
- Build integration: `npm run build`
- Critical flow smoke test: `npm run test:smoke` (requires e2e creds)

## Known Repository Realities
- Workspace snapshot currently has no `.git` metadata.
- Some pages are fully data-backed, others still ship static/mock datasets.
- `content/README.md` is historical and may not reflect current completeness.
- `create-admin.mjs` is legacy and contains hardcoded credentials; do not reuse in production.

## Documentation Update Policy
If your change alters behavior, update at least one of:
- `docs/API-REFERENCE.md`
- `docs/CONTENT-SYSTEM.md`
- `docs/ARCHITECTURE.md`
- `docs/CODEBASE-MAP.md`
