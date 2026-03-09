---
title: "Atom Chat Spec"
summary: "Detailed ATOM chat API and behavior specification."
audience: "engineer"
status: "implemented"
source_path: "docs/specs/ATOM_CHAT_SPEC.md"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "A/B/C"
llm_handover_relevance: "high"
---

# ATOM Chat Room — Full Specification

*Version 1.0 | 2026-02-08 | For Vishwakarma*

---

## Overview

The ATOM Chat room is the AI tutor interface — where students have one-on-one conversations with ATOM for learning, doubt-solving, and guided practice. This is the heart of NucleuX Academy.

**Philosophy:** Learning happens through dialogue, not monologue. ATOM asks before it tells. It challenges before it confirms. The struggle IS the learning.

---

## Core Principles (From ATOM's Soul)

1. **Atomic Thinking** — Break complex topics into smallest teachable units
2. **Retrieval Over Recognition** — Ask questions, don't just explain
3. **Desirable Difficulty** — The right amount of struggle strengthens learning
4. **Calibration** — Track confidence vs accuracy to fix blind spots
5. **Connections** — Link new knowledge to existing understanding

---

## Chat Modes

### 1. Free Chat (Default)
Open-ended conversation for any question or topic.

```typescript
interface FreeChatSession {
  mode: 'free';
  // No constraints - student asks anything
  // ATOM responds with teaching approach
}
```

### 2. Topic Deep Dive
Structured exploration of a specific topic.

```typescript
interface TopicDiveSession {
  mode: 'topic_dive';
  topicId: string;
  conceptIds: string[];       // Concepts to cover
  
  structure: {
    phase: 'assess' | 'teach' | 'practice' | 'summarize';
    currentConceptIndex: number;
  };
  
  // ATOM flow:
  // 1. Assess: "What do you already know about X?"
  // 2. Teach: Fill gaps with atomic explanations
  // 3. Practice: Retrieval questions
  // 4. Summarize: Key takeaways
}
```

### 3. Doubt Solving
Quick answers to specific questions.

```typescript
interface DoubtSession {
  mode: 'doubt';
  question: string;
  
  // ATOM checks understanding first:
  // "Before I answer, what's your current understanding?"
  // Then fills the gap precisely
}
```

### 4. Case Discussion
Clinical case-based learning.

```typescript
interface CaseDiscussionSession {
  mode: 'case';
  scenarioId?: string;        // Pre-built case or generated
  
  phases: {
    presentation: string;     // Initial case
    history: string;          // Revealed on request
    examination: string;
    investigations: string;
    diagnosis: string;
    management: string;
  };
  
  currentPhase: 'presentation' | 'history' | 'examination' | 
                'investigations' | 'diagnosis' | 'management';
  
  // ATOM guides through clinical reasoning
}
```

### 5. Explain Like I'm 5 (ELI5)
Simplified explanations for complex topics.

```typescript
interface ELI5Session {
  mode: 'eli5';
  topicId: string;
  
  // ATOM uses:
  // - Simple analogies
  // - Everyday examples
  // - Visual descriptions
  // - No jargon
}
```

### 6. Viva Practice
Oral exam simulation.

```typescript
interface VivaSession {
  mode: 'viva';
  topicId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  
  examinerStyle: 'friendly' | 'neutral' | 'strict';
  
  // ATOM acts as examiner:
  // - Asks progressively harder questions
  // - Follows up on answers
  // - Gently corrects misconceptions
  // - Gives feedback at end
}
```

### 7. Revision Sprint
Quick review of previously learned concepts.

```typescript
interface RevisionSession {
  mode: 'revision';
  topicIds: string[];
  
  // ATOM:
  // - Rapid-fire questions on key concepts
  // - Flags weak areas
  // - Links to practice questions
}
```

### 8. Teach Me Back
Student explains, ATOM listens and corrects.

```typescript
interface TeachBackSession {
  mode: 'teach_back';
  conceptId: string;
  
  // ATOM: "Explain X to me as if I'm a junior student"
  // Student explains
  // ATOM identifies gaps, asks clarifying questions
  // Most powerful learning mode
}
```

---

## Data Models

### ChatSession

