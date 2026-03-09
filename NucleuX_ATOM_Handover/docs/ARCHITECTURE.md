# NucleuX Academy - Architecture

## System Architecture Diagram

```
                        ┌─────────────────────────────────────────┐
                        │              Client (Browser)            │
                        │                                         │
                        │  ┌──────────┐  ┌──────────┐  ┌───────┐│
                        │  │AuthContext│  │UserContext│  │Analyt.││
                        │  │(Supabase)│  │(localStorage)│Context ││
                        │  └────┬─────┘  └────┬──────┘  └──┬────┘│
                        │       │             │             │     │
                        │  ┌────┴─────────────┴─────────────┴───┐ │
                        │  │     React Components (8 Rooms)      │ │
                        │  │  Desk|Library|Classroom|TrainingCtr  │ │
                        │  │  CBME|CommonRoom|Arena|Backstage    │ │
                        │  └────────────────┬────────────────────┘ │
                        │                   │                      │
                        │  ┌────────────────┴────────────────────┐ │
                        │  │   AtomWidget (Floating AI Chat)     │ │
                        │  │   Service Worker (PWA/Offline)      │ │
                        │  └────────────────┬────────────────────┘ │
                        └───────────────────┼──────────────────────┘
                                            │
                              ┌──────────────┼──────────────┐
                              ▼              ▼              ▼
                    ┌─────────────┐ ┌──────────────┐ ┌──────────┐
                    │ Next.js API │ │  Supabase    │ │  Static  │
                    │   Routes    │ │  (Direct)    │ │  Content │
                    │             │ │              │ │  /content│
                    │ /api/chat   │ │ Auth         │ │          │
                    │ /api/profile│ │ PostgreSQL   │ │ Markdown │
                    │ /api/speech │ │ RLS Policies │ │ YAML     │
                    │ /api/...   │ │ Realtime     │ │ JSON     │
                    └──────┬──────┘ └──────────────┘ └──────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │Anthropic │ │ Sarvam   │ │ Supabase │
        │  Claude  │ │   AI     │ │   DB     │
        │  API     │ │ TTS/STT  │ │          │
        └──────────┘ └──────────┘ └──────────┘
```

---

## Route Groups (Next.js App Router)

```
src/app/
├── layout.tsx              # Root: AuthProvider → UserProvider → PWA
├── page.tsx                # / (marketing landing)
│
├── (marketing)/            # Public pages (no auth)
│   ├── layout.tsx          # Minimal dark layout
│   ├── landing/page.tsx    # /landing
│   ├── campus/page.tsx     # /campus
│   ├── pricing/page.tsx    # /pricing
│   ├── about/page.tsx      # /about
│   ├── faq/page.tsx        # /faq
│   ├── contact/page.tsx    # /contact
│   └── rooms/page.tsx      # /rooms
│
├── (auth)/                 # Auth pages (redirect if logged in)
│   ├── layout.tsx          # Split-screen layout
│   ├── login/page.tsx      # /login
│   ├── signup/page.tsx     # /signup
│   ├── forgot-password/    # /forgot-password
│   └── reset-password/     # /reset-password
│
├── (app)/                  # Authenticated app (THE MAIN APP)
│   ├── layout.tsx          # AnalyticsProvider + Sidebar + Header + BottomNav + AtomWidget
│   ├── desk/page.tsx       # /desk (dashboard)
│   ├── library/            # /library/* (content browser)
│   ├── classroom/          # /classroom/* (lectures, canvas, mindmap)
│   ├── exam-centre/        # /exam-centre/* (Training Centre — MCQs, OSCE, simulator)
│   ├── cbme/               # /cbme/* (19 subject pages)
│   ├── community/          # /community (forum)
│   ├── arena/              # /arena (competitive)
│   ├── backstage/          # /backstage/* (analytics)
│   ├── chat/page.tsx       # /chat (full ATOM)
│   ├── profile/            # /profile
│   ├── settings/           # /settings
│   └── ... (20+ more pages)
│
├── api/                    # API Routes (11 total)
│   ├── chat/route.ts       # ATOM AI (NO AUTH)
│   ├── profile/route.ts    # User profile CRUD
│   ├── progress/route.ts   # Topic progress
│   ├── study-sessions/     # Session management
│   ├── study-plan/         # AI study plan
│   ├── streaks/route.ts    # Streak tracking
│   ├── analytics/          # Event logging + sync
│   ├── library/content/    # Content loader (NO AUTH)
│   └── speech/             # TTS + STT
│
└── auth/callback/route.ts  # Supabase OAuth callback
```

---

## Component Hierarchy

```
Root Layout
├── AuthProvider (Supabase auth state)
│   └── UserProvider (localStorage user profile + SM-2)
│       ├── InstallPrompt (PWA)
│       ├── ServiceWorkerRegistration
│       │
│       ├── (marketing) Layout → MarketingHeader + public pages
│       ├── (auth) Layout → Login/Signup forms
│       │
│       └── (app) Layout
│           ├── AnalyticsProvider (event tracking + sync)
│           ├── Sidebar (desktop, 64px left)
│           ├── Header (sticky top, search + profile dropdown)
│           ├── BottomNav (mobile)
│           ├── AtomWidget (floating AI chat bubble)
│           ├── PageTransition (Framer Motion)
│           │
│           └── Page Content
│               ├── Server Components (data fetching)
│               └── *Client.tsx (interactivity)
```

