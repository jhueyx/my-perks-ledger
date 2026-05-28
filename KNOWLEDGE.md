# Perks Ledger — Knowledge & Changelog

## Overview
Vanilla JS SPA deployed via GitHub Pages (public repo) at **perks.hueyventures.org**. No build step, no framework. ES modules loaded directly in the browser. Supabase for auth and cloud sync.

## Architecture

### Module Map
| File | Role |
|---|---|
| `js/cards.js` | All card benefit data — `CARDS`, `PREMIUM_CARD_CATALOG`, `CARD_LABELS`, `POINTS_MULTIPLIERS`, `BENEFIT_CATEGORIES` |
| `js/state.js` | Shared mutable `state` object, Supabase client (`sb`), date constants (`CY`, `CM`, `CD`) |
| `js/storage.js` | localStorage + Supabase sync, toggle, partial use, notes, snooze, credited, skipped |
| `js/periods.js` | Period math, stats, ROI calculations, streak logic |
| `js/views.js` | All render functions — `render()`, `renderCurrent()`, `renderAllCards()`, etc. |
| `js/main.js` | Event listeners, auth flow, navigation, modal logic, `window.*` exports for inline handlers |

### Key Patterns
- **Inline onclick handlers** in rendered HTML must use `window.*` exports (set at bottom of `main.js`)
- **Custom events** decouple storage from rendering: `perks:benefit-toggled`, `perks:rerender`, `perks:benefit-skipped`
- **`set(html, onReady?)`** in `views.js` applies a 180ms fade transition before inserting HTML; pass `onReady` callback for post-DOM event binding
- **`state` object** is a single mutable export — mutations propagate across modules
- **Dark mode** applied via inline `<head>` script (runs before module deferred execution)

### Cadence Types
| Cadence | Period Key Format | Example |
|---|---|---|
| `monthly` | `2025-m4` | May 2025 |
| `quarterly` | `2025-q1` | Q2 2025 |
| `cal-semi-annual` | `2025-h0` / `2025-h1` | Jan–Jun / Jul–Dec |
| `semi-annual` | `cy-2025-4-h1` | Card-year based half |
| `annual` | `cy-2025-4-annual` | Card-year based |
| `cal-annual` | `2025-annual` | Calendar year |
| `feb-annual` | `feb-2025` | Feb–Jan travel year |

### Data Shape
All benefit usage stored in `state.DATA[cardKey][benefitId__periodKey] = true/false`.
Extras stored separately in localStorage: `_customAmounts`, `_partial`, `_notes`, `_credited`, `_skipped`, `_snoozed`, `_feeOverrides`, `_cardOrder`.
Everything bundled into one Supabase row per user in `tracker_data`.

---

## Deployment
Push to `origin main` → GitHub Pages auto-deploys to perks.hueyventures.org.
Cache-bust: increment version in `index.html` CSS/JS query strings (`?v=...`) and bump SW version.

---

## Changelog

### v2.4 (current, ~May 2026)
- **Export Report** (`renderExport()` in `views.js`, nav `export-report`) — per-card year-end report (Captured / Missed / Net vs Fee / Capture % / ROI grade), reuses `calcStats` + `getYTDPeriods` + `getROIGrade` with the recap pattern of `selectedYear` save/restore. `window.downloadBenefitsCSV` builds a CSV blob and downloads `perks-ledger-{year}.csv`. Print/PDF via `window.print()` + `@media print` rules that hide everything except `.export-report`.
- **Fee Tracker** integrated into Renewal Calendar — `feeHistory(ck)` derives the timeline from `historicalFees` + `card.fee`, `feeSparkline()` renders a compact bar chart; top alert lists cards that raised fees this year; each calendar row gets a `▲` (`.rc-up`) indicator with prior fee in the title.
- **Web Push** (background, app-closed) — opt-in toggle in Settings → Notifications. SW handles `push` (showNotification) + `notificationclick` (focus/open). Subscribe flow in `enablePush()`/`disablePush()` writes to `push_subscriptions` and flips `user_profiles.push_enabled`. Edge Function `send-push` reuses each user's `digest_cache` (no second cache column needed) to send via `npm:web-push`, pruning 404/410 subs. Cron runs daily at 16:00 UTC. **Requires manual setup** — see "Web Push setup" below.
- SW cache bumped to v32.

