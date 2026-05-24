import { CARDS } from './cards.js';
import { state, CY, CM } from './state.js';
import { isUsed, isGloballySnoozed } from './storage.js';
import { calcStats, getCardYearPeriods, isPCurrent, getFee, getStreak, getCurrentPK, isBExpired, isBNotAvailable } from './periods.js';
import { getVisibleCardKeys } from './views.js';

const BADGES_KEY = 'perks-badges';

export const BADGE_DEFS = [
  // ── Streaks ──────────────────────────────────────────────────────────
  { id:'streak_3',        tier:'bronze',    name:'On Fire',                  desc:'3-month streak on any monthly benefit' },
  { id:'streak_6',        tier:'silver',    name:'Blazing',                  desc:'6-month streak on any monthly benefit' },
  { id:'streak_12',       tier:'gold',      name:'Unstoppable',              desc:'12-month streak on any monthly benefit' },
  { id:'streak_18',       tier:'platinum',  name:'Iron Streak',              desc:'18-month streak on any monthly benefit' },
  { id:'streak_24',       tier:'legendary', name:'Diamond Streak',           desc:'24-month streak — relentless, month after month' },

  // ── Portfolio size ───────────────────────────────────────────────────
  { id:'collector',       tier:'bronze',    name:'Collector',                desc:'Tracking 3 or more cards' },
  { id:'portfolio_pro',   tier:'silver',    name:'Portfolio Pro',            desc:'Tracking 5 or more cards' },
  { id:'card_shark',      tier:'silver',    name:'Card Shark',               desc:'Tracking 7 or more cards' },
  { id:'whale',           tier:'gold',      name:'Whale',                    desc:'Tracking 10 or more cards' },

  // ── Value captured — single card ─────────────────────────────────────
  { id:'big_win',         tier:'silver',    name:'Big Win',                  desc:'$1,000+ captured on a single card' },
  { id:'high_roller',     tier:'gold',      name:'High Roller',              desc:'$1,500+ captured on a single card' },
  { id:'elite_earner',    tier:'platinum',  name:'Elite Earner',             desc:'$2,000+ captured on a single card' },

  // ── Value captured — total portfolio ────────────────────────────────
  { id:'getting_started', tier:'bronze',    name:'Getting Started',          desc:'$100+ total value captured' },
  { id:'gaining_ground',  tier:'bronze',    name:'Gaining Ground',           desc:'$500+ total value captured' },
  { id:'high_achiever',   tier:'silver',    name:'High Achiever',            desc:'$1,000+ total value captured' },
  { id:'power_user',      tier:'silver',    name:'Power User',               desc:'$2,500+ total value captured' },
  { id:'maximizer',       tier:'platinum',  name:'Maximizer',                desc:'$5,000+ total value captured' },
  { id:'true_maximizer',  tier:'legendary', name:'True Maximizer',           desc:'$10,000+ total value captured — a rare achievement' },

  // ── Fee mastery ──────────────────────────────────────────────────────
  { id:'first_profit',    tier:'gold',      name:'Fee Slayer',               desc:'Offset a card\'s full annual fee' },
  { id:'double_dipper',   tier:'silver',    name:'Double Dipper',            desc:'2 cards simultaneously in profit' },
  { id:'triple_threat',   tier:'gold',      name:'Triple Threat',            desc:'3+ cards simultaneously in profit' },
  { id:'fee_crusher',     tier:'platinum',  name:'Fee Crusher',              desc:'All your cards are simultaneously in profit' },

  // ── Card mastery ─────────────────────────────────────────────────────
  { id:'gold_master',     tier:'silver',    name:'Gold Mastery',             desc:'Amex Gold annual fee fully offset' },
  { id:'plat_master',     tier:'gold',      name:'Platinum Mastery',         desc:'Amex Platinum annual fee fully offset' },
  { id:'csr_master',      tier:'gold',      name:'Sapphire Master',          desc:'Chase Sapphire Reserve annual fee fully offset' },

  // ── Claim volume ─────────────────────────────────────────────────────
  { id:'benefit_ninja',   tier:'bronze',    name:'Benefit Ninja',            desc:'25+ total benefit claims across all cards' },
  { id:'benefit_machine', tier:'silver',    name:'Benefit Machine',          desc:'50+ total benefit claims across all cards' },
  { id:'century',         tier:'gold',      name:'Century',                  desc:'100+ total benefit claims — a true maximizer' },

  // ── Completionist ────────────────────────────────────────────────────
  { id:'grand_slam',      tier:'gold',      name:'Grand Slam',               desc:'Every current benefit claimed across all cards' },
  { id:'early_bird',      tier:'bronze',    name:'Early Bird',               desc:'All monthly benefits claimed before the 15th' },
  { id:'all_in',          tier:'gold',      name:'All In',                   desc:'100% of all benefits claimed on any single card' },
  { id:'perfectionist',   tier:'gold',      name:'Perfectionist',            desc:'100% claim rate achieved on 2+ cards' },
  { id:'all_in_2',        tier:'platinum',  name:'Completionist',            desc:'100% on every single tracked card — nothing left behind' },

  // ── Category specialists ─────────────────────────────────────────────
  { id:'uber_loyalist',   tier:'bronze',    name:'Uber Loyalist',            desc:'6-month Uber credit streak' },
  { id:'doordash_devotee',tier:'bronze',    name:'DoorDash Devotee',         desc:'6-month DoorDash credit streak' },
  { id:'dining_devotee',  tier:'silver',    name:'Dining Devotee',           desc:'6-month dining credit streak' },
  { id:'fitness_fan',     tier:'bronze',    name:'Fitness Fan',              desc:'Used a fitness credit (Peloton, Equinox, or Lululemon)' },
  { id:'clear_member',    tier:'bronze',    name:'CLEAR Member',             desc:'Used a CLEAR Plus credit' },
  { id:'global_traveler', tier:'bronze',    name:'Global Traveler',          desc:'Used a Global Entry / TSA PreCheck credit' },
  { id:'hotel_hopper',    tier:'silver',    name:'Hotel Hopper',             desc:'Hotel credits used on 2+ different cards' },
  { id:'lounge_lizard',   tier:'silver',    name:'Lounge Lizard',            desc:'United Club membership benefit claimed' },
  { id:'jet_setter',      tier:'silver',    name:'Jet Setter',               desc:'Travel or airline credits used on 2+ cards' },

  // ── Year-based ───────────────────────────────────────────────────────
  { id:'yr_2024',         tier:'bronze',    name:'Class of \'24',            desc:'Tracking benefits since 2024' },
  { id:'yr_2025',         tier:'silver',    name:'2025 Champion',            desc:'Active benefit tracker in 2025' },
  { id:'yr_2026',         tier:'bronze',    name:'2026 Active',              desc:'Tracking benefits in 2026' },
  { id:'multi_year',      tier:'gold',      name:'Multi-Year Veteran',       desc:'Active tracker in 3+ calendar years' },
  { id:'early_adopter',   tier:'silver',    name:'Early Adopter',            desc:'Using Perks Ledger since 2024 or earlier' },

  // ── Legendary ────────────────────────────────────────────────────────
  { id:'founder',         tier:'legendary', name:'Founder',                  desc:'Built this — no one else gets this badge', special:true },
  { id:'hacker',          tier:'legendary', name:'Credit Card Benefit Hacker', desc:'Mastered the art of extracting every dollar from every card', special:true },
  { id:'obsessive',       tier:'legendary', name:'Obsessive',                desc:'Tracks, optimizes, and agonizes over every single benefit', special:true },
];

