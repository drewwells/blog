/* ============================================================
   The Rotation — interactive gym checklist (WST Blog)
   Dependency-free vanilla JS. Ported from the Claude Design
   prototype (Rotating Workout.dc.html). Renders into #rotation.

   Data is verbatim from the source program — see handoff §5.
   State persists to localStorage key "wst-rotation-v1".
   ============================================================ */
(function () {
  'use strict';

  var LS_KEY = 'wst-rotation-v2';
  var LS_KEY_OLD = 'wst-rotation-v1';

  var DAYKEYS = ['Push', 'Pull', 'Legs', 'Arms'];

  var DAYMETA = {
    Push: { sub: 'Chest · Shoulders · Triceps', reels: [
      'https://www.instagram.com/p/DF6M9z0xJCR/', 'https://www.instagram.com/p/DIHbKS8x2dn/',
      'https://www.instagram.com/p/DRPx7n-EY-B/', 'https://www.instagram.com/p/DHXKliCxLbQ/',
      'https://www.instagram.com/reel/DHHa8QBx6Nn/', 'https://www.instagram.com/reel/DPe0WoIEUbh/'] },
    Pull: { sub: 'Back · Rear Delts · Biceps', reels: [
      'https://www.instagram.com/p/DGa5HZuRQ1Q/', 'https://www.instagram.com/p/DQ95xYhEZCS/',
      'https://www.instagram.com/reel/DJzlavgx86w/', 'https://www.instagram.com/reel/DP1_QoMkYMq/',
      'https://www.instagram.com/p/DS24nMGEd-2/', 'https://www.instagram.com/reel/DQZe30FkXuu/'] },
    Legs: { sub: 'Quads · Hams · Glutes · Core', reels: [
      'https://www.instagram.com/reel/DGBXeFQRoXM/', 'https://www.instagram.com/reel/DLU5gOQMClw/',
      'https://www.instagram.com/p/DQ14JHwEcff/', 'https://www.instagram.com/reel/DMqBT_9xNJX/',
      'https://www.instagram.com/reel/DOb9iPQEbhG/'] },
    Arms: { sub: 'Arms · Shoulders · Isolation', reels: [
      'https://www.instagram.com/reel/DGMjpUWxcdP/', 'https://www.instagram.com/reel/DKpZtD5xYpe/',
      'https://www.instagram.com/p/DS-9W6CEbnN/', 'https://www.instagram.com/p/DXc3n7VkSdR/',
      'https://www.instagram.com/reel/DJPE8mMRlMB/', 'https://www.instagram.com/reel/DJh6r0exmpA/'] }
  };

  var PROGRAMS = {
    A: {
      Push: [
        ['Incline Press', '5', null, null],
        ['Cable Fly', null, '75', null],
        ['Seated Pec Deck Fly', null, null, 'Maximize time under tension during the eccentric phase'],
        ['Front Delt Raises', null, '12-15', 'Superset with side lateral raises'],
        ['Side Lateral Raises', null, '12-15', 'Arch elbows slightly, lead with the elbows'],
        ['Front Raise + Lateral Raise superset', null, '18/15/12 front / 18/15/12 side', 'Lock DBs together for the front raise; drop weight for the descending reps'],
        ['Cable Rope Pushdown', '3', null, 'Part of a superset; controlled reps, high volume, burnout'],
        ['Tricep Pushdown (Straight Bar)', '3', null, 'Superset with rope pushdowns; practically no rest between']],
      Pull: [
        ['Lat Pulldown', '4', '8-15', 'Use straps or a mag-grip attachment to reduce forearm grip fatigue'],
        ['Kneeling Face Pull', '3-4', '8-12', 'Targets upper back and rear delts. Alternate knees as needed.'],
        ['Cable Rear Delt Pull-Through', null, null, 'Credit to Seabum; test different angles to isolate the rear delt'],
        ['Standing Cable Curls', '3-4', '10-12, then partials', 'Burnout; clean form, avoid whole-body momentum'],
        ['21s', '3-4', '21 (11 half + 11 top)', null],
        ['Pull-Up', '4', null, 'To failure on the last two sets (last set at 50% of max pull-ups)']],
      Legs: [
        ['Bulgarian Split Squat', '4', '8', 'Drop set; pause 8s at quarter-way up (isometric) between sets, no rest. Use dumbbells and a stable surface.'],
        ['Leg Press', '3-4', '20/12-15/8', 'Optional 4th set of 8 reps'],
        ['Leg Extension Machine', '3', '20/12/8', 'Superset with hamstring curls'],
        ['Leg Raises', null, '8-12', null],
        ['Weighted Decline Crunch', null, null, 'Isolates the lower abs even more']],
      Arms: [
        ['Seated Front Delt Raise', '3-4', '10', 'Seated'],
        ['Semi Lateral Raise', '3-4', '10', 'Semi angle'],
        ['Cable Front Raise', null, null, 'Cable at bottom height, rope attachment; target front delts'],
        ['Standing Barbell Curls', null, '8-12', 'Controlled form. Superset with rope curls.'],
        ['Rope Curls', null, '6-8', 'Immediately after the standing curls (superset); twist inwards at the top'],
        ['Cable Triceps Kickback', null, null, 'Targets the long head'],
        ['Plate 90 Holds', '2-3', '20-30 sec', 'Focuses on the entire forearm and grip strength']]
    },
    B: {
      Push: [
        ['Incline Dumbbell Press', '5', null, null],
        ['Incline Dumbbell Fly', '5', null, null],
        ['High to Low Cable Fly', null, null, 'High intensity; push hard for the last couple of sets'],
        ['Shoulder Press Machine', '3', '12/8/6', 'Slow eccentric, fast concentric (tempo focus)'],
        ['Chest-Supported Superman Lateral Raises', '4', '12-15', 'High volume, targets side delts'],
        ['Cable Reverse Fly', '3', '12/10/8', 'Isolates the rear delt'],
        ['Single-Arm Tricep Kickback', '1', null, 'Form breakdown acceptable on the last set'],
        ['Cable Tricep Kickbacks', null, null, 'Target the medial head. Lightweight, high volume, mind-muscle connection.']],
      Pull: [
        ['Close-Grip Mag-Grip Pulldown', null, 'high volume', 'Focus on upper traps and rhomboids; prioritize mind-muscle connection'],
        ['Cable Lat Pullover', null, null, 'Athletic stance, pull through with arms straight. Avoid a push-down motion.'],
        ['Bent-Over Rear Delt Fly', null, null, 'Imagine sweeping chips off the entire poker table'],
        ['Reverse Cable Fly', null, null, 'Test different angles to isolate the rear delt'],
        ['Single-Arm Peak Builder Bicep Curls', '3-4', '10-15', 'Slight lean; twist the pinky inward at the top'],
        ['Preacher Curls', '3-4', '8-12', 'Neutral grip = both heads, close = outer, wide = inner. Slow eccentric.']],
      Legs: [
        ['Bulgarian Split Squats', '3', '12/10/8', null],
        ['Leg Press', '4', '6-12', 'Low foot = quads, high = glutes, wide stance = inner thighs'],
        ['Leg Extension Machine (Drop Set)', '10', null, 'Drop set: drop 10 lbs per set'],
        ['High Leg Raises', null, '6-8', null],
        ['Weighted Sit-Ups', null, null, 'Targets the whole abs, mainly mid and upper']],
      Arms: [
        ['Full Lateral Raise', '3-4', '10', 'Full range'],
        ['Rear Delt Raise', '3-4', '10', 'Back'],
        ['Rope Curls (Forearm Emphasis)', null, '6-8', 'Emphasis on the forearm'],
        ['Reverse Wrist Rotations', null, null, 'Isolate the forearm'],
        ['Cable Overhand Wrist Rotations', '2-3', '8-12', 'Cable set to top, overhand grip'],
        ['Rope Pushdown', '3-4', '15-18', 'Superset with straight-bar pushdown; same weight; under 20s rest'],
        ['Straight-Bar Pushdown', '3-4', '15-18', 'Superset with rope pushdown; same weight; under 20s rest']]
    },
    C: {
      Push: [
        ['Flat Bench Press', null, null, 'Controlled tempo; avoid ego lifting / excessive back arch'],
        ['Pullover', null, null, null],
        ['Push-Up', '3', null, '80-90% to failure (sets 1-2), 100% to failure (set 3)'],
        ['Incline Shoulder Press', '3-4', '15/12/8', 'Set the bench to 75 degrees to relieve rotator-cuff pressure'],
        ['Lateral Raises', '4', '8-15', 'Lightest weight, burnout (1 warm-up, 2 working, 1 burnout)'],
        ['Cable Lateral Raise', '4', '15/12/8', 'High volume side delts; end with a 0-weight burnout, 30-50 reps'],
        ['Rope & Straight-Bar Tricep Pushdown superset', '3', '15/12/8', 'Short rest (20-30s). Pushing intensity.'],
        ['Dips', '3', null, '80% / 90% / 100% to failure (slow eccentric)']],
      Pull: [
        ['Straight-Bar Lat Pulldown', '4', '8-15', 'Form over weight; spread the lats, squeeze at the bottom'],
        ['Reverse Single-Arm Fly', null, null, 'Chest facing forward; sweep poker chips off a table'],
        ['Bicep Finisher (Hammer Curls)', null, '5/5 per arm, then to failure', 'Keep one arm stagnant, rinse/repeat; both arms for the final reps'],
        ['Standing Curls', '3', '12-15', 'Clean form, pinky twist at the top'],
        ['Peak Builder Bicep Curls', null, '6-8', 'Heavy; advanced only, requires good mind-muscle connection']],
      Legs: [
        ['Hack Squat', '3', '20/12/6-8', null],
        ['Leg Extensions & Hamstring Curls', '3 + 1 drop set', '15/12/8', 'Superset. Drop set: weight 10 notches down, 11 reps, then drop one notch until zero.'],
        ['Leg Raises with a Twist', null, '6-8', null],
        ['Weighted Hanging Leg Raises', null, null, 'Use cables for resistance']],
      Arms: [
        ['Cable Face Pull', null, null, 'Cable at top height, rope attachment, pull to the face; rear delts'],
        ['Cable Lateral Raise', null, null, 'Cable at knee height, rope attachment, pull straight up leading with the elbows; side delts'],
        ['Cable Reverse Curls', '2-3', '8-12', 'Cable set to bottom, straight bar'],
        ['Cable Underhand Wrist Rotations', '2-3', '8-12', 'Cable set to bottom, straight bar'],
        ['Triceps Rope Pushdown', null, null, 'Targets the lateral head'],
        ['Triceps Straight-Bar Pushdown', null, null, 'Targets the medial head']]
    }
  };

  /* ---------------- state ---------------- */
  var state = { program: 'A', day: 'Push', layout: 'expanded', week: 1,
                checks: {}, expanded: null, howToOpen: false, reelsOpen: false,
                menuOpen: false, stuck: false };

  var migrated = false;
  try {
    var raw = localStorage.getItem(LS_KEY);
    if (raw) {
      var s = JSON.parse(raw);
      if (s && typeof s === 'object') {
        if (s.program) state.program = s.program;
        if (s.day) state.day = s.day;
        if (s.layout) state.layout = s.layout;
        if (s.week) state.week = s.week;
        if (s.checks && typeof s.checks === 'object') state.checks = s.checks;
      }
    } else {
      // Migrate from v1. Its `checks` were keyed by ARRAY INDEX
      // (program|day|i), which the Pull-day reorder invalidated — index 1
      // is no longer the same exercise. Remapping them would land marks on
      // the wrong rows, so carry only the stable prefs (program/day/layout/
      // week) and drop the checks: a clean reset. v2 keys checks by exercise
      // NAME, which survives future reorders.
      var oldRaw = localStorage.getItem(LS_KEY_OLD);
      if (oldRaw) {
        var o = JSON.parse(oldRaw);
        if (o && typeof o === 'object') {
          if (o.program) state.program = o.program;
          if (o.day) state.day = o.day;
          if (o.layout) state.layout = o.layout;
          if (o.week) state.week = o.week;
        }
        try { localStorage.removeItem(LS_KEY_OLD); } catch (e) {}
        migrated = true;
      }
    }
  } catch (e) {}

  // If we carried prefs forward from v1, write v2 now so the migration is
  // durable even if the user never interacts this session (persist() is
  // hoisted, so calling it before its definition is fine).
  if (migrated) persist();

  function persist() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({
        program: state.program, day: state.day, layout: state.layout,
        week: state.week, checks: state.checks
      }));
    } catch (e) {}
  }

  /* ---------------- helpers ---------------- */
  function h(tag, cls) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }

  function prettify(v) {
    return v == null ? '' : String(v).replace(/(\d)\s*-\s*(\d)/g, '$1–$2');
  }
  function fmtPresc(sets, reps) {
    var sl = '';
    if (sets) { sl = /^\d+(-\d+)?$/.test(sets) ? prettify(sets) + ' set' + (sets === '1' ? '' : 's') : sets; }
    var rl = '';
    if (reps) { rl = /^\d+$/.test(reps) ? reps + ' reps' : prettify(reps); }
    var parts = [sl, rl].filter(Boolean);
    return parts.length ? parts.join('   ·   ') : 'As prescribed';
  }
  // Checks are keyed by exercise NAME (stable across reorders), not index.
  // Names are unique within a single program/day, so program|day|name is a
  // safe key; '|' never appears in an exercise name.
  function checkKey(p, d, name) { return p + '|' + d + '|' + name; }

  function countDone(p, d) {
    var list = PROGRAMS[p][d] || [], done = 0;
    for (var i = 0; i < list.length; i++) { if (state.checks[checkKey(p, d, list[i][0])]) done++; }
    return { done: done, total: list.length };
  }

  /* ---------------- handlers ---------------- */
  function selectProgram(p) { state.program = p; state.expanded = null; persist(); render(); }
  function selectDay(d) { state.day = d; state.expanded = null; persist(); render(); }
  function setLayout(l) { state.layout = l; state.expanded = null; persist(); render(); }
  function weekDelta(n) { state.week = Math.max(1, state.week + n); persist(); render(); }
  function toggleCheck(key) {
    if (state.checks[key]) delete state.checks[key]; else state.checks[key] = true;
    persist(); render();
  }
  function toggleExpand(key) { state.expanded = state.expanded === key ? null : key; render(); }
  function resetDay() {
    var pre = state.program + '|' + state.day + '|';
    Object.keys(state.checks).forEach(function (k) { if (k.indexOf(pre) === 0) delete state.checks[k]; });
    persist(); render();
  }

  /* ---------------- view fragments ---------------- */
  function buildHowTo() {
    var p = h('div', 'rot-howto');
    p.innerHTML =
      '<div class="rot-howto__inner">'
      + '<div class="rot-howto__desc">Three four-day programs &mdash; <b>A, B, C</b> &mdash; built from one exercise pool. Run one for a few weeks, then rotate; same split order every time: Push &rarr; Pull &rarr; Legs &rarr; Arms, compounds first while you&rsquo;re fresh. Tap an exercise to tick it off &mdash; your checks are saved, per program.</div>'
      + '<div class="rot-howto__block rot-howto__block--sep"><div class="rot-howto__term">15 / 12 / 6&ndash;8</div><div class="rot-howto__def">One set per number, in order &mdash; set 1 is 15 reps, set 2 is 12, set 3 is 6&ndash;8. Go through the sequence <b>once</b>, not repeated. Add weight as the target drops.</div></div>'
      + '<div class="rot-howto__block"><div class="rot-howto__term">A range like 6&ndash;8</div><div class="rot-howto__def">One set; reach failure somewhere in that range. It is not two separate sets.</div></div>'
      + '<div class="rot-howto__block"><div class="rot-howto__term">Superset</div><div class="rot-howto__def">The two paired moves back-to-back with <b>no rest</b> between them. Rest only after the pair, then repeat for the listed sets.</div></div>'
      + '<div class="rot-howto__block"><div class="rot-howto__term">to failure &middot; burnout &middot; quick pump</div><div class="rot-howto__def">Intensity cues &mdash; how hard to push that set. Form over ego when it says to failure.</div></div>'
      + '<div class="rot-howto__block rot-howto__block--sep"><div class="rot-howto__term rot-howto__term--muted">Running the rotation</div><div class="rot-howto__def">4 lifting days a week (e.g. Mon / Tue / Thu / Fri), 3 rest. Stay on one program for a few weeks, then switch A &rarr; B &rarr; C. Same order every time: Push &rarr; Pull &rarr; Legs &rarr; Arms, compounds first while you&rsquo;re fresh.</div></div>'
      + '</div>';
    return p;
  }

  function buildMenu() {
    var m = h('div', 'rot-menu');
    var label = h('div', 'rot-menu__label');
    label.innerHTML = 'Currently running &mdash; Program ' + state.program;
    m.appendChild(label);

    var prog = h('div', 'rot-prog');
    ['A', 'B', 'C'].forEach(function (p) {
      var b = h('button', 'rot-prog__btn' + (p === state.program ? ' is-active' : ''));
      b.type = 'button'; b.textContent = p;
      b.addEventListener('click', function () { selectProgram(p); });
      prog.appendChild(b);
    });
    m.appendChild(prog);

    var wk = h('div', 'rot-week');
    var wl = h('span', 'rot-week__label'); wl.textContent = 'Week of block';
    var ctrl = h('div', 'rot-week__ctrl');
    var minus = h('button', 'rot-step'); minus.type = 'button'; minus.innerHTML = '&minus;';
    minus.addEventListener('click', function () { weekDelta(-1); });
    var num = h('span', 'rot-week__num'); num.textContent = state.week;
    var plus = h('button', 'rot-step'); plus.type = 'button'; plus.textContent = '+';
    plus.addEventListener('click', function () { weekDelta(1); });
    ctrl.appendChild(minus); ctrl.appendChild(num); ctrl.appendChild(plus);
    wk.appendChild(wl); wk.appendChild(ctrl);
    m.appendChild(wk);
    return m;
  }

  function buildHeader() {
    var header = h('div', 'rot-header');

    var bar = h('div', 'rot-headbar');
    var left = h('div', 'rot-headbar__left');
    var kicker = h('span', 'rot-kicker'); kicker.innerHTML = 'Training &middot; Rotating Split';
    var howBtn = h('button', 'rot-howto-toggle'); howBtn.type = 'button';
    var howLbl = h('span', 'rot-howto-toggle__label'); howLbl.textContent = 'How to read the card';
    var howChev = h('span', 'rot-howto-toggle__chev'); howChev.textContent = state.howToOpen ? '⌃' : '⌄';
    howBtn.appendChild(howLbl); howBtn.appendChild(howChev);
    howBtn.addEventListener('click', function () { state.howToOpen = !state.howToOpen; render(); });
    left.appendChild(kicker); left.appendChild(howBtn);

    var menuBtn = h('button', 'rot-menu-btn'); menuBtn.type = 'button';
    menuBtn.setAttribute('aria-label', 'Program menu');
    menuBtn.textContent = state.menuOpen ? '✕' : '☰';
    menuBtn.addEventListener('click', function () { state.menuOpen = !state.menuOpen; render(); });

    bar.appendChild(left); bar.appendChild(menuBtn);
    header.appendChild(bar);

    if (state.howToOpen) header.appendChild(buildHowTo());
    if (state.menuOpen) header.appendChild(buildMenu());
    return header;
  }

  function buildDayTabs() {
    var tabs = h('div', 'rot-days');
    DAYKEYS.forEach(function (d) {
      var c = countDone(state.program, d);
      var complete = c.total > 0 && c.done === c.total;
      var active = d === state.day;
      var b = h('button', 'rot-day' + (active ? ' is-active' : '')); b.type = 'button';
      var l = h('span', 'rot-day__label'); l.textContent = d;
      var bd = h('span', 'rot-day__badge' + (complete ? ' is-complete' : ''));
      bd.innerHTML = complete ? 'done &#10003;' : (c.done + '/' + c.total);
      b.appendChild(l); b.appendChild(bd);
      b.addEventListener('click', function () { selectDay(d); });
      tabs.appendChild(b);
    });
    return tabs;
  }

  // Sticky day header: a 1px sentinel followed by a position:sticky wrapper.
  // The wrapper shows the full header at rest and a compact pinned bar when stuck.
  function buildStickyRegion(frag) {
    var sentinel = h('div', 'rot-sentinel');
    sentinel.setAttribute('data-rotation-sentinel', '1');
    frag.appendChild(sentinel);

    var wrap = h('div', 'rot-sticky' + (state.stuck ? ' is-stuck' : ''));
    wrap.appendChild(state.stuck ? buildDayHeaderStuck() : buildDayHeaderFull());
    frag.appendChild(wrap);
  }

  function buildDayHeaderFull() {
    var box = h('div', 'rot-dayhead-full');

    var top = h('div', 'rot-dayhead');
    var info = h('div');
    var num = h('div', 'rot-dayhead__num');
    num.innerHTML = 'Program ' + state.program + '&nbsp;&nbsp;&middot;&nbsp;&nbsp;Day ' + (DAYKEYS.indexOf(state.day) + 1);
    var title = h('div', 'rot-dayhead__title'); title.textContent = state.day;
    var sub = h('div', 'rot-dayhead__sub'); sub.textContent = DAYMETA[state.day].sub;
    info.appendChild(num); info.appendChild(title); info.appendChild(sub);
    var reset = h('button', 'rot-reset'); reset.type = 'button'; reset.textContent = 'Reset';
    reset.addEventListener('click', function () { resetDay(); });
    top.appendChild(info); top.appendChild(reset);
    box.appendChild(top);

    var c = countDone(state.program, state.day);
    var pct = c.total ? Math.round(c.done / c.total * 100) : 0;
    var allDone = c.total > 0 && c.done === c.total;
    var pr = h('div', 'rot-progress');
    var track = h('div', 'rot-progress__track');
    var fill = h('div', 'rot-progress__fill' + (allDone ? ' is-done' : '')); fill.style.width = pct + '%';
    track.appendChild(fill);
    var label = h('div', 'rot-progress__label');
    label.textContent = allDone ? ('All ' + c.total + ' done') : (c.done + ' of ' + c.total + ' done');
    pr.appendChild(track); pr.appendChild(label);
    box.appendChild(pr);
    return box;
  }

  function buildDayHeaderStuck() {
    var c = countDone(state.program, state.day);
    var pct = c.total ? Math.round(c.done / c.total * 100) : 0;
    var allDone = c.total > 0 && c.done === c.total;

    var box = h('div');
    var row = h('div', 'rot-stuck__row');
    var left = h('div', 'rot-stuck__left');
    var label = h('span', 'rot-stuck__label'); label.textContent = 'Program ' + state.program + ' · ' + state.day;
    var count = h('span', 'rot-stuck__count'); count.textContent = c.done + '/' + c.total;
    left.appendChild(label); left.appendChild(count);
    var right = h('div', 'rot-stuck__right');
    var reset = h('button', 'rot-stuck__reset'); reset.type = 'button'; reset.textContent = 'Reset';
    reset.addEventListener('click', function () { resetDay(); });
    var menu = h('button', 'rot-stuck__menu'); menu.type = 'button';
    menu.setAttribute('aria-label', 'Program menu');
    menu.textContent = state.menuOpen ? '✕' : '☰';
    // The program menu is anchored at the very top, so scroll up first, then open it.
    menu.addEventListener('click', function () {
      try { window.scrollTo(0, 0); } catch (e) {}
      state.menuOpen = true; render();
    });
    right.appendChild(reset); right.appendChild(menu);
    row.appendChild(left); row.appendChild(right);

    var track = h('div', 'rot-stuck__track');
    var fill = h('div', 'rot-progress__fill' + (allDone ? ' is-done' : '')); fill.style.width = pct + '%';
    track.appendChild(fill);

    box.appendChild(row); box.appendChild(track);
    return box;
  }

  function buildLayoutToggle() {
    var lt = h('div', 'rot-layout');
    var label = h('div', 'rot-layout__label'); label.textContent = 'Today’s list';
    var seg = h('div', 'rot-seg');
    [['expanded', 'Expanded'], ['compact', 'Compact']].forEach(function (o) {
      var b = h('button', 'rot-seg__btn' + (state.layout === o[0] ? ' is-active' : '')); b.type = 'button';
      b.textContent = o[1];
      b.addEventListener('click', function () { setLayout(o[0]); });
      seg.appendChild(b);
    });
    lt.appendChild(label); lt.appendChild(seg);
    return lt;
  }

  function buildList() {
    var list = PROGRAMS[state.program][state.day] || [];
    var wrap = h('div', 'rot-list');
    list.forEach(function (row, i) {
      var name = row[0], sets = row[1], reps = row[2], note = row[3];
      var key = checkKey(state.program, state.day, name);
      var done = !!state.checks[key];
      var showDetails = (state.layout === 'expanded') || (state.expanded === key);

      var card = h('div', 'rot-ex' + (done ? ' is-done' : ''));
      card.addEventListener('click', function () { toggleCheck(key); });

      var top = h('div', 'rot-ex__top');
      var check = h('div', 'rot-ex__check'); check.innerHTML = done ? '&#10003;' : '';
      var body = h('div', 'rot-ex__body');
      var nm = h('div', 'rot-ex__name'); nm.textContent = name;
      var pe = h('div', 'rot-ex__presc'); pe.textContent = fmtPresc(sets, reps);
      body.appendChild(nm); body.appendChild(pe);
      top.appendChild(check); top.appendChild(body);

      if (state.layout === 'compact') {
        var chev = h('button', 'rot-ex__chev'); chev.type = 'button';
        chev.textContent = state.expanded === key ? '⌃' : '⌄';
        chev.addEventListener('click', function (e) { e.stopPropagation(); toggleExpand(key); });
        top.appendChild(chev);
      }
      card.appendChild(top);

      if (showDetails) {
        var det = h('div', 'rot-ex__details');
        if (note) { var nt = h('div', 'rot-ex__note'); nt.textContent = note; det.appendChild(nt); }
        var ytWrap = h('div');
        var yt = h('a', 'rot-yt');
        yt.href = 'https://www.youtube.com/results?search_query='
          + encodeURIComponent(name.replace(/superset/i, '').trim() + ' exercise form');
        yt.target = '_blank'; yt.rel = 'noopener';
        yt.innerHTML = '&#9655;&nbsp; YouTube demo';
        yt.addEventListener('click', function (e) { e.stopPropagation(); });
        ytWrap.appendChild(yt);
        det.appendChild(ytWrap);
        card.appendChild(det);
      }
      wrap.appendChild(card);
    });
    return wrap;
  }

  function buildReels(frag) {
    var reels = DAYMETA[state.day].reels || [];
    var btn = h('button', 'rot-reels-btn'); btn.type = 'button';
    var label = h('span', 'rot-reels-btn__label');
    label.innerHTML = 'Form reels for ' + state.day + ' &middot; ' + reels.length;
    var chev = h('span', 'rot-reels-btn__chev'); chev.textContent = state.reelsOpen ? '⌃' : '⌄';
    btn.appendChild(label); btn.appendChild(chev);
    btn.addEventListener('click', function () { state.reelsOpen = !state.reelsOpen; render(); });
    frag.appendChild(btn);

    if (state.reelsOpen) {
      var panel = h('div', 'rot-reels');
      var note = h('div', 'rot-reels__note');
      note.textContent = 'Original day reels from the source program (whole-session clips, not per-exercise).';
      var listEl = h('div', 'rot-reels__list');
      reels.forEach(function (u, i) {
        var a = h('a', 'rot-reel'); a.href = u; a.target = '_blank'; a.rel = 'noopener';
        a.innerHTML = '&#9836; Reel ' + (i + 1) + ' &#8599;';
        listEl.appendChild(a);
      });
      panel.appendChild(note); panel.appendChild(listEl);
      frag.appendChild(panel);
    }
  }

  /* ---------------- render ---------------- */
  var mount = document.getElementById('rotation');

  function render() {
    if (!mount) return;
    var frag = document.createDocumentFragment();
    frag.appendChild(buildHeader());
    frag.appendChild(buildDayTabs());
    buildStickyRegion(frag);
    frag.appendChild(buildLayoutToggle());
    frag.appendChild(buildList());
    buildReels(frag);
    mount.innerHTML = '';
    mount.appendChild(frag);
  }

  // Flip `stuck` when the sentinel scrolls to the top of the viewport.
  // Passive scroll listener; only re-render on an actual change.
  function onScroll() {
    if (!mount) return;
    var el = mount.querySelector('[data-rotation-sentinel]');
    if (!el) return;
    var stuck = el.getBoundingClientRect().top <= 0;
    if (stuck !== state.stuck) { state.stuck = stuck; render(); }
  }

  render();
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