### v2.3 (~May 2026)
- **Renewal Calendar** (`renderRenewalCalendar()` in `views.js`, nav `renewal-calendar`) — 12-month timeline of every visible card's fee/anniversary date (via `getCardFeeMonth/Day` + `daysUntilFee`-style calc), grouped by month from the current month forward, sorted by days-until; shows fee + urgency color (≤30d / ≤60d). Rows tap through to that card (`goToCardPeriod`). Wired into `render()` dispatch, `_analyticsViews`, `setActiveView`, More grid, `_DRAWER_ICONS`. CSS: `.rc-*` classes.
- **Per-benefit reminders** (`firePerBenefitReminders()` in `main.js`) — opt-in (`notif-perbenefit`, default off). For each unclaimed, non-snoozed, non-skipped, available benefit whose current period is within its cadence's expiry window (monthly 3d / quarterly 7d / semi 14d / annual 30d), fires one local notification, capped at 6, deduped per `notifb-{card}-{benefit}-{pk}`. Fires on load, on enable, and when the toggle is switched on.
- SW cache bumped to v31.

### v2.2 (~May 2026)
- **Card Simulator** (`renderCardSimulator()` in `views.js`, nav `card-simulator`) — projects annual value for any unowned card using the user's real per-category capture rates derived from existing card history (e.g. dining at 80% applies 80%, not 100%). Renders grade A–D, net projected vs fee, layered max-vs-projected bar, per-category behavior profile, and per-benefit breakdown with claim-rate annotation. `window.setSimCard(k)` switches the simulated card. Added to desktop drawer + mobile bottom sheet nav. SW cache bumped to v27.

### v2.1 (~May 2026)
- PWA lock to portrait orientation
- More page as pill grid
- Collapsible Security section in Settings
- Heatmap card label fixes
- Bottom sheet scroll lock on iOS

### v2.0
- Split `app.js` into 6 ES modules (cards, state, storage, periods, views, main)
- Settings screen (replaced My Cards modal) — profile name, password change, card picker
- Hi [name] greeting in drawer and bottom sheet
- Drawer icons mapped from `_DRAWER_ICONS`

### v1.x (earlier)
- Auth system (Supabase email/password + demo mode)
- Card year view, YTD view, history dots, summary donut
- Snooze system (per-benefit, date-range, legacy format auto-upgrade)
- Skip / undo / shake-to-undo
- Partial use tracking + partial bar
- Notes per benefit per period
- Credited toggle (credit pending / posted)
- Pull to refresh (Supabase sync)
- Confetti on full card claim + profit milestone
- ROI grades (A/B/C/D), projections, trends
- Priority queue ("Use It Now") with urgency scoring
- Streaks leaderboard
- Missed money heatmap
- Annual recap view
- History log (from `benefit_log` table)
- Notifications (end-of-month monthly benefit reminder)
- Service worker / PWA manifest / iOS standalone mode
- Keyboard shortcuts (1/2/3/4/m/Escape)
- Card carousel (desktop auto-scroll)
- Drag-to-reorder cards (card selector + ROI/trends/heatmap rows)
- Fee date overrides per card
- Dark/light mode toggle with system preference detection

---

## Bug Fixes Applied (2026-05-20)

### 1. Note/partial/credit listeners never fired
**Root cause:** `set(html)` queued DOM update 180ms later, but `querySelectorAll('.add-note')` etc. in `renderCurrent()` ran immediately against the OLD DOM. Listeners attached to old nodes were destroyed with the DOM swap.
**Fix:** Added optional `onReady` callback to `set()`. `renderCurrent()` now passes all post-DOM event binding inside this callback, guaranteeing they run after the new HTML is inserted.

### 2. Category breakdown counted all cards, not user's cards
**Root cause:** `buildCategoryBreakdown()` iterated `Object.keys(CARDS)` — the full card catalog — instead of `getVisibleCardKeys()`.
**Fix:** Changed to `getVisibleCardKeys()`.

### 3. Card drag reorder never synced to cloud
**Root cause:** Reordering cards in the card selector only wrote to `localStorage('perks-card-order')` but didn't call `scheduleSave()`, so the order was lost on other devices until the next benefit toggle triggered a save.
**Fix:** Added `scheduleSave()` after the `localStorage.setItem` call in the drop handler.

### 4. Benefit history used hardcoded card name map
**Root cause:** `renderHistoryLog()` had a hardcoded `cardNames` object that was missing newer cards (`wf_premier_autograph`, etc.).
**Fix:** Replaced with `CARD_LABELS[entry.card_key]` — always up to date.

