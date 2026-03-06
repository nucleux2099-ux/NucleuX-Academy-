# NucleuX Academy

NucleuX Academy is a Next.js 16 medical learning platform with an AI teaching layer (ATOM), a large file-based content library, and Supabase-backed user/auth/progress data.

This repository combines:
- Product UI (marketing, auth, and in-app learning rooms)
- File-system content delivery (`/content`)
- API routes for profile, analytics, progress, study planning, chat, and speech
- Supabase schema/migrations/seeds

## Current Stack
- Frontend: Next.js App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui primitives
- Backend-in-app: Next.js Route Handlers (`src/app/api/*`)
- Data/Auth: Supabase (SSR + browser clients)
- AI: Anthropic API (`/api/chat`)
- Speech: Sarvam STT/TTS (`/api/speech/*`)
- CI: GitHub Actions (`.github/workflows/ci.yml`)

## Quick Start

### 1. Prerequisites
- Node.js 20+
- npm (CI uses npm)
- Supabase project

### 2. Install
```bash
npm ci
```

### 3. Configure environment
```bash
cp .env.local.example .env.local
```
Fill required values in `.env.local`.

### 4. Bootstrap database (Supabase)
1. Run `supabase/combined-migration.sql` in Supabase SQL Editor.
2. Run `supabase/migrations/004_analytics_events.sql` (adds `analytics_events`, used by `/api/analytics`).
3. Optionally seed sample data from `supabase/seeds/` (for example `mcq-seed.sql`).

### 5. Run locally
```bash
npm run dev
```
Open `http://localhost:3000`.

## Common Commands
- `npm run dev`: Start local dev server
- `npm run build`: Validate CBME links and build production app
- `npm run start`: Run built app in production mode
- `npm run lint`: Run ESLint across project
- `npm run lint:stabilization`: Lint selected high-risk files used in CI
- `npm run content:validate`: Validate content structure under `/content`
- `npm run validate:cbme`: Validate CBME link mappings
- `npm run test:smoke`: Playwright smoke flow (requires `E2E_*` env vars)
- `npm run seed:admin`: Seed admin user via Supabase service role

## Project Structure
```text
src/
  app/                Next.js App Router routes (marketing, auth, app, api)
  components/         Shared UI and feature components
  lib/                Domain/data/auth/content/analytics utilities
  types/              DB and shared TS types
content/              Medical content library (markdown/yaml/json)
supabase/             SQL migrations, combined migration, seeds, fixes
scripts/              Validation, seeding, generation, smoke test helpers
docs/                 Deep technical and product documentation
```

## Documentation
Start with:
- `docs/README.md` (documentation index)
- `AGENTS.md` (LLM operator guide)
- `docs/LLM-HANDBOOK.md`
- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT.md`
- `docs/DATABASE.md`
- `docs/TESTING.md`
- `docs/ROUTE-STATUS.md`
- `docs/DEPLOYMENT.md`
- `docs/TROUBLESHOOTING.md`

## Important Notes
- Some app rooms/pages are production-wired, while others still use static/mock data placeholders.
- `create-admin.mjs` contains hardcoded credentials/keys and should be treated as legacy local-only tooling.
- There is no `.git` metadata in this exported workspace snapshot.
