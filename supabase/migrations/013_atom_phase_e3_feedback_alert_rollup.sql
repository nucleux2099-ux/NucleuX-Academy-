create table if not exists public.atom_feedback (
  id uuid primary key default gen_random_uuid(),
  scope_key text not null,
  actor_user_id uuid null references auth.users(id) on delete set null,
  session_id uuid null,
  message_id text null,
  artifact_id uuid null,
  feedback_type text not null check (feedback_type in ('thumbs_up','thumbs_down','rating','correction','outcome')),
  sentiment text null check (sentiment in ('positive','negative','neutral')),
  rating smallint null check (rating between 1 and 5),
  comment text null,
  classification text null,
  resolved boolean null,
  correction text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_atom_feedback_scope_created on public.atom_feedback(scope_key, created_at desc);
create index if not exists idx_atom_feedback_session on public.atom_feedback(session_id);

alter table public.atom_feedback enable row level security;

drop policy if exists "Users can read own scoped feedback" on public.atom_feedback;
create policy "Users can read own scoped feedback"
on public.atom_feedback
for select
using (auth.uid() = actor_user_id);

drop policy if exists "Users can insert own feedback" on public.atom_feedback;
create policy "Users can insert own feedback"
on public.atom_feedback
for insert
with check (auth.uid() = actor_user_id);

drop policy if exists "Users can update own feedback" on public.atom_feedback;
create policy "Users can update own feedback"
on public.atom_feedback
for update
using (auth.uid() = actor_user_id)
with check (auth.uid() = actor_user_id);

create table if not exists public.atom_telemetry_rollups (
  id bigint generated always as identity primary key,
  scope_key text not null,
  granularity text not null check (granularity in ('hour','day')),
  bucket_start timestamptz not null,
  window_label text not null,
  events integer not null default 0,
  failures integer not null default 0,
  fallbacks integer not null default 0,
  p95_latency_ms integer not null default 0,
  continuity_score numeric(8,4) not null default 0,
  grounding_score numeric(8,4) not null default 0,
  isolation_score numeric(8,4) not null default 0,
  personalization_score numeric(8,4) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(scope_key, granularity, bucket_start)
);

create index if not exists idx_atom_rollups_scope_gran_bucket on public.atom_telemetry_rollups(scope_key, granularity, bucket_start desc);

alter table public.atom_telemetry_rollups enable row level security;

drop policy if exists "Users can read own scoped rollups" on public.atom_telemetry_rollups;
create policy "Users can read own scoped rollups"
on public.atom_telemetry_rollups
for select
using (true);

create table if not exists public.atom_telemetry_alerts (
  id bigint generated always as identity primary key,
  event_id uuid not null unique default gen_random_uuid(),
  scope_key text not null,
  kind text not null,
  severity text not null check (severity in ('info','warning','critical')),
  metric_value numeric(10,4) null,
  threshold_value numeric(10,4) null,
  metadata jsonb not null default '{}'::jsonb,
  ts timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_atom_alerts_scope_ts on public.atom_telemetry_alerts(scope_key, ts desc);

alter table public.atom_telemetry_alerts enable row level security;

drop policy if exists "Users can read own scoped alerts" on public.atom_telemetry_alerts;
create policy "Users can read own scoped alerts"
on public.atom_telemetry_alerts
for select
using (true);

create index if not exists idx_atom_telemetry_event_id on public.atom_telemetry_events(event_id);
create index if not exists idx_atom_telemetry_created_at on public.atom_telemetry_events(created_at);
