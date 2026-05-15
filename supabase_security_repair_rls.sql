-- Run this in the Supabase SQL Editor for the Perks Ledger project.
--
-- It fixes the "Table publicly accessible" warning for the app tables used by
-- the browser client. It is safe to run more than once.
--
-- Tables used by the app:
--   public.tracker_data
--   public.benefit_log
--   public.user_profiles

do $$
begin
  if to_regclass('public.tracker_data') is not null then
    alter table public.tracker_data enable row level security;

    drop policy if exists "tracker_data_own" on public.tracker_data;
    create policy "tracker_data_own"
      on public.tracker_data
      for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if to_regclass('public.benefit_log') is not null then
    alter table public.benefit_log enable row level security;

    drop policy if exists "benefit_log_own" on public.benefit_log;
    create policy "benefit_log_own"
      on public.benefit_log
      for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if to_regclass('public.user_profiles') is not null then
    alter table public.user_profiles enable row level security;

    drop policy if exists "user_profiles_own" on public.user_profiles;
    create policy "user_profiles_own"
      on public.user_profiles
      for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;

-- This should return zero rows after the fix. If it returns rows, those public
-- tables still have RLS disabled.
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
and rowsecurity = false
order by tablename;

-- Optional focused check for the Perks Ledger tables.
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
and tablename in ('tracker_data', 'benefit_log', 'user_profiles')
order by tablename;
