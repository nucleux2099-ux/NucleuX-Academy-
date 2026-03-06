# Codebase Map

## Top-Level Layout
```text
.
├── src/
├── content/
├── supabase/
├── scripts/
├── docs/
├── public/
├── .github/workflows/
├── package.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
└── .env.local.example
```

## Source Tree (`src`)

### `src/app`
- Root app and layouts:
  - `src/app/layout.tsx`
  - `src/app/page.tsx`
  - `src/app/manifest.ts`
  - `src/app/globals.css`
- Route groups:
  - `src/app/(marketing)/*`
  - `src/app/(auth)/*`
  - `src/app/(app)/*`
- API handlers:
  - `src/app/api/*/route.ts`

### `src/components`
- Product components: `AtomWidget`, `AtomLibrarian`, `MedicalMarkdown`, room-specific components
- Classroom tooling: `src/components/classroom/*`
- Marketing components: `src/components/marketing/*`
- PWA components: `src/components/pwa/*`
- UI primitives: `src/components/ui/*`

### `src/lib`
- API hooks: `src/lib/api/hooks.ts`
- Auth/session: `src/lib/auth-context.tsx`, `src/lib/supabase/*`
- Analytics local model and sync: `src/lib/analytics/*`
- Content loading/parsing: `src/lib/content/loader.ts`
- Subject/curriculum/topic metadata: `src/lib/data/*`
- Speech wrappers: `src/lib/speech/sarvam.ts`
- Utility and type modules across learning modes (`backstage`, `pocket`, `mindmap`, etc.)

### `src/types`
- Supabase database TS shape: `src/types/database.ts`

## Route Inventory

### Public routes
- Marketing and landing:
  - `/`, `/landing`, `/campus`, `/rooms`, `/about`, `/pricing`, `/faq`, `/contact`, `/atom`, `/demo`
- Legal/system:
  - `/privacy`, `/terms`, `/offline`
- Auth:
  - `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/auth/callback`

### Auth-required top-level routes
- `/onboarding`

### Protected app routes (`src/app/(app)`)
- Core:
  - `/desk`, `/dashboard`, `/analytics`, `/profile`, `/settings`, `/history`, `/notifications`, `/bookmarks`, `/notes`, `/notes/[id]`
  - `/help`, `/graph`, `/leaderboard`, `/achievements`, `/competencies`
- Learning rooms:
  - `/library`, `/chat`, `/classroom`, `/mcqs`, `/exam-centre`, `/pathways`, `/backstage`, `/arena`, `/community`, `/cbme`
- Dynamic routes:
  - `/library/[subject]`
  - `/library/[subject]/[subspecialty]`
  - `/library/[subject]/[subspecialty]/[topic]`
  - `/read/[id]`, `/watch/[id]`, `/practice/[id]`
  - `/classroom/canvas`, `/classroom/mindmap`, `/classroom/live-ai`, `/classroom/templates`
  - `/classroom/decks`, `/classroom/decks/[deckId]`, `/classroom/decks/[deckId]/edit`, `/classroom/decks/[deckId]/present`
  - `/mcqs/results`
  - `/backstage/calibration`, `/backstage/logbook`, `/backstage/quests`
  - `/cbme/[specialty]` and subject routes under `/cbme/*` (e.g. `/cbme/surgery`, `/cbme/medicine`)
  - `/exam-centre/mcq`, `/exam-centre/pyq`
  - `/exam-centre/simulator/[caseId]`
  - `/exam-centre/flow/[flowId]`
  - `/exam-centre/osce/[stationId]`

### Inventory note
For an exact current route list, derive it from `src/app` files (especially after adding/removing pages), because this map is maintained manually.

### API routes
- `GET/POST /api/analytics`
- `POST /api/analytics/sync`
- `POST /api/chat`
- `GET /api/library/content`
- `GET/PATCH /api/profile`
- `GET/POST /api/progress`
- `GET/POST /api/streaks`
- `GET /api/study-plan`
- `GET/POST/PATCH /api/study-sessions`
- `POST /api/speech/stt`
- `POST /api/speech/tts`

## Content and Data Layout

### `/content`
Large filesystem content corpus by subject and subspecialty.
- Mixed formats exist:
  - modern folder-based topic bundles (`topic/_meta.yaml`, `explorer.md`, etc.)
  - flat markdown files in some subject trees

### `/supabase`
- `combined-migration.sql`: primary schema bootstrap
- `migrations/`: incremental SQL migrations
- `seeds/`: optional seed datasets
- `fixes/`: targeted SQL patch scripts

### `/scripts`
Operational and validation scripts:
- `validate-content.ts`
- `validate-cbme-links.ts`
- `seed-admin.ts`
- `smoke-e2e.mjs`
- content generation/import helpers (legacy and active)

## Config and CI
- App/build config: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`
- Package scripts and dependencies: `package.json`
- CI workflow: `.github/workflows/ci.yml`
- Middleware/auth gate: `src/middleware.ts`
