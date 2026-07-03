alter table public.trades
  add column if not exists review_after_days integer not null default 7
    check (review_after_days in (7, 14, 30)),
  add column if not exists review_due_at timestamptz;

update public.trades
set review_due_at = created_at + (review_after_days * interval '1 day')
where review_due_at is null;

alter table public.trades
  alter column review_due_at set not null;

alter table public.trade_journal
  add column if not exists thesis_status text
    check (thesis_status in ('valid', 'weakened', 'invalid', 'unsure')),
  add column if not exists would_repeat text
    check (would_repeat in ('yes', 'no', 'unsure')),
  add column if not exists reviewed_at timestamptz;

create index if not exists trades_user_review_due_idx
  on public.trades(user_id, review_due_at)
  where review_due_at is not null;
