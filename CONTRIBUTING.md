# Contributing

## Development Setup
1. Install dependencies:
```bash
npm ci
```
2. Copy env file:
```bash
cp .env.local.example .env.local
```
3. Configure Supabase and required API keys.
4. Start local server:
```bash
npm run dev
```

## Database Setup
Run in Supabase SQL Editor:
1. `supabase/combined-migration.sql`
2. `supabase/migrations/004_analytics_events.sql`
3. Optional seed files from `supabase/seeds/`

## Quality Gates
Run before submitting changes:
```bash
npm run lint
npm run validate:cbme
npm run content:validate
```
If your work touches smoke-critical areas (auth/desk/mcq/settings), run:
```bash
npm run test:smoke
```

## Change Scope Guidelines
- Keep each change focused (UI-only, API-only, schema-only, etc.).
- If you modify API contracts, update `docs/API-REFERENCE.md`.
- If you modify content loading or formats, update `docs/CONTENT-SYSTEM.md`.
- If you add/rename routes or core modules, update `docs/CODEBASE-MAP.md`.

## Code Guidelines
- TypeScript first; avoid `any` when possible.
- Prefer existing primitives in `src/components/ui`.
- Keep route logic thin; push reusable logic into `src/lib/*`.
- Preserve Supabase auth checks in protected API routes.

## Security Notes
- Never commit real API keys or credentials.
- Treat `create-admin.mjs` as legacy local-only tooling (contains hardcoded credentials).
- Use `scripts/seed-admin.ts` for controlled admin setup.

## Documentation
Canonical docs live in `docs/README.md`. Keep documentation updated in the same PR/change set as code.
