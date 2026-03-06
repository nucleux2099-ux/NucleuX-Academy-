# AGENTS.md

This file is for AI coding agents and human maintainers who want fast, safe execution context.

## Mission
Deliver reliable changes to NucleuX Academy without breaking auth, content loading, or analytics telemetry.

## Start Here
1. Read `README.md`.
2. Read `docs/README.md`.
3. For architecture work: `docs/ARCHITECTURE.md` and `docs/CODEBASE-MAP.md`.
4. For setup/runtime details: `docs/DEVELOPMENT.md`.
5. For endpoint changes: `docs/API-REFERENCE.md`.
6. For library/content work: `docs/CONTENT-SYSTEM.md`.
7. For DB setup/migrations: `docs/DATABASE.md`.
8. For route maturity (mock vs data-backed): `docs/ROUTE-STATUS.md`.
9. For release/runbook issues: `docs/DEPLOYMENT.md`.
10. For diagnosis and incident handling: `docs/TROUBLESHOOTING.md`.

## Key Invariants
- Routing is App Router-based under `src/app` with route groups:
  - `(marketing)`, `(auth)`, `(app)`, and API under `src/app/api`.
- Auth gate is enforced in `src/middleware.ts` plus client-side behavior in `src/lib/auth-context.tsx`.
- Library pages rely on file-based content under `/content` through `src/lib/content/loader.ts`.
- Topic loading uses fallback order:
  1. content filesystem
  2. legacy `TOPIC_REGISTRY` in `src/lib/data/topics/index.ts`
- Analytics is dual-path:
  - API-backed (`/api/analytics`)
  - localStorage-backed (`src/lib/analytics/*`) with optional cloud sync (`/api/analytics/sync`).

## Where To Change What
- UI room pages: `src/app/(app)/*`
- Marketing/auth pages: `src/app/(marketing)/*`, `src/app/(auth)/*`
- API handlers: `src/app/api/*/route.ts`
- Supabase client/auth wiring: `src/lib/supabase/*`, `src/lib/auth-context.tsx`, `src/middleware.ts`
- Subject/subspecialty metadata: `src/lib/data/subjects.ts`, `src/lib/data/subspecialties.ts`
- Content parser/loader behavior: `src/lib/content/loader.ts`, `src/lib/types/library.ts`
- DB schema: `supabase/*.sql`, `supabase/migrations/*.sql`

## Validation Checklist Before Handover
- Run `npm run lint` for broad checks.
- Run `npm run validate:cbme` for curriculum/link consistency.
- Run `npm run content:validate` for content structure changes.
- If auth/profile/progress/session logic changed, test login + onboarding + `/desk` end-to-end.
- If API changed, verify request/response behavior against `docs/API-REFERENCE.md`.

## Cautions
- Some pages use static/mock datasets; do not assume all views are API-connected.
- `/api/chat` requires `ANTHROPIC_API_KEY`.
- `/api/speech/stt` and `/api/speech/tts` require `SARVAM_API_KEY`.
- `create-admin.mjs` is legacy and contains hardcoded secrets; prefer `scripts/seed-admin.ts`.

## Documentation Rule
Any architectural, API, or workflow change must be reflected in docs under `/docs` and linked from `docs/README.md`.
