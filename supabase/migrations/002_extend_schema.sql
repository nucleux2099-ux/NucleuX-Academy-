-- NucleuX Academy - Schema Extension
-- Migration: 002_extend_schema
-- Date: 2026-02-07
-- Purpose: Extend existing basic tables and add missing tables

-- =====================================================
-- 1. EXTEND PROFILES TABLE
-- =====================================================

-- Add missing columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS institution TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS target_exam TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS target_date DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Asia/Kolkata';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- =====================================================
-- 2. EXTEND ATOMS TABLE
-- =====================================================

-- Add missing columns to atoms
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'note';
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '{}';
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS specialty TEXT;
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS system TEXT;
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS topic TEXT;
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS subtopic TEXT;
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS source_type TEXT;
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS source_textbook TEXT;
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS source_edition TEXT;
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS source_chapter TEXT;
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS source_page TEXT;
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS difficulty INT DEFAULT 2;
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS read_time_minutes INT;
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0;
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS save_count INT DEFAULT 0;
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(2,1);
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES profiles(id);
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE atoms ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- =====================================================
-- 3. EXTEND MCQS TABLE
-- =====================================================

ALTER TABLE mcqs ADD COLUMN IF NOT EXISTS question_type TEXT DEFAULT 'single';
ALTER TABLE mcqs ADD COLUMN IF NOT EXISTS stem TEXT;
ALTER TABLE mcqs ADD COLUMN IF NOT EXISTS subtopic TEXT;
ALTER TABLE mcqs ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE mcqs ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE mcqs ADD COLUMN IF NOT EXISTS source_exam TEXT;
ALTER TABLE mcqs ADD COLUMN IF NOT EXISTS atom_id UUID REFERENCES atoms(id);
ALTER TABLE mcqs ADD COLUMN IF NOT EXISTS explanation_atom_id UUID REFERENCES atoms(id);
ALTER TABLE mcqs ADD COLUMN IF NOT EXISTS attempt_count INT DEFAULT 0;
ALTER TABLE mcqs ADD COLUMN IF NOT EXISTS correct_rate DECIMAL(4,2);
ALTER TABLE mcqs ADD COLUMN IF NOT EXISTS avg_time_seconds INT;
ALTER TABLE mcqs ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE mcqs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- =====================================================
-- 4. EXTEND PATHWAYS TABLE
-- =====================================================

ALTER TABLE pathways ADD COLUMN IF NOT EXISTS target_exam TEXT;
ALTER TABLE pathways ADD COLUMN IF NOT EXISTS topic_count INT DEFAULT 0;
ALTER TABLE pathways ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES profiles(id);
ALTER TABLE pathways ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- =====================================================
-- 5. EXTEND USER_NOTES TABLE
-- =====================================================

ALTER TABLE user_notes ADD COLUMN IF NOT EXISTS mcq_id UUID REFERENCES mcqs(id);
ALTER TABLE user_notes ADD COLUMN IF NOT EXISTS specialty TEXT;
ALTER TABLE user_notes ADD COLUMN IF NOT EXISTS topic TEXT;
ALTER TABLE user_notes ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE user_notes ADD COLUMN IF NOT EXISTS folder TEXT DEFAULT 'inbox';
ALTER TABLE user_notes ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;
ALTER TABLE user_notes ADD COLUMN IF NOT EXISTS color TEXT;
ALTER TABLE user_notes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- =====================================================
-- 6. CREATE NEW TABLES
-- =====================================================

-- User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  daily_goal_minutes INT DEFAULT 60,
  mcq_daily_target INT DEFAULT 20,
  preferred_study_time TEXT DEFAULT 'evening',
  notification_email BOOLEAN DEFAULT TRUE,
  notification_telegram BOOLEAN DEFAULT TRUE,
  telegram_chat_id TEXT,
  theme TEXT DEFAULT 'dark',
  atom_proactive BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Streaks
CREATE TABLE IF NOT EXISTS streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_study_date DATE,
  streak_started_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Atom Citations
