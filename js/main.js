import { CARDS, CARD_LABELS, PREMIUM_CARD_CATALOG } from './cards.js';
import { state, CY, CM, MONTHS, MONTHS_FULL, sb, freshDATA, STORAGE_KEY } from './state.js';
import {
  toggle, scheduleSave, setSave, syncFromSupabase,
  loadCustomAmounts, saveCustomAmounts, setCustomAmount,
  loadPartial, savePartial, setPartialUsed,
  loadNotes, saveNotes, getNoteKey,
  loadCredited, saveCredited, toggleCredited,
  loadSkipped, saveSkipped, isSkipped, skipBenefit,
  getFeeOverrides, saveFeeOverridesData, getCardFeeMonth, getCardFeeDay
} from './storage.js';
import { render, getVisibleCardKeys, renderCurrent, renderInsights, renderPriorityQueue, renderRecap, haptic, checkAllClaimed, animateCounters } from './views.js';

// ── Dark mode IIFE ────────────────────────────────────────────────────────
(function(){
  const saved=localStorage.getItem('perks-theme');
  const prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme=saved||(prefersDark?'dark':'light');
  if(theme==='dark'){
    document.documentElement.setAttribute('data-theme','dark');
    const el=document.getElementById('darkIcon');
    if(el) el.innerHTML=`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="1" x2="8" y2="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="8" y1="13" x2="8" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="1" y1="8" x2="3" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="13" y1="8" x2="15" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="3.05" y1="3.05" x2="4.46" y2="4.46" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="11.54" y1="11.54" x2="12.95" y2="12.95" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12.95" y1="3.05" x2="11.54" y2="4.46" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="4.46" y1="11.54" x2="3.05" y2="12.95" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    const lbl=document.getElementById('darkLabel');
    if(lbl) lbl.textContent='Light';
  }
})();

// ── Splash: show login only if no cached session ──────────────────────────
try {
  const hasSession=Object.keys(localStorage).some(k=>k.startsWith('sb-')&&k.endsWith('-auth-token'));
  if(!hasSession) document.getElementById('splash').classList.remove('hidden');
} catch(e) { document.getElementById('splash').classList.remove('hidden'); }

// ── Auth ──────────────────────────────────────────────────────────────────
function switchAuthTab(tab){
  state._authTab=tab;
  document.getElementById('tabLogin').classList.toggle('active',tab==='login');
  document.getElementById('tabSignup').classList.toggle('active',tab==='signup');
  document.getElementById('signupExtras').style.display=tab==='signup'?'':'none';
  document.getElementById('authBtn').textContent=tab==='login'?'Sign In':'Create Account';
  document.getElementById('authSub').textContent=tab==='login'?'Sign in to track your credit card perks':'Create a free account to get started';
  document.getElementById('authError').textContent='';
  document.getElementById('authHelper').textContent='';
  document.getElementById('forgotBtn').style.display=tab==='login'?'':'none';
}

async function handleForgotPassword(){
  const email=document.getElementById('authEmail').value.trim();
  const errEl=document.getElementById('authError');
  const helper=document.getElementById('authHelper');
  errEl.textContent=''; helper.textContent='';
  if(!email){ errEl.textContent='Enter your email address above first.'; document.getElementById('authEmail').focus(); return; }
  document.getElementById('forgotBtn').textContent='Sending…';
  document.getElementById('forgotBtn').disabled=true;
  const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:window.location.href});
  document.getElementById('forgotBtn').textContent='Forgot password?';
  document.getElementById('forgotBtn').disabled=false;
  if(error){ errEl.textContent=error.message; }
  else { helper.textContent=`✓ Reset link sent to ${email} — check your inbox.`; helper.style.color='var(--green)'; }
}

async function handleAuth(){
  const email=document.getElementById('authEmail').value.trim();
  const password=document.getElementById('authPassword').value;
  const errEl=document.getElementById('authError');
  errEl.textContent='';
  if(!email||!password){ errEl.textContent='Please enter email and password.'; return; }

  if(email==='test'&&password==='test'){
    state._sessionHandled=true;
    state.currentUser={id:'demo',email:'test'};
    document.getElementById('drawerUserEmail').textContent='Demo mode';
    state.userCards=['csr'];
    state.DATA={csr:{}};
    document.getElementById('splash').classList.add('hidden');
    document.getElementById('cardPickerOverlay').classList.add('hidden');
    applyUserCards();
    render();
    setTimeout(initCardFlip,200);
    return;
  }

  const btn=document.getElementById('authBtn');
  btn.textContent='…'; btn.disabled=true; errEl.textContent='';

  try {
    if(state._authTab==='login'){
      errEl.style.color='var(--text-tertiary)'; errEl.textContent='Signing in…';
      const {data,error}=await sb.auth.signInWithPassword({email,password});
      errEl.textContent=''; errEl.style.color='var(--red)';
      if(error) throw error;
      state._sessionHandled=true;
      await onSignedIn(data.user,false);
    } else {
      const confirm=document.getElementById('authConfirm').value;
      if(password!==confirm) throw new Error('Passwords do not match.');
      if(password.length<6) throw new Error('Password must be at least 6 characters.');
      errEl.style.color='var(--text-tertiary)'; errEl.textContent='Creating account…';
      const {data,error}=await sb.auth.signUp({email,password});
      errEl.textContent=''; errEl.style.color='var(--red)';
      if(error) throw error;
      if(data.user&&data.user.identities&&data.user.identities.length===0)
        throw new Error('An account with this email already exists. Please sign in.');
      state._sessionHandled=true;
      await onSignedIn(data.user,true);
    }
  } catch(e) {
    state._sessionHandled=false;
    errEl.style.color='var(--red)';
    errEl.textContent=e.message||'Authentication failed.';
    btn.textContent=state._authTab==='login'?'Sign In':'Create Account';
    btn.disabled=false;
  }
}

async function onSignedIn(user,isNew){
  state.currentUser=user;
  document.getElementById('drawerUserEmail').textContent=user.email;
  const {data:profile}=await sb.from('user_profiles').select('cards').eq('user_id',user.id).single();
  if(isNew||!profile||!profile.cards||profile.cards.length===0){
    document.getElementById('splash').classList.add('hidden');
    showCardPicker();
  } else {
    state.userCards=profile.cards;
    doUnlock();
  }
}

async function signOut(){
  await sb.auth.signOut();
  state._sessionHandled=false; state.currentUser=null; state.userCards=null;
  state.DATA=freshDATA();
  document.getElementById('splash').classList.remove('hidden');
  document.getElementById('authEmail').value='';
  document.getElementById('authPassword').value='';
  document.getElementById('authConfirm').value='';
  document.getElementById('authError').textContent='';
  document.getElementById('authBtn').textContent='Sign In';
  document.getElementById('authBtn').disabled=false;
  switchAuthTab('login');
}

function doUnlock(){
  document.getElementById('splash').classList.add('hidden');
  document.getElementById('cardPickerOverlay').classList.add('hidden');
  try{
    const key=STORAGE_KEY+(state.currentUser?'-'+state.currentUser.id:'');
    const val=localStorage.getItem(key);
    if(val) state.DATA=Object.assign(freshDATA(),JSON.parse(val));
  }catch(e){}
  applyUserCards();
  render();
  setTimeout(initCardFlip,200);
  syncFromSupabase();
}

// ── Session restore ───────────────────────────────────────────────────────
sb.auth.onAuthStateChange(async(event,session)=>{
  if(event==='INITIAL_SESSION'){
    if(session&&session.user&&!state._sessionHandled){
      state._sessionHandled=true;
      await onSignedIn(session.user,false);
    } else if(!session){
      document.getElementById('splash').classList.remove('hidden');
      setTimeout(()=>document.getElementById('authEmail').focus(),100);
    }
  }
});

// ── Card picker ───────────────────────────────────────────────────────────
function renderCPGrid(containerId,searchId,selectedSet){
  const search=(document.getElementById(searchId)?.value||'').toLowerCase();
  const grid=document.getElementById(containerId);
  const issuers={};
  PREMIUM_CARD_CATALOG.forEach(c=>{
    if(!c.fee) return;
    const name=c.name.toLowerCase(),issuer=c.issuer.toLowerCase();
    if(search&&!name.includes(search)&&!issuer.includes(search)) return;
    if(!issuers[c.issuer]) issuers[c.issuer]=[];
    issuers[c.issuer].push(c);
  });
  if(search){
    PREMIUM_CARD_CATALOG.forEach(c=>{
      if(c.fee) return;
      const name=c.name.toLowerCase(),issuer=c.issuer.toLowerCase();
      if(name.includes(search)||issuer.includes(search)){
        if(!issuers[c.issuer]) issuers[c.issuer]=[];
        if(!issuers[c.issuer].find(x=>x.id===c.id)) issuers[c.issuer].push(c);
      }
    });
  }
  let html='';
  Object.entries(issuers).forEach(([issuer,cards])=>{
    html+=`<div class="cp-issuer-header">${issuer}</div>`;
    cards.forEach(c=>{
      const sel=selectedSet.has(c.id);
      const feeLabel=c.fee?`$${c.fee}/yr`:'No annual fee';
      const supportedBadge=c.supported?'':`<span style="font-size:9px;background:var(--border-light);color:var(--text-tertiary);padding:1px 5px;border-radius:4px;margin-left:4px">catalog</span>`;
      html+=`<div class="cp-card-item${sel?' selected':''}" onclick="toggleCPCard('${c.id}','${containerId}','${searchId}',this)">
        <div class="cp-check"></div>
        <div><div class="cp-card-name">${c.name}${supportedBadge}</div><div class="cp-card-fee">${feeLabel}</div></div>
      </div>`;
    });
  });
  if(!html) html=`<div style="color:var(--text-tertiary);font-size:13px;padding:12px;grid-column:1/-1">No cards match "${search}"</div>`;
  grid.innerHTML=html;
}

function toggleCPCard(id,gridId,searchId){
  const isCP=gridId==='cpGrid';
  const set=isCP?state._cpSelected:state._mcSelected;
  if(set.has(id)) set.delete(id); else set.add(id);
  renderCPGrid(gridId,searchId,set);
  if(isCP){
    document.getElementById('cpCount').textContent=`${state._cpSelected.size} card${state._cpSelected.size!==1?'s':''} selected`;
    document.getElementById('cpConfirm').disabled=state._cpSelected.size===0;
  } else {
    document.getElementById('mcCount').textContent=`${state._mcSelected.size} card${state._mcSelected.size!==1?'s':''} selected`;
  }
}

function filterCPCards(){ renderCPGrid('cpGrid','cpSearch',state._cpSelected); }
function filterMCCards(){ renderCPGrid('mcGrid','mcSearch',state._mcSelected); }

function showCardPicker(){
  state._cpSelected=new Set(['platinum','gold','csr']);
  document.getElementById('cardPickerOverlay').classList.remove('hidden');
  document.getElementById('cpCount').textContent=`${state._cpSelected.size} cards selected`;
  document.getElementById('cpConfirm').disabled=false;
  renderCPGrid('cpGrid','cpSearch',state._cpSelected);
}

async function confirmCardPick(){
  const cards=[...state._cpSelected];
  if(cards.length===0) return;
  document.getElementById('cpConfirm').textContent='Saving…';
  document.getElementById('cpConfirm').disabled=true;
  await sb.from('user_profiles').upsert({user_id:state.currentUser.id,cards,updated_at:new Date().toISOString()},{onConflict:'user_id'});
  state.userCards=cards;
  document.getElementById('cardPickerOverlay').classList.add('hidden');
  doUnlock();
}

// ── My Cards modal ────────────────────────────────────────────────────────
function openMyCards(){
  state._mcSelected=new Set(state.userCards||['csr','gold','platinum']);
  document.getElementById('mcCount').textContent=`${state._mcSelected.size} cards selected`;
  renderCPGrid('mcGrid','mcSearch',state._mcSelected);
  document.getElementById('myCardsModal').classList.remove('hidden');
}
function closeMyCards(){ document.getElementById('myCardsModal').classList.add('hidden'); }

async function saveMyCards(){
  const cards=[...state._mcSelected];
  if(cards.length===0){ alert('Please select at least one card.'); return; }
  document.getElementById('mcSave').textContent='Saving…';
  await sb.from('user_profiles').upsert({user_id:state.currentUser.id,cards,updated_at:new Date().toISOString()},{onConflict:'user_id'});
  state.userCards=cards;
  applyUserCards();
  if(!state.userCards.includes(state.activeCard)) state.activeCard=getVisibleCardKeys()[0]||'csr';
  render();
  closeMyCards();
  setSave('saved','✓ Cards updated');
  setTimeout(()=>setSave('',''),2000);
}

// ── Card selector ─────────────────────────────────────────────────────────
function sizeCardSelector(){
  const selector=document.getElementById('cardSelector');
  if(!selector) return;
  const visible=[...selector.querySelectorAll('.card-btn[data-card]')].filter(b=>b.style.display!=='none');
  const count=visible.length;
  if(!count) return;
  const innerW=selector.clientWidth-8;
  const gapTotal=(count-1)*10;
  const w=Math.floor(Math.min(160,Math.max(110,(innerW-gapTotal)/count)));
  visible.forEach(b=>{ b.style.flex=`0 0 ${w}px`; });
}

function applyUserCards(){
  document.querySelectorAll('.card-btn[data-card]').forEach(btn=>{
    const card=btn.dataset.card;
    btn.style.display=(state.userCards&&state.userCards.includes(card))?'':'none';
  });
  sizeCardSelector();
  const firstCard=(state.userCards||['csr']).find(c=>CARDS[c])||'csr';
  state.activeCard=firstCard;
  document.querySelectorAll('.card-btn').forEach(b=>b.className='card-btn');
  const activeBtn=document.querySelector(`.card-btn[data-card="${state.activeCard}"]`);
  if(activeBtn) activeBtn.classList.add(`active-${state.activeCard}`);
}

function initCardSelector(){
  const selector=document.getElementById('cardSelector');
  const btns=()=>[...selector.querySelectorAll('.card-btn')];
  let dragSrc=null;

  btns().forEach(btn=>{
    btn.setAttribute('draggable','true');
    let lastTap=0;
    btn.addEventListener('click',e=>{
      if(btn.classList.contains('dragging')) return;
      const now=Date.now();
      if(now-lastTap<300){ openCardSheet(btn.dataset.card); lastTap=0; return; }
      lastTap=now;
      btns().forEach(b=>b.className='card-btn');
      const c=btn.dataset.card;
      btn.classList.add(`active-${c}`);
      state.activeCard=c;
      setActiveView('this-period');
      setTimeout(initCardFlip,50);
    });
    btn.addEventListener('dragstart',e=>{ dragSrc=btn; btn.classList.add('dragging'); e.dataTransfer.effectAllowed='move'; });
    btn.addEventListener('dragend',()=>{ btn.classList.remove('dragging'); btns().forEach(b=>b.classList.remove('drag-over')); dragSrc=null; });
    btn.addEventListener('dragover',e=>{ e.preventDefault(); e.dataTransfer.dropEffect='move'; if(btn!==dragSrc){ btns().forEach(b=>b.classList.remove('drag-over')); btn.classList.add('drag-over'); } });
    btn.addEventListener('dragleave',()=>btn.classList.remove('drag-over'));
    btn.addEventListener('drop',e=>{
      e.preventDefault(); btn.classList.remove('drag-over');
      if(dragSrc&&dragSrc!==btn){
        const all=btns(),si=all.indexOf(dragSrc),ti=all.indexOf(btn);
        if(si<ti) selector.insertBefore(dragSrc,btn.nextSibling);
        else selector.insertBefore(dragSrc,btn);
      }
    });
  });
}

// ── Card info sheet ───────────────────────────────────────────────────────
function openCardSheet(cardKey){
  const card=CARDS[cardKey];
  const {captured}=(() => {
    const {calcStats,getCardYearPeriods,isPCurrent}=window._periodsModule||{};
    if(!calcStats) return {captured:0};
    return calcStats(cardKey,c=>getCardYearPeriods(cardKey,c),isPCurrent);
  })();
  const fee=CARDS[cardKey].fee;
  document.getElementById('cardSheetTitle').textContent=card.name;
  document.getElementById('cardSheetBody').innerHTML=`
    <div class="card-sheet-section">
      <div class="card-sheet-section-title">Card Year Performance</div>
      <div class="card-sheet-row"><span style="color:var(--text-secondary)">Annual fee</span><span style="font-family:var(--mono);font-weight:600;color:var(--text)">$${fee}</span></div>
    </div>`;
  document.getElementById('cardSheetOverlay').classList.add('open');
  document.getElementById('cardSheet').classList.add('open');
  haptic('medium');
}
function closeCardSheet(){
  document.getElementById('cardSheetOverlay').classList.remove('open');
  document.getElementById('cardSheet').classList.remove('open');
}
function initCardFlip(){ /* no-op — flip replaced by bottom sheet */ }

// ── Navigation ────────────────────────────────────────────────────────────
function updateYearSelector(show){
  const ys=document.getElementById('yearSelector');
  ys.classList.toggle('hidden',!show);
  const cardYearStart=(state.activePrimary==='card-year')?getCardYearStartLocal(state.activeCard,CY).year:CY;
  const years=[cardYearStart-1,cardYearStart];
  if(state.activePrimary==='card-year'&&!years.includes(state.selectedYear)) state.selectedYear=cardYearStart;
  ys.innerHTML=years.map(y=>`<button class="year-btn${y===state.selectedYear?' active':''}" data-year="${y}">${y}</button>`).join('');
}

function getCardYearStartLocal(c,forYear){
  const fm=getCardFeeMonth(c),fd=getCardFeeDay(c);
  const yr=forYear||state.selectedYear;
  if(yr<CY) return {year:yr,month:fm};
  const pastAnniversary=CM>fm||(CM===fm&&new Date().getDate()>=fd);
  return pastAnniversary?{year:CY,month:fm}:{year:CY-1,month:fm};
}

function updateSecondaryNav(primary){
  const sec=document.getElementById('navSecondary');
  const stabs=sec.querySelectorAll('.stab');
  if(primary==='card-year'){
    sec.classList.remove('hidden');
    stabs[0].textContent='Period'; stabs[0].dataset.view='history';
    stabs[1].textContent='Summary'; stabs[1].dataset.view='annual';
    updateYearSelector(true);
  } else if(primary==='ytd'){
    sec.classList.remove('hidden');
    stabs[0].textContent=`${state.selectedYear} History`; stabs[0].dataset.view='ytd-history';
    stabs[1].textContent=`${state.selectedYear} Summary`; stabs[1].dataset.view='ytd';
    updateYearSelector(true);
  } else if(primary==='recap'){
    sec.classList.add('hidden');
    updateYearSelector(true);
  } else {
    sec.classList.add('hidden');
    updateYearSelector(false);
  }
  stabs.forEach(t=>t.classList.toggle('active',t.dataset.view===state.activeView));
}

function setActiveView(primary){
  state.activePrimary=primary;
  if(primary==='all-cards') state.activeView='all-cards';
  else if(primary==='this-period') state.activeView='current';
  else if(primary==='card-year') state.activeView=state.activeSecondary['card-year']||'history';
  else if(primary==='ytd') state.activeView=state.activeSecondary['ytd']||'ytd-history';
  else if(primary==='compare') state.activeView='compare';
  else if(primary==='streaks') state.activeView='streaks';
  else if(primary==='history-log') state.activeView='history-log';
  else if(primary==='recap') state.activeView='recap';
  else if(primary==='insights') state.activeView='insights';
  else if(primary==='heatmap') state.activeView='heatmap';
  else if(primary==='roi') state.activeView='roi';
  else if(primary==='priority') state.activeView='priority';
  else if(primary==='keep-card') state.activeView='keep-card';
  else if(primary==='trends') state.activeView='trends';
  else if(primary==='my-cards'){ openMyCards(); return; }

  const topViews=['all-cards','this-period','card-year','ytd'];
  if(topViews.includes(primary)){
    document.querySelectorAll('.nav-primary-btn').forEach(b=>b.classList.toggle('active',b.dataset.primary===primary));
    document.querySelectorAll('.drawer-item').forEach(b=>b.classList.remove('active'));
  } else {
    document.querySelectorAll('.nav-primary-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.drawer-item').forEach(b=>b.classList.toggle('active',b.dataset.primary===primary));
  }
  updateSecondaryNav(primary);
  render();
}

function goToCardPeriod(cardKey){ state.activeCard=cardKey; setActiveView('this-period'); }

function openDrawer(){
  document.getElementById('navExtras').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('open');
}
function closeDrawer(){
  document.getElementById('navExtras').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
}

// ── Note modal ────────────────────────────────────────────────────────────
function openNoteModal(cardKey,benefitId,pk,benefitName){
  state._noteCtx={cardKey,benefitId,pk};
  document.getElementById('noteModalTitle').textContent=benefitName;
  document.getElementById('noteModalSub').textContent=`${MONTHS_FULL[CM]} ${CY}`;
  const notes=loadNotes();
  document.getElementById('noteText').value=notes[getNoteKey(cardKey,benefitId,pk)]||'';
  document.getElementById('noteModal').classList.remove('hidden');
  setTimeout(()=>document.getElementById('noteText').focus(),100);
}
function closeNoteModal(){ document.getElementById('noteModal').classList.add('hidden'); }

// ── Fee date modal ────────────────────────────────────────────────────────
function openFeeDateModal(cardKey){
  state._feeDateEditCard=cardKey;
  document.getElementById('feeDateCardName').textContent=CARDS[cardKey].name;
  document.getElementById('feeDateMonth').value=getCardFeeMonth(cardKey);
  document.getElementById('feeDateDay').value=getCardFeeDay(cardKey);
  document.getElementById('feeDateModal').classList.remove('hidden');
}
function closeFeeDateModal(){ document.getElementById('feeDateModal').classList.add('hidden'); state._feeDateEditCard=null; }

// ── Dark mode toggle ──────────────────────────────────────────────────────
function toggleDark(){
  const isDark=document.documentElement.getAttribute('data-theme')==='dark';
  const newTheme=isDark?'light':'dark';
  document.documentElement.setAttribute('data-theme',newTheme);
  document.getElementById('darkIcon').innerHTML=newTheme==='dark'
    ?`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="1" x2="8" y2="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="8" y1="13" x2="8" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="1" y1="8" x2="3" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="13" y1="8" x2="15" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="3.05" y1="3.05" x2="4.46" y2="4.46" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="11.54" y1="11.54" x2="12.95" y2="12.95" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12.95" y1="3.05" x2="11.54" y2="4.46" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="4.46" y1="11.54" x2="3.05" y2="12.95" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
    :`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  document.getElementById('darkLabel').textContent=newTheme==='dark'?'Light':'Dark';
  localStorage.setItem('perks-theme',newTheme);
}

// ── Notifications ─────────────────────────────────────────────────────────
async function requestNotifications(){
  if(!('Notification' in window)){ alert('Notifications not supported in this browser.'); return; }
  const perm=await Notification.requestPermission();
  if(perm==='granted'){
    localStorage.setItem('perks-notif','1');
    scheduleMonthlyReminder();
    new Notification('Perks Ledger',{body:'Notifications enabled! You\'ll be reminded at month-end.',icon:'apple-touch-icon.png'});
    renderInsights();
  }
}

function scheduleMonthlyReminder(){
  const now=new Date();
  const eom=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();
  const day=now.getDate();
  if(day>=eom-2&&localStorage.getItem('perks-notif')==='1'){
    const key=`notif-sent-${now.getFullYear()}-${now.getMonth()}`;
    if(!localStorage.getItem(key)){
      let total=0;
      getVisibleCardKeys().forEach(ck=>{
        CARDS[ck].sections.forEach(s=>{
          if(s.cadence!=='monthly') return;
          s.benefits.forEach(b=>{
            const pk=`${CY}-m${CM}`;
            if(!state.DATA[ck]?.[`${b.id}__${pk}`]) total+=b.amount||0;
          });
        });
      });
      if(total>0){
        new Notification('Perks Ledger',{body:`You have $${total.toFixed(0)} in unclaimed benefits expiring this month!`,icon:'apple-touch-icon.png'});
        localStorage.setItem(key,'1');
      }
    }
  }
}
if(localStorage.getItem('perks-notif')==='1') scheduleMonthlyReminder();

// ── Undo ──────────────────────────────────────────────────────────────────
function showUndo(cardKey,id,pk,action){
  clearTimeout(state._undoTimer);
  state._undoStack={cardKey,id,pk,action};
  const toast=document.getElementById('undoToast');
  const msg=document.getElementById('undoMsg');
  msg.textContent=action==='used'?'✓ Marked as used':'Unmarked';
  toast.classList.add('show');
  haptic('light');
  state._undoTimer=setTimeout(()=>{ toast.classList.remove('show'); state._undoStack=null; },3000);
}

document.addEventListener('perks:benefit-toggled',e=>{
  showUndo(e.detail.cardKey,e.detail.id,e.detail.pk,e.detail.action);
});
document.addEventListener('perks:rerender',()=>render());

// ── Event listeners ───────────────────────────────────────────────────────
document.getElementById('authBtn').addEventListener('click',handleAuth);
document.getElementById('authEmail').addEventListener('keydown',e=>{ if(e.key==='Enter') handleAuth(); });
document.getElementById('authPassword').addEventListener('keydown',e=>{ if(e.key==='Enter') handleAuth(); });
document.getElementById('authConfirm').addEventListener('keydown',e=>{ if(e.key==='Enter') handleAuth(); });

document.getElementById('undoBtn').addEventListener('click',()=>{
  if(!state._undoStack) return;
  const {cardKey,id,pk}=state._undoStack;
  toggle(cardKey,id,pk);
  document.getElementById('undoToast').classList.remove('show');
  state._undoStack=null;
  clearTimeout(state._undoTimer);
  haptic('medium');
  render();
});

document.getElementById('noteSave').addEventListener('click',()=>{
  const notes=loadNotes();
  const key=getNoteKey(state._noteCtx.cardKey,state._noteCtx.benefitId,state._noteCtx.pk);
  const val=document.getElementById('noteText').value.trim();
  if(val) notes[key]=val; else delete notes[key];
  saveNotes(notes);
  closeNoteModal();
  renderCurrent();
});
document.getElementById('noteClear').addEventListener('click',()=>{
  const notes=loadNotes();
  delete notes[getNoteKey(state._noteCtx.cardKey,state._noteCtx.benefitId,state._noteCtx.pk)];
  saveNotes(notes);
  closeNoteModal();
  renderCurrent();
});
document.getElementById('noteCancel').addEventListener('click',closeNoteModal);
document.getElementById('noteModal').addEventListener('click',e=>{ if(e.target===e.currentTarget) closeNoteModal(); });

document.getElementById('feeDateSave').addEventListener('click',()=>{
  if(!state._feeDateEditCard) return;
  const d=getFeeOverrides();
  d[state._feeDateEditCard]={feeMonth:parseInt(document.getElementById('feeDateMonth').value),feeDay:parseInt(document.getElementById('feeDateDay').value)||1};
  saveFeeOverridesData(d);
  closeFeeDateModal();
  render();
});
document.getElementById('feeDateReset').addEventListener('click',()=>{
  if(!state._feeDateEditCard) return;
  const d=getFeeOverrides();
  delete d[state._feeDateEditCard];
  saveFeeOverridesData(d);
  closeFeeDateModal();
  render();
});
document.getElementById('feeDateCancel').addEventListener('click',closeFeeDateModal);
document.getElementById('feeDateModal').addEventListener('click',e=>{ if(e.target===e.currentTarget) closeFeeDateModal(); });

document.getElementById('cardSheetClose').addEventListener('click',closeCardSheet);
document.getElementById('cardSheetOverlay').addEventListener('click',closeCardSheet);

document.getElementById('menuBtn').addEventListener('click',openDrawer);
document.getElementById('drawerClose').addEventListener('click',closeDrawer);
document.getElementById('drawerOverlay').addEventListener('click',closeDrawer);

document.getElementById('navPrimary').querySelectorAll('.nav-primary-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{ document.querySelectorAll('.drawer-item').forEach(b=>b.classList.remove('active')); setActiveView(btn.dataset.primary); });
});
document.getElementById('navExtras').querySelectorAll('.drawer-item').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.nav-primary-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.drawer-item').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    closeDrawer();
    setActiveView(btn.dataset.primary);
  });
});
document.getElementById('navSecondary').addEventListener('click',e=>{
  const btn=e.target.closest('.stab');
  if(!btn) return;
  const view=btn.dataset.view;
  if(!view) return;
  state.activeView=view;
  state.activeSecondary[state.activePrimary]=view;
  updateSecondaryNav(state.activePrimary);
  render();
});
document.getElementById('yearSelector').addEventListener('click',e=>{
  const btn=e.target.closest('.year-btn');
  if(!btn) return;
  state.selectedYear=parseInt(btn.dataset.year);
  updateYearSelector(true);
  render();
});

// ── #main event delegation ────────────────────────────────────────────────
document.getElementById('main').addEventListener('click',e=>{
  const checkBtn=e.target.closest('.check-btn');
  if(checkBtn){
    e.stopPropagation();
    toggle(state.activeCard,checkBtn.dataset.id,checkBtn.dataset.pk);
    haptic('light');
    checkBtn.classList.add('pop');
    setTimeout(()=>checkBtn.classList.remove('pop'),300);
    checkAllClaimed(state.activeCard);
    renderCurrent();
    return;
  }
  const dotBtn=e.target.closest('.dot-btn');
  if(dotBtn){
    if(dotBtn.dataset.c==='false') return;
    toggle(state.activeCard,dotBtn.dataset.id,dotBtn.dataset.pk);
    render();
    return;
  }
  const secHeader=e.target.closest('.section-header.collapsible-header');
  if(secHeader&&secHeader.dataset.sectionKey){
    if(e.target.closest('.check-btn,.benefit-note,.add-note,.partial-input')) return;
    const key=secHeader.dataset.sectionKey;
    if(state._collapsedCurrentSections.has(key)) state._collapsedCurrentSections.delete(key);
    else state._collapsedCurrentSections.add(key);
    haptic('light');
    renderCurrent();
    return;
  }
  const cadHeader=e.target.closest('.collapsible-header[data-cadence]');
  if(cadHeader){
    const cadence=cadHeader.dataset.cadence;
    const nowCollapsed=state._collapsedSections.has(cadence);
    if(nowCollapsed) state._collapsedSections.delete(cadence);
    else state._collapsedSections.add(cadence);
    haptic('light');
    const body=document.getElementById(`section-body-${cadence}`);
    const chevron=cadHeader.querySelector('[style*="rotate"]');
    if(body){
      body.style.maxHeight=nowCollapsed?'2000px':'0';
      body.style.opacity=nowCollapsed?'1':'0';
    }
    if(chevron) chevron.style.transform=`rotate(${nowCollapsed?'0deg':'-90deg'})`;
    return;
  }
});

// ── Swipe gestures ────────────────────────────────────────────────────────
const TOP_VIEWS=['all-cards','this-period','card-year','ytd'];
document.addEventListener('touchstart',e=>{ state.touchStartX=e.touches[0].clientX; state.touchStartY=e.touches[0].clientY; },{passive:true});
document.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-state.touchStartX;
  const dy=e.changedTouches[0].clientY-state.touchStartY;
  if(Math.abs(dx)<40||Math.abs(dy)>Math.abs(dx)*0.8) return;
  if(dx<-40&&state.touchStartX>30){ const idx=TOP_VIEWS.indexOf(state.activePrimary); if(idx<TOP_VIEWS.length-1) setActiveView(TOP_VIEWS[idx+1]); }
  else if(dx>40){ const idx=TOP_VIEWS.indexOf(state.activePrimary); if(idx>0) setActiveView(TOP_VIEWS[idx-1]); }
},{passive:true});

// ── Pull to refresh ───────────────────────────────────────────────────────
document.addEventListener('touchstart',e=>{ if(window.scrollY===0) state.ptrStartY=e.touches[0].clientY; },{passive:true});
document.addEventListener('touchmove',e=>{
  if(!state.ptrStartY) return;
  const dy=e.touches[0].clientY-state.ptrStartY;
  if(dy>20&&window.scrollY===0){
    state.ptrActive=true;
    const ind=document.getElementById('ptrIndicator');
    if(ind){ ind.classList.remove('hidden'); ind.classList.add('visible'); }
  }
},{passive:true});
document.addEventListener('touchend',async()=>{
  if(state.ptrActive){
    state.ptrActive=false; haptic('light');
    await syncFromSupabase();
    const ind=document.getElementById('ptrIndicator');
    if(ind){ ind.classList.remove('visible'); ind.classList.add('hidden'); }
    state.ptrStartY=0;
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

// ── SVG nav icons IIFE ────────────────────────────────────────────────────
(function(){
  const day=new Date().getDate();
  const month=new Date().toLocaleString('default',{month:'short'}).toUpperCase();
  const currentTab=document.getElementById('currentTab');
  if(currentTab) currentTab.textContent='Month';
  const S='width:22px;height:22px;display:block';
  const icons={
    'all-cards':`<svg style="${S}" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="4" width="18" height="3" rx="1.5" fill="currentColor" opacity="0.9"/><rect x="2" y="9.5" width="18" height="3" rx="1.5" fill="currentColor" opacity="0.9"/><rect x="2" y="15" width="18" height="3" rx="1.5" fill="currentColor" opacity="0.9"/></svg>`,
    'this-period':`<svg style="${S}" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="3" width="18" height="16" rx="2.5" fill="currentColor" opacity="0.08"/><rect x="2" y="3" width="18" height="16" rx="2.5" stroke="currentColor" stroke-width="1.5"/><rect x="2" y="3" width="18" height="6.5" rx="2.5" fill="#e03030"/><rect x="2" y="6.5" width="18" height="3" fill="#e03030"/><line x1="7" y1="3" x2="7" y2="9.5" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/><line x1="15" y1="3" x2="15" y2="9.5" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/><text x="11" y="8.8" text-anchor="middle" font-size="4.5" font-weight="700" font-family="system-ui,sans-serif" fill="white" letter-spacing="0.5">${month}</text><text x="11" y="17.5" text-anchor="middle" font-size="8.5" font-weight="700" font-family="system-ui,sans-serif" fill="currentColor">${day}</text></svg>`,
    'card-year':`<svg style="${S}" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="5" width="18" height="12" rx="2.5" stroke="currentColor" stroke-width="1.6"/><rect x="2" y="9" width="18" height="2.5" fill="currentColor" opacity="0.35"/><rect x="4" y="13" width="5" height="1.5" rx="0.75" fill="currentColor" opacity="0.7"/></svg>`,
    'ytd':`<svg style="${S}" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="2,17 7,11 11,13 16,7 20,5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><polyline points="16,5 20,5 20,9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  };
  Object.entries(icons).forEach(([primary,svg])=>{
    const btn=document.querySelector(`.nav-primary-btn[data-primary="${primary}"]`);
    if(!btn) return;
    const icon=btn.querySelector('.nav-icon');
    if(!icon) return;
    icon.innerHTML=svg; icon.style.fontSize='0'; icon.style.lineHeight='0';
    icon.style.display='flex'; icon.style.alignItems='center'; icon.style.justifyContent='center'; icon.style.marginBottom='2px';
  });
})();

