# NucleuX Academy - Database Schema

**Database:** Supabase (PostgreSQL)
**Version:** 1.0
**Date:** 2026-02-07

---

## 🗂️ Tables Overview

```
users
├── profiles
├── progress
├── notes
└── streaks

atoms (content)
├── citations
├── connections
└── tags

pathways
├── pathway_topics
└── user_pathways

mcqs
├── mcq_options
├── mcq_attempts
└── mcq_explanations

community
├── discussions
├── comments
└── reactions
```

---

## 👤 Users & Authentication

### `users` (Supabase Auth)
Handled by Supabase Auth - includes email, password, OAuth providers.

### `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  specialty TEXT, -- 'surgery', 'medicine', 'pediatrics', etc.
  level TEXT DEFAULT 'student', -- 'student', 'resident', 'fellow', 'attending'
  institution TEXT,
  target_exam TEXT, -- 'NEET-PG', 'USMLE', 'PLAB', etc.
  target_date DATE,
  timezone TEXT DEFAULT 'Asia/Kolkata',
  plan TEXT DEFAULT 'free', -- 'free', 'pro', 'team'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `user_preferences`
```sql
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  daily_goal_minutes INT DEFAULT 60,
  mcq_daily_target INT DEFAULT 20,
  notification_email BOOLEAN DEFAULT TRUE,
  notification_telegram BOOLEAN DEFAULT TRUE,
  telegram_chat_id TEXT,
  theme TEXT DEFAULT 'dark',
  atom_proactive BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📚 Content (Atoms)

### `atoms`
The core unit of knowledge.

```sql
CREATE TABLE atoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- 'note', 'pearl', 'mnemonic', 'diagram', 'dose', 'case', 'mcq'
  content JSONB NOT NULL, -- Rich content (markdown, structured data)
  summary TEXT, -- Short summary for cards
  
  -- Classification
  specialty TEXT NOT NULL, -- 'surgery', 'medicine', etc.
  system TEXT, -- 'gi', 'cardio', 'neuro', etc.
  topic TEXT NOT NULL,
  subtopic TEXT,
  tags TEXT[],
  
  -- Source
  source_type TEXT, -- 'curated', 'user', 'atom-generated'
  source_textbook TEXT, -- 'Harrison's', 'Maingot's', etc.
  source_edition TEXT,
  source_chapter TEXT,
  source_page TEXT,
  
  -- Metadata
  difficulty INT DEFAULT 2, -- 1-5 scale
  read_time_minutes INT,
  is_premium BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  
  -- Stats
  view_count INT DEFAULT 0,
  save_count INT DEFAULT 0,
  avg_rating DECIMAL(2,1),
  
  -- Ownership
  author_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_atoms_specialty ON atoms(specialty);
CREATE INDEX idx_atoms_topic ON atoms(topic);
CREATE INDEX idx_atoms_type ON atoms(type);
CREATE INDEX idx_atoms_tags ON atoms USING GIN(tags);
```

### `atom_citations`
Precise source references.

```sql
CREATE TABLE atom_citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  atom_id UUID REFERENCES atoms(id) ON DELETE CASCADE,
  textbook TEXT NOT NULL,
  edition TEXT,
  chapter TEXT,
  section TEXT,
  page_start INT,
  page_end INT,
  quote TEXT, -- Direct quote if applicable
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `atom_connections`
Knowledge graph edges.

```sql
CREATE TABLE atom_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_atom_id UUID REFERENCES atoms(id) ON DELETE CASCADE,
  to_atom_id UUID REFERENCES atoms(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL, -- 'related', 'prerequisite', 'contradicts', 'expands', 'simplifies'
  strength INT DEFAULT 5, -- 1-10
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_atom_id, to_atom_id)
);
```

---

## 📈 Progress Tracking

### `user_atom_progress`
```sql
CREATE TABLE user_atom_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  atom_id UUID REFERENCES atoms(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed', 'mastered'
  progress_percent INT DEFAULT 0,
  time_spent_seconds INT DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  rating INT, -- User's rating 1-5
  is_saved BOOLEAN DEFAULT FALSE,
  notes TEXT, -- Personal notes on this atom
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, atom_id)
);
```

### `study_sessions`
```sql
CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  duration_minutes INT,
  atoms_studied UUID[],
  mcqs_attempted INT DEFAULT 0,
  mcqs_correct INT DEFAULT 0,
  notes_created INT DEFAULT 0,
  source TEXT DEFAULT 'web', -- 'web', 'telegram', 'mobile'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `streaks`
```sql
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_study_date DATE,
  streak_started_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
```

---

## 🛤️ Pathways

### `pathways`
```sql
CREATE TABLE pathways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  specialty TEXT NOT NULL,
  target_exam TEXT, -- 'NEET-PG', 'USMLE', etc.
  difficulty INT DEFAULT 2,
  estimated_hours INT,
  topic_count INT DEFAULT 0,
  is_official BOOLEAN DEFAULT TRUE, -- Official vs community-created
  author_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `pathway_topics`
