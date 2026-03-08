-- 009_atom_sessions_core.sql
-- Core durable session tables for ATOM simple chat continuity.

create table if not exists public.atom_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  thread_id text not null,
  room_id text not null default 'atom',
  status text not null default 'active',
  selected_book_ids jsonb not null default '[]'::jsonb,
  last_user_query text,
  continuation_cursor jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, thread_id)
);

create index if not exists atom_sessions_user_updated_idx
  on public.atom_sessions(user_id, updated_at desc);

create table if not exists public.atom_session_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.atom_sessions(id) on delete cascade,
  turn_index bigint not null,
  role text not null check (role in ('user','assistant','system','tool')),
  content_md text not null,
  citations jsonb not null default '[]'::jsonb,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(session_id, turn_index)
);

create index if not exists atom_session_messages_session_turn_idx
  on public.atom_session_messages(session_id, turn_index desc);

create table if not exists public.atom_session_summaries (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.atom_sessions(id) on delete cascade,
  from_turn bigint not null,
  to_turn bigint not null,
  summary_md text not null,
  trigger text not null default 'manual' check (trigger in ('manual','auto')),
  created_at timestamptz not null default now()
);

create index if not exists atom_session_summaries_session_idx
  on public.atom_session_summaries(session_id, created_at desc);

alter table public.atom_sessions enable row level security;
alter table public.atom_session_messages enable row level security;
alter table public.atom_session_summaries enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='atom_sessions' and policyname='atom_sessions_own_select') then
    create policy atom_sessions_own_select on public.atom_sessions
    for select to authenticated using (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='atom_sessions' and policyname='atom_sessions_own_insert') then
    create policy atom_sessions_own_insert on public.atom_sessions
    for insert to authenticated with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='atom_sessions' and policyname='atom_sessions_own_update') then
    create policy atom_sessions_own_update on public.atom_sessions
    for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='atom_session_messages' and policyname='atom_session_messages_own_select') then
    create policy atom_session_messages_own_select on public.atom_session_messages
    for select to authenticated using (
      exists (select 1 from public.atom_sessions s where s.id = session_id and s.user_id = auth.uid())
    );
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='atom_session_messages' and policyname='atom_session_messages_own_insert') then
    create policy atom_session_messages_own_insert on public.atom_session_messages
    for insert to authenticated with check (
      exists (select 1 from public.atom_sessions s where s.id = session_id and s.user_id = auth.uid())
    );
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='atom_session_summaries' and policyname='atom_session_summaries_own_select') then
    create policy atom_session_summaries_own_select on public.atom_session_summaries
    for select to authenticated using (
      exists (select 1 from public.atom_sessions s where s.id = session_id and s.user_id = auth.uid())
    );
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='atom_session_summaries' and policyname='atom_session_summaries_own_insert') then
    create policy atom_session_summaries_own_insert on public.atom_session_summaries
    for insert to authenticated with check (
      exists (select 1 from public.atom_sessions s where s.id = session_id and s.user_id = auth.uid())
    );
  end if;
end $$;
create or replace function public.set_atom_sessions_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists atom_sessions_updated_at_trg on public.atom_sessions;
create trigger atom_sessions_updated_at_trg
before update on public.atom_sessions
for each row execute procedure public.set_atom_sessions_updated_at();
