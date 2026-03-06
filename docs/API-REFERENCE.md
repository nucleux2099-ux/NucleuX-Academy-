# API Reference

Internal API handlers are implemented as Next.js Route Handlers under `src/app/api`.

## Common Behavior
- Most endpoints require authenticated Supabase user.
- Unauthorized response pattern: `401 { "error": "Unauthorized" }`.
- Error response pattern: `500 { "error": "Internal server error" }` (or endpoint-specific message).

## `/api/analytics`
File: `src/app/api/analytics/route.ts`

### `GET /api/analytics?days=7`
Returns aggregated analytics for the current user.

Query params:
- `days` (optional, default `7`)

Response includes:
- streak data
- totals (`totalStudyMinutes`, `topicsCompleted`, `totalQuestions`, `avgAccuracy`)
- `recentSessions`
- weekly arrays (`weeklyStudyMinutes`, `weeklyMcqs`)
- `dailyStats`

### `POST /api/analytics`
Logs analytics events or increments daily counters.

Body:
- `{ "event": "study_time", "data": { "minutes": number } }`
- `{ "event": "mcq_attempt", "data": { "correct": boolean } }`
- `{ "event": "topic_completed", "data": {} }`
- Any other event name is inserted into `analytics_events`.

## `/api/analytics/sync`
File: `src/app/api/analytics/sync/route.ts`

### `POST /api/analytics/sync`
Syncs local analytics cache to server.

Body (typical):
- `mcqAttempts`: array
- `dailyStats`: array
- `currentStreak`: number
- `longestStreak`: number

Notes:
- Deduplicates MCQ attempts by `(mcq_id, created_at)`.
- Upserts daily stats by `(user_id, date)`.

## `/api/chat`
File: `src/app/api/chat/route.ts`

### `POST /api/chat`
Streams ATOM responses from Anthropic with optional content grounding.

Body:
- `messages`: chat history array (required)
- `context`: content scope (`full`, `surgery`, `medicine`, etc.)
- `deskSources`: active source titles (optional)
- `systemOverride`: custom system prompt (optional)

Dependencies:
- `ANTHROPIC_API_KEY`
- Filesystem content under `/content`

## `/api/library/content`
File: `src/app/api/library/content/route.ts`

### `GET /api/library/content`
Loads topic content files from `/content`.

Supported parameter sets:
1. `subject`, `subspecialty`, `topic` (primary path)
2. `subspecialty`, `topic` (legacy surgery path)
3. `system`, `topic`, `mode` (older format)

Examples:
- `/api/library/content?subject=surgery&subspecialty=esophagus&topic=gerd`
- `/api/library/content?system=esophagus&topic=gerd&mode=explorer`

Response:
- `{ content: string, hasRichContent?: boolean }` on success
- error payload otherwise

## `/api/profile`
File: `src/app/api/profile/route.ts`

### `GET /api/profile`
Returns flattened profile + preferences + streak snapshot.

### `PATCH /api/profile`
Updates profile and/or preference fields.

Body can include:
- Profile fields: `username`, `full_name`, `specialty`, `level`, `institution`, `target_exam`, `target_date`, `timezone`, `onboarding_completed`, etc.
- Preference fields: `daily_goal_minutes`, `mcq_daily_target`, `preferred_study_time`, `notification_email`, `notification_telegram`, `telegram_chat_id`, `theme`, `atom_proactive`

## `/api/progress`
File: `src/app/api/progress/route.ts`

### `GET /api/progress`
Returns user atom progress with optional filtering.

Query params:
- `atom_id`
- `specialty`
- `topic`
- `status`

Response:
- `progress`: records
- `summary`: totals by status and time

### `POST /api/progress`
Upserts progress for an atom.

Body:
- required: `atom_id`
- optional: `status`, `progress_percent`, `time_spent_seconds`, `rating`, `is_saved`, `notes`

Side effect:
- Calls `/api/streaks` POST to keep streak updated.

## `/api/streaks`
File: `src/app/api/streaks/route.ts`

### `GET /api/streaks`
Returns streak row or default zero-values if none.

### `POST /api/streaks`
Updates streak for "studied today" event.
- Continues streak if last study date was yesterday.
- Resets if broken.
- Upserts by `user_id`.

## `/api/study-plan`
File: `src/app/api/study-plan/route.ts`

### `GET /api/study-plan`
Builds today's study plan from:
- user preferences
- today's daily stats
- active pathway
- in-progress atoms
- recommended atoms

Response includes:
- goals
- today progress
- active pathway summary
- continue-learning list
- recommendations
- generated tasks

## `/api/study-sessions`
File: `src/app/api/study-sessions/route.ts`

