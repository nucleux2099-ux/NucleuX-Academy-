# NucleuX Academy - Data Models

## 1. Database Schema (Supabase / PostgreSQL)

### Entity Relationship Overview

```
auth.users
  └── profiles (1:1, auto-created via trigger)
        ├── user_preferences (1:1)
        ├── streaks (1:1)
        ├── user_xp (1:1)
        ├── user_atom_progress (1:many → atoms)
        ├── user_library_state (1:many → topics)
        ├── user_lecture_progress (1:many → lectures)
        ├── study_sessions (1:many)
        ├── daily_stats (1:many, unique per date)
        ├── mcq_attempts (1:many → mcqs)
        ├── user_notes (1:many)
        ├── user_pathways (1:many → pathways)
        ├── competency_progress (1:many → competencies)
        ├── user_quests (1:many → quests)
        ├── kolb_reflections (1:many)
        ├── habit_logs (1:many, unique per date)
        ├── discussions (1:many)
        ├── comments (1:many → discussions)
        ├── atom_interactions (1:many)
        ├── atom_recommendations (1:many → atoms)
        └── analytics_events (1:many)

subjects → subspecialties (1:many) → topics (1:many) → user_library_state (1:many)

atoms → atom_citations (1:many)
     → atom_connections (many:many via from/to)
     → user_atom_progress (1:many)
     → mcqs (many:1)
     → pathway_topics (1:many)

mcqs → mcq_options (1:many) → mcq_attempts (1:many)

pathways → pathway_topics (1:many → atoms) → user_pathways

lectures → user_lecture_progress (1:many)

competencies → competency_progress (1:many per user)

quests → user_quests (1:many per user)
```

---

### Migration 001 - Core Schema

#### `profiles`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | FK → `auth.users(id)` ON DELETE CASCADE |
| `username` | TEXT UNIQUE | |
| `full_name` | TEXT | |
| `avatar_url` | TEXT | |
| `specialty` | TEXT | |
| `level` | TEXT | Default: `'student'` |
| `institution` | TEXT | |
| `target_exam` | TEXT | |
| `target_date` | DATE | |
| `timezone` | TEXT | Default: `'Asia/Kolkata'` |
| `plan` | TEXT | Default: `'free'` |
| `onboarding_completed` | BOOLEAN | Default: `false` |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | Auto-updated via trigger |

**RLS:** Public SELECT (all rows visible), users can UPDATE/INSERT own row.
**Trigger:** `handle_new_user()` auto-creates profile + preferences + streak on `auth.users` INSERT.

#### `user_preferences`
| Column | Type | Default |
|---|---|---|
| `user_id` | UUID PK | FK → `profiles(id)` ON DELETE CASCADE |
| `daily_goal_minutes` | INT | 60 |
| `mcq_daily_target` | INT | 20 |
| `preferred_study_time` | TEXT | `'evening'` |
| `notification_email` | BOOLEAN | true |
| `notification_telegram` | BOOLEAN | true |
| `telegram_chat_id` | TEXT | |
| `theme` | TEXT | `'dark'` |
| `atom_proactive` | BOOLEAN | true |

#### `streaks`
| Column | Type | Default |
|---|---|---|
| `id` | UUID PK | |
| `user_id` | UUID UNIQUE | FK → `profiles(id)` |
| `current_streak` | INT | 0 |
| `longest_streak` | INT | 0 |
| `last_study_date` | DATE | |
| `streak_started_at` | DATE | |

#### `atoms` (Core knowledge units)
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `title` | TEXT | |
| `slug` | TEXT UNIQUE | |
| `type` | TEXT | |
| `content` | JSONB | Full content in JSON |
| `summary` | TEXT | |
| `specialty` | TEXT | Indexed |
| `system` | TEXT | |
| `topic` | TEXT | Indexed |
| `subtopic` | TEXT | |
| `tags` | TEXT[] | GIN indexed |
| `source_type`, `source_textbook`, `source_edition`, `source_chapter`, `source_page` | TEXT | Source references |
| `difficulty` | INT | Default: 2 |
| `read_time_minutes` | INT | |
| `is_premium` | BOOLEAN | Default: false |
| `is_published` | BOOLEAN | Default: true |
| `view_count` | INT | Default: 0 |
| `author_id` | UUID | FK → `profiles(id)` |

