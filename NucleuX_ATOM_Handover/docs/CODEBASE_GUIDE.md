# NucleuX Academy - Codebase Guide

## Directory Structure

```
NucleuX-Academy--master/
├── content/                    # Filesystem-based curriculum content
│   ├── anatomy/                # 8 subspecialties
│   ├── anesthesia/             # 4 subspecialties
│   ├── biochemistry/           # 9 subspecialties
│   ├── cbme/                   # Phase-1 through Phase-3B
│   ├── community-medicine/     # 11 subspecialties
│   ├── dentistry/
│   ├── dermatology/            # 4 subspecialties
│   ├── ent/                    # 4 subspecialties
│   ├── forensic/
│   ├── forensic-medicine/
│   ├── medicine/
│   ├── microbiology/
│   ├── obgyn/
│   ├── ophthalmology/
│   ├── orthopedics/
│   ├── pathology/
│   ├── pathways/
│   ├── pediatrics/
│   ├── pharmacology/
│   ├── physiology/
│   ├── preventive-medicine/
│   ├── psychiatry/
│   ├── radiology/
│   ├── surgery/                # Largest - GI, hepatobiliary, etc.
│   └── .meta/
│
├── docs/                       # This documentation directory
│
├── public/                     # Static assets, SW, manifest
│
├── scripts/                    # Build scripts, content generation, seeding
│   ├── validate-cbme-links.ts  # Runs at build time
│   ├── validate-content.ts     # Content structure validation
│   ├── seed-admin.ts           # Supabase admin seeding
│   ├── smoke-e2e.mjs           # Playwright smoke tests
│   └── ... (batch content generators)
│
├── src/
│   ├── app/                    # Next.js App Router pages and API routes
│   │   ├── (app)/              # Authenticated pages (THE MAIN APP)
│   │   ├── (auth)/             # Login, signup, password reset
│   │   ├── (marketing)/        # Public marketing pages
│   │   ├── api/                # 11 API route files
│   │   └── auth/callback/      # OAuth callback
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui primitives (14 components)
│   │   ├── classroom/          # Classroom-specific (AtomMindMap, ExcalidrawCanvas)
│   │   ├── demo/               # DemoTour (Shepherd.js)
│   │   ├── library/            # RoadmapView, SurgeryHub
│   │   ├── marketing/          # MarketingHeader, RoomCard, SupportFooter
│   │   ├── pwa/                # InstallPrompt, ServiceWorkerRegistration
│   │   └── ... (25 top-level components)
│   │
│   ├── lib/                    # Business logic and data layer
│   │   ├── aim/                # AIM workflow (questioning stage)
│   │   ├── analytics/          # AnalyticsContext, store, types
│   │   ├── api/                # Custom React hooks (useProfile, useAnalytics, etc.)
│   │   ├── auth/               # Auth actions, secondary context
│   │   ├── backstage/          # Learning OS - events, Bloom's, quests, case logs
│   │   ├── canvas/             # Excalidraw mind map generator
│   │   ├── classroom/          # Classroom server actions
│   │   ├── content/            # Legacy hardcoded content + dynamic loader
│   │   ├── contexts/           # UserContext (localStorage-backed)
│   │   ├── data/               # CBME curriculum, subjects, subspecialties, topics
│   │   │   ├── cbme-*.ts       # 19 subject + 4 year CBME data files
│   │   │   ├── nmc-vault/      # NMC curriculum vault data
│   │   │   ├── templates/      # Guided module, MCQ, OSCE templates
│   │   │   └── topics/         # Static topic data (legacy)
│   │   ├── decks/              # Slide deck types and store
│   │   ├── hooks/              # useCompetencyProgress hook
│   │   ├── library/            # Library server actions
│   │   ├── markdown/           # Bionic reading transformer
│   │   ├── mindmap/            # Mind map store and types
│   │   ├── pocket/             # Bookmark/saved items store
│   │   ├── prestudy/           # Pre-study workflow store
│   │   ├── shoot/              # Bear Hunter "Shoot" stage store
│   │   ├── skin/               # Bear Hunter "Skin" stage store
│   │   ├── speech/             # Sarvam AI wrappers
│   │   ├── supabase/           # Client, server, middleware Supabase helpers
│   │   ├── templates/          # Template store
│   │   ├── types/              # Global TypeScript types
│   │   ├── auth-context.tsx    # Primary AuthProvider
│   │   ├── mindmap-engine.ts   # Mind map layout engine
│   │   ├── mock-auth.ts        # Mock auth for development
│   │   └── utils.ts            # cn() class merge utility
│   │
│   └── middleware.ts           # Route protection middleware
│
├── supabase/                   # Database layer
│   ├── config.toml             # Local Supabase config
│   ├── migrations/             # 8 migration files (001-008)
│   ├── seeds/                  # Seed data SQL files
│   ├── fixes/                  # Hotfix SQL scripts
│   └── combined-migration.sql  # All migrations in one
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs          # Tailwind v4 PostCSS plugin
├── components.json             # shadcn/ui config
├── eslint.config.mjs
└── .env.local.example
```

---

## Key Files Quick Reference

