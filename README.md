# My Perks Ledger — split fixed build

This version keeps the app split into separate files while preserving all supported card benefit data.

Files:
- `index.html` — app shell and card buttons
- `css/styles.css` — styles
- `js/cards-data.js` — supported benefit data for CSR, AMEX Gold, and AMEX Platinum
- `js/app.js` — app logic, Supabase login, filtering, rendering
- `assets/` — card artwork

Important: Supabase `user_profiles.cards` still controls which cards are visible. The master data file includes all supported cards so Gold/Platinum can render when a logged-in user has them.
