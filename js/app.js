// ── Dark mode ─────────────────────────────────────────────────────────────
// ── Card benefit data ─────────────────────────────────────────────────────
const CARDS={
  gold:{name:'AMEX Gold',fee:325,historicalFees:{2025:325},feeMonth:4,feeDay:24,sections:[
    {label:'Monthly',cadence:'monthly',benefits:[
      {id:'g_dining',name:'Dining Credit',desc:'Grubhub, Cheesecake Factory, Five Guys, BWW, Wonder',amount:10},
      {id:'g_uber',name:'Uber Cash',desc:'Uber rides or Uber Eats in the US',amount:10},
      {id:'g_dunkin',name:"Dunkin' Credit",desc:"At U.S. Dunkin' locations",amount:7},
    ]},
    {label:'Semi-annual (calendar)',cadence:'cal-semi-annual',benefits:[
      {id:'g_resy',name:'Resy Dining Credit',desc:'Any U.S. Resy restaurant — no reservation required',amount:50},
    ]},
    {label:'Annual',cadence:'annual',benefits:[
      {id:'g_hotel',name:'Hotel Collection Credit',desc:'$100 on eligible charges, 2-night min via AMEX Travel',amount:100,partial:true},
    ]},
  ]},
  platinum:{name:'AMEX Platinum',fee:895,historicalFees:{2025:695},feeMonth:8,feeDay:17,sections:[
    {label:'Monthly',cadence:'monthly',benefits:[
      {id:'p_uber',name:'Uber Cash',desc:'$15/mo · $35 in December',amount:15,decAmount:35},
      {id:'p_digital',name:'Digital Entertainment',desc:'Disney+, Hulu, ESPN+, Peacock, Paramount+, NYT, WSJ, YouTube',amount:25},
      {id:'p_walmart',name:'Walmart+ Credit',desc:'Covers monthly Walmart+ membership',amount:12.95},
    ]},
    {label:'Quarterly',cadence:'quarterly',benefits:[
      {id:'p_resy',name:'Resy Dining Credit',desc:'At eligible U.S. Resy restaurants',amount:100,startsFrom:2026},
      {id:'p_lulu',name:'Lululemon Credit',desc:'U.S. stores or lululemon.com',amount:75,startsFrom:2026},
    ]},
    {label:'Semi-annual (card-year)',cadence:'semi-annual',benefits:[
      {id:'p_hotel',name:'Hotel Credit',desc:'Fine Hotels + Resorts or Hotel Collection, 2-night min',amount:300},
    ]},
    {label:'Semi-annual (calendar)',cadence:'cal-semi-annual',benefits:[
      {id:'p_saks',name:'Saks Fifth Avenue',desc:'At Saks stores or saks.com — resets Jan & Jul. Ends Jun 2026.',amount:50,expiresAfter:{y:2026,h:0}},
    ]},
    {label:'Annual (calendar year)',cadence:'cal-annual',benefits:[
      {id:'p_uberone',name:'Uber One Membership Credit',desc:'One-time credit for annual Uber One membership',amount:96,startsFrom:2026},
      {id:'p_airline',name:'Airline Fee Credit',desc:'Incidental fees with one selected airline',amount:200,partial:true},
      {id:'p_equinox',name:'Equinox Credit',desc:'Equinox club or app membership',amount:300,partial:true},
      {id:'p_oura',name:'Oura Ring Credit',desc:'Hardware only via OURAring.com',amount:200,startsFrom:2026},
      {id:'p_ge',name:'Global Entry / TSA PreCheck',desc:'Statement credit every 4 years',amount:120},
      {id:'p_clear',name:'CLEAR Plus Credit',desc:'Annual CLEAR Plus membership',amount:189},
    ]},
  ]},
  cap1_venture_x:{name:'Capital One Venture X',fee:395,historicalFees:{2025:395},feeMonth:0,feeDay:15,sections:[
    {label:'Annual',cadence:'annual',benefits:[
      {id:'vx_travel',name:'Annual Travel Credit',desc:'For bookings through Capital One Travel; resets on card anniversary',amount:300,partial:true},
      {id:'vx_anniv',name:'Anniversary Bonus Miles',desc:'10,000 bonus miles credited on each account anniversary (~$100 in travel value)',amount:100},
      {id:'vx_hotel',name:'Premier Collection Hotel Credit',desc:'Experience credit on eligible 2-night+ stays via Capital One Travel',amount:100,partial:true},
      {id:'vx_ge',name:'Global Entry / TSA PreCheck',desc:'Statement credit every 4 years',amount:120},
    ]},
  ]},
  csr:{name:'Chase Sapphire Reserve',fee:795,historicalFees:{2025:550},feeMonth:4,feeDay:1,sections:[
    {label:'Monthly',cadence:'monthly',benefits:[
      {id:'c_dd_restaurant',name:'DoorDash Restaurant Credit',desc:'$5 promo for restaurant orders (DashPass required)',amount:5},
      {id:'c_dd_nonrest1',name:'DoorDash $10 Grocery Credit',desc:'$10 promo for grocery, convenience, etc',amount:10},
      {id:'c_dd_nonrest2',name:'DoorDash $10 Grocery Credit',desc:'$10 promo for grocery, convenience, etc',amount:10},
      {id:'c_lyft',name:'Lyft Credit',desc:'Monthly in-app credit for rides (through Sep 2027)',amount:10,startsFrom:2026},
      {id:'c_peloton',name:'Peloton Credit',desc:'Toward eligible Peloton memberships',amount:10,startsFrom:2026},
    ]},
    {label:'Semi-annual (calendar)',cadence:'cal-semi-annual',benefits:[
      {id:'c_dining',name:'Exclusive Tables Dining Credit',desc:'Via OpenTable Sapphire Reserve Exclusive Tables',amount:150,startsFrom:2026},
      {id:'c_stub',name:'StubHub / Viagogo Credit',desc:'Concert and event tickets',amount:150,startsFrom:2026},
    ]},
    {label:'Travel credit (Feb–Jan)',cadence:'feb-annual',benefits:[
      {id:'c_travel',name:'Travel Credit',desc:'Any travel purchase — automatic. Resets each February.',amount:300,partial:true},
    ]},
    {label:'Annual',cadence:'annual',benefits:[
      {id:'c_edit1',name:'The Edit Hotel Credit (1 of 2)',desc:'Prepaid 2-night+ stay via Chase Travel The Edit',amount:250,startsFrom:2026},
      {id:'c_edit2',name:'The Edit Hotel Credit (2 of 2)',desc:'Prepaid 2-night+ stay via Chase Travel The Edit',amount:250,startsFrom:2026},
      {id:'c_selecthotel',name:'Select Hotel Credit (2026 only)',desc:'IHG, Montage, Pendry, Omni, Virgin, Minor, Pan Pacific',amount:250,startsFrom:2026},
      {id:'c_apple',name:'Apple TV+ & Apple Music',desc:'Complimentary annual subscriptions — activate once via Chase (through Jun 2027)',amount:240,startsFrom:2026},
      {id:'c_ge',name:'Global Entry / TSA PreCheck / NEXUS',desc:'Statement credit every 4 years',amount:120},
    ]},
  ]},
  chase_sapphire_pref:{name:'Chase Sapphire Preferred',fee:95,historicalFees:{2025:95},feeMonth:0,feeDay:1,sections:[
    {label:'Annual',cadence:'annual',benefits:[
      {id:'csp_hotel',name:'Hotel Credit',desc:'$50 statement credit on hotel stays booked through Chase Travel',amount:50},
    ]},
  ]},
  amex_green:{name:'AMEX Green',fee:150,historicalFees:{2025:150},feeMonth:0,feeDay:1,sections:[
    {label:'Annual (calendar year)',cadence:'cal-annual',benefits:[
      {id:'ag_clear',name:'CLEAR Plus Credit',desc:'Annual CLEAR Plus membership',amount:189},
      {id:'ag_lounge',name:'LoungeBuddy Credit',desc:'Airport lounge access via LoungeBuddy app',amount:100},
    ]},
  ]},
  amex_hilton_honors:{name:'Hilton Honors Aspire',fee:550,historicalFees:{2025:550},feeMonth:0,feeDay:1,sections:[
    {label:'Semi-annual (calendar)',cadence:'cal-semi-annual',benefits:[
      {id:'ah_resort',name:'Hilton Resort Credit',desc:'At eligible Hilton resort properties worldwide',amount:200},
    ]},
    {label:'Annual (calendar year)',cadence:'cal-annual',benefits:[
      {id:'ah_airline',name:'Airline Fee Credit',desc:'Incidental fees with one selected airline',amount:200,partial:true},
      {id:'ah_freenight',name:'Free Night Award',desc:'One free night at any Hilton property worldwide',amount:250},
      {id:'ah_ge',name:'Global Entry / TSA PreCheck',desc:'Statement credit every 4 years',amount:120},
    ]},
  ]},
  amex_marriott_brill:{name:'Marriott Bonvoy Brilliant',fee:650,historicalFees:{2025:650},feeMonth:0,feeDay:1,sections:[
    {label:'Semi-annual (calendar)',cadence:'cal-semi-annual',benefits:[
      {id:'amb_dining',name:'Dining Credit',desc:'Statement credit for U.S. restaurant purchases',amount:150},
    ]},
    {label:'Annual (calendar year)',cadence:'cal-annual',benefits:[
      {id:'amb_freenight',name:'Free Night Award',desc:'One free night at any Marriott property (up to 85,000 pts)',amount:500},
      {id:'amb_propcredit',name:'Property Credit',desc:'$100 on-property credit on qualifying 2-night+ paid stays',amount:100},
      {id:'amb_ge',name:'Global Entry / TSA PreCheck',desc:'Statement credit every 4 years',amount:120},
    ]},
  ]},
  chase_world_of_hyatt:{name:'World of Hyatt',fee:95,historicalFees:{2025:95},feeMonth:0,feeDay:1,sections:[
    {label:'Annual',cadence:'annual',benefits:[
      {id:'hyatt_freenight',name:'Free Night Award',desc:'One free night at Category 1–4 Hyatt properties',amount:150},
    ]},
  ]},
  chase_united_quest:{name:'United Quest',fee:250,historicalFees:{2025:250},feeMonth:0,feeDay:1,sections:[
    {label:'Semi-annual (calendar)',cadence:'cal-semi-annual',benefits:[
      {id:'uq_credit',name:'United Purchase Credit',desc:'Statement credit on United Airlines purchases',amount:125},
    ]},
    {label:'Annual (calendar year)',cadence:'cal-annual',benefits:[
      {id:'uq_miles',name:'Award Miles Back',desc:'Up to 10,000 miles back per year on United award redemptions',amount:100},
      {id:'uq_ge',name:'Global Entry / TSA PreCheck',desc:'Statement credit every 4 years',amount:120},
    ]},
  ]},
  chase_united_club:{name:'United Club Infinite',fee:525,historicalFees:{2025:525},feeMonth:0,feeDay:1,sections:[
    {label:'Annual (calendar year)',cadence:'cal-annual',benefits:[
      {id:'uc_club',name:'United Club Membership',desc:'Unlimited United Club lounge access for cardholder + guests',amount:700},
      {id:'uc_ge',name:'Global Entry / TSA PreCheck',desc:'Statement credit every 4 years',amount:120},
    ]},
  ]},
  citi_strata_prem:{name:'Citi Strata Premier',fee:95,historicalFees:{2025:95},feeMonth:0,feeDay:1,sections:[
    {label:'Annual (calendar year)',cadence:'cal-annual',benefits:[
      {id:'citist_hotel',name:'Hotel Benefit',desc:'$100 off a single hotel stay of $500+ via CitiTravel',amount:100},
    ]},
  ]},
  wf_premier_autograph:{name:'WF Premier Autograph',fee:95,historicalFees:{2026:95},feeMonth:0,feeDay:1,sections:[
    {label:'Annual (calendar year)',cadence:'cal-annual',benefits:[
      {id:'wfpa_airline',name:'Airline Credit',desc:'Annual statement credit toward airline purchases',amount:50},
      {id:'wfpa_hotel',name:'Hotel Credit',desc:'Annual statement credit toward hotel purchases',amount:50},
    ]},
  ]},
};

const NOW=new Date(), CY=NOW.getFullYear(), CM=NOW.getMonth();

// ── Inject style overrides ────────────────────────────────────────────────


const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_FULL=['January','February','March','April','May','June','July','August','September','October','November','December'];
function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;'); }
const FEE_MONTHS=Object.fromEntries(Object.keys(CARDS).map(k=>[k,CARDS[k].feeMonth??0]));
function freshDATA(){ return Object.fromEntries(Object.keys(CARDS).map(k=>[k,{}])); }
const STORAGE_KEY='card-benefits-tracker-v1';
const SUPABASE_URL='https://rsbvddlhismetljqoqre.supabase.co';
const SUPABASE_KEY='sb_publishable_uLJlvYnd-7MiGHMK9SEaww_JwIBveov';
const sb=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

// Show login only if no cached session exists — prevents flash for returning users
try {
  const hasSession = Object.keys(localStorage).some(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
  if (!hasSession) document.getElementById('splash').classList.remove('hidden');
} catch(e) { document.getElementById('splash').classList.remove('hidden'); }

// ── Premium card catalog ──────────────────────────────────────────────────
// Keys for existing supported cards match CARDS object keys; others are catalog-only
const PREMIUM_CARD_CATALOG = [
  // American Express
  {id:'platinum',issuer:'American Express',name:'Amex Platinum',fee:695,supported:true},
  {id:'gold',issuer:'American Express',name:'Amex Gold',fee:325,supported:true},
  {id:'amex_green',issuer:'American Express',name:'Amex Green',fee:150,supported:true},
  {id:'amex_biz_plat',issuer:'American Express',name:'Amex Business Platinum',fee:695,supported:false},
  {id:'amex_biz_gold',issuer:'American Express',name:'Amex Business Gold',fee:375,supported:false},
  {id:'amex_delta_reserve',issuer:'American Express',name:'Delta SkyMiles Reserve',fee:650,supported:false},
  {id:'amex_delta_plat',issuer:'American Express',name:'Delta SkyMiles Platinum',fee:350,supported:false},
  {id:'amex_hilton_honors',issuer:'American Express',name:'Hilton Honors Aspire',fee:550,supported:true},
  {id:'amex_marriott_brill',issuer:'American Express',name:'Marriott Bonvoy Brilliant',fee:650,supported:true},
  {id:'amex_marriott_biz',issuer:'American Express',name:'Marriott Bonvoy Business',fee:125,supported:false},
  // Chase
  {id:'csr',issuer:'Chase',name:'Chase Sapphire Reserve',fee:550,supported:true},
  {id:'chase_sapphire_pref',issuer:'Chase',name:'Chase Sapphire Preferred',fee:95,supported:true},
  {id:'chase_ink_pref',issuer:'Chase',name:'Chase Ink Business Preferred',fee:95,supported:false},
  {id:'chase_world_of_hyatt',issuer:'Chase',name:'World of Hyatt',fee:95,supported:true},
  {id:'chase_united_quest',issuer:'Chase',name:'United Quest',fee:250,supported:true},
  {id:'chase_united_club',issuer:'Chase',name:'United Club Infinite',fee:525,supported:true},
  {id:'chase_southwest_pref',issuer:'Chase',name:'Southwest Rapid Rewards Priority',fee:149,supported:false},
  {id:'chase_marriott_bold',issuer:'Chase',name:'Marriott Bonvoy Boundless',fee:95,supported:false},
  // Capital One
  {id:'cap1_venture_x',issuer:'Capital One',name:'Venture X',fee:395,supported:true},
  {id:'cap1_venture_x_biz',issuer:'Capital One',name:'Venture X Business',fee:395,supported:false},
  {id:'cap1_savor',issuer:'Capital One',name:'Savor Cash Rewards',fee:95,supported:false},
  // Citi
  {id:'citi_strata_prem',issuer:'Citi',name:'Citi Strata Premier',fee:95,supported:true},
  {id:'citi_prestige',issuer:'Citi',name:'Citi Prestige',fee:495,supported:false},
  {id:'citi_aa_exec',issuer:'Citi',name:'AAdvantage Executive World Elite',fee:595,supported:false},
  {id:'citi_aa_plat',issuer:'Citi',name:'AAdvantage Platinum Select',fee:99,supported:false},
  // Wells Fargo
  {id:'wf_premier_autograph',issuer:'Wells Fargo',name:'Premier Autograph Visa Infinite',fee:95,supported:true},
  // Bank of America
  {id:'boa_premium',issuer:'Bank of America',name:'Premium Rewards Elite',fee:550,supported:false},
  {id:'boa_alaska_sig',issuer:'Bank of America',name:'Alaska Airlines Signature',fee:95,supported:false},
  // US Bank
  {id:'usb_altitude_reserve',issuer:'US Bank',name:'Altitude Reserve Visa Infinite',fee:400,supported:false},
  {id:'usb_altitude_connect',issuer:'US Bank',name:'Altitude Connect',fee:95,supported:false},
  // Barclays
  {id:'barc_aa_aviator',issuer:'Barclays',name:'AAdvantage Aviator Red',fee:99,supported:false},
  {id:'barc_jac',issuer:'Barclays',name:'JetBlue Plus',fee:99,supported:false},
  // Other
  {id:'bilt',issuer:'Bilt',name:'Bilt Mastercard',fee:0,supported:false},
  {id:'apple_card',issuer:'Apple',name:'Apple Card',fee:0,supported:false},
];

// ── User state ────────────────────────────────────────────────────────────
let currentUser = null;
let userCards = null; // array of card IDs the user has chosen

let DATA=freshDATA();
let saveTimer=null;
let activeCard='csr', activeView='all-cards';
function getVisibleCardKeys(){
  return (userCards && userCards.length ? userCards : ['csr','gold','platinum','cap1_venture_x']).filter(c=>!!CARDS[c]);
}
let selectedYear=CY;
let _collapsedSections=new Set(['cal-semi-annual','semi-annual','feb-annual','cal-annual','annual']);
let _collapsedCurrentSections=new Set(['semi-annual','cal-semi-annual','feb-annual','cal-annual','annual'].flatMap(c=>['csr','gold','platinum'].map(k=>`current-${k}-${c}`)));

// ── Auth helpers ──────────────────────────────────────────────────────────
let _authTab = 'login';
function switchAuthTab(tab){
  _authTab = tab;
  document.getElementById('tabLogin').classList.toggle('active', tab==='login');
  document.getElementById('tabSignup').classList.toggle('active', tab==='signup');
  document.getElementById('signupExtras').style.display = tab==='signup' ? '' : 'none';
  document.getElementById('authBtn').textContent = tab==='login' ? 'Sign In' : 'Create Account';
  document.getElementById('authSub').textContent = tab==='login' ? 'Sign in to track your credit card perks' : 'Create a free account to get started';
  document.getElementById('authError').textContent = '';
  document.getElementById('authHelper').textContent = '';
  document.getElementById('forgotBtn').style.display = tab==='login' ? '' : 'none';
}

async function handleForgotPassword(){
  const email = document.getElementById('authEmail').value.trim();
  const errEl = document.getElementById('authError');
  const helper = document.getElementById('authHelper');
  errEl.textContent = '';
  helper.textContent = '';
  if(!email){
    errEl.textContent = 'Enter your email address above first.';
    document.getElementById('authEmail').focus();
    return;
  }
  document.getElementById('forgotBtn').textContent = 'Sending…';
  document.getElementById('forgotBtn').disabled = true;
  const {error} = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.href
  });
  document.getElementById('forgotBtn').textContent = 'Forgot password?';
  document.getElementById('forgotBtn').disabled = false;
  if(error){
    errEl.textContent = error.message;
  } else {
    helper.textContent = `✓ Reset link sent to ${email} — check your inbox.`;
    helper.style.color = 'var(--green)';
  }
}

document.getElementById('authBtn').addEventListener('click', handleAuth);
document.getElementById('authEmail').addEventListener('keydown', e=>{ if(e.key==='Enter') handleAuth(); });
document.getElementById('authPassword').addEventListener('keydown', e=>{ if(e.key==='Enter') handleAuth(); });
document.getElementById('authConfirm').addEventListener('keydown', e=>{ if(e.key==='Enter') handleAuth(); });

async function handleAuth(){
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  const errEl = document.getElementById('authError');
  errEl.textContent = '';
  if(!email || !password){ errEl.textContent = 'Please enter email and password.'; return; }

  // ── Demo bypass ──────────────────────────────────────────────
  if(email === 'test' && password === 'test'){
    _sessionHandled = true;
    currentUser = { id: 'demo', email: 'test' };
    document.getElementById('drawerUserEmail').textContent = 'Demo mode';
    userCards = ['csr'];
    DATA = { csr:{}};
    document.getElementById('splash').classList.add('hidden');
    document.getElementById('cardPickerOverlay').classList.add('hidden');
    applyUserCards();
    render();
    setTimeout(initCardFlip, 200);
    return;
  }
  // ────────────────────────────────────────────────────────────

  const btn = document.getElementById('authBtn');
  btn.textContent = '…';
  btn.disabled = true;
  errEl.textContent = '';

  try {
    if(_authTab === 'login'){
      errEl.style.color = 'var(--text-tertiary)';
      errEl.textContent = 'Signing in…';
      const {data, error} = await sb.auth.signInWithPassword({email, password});
      errEl.textContent = '';
      errEl.style.color = 'var(--red)';
      if(error) throw error;
      _sessionHandled = true;
      await onSignedIn(data.user, false);
    } else {
      const confirm = document.getElementById('authConfirm').value;
      if(password !== confirm){ throw new Error('Passwords do not match.'); }
      if(password.length < 6){ throw new Error('Password must be at least 6 characters.'); }
      errEl.style.color = 'var(--text-tertiary)';
      errEl.textContent = 'Creating account…';
      const {data, error} = await sb.auth.signUp({email, password});
      errEl.textContent = '';
      errEl.style.color = 'var(--red)';
      if(error) throw error;
      if(data.user && data.user.identities && data.user.identities.length === 0){
        throw new Error('An account with this email already exists. Please sign in.');
      }
      _sessionHandled = true;
      await onSignedIn(data.user, true);
    }
  } catch(e) {
    _sessionHandled = false;
    errEl.style.color = 'var(--red)';
    errEl.textContent = e.message || 'Authentication failed.';
    btn.textContent = _authTab==='login' ? 'Sign In' : 'Create Account';
    btn.disabled = false;
  }
}

