# NucleuX Academy — Widget Specifications

**Version:** 1.0  
**Created:** 2026-02-07  
**Author:** Narasimha 🦁  
**Purpose:** Detailed specifications for every widget across the app

---

## 📑 Table of Contents

1. [Dashboard Widgets](#1-dashboard-widgets)
2. [Library Widgets](#2-library-widgets)
3. [Classroom Widgets](#3-classroom-widgets)
4. [Exam Center Widgets](#4-exam-center-widgets)
5. [Community Widgets](#5-community-widgets)
6. [Arena Widgets](#6-arena-widgets)
7. [ATOM Chat Widgets](#7-atom-chat-widgets)
8. [Global Components](#8-global-components)

---

## 1. Dashboard Widgets

The Dashboard ("My Desk") is the command center. Room color: **Purple (#7C3AED)**

---

### 1.1 Welcome Header

**Purpose:** Personalized greeting with context

| Property | Value |
|----------|-------|
| **Location** | Top of dashboard |
| **Height** | ~80px |
| **Background** | Transparent (inherits page bg) |

**Components:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Good morning, Sarath! 👋                    🔥 12 Day Streak   │
│ Ready to continue your Surgery pathway?     📊 NEET-PG 2026    │
│ • Friday, 7 Feb                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Data Required:**
- `user.firstName` — For greeting
- `user.currentStreak` — Days in a row studied
- `user.targetExam` — NEET-PG / INICET / DNB CET
- `user.currentPathway` — Active learning pathway
- `currentTime` — For dynamic greeting (morning/afternoon/evening)

**Greeting Logic:**
```javascript
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Burning the midnight oil";
}
```

**Badges:**
| Badge | Condition | Color |
|-------|-----------|-------|
| Streak | Always show | Amber (#F59E0B) |
| Target Exam | If set | Green (#059669) |
| Pro User | If subscribed | Purple (#7C3AED) |

---

### 1.2 ATOM Study Coach Card

**Purpose:** AI-powered personalized recommendation

| Property | Value |
|----------|-------|
| **Location** | Below welcome header |
| **Height** | ~140px |
| **Border** | Left 4px solid Purple |
| **Background** | Card dark (#0F2233) |

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│ 🔮 [ATOM Icon]   📊 ATOM Study Coach           94% confident   │
│     ●online                                                    │
│                                                                │
│ Based on your performance, you're struggling with Portal      │
│ Hypertension complications. I recommend spending 30 minutes   │
│ reviewing Variceal Bleeding management...                     │
│                                                                │
│ [Variceal Bleeding] [Child-Pugh Score] [TIPS Procedure]       │
│                                                                │
│ [🎯 Start Review]  [💬 Ask ATOM]                               │
└────────────────────────────────────────────────────────────────┘
```

**Data Required:**
```typescript
interface ATOMSuggestion {
  title: string;           // "ATOM's Recommendation"
  message: string;         // Personalized message
  topics: string[];        // Suggested topics (max 3)
  confidence: number;      // 0-100% confidence score
  weakArea: string;        // Primary weak area identified
  suggestedDuration: number; // Minutes recommended
}
```

**Actions:**
| Button | Action | Route |
|--------|--------|-------|
| Start Review | Opens topic in Library | `/library/{topicId}` |
| Ask ATOM | Opens ATOM chat | `/chat` |

**AI Logic (Backend):**
1. Analyze last 50 MCQ attempts
2. Identify topics with <60% accuracy
3. Cross-reference with pathway progress
4. Generate personalized message
5. Calculate confidence based on data volume

---

### 1.3 Stats Cards Row

**Purpose:** Key metrics at a glance

| Property | Value |
|----------|-------|
| **Location** | Below ATOM card |
| **Layout** | 4 cards in a row (responsive grid) |
| **Card Size** | ~200px × 100px each |

**Layout:**
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ ⏱️ Study Hrs │ │ ✅ Topics    │ │ 🔥 Streak    │ │ 🎯 Accuracy  │
│    24.5 hrs  │ │    48        │ │    12 days   │ │    78%       │
│    +12% ↑    │ │    +8 ↑      │ │ Personal best│ │    +5% ↑     │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
   Purple          Green           Amber            Cyan
```

**Individual Card Schema:**
```typescript
interface StatCard {
  title: string;      // "Study Hours"
  value: string;      // "24.5"
  unit: string;       // "hrs"
  change: string;     // "+12%"
  icon: LucideIcon;   // Clock
  color: string;      // "#7C3AED"
  period: "weekly" | "monthly";
}
```

**Stats Definitions:**

| Stat | Weekly Calculation | Monthly Calculation |
|------|-------------------|---------------------|
| Study Hours | Sum of session durations this week | Sum of session durations this month |
| Topics Completed | Topics marked complete this week | Topics marked complete this month |
| Current Streak | Consecutive days with ≥1 session | Same (streak doesn't reset) |
| MCQ Accuracy | (Correct / Attempted) × 100 this week | Same for month |

**Toggle Behavior:**
- Weekly / Monthly toggle at top right
- Smooth transition when switching
- Chart and stats update together

---

### 1.4 Weekly Progress Chart

**Purpose:** Visual trend of study activity

| Property | Value |
|----------|-------|
| **Location** | Right of stats cards |
| **Type** | Area Chart (Recharts) |
| **Height** | 200px |
| **Data Points** | 7 (weekly) or 4 (monthly) |

**Chart Configuration:**
```typescript
const chartConfig = {
  type: "AreaChart",
  xAxis: "day" | "week",
  yAxis: "hours",
  fill: "linear-gradient(#7C3AED, transparent)",
  stroke: "#7C3AED",
  strokeWidth: 2,
  dot: true,
  dotSize: 4,
  tooltip: true,
};
```

**Data Shape:**
```typescript
// Weekly
{ day: "Mon", hours: 2.5, questions: 45 }

// Monthly  
{ week: "Week 1", hours: 18, questions: 320 }
```

**Interactions:**
- Hover: Show tooltip with hours + questions
- Click: Navigate to detailed analytics (future)

---

### 1.5 Today's Study Plan Card

**Purpose:** Structured daily agenda

| Property | Value |
|----------|-------|
| **Location** | Main content area |
| **Height** | Variable (based on items) |
| **Max Items** | 4-5 tasks |

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│ 📅 Today's Study Plan                           ~2 hours total │
├────────────────────────────────────────────────────────────────┤
│ ● [CURRENT] Complete: Femoral Hernia           📖 45 min      │
│   Bailey & Love Ch. 58                                         │
│ ○ MCQ Practice: Abdominal Wall Hernias         🎯 30 min      │
│   25 questions                                                 │
│ ○ Review: Inguinal Canal Anatomy               📚 20 min      │
│   Gray's Anatomy                                               │
│ ○ Quick Quiz: Hernia Complications             🧠 15 min      │
│   10 questions                                                 │
└────────────────────────────────────────────────────────────────┘
```

**Task Schema:**
```typescript
interface StudyTask {
  id: string;
  title: string;           // "Complete: Femoral Hernia"
  duration: number;        // Minutes
  type: "reading" | "mcq" | "revision" | "quiz" | "video";
  source?: string;         // "Bailey & Love Ch. 58"
  count?: string;          // "25 questions"
  status: "completed" | "current" | "upcoming" | "skipped";
  topicId?: string;        // Link to topic
  icon: LucideIcon;
}
```

**Task Types & Icons:**
| Type | Icon | Color |
|------|------|-------|
| reading | BookOpen | Purple |
| mcq | Target | Cyan |
| revision | BookMarked | Amber |
| quiz | Brain | Green |
| video | Play | Sky |

**Actions:**
- Click task → Navigate to content
- Mark complete → Updates progress
- Skip → Moves to next, logs skip

---

### 1.6 Current Pathway Progress Card

**Purpose:** Show pathway completion status

| Property | Value |
|----------|-------|
| **Location** | Sidebar or below plan |
| **Height** | ~180px |

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│ 🛤️ Current Pathway                                             │
│                                                                │
│ Surgical GI Mastery                                            │
│ ████████████████░░░░░░░░ 65%                                   │
│                                                                │
│ Current: Hepatobiliary Surgery                                 │
│ Next: Pancreatic Surgery                                       │
│                                                                │
│ 16 of 24 topics completed                                      │
│                                                                │
│ [▶️ Continue]                                                   │
└────────────────────────────────────────────────────────────────┘
```

**Data Schema:**
```typescript
interface CurrentPathway {
  id: string;
  title: string;           // "Surgical GI Mastery"
  progress: number;        // 0-100
  currentTopic: string;    // "Hepatobiliary Surgery"
  nextTopic: string;       // "Pancreatic Surgery"
  totalTopics: number;     // 24
  completedTopics: number; // 16
  estimatedTimeRemaining: number; // Hours
}
```

**Progress Bar:**
- Gradient fill from Purple to Cyan
- Glow effect at current position
- Smooth animation on load

---

### 1.7 Weak Areas Card

**Purpose:** Highlight areas needing attention

| Property | Value |
|----------|-------|
| **Location** | Below pathway or sidebar |
| **Max Items** | 3 topics |

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│ ⚠️ Weak Areas (ATOM Identified)                                │
├────────────────────────────────────────────────────────────────┤
│ 🔴 Portal Hypertension              52%    (15 attempts)       │
│ 🟠 Thyroid Carcinoma Staging        58%    (12 attempts)       │
│ 🟡 Pancreatic Pseudocyst            61%    (8 attempts)        │
└────────────────────────────────────────────────────────────────┘
```

**Data Schema:**
```typescript
interface WeakArea {
  topicId: string;
  topic: string;
  accuracy: number;      // Percentage
  attempts: number;      // Total MCQs attempted
  lastAttempt: Date;
  trend: "improving" | "declining" | "stable";
}
```

**Color Coding:**
| Accuracy | Color | Indicator |
|----------|-------|-----------|
| <55% | Red (#EF4444) | 🔴 |
| 55-65% | Orange (#F59E0B) | 🟠 |
| 65-75% | Yellow (#EAB308) | 🟡 |

**Actions:**
- Click topic → Open focused review session
- "Review All" → Queue all weak topics

---

### 1.8 Recent Activity Feed

**Purpose:** Timeline of recent actions

| Property | Value |
|----------|-------|
| **Location** | Bottom of dashboard |
| **Max Items** | 4-6 items |
| **Height** | Variable |

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│ 🕐 Recent Activity                                             │
├────────────────────────────────────────────────────────────────┤
│ 🎯 Scored 85% on Appendicitis MCQs              2 hours ago    │
│    23/27 correct • 18 min                                      │
│                                                                │
│ 📖 Completed: Inguinal Hernia - Anatomy         4 hours ago    │
│    Bailey & Love Ch. 57                                        │
│                                                                │
│ ▶️ Started: Hepatobiliary Surgery Module        Yesterday      │
│    12 topics • ~8 hours                                        │
│                                                                │
│ 📈 Reviewed: Portal Hypertension (Weak Area)    2 days ago     │
│    Flagged by ATOM for review                                  │
└────────────────────────────────────────────────────────────────┘
```

**Activity Schema:**
```typescript
interface Activity {
  id: string;
  title: string;
  type: "Assessment" | "Reading" | "Pathway" | "Revision" | "Achievement";
  time: Date;
  icon: LucideIcon;
  color: string;
  detail: string;        // Additional context
  link?: string;         // Route to view more
}
```

**Time Display:**
- < 1 hour: "Just now" or "X minutes ago"
- < 24 hours: "X hours ago"
- < 7 days: "X days ago" or "Yesterday"
- > 7 days: "Feb 1" format

---

### 1.9 Knowledge Graph Preview (Tab)

**Purpose:** Visual topic connections

| Property | Value |
|----------|-------|
| **Location** | Separate tab on dashboard |
| **Type** | Force-directed graph |
| **Library** | D3.js or React Force Graph |

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│                    ○ Appendicitis (90%)                        │
│                   /                                            │
│    ○ Hernia (85%) ── ● Hepatobiliary (78%) ── ○ Pancreas (45%) │
│                   \                                            │
│                    ◐ Portal HTN (52%)                          │
└────────────────────────────────────────────────────────────────┘
```

**Node Schema:**
```typescript
interface GraphNode {
  id: string;
  name: string;
  connections: number;     // Count of linked topics
  mastery: number;         // 0-100%
  status: "current" | "upcoming" | "strong" | "weak" | "locked";
}
```

**Node Styling:**
| Status | Fill | Border | Size |
|--------|------|--------|------|
| current | Purple | Glow | Large |
| strong | Green | Solid | Medium |
| weak | Red | Dashed | Medium |
| upcoming | Gray | Solid | Medium |
| locked | Dark Gray | Dotted | Small |

**Interactions:**
- Hover: Show tooltip with stats
- Click: Navigate to topic
- Drag: Reposition nodes
- Scroll: Zoom in/out

---

## 2. Library Widgets

Room color: **Green (#059669)**

---

### 2.1 Search & Filter Bar

**Purpose:** Find content quickly

| Property | Value |
|----------|-------|
| **Location** | Top of library |
| **Height** | ~60px |
| **Sticky** | Yes (sticks on scroll) |

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│ 🔍 [Search atoms, topics, textbooks...]     [Filters ▼] [+ New]│
│                                                                │
│ [Surgery] [Medicine] [Anatomy] [Pathology] [All] [My Notes]   │
└────────────────────────────────────────────────────────────────┘
```

**Filter Options:**
- Category: Surgery, Medicine, Anatomy, etc.
- Source: Textbook filter
- Type: Curated / Personal
- Status: Read / Unread / Bookmarked

**Search Behavior:**
- Debounced (300ms delay)
- Searches: title, content, tags, source
- Results update in real-time
- Highlights matches

---

### 2.2 Content Card

**Purpose:** Display individual atom/topic

| Property | Value |
|----------|-------|
| **Size** | 320px × 180px |
| **Layout** | Grid (responsive) |

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│ ★ [Bookmark]                                    [Surgery]      │
│                                                                │
│ Inguinal Hernia — Anatomy & Classification                     │
│                                                                │
│ Direct vs indirect hernias, anatomical landmarks,              │
│ Hasselbach's triangle, and clinical classification...          │
│                                                                │
│ 📖 Bailey & Love Ch. 57          ⏱️ 15 min          👁️ 234     │
└────────────────────────────────────────────────────────────────┘
```

**Card Schema:**
```typescript
interface ContentCard {
  id: string;
  title: string;
  excerpt: string;           // First 100 chars
  category: string;          // Surgery, Medicine, etc.
  source: string;            // Textbook reference
  readTime: number;          // Minutes
  views: number;
  isBookmarked: boolean;
  isPersonal: boolean;       // User-created atom
  mastery?: number;          // If tracked
  lastRead?: Date;
  tags: string[];
}
```

**Hover Effects:**
- Lift up (translateY: -4px)
- Glow with room color
- Border highlight

**Actions:**
- Click → Open reading view
- Bookmark icon → Toggle bookmark
- Tag click → Filter by tag

---

### 2.3 Reading View

**Purpose:** Full content display with tools

| Property | Value |
|----------|-------|
| **Route** | `/library/[id]` |
| **Layout** | Full width, centered content |

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│ [← Back]              Inguinal Hernia              [☆] [⋮]    │
├────────────────────────────────────────────────────────────────┤
│ Category: Surgery          Source: Bailey & Love Ch. 57       │
│ Read time: 15 min          Last updated: Feb 5, 2026          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ # Inguinal Hernia                                              │
│                                                                │
│ An **inguinal hernia** occurs when tissue, such as part of    │
│ the intestine, protrudes through a weak spot in the           │
│ abdominal muscles...                                           │
│                                                                │
│ ## Anatomy                                                     │
│ [Interactive diagram: Inguinal Canal]                          │
│                                                                │
│ The inguinal canal is approximately 4 cm long...               │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│ 📖 Related: [Femoral Hernia] [Abdominal Wall] [Bowel Obs]     │
│                                                                │
│ [📝 Add Note]  [🎯 Practice MCQs]  [💬 Ask ATOM]               │
└────────────────────────────────────────────────────────────────┘
```

**Features:**
- Markdown rendering with syntax highlighting
- Image zoom on click
- Text selection → Highlight / Add note
- Citation tooltips
- Related topics sidebar (optional)

---

### 2.4 Pathways Browser

**Purpose:** Browse structured learning paths

| Property | Value |
|----------|-------|
| **Route** | `/library` (Pathways tab) |
| **Card Size** | Full width, 120px height |

**Pathway Card:**
```
┌────────────────────────────────────────────────────────────────┐
│ 🛤️ Surgical GI Mastery                                         │
│                                                                │
│ ████████████████░░░░░░░░ 65%     24 topics • ~40 hours        │
│                                                                │
│ Master all GI surgery topics from Esophagus to Rectum.        │
│ Includes anatomy, procedures, and complications.               │
│                                                                │
│ [Continue →]                                                   │
└────────────────────────────────────────────────────────────────┘
```

---

## 3. Classroom Widgets

Room color: **Sky Blue (#0EA5E9)**

---

### 3.1 Video Lecture Card

**Purpose:** Display video content

| Property | Value |
|----------|-------|
| **Size** | 300px × 200px |
| **Thumbnail** | 16:9 ratio |

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│ ┌────────────────────────────────────────────────────────┐    │
│ │                    [▶️]                                 │    │
│ │              [Video Thumbnail]                         │    │
│ │                                                        │    │
│ │  12:34                                                 │    │
│ └────────────────────────────────────────────────────────┘    │
│                                                                │
│ Inguinal Hernia Repair — Lichtenstein Technique                │
│ Dr. Rajesh Kumar • 2.3K views • 3 days ago                     │
│                                                                │
│ [Surgery] [Hernia] [Procedure]                                 │
└────────────────────────────────────────────────────────────────┘
```

---

### 3.2 Video Player

**Purpose:** Watch lectures with notes

**Features:**
- Playback speed control (0.5x - 2x)
- Timestamp notes
- Chapters/segments
- Picture-in-picture
- Download (offline)
- Transcript panel

---

## 4. Exam Center Widgets

Room color: **Sky Blue (#0EA5E9)**

---

### 4.1 MCQ Card (Question View)

**Purpose:** Display single MCQ

| Property | Value |
|----------|-------|
| **Height** | Variable |
| **Max Options** | 5 |

**Layout (Before Answer):**
```
┌────────────────────────────────────────────────────────────────┐
│ Question 15 of 25                              ⏱️ 01:23        │
│ [Surgery] [Hernia] [Medium]                                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ A 45-year-old male presents with a swelling in the right      │
│ groin that appears on standing and disappears on lying down.  │
│ On examination, the swelling is above and medial to the       │
│ pubic tubercle. What is the most likely diagnosis?            │
│                                                                │
│ ○ A. Direct inguinal hernia                                    │
│ ○ B. Indirect inguinal hernia                                  │
│ ○ C. Femoral hernia                                            │
│ ○ D. Spigelian hernia                                          │
│                                                                │
│ [🚩 Flag]                              [Skip]  [Submit →]      │
└────────────────────────────────────────────────────────────────┘
```

**Layout (After Answer):**
```
┌────────────────────────────────────────────────────────────────┐
│ ✅ Correct!                                                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ ● A. Direct inguinal hernia ✓                                  │
│ ○ B. Indirect inguinal hernia                                  │
│   → Appears lateral to inferior epigastric vessels             │
│ ○ C. Femoral hernia                                            │
│   → Below and lateral to pubic tubercle                        │
│ ○ D. Spigelian hernia                                          │
│   → Occurs at linea semilunaris                                │
│                                                                │
│ 📚 Explanation:                                                │
│ Direct inguinal hernias protrude medial to the inferior       │
│ epigastric vessels through Hesselbach's triangle...           │
│                                                                │
│ 📖 Reference: Bailey & Love Ch. 57, Page 1023                  │
│                                                                │
│ [💬 Ask ATOM]                                      [Next →]    │
└────────────────────────────────────────────────────────────────┘
```

**MCQ Schema:**
```typescript
interface MCQ {
  id: string;
  question: string;
  options: {
    key: string;           // "A", "B", "C", "D"
    text: string;
    isCorrect: boolean;
    explanation: string;   // Why this option
  }[];
  correctAnswer: string;   // "A"
  explanation: string;     // Main explanation
  reference: string;       // "Bailey & Love Ch. 57"
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  tags: string[];
  stats: {
    attempts: number;
    correctRate: number;
    avgTime: number;       // Seconds
  };
}
```

---

### 4.2 Quiz Results Summary

**Purpose:** Post-quiz performance breakdown

| Property | Value |
|----------|-------|
| **Route** | `/mcqs/results` |

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│                     🎉 Quiz Complete!                          │
│                                                                │
│                        85%                                     │
│                   ████████████░░░░                             │
│                    21/25 correct                               │
│                                                                │
│ ⏱️ Time: 18:34        📊 Avg: 44 sec/q        🎯 Personal Best │
├────────────────────────────────────────────────────────────────┤
│ Topic Breakdown:                                               │
│                                                                │
│ Inguinal Hernia     ██████████ 100% (5/5)                      │
│ Femoral Hernia      ████████░░  80% (4/5)                      │
│ Umbilical Hernia    ██████████ 100% (5/5)                      │
│ Incisional Hernia   ██████░░░░  60% (3/5)  ← Needs review      │
│ Complications       ████████░░  80% (4/5)                      │
├────────────────────────────────────────────────────────────────┤
│ [Review Mistakes]    [Retry Quiz]    [Back to Dashboard]       │
└────────────────────────────────────────────────────────────────┘
```

---

## 5. Community Widgets

Room color: **Amber (#B45309)**

---

### 5.1 Discussion Card

**Purpose:** Display forum post

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│ 👤 Dr. Priya Sharma                              2 hours ago   │
│    AIIMS Delhi • MS Surgery                                    │
├────────────────────────────────────────────────────────────────┤
│ Why is indirect inguinal hernia more common on the right?     │
│                                                                │
│ I understand the embryological reason (late descent of right  │
│ testis) but is there any other contributing factor?           │
│                                                                │
│ [Surgery] [Hernia] [Anatomy]                                   │
├────────────────────────────────────────────────────────────────┤
│ 💬 12 replies    👍 45    👁️ 234    [Reply]    [Share]         │
└────────────────────────────────────────────────────────────────┘
```

---

### 5.2 Study Group Card

**Purpose:** Collaborative study rooms

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│ 📚 Surgery Warriors — NEET-PG 2026                             │
│ 🟢 8 members online                                            │
│                                                                │
│ Last active: "Just solved 50 MCQs on Thyroid!"                │
│                                                                │
│ [Join]                                                         │
└────────────────────────────────────────────────────────────────┘
```

---

## 6. Arena Widgets

Room color: **Gold (#CA8A04)**

---

### 6.1 Leaderboard

**Purpose:** Competitive rankings

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│ 🏆 Daily Leaderboard                          [Weekly] [All]   │
├────────────────────────────────────────────────────────────────┤
│ 🥇  Dr. Rahul V.        1,234 pts    +156 today    AIIMS      │
│ 🥈  Priya S.            1,198 pts    +142 today    CMC        │
│ 🥉  Arjun R.            1,156 pts    +138 today    KMC        │
│ 4.  YOU                   987 pts    +89 today     —          │
│ 5.  Kavitha M.            945 pts    +76 today     JIPMER     │
└────────────────────────────────────────────────────────────────┘
```

---

### 6.2 Challenge Card

**Purpose:** Head-to-head battles

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│ ⚔️ Challenge: Hepatobiliary Showdown                           │
│                                                                │
│ 👤 You (78%)      VS      👤 Random Opponent                   │
│                                                                │
│ 10 MCQs • 15 min • Winner gets 50 coins                        │
│                                                                │
│ [Accept Challenge]                                             │
└────────────────────────────────────────────────────────────────┘
```

---

## 7. ATOM Chat Widgets

Room color: **Cyan (#06B6D4)**

---

### 7.1 Chat Message (User)

```
┌────────────────────────────────────────────────────────────────┐
│                                              You • 2:34 PM     │
│                        ┌──────────────────────────────────┐    │
│                        │ What are the complications of    │    │
│                        │ direct inguinal hernia repair?   │    │
│                        └──────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────┘
```

---

### 7.2 Chat Message (ATOM)

```
┌────────────────────────────────────────────────────────────────┐
│ 🔮 ATOM • 2:34 PM                                              │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Great question! Here are the key complications:          │   │
│ │                                                          │   │
│ │ **Early:**                                               │   │
│ │ • Wound infection (1-2%)                                 │   │
│ │ • Hematoma/seroma                                        │   │
│ │ • Urinary retention                                      │   │
│ │                                                          │   │
│ │ **Late:**                                                │   │
│ │ • Chronic pain (10-12%) — most common!                   │   │
│ │ • Mesh infection                                         │   │
│ │ • Recurrence (1-3%)                                      │   │
│ │                                                          │   │
│ │ 📖 Bailey & Love Ch. 57, Page 1034                       │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                │
│ [📋 Copy]  [📚 View in Library]  [🎯 Practice MCQs]           │
└────────────────────────────────────────────────────────────────┘
```

---

### 7.3 Citation Card (Inline)

**Purpose:** Source attribution in ATOM responses

```
┌────────────────────────────────────────────────────────────────┐
│ 📖 Bailey & Love's Short Practice of Surgery, 27th Ed         │
│    Chapter 57: Hernias, Page 1034                              │
│    [View Source]                                               │
└────────────────────────────────────────────────────────────────┘
```

---

## 8. Global Components

---

### 8.1 ATOM Floating Widget

**Purpose:** Quick access to AI anywhere

| Property | Value |
|----------|-------|
| **Position** | Bottom right, fixed |
| **Size** | 56px × 56px (collapsed) |
| **Expanded** | 360px × 480px |

**Collapsed State:**
```
        ┌─────┐
        │ 🔮  │  ← Pulsing glow when has suggestion
        └─────┘
```

**Expanded State:**
```
┌──────────────────────────────────────┐
│ 🔮 ATOM                    [−] [×]   │
├──────────────────────────────────────┤
│                                      │
│ [Chat messages...]                   │
│                                      │
├──────────────────────────────────────┤
│ [Type your question...]      [Send]  │
└──────────────────────────────────────┘
```

**States:**
- `collapsed` — Just icon, click to expand
- `expanded` — Full chat interface
- `minimized` — Small preview, one-line
- `notification` — Has unread message

---

### 8.2 Sidebar Navigation

**Purpose:** Primary navigation

**Layout:**
```
┌─────────────────────┐
│ 🧬 NucleuX Academy  │
├─────────────────────┤
│ 📊 My Desk          │ ← Purple
│ 📚 Library          │ ← Green  
│ 🎓 Classroom        │ ← Sky
│ 📋 Exam Center      │ ← Sky
│ 👥 Common Room      │ ← Amber
│ 🏆 Arena            │ ← Gold
│ 🔮 ATOM             │ ← Cyan (highlighted)
├─────────────────────┤
│ 👤 Profile (popup)  │
└─────────────────────┘
```

**Active State:**
- Left border: 3px solid room color
- Background: Room color at 10% opacity
- Text: White

---

### 8.3 Bottom Navigation (Mobile)

**Purpose:** Mobile navigation

**Layout:**
```
┌────┬────┬────┬────┬────┐
│ 🏠 │ 📚 │ 🔮 │ 📋 │ 👤 │
│Desk│Lib │ATOM│Exam│ Me │
└────┴────┴────┴────┴────┘
```

**Properties:**
- Fixed at bottom
- 60px height
- Room color for active tab
- Labels below icons

---

### 8.4 Toast Notifications

**Types:**
| Type | Color | Icon | Duration |
|------|-------|------|----------|
| Success | Green | ✓ | 3s |
| Error | Red | ✕ | 5s |
| Warning | Amber | ⚠ | 4s |
| Info | Cyan | ℹ | 3s |
| ATOM | Purple | 🔮 | 5s |

---

### 8.5 Loading Skeletons

**Purpose:** Loading state placeholders

**Rules:**
- Match widget dimensions
- Pulse animation
- Gray placeholder color (#142538)
- Shimmer effect

---

## 📋 Implementation Priority

| Priority | Widget | Complexity |
|----------|--------|------------|
| 🔴 P0 | Dashboard Stats Cards | Low |
| 🔴 P0 | ATOM Study Coach | Medium |
| 🔴 P0 | Today's Study Plan | Medium |
| 🔴 P0 | Content Cards (Library) | Low |
| 🔴 P0 | MCQ Question View | High |
| 🟡 P1 | Weekly Progress Chart | Medium |
| 🟡 P1 | Pathway Progress | Low |
| 🟡 P1 | Reading View | High |
| 🟡 P1 | Quiz Results | Medium |
| 🟢 P2 | Knowledge Graph | High |
| 🟢 P2 | Leaderboard | Medium |
| 🟢 P2 | Discussion Cards | Medium |
| 🟢 P2 | Video Player | High |

---

*Widget Specifications v1.0 — NucleuX Academy*
*February 2026*