### `GET /api/study-sessions?limit=10&offset=0`
Paginated study sessions for current user.

### `POST /api/study-sessions`
Starts a study session.

Body:
- `atoms_studied` (optional)
- `source` (optional, default `web`)

### `PATCH /api/study-sessions`
Ends/updates a session.

Body:
- required: `session_id`
- optional: `ended_at`, `duration_minutes`, `atoms_studied`, `mcqs_attempted`, `mcqs_correct`, `notes_created`

Side effects:
- Updates `daily_stats` via RPC when ending a session first time.

## `/api/learning/topics`
File: `src/app/api/learning/topics/route.ts`

### `GET /api/learning/topics`
Lists current user's learning-topic lifecycle rows.

Query params:
- `stage` (optional: `prestudy`, `aim`, `shoot`, `skin`)
- `status` (optional: `active`, `paused`, `completed`, `archived`)
- `subject` (optional)
- `topic_slug` (optional)
- `limit` (optional, default `50`, max `200`)

### `POST /api/learning/topics`
Creates or upserts a learning topic row for the current user.

Required body fields:
- `topic_slug`
- `topic_title`
- `subject`

Optional:
- `subspecialty`, `atom_id`, `stage`, `status`, `metadata`

### `PATCH /api/learning/topics`
Updates an existing learning topic row.

Required body:
- `id`

Optional:
- `topic_title`, `subject`, `subspecialty`, `topic_slug`, `atom_id`, `stage`, `status`, `metadata`, `completed_at`

## `/api/learning/topics/[topicId]/chunks`
File: `src/app/api/learning/topics/[topicId]/chunks/route.ts`

### `GET /api/learning/topics/{topicId}/chunks`
Returns chunks for the specified learning topic (owner-only).

### `POST /api/learning/topics/{topicId}/chunks`
Creates a new chunk on a learning topic.

Required body:
- `title`

Optional:
- `chunk_order`, `chunk_key`, `why_important`, `status`, `payload`

### `PATCH /api/learning/topics/{topicId}/chunks`
Updates a chunk under the given learning topic.

Required body:
- `chunk_id`

Optional:
- `title`, `why_important`, `status`, `payload`, `chunk_order`

## `/api/learning/stage-runs`
File: `src/app/api/learning/stage-runs/route.ts`

### `GET /api/learning/stage-runs`
Lists stage-run records for the current user (across owned learning topics).

Query params:
- `learning_topic_id` (optional)
- `stage` (optional)
- `status` (optional)
- `limit` (optional)

### `POST /api/learning/stage-runs`
Creates a stage-run row.

Required body:
- `learning_topic_id`
- `stage`

Optional:
- `run_index`, `status`, `summary`

### `PATCH /api/learning/stage-runs`
Updates a stage-run row.

Required body:
- `id`

Optional:
- `status`, `summary`, `finished_at`

## `/api/learning/artifacts`
File: `src/app/api/learning/artifacts/route.ts`

### `GET /api/learning/artifacts`
Returns artifacts for a specific learning topic.

Required query param:
- `learning_topic_id`

Optional query params:
- `chunk_id`, `stage_run_id`, `artifact_type`, `current_only`, `limit`

### `POST /api/learning/artifacts`
Creates a learning artifact.

Required body:
- `learning_topic_id`
- `artifact_type`

Optional:
- `chunk_id`, `stage_run_id`, `source`, `version`, `is_current`, `content`

### `PATCH /api/learning/artifacts`
Updates an artifact row.

Required body:
- `id`

Optional:
- `content`, `source`, `artifact_type`, `is_current`, `version`, `chunk_id`, `stage_run_id`

## `/api/learning/checkpoints`
File: `src/app/api/learning/checkpoints/route.ts`

### `GET /api/learning/checkpoints`
Lists checkpoint evaluations for one learning topic.

Required query param:
- `learning_topic_id`

Optional query params:
- `stage`, `checkpoint_code`, `limit`

### `POST /api/learning/checkpoints`
Creates a checkpoint evaluation row.

Required body:
- `learning_topic_id`
- `stage`
- `checkpoint_code`
- `passed` (boolean)

Optional:
- `stage_run_id`, `score`, `details`, `evaluated_at`

## `/api/exam-centre/overview`
File: `src/app/api/exam-centre/overview/route.ts`

### `GET /api/exam-centre/overview`
Returns training-centre dashboard data for the current user by aggregating:
- `streaks`
- `mcq_attempts`
- `learning_topics`
- `learning_checkpoints`

Response shape:
- `summary`
  - `questionsAttempted`
  - `accuracyPercent`
  - `casesCompleted`
  - `pathwaysDone`
  - `studyStreakDays`
