# NucleuX Academy — Supabase Database Setup

## Quick Setup (3 steps)

### Step 1: Create Tables + RLS Policies
1. Open **Supabase Dashboard → SQL Editor**
2. Paste the entire contents of `combined-migration.sql`
3. Click **Run**

This creates all 24 tables, indexes, triggers, RLS policies, and the `handle_new_user` auth trigger.

### Step 2: Seed MCQ Data
1. Open **SQL Editor** again
2. Paste the contents of `seeds/mcq-seed.sql`
3. Click **Run**

This inserts **625 MCQs** extracted from the content YAML files into the `questions` table.

### Step 3: Verify
```sql
-- Check tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Check MCQ count
SELECT count(*) FROM questions;

-- Check auth trigger
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

## Files

| File | Purpose |
|------|---------|
| `combined-migration.sql` | All tables, indexes, functions, triggers, RLS — one file |
| `seeds/mcq-seed.sql` | 625 MCQs from content/ YAML files |
| `migrations/001-004` | Original individual migration files (reference only) |
| `fixes/fix_handle_new_user.sql` | Improved auth trigger (already included in combined) |

## Tables Overview

**User:** profiles, user_preferences, streaks, user_xp
**Content:** atoms, atom_citations, atom_connections, questions
**MCQ:** mcqs, mcq_options, mcq_attempts
**Progress:** user_atom_progress, competency_progress, pathway_progress, daily_stats, study_sessions
**Pathways:** pathways, pathway_topics, user_pathways
**Competency:** competencies
**Community:** discussions, comments
**AI:** atom_interactions, atom_recommendations
**Notes:** user_notes
