-- Phase E4/E5 hardening: dedupe/cooldown support, stricter constraints/indexes, RLS defense-in-depth

alter table public.atom_telemetry_alerts
  add column if not exists dedupe_key text,
  add column if not exists time_bucket timestamptz,
  add column if not exists cooldown_until timestamptz;

update public.atom_telemetry_alerts
set time_bucket = date_trunc('hour', ts),
    dedupe_key = concat(scope_key, ':', kind, ':', to_char(date_trunc('hour', ts), 'YYYY-MM-DD"T"HH24:00:00"Z"'))
where dedupe_key is null or time_bucket is null;

alter table public.atom_telemetry_alerts
  alter column dedupe_key set not null,
  alter column time_bucket set not null;

alter table public.atom_telemetry_alerts
  add constraint atom_telemetry_alerts_kind_chk
  check (kind in ('failure_rate_spike','fallback_rate_spike','grounding_score_drop','security_anomaly'));

create unique index if not exists idx_atom_alerts_dedupe_bucket on public.atom_telemetry_alerts(dedupe_key, time_bucket);
create index if not exists idx_atom_alerts_scope_kind_ts on public.atom_telemetry_alerts(scope_key, kind, ts desc);
create index if not exists idx_atom_alerts_scope_bucket on public.atom_telemetry_alerts(scope_key, time_bucket desc);

alter table public.atom_telemetry_rollups
  add constraint atom_telemetry_rollups_non_negative_chk
  check (events >= 0 and failures >= 0 and fallbacks >= 0 and p95_latency_ms >= 0);

create index if not exists idx_atom_feedback_scope_type_created on public.atom_feedback(scope_key, feedback_type, created_at desc);
create index if not exists idx_atom_feedback_actor_scope_created on public.atom_feedback(actor_user_id, scope_key, created_at desc);

-- Tighten open SELECT policies by requiring same-user event evidence for scope.
drop policy if exists "Users can read own scoped rollups" on public.atom_telemetry_rollups;
create policy "Users can read own scoped rollups"
on public.atom_telemetry_rollups
for select
using (
  exists (
    select 1 from public.atom_telemetry_events e
    where e.scope_key = atom_telemetry_rollups.scope_key
      and e.actor_user_id = auth.uid()
  )
);

drop policy if exists "Users can read own scoped alerts" on public.atom_telemetry_alerts;
create policy "Users can read own scoped alerts"
on public.atom_telemetry_alerts
for select
using (
  exists (
    select 1 from public.atom_telemetry_events e
    where e.scope_key = atom_telemetry_alerts.scope_key
      and e.actor_user_id = auth.uid()
  )
);

drop policy if exists "Users can read own scoped feedback" on public.atom_feedback;
create policy "Users can read own scoped feedback"
on public.atom_feedback
for select
using (
  auth.uid() = actor_user_id
  and exists (
    select 1 from public.atom_telemetry_events e
    where e.scope_key = atom_feedback.scope_key
      and e.actor_user_id = auth.uid()
  )
);
