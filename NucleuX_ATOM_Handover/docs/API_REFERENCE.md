# NucleuX Academy - API Reference

## Authentication Pattern

All routes (except `/api/chat` and `/api/library/content`) use the same auth pattern:

```typescript
const supabase = await createClient();  // @/lib/supabase/server
const { data: { user }, error: authError } = await supabase.auth.getUser();
if (authError || !user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

The Supabase server client uses `@supabase/ssr` with Next.js `cookies()` store. Session is refreshed in middleware on every request.

**Two routes have NO authentication:** `/api/chat` and `/api/library/content`.

---

## Route 1: POST `/api/chat`

**File:** `src/app/api/chat/route.ts`
**Auth:** None
**External:** Anthropic API (`claude-sonnet-4-20250514`), Local filesystem (`/content/`)

### Request Body
```typescript
{
  messages: Array<{
    role: "user" | "assistant",
    content: string | ContentBlock[]  // ContentBlock supports base64 images
  }>,
  context?: string,           // Default: "surgery". Options: "full", "surgery", "medicine", "anatomy", "pathology", "obgyn", "pediatrics"
  deskSources?: string[],     // Active source names on user's desk
  systemOverride?: string     // Optional full system prompt replacement
}
```

### Response
`Content-Type: text/event-stream` (Server-Sent Events)
```
data: {"text": "token..."}
data: {"text": "more tokens..."}
...
data: [DONE]
```
On error: `data: {"error": "Stream error"}`

### Business Logic
1. Extracts last user message text (strips image blocks).
2. RAG: Keyword-searches `/content/` markdown files. Scores by path + first 2KB content. Picks top 5 files (max 30,000 chars).
3. Builds ATOM system prompt with retrieved textbook context.
4. If `deskSources` provided, appends source priority note.
5. Streams Claude response via SSE (max 4,096 tokens).

---

## Route 2: GET/PATCH `/api/profile`

**File:** `src/app/api/profile/route.ts`
**Auth:** Supabase `getUser()`
**Tables:** `profiles`, `user_preferences`, `streaks`

### GET /api/profile

**Response:**
```typescript
{
  id: string, email: string, username: string, full_name: string,
  avatar_url: string, specialty: string, level: string,
  institution: string, target_exam: string, target_date: string,
  timezone: string, plan: string, onboarding_completed: boolean,
  created_at: string,
  preferences: {
    daily_goal_minutes: number,  // default: 60
    mcq_daily_target: number,    // default: 20
    preferred_study_time: string, // default: "evening"
    notification_email: boolean,
    notification_telegram: boolean,
    theme: string,               // default: "dark"
    atom_proactive: boolean      // default: true
  },
  streak: {
    current_streak: number,
    longest_streak: number,
    last_study_date: string | null
  }
}
```

### PATCH /api/profile

**Request Body:** Any subset of:
```typescript
// Profile fields:
{ username?, full_name?, avatar_url?, specialty?, level?, institution?,
  target_exam?, target_date?, timezone?, onboarding_completed? }
// Preference fields:
{ daily_goal_minutes?, mcq_daily_target?, preferred_study_time?,
  notification_email?, notification_telegram?, telegram_chat_id?,
  theme?, atom_proactive? }
