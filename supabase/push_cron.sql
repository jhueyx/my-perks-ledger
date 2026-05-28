-- Run once in the Supabase SQL editor.
-- Sends background push every day at 16:00 UTC (~morning in the US).

select cron.schedule(
  'daily-perks-push',
  '0 16 * * *',
  $$
  select net.http_post(
    url := 'https://rsbvddlhismetljqoqre.supabase.co/functions/v1/send-push',
    headers := '{"Content-Type":"application/json"}'::jsonb,
    body := '{}'::jsonb
  ) as request_id;
  $$
);

-- Verify:        select * from cron.job where jobname = 'daily-perks-push';
-- Remove:        select cron.unschedule('daily-perks-push');
-- Fire now (test):
-- select net.http_post(
--   url := 'https://rsbvddlhismetljqoqre.supabase.co/functions/v1/send-push',
--   headers := '{"Content-Type":"application/json"}'::jsonb,
--   body := '{}'::jsonb
-- );
