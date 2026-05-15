import { CARDS, FEE_MONTHS } from './cards.js';
import { state, STORAGE_KEY, sb, freshDATA, CY } from './state.js';

// ── Data helpers ──────────────────────────────────────────────────────────
export function bKey(id,pk){ return `${id}__${pk}`; }
export function isUsed(card,id,pk){ return !!(state.DATA[card]||{})[bKey(id,pk)]; }
export function toggle(card,id,pk){
  if(!state.DATA[card]) state.DATA[card]={};
  const k=bKey(id,pk);
  state.DATA[card][k]=!state.DATA[card][k];
  const action=state.DATA[card][k]?'used':'unused';
  scheduleSave();
  document.dispatchEvent(new CustomEvent('perks:benefit-toggled',{detail:{cardKey:card,id,pk,action}}));
  if(sb&&state.currentUser){
    sb.from('benefit_log').insert({user_id:state.currentUser.id,card_key:card,benefit_id:id,period_key:pk,action}).then(({error:e})=>{if(e)console.error('[benefit_log]',e.message,e.code,e.details,e.hint);}).catch(e=>console.error('[benefit_log throw]',e));
  }
}

// ── Supabase sync ─────────────────────────────────────────────────────────
export async function syncFromSupabase(){
  if(!state.currentUser||state.currentUser.id==='demo') return;
  try{
    const {data,error}=await sb.from('tracker_data').select('data,updated_at').eq('user_id',state.currentUser.id).single();
    if(!error&&data&&data.data){
      const localTs=localStorage.getItem(STORAGE_KEY+'-ts-'+state.currentUser.id);
      if(localTs&&data.updated_at&&new Date(data.updated_at)<=new Date(localTs)) return;
      const raw=data.data;
      const remoteExtras={_customAmounts:raw._customAmounts||{},_partial:raw._partial||{},_notes:raw._notes||{},_credited:raw._credited||{},_skipped:raw._skipped||{},_feeOverrides:raw._feeOverrides||{},_snoozed:raw._snoozed||{}};
      const benefitData={...raw};
      delete benefitData._customAmounts; delete benefitData._partial; delete benefitData._notes; delete benefitData._credited; delete benefitData._skipped; delete benefitData._feeOverrides;
      const localExtras={_customAmounts:loadCustomAmounts(),_partial:loadPartial(),_notes:loadNotes(),_credited:loadCredited(),_skipped:loadSkipped(),_feeOverrides:getFeeOverrides(),_snoozed:loadSnoozed()};
      const changed=JSON.stringify(benefitData)!==JSON.stringify(state.DATA)||JSON.stringify(remoteExtras)!==JSON.stringify(localExtras);
      if(changed){
        state.DATA=Object.assign(freshDATA(),benefitData);
        localStorage.setItem(STORAGE_KEY+'-'+state.currentUser.id,JSON.stringify(state.DATA));
        localStorage.setItem(STORAGE_KEY+'-ts-'+state.currentUser.id,data.updated_at);
        saveCustomAmounts(remoteExtras._customAmounts);
        savePartial(remoteExtras._partial);
        saveNotes(remoteExtras._notes);
        saveCredited(remoteExtras._credited);
        saveSkipped(remoteExtras._skipped);
        if(Object.keys(remoteExtras._feeOverrides).length) saveFeeOverridesData(remoteExtras._feeOverrides);
        if(Object.keys(remoteExtras._snoozed).length) saveSnoozed(remoteExtras._snoozed);
        document.dispatchEvent(new CustomEvent('perks:rerender'));
      }
    }
  }catch(e){}
}