function applyUserCards(){
  // Show only the cards the user has selected, hide the rest
  document.querySelectorAll('.card-btn[data-card]').forEach(btn => {
    const card = btn.dataset.card;
    btn.style.display = (userCards && userCards.includes(card)) ? '' : 'none';
  });
  // Set activeCard to first supported visible card
  const firstCard = (userCards || ['csr']).find(c => CARDS[c]) || 'csr';
  activeCard = firstCard;
  document.querySelectorAll('.card-btn').forEach(b => b.className = 'card-btn');
  const activeBtn = document.querySelector(`.card-btn[data-card="${activeCard}"]`);
  if(activeBtn) activeBtn.classList.add(`active-${activeCard}`);
}

function doUnlock(){
  document.getElementById('splash').classList.add('hidden');
  document.getElementById('cardPickerOverlay').classList.add('hidden');
  try{
    const key = STORAGE_KEY + (currentUser ? '-'+currentUser.id : '');
    const val = localStorage.getItem(key);
    if(val) DATA = Object.assign(freshDATA(), JSON.parse(val));
  }catch(e){}
  applyUserCards();
  render();
  setTimeout(initCardFlip, 200);
  syncFromSupabase();
}

async function onSignedIn(user, isNew){
  currentUser = user;
  document.getElementById('drawerUserEmail').textContent = user.email;

  // Load user profile (cards) from Supabase
  const {data: profile} = await sb.from('user_profiles').select('cards').eq('user_id', user.id).single();

  if(isNew || !profile || !profile.cards || profile.cards.length === 0){
    // New user: show card picker
    document.getElementById('splash').classList.add('hidden');
    showCardPicker();
  } else {
    userCards = profile.cards;
    doUnlock();
  }
}

async function signOut(){
  await sb.auth.signOut();
  _sessionHandled = false;
  currentUser = null;
  userCards = null;
  DATA = freshDATA();
  document.getElementById('splash').classList.remove('hidden');
  document.getElementById('authEmail').value = '';
  document.getElementById('authPassword').value = '';
  document.getElementById('authConfirm').value = '';
  document.getElementById('authError').textContent = '';
  document.getElementById('authBtn').textContent = 'Sign In';
  document.getElementById('authBtn').disabled = false;
  switchAuthTab('login');
}

// Check session on load
// ── Session persistence ───────────────────────────────────────────────────
// Restore session on page refresh only — manual sign-in is handled by handleAuth
let _sessionHandled = false;
sb.auth.onAuthStateChange(async (event, session) => {
  if(event === 'INITIAL_SESSION'){
    if(session && session.user && !_sessionHandled){
      _sessionHandled = true;
      await onSignedIn(session.user, false);
    } else if(!session){
      document.getElementById('splash').classList.remove('hidden');
      setTimeout(()=>document.getElementById('authEmail').focus(), 100);
    }
  }
});

// ── Card picker ───────────────────────────────────────────────────────────
let _cpSelected = new Set();

function renderCPGrid(containerId, searchId, selectedSet){
  const search = (document.getElementById(searchId)?.value||'').toLowerCase();
  const grid = document.getElementById(containerId);
  const isCP = containerId === 'cpGrid';

  // Group by issuer
  const issuers = {};
  PREMIUM_CARD_CATALOG.forEach(c=>{
    if(!c.fee) return; // skip fee-free for brevity unless already selected
    const name = c.name.toLowerCase(), issuer = c.issuer.toLowerCase();
    if(search && !name.includes(search) && !issuer.includes(search)) return;
    if(!issuers[c.issuer]) issuers[c.issuer] = [];
    issuers[c.issuer].push(c);
  });
  // Also show fee-free if searched for
  if(search){
    PREMIUM_CARD_CATALOG.forEach(c=>{
      if(c.fee) return;
      const name = c.name.toLowerCase(), issuer = c.issuer.toLowerCase();
      if(name.includes(search)||issuer.includes(search)){
        if(!issuers[c.issuer]) issuers[c.issuer] = [];
        if(!issuers[c.issuer].find(x=>x.id===c.id)) issuers[c.issuer].push(c);
      }
    });
  }

  let html = '';
  Object.entries(issuers).forEach(([issuer, cards])=>{
    html += `<div class="cp-issuer-header">${issuer}</div>`;
    cards.forEach(c=>{
      const sel = selectedSet.has(c.id);
      const feeLabel = c.fee ? `$${c.fee}/yr` : 'No annual fee';
      const supportedBadge = c.supported ? '' : `<span style="font-size:9px;background:var(--border-light);color:var(--text-tertiary);padding:1px 5px;border-radius:4px;margin-left:4px">catalog</span>`;
      html += `<div class="cp-card-item${sel?' selected':''}" onclick="toggleCPCard('${c.id}','${containerId}','${searchId}',this)">
        <div class="cp-check"></div>
        <div>
          <div class="cp-card-name">${c.name}${supportedBadge}</div>
          <div class="cp-card-fee">${feeLabel}</div>
        </div>
      </div>`;
    });
  });
  if(!html) html = `<div style="color:var(--text-tertiary);font-size:13px;padding:12px;grid-column:1/-1">No cards match "${search}"</div>`;
  grid.innerHTML = html;
}

function toggleCPCard(id, gridId, searchId, el){
  const isCP = gridId === 'cpGrid';
  const set = isCP ? _cpSelected : _mcSelected;
  if(set.has(id)) set.delete(id); else set.add(id);
  renderCPGrid(gridId, searchId, set);
  if(isCP){
    document.getElementById('cpCount').textContent = `${_cpSelected.size} card${_cpSelected.size!==1?'s':''} selected`;
    document.getElementById('cpConfirm').disabled = _cpSelected.size === 0;
  } else {
    document.getElementById('mcCount').textContent = `${_mcSelected.size} card${_mcSelected.size!==1?'s':''} selected`;
  }
}

function filterCPCards(){ renderCPGrid('cpGrid','cpSearch',_cpSelected); }
function filterMCCards(){ renderCPGrid('mcGrid','mcSearch',_mcSelected); }

function showCardPicker(){
  _cpSelected = new Set(['platinum','gold','csr']); // sensible defaults
  document.getElementById('cardPickerOverlay').classList.remove('hidden');
  document.getElementById('cpCount').textContent = `${_cpSelected.size} cards selected`;
  document.getElementById('cpConfirm').disabled = false;
  renderCPGrid('cpGrid','cpSearch',_cpSelected);
}

async function confirmCardPick(){
  const cards = [..._cpSelected];
  if(cards.length === 0) return;
  document.getElementById('cpConfirm').textContent = 'Saving…';
  document.getElementById('cpConfirm').disabled = true;
  await sb.from('user_profiles').upsert({user_id: currentUser.id, cards, updated_at: new Date().toISOString()},{onConflict:'user_id'});
  userCards = cards;
  document.getElementById('cardPickerOverlay').classList.add('hidden');
  doUnlock();
}

// ── My Cards modal ────────────────────────────────────────────────────────
let _mcSelected = new Set();

function openMyCards(){
  _mcSelected = new Set(userCards || ['csr','gold','platinum']);
  document.getElementById('mcCount').textContent = `${_mcSelected.size} cards selected`;
  renderCPGrid('mcGrid','mcSearch',_mcSelected);
  document.getElementById('myCardsModal').classList.remove('hidden');
}
function closeMyCards(){ document.getElementById('myCardsModal').classList.add('hidden'); }

async function saveMyCards(){
  const cards = [..._mcSelected];
  if(cards.length === 0){ alert('Please select at least one card.'); return; }
  document.getElementById('mcSave').textContent = 'Saving…';
  await sb.from('user_profiles').upsert({user_id: currentUser.id, cards, updated_at: new Date().toISOString()},{onConflict:'user_id'});
  userCards = cards;
  applyUserCards();
  if(!userCards.includes(activeCard)) activeCard = getVisibleCardKeys()[0] || 'csr';
  render();
  closeMyCards();
  // Show a toast
  setSave('saved', '✓ Cards updated');
  setTimeout(()=>setSave('',''), 2000);
}

function toggleDark(){
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  document.getElementById('darkIcon').innerHTML = newTheme === 'dark' ? `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="1" x2="8" y2="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="8" y1="13" x2="8" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="1" y1="8" x2="3" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="13" y1="8" x2="15" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="3.05" y1="3.05" x2="4.46" y2="4.46" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="11.54" y1="11.54" x2="12.95" y2="12.95" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12.95" y1="3.05" x2="11.54" y2="4.46" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="4.46" y1="11.54" x2="3.05" y2="12.95" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>` : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  document.getElementById('darkLabel').textContent = newTheme === 'dark' ? 'Light' : 'Dark';
  localStorage.setItem('perks-theme', newTheme);
}

// Load saved theme preference
(function(){
  const saved = localStorage.getItem('perks-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  if(theme === 'dark'){
    document.documentElement.setAttribute('data-theme','dark');
    document.getElementById('darkIcon').innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="1" x2="8" y2="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="8" y1="13" x2="8" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="1" y1="8" x2="3" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="13" y1="8" x2="15" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="3.05" y1="3.05" x2="4.46" y2="4.46" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="11.54" y1="11.54" x2="12.95" y2="12.95" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12.95" y1="3.05" x2="11.54" y2="4.46" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="4.46" y1="11.54" x2="3.05" y2="12.95" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    document.getElementById('darkLabel').textContent = 'Light';
  }
})();

// ── Storage ───────────────────────────────────────────────────────────────
async function syncFromSupabase(){
  if(!currentUser || currentUser.id === 'demo') return;
  try{
    const {data,error}=await sb.from('tracker_data').select('data,updated_at').eq('user_id',currentUser.id).single();
    if(!error&&data&&data.data){
      // Don't overwrite local changes that are newer than the remote row
      const localTs=localStorage.getItem(STORAGE_KEY+'-ts-'+currentUser.id);
      if(localTs && data.updated_at && new Date(data.updated_at) <= new Date(localTs)) return;
      const raw=data.data;
      // Separate extras from benefit toggles
      const remoteExtras={_customAmounts:raw._customAmounts||{},_partial:raw._partial||{},_notes:raw._notes||{},_credited:raw._credited||{}};
      const benefitData={...raw};
      delete benefitData._customAmounts; delete benefitData._partial; delete benefitData._notes; delete benefitData._credited;
      const localExtras={_customAmounts:loadCustomAmounts(),_partial:loadPartial(),_notes:loadNotes(),_credited:loadCredited()};
      const changed=JSON.stringify(benefitData)!==JSON.stringify(DATA)||JSON.stringify(remoteExtras)!==JSON.stringify(localExtras);
      if(changed){
        DATA=Object.assign(freshDATA(),benefitData);
        localStorage.setItem(STORAGE_KEY+'-'+currentUser.id,JSON.stringify(DATA));
        localStorage.setItem(STORAGE_KEY+'-ts-'+currentUser.id,data.updated_at);
        saveCustomAmounts(remoteExtras._customAmounts);
        savePartial(remoteExtras._partial);
        saveNotes(remoteExtras._notes);
        saveCredited(remoteExtras._credited);
        render();
      }
    }
  }catch(e){}
}

async function saveToStorage(){
  if(!currentUser) return;
  if(currentUser.id === 'demo'){ setSave('saved','✓ saved locally'); setTimeout(()=>setSave('',''),2000); return; }
  setSave('saving','saving…');
  const ts=new Date().toISOString();
  try{
    localStorage.setItem(STORAGE_KEY+'-'+currentUser.id,JSON.stringify(DATA));
    localStorage.setItem(STORAGE_KEY+'-ts-'+currentUser.id,ts);
  }catch(e){}
  try{
    const payload={...DATA,_customAmounts:loadCustomAmounts(),_partial:loadPartial(),_notes:loadNotes(),_credited:loadCredited()};
    // Try update first; if no row exists yet, insert
    const {data:updated,error:upErr}=await sb.from('tracker_data').update({data:payload,updated_at:ts}).eq('user_id',currentUser.id).select('user_id');
    if(upErr) throw upErr;
    if(!updated||updated.length===0){
      const {error:insErr}=await sb.from('tracker_data').insert({user_id:currentUser.id,data:payload,updated_at:ts});
      if(insErr) throw insErr;
    }
    setSave('saved','✓ saved');
    setTimeout(()=>setSave('',''),2000);
  }catch(e){
    console.error('[tracker_data save error]', e?.message, e?.code, e?.details, e?.hint);
    setSave('error','⚠ cloud sync failed — saved locally');
    setTimeout(()=>setSave('',''),3000);
  }
}
function scheduleSave(){ clearTimeout(saveTimer); saveTimer=setTimeout(saveToStorage,600); }
function setSave(cls,msg){ const el=document.getElementById('saveStatus'); if(el){el.className='save-status'+(cls?' '+cls:''); el.textContent=msg;} }
function onSupabaseLoaded(){ syncFromSupabase(); }

// ── Data ──────────────────────────────────────────────────────────────────
function bKey(id,pk){ return `${id}__${pk}`; }
function isUsed(card,id,pk){ return !!(DATA[card]||{})[bKey(id,pk)]; }
function toggle(card,id,pk){
  if(!DATA[card]) DATA[card]={};
  const k=bKey(id,pk);
  DATA[card][k]=!DATA[card][k];
  const action=DATA[card][k]?'used':'unused';
  scheduleSave();
  showUndo(card,id,pk,action);
  if(sb&&currentUser){
    sb.from('benefit_log').insert({user_id:currentUser.id,card_key:card,benefit_id:id,period_key:pk,action}).then(({error:e})=>{if(e)console.error('[benefit_log]',e.message,e.code,e.details,e.hint);}).catch(e=>console.error('[benefit_log throw]',e));
  }
}

// ── Period helpers ────────────────────────────────────────────────────────
// cadence types:
//   'monthly', 'quarterly'          — always calendar-aligned
//   'semi-annual'                   — card-year halves
//   'cal-semi-annual'               — calendar halves (Jan–Jun / Jul–Dec)
//   'annual'                        — card-year
//   'cal-annual'                    — calendar year (Jan–Dec)
//   'feb-annual'                    — Feb–Jan cycle (Chase travel credit)

function getCardYearStart(c, forYear){
  const fm=FEE_MONTHS[c];
  const yr=forYear||selectedYear;
  // If viewing a past year, use that year's card year start
  if(yr<CY) return {year:yr, month:fm};
  return CM>=fm?{year:CY,month:fm}:{year:CY-1,month:fm};
}
function getCardYearMonths(c){ const {year,month:fm}=getCardYearStart(c); return Array.from({length:12},(_,i)=>({m:(fm+i)%12,y:year+Math.floor((fm+i)/12)})); }
function isCalFuture(m,y){ return y>CY||(y===CY&&m>CM); }
function isCalCurrent(m,y){ return m===CM&&y===CY; }
function getPK(cadence,m,y){
  if(cadence==='monthly') return `${y}-m${m}`;
  if(cadence==='quarterly') return `${y}-q${Math.floor(m/3)}`;
  if(cadence==='semi-annual'||cadence==='cal-semi-annual') return `${y}-h${m<6?0:1}`;
  return `${y}-annual`;
}

function getCardYearPeriods(cardKey,cadence){
  // feb-annual: Feb–Jan cycle, show current and previous if card year spans both
  if(cadence==='feb-annual'){
    const out=[];
    // current feb-annual window: if CM>=1 (Feb+), current year started Feb CY; else started Feb CY-1
    const curStart=CM>=1?CY:CY-1;
    const prevStart=curStart-1;
    // only show previous if card year overlaps with it
    const {year:fy}=getCardYearStart(cardKey);
    if(fy<=prevStart) out.push({m:1,y:prevStart,pk:`feb-${prevStart}`,lbl:`Feb ${prevStart}–Jan ${prevStart+1}`,calM:1,calY:prevStart,endM:0,endY:prevStart+1});
    out.push({m:1,y:curStart,pk:`feb-${curStart}`,lbl:`Feb ${curStart}–Jan ${curStart+1}`,calM:1,calY:curStart,endM:0,endY:curStart+1});
    return out;
  }
  // Calendar-reset cadences: ignore card-year boundaries
  if(cadence==='cal-annual'){
    // Show previous cal year + current cal year if card year spans two cal years, else just current
    const {year:fy}=getCardYearStart(cardKey);
    const out=[];
    if(fy<CY) out.push({m:0,y:fy,pk:`${fy}-annual`,lbl:`${fy}`,calM:0,calY:fy});
    out.push({m:0,y:CY,pk:`${CY}-annual`,lbl:`${CY}`,calM:0,calY:CY});
    return out;
  }
  if(cadence==='cal-semi-annual'){
    // Show all cal halves that overlap with the card year window
    const months=getCardYearMonths(cardKey);
    const seen=new Set(),out=[];
    months.forEach(mo=>{
      const pk=getPK('cal-semi-annual',mo.m,mo.y);
      if(!seen.has(pk)){
        seen.add(pk);
        const isH1=mo.m<6;
        out.push({m:isH1?0:6,y:mo.y,pk,lbl:isH1?`Jan–Jun ${mo.y}`:`Jul–Dec ${mo.y}`,calM:isH1?0:6,calY:mo.y,endM:isH1?5:11,endY:mo.y});
      }
    });
    return out;
  }

  const months=getCardYearMonths(cardKey);
  if(cadence==='monthly') return months.map(mo=>({m:mo.m,y:mo.y,pk:getPK(cadence,mo.m,mo.y),lbl:MONTHS[mo.m],calM:mo.m,calY:mo.y}));
  const seen=new Set(),out=[];
  if(cadence==='quarterly'){
    months.forEach(mo=>{ const pk=getPK(cadence,mo.m,mo.y); if(!seen.has(pk)){seen.add(pk);out.push({m:mo.m,y:mo.y,pk,lbl:`Q${Math.floor(mo.m/3)+1}`,calM:mo.m,calY:mo.y});} });
  } else if(cadence==='semi-annual'){
    const {year:fy,month:fm}=getCardYearStart(cardKey);
    out.push({m:months[0].m,y:months[0].y,pk:`cy-${fy}-${fm}-h1`,lbl:'H1',calM:months[0].m,calY:months[0].y,endM:months[5].m,endY:months[5].y});
    if(months[6]) out.push({m:months[6].m,y:months[6].y,pk:`cy-${fy}-${fm}-h2`,lbl:'H2',calM:months[6].m,calY:months[6].y,endM:months[11].m,endY:months[11].y});
  } else { // annual (card-year)
    const {year:fy,month:fm}=getCardYearStart(cardKey);
    out.push({m:months[0].m,y:months[0].y,pk:`cy-${fy}-${fm}-annual`,lbl:`${MONTHS[months[0].m]} ${months[0].y}–${MONTHS[months[11].m]} ${months[11].y}`,calM:months[0].m,calY:months[0].y});
  }
  return out;
}

function getYTDPeriods(cadence){
  const SY=selectedYear;
  const isCurrentYear=SY===CY;
  const isFutureYear=SY>CY;
  const lastMonth=isCurrentYear?CM:(isFutureYear?-1:11); // future = no months yet, past = all 12
  if(cadence==='feb-annual'){
    const curStart=SY>=CY&&CM>=1?CY:SY;
    return [{m:1,y:curStart,pk:`feb-${curStart}`,lbl:`Feb ${curStart}–Jan ${curStart+1}`,calM:1,calY:curStart,endM:0,endY:curStart+1}];
  }
  if(cadence==='monthly') return Array.from({length:lastMonth+1},(_,m)=>({m,y:SY,pk:getPK(cadence,m,SY),lbl:MONTHS[m],calM:m,calY:SY}));
  if(cadence==='quarterly'){ const seen=new Set(),out=[]; for(let m=0;m<=lastMonth;m++){ const pk=getPK(cadence,m,SY); if(!seen.has(pk)){seen.add(pk);out.push({m,y:SY,pk,lbl:`Q${Math.floor(m/3)+1}`,calM:m,calY:SY});} } return out; }
  if(cadence==='semi-annual'||cadence==='cal-semi-annual'){
    const out=[{m:0,y:SY,pk:getPK('cal-semi-annual',0,SY),lbl:`H1 (Jan–Jun ${SY})`,calM:0,calY:SY,endM:5,endY:SY}];
    if(lastMonth>=6) out.push({m:6,y:SY,pk:getPK('cal-semi-annual',6,SY),lbl:`H2 (Jul–Dec ${SY})`,calM:6,calY:SY,endM:11,endY:SY});
    return out;
  }
  return [{m:0,y:SY,pk:`${SY}-annual`,lbl:`${SY}`,calM:0,calY:SY}];
}