#### `atom_citations`
| Column | Type |
|---|---|
| `id` | UUID PK |
| `atom_id` | UUID FK → `atoms(id)` ON DELETE CASCADE |
| `textbook`, `edition`, `chapter`, `section` | TEXT |
| `page_start`, `page_end` | INT |
| `quote` | TEXT |

#### `atom_connections` (Knowledge graph edges)
| Column | Type |
|---|---|
| `id` | UUID PK |
| `from_atom_id` | UUID FK → `atoms(id)` |
| `to_atom_id` | UUID FK → `atoms(id)` |
| `relationship` | TEXT |
| `strength` | INT (default: 5) |

UNIQUE(`from_atom_id`, `to_atom_id`)

#### `user_atom_progress`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `user_id` | UUID | FK → `profiles(id)` |
| `atom_id` | UUID | FK → `atoms(id)` |
| `status` | TEXT | Default: `'not_started'` |
| `progress_percent` | INT | Default: 0 |
| `time_spent_seconds` | INT | Accumulated |
| `completed_at` | TIMESTAMPTZ | Set on first completion |
| `rating` | INT | |
| `is_saved` | BOOLEAN | |
| `notes` | TEXT | |

UNIQUE(`user_id`, `atom_id`)

#### `study_sessions`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `user_id` | UUID FK | |
| `started_at` | TIMESTAMPTZ | |
| `ended_at` | TIMESTAMPTZ | |
| `duration_minutes` | INT | |
| `atoms_studied` | UUID[] | |
| `mcqs_attempted` | INT | Default: 0 |
| `mcqs_correct` | INT | Default: 0 |
| `session_type` | TEXT | Added in migration 005 |
| `subject` | TEXT | Added in migration 005 |
| `source` | TEXT | Default: `'web'` |

#### `daily_stats`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `user_id` | UUID FK | |
| `date` | DATE | |
| `study_minutes` | INT | Default: 0 |
| `atoms_completed` | INT | Default: 0 |
| `mcqs_attempted` | INT | Default: 0 |
| `mcqs_correct` | INT | Default: 0 |
| `streak_day` | INT | |

UNIQUE(`user_id`, `date`)

#### `mcqs`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `question` | TEXT | |
| `question_type` | TEXT | Default: `'single'` |
| `stem` | TEXT | |
| `specialty`, `topic`, `subtopic` | TEXT | Indexed |
| `tags` | TEXT[] | |
| `difficulty` | INT | Default: 2 |
| `source`, `source_exam` | TEXT | |
| `atom_id` | UUID FK → `atoms(id)` | |
| `is_published` | BOOLEAN | Default: true |

#### `mcq_options`
| Column | Type |
|---|---|
| `id` | UUID PK |
| `mcq_id` | UUID FK → `mcqs(id)` ON DELETE CASCADE |
| `option_text` | TEXT |
| `option_order` | INT |
| `is_correct` | BOOLEAN |
| `explanation` | TEXT |

#### `mcq_attempts`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `user_id` | UUID FK | |
| `mcq_id` | UUID FK | |
| `selected_options` | UUID[] | |
| `is_correct` | BOOLEAN | |
| `time_taken_seconds` | INT | |
| `confidence` | INT | |
| `session_id` | UUID FK → `study_sessions(id)` | |
| `subject` | TEXT | Added migration 005 |
| `subspecialty` | TEXT | Added migration 005 |
| `blooms_taxonomy` | TEXT | Added migration 005 |

#### `pathways`
| Column | Type |
|---|---|
| `id` | UUID PK |
| `title` | TEXT |
| `slug` | TEXT UNIQUE |
| `specialty`, `target_exam` | TEXT |
| `difficulty` | INT (default: 2) |
| `estimated_hours` | INT |
| `is_official` | BOOLEAN (default: true) |

#### `user_notes`
| Column | Type |
|---|---|
| `id` | UUID PK |
| `user_id` | UUID FK |
| `title` | TEXT |
| `content` | JSONB |
| `atom_id` | UUID FK (optional) |
| `mcq_id` | UUID FK (optional) |
| `folder` | TEXT (default: `'inbox'`) |
| `is_pinned` | BOOLEAN |
| `color` | TEXT |