```

Separates fields into profile vs preference buckets, updates each table independently.

---

## Route 3: GET/POST `/api/progress`

**File:** `src/app/api/progress/route.ts`
**Auth:** Supabase `getUser()`
**Tables:** `user_atom_progress`, `atoms`

### GET /api/progress

**Query Params:**
- `atom_id` (optional) - filter to specific atom
- `specialty` (optional) - filter by specialty (post-fetch JS filter)
- `topic` (optional) - filter by topic (post-fetch JS filter)
- `status` (optional) - filter by status (DB-level filter)

**Response:**
```typescript
{
  progress: Array<{
    /* all user_atom_progress columns */
    atom: { id, title, slug, specialty, topic, subtopic, difficulty }
  }>,
  summary: {
    total: number, completed: number, in_progress: number,
    not_started: number, total_time_seconds: number
  }
}
```

### POST /api/progress

**Request Body:**
```typescript
{
  atom_id: string,               // required
  status?: string,               // "not_started" | "in_progress" | "completed"
  progress_percent?: number,
  time_spent_seconds?: number,   // accumulated (added to existing)
  rating?: number,
  is_saved?: boolean,
  notes?: string
}
```

**Side effect:** Internally calls `POST /api/streaks` to update streak.

---

## Route 4: GET/POST/PATCH `/api/study-sessions`

**File:** `src/app/api/study-sessions/route.ts`
**Auth:** Supabase `getUser()`
**Tables:** `study_sessions`, `daily_stats` (via RPC)

### GET /api/study-sessions
**Query Params:** `limit` (default: 10), `offset` (default: 0)

**Response:** `{ sessions: StudySession[], total: number, hasMore: boolean }`

### POST /api/study-sessions
**Request Body:**
```typescript
{
  atoms_studied?: string[],   // atom IDs
  source?: string             // default: "web"
}
```
Creates session with `started_at = now()`. **Side effect:** Calls `POST /api/streaks`.

### PATCH /api/study-sessions
**Request Body:**
```typescript
{
  session_id: string,          // required
  ended_at?: string,
  duration_minutes?: number,
  atoms_studied?: string[],
  mcqs_attempted?: number,
  mcqs_correct?: number,
  notes_created?: number
}
```
When ending a session (first time `ended_at` is set), calls Supabase RPCs:
- `increment_study_time(p_user_id, p_date, p_minutes)`
- `increment_mcq_stats(p_user_id, p_date, p_attempted, p_correct)` (if MCQ values provided)

---

## Route 5: GET `/api/study-plan`

**File:** `src/app/api/study-plan/route.ts`
**Auth:** Supabase `getUser()`
**Tables:** `user_preferences`, `daily_stats`, `user_pathways`, `pathways`, `user_atom_progress`, `atoms`, `profiles`

**Response:**
```typescript
{
  goals: { study_minutes: number, mcqs: number },
  today: {
    study_minutes: number, mcqs_attempted: number, mcqs_correct: number,
    topics_completed: number, goal_progress: number, mcq_progress: number
  },
  active_pathway: {
    id, title, current_atom_index, total_atoms, progress_percent
  } | null,
  continue_learning: Array<{
    atom_id, title, slug, type, specialty, topic,
    progress_percent, time_spent, estimated_time
  }>,   // up to 5 in-progress atoms
  recommended: Array<{
    atom_id, title, slug, type, specialty, topic,
    estimated_time, difficulty
  }>,   // up to 5 new atoms from user's specialty
  tasks: Array<{
    id, type: "continue" | "mcq" | "new" | "review",
    title, description, atom_id?, slug?,
    estimated_minutes, priority: "high" | "medium" | "low"
  }>
}
```

Generates prioritized task list based on daily goals and progress state.

---

## Route 6: GET/POST `/api/streaks`

**File:** `src/app/api/streaks/route.ts`
**Auth:** Supabase `getUser()`
**Tables:** `streaks`

### GET /api/streaks
**Response:** `{ current_streak, longest_streak, last_study_date, streak_started_at, ... }`

### POST /api/streaks
**Request Body:** None

**Logic:**
- If `last_study_date == today` → no change
- If `last_study_date == yesterday` → increment `current_streak` by 1
- Otherwise → reset `current_streak` to 1

Updates `longest_streak` if exceeded. Called internally by `/api/progress` and `/api/study-sessions`.

---

## Route 7: GET/POST `/api/analytics`

**File:** `src/app/api/analytics/route.ts`
**Auth:** Supabase `getUser()`
**Tables:** `streaks`, `study_sessions`, `user_atom_progress`, `mcq_attempts`, `daily_stats`, `analytics_events`

### GET /api/analytics
**Query Params:** `days` (default: 7)

**Response:**
```typescript
{
  currentStreak: number, longestStreak: number, lastStudyDate: string,
  totalStudyMinutes: number, topicsCompleted: number,
  totalQuestions: number, correctAnswers: number, avgAccuracy: number,
  recentSessions: StudySession[],     // last 5
  weeklyStudyMinutes: number[],       // 7-element array [day-6..today]
  weeklyMcqs: number[],               // 7-element array
  dailyStats: DailyStat[]
}
```

### POST /api/analytics
**Request Body:**
```typescript
{
  event: "study_time" | "mcq_attempt" | "topic_completed" | string,
  data: {
    minutes?: number,       // for study_time
    correct?: boolean,      // for mcq_attempt
    // arbitrary payload for generic events
  }
}
```

Event routing:
- `study_time` → RPC `increment_study_time`
- `mcq_attempt` → RPC `increment_mcq_stats`
- `topic_completed` → RPC `increment_topics_completed`
- Other → insert into `analytics_events` table

---

## Route 8: POST `/api/analytics/sync`

**File:** `src/app/api/analytics/sync/route.ts`
**Auth:** Supabase `getUser()`
**Tables:** `mcq_attempts`, `daily_stats`, `streaks`

**Request Body:**
```typescript
{
  mcqAttempts?: Array<{
    questionId: string, selectedAnswer: string, isCorrect: boolean,
    timeSpent: number,
    confidence: "guessing" | "unsure" | "sure" | "very-sure",
    timestamp: string
  }>,
  dailyStats?: Array<{
    date: string, studyMinutes: number,
    questionsAttempted: number, questionsCorrect: number,
    topicsReviewed?: string[]
  }>,
  currentStreak?: number,
  longestStreak?: number
}
```

Bulk offline-sync endpoint. De-duplicates MCQ attempts by `(mcq_id, created_at)`. Upserts daily stats on `(user_id, date)` conflict.

---

## Route 9: GET `/api/library/content`

**File:** `src/app/api/library/content/route.ts`
**Auth:** None
**External:** Local filesystem (`/content/`)

**Three mutually exclusive query formats:**

### Format 1 - Multi-subject (new)
`?subject=surgery&subspecialty=esophagus&topic=gerd-hiatal-hernia`

### Format 2 - Legacy surgery-only
`?subspecialty=esophagus&topic=gerd-hiatal-hernia`

### Format 3 - NMC curriculum
`?system=esophagus&topic=gerd&mode=explorer`
Mode options: `explorer`, `exam-prep`, `textbook`, `cards`, `procedure`

**Response:**
```typescript
// Markdown content:
{ content: string, hasRichContent: true }
// Cards mode:
{ cards: FlashCard[] }
// Error:
{ error: string, hasRichContent: false }
```

Path traversal protection: `path.normalize().startsWith(CONTENT_BASE)`.

---

## Route 10: POST `/api/speech/tts`

**File:** `src/app/api/speech/tts/route.ts`
**Auth:** Supabase `getUser()`
**External:** Sarvam AI TTS API (`bulbul:v3`)

**Request Body:**
```typescript
{
  text: string,
  target_language_code: "en-IN" | "te-IN" | "hi-IN",
  speaker?: string,
  pace?: number,
  temperature?: number,
  speech_sample_rate?: number
}
```

**Response:**
```typescript
{
  request_id: string | null,
  audio_base64: string | null,   // first segment, base64 WAV
  audios: string[]               // all segments
}
```

---

## Route 11: POST `/api/speech/stt`

**File:** `src/app/api/speech/stt/route.ts`
**Auth:** Supabase `getUser()`
**External:** Sarvam AI STT API (`saaras:v3`)

**Request Body:** `multipart/form-data`
- `file` (required): audio file
- `language_code` (optional): `"en-IN"` | `"te-IN"` | `"hi-IN"` | `"unknown"` (default)
- `mode` (optional): `"transcribe"` | `"translate"` | `"verbatim"` | `"translit"` | `"codemix"` (default)

**Response:**
```typescript
{
  transcript: string,
  language_code: string | null,
  language_probability: number | null,
  request_id: string | null,
  timestamps: unknown | null
}
```

---

## Route 12: GET `/auth/callback`

**File:** `src/app/auth/callback/route.ts`
**Purpose:** Supabase OAuth callback handler. Exchanges auth code for session, redirects to requested page or `/desk`.

---

## Supabase RPC Functions

These database-level functions are called by API routes:

| Function | Called By | Purpose |
|---|---|---|
| `increment_study_time(p_user_id, p_date, p_minutes)` | `/api/study-sessions` PATCH, `/api/analytics` POST | Add minutes to daily_stats |
| `increment_mcq_stats(p_user_id, p_date, p_attempted, p_correct)` | `/api/study-sessions` PATCH, `/api/analytics` POST | Add MCQ counts to daily_stats |
| `increment_topics_completed(p_user_id, p_date)` | `/api/analytics` POST | Increment topics in daily_stats |

---

## Internal Route Dependencies

```
POST /api/progress  ──────────► POST /api/streaks (internal fetch, cookie forwarded)
POST /api/study-sessions ─────► POST /api/streaks (internal fetch, cookie forwarded)
```

---

## Summary Table

| Route | Methods | Auth | External | Key Tables |
|---|---|---|---|---|
| `/api/chat` | POST | None | Anthropic, filesystem | - |
| `/api/profile` | GET, PATCH | Yes | - | profiles, user_preferences, streaks |
| `/api/progress` | GET, POST | Yes | - | user_atom_progress, atoms |
| `/api/study-sessions` | GET, POST, PATCH | Yes | - | study_sessions, daily_stats |
| `/api/study-plan` | GET | Yes | - | user_preferences, daily_stats, pathways, atoms |
| `/api/streaks` | GET, POST | Yes | - | streaks |
| `/api/analytics` | GET, POST | Yes | - | multiple tables + analytics_events |
| `/api/analytics/sync` | POST | Yes | - | mcq_attempts, daily_stats, streaks |
| `/api/library/content` | GET | None | filesystem | - |
| `/api/speech/tts` | POST | Yes | Sarvam AI | - |
| `/api/speech/stt` | POST | Yes | Sarvam AI | - |