CREATE TABLE IF NOT EXISTS atom_citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  atom_id UUID REFERENCES atoms(id) ON DELETE CASCADE,
  textbook TEXT NOT NULL,
  edition TEXT,
  chapter TEXT,
  section TEXT,
  page_start INT,
  page_end INT,
  quote TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Atom Connections (Knowledge Graph)
CREATE TABLE IF NOT EXISTS atom_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_atom_id UUID REFERENCES atoms(id) ON DELETE CASCADE,
  to_atom_id UUID REFERENCES atoms(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL,
  strength INT DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_atom_id, to_atom_id)
);

-- User Atom Progress
CREATE TABLE IF NOT EXISTS user_atom_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  atom_id UUID REFERENCES atoms(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started',
  progress_percent INT DEFAULT 0,
  time_spent_seconds INT DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  rating INT,
  is_saved BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, atom_id)
);

-- Study Sessions
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  duration_minutes INT,
  atoms_studied UUID[],
  mcqs_attempted INT DEFAULT 0,
  mcqs_correct INT DEFAULT 0,
  notes_created INT DEFAULT 0,
  source TEXT DEFAULT 'web',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Stats
CREATE TABLE IF NOT EXISTS daily_stats (
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

-- Pathway Topics
CREATE TABLE IF NOT EXISTS pathway_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id UUID REFERENCES pathways(id) ON DELETE CASCADE,
  atom_id UUID REFERENCES atoms(id) ON DELETE CASCADE,
  sequence_order INT NOT NULL,
  is_required BOOLEAN DEFAULT TRUE,
  estimated_minutes INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Pathways
CREATE TABLE IF NOT EXISTS user_pathways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pathway_id UUID REFERENCES pathways(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active',
  progress_percent INT DEFAULT 0,
  current_topic_id UUID REFERENCES pathway_topics(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, pathway_id)
);

-- MCQ Options
CREATE TABLE IF NOT EXISTS mcq_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mcq_id UUID REFERENCES mcqs(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_order INT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MCQ Attempts
CREATE TABLE IF NOT EXISTS mcq_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mcq_id UUID REFERENCES mcqs(id) ON DELETE CASCADE,
  selected_options UUID[],
  is_correct BOOLEAN,
  time_taken_seconds INT,
  confidence INT,
  session_id UUID REFERENCES study_sessions(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discussions
CREATE TABLE IF NOT EXISTS discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  atom_id UUID REFERENCES atoms(id),
  mcq_id UUID REFERENCES mcqs(id),
  specialty TEXT,
  tags TEXT[],
  view_count INT DEFAULT 0,
  reply_count INT DEFAULT 0,
  upvote_count INT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id),
  content TEXT NOT NULL,
  upvote_count INT DEFAULT 0,
  is_accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ATOM Interactions
CREATE TABLE IF NOT EXISTS atom_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL,
  session_id TEXT,
  query TEXT NOT NULL,
  response TEXT,
  atoms_referenced UUID[],
  mcqs_generated UUID[],
  tokens_used INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ATOM Recommendations
CREATE TABLE IF NOT EXISTS atom_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  atom_id UUID REFERENCES atoms(id),
  reason TEXT NOT NULL,
  priority INT DEFAULT 5,
  is_dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- =====================================================
-- 7. INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_atoms_specialty ON atoms(specialty);
CREATE INDEX IF NOT EXISTS idx_atoms_topic ON atoms(topic);
CREATE INDEX IF NOT EXISTS idx_atoms_type ON atoms(type);
CREATE INDEX IF NOT EXISTS idx_atoms_tags ON atoms USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_atoms_slug ON atoms(slug);

CREATE INDEX IF NOT EXISTS idx_mcqs_specialty ON mcqs(specialty);
CREATE INDEX IF NOT EXISTS idx_mcqs_topic ON mcqs(topic);
CREATE INDEX IF NOT EXISTS idx_mcqs_difficulty ON mcqs(difficulty);

CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_atom_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_atom ON user_atom_progress(atom_id);

CREATE INDEX IF NOT EXISTS idx_daily_stats_user_date ON daily_stats(user_id, date);

-- =====================================================
-- 8. FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers (drop first to avoid conflicts)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_atoms_updated_at ON atoms;
CREATE TRIGGER update_atoms_updated_at
  BEFORE UPDATE ON atoms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_user_notes_updated_at ON user_notes;
CREATE TRIGGER update_user_notes_updated_at
  BEFORE UPDATE ON user_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_mcqs_updated_at ON mcqs;
CREATE TRIGGER update_mcqs_updated_at
  BEFORE UPDATE ON mcqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id);
  
  INSERT INTO streaks (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- 9. ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE atoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE atom_citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE atom_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_atom_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathway_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcq_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcq_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE atom_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE atom_recommendations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable" ON profiles;

-- Profiles policies
CREATE POLICY "Public profiles are viewable"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User preferences policies
DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Streaks policies
DROP POLICY IF EXISTS "Users can view own streaks" ON streaks;
DROP POLICY IF EXISTS "Users can update own streaks" ON streaks;

CREATE POLICY "Users can view own streaks"
  ON streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own streaks"
  ON streaks FOR ALL
  USING (auth.uid() = user_id);

-- Atoms policies (public read)
DROP POLICY IF EXISTS "Published atoms are viewable" ON atoms;
CREATE POLICY "Published atoms are viewable"
  ON atoms FOR SELECT
  USING (is_published = true);

-- Atom citations (public read)
CREATE POLICY "Atom citations are viewable"
  ON atom_citations FOR SELECT
  USING (true);

-- Atom connections (public read)
CREATE POLICY "Atom connections are viewable"
  ON atom_connections FOR SELECT
  USING (true);

-- User progress policies
DROP POLICY IF EXISTS "Users can view own progress" ON user_atom_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_atom_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_atom_progress;

CREATE POLICY "Users can manage own progress"
  ON user_atom_progress FOR ALL
  USING (auth.uid() = user_id);

-- Study sessions policies
CREATE POLICY "Users can manage own sessions"
  ON study_sessions FOR ALL
  USING (auth.uid() = user_id);

-- Daily stats policies
CREATE POLICY "Users can manage own stats"
  ON daily_stats FOR ALL
  USING (auth.uid() = user_id);

-- Pathways (public read)
CREATE POLICY "Pathways are viewable"
  ON pathways FOR SELECT
  USING (true);

-- Pathway topics (public read)
CREATE POLICY "Pathway topics are viewable"
  ON pathway_topics FOR SELECT
  USING (true);

-- User pathways
CREATE POLICY "Users can manage own pathways"
  ON user_pathways FOR ALL
  USING (auth.uid() = user_id);

-- MCQs (public read)
DROP POLICY IF EXISTS "Published MCQs are viewable" ON mcqs;
CREATE POLICY "Published MCQs are viewable"
  ON mcqs FOR SELECT
  USING (is_published = true);

-- MCQ options (public read)
CREATE POLICY "MCQ options are viewable"
  ON mcq_options FOR SELECT
  USING (true);

-- MCQ attempts
CREATE POLICY "Users can manage own attempts"
  ON mcq_attempts FOR ALL
  USING (auth.uid() = user_id);

-- User notes
DROP POLICY IF EXISTS "Users can manage own notes" ON user_notes;
CREATE POLICY "Users can manage own notes"
  ON user_notes FOR ALL
  USING (auth.uid() = user_id);

-- Discussions (public read, auth write)
CREATE POLICY "Discussions are viewable"
  ON discussions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create discussions"
  ON discussions FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own discussions"
  ON discussions FOR UPDATE
  USING (auth.uid() = author_id);

-- Comments (public read, auth write)
CREATE POLICY "Comments are viewable"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = author_id);

-- ATOM interactions
CREATE POLICY "Users can manage own interactions"
  ON atom_interactions FOR ALL
  USING (auth.uid() = user_id);

-- ATOM recommendations
CREATE POLICY "Users can view own recommendations"
  ON atom_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can dismiss own recommendations"
  ON atom_recommendations FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- DONE! Schema extended.
-- =====================================================
