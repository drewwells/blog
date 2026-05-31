/* ============================================================
   charts.js — data + derived ratios + render + scroll reveal
   Austin ISD vs Houston / Dallas / Fort Worth
   ============================================================ */
(function () {
  'use strict';

  /* ---- palette handles (mirror styles.css) ---- */
  var C = {
    austin: '#5a3fcf', austinInk: '#3f269e', paper: '#faf8f3',
    recap: '#b14c3f',
    g1: '#57534b', g2: '#847e73', g3: '#aaa395', faint: '#8c857a'
  };
  function mix(hex, pct, withHex) {
    // pct = amount of `hex`, rest is `withHex`
    withHex = withHex || C.paper;
    function rgb(h){h=h.replace('#','');return [0,2,4].map(function(i){return parseInt(h.substr(i,2),16);});}
    var a = rgb(hex), b = rgb(withHex), p = pct/100;
    return 'rgb(' + a.map(function(v,i){return Math.round(v*p + b[i]*(1-p));}).join(',') + ')';
  }
  var fmtPct = function (v) { return (Math.round(v*10)/10).toString().replace(/\.0$/, '') + '%'; };
  var fmt$  = function (v) { return '$' + Math.round(v).toLocaleString('en-US'); };
  var r1    = function (v) { return (Math.round(v*10)/10).toFixed(1); };

  /* =========================================================
     SOURCE DATA  (single source of truth)
     ========================================================= */
  // gross local tax/pupil = net retained + recapture/pupil
  var DISTRICTS = {
    austin:    { name:'Austin ISD',     short:'AISD',  austin:true,  enr:72830,
                 staar:49, grad:90.9, econ:52,   ebel:31.4,
                 gross:18397, recap:9597, net:8800, est:false },
    houston:   { name:'Houston ISD',    short:'HISD',  austin:false, enr:184109,
                 staar:44, grad:83.0, econ:79,   ebel:39.0,
                 gross:8000,  recap:1344, net:6656, est:true, econEst:true },
    fortworth: { name:'Fort Worth ISD', short:'FWISD', austin:false, enr:71060,
                 staar:25, grad:81.7, econ:81.9, ebel:41.2,
                 gross:6900,  recap:69,   net:6831, est:true, staarApprox:true },
    dallas:    { name:'Dallas ISD',     short:'DISD',  austin:false, enr:139246,
                 staar:42, grad:81.4, econ:90,   ebel:50.5,
                 gross:6600,  recap:331,  net:6269, est:true, econEst:true }
  };
  // outcome order for charts 1 & 2: graduation rate descending
  var ORDER = ['austin','houston','fortworth','dallas'];
  function rows(){ return ORDER.map(function(k){ return DISTRICTS[k]; }); }

  // derived effectiveness ratios (outcome per $1,000 of local tax/pupil)
  function ratios(d){
    return {
      staarGross: d.staar / (d.gross/1000),
      staarNet:   d.staar / (d.net/1000),
      gradGross:  d.grad  / (d.gross/1000),
      gradNet:    d.grad  / (d.net/1000)
    };
  }

  /* =========================================================
     CHART 1 & 2 — vertical grouped bars
     ========================================================= */
  function groupedBars(id, opt){
    var el = document.getElementById(id); if(!el) return;
    var max = opt.max, step = opt.step, areaH = opt.areaH || 340;
    // gridlines
    var grid = '';
    for (var g=0; g<=max; g+=step){
      var bottom = (g/max)*100;
      grid += '<div class="gridline" style="bottom:'+bottom+'%"><span>'+g+(opt.unit||'')+'</span></div>';
    }
    // bars
    var bars = '';
    opt.data.forEach(function(d){
      var prim = d.austin ? C.austin : C.g2;
      var sec  = d.austin ? mix(C.austin,42) : mix(C.g2,52);
      var b = '<div class="vgroup">';
      [0,1].forEach(function(i){
        var v = opt.series[i].get(d);
        var h = (v/max)*100;
        var col = i===0 ? prim : sec;
        var lab = fmtPct(v) + (opt.series[i].markApprox && d.staarApprox ? '<span class="aster">*</span>' : '');
        b += '<div class="vbar'+(d.austin?' austin':'')+'" style="--h:'+h+'%;background:'+col+'">'
           +   '<span class="vval">'+lab+'</span>'
           + '</div>';
      });
      b += '</div>';
      bars += b;
    });
    // labels
    var labs = '';
    opt.data.forEach(function(d){
      labs += '<div class="vl"><div class="name'+(d.austin?' austin':'')+'">'+d.name.replace(' ISD','')+'</div>'
            + '<div class="sub">'+d.short+'</div></div>';
    });
    el.innerHTML =
      '<div class="serieskey">'
        + '<div class="k"><span class="d" style="background:'+ (opt.austinKey? C.austin : C.g1) +'"></span>'+opt.series[0].label+'</div>'
        + '<div class="k"><span class="d" style="background:'+ mix(C.g1,55) +'"></span>'+opt.series[1].label+'</div>'
      + '</div>'
      + (opt.annot || '')
      + '<div class="vbars" style="--n:'+opt.data.length+';--areaH:'+areaH+'px">'+grid+bars+'</div>'
      + '<div class="vlabels" style="--n:'+opt.data.length+'">'+labs+'</div>';
  }

  /* =========================================================
     CHART 3 — horizontal stacked bars (gross = net + recapture)
     ========================================================= */
  function stackedBars(id){
    var el = document.getElementById(id); if(!el) return;
    var data = ['austin','houston','fortworth','dallas'].map(function(k){return DISTRICTS[k];});
    var scaleMax = 20000; // $/pupil axis
    var html = '<div class="hbars">';
    data.forEach(function(d){
      var netW = (d.net/scaleMax)*100, recW = (d.recap/scaleMax)*100;
      var estCls = d.est ? ' est' : '';
      var recShare = Math.round(d.recap/d.gross*100);
      html += '<div class="hrow">'
        + '<div class="hlab"><span class="hname'+(d.austin?' austin':'')+'">'+d.name
            + (d.est? '<span class="est-tag">est</span>':'') + '</span>'
            + '<span class="htot">'+fmt$(d.gross)+' / pupil</span></div>'
        + '<div class="htrack">'
          + '<div class="seg net'+(d.austin?'':' peer')+estCls+'" style="--w:'+netW+'%">'
              + '<span class="seglab">'+fmt$(d.net)+'</span></div>'
          + '<div class="seg recap'+estCls+'" style="--w:'+recW+'%">'
              + (recW>9?'<span class="seglab">'+fmt$(d.recap)+'</span>':'') + '</div>'
        + '</div>'
        + '<div class="hsub">'
          + (d.austin
              ? '<b style="color:var(--recap-deep)">'+recShare+'% sent to the state</b> &middot; '+fmt$(d.net)+' retained per pupil'
              : 'Recapture &asymp; '+recShare+'% &mdash; net retained &asymp; gross <span class="est-tag">est</span>')
        + '</div>'
        + '</div>';
    });
    html += '</div>';
    // axis
    var ax = '<div class="haxis">';
    [0,5000,10000,15000,20000].forEach(function(t){
      ax += '<div class="tick" style="left:'+(t/scaleMax*100)+'%">$'+(t/1000)+'k</div>';
    });
    ax += '</div>';
    el.innerHTML = html + ax;
  }

  /* =========================================================
     CHART 4 — dumbbell panels (outcome per $1k, gross -> net)
     ========================================================= */
  function dumbbellPanel(d, scaleMax, getG, getN){
    var R = ratios(d);
    var gv = getG(R), nv = getN(R);
    var gp = gv/scaleMax*100, np = nv/scaleMax*100;
    var lo = Math.min(gp,np), span = Math.abs(np-gp);
    var peer = !d.austin;
    var below = span < 14; // crowd avoidance for short connectors
    return '<div class="drow">'
      + '<div class="dname'+(d.austin?' austin':'')+'">'+d.name.replace(' ISD','')
          + (peer? '<span class="dest">est. denom.</span>':'')
          + (d.staarApprox? '<span class="dest">staar approx*</span>':'') + '</div>'
      + '<div class="dtrack">'
        + '<div class="dbase"></div>'
        + '<div class="dconn'+(peer?' peer':'')+'" style="--g:'+lo+'%;--span:'+span+'%"></div>'
        + '<div class="ddot gross" style="--g:'+gp+'%"></div>'
        + '<div class="ddot net'+(peer?' peer':'')+'" style="--g:'+gp+'%;--n:'+np+'%"></div>'
        + '<div class="dval gross'+(below?' below':'')+'" style="--g:'+gp+'%">'+r1(gv)+'</div>'
        + '<div class="dval net'+(peer?' peer':'')+'" style="--n:'+np+'%">'+r1(nv)+'</div>'
      + '</div>'
    + '</div>';
  }
  function dumbbells(id){
    var el = document.getElementById(id); if(!el) return;
    var data = ['austin','houston','fortworth','dallas'].map(function(k){return DISTRICTS[k];});
    function panel(title, hl, scaleMax, ticks, getG, getN){
      var h = '<div class="dumb-panel"><div class="dtitle">'+title+'</div>';
      data.forEach(function(d){ h += dumbbellPanel(d, scaleMax, getG, getN); });
      var ax = '<div class="daxis">';
      ticks.forEach(function(t){ ax += '<div class="tick" style="left:'+(t/scaleMax*100)+'%">'+t+'</div>'; });
      ax += '<span class="axlab">'+hl+'</span></div>';
      return h + ax + '</div>';
    }
    el.innerHTML =
      '<div class="dkey">'
        + '<div class="k"><span class="dotk g"></span>Against dollars <b>raised</b> (gross)</div>'
        + '<div class="k"><span class="dotk n"></span>Against dollars <b>kept</b> (net of recapture)</div>'
      + '</div>'
      + panel('STAAR &ldquo;Meets&rdquo; <span class="em">per $1k local tax / pupil</span>', 'points per $1k', 8, [0,2,4,6,8],
              function(R){return R.staarGross;}, function(R){return R.staarNet;})
      + panel('Graduation rate <span class="em">per $1k local tax / pupil</span>', 'points per $1k', 14, [0,4,8,12],
              function(R){return R.gradGross;}, function(R){return R.gradNet;});
  }

  /* =========================================================
     CHART 5 — rank flip (STAAR per $1k: gross vs net)
     ========================================================= */
  function rankFlip(id){
    var el = document.getElementById(id); if(!el) return;
    var keys = ['austin','houston','fortworth','dallas'];
    var rec = keys.map(function(k){
      var d = DISTRICTS[k], R = ratios(d);
      return { k:k, name:d.name.replace(' ISD',''), austin:d.austin, est:d.est,
               approx:d.staarApprox, gross:R.staarGross, net:R.staarNet };
    });
    var scaleMax = 7;
    var grossSorted = rec.slice().sort(function(a,b){return b.gross-a.gross;});
    var netSorted   = rec.slice().sort(function(a,b){return b.net-a.net;});
    var grossIdx={}, netIdx={};
    grossSorted.forEach(function(r,i){grossIdx[r.k]=i;});
    netSorted.forEach(function(r,i){netIdx[r.k]=i;});

    function col(side, sorted, valKey){
      var h = '<div class="flipcol '+side+'"><div class="ch">Ranked by dollars <b>'
              + (valKey==='gross'?'raised':'kept')+'</b></div>';
      sorted.forEach(function(r,i){
        var w = r[valKey]/scaleMax*100;
        h += '<div class="rank'+(side==='r'?' right':'')+'">'
           + '<div class="pos">'+(i+1)+'</div>'
           + '<div class="rbar-wrap">'
             + '<div class="rname'+(r.austin?' austin':'')+'"><span>'+r.name
                 + (r.approx?'<span class="aster">*</span>':'')+'</span><span class="rval">'+r1(r[valKey])+'</span></div>'
             + '<div class="rbar'+(r.austin?' austin':'')+'" style="--w:'+w+'%;'+(r.est&&!r.austin?'opacity:.55':'')+'"></div>'
           + '</div></div>';
      });
      return h + '</div>';
    }
    // connectors
    var headH = 36, rowH = 58, midW = 76, svgH = headH + 4*rowH;
    function cy(i){ return headH + i*rowH + 29; }
    var lines = '';
    rec.forEach(function(r){
      var yL = cy(grossIdx[r.k]), yR = cy(netIdx[r.k]);
      var len = Math.hypot(midW, yR-yL);
      var col = r.austin ? C.austin : mix(C.g3,80);
      var w = r.austin ? 2.6 : 1.6;
      lines += '<path class="cline" d="M0 '+yL+' C '+(midW*0.5)+' '+yL+', '+(midW*0.5)+' '+yR+', '+midW+' '+yR+'" '
             + 'stroke="'+col+'" stroke-width="'+w+'" style="--len:'+len+'"></path>';
    });
    var mid = '<div class="flipmid"><svg viewBox="0 0 '+midW+' '+svgH+'" preserveAspectRatio="none">'+lines+'</svg></div>';

    el.innerHTML = '<div class="flip">'
      + col('l', grossSorted, 'gross')
      + mid
      + col('r', netSorted, 'net')
      + '</div>';
  }

  /* =========================================================
     RENDER ALL
     ========================================================= */
  function renderAll(){
    groupedBars('chart1', {
      data: rows(), max:100, step:25, unit:'%', areaH:330, austinKey:true,
      series:[
        { label:'STAAR &ldquo;Meets&rdquo; or above', get:function(d){return d.staar;}, markApprox:true },
        { label:'Graduation rate', get:function(d){return d.grad;} }
      ],
      annot:'<div class="chart-flag"><span class="arr">&darr;</span> <b>Austin</b> &mdash; highest graduation rate of any major Texas city</div>'
    });
    groupedBars('chart2', {
      data: rows(), max:100, step:25, unit:'%', areaH:330, austinKey:true,
      series:[
        { label:'Economically disadvantaged', get:function(d){return d.econ;} },
        { label:'Emergent bilingual / EL', get:function(d){return d.ebel;} }
      ]
    });
    stackedBars('chart3');
    dumbbells('chart4');
    rankFlip('chart5');
  }

  /* =========================================================
     SCROLL REVEAL
     ========================================================= */
  function observe(){
    var targets = document.querySelectorAll('.fig, .statstrip, .reveal');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function(t){ t.classList.add('in'); }); return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold:0.18, rootMargin:'0px 0px -8% 0px' });
    targets.forEach(function(t){ io.observe(t); });
  }

  function init(){ renderAll(); observe(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
