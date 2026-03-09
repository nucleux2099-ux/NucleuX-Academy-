create table if not exists public.atom_telemetry_events (
  id bigint generated always as identity primary key,
  event_id uuid not null unique,
  event_name text not null,
  ts timestamptz not null default now(),
  scope_key text not null,
  actor_user_id uuid null references auth.users(id) on delete set null,
  session_id uuid null,
  route text not null,
  mode text not null,
  latency_ms integer not null check (latency_ms >= 0),
  status text not null,
  reason_code text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_atom_telemetry_scope_ts on public.atom_telemetry_events(scope_key, ts desc);
create index if not exists idx_atom_telemetry_route_ts on public.atom_telemetry_events(route, ts desc);
create index if not exists idx_atom_telemetry_name_ts on public.atom_telemetry_events(event_name, ts desc);

alter table public.atom_telemetry_events enable row level security;

drop policy if exists "Users can read own telemetry" on public.atom_telemetry_events;
create policy "Users can read own telemetry"
on public.atom_telemetry_events
for select
using (auth.uid() = actor_user_id);

drop policy if exists "Service role can insert telemetry" on public.atom_telemetry_events;
create policy "Service role can insert telemetry"
on public.atom_telemetry_events
for insert
with check (true);
