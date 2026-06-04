create extension if not exists pgcrypto;

create schema if not exists private;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  starting_points numeric(18, 2) not null default 100000000,
  current_cash numeric(18, 2) not null default 100000000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stocks (
  id uuid primary key default gen_random_uuid(),
  ticker text not null unique,
  company_name text not null,
  sector text not null,
  current_price numeric(18, 2) not null check (current_price >= 0),
  previous_close numeric(18, 2) not null check (previous_close >= 0),
  daily_change_percent numeric(8, 2) not null default 0,
  pe_ratio numeric(10, 2) not null default 0,
  market_cap numeric(24, 2) not null default 0,
  description text not null default '',
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Danh mục ảo mặc định',
  starting_cash numeric(18, 2) not null default 100000000,
  current_cash numeric(18, 2) not null default 100000000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.holdings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  stock_id uuid not null references public.stocks(id),
  ticker text not null,
  quantity numeric(18, 4) not null check (quantity >= 0),
  average_price numeric(18, 2) not null check (average_price >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, portfolio_id, ticker)
);

create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  stock_id uuid not null references public.stocks(id),
  ticker text not null,
  side text not null check (side in ('buy', 'sell')),
  quantity numeric(18, 4) not null check (quantity > 0),
  price numeric(18, 2) not null check (price >= 0),
  gross_value numeric(18, 2) not null check (gross_value >= 0),
  fee numeric(18, 2) not null default 0 check (fee >= 0),
  net_value numeric(18, 2) not null check (net_value >= 0),
  thesis text,
  expected_holding_period text,
  risk_note text,
  emotion text check (emotion in ('calm', 'curious', 'FOMO', 'confident', 'uncertain')),
  created_at timestamptz not null default now()
);

create table if not exists public.trade_journal (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trade_id uuid not null unique references public.trades(id) on delete cascade,
  reflection text,
  lesson_learned text,
  mistake_type text check (
    mistake_type in (
      'FOMO',
      'Over-concentration',
      'No thesis',
      'Panic selling',
      'Chasing news',
      'Ignoring risk',
      'Good discipline',
      'Other'
    )
  ),
  confidence_score integer check (confidence_score between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  category text not null,
  estimated_minutes integer not null check (estimated_minutes > 0),
  objective text not null,
  instructions text not null,
  success_criteria text not null,
  related_article_slug text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_mission_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mission_id uuid not null references public.missions(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  started_at timestamptz,
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, mission_id)
);

create table if not exists public.early_access_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  age_range text,
  investing_experience text check (
    investing_experience in ('beginner', 'basic', 'intermediate', 'experienced')
  ),
  main_goal text,
  willingness_to_pay text,
  feedback text,
  created_at timestamptz not null default now()
);

create index if not exists profiles_user_id_idx on public.profiles(user_id);
create index if not exists portfolios_user_id_idx on public.portfolios(user_id);
create index if not exists holdings_user_portfolio_idx on public.holdings(user_id, portfolio_id);
create index if not exists trades_user_portfolio_idx on public.trades(user_id, portfolio_id, created_at desc);
create index if not exists trade_journal_user_id_idx on public.trade_journal(user_id);
create index if not exists mission_progress_user_id_idx on public.user_mission_progress(user_id);

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_portfolios_updated_at
before update on public.portfolios
for each row execute function public.set_updated_at();

create trigger set_holdings_updated_at
before update on public.holdings
for each row execute function public.set_updated_at();

create trigger set_trade_journal_updated_at
before update on public.trade_journal
for each row execute function public.set_updated_at();

create trigger set_missions_updated_at
before update on public.missions
for each row execute function public.set_updated_at();

create trigger set_user_mission_progress_updated_at
before update on public.user_mission_progress
for each row execute function public.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name')
  on conflict (user_id) do nothing;

  insert into public.portfolios (user_id, name)
  values (new.id, 'Danh mục ảo mặc định')
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

grant usage on schema public to anon, authenticated, service_role;

grant select on public.stocks to anon, authenticated;
grant select on public.missions to anon, authenticated;
grant insert on public.early_access_requests to anon, authenticated;

grant select, insert, update, delete on public.profiles to authenticated, service_role;
grant select, insert, update, delete on public.portfolios to authenticated, service_role;
grant select, insert, update, delete on public.holdings to authenticated, service_role;
grant select, insert, update, delete on public.trades to authenticated, service_role;
grant select, insert, update, delete on public.trade_journal to authenticated, service_role;
grant select, insert, update, delete on public.user_mission_progress to authenticated, service_role;
grant select, insert, update, delete on public.stocks to service_role;
grant select, insert, update, delete on public.missions to service_role;
grant select, insert, update, delete on public.early_access_requests to service_role;

alter table public.profiles enable row level security;
alter table public.stocks enable row level security;
alter table public.portfolios enable row level security;
alter table public.holdings enable row level security;
alter table public.trades enable row level security;
alter table public.trade_journal enable row level security;
alter table public.missions enable row level security;
alter table public.user_mission_progress enable row level security;
alter table public.early_access_requests enable row level security;

create policy "Profiles are readable by owner"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Profiles are insertable by owner"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Stocks are publicly readable"
  on public.stocks for select
  to anon, authenticated
  using (is_active = true);

create policy "Portfolios are readable by owner"
  on public.portfolios for select
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Portfolios are insertable by owner"
  on public.portfolios for insert
  to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Portfolios are updatable by owner"
  on public.portfolios for update
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Holdings are readable by owner"
  on public.holdings for select
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Holdings are insertable by owner"
  on public.holdings for insert
  to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Holdings are updatable by owner"
  on public.holdings for update
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Holdings are deletable by owner"
  on public.holdings for delete
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Trades are readable by owner"
  on public.trades for select
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Trades are insertable by owner"
  on public.trades for insert
  to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Journal is readable by owner"
  on public.trade_journal for select
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Journal is insertable by owner"
  on public.trade_journal for insert
  to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Journal is updatable by owner"
  on public.trade_journal for update
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Missions are publicly readable"
  on public.missions for select
  to anon, authenticated
  using (is_active = true);

create policy "Mission progress is readable by owner"
  on public.user_mission_progress for select
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Mission progress is insertable by owner"
  on public.user_mission_progress for insert
  to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Mission progress is updatable by owner"
  on public.user_mission_progress for update
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Early access requests can be inserted publicly"
  on public.early_access_requests for insert
  to anon, authenticated
  with check (true);