function isPFuture(p){ return isCalFuture(p.calM,p.calY); }
function isPCurrent(cadence,p){
  if(cadence==='monthly') return isCalCurrent(p.calM,p.calY);
  if(cadence==='quarterly') return Math.floor(p.calM/3)===Math.floor(CM/3)&&p.calY===CY;
  if(cadence==='semi-annual'){ const s=p.calY*12+p.calM,e=(p.endY||CY)*12+(p.endM!==undefined?p.endM:11),n=CY*12+CM; return n>=s&&n<=e; }
  if(cadence==='cal-semi-annual'){ const s=p.calY*12+p.calM,e=p.calY*12+(p.endM!==undefined?p.endM:11),n=CY*12+CM; return n>=s&&n<=e; }
  if(cadence==='cal-annual') return p.calY===CY;
  if(cadence==='feb-annual'){ const s=p.calY*12+1,e=(p.endY||p.calY+1)*12+(p.endM!==undefined?p.endM:0),n=CY*12+CM; return n>=s&&n<=e; }
  return !isPFuture(p);
}
function isYTDCurrent(cadence,p){
  // If viewing a past year, nothing is "current" — all periods are past and editable
  if(selectedYear<CY) return false;
  if(cadence==='monthly') return isCalCurrent(p.calM,p.calY);
  if(cadence==='quarterly') return Math.floor(p.calM/3)===Math.floor(CM/3)&&p.calY===CY;
  if(cadence==='semi-annual'||cadence==='cal-semi-annual'){ const s=p.calY*12+p.calM,e=p.calY*12+(p.endM!==undefined?p.endM:11),n=CY*12+CM; return n>=s&&n<=e; }
  if(cadence==='feb-annual'){ const s=p.calY*12+1,e=(p.endY||p.calY+1)*12+(p.endM!==undefined?p.endM:0),n=CY*12+CM; return n>=s&&n<=e; }
  return false;
}
function getCurrentPK(cardKey,cadence){
  const ps=getCardYearPeriods(cardKey,cadence);
  for(const p of ps){if(isPCurrent(cadence,p)) return p.pk;}
  let last=null; for(const p of ps){if(!isPFuture(p)) last=p;}
  return last?last.pk:ps[0].pk;
}
function getCurrentLabel(cardKey,cadence){
  if(cadence==='monthly') return `${MONTHS_FULL[CM]} ${CY}`;
  const ps=getCardYearPeriods(cardKey,cadence);
  for(const p of ps){if(isPCurrent(cadence,p)) return p.lbl+(p.endM!==undefined&&!p.lbl.includes('–')?` (${MONTHS[p.calM]}–${MONTHS[p.endM]})`:'');}
  return '';
}

function getBAmount(b,p){ return (b.decAmount && p.m===11) ? b.decAmount : b.amount; }

function getFee(cardKey, year){
  const card=CARDS[cardKey];
  year=year||selectedYear;
  return (card.historicalFees&&card.historicalFees[year]!==undefined) ? card.historicalFees[year] : card.fee;
}
function isBExpired(b,p){
  if(!b.expiresAfter) return false;
  const {y,h} = b.expiresAfter;
  const expAbs = y*12 + (h===0 ? 5 : 11);
  const pAbs = p.calY*12 + p.calM;
  return pAbs > expAbs;
}
function isBNotAvailable(b, viewYear){
  // hide benefits that started after the year being viewed
  if(b.startsFrom && viewYear < b.startsFrom) return true;
  return false;
}

function calcStats(cardKey,getPsFn,isCurFn){
  const card=CARDS[cardKey]; let captured=0,missed=0,total=0;
  card.sections.forEach(s=>{ const ps=getPsFn(s.cadence); ps.forEach(p=>{ const fut=isPFuture(p),cur=isCurFn(s.cadence,p); s.benefits.forEach(b=>{ if(isBExpired(b,p)||isBNotAvailable(b,selectedYear)) return; const amt=getBAmount(b,p); total+=amt; const used=isUsed(cardKey,b.id,p.pk); if(used) captured+=amt; else if(!fut&&!cur) missed+=amt; }); }); });
  return {captured,missed,total};
}

function metricsHTML(m1l,m1v,m2l,m2v,m3l,m3v,m4l,m4v,m4cls=''){
  return `<div class="metrics">
    <div class="metric"><div class="metric-label">${m1l}</div><div class="metric-val">${m1v}</div></div>
    <div class="metric"><div class="metric-label">${m2l}</div><div class="metric-val green">${m2v}</div></div>
    <div class="metric"><div class="metric-label">${m3l}</div><div class="metric-val red">${m3v}</div></div>
    <div class="metric"><div class="metric-label">${m4l}</div><div class="metric-val ${m4cls}">${m4v}</div></div>
  </div>`;
}

function progressHTML(pct,left,right){
  return `<div class="progress-wrap"><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div><div class="progress-labels"><span>${pct}% captured</span><span>${right}</span></div></div>`;
}

// ── Page Transitions ──────────────────────────────────────────────────────
function setWithTransition(html){
  const main=document.getElementById('main');
  main.classList.add('transitioning');
  setTimeout(()=>{
    main.innerHTML=html;
    main.classList.remove('transitioning');
  },180);
}

// ── Swipe gestures ────────────────────────────────────────────────────────
const TOP_VIEWS=['all-cards','this-period','card-year','ytd'];
let touchStartX=0, touchStartY=0;
document.addEventListener('touchstart',e=>{ touchStartX=e.touches[0].clientX; touchStartY=e.touches[0].clientY; },{passive:true});
document.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-touchStartX;
  const dy=e.changedTouches[0].clientY-touchStartY;
  if(Math.abs(dx)<40||Math.abs(dy)>Math.abs(dx)*0.8) return; // not a horizontal swipe
  if(dx<-40&&touchStartX>30){ // swipe left — next tab
    const idx=TOP_VIEWS.indexOf(activePrimary);
    if(idx<TOP_VIEWS.length-1) setActiveView(TOP_VIEWS[idx+1]);
  } else if(dx>40){ // swipe right — prev tab
    const idx=TOP_VIEWS.indexOf(activePrimary);
    if(idx>0) setActiveView(TOP_VIEWS[idx-1]);
  }
},{passive:true});

// ── Keyboard shortcuts ────────────────────────────────────────────────────
document.addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;
  if(e.key==='1') setActiveView('all-cards');
  else if(e.key==='2') setActiveView('this-period');
  else if(e.key==='3') setActiveView('card-year');
  else if(e.key==='4') setActiveView('ytd');
  else if(e.key==='m'||e.key==='M') openDrawer();
  else if(e.key==='Escape') closeDrawer();
});

// ── Web Notifications ─────────────────────────────────────────────────────
async function requestNotifications(){
  if(!('Notification' in window)){ alert('Notifications not supported in this browser.'); return; }
  const perm=await Notification.requestPermission();
  if(perm==='granted'){
    localStorage.setItem('perks-notif','1');
    scheduleMonthlyReminder();
    new Notification('Perks Ledger',{body:'Notifications enabled! You\'ll be reminded at month-end.',icon:'apple-touch-icon.png'});
    renderInsights(); // re-render to update button
  }
}

function scheduleMonthlyReminder(){
  // Check daily if it's the last 3 days of the month and fire a notification
  const now=new Date();
  const eom=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();
  const day=now.getDate();
  if(day>=eom-2&&localStorage.getItem('perks-notif')==='1'){
    const key=`notif-sent-${now.getFullYear()}-${now.getMonth()}`;
    if(!localStorage.getItem(key)){
      // Count unclaimed across all cards
      let total=0;
      getVisibleCardKeys().forEach(ck=>{
        total+=getUnclaimedMonthly(ck).reduce((s,b)=>s+b.amt,0);
      });
      if(total>0){
        new Notification('Perks Ledger 💳',{
          body:`You have $${total.toFixed(0)} in unclaimed benefits expiring this month!`,
          icon:'apple-touch-icon.png'
        });
        localStorage.setItem(key,'1');
      }
    }
  }
}
// Run on load
if(localStorage.getItem('perks-notif')==='1') scheduleMonthlyReminder();

// ── Editable Benefit Amounts ──────────────────────────────────────────────
const CUSTOM_AMOUNTS_KEY='perks-custom-amounts';
function loadCustomAmounts(){ try{ return JSON.parse(localStorage.getItem(CUSTOM_AMOUNTS_KEY)||'{}'); }catch(e){ return {}; } }
function saveCustomAmounts(d){ localStorage.setItem(CUSTOM_AMOUNTS_KEY,JSON.stringify(d)); }
function getEffectiveAmount(cardKey,benefitId,baseAmount){
  const custom=loadCustomAmounts();
  return custom[`${cardKey}__${benefitId}`]||baseAmount;
}
function setCustomAmount(cardKey,benefitId,amount){
  const d=loadCustomAmounts();
  if(amount===null) delete d[`${cardKey}__${benefitId}`];
  else d[`${cardKey}__${benefitId}`]=amount;
  saveCustomAmounts(d);
}

// ── Expiry helper ─────────────────────────────────────────────────────────
function getExpiryBadge(b){
  if(!b.expiresAfter) return '';
  const {y,h}=b.expiresAfter;
  const expMonth=h===0?5:11;
  const expAbs=y*12+expMonth;
  const nowAbs=CY*12+CM;
  const monthsLeft=expAbs-nowAbs;
  if(monthsLeft<=0) return '';
  if(monthsLeft<=3) return `<span class="expiry-badge">ends ${MONTHS[expMonth]} ${y}</span>`;
  if(monthsLeft<=6) return `<span class="expiry-badge soon">ends ${MONTHS[expMonth]} ${y}</span>`;
  return '';
}

function getBenefitExpiryLabel(b){
  if(b.startsFrom && CY<b.startsFrom) return '';
  // Check if it expires this year or next
  const now=new Date();
  if(b.desc && b.desc.includes('through')){
    const match=b.desc.match(/through\s+([\w]+\s+\d{4})/i);
    if(match){
      const expDate=new Date(match[1]);
      const monthsLeft=Math.round((expDate-now)/(1000*60*60*24*30));
      if(monthsLeft<=6&&monthsLeft>0) return `<span class="expiry-badge soon">⏰ ${monthsLeft}mo left</span>`;
    }
  }
  return '';
}

// ── Projection ────────────────────────────────────────────────────────────
// Split captured value into repeating (monthly/quarterly) vs one-time (annual etc.)
// One-time benefits are already fully captured — don't extrapolate them.
// Only repeating benefits get projected forward by run rate.
function calcCapturedByType(cardKey){
  const card=CARDS[cardKey];
  const REPEATING=['monthly','quarterly'];
  let repeating=0, oneTime=0;
  const {year:cyStart,month:cyStartMonth}=getCardYearStart(cardKey,CY);
  const cyStartAbs=cyStart*12+cyStartMonth;
  const cyEndAbs=cyStartAbs+11;
  card.sections.forEach(s=>{
    const isRepeating=REPEATING.includes(s.cadence);
    const ps=getCardYearPeriods(cardKey,s.cadence);
    ps.forEach(p=>{
      if(isPFuture(p)) return;
      // For repeating cadences, only count periods within the card year window
      // (avoids extrapolating monthly credits from before the card year started)
      if(isRepeating){
        const pAbs=p.calY*12+p.calM;
        if(pAbs<cyStartAbs||pAbs>cyEndAbs) return;
      }
      // For one-time cadences (annual, semi-annual, feb-annual etc.), trust
      // getCardYearPeriods which already returns the correct current-year periods.
      // Applying a range check here incorrectly excludes periods that START before
      // the card year but overlap it (e.g. CSR feb-annual starts Feb, card year Apr).
      s.benefits.forEach(b=>{
        if(isBExpired(b,p)||isBNotAvailable(b,CY)) return;
        if(!isUsed(cardKey,b.id,p.pk)) return;
        const amt=getBAmount(b,p);
        if(isRepeating) repeating+=amt;
        else oneTime+=amt;
      });
    });
  });
  return {repeating, oneTime};
}

function buildProjection(cardKey){
  const CARD_LABELS={gold:'AMEX Gold',platinum:'AMEX Platinum',csr:'Chase Sapphire Reserve',cap1_venture_x:'Capital One Venture X',chase_sapphire_pref:'Sapphire Preferred',amex_green:'AMEX Green',amex_hilton_honors:'Hilton Honors Aspire',amex_marriott_brill:'Marriott Bonvoy Brilliant',chase_world_of_hyatt:'World of Hyatt',chase_united_quest:'United Quest',chase_united_club:'United Club Infinite',citi_strata_prem:'Citi Strata Premier',wf_premier_autograph:'WF Premier Autograph'};
  const CARD_CLS={gold:'gold',platinum:'platinum',csr:'csr',cap1_venture_x:'venturex',chase_sapphire_pref:'csp',amex_green:'amexgreen',amex_hilton_honors:'hilton',amex_marriott_brill:'marriott',chase_world_of_hyatt:'hyatt',chase_united_quest:'unitedq',chase_united_club:'unitedclub',citi_strata_prem:'citistrata',wf_premier_autograph:'wfpremier'};
  const {month:fm}=getCardYearStart(cardKey,CY);
  const monthsElapsed=Math.max(1, CM>=fm?CM-fm+1:12-(fm-CM));
  const monthsRemaining=12-monthsElapsed;
  const {repeating,oneTime}=calcCapturedByType(cardKey);
  // Extrapolate only repeating benefits; one-time credits are already fully captured
  const projectedRepeating=monthsRemaining>0?(repeating/monthsElapsed)*monthsRemaining:0;
  const projected=oneTime+repeating+projectedRepeating;
  const fee=getFee(cardKey,CY);
  const projectedEffective=fee-projected;
  const isProfit=projected>fee;
  return `<div class="projection-bar">
    <div>
      <div style="font-size:10px;font-family:var(--mono);text-transform:uppercase;letter-spacing:0.06em;color:var(--text-tertiary);margin-bottom:2px">${CARD_LABELS[cardKey]}</div>
      <div class="projection-label">📈 Projected year-end capture</div>
      <div style="font-size:10px;font-family:var(--mono);color:var(--text-tertiary)">at current rate · ${monthsRemaining} months left</div>
    </div>
    <div style="text-align:right">
      <div class="projection-val" style="color:${isProfit?'var(--green)':''}">$${projected.toFixed(0)}${isProfit?' 🎉':''}</div>
      <div style="font-size:10px;font-family:var(--mono);color:var(--text-tertiary)">${isProfit?'+$'+Math.abs(projectedEffective).toFixed(0)+' profit':'~$'+Math.abs(projectedEffective).toFixed(0)+' effective fee'}</div>
    </div>
  </div>`;
}

// ── Heatmap ───────────────────────────────────────────────────────────────
function renderHeatmap(){
  const CARD_KEYS=getVisibleCardKeys();
  const CARD_LABELS={gold:'AMEX Gold',platinum:'AMEX Platinum',csr:'Chase Sapphire Reserve',cap1_venture_x:'Capital One Venture X',chase_sapphire_pref:'Sapphire Preferred',amex_green:'AMEX Green',amex_hilton_honors:'Hilton Honors Aspire',amex_marriott_brill:'Marriott Bonvoy Brilliant',chase_world_of_hyatt:'World of Hyatt',chase_united_quest:'United Quest',chase_united_club:'United Club Infinite',citi_strata_prem:'Citi Strata Premier',wf_premier_autograph:'WF Premier Autograph'};
  let html=`<div class="banner">🗓 <strong>Missed money heatmap</strong> — monthly benefits capture rate by card</div>`;
  // Heatmap rendered as a plain CSS grid — no class-based colors so stylesheet can't interfere
  const CELL_W=42,CELL_H=36,COLS=13;
  html+=`<div style="overflow-x:auto;-webkit-overflow-scrolling:touch">`;
  html+=`<div style="display:grid;grid-template-columns:80px repeat(12,${CELL_W}px);gap:3px;min-width:${80+COLS*CELL_W+COLS*3}px">`;

  // Header row
  html+=`<div></div>`;
  for(let m=0;m<12;m++) html+=`<div style="text-align:center;font-size:10px;font-family:var(--mono);color:var(--text-tertiary);padding:4px 0">${MONTHS[m]}</div>`;

  CARD_KEYS.forEach(cardKey=>{
    const card=CARDS[cardKey];
    html+=`<div style="font-size:10px;font-family:var(--mono);color:var(--text-tertiary);display:flex;align-items:center;padding-right:6px">${CARD_LABELS[cardKey]}</div>`;
    for(let m=0;m<12;m++){
      const isFut=m>CM;
      if(isFut){
        html+=`<div style="height:${CELL_H}px;border-radius:5px;background:var(--surface);display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--text-tertiary)">–</div>`;
        continue;
      }
      let total=0,claimed=0;
      card.sections.forEach(s=>{
        if(s.cadence!=='monthly') return;
        const pk=getPK('monthly',m,CY);
        s.benefits.forEach(b=>{
          if(isBNotAvailable(b,CY)||isBExpired(b,{calY:CY,calM:m,m})) return;
          total++;
          if(isUsed(cardKey,b.id,pk)) claimed++;
        });
      });
      const rate=total>0?claimed/total:0;
      const pct=total>0?Math.round(rate*100):null;
      const bg=total===0||rate===0
        ? 'var(--border-light)'
        : rate<0.5
          ? 'rgba(220,60,60,0.6)'
          : rate<0.9
            ? 'rgba(210,160,0,0.5)'
            : rate<1
              ? 'rgba(210,160,0,0.85)'
              : '#2a9b6a';
      const fg=rate>=1?'#fff':rate>0&&rate<0.5?'#fff':'var(--text)';
      html+=`<div style="height:${CELL_H}px;border-radius:5px;background:${bg};display:flex;align-items:center;justify-content:center;font-size:10px;font-family:var(--mono);color:${fg}" title="${MONTHS[m]}: ${claimed}/${total} claimed">${pct!==null?pct+'%':'–'}</div>`;
    }
  });

  html+=`</div></div>`;

  // Legend
  html+=`<div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap;font-size:10px;font-family:var(--mono);color:var(--text-tertiary)">
    <span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:var(--border-light);vertical-align:middle;margin-right:4px"></span>0%</span>
    <span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:rgba(220,60,60,0.55);vertical-align:middle;margin-right:4px"></span>1–49%</span>
    <span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:rgba(210,160,0,0.45);vertical-align:middle;margin-right:4px"></span>50–89%</span>
    <span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:rgba(210,160,0,0.75);vertical-align:middle;margin-right:4px"></span>90–99%</span>
    <span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:var(--green);vertical-align:middle;margin-right:4px"></span>100%</span>
  </div>`;

  set(html);
}

// ── ROI Score ─────────────────────────────────────────────────────────────
function getCardYearMonthsElapsed(cardKey){
  const {month:fm}=getCardYearStart(cardKey,CY);
  return Math.max(1, CM>=fm ? CM-fm+1 : 12-(fm-CM));
}

function getProjectedCapture(cardKey){
  // Use cadence-aware projection: one-time benefits (annual, semi-annual etc.) are
  // counted as-is since they won't repeat. Only monthly/quarterly benefits are extrapolated.
  const {month:fm}=getCardYearStart(cardKey,CY);
  const monthsElapsed=Math.max(1, CM>=fm ? CM-fm+1 : 12-(fm-CM));
  const monthsRemaining=12-monthsElapsed;
  const {repeating,oneTime}=calcCapturedByType(cardKey);
  const projectedRepeating=monthsRemaining>0?(repeating/monthsElapsed)*monthsRemaining:0;
  return oneTime+repeating+projectedRepeating;
}

function getROIGrade(captured, fee, cardKey){
  // Grade based on projected year-end capture vs fee (not current snapshot)
  // This is fair even for cards that just renewed
  const projected=getProjectedCapture(cardKey);
  const ratio=fee>0?projected/fee:0;
  if(ratio>=1.0) return 'A';
  if(ratio>=0.8) return 'B';
  if(ratio>=0.5) return 'C';
  return 'D';
}

function renderROI(){
  const CARD_KEYS=getVisibleCardKeys();
  const CARD_LABELS={gold:'AMEX Gold',platinum:'AMEX Platinum',csr:'Chase Sapphire Reserve',cap1_venture_x:'Capital One Venture X',chase_sapphire_pref:'Sapphire Preferred',amex_green:'AMEX Green',amex_hilton_honors:'Hilton Honors Aspire',amex_marriott_brill:'Marriott Bonvoy Brilliant',chase_world_of_hyatt:'World of Hyatt',chase_united_quest:'United Quest',chase_united_club:'United Club Infinite',citi_strata_prem:'Citi Strata Premier',wf_premier_autograph:'WF Premier Autograph'};
  const CARD_CLS={gold:'gold',platinum:'platinum',csr:'csr',cap1_venture_x:'venturex',chase_sapphire_pref:'csp',amex_green:'amexgreen',amex_hilton_honors:'hilton',amex_marriott_brill:'marriott',chase_world_of_hyatt:'hyatt',chase_united_quest:'unitedq',chase_united_club:'unitedclub',citi_strata_prem:'citistrata',wf_premier_autograph:'wfpremier'};

  let html=`<div class="banner">🎯 <strong>Card ROI scores</strong> — graded on annual fee coverage</div>`;
  html+=`<div class="comparison-grid">`;

  CARD_KEYS.forEach(cardKey=>{
    const fee=getFee(cardKey,CY);
    const {captured,missed,total}=calcStats(cardKey,c=>getCardYearPeriods(cardKey,c),isPCurrent);
    const projected=getProjectedCapture(cardKey);
    const elapsed=getCardYearMonthsElapsed(cardKey);
    const grade=getROIGrade(captured,fee,cardKey);
    const effectiveFee=fee-captured;
    const projRatio=fee>0?projected/fee:0;

    const gradeDesc={
      A:`On pace to capture $${projected.toFixed(0)} — covering the $${fee} fee`,
      B:`Projecting $${projected.toFixed(0)} by year end — close to the $${fee} fee`,
      C:`Projecting $${projected.toFixed(0)} — need to use more benefits`,
      D:`Only ${Math.round(projRatio*100)}% of fee covered at current pace`
    }[grade];

    html+=`<div class="comparison-card ${CARD_CLS[cardKey]}">
      <div class="comp-card-name">${CARD_LABELS[cardKey]}</div>
      <div class="roi-grade ${grade}">${grade}</div>
      <div class="roi-label">${effectiveFee<=0?'$'+Math.abs(effectiveFee).toFixed(0)+' profit so far':'$'+captured.toFixed(0)+' of $'+fee+' captured'}</div>
      <div class="roi-desc">${gradeDesc}</div>
      <div class="comp-divider"></div>
      <div style="font-size:11px;font-family:var(--mono);color:var(--text-tertiary)">
        Month ${elapsed} of 12 · $${projected.toFixed(0)} projected<br>
        ${Math.round(projRatio*100)}% of fee covered at this pace
      </div>
    </div>`;
  });

  html+=`</div>`;
  set(html);
}