---

## Data Flow Patterns

### Pattern 1: Server Component Data Fetching
Used by: Library, Classroom, Backstage

```
Server Component (async)
  → Supabase query (via createClient from server.ts)
  → Pass data as props to *Client.tsx
  → Client component handles interactivity
```

### Pattern 2: Client-Side API Hooks
Used by: Desk, MCQs, Analytics, Profile

```
Client Component
  → useProfile() / useAnalytics() / useStudyPlan()
  → GET /api/[route]
  → API route calls createClient() (server-side Supabase)
  → Returns JSON to client
```

### Pattern 3: ATOM AI Streaming
Used by: AtomWidget, Chat page

```
Client Component
  → POST /api/chat { messages, context, deskSources }
  → API route: keyword-search /content/ for RAG
  → Stream Claude response via SSE
  → Client reads ReadableStream line by line
  → Incremental UI updates as tokens arrive
```

### Pattern 4: Offline-First Analytics
Used by: AnalyticsContext (wraps entire app)

```
User Action (MCQ attempt, reading session, etc.)
  → Write to localStorage immediately
  → 5-second debounce timer
  → POST /api/analytics/sync (bulk upload)
  → De-duplicate on server (composite key checks)
  → Upsert to Supabase
```

### Pattern 5: Internal Route Chaining
Used by: Progress, Study Sessions → Streaks

```
POST /api/progress  ──► internal fetch ──► POST /api/streaks
POST /api/study-sessions ──► internal fetch ──► POST /api/streaks
  (passes original cookie for auth propagation)
```

---

## Authentication Flow

```
User visits any protected route
  → src/middleware.ts intercepts
  → updateSession() refreshes Supabase cookie
  → Check if route is public → allow
  → Check if route is auth route + user logged in → redirect to /desk
  → Check if user is not logged in → redirect to /login?redirect=<path>

Login/Signup
  → AuthProvider.login(email, password) or loginWithGoogle()
  → Supabase auth
  → onAuthStateChange callback fires
  → Check profiles.onboarding_completed
  → If false → /onboarding
  → If true → /desk

Session Management
  → @supabase/ssr handles cookie-based sessions
  → Server client (server.ts): reads cookies in Server Components/API routes
  → Browser client (client.ts): uses browser cookies directly
  → Middleware refreshes session on every request
```

---

## Content Loading Architecture

```
Three resolution strategies (tried in order):

1. DIRECT PATH
   /content/{subject}/{subspecialty}/{topic}/textbook.md

2. CONTENT MAPPING
   content-mapping.ts → getSubjectFolder() → getContentFolder() → getContentFilename()
   Maps slugs to actual filesystem paths

3. NUMBERED PREFIX SCAN
   Scans for directories like "01-topic-name", "02-another-topic"
   Strips numeric prefix for matching

Security: path.normalize().startsWith(CONTENT_BASE) check prevents traversal
```

---

## Dual Content Systems

The project has two parallel content systems:

### System A: TypeScript Static Data (Legacy)
- Located in `src/lib/data/topics/*.ts` and `src/lib/content/*.ts`
- Hardcoded `LibraryTopic[]` arrays with inline content
- Registered in `TOPIC_REGISTRY` in `src/lib/data/topics/index.ts`
- Being phased out in favor of System B

### System B: Filesystem Dynamic Loading (Current)
- Located in `/content/[subject]/[subspecialty]/[topic]/`
- Loaded by `src/lib/content/loader.ts`
- Markdown files with YAML frontmatter and `_meta.yaml` metadata
- Supports multiple view modes per topic
- Used by `/api/library/content` and `/api/chat` (RAG)

---

## State Management Map

| Store | Type | Scope | Key |
|---|---|---|---|
| AuthContext | React Context | Global | Supabase session |
| UserContext | React Context + localStorage | Global | `nucleux_user_profile` |
| AnalyticsContext | React Context + localStorage | App pages | `nucleux.analytics.*` |
| BackstageStore | localStorage | Backstage | `nucleux.backstage.v1` |
| DeckStore | localStorage | Classroom | `nucleux.decks.v1` |
| MindMapStore | localStorage | Classroom | `nucleux.mindmaps.v1` |
| PreStudyStore | localStorage | Bear Hunter | `nucleux.prestudy.v1` |
| AimStore | localStorage | Bear Hunter | `nucleux.aim.v1` |
| ShootStore | localStorage | Bear Hunter | `nucleux.shoot.v1` |
| SkinStore | localStorage | Bear Hunter | `nucleux.skin.v1` |
| PocketStore | localStorage | Notes | `nucleux.pocket.v1` |
| TemplateStore | localStorage | Classroom | `nucleux.templates.v1` |

---

## External Service Dependencies

| Service | Used By | Env Variable | Failure Impact |
|---|---|---|---|
| Supabase | Auth, DB, all API routes | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | App non-functional |
| Anthropic Claude | ATOM chat (`/api/chat`) | `ANTHROPIC_API_KEY` | AI chat disabled |
| Sarvam AI | Speech (`/api/speech/*`) | `SARVAM_API_KEY` | Speech features disabled |
| Local filesystem | Content loading, RAG | N/A (deployed with app) | Library and chat context broken |