// ── Drawer icons + home button IIFE ──────────────────────────────────────
(function(){
  const title=document.querySelector('.app-title');
  if(title){ title.style.cursor='pointer'; title.addEventListener('click',()=>setActiveView('all-cards')); }

  const drawerIconMap={
    'priority':`<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="8" cy="11" r="0.8" fill="currentColor"/></svg>`,
    'insights':`<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2a4 4 0 0 1 4 4c0 1.6-.9 3-2.2 3.7V11H6.2V9.7A4 4 0 0 1 4 6a4 4 0 0 1 4-4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="6.2" y1="12.5" x2="9.8" y2="12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="6.8" y1="14" x2="9.2" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    'keep-card':`<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="4" width="13" height="9" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 8.5L7 10l3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'compare':`<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3.5" width="5.5" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="3.5" width="5.5" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/></svg>`,
    'roi':`<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="9" width="2.5" height="5" rx="0.75" fill="currentColor" opacity="0.7"/><rect x="6" y="6" width="2.5" height="8" rx="0.75" fill="currentColor" opacity="0.85"/><rect x="10" y="3" width="2.5" height="11" rx="0.75" fill="currentColor"/><line x1="1.5" y1="14.5" x2="14.5" y2="14.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    'heatmap':`<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="3" height="3" rx="0.75" fill="currentColor" opacity="0.3"/><rect x="6.5" y="2" width="3" height="3" rx="0.75" fill="currentColor" opacity="0.7"/><rect x="11" y="2" width="3" height="3" rx="0.75" fill="currentColor"/><rect x="2" y="6.5" width="3" height="3" rx="0.75" fill="currentColor" opacity="0.7"/><rect x="6.5" y="6.5" width="3" height="3" rx="0.75" fill="currentColor" opacity="0.4"/><rect x="11" y="6.5" width="3" height="3" rx="0.75" fill="currentColor" opacity="0.85"/><rect x="2" y="11" width="3" height="3" rx="0.75" fill="currentColor"/><rect x="6.5" y="11" width="3" height="3" rx="0.75" fill="currentColor" opacity="0.5"/><rect x="11" y="11" width="3" height="3" rx="0.75" fill="currentColor" opacity="0.25"/></svg>`,
    'streaks':`<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9 2C9 2 10.5 4.5 9.5 6.5C11 5.5 11.5 3.5 11.5 3.5C12.5 5 13 7 12 9C11 11.5 8.5 13 6.5 13C4 13 2.5 11 2.5 9C2.5 6.5 4.5 5 4.5 5C4.5 7 6 7.5 6 7.5C5.5 5.5 7 2 9 2Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
    'history-log':`<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><polyline points="8,5 8,8.5 10.5,10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'recap':`<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L9.5 6h4L10 8.5l1.5 4.5L8 10.5 4.5 13 6 8.5 2.5 6h4z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
    'trends':`<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polyline points="2,13 6,9 9,11 13,5 14,3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  };
  Object.entries(drawerIconMap).forEach(([primary,svg])=>{
    const btn=document.querySelector(`.drawer-item[data-primary="${primary}"]`);
    if(!btn) return;
    const icon=btn.querySelector('.drawer-icon');
    if(icon) icon.innerHTML=svg;
  });

  const menuBtn=document.getElementById('menuBtn');
  if(menuBtn) menuBtn.innerHTML=`<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><line x1="2" y1="4.5" x2="16" y2="4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="2" y1="13.5" x2="16" y2="13.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;

  const isDarkNow=document.documentElement.getAttribute('data-theme')==='dark';
  const darkIconEl=document.getElementById('darkIcon');
  if(darkIconEl) darkIconEl.innerHTML=isDarkNow
    ?`<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="1" x2="8" y2="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="8" y1="13" x2="8" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="1" y1="8" x2="3" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="13" y1="8" x2="15" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="3.05" y1="3.05" x2="4.46" y2="4.46" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="11.54" y1="11.54" x2="12.95" y2="12.95" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12.95" y1="3.05" x2="11.54" y2="4.46" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="4.46" y1="11.54" x2="3.05" y2="12.95" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
    :`<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const drawerTitle=document.querySelector('.drawer-title');
  if(drawerTitle){
    drawerTitle.innerHTML=`<img src="icon-192.png" style="width:24px;height:24px;border-radius:6px;vertical-align:middle;margin-right:8px;"> Perks Ledger`;
    drawerTitle.style.cursor='pointer';
    drawerTitle.addEventListener('click',()=>{ closeDrawer(); setActiveView('all-cards'); });
  }
  const signOutBtn=document.getElementById('signOutBtn');
  if(signOutBtn){
    signOutBtn.style.cssText='display:inline-flex;align-items:center;gap:6px;background:rgba(220,60,60,0.12);color:var(--red);border:1px solid rgba(220,60,60,0.25);border-radius:100px;padding:7px 16px;font-size:12px;font-family:var(--mono);cursor:pointer;width:auto';
    signOutBtn.innerHTML='<span style="font-size:13px">→</span> Sign Out';
  }
  const drawerBottom=document.querySelector('#navExtras > div:last-child');
  if(drawerBottom){
    const credit=document.createElement('div');
    credit.textContent='jhuey · 2026 · v1.0';
    credit.style.cssText='font-size:10px;font-family:var(--mono);color:var(--text-tertiary);margin-top:10px;padding:0 12px;opacity:0.4;user-select:none';
    drawerBottom.appendChild(credit);
  }
})();

// ── Hide all card buttons until user profile loads ────────────────────────
document.querySelectorAll('.card-btn[data-card]').forEach(btn=>btn.style.display='none');
initCardSelector();
window.addEventListener('resize',sizeCardSelector);

// ── Service worker ────────────────────────────────────────────────────────
if('serviceWorker' in navigator&&location.hostname!=='www.claudeusercontent.com'){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('sw.js',{scope:'./'})
      .then(reg=>console.log('SW registered:',reg.scope))
      .catch(err=>console.log('SW registration failed:',err));
  });
}

