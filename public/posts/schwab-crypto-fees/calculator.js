(function(){
  'use strict';
  /* ---------- CONFIG (verified June 2026 — edit here to update) ---------- */
  var CFG = {
    schwabRate: 0.0075,            // per-trade, BTC/USD & ETH/USD
    waiverExpiryMs: Date.parse('2026-07-31T00:00:00Z'),
    etfs: [
      { key:'hodl', label:'HODL · VanEck',        std:0.0020, waiver:0.0000, color:'var(--etf)',  dash:false },
      { key:'fbtc', label:'FBTC / BTCO',          std:0.0025, waiver:null,   color:'var(--etf)',  dash:true  }
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
  // Schwab cost over t years: buy fee always; sell fee on exit value only if selling.
  function schwabCost(P, t, g, sell){
    var buy = P*CFG.schwabRate;
    var sell_ = sell ? P*Math.pow(1+g,t)*CFG.schwabRate : 0;
    return buy + sell_;
  }
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

  /* ---------- state ---------- */
  var S = { P:10000, years:7, g:0, sell:true };

  /* ---------- chart ---------- */
  function drawChart(){
    var W=720,H=380,m={l:58,r:96,t:18,b:46};
    var X0=m.l, X1=W-m.r, Y0=H-m.b, Y1=m.t;
    var tMax=S.years;
    var lines = CFG.etfs.map(function(e){
      var pts=[]; for(var k=0;k<=60;k++){ var t=tMax*k/60; pts.push([t, etfCost(e,S.P,t,S.g)]); }
      return { e:e, pts:pts };
    });
    var schPts=[]; for(var k=0;k<=60;k++){ var t=tMax*k/60; schPts.push([t, schwabCost(S.P,t,S.g,S.sell)]); }
    var maxCost = 0;
    lines.forEach(function(L){ L.pts.forEach(function(p){ if(p[1]>maxCost)maxCost=p[1]; }); });
    schPts.forEach(function(p){ if(p[1]>maxCost)maxCost=p[1]; });
    maxCost = maxCost*1.12 || 1;
    function X(t){ return X0 + (t/tMax)*(X1-X0); }
    function Y(c){ return Y0 - (c/maxCost)*(Y0-Y1); }
    function path(pts){ return pts.map(function(p,i){ return (i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1); }).join(' '); }

    var svg='';
    // y gridlines
    var yt=niceTicks(maxCost,4);
    yt.forEach(function(v){ svg+='<line class="gridl" x1="'+X0+'" y1="'+Y(v)+'" x2="'+X1+'" y2="'+Y(v)+'"/>'
      + '<text class="axlab" x="'+(X0-8)+'" y="'+(Y(v)+3.5)+'" text-anchor="end">'+money(v)+'</text>'; });
    // x axis
    svg+='<line class="axline" x1="'+X0+'" y1="'+Y0+'" x2="'+X1+'" y2="'+Y0+'"/>';
    var xstep = tMax<=6?1:(tMax<=12?2:3);
    for(var xt=0;xt<=tMax;xt+=xstep){ svg+='<text class="axlab" x="'+X(xt)+'" y="'+(Y0+18)+'" text-anchor="middle">'+xt+(xt===0?'':'y')+'</text>'; }
    svg+='<text class="axtitle" x="'+X1+'" y="'+(Y0+34)+'" text-anchor="end">years held</text>';

    // ETF lines
    lines.forEach(function(L){ svg+='<path class="'+(L.e.dash?'lineB':'lineA')+'" d="'+path(L.pts)+'"/>'; });
    // Schwab line
    svg+='<path class="lineS" d="'+path(schPts)+'"/>';

    // break-even markers (within horizon)
    CFG.etfs.forEach(function(e){
      var t=breakEven(e,S.P,S.g,S.sell);
      if(t!=null && t<=tMax){ var c=etfCost(e,S.P,t,S.g);
        svg+='<circle class="bx" cx="'+X(t).toFixed(1)+'" cy="'+Y(c).toFixed(1)+'" r="5"/>';
        svg+='<text class="bxlab" x="'+X(t).toFixed(1)+'" y="'+(Y(c)-12).toFixed(1)+'" text-anchor="middle">'+t.toFixed(1)+'y</text>';
      }
    });
    // end labels
    function endLab(pts,color,txt){ var p=pts[pts.length-1]; return '<text class="endlab" x="'+(X1+8)+'" y="'+(Y(p[1])+3.5)+'" fill="'+color+'">'+txt+'</text>'; }
    svg+=endLab(schPts,'var(--schwab-ink)','Schwab');
    svg+=endLab(lines[0].pts,'var(--etf-ink)','HODL');

    document.getElementById('cChart').innerHTML=svg;
  }
  function niceTicks(max,n){ var step=max/n, mag=Math.pow(10,Math.floor(Math.log10(step))), norm=step/mag; var s=norm<1.5?1:norm<3?2:norm<7?5:10; step=s*mag; var out=[]; for(var v=step;v<=max*1.001;v+=step)out.push(v); return out; }

  /* ---------- table ---------- */
  function drawTable(){
    var cols=[1,3,5,10], nowY=S.years;
    var rows=[
      { label:'Schwab direct', sub:S.sell?'0.75% buy + 0.75% sell':'0.75% buy only (held)', color:'var(--schwab)', cost:function(t){return schwabCost(S.P,t,S.g,S.sell);}, etf:null }
    ].concat(CFG.etfs.map(function(e){ return { label:e.label.split(' · ')[0], sub:(e.std*100).toFixed(2)+'% / yr'+(e.waiver!=null?' (waived now)':''), color:e.color, cost:function(t){return etfCost(e,S.P,t,S.g);}, etf:e }; }));
    // determine cheapest at nowY for highlight
    var bestIdx=0,best=Infinity; rows.forEach(function(r,i){ var c=r.cost(nowY); if(c<best){best=c;bestIdx=i;} });
    var html='';
    rows.forEach(function(r,i){
      html+='<tr'+(i===bestIdx?' class="best"':'')+'>'
        +'<td class="veh"><span class="tag" style="background:'+r.color+'"></span>'+r.label+'<small>'+r.sub+'</small></td>';
      cols.forEach(function(t){ html+='<td'+(t>nowY?' class="muted"':'')+'>'+money(r.cost(t))+'</td>'; });
      html+='<td class="now">'+money(r.cost(nowY))+'</td></tr>';
    });
    document.querySelector('#cTable tbody').innerHTML=html;
    document.getElementById('cTableNow').textContent='At '+nowY+' yrs';
  }

  /* ---------- verdict ---------- */
  function drawVerdict(){
    var nowY=S.years;
    var sch=schwabCost(S.P,nowY,S.g,S.sell);
    var cheapEtf=null,cheapCost=Infinity;
    CFG.etfs.forEach(function(e){ var c=etfCost(e,S.P,nowY,S.g); if(c<cheapCost){cheapCost=c;cheapEtf=e;} });
    var diff=Math.abs(sch-cheapCost), el=document.getElementById('cVerdict');
    var etfName=cheapEtf.label.split(' · ')[0];
    if(cheapCost < sch){
      el.innerHTML='Holding '+money(S.P)+' for <b>'+nowY+' year'+(nowY>1?'s':'')+'</b>, the <b class="win-etf">'+etfName+' ETF</b> is cheaper &mdash; '+money(cheapCost)+' in fees vs '+money(sch)+' for Schwab&rsquo;s '+(S.sell?'round trip':'buy')+', a '+money(diff)+' difference.';
    } else {
      el.innerHTML='Holding '+money(S.P)+' for <b>'+nowY+' year'+(nowY>1?'s':'')+'</b>, <b class="win-sch">Schwab direct</b> is cheaper &mdash; '+money(sch)+' for the '+(S.sell?'round trip':'buy')+' vs '+money(cheapCost)+' for the '+etfName+' ETF, a '+money(diff)+' difference.';
    }
  }

  /* ---------- break-even bars (chapter 02, 0% growth, sell) ---------- */
  function drawBE(){
    var maxScale=12;
    var html='';
    CFG.etfs.forEach(function(e){
      var t=breakEven(e,10000,0,true);
      var capped = t==null || t>maxScale;
      var w = capped?100:(t/maxScale*100);
      var val = t==null?'10+ yrs':(t>maxScale?'10+ yrs':t.toFixed(1)+' yrs');
      var note = e.waiver!=null
        ? 'Free while the waiver lasts; <b>7.5 yrs</b> once 0.20% kicks in after July 2026.'
        : 'After '+val+', Schwab&rsquo;s 1.5% round trip would have cost less.';
      html+='<div class="be-row">'
        +'<div class="be-top"><span class="be-name">'+e.label+'<span class="sub">'+(e.std*100).toFixed(2)+'%/yr'+(e.waiver!=null?' · waived':'')+'</span></span><span class="be-val">'+val+'</span></div>'
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
