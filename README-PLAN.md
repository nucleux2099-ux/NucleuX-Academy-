# 🧬 NucleuX Academy

**Learn Atomically. Grow Exponentially.**

A complete learning ecosystem with personalized AI agents, adaptive pathways, and proactive engagement.

---

## Vision

NucleuX Academy is not just another LMS. It's a **learning companion** that:
- Understands how you learn
- Adapts to your pace and style
- Reaches out when you need a nudge
- Celebrates your wins

Built on the principles of **atomic learning** — breaking complex knowledge into digestible units that compound over time.

---

## Core Components

### 📚 Library
- Curated study materials and notes
- Structured by specialty, topic, and difficulty
- Rich text, images, diagrams
- Searchable, taggable, bookmarkable

### 📊 Learning Management System (LMS)
- Track reading time and engagement
- Log what you've read, when, and how long
- Progress visualization
- Streak tracking and accountability

### 🛤️ Personalized Pathways
- AI-generated learning paths based on:
  - Your goals
  - Your current knowledge level
  - Your available time
  - Your learning patterns
- Adaptive recommendations: "Read this next"

### ❓ Assessment Engine
- MCQs with spaced repetition
- Topic-wise question banks
- Performance analytics
- Identify weak areas automatically

### 🤖 Proactive Agent (ATOM)
- Personal AI tutor
- Reaches out via **Telegram** or **WhatsApp**
- Sends reminders, questions, encouragement
- Available 24/7 for doubts
- Learns your preferences over time

---

## Target Users

1. **Medical Students** — MBBS, MD/MS, superspecialty
2. **Practicing Doctors** — Continuing education
3. **Competitive Exam Aspirants** — NEET PG, FMGE, USMLE
4. **Lifelong Learners** — Anyone seeking structured knowledge

---

## Tech Stack (Proposed)

### Frontend
- **Next.js 15** — React framework with App Router
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — Beautiful, accessible components
- **Framer Motion** — Smooth animations

### Backend
- **Node.js** with **Hono** or **Express**
- **PostgreSQL** — Primary database
- **Redis** — Caching and sessions
- **Prisma** — ORM

### AI/Agent Layer
- **Clawdbot** — Agent orchestration
- **Claude API** — LLM backbone
- **Telegram Bot API** — Proactive messaging
- **WhatsApp Cloud API** — Alternative channel

### Infrastructure
- **Vercel** — Frontend hosting
- **Railway** / **Fly.io** — Backend
- **Supabase** — Auth + Realtime (optional)
- **S3/R2** — Content storage

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NucleuX Academy                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Library │  │   LMS    │  │ Pathways │  │   MCQs   │   │
│  │  (Read)  │  │  (Track) │  │ (Guide)  │  │  (Test)  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │             │             │          │
│       └─────────────┴──────┬──────┴─────────────┘          │
│                            │                                │
│                    ┌───────▼───────┐                       │
│                    │   User Data   │                       │
│                    │   (Progress,  │                       │
│                    │   Preferences)│                       │
│                    └───────┬───────┘                       │
│                            │                                │
│                    ┌───────▼───────┐                       │
│                    │  ATOM Agent   │                       │
│                    │  (Proactive   │                       │
│                    │   Learning    │                       │
│                    │   Partner)    │                       │
│                    └───────┬───────┘                       │
│                            │                                │
│              ┌─────────────┴─────────────┐                 │
│              │                           │                  │
│       ┌──────▼──────┐           ┌───────▼───────┐         │
│       │  Telegram   │           │   WhatsApp    │         │
│       │    Bot      │           │     Bot       │         │
│       └─────────────┘           └───────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup and design system
- [ ] Logo and branding
- [ ] Basic library structure
- [ ] User auth

### Phase 2: Core Features (Week 3-4)
- [ ] Library with content upload
- [ ] Reading time tracking
- [ ] Basic progress dashboard

### Phase 3: Intelligence (Week 5-6)
- [ ] MCQ engine
- [ ] Personalized pathways
- [ ] Spaced repetition

### Phase 4: Agent Integration (Week 7-8)
- [ ] Telegram bot integration
- [ ] Proactive messaging
- [ ] WhatsApp support

### Phase 5: Polish & Launch
- [ ] Analytics dashboard
- [ ] Mobile optimization
- [ ] Beta launch

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/nucleux-academy/nucleux-academy.git

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local

# Run development server
pnpm dev
```

---

## Philosophy

> "What is the smallest idea that explains the largest pattern?"

Learning isn't about consuming more content. It's about:
1. **Encoding effectively** — Active engagement, not passive reading
2. **Retrieving often** — Testing yourself, not just reviewing
3. **Connecting deeply** — Building knowledge networks

NucleuX Academy embeds these principles into every feature.

---

## License

MIT

---

*Built with 🦁 by Narasimha & Aditya*