---

### Migration 004a - Analytics Events

#### `analytics_events`
| Column | Type |
|---|---|
| `id` | UUID PK |
| `user_id` | UUID FK → `profiles(id)` ON DELETE CASCADE |
| `event_name` | TEXT |
| `event_data` | JSONB (default: `'{}'`) |
| `created_at` | TIMESTAMPTZ |

Indexes: `(user_id, created_at DESC)`, `(event_name, created_at DESC)`

---

### Migration 004b - Competency Progress

#### `competencies` (NMC CBME master list)
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `code` | TEXT UNIQUE | e.g., "AN1.1", "PY2.3" |
| `subject` | TEXT | |
| `phase` | TEXT | Phase-1 through Phase-3B |
| `description` | TEXT | |
| `type` | CHAR(1) | K=Knowledge, S=Skill, A=Attitude, C=Communication |
| `level` | TEXT | "Must Know", "Should Know", "Nice to Know" |
| `domain` | TEXT | "Cognitive", "Psychomotor", "Affective" |
| `is_core` | BOOLEAN | Default: true |
| `xp_reward` | INT | Default: 10 |
| `linked_topics` | TEXT[] | Topic slugs |

#### `competency_progress`
UNIQUE(`user_id`, `competency_code`)
Status: `not_started | in_progress | completed | mastered`

#### `user_xp`
| Column | Type | Notes |
|---|---|---|
| `user_id` | UUID UNIQUE FK | |
| `total_xp` | INT | Default: 0 |
| `level` | INT | Default: 1 |
| `level_name` | TEXT | Default: `'Fresher'` |

Level thresholds: Fresher(0-500) → Learner(501-1500) → Student(1501-3500) → Scholar(3501-7000) → Expert(7001-15000) → Master(15001-30000) → Specialist(30001-50000) → Consultant(50001+)

Auto-updated via `update_user_level()` trigger.

---

### Migration 005 - Backstage / Gamification

#### `quests`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `title` | TEXT | |
| `description` | TEXT | |
| `target_value` | INT | |
| `reward_coins` | INT | Default: 0 |
| `reward_xp` | INT | Default: 0 |
| `frequency` | TEXT | `'daily' | 'weekly' | 'milestone'` |
| `event_type` | TEXT | e.g., `'mcqs_solved'`, `'hours_studied'` |
| `subject_filter` | TEXT | |
| `is_active` | BOOLEAN | Default: true |

#### `user_quests`
UNIQUE(`user_id`, `quest_id`, `expires_at`)

---

### Migration 006 - Bear Hunter System

#### `kolb_reflections` (Kolb's Learning Cycle)
| Column | Type |
|---|---|
| `id` | UUID PK |
| `user_id` | UUID FK |
| `subject_key` | TEXT |
| `experience` | TEXT |
| `reflection` | TEXT |
| `abstraction` | TEXT |
| `experiment` | TEXT |
| `status` | TEXT (`draft | completed | archived`) |

#### `habit_logs` (BEDS-M Framework)
| Column | Type |
|---|---|
| `id` | UUID PK |
| `user_id` | UUID FK |
| `date` | DATE |
| `breaks_adherence` | BOOLEAN |
| `environment_rating` | INT (1-5) |
| `deep_sleep_hours` | NUMERIC(4,2) |
| `intentions_set` | BOOLEAN |
| `mindfulness_notes` | TEXT |
| `rating` | INT (1-5) |

UNIQUE(`user_id`, `date`)

---

### Migration 007 - Library Schema

#### `subjects`
| Column | Type |
|---|---|
| `id` | UUID PK |
| `name` | TEXT |
| `slug` | TEXT UNIQUE |
| `icon`, `color_hex` | TEXT |
| `is_ug`, `is_pg`, `is_ss` | BOOLEAN |
| `sort_order` | INT |

#### `subspecialties`
| Column | Type |
|---|---|
| `id` | UUID PK |
| `subject_id` | UUID FK → `subjects(id)` ON DELETE CASCADE |
| `name`, `slug` | TEXT |
| UNIQUE(`subject_id`, `slug`) | |