- `guidedPathways` (top pathways from lifecycle data with fallback seeds)
- `subjectProgress` (per-subject topic totals/active/completed)
- `recentActivity` (normalized mixed feed from MCQ attempts, checkpoints, and topic updates)

## `/api/exam-centre/catalog`
File: `src/app/api/exam-centre/catalog/route.ts`

### `GET /api/exam-centre/catalog`
Returns Training Centre catalog payload with:
- `summary` (`totalMcqs`, `totalPyqs`, `totalAttempts`, `totalCorrect`)
- `examTypes` (stats for PYQ/MCQ/simulator/flow/practical/guided cards)
- `subjects` (question volume + lifecycle topic progress by subject)

## `/api/exam-centre/pyq`
File: `src/app/api/exam-centre/pyq/route.ts`

### `GET /api/exam-centre/pyq?subject=surgery&limit=6`
Returns grouped PYQ paper catalog from published MCQs with `source_exam`.

Query params:
- `subject` (optional)
- `limit` (optional, default `12`, max `40`)

Response includes:
- `summary`
- `papers` (`name`, `year`, `totalQuestions`, `highYieldTopics`, `isAvailable`, `href`)
- `fallbackUsed` (boolean)

## `/api/exam-centre/simulator`
File: `src/app/api/exam-centre/simulator/route.ts`

### `GET /api/exam-centre/simulator`
Returns simulator case catalog with user-specific completion signal derived from lifecycle topics.

Response includes:
- `summary` (`totalCases`, `attemptedCases`, `masteredCases`)
- `cases` (`id`, `title`, `difficulty`, `duration`, `skills`, `completionRate`)

## `/api/exam-centre/practical`
File: `src/app/api/exam-centre/practical/route.ts`

### `GET /api/exam-centre/practical`
Returns practical/OSCE station catalog with skin-stage checkpoint pass metrics.

Response includes:
- `summary` (`totalStations`, `attemptedCheckpoints`, `passedCheckpoints`, `passRate`)
- `stations`

## `/api/exam-centre/read-model/analytics`
File: `src/app/api/exam-centre/read-model/analytics/route.ts`

### `GET /api/exam-centre/read-model/analytics?days=30`
Returns an Exam Centre analytics read model for the authenticated user with:
- session quality (per-session quality score + mode rollups)
- confidence calibration (expected vs observed accuracy by confidence band)
- weak-topic recurrence (repeated misses over the selected window)

Query params:
- `days` (optional, default `30`, max `180`)
- `session_limit` (optional, default `180`, max `400`)
- `attempt_limit` (optional, default `5000`, max `15000`)
- `weak_limit` (optional, default `8`, max `20`)

Response includes:
- `summary`
  - `totalSessions`, `completedSessions`, `inProgressSessions`
  - `avgSessionAccuracyPercent`, `avgSessionDurationMinutes`, `avgAttemptsPerSession`
  - `highQualitySessionRate`
  - `calibrationGapPercent`
  - `weakTopicCount`, `recurringWeakTopicCount`
- `sessionQuality`
  - `byMode` (session/accuracy/duration/high-quality rollups)
  - `recentSessions` (quality-band snapshots)
- `confidenceCalibration`
  - `overall`
  - `bands` (`confidence` 1-5 with `gapPercent` and `state`)
- `weakTopicRecurrence`
  - `topics` (ranked recurrence list with `incorrectCount`, `recurrenceCount`, `status`)
- `generatedAt`

## `/api/exam-centre/read-model/simulator`
File: `src/app/api/exam-centre/read-model/simulator/route.ts`

### `GET /api/exam-centre/read-model/simulator?session_id={uuid}`
Returns a simulator session snapshot built from template answer events (`analytics_events`).

Query params:
- `session_id` (optional UUID; when omitted, latest simulator session is used)

Response includes:
- `session` (`id`, `mode`, `startedAt`, `endedAt`, `durationMinutes`, `submitted`)
- `snapshot`
  - `attemptedActions`, `successfulActions`
  - `accuracyPercent`, `phaseCompletionPercent`
  - `avgConfidence`, `avgActionSeconds`
  - `scorePercent`, `grade`
- `phaseBreakdown` (history/examination/investigation/diagnosis/management buckets)
- `timeline` (recent simulator action events)
- `generatedAt`

## `/api/exam-centre/read-model/flow`
File: `src/app/api/exam-centre/read-model/flow/route.ts`

### `GET /api/exam-centre/read-model/flow?session_id={uuid}&expected_branches=12`
Returns a flow/pathway decision snapshot from branch transition events.

Query params:
- `session_id` (optional UUID; when omitted, latest flow session is used)
- `expected_branches` (optional positive integer for coverage scoring)

