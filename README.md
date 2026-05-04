# My Perks Ledger — split CSR demo

Files:

- `index.html` — lightweight page markup only
- `css/styles.css` — app styling
- `js/cards-csr.js` — Chase Sapphire Reserve benefits only
- `js/app.js` — app logic
- `assets/csr-card.png` — card artwork moved out of the HTML

What changed:

- Removed AMEX Gold and AMEX Platinum benefit data from the demo.
- Removed AMEX Gold and AMEX Platinum card buttons/images from the markup.
- Moved the big inline card image into `assets/csr-card.png`.
- Moved CSS and JS out of the main HTML file.

To add cards later, put their benefit data in separate `js/cards-*.js` files and load them before `js/app.js`, or merge them into `CARDS`.