#### `topics`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `subspecialty_id` | UUID FK | ON DELETE CASCADE |
| `name` | TEXT | |
| `slug` | TEXT UNIQUE | |
| `difficulty_level` | INT (1-5) | Default: 2 |
| `is_high_yield` | BOOLEAN | Default: false |
| `estimated_minutes` | INT | Default: 15 |
| `content_payload` | JSONB | Full content in JSON |
| `metadata` | JSONB | |

---

### Migration 008 - Classroom Schema

#### `lectures`
| Column | Type |
|---|---|
| `id` | UUID PK |
| `title` | VARCHAR(255) |
| `instructor` | VARCHAR(255) |
| `duration_string` | VARCHAR(50) |
| `subject` | VARCHAR(255) |
| `video_url`, `thumbnail_url` | VARCHAR(1024) |
| `sort_order` | INTEGER |

**RLS:** Public read.

#### `user_lecture_progress`
| Column | Type |
|---|---|
| `id` | UUID PK |
| `user_id` | UUID FK → `auth.users(id)` |
| `lecture_id` | UUID FK → `lectures(id)` |
| `progress_percent` | INTEGER (0-100) |
| `is_current` | BOOLEAN |
| `last_watched_at` | TIMESTAMPTZ |

UNIQUE(`user_id`, `lecture_id`)

---

## 2. Key TypeScript Types

### Content Types (`src/lib/types/content.ts`)

```typescript
type Depth = "mbbs" | "pg" | "superSpecialty";

interface Subject {
  id: string; name: string; slug: string;
  icon: string; color: string; description: string;
  subspecialties?: Subspecialty[];
}

interface Topic {
  id: string; title: string; slug: string;
  content: string; summary: string;
  tags: string[]; difficulty: 1 | 2 | 3 | 4 | 5;
  readTimeMinutes: number;
}

interface MCQ {
  id: string; question: string; stem?: string;
  options: { id: string; text: string; isCorrect: boolean; explanation: string; }[];
  specialty: string; topic: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
}
```

### Library Types (`src/lib/types/library.ts`)

```typescript
type ViewMode = "explorer" | "examPrep" | "textbook" | "quiz" | "cases" | "roadmap";

interface LibraryTopic {
  id: string; subjectId: string; subspecialtyId: string;
  name: string; slug: string; description?: string;
  content: {
    concept: string;           // Explorer mode markdown
    keyPoints?: string[];
    examPrep?: { summary?, mnemonics?, highYield?, commonMCQs?, clinicalPearls? };
    retrievalCards?: RetrievalCard[];
    cases?: CaseScenario[];
    roadmapJson?: TopicRoadmap[];
  };
  difficulty?: 1-5; highYield?: boolean;
  estimatedMinutes?: number; nmcCodes?: NmcCode[];
}

interface UserLearningState {
  level: 'ug' | 'pg' | 'resident' | 'practitioner';
  topicsCompleted: string[]; topicsInProgress: string[];
  cardScores: Record<string, { attempts, correctRate, lastAttempt }>;
  weakAreas: string[];
  preferredMode: ViewMode; dailyGoalMinutes: number;
}
```

### User Types (`src/lib/types/user.ts`)

```typescript
type UserLevel = "ug" | "pg" | "resident" | "practitioner";
type ExamTarget = "neet_pg" | "inicet" | "usmle_step1" | "usmle_step2" | "mrcs" | "fmge" | "neet_ss";

interface UserProfile {
  id: string; email: string; name: string;
  level: UserLevel; examTarget?: ExamTarget;
  preferences: { dailyGoalMinutes: number; preferredMode: ViewMode; };
  topicsCompleted: string[]; topicsInProgress: string[];
  streak: { current: number; longest: number; lastDate: string; };
  weakAreas: WeakArea[];
}
```

### CBME Types (`src/lib/data/cbme-types.ts`)

