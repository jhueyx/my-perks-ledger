import { CARDS, CARD_LABELS, PREMIUM_CARD_CATALOG, POINTS_MULTIPLIERS } from './cards.js';
import { state, CY, CM, MONTHS, MONTHS_FULL, sb, freshDATA, STORAGE_KEY, escapeHtml } from './state.js';
import {
  toggle, scheduleSave, setSave, syncFromSupabase,
  loadCustomAmounts, saveCustomAmounts, setCustomAmount,
  loadPartial, savePartial, setPartialUsed,
  loadNotes, saveNotes, getNoteKey,
  loadCredited, saveCredited, toggleCredited,
  loadSkipped, saveSkipped, isSkipped, skipBenefit, unskipBenefit, clearAllSkipped, countSkipped,
  getFeeOverrides, saveFeeOverridesData, getCardFeeMonth, getCardFeeDay,
  setSnoozedBenefit, isGloballySnoozed
} from './storage.js';
import { render, getVisibleCardKeys, renderCurrent, renderInsights, renderPriorityQueue, renderRecap, haptic, checkAllClaimed, animateCounters } from './views.js';
import { calcStats, getCardYearPeriods, isPCurrent, getFee } from './periods.js';

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

function updateDrawerGreeting(){
  const user=state.currentUser;
  if(!user) return;
  const name=user.user_metadata?.display_name;
  const greetEl=document.getElementById('drawerGreeting');
  const emailEl=document.getElementById('drawerUserEmail');
  if(greetEl) greetEl.textContent=name?`Hi, ${name}`:'';
  if(emailEl) emailEl.textContent=user.email||'';
  const sg=document.getElementById('sheetGreeting');
  const se=document.getElementById('sheetUserEmail');
  if(sg) sg.textContent=name?`Hi, ${name}`:'';
  if(se) se.textContent=user.email||'';
}

