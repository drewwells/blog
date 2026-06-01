/* ============================================================
   health-charts.js — data + render + running counter + reveal
   The $5.3 Trillion Question
   ============================================================ */
(function () {
  'use strict';

  var C = {
    green:'#0b8a5c', greenInk:'#066b46', mint:'#34d399', clay:'#c25c43',
    ink:'#14191a', g1:'#586166', g2:'#868f93', g3:'#b4bcbe', faint:'#7d878a',
    slate:'#3c474a'
  };
  function mix(hex, pct, withHex){
    withHex = withHex || '#edf0ee';
    function rgb(h){h=h.replace('#','');return [0,2,4].map(function(i){return parseInt(h.substr(i,2),16);});}
    var a=rgb(hex), b=rgb(withHex), p=pct/100;
    return 'rgb('+a.map(function(v,i){return Math.round(v*p+b[i]*(1-p));}).join(',')+')';
  }
  var money = function(b){ // billions -> "$1,634.7B" or "$5.3T"
    if (b>=1000) return '$'+(b/1000).toFixed(b>=10000?1:2).replace(/\.0+$/,'')+'T';
    return '$'+b.toLocaleString('en-US',{maximumFractionDigits:1})+'B';
  };
  var pct = function(v){ return (Math.round(v*10)/10).toString().replace(/\.0$/,'')+'%'; };

  /* ---------- generic horizontal-bar renderer ---------- */
  function hbars(opt){
    var sm = opt.scaleMax;
    var html = '<div class="hbars" style="--rowgap:'+(opt.rowgap||20)+'px">';
    opt.rows.forEach(function(r){
      var w = (r.val/sm)*100;
      html += '<div class="hb-row">'
        + '<div class="hb-top"><span class="hb-name'+(r.hl?' hl':'')+'">'+r.name
            + (r.sub?'<span class="sub">'+r.sub+'</span>':'') + (r.est?'<span class="est-tag">est</span>':'') + '</span>'
            + '<span class="hb-val">'+r.val_label+'</span></div>'
        + '<div class="hb-track" style="--barh:'+(opt.barh||34)+'px">'
          + '<div class="hb-fill'+(r.light?' light':'')+(r.est?' est':'')+'" style="--w:'+w+'%;background:'+r.color+'">'
              + (r.inlab?'<span class="inlab">'+r.inlab+'</span>':'') + '</div>'
          + (r.marker?'<div class="hb-marker'+(r.marker.ink?' ink':'')+'" style="--m:'+(r.marker.at/sm*100)+'%"><span class="mlab">'+r.marker.label+'</span></div>':'')
        + '</div>'
        + (r.hbsub?'<div class="hb-sub">'+r.hbsub+'</div>':'')
        + '</div>';
    });
    html += '</div>';
    if (opt.ticks){
      html += '<div class="hb-axis">';
      opt.ticks.forEach(function(t){ html += '<div class="tick" style="left:'+(t.v/sm*100)+'%">'+t.l+'</div>'; });
      html += '</div>';
    }
    return html;
  }

  /* =========================================================
     CHART 1 — international per-capita spending (OECD 2024)
     ========================================================= */
  function chart1(){
    var el = document.getElementById('chart1'); if(!el) return;
    var rows = [
      { name:'United States', val:14775, val_label:'$14,775', hl:true, color:C.green, inlab:'~2\u00d7 the peer average' },
      { name:'Switzerland', sub:'next-highest spender', val:9963, val_label:'$9,963', color:C.g1, light:false },
      { name:'Comparable-country average', val:7371, val_label:'$7,371', color:C.g3, light:true }
    ];
    el.innerHTML =
      '<div class="chart-flag"><span class="arr">&rarr;</span> &hellip;and Americans use <b>about the same or less</b> care &mdash; fewer doctor visits, shorter hospital stays. The gap is <b>price</b>, not volume.</div>'
      + hbars({ rows:rows, scaleMax:16000, barh:42, rowgap:24,
          ticks:[{v:0,l:'$0'},{v:4000,l:'$4k'},{v:8000,l:'$8k'},{v:12000,l:'$12k'},{v:16000,l:'$16k'}] });
  }

  /* =========================================================
     CHART 2 — spend vs life expectancy (Peterson-KFF 2023)
     ========================================================= */
  function chart2(){
    var el = document.getElementById('chart2'); if(!el) return;
    var W=720, H=380, m={l:64,r:120,t:30,b:54};
    var xMin=5000, xMax=15000, yMin=77.5, yMax=84;
    function X(v){ return m.l + (v-xMin)/(xMax-xMin)*(W-m.l-m.r); }
    function Y(v){ return m.t + (yMax-v)/(yMax-yMin)*(H-m.t-m.b); }
    var us={s:13432,l:79.0}, pe={s:7393,l:82.7};
    var g='';
    // gridlines + y ticks (life expectancy)
    [78,80,82,84].forEach(function(t){ g+='<line class="gridl" x1="'+m.l+'" y1="'+Y(t)+'" x2="'+(W-m.r)+'" y2="'+Y(t)+'"/>'
        +'<text class="axlab" x="'+(m.l-10)+'" y="'+(Y(t)+4)+'" text-anchor="end">'+t+'</text>'; });
    // x ticks (spending)
    [6000,9000,12000,15000].forEach(function(t){ g+='<text class="axlab" x="'+X(t)+'" y="'+(H-m.b+20)+'" text-anchor="middle">$'+(t/1000)+'k</text>'; });
    // axes
    g+='<line class="axline" x1="'+m.l+'" y1="'+(H-m.b)+'" x2="'+(W-m.r)+'" y2="'+(H-m.b)+'"/>';
    g+='<line class="axline" x1="'+m.l+'" y1="'+m.t+'" x2="'+m.l+'" y2="'+(H-m.b)+'"/>';
    g+='<text class="axtitle" x="'+((m.l+(W-m.r))/2)+'" y="'+(H-8)+'" text-anchor="middle">Health spending per person &rarr;</text>';
    g+='<text class="axtitle" transform="rotate(-90 16 '+((m.t+(H-m.b))/2)+')" x="16" y="'+((m.t+(H-m.b))/2)+'" text-anchor="middle">Life expectancy (yrs) &rarr;</text>';
    // connector + deltas
    g+='<g class="reveal-fade">';
    g+='<line class="conn" x1="'+X(pe.s)+'" y1="'+Y(pe.l)+'" x2="'+X(us.s)+'" y2="'+Y(us.l)+'"/>';
    g+='<text class="delta" x="'+((X(pe.s)+X(us.s))/2)+'" y="'+((Y(pe.l)+Y(us.l))/2 - 10)+'" text-anchor="middle">+$6,039 spent / &minus;3.7 yrs lived</text>';
    g+='</g>';
    // peer dot
    g+='<g class="dot peer"><circle cx="'+X(pe.s)+'" cy="'+Y(pe.l)+'" r="9"/>'
      +'<text class="nm" x="'+X(pe.s)+'" y="'+(Y(pe.l)-16)+'" text-anchor="middle">Comparable countries</text>'
      +'<text class="vv" x="'+X(pe.s)+'" y="'+(Y(pe.l)+26)+'" text-anchor="middle">$7,393 \u00b7 82.7 yrs</text></g>';
    // us dot
    g+='<g class="dot us"><circle cx="'+X(us.s)+'" cy="'+Y(us.l)+'" r="11"/>'
      +'<text class="nm" x="'+(X(us.s)+18)+'" y="'+(Y(us.l)-10)+'" text-anchor="start">United States</text>'
      +'<text class="vv" x="'+(X(us.s)+18)+'" y="'+(Y(us.l)+8)+'" text-anchor="start">$13,432 \u00b7 79.0 yrs</text></g>';

    el.innerHTML = '<div class="plot"><svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Scatter of spending versus life expectancy">'+g+'</svg></div>';
  }

  /* =========================================================
     CHART 3 — where the $5.3T goes / who pays  (two columns)
     ========================================================= */
  function chart3(){
    var el = document.getElementById('chart3'); if(!el) return;
    var TOTAL = 5300, sm = 1700;
    var goes = [
      { name:'Hospital care', val:1634.7, p:31 },
      { name:'Physician &amp; clinical', val:1109.7, p:21 },
      { name:'Other categories', sub:'nursing, dental, home health, public health\u2026', val:1397, p:26, faded:true },
      { name:'Retail prescription drugs', val:467.0, p:9 },
      { name:'Administration', sub:'net cost of insurance + program admin', val:371, p:7 },
      { name:'Other personal health care', val:320.5, p:6 }
    ];
    var pays = [
      { name:'Private health insurance', val:1644.6, p:31 },
      { name:'Medicare', val:1118.0, p:21 },
      { name:'Medicaid', val:931.7, p:18 },
      { name:'Other third-party &amp; public health', val:590.5, p:11 },
      { name:'Out-of-pocket', sub:'~$1,632 per person', val:556.6, p:11 },
      { name:'Other (VA, DoD, CHIP, investment\u2026)', val:418, p:8, faded:true }
    ];
    function col(list, fam){
      var h = '<div class="hbars" style="--rowgap:16px">';
      // sort desc for clean ranking
      list.slice().sort(function(a,b){return b.val-a.val;}).forEach(function(r,i){
        var w = r.val/sm*100;
        var shade = r.faded ? C.g3 : mix(fam, 100 - i*11);
        h += '<div class="hb-row"><div class="hb-top">'
           + '<span class="hb-name">'+r.name+(r.sub?'<span class="sub">'+r.sub+'</span>':'')+'</span>'
           + '<span class="hb-val">'+money(r.val)+' \u00b7 '+r.p+'%</span></div>'
           + '<div class="hb-track" style="--barh:26px"><div class="hb-fill'+(r.faded?' light':'')+'" style="--w:'+w+'%;background:'+shade+'"></div></div>'
           + '</div>';
      });
      return h+'</div>';
    }
    el.innerHTML = '<div class="twocol">'
      + '<div><div class="colhead"><span>Where it <b>goes</b></span><span class="tot">'+money(TOTAL)+'</span></div>'+col(goes, C.green)+'</div>'
      + '<div><div class="colhead"><span>Who <b>pays</b></span><span class="tot">'+money(TOTAL)+'</span></div>'+col(pays, C.slate)+'</div>'
      + '</div>';
  }

  /* =========================================================
     CHART 4 — health share of state GDP  (merged: top-share
     states vs the three biggest economies, 2020)
     ========================================================= */
  function chart4(){
    var el = document.getElementById('chart4'); if(!el) return;
    var rows = [
      { name:'West Virginia', val:28.7, val_label:'28.7%', color:C.clay, hl:true,
        hbsub:'<b>Highest in the nation.</b> A small, older, Medicare/Medicaid-heavy economy — $12,769 per person.' },
      { name:'Mississippi', val:22, val_label:'~22%', est:true, color:mix(C.clay,78),
        hbsub:'A large health bill set against one of the smallest economies — $9,394 per person.' },
      { name:'Vermont', val:22, val_label:'~22%', est:true, color:mix(C.clay,58),
        hbsub:'Old, rural, high per-unit care costs — $12,756 per person.' },
      { name:'New York', val:16.6, val_label:'~17%', est:true, color:C.green, hl:true,
        hbsub:'GDP <b>$2.3T</b> — comparable to Canada. Highest per-capita health spending of any state: <b>$14,007</b>.' },
      { name:'Texas', val:13.8, val_label:'~14%', est:true, color:mix(C.green,72),
        hbsub:'GDP <b>$2.8T</b> — larger than Italy. Just $8,406 per person (young population, high uninsured rate).' },
      { name:'California', val:13.3, val_label:'~13%', est:true, color:mix(C.green,55),
        hbsub:'GDP <b>$4.1T</b> — the world’s 4th-largest economy, bigger than Japan. $10,299 per person.' }
    ];
    el.innerHTML =
      '<div class="chart-flag clay"><span class="arr">&darr;</span> The three biggest state economies all spend a <b>smaller</b> share than the U.S. average. The states pushing the country toward <b>~18%</b> are its smallest and poorest — led by West Virginia at <b>28.7%</b>.</div>'
      + hbars({ rows:rows, scaleMax:30, barh:38, rowgap:26,
          ticks:[{v:0,l:'0%'},{v:9,l:'OECD ~9%'},{v:18,l:'U.S. 18%'},{v:24,l:'24%'},{v:30,l:'30%'}] });
  }

  /* =========================================================
     RUNNING-TOTAL COUNTER
     ========================================================= */
  function runningCounter(){
    var box = document.getElementById('tabCounter'); if(!box) return;
    var numEl = box.querySelector('.tc-num');
    var RATE = 5.3e12 / (365*24*3600); // ≈ $168,074 / second
    var start = performance.now();
    var fmt = new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 });
    function tick(now){
      var spent = (now - start)/1000 * RATE;
      numEl.textContent = fmt.format(spent);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    var close = box.querySelector('.tc-close');
    if (close) close.addEventListener('click', function(){ box.classList.add('hidden'); });
  }

  /* =========================================================
     RENDER + REVEAL
     ========================================================= */
  function renderAll(){ chart1(); chart2(); chart3(); chart4(); }
  function observe(){
    var targets = document.querySelectorAll('.fig, .statstrip, .reveal, .chapter');
    if (!('IntersectionObserver' in window)){ targets.forEach(function(t){t.classList.add('in');}); return; }
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold:0.16, rootMargin:'0px 0px -8% 0px' });
    targets.forEach(function(t){ io.observe(t); });
  }
  function init(){ renderAll(); observe(); runningCounter(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