// ── Insights hub ──────────────────────────────────────────────────────────
function renderInsights(){
  const notifEnabled=localStorage.getItem('perks-notif')==='1';
  const notifSupported='Notification' in window;
  const notifGranted=notifSupported&&Notification.permission==='granted';

  let html=`<div class="banner">💡 <strong>Insights</strong> — projections, heatmap, and ROI scores</div>`;

  // Notification section
  if(notifSupported){
    if(!notifGranted){
      html+=`<div class="notif-banner">
        <div style="flex:1">🔔 <strong>Enable notifications</strong> — get reminded when monthly benefits are about to expire</div>
        <button class="notif-btn" onclick="requestNotifications()">Enable</button>
      </div>`;
    } else {
      html+=`<div class="notif-banner" style="background:rgba(42,155,106,0.1);border-color:rgba(42,155,106,0.3);color:var(--green)">
        ✓ Notifications enabled — you'll be reminded in the last 3 days of each month
      </div>`;
    }
  }

  // Projections for each card
  html+=`<div class="section-header"><span class="section-title">Year-end projections</span></div>`;
  getVisibleCardKeys().forEach(ck=>{ html+=buildProjection(ck)||''; });

  // Mini ROI grid
  html+=`<div class="section-header" style="margin-top:16px"><span class="section-title">ROI scores</span><span class="section-period">tap for details</span></div>`;
  const CARD_KEYS=getVisibleCardKeys();
  const CARD_LABELS={gold:'AMEX Gold',platinum:'AMEX Platinum',csr:'Chase Sapphire Reserve',cap1_venture_x:'Capital One Venture X',chase_sapphire_pref:'Sapphire Preferred',amex_green:'AMEX Green',amex_hilton_honors:'Hilton Honors Aspire',amex_marriott_brill:'Marriott Bonvoy Brilliant',chase_world_of_hyatt:'World of Hyatt',chase_united_quest:'United Quest',chase_united_club:'United Club Infinite',citi_strata_prem:'Citi Strata Premier',wf_premier_autograph:'WF Premier Autograph'};
  const CARD_CLS={gold:'gold',platinum:'platinum',csr:'csr',cap1_venture_x:'venturex',chase_sapphire_pref:'csp',amex_green:'amexgreen',amex_hilton_honors:'hilton',amex_marriott_brill:'marriott',chase_world_of_hyatt:'hyatt',chase_united_quest:'unitedq',chase_united_club:'unitedclub',citi_strata_prem:'citistrata',wf_premier_autograph:'wfpremier'};
  html+=`<div class="comparison-grid" style="margin-bottom:16px">`;
  CARD_KEYS.forEach(cardKey=>{
    const fee=getFee(cardKey,CY);
    const {captured,total}=calcStats(cardKey,c=>getCardYearPeriods(cardKey,c),isPCurrent);
    const grade=getROIGrade(captured,fee,cardKey);
    const projected=getProjectedCapture(cardKey);
    const ratio=fee>0?Math.round(projected/fee*100):0;
    html+=`<div class="comparison-card ${CARD_CLS[cardKey]}">
      <div class="comp-card-name">${CARD_LABELS[cardKey]}</div>
      <div class="roi-grade ${grade}" style="font-size:36px">${grade}</div>
      <div class="roi-label">${ratio}% of fee covered</div>
    </div>`;
  });
  html+=`</div>`;

  // Heatmap link
  html+=`<div class="section-header"><span class="section-title">Missed money heatmap</span><span class="section-period" style="cursor:pointer;color:var(--gold)" onclick="setActiveView('heatmap')">View →</span></div>`;
  html+=`<div style="font-size:12px;color:var(--text-secondary);padding:8px 0">See which months you consistently miss benefits across all 3 cards.</div>`;

  set(html);
}

// ── Advanced Tracking Features ────────────────────────────────────────────

// ── Partial Use Tracking ──────────────────────────────────────────────────
const PARTIAL_KEY='perks-partial';
function loadPartial(){ try{ return JSON.parse(localStorage.getItem(PARTIAL_KEY)||'{}'); }catch(e){ return {}; } }
function savePartial(d){ localStorage.setItem(PARTIAL_KEY,JSON.stringify(d)); }
function getPartialKey(cardKey,benefitId,pk){ return `${cardKey}__${benefitId}__${pk}`; }
function getPartialUsed(cardKey,benefitId,pk){ return loadPartial()[getPartialKey(cardKey,benefitId,pk)]||0; }
function setPartialUsed(cardKey,benefitId,pk,amount){
  const d=loadPartial();
  d[getPartialKey(cardKey,benefitId,pk)]=amount;
  savePartial(d);
  // Mark as used in DATA if amount >= total
  const card=CARDS[cardKey];
  let totalAmt=0;
  card.sections.forEach(s=>s.benefits.forEach(b=>{ if(b.id===benefitId) totalAmt=b.amount; }));
  if(!DATA[cardKey]) DATA[cardKey]={};
  DATA[cardKey][bKey(benefitId,pk)]= amount>=totalAmt;
  scheduleSave();
}
function buildPartialBar(cardKey,benefitId,pk,totalAmt){
  const used=getPartialUsed(cardKey,benefitId,pk);
  const pct=Math.min(100,Math.round(used/totalAmt*100));
  return `<div class="partial-bar">
    <div class="partial-track"><div class="partial-fill" style="width:${pct}%"></div></div>
    <div class="partial-label">
      <span>$${used.toFixed(0)} used</span>
      <span>$${(totalAmt-used).toFixed(0)} remaining</span>
    </div>
    <div class="partial-input-row">
      <input class="partial-input" type="number" min="0" max="${totalAmt}" step="1"
        value="${used}" placeholder="$0"
        data-card="${cardKey}" data-id="${benefitId}" data-pk="${pk}" data-total="${totalAmt}"
        style="width:80px"/>
      <span style="font-size:11px;color:var(--text-tertiary);font-family:var(--mono)">/ $${totalAmt} total</span>
    </div>
  </div>`;
}

// ── Priority Queue ────────────────────────────────────────────────────────
function buildPriorityQueue(){
  const eomDays=daysUntilEOM();
  const items=[];
  const CARD_LABELS={gold:'AMEX Gold',platinum:'AMEX Platinum',csr:'Chase Sapphire Reserve',cap1_venture_x:'Capital One Venture X',chase_sapphire_pref:'Sapphire Preferred',amex_green:'AMEX Green',amex_hilton_honors:'Hilton Honors Aspire',amex_marriott_brill:'Marriott Bonvoy Brilliant',chase_world_of_hyatt:'World of Hyatt',chase_united_quest:'United Quest',chase_united_club:'United Club Infinite',citi_strata_prem:'Citi Strata Premier',wf_premier_autograph:'WF Premier Autograph'};

  Object.keys(CARDS).forEach(cardKey=>{
    const card=CARDS[cardKey];
    card.sections.forEach(s=>{
      const pk=getCurrentPK(cardKey,s.cadence);
      const p={calY:CY,calM:CM,m:CM};
      s.benefits.forEach(b=>{
        if(isBExpired(b,p)||isBNotAvailable(b,CY)) return;
        if(isUsed(cardKey,b.id,pk)) return;
        const amt=getBAmount(b,{m:CM});
        // Urgency score: higher = more urgent
        let urgency=0;
        if(s.cadence==='monthly') urgency = (31-eomDays)/31 * 100; // % of month elapsed
        else if(s.cadence==='quarterly'){
          const daysInQ=92, dayOfQ=(CM%3)*30+new Date().getDate();
          urgency=(daysInQ-dayOfQ)/daysInQ*50;
        } else urgency=10;
        const score=urgency * Math.log(amt+1);
        items.push({cardKey,benefitId:b.id,pk,name:b.name,card:CARD_LABELS[cardKey],amt,urgency,score,cadence:s.cadence});
      });
    });
  });

  return items.sort((a,b)=>b.score-a.score);
}

function renderPriorityQueue(){
  const items=buildPriorityQueue();
  const eomDays=daysUntilEOM();
  let html=`<div class="banner">🎯 <strong>Use it now</strong> — ranked by urgency × value</div>`;

  if(!items.length){
    html+=`<div style="text-align:center;padding:32px;color:var(--green);font-size:14px">🎉 All current benefits claimed!</div>`;
    set(html); return;
  }

  if(eomDays<=5) html+=`<div class="eom-warning">⚠️ Only ${eomDays} day${eomDays===1?'':'s'} left — monthly benefits reset soon!</div>`;

  html+=`<div style="margin-bottom:8px;font-size:11px;font-family:var(--mono);color:var(--text-tertiary)">${items.length} unclaimed benefits · sorted by urgency</div>`;

  items.forEach((item,i)=>{
    const urgencyLabel=item.urgency>60?'⚠️ Expiring soon':item.urgency>30?'📅 This period':'✓ Anytime';
    const urgencyCls=item.urgency>60?'urgency-fire':item.urgency>30?'urgency-soon':'urgency-ok';
    const rankCls=i===0?'urgent':i<3?'high':'normal';
    html+=`<div class="priority-row" onclick="setActiveView('this-period')">
      <div class="priority-rank ${rankCls}">${i+1}</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:500;color:var(--text)">${item.name}</div>
        <div style="font-size:10px;color:var(--text-tertiary);font-family:var(--mono)">${item.card}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:14px;font-weight:700;font-family:var(--mono);color:var(--green)">$${item.amt}</div>
        <span class="priority-urgency ${urgencyCls}">${urgencyLabel}</span>
      </div>
    </div>`;
  });
  set(html);
}

// ── Best Card for Purchase ────────────────────────────────────────────────
const BENEFIT_CATEGORIES={
  vx_travel:'travel', vx_anniv:'travel', vx_hotel:'travel', vx_ge:'travel',
  g_dining:'dining', g_uber:'dining', g_dunkin:'dining', g_resy:'dining', g_hotel:'travel',
  p_uber:'travel', p_digital:'entertainment', p_walmart:'shopping',
  p_resy:'dining', p_lulu:'shopping', p_hotel:'travel', p_saks:'shopping',
  p_airline:'travel', p_equinox:'fitness', p_ge:'travel', p_clear:'travel', p_uberone:'travel', p_oura:'fitness',
  c_dd_restaurant:'dining', c_dd_nonrest1:'shopping', c_dd_nonrest2:'shopping',
  c_lyft:'travel', c_peloton:'fitness', c_dining:'dining', c_stub:'entertainment',
  c_travel:'travel', c_edit1:'travel', c_edit2:'travel', c_ge:'travel', c_selecthotel:'travel',
  c_apple:'entertainment',
  jmr_dining:'dining', jmr_travel:'travel', jmr_ge:'travel',
  csp_hotel:'travel',
  ag_clear:'travel', ag_lounge:'travel',
  ah_resort:'travel', ah_airline:'travel', ah_freenight:'travel', ah_ge:'travel',
  amb_dining:'dining', amb_freenight:'travel', amb_propcredit:'travel', amb_ge:'travel',
  ambb_freenight:'travel',
  adr_resy:'dining', adr_stays:'travel', adr_companion:'travel', adr_ge:'travel',
  adp_resy:'dining', adp_stays:'travel', adp_companion:'travel', adp_ge:'travel',
  hyatt_freenight:'travel',
  uq_credit:'travel', uq_miles:'travel', uq_ge:'travel',
  uc_club:'travel', uc_ge:'travel',
  citist_hotel:'travel',
  usbar_travel:'travel', usbar_ge:'travel',
  vxb_travel:'travel', vxb_anniv:'travel', vxb_ge:'travel',
};


// ── Should I Keep This Card ───────────────────────────────────────────────
function renderKeepCard(){
  const CARD_KEYS=getVisibleCardKeys();
  const CARD_LABELS={gold:'AMEX Gold',platinum:'AMEX Platinum',csr:'Chase Sapphire Reserve',cap1_venture_x:'Capital One Venture X',chase_sapphire_pref:'Sapphire Preferred',amex_green:'AMEX Green',amex_hilton_honors:'Hilton Honors Aspire',amex_marriott_brill:'Marriott Bonvoy Brilliant',chase_world_of_hyatt:'World of Hyatt',chase_united_quest:'United Quest',chase_united_club:'United Club Infinite',citi_strata_prem:'Citi Strata Premier',wf_premier_autograph:'WF Premier Autograph'};
  const CARD_CLS={gold:'gold',platinum:'platinum',csr:'csr',cap1_venture_x:'venturex',chase_sapphire_pref:'csp',amex_green:'amexgreen',amex_hilton_honors:'hilton',amex_marriott_brill:'marriott',chase_world_of_hyatt:'hyatt',chase_united_quest:'unitedq',chase_united_club:'unitedclub',citi_strata_prem:'citistrata',wf_premier_autograph:'wfpremier'};

  let html=`<div class="banner">🤔 <strong>Should I keep this card?</strong> — renewal verdict based on fee coverage</div>`;

  CARD_KEYS.forEach(cardKey=>{
    const fee=getFee(cardKey,CY);
    // Use calcCapturedByType as the single source of truth so captured and projected are consistent
    const {repeating,oneTime}=calcCapturedByType(cardKey);
    const captured=repeating+oneTime;
    const projected=getProjectedCapture(cardKey);
    const projectedROI=projected-fee;
    const currentRatio=fee>0?captured/fee:0;

    let verdict, cls, reason, action;
    if(captured>=fee){
      verdict='✓ Keep it'; cls='keep';
      reason=`You've already captured $${captured.toFixed(0)} — covering the $${fee} fee with $${(captured-fee).toFixed(0)} profit.`;
      action='Renewal is clearly worth it.';
    } else if(projected>=fee){
      verdict='✓ Keep it'; cls='keep';
      reason=`You've captured $${captured.toFixed(0)} so far. At this rate you'll hit $${projected.toFixed(0)} by card year end — covering the $${fee} fee.`;
      action='On track to break even. Renewal recommended.';
    } else if(projected>=fee*0.9){
      verdict='⚠️ Reconsider'; cls='reconsider';
      reason=`Projecting $${projected.toFixed(0)} by year end vs $${fee} fee. You'll be $${(fee-projected).toFixed(0)} short of breaking even.`;
      action='Try to use more benefits before renewal.';
    } else {
      verdict='✗ Downgrade or Cancel'; cls='cancel';
      reason=`Only ${Math.round(currentRatio*100)}% of the $${fee} fee covered so far. Projecting $${projected.toFixed(0)} — well short of the fee.`;
      action='Consider downgrading or cancelling before renewal.';
    }

    const days=daysUntilFee(cardKey);
    const {month:fm2,day:fd}=FEE_DATES[cardKey];

    html+=`<div style="margin-bottom:12px">
      <div style="font-size:11px;font-family:var(--mono);color:var(--text-tertiary);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.06em">${CARD_LABELS[cardKey]}</div>
      <div class="keep-card-result ${cls}">
        <div class="keep-verdict ${cls}">${verdict}</div>
        <div class="keep-reason">${reason}<br><strong>${action}</strong></div>
        <div style="font-size:10px;font-family:var(--mono);color:var(--text-tertiary);margin-top:8px">
          $${captured.toFixed(0)} captured · $${projected.toFixed(0)} projected · $${fee} fee<br>
          Next fee: ${MONTHS[fm2]} ${fd} · ${days} days away
        </div>
      </div>
    </div>`;
  });
  set(html);
}

// ── Category Tags ─────────────────────────────────────────────────────────
function getCategoryTag(benefitId){ return ''; }


// ── Multi-year Trend ──────────────────────────────────────────────────────
function renderTrends(){
  const CARD_KEYS=getVisibleCardKeys();
  const CARD_LABELS={gold:'AMEX Gold',platinum:'AMEX Platinum',csr:'Chase Sapphire Reserve',cap1_venture_x:'Capital One Venture X',chase_sapphire_pref:'Sapphire Preferred',amex_green:'AMEX Green',amex_hilton_honors:'Hilton Honors Aspire',amex_marriott_brill:'Marriott Bonvoy Brilliant',chase_world_of_hyatt:'World of Hyatt',chase_united_quest:'United Quest',chase_united_club:'United Club Infinite',citi_strata_prem:'Citi Strata Premier',wf_premier_autograph:'WF Premier Autograph'};

  // Dynamic year range: last 3 years up to current
  const years=[CY-2,CY-1,CY].filter(y=>y>=2024);

  const yearRange=years.length>1?`${years[0]}–${years[years.length-1]}`:`${years[0]}`;
  let html=`<div class="banner">📊 <strong>Multi-year trends</strong> — ${yearRange} comparison</div>`;

  // Compute total captured value for a card in a given calendar year,
  // covering ALL cadences including card-year-aligned ones.
  function capturedForYear(cardKey,y){
    let total=0;
    const card=CARDS[cardKey];
    const lastMonth=y<CY?11:CM; // past years: all 12 months; current: up to now

    card.sections.forEach(s=>{
      const periods=[];
      if(s.cadence==='monthly'){
        for(let m=0;m<=lastMonth;m++) periods.push({pk:getPK('monthly',m,y),m,calY:y,calM:m});
      } else if(s.cadence==='quarterly'){
        const seen=new Set();
        for(let m=0;m<=lastMonth;m++){
          const pk=getPK('quarterly',m,y);
          if(!seen.has(pk)){seen.add(pk);periods.push({pk,m,calY:y,calM:m});}
        }
      } else if(s.cadence==='cal-semi-annual'){
        periods.push({pk:getPK('cal-semi-annual',0,y),m:0,calY:y,calM:0,endM:5,endY:y});
        if(lastMonth>=6) periods.push({pk:getPK('cal-semi-annual',6,y),m:6,calY:y,calM:6,endM:11,endY:y});
      } else if(s.cadence==='cal-annual'){
        periods.push({pk:`${y}-annual`,m:0,calY:y,calM:0});
      } else if(s.cadence==='semi-annual'){
        // card-year halves — find the two h1/h2 PKs that overlap calendar year y
        const allPs=getCardYearPeriods(cardKey,s.cadence);
        allPs.forEach(p=>{ if(p.calY===y||(p.endY&&p.endY===y)) periods.push(p); });
      } else if(s.cadence==='annual'){
        // card-year annual — find the period whose window overlaps year y
        const allPs=getCardYearPeriods(cardKey,s.cadence);
        allPs.forEach(p=>{ if(p.calY===y) periods.push(p); });
      } else if(s.cadence==='feb-annual'){
        // Feb–Jan cycle: find the one that starts in year y
        const allPs=getCardYearPeriods(cardKey,s.cadence);
        allPs.forEach(p=>{ if(p.calY===y) periods.push(p); });
        // also check previous feb window if it spans into y
        const prev={m:1,calY:y-1,calM:1,pk:`feb-${y-1}`,endM:0,endY:y};
        allPs.forEach(p=>{ if(p.calY===y-1&&!periods.find(x=>x.pk===p.pk)) periods.push(p); });
      }

      s.benefits.forEach(b=>{
        if(isBNotAvailable(b,y)) return;
        periods.forEach(p=>{
          if(isBExpired(b,p)) return;
          if(isUsed(cardKey,b.id,p.pk)) total+=getBAmount(b,p);
        });
      });
    });
    return total;
  }

  CARD_KEYS.forEach(cardKey=>{
    html+=`<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:10px">`;
    html+=`<div style="font-size:11px;font-family:var(--mono);color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px">${CARD_LABELS[cardKey]}</div>`;

    const vals=years.map(y=>({y,captured:capturedForYear(cardKey,y),fee:getFee(cardKey,y)}));
    const maxVal=Math.max(...vals.map(v=>v.captured),1);

    vals.forEach(({y,captured,fee})=>{
      const barPct=Math.round(captured/maxVal*100);
      const isCurrent=y===CY;
      const profit=captured-fee;
      const label=isCurrent?`${y} YTD`:String(y);
      html+=`<div class="trend-row">
        <div class="trend-year" style="color:${isCurrent?'var(--text)':'var(--text-tertiary)'}">${label}</div>
        <div style="flex:1;position:relative">
          <div class="trend-bar-wrap"><div class="trend-bar-fill" style="width:${barPct}%;background:${captured>=fee?'var(--green)':'var(--gold)'}"></div></div>
        </div>
        <div class="trend-val" style="color:${profit>=0?'var(--green)':'var(--text-secondary)'}">
          $${captured.toFixed(0)}
          <span style="font-size:9px;color:var(--text-tertiary)"> / $${fee}</span>
        </div>
      </div>`;
    });
    html+=`</div>`;
  });
  set(html);
}