export const TIER_COLORS = {
  bronze:   '#CD7F32',
  silver:   '#A0A8B0',
  gold:     '#C8922A',
  platinum: '#4A7FA5',
  legendary:'#9B59B6',
};

function loadState(){ try{ return JSON.parse(localStorage.getItem(BADGES_KEY)||'{"earned":[],"seen":[]}'); }catch(e){ return {earned:[],seen:[]}; } }
function saveState(s){ localStorage.setItem(BADGES_KEY,JSON.stringify(s)); }

export function getEarnedBadges(){ return loadState().earned; }
export function getUnseenBadges(){ const s=loadState(); const seen=new Set(s.seen); return s.earned.filter(id=>!seen.has(id)); }
export function markAllSeen(){ const s=loadState(); s.seen=[...s.earned]; saveState(s); }

export function awardBadges(ids){
  const s=loadState();
  const earned=new Set(s.earned);
  ids.forEach(id=>earned.add(id));
  s.earned=[...earned];
  saveState(s);
  return ids.filter(id=>!new Set(loadState().seen).has(id));
}

export function backfill2025Badges(){
  const FLAG='perks-badges-2025-backfill-v2';
  if(localStorage.getItem(FLAG)) return [];
  const earned=[
    'collector','portfolio_pro',
    'streak_3','streak_6','streak_12',
    'first_profit','big_win','high_achiever','getting_started','gaining_ground',
    'uber_loyalist','dining_devotee',
    'yr_2025','yr_2026','multi_year',
    'founder','hacker','obsessive',
  ];
  const newOnes=awardBadges(earned);
  localStorage.setItem(FLAG,'1');
  return newOnes;
}

