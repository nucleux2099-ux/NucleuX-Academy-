-- NucleuX Academy - Competency Progress Schema
-- Migration: 004_competency_progress
-- Date: 2026-02-08

-- =====================================================
-- CBME COMPETENCY TRACKING
-- =====================================================

-- Competencies master table (sync from content/cbme/)
CREATE TABLE IF NOT EXISTS competencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,          -- e.g., "AN1.1", "PY2.3"
  subject TEXT NOT NULL,               -- e.g., "Anatomy", "Physiology"
  phase TEXT NOT NULL,                 -- "Phase-1", "Phase-2", "Phase-3A", "Phase-3B"
  description TEXT NOT NULL,
  type CHAR(1) NOT NULL,              -- K=Knowledge, S=Skill, A=Attitude, C=Communication
  level TEXT NOT NULL,                 -- "Must Know", "Should Know", "Nice to Know"
  domain TEXT NOT NULL,                -- "Cognitive", "Psychomotor", "Affective"
  is_core BOOLEAN DEFAULT TRUE,
  xp_reward INT DEFAULT 10,
  linked_topics TEXT[],                -- Array of topic slugs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User competency progress
CREATE TABLE IF NOT EXISTS competency_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  competency_code TEXT NOT NULL,
  status TEXT DEFAULT 'not_started',   -- not_started, in_progress, completed, mastered
  progress_percent INT DEFAULT 0,
  xp_earned INT DEFAULT 0,
  read_at TIMESTAMPTZ,                 -- When topic was read
  quizzed_at TIMESTAMPTZ,              -- When quiz was passed
  mastered_at TIMESTAMPTZ,             -- When fully mastered
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, competency_code)
);

-- User XP & leveling
CREATE TABLE IF NOT EXISTS user_xp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  total_xp INT DEFAULT 0,
  level INT DEFAULT 1,
  level_name TEXT DEFAULT 'Fresher',
  competencies_completed INT DEFAULT 0,
  competencies_mastered INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pathways progress
CREATE TABLE IF NOT EXISTS pathway_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pathway_id TEXT NOT NULL,            -- e.g., "anatomy-upper-limb"
  status TEXT DEFAULT 'not_started',   -- not_started, in_progress, completed
  current_step INT DEFAULT 0,
  total_steps INT,
  xp_earned INT DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pathway_id)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_competencies_subject ON competencies(subject);
CREATE INDEX IF NOT EXISTS idx_competencies_phase ON competencies(phase);
CREATE INDEX IF NOT EXISTS idx_competency_progress_user ON competency_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_competency_progress_status ON competency_progress(status);
CREATE INDEX IF NOT EXISTS idx_pathway_progress_user ON pathway_progress(user_id);

-- =====================================================
-- LEVEL DEFINITIONS
-- =====================================================
-- Level 1: Fresher (0-500 XP)
-- Level 2: Learner (501-1500 XP)
-- Level 3: Student (1501-3500 XP)
-- Level 4: Scholar (3501-7000 XP)
-- Level 5: Expert (7001-15000 XP)
-- Level 6: Master (15001-30000 XP)
-- Level 7: Specialist (30001-50000 XP)
-- Level 8: Consultant (50001+ XP)

-- Function to calculate level from XP
CREATE OR REPLACE FUNCTION calculate_level(xp INT)
RETURNS TABLE(level INT, level_name TEXT) AS $$
BEGIN
  IF xp <= 500 THEN RETURN QUERY SELECT 1, 'Fresher'::TEXT;
  ELSIF xp <= 1500 THEN RETURN QUERY SELECT 2, 'Learner'::TEXT;
  ELSIF xp <= 3500 THEN RETURN QUERY SELECT 3, 'Student'::TEXT;
  ELSIF xp <= 7000 THEN RETURN QUERY SELECT 4, 'Scholar'::TEXT;
  ELSIF xp <= 15000 THEN RETURN QUERY SELECT 5, 'Expert'::TEXT;
  ELSIF xp <= 30000 THEN RETURN QUERY SELECT 6, 'Master'::TEXT;
  ELSIF xp <= 50000 THEN RETURN QUERY SELECT 7, 'Specialist'::TEXT;
  ELSE RETURN QUERY SELECT 8, 'Consultant'::TEXT;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update level when XP changes
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
DECLARE
  new_level INT;
  new_level_name TEXT;
BEGIN
  SELECT level, level_name INTO new_level, new_level_name FROM calculate_level(NEW.total_xp);
  NEW.level := new_level;
  NEW.level_name := new_level_name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_level ON user_xp;
CREATE TRIGGER trigger_update_level
  BEFORE UPDATE OF total_xp ON user_xp
  FOR EACH ROW
  EXECUTE FUNCTION update_user_level();

-- =====================================================
-- RLS POLICIES
-- =====================================================
ALTER TABLE competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE competency_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathway_progress ENABLE ROW LEVEL SECURITY;

-- Competencies are readable by all authenticated users
CREATE POLICY "Competencies are viewable by all" ON competencies
  FOR SELECT TO authenticated USING (true);

-- Users can only see/edit their own progress
CREATE POLICY "Users can view own competency progress" ON competency_progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own competency progress" ON competency_progress
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own competency progress" ON competency_progress
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Users can only see/edit their own XP
CREATE POLICY "Users can view own XP" ON user_xp
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own XP" ON user_xp
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own XP" ON user_xp
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Users can only see/edit their own pathway progress
CREATE POLICY "Users can view own pathway progress" ON pathway_progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pathway progress" ON pathway_progress
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pathway progress" ON pathway_progress
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