export async function saveToStorage(){
  if(!state.currentUser) return;
  if(state.currentUser.id==='demo'){ setSave('saved','✓ saved locally'); setTimeout(()=>setSave('',''),2000); return; }
  setSave('saving','saving…');
  const ts=new Date().toISOString();
  try{
    localStorage.setItem(STORAGE_KEY+'-'+state.currentUser.id,JSON.stringify(state.DATA));
    localStorage.setItem(STORAGE_KEY+'-ts-'+state.currentUser.id,ts);
  }catch(e){}
  try{
    const payload={...state.DATA,_customAmounts:loadCustomAmounts(),_partial:loadPartial(),_notes:loadNotes(),_credited:loadCredited(),_skipped:loadSkipped(),_feeOverrides:getFeeOverrides(),_snoozed:loadSnoozed()};
    const {data:updated,error:upErr}=await sb.from('tracker_data').update({data:payload,updated_at:ts}).eq('user_id',state.currentUser.id).select('user_id');
    if(upErr) throw upErr;
    if(!updated||updated.length===0){
      const {error:insErr}=await sb.from('tracker_data').insert({user_id:state.currentUser.id,data:payload,updated_at:ts});
      if(insErr) throw insErr;
    }
    setSave('saved','✓ saved');
    setTimeout(()=>setSave('',''),2000);
  }catch(e){
    console.error('[tracker_data save error]',e?.message,e?.code,e?.details,e?.hint);
    setSave('error','⚠ cloud sync failed — saved locally');
    setTimeout(()=>setSave('',''),3000);
  }
}
export function scheduleSave(){ clearTimeout(state.saveTimer); state.saveTimer=setTimeout(saveToStorage,600); }
export function setSave(cls,msg){ const el=document.getElementById('saveStatus'); if(el){el.className='save-status'+(cls?' '+cls:''); el.textContent=msg;} }

// ── Custom amounts ─────────────────────────────────────────────────────────
const CUSTOM_AMOUNTS_KEY='perks-custom-amounts';
export function loadCustomAmounts(){ try{ return JSON.parse(localStorage.getItem(CUSTOM_AMOUNTS_KEY)||'{}'); }catch(e){ return {}; } }
export function saveCustomAmounts(d){ localStorage.setItem(CUSTOM_AMOUNTS_KEY,JSON.stringify(d)); }
export function getEffectiveAmount(cardKey,benefitId,baseAmount){
  const custom=loadCustomAmounts();
  return custom[`${cardKey}__${benefitId}`]||baseAmount;
}
export function setCustomAmount(cardKey,benefitId,amount){
  const d=loadCustomAmounts();
  if(amount===null) delete d[`${cardKey}__${benefitId}`];
  else d[`${cardKey}__${benefitId}`]=amount;
  saveCustomAmounts(d);
}

// ── Partial use ────────────────────────────────────────────────────────────
const PARTIAL_KEY='perks-partial';
export function loadPartial(){ try{ return JSON.parse(localStorage.getItem(PARTIAL_KEY)||'{}'); }catch(e){ return {}; } }
export function savePartial(d){ localStorage.setItem(PARTIAL_KEY,JSON.stringify(d)); }
export function getPartialKey(cardKey,benefitId,pk){ return `${cardKey}__${benefitId}__${pk}`; }
export function getPartialUsed(cardKey,benefitId,pk){ return loadPartial()[getPartialKey(cardKey,benefitId,pk)]||0; }
export function setPartialUsed(cardKey,benefitId,pk,amount){
  const d=loadPartial();
  d[getPartialKey(cardKey,benefitId,pk)]=amount;
  savePartial(d);
  const card=CARDS[cardKey];
  let totalAmt=0;
  card.sections.forEach(s=>s.benefits.forEach(b=>{ if(b.id===benefitId) totalAmt=b.amount; }));
  if(!state.DATA[cardKey]) state.DATA[cardKey]={};
  state.DATA[cardKey][bKey(benefitId,pk)]=amount>=totalAmt;
  scheduleSave();
}