```typescript
interface ChatSession {
  id: string;
  userId: string;
  
  // Session info
  mode: ChatMode;
  title: string;              // Auto-generated or user-set
  
  // Context
  topicId?: string;
  conceptIds?: string[];
  scenarioId?: string;
  
  // State
  status: 'active' | 'paused' | 'completed';
  startedAt: Date;
  lastMessageAt: Date;
  
  // Settings
  settings: {
    difficulty: 'adaptive' | 'easy' | 'medium' | 'hard';
    responseLength: 'concise' | 'detailed';
    includeImages: boolean;
    includeQuestions: boolean;  // Intersperse retrieval Qs
    language: 'en' | 'hi' | 'te';  // Hindi, Telugu support
  };
  
  // Analytics
  messagesCount: number;
  questionsAsked: number;
  questionsAnsweredCorrectly: number;
  conceptsCovered: string[];
  weakAreasIdentified: string[];
}
```

### ChatMessage

```typescript
interface ChatMessage {
  id: string;
  sessionId: string;
  
  // Content
  role: 'user' | 'assistant' | 'system';
  content: string;            // Markdown supported
  
  // Rich content
  images?: string[];
  diagrams?: string[];        // Generated diagrams
  codeBlocks?: string[];
  
  // Embedded elements
  embeddedQuestion?: {
    questionId: string;
    type: 'mcq' | 'flashcard';
    answered: boolean;
    correct?: boolean;
  };
  
  embeddedNote?: {
    noteId: string;
    title: string;
    preview: string;
  };
  
  // References
  citations?: {
    textbookId: string;
    chapter: string;
    page?: number;
  }[];
  
  conceptsMentioned?: string[];
  
  // Feedback
  helpful?: boolean;          // User feedback
  
  timestamp: Date;
}
```

### ATOMContext (What ATOM knows about the student)

```typescript
interface ATOMContext {
  userId: string;
  
  // Learning profile
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  strongTopics: string[];
  weakTopics: string[];
  
  // Recent activity
  recentConcepts: string[];   // Last 50 concepts touched
  recentMistakes: {
    conceptId: string;
    questionId: string;
    timestamp: Date;
  }[];
  
  // Calibration
  overallCalibration: number; // -1 to 1 (underconfident to overconfident)
  
  // Preferences
  preferredExplanationStyle: 'visual' | 'textual' | 'example-based';
  
  // Session history
  totalSessions: number;
  totalTimeMinutes: number;
  lastSessionAt: Date;
}
```

---

## Database Schema

```sql
-- Chat Sessions
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('free', 'topic_dive', 'doubt', 'case', 'eli5', 'viva', 'revision', 'teach_back')),
  title TEXT,
  topic_id UUID REFERENCES topics(id),
  concept_ids UUID[],
  scenario_id UUID REFERENCES clinical_scenarios(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  settings JSONB DEFAULT '{}',
  messages_count INTEGER DEFAULT 0,
  questions_asked INTEGER DEFAULT 0,
  questions_correct INTEGER DEFAULT 0,
  concepts_covered UUID[],
  weak_areas UUID[],
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Chat Messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  images TEXT[],
  diagrams TEXT[],
  embedded_question JSONB,
  embedded_note JSONB,
  citations JSONB[],
  concepts_mentioned UUID[],
  helpful BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ATOM Context (one per user)
CREATE TABLE atom_context (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_level TEXT DEFAULT 'beginner',
  strong_topics UUID[],
  weak_topics UUID[],
  recent_concepts UUID[],
  recent_mistakes JSONB[],
  overall_calibration FLOAT DEFAULT 0,
  preferred_style TEXT DEFAULT 'textual',
  total_sessions INTEGER DEFAULT 0,
  total_time_minutes INTEGER DEFAULT 0,
  last_session_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at);

-- RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE atom_context ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sessions"
  ON chat_sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own messages"
  ON chat_messages FOR ALL
  TO authenticated
  USING (session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid()));

CREATE POLICY "Users can access own context"
  ON atom_context FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);
```

---

## API Routes

### Sessions

```typescript
// POST /api/chat/sessions
// Create new chat session
// Body: { mode, topicId?, settings? }
// Returns: ChatSession

// GET /api/chat/sessions
// List user's sessions
// Query: { status?, mode?, limit?, offset? }
// Returns: { sessions: ChatSession[], total: number }

// GET /api/chat/sessions/:id
// Get session with messages
// Returns: { session: ChatSession, messages: ChatMessage[] }

// PATCH /api/chat/sessions/:id
// Update session (title, settings, status)
// Body: { title?, settings?, status? }

// DELETE /api/chat/sessions/:id
// Delete session and messages
```

