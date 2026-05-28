# Perks Ledger

A personal credit card perks and benefits tracker. Track monthly credits, annual travel benefits, quarterly rewards, and card-year ROI across all your premium cards — with cloud sync, snooze, streak tracking, and fee-coverage analytics.

**Live at:** [perks.hueyventures.org](https://perks.hueyventures.org)

---

## Features

### Tracking
- **This Month** — check off benefits as you use them; monthly, quarterly, semi-annual, and annual cadences all tracked per period
- **Card Year view** — full card-anniversary-aligned 12-month history and summary; year selector adapts to each card's renewal date
- **YTD view** — calendar-year history and summary (separate from card year)
- **History Log** — full timeline of benefit claims and missed credits

### Analytics
- **Year-end Projections** — straight-line projection of captured value based on your current pace, per card
- **ROI Grade** — letter grade (A/B/C/D) based on projected capture vs annual fee
- **Multi-year Trends** — fee-relative bar chart showing captured vs fee across years
- **Annual Recap** — total captured, biggest miss, card streaks
- **Keep / Cancel** — data-driven renewal recommendation per card
- **Benefit Digest** — unified urgency dashboard: "Act now" list ranked by urgency × value (dismiss with ×, restore with shake/Undo), collapsed "By Deadline" buckets (monthly / quarterly / semi-annual / annual), and a collapsed "Dismissed" section with per-item Restore
- **Portfolio Value** — hero summary of total captured vs projected vs fees across all cards; per-card breakdown sorted by capture %; layered captured + projected progress bar
- **Fee Optimizer** — shows net impact of canceling each card (fee saved minus projected benefits lost), sorted by cancel-impact; portfolio-level net position + fee-coverage bar
- **Card Simulator** — "what if I added this card?" Projects annual value for any unowned card using *your* actual category capture rates (derived from existing card history), not a naive 100%. Shows grade A–D, net projected vs fee, a layered max-vs-projected progress bar, per-category behavior profile, and a per-benefit breakdown with claim-rate annotations
- **Renewal Calendar + Fee Tracker** — unified 12-month timeline of every card's annual-fee/anniversary date, grouped by month with days-until + a ▲ marker when a card raised its fee this year, plus a top alert ("⚠ N cards raised fees…") and a per-card mini fee-history sparkline
- **Export Report** — year-end benefits report with per-card Captured/Missed/Net vs Fee/Capture %/ROI grade, plus a one-click CSV download and a print stylesheet for "Save as PDF"
- **Achievements** — gamified badge system with 100+ badges across 5 tiers (Bronze / Silver / Gold / Platinum / Legendary). Categories: streaks, portfolio size, value captured, fee mastery, card mastery, claim volume, completionist, category specialists, and card-specific loyalty badges. Flip-card UI with locked/unlocked states; retroactive backfill on first sign-in; toast on unlock
- **Compare Cards** — side-by-side captured / projected / missed metrics
- **Heatmap** — benefit claim density view by month

### Benefit control
- **Snooze** — hide any benefit from all calculations until a chosen month-year (⏸ button on hover). Global Entry / TSA PreCheck benefits get a "4 years" one-tap preset for the next eligibility window
- **Skip** — permanently exclude a benefit from a specific period (e.g. if you missed a deadline)
- **Partial use** — record partial redemption of credits (e.g. Chase $300 travel credit)
- **Custom amounts** — override a benefit's dollar amount (e.g. if your actual redemption value differs)
- **Notes** — attach a note to any benefit period (e.g. confirmation number, vendor)
- **Credited** — mark whether a statement credit has actually posted

### Quality of life
- **Dark / light mode** — toggle in the menu; persists across sessions
- **Confetti** — fires once (desktop only) when a card crosses from fee owed into profit
- **Pull to refresh** — sync latest data from Supabase on mobile
- **Swipe navigation** — swipe left/right between the four main views on mobile
- **Fee date overrides** — set a custom anniversary month + day per card via the ✎ button
- **Settings screen** — profile name, password change, card selection
- **Notifications** — reminders before benefits expire: aggregate by cadence (monthly/quarterly/semi-annual) plus an opt-in **per-benefit** mode (e.g. "$10 Peloton Credit — 3 days left"). Local notifications, fire while the app is open; deduped per benefit/period
- **Email Digest** (optional) — opt-in weekly email summary of unclaimed benefits, sent via Supabase Edge Function (`send-weekly-digest`) using Resend. Toggle in Settings → Notifications
- **Background push** (optional) — opt-in toggle delivers reminders even when the app is closed, via Supabase Edge Function (`send-push`) on daily cron (requires VAPID keys + migration — see `KNOWLEDGE.md`)
- **Card flip** — tap a card image to flip to the back side showing points multipliers and current capture progress
- **Installable PWA** — add to home screen on iOS / Android; portrait lock; landscape side-rail nav

---

## Calculation formulas

### Effective fee
`effective fee = annual fee − card-year captured`

Where **card-year captured** = sum of all benefit amounts marked used across all past and current periods in the 12-month card year (benefit start month through anniversary month − 1).

### Year-end projection
```
months elapsed  = (current abs month) − (card year start abs month) + 1, clamped 1–12
months remaining = 12 − months elapsed

projected repeating = (repeating captured / months elapsed) × months remaining
projected = one-time captured + repeating captured + projected repeating
```

`repeating` = monthly + quarterly benefits; `one-time` = annual, semi-annual, etc.

### ROI grade
Grade is based on `projected / annual fee`:

| Grade | Threshold |
|-------|-----------|
| A | ≥ 100% |
| B | ≥ 80% |
| C | ≥ 50% |
| D | < 50% |

### Card year start
A card year starts on the anniversary month/day. If today is before this year's anniversary date, the year started in the previous calendar year; if on or after, it started this calendar year.

### Snooze exclusions
Snoozed benefits are excluded from: card-year captured, monthly available, year-end projection, ROI grade, priority queue, and all-cards summary. The snooze state syncs to Supabase so it persists across devices.

---

## Cards supported

| Card | Key |
|------|-----|
| Amex Platinum | `platinum` |
| Amex Gold | `gold` |
| Amex Green | `green` |
| Chase Sapphire Reserve | `csr` |
| Chase Sapphire Preferred | `csp` |
| Capital One Venture X | `cap1_venture_x` |
| Hilton Honors Aspire | `ah` |
| Marriott Bonvoy Brilliant | `amb` |
| Marriott Bonvoy Bevy | `mbb` |
| World of Hyatt | `uq` (note: uses `uq` key) |
| United Quest | `uq` |
| United Club Infinite | `uc` |
| Citi Strata Premier | `csp2` |
| WF Autograph Journey | `wfaj` |
| Aeroplan Reserve | `adr` |
| Aeroplan | `adp` |
| Venture X Business | `vxb` |
| JetBlue Mastercard Reserve | `jmr` |
| US Bank Altitude Reserve | `usbar` |

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Vanilla JS ES modules / HTML / CSS — no framework, no build step |
| Auth + Sync | [Supabase](https://supabase.com) (email/password auth, RLS, cloud data sync) |
| Hosting | Vercel with custom domain (`perks.hueyventures.org`) |
| Fonts | Inter + JetBrains Mono (Google Fonts) |

## Module structure

```
index.html          — app shell, modals, PWA meta
css/styles.css      — all styles (dark + light mode, responsive, landscape)
js/
  cards.js          — card definitions: sections, benefits, amounts, cadences
  state.js          — shared state object, Supabase client, constants (CY, CM, CD)
  storage.js        — localStorage + Supabase sync; custom amounts, partial use,
                       notes, credited, skipped, snoozed, fee overrides
  periods.js        — period math: card year start, period generation, isPCurrent,
                       calcStats, projections, ROI grade, streaks
  badges.js         — achievement badge definitions (100+ badges, 5 tiers),
                       check/earn/persist/backfill logic, TIER_COLORS
  views.js          — all render functions (renderCurrent, renderROI, renderDigest,
                       renderNetValue, renderFeeOptimizer, renderCardSimulator, …)
  main.js           — auth flow, event handlers, navigation, modals, confetti,
                       renderBadgesView, email digest toggle, push subscribe
manifest.json       — PWA manifest
sw.js               — service worker (offline cache, currently v35)
supabase/
  functions/send-weekly-digest/  — weekly email digest (Resend)
  functions/send-push/           — web push notifications (web-push npm)
  digest_migration.sql           — adds digest_cache + digest_enabled to user_profiles
  push_migration.sql             — creates perks_push_subscriptions table
  cron_schedule.sql              — pg_cron for weekly digest
  push_cron.sql                  — pg_cron for daily push at 16:00 UTC
```

## Data & sync

All user data is stored in Supabase (`tracker_data` table) as a single JSON blob per user, merged with local localStorage on load. The payload includes:

- `[cardKey]` — benefit check-off state (`benefitId__periodKey: true/false`)
- `_customAmounts` — per-benefit dollar overrides
- `_partial` — partial credit amounts
- `_notes` — period notes
- `_credited` — statement credit posted flags
- `_skipped` — period-level skips
- `_snoozed` — benefit-level snooze-until months (`cardKey__benefitId: 'YYYY-MM'`)
- `_feeOverrides` — custom fee month/day per card

The Supabase anon key is safe to expose in frontend code — RLS policies restrict each row to its owner.

> Do not commit a Supabase service role key.

## Running locally

No build step required — it's plain ES modules. Serve from any static file server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

`file://` URLs won't work for ES modules. Supabase auth requires the origin to be whitelisted in your Supabase project under Authentication → URL Configuration.
