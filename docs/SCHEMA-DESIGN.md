# NucleuX Academy — Data Schema Design

## Overview

Content organized by:
- **Subject** (horizontal) — Surgery, Medicine, Pediatrics, etc.
- **Depth** (vertical) — MBBS → PG → Super Specialty

---

## 1. Core Entities

### Subject
Top-level medical specialties.

```typescript
interface Subject {
  id: string;                    // e.g., "surgery", "medicine"
  name: string;                  // "Surgery"
  icon: string;                  // emoji or icon name
  color: string;                 // theme color
  description: string;
  topicCount: number;            // computed
  order: number;                 // display order
}
```

### Topic
Individual learning units within subjects.

```typescript
interface Topic {
  id: string;                    // UUID
  subjectId: string;             // FK to Subject
  name: string;                  // "Appendicitis"
  slug: string;                  // URL-friendly: "appendicitis"
  
  // Depth availability
  depth: {
    mbbs: boolean;               // Available for MBBS
    pg: boolean;                 // Available for PG
    superSpecialty: boolean;     // Available for SS
  };
  
  // Content references
  parentTopicId?: string;        // For sub-topics
  prerequisites?: string[];      // Topic IDs to complete first
  
  // Metadata
  tags: string[];                // ["acute abdomen", "emergency"]
  estimatedMinutes: number;      // Time to study
  difficulty: 1 | 2 | 3 | 4 | 5; // 1=basic, 5=advanced
  
  // Source references
  sources: SourceReference[];
  
  createdAt: Date;
  updatedAt: Date;
}

interface SourceReference {
  textbook: string;              // "Bailey & Love"
  edition: string;               // "28th"
  chapter: string;               // "Chapter 72"
  pages?: string;                // "1302-1315"
}
```

### Content
Actual learning content for each topic, varying by depth.

```typescript
interface Content {
  id: string;
  topicId: string;               // FK to Topic
  depth: 'mbbs' | 'pg' | 'superSpecialty';
  
  // Content sections
  sections: ContentSection[];
  
  // Quick reference
  keyPoints: string[];           // Bullet points
  mnemonics?: string[];          // Memory aids
  clinicalPearls?: string[];     // Clinical tips
  
  // Media
  diagrams?: MediaItem[];
  tables?: TableData[];
  flowcharts?: MediaItem[];
  
  // Metadata
  version: number;
  lastReviewedAt: Date;
  reviewedBy?: string;           // Faculty who reviewed
}

interface ContentSection {
  heading: string;
  content: string;               // Markdown
  depth: 'mbbs' | 'pg' | 'superSpecialty';  // Minimum depth to see
}

interface MediaItem {
  id: string;
  type: 'image' | 'diagram' | 'flowchart' | 'video';
  url: string;
  caption: string;
  source?: string;
}
```

---

## 2. Assessment Entities

### MCQ (Multiple Choice Question)

```typescript
interface MCQ {
  id: string;
  topicId: string;               // FK to Topic
  subjectId: string;             // FK to Subject (denormalized)
  
  // Question
  stem: string;                  // The question text (markdown)
  options: MCQOption[];          // 4-5 options
  correctOptionId: string;       // ID of correct option
  
  // Explanation
  explanation: string;           // Why the answer is correct
  keyConceptIds?: string[];      // Related concepts
  
  // Classification
  depth: 'mbbs' | 'pg' | 'superSpecialty';
  difficulty: 1 | 2 | 3 | 4 | 5;
  examType?: string[];           // ["NEET-PG", "INICET", "FMGE"]
  year?: number;                 // If from past exam
  
  // Source
  source?: {
    type: 'original' | 'adapted' | 'pastExam';
    reference?: string;          // "NEET-PG 2023"
  };
  
  // Media
  image?: MediaItem;             // Question image if any
  
  // Stats (computed)
  timesAttempted: number;
  correctRate: number;           // 0-1
  avgTimeSeconds: number;
  
  // Review
  status: 'draft' | 'reviewed' | 'published';
  reviewedBy?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

interface MCQOption {
  id: string;                    // "a", "b", "c", "d"
  text: string;
  isCorrect: boolean;
}
```

### Flashcard

```typescript
interface Flashcard {
  id: string;
  topicId: string;
  
  // Card content
  front: string;                 // Question/prompt (markdown)
  back: string;                  // Answer (markdown)
  
  // Media
  frontImage?: MediaItem;
  backImage?: MediaItem;
  
  // Classification
  depth: 'mbbs' | 'pg' | 'superSpecialty';
  type: 'fact' | 'concept' | 'clinical' | 'image';
  
  // Spaced repetition defaults
  defaultInterval: number;       // Days
  
  createdAt: Date;
}
```

---

## 3. User Progress Entities

### UserProgress
Tracks user's learning state per topic.