### Messages

```typescript
// POST /api/chat/sessions/:id/messages
// Send message to ATOM
// Body: { content: string, images?: string[] }
// Returns: { userMessage: ChatMessage, atomResponse: ChatMessage }

// POST /api/chat/sessions/:id/messages/:messageId/feedback
// Rate message helpfulness
// Body: { helpful: boolean }

// POST /api/chat/sessions/:id/messages/:messageId/question-response
// Answer embedded question
// Body: { selectedOptionId?: string, confidence: number }
// Returns: { correct: boolean, explanation: string }
```

### Context

```typescript
// GET /api/chat/context
// Get user's ATOM context
// Returns: ATOMContext

// GET /api/chat/suggestions
// Get suggested topics/modes based on context
// Returns: { 
//   weakTopics: Topic[], 
//   suggestedMode: ChatMode,
//   dueForReview: Concept[] 
// }
```

### Quick Actions

```typescript
// POST /api/chat/quick/doubt
// Quick doubt solving (creates session, sends message, returns response)
// Body: { question: string }
// Returns: { sessionId, answer: string }

// POST /api/chat/quick/explain
// Quick ELI5 explanation
// Body: { topic: string }
// Returns: { sessionId, explanation: string }
```

---

## ATOM System Prompts

### Base System Prompt

```markdown
You are ATOM — Atomic Teaching Organism for Medical education.

## Core Principles
1. ASK before you TELL — Check understanding first
2. SIMPLIFY — Break complex into atomic units
3. CONNECT — Link to what student already knows
4. CHALLENGE — Use desirable difficulty
5. VERIFY — Test understanding through retrieval

## About This Student
- Level: {{currentLevel}}
- Strong areas: {{strongTopics}}
- Weak areas: {{weakTopics}}
- Recent mistakes: {{recentMistakes}}
- Calibration: {{calibration}} ({{calibrationInterpretation}})

## Teaching Style
- Response length: {{responseLength}}
- Preferred style: {{preferredStyle}}
- Include images: {{includeImages}}
- Intersperse questions: {{includeQuestions}}

## Response Format
- Use markdown for formatting
- Use ```diagram``` blocks for ASCII diagrams
- Use ```mcq``` blocks for embedded questions
- Cite textbooks when possible: [Harrison's, Ch. 15, p. 234]

## Golden Rules
1. Never give answers directly — guide to discovery
2. Celebrate correct reasoning, not just correct answers
3. Mistakes are learning opportunities — explore them
4. Connect everything to clinical relevance
5. End responses with a thought-provoking question when appropriate
```

### Mode-Specific Prompts

```typescript
const modePrompts = {
  topic_dive: `
    You're conducting a structured Topic Deep Dive.
    Phase: {{phase}}
    Concepts to cover: {{concepts}}
    
    ASSESS phase: Ask what they already know
    TEACH phase: Fill gaps with atomic explanations
    PRACTICE phase: Ask retrieval questions
    SUMMARIZE phase: Consolidate key points
  `,
  
  doubt: `
    Student has a specific doubt. Before answering:
    1. Ask what they currently understand
    2. Identify the specific gap
    3. Fill ONLY that gap precisely
    4. Verify understanding with a quick question
  `,
  
  case: `
    You're presenting a clinical case.
    Reveal information progressively as student asks.
    Guide clinical reasoning — don't give away diagnosis.
    Ask: "What's your differential?" before revealing more.
  `,
  
  eli5: `
    Explain like the student is a complete beginner.
    Use:
    - Simple analogies from everyday life
    - Visual descriptions
    - No medical jargon (or explain it simply)
    - Stories and examples
  `,
  
  viva: `
    You're a medical examiner conducting oral examination.
    Style: {{examinerStyle}}
    
    - Start with basic questions, progress to harder
    - Follow up on answers — probe depth
    - If wrong, ask "Are you sure? Think again."
    - Note: {{difficulty}} difficulty level
    - At end, give constructive feedback
  `,
  
  teach_back: `
    Student will explain a concept to you.
    Listen carefully, then:
    1. Identify any gaps or misconceptions
    2. Ask clarifying questions
    3. Gently correct errors
    4. Praise what they got right
    5. Fill remaining gaps
    
    This is the most powerful learning mode — let them struggle.
  `
};
```

