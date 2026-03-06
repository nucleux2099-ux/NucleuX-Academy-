# Database Guide

## Stack
- Supabase Postgres
- Supabase Auth
- Row Level Security (RLS)

## Source Files
- Core bootstrap: `supabase/combined-migration.sql`
- Incremental migrations: `supabase/migrations/*.sql`
- Seeds: `supabase/seeds/*.sql`
- Fixes: `supabase/fixes/*.sql`

## Recommended Bootstrap Order
For a fresh environment:
1. Run `supabase/combined-migration.sql`
2. Run `supabase/migrations/004_analytics_events.sql`
3. Optional seeds from `supabase/seeds/`

Why step 2:
- `analytics_events` is used by `/api/analytics` fallback telemetry writes.
- It is defined in `004_analytics_events.sql` and not part of `combined-migration.sql` in this snapshot.

## Migration-Only Alternative
If you prefer incremental migrations only, run in order:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_extend_schema.sql`
3. `supabase/migrations/003_rls_policies.sql`
4. `supabase/migrations/004_competency_progress.sql`
5. `supabase/migrations/004_analytics_events.sql`

## Tables Commonly Used by Runtime APIs
- Profile/auth context: `profiles`, `user_preferences`, `streaks`
- Progress and planning: `user_atom_progress`, `study_sessions`, `daily_stats`, `user_pathways`, `pathways`, `atoms`
- MCQ: `mcqs`, `mcq_attempts`, `questions`
- Curriculum progression: `competencies`, `competency_progress`, `pathway_progress`, `user_xp`
- Telemetry: `analytics_events`

## RPC/Function Dependencies in APIs
`/api/analytics` and `/api/study-sessions` rely on SQL RPCs such as:
- `increment_study_time`
- `increment_mcq_stats`
- `increment_topics_completed`

If these are missing in your DB, those endpoints will fail at runtime.

## Seeding
Common seed files:
- `supabase/seeds/mcq-seed.sql`
- `supabase/seeds/library_content.sql`
- `supabase/seeds/textbook_content.sql`
- `supabase/seeds/seed_shackelford-9th-ed.sql`

## Admin User
Preferred method:
- `npm run seed:admin` (`scripts/seed-admin.ts`)

Do not rely on:
- `create-admin.mjs` (legacy script with hardcoded credentials/keys)

## Verification Queries
After setup:
```sql
-- Confirm major tables exist
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Confirm analytics events table exists
SELECT to_regclass('public.analytics_events');

-- Confirm auth trigger exists
SELECT tgname
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
```
