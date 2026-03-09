# NucleuX Academy - Features Inventory

## Feature Status Legend

| Status | Meaning |
|---|---|
| **Live** | Fully functional with backend integration |
| **UI Ready** | UI built, uses mock/static data (no live backend) |
| **Partial** | Core functionality works, some sub-features missing |
| **Placeholder** | Route exists but content is placeholder/coming soon |

---

## Room 1: My Desk (`/desk`) - **Live**

| Feature | Status | Notes |
|---|---|---|
| ATOM Clinical Tutor CTA | Live | Links to `/chat` |
| Today's Directive (study plan) | Live | Fetches from `/api/study-plan` with 60s polling |
| Active Modules (continue learning) | Live | From study plan API |
| Current Cycle Analytics (stats cards) | Live | Study hours, MCQs, accuracy, streak |
| Knowledge Assimilation Graph | Live | Bar chart with week/month toggle |
| Active Pathway progress | Live | From study plan API |
| Crucial Deficits (weak areas) | Live | From analytics |
| Event Log (recent actions) | Live | From `/api/analytics?days=30` |
| Knowledge Graph tab | Partial | Route exists at `/graph`, visualization basic |

---

## Room 2: Library (`/library`) - **Live**

| Feature | Status | Notes |
|---|---|---|
| Subject grid with cards | Live | Fetches from Supabase, falls back to seed data |
| Training level toggle (UG/PG/SS) | Live | Filters subject grid |
| Search filtering | Live | Client-side name/description filter |
| Subject → Subspecialty → Topic drill-down | Live | Dynamic routes |
| Explorer view mode | Live | Reads `explorer.md` from filesystem |
| Exam Prep view mode | Live | Reads `exam-prep.md` |
| Textbook view mode | Live | Reads `textbook.md` |
| Quiz view mode (flashcards) | Live | Reads `retrieval-cards.json` |
| Cases view mode | Partial | Data structure exists, limited case content |
| Roadmap view mode | Partial | `RoadmapView` component exists, sparse data |
| Bionic reading mode | Live | `src/lib/markdown/bionic.ts` |
| AtomLibrarian (contextual AI) | Live | Embedded ATOM for library context |
| CBME Curriculum link | Live | Header link to `/cbme` |
| View mode recommender | Live | `view-mode-recommender.ts` suggests mode based on user state |

**Content coverage:** 25 subject directories. Surgery has the deepest content. Some subjects have placeholder content (see Known Gaps below).

---

## Room 3: Classroom (`/classroom`) - **Live**

| Feature | Status | Notes |
|---|---|---|
| Lecture list with thumbnails | Live | Fetches from `lectures` table |
| Video player with progress | Live | Per-user `user_lecture_progress` tracking |
| Mind map tab | Live | Mermaid diagram rendering |
| ATOM Mind Map generator | Live | `AtomMindMap.tsx` generates Excalidraw mind maps |
| Excalidraw canvas | Live | Full drawing tool integration |
| Slide decks | Live | Create, edit, present modes at `/classroom/decks/*` |
| Templates | Live | Template library at `/classroom/templates` |
| Live AI session | Partial | Route exists at `/classroom/live-ai`, basic implementation |

---

## Room 4: Training Centre (`/exam-centre`) - **Partial**

| Feature | Status | Notes |
|---|---|---|
| Overview dashboard | UI Ready | Stats (15k PYQs, 25k MCQs, 500 cases) are static |
| MCQ Practice (`/mcqs`) | Partial | Subject/difficulty filtering, quiz UI works. Tracking via `useTrackEvent` |
| Quick 10 / Full 50 modes | Partial | Fires analytics events, MCQ source may be limited |
| PYQ (Past Year Questions) | Placeholder | Route exists, content sparse |
| OSCE Stations | Placeholder | Route at `/exam-centre/osce/[stationId]`, template-based |
| Patient Simulator | Partial | Full `CaseData` type system, 1 case available ("Acute Appendicitis") |
| Patient Flows | Placeholder | Route at `/exam-centre/flow/[flowId]` |
| MCQ Results page | Live | At `/mcqs/results` |
| ElevenLabs voice explanation | Placeholder | Shows `alert("Voice explanation coming soon!")` - **TODO** |

---

## Room 5: CBME (`/cbme`) - **Live**

| Feature | Status | Notes |
|---|---|---|
| UG (MBBS) tab - 4 years | Live | 19 subjects with NMC competency codes |
| PG (MD/MS) tab | Live | `cbme-pg.ts` data |
| SS (DM/MCh) tab | Live | `cbme-ss.ts` data |
| 19 subject-specific pages | Live | Each with competency code listing |
| Library topic linking | Partial | 34.6% UG competencies mapped to library paths |
| NMC Vault stats | Live | Specialty, competency, textbook counts |
| Competency progress tracking | Live | `useCompetencyProgress()` + Supabase tables |
| XP and leveling system | Live | 8-tier level system (Fresher → Consultant) |
| Build-time link validation | Live | `validate-cbme-links.ts` runs during `npm run build` |

---

## Room 6: Common Room (`/community`) - **UI Ready**

| Feature | Status | Notes |
|---|---|---|
| Discussion threads | UI Ready | Mock data, no live backend calls |
| Like/reply counts | UI Ready | Static numbers |
| Subject tags | UI Ready | |
| Study Groups tab | UI Ready | Mock data |
| Top Contributors leaderboard | UI Ready | Hardcoded data |
| ATOM moderator card | UI Ready | Static |
| Faculty Office Hours | UI Ready | Static schedule |