// ── Actual vs Credited ────────────────────────────────────────────────────
const CREDITED_KEY='perks-credited';
function loadCredited(){ try{ return JSON.parse(localStorage.getItem(CREDITED_KEY)||'{}'); }catch(e){ return {}; } }
function saveCredited(d){ localStorage.setItem(CREDITED_KEY,JSON.stringify(d)); }
function isCredited(cardKey,id,pk){ return !!(loadCredited()[`${cardKey}__${id}__${pk}`]); }
function toggleCredited(cardKey,id,pk){
  const d=loadCredited();
  const k=`${cardKey}__${id}__${pk}`;
  d[k]=!d[k];
  saveCredited(d);
}

// ── Undo System ───────────────────────────────────────────────────────────
let _undoStack=null, _undoTimer=null;
function showUndo(cardKey, id, pk, action){
  clearTimeout(_undoTimer);
  _undoStack={cardKey,id,pk,action};
  const toast=document.getElementById('undoToast');
  const msg=document.getElementById('undoMsg');
  msg.textContent=action==='used'?'✓ Marked as used':'Unmarked';
  toast.classList.add('show');
  haptic('light');
  _undoTimer=setTimeout(()=>{
    toast.classList.remove('show');
    _undoStack=null;
  },3000);
}
document.getElementById('undoBtn').addEventListener('click',()=>{
  if(!_undoStack) return;
  const {cardKey,id,pk}=_undoStack;
  toggle(cardKey,id,pk); // toggles back
  document.getElementById('undoToast').classList.remove('show');
  _undoStack=null;
  clearTimeout(_undoTimer);
  haptic('medium');
  render();
});

// ── Tab Badge Count ───────────────────────────────────────────────────────
function updateCardBadges(){
  getVisibleCardKeys().forEach(cardKey=>{
    const btn=document.querySelector(`.card-btn[data-card="${cardKey}"]`);
    if(!btn) return;
    // Count unclaimed current-period benefits
    let unclaimed=0;
    CARDS[cardKey].sections.forEach(s=>{
      const pk=getCurrentPK(cardKey,s.cadence);
      const p={calY:CY,calM:CM,m:CM};
      s.benefits.forEach(b=>{
        if(isBExpired(b,p)||isBNotAvailable(b,CY)) return;
        if(!isUsed(cardKey,b.id,pk)) unclaimed++;
      });
    });
    // Find or create badge
    let badge=btn.querySelector('.card-notif-badge');
    if(unclaimed>0){
      if(!badge){
        badge=document.createElement('div');
        badge.className='card-notif-badge';
        // Insert inside card-inner > card-front, or directly in btn
        const front=btn.querySelector('.card-front')||btn;
        front.style.position='relative';
        front.appendChild(badge);
      }
      badge.textContent=unclaimed;
      badge.classList.remove('hidden');
    } else {
      if(badge) badge.classList.add('hidden');
    }
  });
}

function updateTabBadge(){
  const btn=document.querySelector('.nav-primary-btn[data-primary="this-period"]');
  if(!btn) return;
  let unclaimed=0;
  Object.keys(CARDS).forEach(cardKey=>{
    unclaimed+=getUnclaimedMonthly(cardKey).length;
  });
  let dot=btn.querySelector('.tab-dot');
  if(unclaimed>0){
    if(!dot){
      dot=document.createElement('span');
      dot.className='tab-dot';
      btn.appendChild(dot);
    }
  } else {
    if(dot) dot.remove();
  }
}

// ── Live Activity Banner ──────────────────────────────────────────────────
function buildLiveBanner(){
  const items=buildPriorityQueue();
  if(!items.length) return '';
  const top=items[0];
  const eomDays=daysUntilEOM();
  const urgency=eomDays<=3?`⚠️ ${eomDays}d left!`:eomDays<=7?`📅 ${eomDays}d left`:'This month';
  return `<div class="live-banner" onclick="setActiveView('this-period')">
    <div class="live-banner-icon">⚡</div>
    <div>
      <div class="live-banner-title">Use next: ${top.name}</div>
      <div class="live-banner-sub">${top.card} · ${urgency}</div>
    </div>
    <div class="live-banner-amt">$${top.amt}</div>
  </div>`;
}

// ── Category Breakdown ────────────────────────────────────────────────────
function buildCategoryBreakdown(){
  const cats={dining:0,travel:0,shopping:0,fitness:0,entertainment:0,other:0};
  const catColors={dining:'#C86428',travel:'var(--plat)',shopping:'var(--gold)',fitness:'var(--green)',entertainment:'#9333ea',other:'var(--text-tertiary)'};

  Object.keys(CARDS).forEach(cardKey=>{
    CARDS[cardKey].sections.forEach(s=>{
      const pk=getCurrentPK(cardKey,s.cadence);
      s.benefits.forEach(b=>{
        if(isBNotAvailable(b,CY)||isBExpired(b,{calY:CY,calM:CM,m:CM})) return;
        if(!isUsed(cardKey,b.id,pk)) return;
        const cat=BENEFIT_CATEGORIES[b.id]||'other';
        cats[cat]+=getBAmount(b,{m:CM});
      });
    });
  });

  const total=Object.values(cats).reduce((a,b)=>a+b,0)||1;
  const sorted=Object.entries(cats).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
  if(!sorted.length) return '';

  const catIcons={dining:'🍽',travel:'✈️',shopping:'🛍',fitness:'💪',entertainment:'🎬',other:'💳'};
  let html=`<div style="font-size:11px;font-family:var(--mono);color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">Claimed by category</div>`;
  sorted.forEach(([cat,val])=>{
    const pct=Math.round(val/total*100);
    html+=`<div class="cat-row">
      <div class="cat-name">${catIcons[cat]} ${cat}</div>
      <div class="cat-bar-wrap"><div class="cat-bar-fill" style="width:${pct}%;background:${catColors[cat]}"></div></div>
      <div class="cat-val">$${val.toFixed(0)}</div>
    </div>`;
  });
  return `<div class="cat-breakdown">${html}</div>`;
}

// ── Search ────────────────────────────────────────────────────────────────

// ── All Cards Summary ─────────────────────────────────────────────────────
function buildAllCardsSummary(){
  let totalAvail=0, totalClaimed=0, totalFees=0, totalMissed=0;
  getVisibleCardKeys().forEach(cardKey=>{
    totalFees+=getFee(cardKey,CY);
    CARDS[cardKey].sections.forEach(s=>{
      const pk=getCurrentPK(cardKey,s.cadence);
      const p={calY:CY,calM:CM,m:CM};
      s.benefits.forEach(b=>{
        if(isBExpired(b,p)||isBNotAvailable(b,CY)) return;
        const amt=getBAmount(b,{m:CM});
        totalAvail+=amt;
        if(isUsed(cardKey,b.id,pk)) totalClaimed+=amt;
      });
    });
  });
  const effectiveFee=totalFees-totalClaimed;
  const claimedPct=totalAvail>0?Math.min(100,totalClaimed/totalAvail*100):0;
  const breakEvenPct=totalAvail>0?Math.min(100,totalFees/totalAvail*100):0;
  const isProfitable=totalClaimed>=totalFees;
  const feeCoveragePct=totalFees>0?Math.round(totalClaimed/totalFees*100):0;
  const remaining=totalAvail-totalClaimed;

  return `<div class="allcards-summary">
    <div class="allcards-stats-row">
      <div class="allcards-stat">
        <div class="allcards-stat-val green">$${totalClaimed.toFixed(0)}</div>
        <div class="allcards-stat-label">Claimed</div>
      </div>
      <div class="allcards-stat" style="text-align:center">
        <div class="allcards-stat-val ${isProfitable?'green':feeCoveragePct>=80?'gold':''}">${feeCoveragePct}%</div>
        <div class="allcards-stat-label">Fee coverage</div>
      </div>
      <div class="allcards-stat" style="text-align:right">
        <div class="allcards-stat-val" style="color:var(--text-tertiary)">$${remaining.toFixed(0)}</div>
        <div class="allcards-stat-label">Still available</div>
      </div>
    </div>
    <div class="allcards-track" style="position:relative;overflow:visible">
      <div class="allcards-fill-claimed" style="width:${Math.min(feeCoveragePct,115)}%;background:${isProfitable?'var(--green)':'var(--gold)'};border-radius:inherit;transition:width 0.4s ease"></div>
      ${!isProfitable?`<div style="position:absolute;top:-3px;bottom:-3px;right:0;width:2px;background:#fff;opacity:0.5;border-radius:1px"></div>`:''}
    </div>
    <div class="allcards-track-labels">
      <span>$0</span>
      <span style="color:${isProfitable?'var(--green)':'var(--text-tertiary)'}">
        ${isProfitable?'🎉 In profit! +$'+Math.abs(effectiveFee).toFixed(0):'Break-even at $'+totalFees}
      </span>
      <span>${isProfitable?'':'$'+totalFees}</span>
    </div>
  </div>`;
}

// ── Polish Features ───────────────────────────────────────────────────────

