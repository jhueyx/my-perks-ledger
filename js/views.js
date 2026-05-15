import { CARDS, MONTHS, MONTHS_FULL, CARD_LABELS, CARD_CLS, BENEFIT_CATEGORIES, POINTS_MULTIPLIERS } from './cards.js';
import { state, CY, CM, escapeHtml } from './state.js';
import { isUsed, isCredited, toggleCredited, getEffectiveAmount, getNote, getPartialUsed, loadNotes, saveNotes, getNoteKey, isSkipped, isGloballySnoozed, isMonthSnoozed, getSnoozedUntil, getCardFeeMonth, getCardFeeDay } from './storage.js';
import {
  getCardYearStart, getCardYearPeriods, getYTDPeriods, isPFuture, isPCurrent, isYTDCurrent,
  getCurrentPK, getCurrentLabel, getBAmount, getFee, isBExpired, isBNotAvailable,
  calcStats, metricsHTML, progressHTML, getStreak, daysUntilFee, daysUntilEOM,
  getUnclaimedMonthly, maxCardYearValue, calcCapturedByType, getCardYearMonthsElapsed,
  getProjectedCapture, getROIGrade
} from './periods.js';

// ── Helpers ────────────────────────────────────────────────────────────────
export function getVisibleCardKeys(){
  const base=(state.userCards&&state.userCards.length?state.userCards:['csr','gold','platinum','cap1_venture_x']).filter(c=>!!CARDS[c]);
  try{
    const saved=JSON.parse(localStorage.getItem('perks-card-order')||'[]');
    if(saved.length){
      const set=new Set(base);
      const ordered=saved.filter(k=>set.has(k));
      const rest=base.filter(k=>!saved.includes(k));
      return [...ordered,...rest];
    }
  }catch(e){}
  return base;
}

export function set(html){
  const main=document.getElementById('main');
  main.classList.add('transitioning');
  setTimeout(()=>{ main.innerHTML=html; main.classList.remove('transitioning'); },180);
}

export function haptic(style='light'){
  if(!navigator.vibrate) return;
  const patterns={light:[10],medium:[20],heavy:[30],success:[10,50,20]};
  navigator.vibrate(patterns[style]||[10]);
}

