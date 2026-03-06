-- NucleuX Academy - Initial Schema
-- Migration: 001_initial_schema
-- Date: 2026-02-07

-- =====================================================
-- 1. USER TABLES
-- =====================================================

-- Profiles (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  specialty TEXT,
  level TEXT DEFAULT 'student',
  institution TEXT,
  target_exam TEXT,
  target_date DATE,
  timezone TEXT DEFAULT 'Asia/Kolkata',
  plan TEXT DEFAULT 'free',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- =====================================================
-- 2. CONTENT TABLES (Atoms)
-- =====================================================

-- Atoms - Core knowledge units
CREATE TABLE IF NOT EXISTS atoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  content JSONB NOT NULL,
  summary TEXT,
  specialty TEXT NOT NULL,
  system TEXT,
  topic TEXT NOT NULL,
  subtopic TEXT,
  tags TEXT[],
  source_type TEXT,
  source_textbook TEXT,
  source_edition TEXT,
  source_chapter TEXT,
  source_page TEXT,
  difficulty INT DEFAULT 2,
  read_time_minutes INT,
  is_premium BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  view_count INT DEFAULT 0,
  save_count INT DEFAULT 0,
  avg_rating DECIMAL(2,1),
  author_id UUID REFERENCES profiles(id),
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

-- Atom Connections (Knowledge Graph edges)
CREATE TABLE IF NOT EXISTS atom_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_atom_id UUID REFERENCES atoms(id) ON DELETE CASCADE,
  to_atom_id UUID REFERENCES atoms(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL,
  strength INT DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_atom_id, to_atom_id)
);

-- =====================================================
-- 3. PROGRESS TABLES
-- =====================================================

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

-- =====================================================
-- 4. PATHWAYS
-- =====================================================

-- Pathways
CREATE TABLE IF NOT EXISTS pathways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  specialty TEXT NOT NULL,
  target_exam TEXT,
  difficulty INT DEFAULT 2,
  estimated_hours INT,
  topic_count INT DEFAULT 0,
  is_official BOOLEAN DEFAULT TRUE,
  author_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
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

-- =====================================================
-- 5. MCQs
-- =====================================================

-- MCQs
CREATE TABLE IF NOT EXISTS mcqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  question_type TEXT DEFAULT 'single',
  stem TEXT,
  specialty TEXT NOT NULL,
  topic TEXT NOT NULL,
  subtopic TEXT,
  tags TEXT[],
  difficulty INT DEFAULT 2,
  source TEXT,
  source_exam TEXT,
  atom_id UUID REFERENCES atoms(id),
  explanation_atom_id UUID REFERENCES atoms(id),
  attempt_count INT DEFAULT 0,
  correct_rate DECIMAL(4,2),
  avg_time_seconds INT,
  is_premium BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
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

-- =====================================================
-- 6. USER NOTES
-- =====================================================

CREATE TABLE IF NOT EXISTS user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  atom_id UUID REFERENCES atoms(id),
  mcq_id UUID REFERENCES mcqs(id),
  specialty TEXT,
  topic TEXT,
  tags TEXT[],
  folder TEXT DEFAULT 'inbox',
  is_pinned BOOLEAN DEFAULT FALSE,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. COMMUNITY
-- =====================================================

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

-- =====================================================
-- 8. ATOM INTEGRATION
-- =====================================================

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
-- 9. INDEXES
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
-- 10. FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_atoms_updated_at
  BEFORE UPDATE ON atoms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_notes_updated_at
  BEFORE UPDATE ON user_notes
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

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- 11. ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_atom_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcq_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE atom_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE atom_recommendations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable"
  ON profiles FOR SELECT
  USING (true);

-- User preferences policies
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Streaks policies
CREATE POLICY "Users can view own streaks"
  ON streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks"
  ON streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- Atoms policies (public read)
ALTER TABLE atoms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published atoms are viewable"
  ON atoms FOR SELECT
  USING (is_published = true);

-- User progress policies
CREATE POLICY "Users can view own progress"
  ON user_atom_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_atom_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_atom_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Study sessions policies
CREATE POLICY "Users can manage own sessions"
  ON study_sessions FOR ALL
  USING (auth.uid() = user_id);

-- Daily stats policies
CREATE POLICY "Users can view own stats"
  ON daily_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON daily_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON daily_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- User notes policies
CREATE POLICY "Users can manage own notes"
  ON user_notes FOR ALL
  USING (auth.uid() = user_id);

-- MCQs public read
ALTER TABLE mcqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published MCQs are viewable"
  ON mcqs FOR SELECT
  USING (is_published = true);

ALTER TABLE mcq_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "MCQ options are viewable"
  ON mcq_options FOR SELECT
  USING (true);

-- MCQ attempts
CREATE POLICY "Users can manage own attempts"
  ON mcq_attempts FOR ALL
  USING (auth.uid() = user_id);

-- Pathways public read
ALTER TABLE pathways ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pathways are viewable"
  ON pathways FOR SELECT
  USING (true);

ALTER TABLE pathway_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pathway topics are viewable"
  ON pathway_topics FOR SELECT
  USING (true);

-- User pathways
CREATE POLICY "Users can manage own pathways"
  ON user_pathways FOR ALL
  USING (auth.uid() = user_id);

-- Discussions
CREATE POLICY "Discussions are viewable"
  ON discussions FOR SELECT
  USING (true);

CREATE POLICY "Users can create discussions"
  ON discussions FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own discussions"
  ON discussions FOR UPDATE
  USING (auth.uid() = author_id);

-- Comments
CREATE POLICY "Comments are viewable"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Users can create comments"
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

CREATE POLICY "Users can dismiss recommendations"
  ON atom_recommendations FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- DONE! Schema ready.
-- =====================================================
