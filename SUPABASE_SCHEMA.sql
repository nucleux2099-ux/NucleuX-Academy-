-- NucleuX Academy - Supabase Database Schema Requirements
-- Extracted from API route analysis (app/api/*)
-- Run this in your Supabase SQL Editor

-- ==========================================
-- 1. BASE TABLES
-- ==========================================

-- Atoms represent individual learning units (topics, cases, etc.)
CREATE TABLE atoms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    type TEXT,
    specialty TEXT,
    topic TEXT,
    subtopic TEXT,
    read_time_minutes INTEGER,
    difficulty INTEGER,
    is_published BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pathways represent structured learning paths
CREATE TABLE pathways (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    atoms TEXT[] DEFAULT '{}', -- array of atom slugs or IDs
    total_atoms INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 2. USER TABLES
-- ==========================================

-- User Profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    specialty TEXT,
    level TEXT,
    institution TEXT,
    target_exam TEXT,
    target_date DATE,
    timezone TEXT,
    plan TEXT DEFAULT 'free',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Preferences
CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    daily_goal_minutes INTEGER DEFAULT 60,
    mcq_daily_target INTEGER DEFAULT 20,
    preferred_study_time TEXT DEFAULT 'evening',
    notification_email BOOLEAN DEFAULT TRUE,
    notification_telegram BOOLEAN DEFAULT FALSE,
    telegram_chat_id TEXT,
    theme TEXT DEFAULT 'dark',
    atom_proactive BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Streaks
CREATE TABLE streaks (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_study_date DATE,
    streak_started_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. PROGRESS & ANALYTICS TABLES
-- ==========================================

-- User Atom Progress (Topic/Content Progress)
CREATE TABLE user_atom_progress (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    atom_id UUID REFERENCES atoms(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
    progress_percent INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    rating INTEGER,
    is_saved BOOLEAN DEFAULT FALSE,
    notes TEXT,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, atom_id)
);

-- User Pathways
CREATE TABLE user_pathways (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    pathway_id UUID REFERENCES pathways(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active',
    current_atom_index INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, pathway_id)
);

-- Study Sessions
CREATE TABLE study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    atoms_studied TEXT[] DEFAULT '{}',
    mcqs_attempted INTEGER DEFAULT 0,
    mcqs_correct INTEGER DEFAULT 0,
    notes_created INTEGER DEFAULT 0,
    source TEXT DEFAULT 'web',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Stats
CREATE TABLE daily_stats (
    date DATE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    study_minutes INTEGER DEFAULT 0,
    mcqs_attempted INTEGER DEFAULT 0,
    mcqs_correct INTEGER DEFAULT 0,
    atoms_completed INTEGER DEFAULT 0,
    PRIMARY KEY (date, user_id)
);

-- MCQ Attempts
CREATE TABLE mcq_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mcq_id TEXT NOT NULL, -- UUID or string
    is_correct BOOLEAN NOT NULL,
    time_taken_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generic Analytics Events
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_name TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 4. RPC/PROCEDURES
-- ==========================================

-- Increment study time securely via RPC
CREATE OR REPLACE FUNCTION increment_study_time(p_user_id UUID, p_date DATE, p_minutes INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO daily_stats (date, user_id, study_minutes)
    VALUES (p_date, p_user_id, p_minutes)
    ON CONFLICT (date, user_id)
    DO UPDATE SET study_minutes = daily_stats.study_minutes + p_minutes;
END;
$$;

-- Increment MCQ stats securely via RPC
CREATE OR REPLACE FUNCTION increment_mcq_stats(p_user_id UUID, p_date DATE, p_attempted INTEGER, p_correct INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO daily_stats (date, user_id, mcqs_attempted, mcqs_correct)
    VALUES (p_date, p_user_id, p_attempted, p_correct)
    ON CONFLICT (date, user_id)
    DO UPDATE SET 
        mcqs_attempted = daily_stats.mcqs_attempted + p_attempted,
        mcqs_correct = daily_stats.mcqs_correct + p_correct;
END;
$$;

-- Increment topics completed via RPC
CREATE OR REPLACE FUNCTION increment_topics_completed(p_user_id UUID, p_date DATE)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO daily_stats (date, user_id, atoms_completed)
    VALUES (p_date, p_user_id, 1)
    ON CONFLICT (date, user_id)
    DO UPDATE SET atoms_completed = daily_stats.atoms_completed + 1;
END;
$$;

-- ==========================================
-- 5. TRIGGERS / RLS (Sample)
-- ==========================================

-- Example: Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  
  INSERT INTO public.user_preferences (user_id)
  VALUES (new.id);
  
  INSERT INTO public.streaks (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