// ── Notes ──────────────────────────────────────────────────────────────────
const NOTES_KEY='perks-notes';
export function loadNotes(){ try{ return JSON.parse(localStorage.getItem(NOTES_KEY)||'{}'); }catch(e){ return {}; } }
export function saveNotes(notes){ try{ localStorage.setItem(NOTES_KEY,JSON.stringify(notes)); }catch(e){} }
export function getNoteKey(cardKey,benefitId,pk){ return `${cardKey}__${benefitId}__${pk}`; }
export function getNote(cardKey,benefitId,pk){ return loadNotes()[getNoteKey(cardKey,benefitId,pk)]||''; }

// ── Credited ───────────────────────────────────────────────────────────────
const CREDITED_KEY='perks-credited';
export function loadCredited(){ try{ return JSON.parse(localStorage.getItem(CREDITED_KEY)||'{}'); }catch(e){ return {}; } }
export function saveCredited(d){ localStorage.setItem(CREDITED_KEY,JSON.stringify(d)); }
export function isCredited(cardKey,id,pk){ return !!(loadCredited()[`${cardKey}__${id}__${pk}`]); }
export function toggleCredited(cardKey,id,pk){
  const d=loadCredited();
  const k=`${cardKey}__${id}__${pk}`;
  d[k]=!d[k];
  saveCredited(d);
}

// ── Skipped ────────────────────────────────────────────────────────────────
const SKIPPED_KEY='perks-skipped';
export function loadSkipped(){ try{ return JSON.parse(localStorage.getItem(SKIPPED_KEY)||'{}'); }catch(e){ return {}; } }
export function saveSkipped(d){ localStorage.setItem(SKIPPED_KEY,JSON.stringify(d)); }
export function isSkipped(cardKey,id,pk){ return !!(loadSkipped()[`${cardKey}__${id}__${pk}`]); }
export function skipBenefit(cardKey,id,pk){
  const d=loadSkipped();
  d[`${cardKey}__${id}__${pk}`]=true;
  saveSkipped(d);
  scheduleSave();
  document.dispatchEvent(new CustomEvent('perks:rerender'));
}

// ── Benefit snooze ────────────────────────────────────────────────────────
// Stores { 'cardKey__benefitId': 'YYYY-MM' } — exclude from calcs until that month (inclusive)
const SNOOZED_KEY='perks-snoozed';
export function loadSnoozed(){ try{ return JSON.parse(localStorage.getItem(SNOOZED_KEY)||'{}'); }catch(e){ return {}; } }
export function saveSnoozed(d){ localStorage.setItem(SNOOZED_KEY,JSON.stringify(d)); }
export function getSnoozedUntil(cardKey,benefitId){ return loadSnoozed()[`${cardKey}__${benefitId}`]||null; }
export function isGloballySnoozed(cardKey,benefitId){
  const until=getSnoozedUntil(cardKey,benefitId);
  if(!until) return false;
  // Import CY/CM at call time via closure won't work in module scope; compare via date string
  const now=new Date();
  const [uy,um]=until.split('-').map(Number);
  // snoozed while current year-month <= until year-month
  return now.getFullYear()<uy||(now.getFullYear()===uy&&now.getMonth()+1<=um);
}
export function setSnoozedBenefit(cardKey,benefitId,untilYYYYMM){
  const d=loadSnoozed();
  const k=`${cardKey}__${benefitId}`;
  if(untilYYYYMM===null) delete d[k]; else d[k]=untilYYYYMM;
  saveSnoozed(d);
  scheduleSave();
}

// ── Fee date overrides ─────────────────────────────────────────────────────
export function getFeeOverrides(){ if(!state._feeOverrides) state._feeOverrides=JSON.parse(localStorage.getItem('perks-fee-overrides')||'{}'); return state._feeOverrides; }
export function saveFeeOverridesData(d){ state._feeOverrides=d; localStorage.setItem('perks-fee-overrides',JSON.stringify(d)); }
export function getCardFeeMonth(cardKey){ return getFeeOverrides()[cardKey]?.feeMonth??FEE_MONTHS[cardKey]??0; }
export function getCardFeeDay(cardKey){ return getFeeOverrides()[cardKey]?.feeDay??CARDS[cardKey]?.feeDay??1; }
