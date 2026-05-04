# My Perks Ledger

This is the full app split into separate files for GitHub Pages.

## Files

- `index.html` - app markup and external script/style references
- `css/styles.css` - extracted styles from the original inline `<style>` block
- `js/app.js` - extracted JavaScript from the original inline `<script>` block

## Supabase

The Supabase CDN script is still loaded from `index.html`. Make sure your public anon key only is used in frontend code. Do not commit a service role key.
