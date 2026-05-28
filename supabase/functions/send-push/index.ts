// Sends a Web Push notification to every device of users who have push enabled
// and have unclaimed benefits in their digest_cache. Triggered by cron.
//
// Required function secrets (Dashboard → Edge Functions → send-push → Secrets):
//   VAPID_PUBLIC_KEY   — base64url public key  (same value the frontend uses)
//   VAPID_PRIVATE_KEY  — base64url private key
//   VAPID_SUBJECT      — e.g. "mailto:jason.huey1@gmail.com"
// Generate the pair locally with:  npx web-push generate-vapid-keys
//
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.

import webpush from 'npm:web-push@3.6.7';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

webpush.setVapidDetails(
  Deno.env.get('VAPID_SUBJECT')!,
  Deno.env.get('VAPID_PUBLIC_KEY')!,
  Deno.env.get('VAPID_PRIVATE_KEY')!,
);

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

interface BucketItem { card: string; name: string; amt: number; }
interface DigestCache {
  total_unclaimed?: number;
  monthly?: BucketItem[];
  quarterly?: BucketItem[];
  semiannual?: BucketItem[];
  annual?: BucketItem[];
}

// Build a concise notification from the most-urgent unclaimed benefits.
function buildPayload(cache: DigestCache): { title: string; body: string; url: string; tag: string } | null {
  // Prefer the soonest-expiring bucket that has items.
  const buckets: Array<[keyof DigestCache, string]> = [
    ['monthly', 'this month'],
    ['quarterly', 'this quarter'],
    ['semiannual', 'this half-year'],
    ['annual', 'this year'],
  ];
  for (const [key, when] of buckets) {
    const items = (cache[key] as BucketItem[] | undefined) ?? [];
    if (!items.length) continue;
    const sorted = [...items].sort((a, b) => b.amt - a.amt);
    const total = sorted.reduce((s, i) => s + i.amt, 0);
    const lead = sorted.slice(0, 2).map(i => `${i.name} $${i.amt}`).join(', ');
    const more = sorted.length > 2 ? ` +${sorted.length - 2} more` : '';
    return {
      title: `$${total} in benefits expiring ${when}`,
      body: `${lead}${more}`,
      url: '/#priority',
      tag: `perks-${key}`,
    };
  }
  return null;
}

Deno.serve(async () => {
  const { data: profiles, error } = await supabase
    .from('user_profiles')
    .select('user_id, digest_cache')
    .eq('push_enabled', true)
    .not('digest_cache', 'is', null);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  let sent = 0, skipped = 0, failed = 0, pruned = 0;

  for (const profile of profiles ?? []) {
    const payload = buildPayload((profile.digest_cache ?? {}) as DigestCache);
    if (!payload) { skipped++; continue; }

    const { data: subs } = await supabase
      .from('perks_push_subscriptions')
      .select('id, subscription')
      .eq('user_id', profile.user_id);

    for (const row of subs ?? []) {
      try {
        await webpush.sendNotification(row.subscription, JSON.stringify(payload));
        sent++;
      } catch (e) {
        const status = (e as { statusCode?: number }).statusCode;
        // 404/410 mean the subscription is dead — remove it.
        if (status === 404 || status === 410) {
          await supabase.from('perks_push_subscriptions').delete().eq('id', row.id);
          pruned++;
        } else {
          console.error('push failed', profile.user_id, status, e);
          failed++;
        }
      }
    }
  }

  return new Response(
    JSON.stringify({ sent, skipped, failed, pruned, users: profiles?.length ?? 0 }),
    { headers: { 'Content-Type': 'application/json' } },
  );
});
