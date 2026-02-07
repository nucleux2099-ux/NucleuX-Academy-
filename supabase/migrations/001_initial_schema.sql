-- NucleuX Academy - Initial Database Schema
-- Version: 1.0
-- Date: 2026-02-07

-- ==========================================
-- 1. PROFILES & USER PREFERENCES
-- ==========================================

CREATE TABLE profiles (
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- ==========================================
-- 2. ATOMS (CONTENT)
-- ==========================================

CREATE TABLE atoms (
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

CREATE INDEX idx_atoms_specialty ON atoms(specialty);
CREATE INDEX idx_atoms_topic ON atoms(topic);
CREATE INDEX idx_atoms_type ON atoms(type);
CREATE INDEX idx_atoms_tags ON atoms USING GIN(tags);

CREATE TABLE atom_citations (
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

CREATE TABLE atom_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_atom_id UUID REFERENCES atoms(id) ON DELETE CASCADE,
  to_atom_id UUID REFERENCES atoms(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL,
  strength INT DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_atom_id, to_atom_id)
);

-- ==========================================
-- 3. PROGRESS TRACKING
-- ==========================================

CREATE TABLE user_atom_progress (
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
  source TEXT DEFAULT 'web',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- ==========================================
-- 4. PATHWAYS
-- ==========================================

CREATE TABLE pathways (
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

CREATE TABLE pathway_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id UUID REFERENCES pathways(id) ON DELETE CASCADE,
  atom_id UUID REFERENCES atoms(id) ON DELETE CASCADE,
  sequence_order INT NOT NULL,
  is_required BOOLEAN DEFAULT TRUE,
  estimated_minutes INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_pathways (
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

-- ==========================================
-- 5. MCQs
-- ==========================================

CREATE TABLE mcqs (
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

CREATE TABLE mcq_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mcq_id UUID REFERENCES mcqs(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_order INT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE mcq_attempts (
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

-- ==========================================
-- 6. USER NOTES
-- ==========================================

CREATE TABLE user_notes (
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

-- ==========================================
-- 7. COMMUNITY
-- ==========================================

CREATE TABLE discussions (
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

CREATE TABLE comments (
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

-- ==========================================
-- 8. ATOM INTEGRATION
-- ==========================================

CREATE TABLE atom_interactions (
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

CREATE TABLE atom_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  atom_id UUID REFERENCES atoms(id),
  reason TEXT NOT NULL,
  priority INT DEFAULT 5,
  is_dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- ==========================================
-- 9. ANALYTICS
-- ==========================================

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

-- ==========================================
-- 10. ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_atom_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcq_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE atom_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE atom_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Public content policies
CREATE POLICY "Public atoms viewable by all" ON atoms FOR SELECT USING (is_published = true);
CREATE POLICY "Public pathways viewable by all" ON pathways FOR SELECT USING (true);
CREATE POLICY "Public MCQs viewable by all" ON mcqs FOR SELECT USING (is_published = true);
CREATE POLICY "Public discussions viewable by all" ON discussions FOR SELECT USING (true);

-- User-specific policies
CREATE POLICY "Users can manage own progress" ON user_atom_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sessions" ON study_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own streaks" ON streaks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own pathways" ON user_pathways FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own attempts" ON mcq_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notes" ON user_notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own stats" ON daily_stats FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 11. TRIGGERS
-- ==========================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.streaks (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER atoms_updated_at BEFORE UPDATE ON atoms FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER user_notes_updated_at BEFORE UPDATE ON user_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- Done! 🧬
-- ==========================================