---

## UI Components

### Chat Interface

```
┌─────────────────────────────────────────────────┐
│ 🧠 ATOM Chat          [Topic: Pancreatitis] [⚙️] │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 👤 What causes acute pancreatitis?      │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 🤖 Before I explain, tell me — what do  │   │
│  │    you already know about the causes?   │   │
│  │    What's the most common cause you've  │   │
│  │    heard of?                            │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 👤 I think gallstones and alcohol?      │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 🤖 Exactly! You've got the top 2.       │   │
│  │    Together they cause ~80% of cases.   │   │
│  │                                         │   │
│  │    📝 Quick check:                      │   │
│  │    ┌─────────────────────────────────┐ │   │
│  │    │ Which mechanism causes          │ │   │
│  │    │ gallstone pancreatitis?         │ │   │
│  │    │ ○ Direct toxicity               │ │   │
│  │    │ ○ Duct obstruction              │ │   │
│  │    │ ○ Autoimmune                    │ │   │
│  │    │ ○ Ischemia                      │ │   │
│  │    └─────────────────────────────────┘ │   │
│  │                                         │   │
│  │    📚 Harrison's, Ch. 371, p. 2432     │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
├─────────────────────────────────────────────────┤
│ [Type your message...]              [📎] [🎤] [→]│
└─────────────────────────────────────────────────┘
```

### Mode Selector

```
┌─────────────────────────────────────────────────┐
│ Choose how you want to learn:                   │
├─────────────────────────────────────────────────┤
│ 💬 Free Chat         │ Ask anything             │
│ 📚 Topic Deep Dive   │ Master a topic           │
│ ❓ Solve a Doubt     │ Quick answer             │
│ 🏥 Case Discussion   │ Clinical reasoning       │
│ 🧒 Explain Simply    │ ELI5 mode                │
│ 🎤 Viva Practice     │ Oral exam prep           │
│ ⚡ Revision Sprint   │ Quick review             │
│ 🎓 Teach Me Back     │ You explain, I listen    │
└─────────────────────────────────────────────────┘
```

### Session Settings Panel

```
┌─────────────────────────────────────────────────┐
│ ⚙️ Session Settings                             │
├─────────────────────────────────────────────────┤
│ Difficulty:    [Adaptive ▼]                     │
│ Response:      [Detailed ▼]                     │
│ Include images: [✓]                             │
│ Ask me questions: [✓]                           │
│ Language:      [English ▼]                      │
├─────────────────────────────────────────────────┤
│ 📊 This Session                                 │
│ • Questions asked: 5                            │
│ • Correct: 3/5 (60%)                           │
│ • Concepts covered: 4                           │
│ • Time: 12 min                                  │
└─────────────────────────────────────────────────┘
```

---

## Interactive Canvas (Excalidraw Integration)

Inspired by Claude's Artifacts — a shared visual space where both student and ATOM can draw, annotate, and interact.

### Canvas Types

```typescript
type CanvasType = 
  | 'whiteboard'      // Free drawing
  | 'anatomy'         // Anatomical diagrams
  | 'flowchart'       // Algorithms, pathways
  | 'diagram'         // Concept maps
  | 'labeling'        // Label-the-diagram exercises
  | 'occlusion'       // Image occlusion creation
  | 'timeline'        // Disease progression
  | 'comparison';     // Side-by-side comparisons
```

### Canvas Data Model

```typescript
interface ChatCanvas {
  id: string;
  sessionId: string;
  messageId: string;          // Attached to which message
  
  type: CanvasType;
  title?: string;
  
  // Excalidraw data
  elements: ExcalidrawElement[];  // Shapes, text, arrows
  appState: ExcalidrawAppState;   // View state
  files?: Record<string, BinaryFile>;  // Embedded images
  
  // Collaboration
  createdBy: 'user' | 'atom';
  lastEditedBy: 'user' | 'atom';
  
  // For exercises
  isExercise: boolean;
  exerciseData?: {
    targetLabels?: { x: number; y: number; answer: string }[];
    completedLabels?: string[];
    score?: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}
```