```typescript
interface UserProgress {
  userId: string;
  topicId: string;
  
  // Reading progress
  readingStatus: 'not_started' | 'in_progress' | 'completed';
  lastReadAt?: Date;
  readingTimeMinutes: number;
  completedSections: string[];   // Section IDs
  
  // Notes
  personalNotes?: string;
  bookmarked: boolean;
  
  // Performance
  mcqAttempts: number;
  mcqCorrect: number;
  avgMcqTime: number;            // seconds
  
  // Spaced repetition
  nextReviewAt?: Date;
  reviewInterval: number;        // Days
  easeFactor: number;            // SM-2 algorithm
  
  updatedAt: Date;
}
```

### MCQAttempt
Individual MCQ attempt record.

```typescript
interface MCQAttempt {
  id: string;
  userId: string;
  mcqId: string;
  
  // Attempt details
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  
  // Context
  context: 'practice' | 'quiz' | 'exam' | 'review';
  sessionId?: string;            // If part of a test session
  
  createdAt: Date;
}
```

### FlashcardReview
Spaced repetition review record.

```typescript
interface FlashcardReview {
  id: string;
  userId: string;
  flashcardId: string;
  
  // Review result
  rating: 1 | 2 | 3 | 4 | 5;     // 1=forgot, 5=perfect
  responseTimeMs: number;
  
  // SM-2 state after review
  newInterval: number;
  newEaseFactor: number;
  nextReviewAt: Date;
  
  createdAt: Date;
}
```

---

## 4. Study Session Entities

### StudySession
Groups activities into sessions.

```typescript
interface StudySession {
  id: string;
  userId: string;
  
  // Session type
  type: 'reading' | 'mcq_practice' | 'flashcard_review' | 'mixed';
  
  // Scope
  subjectId?: string;
  topicIds: string[];
  
  // Timing
  startedAt: Date;
  endedAt?: Date;
  durationMinutes: number;
  
  // Results
  mcqsAttempted?: number;
  mcqsCorrect?: number;
  flashcardsReviewed?: number;
  topicsCompleted?: number;
  
  // XP earned
  xpEarned: number;
}
```

### Pathway
Curated learning path through topics.

```typescript
interface Pathway {
  id: string;
  name: string;                  // "Surgical GI Mastery"
  description: string;
  
  // Target
  subjectId: string;
  depth: 'mbbs' | 'pg' | 'superSpecialty';
  
  // Structure
  modules: PathwayModule[];
  
  // Metadata
  totalTopics: number;
  estimatedHours: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  
  // Author
  createdBy: string;             // User or "system"
  isOfficial: boolean;
  
  createdAt: Date;
}

interface PathwayModule {
  id: string;
  name: string;
  topicIds: string[];
  order: number;
}
```

### UserPathway
User's enrollment in a pathway.

```typescript
interface UserPathway {
  userId: string;
  pathwayId: string;
  
  // Progress
  status: 'enrolled' | 'in_progress' | 'completed' | 'paused';
  completedTopicIds: string[];
  currentModuleIndex: number;
  currentTopicIndex: number;
  
  // Stats
  startedAt: Date;
  completedAt?: Date;
  totalTimeMinutes: number;
  
  updatedAt: Date;
}
```

---

## 5. Gamification

### Achievement

```typescript
interface Achievement {
  id: string;
  name: string;                  // "30 Day Streak"
  description: string;
  icon: string;
  color: string;
  
  // Criteria
  type: 'streak' | 'topics' | 'mcqs' | 'accuracy' | 'time' | 'special';
  threshold: number;
  
  // Reward
  xpReward: number;
  badgeUrl?: string;
}
```

### UserAchievement

```typescript
interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress: number;              // Current progress toward threshold
}
```

---

## 6. Depth-Based Content Strategy

### MBBS Level
- Core concepts and definitions
- Basic pathophysiology
- Common presentations
- Standard management protocols
- High-yield exam facts

### PG Level
- Everything in MBBS +
- Detailed pathophysiology
- Differential diagnosis deep-dives
- Evidence-based management
- Recent guidelines and updates
- Research implications

### Super Specialty Level
- Everything in PG +
- Cutting-edge techniques
- Complex case discussions
- Surgical nuances and tips
- Rare conditions
- Expert opinions and controversies

---

## 7. Subject Structure (Initial)

```
Subjects
├── Surgery
│   ├── General Surgery
│   ├── GI Surgery
│   ├── Hepatobiliary
│   ├── Breast & Endocrine
│   ├── Vascular
│   ├── Trauma
│   └── ...
├── Medicine
│   ├── Cardiology
│   ├── Pulmonology
│   ├── Gastroenterology
│   ├── Nephrology
│   └── ...
├── Pediatrics
├── OB-GYN
├── Orthopedics
├── Anatomy
├── Physiology
├── Biochemistry
├── Pathology
├── Pharmacology
├── Microbiology
└── ...
```

---

## Next Steps

1. Implement TypeScript types
2. Create database migrations (Supabase/PostgreSQL)
3. Build seed data for one subject (Surgery - GI)
4. Create API endpoints
5. Build Library UI consuming these schemas

---

*Schema v1.0 — 2026-02-08*