async function onSignedIn(user,isNew){
  state.currentUser=user;
  updateDrawerGreeting();
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
    const countId=gridId==='settingsCardGrid'?'settingsCardCount':'mcCount';
    const countEl=document.getElementById(countId);
    if(countEl) countEl.textContent=`${state._mcSelected.size} card${state._mcSelected.size!==1?'s':''} selected`;
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

// ── Settings screen ──────────────────────────────────────────────────────
function renderSettings(){
  const user=state.currentUser;
  const displayName=user?.user_metadata?.display_name||'';
  const email=escapeHtml(user?.email||'');
  state._mcSelected=new Set(state.userCards||['csr','gold','platinum']);
  document.getElementById('main').innerHTML=`
    <div class="settings-page">
      <div class="settings-page-header">Settings</div>

      <div class="settings-section">
        <div class="settings-section-title">Profile</div>
        <div class="settings-field">
          <label class="settings-label">What to call you</label>
          <input class="settings-input" id="settingsName" type="text" placeholder="e.g. Jason" value="${escapeHtml(displayName)}"/>
        </div>
        <div class="settings-field">
          <label class="settings-label">Email</label>
          <input class="settings-input" type="email" value="${email}" readonly/>
        </div>
        <button class="settings-btn settings-btn-primary" onclick="saveSettingsProfile()">Save Profile</button>
        <div class="settings-feedback" id="settingsProfileMsg"></div>
      </div>

      <div class="settings-section">
        <div class="settings-section-title">Security</div>
        <div class="settings-field">
          <label class="settings-label">New password</label>
          <input class="settings-input" id="settingsNewPwd" type="password" placeholder="At least 6 characters" autocomplete="new-password"/>
        </div>
        <div class="settings-field">
          <label class="settings-label">Confirm new password</label>
          <input class="settings-input" id="settingsConfirmPwd" type="password" placeholder="Confirm new password" autocomplete="new-password"/>
        </div>
        <button class="settings-btn settings-btn-primary" onclick="saveSettingsPassword()">Change Password</button>
        <div class="settings-feedback" id="settingsPwdMsg"></div>
      </div>

      <div class="settings-section">
        <div class="settings-section-title">My Cards</div>
        <div class="settings-sub">Select the cards you want to track.</div>
        <input class="cp-search" id="settingsCardSearch" placeholder="Search cards…" oninput="filterSettingsCards()" style="margin:12px 0 8px"/>
        <div class="cp-count" id="settingsCardCount">${state._mcSelected.size} card${state._mcSelected.size!==1?'s':''} selected</div>
        <div class="cp-grid" id="settingsCardGrid" style="margin-bottom:16px"></div>
        <button class="settings-btn settings-btn-primary" id="settingsCardSave" onclick="saveSettingsCards()">Save Cards</button>
        <div class="settings-feedback" id="settingsCardMsg"></div>
      </div>
    </div>`;
  renderCPGrid('settingsCardGrid','settingsCardSearch',state._mcSelected);
}

async function saveSettingsProfile(){
  const name=document.getElementById('settingsName').value.trim();
  const msg=document.getElementById('settingsProfileMsg');
  msg.textContent='Saving…'; msg.style.color='var(--text-tertiary)';
  const {data,error}=await sb.auth.updateUser({data:{display_name:name}});
  if(error){ msg.textContent=error.message; msg.style.color='var(--red)'; return; }
  if(data?.user) state.currentUser=data.user;
  updateDrawerGreeting();
  msg.textContent='✓ Saved'; msg.style.color='var(--green)';
  setTimeout(()=>{ if(msg) msg.textContent=''; },2500);
}

async function saveSettingsPassword(){
  const pwd=document.getElementById('settingsNewPwd').value;
  const confirm=document.getElementById('settingsConfirmPwd').value;
  const msg=document.getElementById('settingsPwdMsg');
  msg.style.color='var(--red)';
  if(!pwd){ msg.textContent='Enter a new password.'; return; }
  if(pwd.length<6){ msg.textContent='Password must be at least 6 characters.'; return; }
  if(pwd!==confirm){ msg.textContent='Passwords do not match.'; return; }
  msg.textContent='Saving…'; msg.style.color='var(--text-tertiary)';
  const {error}=await sb.auth.updateUser({password:pwd});
  if(error){ msg.textContent=error.message; msg.style.color='var(--red)'; return; }
  document.getElementById('settingsNewPwd').value='';
  document.getElementById('settingsConfirmPwd').value='';
  msg.textContent='✓ Password changed'; msg.style.color='var(--green)';
  setTimeout(()=>{ if(msg) msg.textContent=''; },2500);
}

async function saveSettingsCards(){
  const cards=[...state._mcSelected];
  const msg=document.getElementById('settingsCardMsg');
  if(cards.length===0){ msg.textContent='Select at least one card.'; msg.style.color='var(--red)'; return; }
  const btn=document.getElementById('settingsCardSave');
  if(btn){ btn.textContent='Saving…'; btn.disabled=true; }
  await sb.from('user_profiles').upsert({user_id:state.currentUser.id,cards,updated_at:new Date().toISOString()},{onConflict:'user_id'});
  state.userCards=cards;
  applyUserCards();
  if(!state.userCards.includes(state.activeCard)) state.activeCard=getVisibleCardKeys()[0]||'csr';
  if(btn){ btn.textContent='Save Cards'; btn.disabled=false; }
  msg.textContent='✓ Cards updated'; msg.style.color='var(--green)';
  setTimeout(()=>{ if(msg) msg.textContent=''; },2500);
}

function filterSettingsCards(){ renderCPGrid('settingsCardGrid','settingsCardSearch',state._mcSelected); }

// ── Card selector ─────────────────────────────────────────────────────────
function sizeCardSelector(){ /* sizing handled by CSS flex-basis breakpoints */ }

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
      stopCarousel();
      btn.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
      setActiveView('this-period');
      setTimeout(()=>{ initCardFlip(); },50);
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
  const {captured}=calcStats(cardKey,c=>getCardYearPeriods(cardKey,c),isPCurrent);
  const fee=getFee(cardKey,CY);
  const effectiveFee=fee-captured;
  const multipliers=POINTS_MULTIPLIERS[cardKey]||[];

  let html=`<div class="card-sheet-section">
    <div class="card-sheet-section-title">Card Year</div>
    <div class="card-sheet-row"><span style="color:var(--text-secondary)">Annual fee</span><span style="font-family:var(--mono);font-weight:600">$${fee}</span></div>
    <div class="card-sheet-row"><span style="color:var(--text-secondary)">Captured so far</span><span style="font-family:var(--mono);font-weight:600;color:var(--green)">$${captured.toFixed(0)}</span></div>
    <div class="card-sheet-row"><span style="color:var(--text-secondary)">Effective fee</span><span style="font-family:var(--mono);font-weight:600;color:${effectiveFee<=0?'var(--green)':'var(--text)'}">${effectiveFee<=0?'+$'+Math.abs(effectiveFee).toFixed(0)+' profit':'$'+effectiveFee.toFixed(0)}</span></div>
  </div>`;

  if(multipliers.length){
    html+=`<div class="card-sheet-section">
      <div class="card-sheet-section-title">Earning rates</div>`;
    multipliers.forEach(m=>{
      html+=`<div class="card-sheet-row"><span style="color:var(--text-secondary);font-size:12px">${m.cat}</span><span style="font-family:var(--mono);font-weight:700;color:var(--gold);font-size:13px">${m.pts}</span></div>`;
    });
    html+=`</div>`;
  }

  html+=`<div class="card-sheet-section"><div class="card-sheet-section-title">Benefits</div>`;
  card.sections.forEach(s=>{
    const cadLbl=s.cadence==='monthly'?'monthly':s.cadence==='quarterly'?'quarterly':s.cadence==='cal-semi-annual'||s.cadence==='semi-annual'?'semi-annual':'annual';
    s.benefits.filter(b=>!b.startsFrom||b.startsFrom<=CY).forEach(b=>{
      const amt=b.amount>0?`$${b.amount}`:(b.note||'');
      html+=`<div class="card-sheet-row"><span style="color:var(--text-secondary);font-size:12px">${b.name}</span><span style="font-family:var(--mono);font-size:12px;color:var(--text)">${amt}<span style="color:var(--text-tertiary);font-size:10px"> /${cadLbl}</span></span></div>`;
    });
  });
  html+=`</div>`;

  document.getElementById('cardSheetTitle').textContent=card.name;
  document.getElementById('cardSheetBody').innerHTML=html;
  document.getElementById('cardSheetOverlay').classList.add('open');
  document.getElementById('cardSheet').classList.add('open');
  haptic('medium');
}
function closeCardSheet(){
  document.getElementById('cardSheetOverlay').classList.remove('open');
  document.getElementById('cardSheet').classList.remove('open');
}
function initCardFlip(){ startCarousel(); }