export function animateCounters(){
  document.querySelectorAll('[data-count]').forEach(el=>{
    const target=parseFloat(el.dataset.count);
    const prefix=el.dataset.prefix||'',suffix=el.dataset.suffix||'';
    const duration=600,start=performance.now(),from=0;
    function update(now){
      const elapsed=now-start,progress=Math.min(elapsed/duration,1);
      const eased=1-Math.pow(1-progress,3);
      const current=from+(target-from)*eased;
      el.textContent=prefix+(Number.isInteger(target)?Math.round(current):current.toFixed(0))+suffix;
      if(progress<1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

export function launchConfetti(){
  const canvas=document.getElementById('confettiCanvas');
  const ctx=canvas.getContext('2d');
  canvas.width=window.innerWidth; canvas.height=window.innerHeight;
  const colors=['#C8922A','#2A9B6A','#4A7FA5','#D94040','#F5C542','#ffffff'];
  const pieces=Array.from({length:120},()=>({
    x:Math.random()*canvas.width,y:-10-Math.random()*100,
    r:Math.random()*6+3,d:Math.random()*3+1,
    color:colors[Math.floor(Math.random()*colors.length)],
    tilt:Math.random()*10-5,tiltAngle:0,tiltSpeed:Math.random()*0.1+0.05,
  }));
  let frame=0;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{ p.tiltAngle+=p.tiltSpeed; p.y+=p.d; p.tilt=Math.sin(p.tiltAngle)*12; ctx.beginPath(); ctx.fillStyle=p.color; ctx.ellipse(p.x+p.tilt,p.y,p.r,p.r/2,p.tiltAngle,0,2*Math.PI); ctx.fill(); });
    frame++;
    if(frame<160) requestAnimationFrame(draw);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  draw();
}

export function checkAllClaimed(cardKey){
  const card=CARDS[cardKey];
  let allDone=true;
  card.sections.forEach(s=>{
    const pk=getCurrentPK(cardKey,s.cadence);
    s.benefits.forEach(b=>{
      if(isBExpired(b,{calY:CY,calM:CM,m:CM})||isBNotAvailable(b,CY)||isGloballySnoozed(cardKey,b.id)) return;
      if(!isUsed(cardKey,b.id,pk)) allDone=false;
    });
  });
  if(allDone) launchConfetti();
}

// ── Expiry helpers ─────────────────────────────────────────────────────────
function getExpiryBadge(b){
  if(!b.expiresAfter) return '';
  const {y,h}=b.expiresAfter;
  const expMonth=h===0?5:11;
  const expAbs=y*12+expMonth,nowAbs=CY*12+CM;
  const monthsLeft=expAbs-nowAbs;
  if(monthsLeft<=0) return '';
  if(monthsLeft<=3) return `<span class="expiry-badge">ends ${MONTHS[expMonth]} ${y}</span>`;
  if(monthsLeft<=6) return `<span class="expiry-badge soon">ends ${MONTHS[expMonth]} ${y}</span>`;
  return '';
}
function getBenefitExpiryLabel(b){
  if(b.startsFrom&&CY<b.startsFrom) return '';
  const now=new Date();
  if(b.desc&&b.desc.includes('through')){
    const match=b.desc.match(/through\s+([\w]+\s+\d{4})/i);
    if(match){
      const expDate=new Date(match[1]);
      const monthsLeft=Math.round((expDate-now)/(1000*60*60*24*30));
      if(monthsLeft<=6&&monthsLeft>0) return `<span class="expiry-badge soon">⏰ ${monthsLeft}mo left</span>`;
    }
  }
  return '';
}


// ── Partial bar ────────────────────────────────────────────────────────────
function buildPartialBar(cardKey,benefitId,pk,totalAmt){
  const used=getPartialUsed(cardKey,benefitId,pk);
  const pct=Math.min(100,Math.round(used/totalAmt*100));
  return `<div class="partial-bar">
    <div class="partial-track"><div class="partial-fill" style="width:${pct}%"></div></div>
    <div class="partial-label"><span>$${used.toFixed(0)} used</span><span>$${(totalAmt-used).toFixed(0)} remaining</span></div>
    <div class="partial-input-row">
      <input class="partial-input" type="number" min="0" max="${totalAmt}" step="1"
        value="${used}" placeholder="$0"
        data-card="${cardKey}" data-id="${benefitId}" data-pk="${pk}" data-total="${totalAmt}"
        style="width:80px"/>
      <span style="font-size:11px;color:var(--text-tertiary);font-family:var(--mono)">/ $${totalAmt} total</span>
    </div>
  </div>`;
}

// ── Donut chart ────────────────────────────────────────────────────────────
function buildDonut(captured,missed,remaining,size=100){
  const total=captured+missed+remaining||1;
  const r=38,cx=50,cy=50,circ=2*Math.PI*r;
  function slice(value,offset,color){
    const pct=value/total,dash=pct*circ,gap=circ-dash;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="14" stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"/>`;
  }
  const c1=captured/total*circ,c2=missed/total*circ;
  const svg=`<svg class="donut-svg" width="${size}" height="${size}" viewBox="0 0 100 100">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border-light)" stroke-width="14"/>
    ${slice(captured,0,'var(--green)')}${slice(missed,c1,'var(--red)')}${slice(remaining,c1+c2,'rgba(200,146,42,0.3)')}
    <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle" font-size="14" font-weight="700" fill="var(--text)" font-family="DM Mono,monospace">${Math.round(captured/total*100)}%</text>
  </svg>`;
  const legend=`<div class="donut-legend">
    <div class="donut-legend-item"><span class="donut-dot" style="background:var(--green)"></span><span style="color:var(--text-secondary)">Captured <strong style="color:var(--text)">$${captured.toFixed(0)}</strong></span></div>
    <div class="donut-legend-item"><span class="donut-dot" style="background:var(--red)"></span><span style="color:var(--text-secondary)">Missed <strong style="color:var(--text)">$${missed.toFixed(0)}</strong></span></div>
    <div class="donut-legend-item"><span class="donut-dot" style="background:rgba(200,146,42,0.4)"></span><span style="color:var(--text-secondary)">Remaining <strong style="color:var(--text)">$${remaining.toFixed(0)}</strong></span></div>
  </div>`;
  return `<div class="donut-wrap">${svg}${legend}</div>`;
}

// ── Projection bar ─────────────────────────────────────────────────────────
function buildProjection(cardKey){
  const monthsElapsed=getCardYearMonthsElapsed(cardKey);
  const monthsRemaining=12-monthsElapsed;
  const {repeating,oneTime}=calcCapturedByType(cardKey);
  const projectedRepeating=monthsRemaining>0?(repeating/monthsElapsed)*monthsRemaining:0;
  const projected=oneTime+repeating+projectedRepeating;
  const fee=getFee(cardKey,CY);
  const projectedEffective=fee-projected;
  const isProfit=projected>fee;
  return `<div class="projection-bar">
    <div>
      <div style="font-size:10px;font-family:var(--mono);text-transform:uppercase;letter-spacing:0.06em;color:var(--text-tertiary);margin-bottom:2px">${CARD_LABELS[cardKey]}</div>
      <div class="projection-label">Projected year-end capture</div>
      <div style="font-size:10px;font-family:var(--mono);color:var(--text-tertiary)">at current rate · ${monthsRemaining} months left</div>
    </div>
    <div style="text-align:right">
      <div class="projection-val" style="color:${isProfit?'var(--green)':''}">$${projected.toFixed(0)}</div>
      <div style="font-size:10px;font-family:var(--mono);color:var(--text-tertiary)">${isProfit?'+$'+Math.abs(projectedEffective).toFixed(0)+' profit':'~$'+Math.abs(projectedEffective).toFixed(0)+' effective fee'}</div>
    </div>
  </div>`;
}

// ── Countdown strip ────────────────────────────────────────────────────────
function buildCountdownStrip(cardKey){
  const fee=getFee(cardKey,CY);
  if(!fee) return '';
  const days=daysUntilFee(cardKey);
  const fm=getCardFeeMonth(cardKey),fd=getCardFeeDay(cardKey);
  const {captured}=calcStats(cardKey,c=>getCardYearPeriods(cardKey,c),isPCurrent);
  const needed=Math.max(0,fee-captured);
  const cls=days<=30?'urgent':days<=90?'soon':'';
  const feeLabel=`${MONTHS[fm]} ${fd}`;
  const feeMonthShort=MONTHS[fm].toUpperCase();
  const editBtn=`<button onclick="openFeeDateModal('${cardKey}')" style="background:none;border:none;cursor:pointer;padding:2px 4px;color:var(--text-tertiary);font-size:10px;font-family:var(--mono);line-height:1" title="Edit fee date">✎</button>`;
  const calSvg=`<span style="display:inline-flex;flex-direction:column;align-items:center;justify-content:center;width:32px;height:32px;border-radius:7px;background:var(--surface);border:1px solid var(--border);overflow:hidden;line-height:1;flex-shrink:0">
    <span style="background:#e03030;color:#fff;font-size:7px;font-weight:700;font-family:var(--mono);width:100%;text-align:center;padding:1px 0;letter-spacing:0.04em">${feeMonthShort}</span>
    <span style="font-size:14px;font-weight:700;font-family:var(--font);color:var(--text);line-height:1.5">${fd}</span>
  </span>`;
  const targetSvg=`<span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;flex-shrink:0;color:var(--text-secondary)"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.6"/><circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="1.6"/><line x1="10" y1="2" x2="10" y2="5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="10" y1="15" x2="10" y2="18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="2" y1="10" x2="5" y2="10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="15" y1="10" x2="18" y2="10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></span>`;
  let html=`<div class="countdown-strip">`;
  html+=`<div class="countdown-pill ${cls}">${calSvg}<div><div style="font-size:11px;font-weight:600;color:inherit">${days}d until fee ${editBtn}</div><div style="font-size:10px;opacity:0.7">Due ${feeLabel} · $${fee}</div></div></div>`;
  if(needed>0){
    html+=`<div class="countdown-pill">${targetSvg}<div><div style="font-size:11px;font-weight:600;color:var(--text)">$${needed.toFixed(0)} to breakeven</div><div style="font-size:10px;opacity:0.7">$${captured.toFixed(0)} of $${fee} captured</div></div></div>`;
  } else {
    html+=`<div class="countdown-pill" style="border-color:var(--green)"><span style="font-size:13px;font-family:var(--mono);color:var(--green);font-weight:600">+</span><div><div style="font-size:11px;font-weight:600;color:var(--green)">$${Math.abs(fee-captured).toFixed(0)} in profit</div><div style="font-size:10px;color:var(--text-tertiary)">Fee fully offset</div></div></div>`;
  }
  html+=`</div>`;
  return html;
}

function buildBreakevenBar(cardKey){
  const fee=getFee(cardKey,CY);
  const {captured}=calcStats(cardKey,c=>getCardYearPeriods(cardKey,c),isPCurrent);
  const diff=captured-fee;
  if(diff>=0) return `<div class="breakeven-bar in-profit"><div>In profit — you've extracted more than the annual fee</div><div class="breakeven-amt">+$${diff.toFixed(0)}</div></div>`;
  return `<div class="breakeven-bar needs-more"><div>Claim <strong>$${Math.abs(diff).toFixed(0)}</strong> more to fully offset your $${fee} annual fee</div><div class="breakeven-amt">$${captured.toFixed(0)}/$${fee}</div></div>`;
}

function buildEOMWarning(cardKey){
  const days=daysUntilEOM();
  if(days>5) return '';
  const unclaimed=getUnclaimedMonthly(cardKey);
  if(!unclaimed.length) return '';
  const total=unclaimed.reduce((s,b)=>s+b.amt,0);
  const names=unclaimed.map(b=>b.name).join(', ');
  return `<div class="eom-warning"><div><strong>${days} day${days===1?'':'s'} left this month</strong> — you still have $${total.toFixed(0)} unclaimed: ${names}</div></div>`;
}

// ── All cards summary ──────────────────────────────────────────────────────
function buildAllCardsSummary(){
  let totalAvail=0,totalClaimed=0,totalFees=0;
  getVisibleCardKeys().forEach(cardKey=>{
    totalFees+=getFee(cardKey,CY);
    CARDS[cardKey].sections.forEach(s=>{
      const pk=getCurrentPK(cardKey,s.cadence);
      const p={calY:CY,calM:CM,m:CM};
      s.benefits.forEach(b=>{
        if(isBExpired(b,p)||isBNotAvailable(b,CY)||isGloballySnoozed(cardKey,b.id)) return;
        const amt=getBAmount(b,{m:CM});
        totalAvail+=amt;
        if(isUsed(cardKey,b.id,pk)) totalClaimed+=amt;
      });
    });
  });
  const effectiveFee=totalFees-totalClaimed;
  const isProfitable=totalClaimed>=totalFees;
  const feeCoveragePct=totalFees>0?Math.round(totalClaimed/totalFees*100):0;
  const remaining=totalAvail-totalClaimed;
  return `<div class="allcards-summary">
    <div class="allcards-stats-row">
      <div class="allcards-stat"><div class="allcards-stat-val green">$${totalClaimed.toFixed(0)}</div><div class="allcards-stat-label">Claimed</div></div>
      <div class="allcards-stat" style="text-align:center"><div class="allcards-stat-val ${isProfitable?'green':feeCoveragePct>=80?'gold':''}">${feeCoveragePct}%</div><div class="allcards-stat-label">Fee coverage</div></div>
      <div class="allcards-stat" style="text-align:right"><div class="allcards-stat-val" style="color:var(--text-tertiary)">$${remaining.toFixed(0)}</div><div class="allcards-stat-label">Still available</div></div>
    </div>
    <div class="allcards-track" style="position:relative;overflow:visible">
      <div class="allcards-fill-claimed" style="width:${Math.min(feeCoveragePct,115)}%;background:${isProfitable?'var(--green)':'var(--gold)'};border-radius:inherit;transition:width 0.4s ease"></div>
      ${!isProfitable?`<div style="position:absolute;top:-3px;bottom:-3px;right:0;width:2px;background:#fff;opacity:0.5;border-radius:1px"></div>`:''}
    </div>
    <div class="allcards-track-labels">
      <span>$0</span>
      <span style="color:${isProfitable?'var(--green)':'var(--text-tertiary)'}">${isProfitable?'In profit +$'+Math.abs(effectiveFee).toFixed(0):'Break-even at $'+totalFees}</span>
      <span>${isProfitable?'':'$'+totalFees}</span>
    </div>
  </div>`;
}

function buildLiveBanner(){
  const items=buildPriorityQueue();
  if(!items.length) return '';
  const top=items[0];
  const eomDays=daysUntilEOM();
  const urgency=eomDays<=3?`${eomDays}d left`:eomDays<=7?`${eomDays}d left`:'This month';
  return `<div class="live-banner" onclick="setActiveView('this-period')">
    <div class="live-banner-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
    <div><div class="live-banner-title">Use next: ${top.name}</div><div class="live-banner-sub">${top.card} · ${urgency}</div></div>
    <div class="live-banner-amt">$${top.amt}</div>
  </div>`;
}

function buildCategoryBreakdown(){
  const cats={dining:0,travel:0,shopping:0,fitness:0,entertainment:0,other:0};
  const catColors={dining:'#C86428',travel:'var(--plat)',shopping:'var(--gold)',fitness:'var(--green)',entertainment:'#9333ea',other:'var(--text-tertiary)'};
  Object.keys(CARDS).forEach(cardKey=>{
    CARDS[cardKey].sections.forEach(s=>{
      const pk=getCurrentPK(cardKey,s.cadence);
      s.benefits.forEach(b=>{
        if(isBNotAvailable(b,CY)||isBExpired(b,{calY:CY,calM:CM,m:CM})||isGloballySnoozed(cardKey,b.id)) return;
        if(!isUsed(cardKey,b.id,pk)) return;
        const cat=BENEFIT_CATEGORIES[b.id]||'other';
        cats[cat]+=getBAmount(b,{m:CM});
      });
    });
  });
  const total=Object.values(cats).reduce((a,b)=>a+b,0)||1;
  const sorted=Object.entries(cats).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
  if(!sorted.length) return '';
  const catIcons={dining:'Dining',travel:'Travel',shopping:'Shopping',fitness:'Fitness',entertainment:'Ent.',other:'Other'};
  let html=`<div style="font-size:11px;font-family:var(--mono);color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">Claimed by category</div>`;
  sorted.forEach(([cat,val])=>{
    const pct=Math.round(val/total*100);
    html+=`<div class="cat-row"><div class="cat-name">${catIcons[cat]} ${cat}</div><div class="cat-bar-wrap"><div class="cat-bar-fill" style="width:${pct}%;background:${catColors[cat]}"></div></div><div class="cat-val">$${val.toFixed(0)}</div></div>`;
  });
  return `<div class="cat-breakdown">${html}</div>`;
}

// ── Priority queue ─────────────────────────────────────────────────────────
function buildPriorityQueue(){
  const eomDays=daysUntilEOM();
  const items=[];
  (state.userCards||[]).filter(k=>CARDS[k]).forEach(cardKey=>{
    const card=CARDS[cardKey];
    card.sections.forEach(s=>{
      const pk=getCurrentPK(cardKey,s.cadence);
      const p={calY:CY,calM:CM,m:CM};
      s.benefits.forEach(b=>{
        if(isBExpired(b,p)||isBNotAvailable(b,CY)) return;
        if(isUsed(cardKey,b.id,pk)) return;
        if(isSkipped(cardKey,b.id,pk)) return;
        if(isGloballySnoozed(cardKey,b.id)) return;
        const amt=getBAmount(b,{m:CM});
        let urgency=0,urgencyLabel='Anytime',urgencyCls='urgency-ok',tier=1;
        if(s.cadence==='monthly'){
          urgency=40+(1-eomDays/31)*55;
          urgencyLabel=eomDays<=7?'Expires soon':'This month';
          urgencyCls=eomDays<=7?'urgency-fire':'urgency-soon';
          tier=3;
        } else if(s.cadence==='quarterly'){
          const dayOfQ=(CM%3)*30+new Date().getDate();
          urgency=20+(dayOfQ/92)*40;
          urgencyLabel='This quarter';
          urgencyCls=urgency>50?'urgency-soon':'urgency-ok';
          tier=2;
        } else if(s.cadence==='cal-semi-annual'||s.cadence==='semi-annual'){
          const dayOfH=(CM%6)*30+new Date().getDate();
          urgency=20+(dayOfH/182)*40;
          urgencyLabel='This half';
          urgencyCls=urgency>50?'urgency-soon':'urgency-ok';
          tier=2;
        } else if(s.cadence==='annual'){
          urgency=10; urgencyLabel='This card year'; tier=1;
        } else if(s.cadence==='cal-annual'){
          urgency=10; urgencyLabel='This calendar year'; tier=1;
        } else if(s.cadence==='feb-annual'){
          urgency=10; urgencyLabel='This travel year'; tier=1;
        } else { urgency=10; urgencyLabel='This period'; tier=1; }
        const score=tier*1000+urgency*Math.log(amt+1);
        items.push({cardKey,benefitId:b.id,pk,name:b.name,card:CARD_LABELS[cardKey],amt,urgency,urgencyLabel,urgencyCls,score,cadence:s.cadence});
      });
    });
  });
  return items.sort((a,b)=>b.score-a.score);
}

// ── Card back ──────────────────────────────────────────────────────────────
export function buildCardBack(cardKey){
  const card=CARDS[cardKey];
  const benefits=[];
  card.sections.forEach(s=>{
    const pk=getCurrentPK(cardKey,s.cadence);
    s.benefits.forEach(b=>{
      if(isBNotAvailable(b,CY)||isBExpired(b,{calY:CY,calM:CM,m:CM})||isGloballySnoozed(cardKey,b.id)) return;
      benefits.push({name:b.name,amt:getBAmount(b,{m:CM}),used:isUsed(cardKey,b.id,pk)});
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
      ${multipliers.map(m=>`<div style="display:flex;justify-content:space-between;align-items:flex-start;padding:3px 0;border-bottom:0.5px solid rgba(255,255,255,0.08);gap:6px"><span style="font-size:8px;opacity:0.75;line-height:1.3;flex:1">${m.cat}</span><span style="font-size:11px;font-weight:700;font-family:var(--mono);color:var(--green);flex-shrink:0">${m.pts}</span></div>`).join('')}
    </div>
    <div style="font-size:8px;font-family:var(--mono);color:rgba(255,255,255,0.3);text-align:center">double-tap to flip back</div>
  </div>`;
}

// ── Render: this period ────────────────────────────────────────────────────
export function renderCurrent(){
  const card=CARDS[state.activeCard];
  const offset=state._periodOffset||0;
  const absMonth=CY*12+CM+offset;
  const viewY=Math.floor(absMonth/12);
  const viewM=absMonth%12;
  const isHistory=offset<0;
  const monthPK=`${viewY}-m${viewM}`;

  let totalNow=0,usedNow=0;
  card.sections.forEach(s=>{ if(s.cadence!=='monthly') return; s.benefits.forEach(b=>{ if(isBExpired(b,{calY:viewY,calM:viewM,m:viewM})||isBNotAvailable(b,viewY)||isGloballySnoozed(state.activeCard,b.id)) return; totalNow+=getBAmount(b,{m:viewM}); if(isUsed(state.activeCard,b.id,monthPK)) usedNow+=getBAmount(b,{m:viewM}); }); });
  const pct=totalNow>0?Math.round(usedNow/totalNow*100):0;
  const {captured}=calcStats(state.activeCard,c=>getCardYearPeriods(state.activeCard,c),isPCurrent);
  const effectiveFee=getFee(state.activeCard,CY)-captured;

  // month nav bar
  const prevAbsM=absMonth-1;
  const prevY=Math.floor(prevAbsM/12),prevM=prevAbsM%12;
  let html=`<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
    <button onclick="window.setPeriodOffset(${offset-1})" style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:5px 10px;font-size:12px;font-family:var(--mono);cursor:pointer;color:var(--text)">← ${MONTHS[prevM]} ${prevY}</button>
    ${isHistory?`<button onclick="window.setPeriodOffset(0)" style="background:var(--gold);color:#000;border:none;border-radius:8px;padding:5px 10px;font-size:11px;font-family:var(--mono);cursor:pointer;font-weight:600">Back to current</button>`:'<span style="flex:1"></span>'}
    ${isHistory&&offset<-1?`<button onclick="window.setPeriodOffset(${offset+1})" style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:5px 10px;font-size:12px;font-family:var(--mono);cursor:pointer;color:var(--text)">${MONTHS[CM]} ${CY} →</button>`:''}
  </div>`;
  if(isHistory) html+=`<div style="background:rgba(200,146,42,0.12);border:1px solid rgba(200,146,42,0.3);border-radius:8px;padding:8px 12px;font-size:12px;font-family:var(--mono);color:var(--gold);margin-bottom:10px">Viewing history: <strong>${MONTHS_FULL[viewM]} ${viewY}</strong></div>`;

  if(!isHistory){
    html+=buildCountdownStrip(state.activeCard);
    html+=buildEOMWarning(state.activeCard);
    html+=buildBreakevenBar(state.activeCard);
  }
  html+=metricsHTML(isHistory?`${MONTHS_FULL[viewM]}`:'This month',`$${totalNow.toFixed(0)}`,'Claimed',`$${usedNow.toFixed(0)}`,'This card year',`$${captured.toFixed(0)}`,'Effective fee',`${effectiveFee<=0?'<span style="color:var(--green)">$'+Math.abs(effectiveFee).toFixed(0)+' profit!</span>':'$'+effectiveFee.toFixed(0)}`);
  if(totalNow>0) html+=progressHTML(pct,'',`${MONTHS_FULL[viewM]} ${viewY}: $${usedNow.toFixed(0)} of $${totalNow.toFixed(0)} claimed`);
  if(!isHistory) html+=`<div class="period-note">Use it now — <strong>${MONTHS_FULL[CM]} ${CY}</strong></div>`;

  const CADENCE_THIS={'monthly':'This month','quarterly':'This quarter','semi-annual':'This half','cal-semi-annual':'This half','annual':'This card year','cal-annual':'This year','feb-annual':'This year'};
  card.sections.forEach(s=>{
    const isMonthly=s.cadence==='monthly';
    const pk=isMonthly?monthPK:getCurrentPK(state.activeCard,s.cadence);
    const lbl=isMonthly?`${MONTHS_FULL[viewM]} ${viewY}`:getCurrentLabel(state.activeCard,s.cadence);
    const pY=isMonthly?viewY:CY,pM=isMonthly?viewM:CM;
    const currentP={calY:pY,calM:pM,m:pM};
    const visibleBenefits=s.benefits.filter(b=>!isBExpired(b,currentP)&&!isBNotAvailable(b,pY));
    if(!visibleBenefits.length) return;
    if(isHistory&&!isMonthly) return; // in history mode, only show monthly section
    const allClaimed=visibleBenefits.every(b=>isUsed(state.activeCard,b.id,pk));
    const claimedCount=visibleBenefits.filter(b=>isUsed(state.activeCard,b.id,pk)).length;
    const sectionKey=`current-${state.activeCard}-${s.cadence}`;
    const isCollapsed=state._collapsedCurrentSections.has(sectionKey);
    const indicator=allClaimed?`<span style="color:var(--green);font-size:12px">✓</span>`:`<span style="font-size:13px;color:var(--text-tertiary);display:inline-block;transform:rotate(${isCollapsed?'-90deg':'0deg'});transition:transform 0.2s">▾</span>`;
    const countBadge=allClaimed?`<span style="font-size:10px;font-family:var(--mono);color:var(--green);background:rgba(42,155,106,0.1);padding:1px 7px;border-radius:100px">${claimedCount}/${visibleBenefits.length} ✓</span>`:`<span style="font-size:10px;font-family:var(--mono);color:var(--text-tertiary);background:var(--border-light);padding:1px 7px;border-radius:100px">${claimedCount}/${visibleBenefits.length}</span>`;
    const sectionTitle=isMonthly&&isHistory?`${MONTHS_FULL[viewM]} ${viewY}`:(CADENCE_THIS[s.cadence]||s.label);
    html+=`<div class="section-header collapsible-header" data-section-key="${sectionKey}" style="cursor:pointer;user-select:none">
      <div style="display:flex;align-items:center;gap:8px">${indicator}<span class="section-title" style="color:${allClaimed?'var(--text-tertiary)':''}">${sectionTitle}</span>${countBadge}</div>
      <span class="section-period">${lbl}</span>
    </div>`;
    if(!isCollapsed){
      visibleBenefits.forEach(b=>{
        const used=isUsed(state.activeCard,b.id,pk);
        const credited=isCredited(state.activeCard,b.id,pk);
        const snoozed=isGloballySnoozed(state.activeCard,b.id);
        const snoozedUntil=getSnoozedUntil(state.activeCard,b.id);
        const streak=s.cadence==='monthly'?getStreak(state.activeCard,b.id):0;
        const streakBadge=streak>=2?`<span class="streak-badge">${streak} mo streak</span>`:'';
        const expiryBadge=getExpiryBadge(b)+getBenefitExpiryLabel(b);
        const catTag='';
        const effectiveAmt=getEffectiveAmount(state.activeCard,b.id,getBAmount(b,{m:viewM}));
        const dispAmt=b.note&&b.amount===0?b.note:`$${effectiveAmt}`;
        const note=getNote(state.activeCard,b.id,pk);
        const noteHTML=note?`<div class="benefit-note" data-id="${b.id}" data-pk="${pk}" data-name="${b.name}"><span class="note-dot"></span>${escapeHtml(note)}</div>`:`<div class="add-note" data-id="${b.id}" data-pk="${pk}" data-name="${b.name}">+ add note</div>`;
        const partialHTML=b.partial&&used?buildPartialBar(state.activeCard,b.id,pk,effectiveAmt):'';
        const creditedHTML=used?`<div style="margin-top:4px;font-size:10px;font-family:var(--mono)"><span style="color:${credited?'var(--green)':'var(--text-tertiary)'};cursor:pointer" data-credit-id="${b.id}" data-credit-pk="${pk}">${credited?'✓ Credit posted':'○ Credit pending'}</span></div>`:'';
        const snoozedBadge=snoozed?`<span style="font-size:10px;font-family:var(--mono);color:var(--text-tertiary);margin-top:3px;display:block">⏸ snoozed until ${snoozedUntil} · <span style="cursor:pointer;text-decoration:underline" data-unsnooze="${b.id}" data-unsnooze-card="${state.activeCard}">resume</span></span>`:'';
        const snoozeBtn=!snoozed?`<button class="snooze-btn" data-snooze-id="${b.id}" data-snooze-card="${state.activeCard}" data-snooze-name="${b.name}" title="Snooze this benefit — hide from all calculations until a chosen month" style="background:none;border:none;cursor:pointer;font-size:12px;padding:2px 5px;color:var(--text-tertiary);opacity:0.25;transition:opacity 0.15s;line-height:1;border-radius:3px;flex-shrink:0" aria-label="Snooze benefit">⏸</button>`:'';
        html+=`<div class="benefit-row${used?' used':''}${snoozed?' snoozed-row':''}" style="${snoozed?'opacity:0.45;':''}">
          <div style="flex:1">
            <div class="benefit-name">${b.name}${catTag}${streakBadge}${expiryBadge}</div>
            <div class="benefit-desc">${b.desc}</div>
            ${snoozedBadge}${!snoozed?noteHTML:''}${partialHTML}${creditedHTML}
          </div>
          <div style="display:flex;align-items:center;gap:4px">${snoozeBtn}<div class="benefit-amt">${dispAmt}</div></div>
          <button class="check-btn${used?' checked':''}" data-id="${b.id}" data-pk="${pk}"></button>
        </div>`;
      });
    }
  });

  set(html);
  document.querySelectorAll('.benefit-note,.add-note').forEach(el=>el.addEventListener('click',()=>{
    window.openNoteModal(state.activeCard,el.dataset.id,el.dataset.pk,el.dataset.name);
  }));
  document.querySelectorAll('.partial-input').forEach(inp=>inp.addEventListener('change',()=>{
    const amt=Math.min(parseFloat(inp.value)||0,parseFloat(inp.dataset.total));
    window.setPartialUsed(inp.dataset.card,inp.dataset.id,inp.dataset.pk,amt);
    renderCurrent();
  }));
  document.querySelectorAll('[data-credit-id]').forEach(el=>el.addEventListener('click',()=>{
    toggleCredited(state.activeCard,el.dataset.creditId,el.dataset.creditPk);
    renderCurrent();
  }));
}

// ── Render: history / summary base ────────────────────────────────────────
export function renderHistBase(getPsFn,isCurFn,bannerHTML){
  const card=CARDS[state.activeCard];
  let html=bannerHTML+`<div class="legend"><span class="legend-item"><span class="dot dot-used" style="width:13px;height:13px"></span>Used</span><span class="legend-item"><span class="dot dot-missed" style="width:13px;height:13px"></span>Missed</span><span class="legend-item"><span class="dot dot-current" style="width:13px;height:13px"></span>Current</span><span class="legend-item"><span class="dot dot-future" style="width:13px;height:13px"></span>Future</span></div><div class="period-note">Click any past or current dot to toggle used / missed.</div>`;
  card.sections.forEach(s=>{
    const ps=getPsFn(s.cadence);
    const visibleBenefits=s.benefits.filter(b=>!isBNotAvailable(b,state.selectedYear)&&!isGloballySnoozed(state.activeCard,b.id));
    if(!visibleBenefits.length) return;
    html+=`<div class="section-header"><span class="section-title">${s.label} benefits</span></div>`;
    visibleBenefits.forEach(b=>{
      html+=`<div class="hist-row"><div><div class="hist-name">${b.name}</div><div class="hist-sub">${b.decAmount?`$${b.amount}/mo · $${b.decAmount} Dec`:`$${b.amount}/${s.cadence==='semi-annual'||s.cadence==='cal-semi-annual'?'half':s.cadence==='monthly'?'mo':s.cadence==='quarterly'?'qtr':'yr'}`}</div></div><div class="dots-row">`;
      ps.forEach(p=>{
        if(isBExpired(b,p)) return;
        const fut=isPFuture(p),cur=isCurFn(s.cadence,p),used=isUsed(state.activeCard,b.id,p.pk);
        const cls=fut?'dot-future':used?'dot-used':cur?'dot-current':'dot-missed';
        const clickable=!fut;
        const title=fut?`${p.lbl}: upcoming`:used?`${p.lbl}: used — click to unmark`:`${p.lbl}: ${cur?'not yet used':'missed'} — click to mark used`;
        html+=`<button class="dot-btn${clickable?'':' no-click'}" data-id="${b.id}" data-pk="${p.pk}" data-c="${clickable}" title="${title}"><span class="dot ${cls}"></span><span class="dot-lbl">${p.lbl}</span></button>`;
      });
      html+=`</div></div>`;
    });
  });
  set(html);
}

export function renderSummBase(getPsFn,isCurFn,bannerHTML,label){
  const card=CARDS[state.activeCard];
  const {captured,missed,total}=calcStats(state.activeCard,getPsFn,isCurFn);
  const fee=getFee(state.activeCard,state.selectedYear);
  const remaining=total-captured-missed;
  const effectiveFee=fee-captured;
  const feePct=fee>0?Math.min(100,Math.round(captured/fee*100)):0;
  const totalPct=total>0?Math.round(captured/total*100):0;
  let html=bannerHTML;
  html+=buildDonut(captured,missed,Math.max(0,remaining));
  html+=metricsHTML(`Total ${label} value`,`$${total.toFixed(0)}`,'Captured',`$${captured.toFixed(0)}`,'Missed',`$${missed.toFixed(0)}`,'Effective fee',`${effectiveFee<=0?'<span style="color:var(--green)">$'+Math.abs(effectiveFee).toFixed(0)+' profit!</span>':'$'+effectiveFee.toFixed(0)}`);
  html+=`<div class="progress-wrap">
    <div style="display:flex;justify-content:space-between;font-size:10px;font-family:var(--mono);color:var(--text-tertiary);margin-bottom:4px"><span>Fee coverage</span><span>${feePct}% of $${fee} fee</span></div>
    <div class="progress-track" style="margin-bottom:8px"><div class="progress-fill" style="width:${feePct}%;background:${effectiveFee<=0?'var(--green)':'var(--gold)'}"></div></div>
    <div style="display:flex;justify-content:space-between;font-size:10px;font-family:var(--mono);color:var(--text-tertiary);margin-bottom:4px"><span>Benefit capture rate</span><span>${totalPct}% of $${total.toFixed(0)} available</span></div>
    <div class="progress-track"><div class="progress-fill" style="width:${totalPct}%"></div></div>
  </div>`;
  html+=`<div class="summary-table">`;
  card.sections.forEach(s=>{
    s.benefits.forEach(b=>{
      const ps=getPsFn(s.cadence);
      if(isBNotAvailable(b,state.selectedYear)) return;
      if(isBExpired(b,{calY:state.selectedYear,calM:11,m:11})) return;
      const snoozed=isGloballySnoozed(state.activeCard,b.id);
      const snoozedUntil=getSnoozedUntil(state.activeCard,b.id);
      const cadLbl=s.cadence==='semi-annual'||s.cadence==='cal-semi-annual'?'half':s.cadence==='monthly'?'mo':s.cadence==='quarterly'?'qtr':'yr';
      const amtLbl=b.decAmount?`$${b.amount}–$${b.decAmount}/mo`:`$${b.amount}/${cadLbl}`;
      const expiredTag=b.expiresAfter?`<span style="font-size:10px;color:var(--red);margin-left:4px">ends Jun 2026</span>`:'';
      if(snoozed){
        html+=`<div class="summary-row-item" style="opacity:0.45"><div><span class="summary-item-name">${b.name}</span>${expiredTag}<span class="summary-item-cadence">${amtLbl}</span><span style="font-size:10px;font-family:var(--mono);color:var(--text-tertiary);margin-left:6px">⏸ until ${snoozedUntil} · <span style="cursor:pointer;text-decoration:underline" data-unsnooze="${b.id}" data-unsnooze-card="${state.activeCard}">resume</span></span></div></div>`;
        return;
      }
      let bc=0,bm=0,bl=0;
      ps.forEach(p=>{
        if(isBExpired(b,p)) return;
        const fut=isPFuture(p),cur=isCurFn(s.cadence,p),used=isUsed(state.activeCard,b.id,p.pk),amt=getBAmount(b,p);
        if(used) bc+=amt; else if(!fut&&!cur) bm+=amt; else bl+=amt;
      });
      const snoozeBtn=`<button class="snooze-btn" data-snooze-id="${b.id}" data-snooze-card="${state.activeCard}" data-snooze-name="${b.name}" title="Snooze this benefit" style="background:none;border:none;cursor:pointer;font-size:11px;padding:1px 4px;color:var(--text-tertiary);opacity:0.3;transition:opacity 0.15s;line-height:1;border-radius:3px;flex-shrink:0" aria-label="Snooze benefit">⏸</button>`;
      html+=`<div class="summary-row-item"><div><span class="summary-item-name">${b.name}</span>${expiredTag}<span class="summary-item-cadence">${amtLbl}</span></div><div class="badges" style="display:flex;align-items:center;gap:4px">${bc>0?`<span class="badge-captured">+$${bc.toFixed(0)}</span>`:''}${bm>0?`<span class="badge-missed">−$${bm.toFixed(0)} missed</span>`:''}${bl>0?`<span class="badge-left">$${bl.toFixed(0)} left</span>`:''}${snoozeBtn}</div></div>`;
    });
  });
  html+=`</div>`;
  set(html);
}

// ── Render: all cards ──────────────────────────────────────────────────────
export function renderAllCards(){
  const CARD_KEYS=getVisibleCardKeys();
  const CADENCE_ORDER=['monthly','quarterly','cal-semi-annual','semi-annual','feb-annual','cal-annual','annual'];
  const CADENCE_LABELS={
    'monthly':`Monthly — ${MONTHS_FULL[CM]} ${CY}`,
    'quarterly':`Quarterly — Q${Math.floor(CM/3)+1} ${CY}`,
    'cal-semi-annual':CM<6?`Semi-annual — Jan–Jun ${CY}`:`Semi-annual — Jul–Dec ${CY}`,
    'semi-annual':'Semi-annual (card-year)',
    'feb-annual':`Annual — Feb ${CM>=1?CY:CY-1}–Jan ${CM>=1?CY+1:CY}`,
    'cal-annual':`Annual — ${CY}`,
    'annual':'Annual (card-year)',
  };
  const byPeriod={},byPeriodTotal={};
  CADENCE_ORDER.forEach(c=>{ byPeriod[c]=[]; byPeriodTotal[c]=0; });
  let grandTotal=0;
  CARD_KEYS.forEach(cardKey=>{
    CARDS[cardKey].sections.forEach(s=>{
      const pk=getCurrentPK(cardKey,s.cadence);
      s.benefits.forEach(b=>{
        if(isBExpired(b,{calY:CY,calM:CM,m:CM})||isBNotAvailable(b,CY)||isGloballySnoozed(cardKey,b.id)) return;
        byPeriodTotal[s.cadence]=(byPeriodTotal[s.cadence]||0)+1;
        const used=isUsed(cardKey,b.id,pk);
        if(!used){
          const amt=getBAmount(b,{m:CM});
          byPeriod[s.cadence].push({cardKey,cardLabel:CARD_LABELS[cardKey],cardCls:CARD_CLS[cardKey],name:b.name,amt});
          grandTotal+=amt;
        }
      });
    });
  });
  let html='';
  html+=buildAllCardsSummary();
  html+=buildLiveBanner();
  html+=`<div class="grand-total-row" style="margin-top:0;margin-bottom:16px"><span class="grand-total-label">Total available to collect</span><span class="grand-total-amt">$${grandTotal.toFixed(0)}</span></div>`;
  let anyShown=false;
  CADENCE_ORDER.forEach(cadence=>{
    const items=byPeriod[cadence]||[];
    const totalCount=byPeriodTotal[cadence]||0;
    if(totalCount===0) return;
    anyShown=true;
    const allClaimed=items.length===0;
    const periodTotal=items.reduce((s,i)=>s+i.amt,0);
    const isCollapsed=state._collapsedSections.has(cadence);
    const indicator=allClaimed?`<span style="color:var(--green);font-size:12px;line-height:1">✓</span>`:`<span style="font-size:13px;color:var(--text-tertiary);display:inline-block;transform:rotate(${isCollapsed?'-90deg':'0deg'});transition:transform 0.2s">▾</span>`;
    const claimedCount=totalCount-items.length;
    html+=`<div class="all-cards-header collapsible-header" data-cadence="${cadence}" style="cursor:pointer;user-select:none">
      <div style="display:flex;align-items:center;gap:8px">
        ${indicator}
        <span style="font-size:11px;font-weight:600;font-family:var(--mono);text-transform:uppercase;letter-spacing:0.06em;color:${allClaimed?'var(--text-tertiary)':'var(--text-secondary)'}">${CADENCE_LABELS[cadence]||cadence}</span>
        <span style="font-size:10px;font-family:var(--mono);color:${allClaimed?'var(--green)':'var(--text-tertiary)'};background:${allClaimed?'rgba(42,155,106,0.1)':'var(--border-light)'};padding:1px 7px;border-radius:100px">${allClaimed?`${claimedCount}/${totalCount} ✓`:`${items.length} left`}</span>
      </div>
      <span class="all-cards-subtotal" style="color:${allClaimed?'var(--green)':''}">${allClaimed?'All claimed ✓':`$${periodTotal.toFixed(0)} left`}</span>
    </div>`;
    if(!allClaimed){
      const bodyId=`section-body-${cadence}`;
      html+=`<div id="${bodyId}" style="overflow:hidden;transition:max-height 0.25s ease,opacity 0.25s ease;max-height:${isCollapsed?'0':'2000px'};opacity:${isCollapsed?'0':'1'}">`;
      items.forEach(item=>{
        html+=`<div class="avail-row"><div><div class="avail-name">${item.name}</div><div class="avail-period"><span class="all-cards-card-name ${item.cardCls}" style="font-size:10px;text-transform:none;letter-spacing:0;font-weight:600">${item.cardLabel}</span></div></div><div class="avail-amt">$${item.amt.toFixed(0)}</div></div>`;
      });
      html+=`</div>`;
    }
  });
  if(!anyShown) html+=`<div style="text-align:center;padding:32px;color:var(--text-tertiary);font-size:13px">All visible card benefits claimed!</div>`;
  html+=`<div style="font-size:10px;font-family:var(--mono);color:var(--text-tertiary);text-align:center;margin-top:12px">Active periods only · switch to a card tab to mark benefits used</div>`;
  set(html);
}

// ── Heatmap HTML builder (shared by Insights and standalone view) ──────────
function buildHeatmapHTML(){
  const CARD_KEYS=getVisibleCardKeys();
  let html='';
  html+=`<p style="font-size:11px;color:var(--text-tertiary);font-family:var(--mono);margin:0 0 10px">drag rows to reorder</p>`;
  const CELL_W=42,CELL_H=36,LABEL_W=88;
  const minW=LABEL_W+(CELL_W+3)*12;
  html+=`<div style="overflow-x:auto;-webkit-overflow-scrolling:touch"><div style="min-width:${minW}px">`;
  // header row
  html+=`<div style="display:flex;align-items:center;gap:3px;margin-bottom:3px">`;
  html+=`<div style="width:${LABEL_W}px;flex-shrink:0"></div>`;
  for(let m=0;m<12;m++) html+=`<div style="width:${CELL_W}px;flex-shrink:0;text-align:center;font-size:10px;font-family:var(--mono);color:var(--text-tertiary);padding:4px 0">${MONTHS[m]}</div>`;
  html+=`</div>`;
  CARD_KEYS.forEach(cardKey=>{
    const card=CARDS[cardKey];
    const {year:fy,month:fm}=getCardYearStart(cardKey,CY);
    const monthData=Array.from({length:12},()=>({total:0,claimed:0}));
    card.sections.forEach(s=>{
      const cadence=s.cadence||'monthly';
      const addAmt=(displayM,b,pk)=>{ if(isMonthSnoozed(cardKey,b.id,CY,displayM)) return; const amt=b.amount||0; monthData[displayM].total+=amt; if(isUsed(cardKey,b.id,pk)) monthData[displayM].claimed+=amt; };
      if(cadence==='monthly'){
        for(let m=0;m<12;m++){ const pk=`${CY}-m${m}`; s.benefits.forEach(b=>{ if(isBNotAvailable(b,CY)||isBExpired(b,{calY:CY,calM:m,m})) return; addAmt(m,b,pk); }); }
      } else if(cadence==='quarterly'){
        [[2,0],[5,1],[8,2],[11,3]].forEach(([displayM,q])=>{ const pk=`${CY}-q${q}`; s.benefits.forEach(b=>{ if(isBNotAvailable(b,CY)) return; addAmt(displayM,b,pk); }); });
      } else if(cadence==='cal-semi-annual'){
        [[5,0],[11,1]].forEach(([displayM,h])=>{ const pk=`${CY}-h${h}`; s.benefits.forEach(b=>{ if(isBNotAvailable(b,CY)) return; addAmt(displayM,b,pk); }); });
      } else if(cadence==='semi-annual'){
        const pkH1=`cy-${fy}-${fm}-h1`,pkH2=`cy-${fy}-${fm}-h2`;
        s.benefits.forEach(b=>{ if(isBNotAvailable(b,CY)) return; addAmt(5,b,pkH1); addAmt(11,b,pkH2); });
      } else if(cadence==='annual'){
        const pk=`cy-${fy}-${fm}-annual`;
        s.benefits.forEach(b=>{ if(isBNotAvailable(b,CY)) return; addAmt(11,b,pk); });
      } else if(cadence==='cal-annual'){
        const pk=`${CY}-annual`;
        s.benefits.forEach(b=>{ if(isBNotAvailable(b,CY)) return; addAmt(11,b,pk); });
      } else if(cadence==='feb-annual'){
        const febY=CM>=1?CY:CY-1,pk=`feb-${febY}`;
        s.benefits.forEach(b=>{ if(isBNotAvailable(b,CY)) return; addAmt(11,b,pk); });
      }
    });
    // each card is a single draggable row div
    html+=`<div data-drag-card="${cardKey}" draggable="true" style="display:flex;align-items:center;gap:3px;margin-bottom:3px;cursor:grab">`;
    html+=`<div style="width:${LABEL_W}px;flex-shrink:0;display:flex;align-items:center;gap:4px;padding-right:4px"><span class="drag-handle" style="font-size:14px;opacity:0.35;flex-shrink:0">⠿</span><span style="font-size:10px;font-family:var(--mono);color:var(--text-tertiary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${CARD_LABELS[cardKey]}</span></div>`;
    for(let m=0;m<12;m++){
      const isFut=m>CM,{total,claimed}=monthData[m];
      if(isFut){ html+=`<div style="width:${CELL_W}px;flex-shrink:0;height:${CELL_H}px;border-radius:5px;background:var(--surface);display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--text-tertiary)">–</div>`; continue; }
      if(total===0){ html+=`<div style="width:${CELL_W}px;flex-shrink:0;height:${CELL_H}px;border-radius:5px"></div>`; continue; }
      const rate=claimed/total,pct=Math.round(rate*100);
      const bg=rate===0?'var(--border-light)':rate<0.5?'rgba(220,60,60,0.6)':rate<0.9?'rgba(210,160,0,0.5)':rate<1?'rgba(210,160,0,0.85)':'#2a9b6a';
      const fg=rate>=1?'#fff':rate>0&&rate<0.5?'#fff':'var(--text)';
      html+=`<div style="width:${CELL_W}px;flex-shrink:0;height:${CELL_H}px;border-radius:5px;background:${bg};display:flex;align-items:center;justify-content:center;font-size:10px;font-family:var(--mono);color:${fg}" title="${MONTHS[m]}: $${claimed}/$${total} claimed">${pct}%</div>`;
    }
    html+=`</div>`;
  });
  html+=`</div></div>`;
  html+=`<div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap;font-size:10px;font-family:var(--mono);color:var(--text-tertiary)">
    <span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:var(--border-light);vertical-align:middle;margin-right:4px"></span>0%</span>
    <span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:rgba(220,60,60,0.55);vertical-align:middle;margin-right:4px"></span>1–49%</span>
    <span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:rgba(210,160,0,0.45);vertical-align:middle;margin-right:4px"></span>50–89%</span>
    <span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:rgba(210,160,0,0.75);vertical-align:middle;margin-right:4px"></span>90–99%</span>
    <span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:var(--green);vertical-align:middle;margin-right:4px"></span>100%</span>
  </div>`;
  return html;
}

// ── Render: heatmap ────────────────────────────────────────────────────────
export function renderHeatmap(){
  let html=`<div class="banner"><strong>Missed money heatmap</strong> — benefit capture rate by card</div>`;
  html+=buildHeatmapHTML();
  set(html);
}

// ── Render: ROI ────────────────────────────────────────────────────────────
export function renderROI(){
  const CARD_KEYS=getVisibleCardKeys();
  let html=`<div class="banner"><strong>Card ROI scores</strong> — graded on annual fee coverage</div>`;
  html+=`<p style="font-size:11px;color:var(--text-tertiary);font-family:var(--mono);margin:0 0 10px">drag cards to reorder</p>`;
  html+=`<div class="comparison-grid">`;
  CARD_KEYS.forEach(cardKey=>{
    const fee=getFee(cardKey,CY);
    const {captured}=calcStats(cardKey,c=>getCardYearPeriods(cardKey,c),isPCurrent);
    const projected=getProjectedCapture(cardKey);
    const elapsed=getCardYearMonthsElapsed(cardKey);
    const grade=getROIGrade(fee,cardKey);
    const effectiveFee=fee-captured;
    const projRatio=fee>0?projected/fee:0;
    const projGap=fee-projected;
    const verdict=projGap<=0?'→ Keep: in profit'
      :projGap<=250?`→ Keep: $${projGap.toFixed(0)} short of break-even`
      :projGap<=500?`→ Reconsider if habits don't improve`
      :`→ Consider canceling ($${projGap.toFixed(0)} gap)`;
    const verdictColor=projGap<=0?'var(--green)':projGap<=250?'var(--gold)':'var(--red)';
    const gradeDesc={A:`Projecting $${projected.toFixed(0)} — fully covering the $${fee} fee`,B:`Projecting $${projected.toFixed(0)} — $${projGap.toFixed(0)} short but within acceptable range`,C:`Projecting $${projected.toFixed(0)} — need to claim more benefits`,D:`Projecting $${projected.toFixed(0)} — well below the $${fee} fee`}[grade];
    html+=`<div class="comparison-card ${CARD_CLS[cardKey]}" data-drag-card="${cardKey}" draggable="true">
      <div class="drag-handle">⠿</div>
      <div class="comp-card-name">${CARD_LABELS[cardKey]}</div>
      <div class="roi-grade ${grade}">${grade}</div>
      <div class="roi-label">${effectiveFee<=0?'$'+Math.abs(effectiveFee).toFixed(0)+' profit so far':'$'+captured.toFixed(0)+' of $'+fee+' captured'}</div>
      <div class="roi-desc">${gradeDesc}</div>
      <div style="font-size:11px;font-family:var(--mono);font-weight:600;color:${verdictColor};margin:6px 0 2px">${verdict}</div>
      <div class="comp-divider"></div>
      <div style="font-size:11px;font-family:var(--mono);color:var(--text-tertiary)">Month ${elapsed} of 12 · $${projected.toFixed(0)} projected</div>
    </div>`;
  });
  html+=`</div>`;
  set(html);
}

// ── Render: insights ──────────────────────────────────────────────────────
export function renderInsights(){
  const notifEnabled=localStorage.getItem('perks-notif')==='1';
  const notifSupported='Notification' in window;
  const notifGranted=notifSupported&&Notification.permission==='granted';
  let html=`<div class="banner"><strong>Insights</strong> — projections, heatmap, and ROI scores</div>`;
  if(notifSupported){
    if(!notifGranted){
      html+=`<div class="notif-banner"><div style="flex:1"><strong>Enable notifications</strong> — get reminded when monthly benefits are about to expire</div><button class="notif-btn" onclick="requestNotifications()">Enable</button></div>`;
    } else {
      html+=`<div class="notif-banner" style="background:rgba(42,155,106,0.1);border-color:rgba(42,155,106,0.3);color:var(--green)">✓ Notifications enabled — you'll be reminded in the last 3 days of each month</div>`;
    }
  }
  html+=`<div class="section-header"><span class="section-title">Year-end projections</span></div>`;
  getVisibleCardKeys().forEach(ck=>{ html+=buildProjection(ck)||''; });
  html+=`<div class="section-header" style="margin-top:16px"><span class="section-title">ROI scores</span><span class="section-period">tap for details</span></div>`;
  const CARD_KEYS=getVisibleCardKeys();
  html+=`<div class="comparison-grid" style="margin-bottom:16px">`;
  CARD_KEYS.forEach(cardKey=>{
    const fee=getFee(cardKey,CY);
    const {captured}=calcStats(cardKey,c=>getCardYearPeriods(cardKey,c),isPCurrent);
    const grade=getROIGrade(fee,cardKey);
    const projected=getProjectedCapture(cardKey);
    const ratio=fee>0?Math.round(projected/fee*100):0;
    html+=`<div class="comparison-card ${CARD_CLS[cardKey]}"><div class="comp-card-name">${CARD_LABELS[cardKey]}</div><div class="roi-grade ${grade}" style="font-size:36px">${grade}</div><div class="roi-label">${ratio}% of fee covered</div></div>`;
  });
  html+=`</div>`;
  html+=`<div class="section-header" style="margin-top:16px"><span class="section-title">Missed money heatmap</span></div>`;
  html+=buildHeatmapHTML();
  set(html);
}

// ── Render: trends ─────────────────────────────────────────────────────────
export function renderTrends(){
  const CARD_KEYS=getVisibleCardKeys();
  const years=[CY-1,CY];
  const yearRange=years.length>1?`${years[0]}–${years[years.length-1]}`:`${years[0]}`;
  let html=`<div class="banner"><strong>Multi-year trends</strong> — ${yearRange} comparison</div>`;
  function capturedForYear(cardKey,y){
    const card=CARDS[cardKey];
    if(card.openedYear&&y<card.openedYear) return 0;
    let total=0;
    const lastMonth=y<CY?11:CM;
    card.sections.forEach(s=>{
      const periods=[];
      if(s.cadence==='monthly'){
        for(let m=0;m<=lastMonth;m++) periods.push({pk:`${y}-m${m}`,m,calY:y,calM:m});
      } else if(s.cadence==='quarterly'){
        const seen=new Set();
        for(let m=0;m<=lastMonth;m++){ const pk=`${y}-q${Math.floor(m/3)}`; if(!seen.has(pk)){seen.add(pk);periods.push({pk,m,calY:y,calM:m});} }
      } else if(s.cadence==='cal-semi-annual'){
        periods.push({pk:`${y}-h0`,m:0,calY:y,calM:0,endM:5,endY:y});
        if(lastMonth>=6) periods.push({pk:`${y}-h1`,m:6,calY:y,calM:6,endM:11,endY:y});
      } else if(s.cadence==='cal-annual'){
        periods.push({pk:`${y}-annual`,m:0,calY:y,calM:0});
      } else if(s.cadence==='semi-annual'){
        const fm=getCardFeeMonth(cardKey);
        periods.push({pk:`cy-${y}-${fm}-h1`,m:fm,calY:y,calM:fm,endM:(fm+5)%12,endY:fm+5>=12?y+1:y});
        periods.push({pk:`cy-${y}-${fm}-h2`,m:(fm+6)%12,calY:y,calM:(fm+6)%12,endM:(fm+11)%12,endY:fm+11>=12?y+1:y});
        if(fm>0){const pEndY=fm+11>=12?y:y-1;if(pEndY===y)periods.push({pk:`cy-${y-1}-${fm}-h2`,m:(fm+6)%12,calY:y-1,calM:(fm+6)%12,endM:(fm+11)%12,endY:pEndY});}
      } else if(s.cadence==='annual'){
        const fm=getCardFeeMonth(cardKey);
        periods.push({pk:`cy-${y}-${fm}-annual`,m:fm,calY:y,calM:fm});
      } else if(s.cadence==='feb-annual'){
        periods.push({pk:`feb-${y}`,m:1,calY:y,calM:1,endM:0,endY:y+1});
        periods.push({pk:`feb-${y-1}`,m:1,calY:y-1,calM:1,endM:0,endY:y});
      }
      s.benefits.forEach(b=>{
        if(isBNotAvailable(b,y)) return;
        periods.forEach(p=>{
          if(isBExpired(b,p)) return;
          if(isUsed(cardKey,b.id,p.pk)) total+=getBAmount(b,p);
          else if(b.partial){ const partial=getPartialUsed(cardKey,b.id,p.pk); if(partial>0) total+=partial; }
        });
      });
    });
    return total;
  }
  html+=`<p style="font-size:11px;color:var(--text-tertiary);font-family:var(--mono);margin:0 0 10px">drag cards to reorder</p>`;
  CARD_KEYS.forEach(cardKey=>{
    html+=`<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:10px;cursor:grab" data-drag-card="${cardKey}" draggable="true">`;
    html+=`<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><span class="drag-handle" style="font-size:16px">⠿</span><span style="font-size:11px;font-family:var(--mono);color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em">${CARD_LABELS[cardKey]}</span></div>`;
    const vals=years.map(y=>({y,captured:capturedForYear(cardKey,y),fee:getFee(cardKey,y)}));
    vals.forEach(({y,captured,fee})=>{
      const barPct=Math.min(100,Math.round(captured/fee*100));
      const isCurrent=y===CY,profit=captured-fee;
      const label=isCurrent?`${y} YTD`:String(y);
      html+=`<div class="trend-row"><div class="trend-year" style="color:${isCurrent?'var(--text)':'var(--text-tertiary)'}">${label}</div><div style="flex:1;position:relative"><div class="trend-bar-wrap"><div class="trend-bar-fill" style="width:${barPct}%;background:${captured>fee?'var(--blue)':captured>=fee?'var(--green)':'var(--gold)'}"></div></div></div><div class="trend-val" style="color:${profit>0?'var(--blue)':profit===0?'var(--green)':'var(--text-secondary)'}">$${captured.toFixed(0)}<span style="font-size:9px;color:var(--text-tertiary)"> / $${fee}</span></div></div>`;
    });
    html+=`</div>`;
  });
  set(html);
}

// ── Render: priority queue ─────────────────────────────────────────────────
export function renderPriorityQueue(){
  const items=buildPriorityQueue();
  const eomDays=daysUntilEOM();
  let html=`<div class="banner"><strong>Use it now</strong> — ranked by urgency × value</div>`;
  if(!items.length){ html+=`<div style="text-align:center;padding:32px;color:var(--green);font-size:14px">All current benefits claimed!</div>`; set(html); return; }
  if(eomDays<=5) html+=`<div class="eom-warning">Only ${eomDays} day${eomDays===1?'':'s'} left — monthly benefits reset soon!</div>`;
  html+=`<div style="margin-bottom:8px;font-size:11px;font-family:var(--mono);color:var(--text-tertiary)">${items.length} unclaimed benefits · sorted by urgency</div>`;
  items.forEach((item,i)=>{
    const rankCls=i===0?'urgent':i<3?'high':'normal';
    html+=`<div class="priority-row">
      <div class="priority-rank ${rankCls}" onclick="goToCardPeriod('${item.cardKey}')">${i+1}</div>
      <div style="flex:1;cursor:pointer" onclick="goToCardPeriod('${item.cardKey}')"><div style="font-size:13px;font-weight:500;color:var(--text)">${item.name}</div><div style="font-size:10px;color:var(--text-tertiary);font-family:var(--mono)">${item.card}</div></div>
      <div style="text-align:right;cursor:pointer" onclick="goToCardPeriod('${item.cardKey}')"><div style="font-size:14px;font-weight:700;font-family:var(--mono);color:var(--green)">$${item.amt}</div><span class="priority-urgency ${item.urgencyCls}">${item.urgencyLabel}</span></div>
      <button onclick="skipBenefit('${item.cardKey}','${item.benefitId}','${item.pk}')" title="Dismiss" style="margin-left:10px;background:none;border:none;cursor:pointer;color:var(--text-tertiary);font-size:16px;padding:4px;line-height:1;opacity:0.5" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.5'">×</button>
    </div>`;
  });
  set(html);
}

// ── Render: streaks ────────────────────────────────────────────────────────
export function renderStreaks(){
  const CARD_KEYS=getVisibleCardKeys();
  const allStreaks=[];
  CARD_KEYS.forEach(cardKey=>{
    CARDS[cardKey].sections.forEach(s=>{
      if(s.cadence!=='monthly') return;
      s.benefits.forEach(b=>{
        if(isBNotAvailable(b,CY)) return;
        allStreaks.push({name:b.name,card:CARD_LABELS[cardKey],streak:getStreak(cardKey,b.id)});
      });
    });
  });
  allStreaks.sort((a,b)=>b.streak-a.streak);
  let html=`<div class="banner"><strong>Streak leaderboard</strong> — consecutive months claimed</div>`;
  if(!allStreaks.length){ html+=`<div style="text-align:center;padding:32px;color:var(--text-tertiary);font-size:13px">No streaks yet — start claiming your monthly benefits!</div>`; }
  else {
    html+=`<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden">`;
    const ordinal=n=>n===1?'1st':n===2?'2nd':n===3?'3rd':`${n}th`;
    let rank=1;
    allStreaks.forEach((s,i)=>{
      if(i>0&&allStreaks[i-1].streak!==s.streak) rank=i+1;
      const medal=ordinal(rank);
      html+=`<div class="streak-row"><div><span><span style="font-size:10px;font-family:var(--mono);color:var(--text-tertiary)">${medal}</span> <span style="color:var(--text);font-weight:500">${s.name}</span></span><span class="streak-card-tag">${s.card}</span></div><div class="streak-count">${s.streak} mo</div></div>`;
    });
    html+=`</div>`;
  }
  set(html);
}

// ── Render: comparison ─────────────────────────────────────────────────────
export function renderComparison(){
  const CARD_KEYS=getVisibleCardKeys();
  let html=`<div class="banner"><strong>All cards compared</strong> — current card-year performance</div>`;
  html+=`<p style="font-size:11px;color:var(--text-tertiary);font-family:var(--mono);margin:0 0 10px">drag cards to reorder</p>`;
  html+=`<div class="comparison-grid">`;
  CARD_KEYS.forEach(cardKey=>{
    const fee=getFee(cardKey,CY);
    const mxVal=maxCardYearValue(cardKey);
    const {captured,missed}=calcStats(cardKey,c=>getCardYearPeriods(cardKey,c),isPCurrent);
    const projected=getProjectedCapture(cardKey);
    const elapsed=getCardYearMonthsElapsed(cardKey);
    const projectedFee=fee-projected;
    const days=daysUntilFee(cardKey);
    html+=`<div class="comparison-card ${CARD_CLS[cardKey]}" data-drag-card="${cardKey}" draggable="true">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px"><span class="drag-handle" style="font-size:14px">⠿</span><div class="comp-card-name" style="margin:0">${CARD_LABELS[cardKey]}</div></div>
      <div class="comp-metric"><div class="comp-metric-val green">$${captured.toFixed(0)}</div><div class="comp-metric-label">captured (mo ${elapsed})</div></div>
      <div class="comp-metric"><div class="comp-metric-val ${projectedFee<=0?'green':''}">$${projected.toFixed(0)}</div><div class="comp-metric-label">projected year-end</div></div>
      <div class="comp-divider"></div>
      <div class="comp-metric"><div class="comp-metric-val ${projectedFee<=0?'green':''}">${projectedFee<=0?'+$'+Math.abs(projectedFee).toFixed(0):'$'+projectedFee.toFixed(0)}</div><div class="comp-metric-label">${projectedFee<=0?'projected profit':'projected vs $'+fee+' fee'}</div></div>
      <div class="comp-metric"><div class="comp-metric-val red">$${missed.toFixed(0)}</div><div class="comp-metric-label">missed so far</div></div>
      <div class="comp-progress"><div class="comp-progress-fill" style="width:${Math.min(100,projected/fee*100).toFixed(0)}%"></div></div>
      <div style="font-size:10px;color:var(--text-tertiary);font-family:var(--mono);margin-top:6px">${Math.round(projected/fee*100)}% of fee on pace · ${days}d to renewal</div>
    </div>`;
  });
  html+=`</div>`;
  set(html);
}

// ── Render: keep / cancel ─────────────────────────────────────────────────
export function renderKeepCard(){
  const CARD_KEYS=getVisibleCardKeys();
  let html=`<div class="banner"><strong>Should I keep this card?</strong> — renewal verdict based on fee coverage</div>`;
  html+=`<p style="font-size:11px;color:var(--text-tertiary);font-family:var(--mono);margin:0 0 10px">drag cards to reorder</p>`;
  CARD_KEYS.forEach(cardKey=>{
    const fee=getFee(cardKey,CY);
    const {repeating,oneTime}=calcCapturedByType(cardKey);
    const captured=repeating+oneTime;
    const projected=getProjectedCapture(cardKey);
    const gap=fee-projected;
    let verdict,cls,reason,action;
    if(captured>=fee){ verdict='✓ Keep it'; cls='keep'; reason=`You've already captured $${captured.toFixed(0)} — covering the $${fee} fee with $${(captured-fee).toFixed(0)} profit.`; action='Renewal is clearly worth it.'; }
    else if(projected>=fee){ verdict='✓ Keep it'; cls='keep'; reason=`You've captured $${captured.toFixed(0)} so far. At this rate you'll hit $${projected.toFixed(0)} by card year end — covering the $${fee} fee.`; action='On track to break even. Renewal recommended.'; }
    else if(gap<=250){ verdict='✓ Keep it'; cls='keep'; reason=`Projecting $${projected.toFixed(0)} by year end vs $${fee} fee. You'll be $${gap.toFixed(0)} short of breaking even.`; action='Within $250 of break-even — worth keeping.'; }
    else if(gap<=500){ verdict='⚠ Reconsider'; cls='reconsider'; reason=`Projecting $${projected.toFixed(0)} by year end vs $${fee} fee. You'll be $${gap.toFixed(0)} short.`; action='Try to use more benefits before renewal.'; }
    else { verdict='✗ Downgrade or Cancel'; cls='cancel'; reason=`Projecting $${projected.toFixed(0)} by year end — $${gap.toFixed(0)} short of the $${fee} fee.`; action='Consider downgrading or cancelling before renewal.'; }
    const days=daysUntilFee(cardKey);
    const fm2=getCardFeeMonth(cardKey),fd=getCardFeeDay(cardKey);
    html+=`<div style="margin-bottom:12px" data-drag-card="${cardKey}" draggable="true">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px"><span class="drag-handle" style="font-size:14px">⠿</span><span style="font-size:11px;font-family:var(--mono);color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em">${CARD_LABELS[cardKey]}</span></div>
      <div class="keep-card-result ${cls}"><div class="keep-verdict ${cls}">${verdict}</div><div class="keep-reason">${reason}<br><strong>${action}</strong></div>
      <div style="font-size:10px;font-family:var(--mono);color:var(--text-tertiary);margin-top:8px">$${captured.toFixed(0)} captured · $${projected.toFixed(0)} projected · $${fee} fee<br>Next fee: ${MONTHS[fm2]} ${fd} · ${days} days away</div>
      </div>
    </div>`;
  });
  set(html);
}

// ── Render: recap ──────────────────────────────────────────────────────────
export function renderRecap(){
  const year=state.selectedYear;
  const CARD_KEYS=getVisibleCardKeys();
  let totalCaptured=0,totalMissed=0,totalFees=0;
  let bestCard={key:'',captured:0},worstCard={key:'',missed:0};
  let biggestMiss={name:'',amt:0,card:''};
  let longestStreak={name:'',streak:0,card:''},longestStreakCount=0;
  CARD_KEYS.forEach(cardKey=>{
    const fee=getFee(cardKey,year);
    totalFees+=fee;
    const savedYear=state.selectedYear;
    state.selectedYear=year;
    const {captured,missed}=calcStats(cardKey,c=>getYTDPeriods(c),isYTDCurrent);
    state.selectedYear=savedYear;
    totalCaptured+=captured;
    totalMissed+=missed;
    if(captured>bestCard.captured) bestCard={key:cardKey,captured};
    if(missed>worstCard.missed) worstCard={key:cardKey,missed};
    const savedYear2=state.selectedYear; state.selectedYear=year;
    CARDS[cardKey].sections.forEach(s=>{
      s.benefits.forEach(b=>{
        if(isBNotAvailable(b,year)) return;
        const periods=getYTDPeriods(s.cadence);
        let bMissed=0;
        periods.forEach(p=>{ if(!isPFuture(p)&&!isYTDCurrent(s.cadence,p)&&!isUsed(cardKey,b.id,p.pk)) bMissed+=getBAmount(b,p); });
        if(bMissed>biggestMiss.amt) biggestMiss={name:b.name,amt:bMissed,card:CARD_LABELS[cardKey]};
      });
    });
    state.selectedYear=savedYear2;
    CARDS[cardKey].sections.forEach(s=>{
      if(s.cadence!=='monthly') return;
      s.benefits.forEach(b=>{
        if(isBNotAvailable(b,year)) return;
        const streak=getStreak(cardKey,b.id);
        if(streak>longestStreak.streak){ longestStreak={name:b.name,streak,card:CARD_LABELS[cardKey]}; longestStreakCount=1; }
        else if(streak===longestStreak.streak&&streak>0) longestStreakCount++;
      });
    });
  });
  const effectiveFees=totalFees-totalCaptured;
  const feeCoverageRate=totalFees>0?Math.min(100,Math.round(totalCaptured/totalFees*100)):0;
  const recapYearBtns=[CY-1,CY].map(y=>`<button onclick="setSelectedYear(${y});renderRecap()" style="padding:3px 12px;border-radius:20px;border:1px solid ${y===year?'rgba(255,255,255,0.5)':'rgba(255,255,255,0.2)'};background:${y===year?'rgba(255,255,255,0.2)':'transparent'};color:${y===year?'#fff':'rgba(255,255,255,0.5)'};font-size:11px;font-family:var(--mono);cursor:pointer;transition:all 0.15s">${y===CY?y+' YTD':y}</button>`).join('');
  let html=`
    <div class="recap-hero">
      <div style="display:flex;justify-content:center;gap:6px;margin-bottom:14px">${recapYearBtns}</div>
      <div class="recap-year">${year===CY?year+' YTD':year} Annual Recap · Perks Ledger</div>
      <div class="recap-total">$${totalCaptured.toFixed(0)}</div>
      <div class="recap-total-label">total value captured across all cards</div>
    </div>
    <div class="recap-grid">
      <div class="recap-stat"><div class="recap-stat-val ${feeCoverageRate>=100?'green':feeCoverageRate>=80?'gold':''}">${feeCoverageRate}%</div><div class="recap-stat-label">Fee coverage</div></div>
      <div class="recap-stat"><div class="recap-stat-val">$${totalFees}</div><div class="recap-stat-label">Total fees paid</div></div>
      <div class="recap-stat"><div class="recap-stat-val ${effectiveFees<=0?'green':''}">${effectiveFees<=0?'+$'+Math.abs(effectiveFees).toFixed(0):'$'+effectiveFees.toFixed(0)}</div><div class="recap-stat-label">${effectiveFees<=0?'Net profit':'Effective fees'}</div></div>
    </div>`;
  if(bestCard.key) html+=`<div class="recap-highlight"><div class="recap-highlight-icon">#1</div><div><div class="recap-highlight-label">Best card</div><div class="recap-highlight-val">${CARD_LABELS[bestCard.key]} — $${bestCard.captured.toFixed(0)} captured</div></div></div>`;
  if(biggestMiss.name) html+=`<div class="recap-highlight"><div class="recap-highlight-icon">!</div><div><div class="recap-highlight-label">Biggest miss</div><div class="recap-highlight-val">${biggestMiss.name} — $${biggestMiss.amt.toFixed(0)} left on table</div></div></div>`;
  if(longestStreak.streak>=2&&longestStreakCount===1) html+=`<div class="recap-highlight"><div class="recap-highlight-icon">${longestStreak.streak}mo</div><div><div class="recap-highlight-label">Best streak</div><div class="recap-highlight-val">${longestStreak.name} — ${longestStreak.streak} months in a row</div></div></div>`;
  set(html);
}

// ── Render: history log ────────────────────────────────────────────────────
export async function renderHistoryLog(){
  const {sb}=await import('./state.js');
  set(`<div class="banner"><strong>Benefit history</strong> — recent activity across all cards</div><div style="text-align:center;padding:24px;color:var(--text-tertiary);font-size:13px">Loading history…</div>`);
  try{
    const {data,error}=await sb.from('benefit_log').select('*').order('created_at',{ascending:false}).limit(100);
    if(error||!data||!data.length){ set(`<div class="banner"><strong>Benefit history</strong></div><div style="text-align:center;padding:32px;color:var(--text-tertiary);font-size:13px">No history yet — start marking benefits used!</div>`); return; }
    const benefitNames={};
    Object.keys(CARDS).forEach(ck=>{ CARDS[ck].sections.forEach(s=>s.benefits.forEach(b=>{ benefitNames[b.id]=b.name; })); });
    const cardNames={gold:'AMEX Gold',platinum:'AMEX Platinum',csr:'Chase Sapphire Reserve',cap1_venture_x:'Capital One Venture X',chase_sapphire_pref:'Sapphire Preferred',amex_green:'AMEX Green',amex_hilton_honors:'Hilton Honors Aspire',amex_marriott_brill:'Marriott Bonvoy Brilliant',chase_world_of_hyatt:'World of Hyatt',chase_united_quest:'United Quest',chase_united_club:'United Club Infinite',citi_strata_prem:'Citi Strata Premier'};
    let html=`<div class="banner"><strong>Benefit history</strong> — last ${data.length} actions</div>`;
    html+=`<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden">`;
    data.forEach(entry=>{
      const d=new Date(entry.created_at);
      const timeStr=d.toLocaleDateString('en-US',{month:'short',day:'numeric'})+' · '+d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});
      html+=`<div class="log-entry"><span class="log-dot ${entry.action}"></span><div style="flex:1"><div class="log-benefit">${entry.action==='used'?'✓':'✗'} ${benefitNames[entry.benefit_id]||entry.benefit_id}</div><div class="log-card">${cardNames[entry.card_key]||entry.card_key}</div></div><div class="log-time">${timeStr}</div></div>`;
    });
    html+=`</div>`;
    set(html);
  }catch(e){
    set(`<div class="banner"><strong>Benefit history</strong></div><div style="text-align:center;padding:32px;color:var(--red);font-size:13px">Could not load history.</div>`);
  }
}

// ── Tab badges ─────────────────────────────────────────────────────────────
export function updateCardBadges(){
  getVisibleCardKeys().forEach(cardKey=>{
    const btn=document.querySelector(`.card-btn[data-card="${cardKey}"]`);
    if(!btn) return;
    let unclaimed=0;
    CARDS[cardKey].sections.forEach(s=>{
      const pk=getCurrentPK(cardKey,s.cadence);
      const p={calY:CY,calM:CM,m:CM};
      s.benefits.forEach(b=>{ if(isBExpired(b,p)||isBNotAvailable(b,CY)||isGloballySnoozed(cardKey,b.id)) return; if(!isUsed(cardKey,b.id,pk)) unclaimed++; });
    });
    let badge=btn.querySelector('.card-notif-badge');
    if(unclaimed>0){
      if(!badge){ badge=document.createElement('div'); badge.className='card-notif-badge'; const front=btn.querySelector('.card-front')||btn; front.style.position='relative'; front.appendChild(badge); }
      badge.textContent=unclaimed; badge.classList.remove('hidden');
    } else { if(badge) badge.classList.add('hidden'); }
  });
}
export function updateTabBadge(){
  const btn=document.querySelector('.nav-primary-btn[data-primary="this-period"]');
  if(!btn) return;
  const dot=btn.querySelector('.tab-dot');
  if(dot) dot.remove();
}

// ── Main render dispatcher ─────────────────────────────────────────────────
export function render(){
  const _analyticsViews=['compare','streaks','history-log','recap','insights','heatmap','roi','priority','keep-card','trends'];
  const _isAnalytics=_analyticsViews.includes(state.activeView);
  ['cardSelector','navPrimary','navSecondary','yearSelector','ptrIndicator'].forEach(id=>{ const el=document.getElementById(id); if(el) el.style.display=_isAnalytics?'none':''; });
  document.querySelectorAll('.drag-hint,.ptr-indicator').forEach(el=>{ el.style.display=_isAnalytics?'none':''; });
  const _btns=document.querySelectorAll('.card-btn[data-card]');
  if(state.activeView==='all-cards'){
    _btns.forEach(b=>{ b.className='card-btn'; b.classList.add(`active-${b.dataset.card}`); });
  } else {
    _btns.forEach(b=>{ b.className='card-btn'; if(b.dataset.card===state.activeCard) b.classList.add(`active-${state.activeCard}`); });
  }
  const fee=getFee(state.activeCard,state.selectedYear);
  const {year:fy,month:fm}=getCardYearStart(state.activeCard,state.selectedYear);
  const cyEnd=(fm+11)%12,cyEndY=fy+Math.floor((fm+11)/12);
  const cyBanner=`<div class="banner">Card year: <strong>${MONTHS[fm]} ${fy} → ${MONTHS[cyEnd]} ${cyEndY}</strong> &nbsp;·&nbsp; Annual fee: <strong>$${fee}</strong></div>`;
  const isCurrentYear=state.selectedYear===CY;
  const ytdEndLabel=isCurrentYear?`${MONTHS_FULL[CM]} ${CY}`:`Dec ${state.selectedYear}`;
  const ytdBanner=`<div class="banner"><strong>Jan ${state.selectedYear} → ${ytdEndLabel}</strong> &nbsp;·&nbsp; ${isCurrentYear?'Calendar YTD':state.selectedYear+' full year'} &nbsp;·&nbsp; Annual fee: <strong>$${fee}</strong></div>`;
  if(state.activeView==='all-cards') renderAllCards();
  else if(state.activeView==='current') renderCurrent();
  else if(state.activeView==='history') renderHistBase(c=>getCardYearPeriods(state.activeCard,c),isPCurrent,cyBanner);
  else if(state.activeView==='annual') renderSummBase(c=>getCardYearPeriods(state.activeCard,c),isPCurrent,cyBanner,'card-year');
  else if(state.activeView==='ytd-history') renderHistBase(c=>getYTDPeriods(c),isYTDCurrent,ytdBanner);
  else if(state.activeView==='ytd') renderSummBase(c=>getYTDPeriods(c),isYTDCurrent,ytdBanner,state.selectedYear===CY?'YTD':state.selectedYear+' full year');
  else if(state.activeView==='compare') renderComparison();
  else if(state.activeView==='streaks') renderStreaks();
  else if(state.activeView==='history-log') renderHistoryLog();
  else if(state.activeView==='recap') renderRecap();
  else if(state.activeView==='insights') renderInsights();
  else if(state.activeView==='heatmap') renderHeatmap();
  else if(state.activeView==='roi') renderROI();
  else if(state.activeView==='priority') renderPriorityQueue();
  else if(state.activeView==='keep-card') renderKeepCard();
  else if(state.activeView==='trends') renderTrends();
  setTimeout(()=>{ updateTabBadge(); updateCardBadges(); },200);
}
