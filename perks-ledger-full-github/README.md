# Perks Ledger

Full single-file version of the app, ready to upload to GitHub Pages.

## Deploy to GitHub Pages

1. Upload `index.html` to your repo root.
2. In GitHub: Settings → Pages.
3. Set source to your main branch/root folder.

## Supabase safety

- The Supabase anon public key can be used in frontend code.
- Never commit a Supabase service_role key.
- Keep RLS policies enabled for user-specific tables like `user_cards`.