// Check if a benefit ID was ever claimed on a given card (any period)
function everUsed(cardKey, benefitId){
  const d=state.DATA[cardKey]||{};
  return Object.entries(d).some(([k,v])=>k.startsWith(benefitId+'__')&&v===true);
}

export function checkBadges(){
  const s=loadState();
  const prev=new Set(s.earned);
  const cardKeys=getVisibleCardKeys();

  let anyProfit=false, profitCount=0, allProfit=cardKeys.length>0;
  let totalCaptured=0, maxSingleCard=0, maxStreak=0;
  let allCurrentClaimed=cardKeys.length>0, anyBigWin=false;
  const perCardFullYear=[];

  let uberMaxStreak=0, ddMaxStreak=0, diningMaxStreak=0;
  let fitnessUsed=false, clearUsed=false, geUsed=false, loungeUsed=false;
  let travelCardCount=0, hotelCardCount=0;
  let goldProfit=false, platProfit=false, csrProfit=false;

  // Count total benefit claims across all state.DATA
  let totalClaims=0;
  Object.values(state.DATA).forEach(d=>{
    Object.values(d).forEach(v=>{ if(v===true) totalClaims++; });
  });

  // Detect active years from all tracked data (true entries only)
  const activeYears=new Set();
  Object.values(state.DATA).forEach(d=>{
    Object.entries(d).forEach(([k,v])=>{
      if(!v) return;
      const pk=(k.split('__')[1])||'';
      const yr=parseInt(pk.substring(0,4));
      if(yr>=2020&&yr<=2030) activeYears.add(yr);
    });
  });

  const travelBenefitIds=['vx_travel','c_travel','p_airline','ah_airline','wfpa_airline','uq_miles'];
  const hotelBenefitIds=['g_hotel','p_hotel','vx_hotel','csp_hotel','ah_resort','amb_propcredit','amb_freenight'];

  cardKeys.forEach(ck=>{
    const fee=getFee(ck,CY);
    const {captured}=calcStats(ck,c=>getCardYearPeriods(ck,c),isPCurrent);
    totalCaptured+=captured;
    if(captured>=fee&&fee>0){
      anyProfit=true; profitCount++;
      if(ck==='gold') goldProfit=true;
      if(ck==='platinum') platProfit=true;
      if(ck==='csr') csrProfit=true;
    } else if(fee>0){
      allProfit=false;
    }
    if(captured>maxSingleCard) maxSingleCard=captured;
    if(captured>=1000) anyBigWin=true;

    // Grand slam: every current benefit claimed
    CARDS[ck].sections.forEach(sec=>{
      const pk=getCurrentPK(ck,sec.cadence);
      const p={calY:CY,calM:CM,m:CM};
      sec.benefits.forEach(b=>{
        if(isBExpired(b,p)||isBNotAvailable(b,CY,p)||isGloballySnoozed(ck,b.id)) return;
        if(!isUsed(ck,b.id,pk)) allCurrentClaimed=false;
      });
    });

    // All-in: 100% across all historical periods for this card
    let cardYearAll=true;
    CARDS[ck].sections.forEach(sec=>{
      getCardYearPeriods(ck,sec.cadence).forEach(p=>{
        if(p.calY>CY||(p.calY===CY&&p.calM>CM)) return;
        sec.benefits.forEach(b=>{
          if(isBExpired(b,p)||isBNotAvailable(b,CY,p)||isGloballySnoozed(ck,b.id)) return;
          if(!isUsed(ck,b.id,p.pk)) cardYearAll=false;
        });
      });
    });
    if(cardYearAll) perCardFullYear.push(ck);

    // Streaks — monthly benefits
    CARDS[ck].sections.forEach(sec=>{
      if(sec.cadence!=='monthly') return;
      sec.benefits.forEach(b=>{
        const st=getStreak(ck,b.id);
        if(st>maxStreak) maxStreak=st;
        if(['g_uber','p_uber'].includes(b.id)&&st>uberMaxStreak) uberMaxStreak=st;
        if(['c_dd_restaurant','c_dd_nonrest1','c_dd_nonrest2'].includes(b.id)&&st>ddMaxStreak) ddMaxStreak=st;
        if(['g_dining'].includes(b.id)&&st>diningMaxStreak) diningMaxStreak=st;
      });
    });

    // Category: fitness
    if(['c_peloton','p_lulu','p_equinox'].some(id=>everUsed(ck,id))) fitnessUsed=true;

    // Category: CLEAR
    if(['p_clear','ag_clear'].some(id=>everUsed(ck,id))) clearUsed=true;

    // Category: Global Entry (any benefit id ending in _ge)
    CARDS[ck].sections.forEach(sec=>{
      sec.benefits.forEach(b=>{
        if(b.id.endsWith('_ge')&&everUsed(ck,b.id)) geUsed=true;
      });
    });

    // Category: lounge
    if(everUsed(ck,'uc_club')) loungeUsed=true;

    // Category: travel cards
    if(travelBenefitIds.some(id=>everUsed(ck,id))) travelCardCount++;

    // Category: hotel cards
    if(hotelBenefitIds.some(id=>everUsed(ck,id))) hotelCardCount++;
  });

  const day=new Date().getDate();
  const earned=[...prev];
  function maybe(id,cond){ if(cond&&!prev.has(id)) earned.push(id); }

  // Streaks
  maybe('streak_3',          maxStreak>=3);
  maybe('streak_6',          maxStreak>=6);
  maybe('streak_12',         maxStreak>=12);
  maybe('streak_18',         maxStreak>=18);
  maybe('streak_24',         maxStreak>=24);

  // Portfolio size
  maybe('collector',         cardKeys.length>=3);
  maybe('portfolio_pro',     cardKeys.length>=5);
  maybe('card_shark',        cardKeys.length>=7);
  maybe('whale',             cardKeys.length>=10);

  // Single-card capture
  maybe('big_win',           anyBigWin);
  maybe('high_roller',       maxSingleCard>=1500);
  maybe('elite_earner',      maxSingleCard>=2000);

  // Portfolio capture
  maybe('getting_started',   totalCaptured>=100);
  maybe('gaining_ground',    totalCaptured>=500);
  maybe('high_achiever',     totalCaptured>=1000);
  maybe('power_user',        totalCaptured>=2500);
  maybe('maximizer',         totalCaptured>=5000);
  maybe('true_maximizer',    totalCaptured>=10000);

  // Fee mastery
  maybe('first_profit',      anyProfit);
  maybe('double_dipper',     profitCount>=2);
  maybe('triple_threat',     profitCount>=3);
  maybe('fee_crusher',       allProfit&&cardKeys.length>=2);

  // Card mastery
  maybe('gold_master',       goldProfit);
  maybe('plat_master',       platProfit);
  maybe('csr_master',        csrProfit);

  // Claim volume
  maybe('benefit_ninja',     totalClaims>=25);
  maybe('benefit_machine',   totalClaims>=50);
  maybe('century',           totalClaims>=100);

  // Completionist
  maybe('grand_slam',        allCurrentClaimed&&cardKeys.length>0);
  maybe('early_bird',        allCurrentClaimed&&day<15&&cardKeys.length>0);
  maybe('all_in',            perCardFullYear.length>0);
  maybe('perfectionist',     perCardFullYear.length>=2);
  maybe('all_in_2',          perCardFullYear.length>=cardKeys.length&&cardKeys.length>=2);

  // Category specialists
  maybe('uber_loyalist',     uberMaxStreak>=6);
  maybe('doordash_devotee',  ddMaxStreak>=6);
  maybe('dining_devotee',    diningMaxStreak>=6);
  maybe('fitness_fan',       fitnessUsed);
  maybe('clear_member',      clearUsed);
  maybe('global_traveler',   geUsed);
  maybe('hotel_hopper',      hotelCardCount>=2);
  maybe('lounge_lizard',     loungeUsed);
  maybe('jet_setter',        travelCardCount>=2);

  // Year-based
  maybe('yr_2024',           activeYears.has(2024));
  maybe('yr_2025',           activeYears.has(2025));
  maybe('yr_2026',           activeYears.has(2026));
  maybe('multi_year',        activeYears.size>=3);
  maybe('early_adopter',     activeYears.has(2024)||activeYears.has(2023));

  s.earned=earned;
  saveState(s);
  return earned.filter(id=>!prev.has(id));
}
