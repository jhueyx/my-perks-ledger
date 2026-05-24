-- Run in Supabase SQL editor
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS digest_enabled boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS digest_cache   jsonb,
  ADD COLUMN IF NOT EXISTS digest_last_sent timestamptz;
