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

### v2.1 (current, ~May 2026)
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
| `user_profiles` | `user_id`, `cards[]` — card selection |
| `benefit_log` | Append-only toggle history (used by History Log view) |

RLS: users can only access their own rows. Anon/publishable key is safe to expose in frontend.

---

## Feature Roadmap Ideas

### High Value
- **Export to CSV/PDF** — share a year-end benefits report; useful for budgeting and tax context
- **Benefit-specific push notifications** — not just end-of-month, but per-benefit: "Your Peloton credit resets in 3 days"
- **Auto-detection via Plaid/bank feed** — detect when a statement credit posts and auto-mark it used
- **"Best card for this purchase" widget** — enter a merchant/category and see which card earns most
- **Annual fee tracker** — alert when a fee is increasing (CSR went $550→$795); historical fee chart
- **Renewal calendar** — a unified view of all card fee dates across the year

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
- **Snooze from/until not validated** — if "from" > "until", snooze silently has no effect
- **Partial input on mobile** — number inputs can be awkward; a slider or stepper might be better UX
- **Benefit categories** — `BENEFIT_CATEGORIES` in `cards.js` is a manual map; adding new benefits requires updating it
- **Semi-annual trends** — `capturedForYear()` in `renderTrends` adds extra periods for semi-annual cadences that can double-count in edge cases near card anniversary months
