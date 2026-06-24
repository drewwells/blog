(function(){
  'use strict';
  /* ---------- CONFIG (verified June 2026 — edit here to update) ---------- */
  var CFG = {
    schwabRate: 0.0075,            // per-trade fee, BTC/USD
    // Coinbase Advanced Trade — entry tier (Tier 1, $0–$10K 30-day volume): 0.40% maker / 0.60% taker.
    // We plot the taker rate: market orders fill immediately as taker, which is what most retail pays.
    coinbaseMaker: 0.0040,
    coinbaseTaker: 0.0060,
    // Coinbase Simple buy/sell — the DEFAULT in-app path (tap "Buy"), which most retail uses
    // without noticing. Documented model: a spread baked into the quoted price PLUS a separate fee.
    // Anchor: a real $1,000 BTC buy showed "incl. 1.00% spread + $18.40 fee" = $28.40 ≈ 2.84% all-in.
    coinbaseSimpleSpread: 0.0100,   // ~1% spread in the quoted price
    coinbaseSimpleFee:    0.0184,   // separate Coinbase fee — $18.40 on the $1,000 buy
    waiverExpiryMs: Date.parse('2026-07-31T00:00:00Z'),
    // Top 10 U.S. spot-bitcoin ETFs by AUM (June 2026). std = annual expense ratio.
    etfs: [
      { t:'IBIT', issuer:'BlackRock iShares',   std:0.0025, waiver:null   },
      { t:'GBTC', issuer:'Grayscale',           std:0.0150, waiver:null   },
      { t:'FBTC', issuer:'Fidelity',            std:0.0025, waiver:null   },
      { t:'ARKB', issuer:'ARK 21Shares',        std:0.0021, waiver:null   },
      { t:'BITB', issuer:'Bitwise',             std:0.0020, waiver:null   },
      { t:'BTC',  issuer:'Grayscale Mini',      std:0.0015, waiver:null   },
      { t:'HODL', issuer:'VanEck',              std:0.0020, waiver:0.0000 },
      { t:'BTCO', issuer:'Invesco Galaxy',      std:0.0025, waiver:null   },
      { t:'EZBC', issuer:'Franklin Templeton',  std:0.0019, waiver:null   },
      { t:'BRRR', issuer:'CoinShares Valkyrie', std:0.0025, waiver:null   }
    ]
  };
  var YEAR_MS = 365.25*24*3600*1000;

  /* ---------- math ---------- */
  // Effective annual rate for an ETF at time tau (years from now): honors the waiver window.
  function rateAt(etf, tau){
    if(etf.waiver==null) return etf.std;
    var tWaiver = Math.max(0,(CFG.waiverExpiryMs - Date.now())/YEAR_MS);
    return tau < tWaiver ? etf.waiver : etf.std;
  }
  // Cumulative ETF cost over t years on principal P at annual growth g. Integral of rate*balance dt.
  function etfCost(etf, P, t, g){
    if(t<=0) return 0;
    var steps = Math.max(1, Math.ceil(t*12)), dt = t/steps, sum = 0;
    for(var i=0;i<steps;i++){
      var tau = (i+0.5)*dt;
      sum += rateAt(etf,tau) * P*Math.pow(1+g,tau) * dt;
    }
    return sum;
  }
  // Per-trade toll over t years: buy fee always; sell fee on exit value only if selling.
  // Both Schwab direct and Coinbase Advanced are tolls — a flat % charged on the way in and out.
  function tollCost(rate, P, t, g, sell){
    var buy = P*rate;
    var sell_ = sell ? P*Math.pow(1+g,t)*rate : 0;
    return buy + sell_;
  }
  function schwabCost(P, t, g, sell){ return tollCost(CFG.schwabRate, P, t, g, sell); }
  function coinbaseCost(P, t, g, sell){ return tollCost(CFG.coinbaseTaker, P, t, g, sell); }
  function coinbaseSimpleCost(P, t, g, sell){ return tollCost(CFG.coinbaseSimpleSpread+CFG.coinbaseSimpleFee, P, t, g, sell); }
  // Break-even: smallest t where cumulative ETF cost >= Schwab cost (both as functions of t).
  function breakEven(etf, P, g, sell){
    var prev = schwabCost(P,0,g,sell) - etfCost(etf,P,0,g); // >0: schwab dearer
    for(var m=1;m<=480;m++){               // scan to 40 years, monthly
      var t=m/12, d = schwabCost(P,t,g,sell) - etfCost(etf,P,t,g);
      if(prev>0 && d<=0){                  // crossed: ETF cost overtook Schwab
        var t0=(m-1)/12, lo=schwabCost(P,t0,g,sell)-etfCost(etf,P,t0,g);
        return t0 + (lo/(lo-d))*(1/12);    // linear interp
      }
      prev=d;
    }
    return null; // never within 40y (ETF stays cheaper)
  }

  /* ---------- format ---------- */
  function money(v){
    if(v>=1000) return '$'+v.toLocaleString('en-US',{maximumFractionDigits:0});
    return '$'+v.toLocaleString('en-US',{maximumFractionDigits:2});
  }
  function num(v){ return v.toLocaleString('en-US',{maximumFractionDigits:0}); }
  // expense-ratio label, e.g. "0.25%", "1.50%", or "0% waived" while a waiver is live
  function erLabel(e){ if(e.waiver!=null) return '0% waived'; var p=e.std*100; return (p%1===0?p.toFixed(0):p.toFixed(2))+'%'; }

  /* ---------- state ---------- */
  // vis[i] = is CFG.etfs[i] drawn on the chart? Default: all on except GBTC (its 1.50% fee
  // dwarfs the field and compresses everyone else — toggle it on from the table to see it tower).
  var S = { P:10000, years:7, g:0, sell:true, vis: CFG.etfs.map(function(e){ return e.t!=='GBTC'; }) };

  /* ---------- chart: every ETF toggled on in the table, + Schwab reference ---------- */
  function drawChart(){
    var W=720,H=380,m={l:58,r:104,t:18,b:46};
    var X0=m.l, X1=W-m.r, Y0=H-m.b, Y1=m.t, tMax=S.years;
    var shown=CFG.etfs.map(function(e,i){ return S.vis[i]?e:null; }).filter(Boolean);
    var lines=shown.map(function(e){ var pts=[]; for(var k=0;k<=60;k++){ var t=tMax*k/60; pts.push([t,etfCost(e,S.P,t,S.g)]); } return {e:e,pts:pts}; });
    var schPts=[]; for(var k=0;k<=60;k++){ var t=tMax*k/60; schPts.push([t,schwabCost(S.P,t,S.g,S.sell)]); }
    var cbPts=[]; for(var k=0;k<=60;k++){ var t=tMax*k/60; cbPts.push([t,coinbaseCost(S.P,t,S.g,S.sell)]); }
    var sbPts=[]; for(var k=0;k<=60;k++){ var t=tMax*k/60; sbPts.push([t,coinbaseSimpleCost(S.P,t,S.g,S.sell)]); }
    var maxCost=0; lines.forEach(function(L){ L.pts.forEach(function(p){ if(p[1]>maxCost)maxCost=p[1]; }); }); schPts.forEach(function(p){ if(p[1]>maxCost)maxCost=p[1]; }); cbPts.forEach(function(p){ if(p[1]>maxCost)maxCost=p[1]; }); sbPts.forEach(function(p){ if(p[1]>maxCost)maxCost=p[1]; });
    maxCost = maxCost*1.10 || 1;
    function X(t){ return X0+(t/tMax)*(X1-X0); }
    function Y(c){ return Y0-(c/maxCost)*(Y0-Y1); }
    function path(pts){ return pts.map(function(p,i){ return (i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1); }).join(' '); }

    var svg='';
    niceTicks(maxCost,4).forEach(function(v){ svg+='<line class="gridl" x1="'+X0+'" y1="'+Y(v)+'" x2="'+X1+'" y2="'+Y(v)+'"/>'
      + '<text class="axlab" x="'+(X0-8)+'" y="'+(Y(v)+3.5)+'" text-anchor="end">'+money(v)+'</text>'; });
    svg+='<line class="axline" x1="'+X0+'" y1="'+Y0+'" x2="'+X1+'" y2="'+Y0+'"/>';
    var xstep = tMax<=6?1:(tMax<=12?2:3);
    for(var xt=0;xt<=tMax;xt+=xstep){ svg+='<text class="axlab" x="'+X(xt)+'" y="'+(Y0+18)+'" text-anchor="middle">'+xt+(xt===0?'':'y')+'</text>'; }
    svg+='<text class="axtitle" x="'+X1+'" y="'+(Y0+34)+'" text-anchor="end">years held</text>';

    // shown ETF lines
    lines.forEach(function(L){ svg+='<path class="lineE" d="'+path(L.pts)+'"/>'; });
    // Per-trade toll references on top of the bunch (flat unless the position grows): Simple buy, Coinbase Advanced, Schwab
    svg+='<path class="lineSB" d="'+path(sbPts)+'"/>';
    svg+='<path class="lineC" d="'+path(cbPts)+'"/>';
    svg+='<path class="lineS" d="'+path(schPts)+'"/>';
    // a dot where each shown ETF crosses Schwab within the horizon
    var single=(lines.length===1), singleHasMarker=false;
    lines.forEach(function(L){ var t=breakEven(L.e,S.P,S.g,S.sell); if(t!=null && t<=tMax){ var c=etfCost(L.e,S.P,t,S.g);
      svg+='<circle class="'+(single?'bx':'bxsm')+'" cx="'+X(t).toFixed(1)+'" cy="'+Y(c).toFixed(1)+'" r="'+(single?5:2.8)+'"/>';
      if(single){ singleHasMarker=true; svg+='<text class="bxlab" x="'+X(t).toFixed(1)+'" y="'+(Y(c)-12).toFixed(1)+'" text-anchor="middle">'+L.e.t+' &middot; '+t.toFixed(1)+'y</text>'; }
    } });
    // end labels: Schwab always; GBTC when shown in the crowd; the lone fund when only one is shown
    function endLab(y,cls,color,txt){ return '<text class="'+cls+'" x="'+(X1+8)+'" y="'+(y+3.5)+'" fill="'+color+'">'+txt+'</text>'; }
    var sy=Y(schPts[schPts.length-1][1]);
    var gbtc=null; lines.forEach(function(L){ if(L.e.t==='GBTC') gbtc=L.pts; });
    if(gbtc && !single) svg+=endLab(Y(gbtc[gbtc.length-1][1]),'endlabF','var(--etf-ink)','GBTC');
    if(single && !singleHasMarker){ var fy=Y(lines[0].pts[lines[0].pts.length-1][1]); var dy=(Math.abs(fy-sy)<13)?(fy<=sy?-11:11):0; svg+=endLab(fy+dy,'endlab','var(--etf-ink)',lines[0].e.t); }
    var sby=Y(sbPts[sbPts.length-1][1]);           // Simple buy is priciest (top); Schwab mid; Advanced lowest
    var cy=Y(cbPts[cbPts.length-1][1]);
    if(Math.abs(cy-sy)<13) cy=sy+13;               // nudge Advanced clear of Schwab if they crowd
    if(Math.abs(sby-sy)<13) sby=sy-13;             // nudge Simple clear of Schwab (only at tiny principals)
    svg+=endLab(sby,'endlab','var(--simple-ink)','CB Simple');
    svg+=endLab(cy,'endlab','var(--coinbase-ink)','CB Advanced');
    svg+=endLab(sy,'endlab','var(--schwab-ink)','Schwab');
    document.getElementById('cChart').innerHTML=svg;
  }
  function niceTicks(max,n){ var step=max/n, mag=Math.pow(10,Math.floor(Math.log10(step))), norm=step/mag; var s=norm<1.5?1:norm<3?2:norm<7?5:10; step=s*mag; var out=[]; for(var v=step;v<=max*1.001;v+=step)out.push(v); return out; }

  /* ---------- table: Schwab + all 10 ETFs, ranked by cost; ETF rows toggle the chart ---------- */
  function drawTable(){
    var cols=[1,3,5,10], nowY=S.years;
    var rows=[
      { k:'schwab',   label:'Schwab direct',              sub:S.sell?'0.75% buy + 0.75% sell':'0.75% buy only (held)',    color:'var(--schwab)',   on:true, cost:function(t){return schwabCost(S.P,t,S.g,S.sell);} },
      { k:'coinbase', label:'Coinbase Advanced · Tier 1', sub:S.sell?'0.60% buy + 0.60% sell · taker':'0.60% buy only · taker', color:'var(--coinbase)', on:true, cost:function(t){return coinbaseCost(S.P,t,S.g,S.sell);} },
      { k:'simple',   label:'Coinbase · Simple buy',      sub:S.sell?'2.84% buy + 2.84% sell · spread+fee':'2.84% buy only · spread+fee', color:'var(--simple)', on:true, cost:function(t){return coinbaseSimpleCost(S.P,t,S.g,S.sell);} }
    ];
    CFG.etfs.forEach(function(e,i){ rows.push({ k:i, label:e.t, sub:e.issuer+' · '+erLabel(e), color:'var(--etf)', on:S.vis[i], cost:function(t){return etfCost(e,S.P,t,S.g);} }); });
    rows.sort(function(a,b){ return a.cost(nowY)-b.cost(nowY); });
    // cheapest among the options actually on the table/chart (Schwab + shown ETFs)
    var best=Infinity; rows.forEach(function(r){ if(r.on){ var c=r.cost(nowY); if(c<best)best=c; } });
    var html='';
    rows.forEach(function(r){
      var isToll=(r.k==='schwab'||r.k==='coinbase'||r.k==='simple');   // tolls are always-on reference rows, not toggleable
      var cls=(r.on && r.cost(nowY)===best?'best ':'')+(!r.on?'hidden ':'')+(isToll?'static':'');
      html+='<tr class="'+cls+'" data-k="'+r.k+'"'+(!isToll?' role="button" aria-pressed="'+r.on+'" title="'+(r.on?'Hide':'Show')+' on chart"':'')+'>'
        +'<td class="veh"><span class="tag'+(r.on?'':' off')+'" style="background:'+r.color+'"></span>'+r.label+'<small>'+r.sub+'</small></td>';
      cols.forEach(function(t){ html+='<td'+(t>nowY?' class="muted"':'')+'>'+money(r.cost(t))+'</td>'; });
      html+='<td class="now">'+money(r.cost(nowY))+'</td></tr>';
    });
    document.querySelector('#cTable tbody').innerHTML=html;
    document.getElementById('cTableNow').textContent='At '+nowY+' yrs';
    document.querySelectorAll('#cTable tbody tr').forEach(function(tr){
      tr.addEventListener('click',function(){ var k=tr.getAttribute('data-k'); if(k!=='schwab'&&k!=='coinbase'&&k!=='simple'){ S.vis[+k]=!S.vis[+k]; render(); } });
    });
  }

  /* ---------- verdict: Schwab vs the cheapest ETF currently shown ---------- */
  function drawVerdict(){
    var nowY=S.years, sch=schwabCost(S.P,nowY,S.g,S.sell), el=document.getElementById('cVerdict');
    var cheapE=null, cheapCost=Infinity, shownN=0;
    CFG.etfs.forEach(function(e,i){ if(!S.vis[i]) return; shownN++; var c=etfCost(e,S.P,nowY,S.g); if(c<cheapCost){cheapCost=c;cheapE=e;} });
    var horizon='<b>'+nowY+' year'+(nowY>1?'s':'')+'</b>', trip=S.sell?'round trip':'buy';
    if(!cheapE){ el.innerHTML='No ETFs shown &mdash; tap a row below to plot one against Schwab&rsquo;s '+money(sch)+' '+trip+'.'; return; }
    var diff=Math.abs(sch-cheapCost), scope=(shownN===CFG.etfs.length?'the ten ETFs':'the ETFs shown');
    if(cheapCost < sch){
      el.innerHTML='Holding '+money(S.P)+' for '+horizon+', the cheapest of '+scope+' &mdash; <b class="win-etf">'+cheapE.t+'</b> at '+erLabel(cheapE)+' &mdash; costs '+money(cheapCost)+' vs '+money(sch)+' for Schwab&rsquo;s '+trip+', a '+money(diff)+' saving.';
    } else {
      el.innerHTML='Holding '+money(S.P)+' for '+horizon+', <b class="win-sch">Schwab direct</b> beats every ETF shown &mdash; '+money(sch)+' for the '+trip+' vs '+money(cheapCost)+' for the cheapest ('+cheapE.t+'), a '+money(diff)+' difference.';
    }
  }

  /* ---------- break-even bars: all 10 ETFs, ranked (0% growth, sell) ---------- */
  function drawBE(){
    var host=document.getElementById('beBars'); if(!host) return;  // absent in the standalone calculator card
    var maxScale=12;
    var items=CFG.etfs.map(function(e){ return { e:e, be:breakEven(e,10000,0,true) }; });
    items.sort(function(a,b){ return (a.be==null?999:a.be)-(b.be==null?999:b.be); });
    var html='';
    items.forEach(function(it){
      var e=it.e, t=it.be, capped=(t==null||t>maxScale), w=capped?100:(t/maxScale*100);
      var val=(t==null||t>maxScale)?'12+ yrs':t.toFixed(1)+' yrs';
      var note;
      if(e.waiver!=null) note='Free while the waiver lasts; ~7.5 yrs once the 0.20% fee resumes after July 2026.';
      else if(t!=null && t<=maxScale) note='After '+t.toFixed(1)+' yrs, Schwab&rsquo;s 1.5% round trip would have cost less.';
      else note='Stays cheaper than Schwab&rsquo;s round trip for well over a decade.';
      html+='<div class="be-row">'
        +'<div class="be-top"><span class="be-name">'+e.t+'<span class="sub">'+e.issuer+' · '+erLabel(e)+'</span></span><span class="be-val">'+val+'</span></div>'
        +'<div class="be-track"><div class="be-fill'+(capped?' never':'')+'" style="width:'+w+'%"></div></div>'
        +'<div class="be-sub">'+note+'</div></div>';
    });
    document.getElementById('beBars').innerHTML=html;
  }

  /* ---------- wire up ---------- */
  function parsePrincipal(){ var v=parseFloat(document.getElementById('cPrincipal').value.replace(/[^0-9.]/g,'')); return isFinite(v)&&v>0?v:10000; }
  function render(){ drawChart(); drawTable(); drawVerdict(); }
  var P=document.getElementById('cPrincipal'),Y=document.getElementById('cYears'),G=document.getElementById('cGrowth');
  P.addEventListener('input',function(){ S.P=parsePrincipal(); render(); });
  P.addEventListener('blur',function(){ S.P=parsePrincipal(); P.value=num(S.P); render(); });
  Y.addEventListener('input',function(){ S.years=+Y.value; document.getElementById('cYearsV').textContent=S.years+' yrs'; render(); });
  G.addEventListener('input',function(){ S.g=+G.value/100; document.getElementById('cGrowthV').textContent=(+G.value)+'%'; render(); });
  document.querySelectorAll('#cSell button').forEach(function(b){ b.addEventListener('click',function(){
    document.querySelectorAll('#cSell button').forEach(function(x){x.classList.remove('on');}); b.classList.add('on');
    S.sell=b.getAttribute('data-v')==='1'; render();
  }); });

  S.P=parsePrincipal(); render(); drawBE();

  /* reveal on scroll */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target);} }); },{threshold:.12});
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  } else { document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); }); }
})();
