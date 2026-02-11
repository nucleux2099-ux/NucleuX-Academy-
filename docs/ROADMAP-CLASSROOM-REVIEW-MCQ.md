# NucleuX Academy Roadmap — Classroom (AI+Human), Review Queue, MCQ Engine

**Owner:** Vishwakarma
**Updated:** 2026-02-11

This is a living design doc. I will update it as implementation progresses.

---

## 0) Core Product Loop

1. Learn (Library / Classroom)
2. Practice (MCQ / Retrieval cards)
3. Capture (Scribe notes + error notebook)
4. Review (Daily review queue)
5. Measure (Analytics + weak areas)
6. Recommend (Next topics + targeted drills)

---

## 1) Classroom — Live AI Class (Teacher + Scribe)

### 1.1 Routes
- `/classroom/live-ai` — AI teacher + scribe
- `/classroom/live-human` — human class + scribe (later)
- `/classroom/replay/[sessionId]` — replayable sessions

### 1.2 MVP Goals (v1)
- AI teacher explains topic **step-by-step** in short chunks
- Scribe listens to teacher + user (voice + typed)
- Scribe outputs **Markdown + structured JSON**
- Save session as replayable class

### 1.3 Agent Contracts (critical)

#### Teacher output per chunk
```json
{
  "chunk_id": "c1",
  "title": "Definition + Classification",
  "learning_goal": "Define shock and list types",
  "speech_text": "...",
  "board_actions": [
    {"type": "add_node", "id": "shock", "text": "Shock"},
    {"type": "add_branch", "from": "shock", "id": "types", "text": "Types"}
  ],
  "checkpoints": [
    {"q": "Define shock"},
    {"q": "List 4 types"}
  ],
  "sources": [
    {"textbook": "Bailey & Love", "chapter": "2"}
  ]
}
```

#### Scribe output per chunk
```json
{
  "chunk_id": "c1",
  "notes_md": "# ...",
  "notes_blocks": [
    {"type": "heading", "text": "Shock"},
    {"type": "bullet", "text": "Shock = ..."},
    {"type": "high_yield", "text": "BP falls late"}
  ],
  "mindmap": {
    "nodes": [{"id": "shock", "text": "Shock"}],
    "edges": []
  },
  "flashcards": [
    {"question": "Define shock", "answer": "..."}
  ],
  "user_doubts": [
    {"text": "Why FENa differs?", "status": "answered"}
  ]
}
```

### 1.4 Speech stack (Sarvam-only for MVP)

#### STT (user voice)
- Model: `saaras:v3`
- Default mode: `codemix`
- Languages MVP: `en-IN`, `te-IN`, `hi-IN`

#### TTS (teacher voice)
- Model: `bulbul:v3`
- Output: base64 WAV
- Languages MVP: `en-IN`, `te-IN`, `hi-IN`

**Default language strategy (MVP):**
- Primary: **English** (`en-IN`)
- Bilingual option: **Regional + English** (e.g. `te-IN` + English terms)
  - Use code-mixed *text* (medical terms in English) + set `target_language_code=te-IN`
  - Also generate an **English-only** transcript/notes version in parallel for clarity

### 1.5 Data Model (Supabase)
Minimal tables:
- `class_sessions`
- `class_events` (teacher chunks, user messages, transcripts)
- `class_notes_versions`
- `class_assets` (audio + whiteboard scene)

### 1.6 v2 Upgrades
- Pause/resume on voice command
- Excalidraw board rendering (mindmap_json → elements)
- “Propose changes” mode for board (avoid overwriting user edits)
- Automatic end-of-class quiz + weak area extraction

---

## 2) Daily Review Queue (Spaced Repetition v1)

### 2.1 MVP Goals (v1)
- A single page: `/review`
- Shows **due items today**:
  - retrieval cards
  - flagged topics
- User marks: correct/incorrect + confidence
- System schedules next review

### 2.2 Data Model
- `review_items`
  - `user_id`
  - `item_type` = `topic|mcq|card`
  - `item_id`
  - `ease_factor`, `interval_days`, `repetitions`, `next_review_at`, `last_reviewed_at`

### 2.3 v2 Upgrades
- Hybrid scheduling (cards SM-2, topics interval ladder)
- Weakness targeting from MCQs + classroom scribe
- Time-box review modes (10 min / 30 min)

---

## 3) MCQ Engine + Error Notebook

### 3.1 MVP Goals (v1)
- `GET /api/mcqs` filtered by topic/difficulty
- `POST /api/mcqs/attempt`
- Store attempts; show explanation
- Error notebook:
  - auto-save wrong attempts
  - user can add “why I got it wrong”

### 3.2 Data Model
Existing:
- `mcqs`, `mcq_options`, `mcq_attempts`
Add:
- `mcq_error_notebook`
  - `user_id`, `mcq_id`, `selected`, `correct`, `reason`, `tags`, `created_at`

### 3.3 v2 Upgrades
- Adaptive question selection by weakness
- Convert wrong answers into retrieval cards
- Timed mini-mocks (NEET/INI pattern)

---

## 4) Implementation Order

1) Sarvam speech wrappers + `/api/speech/stt` + `/api/speech/tts`
2) `/classroom/live-ai` UI shell + local session state
3) Persist sessions + replay
4) Scribe structured outputs
5) Review queue v1
6) MCQ engine + error notebook

---

## 5) Open Questions

- First default teacher language? (en-IN vs te-IN)
- Should transcripts store per-word timestamps or per-segment for MVP?
- For human classes: do we store only teacher audio, or full room audio?

