# Perks Ledger

A personal credit card perks and benefits tracker. Track monthly credits, annual travel benefits, semi-annual rewards, and card-year ROI across all your cards — with cloud sync, streak tracking, and fee-coverage analytics.

**Live at:** [perks.hueyventures.org](https://perks.hueyventures.org)

---

## Features

- **This Month** — check off benefits as you use them; monthly/quarterly/semi-annual/annual cadences all tracked separately
- **Card Year view** — full card-anniversary-aligned history and summary; year selector adapts to each card's renewal date
- **YTD view** — calendar-year history and summary
- **Multi-year Trends** — fee-relative bar chart showing captured value vs annual fee across years
- **Annual Recap** — total captured, best card, biggest miss, streaks
- **Insights** — year-end projections, ROI grades, missed-money heatmap
- **Keep / Cancel** — data-driven recommendation for each card based on projected capture vs fee
- **Priority Queue** — unclaimed benefits ranked by urgency × value; tapping navigates directly to that card
- **Streaks** — consecutive months claimed for each monthly benefit
- **Compare Cards** — side-by-side captured / projected / missed metrics
- **Fee date overrides** — set a custom anniversary date per card via the ✎ button
- **Partial use tracking** — record partial redemption of credits (e.g. travel credits)
- **Notes** — add a note to any benefit period
- **Dark mode** — follows system preference

## Cards supported

AMEX Gold · AMEX Platinum · AMEX Green · Chase Sapphire Reserve · Chase Sapphire Preferred · Capital One Venture X · Hilton Honors Aspire · Marriott Bonvoy Brilliant · World of Hyatt · United Quest · United Club Infinite · Citi Strata Premier · WF Premier Autograph

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Vanilla JS / HTML / CSS — no framework |
| Auth + Sync | [Supabase](https://supabase.com) (email/password auth, cloud data sync) |
| Hosting | GitHub Pages with custom domain via CNAME |
| Fonts | Inter + JetBrains Mono (Google Fonts) |

## File structure

```
index.html        — app markup, meta tags, PWA manifest links
css/styles.css    — all styles (light + dark mode, responsive)
js/app.js         — all app logic (card data, period math, views, sync)
manifest.json     — PWA manifest for installability
apple-touch-icon.png / icon-192.png / icon-512.png / favicon.ico — app icons
CNAME             — custom domain for GitHub Pages
```

## Data & sync

Benefit check-offs, notes, partial amounts, custom fee dates, and card selection are all synced to Supabase (`tracker_data` table) on every save. A local localStorage copy is kept as a fallback. The Supabase anon key is safe to expose in frontend code — only the authenticated user's row is accessible via RLS.

> Do not commit a Supabase service role key.

## Running locally

No build step required. Open `index.html` directly in a browser, or serve the directory:

```bash
npx serve .
```

Supabase auth requires the site URL to be whitelisted in your Supabase project's Authentication → URL Configuration settings.