// ── window.* exports for inline onclick handlers ──────────────────────────
window.setActiveView=setActiveView;
window.openFeeDateModal=openFeeDateModal;
window.closeFeeDateModal=closeFeeDateModal;
window.goToCardPeriod=goToCardPeriod;
window.skipBenefit=skipBenefit;
window.requestNotifications=requestNotifications;
window.setSelectedYear=(y)=>{ state.selectedYear=y; };
window.openNoteModal=openNoteModal;
window.closeNoteModal=closeNoteModal;
window.setPartialUsed=setPartialUsed;
window.toggleCredited=toggleCredited;
window.openCardSheet=openCardSheet;
window.closeCardSheet=closeCardSheet;
window.toggleCPCard=toggleCPCard;
window.filterCPCards=filterCPCards;
window.filterMCCards=filterMCCards;
window.confirmCardPick=confirmCardPick;
window.handleAuth=handleAuth;
window.handleForgotPassword=handleForgotPassword;
window.switchAuthTab=switchAuthTab;
window.toggleDark=toggleDark;
window.signOut=signOut;
window.openMyCards=openMyCards;
window.closeMyCards=closeMyCards;
window.saveMyCards=saveMyCards;
window.scheduleMonthlyReminder=scheduleMonthlyReminder;
window.isSkipped=isSkipped;
window.renderRecap=renderRecap;
