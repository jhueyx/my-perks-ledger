-- Run in Supabase SQL editor (Dashboard → SQL Editor)
-- Web Push: stores each device's push subscription and a per-user enable flag.

create table if not exists perks_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription jsonb not null,
  -- stable per-device key so re-subscribing the same browser upserts instead of duplicating
  endpoint text generated always as (subscription->>'endpoint') stored,
  created_at timestamptz default now(),
  unique (user_id, endpoint)
);

alter table perks_push_subscriptions enable row level security;

-- Each user can only see/manage their own subscriptions.
-- Drop-then-create keeps the migration idempotent (no `create policy if not exists` in Postgres).
drop policy if exists "perks_push_subscriptions own select" on perks_push_subscriptions;
drop policy if exists "perks_push_subscriptions own insert" on perks_push_subscriptions;
drop policy if exists "perks_push_subscriptions own update" on perks_push_subscriptions;
drop policy if exists "perks_push_subscriptions own delete" on perks_push_subscriptions;

create policy "perks_push_subscriptions own select" on perks_push_subscriptions
  for select using (auth.uid() = user_id);
create policy "perks_push_subscriptions own insert" on perks_push_subscriptions
  for insert with check (auth.uid() = user_id);
create policy "perks_push_subscriptions own update" on perks_push_subscriptions
  for update using (auth.uid() = user_id);
create policy "perks_push_subscriptions own delete" on perks_push_subscriptions
  for delete using (auth.uid() = user_id);

-- Per-user master switch for background push (re-uses the existing digest_cache
-- column for content, so no extra cache column is needed).
alter table user_profiles
  add column if not exists push_enabled boolean default false;

-- Verify:
-- select user_id, endpoint, created_at from perks_push_subscriptions;
