# NucleuX Academy — Design Documentation

**Version:** 1.0
**Created:** 2026-02-07
**Author:** Vishwakarma 🛠️
**Status:** Draft for Aditya's Approval

---

## 📑 Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Information Architecture](#2-information-architecture)
3. [Page Specifications](#3-page-specifications)
4. [Component Library](#4-component-library)
5. [User Flows](#5-user-flows)
6. [Database Schema](#6-database-schema)
7. [API Design](#7-api-design)
8. [Mobile Design](#8-mobile-design)

---

## 1. Design Philosophy

### Brand Identity

| Element | Value |
|---------|-------|
| **Primary Color** | Purple (#7C3AED) — Mastery, wisdom |
| **Accent Colors** | Cyan (#06B6D4), Green (#10B981), Orange (#F59E0B) |
| **Background** | Deep Blue (#0F172A) |
| **Typography** | Inter (UI), Space Grotesk (Headings) |
| **Theme** | Dark-first, premium, focused |

### Design Principles

1. **Dense but Navigable** — Like chromatin in a nucleus
2. **Atomic Structure** — Small, focused units of information
3. **Interlinked** — Everything connects to everything
4. **Progressive Disclosure** — Show complexity only when needed
5. **Focus Mode** — Minimize distractions during learning

### Visual Language

- **Glow effects** on interactive elements
- **Gradient accents** for emphasis
- **Card-based layouts** for content
- **Subtle animations** for feedback
- **Glass morphism** for modals/overlays

---

## 2. Information Architecture

### Site Map

```
NucleuX Academy
│
├── 🏠 Landing (/)
│   ├── Hero
│   ├── Features
│   ├── Testimonials
│   └── CTA → Sign Up
│
├── 🚀 Onboarding (/onboarding)
│   ├── Step 1: Specialty Selection
│   ├── Step 2: Learning Goals
│   ├── Step 3: Schedule Setup
│   └── Step 4: First Pathway
│
├── 📊 Dashboard (/dashboard)
│   ├── Stats Overview
│   ├── Current Pathway Progress
│   ├── Upcoming Tasks
│   ├── Recent Activity
│   └── Quick Actions
│
├── 📚 Library (/library)
│   ├── Curated Content
│   │   ├── By Specialty
│   │   ├── By System
│   │   └── By Topic
│   ├── Personal Atoms
│   │   ├── My Notes
│   │   ├── Bookmarks
│   │   └── Highlights
│   └── Search & Filters
│
├── 📖 Reading View (/library/[id])
│   ├── Content Display
│   ├── Note Taking
│   ├── Highlighting
│   ├── Citation Info
│   └── Related Atoms
│
├── 🛤️ Pathways (/pathways)
│   ├── Pathway List
│   ├── Topic Roadmap
│   └── Milestones
│
├── 🛤️ Pathway Detail (/pathways/[id])
│   ├── Visual Roadmap
│   ├── Topic Cards
│   ├── Progress Tracking
│   └── Time Estimates
│
├── ❓ MCQs (/mcqs)
│   ├── Practice Mode
│   ├── Timed Quiz Mode
│   ├── Review Mistakes
│   └── Spaced Repetition Queue
│
├── 📊 Quiz Results (/mcqs/results/[id])
│   ├── Score Summary
│   ├── Time Analysis
│   ├── Topic Breakdown
│   └── Review Button
│
├── 🤖 ATOM Chat (/chat)
│   ├── Conversation View
│   ├── Context Cards
│   ├── Citation Sidebar
│   └── Quick Actions
│
├── 🔗 Knowledge Graph (/graph)
│   ├── Interactive Visualization
│   ├── Filter by Topic
│   ├── Click to Navigate
│   └── Zoom/Pan Controls
│
├── 📝 My Notes (/notes)
│   ├── All Notes
│   ├── By Topic
│   ├── By Date
│   └── Quick Add
│
├── 👤 Profile (/profile)
│   ├── User Info
│   ├── Preferences
│   ├── Achievements
│   └── Settings
│
└── 🔐 Auth Pages
    ├── Login (/login)
    ├── Signup (/signup)
    └── Forgot Password (/forgot-password)
```

### Navigation Structure

**Desktop Sidebar:**
```
┌─────────────────────┐
│ 🧬 NucleuX Academy  │ ← Logo + Home
├─────────────────────┤
│ 📊 Dashboard        │
│ 📚 Library          │
│ 🛤️ Pathways         │
│ ❓ MCQs             │
│ 🤖 ATOM             │ ← AI Chat
│ 🔗 Graph            │
│ 📝 Notes            │
├─────────────────────┤
│ 👤 Profile          │
│ ⚙️ Settings         │
│ 🚪 Logout           │
└─────────────────────┘
```

**Mobile Bottom Nav:**
```
┌────┬────┬────┬────┬────┐
│ 🏠 │ 📚 │ 🤖 │ ❓ │ 👤 │
│Home│Lib │ATOM│Quiz│Me  │
└────┴────┴────┴────┴────┘
```

---

## 3. Page Specifications

### 3.1 Landing Page (/)

**Purpose:** Convert visitors to users

**Sections:**
| Section | Content |
|---------|---------|
| **Hero** | Headline, tagline, CTA, logo animation |
| **Problem** | Pain points medical students face |
| **Solution** | NucleuX philosophy (atomic thinking) |
| **Features** | 4 feature cards with icons |
| **How It Works** | 3-step visual flow |
| **Testimonials** | 3 student quotes |
| **Pricing** | Free tier + Pro tier |
| **Footer CTA** | Final signup push |

**Key Elements:**
- Floating logo with orbital animation
- Smooth scroll navigation
- Stats counter (10,000+ atoms, 500+ students)
- Video demo embed (optional)

---

### 3.2 Dashboard (/dashboard)

**Purpose:** Daily command center

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│ Welcome back, [Name]! 🔥 12-day streak               │
├───────────────┬──────────────────────────────────────┤
│               │                                      │
│  📊 Stats     │  📈 Weekly Progress Chart            │
│  Cards (4)    │                                      │
│               │                                      │
├───────────────┼──────────────────────────────────────┤
│               │                                      │
│  🛤️ Current   │  📅 Upcoming                         │
│  Pathway      │  Tasks                               │
│               │                                      │
├───────────────┴──────────────────────────────────────┤
│                                                      │
│  🕐 Recent Activity Feed                             │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Stats Cards:**
1. Total Study Hours
2. Topics Completed
3. MCQs Attempted
4. Current Streak

**Actions:**
- Continue Learning → Resume last pathway
- Quick Quiz → Start random MCQ
- Ask ATOM → Open chat

---

### 3.3 Library (/library)

**Purpose:** Browse and discover content

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│  🔍 Search...                    [Filters] [+ Add]   │
├──────────────────────────────────────────────────────┤
│  [All] [Surgery] [Medicine] [Pediatrics] [Bookmarks] │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │  Card   │  │  Card   │  │  Card   │  │  Card   │ │
│  │         │  │         │  │         │  │         │ │
│  │  Title  │  │  Title  │  │  Title  │  │  Title  │ │
│  │  Meta   │  │  Meta   │  │  Meta   │  │  Meta   │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘ │
│                                                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │  Card   │  │  Card   │  │  Card   │  │  Card   │ │
│  │   ...   │  │   ...   │  │   ...   │  │   ...   │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Card Types:**
| Icon | Type | Description |
|------|------|-------------|
| 📝 | Note | Core concept |
| 🖼️ | Diagram | Visual learning |
| 💎 | Pearl | High-yield point |
| 🧠 | Mnemonic | Memory aid |
| 💊 | Dose Card | Drug calculation |
| 🏥 | Case | Clinical scenario |

**Interactions:**
- Hover: Lift + glow effect
- Click: Open reading view
- Long press: Quick actions (bookmark, share)

---

### 3.4 Reading View (/library/[id])

**Purpose:** Deep reading experience

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│  ← Back        [Bookmark] [Share] [Edit]             │
├────────────────────────────────┬─────────────────────┤
│                                │                     │
│                                │  📌 Related         │
│      Main Content              │  ─────────────      │
│                                │  • Link 1           │
│      Title                     │  • Link 2           │
│      ──────                    │  • Link 3           │
│                                │                     │
│      Body text with            │  📖 Citation        │
│      highlighting support      │  ─────────────      │
│                                │  Source: Maingot's  │
│      Images, diagrams          │  Ed: 12th           │
│                                │  Page: 245          │
│      [Add Note Here]           │                     │
│                                │  🧠 My Notes        │
│                                │  ─────────────      │
│                                │  (Note input area)  │
│                                │                     │
├────────────────────────────────┴─────────────────────┤
│  ← Previous          [Mark Complete]          Next → │
└──────────────────────────────────────────────────────┘
```

**Features:**
- Text highlighting with color options
- Inline note adding
- Citation always visible
- Related atoms sidebar
- Reading time tracker
- Progress indicator

---

### 3.5 ATOM Chat (/chat) — THE KEY PAGE

**Purpose:** AI-powered tutoring

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│  🤖 ATOM                     [New Chat] [History]    │
├──────────────────────────────┬───────────────────────┤
│                              │                       │
│  ┌──────────────────────┐    │  📚 Current Context   │
│  │ User: Explain portal │    │  ─────────────────    │
│  │       hypertension   │    │  Topic: Liver         │
│  └──────────────────────┘    │  System: GI           │
│                              │  Pathway: Hepatology  │
│  ┌──────────────────────┐    │                       │
│  │ ATOM: Portal         │    │  📖 Sources           │
│  │ hypertension is...   │    │  ─────────────────    │
│  │                      │    │  • Sleisenger 11th    │
│  │ [Diagram inserted]   │    │  • Maingot's 12th     │
│  │                      │    │                       │
│  │ 📖 Citation:         │    │  💡 Quick Actions     │
│  │ Sleisenger Ch.74     │    │  ─────────────────    │
│  └──────────────────────┘    │  • Quiz me on this    │
│                              │  • Show related       │
│  ┌──────────────────────┐    │  • Add to pathway     │
│  │ User: What causes it?│    │  • Save as note       │
│  └──────────────────────┘    │                       │
│                              │                       │
├──────────────────────────────┴───────────────────────┤
│  ┌──────────────────────────────────────────────┐    │
│  │ Type a message...                    [Send]  │    │
│  └──────────────────────────────────────────────┘    │
│  [📎 Attach] [🎤 Voice] [📷 Image] [⚡ Quick Q]      │
└──────────────────────────────────────────────────────┘
```

**ATOM Persona:**
- Friendly but rigorous
- Always cites sources
- Asks clarifying questions
- Uses the Socratic method
- Catches fluency illusions
- Encourages active recall

**Message Types:**
| Type | Format |
|------|--------|
| Text | Markdown rendered |
| Diagram | Inline SVG/image |
| Citation | Collapsible card |
| Quiz | Interactive MCQ |
| Link | Library atom link |
| Formula | LaTeX rendered |

**Quick Actions (Buttons):**
- "Quiz me on this topic"
- "Explain like I'm a student"
- "What should I learn next?"
- "Find related cases"

---

### 3.6 Knowledge Graph (/graph)

**Purpose:** Visualize connections between concepts

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│  🔗 Knowledge Graph           [Filter] [Reset]       │
├──────────────────────────────────────────────────────┤
│                                                      │
│                    ┌───────┐                         │
│                    │Portal │                         │
│           ┌────────┤ HTN   ├────────┐                │
│           │        └───────┘        │                │
│      ┌────▼────┐               ┌────▼────┐           │
│      │Cirrhosis│               │Ascites  │           │
│      └────┬────┘               └────┬────┘           │
│           │                         │                │
│      ┌────▼────┐               ┌────▼────┐           │
│      │ Liver   │───────────────│ SBP     │           │
│      │ Disease │               │         │           │
│      └─────────┘               └─────────┘           │
│                                                      │
├──────────────────────────────────────────────────────┤
│  Click node to focus  •  Scroll to zoom  •  Drag pan│
└──────────────────────────────────────────────────────┘
```

**Interactions:**
- Click node: Show details panel
- Double-click: Navigate to atom
- Drag: Pan the graph
- Scroll: Zoom in/out
- Filter: By specialty, topic, date

**Node Colors:**
- Purple: Currently viewing
- Cyan: Completed
- Orange: In progress
- Gray: Not started

---

### 3.7 MCQs (/mcqs)

**Purpose:** Self-assessment and spaced repetition

**Quiz Interface:**
```
┌──────────────────────────────────────────────────────┐
│  Q5 of 10                    ⏱️ 02:34    [End Quiz]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  A 45-year-old man with cirrhosis presents with     │
│  hematemesis. Endoscopy shows esophageal varices.   │
│                                                      │
│  What is the most appropriate initial management?    │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ A. Emergency TIPS                              │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │ B. IV octreotide + endoscopic band ligation   │ ← │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │ C. Surgical shunt                              │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │ D. Balloon tamponade                           │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
├──────────────────────────────────────────────────────┤
│  [Flag for Review]                         [Submit]  │
└──────────────────────────────────────────────────────┘
```

**After Submit:**
```
┌──────────────────────────────────────────────────────┐
│  ✅ Correct!                               [Next →]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ✓ B. IV octreotide + endoscopic band ligation      │
│                                                      │
│  ──────────────────────────────────────────────────  │
│                                                      │
│  📖 Explanation:                                     │
│                                                      │
│  Initial management of acute variceal bleeding       │
│  involves two approaches simultaneously:             │
│                                                      │
│  1. Pharmacological: IV octreotide or terlipressin   │
│     to reduce portal pressure                        │
│                                                      │
│  2. Endoscopic: Band ligation is preferred over      │
│     sclerotherapy for esophageal varices             │
│                                                      │
│  📚 Source: Sleisenger 11th Ed, Chapter 74, p.1225   │
│                                                      │
│  🔗 Related: Portal Hypertension • TIPS • Child-Pugh │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### 3.8 Results Page (/mcqs/results/[id])

**Purpose:** Quiz performance summary

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│                 Quiz Complete! 🎉                    │
├──────────────────────────────────────────────────────┤
│                                                      │
│           ┌─────────────────┐                        │
│           │     8 / 10      │                        │
│           │      80%        │                        │
│           └─────────────────┘                        │
│                                                      │
│    ⏱️ Time: 15:34       📊 Avg: 1:33/question        │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Topic Breakdown:                                    │
│  ─────────────────                                   │
│  Portal Hypertension    ████████░░  4/5 (80%)        │
│  Cirrhosis              ██████████  3/3 (100%)       │
│  Hepatitis              ████░░░░░░  1/2 (50%)        │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  [Review Mistakes]  [Retake Quiz]  [New Quiz]        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### 3.9 Onboarding (/onboarding)

**Purpose:** Personalize experience for new users

**Step 1: Specialty**
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│         What's your primary specialty?               │
│                                                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ Surgery │  │Medicine │  │Pediatrics│ │Radiology│ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘ │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ OB/GYN  │  │Anesthesia│ │Pathology│  │ Other   │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘ │
│                                                      │
│                              Step 1 of 4    [Next →] │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Step 2: Goals**
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│         What's your learning goal?                   │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ 📚 Exam Preparation (NEET-PG, USMLE, etc.)     │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │ 🏥 Clinical Excellence (deep understanding)    │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │ 🔬 Research/Academic                           │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │ 📖 General Learning                            │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  [← Back]                    Step 2 of 4    [Next →] │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Step 3: Schedule**
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│         How much time can you dedicate daily?        │
│                                                      │
│              ┌───────────────────┐                   │
│              │   30 min   ←──→  │                   │
│              │   1 hour         │                   │
│              │   2 hours  ●     │                   │
│              │   3+ hours       │                   │
│              └───────────────────┘                   │
│                                                      │
│         Best time to study?                          │
│                                                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ Morning │  │Afternoon│  │ Evening │  │ Night   │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘ │
│                                                      │
│  [← Back]                    Step 3 of 4    [Next →] │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Step 4: First Pathway**
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│         Your first learning pathway:                 │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │                                                │  │
│  │  🛤️ Surgical GI Fundamentals                   │  │
│  │                                                │  │
│  │  12 topics • 4 weeks • 24 hours total         │  │
│  │                                                │  │
│  │  ────────────────────────────────             │  │
│  │  GI Anatomy → Physiology → Imaging →          │  │
│  │  Common Conditions → Surgical Approaches      │  │
│  │                                                │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ☑️ I'm ready to start learning!                     │
│                                                      │
│  [← Back]                    Step 4 of 4  [Begin! →] │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### 3.10 Authentication Pages

**Login (/login):**
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│              🧬 NucleuX Academy                      │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ Email                                          │  │
│  │ ______________________________________________ │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │ Password                                       │  │
│  │ ______________________________________________ │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ☐ Remember me              Forgot password?         │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │               Sign In                          │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ─────────────── or ───────────────                  │
│                                                      │
│  [G] Continue with Google                            │
│                                                      │
│  Don't have an account? Sign up                      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 4. Component Library

### Core Components

| Component | Variants | Usage |
|-----------|----------|-------|
| **Button** | Primary, Secondary, Ghost, Danger | CTAs, actions |
| **Card** | Content, Stats, Feature, Person | Container |
| **Input** | Text, Password, Search, Textarea | Forms |
| **Select** | Single, Multi, Searchable | Dropdowns |
| **Modal** | Alert, Confirm, Form, Full | Dialogs |
| **Toast** | Success, Error, Warning, Info | Notifications |
| **Tabs** | Line, Pill, Contained | Navigation |
| **Badge** | Status, Count, Label | Indicators |
| **Avatar** | Image, Initials, Icon | User display |
| **Progress** | Bar, Circle, Steps | Progress |

### Domain Components

| Component | Purpose |
|-----------|---------|
| **AtomCard** | Display content atoms |
| **PathwayRoadmap** | Visual learning path |
| **MCQOption** | Quiz answer options |
| **ChatBubble** | ATOM conversation |
| **CitationCard** | Source references |
| **StatCard** | Dashboard metrics |
| **GraphNode** | Knowledge graph nodes |
| **TimelineItem** | Activity feed items |

---

## 5. User Flows

### Flow 1: New User Onboarding

```
Landing → Sign Up → Verify Email → Onboarding (4 steps) → Dashboard
```

### Flow 2: Daily Learning Session

```
Dashboard → Continue Pathway → Read Content → Take Quiz → See Results → Dashboard
```

### Flow 3: Ask ATOM

```
Any Page → Chat → Type Question → Get Answer → Follow Up → Save Note
```

### Flow 4: MCQ Practice

```
MCQs → Select Topic → Start Quiz → Answer Questions → Review Results → Review Mistakes
```

### Flow 5: Explore Library

```
Library → Browse/Search → View Card → Open Reading View → Take Notes → Bookmark
```

---

## 6. Database Schema

### Core Tables

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  specialty VARCHAR(100),
  learning_goal VARCHAR(100),
  daily_time_mins INT DEFAULT 60,
  preferred_time VARCHAR(20),
  streak_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Atoms (Content Units)
CREATE TABLE atoms (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type ENUM('note', 'diagram', 'pearl', 'mnemonic', 'dose', 'case', 'mcq'),
  specialty VARCHAR(100),
  system VARCHAR(100),
  topic VARCHAR(255),
  source_book VARCHAR(255),
  source_edition VARCHAR(50),
  source_page VARCHAR(50),
  created_by UUID REFERENCES users(id),
  is_curated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Atom Links (Knowledge Graph)
CREATE TABLE atom_links (
  id UUID PRIMARY KEY,
  from_atom UUID REFERENCES atoms(id),
  to_atom UUID REFERENCES atoms(id),
  link_type ENUM('related', 'prerequisite', 'extends', 'contradicts'),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pathways
CREATE TABLE pathways (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  specialty VARCHAR(100),
  estimated_hours INT,
  estimated_weeks INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pathway Topics
CREATE TABLE pathway_topics (
  id UUID PRIMARY KEY,
  pathway_id UUID REFERENCES pathways(id),
  atom_id UUID REFERENCES atoms(id),
  order_index INT NOT NULL,
  estimated_mins INT DEFAULT 30
);

-- User Progress
CREATE TABLE user_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  atom_id UUID REFERENCES atoms(id),
  status ENUM('not_started', 'in_progress', 'completed'),
  time_spent_mins INT DEFAULT 0,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Notes
CREATE TABLE user_notes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  atom_id UUID REFERENCES atoms(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bookmarks
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  atom_id UUID REFERENCES atoms(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- MCQs
CREATE TABLE mcqs (
  id UUID PRIMARY KEY,
  atom_id UUID REFERENCES atoms(id),
  stem TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL,
  explanation TEXT,
  difficulty ENUM('easy', 'medium', 'hard'),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quiz Attempts
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  mcq_id UUID REFERENCES mcqs(id),
  selected_answer CHAR(1),
  is_correct BOOLEAN,
  time_taken_secs INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat Sessions
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(255),
  context_atom UUID REFERENCES atoms(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id),
  role ENUM('user', 'assistant'),
  content TEXT NOT NULL,
  citations JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Daily Activity
CREATE TABLE daily_activity (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  study_mins INT DEFAULT 0,
  atoms_completed INT DEFAULT 0,
  mcqs_attempted INT DEFAULT 0,
  mcqs_correct INT DEFAULT 0
);
```

---

## 7. API Design

### RESTful Endpoints

```
Auth:
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/forgot-password

Users:
GET    /api/users/me
PATCH  /api/users/me
GET    /api/users/me/stats
GET    /api/users/me/activity

Atoms:
GET    /api/atoms
GET    /api/atoms/:id
GET    /api/atoms/:id/related
POST   /api/atoms (admin/curated)
GET    /api/atoms/search?q=...

Pathways:
GET    /api/pathways
GET    /api/pathways/:id
GET    /api/pathways/:id/topics
POST   /api/pathways/:id/start
PATCH  /api/pathways/:id/progress

MCQs:
GET    /api/mcqs
GET    /api/mcqs/random?topic=...&count=10
POST   /api/mcqs/:id/attempt
GET    /api/mcqs/results/:attemptId

Notes:
GET    /api/notes
POST   /api/notes
GET    /api/notes/:id
PATCH  /api/notes/:id
DELETE /api/notes/:id

Bookmarks:
GET    /api/bookmarks
POST   /api/bookmarks
DELETE /api/bookmarks/:atomId

Chat:
GET    /api/chat/sessions
POST   /api/chat/sessions
GET    /api/chat/sessions/:id/messages
POST   /api/chat/sessions/:id/messages
```

---

## 8. Mobile Design

### Responsive Breakpoints

| Breakpoint | Width | Changes |
|------------|-------|---------|
| Mobile | < 640px | Bottom nav, single column, collapsed sidebar |
| Tablet | 640-1024px | 2 columns, sidebar overlay |
| Desktop | > 1024px | 3+ columns, fixed sidebar |

### Mobile-Specific Components

- **Bottom Navigation Bar** — 5 key pages
- **Pull to Refresh** — Content lists
- **Swipe Gestures** — MCQ navigation, cards
- **Touch-Friendly** — 44px minimum tap targets
- **Offline Mode** — Cached content for reading

---

## 📌 Next Steps

1. **Get Aditya's approval** on this design doc
2. **Prioritize pages** for implementation
3. **Start with ATOM Chat** — the key differentiator
4. **Build mobile-first** — most students use phones

---

*Built by Vishwakarma 🛠️ for NucleuX Academy*
*Pending approval from Aditya*
