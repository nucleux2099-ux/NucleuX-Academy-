-- Phase D: scoped adaptive learner profiles
create table if not exists public.atom_scope_profiles (
  id uuid primary key default gen_random_uuid(),
  scope_key text not null unique,
  response_style text not null default 'balanced',
  difficulty_preference text not null default 'adaptive',
  weak_topics jsonb not null default '[]'::jsonb,
  pace text not null default 'normal',
  format_preference text not null default 'mixed',
  version integer not null default 1,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_atom_scope_profiles_scope_key on public.atom_scope_profiles(scope_key);
