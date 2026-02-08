# Exam Center — Full Specification

*Version 1.0 | 2026-02-08 | For Vishwakarma*

---

## Overview

The Exam Center is the testing and assessment hub of NucleuX Academy. It houses question banks, clinical scenarios, and practice exams — all interconnected with the knowledge graph.

**Philosophy:** Every question is a learning opportunity. Every wrong answer reveals a gap. Every concept connects to everything else.

---

## Core Entities

### 1. Topic
The highest-level organizational unit.

```typescript
interface Topic {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subjectId: string;          // e.g., "surgery", "medicine", "obg"
  parentTopicId?: string;     // For hierarchical topics
  competencyIds: string[];    // MCI/NMC competencies
  conceptIds: string[];       // Atomic concepts
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. Concept (Atomic Unit)
The smallest teachable unit — the "atom" of knowledge.

```typescript
interface Concept {
  id: string;
  name: string;
  slug: string;
  definition: string;         // One-liner definition
  explanation?: string;       // Detailed explanation (markdown)
  topicIds: string[];         // Can belong to multiple topics
  relatedConceptIds: string[]; // Knowledge graph edges
  tags: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
  highYield: boolean;         // Exam importance flag
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. Question
The universal question model — supports MCQ, flashcard, essay, case-based.

```typescript
interface Question {
  id: string;
  type: 'mcq' | 'flashcard' | 'essay' | 'case' | 'osce' | 'viva';
  
  // Content
  stem: string;               // The question text (markdown)
  stemImages?: string[];      // Images in question
  explanation: string;        // Post-answer explanation
  explanationImages?: string[];
  
  // For MCQs
  options?: {
    id: string;
    text: string;
    imageUrl?: string;
    isCorrect: boolean;
  }[];
  
  // For Flashcards
  front?: string;
  back?: string;
  
  // For Essays
  modelAnswer?: string;
  markingScheme?: string;
  
  // For Cases/OSCE/Viva
  scenario?: string;
  expectedFindings?: string[];
  criticalActions?: string[];
  
  // Metadata
  source: 'university' | 'neetpg' | 'inicet' | 'aiims' | 'generated' | 'custom';
  sourceYear?: number;
  sourceExam?: string;        // e.g., "AIIMS May 2024"
  
  // Connections
  topicIds: string[];
  conceptIds: string[];       // Atomic concepts tested
  competencyIds: string[];    // MCI competencies
  noteIds: string[];          // Linked notes/resources
  
  // Difficulty & Analytics
  difficulty: 'easy' | 'medium' | 'hard';
  avgTimeSeconds?: number;
  avgAccuracy?: number;       // 0-1, updated from attempts
  discriminationIndex?: number; // How well it separates good/weak students
  
  // Flags
  highYield: boolean;
  verified: boolean;
  active: boolean;
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
```

### 4. QuestionAttempt
Tracks every student attempt for analytics.

```typescript
interface QuestionAttempt {
  id: string;
  userId: string;
  questionId: string;
  
  // Response
  selectedOptionId?: string;  // For MCQ
  responseText?: string;      // For essay/short answer
  
  // Timing
  startedAt: Date;
  submittedAt: Date;
  timeSpentSeconds: number;
  
  // Result
  isCorrect: boolean;
  score?: number;             // For partial credit
  
  // Confidence calibration
  confidenceLevel: 1 | 2 | 3 | 4 | 5;  // Before answering
  
  // Context
  sessionType: 'practice' | 'mock' | 'timed' | 'review';
  examId?: string;            // If part of a mock exam
  
  // Learning
  markedForReview: boolean;
  userNotes?: string;
}
```

### 5. Exam (Mock Test)
A collection of questions simulating real exams.

```typescript
interface Exam {
  id: string;
  name: string;
  description?: string;
  
  // Structure
  type: 'full' | 'subject' | 'topic' | 'custom';
  examPattern: 'neetpg' | 'inicet' | 'university' | 'custom';
  
  // Questions
  questionIds: string[];
  totalQuestions: number;
  totalMarks: number;
  negativeMarking: boolean;
  negativeMarkValue?: number;  // e.g., 0.25 or 0.33
  
  // Timing
  durationMinutes: number;
  
  // Scheduling
  isScheduled: boolean;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  
  // Access
  isPublic: boolean;
  allowedUserIds?: string[];
  
  // Analytics
  attemptCount: number;
  avgScore?: number;
  topScore?: number;
  
  createdAt: Date;
  createdBy: string;
}
```

### 6. ExamAttempt
Student's attempt at a full exam.

```typescript
interface ExamAttempt {
  id: string;
  userId: string;
  examId: string;
  
  // Progress
  status: 'started' | 'in_progress' | 'submitted' | 'timed_out' | 'abandoned';
  startedAt: Date;
  submittedAt?: Date;
  
  // Results
  questionsAttempted: number;
  correctAnswers: number;
  wrongAnswers: number;
  skipped: number;
  
  score: number;
  percentile?: number;        // Compared to other attempts
  rank?: number;
  
  // Breakdown
  topicWiseScores: {
    topicId: string;
    attempted: number;
    correct: number;
    accuracy: number;
  }[];
  
  // Time analytics
  totalTimeMinutes: number;
  avgTimePerQuestion: number;
  
  // Calibration
  avgConfidence: number;
  calibrationScore: number;   // confidence vs accuracy correlation
}
```

### 7. ClinicalScenario (OSCE/Viva/Mock Patient)

```typescript
interface ClinicalScenario {
  id: string;
  type: 'osce' | 'viva' | 'mock_patient' | 'bedside';
  
  // Scenario
  title: string;
  patientBrief: string;       // What student sees initially
  fullHistory?: string;       // Revealed on request
  examination?: string;       // Findings
  investigations?: string;    // Reports
  
  // Tasks
  tasks: {
    id: string;
    description: string;
    maxMarks: number;
    criticalFail?: boolean;   // Must complete to pass
  }[];
  
  // Expected
  expectedDiagnosis?: string[];
  differentialDiagnoses?: string[];
  keyFindings: string[];
  criticalActions: string[];  // Must not miss
  
  // Rubric
  totalMarks: number;
  passingMarks: number;
  timeMinutes: number;
  
  // Connections
  topicIds: string[];
  conceptIds: string[];
  competencyIds: string[];
  
  // Media
  images?: string[];
  videos?: string[];
  audioClips?: string[];      // Heart sounds, lung sounds, etc.
  
  createdAt: Date;
  createdBy: string;
}
```

---

## Database Schema (Supabase)

```sql
-- Topics
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  subject_id TEXT NOT NULL,
  parent_topic_id UUID REFERENCES topics(id),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Concepts
CREATE TABLE concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  definition TEXT NOT NULL,
  explanation TEXT,
  difficulty TEXT CHECK (difficulty IN ('basic', 'intermediate', 'advanced')),
  high_yield BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Topic-Concept junction
CREATE TABLE topic_concepts (
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  concept_id UUID REFERENCES concepts(id) ON DELETE CASCADE,
  PRIMARY KEY (topic_id, concept_id)
);

-- Concept-Concept relations (knowledge graph)
CREATE TABLE concept_relations (
  from_concept_id UUID REFERENCES concepts(id) ON DELETE CASCADE,
  to_concept_id UUID REFERENCES concepts(id) ON DELETE CASCADE,
  relation_type TEXT DEFAULT 'related', -- 'prerequisite', 'related', 'builds_on'
  PRIMARY KEY (from_concept_id, to_concept_id)
);

-- Questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('mcq', 'flashcard', 'essay', 'case', 'osce', 'viva')),
  stem TEXT NOT NULL,
  stem_images TEXT[],
  explanation TEXT,
  explanation_images TEXT[],
  options JSONB, -- For MCQs: [{id, text, imageUrl, isCorrect}]
  front TEXT, -- For flashcards
  back TEXT,
  model_answer TEXT, -- For essays
  marking_scheme TEXT,
  scenario TEXT, -- For cases
  expected_findings TEXT[],
  critical_actions TEXT[],
  source TEXT CHECK (source IN ('university', 'neetpg', 'inicet', 'aiims', 'generated', 'custom')),
  source_year INTEGER,
  source_exam TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  avg_time_seconds INTEGER,
  avg_accuracy FLOAT,
  discrimination_index FLOAT,
  high_yield BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Question-Topic junction
CREATE TABLE question_topics (
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  PRIMARY KEY (question_id, topic_id)
);

-- Question-Concept junction
CREATE TABLE question_concepts (
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  concept_id UUID REFERENCES concepts(id) ON DELETE CASCADE,
  PRIMARY KEY (question_id, concept_id)
);

-- Question Attempts
CREATE TABLE question_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  selected_option_id TEXT,
  response_text TEXT,
  started_at TIMESTAMPTZ NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL,
  time_spent_seconds INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  score FLOAT,
  confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 5),
  session_type TEXT CHECK (session_type IN ('practice', 'mock', 'timed', 'review')),
  exam_id UUID REFERENCES exams(id),
  marked_for_review BOOLEAN DEFAULT FALSE,
  user_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exams
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('full', 'subject', 'topic', 'custom')),
  exam_pattern TEXT CHECK (exam_pattern IN ('neetpg', 'inicet', 'university', 'custom')),
  question_ids UUID[],
  total_questions INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  negative_marking BOOLEAN DEFAULT FALSE,
  negative_mark_value FLOAT,
  duration_minutes INTEGER NOT NULL,
  is_scheduled BOOLEAN DEFAULT FALSE,
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  is_public BOOLEAN DEFAULT TRUE,
  allowed_user_ids UUID[],
  attempt_count INTEGER DEFAULT 0,
  avg_score FLOAT,
  top_score FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Exam Attempts
CREATE TABLE exam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('started', 'in_progress', 'submitted', 'timed_out', 'abandoned')),
  started_at TIMESTAMPTZ NOT NULL,
  submitted_at TIMESTAMPTZ,
  questions_attempted INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  wrong_answers INTEGER DEFAULT 0,
  skipped INTEGER DEFAULT 0,
  score FLOAT,
  percentile FLOAT,
  rank INTEGER,
  topic_wise_scores JSONB,
  total_time_minutes INTEGER,
  avg_time_per_question FLOAT,
  avg_confidence FLOAT,
  calibration_score FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clinical Scenarios
CREATE TABLE clinical_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('osce', 'viva', 'mock_patient', 'bedside')),
  title TEXT NOT NULL,
  patient_brief TEXT NOT NULL,
  full_history TEXT,
  examination TEXT,
  investigations TEXT,
  tasks JSONB, -- [{id, description, maxMarks, criticalFail}]
  expected_diagnosis TEXT[],
  differential_diagnoses TEXT[],
  key_findings TEXT[],
  critical_actions TEXT[],
  total_marks INTEGER NOT NULL,
  passing_marks INTEGER NOT NULL,
  time_minutes INTEGER NOT NULL,
  images TEXT[],
  videos TEXT[],
  audio_clips TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Indexes for performance
CREATE INDEX idx_questions_type ON questions(type);
CREATE INDEX idx_questions_source ON questions(source);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_high_yield ON questions(high_yield) WHERE high_yield = TRUE;
CREATE INDEX idx_question_attempts_user ON question_attempts(user_id);
CREATE INDEX idx_question_attempts_question ON question_attempts(question_id);
CREATE INDEX idx_exam_attempts_user ON exam_attempts(user_id);
CREATE INDEX idx_exam_attempts_exam ON exam_attempts(exam_id);

-- RLS Policies
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_attempts ENABLE ROW LEVEL SECURITY;

-- Users can read all active questions
CREATE POLICY "Questions are viewable by authenticated users"
  ON questions FOR SELECT
  TO authenticated
  USING (active = TRUE);

-- Users can only see their own attempts
CREATE POLICY "Users can view own attempts"
  ON question_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own attempts
CREATE POLICY "Users can create own attempts"
  ON question_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

---

## API Routes

### Questions

```typescript
// GET /api/questions
// Query params: topicId, conceptId, type, source, difficulty, highYield, limit, offset
// Returns: { questions: Question[], total: number, hasMore: boolean }

// GET /api/questions/:id
// Returns: Question with full details

// POST /api/questions/:id/attempt
// Body: { selectedOptionId?, responseText?, confidenceLevel, timeSpentSeconds }
// Returns: { isCorrect, explanation, conceptsToReview: Concept[] }

// GET /api/questions/generate
// Query: { topicId, conceptIds[], difficulty, count }
// Returns: Dynamically generated questions from ATOM
```

### Exams

```typescript
// GET /api/exams
// Query: { type, pattern, isPublic }
// Returns: { exams: Exam[] }

// GET /api/exams/:id
// Returns: Exam with questions (if started)

// POST /api/exams/:id/start
// Returns: { attemptId, questions: Question[], endTime }

// POST /api/exams/:id/submit
// Body: { attemptId, answers: { questionId, selectedOptionId, confidenceLevel }[] }
// Returns: ExamAttempt with full analysis

// GET /api/exams/:id/leaderboard
// Returns: Top performers
```

### Clinical Scenarios

```typescript
// GET /api/clinical-scenarios
// Query: { type, topicId }
// Returns: { scenarios: ClinicalScenario[] }

// POST /api/clinical-scenarios/:id/start
// Returns: { sessionId, patientBrief, tasks }

// POST /api/clinical-scenarios/:id/action
// Body: { sessionId, action: 'history' | 'examine' | 'investigate' | 'diagnose' | 'treat' }
// Returns: Revealed information based on action

// POST /api/clinical-scenarios/:id/complete
// Body: { sessionId, diagnosis, actions: string[] }
// Returns: Score, feedback, missed findings
```

### Analytics

```typescript
// GET /api/analytics/topic-performance
// Returns: { topicId, attempted, correct, accuracy, avgConfidence, calibration }[]

// GET /api/analytics/weak-areas
// Returns: { conceptId, accuracy, lastAttempted, suggestedQuestions }[]

// GET /api/analytics/calibration
// Returns: { overallCalibration, confidenceVsAccuracy: { confidence, accuracy }[] }

// GET /api/analytics/progress
// Query: { period: 'week' | 'month' | 'all' }
// Returns: { date, questionsAttempted, accuracy, timeSpent }[]
```

---

## ATOM Integration

### Question Generation

```typescript
// When user requests practice on a topic:
// 1. Fetch topic's concepts
// 2. Check user's weak concepts (from analytics)
// 3. Call ATOM to generate questions targeting weak areas

const generateQuestions = async (userId: string, topicId: string, count: number) => {
  const weakConcepts = await getWeakConcepts(userId, topicId);
  
  const prompt = `
    Generate ${count} MCQs for medical student testing these concepts:
    ${weakConcepts.map(c => c.name).join(', ')}
    
    Topic: ${topic.name}
    Difficulty: Match student's current level (${currentLevel})
    
    Format: JSON with stem, options (4), explanation, conceptsTested
    Include clinical vignettes where appropriate.
  `;
  
  return await atom.generate(prompt);
};
```

### Viva Practice

```typescript
// ATOM acts as examiner for viva practice
const startViva = async (scenarioId: string) => {
  const scenario = await getScenario(scenarioId);
  
  return {
    systemPrompt: `
      You are a medical examiner conducting a viva voce.
      Scenario: ${scenario.patientBrief}
      
      Start with: "A ${scenario.patientBrief}. Take a history."
      
      Progressively reveal information as student asks.
      Gently correct misconceptions.
      Assess: History taking, clinical reasoning, differential diagnosis.
      
      Key findings to elicit: ${scenario.keyFindings.join(', ')}
      Critical actions: ${scenario.criticalActions.join(', ')}
    `,
    sessionId: generateSessionId()
  };
};
```

---

## User Flows

### 1. Quick Practice
```
Dashboard → Exam Center → Select Topic → 
  → "Quick 10" / "Full Topic" / "Weak Areas Only"
  → Answer questions with confidence rating
  → See explanation + linked concepts
  → Summary with calibration score
```

### 2. Mock Exam
```
Exam Center → Mock Tests → Select Pattern (NEET-PG/INI-CET)
  → Start Exam (timer begins)
  → Navigate questions, flag for review
  → Submit → Instant results
  → Detailed analysis: Topic-wise, Time-wise, Calibration
  → Leaderboard position
```

### 3. OSCE Practice
```
Exam Center → Clinical Practice → OSCE
  → Select station type (History/Examination/Procedure)
  → Read patient brief
  → Interact (take history, examine, order tests)
  → Make diagnosis
  → Get score + feedback on missed findings
```

### 4. Viva Practice (with ATOM)
```
Exam Center → Clinical Practice → Viva
  → Select topic/case type
  → ATOM presents case
  → Student responds (voice or text)
  → ATOM asks follow-up questions
  → Session ends with feedback
```

---

## Analytics Dashboard Integration

The Exam Center feeds directly into the Analytics room:

1. **Calibration Chart** — Confidence vs Accuracy scatter plot
2. **Topic Heatmap** — Strong (green) → Weak (red) topics
3. **Forgetting Curve** — When concepts need review
4. **Time Analysis** — Avg time per question, rushed vs overthinking
5. **Error Patterns** — Conceptual vs Factual vs Application errors

---

## Seed Data Required

1. **Topics & Concepts**
   - Extract from NEET-PG syllabus
   - Map to MCI competencies
   - Build concept relationships

2. **Question Banks**
   - Previous NEET-PG (2015-2025)
   - Previous INI-CET
   - University questions (if available)
   - High-yield collections

3. **Clinical Scenarios**
   - Common OSCE stations
   - Viva topics
   - Case-based discussions

---

## Priority Implementation Order

1. **Phase 1 (MVP):**
   - Questions table + MCQ type
   - Question attempts + basic analytics
   - Topic-based practice mode

2. **Phase 2:**
   - Exams + Mock tests
   - Leaderboard
   - Detailed analytics

3. **Phase 3:**
   - Clinical scenarios (OSCE/Viva)
   - ATOM integration for generation
   - Voice-based viva

---

*Built with atomic precision. Every question teaches.* ⚛️