// ── Navigation ────────────────────────────────────────────────────────────
function updateYearSelector(show){
  const ys=document.getElementById('yearSelector');
  ys.classList.toggle('hidden',!show);
  const cardYearStart=(state.activePrimary==='card-year')?getCardYearStartLocal(state.activeCard,CY).year:CY;
  const openedYear=CARDS[state.activeCard]?.openedYear;
  const prevYear=cardYearStart-1;
  const years=(openedYear&&prevYear<openedYear)?[cardYearStart]:[prevYear,cardYearStart];
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
  else if(primary==='settings') state.activeView='settings';
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
  updateBottomTabBar(primary);
  if(primary==='settings'){ renderSettings(); return; }
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
function openMenuSheet(){
  document.getElementById('bottomSheet').classList.add('open');
  document.getElementById('bottomSheetOverlay').classList.add('open');
}
function closeMenuSheet(){
  document.getElementById('bottomSheet').classList.remove('open');
  document.getElementById('bottomSheetOverlay').classList.remove('open');
}
function updateBottomTabBar(primary){
  document.querySelectorAll('.bottom-tab[data-bottom]').forEach(b=>b.classList.toggle('active',b.dataset.bottom===primary));
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
  if(action==='skipped') msg.textContent='Dismissed';
  else msg.textContent=action==='used'?'✓ Marked as used':'Unmarked';
  toast.classList.add('show');
  haptic('light');
  state._undoTimer=setTimeout(()=>{ toast.classList.remove('show'); state._undoStack=null; },4000);
}

function executeUndo(){
  if(!state._undoStack) return;
  const {cardKey,id,pk,action}=state._undoStack;
  if(action==='skipped') unskipBenefit(cardKey,id,pk);
  else toggle(cardKey,id,pk);
  document.getElementById('undoToast').classList.remove('show');
  state._undoStack=null;
  clearTimeout(state._undoTimer);
  haptic('medium');
  render();
}

document.addEventListener('perks:benefit-toggled',e=>{
  showUndo(e.detail.cardKey,e.detail.id,e.detail.pk,e.detail.action);
});
document.addEventListener('perks:benefit-skipped',e=>{
  showUndo(e.detail.cardKey,e.detail.id,e.detail.pk,'skipped');
});
document.addEventListener('perks:rerender',()=>{ if(state.activeView!=='settings') render(); });
document.addEventListener('perks:benefit-toggled',()=>{ setTimeout(checkProfitConfetti,200); });

// ── Shake to undo ─────────────────────────────────────────────────────────
(function initShake(){
  let lastAcc=0,shakeTime=0;
  const THRESHOLD=20,COOLDOWN=1000;
  function onMotion(e){
    const acc=e.accelerationIncludingGravity;
    if(!acc) return;
    const mag=Math.abs(acc.x)+Math.abs(acc.y)+Math.abs(acc.z);
    const now=Date.now();
    if(mag>THRESHOLD&&now-shakeTime>COOLDOWN&&state._undoStack){
      shakeTime=now;
      executeUndo();
    }
    lastAcc=mag;
  }
  if(typeof DeviceMotionEvent!=='undefined'){
    if(typeof DeviceMotionEvent.requestPermission==='function'){
      // iOS 13+ — hook in after a user gesture (the first interaction on the page)
      document.addEventListener('click',function grantMotion(){
        DeviceMotionEvent.requestPermission().then(r=>{ if(r==='granted') window.addEventListener('devicemotion',onMotion); }).catch(()=>{});
        document.removeEventListener('click',grantMotion);
      },{once:true});
    } else {
      window.addEventListener('devicemotion',onMotion);
    }
  }
})();

// ── Event listeners ───────────────────────────────────────────────────────
document.getElementById('authBtn').addEventListener('click',handleAuth);
document.getElementById('authEmail').addEventListener('keydown',e=>{ if(e.key==='Enter') handleAuth(); });
document.getElementById('authPassword').addEventListener('keydown',e=>{ if(e.key==='Enter') handleAuth(); });
document.getElementById('authConfirm').addEventListener('keydown',e=>{ if(e.key==='Enter') handleAuth(); });

document.getElementById('undoBtn').addEventListener('click',()=>{ executeUndo(); });

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

// ── Bottom tab bar + menu sheet ───────────────────────────────────────────
document.getElementById('bottomMenuBtn').addEventListener('click',openMenuSheet);
document.getElementById('bottomSheetOverlay').addEventListener('click',closeMenuSheet);
document.getElementById('sheetSignOut').addEventListener('click',()=>{ closeMenuSheet(); signOut(); });
document.getElementById('bottomTabBar').querySelectorAll('.bottom-tab[data-bottom]').forEach(btn=>{
  btn.addEventListener('click',()=>{ setActiveView(btn.dataset.bottom); });
});
document.getElementById('bottomSheetItems').querySelectorAll('.drawer-item[data-sheet]').forEach(btn=>{
  btn.addEventListener('click',()=>{ closeMenuSheet(); setActiveView(btn.dataset.sheet); });
});

document.getElementById('navPrimary').querySelectorAll('.nav-primary-btn').forEach(btn=>{
  btn.addEventListener('click',e=>{
    if(e.target.closest('.month-arrow')) return;
    if(btn.dataset.primary==='this-period'){ state._periodOffset=0; updateMonthTabLabel(); }
    document.querySelectorAll('.drawer-item').forEach(b=>b.classList.remove('active'));
    setActiveView(btn.dataset.primary);
  });
});
document.getElementById('monthPrevBtn').addEventListener('click',e=>{
  e.stopPropagation();
  state._periodOffset=(state._periodOffset||0)-1;
  updateMonthTabLabel();
  if(state.activePrimary==='this-period') renderCurrent(); else setActiveView('this-period');
});
document.getElementById('monthNextBtn').addEventListener('click',e=>{
  e.stopPropagation();
  if((state._periodOffset||0)>=0) return;
  state._periodOffset=(state._periodOffset||0)+1;
  updateMonthTabLabel();
  if(state.activePrimary==='this-period') renderCurrent(); else setActiveView('this-period');
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
  const snoozeBtn=e.target.closest('[data-snooze-id]');
  if(snoozeBtn){
    e.stopPropagation();
    const benefitId=snoozeBtn.dataset.snoozeId;
    const cardKey=snoozeBtn.dataset.snoozeCard;
    const benefitName=snoozeBtn.dataset.snoozeName||benefitId;
    openSnoozeModal(cardKey,benefitId,benefitName);
    return;
  }
  const unsnoozeLink=e.target.closest('[data-unsnooze]');
  if(unsnoozeLink){
    e.stopPropagation();
    const benefitId=unsnoozeLink.dataset.unsnooze;
    const cardKey=unsnoozeLink.dataset.unsnoozeCard||state.activeCard;
    setSnoozedBenefit(cardKey,benefitId,null,null);
    render();
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

// ── ROI/Trends card drag-to-reorder ──────────────────────────────────────
let _dragCardSrc=null;
document.getElementById('main').addEventListener('dragstart',e=>{
  const card=e.target.closest('[data-drag-card]');
  if(!card) return;
  _dragCardSrc=card.dataset.dragCard;
  e.dataTransfer.effectAllowed='move';
  setTimeout(()=>card.style.opacity='0.4',0);
});
document.getElementById('main').addEventListener('dragend',e=>{
  const card=e.target.closest('[data-drag-card]');
  if(card) card.style.opacity='';
  document.querySelectorAll('[data-drag-card].drag-over').forEach(el=>el.classList.remove('drag-over'));
  _dragCardSrc=null;
});
document.getElementById('main').addEventListener('dragover',e=>{
  const card=e.target.closest('[data-drag-card]');
  if(!card||card.dataset.dragCard===_dragCardSrc) return;
  e.preventDefault();
  e.dataTransfer.dropEffect='move';
  document.querySelectorAll('[data-drag-card].drag-over').forEach(el=>{ if(el!==card) el.classList.remove('drag-over'); });
  card.classList.add('drag-over');
});
document.getElementById('main').addEventListener('dragleave',e=>{
  const card=e.target.closest('[data-drag-card]');
  if(card&&!card.contains(e.relatedTarget)) card.classList.remove('drag-over');
});
document.getElementById('main').addEventListener('drop',e=>{
  const card=e.target.closest('[data-drag-card]');
  if(!card||!_dragCardSrc||card.dataset.dragCard===_dragCardSrc) return;
  e.preventDefault();
  card.classList.remove('drag-over');
  const keys=getVisibleCardKeys();
  const si=keys.indexOf(_dragCardSrc),ti=keys.indexOf(card.dataset.dragCard);
  if(si<0||ti<0) return;
  keys.splice(si,1); keys.splice(ti,0,_dragCardSrc);
  localStorage.setItem('perks-card-order',JSON.stringify(keys));
  render();
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
    'settings':`<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.4"/><path d="M13 9.5l.6-1-1-1a3.5 3.5 0 0 0-.3-.7l.4-1.3-1.2-1.2-1.3.4a3.5 3.5 0 0 0-.7-.3L9 3H7l-.5 1.4a3.5 3.5 0 0 0-.7.3L4.5 4.3 3.3 5.5l.4 1.3a3.5 3.5 0 0 0-.3.7L2 8v1l1.4.5c.1.2.2.5.3.7l-.4 1.3 1.2 1.2 1.3-.4c.2.1.5.2.7.3L7 14h2l.5-1.4c.2-.1.5-.2.7-.3l1.3.4 1.2-1.2-.4-1.3c.1-.2.2-.5.3-.7L14 9.5z" stroke="currentColor" stroke-width="1.4"/></svg>`,
  };
  Object.entries(drawerIconMap).forEach(([primary,svg])=>{
    [`.drawer-item[data-primary="${primary}"]`,`.drawer-item[data-sheet="${primary}"]`].forEach(sel=>{
      const btn=document.querySelector(sel);
      if(!btn) return;
      const icon=btn.querySelector('.drawer-icon');
      if(icon) icon.innerHTML=svg;
    });
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

// ── Snooze modal ──────────────────────────────────────────────────────────
function openSnoozeModal(cardKey, benefitId, benefitName){
  state._snoozeCtx={cardKey,benefitId};
  document.getElementById('snoozeModalTitle').textContent=benefitName;
  const isGE=benefitId.endsWith('_ge');
  document.getElementById('snoozeGEPreset').style.display=isGE?'':'none';
  const now=new Date();
  const curYYYYMM=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  document.getElementById('snoozeFromInput').value=curYYYYMM;
  document.getElementById('snoozeMonthInput').value=curYYYYMM;
  document.getElementById('snoozeMonthInput').min=curYYYYMM;
  if(isGE){
    const yr4=now.getFullYear()+4;
    const m4=String(now.getMonth()+1).padStart(2,'0');
    document.getElementById('snooze4yrBtn').dataset.until=`${yr4}-${m4}`;
    document.getElementById('snooze4yrBtn').textContent=`⏸︎ Snooze 4 years — eligible again ${yr4}`;
  }
  document.getElementById('snoozeModal').classList.remove('hidden');
}
function closeSnoozeModal(){ document.getElementById('snoozeModal').classList.add('hidden'); state._snoozeCtx=null; }
function saveSnooze(){
  if(!state._snoozeCtx) return;
  const from=document.getElementById('snoozeFromInput').value;
  const until=document.getElementById('snoozeMonthInput').value;
  if(!until) return;
  setSnoozedBenefit(state._snoozeCtx.cardKey,state._snoozeCtx.benefitId,from||until,until);
  closeSnoozeModal();
  render();
}
document.getElementById('snoozeSave').addEventListener('click',saveSnooze);
document.getElementById('snoozeCancel').addEventListener('click',closeSnoozeModal);
document.getElementById('snoozeModal').addEventListener('click',e=>{ if(e.target===e.currentTarget) closeSnoozeModal(); });
document.getElementById('snooze4yrBtn').addEventListener('click',()=>{
  const until=document.getElementById('snooze4yrBtn').dataset.until;
  if(until){ document.getElementById('snoozeMonthInput').value=until; }
});

// ── Confetti ──────────────────────────────────────────────────────────────
const confettiCanvas=document.getElementById('confettiCanvas');
let _confettiRunning=false;
function launchConfetti(){
  if(/Mobi|Android/i.test(navigator.userAgent)) return;
  if(_confettiRunning) return;
  _confettiRunning=true;
  const ctx=confettiCanvas.getContext('2d');
  confettiCanvas.width=window.innerWidth;
  confettiCanvas.height=window.innerHeight;
  confettiCanvas.style.cssText='position:fixed;top:0;left:0;pointer-events:none;z-index:9999';
  const colors=['#4caf7d','#f0b429','#3b82f6','#e03030','#a78bfa','#fb923c'];
  const pieces=Array.from({length:120},()=>({
    x:Math.random()*confettiCanvas.width,
    y:Math.random()*-confettiCanvas.height-10,
    r:Math.random()*6+3,
    d:Math.random()*4+2,
    color:colors[Math.floor(Math.random()*colors.length)],
    tilt:Math.random()*10-5,
    tiltSpd:Math.random()*0.08-0.04,
    rot:Math.random()*360,
  }));
  let frame=0;
  function step(){
    if(frame++>220){ ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height); _confettiRunning=false; return; }
    ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
    pieces.forEach(p=>{
      p.y+=p.d; p.tilt+=p.tiltSpd; p.rot+=2;
      if(p.y>confettiCanvas.height){ p.y=-10; p.x=Math.random()*confettiCanvas.width; }
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle=p.color; ctx.globalAlpha=Math.max(0,(220-frame)/80);
      ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*1.6);
      ctx.restore();
    });
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
let _wasInProfit=false;
function checkProfitConfetti(){
  if(/Mobi|Android/i.test(navigator.userAgent)) return;
  try{
    const keys=getVisibleCardKeys();
    const anyProfit=keys.some(ck=>{
      const {captured}=calcStats(ck,c=>getCardYearPeriods(ck,c),isPCurrent);
      return getFee(ck,CY)-captured<=0;
    });
    if(anyProfit&&!_wasInProfit){ launchConfetti(); }
    _wasInProfit=anyProfit;
  }catch(e){}
}

// ── Home tab card carousel (desktop) ─────────────────────────────────────
let _carouselId=null,_carouselPaused=false;
function startCarousel(){
  const sel=document.getElementById('cardSelector');
  if(!sel||window.innerWidth<768) return;
  const max=sel.scrollWidth-sel.clientWidth;
  if(max<10) return;
  if(_carouselId) cancelAnimationFrame(_carouselId);
  function tick(){
    if(!_carouselPaused){
      sel.scrollLeft+=0.5;
      if(sel.scrollLeft>=max) sel.scrollLeft=0;
    }
    _carouselId=requestAnimationFrame(tick);
  }
  tick();
}
function stopCarousel(){ if(_carouselId){ cancelAnimationFrame(_carouselId); _carouselId=null; } }

// ── Hide all card buttons until user profile loads ────────────────────────
document.querySelectorAll('.card-btn[data-card]').forEach(btn=>btn.style.display='none');
initCardSelector();
window.addEventListener('resize',sizeCardSelector);
const _carouselSel=document.getElementById('cardSelector');
_carouselSel.addEventListener('mouseenter',()=>{ _carouselPaused=true; });
_carouselSel.addEventListener('mouseleave',()=>{ _carouselPaused=false; });
_carouselSel.addEventListener('touchstart',()=>{ stopCarousel(); },{passive:true});
// mouse drag scroll
let _mDragActive=false,_mDragX=0,_mDragSL=0;
_carouselSel.addEventListener('mousedown',e=>{ if(e.button!==0) return; _mDragActive=true; _mDragX=e.pageX; _mDragSL=_carouselSel.scrollLeft; stopCarousel(); e.preventDefault(); });
window.addEventListener('mousemove',e=>{ if(!_mDragActive) return; _carouselSel.scrollLeft=_mDragSL-(_mDragX-e.pageX); });
window.addEventListener('mouseup',()=>{ if(_mDragActive){ _mDragActive=false; startCarousel(); } });

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
window.clearAllSkipped=clearAllSkipped;
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
window.saveSettingsProfile=saveSettingsProfile;
window.saveSettingsPassword=saveSettingsPassword;
window.saveSettingsCards=saveSettingsCards;
window.filterSettingsCards=filterSettingsCards;
window.scheduleMonthlyReminder=scheduleMonthlyReminder;
window.isSkipped=isSkipped;
window.renderRecap=renderRecap;
window.setSnoozedBenefit=setSnoozedBenefit;
window.openSnoozeModal=openSnoozeModal;
window.closeSnoozeModal=closeSnoozeModal;
function updateMonthTabLabel(){
  const offset=state._periodOffset||0;
  const absM=CY*12+CM+offset;
  const viewM=absM%12;
  const el=document.getElementById('currentTab');
  const nextBtn=document.getElementById('monthNextBtn');
  if(el) el.textContent=offset===0?'Month':MONTHS[viewM];
  if(nextBtn) nextBtn.style.visibility=offset<0?'visible':'hidden';
}
window.setPeriodOffset=(offset)=>{ state._periodOffset=offset; updateMonthTabLabel(); renderCurrent(); };