// ── 1. Animated Number Counters ───────────────────────────────────────────
function animateCounters(){
  document.querySelectorAll('[data-count]').forEach(el=>{
    const target=parseFloat(el.dataset.count);
    const prefix=el.dataset.prefix||'';
    const suffix=el.dataset.suffix||'';
    const duration=600;
    const start=performance.now();
    const from=0;
    function update(now){
      const elapsed=now-start;
      const progress=Math.min(elapsed/duration,1);
      // Ease out cubic
      const eased=1-Math.pow(1-progress,3);
      const current=from+(target-from)*eased;
      el.textContent=prefix+(Number.isInteger(target)?Math.round(current):current.toFixed(0))+suffix;
      if(progress<1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// ── 2. Haptic Feedback ────────────────────────────────────────────────────
function haptic(style='light'){
  if(!navigator.vibrate) return;
  const patterns={light:[10],medium:[20],heavy:[30],success:[10,50,20]};
  navigator.vibrate(patterns[style]||[10]);
}

// ── 3. Card Flip ──────────────────────────────────────────────────────────
// Points multipliers per card
const POINTS_MULTIPLIERS={
  gold:[
    {cat:'Dining (US & worldwide restaurants, up to $50K/yr)',pts:'4x'},
    {cat:'US Supermarkets (up to $25K/yr)',pts:'4x'},
    {cat:'Prepaid hotels (amextravel.com)',pts:'5x'},
    {cat:'Flights (direct or amextravel.com)',pts:'3x'},
    {cat:'Prepaid car rentals & cruises (amextravel.com)',pts:'2x'},
    {cat:'Everything else',pts:'1x'},
  ],
  platinum:[
    {cat:'Flights (direct or amextravel.com, up to $500K/yr)',pts:'5x'},
    {cat:'Prepaid hotels (amextravel.com)',pts:'5x'},
    {cat:'Everything else',pts:'1x'},
  ],
  cap1_venture_x:[
    {cat:'Capital One Travel (hotels & rental cars)',pts:'10x'},
    {cat:'Capital One Travel (flights & vacation rentals)',pts:'5x'},
    {cat:'Everything else',pts:'2x'},
  ],
  csr:[
    {cat:'Chase Travel℠ (incl. The Edit)',pts:'8x'},
    {cat:'Lyft rides (through Sep 2027)',pts:'5x'},
    {cat:'Flights & hotels (booked direct)',pts:'4x'},
    {cat:'Dining (worldwide)',pts:'3x'},
    {cat:'Peloton hardware (up to 50K pts)',pts:'10x'},
    {cat:'Everything else',pts:'1x'},
  ],
  jp_morgan_reserve:[
    {cat:'Dining',pts:'3x'},
    {cat:'Travel (Chase Travel portal)',pts:'3x'},
    {cat:'Everything else',pts:'1x'},
  ],
  chase_sapphire_pref:[
    {cat:'Chase Travel℠',pts:'5x'},
    {cat:'Dining & online grocery (excl. Walmart/Target)',pts:'3x'},
    {cat:'Streaming services',pts:'3x'},
    {cat:'Everything else',pts:'1x'},
  ],
  bilt:[
    {cat:'Rent (via Bilt, up to 100,000 pts/yr)',pts:'1x'},
    {cat:'Dining',pts:'3x'},
    {cat:'Travel',pts:'2x'},
    {cat:'Everything else',pts:'1x'},
  ],
  amex_green:[
    {cat:'Travel (flights, hotels, transit, taxis)',pts:'3x'},
    {cat:'Dining (worldwide)',pts:'3x'},
    {cat:'Everything else',pts:'1x'},
  ],
  amex_hilton_honors:[
    {cat:'Hilton hotels & resorts',pts:'14x'},
    {cat:'Dining (US), US Supermarkets, US Gas stations',pts:'7x'},
    {cat:'Flights (direct or amextravel.com)',pts:'7x'},
    {cat:'Everything else',pts:'3x'},
  ],
  amex_marriott_brill:[
    {cat:'Marriott Bonvoy hotels',pts:'6x'},
    {cat:'Dining (US restaurants)',pts:'4x'},
    {cat:'Flights (direct or amextravel.com)',pts:'2x'},
    {cat:'Everything else',pts:'2x'},
  ],
  amex_marriott_biz:[
    {cat:'Marriott Bonvoy hotels',pts:'6x'},
    {cat:'US restaurants, gas, wireless, shipping, transit',pts:'4x'},
    {cat:'Everything else',pts:'2x'},
  ],
  amex_delta_reserve:[
    {cat:'Delta purchases',pts:'3x'},
    {cat:'Hotels & US restaurants',pts:'2x'},
    {cat:'Everything else',pts:'1x'},
  ],
  amex_delta_plat:[
    {cat:'Delta purchases',pts:'3x'},
    {cat:'Hotels & US restaurants',pts:'2x'},
    {cat:'Everything else',pts:'1x'},
  ],
  chase_world_of_hyatt:[
    {cat:'Hyatt hotels & all-inclusive properties',pts:'9x'},
    {cat:'Dining, local transit, gym memberships',pts:'2x'},
    {cat:'Flights & car rentals (direct)',pts:'2x'},
    {cat:'Everything else',pts:'1x'},
  ],
  chase_united_quest:[
    {cat:'United purchases',pts:'3x'},
    {cat:'Dining & streaming services',pts:'2x'},
    {cat:'Hotels & car rentals',pts:'2x'},
    {cat:'Everything else',pts:'1x'},
  ],
  chase_united_club:[
    {cat:'United purchases',pts:'4x'},
    {cat:'All other travel & dining',pts:'2x'},
    {cat:'Everything else',pts:'1x'},
  ],
  citi_strata_prem:[
    {cat:'Air, hotels, car rentals & restaurants',pts:'3x'},
    {cat:'Supermarkets & gas stations',pts:'3x'},
    {cat:'Everything else',pts:'1x'},
  ],
  usb_altitude_reserve:[
    {cat:'Travel & mobile wallet purchases',pts:'3x'},
    {cat:'Everything else',pts:'1x'},
  ],
  cap1_venture_x_biz:[
    {cat:'Capital One Travel (hotels & rental cars)',pts:'10x'},
    {cat:'Capital One Travel (flights & vacation rentals)',pts:'5x'},
    {cat:'Everything else',pts:'2x'},
  ],
};

function buildCardBack(cardKey){
  const card=CARDS[cardKey];
  const benefits=[];
  card.sections.forEach(s=>{
    const pk=getCurrentPK(cardKey,s.cadence);
    s.benefits.forEach(b=>{
      if(isBNotAvailable(b,CY)||isBExpired(b,{calY:CY,calM:CM,m:CM})) return;
      const used=isUsed(cardKey,b.id,pk);
      benefits.push({name:b.name,amt:getBAmount(b,{m:CM}),used});
    });
  });
  const total=benefits.reduce((s,b)=>s+b.amt,0);
  const captured=benefits.filter(b=>b.used).reduce((s,b)=>s+b.amt,0);
  const multipliers=POINTS_MULTIPLIERS[cardKey]||[];

  return `<div class="card-back">
    <div>
      <div class="card-back-title">${card.name}</div>
      <div style="font-size:10px;font-family:var(--mono);color:var(--green);margin-top:1px">$${captured.toFixed(0)}/$${total.toFixed(0)} captured</div>
    </div>
    <div style="overflow:hidden;flex:1;margin:6px 0">
      <div style="font-size:8px;font-family:var(--mono);color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">Points multipliers</div>
      ${multipliers.map(m=>`
        <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:3px 0;border-bottom:0.5px solid rgba(255,255,255,0.08);gap:6px">
          <span style="font-size:8px;opacity:0.75;line-height:1.3;flex:1">${m.cat}</span>
          <span style="font-size:11px;font-weight:700;font-family:var(--mono);color:var(--green);flex-shrink:0">${m.pts}</span>
        </div>`).join('')}
    </div>
    <div style="font-size:8px;font-family:var(--mono);color:rgba(255,255,255,0.3);text-align:center">double-tap to flip back</div>
  </div>`;
}

function openCardSheet(cardKey){
  const card=CARDS[cardKey];
  const multipliers=POINTS_MULTIPLIERS[cardKey]||[];
  const {captured}=calcStats(cardKey,c=>getCardYearPeriods(cardKey,c),isPCurrent);
  const fee=getFee(cardKey,CY);
  const projected=getProjectedCapture(cardKey);
  const elapsed=getCardYearMonthsElapsed(cardKey);

  document.getElementById('cardSheetTitle').textContent=card.name;

  let body=`
    <div class="card-sheet-section">
      <div class="card-sheet-section-title">Points Multipliers</div>
      ${multipliers.map(m=>`
        <div class="card-sheet-row">
          <span style="color:var(--text)">${m.cat}</span>
          <span class="card-sheet-pts">${m.pts}</span>
        </div>`).join('')}
    </div>
    <div class="card-sheet-section">
      <div class="card-sheet-section-title">Card Year Performance</div>
      <div class="card-sheet-row"><span style="color:var(--text-secondary)">Captured so far</span><span style="font-family:var(--mono);font-weight:600;color:var(--green)">$${captured.toFixed(0)}</span></div>
      <div class="card-sheet-row"><span style="color:var(--text-secondary)">Year-end projection</span><span style="font-family:var(--mono);font-weight:600;color:var(--text)">$${projected.toFixed(0)}</span></div>
      <div class="card-sheet-row"><span style="color:var(--text-secondary)">Annual fee</span><span style="font-family:var(--mono);font-weight:600;color:var(--text)">$${fee}</span></div>
      <div class="card-sheet-row"><span style="color:var(--text-secondary)">Month of card year</span><span style="font-family:var(--mono);color:var(--text-tertiary)">${elapsed} of 12</span></div>
    </div>`;

  document.getElementById('cardSheetBody').innerHTML=body;
  document.getElementById('cardSheetOverlay').classList.add('open');
  document.getElementById('cardSheet').classList.add('open');
  haptic('medium');
}

function closeCardSheet(){
  document.getElementById('cardSheetOverlay').classList.remove('open');
  document.getElementById('cardSheet').classList.remove('open');
}

document.getElementById('cardSheetClose').addEventListener('click', closeCardSheet);
document.getElementById('cardSheetOverlay').addEventListener('click', closeCardSheet);

function initCardFlip(){
  // No-op — flip replaced by bottom sheet
}

// ── 4. Pull to Refresh ────────────────────────────────────────────────────
let ptrStartY=0, ptrActive=false;
const ptrThreshold=80;

document.addEventListener('touchstart',e=>{
  if(window.scrollY===0) ptrStartY=e.touches[0].clientY;
},{passive:true});

document.addEventListener('touchmove',e=>{
  if(!ptrStartY) return;
  const dy=e.touches[0].clientY-ptrStartY;
  if(dy>20&&window.scrollY===0){
    ptrActive=true;
    const indicator=document.getElementById('ptrIndicator');
    if(indicator){ indicator.classList.remove('hidden'); indicator.classList.add('visible'); }
  }
},{passive:true});

document.addEventListener('touchend',async ()=>{
  if(ptrActive){
    ptrActive=false;
    haptic('light');
    await syncFromSupabase();
    const indicator=document.getElementById('ptrIndicator');
    if(indicator){ indicator.classList.remove('visible'); indicator.classList.add('hidden'); }
    ptrStartY=0;
  }
},{passive:true});

// ── 5. Donut Chart ────────────────────────────────────────────────────────
function buildDonut(captured,missed,remaining,size=100){
  const total=captured+missed+remaining||1;
  const r=38; const cx=50; const cy=50;
  const circ=2*Math.PI*r;

  function slice(value,offset,color){
    const pct=value/total;
    const dash=pct*circ;
    const gap=circ-dash;
    return `<circle cx="${cx}" cy="${cy}" r="${r}"
      fill="none" stroke="${color}" stroke-width="14"
      stroke-dasharray="${dash} ${gap}"
      stroke-dashoffset="${-offset}"
      transform="rotate(-90 ${cx} ${cy})"/>`;
  }

  const c1=captured/total*circ;
  const c2=missed/total*circ;

  const svg=`<svg class="donut-svg" width="${size}" height="${size}" viewBox="0 0 100 100">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border-light)" stroke-width="14"/>
    ${slice(captured,0,'var(--green)')}
    ${slice(missed,c1,'var(--red)')}
    ${slice(remaining,c1+c2,'rgba(200,146,42,0.3)')}
    <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
      font-size="14" font-weight="700" fill="var(--text)" font-family="DM Mono,monospace">
      ${Math.round(captured/total*100)}%
    </text>
  </svg>`;

  const legend=`<div class="donut-legend">
    <div class="donut-legend-item"><span class="donut-dot" style="background:var(--green)"></span><span style="color:var(--text-secondary)">Captured <strong style="color:var(--text)">$${captured.toFixed(0)}</strong></span></div>
    <div class="donut-legend-item"><span class="donut-dot" style="background:var(--red)"></span><span style="color:var(--text-secondary)">Missed <strong style="color:var(--text)">$${missed.toFixed(0)}</strong></span></div>
    <div class="donut-legend-item"><span class="donut-dot" style="background:rgba(200,146,42,0.4)"></span><span style="color:var(--text-secondary)">Remaining <strong style="color:var(--text)">$${remaining.toFixed(0)}</strong></span></div>
  </div>`;

  return `<div class="donut-wrap">${svg}${legend}</div>`;
}

// ── Batch 3+4 Features ───────────────────────────────────────────────────

// ── Benefit History Log ───────────────────────────────────────────────────
async function renderHistoryLog(){
  set(`<div class="banner">📜 <strong>Benefit history</strong> — recent activity across all cards</div><div style="text-align:center;padding:24px;color:var(--text-tertiary);font-size:13px">Loading history…</div>`);

  try{
    const {data,error}=await sb.from('benefit_log')
      .select('*').order('created_at',{ascending:false}).limit(100);

    if(error||!data||!data.length){
      set(`<div class="banner">📜 <strong>Benefit history</strong></div><div style="text-align:center;padding:32px;color:var(--text-tertiary);font-size:13px">No history yet — start marking benefits used!</div>`);
      return;
    }

    // Build a lookup of benefit names
    const benefitNames={};
    Object.keys(CARDS).forEach(ck=>{
      CARDS[ck].sections.forEach(s=>s.benefits.forEach(b=>{ benefitNames[b.id]=b.name; }));
    });
    const cardNames={gold:'AMEX Gold',platinum:'AMEX Platinum',csr:'Chase Sapphire Reserve',cap1_venture_x:'Capital One Venture X',chase_sapphire_pref:'Sapphire Preferred',amex_green:'AMEX Green',amex_hilton_honors:'Hilton Honors Aspire',amex_marriott_brill:'Marriott Bonvoy Brilliant',chase_world_of_hyatt:'World of Hyatt',chase_united_quest:'United Quest',chase_united_club:'United Club Infinite',citi_strata_prem:'Citi Strata Premier'};

    let html=`<div class="banner">📜 <strong>Benefit history</strong> — last ${data.length} actions</div>`;
    html+=`<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden">`;

    data.forEach(entry=>{
      const d=new Date(entry.created_at);
      const timeStr=d.toLocaleDateString('en-US',{month:'short',day:'numeric'})+' · '+d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});
      const benefitName=benefitNames[entry.benefit_id]||entry.benefit_id;
      const cardName=cardNames[entry.card_key]||entry.card_key;
      html+=`<div class="log-entry">
        <span class="log-dot ${entry.action}"></span>
        <div style="flex:1">
          <div class="log-benefit">${entry.action==='used'?'✓':'✗'} ${benefitName}</div>
          <div class="log-card">${cardName}</div>
        </div>
        <div class="log-time">${timeStr}</div>
      </div>`;
    });

    html+=`</div>`;
    set(html);
  }catch(e){
    set(`<div class="banner">📜 <strong>Benefit history</strong></div><div style="text-align:center;padding:32px;color:var(--red);font-size:13px">Could not load history. Make sure the benefit_log table exists in Supabase.</div>`);
  }
}

// ── Annual Recap ──────────────────────────────────────────────────────────
function renderRecap(){
  const year=selectedYear;
  const CARD_KEYS=getVisibleCardKeys();
  const CARD_LABELS={gold:'AMEX Gold',platinum:'AMEX Platinum',csr:'Chase Sapphire Reserve',cap1_venture_x:'Capital One Venture X',chase_sapphire_pref:'Sapphire Preferred',amex_green:'AMEX Green',amex_hilton_honors:'Hilton Honors Aspire',amex_marriott_brill:'Marriott Bonvoy Brilliant',chase_world_of_hyatt:'World of Hyatt',chase_united_quest:'United Quest',chase_united_club:'United Club Infinite',citi_strata_prem:'Citi Strata Premier',wf_premier_autograph:'WF Premier Autograph'};

  // Calc stats for each card for the selected year
  let totalCaptured=0,totalMissed=0,totalFees=0;
  let bestCard={key:'',captured:0},worstCard={key:'',missed:0};
  let biggestMiss={name:'',amt:0,card:''};
  let longestStreak={name:'',streak:0,card:''};

  CARD_KEYS.forEach(cardKey=>{
    const fee=getFee(cardKey,year);
    totalFees+=fee;
    const getPsFn=c=>getYTDPeriods(c); // use full year periods
    const savedYear=selectedYear;
    selectedYear=year;
    const {captured,missed}=calcStats(cardKey,getPsFn,isYTDCurrent);
    selectedYear=savedYear;
    totalCaptured+=captured;
    totalMissed+=missed;
    if(captured>bestCard.captured) bestCard={key:cardKey,captured};
    if(missed>worstCard.missed) worstCard={key:cardKey,missed};

    // Find biggest single miss — run inside selectedYear override so periods are correct
    const savedYear2=selectedYear; selectedYear=year;
    CARDS[cardKey].sections.forEach(s=>{
      s.benefits.forEach(b=>{
        if(isBNotAvailable(b,year)) return;
        const periods=getYTDPeriods(s.cadence);
        let bMissed=0;
        periods.forEach(p=>{
          if(!isPFuture(p)&&!isYTDCurrent(s.cadence,p)&&!isUsed(cardKey,b.id,p.pk))
            bMissed+=getBAmount(b,p);
        });
        if(bMissed>biggestMiss.amt) biggestMiss={name:b.name,amt:bMissed,card:CARD_LABELS[cardKey]};
      });
    });
    selectedYear=savedYear2;

    // Streaks
    CARDS[cardKey].sections.forEach(s=>{
      if(s.cadence!=='monthly') return;
      s.benefits.forEach(b=>{
        if(isBNotAvailable(b,year)) return;
        const streak=getStreak(cardKey,b.id);
        if(streak>longestStreak.streak) longestStreak={name:b.name,streak,card:CARD_LABELS[cardKey]};
      });
    });
  });

  const effectiveFees=totalFees-totalCaptured;
  const feeCoverageRate=totalFees>0?Math.min(100,Math.round(totalCaptured/totalFees*100)):0;

  let html=`
    <div class="recap-hero">
      <div class="recap-year">${year} Annual Recap · Perks Ledger</div>
      <div class="recap-total">$${totalCaptured.toFixed(0)}</div>
      <div class="recap-total-label">total value captured across all cards</div>
    </div>
    <div class="recap-grid">
      <div class="recap-stat"><div class="recap-stat-val ${feeCoverageRate>=100?'green':feeCoverageRate>=80?'gold':''}">${feeCoverageRate}%</div><div class="recap-stat-label">Fee coverage</div></div>
      <div class="recap-stat"><div class="recap-stat-val">$${totalFees}</div><div class="recap-stat-label">Total fees paid</div></div>
      <div class="recap-stat"><div class="recap-stat-val ${effectiveFees<=0?'green':''}">${effectiveFees<=0?'+$'+Math.abs(effectiveFees).toFixed(0):'$'+effectiveFees.toFixed(0)}</div><div class="recap-stat-label">${effectiveFees<=0?'Net profit':'Effective fees'}</div></div>
    </div>`;

  if(bestCard.key) html+=`<div class="recap-highlight"><div class="recap-highlight-icon">🏆</div><div><div class="recap-highlight-label">Best card</div><div class="recap-highlight-val">${CARD_LABELS[bestCard.key]} — $${bestCard.captured.toFixed(0)} captured</div></div></div>`;
  if(biggestMiss.name) html+=`<div class="recap-highlight"><div class="recap-highlight-icon">😬</div><div><div class="recap-highlight-label">Biggest miss</div><div class="recap-highlight-val">${biggestMiss.name} — $${biggestMiss.amt.toFixed(0)} left on table</div></div></div>`;
  if(longestStreak.streak>=2) html+=`<div class="recap-highlight"><div class="recap-highlight-icon">🔥</div><div><div class="recap-highlight-label">Best streak</div><div class="recap-highlight-val">${longestStreak.name} — ${longestStreak.streak} months in a row</div></div></div>`;

  set(html);
}

// ── Batch 2 Features ─────────────────────────────────────────────────────

// ── Notes ─────────────────────────────────────────────────────────────────
const NOTES_KEY = 'perks-notes';
function loadNotes(){ try{ return JSON.parse(localStorage.getItem(NOTES_KEY)||'{}'); }catch(e){ return {}; } }
function saveNotes(notes){ try{ localStorage.setItem(NOTES_KEY,JSON.stringify(notes)); }catch(e){} }
function getNoteKey(cardKey,benefitId,pk){ return `${cardKey}__${benefitId}__${pk}`; }
function getNote(cardKey,benefitId,pk){ return loadNotes()[getNoteKey(cardKey,benefitId,pk)]||''; }

let _noteCtx={};
function openNoteModal(cardKey,benefitId,pk,benefitName){
  _noteCtx={cardKey,benefitId,pk};
  document.getElementById('noteModalTitle').textContent=benefitName;
  document.getElementById('noteModalSub').textContent=`${MONTHS_FULL[CM]} ${CY}`;
  document.getElementById('noteText').value=getNote(cardKey,benefitId,pk);
  document.getElementById('noteModal').classList.remove('hidden');
  setTimeout(()=>document.getElementById('noteText').focus(),100);
}
function closeNoteModal(){ document.getElementById('noteModal').classList.add('hidden'); }

document.getElementById('noteSave').addEventListener('click',()=>{
  const notes=loadNotes();
  const key=getNoteKey(_noteCtx.cardKey,_noteCtx.benefitId,_noteCtx.pk);
  const val=document.getElementById('noteText').value.trim();
  if(val) notes[key]=val; else delete notes[key];
  saveNotes(notes);
  closeNoteModal();
  renderCurrent();
});
document.getElementById('noteClear').addEventListener('click',()=>{
  const notes=loadNotes();
  delete notes[getNoteKey(_noteCtx.cardKey,_noteCtx.benefitId,_noteCtx.pk)];
  saveNotes(notes);
  closeNoteModal();
  renderCurrent();
});
document.getElementById('noteCancel').addEventListener('click', closeNoteModal);
document.getElementById('noteModal').addEventListener('click', e=>{ if(e.target===e.currentTarget) closeNoteModal(); });

// ── Card Comparison ───────────────────────────────────────────────────────
function renderComparison(){
  const CARD_KEYS=getVisibleCardKeys();
  const CARD_LABELS={gold:'AMEX Gold',platinum:'AMEX Platinum',csr:'Chase Sapphire Reserve',cap1_venture_x:'Capital One Venture X',chase_sapphire_pref:'Sapphire Preferred',amex_green:'AMEX Green',amex_hilton_honors:'Hilton Honors Aspire',amex_marriott_brill:'Marriott Bonvoy Brilliant',chase_world_of_hyatt:'World of Hyatt',chase_united_quest:'United Quest',chase_united_club:'United Club Infinite',citi_strata_prem:'Citi Strata Premier',wf_premier_autograph:'WF Premier Autograph'};
  const CARD_CLS={gold:'gold',platinum:'platinum',csr:'csr',cap1_venture_x:'venturex',chase_sapphire_pref:'csp',amex_green:'amexgreen',amex_hilton_honors:'hilton',amex_marriott_brill:'marriott',chase_world_of_hyatt:'hyatt',chase_united_quest:'unitedq',chase_united_club:'unitedclub',citi_strata_prem:'citistrata',wf_premier_autograph:'wfpremier'};

  let html=`<div class="banner">📊 <strong>All cards compared</strong> — current card-year performance</div>`;
  html+=`<div class="comparison-grid">`;

  CARD_KEYS.forEach(cardKey=>{
    const fee=getFee(cardKey,CY);
    const maxVal=maxCardYearValue(cardKey);
    const {captured,missed}=calcStats(cardKey,c=>getCardYearPeriods(cardKey,c),isPCurrent);
    const projected=getProjectedCapture(cardKey);
    const elapsed=getCardYearMonthsElapsed(cardKey);
    const remaining=maxVal-captured-missed;
    const effectiveFee=fee-captured;
    const projectedFee=fee-projected;
    const pct=maxVal>0?Math.round(captured/maxVal*100):0;
    const days=daysUntilFee(cardKey);

    html+=`<div class="comparison-card ${CARD_CLS[cardKey]}">
      <div class="comp-card-name">${CARD_LABELS[cardKey]}</div>
      <div class="comp-metric">
        <div class="comp-metric-val green">$${captured.toFixed(0)}</div>
        <div class="comp-metric-label">captured (mo ${elapsed})</div>
      </div>
      <div class="comp-metric">
        <div class="comp-metric-val ${projectedFee<=0?'green':''}">$${projected.toFixed(0)}</div>
        <div class="comp-metric-label">projected year-end</div>
      </div>
      <div class="comp-divider"></div>
      <div class="comp-metric">
        <div class="comp-metric-val ${projectedFee<=0?'green':''}">${projectedFee<=0?'+$'+Math.abs(projectedFee).toFixed(0):'$'+projectedFee.toFixed(0)}</div>
        <div class="comp-metric-label">${projectedFee<=0?'projected profit':'projected vs $'+fee+' fee'}</div>
      </div>
      <div class="comp-metric">
        <div class="comp-metric-val red">$${missed.toFixed(0)}</div>
        <div class="comp-metric-label">missed so far</div>
      </div>
      <div class="comp-progress"><div class="comp-progress-fill" style="width:${Math.min(100,projected/fee*100).toFixed(0)}%"></div></div>
      <div style="font-size:10px;color:var(--text-tertiary);font-family:var(--mono);margin-top:6px">${Math.round(projected/fee*100)}% of fee on pace · ${days}d to renewal</div>
    </div>`;
  });

  html+=`</div>`;
  set(html);
}

// ── Streak Leaderboard ────────────────────────────────────────────────────
function maxCardYearValue(cardKey){
  const card=CARDS[cardKey]; let t=0;
  card.sections.forEach(s=>{
    const n=s.cadence==='monthly'?12:s.cadence==='quarterly'?4:s.cadence==='cal-semi-annual'||s.cadence==='semi-annual'?2:1;
    s.benefits.forEach(b=>{ if(!isBNotAvailable(b,CY)) t+=b.amount*n; });
  });
  return t;
}

function renderStreaks(){
  const CARD_KEYS=getVisibleCardKeys();
  const CARD_LABELS={gold:'AMEX Gold',platinum:'AMEX Platinum',csr:'Chase Sapphire Reserve',cap1_venture_x:'Capital One Venture X',chase_sapphire_pref:'Sapphire Preferred',amex_green:'AMEX Green',amex_hilton_honors:'Hilton Honors Aspire',amex_marriott_brill:'Marriott Bonvoy Brilliant',chase_world_of_hyatt:'World of Hyatt',chase_united_quest:'United Quest',chase_united_club:'United Club Infinite',citi_strata_prem:'Citi Strata Premier',wf_premier_autograph:'WF Premier Autograph'};
  const allStreaks=[];

  CARD_KEYS.forEach(cardKey=>{
    const card=CARDS[cardKey];
    card.sections.forEach(s=>{
      if(s.cadence!=='monthly') return;
      s.benefits.forEach(b=>{
        if(isBNotAvailable(b,CY)) return;
        const streak=getStreak(cardKey,b.id);
        if(streak>0) allStreaks.push({name:b.name,card:CARD_LABELS[cardKey],streak});
      });
    });
  });

  allStreaks.sort((a,b)=>b.streak-a.streak);

  let html=`<div class="banner">🔥 <strong>Streak leaderboard</strong> — consecutive months claimed</div>`;

  if(!allStreaks.length){
    html+=`<div style="text-align:center;padding:32px;color:var(--text-tertiary);font-size:13px">No streaks yet — start claiming your monthly benefits!</div>`;
  } else {
    html+=`<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden">`;
    allStreaks.forEach((s,i)=>{
      const medal=i===0?'🥇':i===1?'🥈':i===2?'🥉':'';
      html+=`<div class="streak-row">
        <div>
          <span>${medal} <span style="color:var(--text);font-weight:500">${s.name}</span></span>
          <span class="streak-card-tag">${s.card}</span>
        </div>
        <div class="streak-count">${s.streak} mo 🔥</div>
      </div>`;
    });
    html+=`</div>`;
  }
  set(html);
}

// ── Batch 1 Features ─────────────────────────────────────────────────────

// Days until next fee
// Days until next fee - using specific fee dates
const FEE_DATES=Object.fromEntries(Object.keys(CARDS).map(k=>[k,{month:CARDS[k].feeMonth??0,day:CARDS[k].feeDay??1}]));

function daysUntilFee(cardKey){
  const {month:fm,day:fd}=FEE_DATES[cardKey];
  const now=new Date();
  let feeDate=new Date(now.getFullYear(), fm, fd);
  if(feeDate<=now) feeDate=new Date(now.getFullYear()+1, fm, fd);
  return Math.ceil((feeDate-now)/(1000*60*60*24));
}

// Days until end of month
function daysUntilEOM(){
  const now=new Date();
  const eom=new Date(now.getFullYear(), now.getMonth()+1, 0);
  return Math.ceil((eom-now)/(1000*60*60*24));
}

// Get unclaimed monthly benefits for current card
function getUnclaimedMonthly(cardKey){
  const card=CARDS[cardKey];
  const unclaimed=[];
  card.sections.forEach(s=>{
    if(s.cadence!=='monthly') return;
    const pk=getCurrentPK(cardKey,s.cadence);
    s.benefits.forEach(b=>{
      if(isBExpired(b,{calY:CY,calM:CM,m:CM})||isBNotAvailable(b,CY)) return;
      if(!isUsed(cardKey,b.id,pk)) unclaimed.push({name:b.name,amt:getBAmount(b,{m:CM})});
    });
  });
  return unclaimed;
}

// Get streak for a benefit (consecutive months used)
function getStreak(cardKey, benefitId){
  let streak=0;
  for(let m=CM;m>=0;m--){
    const pk=getPK('monthly',m,CY);
    if(isUsed(cardKey,benefitId,pk)) streak++;
    else break;
  }
  return streak;
}

// Build countdown strip HTML
function buildCountdownStrip(cardKey){
  const fee=getFee(cardKey,CY);
  if(!fee) return '';
  const days=daysUntilFee(cardKey);
  const {month:fm,day:fd}=FEE_DATES[cardKey];
  const {captured}=calcStats(cardKey,c=>getCardYearPeriods(cardKey,c),isPCurrent);
  const needed=Math.max(0,fee-captured);
  const cls=days<=30?'urgent':days<=90?'soon':'';
  const feeLabel=`${MONTHS[fm]} ${fd}`;

  // iOS-style calendar icon showing the fee due day
  const feeDay=fd;
  const feeMonthShort=MONTHS[fm].toUpperCase();
  const calSvg=`<span style="display:inline-flex;flex-direction:column;align-items:center;justify-content:center;width:32px;height:32px;border-radius:7px;background:var(--surface);border:1px solid var(--border);overflow:hidden;line-height:1;flex-shrink:0">
    <span style="background:#e03030;color:#fff;font-size:7px;font-weight:700;font-family:var(--mono);width:100%;text-align:center;padding:1px 0;letter-spacing:0.04em">${feeMonthShort}</span>
    <span style="font-size:14px;font-weight:700;font-family:var(--font);color:var(--text);line-height:1.5">${feeDay}</span>
  </span>`;

  const targetSvg=`<span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;flex-shrink:0;color:var(--text-secondary)"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.6"/><circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="1.6"/><line x1="10" y1="2" x2="10" y2="5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="10" y1="15" x2="10" y2="18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="2" y1="10" x2="5" y2="10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="15" y1="10" x2="18" y2="10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></span>`;

  let html=`<div class="countdown-strip">`;
  html+=`<div class="countdown-pill ${cls}">
    ${calSvg}
    <div>
      <div style="font-size:11px;font-weight:600;color:inherit">${days}d until fee</div>
      <div style="font-size:10px;opacity:0.7">Due ${feeLabel} · $${fee}</div>
    </div>
  </div>`;
  if(needed>0){
    html+=`<div class="countdown-pill">
      ${targetSvg}
      <div>
        <div style="font-size:11px;font-weight:600;color:var(--text)">$${needed.toFixed(0)} to breakeven</div>
        <div style="font-size:10px;opacity:0.7">$${captured.toFixed(0)} of $${fee} captured</div>
      </div>
    </div>`;
  } else {
    html+=`<div class="countdown-pill" style="border-color:var(--green)">
      <span style="font-size:16px">🎉</span>
      <div>
        <div style="font-size:11px;font-weight:600;color:var(--green)">$${Math.abs(fee-captured).toFixed(0)} in profit</div>
        <div style="font-size:10px;color:var(--text-tertiary)">Fee fully offset</div>
      </div>
    </div>`;
  }
  html+=`</div>`;
  return html;
}

// Build break-even bar
function buildBreakevenBar(cardKey){
  const fee=getFee(cardKey,CY);
  const {captured}=calcStats(cardKey,c=>getCardYearPeriods(cardKey,c),isPCurrent);
  const diff=captured-fee;
  if(diff>=0){
    return `<div class="breakeven-bar in-profit">
      <div>🟢 You're in profit — you've extracted more than the annual fee</div>
      <div class="breakeven-amt">+$${diff.toFixed(0)}</div>
    </div>`;
  } else {
    return `<div class="breakeven-bar needs-more">
      <div>⚡ Claim <strong>$${Math.abs(diff).toFixed(0)}</strong> more to fully offset your $${fee} annual fee</div>
      <div class="breakeven-amt">$${captured.toFixed(0)}/$${fee}</div>
    </div>`;
  }
}

// Build end-of-month warning
function buildEOMWarning(cardKey){
  const days=daysUntilEOM();
  if(days>5) return ''; // only warn in last 5 days
  const unclaimed=getUnclaimedMonthly(cardKey);
  if(!unclaimed.length) return '';
  const total=unclaimed.reduce((s,b)=>s+b.amt,0);
  const names=unclaimed.map(b=>b.name).join(', ');
  return `<div class="eom-warning">
    ⚠️ <div><strong>${days} day${days===1?'':'s'} left this month</strong> — you still have $${total.toFixed(0)} unclaimed: ${names}</div>
  </div>`;
}


// ── Confetti ──────────────────────────────────────────────────────────────
function launchConfetti(){
  const canvas=document.getElementById('confettiCanvas');
  const ctx=canvas.getContext('2d');
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  const colors=['#C8922A','#2A9B6A','#4A7FA5','#D94040','#F5C542','#ffffff'];
  const pieces=Array.from({length:120},()=>({
    x:Math.random()*canvas.width,
    y:-10-Math.random()*100,
    r:Math.random()*6+3,
    d:Math.random()*3+1,
    color:colors[Math.floor(Math.random()*colors.length)],
    tilt:Math.random()*10-5,
    tiltAngle:0,
    tiltSpeed:Math.random()*0.1+0.05,
  }));
  let frame=0;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      p.tiltAngle+=p.tiltSpeed;
      p.y+=p.d;
      p.tilt=Math.sin(p.tiltAngle)*12;
      ctx.beginPath();
      ctx.fillStyle=p.color;
      ctx.ellipse(p.x+p.tilt,p.y,p.r,p.r/2,p.tiltAngle,0,2*Math.PI);
      ctx.fill();
    });
    frame++;
    if(frame<160) requestAnimationFrame(draw);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  draw();
}

// Check if all monthly benefits just got claimed → trigger confetti
function checkAllClaimed(cardKey){
  const card=CARDS[cardKey];
  let allDone=true;
  card.sections.forEach(s=>{
    const pk=getCurrentPK(cardKey,s.cadence);
    s.benefits.forEach(b=>{
      if(isBExpired(b,{calY:CY,calM:CM,m:CM})||isBNotAvailable(b,CY)) return;
      if(!isUsed(cardKey,b.id,pk)) allDone=false;
    });
  });
  if(allDone) launchConfetti();
}

function renderCurrent(){
  const card=CARDS[activeCard];
  const {year:fy,month:fm}=getCardYearStart(activeCard,CY);
  const cyEnd=(fm+11)%12,cyEndY=fy+Math.floor((fm+11)/12);
  let totalNow=0,usedNow=0;
  card.sections.forEach(s=>{ const pk=getCurrentPK(activeCard,s.cadence); s.benefits.forEach(b=>{ if(isBExpired(b,{calY:CY,calM:CM,m:CM})||isBNotAvailable(b,CY)) return; totalNow+=getBAmount(b,{m:CM}); if(isUsed(activeCard,b.id,pk)) usedNow+=getBAmount(b,{m:CM}); }); });
  const pct=totalNow>0?Math.round(usedNow/totalNow*100):0;
  const {captured}=calcStats(activeCard,c=>getCardYearPeriods(activeCard,c),isPCurrent);
  const effectiveFee=getFee(activeCard,CY)-captured;

  let html=buildCountdownStrip(activeCard);
  html+=buildEOMWarning(activeCard);
  html+=buildBreakevenBar(activeCard);
  html+=metricsHTML('Available now',`$${totalNow.toFixed(0)}`,'Claimed',`$${usedNow.toFixed(0)}`,'Card-yr captured',`$${captured.toFixed(0)}`,'Effective fee',`${effectiveFee<=0?'<span style="color:var(--green)">$'+Math.abs(effectiveFee).toFixed(0)+' profit!</span>':'$'+effectiveFee.toFixed(0)}`);
  html+=progressHTML(pct,'',`$${getFee(activeCard,CY)} fee − $${captured.toFixed(0)} captured = $${effectiveFee.toFixed(0)} effective`);
  html+=`<div class="period-note">Active periods for <strong>${MONTHS_FULL[CM]} ${CY}</strong> — check off as you use each benefit.</div>`;

  card.sections.forEach(s=>{
    const pk=getCurrentPK(activeCard,s.cadence);
    const lbl=getCurrentLabel(activeCard,s.cadence);
    const currentP={calY:CY,calM:CM,m:CM};
    const visibleBenefits=s.benefits.filter(b=>!isBExpired(b,currentP)&&!isBNotAvailable(b,CY));
    if(!visibleBenefits.length) return;

    const allClaimed=visibleBenefits.every(b=>isUsed(activeCard,b.id,pk));
    const claimedCount=visibleBenefits.filter(b=>isUsed(activeCard,b.id,pk)).length;
    const sectionKey=`current-${activeCard}-${s.cadence}`;
    const isCollapsed=_collapsedCurrentSections.has(sectionKey);

    const indicator=allClaimed
      ? `<span style="color:var(--green);font-size:12px">✓</span>`
      : `<span style="font-size:13px;color:var(--text-tertiary);display:inline-block;transform:rotate(${isCollapsed?'-90deg':'0deg'});transition:transform 0.2s">▾</span>`;

    const countBadge=allClaimed
      ? `<span style="font-size:10px;font-family:var(--mono);color:var(--green);background:rgba(42,155,106,0.1);padding:1px 7px;border-radius:100px">${claimedCount}/${visibleBenefits.length} ✓</span>`
      : `<span style="font-size:10px;font-family:var(--mono);color:var(--text-tertiary);background:var(--border-light);padding:1px 7px;border-radius:100px">${claimedCount}/${visibleBenefits.length}</span>`;

    html+=`<div class="section-header collapsible-header" data-section-key="${sectionKey}" style="cursor:pointer;user-select:none">
      <div style="display:flex;align-items:center;gap:8px">
        ${indicator}
        <span class="section-title" style="color:${allClaimed?'var(--text-tertiary)':''}">${s.label}</span>
        ${countBadge}
      </div>
      <span class="section-period">${lbl}</span>
    </div>`;

    if(!isCollapsed){
      visibleBenefits.forEach(b=>{
        const used=isUsed(activeCard,b.id,pk);
        const credited=isCredited(activeCard,b.id,pk);
        const streak=s.cadence==='monthly'?getStreak(activeCard,b.id):0;
        const streakBadge=streak>=2?`<span class="streak-badge">🔥 ${streak} mo streak</span>`:'';
        const expiryBadge=getExpiryBadge(b)+getBenefitExpiryLabel(b);
        const catTag=getCategoryTag(b.id);
        const effectiveAmt=getEffectiveAmount(activeCard,b.id,getBAmount(b,{m:CM}));
        const dispAmt=b.note&&b.amount===0?b.note:`$${effectiveAmt}`;
        const note=getNote(activeCard,b.id,pk);
        const noteHTML=note
          ?`<div class="benefit-note" data-id="${b.id}" data-pk="${pk}" data-name="${b.name}"><span class="note-dot"></span>${escapeHtml(note)}</div>`
          :`<div class="add-note" data-id="${b.id}" data-pk="${pk}" data-name="${b.name}">+ add note</div>`;
        const partialHTML=b.partial&&used?buildPartialBar(activeCard,b.id,pk,effectiveAmt):'';
        const creditedHTML=used?`<div style="margin-top:4px;font-size:10px;font-family:var(--mono)">
          <span style="color:${credited?'var(--green)':'var(--text-tertiary)'};cursor:pointer" data-credit-id="${b.id}" data-credit-pk="${pk}">
            ${credited?'✓ Credit posted':'○ Credit pending'}</span>
        </div>`:'';
        html+=`<div class="benefit-row${used?' used':''}">
          <div style="flex:1">
            <div class="benefit-name">${b.name}${catTag}${streakBadge}${expiryBadge}</div>
            <div class="benefit-desc">${b.desc}</div>
            ${noteHTML}
            ${partialHTML}
            ${creditedHTML}
          </div>
          <div class="benefit-amt">${dispAmt}</div>
          <button class="check-btn${used?' checked':''}" data-id="${b.id}" data-pk="${pk}"></button>
        </div>`;
      });
    }
  });

  set(html);
  // note: check-btn clicks handled by event delegation below
  document.querySelectorAll('.benefit-note,.add-note').forEach(el=>el.addEventListener('click',()=>{
    openNoteModal(activeCard,el.dataset.id,el.dataset.pk,el.dataset.name);
  }));
  document.querySelectorAll('.partial-input').forEach(inp=>inp.addEventListener('change',()=>{
    const amt=Math.min(parseFloat(inp.value)||0, parseFloat(inp.dataset.total));
    setPartialUsed(inp.dataset.card,inp.dataset.id,inp.dataset.pk,amt);
    renderCurrent();
  }));
  document.querySelectorAll('[data-credit-id]').forEach(el=>el.addEventListener('click',()=>{
    toggleCredited(activeCard,el.dataset.creditId,el.dataset.creditPk);
    renderCurrent();
  }));
}

function renderHistBase(getPsFn,isCurFn,bannerHTML,reRender){
  const card=CARDS[activeCard];
  let html=bannerHTML+`<div class="legend"><span class="legend-item"><span class="dot dot-used" style="width:13px;height:13px"></span>Used</span><span class="legend-item"><span class="dot dot-missed" style="width:13px;height:13px"></span>Missed</span><span class="legend-item"><span class="dot dot-current" style="width:13px;height:13px"></span>Current</span><span class="legend-item"><span class="dot dot-future" style="width:13px;height:13px"></span>Future</span></div><div class="period-note">Click any past or current dot to toggle used / missed.</div>`;
  card.sections.forEach(s=>{
    const ps=getPsFn(s.cadence);
    const visibleBenefits=s.benefits.filter(b=>!isBNotAvailable(b,selectedYear));
    if(!visibleBenefits.length) return;
    html+=`<div class="section-header"><span class="section-title">${s.label} benefits</span></div>`;
    visibleBenefits.forEach(b=>{
      html+=`<div class="hist-row"><div><div class="hist-name">${b.name}</div><div class="hist-sub">${b.decAmount?`$${b.amount}/mo · $${b.decAmount} Dec`:`$${b.amount}/${s.cadence==='semi-annual'||s.cadence==='cal-semi-annual'?'half':s.cadence==='monthly'?'mo':s.cadence==='quarterly'?'qtr':'yr'}`}</div></div><div class="dots-row">`;
      ps.forEach(p=>{
        if(isBExpired(b,p)) return;
        const fut=isPFuture(p),cur=isCurFn(s.cadence,p),used=isUsed(activeCard,b.id,p.pk);
        const cls=fut?'dot-future':used?'dot-used':cur?'dot-current':'dot-missed';
        const clickable=!fut;
        const title=fut?`${p.lbl}: upcoming`:used?`${p.lbl}: used — click to unmark`:`${p.lbl}: ${cur?'not yet used':'missed'} — click to mark used`;
        html+=`<button class="dot-btn${clickable?'':' no-click'}" data-id="${b.id}" data-pk="${p.pk}" data-c="${clickable}" title="${title}"><span class="dot ${cls}"></span><span class="dot-lbl">${p.lbl}</span></button>`;
      });
      html+=`</div></div>`;
    });
  });
  set(html);
  // dot clicks handled by event delegation
}

function renderSummBase(getPsFn,isCurFn,bannerHTML,label){
  const card=CARDS[activeCard];
  const {captured,missed,total}=calcStats(activeCard,getPsFn,isCurFn);
  const fee=getFee(activeCard,selectedYear);
  const remaining=total-captured-missed;
  const effectiveFee=fee-captured;
  const feePct=fee>0?Math.min(100,Math.round(captured/fee*100)):0;
  const totalPct=total>0?Math.round(captured/total*100):0;
  let html=bannerHTML;
  html+=buildDonut(captured,missed,Math.max(0,remaining));
  html+=metricsHTML(
    `Total ${label} value`,`$${total.toFixed(0)}`,
    'Captured',`$${captured.toFixed(0)}`,
    'Missed',`$${missed.toFixed(0)}`,
    'Effective fee',`${effectiveFee<=0?'<span style="color:var(--green)">$'+Math.abs(effectiveFee).toFixed(0)+' profit!</span>':'$'+effectiveFee.toFixed(0)}`
  );
  // Show two progress bars: fee coverage + total capture rate
  html+=`<div class="progress-wrap">
    <div style="display:flex;justify-content:space-between;font-size:10px;font-family:var(--mono);color:var(--text-tertiary);margin-bottom:4px">
      <span>Fee coverage</span><span>${feePct}% of $${fee} fee</span>
    </div>
    <div class="progress-track" style="margin-bottom:8px">
      <div class="progress-fill" style="width:${feePct}%;background:${effectiveFee<=0?'var(--green)':'var(--gold)'}"></div>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:10px;font-family:var(--mono);color:var(--text-tertiary);margin-bottom:4px">
      <span>Benefit capture rate</span><span>${totalPct}% of $${total.toFixed(0)} available</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" style="width:${totalPct}%"></div>
    </div>
  </div>`;
  html+=`<div class="summary-table">`;
  card.sections.forEach(s=>{
    s.benefits.forEach(b=>{
      const ps=getPsFn(s.cadence);
      if(isBNotAvailable(b,selectedYear)) return;
      if(isBExpired(b,{calY:selectedYear,calM:11,m:11})) return;
      let bc=0,bm=0,bl=0;
      ps.forEach(p=>{
        if(isBExpired(b,p)) return;
        const fut=isPFuture(p),cur=isCurFn(s.cadence,p),used=isUsed(activeCard,b.id,p.pk),amt=getBAmount(b,p);
        if(used) bc+=amt; else if(!fut&&!cur) bm+=amt; else bl+=amt;
      });
      const cadLbl=s.cadence==='semi-annual'||s.cadence==='cal-semi-annual'?'half':s.cadence==='monthly'?'mo':s.cadence==='quarterly'?'qtr':'yr';
      const amtLbl=b.decAmount?`$${b.amount}–$${b.decAmount}/mo`:`$${b.amount}/${cadLbl}`;
      const expiredTag=b.expiresAfter?`<span style="font-size:10px;color:var(--red);margin-left:4px">ends Jun 2026</span>`:'';
      html+=`<div class="summary-row-item"><div><span class="summary-item-name">${b.name}</span>${expiredTag}<span class="summary-item-cadence">${amtLbl}</span></div><div class="badges">${bc>0?`<span class="badge-captured">+$${bc.toFixed(0)}</span>`:''}${bm>0?`<span class="badge-missed">−$${bm.toFixed(0)} missed</span>`:''}${bl>0?`<span class="badge-left">$${bl.toFixed(0)} left</span>`:''}</div></div>`;
    });
  });
  html+=`</div>`;
  set(html);
}

function set(html){
  const main=document.getElementById('main');
  main.classList.add('transitioning');
  setTimeout(()=>{
    main.innerHTML=html;
    main.classList.remove('transitioning');
  },180);
}

function renderAllCards(){
  const CARD_KEYS=getVisibleCardKeys();
  const CARD_LABELS={gold:'AMEX Gold',platinum:'AMEX Platinum',csr:'Chase Sapphire Reserve',cap1_venture_x:'Capital One Venture X',chase_sapphire_pref:'Sapphire Preferred',amex_green:'AMEX Green',amex_hilton_honors:'Hilton Honors Aspire',amex_marriott_brill:'Marriott Bonvoy Brilliant',chase_world_of_hyatt:'World of Hyatt',chase_united_quest:'United Quest',chase_united_club:'United Club Infinite',citi_strata_prem:'Citi Strata Premier',wf_premier_autograph:'WF Premier Autograph'};
  const CARD_CLS={gold:'gold',platinum:'platinum',csr:'csr',cap1_venture_x:'venturex',chase_sapphire_pref:'csp',amex_green:'amexgreen',amex_hilton_honors:'hilton',amex_marriott_brill:'marriott',chase_world_of_hyatt:'hyatt',chase_united_quest:'unitedq',chase_united_club:'unitedclub',citi_strata_prem:'citistrata',wf_premier_autograph:'wfpremier'};

  // Define cadence display order and labels
  const CADENCE_ORDER=['monthly','quarterly','cal-semi-annual','semi-annual','feb-annual','cal-annual','annual'];
  const CADENCE_LABELS={
    'monthly': `Monthly — ${MONTHS_FULL[CM]} ${CY}`,
    'quarterly': `Quarterly — Q${Math.floor(CM/3)+1} ${CY}`,
    'cal-semi-annual': CM<6?`Semi-annual — Jan–Jun ${CY}`:`Semi-annual — Jul–Dec ${CY}`,
    'semi-annual': 'Semi-annual (card-year)',
    'feb-annual': `Annual — Feb ${CM>=1?CY:CY-1}–Jan ${CM>=1?CY+1:CY}`,
    'cal-annual': `Annual — ${CY}`,
    'annual': 'Annual (card-year)',
  };

  // Collect all unclaimed benefits grouped by cadence
  const byPeriod = {};
  const byPeriodTotal = {}; // total count including claimed
  CADENCE_ORDER.forEach(c => { byPeriod[c]=[]; byPeriodTotal[c]=0; });

  let grandTotal=0;

  CARD_KEYS.forEach(cardKey=>{
    const card=CARDS[cardKey];
    card.sections.forEach(s=>{
      const pk=getCurrentPK(cardKey,s.cadence);
      s.benefits.forEach(b=>{
        if(isBExpired(b,{calY:CY,calM:CM,m:CM})||isBNotAvailable(b,CY)) return;
        byPeriodTotal[s.cadence]=(byPeriodTotal[s.cadence]||0)+1;
        const used=isUsed(cardKey,b.id,pk);
        if(!used){
          const amt=getBAmount(b,{m:CM});
          if(!byPeriod[s.cadence]) byPeriod[s.cadence]=[];
          byPeriod[s.cadence].push({cardKey,cardLabel:CARD_LABELS[cardKey],cardCls:CARD_CLS[cardKey],name:b.name,amt});
          grandTotal+=amt;
        }
      });
    });
  });

  let html=``;
  html+=buildAllCardsSummary();
  html+=buildLiveBanner();
  html+=`<div class="banner">📋 <strong>Still available to collect</strong> across all cards this period</div>`;

  // Grand total up top
  html+=`<div class="grand-total-row" style="margin-top:0;margin-bottom:16px">
    <span class="grand-total-label">Total available to collect</span>
    <span class="grand-total-amt">$${grandTotal.toFixed(0)}</span>
  </div>`;

  let anyShown=false;
  CADENCE_ORDER.forEach(cadence=>{
    const items=byPeriod[cadence]||[];
    const totalCount=byPeriodTotal[cadence]||0;
    if(totalCount===0) return; // skip if no benefits in this cadence at all
    anyShown=true;

    const allClaimed=items.length===0;
    const periodTotal=items.reduce((s,i)=>s+i.amt,0);
    const isCollapsed=_collapsedSections.has(cadence);
    const indicator=allClaimed
      ? `<span style="color:var(--green);font-size:12px;line-height:1">✓</span>`
      : `<span style="font-size:13px;color:var(--text-tertiary);display:inline-block;transform:rotate(${isCollapsed?'-90deg':'0deg'});transition:transform 0.2s">▾</span>`;
    const claimedCount=totalCount-items.length;

    html+=`<div class="all-cards-header collapsible-header" data-cadence="${cadence}" style="cursor:pointer;user-select:none">
      <div style="display:flex;align-items:center;gap:8px">
        ${indicator}
        <span style="font-size:11px;font-weight:600;font-family:var(--mono);text-transform:uppercase;letter-spacing:0.06em;color:${allClaimed?'var(--text-tertiary)':'var(--text-secondary)'}">${CADENCE_LABELS[cadence]||cadence}</span>
        <span style="font-size:10px;font-family:var(--mono);color:${allClaimed?'var(--green)':'var(--text-tertiary)'};background:${allClaimed?'rgba(42,155,106,0.1)':'var(--border-light)'};padding:1px 7px;border-radius:100px">
          ${allClaimed?`${claimedCount}/${totalCount} ✓`:`${items.length} left`}
        </span>
      </div>
      <span class="all-cards-subtotal" style="color:${allClaimed?'var(--green)':''}">
        ${allClaimed?'All claimed ✓':`$${periodTotal.toFixed(0)} left`}
      </span>
    </div>`;

    if(!allClaimed){
      const bodyId=`section-body-${cadence}`;
      html+=`<div id="${bodyId}" style="overflow:hidden;transition:max-height 0.25s ease,opacity 0.25s ease;max-height:${isCollapsed?'0':'2000px'};opacity:${isCollapsed?'0':'1'}">`;
      items.forEach(item=>{
        html+=`<div class="avail-row">
          <div>
            <div class="avail-name">${item.name}</div>
            <div class="avail-period"><span class="all-cards-card-name ${item.cardCls}" style="font-size:10px;text-transform:none;letter-spacing:0;font-weight:600">${item.cardLabel}</span></div>
          </div>
          <div class="avail-amt">$${item.amt.toFixed(0)}</div>
        </div>`;
      });
      html+=`</div>`;
    }
  });

  if(!anyShown){
    html+=`<div style="text-align:center;padding:32px;color:var(--text-tertiary);font-size:13px">🎉 All visible card benefits claimed!</div>`;
  }

  html+=`<div style="font-size:10px;font-family:var(--mono);color:var(--text-tertiary);text-align:center;margin-top:12px">Active periods only · switch to a card tab to mark benefits used</div>`;

  set(html);
}

function render(){
  // Show/hide card selector and top nav based on view type
  const _analyticsViews=['compare','streaks','history-log','recap','insights','heatmap','roi','priority','keep-card','trends'];
  const _isAnalytics=_analyticsViews.includes(activeView);
  ['cardSelector','navPrimary','navSecondary','yearSelector','ptrIndicator'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.style.display=_isAnalytics?'none':'';
  });
  document.querySelectorAll('.drag-hint,.ptr-indicator').forEach(el=>{ el.style.display=_isAnalytics?'none':''; });

  // In All Cards view: highlight all card buttons. Otherwise highlight only the active card.
  const _btns=document.querySelectorAll('.card-btn[data-card]');
  if(activeView==='all-cards'){
    _btns.forEach(b=>{ b.className='card-btn'; b.classList.add(`active-${b.dataset.card}`); });
  } else {
    _btns.forEach(b=>{ b.className='card-btn'; if(b.dataset.card===activeCard) b.classList.add(`active-${activeCard}`); });
  }

  const card=CARDS[activeCard];
  const fee=getFee(activeCard,selectedYear);
  const {year:fy,month:fm}=getCardYearStart(activeCard,selectedYear);
  const cyEnd=(fm+11)%12,cyEndY=fy+Math.floor((fm+11)/12);
  const cyBanner=`<div class="banner">💳 Card year: <strong>${MONTHS[fm]} ${fy} → ${MONTHS[cyEnd]} ${cyEndY}</strong> &nbsp;·&nbsp; Annual fee: <strong>$${fee}</strong></div>`;
  const isCurrentYear=selectedYear===CY;
  const ytdEndLabel=isCurrentYear?`${MONTHS_FULL[CM]} ${CY}`:`Dec ${selectedYear}`;
  const ytdBanner=`<div class="banner">📅 <strong>Jan ${selectedYear} → ${ytdEndLabel}</strong> &nbsp;·&nbsp; ${isCurrentYear?'Calendar YTD':selectedYear+' full year'} &nbsp;·&nbsp; Annual fee: <strong>$${fee}</strong></div>`;
  if(activeView==='all-cards') renderAllCards();
  else if(activeView==='current') renderCurrent();
  else if(activeView==='history') renderHistBase(c=>getCardYearPeriods(activeCard,c),isPCurrent,cyBanner,()=>render());
  else if(activeView==='annual') renderSummBase(c=>getCardYearPeriods(activeCard,c),isPCurrent,cyBanner,'card-year');
  else if(activeView==='ytd-history') renderHistBase(c=>getYTDPeriods(c),isYTDCurrent,ytdBanner,()=>render());
  else if(activeView==='ytd') renderSummBase(c=>getYTDPeriods(c),isYTDCurrent,ytdBanner,selectedYear===CY?'YTD':selectedYear+' full year');
  else if(activeView==='compare') renderComparison();
  else if(activeView==='streaks') renderStreaks();
  else if(activeView==='history-log') renderHistoryLog();
  else if(activeView==='recap') renderRecap();
  else if(activeView==='insights') renderInsights();
  else if(activeView==='heatmap') renderHeatmap();
  else if(activeView==='roi') renderROI();
  else if(activeView==='priority') renderPriorityQueue();
  else if(activeView==='keep-card') renderKeepCard();
  else if(activeView==='trends') renderTrends();
  // Update badges after every render
  setTimeout(()=>{ updateTabBadge(); updateCardBadges(); }, 200);
}

