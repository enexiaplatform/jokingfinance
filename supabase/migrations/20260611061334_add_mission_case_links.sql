alter table public.missions
  add column if not exists related_case_slug text;
