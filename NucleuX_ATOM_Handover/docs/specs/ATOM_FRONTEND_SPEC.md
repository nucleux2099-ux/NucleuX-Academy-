# ATOM v2 — Frontend & UI Architecture Spec

> How ATOM agents live across the entire NucleuX Academy application.
> ATOM is not a chatbot — it's a presence that permeates every room.

**Status:** Spec
**Depends on:** [Gateway](./ATOM_GATEWAY_SPEC.md) · [RAG Pipeline](./ATOM_RAG_PIPELINE_SPEC.md) · [Memory](./ATOM_MEMORY_SPEC.md) · [Agents](./ATOM_AGENTS_SPEC.md) · [MarketHub](./ATOM_MARKETHUB_SPEC.md)

---

## Table of Contents

1. [Overview](#1-overview)
2. [ATOMProvider — Global State](#2-atomprovider--global-state)
3. [ATOM Widget v2](#3-atom-widget-v2)
4. [ATOM Panel v2](#4-atom-panel-v2)
5. [Room-Specific ATOM Integrations](#5-room-specific-atom-integrations)
6. [Agent Transparency Panel](#6-agent-transparency-panel)
7. [Proactive Notifications — Heartbeat UI](#7-proactive-notifications--heartbeat-ui)
8. [Memory UI](#8-memory-ui)
9. [MarketHub UI](#9-markethub-ui)
10. [Design System Extensions](#10-design-system-extensions)
11. [Responsive Behavior](#11-responsive-behavior)
12. [Cross-References](#12-cross-references)

---

## 1. Overview

### v1 → v2 Comparison

| Aspect | v1 (Current) | v2 (Target) |
|--------|-------------|-------------|
| **Presence** | Floating chat widget + /chat page | Embedded in every room page |
| **Context** | Hardcoded `context: 'surgery'` | Room-aware, topic-aware, page-aware |
| **Memory** | None — fresh each session | 7 memory types, cross-session persistence |
| **Agents** | Single Claude call | 5 core + 10 plugin agents orchestrated |
| **Streaming** | Plain text SSE (`data.text`) | Rich SSE events (agent, source, memory, text) |
| **Plugins** | None | MarketHub marketplace, per-room activation |
| **Proactivity** | None | Heartbeat-driven notifications, study reminders |
| **Transparency** | Opaque responses | "How ATOM answered" pipeline view |
| **Personalization** | None | Memory-informed, preference-adapted |

### Architecture Principle

ATOM v2 follows the **Ambient Intelligence** pattern:

```
┌─────────────────────────────────────────────────────┐
│                  ATOMProvider (Context)               │
│  ┌─────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Widget   │  │  Panel   │  │  Room Integration  │  │
│  │ (float)  │  │ (slide)  │  │   (embedded)       │  │
│  └────┬─────┘  └────┬─────┘  └─────────┬─────────┘  │
│       │              │                  │             │
│       └──────────────┼──────────────────┘             │
│                      ▼                                │
│            ATOMProvider State                          │
│   (session, memory, plugins, agents, insights)        │
│                      │                                │
│                      ▼                                │
│          POST /api/atom/chat (SSE)                    │
│                      │                                │
│                      ▼                                │
│         Gateway → RAG → Memory → Agents               │
└─────────────────────────────────────────────────────┘
```

Every room page gets three ATOM touchpoints:
1. **Widget** — Floating action button (always available, room-aware)
2. **Panel** — Slide-in sidebar with room-specific insights and quick actions
3. **Room Integration** — Embedded ATOM features specific to that room's workflow

---

## 2. ATOMProvider — Global State

### Context Shape

```typescript
interface ATOMState {
  // Session
  activeRoom: ATOMRoom;
  sessionId: string | null;
  conversationId: string | null;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';

  // Conversation
  messages: ATOMMessage[];
  isStreaming: boolean;
  activeAgents: AgentStatus[];

  // Memory
  recentMemories: ATOMMemory[];
  memoryEnabled: boolean;

  // Plugins
  installedPlugins: InstalledPlugin[];
  activeRoomPlugins: string[]; // plugin IDs active in current room

  // Proactivity
  proactiveInsights: ProactiveInsight[];
  unreadInsightCount: number;

  // User
  studentProfile: StudentProfile | null;
}

type ATOMRoom =
  | 'desk'        // Command Centre
  | 'library'     // Librarian
  | 'classroom'   // Lecture Partner
  | 'training'    // Practice Partner
  | 'cbme'        // Competency Guide
  | 'community'   // Debate Moderator
  | 'arena'       // Competition Coach
  | 'backstage'   // Cognitive Coach
  | 'studio';     // Open Studio

interface ATOMMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  // v2 rich metadata
  agentPipeline?: AgentStatus[];      // which agents processed this
  sources?: SourceAttribution[];       // retrieved content chunks
  memoryReferences?: ATOMMemory[];     // memories used
  activePlugins?: string[];            // plugins that contributed
}

interface AgentStatus {
  agentId: string;
  name: string;
  status: 'queued' | 'thinking' | 'active' | 'done' | 'skipped' | 'error';
  durationMs?: number;
}

interface SourceAttribution {
  chunkId: string;
  title: string;
  subject: string;
  topic: string;
  relevanceScore: number;   // 0.0-1.0 from Cohere rerank
  snippet: string;           // first 200 chars of chunk
  sourceType: 'textbook' | 'notes' | 'exam_prep' | 'case' | 'retrieval_card';
}

interface ProactiveInsight {
  id: string;
  type: 'spaced_repetition_due' | 'streak_warning' | 'exam_countdown'
      | 'weak_area_alert' | 'study_tip' | 'memory_insight';
  title: string;
  body: string;
  room: ATOMRoom;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  createdAt: Date;
  read: boolean;
}

interface InstalledPlugin {
  pluginId: string;
  name: string;
  icon: string;
  activeInRooms: ATOMRoom[];
  version: string;
}
```

### Actions

```typescript
interface ATOMActions {
  // Messaging
  sendMessage: (content: string, options?: SendOptions) => Promise<void>;
  stopGeneration: () => void;
  resetConversation: () => void;

  // Room
  switchRoom: (room: ATOMRoom) => void;

  // Memory
  toggleMemory: (enabled: boolean) => void;
  dismissMemory: (memoryId: string) => void;

  // Plugins
  installPlugin: (pluginId: string) => Promise<void>;
  uninstallPlugin: (pluginId: string) => Promise<void>;
  togglePluginInRoom: (pluginId: string, room: ATOMRoom, active: boolean) => void;

  // Proactivity
  dismissInsight: (insightId: string) => void;
  markInsightsRead: () => void;

  // Connection
  reconnect: () => void;
}

interface SendOptions {
  roomOverride?: ATOMRoom;
  topicContext?: string;        // current topic slug
  pageContext?: string;         // current page content excerpt
  action?: string;              // e.g. 'generate_summary', 'explain_mcq'
}
```

### Provider Implementation Pattern

```typescript
// src/providers/ATOMProvider.tsx
'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const ATOMContext = createContext<ATOMState & ATOMActions>(/* ... */);

export function ATOMProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const supabase = createClient();
  const [state, dispatch] = useReducer(atomReducer, initialState);

  // Auto-detect room from pathname
  useEffect(() => {
    const room = detectRoom(pathname);
    dispatch({ type: 'SET_ROOM', room });
  }, [pathname]);

  // Subscribe to proactive insights via Supabase Realtime
  useEffect(() => {
    const channel = supabase
      .channel('atom-insights')
      .on('broadcast', { event: 'proactive_insight' }, (payload) => {
        dispatch({ type: 'ADD_INSIGHT', insight: payload.payload });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  // Fetch user's installed plugins and memories on mount
  useEffect(() => {
    loadUserATOMState(supabase, dispatch);
  }, [supabase]);

  return (
    <ATOMContext.Provider value={{ ...state, ...actions }}>
      {children}
    </ATOMContext.Provider>
  );
}

export const useATOM = () => useContext(ATOMContext);
```

### Persistence Strategy

| Data | Storage | Reason |
|------|---------|--------|
| `conversationId` | URL search param `?conv=xxx` | Shareable, survives refresh |
| `activeRoom` | Derived from `pathname` | Always in sync with navigation |
| `memoryEnabled` | `localStorage` | User preference, instant read |
| `installedPlugins` | Supabase `user_plugins` | Server-authoritative |
| `proactiveInsights` | Supabase `atom_proactive_insights` | Server-generated |
| `messages` | In-memory (React state) | Ephemeral per session |
| `studentProfile` | Supabase `student_profiles` | Server-authoritative |

---

## 3. ATOM Widget v2

### Evolution from v1

| v1 AtomWidget.tsx | v2 ATOMWidget |
|-------------------|---------------|
| Hardcoded room modes | Reads from ATOMProvider |
| Simple text streaming | Rich SSE with agent/source/memory events |
| No memory awareness | Memory callouts in responses |
| No plugin awareness | Plugin badges on active plugins |
| No proactive features | Notification badge with unread count |
| 2 states: collapsed/expanded | 3 states: collapsed, compact, expanded |

### Three Display Modes

```
┌─────────────────────────────────────────────┐
│  COLLAPSED (FAB)                            │
│  - Floating button, bottom-right            │
│  - Room icon + mode badge                   │
│  - Notification count badge (if > 0)        │
│  - Pulse animation on new insight           │
│  - Click → Compact                          │
└─────────────────────────────────────────────┘
         │ click
         ▼
┌─────────────────────────────────────────────┐
│  COMPACT (Mini-Chat)                        │
│  - 320px wide, 400px tall                   │
│  - Header: ATOM name + room mode + agents   │
│  - Message area with rich rendering         │
│  - Suggestion chips (room-specific)         │
│  - Input bar                                │
│  - "Expand" button → Expanded               │
└─────────────────────────────────────────────┘
         │ expand
         ▼
┌─────────────────────────────────────────────┐
│  EXPANDED (Full Panel)                      │
│  - 480px wide, 80vh tall                    │
│  - Everything in Compact PLUS:              │
│  - Agent pipeline visualization             │
│  - Source attribution cards                 │
│  - Memory peek sidebar                      │
│  - Plugin status badges                     │
│  - "Open in Studio" button → /chat          │
└─────────────────────────────────────────────┘
```

### Room Mode Mapping (v2)

```typescript
const ATOM_ROOM_MODES: Record<ATOMRoom, RoomMode> = {
  desk:      { name: 'Command Centre',    icon: '📊', color: '#5BB3B3' },
  library:   { name: 'Librarian',         icon: '📚', color: '#7BA69E' },
  classroom: { name: 'Lecture Partner',    icon: '🎓', color: '#6BA8C9' },
  training:  { name: 'Practice Partner',  icon: '🎯', color: '#5BB3B3' },
  cbme:      { name: 'Competency Guide',  icon: '📋', color: '#6BA8C9' },
  community: { name: 'Debate Moderator',  icon: '⚖️', color: '#C9A86C' },
  arena:     { name: 'Competition Coach', icon: '🏆', color: '#C9A86C' },
  backstage: { name: 'Cognitive Coach',   icon: '🧠', color: '#A78BFA' },
  studio:    { name: 'Open Studio',       icon: '⚛️', color: '#5BB3B3' },
};
```

### Rich SSE Event Handling

```typescript
// Inside ATOMProvider's sendMessage — parse SSE lines:

for (const line of lines) {
  if (!line.startsWith('data: ')) continue;
  const raw = line.slice(6);
  if (raw === '[DONE]') break;

  const event: ATOMSSEEvent = JSON.parse(raw);

  switch (event.type) {
    case 'atom:text':
      dispatch({ type: 'APPEND_TEXT', text: event.text });
      break;

    case 'atom:agent':
      dispatch({
        type: 'UPDATE_AGENT',
        agentId: event.agentId,
        status: event.status,
        durationMs: event.durationMs,
      });
      break;

    case 'atom:source':
      dispatch({
        type: 'ADD_SOURCE',
        source: {
          chunkId: event.chunkId,
          title: event.title,
          subject: event.subject,
          relevanceScore: event.relevanceScore,
          snippet: event.snippet,
        },
      });
      break;

    case 'atom:memory':
      // Show memory callout ("I remember you struggled with...")
      dispatch({ type: 'ADD_MEMORY_REF', memory: event.memory });
      break;

    case 'atom:error':
      dispatch({ type: 'SET_ERROR', error: event.message });
      break;
  }
}
```

### Widget Props

```typescript
interface ATOMWidgetV2Props {
  /** Hide on certain pages (default: ['/chat']) */
  hideOnPaths?: string[];
  /** Default display mode */
  defaultMode?: 'collapsed' | 'compact' | 'expanded';
  /** Disable proactive notifications badge */
  disableNotifications?: boolean;
}
```

---

## 4. ATOM Panel v2

Side panel that slides in from the right edge. Each room gets a tailored panel configuration.

### Panel Structure

```
┌──────────────────────────────────┐
│  ATOM Panel v2                   │
├──────────────────────────────────┤
│  🧠 Active Agents                │
│  ┌──────┬──────┬──────┬───────┐ │
│  │Scribe│Retriv│Critic│Memory │ │
│  │  ●   │  ●   │  ○   │  ●   │ │
│  └──────┴──────┴──────┴───────┘ │
├──────────────────────────────────┤
│  💡 Insights                     │
│  ┌────────────────────────────┐ │
│  │ ⚠️ Weak area: Portal HTN   │ │
│  │ Accuracy dropped 15%       │ │
│  │ [Review Now →]             │ │
│  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │
│  │ 📅 Spaced rep due: 5 items │ │
│  │ Anatomy, Physiology cards  │ │
│  │ [Start Review →]           │ │
│  └────────────────────────────┘ │
├──────────────────────────────────┤
│  🔌 Active Plugins              │
│  [Assessor ✓] [Challenger ✓]   │
│  [+ Browse MarketHub]           │
├──────────────────────────────────┤
│  📝 Recent Memory               │
│  "Prefers visual explanations"  │
│  "Weak in thyroid staging"      │
│  [View All Memories →]          │
├──────────────────────────────────┤
│  ⚡ Quick Actions                │
│  [Generate Summary]             │
│  [Create Flashcards]            │
│  [Ask About This Page]          │
└──────────────────────────────────┘
```

### TypeScript Interface

```typescript
interface ATOMPanelV2Props {
  room: ATOMRoom;
  position?: 'right' | 'left';
  defaultCollapsed?: boolean;
  onClose?: () => void;
  className?: string;
}

interface PanelSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}
```

---

## 5. Room-Specific ATOM Integrations

### 5a. Desk — Command Centre Dashboard

The Desk is ATOM's mission control. Every widget here is powered by agent outputs.

```
┌─────────────────────────────────────────────────┐
│  Good morning, Sarath! Here's your plan for     │
│  today. You have 3 weak areas to review and     │
│  12 spaced repetition cards due.                │
│                          [Start Studying →]     │
├────────────────────┬────────────────────────────┤
│  📊 Study Plan      │  ⚠️ Weak Areas            │
│  (Cartographer +    │  - Portal Hypertension    │
│   Analyst output)   │  - Thyroid Staging        │
│                     │  - Esophageal Anatomy     │
│  Week 2 of 8        │                           │
│  ████████░░ 65%     │  [Review in Training →]   │
├─────────────────────┼───────────────────────────┤
│  🔄 Spaced Rep Due  │  🔥 Streak & Momentum    │
│  12 cards due today │  15-day streak            │
│  Anatomy: 5         │  Daily avg: 45 min        │
│  Physiology: 4      │  This week: 3.5 hrs       │
│  Pathology: 3       │  [Detailed Stats →]       │
│  [Start Review →]   │                           │
├─────────────────────┴───────────────────────────┤
│  🗺️ Knowledge Graph (mini)                      │
│  Interactive node visualization of topics        │
│  studied, with connections and mastery colors    │
└─────────────────────────────────────────────────┘
```

**Components:**
- `<ATOMGreetingCard />` — Personalized morning card using memory + Analyst insights
- `<StudyPlanWidget />` — Cartographer-generated roadmap with progress
- `<WeakAreaAlerts />` — Memorist weak_area memories displayed as action cards
- `<SpacedRepDue />` — Items due from spaced repetition engine
- `<StreakTracker />` — Streak count, daily average, momentum graph
- `<KnowledgeGraphMini />` — D3.js or react-force-graph mini visualization

### 5b. Library — Librarian Integration

ATOM enhances the reading experience with contextual intelligence.

**Embedded Features:**
- **Topic Relationship Sidebar** — Cartographer outputs a list of related topics. Displayed as a linked sidebar when reading any topic page.
- **Prerequisites Banner** — If Cartographer detects missing prerequisites based on memory, show: "Before diving into Portal Hypertension, you may want to review Hepatic Anatomy."
- **Cross-Reference Suggestions** — At the bottom of topic pages: "This topic connects to: [Esophageal Varices] [Hepatorenal Syndrome] [TIPS Procedure]"
- **"Ask ATOM About This" Button** — Contextual floating button on any section. Sends the section content as `pageContext` to ATOM chat.
- **Source Synthesis Panel** — When multiple textbooks cover the same topic, show: "3 sources cover this topic. [Compare perspectives]"

### 5c. Classroom — Lecture Partner Panel

ATOM acts as a real-time study companion during lectures.

**Embedded Features:**
- **Real-Time Note Generation** — Scribe Pro plugin generates structured notes as the student interacts. Shown in a collapsible right panel.
- **Mind Map Canvas** — Integration with Excalidraw (already exists as `AtomMindMap.tsx`). v2 adds ATOM-generated concept maps that populate the canvas automatically.
- **Pre-Lecture Primer Card** — Before starting a lecture topic, ATOM shows key concepts, what you already know, and what to focus on.
- **Post-Lecture Quiz** — Challenger plugin generates 5 quick-check questions after lecture completion. Inline quiz card.
- **Key Takeaways** — Auto-generated summary after lecture. Shown as a dismissible card.
- **Active Recall Prompts** — Periodic prompts during reading: "Can you explain [concept] in your own words?"

### 5d. Training Centre — Practice Partner Interface

ATOM transforms MCQ practice into deep clinical learning.

**Embedded Features:**
- **MCQ Explanation Panel** — After answering, Assessor analyzes the answer and Clinician provides clinical context. Shown in a slide-up panel below the question.
- **"The Trap In This Question"** — Highlight card showing the common mistake/distractor analysis. Uses Examiner plugin.
- **Difficulty Adaptation Indicator** — Visual gauge showing current difficulty level. Adjusts based on Analyst's performance tracking.
- **Clinical Reasoning Tree** — For clinical scenario questions, Clinician generates a DDx tree. Interactive collapsible tree visualization.
- **Performance Tracker Sidebar** — Rolling accuracy chart (last 20 questions), subject breakdown, time per question trend.
- **"Questions Like This"** — Challenger recommends similar questions from the question bank.
- **Patient Simulator Mode** — Clinician agent acts as an attending physician presenting a case. Student must ask questions, order tests, and reach a diagnosis through conversation.

### 5e. CBME — Competency Tracker Dashboard

ATOM maps progress to NMC competency framework.

**Embedded Features:**
- **Competency Progress Grid** — Curriculum Mapper outputs a grid of all competencies for the selected phase/subject. Each cell shows mastery level with color coding.
- **K/KH/SH/P Domain Bars** — Four progress bars showing coverage across Know / Know-How / Show-How / Perform domains.
- **"Next Competency"** — Recommendation card suggesting the next competency to work on based on current progress and exam weightage.
- **Library + Training Centre Cross-Links** — Each competency links to relevant Library topics and Training Centre question sets.
- **Phase-Wise Gauges** — Donut charts showing completion percentage per CBME phase.

### 5f. Common Room — Moderated Discussions

ATOM adds evidence-based moderation to peer discussions.

**Embedded Features:**
- **Fact-Check Badges** — Moderator plugin attaches Verified or Needs Citation badges to discussion posts containing medical claims.
- **"ATOM Says" Evidence Cards** — Inline evidence cards that appear when a discussion point has supporting textbook references.
- **Discussion Summary** — At the top of long threads (>10 posts), ATOM generates a neutral summary of key points raised.
- **Structured Debate View** — For controversial topics, Moderator structures the thread into "For" and "Against" columns with evidence.
- **Source Citations** — Medical claims in posts are linked to corresponding Library topics.

### 5g. Arena — Competition Analytics

ATOM coaches competitive performance.

**Embedded Features:**
- **Speed vs Accuracy Scatter** — Analyst generates a scatter plot: x=time-per-question, y=accuracy. Identify quadrant (fast+accurate, slow+accurate, fast+wrong, slow+wrong).
- **Post-Match Breakdown** — After a competition round, detailed analysis card: strengths, weaknesses, where time was lost, topics to improve.
- **"Coach's Strategy" Card** — Before matches, ATOM suggests focus areas based on the student's strengths and the opponent's likely strategy.
- **Competitive Weak Spots Heatmap** — Subject x difficulty heatmap showing where the student loses most points vs peers.
- **Performance Trend Sparklines** — Tiny inline charts showing accuracy, speed, and rank trends over last 10 competitions.

### 5h. Backstage — Cognitive Analytics Dashboard

ATOM provides metacognitive self-awareness tools.

**Embedded Features:**
- **Confidence Calibration Gauge** — Semicircle arc chart comparing student's confidence ratings vs actual accuracy. Perfect calibration = 45 degree line. Overconfident = above line.
- **Bloom's Taxonomy Radar** — 6-axis radar chart: Remember, Understand, Apply, Analyze, Evaluate, Create. Shows which cognitive levels the student engages most.
- **Kolb's Learning Cycle Indicator** — Circular diagram showing which phase the student spends most time in: Concrete Experience, Reflective Observation, Abstract Conceptualization, Active Experimentation.
- **BEDS-M Wellbeing Check-In** — Wellness Coach plugin presents periodic self-assessment cards: Burnout, Emotional state, Diet, Sleep, Motivation. Non-intrusive, once per week.
- **"Your Blind Spots"** — Honest insight cards highlighting areas the student consistently avoids or underperforms in.
- **Competency Ladder** — 4-stage visualization: Unconscious Incompetence → Conscious Incompetence → Conscious Competence → Unconscious Competence. Per-subject positioning.
- **Bear Hunter System Tracker** — Study strategy tracker showing time allocation across Bear (critical), Deer (important), Rabbit (nice-to-know) topics.

### 5i. Open Studio — Full ATOM Experience

The /chat page is the unrestricted ATOM interface with full agent access.

**v2 Enhancements over v1:**

```
┌───────────┬─────────────────────────┬──────────────┐
│  Sources  │      Chat               │   Actions    │
│           │                         │              │
│  [toggle] │  ┌─Agent Pipeline────┐  │  [Summary]   │
│  [toggle] │  │Scribe→Retriever→  │  │  [Cards]     │
│  [toggle] │  │Critic→Memorist    │  │  [MindMap]   │
│           │  └───────────────────┘  │  [PPT]       │
│  + Add    │                         │  [Audio]     │
│           │  [Chat Messages]        │              │
│           │  with source cards,     │  ──────────  │
│  ──────── │  memory callouts,       │  🔌 Plugins  │
│  🧠 Memory│  agent indicators       │  [Assessor]  │
│  Browser  │                         │  [Examiner]  │
│           │                         │  [+ Hub]     │
│           │  [Input Bar]            │              │
│           │  [Context: Library >    │  ──────────  │
│           │   Surgery > Esophagus]  │  📄 Outputs  │
└───────────┴─────────────────────────┴──────────────┘
```

**New Features:**
- **Agent Pipeline Visualization** — Horizontal stepper header showing real-time agent execution
- **Cross-Room Context Switcher** — Dropdown to set ATOM's room mode without navigating: "Respond as [Librarian]"
- **Output Format Selector** — After generation, convert output: Summary | Flashcards | Mind Map | Presentation | Audio Script
- **Memory Browser** — Left panel section showing "What ATOM knows about you" with search
- **Extended Conversation** — Longer context window support, conversation branching
- **All Plugins Accessible** — Every installed plugin available regardless of room

---

## 6. Agent Transparency Panel

An expandable section under each ATOM response showing how the answer was generated.

### Layout

```
┌─────────────────────────────────────────────────┐
│  ATOM Response text here...                     │
│                                                 │
│  ▼ How ATOM answered                            │
├─────────────────────────────────────────────────┤
│                                                 │
│  Pipeline:                                      │
│  [Scribe ✓]→[Retriever ✓]→[Critic ✓]→          │
│  [Assessor ✓]→[Memorist ✓]→[Generate ✓]        │
│  Total: 1.2s                                    │
│                                                 │
│  Sources (3):                                   │
│  ┌──────────────────────────────────────────┐  │
│  │ 📚 Shackelford Ch.35 — Esophageal       │  │
│  │    Relevance: 0.92 █████████░            │  │
│  │    "...transhiatal approach involves..." │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │ 📚 Robbins Ch.17 — GI Pathology         │  │
│  │    Relevance: 0.78 ████████░░            │  │
│  │    "...Barrett's metaplasia occurs..."   │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  Memory Used:                                   │
│  - "Struggled with esophageal anatomy" (5d ago) │
│  - "Prefers diagram explanations" (12d ago)     │
│                                                 │
│  Plugins: Assessor (graded answer), Clinician   │
│           (clinical correlation)                │
└─────────────────────────────────────────────────┘
```

### TypeScript Interface

```typescript
interface AgentTransparencyProps {
  pipeline: AgentStatus[];
  sources: SourceAttribution[];
  memories: ATOMMemory[];
  activePlugins: string[];
  totalDurationMs: number;
  defaultExpanded?: boolean;
}
```

### User Control

Users can toggle transparency in settings:
- **Off** (default for new users) — Clean responses, no pipeline info
- **Minimal** — Show source count + agent count badge
- **Full** (power user) — Complete pipeline, sources, memory refs

Setting stored in `localStorage` as `atom_transparency_level`.

---

## 7. Proactive Notifications — Heartbeat UI

### Notification Flow

```
Supabase Edge Function (cron, every 30 min)
  → Check: spaced rep due? streak risk? exam close? weak areas?
  → INSERT INTO atom_proactive_insights
  → Supabase Realtime broadcast on channel 'atom-insights'
  → ATOMProvider receives broadcast
  → dispatch({ type: 'ADD_INSIGHT', insight })
  → Widget badge count increments
  → ProactiveToast appears (if high priority)
```

### Notification Types & UI

| Type | Icon | Priority | Toast? | Example |
|------|------|----------|--------|---------|
| `spaced_repetition_due` | 🔄 | medium | No | "12 cards due for review" |
| `streak_warning` | 🔥 | high | Yes | "Your 15-day streak ends in 2 hours!" |
| `exam_countdown` | 📅 | high | Yes | "NEET-PG in 45 days. Focus areas: [...]" |
| `weak_area_alert` | ⚠️ | medium | No | "Portal HTN accuracy dropped 15%" |
| `study_tip` | 💡 | low | No | "Try active recall for Anatomy topics" |
| `memory_insight` | 🧠 | low | No | "You've mastered 3 new topics this week!" |

### Notification Center

Accessed via bell icon in the app header (next to user avatar).

```
┌──────────────────────────────────┐
│  🔔 Notifications          [✓ All]│
├──────────────────────────────────┤
│  🔥 HIGH                         │
│  ┌────────────────────────────┐ │
│  │ Your streak ends in 2 hrs! │ │
│  │ Open any room to continue  │ │
│  │ [Continue Studying →]  2m  │ │
│  └────────────────────────────┘ │
│                                  │
│  ⚠️ MEDIUM                       │
│  ┌────────────────────────────┐ │
│  │ 12 spaced rep cards due    │ │
│  │ Anatomy (5), Physio (4)... │ │
│  │ [Start Review →]      1h   │ │
│  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │
│  │ Weak area: Thyroid staging │ │
│  │ Accuracy 45% (target: 70%)│ │
│  │ [Practice Now →]      3h   │ │
│  └────────────────────────────┘ │
│                                  │
│  💡 LOW                          │
│  ┌────────────────────────────┐ │
│  │ You've mastered 3 topics!  │ │
│  │ 🧠 Memory insight     1d  │ │
│  └────────────────────────────┘ │
└──────────────────────────────────┘
```

### TypeScript Interfaces

```typescript
interface ProactiveToastProps {
  insight: ProactiveInsight;
  onDismiss: () => void;
  onAction?: () => void;
  autoHideDuration?: number; // ms, default 8000
}

interface NotificationCenterProps {
  insights: ProactiveInsight[];
  onDismiss: (id: string) => void;
  onMarkAllRead: () => void;
  onAction: (insight: ProactiveInsight) => void;
}
```

---

## 8. Memory UI

### Page: `/settings/atom-memory`

```
┌─────────────────────────────────────────────────┐
│  🧠 What ATOM Knows About You                   │
│                                                  │
│  ATOM learns from your interactions to provide   │
│  personalized guidance. You're in full control.  │
│                                                  │
│  Memory Collection: [████████ ON]  [Pause]       │
├─────────────────────────────────────────────────┤
│  Search memories...  [🔍]                        │
│                                                  │
│  Filter: [All ▾] [All Rooms ▾] [All Time ▾]     │
├─────────────────────────────────────────────────┤
│                                                  │
│  📊 topic_mastery (14)                           │
│  ┌────────────────────────────────────────────┐ │
│  │ 🟢 "Strong in Upper GI Surgery anatomy"    │ │
│  │    Room: Library · 3 days ago · Score: 0.9 │ │
│  │    [Edit] [Delete] [Correct ATOM]          │ │
│  └────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────┐ │
│  │ 🟡 "Moderate in Portal Hypertension mgmt" │ │
│  │    Room: Training · 5 days ago · Score: 0.7│ │
│  │    [Edit] [Delete] [Correct ATOM]          │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ⚠️ weak_area (3)                                │
│  ┌────────────────────────────────────────────┐ │
│  │ 🔴 "Consistently wrong on thyroid staging" │ │
│  │    Room: Training · 2 days ago · Score: 0.9│ │
│  │    [Edit] [Delete] [Correct ATOM]          │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  💡 preference (5)                               │
│  🎯 goal (2)                                     │
│  📈 study_pattern (4)                            │
│  🔗 clinical_connection (6)                      │
│  💭 insight (8)                                  │
├─────────────────────────────────────────────────┤
│  Memory Timeline                                 │
│  [Interactive timeline showing when memories     │
│   were created, colored by type, with hover      │
│   preview]                                       │
├─────────────────────────────────────────────────┤
│  Data Controls                                   │
│  [Export All Memories (JSON)]                    │
│  [Clear All Memories]  ← requires confirmation  │
└─────────────────────────────────────────────────┘
```

### "Correct ATOM" Flow

When a student clicks "Correct ATOM" on a memory:
1. Modal opens with the memory content pre-filled
2. Student edits the content to correct it
3. On save: memory content updated, relevance_score reset to 1.0
4. ATOM acknowledges correction in next interaction

### TypeScript Interfaces

```typescript
interface MemoryBrowserProps {
  memories: ATOMMemory[];
  onEdit: (id: string, newContent: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCorrect: (id: string, correction: string) => Promise<void>;
  onToggleCollection: (enabled: boolean) => void;
  onExport: () => void;
  onClearAll: () => Promise<void>;
}

interface MemoryCardProps {
  memory: ATOMMemory;
  onEdit: () => void;
  onDelete: () => void;
  onCorrect: () => void;
  showRoom?: boolean;
  showScore?: boolean;
}

interface ATOMMemory {
  id: string;
  userId: string;
  memoryType: 'topic_mastery' | 'weak_area' | 'preference' | 'insight'
            | 'goal' | 'study_pattern' | 'clinical_connection';
  content: string;
  room: ATOMRoom;
  subject?: string;
  topic?: string;
  relevanceScore: number;
  createdAt: Date;
  updatedAt: Date;
  lastAccessedAt?: Date;
}
```

---

## 9. MarketHub UI

### Page: `/atom/markethub`

```
┌─────────────────────────────────────────────────┐
│  🔌 ATOM MarketHub                               │
│  Extend ATOM with powerful plugins               │
├─────────┬───────────────────────────────────────┤
│ Category│                                        │
│ ──────  │  Featured Plugins                      │
│ [All]   │  ┌──────┐  ┌──────┐  ┌──────┐       │
│ [Assess]│  │🎯    │  │⚔️    │  │🗺️    │       │
│ [Create]│  │Assess │  │Chall │  │Carto │       │
│ [Analyz]│  │★★★★☆ │  │★★★★★ │  │★★★★☆ │       │
│ [Clinic]│  │Free   │  │Free  │  │Free  │       │
│ [Exam]  │  │12K    │  │8K    │  │5K    │       │
│ [Meta]  │  └──────┘  └──────┘  └──────┘       │
│         │                                        │
│ Price   │  Recommended For You                   │
│ ──────  │  Based on your weak areas and study    │
│ [Free]  │  patterns:                             │
│ [Prem]  │  ┌──────────────────────────────────┐ │
│         │  │ 📝 Examiner — You're preparing   │ │
│ Rating  │  │    for NEET-PG. This plugin      │ │
│ ──────  │  │    teaches PYQ patterns.          │ │
│ [4+ ★]  │  │    [Install Free →]               │ │
│ [3+ ★]  │  └──────────────────────────────────┘ │
└─────────┴───────────────────────────────────────┘
```

### Plugin Detail Page: `/atom/markethub/[pluginId]`

```
┌─────────────────────────────────────────────────┐
│  🎯 Assessor                                    │
│  by NucleuX Team · v2.1.0 · Updated 2 days ago │
│  ★★★★☆ (4.3) · 12,450 installs · Free          │
│                                                  │
│  [Install] [Demo]                                │
├─────────────────────────────────────────────────┤
│  Description                                     │
│  Intelligent MCQ grading with Bloom's taxonomy   │
│  level detection, confidence scoring, and        │
│  detailed explanations for wrong answers.        │
│                                                  │
│  Skills:                                         │
│  - grade_answer — Grade MCQ with explanation     │
│  - detect_bloom — Detect Bloom's taxonomy level  │
│  - confidence_score — Calibrate confidence       │
│                                                  │
│  Works in: Training Centre, Arena, Open Studio   │
│                                                  │
│  Screenshots: [img1] [img2] [img3]              │
├─────────────────────────────────────────────────┤
│  Reviews                                         │
│  ┌────────────────────────────────────────────┐ │
│  │ ★★★★★ "Game changer for MCQ practice"     │ │
│  │ The explanations are incredibly detailed.  │ │
│  │ — medstudent23, 3 days ago                 │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Installed Plugins: `/settings/atom-plugins`

```
┌─────────────────────────────────────────────────┐
│  🔌 Installed Plugins                            │
├─────────────────────────────────────────────────┤
│  Assessor v2.1.0                    [Uninstall] │
│  Active in: [✓ Training] [✓ Arena] [✓ Studio]  │
│             [○ Library]  [○ Classroom] [○ Desk] │
├─────────────────────────────────────────────────┤
│  Challenger v1.8.0                  [Uninstall] │
│  Active in: [✓ Training] [✓ Classroom]          │
│             [✓ Studio]  [○ Arena]               │
├─────────────────────────────────────────────────┤
│  Clinician v3.0.0                   [Uninstall] │
│  Active in: [✓ Training] [✓ Studio]             │
│             [✓ Library]                          │
└─────────────────────────────────────────────────┘
```

### TypeScript Interfaces

```typescript
interface PluginCardProps {
  plugin: MarketHubPlugin;
  onInstall: () => void;
  onUninstall: () => void;
  installed?: boolean;
}

interface MarketHubPlugin {
  pluginId: string;
  name: string;
  icon: string;
  vendor: string;
  version: string;
  description: string;
  category: PluginCategory;
  rating: number;
  reviewCount: number;
  installCount: number;
  price: number | 'free';
  skills: PluginSkillSummary[];
  compatibleRooms: ATOMRoom[];
  screenshots?: string[];
  updatedAt: Date;
}

type PluginCategory =
  | 'assessment'
  | 'content_creation'
  | 'analytics'
  | 'clinical'
  | 'exam_prep'
  | 'metacognition';

interface PluginSkillSummary {
  name: string;
  description: string;
}
```

---

## 10. Design System Extensions

### New Components

#### `<AgentStatusBadge />`

```typescript
interface AgentStatusBadgeProps {
  agentId: string;
  name: string;
  status: 'queued' | 'thinking' | 'active' | 'done' | 'skipped' | 'error';
  durationMs?: number;
  size?: 'sm' | 'md';
}
```

Visual: Pill badge with colored dot. Dot animates (pulse) when thinking.

#### `<PipelineVisualization />`

```typescript
interface PipelineVisualizationProps {
  agents: AgentStatus[];
  totalDurationMs?: number;
  compact?: boolean; // single line vs multi-line
}
```

Visual: Horizontal stepper with arrows. Each step is an AgentStatusBadge. Steps light up sequentially during streaming.

#### `<MemoryCard />`

```typescript
interface MemoryCardProps {
  memory: ATOMMemory;
  variant?: 'full' | 'compact' | 'inline';
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onCorrect?: () => void;
}
```

Visual: Card with type icon, content text, metadata (room, date, score), and action buttons.

#### `<PluginCard />`

Visual: Card with plugin icon, name, rating stars, install count, price badge, and install button.

#### `<ProactiveToast />`

Visual: Slide-in toast from top-right. ATOM avatar icon, insight text, action button, dismiss X. Auto-hides after 8 seconds.

#### `<InsightCard />`

Visual: Room-colored card with icon, title, description, optional progress bar, and action link.

#### `<SourceAttribution />`

```typescript
interface SourceAttributionProps {
  source: SourceAttribution;
  expanded?: boolean;
  onToggle?: () => void;
}
```

Visual: Compact card showing source title, type badge, relevance bar (0-100%), and expandable snippet.

#### `<ConfidenceGauge />`

Visual: Semicircle arc (D3.js or SVG). Left = 0%, Right = 100%. Needle points to calibration score. Green zone = well-calibrated, red zones = over/under confident.

#### `<BloomRadar />`

Visual: 6-axis radar chart (Chart.js or recharts). Axes: Remember, Understand, Apply, Analyze, Evaluate, Create. Filled area shows student's engagement distribution.

#### `<AgentThinking />`

Visual: Three animated dots in agent color, similar to typing indicator. Used inline when an agent is processing.

### Agent Color System

| Agent | Color | Hex | CSS Variable |
|-------|-------|-----|-------------|
| Scribe | Blue | `#60A5FA` | `--agent-scribe` |
| Retriever | Green | `#34D399` | `--agent-retriever` |
| Critic | Orange | `#FB923C` | `--agent-critic` |
| Memorist | Purple | `#A78BFA` | `--agent-memorist` |
| Router | Gray | `#94A3B8` | `--agent-router` |
| Plugins | Gold | `#C9A86C` | `--agent-plugin` |

### Animation Patterns

```css
/* Agent thinking pulse */
@keyframes agent-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.95); }
}

/* Pipeline step progression */
@keyframes pipeline-step {
  0% { background-color: var(--muted); }
  50% { background-color: var(--primary); box-shadow: 0 0 12px var(--primary); }
  100% { background-color: var(--primary); }
}

/* Memory card entrance */
@keyframes memory-enter {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Proactive notification slide-in */
@keyframes toast-slide {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}

/* ATOM thinking ambient glow */
@keyframes atom-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(91, 179, 179, 0.2); }
  50% { box-shadow: 0 0 40px rgba(91, 179, 179, 0.4); }
}
```

---

## 11. Responsive Behavior

### Breakpoint Strategy

| Breakpoint | Width | ATOM Widget | ATOM Panel | Room Integration |
|------------|-------|-------------|------------|-----------------|
| Mobile | < 768px | Bottom sheet (swipe up) | Full screen overlay | Stacked below content |
| Tablet | 768-1024px | FAB then Drawer | Slide-in drawer | Side-by-side where possible |
| Desktop | > 1024px | FAB then Expanded panel | Always-visible sidebar | Full layout as designed |

### Mobile-Specific Behavior

- **Widget** — Transforms to a bottom sheet that swipes up from the bottom edge
- **Panel** — Full-screen overlay with back button
- **Room integrations** — Stack vertically below main content
- **Agent pipeline** — Collapsed to a single line with expandable detail
- **MarketHub** — Single-column card layout
- **Memory browser** — Full-screen page
- **Notification center** — Full-screen page

### Tablet-Specific Behavior

- **Widget** — Standard FAB, expands to overlay panel
- **Panel** — Drawer that pushes content or overlays
- **Open Studio** — 2-column layout (Sources hidden behind toggle)

---

## 12. Cross-References

| Spec | Relevant Frontend Sections |
|------|---------------------------|
| [ATOM_GATEWAY_SPEC.md](./ATOM_GATEWAY_SPEC.md) | SSE event types (S3), session management (S2), Heartbeat (S7) |
| [ATOM_RAG_PIPELINE_SPEC.md](./ATOM_RAG_PIPELINE_SPEC.md) | Source attribution (S6), context assembly (S3, S5i) |
| [ATOM_MEMORY_SPEC.md](./ATOM_MEMORY_SPEC.md) | Memory UI (S8), memory callouts (S3), Memorist protocol (S4) |
| [ATOM_AGENTS_SPEC.md](./ATOM_AGENTS_SPEC.md) | Agent transparency (S6), plugin integrations (S5a-S5i), pipeline vis (S10) |
| [ATOM_MARKETHUB_SPEC.md](./ATOM_MARKETHUB_SPEC.md) | MarketHub UI (S9), plugin management (S9), SDK (S9) |
| [ATOM_CHAT_SPEC.md](./ATOM_CHAT_SPEC.md) | Chat modes, voice input, Indian language support |
| [DESIGN-SYSTEM.md](../DESIGN-SYSTEM.md) | ATOM Matte Theme, room colors, typography, shadows |

---

*ATOM v2 Frontend Spec · NucleuX Academy · Last updated: 2026-02-22*