// ── Event listeners ───────────────────────────────────────────────────────
// ── Card selector: click + drag-to-reorder ────────────────────────────────
function initCardSelector() {
  const selector = document.getElementById('cardSelector');
  const btns = () => [...selector.querySelectorAll('.card-btn')];
  let dragSrc = null;

  btns().forEach(btn => {
    btn.setAttribute('draggable', 'true');

    // Click to select, double-tap to open info sheet
    let lastTap=0;
    btn.addEventListener('click', e => {
      if (btn.classList.contains('dragging')) return;

      const now=Date.now();

      // Double-tap = open card info sheet
      if(now-lastTap<300){
        openCardSheet(btn.dataset.card);
        lastTap=0;
        return;
      }
      lastTap=now;

      // Single tap = select card, switch to May view
      btns().forEach(b => b.className = 'card-btn');
      const c = btn.dataset.card;
      btn.classList.add(`active-${c}`);
      activeCard = c;
      setActiveView('this-period');
      setTimeout(initCardFlip,50);
    });

    // Drag start
    btn.addEventListener('dragstart', e => {
      dragSrc = btn;
      btn.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    btn.addEventListener('dragend', () => {
      btn.classList.remove('dragging');
      btns().forEach(b => b.classList.remove('drag-over'));
      dragSrc = null;
    });

    // Drag over
    btn.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (btn !== dragSrc) {
        btns().forEach(b => b.classList.remove('drag-over'));
        btn.classList.add('drag-over');
      }
    });
    btn.addEventListener('dragleave', () => btn.classList.remove('drag-over'));

    // Drop: swap positions
    btn.addEventListener('drop', e => {
      e.preventDefault();
      btn.classList.remove('drag-over');
      if (dragSrc && dragSrc !== btn) {
        const allBtns = btns();
        const srcIdx = allBtns.indexOf(dragSrc);
        const tgtIdx = allBtns.indexOf(btn);
        if (srcIdx < tgtIdx) selector.insertBefore(dragSrc, btn.nextSibling);
        else selector.insertBefore(dragSrc, btn);
      }
    });
  });
}