Response includes:
- `session`
- `snapshot`
  - `decisionsMade`, `alignedDecisions`, `driftDecisions`
  - `alignmentPercent`
  - `uniqueTransitions`, `uniqueNodesVisited`
  - `expectedBranches`, `branchCoveragePercent`
  - `avgDecisionSeconds`
  - `scorePercent`, `grade`
- `timeline` (recent branch transitions)
- `generatedAt`

## `/api/exam-centre/read-model/osce`
File: `src/app/api/exam-centre/read-model/osce/route.ts`

### `GET /api/exam-centre/read-model/osce?session_id={uuid}&total_marks=40&passing_marks=24&distinction_marks=32&checklist_total=20`
Returns an OSCE/practical checklist snapshot from checklist answer events.

Query params:
- `session_id` (optional UUID; when omitted, latest practical session is used)
- `total_marks` (optional positive integer)
- `passing_marks` (optional positive integer)
- `distinction_marks` (optional positive integer)
- `checklist_total` (optional positive integer)

Response includes:
- `session`
- `snapshot`
  - `checkedItems`, `criticalItemsChecked`
  - `checklistTotal`, `completionPercent`
  - `marksAwarded`, `totalMarks`
  - `passingMarks`, `distinctionMarks`
  - `scorePercent`, `grade`
  - `accuracyPercent`, `avgActionSeconds`
- `checklist.items` (latest mark per checklist item)
- `timeline` (recent checklist events)
- `generatedAt`

## `/api/exam-centre/sessions`
File: `src/app/api/exam-centre/sessions/route.ts`

### `GET /api/exam-centre/sessions?limit=20&offset=0&include_ended=false`
Lists authenticated user’s exam-centre scoped sessions (`study_sessions.source` prefixed with `exam-centre:`).

### `POST /api/exam-centre/sessions`
Creates an exam session.

Required body:
- `mode` (`pyq` | `mcq` | `simulator` | `practical` | `flow` | `guided`)

Optional body:
- `atom_ids` (UUID array)
- `started_at` (ISO datetime)

## `/api/exam-centre/sessions/{sessionId}/answers`
File: `src/app/api/exam-centre/sessions/[sessionId]/answers/route.ts`

### `POST /api/exam-centre/sessions/{sessionId}/answers`
Records one MCQ answer attempt in a session and updates session counters.

Required body (one identity):
- `mcq_id` (UUID, for DB-backed MCQs), or
- `question_ref` (string, for template/static question surfaces)

Any one of:
- `selected_option_id` (UUID)
- `selected_option_ids` (UUID array)
- `selected_option_order` (number)
- `selected_option_orders` (number array)

Optional:
- `time_taken_seconds`
- `confidence` (`1`-`5`)
- `metadata` (object; persisted for template/static question attempts)

Template/static question mode fields (`question_ref` path):
- `selected_option_key` or `selected_option_keys`
- plus either `is_correct` or `correct_option_key`

Used by live pages:
- `/exam-centre/pyq`, `/exam-centre/mcq`
- `/exam-centre/simulator/[caseId]` (mode `simulator`)
- `/exam-centre/flow/[flowId]` (mode `flow`)
- `/exam-centre/osce/[stationId]` (mode `practical`)

## `/api/exam-centre/sessions/{sessionId}/submit`
File: `src/app/api/exam-centre/sessions/[sessionId]/submit/route.ts`

### `POST /api/exam-centre/sessions/{sessionId}/submit`
Submits a session (idempotent for already-ended sessions), writes end-time/duration, and syncs daily stats.

Optional body:
- `ended_at` (ISO datetime)
- `duration_minutes`
- `notes_created`

## `/api/speech/stt`
File: `src/app/api/speech/stt/route.ts`

### `POST /api/speech/stt`
Speech-to-text via Sarvam.

Content type:
- `multipart/form-data`

Fields:
- `file` (required)
- `language_code` (optional: `en-IN`, `te-IN`, `hi-IN`, `unknown`)
- `mode` (optional: `transcribe`, `translate`, `verbatim`, `translit`, `codemix`)

Returns transcript metadata and text.

## `/api/speech/tts`
File: `src/app/api/speech/tts/route.ts`

### `POST /api/speech/tts`
Text-to-speech via Sarvam.

JSON body:
- required: `text`, `target_language_code` (`en-IN`, `te-IN`, `hi-IN`)
- optional: `speaker`, `pace`, `temperature`, `speech_sample_rate`

Returns base64 audio payload(s).

## Auth Callback Route
Although not under `/api`, this server route is part of auth flow:
- `GET /auth/callback` in `src/app/auth/callback/route.ts`
- Exchanges auth code for session and redirects to onboarding or app route.
