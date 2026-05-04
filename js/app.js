const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

const CARD_CATALOG = {
  csr: { name: "Chase Sapphire Reserve" },
  amex_gold: { name: "Amex Gold" },
  amex_platinum: { name: "Amex Platinum" }
};

async function load() {
  const { data: { user } } = await supabaseClient.auth.getUser();

  const { data: userCards } = await supabaseClient
    .from('user_cards')
    .select('*')
    .eq('user_id', user.id);

  const cards = userCards.map(c => ({
    ...CARD_CATALOG[c.card_id],
    ...c
  }));

  render(cards);
}

function render(cards) {
  const el = document.getElementById('cards');
  el.innerHTML = '';

  cards.forEach(card => {
    const div = document.createElement('div');
    div.innerHTML = `
      <strong>${card.name}</strong><br>
      Annual Fee: $${card.annual_fee}<br>
      Anniversary: ${card.card_year_start_month}/${card.card_year_start_day}
      <hr>
    `;
    el.appendChild(div);
  });
}

load();