```sql
CREATE TABLE pathway_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id UUID REFERENCES pathways(id) ON DELETE CASCADE,
  atom_id UUID REFERENCES atoms(id) ON DELETE CASCADE,
  sequence_order INT NOT NULL,
  is_required BOOLEAN DEFAULT TRUE,
  estimated_minutes INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `user_pathways`
```sql
CREATE TABLE user_pathways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pathway_id UUID REFERENCES pathways(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active', -- 'active', 'paused', 'completed', 'abandoned'
  progress_percent INT DEFAULT 0,
  current_topic_id UUID REFERENCES pathway_topics(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, pathway_id)
);
```

---

## ❓ MCQs

### `mcqs`
```sql
CREATE TABLE mcqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  question_type TEXT DEFAULT 'single', -- 'single', 'multiple', 'true_false'
  stem TEXT, -- Clinical scenario
  
  -- Classification
  specialty TEXT NOT NULL,
  topic TEXT NOT NULL,
  subtopic TEXT,
  tags TEXT[],
  
  -- Difficulty & Source
  difficulty INT DEFAULT 2, -- 1-5
  source TEXT, -- 'original', 'past_paper', 'textbook'
  source_exam TEXT, -- 'NEET-PG 2024', etc.
  
  -- Linked content
  atom_id UUID REFERENCES atoms(id), -- Related atom for learning
  explanation_atom_id UUID REFERENCES atoms(id),
  
  -- Stats
  attempt_count INT DEFAULT 0,
  correct_rate DECIMAL(4,2),
  avg_time_seconds INT,
  
  is_premium BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `mcq_options`
```sql
CREATE TABLE mcq_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mcq_id UUID REFERENCES mcqs(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_order INT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  explanation TEXT, -- Why this option is right/wrong
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `mcq_attempts`
```sql
CREATE TABLE mcq_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mcq_id UUID REFERENCES mcqs(id) ON DELETE CASCADE,
  selected_options UUID[], -- Array of mcq_option ids
  is_correct BOOLEAN,
  time_taken_seconds INT,
  confidence INT, -- 1-5 user's confidence before reveal
  session_id UUID REFERENCES study_sessions(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📝 User Notes

### `user_notes`
```sql
CREATE TABLE user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL, -- Rich text content
  
  -- Optional links
  atom_id UUID REFERENCES atoms(id), -- Link to curated content
  mcq_id UUID REFERENCES mcqs(id),
  
  -- Classification
  specialty TEXT,
  topic TEXT,
  tags TEXT[],
  
  -- Organization
  folder TEXT DEFAULT 'inbox',
  is_pinned BOOLEAN DEFAULT FALSE,
  color TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🏛️ Community

### `discussions`
```sql
CREATE TABLE discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  
  -- Context
  atom_id UUID REFERENCES atoms(id),
  mcq_id UUID REFERENCES mcqs(id),
  specialty TEXT,
  tags TEXT[],
  
  -- Stats
  view_count INT DEFAULT 0,
  reply_count INT DEFAULT 0,
  upvote_count INT DEFAULT 0,
  
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `comments`
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id), -- For nested replies
  content TEXT NOT NULL,
  upvote_count INT DEFAULT 0,
  is_accepted BOOLEAN DEFAULT FALSE, -- Marked as best answer
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔔 ATOM Integration

### `atom_interactions`
Track conversations with ATOM.

```sql
CREATE TABLE atom_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL, -- 'telegram', 'web', 'mobile'
  session_id TEXT, -- External session reference
  query TEXT NOT NULL,
  response TEXT,
  atoms_referenced UUID[], -- Atoms used in response
  mcqs_generated UUID[], -- MCQs created from this interaction
  tokens_used INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `atom_recommendations`
ATOM's personalized suggestions.

```sql
CREATE TABLE atom_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  atom_id UUID REFERENCES atoms(id),
  reason TEXT NOT NULL, -- 'weak_area', 'next_in_pathway', 'related_to_recent', etc.
  priority INT DEFAULT 5, -- 1-10
  is_dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);
```

---

## 📊 Analytics

### `daily_stats`
Aggregated daily stats per user.

```sql
CREATE TABLE daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  study_minutes INT DEFAULT 0,
  atoms_completed INT DEFAULT 0,
  mcqs_attempted INT DEFAULT 0,
  mcqs_correct INT DEFAULT 0,
  notes_created INT DEFAULT 0,
  streak_day INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);
```

---

## 🔐 Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_atom_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
-- ... etc for all user-specific tables

-- Example policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Public atoms are viewable by all"
  ON atoms FOR SELECT
  USING (is_published = true);

CREATE POLICY "Users can view own progress"
  ON user_atom_progress FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 📋 Initial Data

### Specialties
```sql
INSERT INTO specialties (slug, name, icon) VALUES
  ('surgery', 'Surgery', '🔪'),
  ('medicine', 'Medicine', '💊'),
  ('pediatrics', 'Pediatrics', '👶'),
  ('obgyn', 'OB/GYN', '🤰'),
  ('orthopedics', 'Orthopedics', '🦴'),
  ('radiology', 'Radiology', '📷'),
  ('pathology', 'Pathology', '🔬'),
  ('pharmacology', 'Pharmacology', '💉'),
  ('anatomy', 'Anatomy', '🫀'),
  ('physiology', 'Physiology', '⚡');
```

---

## 🚀 Supabase Setup Commands

```bash
# Initialize Supabase
npx supabase init

# Link to project
npx supabase link --project-ref YOUR_PROJECT_REF

# Generate types
npx supabase gen types typescript --linked > src/types/database.ts

# Run migrations
npx supabase db push
```

---

*Schema designed by Narasimha 🦁*
*Ready for implementation when Aditya approves tech stack.*
