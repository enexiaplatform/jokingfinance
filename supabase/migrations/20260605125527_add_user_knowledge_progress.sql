create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.user_knowledge_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, module_id)
);

create index if not exists user_knowledge_progress_user_id_idx
  on public.user_knowledge_progress(user_id);

drop trigger if exists set_user_knowledge_progress_updated_at on public.user_knowledge_progress;
create trigger set_user_knowledge_progress_updated_at
before update on public.user_knowledge_progress
for each row execute function public.set_updated_at();

grant select, insert, update, delete on public.user_knowledge_progress
  to authenticated, service_role;

alter table public.user_knowledge_progress enable row level security;

drop policy if exists "Knowledge progress is readable by owner" on public.user_knowledge_progress;
create policy "Knowledge progress is readable by owner"
  on public.user_knowledge_progress for select
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Knowledge progress is insertable by owner" on public.user_knowledge_progress;
create policy "Knowledge progress is insertable by owner"
  on public.user_knowledge_progress for insert
  to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Knowledge progress is updatable by owner" on public.user_knowledge_progress;
create policy "Knowledge progress is updatable by owner"
  on public.user_knowledge_progress for update
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Knowledge progress is deletable by owner" on public.user_knowledge_progress;
create policy "Knowledge progress is deletable by owner"
  on public.user_knowledge_progress for delete
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
