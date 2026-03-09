# NucleuX Academy - Project Overview

## What Is This?

NucleuX Academy is a **medical education platform** for Indian MBBS/MD/MS/DM/MCh students. It uses a "virtual campus" metaphor with **8 rooms**, each representing a distinct study feature. The platform integrates AI tutoring, spaced repetition, gamification, and NMC CBME (Competency-Based Medical Education) curriculum tracking.

**Target Users:** Indian medical students preparing for NEET-PG, INI-CET, USMLE Step 1/2, MRCS, FMGE, NEET SS.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Framework** | Next.js (App Router) | 16.1.6 |
| **UI Library** | React | 19.2.3 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS v4 + shadcn/ui (new-york style) | v4 / v3.8 |
| **Animation** | Framer Motion | 12.33.0 |
| **Icons** | Lucide React | 0.460.0 |
| **Backend/DB** | Supabase (PostgreSQL + Auth + RLS) | 2.95.3 |
| **AI Chatbot** | Anthropic Claude (claude-sonnet-4-20250514) | SDK 0.74.0 |
| **Speech AI** | Sarvam AI (TTS: bulbul:v3, STT: saaras:v3) | REST API |
| **Diagrams** | Mermaid | 11.12.2 |
| **Canvas** | Excalidraw | 0.18.0 |
| **Charts** | Recharts | 3.7.0 |
| **Onboarding** | Shepherd.js | 14.5.1 |
| **E2E Testing** | Playwright | 1.58.2 |
| **Markdown** | react-markdown + remark-gfm + rehype-highlight | 10.1.0 |
| **PWA** | Service Worker + Web App Manifest | Custom |

---

## The 8 Rooms (Feature Modules)

| # | Room | Route | Purpose |
|---|---|---|---|
| 1 | **My Desk** | `/desk` | Command center dashboard - daily plan, stats, streak, analytics overview |
| 2 | **Library** | `/library` | Medical knowledge encyclopedia - browse subjects/subspecialties/topics with 6 view modes |
| 3 | **Classroom** | `/classroom` | Video lectures, Excalidraw canvas, mind maps, slide decks |
| 4 | **Training Centre** | `/exam-centre` | MCQ practice, PYQ (Past Year Questions), OSCE stations, patient simulator |
| 5 | **CBME** | `/cbme` | NMC competency curriculum tracker across 19 subjects and 4 MBBS years |
| 6 | **Common Room** | `/community` | Social discussion forum, study groups |
| 7 | **Arena** | `/arena` | Competitive MCQ practice, leaderboards, tournaments, rewards shop |
| 8 | **Backstage** | `/backstage` | Personal cognitive analytics - confidence calibration, study heatmap, quests |

---

## AI Integration

### ATOM (ATOMic Thinking and Organisational Model)

ATOM is the AI **thinking partner** that lives across all rooms of the NucleuX Academy campus. Unlike a traditional chatbot, ATOM is a context-aware companion with memory that adapts its mode of work based on where the student is and what they're doing. Created by two physician brothers who wanted to make medical learning "atomic" — breaking complex topics into fundamental units and building up.

**Core Design:**
- **Thinking partner, not a search engine** — helps students reason through problems atomically
- **Memory-enabled** — remembers past conversations, learning progress, and weak areas
- **Room-aware** — automatically shifts mode based on the current room context
- **Dedicated page** — full Open Studio experience at `/chat`
- **Floating widget** — quick access from any room via bottom-right widget

**Room Modes:**

| Room | ATOM Mode | Behavior |
|---|---|---|
| My Desk | **Command Centre** | Plans study sessions, identifies priorities, optimizes workflow |
| Library | **Librarian** | Navigates topics, finds connections, guides exploration |
| Classroom | **Lecture Partner** | Watches along, takes notes, generates mind maps |
| Training Centre | **Practice Partner** | Explains answers, guides through cases, builds clinical reasoning |
| CBME | **Competency Guide** | Guides through NMC competencies, tracks mastery |
| Common Room | **Debate Moderator** | Fact-checks, adds sources, enriches debate, summarizes threads |
| Arena | **Competition Coach** | Coaches competitive performance, speed tips, accuracy, ranking strategy |
| Backstage | **Cognitive Coach** | Coaches metacognition, calibration, self-awareness |
| `/chat` | **Open Studio** | Full-featured unrestricted thinking partner — deep conversations |