initCardSelector();

// ── Event delegation for all interactive elements in #main ────────────────
document.getElementById('main').addEventListener('click', e=>{
  // Check buttons (benefit toggle)
  const checkBtn=e.target.closest('.check-btn');
  if(checkBtn){
    e.stopPropagation();
    toggle(activeCard,checkBtn.dataset.id,checkBtn.dataset.pk);
    haptic('light');
    checkBtn.classList.add('pop');
    setTimeout(()=>checkBtn.classList.remove('pop'),300);
    checkAllClaimed(activeCard);
    renderCurrent();
    return;
  }
  // Dot buttons (card year / YTD history)
  const dotBtn=e.target.closest('.dot-btn');
  if(dotBtn){
    if(dotBtn.dataset.c==='false') return;
    toggle(activeCard,dotBtn.dataset.id,dotBtn.dataset.pk);
    render();
    return;
  }
  // Current view section collapse
  const secHeader=e.target.closest('.section-header.collapsible-header');
  if(secHeader && secHeader.dataset.sectionKey){
    if(e.target.closest('.check-btn,.benefit-note,.add-note,.partial-input')) return;
    const key=secHeader.dataset.sectionKey;
    if(_collapsedCurrentSections.has(key)) _collapsedCurrentSections.delete(key);
    else _collapsedCurrentSections.add(key);
    haptic('light');
    renderCurrent();
    return;
  }
  // All cards cadence collapse
  const cadHeader=e.target.closest('.collapsible-header[data-cadence]');
  if(cadHeader){
    const cadence=cadHeader.dataset.cadence;
    const nowCollapsed=_collapsedSections.has(cadence);
    if(nowCollapsed) _collapsedSections.delete(cadence);
    else _collapsedSections.add(cadence);
    haptic('light');
    // Animate in-place without full re-render
    const body=document.getElementById(`section-body-${cadence}`);
    const chevron=cadHeader.querySelector('[style*="rotate"]');
    if(body){
      if(nowCollapsed){
        body.style.maxHeight='2000px';
        body.style.opacity='1';
      } else {
        body.style.maxHeight='0';
        body.style.opacity='0';
      }
    }
    if(chevron) chevron.style.transform=`rotate(${nowCollapsed?'0deg':'-90deg'})`;
    return;
  }
});

// ── Two-level nav logic ───────────────────────────────────────────────────
let activePrimary = 'all-cards';
let activeSecondary = { 'card-year': 'history', 'ytd': 'ytd-history' };

function updateYearSelector(show){
  const ys=document.getElementById('yearSelector');
  ys.classList.toggle('hidden',!show);
  ys.innerHTML=[CY-1,CY,CY+1].map(y=>`<button class="year-btn${y===selectedYear?' active':''}" data-year="${y}">${y}</button>`).join('');
}

function updateSecondaryNav(primary) {
  const sec = document.getElementById('navSecondary');
  const stabs = sec.querySelectorAll('.stab');

  if(primary === 'card-year') {
    sec.classList.remove('hidden');
    stabs[0].textContent = 'Period';
    stabs[0].dataset.view = 'history';
    stabs[1].textContent = 'Summary';
    stabs[1].dataset.view = 'annual';
    updateYearSelector(true);
  } else if(primary === 'ytd') {
    sec.classList.remove('hidden');
    stabs[0].textContent = `${selectedYear} History`;
    stabs[0].dataset.view = 'ytd-history';
    stabs[1].textContent = `${selectedYear} Summary`;
    stabs[1].dataset.view = 'ytd';
    updateYearSelector(true);
  } else if(primary === 'recap') {
    sec.classList.add('hidden');
    updateYearSelector(true); // show year selector for recap
  } else {
    sec.classList.add('hidden');
    updateYearSelector(false);
  }
  // Update active state based on current activeView
  stabs.forEach(t => t.classList.toggle('active', t.dataset.view === activeView));
}

// Year button clicks (delegated — buttons are regenerated dynamically)
document.getElementById('yearSelector').addEventListener('click',e=>{
  const btn=e.target.closest('.year-btn');
  if(!btn) return;
  selectedYear=parseInt(btn.dataset.year);
  updateYearSelector(true);
  render();
});

function setActiveView(primary) {
  activePrimary = primary;
  if(primary === 'all-cards') activeView = 'all-cards';
  else if(primary === 'this-period') activeView = 'current';
  else if(primary === 'card-year') activeView = activeSecondary['card-year'] || 'history';
  else if(primary === 'ytd') activeView = activeSecondary['ytd'] || 'ytd-history';
  else if(primary === 'compare') activeView = 'compare';
  else if(primary === 'streaks') activeView = 'streaks';
  else if(primary === 'history-log') activeView = 'history-log';
  else if(primary === 'recap') activeView = 'recap';
  else if(primary === 'insights') activeView = 'insights';
  else if(primary === 'heatmap') activeView = 'heatmap';
  else if(primary === 'roi') activeView = 'roi';
  else if(primary === 'priority') activeView = 'priority';
  else if(primary === 'keep-card') activeView = 'keep-card';
  else if(primary === 'trends') activeView = 'trends';
  else if(primary === 'my-cards') { openMyCards(); return; }

  const topViews=['all-cards','this-period','card-year','ytd'];
  if(topViews.includes(primary)){
    document.querySelectorAll('.nav-primary-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.primary === primary)
    );
    document.querySelectorAll('.drawer-item').forEach(b => b.classList.remove('active'));
  } else {
    document.querySelectorAll('.nav-primary-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.drawer-item').forEach(b =>
      b.classList.toggle('active', b.dataset.primary === primary)
    );
  }

  updateSecondaryNav(primary);
  render();
}

// ── Drawer (left slide-out menu) ──────────────────────────────────────────
function openDrawer(){
  document.getElementById('navExtras').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('open');
}
function closeDrawer(){
  document.getElementById('navExtras').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
}
document.getElementById('menuBtn').addEventListener('click', openDrawer);
document.getElementById('drawerClose').addEventListener('click', closeDrawer);
document.getElementById('drawerOverlay').addEventListener('click', closeDrawer);

// Primary nav clicks (top bar)
document.getElementById('navPrimary').querySelectorAll('.nav-primary-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.drawer-item').forEach(b => b.classList.remove('active'));
    setActiveView(btn.dataset.primary);
  });
});

// Drawer item clicks
document.getElementById('navExtras').querySelectorAll('.drawer-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-primary-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.drawer-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    closeDrawer();
    setActiveView(btn.dataset.primary);
  });
});

// Secondary nav clicks
document.getElementById('navSecondary').addEventListener('click', e => {
  const btn = e.target.closest('.stab');
  if(!btn) return;
  const view = btn.dataset.view;
  if(!view) return;
  activeView = view;
  activeSecondary[activePrimary] = view;
  updateSecondaryNav(activePrimary);
  render();
});

// ── Uniform SVG nav icons ─────────────────────────────────────────────────
(function(){
  const day=new Date().getDate();
  const month=new Date().toLocaleString('default',{month:'short'}).toUpperCase();
  const monthFull=new Date().toLocaleString('default',{month:'long'});
  const currentTab=document.getElementById('currentTab');
  if(currentTab) currentTab.textContent='Month';
  const S='width:22px;height:22px;display:block';
  const icons={
    'all-cards':`<svg style="${S}" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="18" height="3" rx="1.5" fill="currentColor" opacity="0.9"/>
      <rect x="2" y="9.5" width="18" height="3" rx="1.5" fill="currentColor" opacity="0.9"/>
      <rect x="2" y="15" width="18" height="3" rx="1.5" fill="currentColor" opacity="0.9"/>
    </svg>`,
    'this-period':`<svg style="${S}" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="18" height="16" rx="2.5" fill="currentColor" opacity="0.08"/>
      <rect x="2" y="3" width="18" height="16" rx="2.5" stroke="currentColor" stroke-width="1.5"/>
      <rect x="2" y="3" width="18" height="6.5" rx="2.5" fill="#e03030"/>
      <rect x="2" y="6.5" width="18" height="3" fill="#e03030"/>
      <line x1="7" y1="3" x2="7" y2="9.5" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>
      <line x1="15" y1="3" x2="15" y2="9.5" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>
      <text x="11" y="8.8" text-anchor="middle" font-size="4.5" font-weight="700" font-family="system-ui,sans-serif" fill="white" letter-spacing="0.5">${month}</text>
      <text x="11" y="17.5" text-anchor="middle" font-size="8.5" font-weight="700" font-family="system-ui,sans-serif" fill="currentColor">${day}</text>
    </svg>`,
    'card-year':`<svg style="${S}" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="5" width="18" height="12" rx="2.5" stroke="currentColor" stroke-width="1.6"/>
      <rect x="2" y="9" width="18" height="2.5" fill="currentColor" opacity="0.35"/>
      <rect x="4" y="13" width="5" height="1.5" rx="0.75" fill="currentColor" opacity="0.7"/>
    </svg>`,
    'ytd':`<svg style="${S}" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="2,17 7,11 11,13 16,7 20,5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
      <polyline points="16,5 20,5 20,9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  };
  Object.entries(icons).forEach(([primary,svg])=>{
    const btn=document.querySelector(`.nav-primary-btn[data-primary="${primary}"]`);
    if(!btn) return;
    const icon=btn.querySelector('.nav-icon');
    if(!icon) return;
    icon.innerHTML=svg;
    icon.style.fontSize='0';
    icon.style.lineHeight='0';
    icon.style.display='flex';
    icon.style.alignItems='center';
    icon.style.justifyContent='center';
    icon.style.marginBottom='2px';
  });
})();

// ── Home button — clicking app title goes back to All Cards ──────────────
(function(){
  const title=document.querySelector('.app-title');
  if(title){
    title.style.cursor='pointer';
    title.addEventListener('click',()=>setActiveView('all-cards'));
  }

  // Replace drawer item emojis with clean SVG icons
  const drawerIconMap={'priority': `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="8" cy="11" r="0.8" fill="currentColor"/></svg>`, 'insights': `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2a4 4 0 0 1 4 4c0 1.6-.9 3-2.2 3.7V11H6.2V9.7A4 4 0 0 1 4 6a4 4 0 0 1 4-4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="6.2" y1="12.5" x2="9.8" y2="12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="6.8" y1="14" x2="9.2" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`, 'keep-card': `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="4" width="13" height="9" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 8.5L7 10l3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`, 'compare': `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3.5" width="5.5" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="3.5" width="5.5" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="6.5" x2="5.5" y2="6.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="10.5" y1="6.5" x2="13" y2="6.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="3" y1="9" x2="5.5" y2="9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="10.5" y1="9" x2="13" y2="9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`, 'roi': `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="9" width="2.5" height="5" rx="0.75" fill="currentColor" opacity="0.7"/><rect x="6" y="6" width="2.5" height="8" rx="0.75" fill="currentColor" opacity="0.85"/><rect x="10" y="3" width="2.5" height="11" rx="0.75" fill="currentColor"/><line x1="1.5" y1="14.5" x2="14.5" y2="14.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`, 'heatmap': `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="3" height="3" rx="0.75" fill="currentColor" opacity="0.3"/><rect x="6.5" y="2" width="3" height="3" rx="0.75" fill="currentColor" opacity="0.7"/><rect x="11" y="2" width="3" height="3" rx="0.75" fill="currentColor"/><rect x="2" y="6.5" width="3" height="3" rx="0.75" fill="currentColor" opacity="0.7"/><rect x="6.5" y="6.5" width="3" height="3" rx="0.75" fill="currentColor" opacity="0.4"/><rect x="11" y="6.5" width="3" height="3" rx="0.75" fill="currentColor" opacity="0.85"/><rect x="2" y="11" width="3" height="3" rx="0.75" fill="currentColor"/><rect x="6.5" y="11" width="3" height="3" rx="0.75" fill="currentColor" opacity="0.5"/><rect x="11" y="11" width="3" height="3" rx="0.75" fill="currentColor" opacity="0.25"/></svg>`, 'streaks': `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9 2C9 2 10.5 4.5 9.5 6.5C11 5.5 11.5 3.5 11.5 3.5C12.5 5 13 7 12 9C11 11.5 8.5 13 6.5 13C4 13 2.5 11 2.5 9C2.5 6.5 4.5 5 4.5 5C4.5 7 6 7.5 6 7.5C5.5 5.5 7 2 9 2Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`, 'history-log': `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><polyline points="8,5 8,8.5 10.5,10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`, 'recap': `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L9.5 6h4L10 8.5l1.5 4.5L8 10.5 4.5 13 6 8.5 2.5 6h4z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`};
  Object.entries(drawerIconMap).forEach(([primary, svg])=>{
    const btn=document.querySelector(`.drawer-item[data-primary="${primary}"]`);
    if(!btn) return;
    const icon=btn.querySelector('.drawer-icon');
    if(icon) icon.innerHTML=svg;
  });

  // Replace hamburger menu with SVG
  const menuBtn=document.getElementById('menuBtn');
  if(menuBtn) menuBtn.innerHTML=`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="4.5" x2="16" y2="4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="2" y1="13.5" x2="16" y2="13.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;

  // Replace dark mode emoji with SVG
  const isDarkNow=document.documentElement.getAttribute('data-theme')==='dark';
  const darkIconEl=document.getElementById('darkIcon');
  if(darkIconEl) darkIconEl.innerHTML=isDarkNow?`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="1" x2="8" y2="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="8" y1="13" x2="8" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="1" y1="8" x2="3" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="13" y1="8" x2="15" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="3.05" y1="3.05" x2="4.46" y2="4.46" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="11.54" y1="11.54" x2="12.95" y2="12.95" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12.95" y1="3.05" x2="11.54" y2="4.46" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="4.46" y1="11.54" x2="3.05" y2="12.95" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`:`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  // Replace search emoji with clean SVG icon
  const searchBtn=document.querySelector('.menu-btn[title="Search (S)"]');
  if(searchBtn){
    searchBtn.innerHTML=`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7.5" cy="7.5" r="5" stroke="currentColor" stroke-width="1.7"/>
      <line x1="11.5" y1="11.5" x2="16" y2="16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
    </svg>`;
  }

  // Add app icon to drawer header + clicking goes home
  const drawerTitle=document.querySelector('.drawer-title');
  if(drawerTitle){
    drawerTitle.innerHTML=`<img src="icon-192.png" style="width:24px;height:24px;border-radius:6px;vertical-align:middle;margin-right:8px;"> Perks Ledger`;
    drawerTitle.style.cursor='pointer';
    drawerTitle.addEventListener('click',()=>{ closeDrawer(); setActiveView('all-cards'); });
  }
  // Restyle sign out button as a pill and add credit line below
  const signOutBtn=document.getElementById('signOutBtn');
  if(signOutBtn){
    signOutBtn.style.cssText='display:inline-flex;align-items:center;gap:6px;background:rgba(220,60,60,0.12);color:var(--red);border:1px solid rgba(220,60,60,0.25);border-radius:100px;padding:7px 16px;font-size:12px;font-family:var(--mono);cursor:pointer;width:auto';
    signOutBtn.innerHTML='<span style="font-size:13px">→</span> Sign Out';
  }
  // Move credit line to bottom of drawer, below sign out
  const drawerBottom=document.querySelector('#navExtras > div:last-child');
  if(drawerBottom){
    const credit=document.createElement('div');
    credit.textContent='jhuey · 2026 · v1.0';
    credit.style.cssText='font-size:10px;font-family:var(--mono);color:var(--text-tertiary);margin-top:10px;padding:0 12px;opacity:0.4;user-select:none';
    drawerBottom.appendChild(credit);
  }
})();

// ── Service Worker registration ───────────────────────────────────────────
if('serviceWorker' in navigator && location.hostname !== 'www.claudeusercontent.com'){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('sw.js', {scope: './'}).then(reg=>{
      console.log('SW registered:', reg.scope);
    }).catch(err=>{
      console.log('SW registration failed:', err);
    });
  });
}