### Canvas Interactions

```typescript
// User actions
interface CanvasUserAction {
  type: 'draw' | 'label' | 'annotate' | 'erase' | 'move';
  elements: ExcalidrawElement[];
  timestamp: Date;
}

// ATOM actions
interface CanvasATOMAction {
  type: 'draw' | 'correct' | 'highlight' | 'annotate' | 'grade';
  elements: ExcalidrawElement[];
  explanation?: string;       // Why this correction
  timestamp: Date;
}
```

### Use Cases

#### 1. Anatomy Labeling
```
ATOM: "Here's a diagram of the brachial plexus. 
       Label the 5 roots, 3 trunks, and 6 divisions."

[Canvas shows brachial plexus diagram with empty labels]

Student drags labels to correct positions.

ATOM: "3/6 divisions correct. The lateral cord 
       comes from... let me highlight it."
       
[ATOM highlights the correct path]
```

#### 2. Pathophysiology Flow
```
Student: "I don't understand DKA pathophysiology"

ATOM: "Let's build it together. Start with insulin deficiency.
       What happens next?"

[Empty flowchart canvas]

Student draws: Insulin ↓ → Glucose ↑

ATOM adds: "Good! Now what happens in the cells?"
[ATOM draws parallel branch: Cells starve → Lipolysis]
```

#### 3. Differential Diagnosis Web
```
ATOM: "Patient has chest pain. Let's map the differentials."

[Canvas with "Chest Pain" in center]

Student adds cardiac, pulmonary, GI causes

ATOM: "You're missing MSK causes. Let me add..."
[ATOM adds musculoskeletal branch with annotations]
```

#### 4. Surgical Anatomy
```
Student: "Show me the layers of abdominal wall"

ATOM creates layered diagram, then:
"Now you label them from superficial to deep"

[Student labels, ATOM provides instant feedback]
```

### API Routes

```typescript
// POST /api/chat/sessions/:sessionId/canvas
// Create new canvas
// Body: { type, title?, baseImage? }
// Returns: ChatCanvas

// GET /api/chat/sessions/:sessionId/canvas/:canvasId
// Get canvas data
// Returns: ChatCanvas with Excalidraw elements

// PATCH /api/chat/sessions/:sessionId/canvas/:canvasId
// Update canvas (user edit)
// Body: { elements, action }
// Returns: Updated ChatCanvas

// POST /api/chat/sessions/:sessionId/canvas/:canvasId/atom-action
// ATOM modifies canvas (correction, addition)
// Body: { action: CanvasATOMAction }
// Returns: { canvas: ChatCanvas, explanation: string }

// POST /api/chat/sessions/:sessionId/canvas/:canvasId/grade
// Grade labeling exercise
// Returns: { score, corrections: CanvasATOMAction[] }
```

### Database Schema

```sql
-- Chat Canvas
CREATE TABLE chat_canvas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  message_id UUID REFERENCES chat_messages(id),
  type TEXT NOT NULL,
  title TEXT,
  elements JSONB NOT NULL DEFAULT '[]',
  app_state JSONB DEFAULT '{}',
  files JSONB DEFAULT '{}',
  created_by TEXT NOT NULL CHECK (created_by IN ('user', 'atom')),
  last_edited_by TEXT CHECK (last_edited_by IN ('user', 'atom')),
  is_exercise BOOLEAN DEFAULT FALSE,
  exercise_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_canvas_session ON chat_canvas(session_id);
```

### Real-time Collaboration

Use WebSockets for live canvas updates:

```typescript
// WebSocket events
interface CanvasWSEvent {
  type: 'element_added' | 'element_updated' | 'element_deleted' | 
        'cursor_move' | 'atom_drawing' | 'grading';
  canvasId: string;
  payload: any;
  actor: 'user' | 'atom';
  timestamp: Date;
}

// Connection
const ws = new WebSocket(`wss://api/canvas/${canvasId}/live`);