---

## Room 7: Arena (`/arena`) - **UI Ready**

| Feature | Status | Notes |
|---|---|---|
| Daily Challenge (20 MCQs/15 min) | UI Ready | Timer works client-side, mock leaderboard |
| Tournament system | UI Ready | Hardcoded tournament data |
| Leaderboards (All India, College, State) | UI Ready | Static data |
| Rewards Shop | UI Ready | Coin prices displayed, no transaction logic |
| Live countdown timer | Live | JavaScript `setInterval` |
| XP and coins display | UI Ready | No backend economy system |

---

## Room 8: Backstage (`/backstage`) - **Live**

| Feature | Status | Notes |
|---|---|---|
| Confidence Calibration gauge | Live | Compares confidence vs accuracy |
| Stats row (hours, MCQs, accuracy, topics) | Live | From `getBackstageStats()` |
| NBME Domain Progress bars | Live | Color-coded by accuracy tier |
| Weekly Quests | Live | From `getBackstageQuests()`, coin rewards |
| Subject Performance Map | Live | Color-coded accuracy cards |
| Study Streak Heatmap | Live | GitHub-style contribution graph |
| ATOM Insights | Live | AI-generated insight cards |
| Calibration page (`/backstage/calibration`) | Live | Detailed calibration analysis |
| Logbook page (`/backstage/logbook`) | Partial | Route exists |
| Quests page (`/backstage/quests`) | Live | Full quest tracking |

---

## Cross-Cutting Features

| Feature | Status | Notes |
|---|---|---|
| **ATOM (ATOMic Thinking and Organisational Model)** | Live | Thinking partner across all rooms. 9 modes: Command Centre, Librarian, Lecture Partner, Practice Partner, Competency Guide, Debate Moderator, Competition Coach, Cognitive Coach, Open Studio (`/chat`). SSE streaming, RAG, multimodal. Memory: planned. |
| **Text-to-Speech** | Live | Sarvam AI, 3 languages (en-IN, te-IN, hi-IN) |
| **Speech-to-Text** | Live | Sarvam AI, code-mixing mode |
| **PWA / Offline** | Live | Service worker, install prompt, `/offline` fallback |
| **Supabase Auth** | Live | Email/password + Google OAuth |
| **SM-2 Spaced Repetition** | Live | Client-side in UserContext (localStorage) |
| **Analytics (dual storage)** | Live | localStorage first → 5s debounced Supabase sync |
| **Offline Sync** | Live | Bulk upload via `/api/analytics/sync` |
| **Dark Theme** | Live | Only theme - `#0F172A` base, `class="dark"` |
| **Responsive Mobile** | Live | Bottom nav, mobile-optimized layouts |
| **Product Tour** | Live | Shepherd.js onboarding |
| **Search** | Partial | Header search input exists, implementation basic |
| **Notifications** | Placeholder | Route at `/notifications`, no push notifications |
| **Bookmarks** | Partial | Route at `/bookmarks`, pocket store exists |

---

## Bear Hunter Learning System

| Stage | Status | Notes |
|---|---|---|
| Pre-study | Live | `prestudy/store.ts` - keyword extraction, chunking |
| Aim (questioning) | Live | `aim/store.ts` - 5 question types per chunk |
| Shoot (engagement) | Live | `shoot/store.ts` - layered content, VPREfRE scoring |
| Skin (consolidation) | Live | `skin/store.ts` - GRINDE-map scoring |
| Mind Map generation | Live | `mindmap/store.ts` - auto-generated from workflow |
| Kolb Reflections | Live | DB table + UI (experience → reflection → abstraction → experiment) |
| BEDS-M Habits | Live | DB table (Breaks, Environment, Deep sleep, Intentions, Mindfulness) |

---

## Known Gaps and TODOs

### From Code Comments

| Location | TODO | Priority |
|---|---|---|
| `src/components/LearningProgress.tsx:84` | Daily session minutes hardcoded to `0` - needs calculation from today's sessions | Medium |
| `src/app/(app)/practice/[id]/page.tsx:754` | ElevenLabs TTS integration missing - shows `alert("Voice explanation coming soon!")` | Low |
| `src/app/api/analytics/sync/route.ts:39` | NOTE: `questionId` → `mcq_id` mapping concern during analytics sync | Medium |

### From Analysis

| Gap | Description | Impact |
|---|---|---|
| **Unauthenticated API routes** | `/api/chat` and `/api/library/content` have no auth check | Security - anyone can use ATOM chat and load content |
| **No generated Supabase types** | Codebase uses `supabase.from('table').select(...)` with implicit `any` typing | Type safety |
| **Common Room / Arena mock data** | Two rooms have no live backend - all data is hardcoded | Feature completeness |
| **Search not fully implemented** | Header search input exists but doesn't actually search | UX |
| **Notifications placeholder** | Route exists but no notification system | UX |
| **Light mode not supported** | Hardcoded dark theme only | Accessibility |
| **Content coverage uneven** | Surgery has deep content; some subjects have only placeholder directories | Content completeness |
| **Allied Subject Map** | `allied-subject-map.ts` marked as "coming soon" in CBME v1 | Feature gap |
| **6 esophagus topics** | Placeholder content with TODO markers for rich interactive content | Content |
| **No React Query / SWR** | Custom `useQuery` hook without caching, deduplication, or revalidation | Developer experience |