**Technical Implementation:**
- **Model:** Claude Sonnet (`claude-sonnet-4-20250514`) via Anthropic SDK
- **Method:** RAG (Retrieval-Augmented Generation) — scans `/content/` markdown files, injects top 5 most relevant files (up to 30,000 chars) into the system prompt
- **Delivery:** Server-Sent Events (SSE) streaming at `/api/chat`
- **Multimodal:** Supports text + base64 image inputs

**Implementation Status:**
- Live: Room-aware mode switching (floating widget adapts per room)
- Live: RAG content grounding from `/content/` filesystem
- Live: SSE streaming responses
- Live: Dedicated `/chat` page with sources panel and action generation
- Planned: Persistent memory across sessions (currently session-only)
- Planned: User learning profile integration into conversations

### Sarvam AI (Indian Language Speech)
- **TTS:** `bulbul:v3` model - text to speech in en-IN, te-IN, hi-IN
- **STT:** `saaras:v3` model - speech to text with code-mixing mode
- **Endpoint:** `/api/speech/tts` and `/api/speech/stt`

---

## Learning Science Frameworks

| Framework | Implementation |
|---|---|
| **SM-2 Spaced Repetition** | Client-side in UserContext - flashcards track interval and ease factor |
| **Bloom's Taxonomy** | Events tagged with cognitive levels (remember → create) in Backstage |
| **Kolb's Learning Cycle** | `kolb_reflections` DB table - experience, reflection, abstraction, experiment |
| **Bear Hunter System** | Pre-study → Aim → Shoot → Skin workflow stages |
| **BEDS-M Framework** | Daily habit tracking: Breaks, Environment, Deep sleep, Intentions, Mindfulness |
| **Ebbinghaus Forgetting Curve** | Topic memory strength decay calculation in analytics |
| **Confidence Calibration** | Backstage gauge comparing self-reported confidence vs actual accuracy |

---

## Content Architecture

Content is **filesystem-based** in `/content/[subject]/[subspecialty]/[topic]/`:

```
content/
  surgery/
    esophagus/
      gerd-hiatal-hernia/
        _meta.yaml           # Topic metadata, NMC codes
        explorer.md          # Full concept content
        exam-prep.md         # High-yield summary
        textbook.md          # Chapter-level content
        retrieval-cards.json # Flashcard Q&A pairs
        roadmap-ug.json      # UG learning roadmap
```

**25 subject directories** covering the full MBBS curriculum. Each topic supports 6 view modes: Explorer, Exam Prep, Textbook, Quiz, Cases, Roadmap.

---

## Key Design Decisions

1. **Supabase over custom backend** - Auth, DB, RLS, and real-time all in one. No separate backend server.
2. **Filesystem-based content** - Medical content lives in markdown files, not the database. Enables version control, easy authoring, and serverless loading.
3. **localStorage-first analytics** - Client accumulates events in localStorage, then bulk-syncs to Supabase with 5-second debounce. Supports offline usage.
4. **No external state library** - Uses React Context (AuthContext, UserContext, AnalyticsContext) + localStorage. No Redux, Zustand (except a few feature-specific stores), or React Query.
5. **PWA with offline fallback** - Service worker, standalone display, install prompt. `/offline` page for connectivity issues.
6. **Dark theme only** - Base background `#0F172A`, class `"dark"` on root element. No light mode toggle.

---

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-side only) |
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key for ATOM AI chat |
| `SARVAM_API_KEY` | For speech | Sarvam AI key for TTS/STT |

---

## Project Metadata

- **Package name:** `nucleux-temp`
- **Version:** `0.1.0`
- **Private:** true
- **License:** Not specified (private project)
- **Node target:** ES2017
- **Module resolution:** Bundler
- **Path alias:** `@/*` maps to `./src/*`