### Configuration
| File | What It Does |
|---|---|
| `package.json` | Dependencies, scripts. Build runs CBME validation first. |
| `tsconfig.json` | TypeScript config. `@/*` = `./src/*`. Target ES2017, strict mode. |
| `next.config.ts` | Traces `/content/**/*` for serverless. Transpiles lucide-react. |
| `postcss.config.mjs` | Tailwind v4 via `@tailwindcss/postcss`. |
| `components.json` | shadcn/ui: new-york style, neutral base, CSS variables, Lucide icons. |
| `.env.local.example` | Template for required environment variables. |

### Entry Points
| File | What It Does |
|---|---|
| `src/app/layout.tsx` | Root layout: dark theme, Geist fonts, AuthProvider + UserProvider + PWA. |
| `src/app/(app)/layout.tsx` | App layout: AnalyticsProvider, Sidebar, Header, BottomNav, AtomWidget. |
| `src/middleware.ts` | Route protection: public/auth/protected route logic. |

### Core Business Logic
| File | What It Does |
|---|---|
| `src/lib/auth-context.tsx` | AuthProvider: Supabase auth, Google OAuth, onboarding redirect. |
| `src/lib/contexts/UserContext.tsx` | UserProvider: localStorage profile, SM-2 spaced repetition, progress. |
| `src/lib/analytics/context.tsx` | AnalyticsProvider: dual storage, 5s debounced sync, calibration. |
| `src/lib/content/loader.ts` | Dynamic content loader: reads `/content/` filesystem, multi-tier path resolution. |
| `src/lib/data/content-mapping.ts` | Maps URL slugs to filesystem paths for content resolution. |
| `src/lib/api/hooks.ts` | Custom React hooks: useProfile, useAnalytics, useStudyPlan, etc. |
| `src/lib/backstage/store.ts` | Backstage event store: localStorage, last 500 events, background sync. |
| `src/lib/speech/sarvam.ts` | Sarvam AI wrappers for TTS and STT. |

### API Routes
| File | Route | Auth? |
|---|---|---|
| `src/app/api/chat/route.ts` | `/api/chat` | **NO** |
| `src/app/api/profile/route.ts` | `/api/profile` | Yes |
| `src/app/api/progress/route.ts` | `/api/progress` | Yes |
| `src/app/api/study-sessions/route.ts` | `/api/study-sessions` | Yes |
| `src/app/api/study-plan/route.ts` | `/api/study-plan` | Yes |
| `src/app/api/streaks/route.ts` | `/api/streaks` | Yes |
| `src/app/api/analytics/route.ts` | `/api/analytics` | Yes |
| `src/app/api/analytics/sync/route.ts` | `/api/analytics/sync` | Yes |
| `src/app/api/library/content/route.ts` | `/api/library/content` | **NO** |
| `src/app/api/speech/tts/route.ts` | `/api/speech/tts` | Yes |
| `src/app/api/speech/stt/route.ts` | `/api/speech/stt` | Yes |

---

## Naming Conventions

| Convention | Example | Usage |
|---|---|---|
| PascalCase | `AtomWidget.tsx`, `LearningProgress.tsx` | React components |
| camelCase | `auth-context.tsx`, `useProfile` | Hooks, utilities |
| kebab-case | `exam-centre`, `community-medicine` | URL slugs, directory names |
| UPPER_SNAKE | `SUBJECTS`, `TOPIC_REGISTRY` | Constants |
| `*Client.tsx` | `LibraryClient.tsx`, `ClassroomClient.tsx` | Client components paired with server pages |
| `types.ts` | `src/lib/backstage/types.ts` | Type definitions per module |
| `store.ts` | `src/lib/decks/store.ts` | localStorage-backed state stores |
| `actions.ts` | `src/lib/backstage/actions.ts` | Server actions per module |

---

## Import Aliases

All imports use the `@/` alias which maps to `./src/`:

```typescript
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { useAuth } from "@/lib/auth-context";
import type { LibraryTopic } from "@/lib/types";
```

---

## File Patterns

### Server Component + Client Component Pattern
Many pages follow a split pattern:
```
page.tsx          → async Server Component (fetches data)
*Client.tsx       → "use client" component (receives data as props)
```
Examples: `library/page.tsx` + `LibraryClient.tsx`, `classroom/page.tsx` + `ClassroomClient.tsx`

### Module Organization Pattern
Feature modules in `src/lib/` follow:
```
feature/
  types.ts        → TypeScript interfaces
  store.ts        → localStorage-backed state
  actions.ts      → Server actions (Supabase queries)
```
Examples: `backstage/`, `decks/`, `prestudy/`, `aim/`, `shoot/`, `skin/`

### Content File Pattern
Topics in `/content/` follow:
```
subject/subspecialty/topic-slug/
  _meta.yaml              → Metadata (difficulty, NMC codes, tags)
  explorer.md             → Full concept content
  exam-prep.md            → High-yield summary
  textbook.md             → Chapter-level reference
  retrieval-cards.json    → Flashcard Q&A pairs
  roadmap-ug.json         → UG learning roadmap
  roadmap-pg.json         → PG learning roadmap
```

---

## Scripts Reference

| Command | What It Does |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Validate CBME links, then `next build` |
| `npm run start` | Start production server |
| `npm run lint` | ESLint check |
| `npm run test:smoke` | Playwright smoke E2E tests |
| `npm run seed:admin` | Seed admin user to Supabase |
| `npm run content:validate` | Validate content file structure |
| `npm run validate:cbme` | Validate CBME library path links |
