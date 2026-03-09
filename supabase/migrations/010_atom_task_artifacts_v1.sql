-- 010_atom_task_artifacts_v1.sql
-- Phase C: structured artifacts contract + scoped downloads.

create table if not exists public.atom_task_artifacts_v1 (
  id uuid primary key,
  task_id uuid null references public.atom_tasks(id) on delete set null,
  session_id uuid not null references public.atom_sessions(id) on delete cascade,
  message_id uuid null references public.atom_session_messages(id) on delete set null,
  scope_key text not null,
  kind text not null,
  mime text not null,
  title text not null,
  metadata jsonb not null default '{}'::jsonb,
  provenance jsonb not null default '{}'::jsonb,
  content_inline text null,
  blob_path text null,
  content_sha256 text not null,
  size_bytes int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (content_inline is not null or blob_path is not null)
);

create index if not exists atom_task_artifacts_v1_session_idx
  on public.atom_task_artifacts_v1 (session_id, created_at desc);

create index if not exists atom_task_artifacts_v1_scope_idx
  on public.atom_task_artifacts_v1 (scope_key, created_at desc);

create index if not exists atom_task_artifacts_v1_kind_idx
  on public.atom_task_artifacts_v1 (kind, created_at desc);

alter table public.atom_task_artifacts_v1 enable row level security;

create policy "Users can select own v1 artifacts" on public.atom_task_artifacts_v1
  for select to authenticated using (
    exists (
      select 1 from public.atom_sessions s
      where s.id = atom_task_artifacts_v1.session_id
      and s.user_id = auth.uid()
    )
  );

create policy "Users can insert own v1 artifacts" on public.atom_task_artifacts_v1
  for insert to authenticated with check (
    exists (
      select 1 from public.atom_sessions s
      where s.id = atom_task_artifacts_v1.session_id
      and s.user_id = auth.uid()
    )
  );

create policy "Users can update own v1 artifacts" on public.atom_task_artifacts_v1
  for update to authenticated using (
    exists (
      select 1 from public.atom_sessions s
      where s.id = atom_task_artifacts_v1.session_id
      and s.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.atom_sessions s
      where s.id = atom_task_artifacts_v1.session_id
      and s.user_id = auth.uid()
    )
  );

create or replace function public.set_atom_task_artifacts_v1_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists atom_task_artifacts_v1_updated_at_trg on public.atom_task_artifacts_v1;
create trigger atom_task_artifacts_v1_updated_at_trg
before update on public.atom_task_artifacts_v1
for each row execute procedure public.set_atom_task_artifacts_v1_updated_at();

-- Rollback notes:
--   drop trigger if exists atom_task_artifacts_v1_updated_at_trg on public.atom_task_artifacts_v1;
--   drop function if exists public.set_atom_task_artifacts_v1_updated_at();
--   drop table if exists public.atom_task_artifacts_v1;