### 5. Summary view showed hardcoded "ends Jun 2026"
**Root cause:** `renderSummBase()` expiry tag was hardcoded to `"ends Jun 2026"` for all benefits with an `expiresAfter` field.
**Fix:** Now dynamically renders `"ends Jun/Dec YYYY"` using `b.expiresAfter.h` and `b.expiresAfter.y`.

---

## Supabase Schema

| Table | Purpose |
|---|---|
| `tracker_data` | One row per user — all benefit usage + extras in a single JSON column |
| `user_profiles` | `user_id`, `cards[]`, `digest_*`, `push_enabled` — card selection + digest + push opt-in |
| `benefit_log` | Append-only toggle history (used by History Log view) |
| `push_subscriptions` | One row per device — VAPID push subscription JSON, RLS-scoped to user |

RLS: users can only access their own rows. Anon/publishable key is safe to expose in frontend.

---

## Web Push setup

The Web Push code is shipped but inactive until you complete these steps:

1. **Generate VAPID keys** (one time):
   ```bash
   npx web-push generate-vapid-keys
   ```
   Note the `Public Key` and `Private Key` (base64url strings).

2. **Frontend:** paste the public key into `VAPID_PUBLIC_KEY` at the top of `js/main.js`, then bump the `?v=` query string and SW cache.

3. **Run the SQL migration** in the Supabase SQL editor:
   ```
   supabase/push_migration.sql
   ```

4. **Set the function secrets** (Supabase Dashboard → Edge Functions → `send-push` → Secrets):
   - `VAPID_PUBLIC_KEY` — same value as the frontend constant
   - `VAPID_PRIVATE_KEY`
   - `VAPID_SUBJECT` — e.g. `mailto:jason.huey1@gmail.com`

5. **Deploy the function:**
   ```bash
   supabase functions deploy send-push --project-ref rsbvddlhismetljqoqre
   ```

6. **Schedule the cron** by running `supabase/push_cron.sql` in the SQL editor (daily at 16:00 UTC by default).

7. **Test on a device:** Settings → Notifications → enable notifications → toggle "Background push". Then fire the function manually from the SQL editor (see the test snippet in `push_cron.sql`).

iOS PWAs require the app installed to the Home Screen and iOS ≥16.4 for Web Push.

---

## Feature Roadmap Ideas

### High Value
- **Auto-detection via Plaid/bank feed** — detect when a statement credit posts and auto-mark it used
- **"Best card for this purchase" widget** — enter a merchant/category and see which card earns most

### Medium Value
- **Google / Apple Sign-In** — reduce signup friction; still uses Supabase Auth under the hood
- **Household / shared mode** — two users on the same Supabase row (need row-level locking)
- **Points value tracker** — alongside dollar credits, track points balances and estimated value
- **Benefit category filter on All Cards** — filter the all-cards view to just "dining" or "travel" benefits
- **Snooze calendar picker** — replace plain `<input type="month">` with a proper calendar UI
- **Custom benefit names** — rename "Dining Credit" to "Grubhub" for faster scanning
- **Card upgrade advisor** — "You're using 95% of Sapphire Preferred benefits — consider upgrading to Reserve"

### Lower Priority / Nice to Have
- **Offline-first improvements** — currently falls back to localStorage, but explicit offline queuing of toggle actions
- **Deep links** — `perks.hueyventures.org/#priority` opens directly to Use It Now
- **iOS Lock Screen widget** — not currently possible with PWA, but a reference shortcut app could bridge it
- **Apple Pay / Wallet integration** — show recommended card when tapping to pay (requires native app)
- **AI assistant** — natural language: "What should I use this month?" uses benefit data + urgency scoring
- **Confetti on mobile** — currently disabled for Mobi user agents; re-enable with a lighter particle count
- **Keyboard navigation for cards** — arrow keys to switch active card, Enter to expand
- **Swipe between months** — currently swipe switches primary tabs; add vertical swipe or dedicated gesture for month navigation in This Period view

---

## Known Limitations
- **Partial input on mobile** — number inputs can be awkward; a slider or stepper might be better UX
- **Benefit categories** — `BENEFIT_CATEGORIES` in `cards.js` is a manual map; adding new benefits requires updating it

## Fixed (2026-05-27)
- **Snooze from/until reversed range** — `setSnoozedBenefit()` now swaps `from`/`until` when reversed (YYYY-MM strings sort lexically) so a backwards range is no longer a silent no-op
- **Semi-annual & feb-annual trends double-count** — removed the prior-year spillover pushes (`cy-${y-1}-${fm}-h2` and `feb-${y-1}`) in `capturedForYear()`; each card-year period now counts only toward its card-year-start calendar year