```typescript
type CBMEYear = 1 | 2 | 3 | 4;
type CBMEAssessmentTag = "theory" | "practical" | "viva";
type CBMESubject = "anatomy" | "physiology" | "biochemistry" | "community-medicine" |
  "forensic" | "pathology" | "pharmacology" | "microbiology" | "medicine" |
  "surgery" | "obgyn" | "pediatrics" | "orthopedics" | "ophthalmology" |
  "ent" | "dermatology" | "psychiatry" | "anesthesia" | "radiology";

interface CBMEBlock {
  id: string; year: CBMEYear; subject: CBMESubject;
  title: string; order: number;
  tags: CBMEAssessmentTag[];
  links?: {
    libraryPath?: string; examCentrePath?: string;
    arenaPath?: string; flashcardsDeckId?: string;
  };
}
```

### Backstage Types (`src/lib/backstage/types.ts`)

```typescript
type BackstageEventType = 'reading' | 'mcq' | 'case' | 'reflection' | 'note' |
  'deck_view' | 'slide_view' | 'template_insert' | 'prestudy' | 'aim' |
  'shoot' | 'skin' | 'practice_block' | 'marginal_gain' | 'reverse_plan' | 'mindmap';

type Bloom = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';

type CompetencyStage = 'unconsciously_incompetent' | 'consciously_incompetent' |
  'consciously_competent' | 'unconsciously_competent';

interface BackstageEvent {
  id: string; createdAt: string; type: BackstageEventType;
  subject: SubjectKey;
  topicId?: string; cbmeBlockId?: string;
  confidence?: number; bloom?: Bloom;
  mcq?: { correct?, difficulty?, errorType? };
  note?: string;
}
```

### Analytics Types (`src/lib/analytics/types.ts`)

```typescript
interface MCQAttempt {
  id: string; questionId: string; topicId: string;
  selectedAnswer: string; correctAnswer: string;
  isCorrect: boolean;
  confidence: 'guessing' | 'unsure' | 'sure' | 'very-sure';
  difficulty: number; timeSpent: number; timestamp: string;
}

interface TopicMemory {
  topicId: string; topicName: string;
  firstLearned: string; lastReviewed: string;
  reviewCount: number;
  initialStrength: number; currentStrength: number;
  optimalReviewDays: number;  // Ebbinghaus forgetting curve
}
```

### Simulator Types (`src/lib/types/simulator.ts`)

```typescript
interface CaseData {
  id: string; title: string; subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  patient: { age, gender, occupation?, setting };
  presentation: { chiefComplaint, scenario, vitals, generalAppearance };
  history: HistoryQuestion[];
  examination: ExaminationFinding[];
  investigations: Investigation[];
  diagnosis: { primary: DiagnosisOption, differentials: DiagnosisOption[] };
  management: ManagementOption[];
  scoring: { maxHistoryPoints, maxExamPoints, ..., passingScore, excellentScore };
}
```

### Speech Types (`src/lib/speech/sarvam.ts`)

```typescript
type SarvamLanguageCode = 'en-IN' | 'te-IN' | 'hi-IN' | 'unknown';
type SarvamSttMode = 'transcribe' | 'translate' | 'verbatim' | 'translit' | 'codemix';
```

---

## 3. Filesystem Content Format

### Topic Folder Structure
```
content/{subject}/{subspecialty}/{topic-slug}/
  _meta.yaml           # Metadata
  explorer.md          # Full concept (Explorer view)
  exam-prep.md         # High-yield summary (Exam Prep view)
  textbook.md          # Chapter-level (Textbook view)
  retrieval-cards.json # Flashcard Q&A pairs (Quiz view)
  roadmap-ug.json      # UG learning roadmap
  roadmap-pg.json      # PG learning roadmap
  roadmap-ss.json      # SS learning roadmap
```

### `_meta.yaml` Schema
```yaml
topic_id: string
slug: string
name: string
description: string
high_yield: boolean
difficulty: 1-5
estimated_minutes: number
prerequisites: string[]
related_topics: string[]
exam_tags: string[]
tags: string[]
sources: string[]
nmc_codes: { code, domain, core, phase }[]
```

### `_index.yaml` (Subspecialty level)
```yaml
id: string
title: string
subject: string
subspecialty: string
description: string
stats: { topics, high_yield_topics }
categories: string[]
```
