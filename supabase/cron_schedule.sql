-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor)
-- Schedules the weekly digest every Monday at 10:00 UTC

select cron.schedule(
  'weekly-perks-digest',
  '0 10 * * 1',
  $$
  select net.http_post(
    url := 'https://rsbvddlhismetljqoqre.supabase.co/functions/v1/send-weekly-digest',
    headers := '{"Content-Type":"application/json"}'::jsonb,
    body := '{}'::jsonb
  ) as request_id;
  $$
);

-- Verify it was created:
-- select * from cron.job where jobname = 'weekly-perks-digest';

-- To remove it:
-- select cron.unschedule('weekly-perks-digest');

-- To test immediately (fires the function right now):
-- select net.http_post(
--   url := 'https://rsbvddlhismetljqoqre.supabase.co/functions/v1/send-weekly-digest',
--   headers := '{"Content-Type":"application/json"}'::jsonb,
--   body := '{}'::jsonb
-- );
