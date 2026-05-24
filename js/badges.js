import { CARDS } from './cards.js';
import { state, CY, CM } from './state.js';
import { isUsed, isGloballySnoozed } from './storage.js';
import { calcStats, getCardYearPeriods, isPCurrent, getFee, getStreak, getCurrentPK, isBExpired, isBNotAvailable } from './periods.js';
import { getVisibleCardKeys } from './views.js';

const BADGES_KEY = 'perks-badges';

export const BADGE_DEFS = [
  { id:'first_profit',   tier:'gold',     name:'Fee Slayer',      desc:'Offset a card\'s full annual fee' },
  { id:'fee_crusher',    tier:'platinum', name:'Fee Crusher',     desc:'All your cards are simultaneously in profit' },
  { id:'grand_slam',     tier:'gold',     name:'Grand Slam',      desc:'Every current benefit claimed across all cards' },
  { id:'early_bird',     tier:'bronze',   name:'Early Bird',      desc:'All monthly benefits claimed before the 15th' },
  { id:'streak_3',       tier:'bronze',   name:'On Fire',         desc:'3-month streak on any monthly benefit' },
  { id:'streak_6',       tier:'silver',   name:'Blazing',         desc:'6-month streak on any monthly benefit' },
  { id:'streak_12',      tier:'gold',     name:'Unstoppable',     desc:'12-month streak on any monthly benefit' },
  { id:'collector',      tier:'bronze',   name:'Collector',       desc:'Tracking 3 or more cards' },
  { id:'portfolio_pro',  tier:'silver',   name:'Portfolio Pro',   desc:'Tracking 5 or more cards' },
  { id:'big_win',        tier:'silver',   name:'Big Win',         desc:'$1,000+ captured on a single card' },
  { id:'maximizer',      tier:'platinum', name:'Maximizer',       desc:'$5,000+ total value captured across all cards' },
  { id:'all_in',         tier:'gold',     name:'All In',          desc:'100% of all benefits claimed on any single card this card year' },
];

export const TIER_COLORS = {
  bronze:   '#CD7F32',
  silver:   '#A0A8B0',
  gold:     '#C8922A',
  platinum: '#4A7FA5',
};

function loadState(){ try{ return JSON.parse(localStorage.getItem(BADGES_KEY)||'{"earned":[],"seen":[]}'); }catch(e){ return {earned:[],seen:[]}; } }
function saveState(s){ localStorage.setItem(BADGES_KEY,JSON.stringify(s)); }

export function getEarnedBadges(){ return loadState().earned; }
export function getUnseenBadges(){ const s=loadState(); const seen=new Set(s.seen); return s.earned.filter(id=>!seen.has(id)); }
export function markAllSeen(){ const s=loadState(); s.seen=[...s.earned]; saveState(s); }

export function checkBadges(){
  const s=loadState();
  const prev=new Set(s.earned);
  const cardKeys=getVisibleCardKeys();

  let anyProfit=false, allProfit=cardKeys.length>0, totalCaptured=0, maxStreak=0;
  let allCurrentClaimed=cardKeys.length>0, anyBigWin=false;
  const perCardFullYear=[];

  cardKeys.forEach(ck=>{
    const fee=getFee(ck,CY);
    const {captured}=calcStats(ck,c=>getCardYearPeriods(ck,c),isPCurrent);
    totalCaptured+=captured;
    if(captured>=fee&&fee>0) anyProfit=true; else allProfit=false;
    if(captured>=1000) anyBigWin=true;

    // grand slam: any current benefit unclaimed → false
    CARDS[ck].sections.forEach(sec=>{
      const pk=getCurrentPK(ck,sec.cadence);
      const p={calY:CY,calM:CM,m:CM};
      sec.benefits.forEach(b=>{
        if(isBExpired(b,p)||isBNotAvailable(b,CY,p)||isGloballySnoozed(ck,b.id)) return;
        if(!isUsed(ck,b.id,pk)) allCurrentClaimed=false;
      });
    });

    // all_in: full card year 100%
    let cardYearAll=true;
    CARDS[ck].sections.forEach(sec=>{
      getCardYearPeriods(ck,sec.cadence).forEach(p=>{
        if(p.calY>CY||(p.calY===CY&&p.calM>CM)) return; // skip future
        sec.benefits.forEach(b=>{
          if(isBExpired(b,p)||isBNotAvailable(b,CY,p)||isGloballySnoozed(ck,b.id)) return;
          if(!isUsed(ck,b.id,p.pk)) cardYearAll=false;
        });
      });
    });
    if(cardYearAll) perCardFullYear.push(ck);

    // streaks
    CARDS[ck].sections.forEach(sec=>{
      if(sec.cadence!=='monthly') return;
      sec.benefits.forEach(b=>{ const st=getStreak(ck,b.id); if(st>maxStreak) maxStreak=st; });
    });
  });

  const day=new Date().getDate();
  const earned=[...prev];
  function maybe(id,cond){ if(cond&&!prev.has(id)) earned.push(id); }

  maybe('first_profit',   anyProfit);
  maybe('fee_crusher',    allProfit&&cardKeys.length>=2);
  maybe('grand_slam',     allCurrentClaimed&&cardKeys.length>0);
  maybe('early_bird',     allCurrentClaimed&&day<15&&cardKeys.length>0);
  maybe('streak_3',       maxStreak>=3);
  maybe('streak_6',       maxStreak>=6);
  maybe('streak_12',      maxStreak>=12);
  maybe('collector',      cardKeys.length>=3);
  maybe('portfolio_pro',  cardKeys.length>=5);
  maybe('big_win',        anyBigWin);
  maybe('maximizer',      totalCaptured>=5000);
  maybe('all_in',         perCardFullYear.length>0);

  s.earned=earned;
  saveState(s);
  return earned.filter(id=>!prev.has(id)); // newly earned this check
}