// ATOM can "draw" in real-time while explaining
// Student sees ATOM's cursor/drawing as it happens
```

### UI Component

```
┌─────────────────────────────────────────────────────────┐
│ 🎨 Interactive Canvas: Brachial Plexus          [⤢] [×]│
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐│
│ │                                                     ││
│ │      [Excalidraw Canvas]                           ││
│ │                                                     ││
│ │   ┌──────┐                                         ││
│ │   │ C5   │──┐                                      ││
│ │   └──────┘  │                                      ││
│ │   ┌──────┐  ├──→ Upper Trunk                       ││
│ │   │ C6   │──┘         │                            ││
│ │   └──────┘            ├──→ [___] ← Drop label here ││
│ │   ┌──────┐            │                            ││
│ │   │ C7   │────────→ Middle Trunk                   ││
│ │   └──────┘                                         ││
│ │                                                     ││
│ └─────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────┤
│ [✏️ Draw] [📝 Text] [→ Arrow] [🏷️ Label] [🖼️ Image] [↩️]│
├─────────────────────────────────────────────────────────┤
│ Labels: [Lateral Cord] [Medial Cord] [Posterior Cord]  │
│         Drag to correct position                        │
├─────────────────────────────────────────────────────────┤
│ 🤖 ATOM: "Label the 3 cords. Hint: Think about their   │
│          position relative to the axillary artery."    │
│                                        [Check Answers] │
└─────────────────────────────────────────────────────────┘
```

### Library: Pre-built Diagrams

Store commonly used diagrams as templates:

```typescript
interface DiagramTemplate {
  id: string;
  name: string;
  category: 'anatomy' | 'physiology' | 'pathology' | 'pharmacology';
  topicId: string;
  elements: ExcalidrawElement[];
  labelPositions?: { x: number; y: number; answer: string }[];
  difficulty: 'easy' | 'medium' | 'hard';
}

// Examples:
// - Heart anatomy (chambers, valves, vessels)
// - Nephron structure
// - Brachial plexus
// - ECG interpretation
// - Drug mechanism flowcharts
```

---

## Integration Points

### With Exam Center
- ATOM can generate practice questions on the fly
- After teaching a concept, offer MCQ practice
- Link to relevant question banks

### With Library
- Cite textbook sources in responses
- "Read more" links to notes
- Suggest related reading

### With Analytics
- Feed all interactions to analytics
- Track concepts covered per session
- Monitor calibration across chats
- Identify consistently weak areas

### With Vyasa (RAG)
- Query textbook embeddings for accurate info
- Ground responses in source material
- Provide page references

---

## Streaming Response

```typescript
// Use Server-Sent Events for streaming
// POST /api/chat/sessions/:id/messages/stream

// Client receives:
data: {"type": "start", "messageId": "..."}
data: {"type": "chunk", "content": "Before I explain"}
data: {"type": "chunk", "content": ", tell me what"}
data: {"type": "chunk", "content": " you already know..."}
data: {"type": "citation", "textbook": "Harrison's", "chapter": "371"}
data: {"type": "question", "mcq": {...}}
data: {"type": "end", "conceptsCovered": ["acute_pancreatitis"]}
```

---

## Analytics Events

```typescript
// Events to track
const analyticsEvents = [
  'chat_session_started',
  'chat_session_completed',
  'chat_message_sent',
  'chat_question_answered',
  'chat_concept_covered',
  'chat_mode_switched',
  'chat_feedback_given',
  'chat_citation_clicked',
  'chat_question_embedded',
  'chat_note_linked',
];

// Metrics to compute
const metrics = [
  'avg_session_duration',
  'messages_per_session',
  'questions_answered_per_session',
  'accuracy_in_chat',
  'concepts_per_session',
  'mode_preference',
  'peak_usage_hours',
];
```

---

## Mobile Considerations

- Voice input support (Whisper transcription)
- Voice output option (TTS for responses)
- Offline mode: Queue messages, sync when online
- Push notifications for scheduled revision reminders
- Swipe gestures for quick actions

---

## Priority Implementation

### Phase 1 (MVP)
- Free Chat mode
- Basic message streaming
- Session persistence
- Simple ATOM prompt

### Phase 2
- Topic Deep Dive mode
- Embedded questions
- Textbook citations (Vyasa integration)
- Session analytics

### Phase 3
- Viva Practice mode
- Case Discussion mode
- Voice input/output
- Full analytics integration

### Phase 4
- Teach Me Back mode
- ELI5 mode
- Multi-language support
- Mobile optimizations

---

*Every conversation is a learning opportunity. ATOM never just answers — it teaches.* ⚛️
