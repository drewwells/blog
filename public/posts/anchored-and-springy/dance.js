/* ============================================================
   Anchored & Springy — interactive WCS conditioning card (WST Blog)
   Auto-generated from fitscrape program.json by gen_blog_data.py.
   Dependency-free vanilla JS. Renders into #dance.
   State persists to localStorage key "wst-dance-v1".
   ============================================================ */
(function () {
  'use strict';

  var CONFIG = {
  "mountId": "dance",
  "lsKey": "wst-dance-v1",
  "kicker": "Dance &middot; WCS Conditioning",
  "howtoLabel": "How to read the card",
  "menuLabel": "Currently running",
  "weekLabel": "Week of block",
  "programs": [
    {
      "key": "Foundation",
      "label": "Foundation",
      "note": "Weeks 1–4 — groove position, intrinsic-foot control, base balance."
    },
    {
      "key": "Performance",
      "label": "Performance",
      "note": "Weeks 5–8+ — unstable surfaces, eccentrics, contra-body rotation under load."
    }
  ],
  "days": [
    {
      "key": "Foot",
      "label": "Foot",
      "sub": "Ankle & foot · the rolling foot"
    },
    {
      "key": "Balance",
      "label": "Balance",
      "sub": "Single-leg & balance"
    },
    {
      "key": "Core",
      "label": "Core",
      "sub": "Core & posture · anti-rotation"
    },
    {
      "key": "Mobility",
      "label": "Mobility",
      "sub": "Hip mobility / recovery"
    }
  ],
  "roles": {
    "main": {
      "sym": "⭐",
      "label": "Main lift"
    },
    "prehab": {
      "sym": "🩹",
      "label": "Prehab"
    },
    "mobility": {
      "sym": "🧘",
      "label": "Mobility"
    }
  },
  "legend": [
    {
      "sym": "⭐",
      "txt": "Key drill"
    },
    {
      "sym": "🩹",
      "txt": "Prehab"
    },
    {
      "sym": "🧘",
      "txt": "Mobility"
    }
  ],
  "howto": "<div class=\"rot-howto__desc\">Two rotations &mdash; <b>Foundation</b> (weeks 1&ndash;4) and <b>Performance</b> (weeks 5&ndash;8+) &mdash; across four day-types. Foundation grooves position and intrinsic-foot control; Performance adds unstable surfaces, eccentrics and perturbation. Tap an exercise to tick it off; checks are saved, per rotation.</div><div class=\"rot-howto__block rot-howto__block--sep\"><div class=\"rot-howto__term\">Day-types, not fixed days</div><div class=\"rot-howto__def\">Run 3 strength/control sessions a week &mdash; <b>Foot</b>, <b>Balance</b>, <b>Core</b> &mdash; plus the <b>Mobility</b> menu as a daily 10&ndash;15 min dose. Put the heavy Balance day on a non-dance day; run full Mobility the morning after your biggest social night.</div></div><div class=\"rot-howto__block\"><div class=\"rot-howto__term\">each side &middot; holds &middot; counts</div><div class=\"rot-howto__def\">Single-leg and anti-rotation work is per side. A &ldquo;6-count hold&rdquo; is an isometric &mdash; grow holds 2&rarr;6 counts and reps over the block before adding load.</div></div><div class=\"rot-howto__block\"><div class=\"rot-howto__term\">test-retest</div><div class=\"rot-howto__def\">For mobility: test a position (deep anchor, single-leg squat), mobilise 2 min per side, then retest &mdash; keep only what actually changed your range. Open the <b>Progress</b> line on any exercise for how to advance it.</div></div><div class=\"rot-howto__block rot-howto__block--sep\"><div class=\"rot-howto__term rot-howto__term--muted\">Warm-up</div><div class=\"rot-howto__def\">Always do 2&ndash;3 min of ankle doming + a balance drill before dancing. Advance one lever at a time &mdash; balance surface, time-under-tension, load, eccentric tempo, or mobility &mdash; never all at once.</div></div>"
};

  var DATA = {
  "Foundation": {
    "Foot": {
      "focus": "Build the 'rolling foot' from the ground up: intrinsic-foot doming for a stable arch, the tibialis-posterior/peroneal stirrup to resist rolls/sprains, and soleus endurance for cushioned, controlled weight changes - the single most WCS-specific quality (no flat steps).",
      "ex": [
        {
          "name": "Foot Doming (Short Foot)",
          "sets": "3",
          "reps": "15-30, building to 30",
          "intensity": "bodyweight, deliberate",
          "progression": "seated -> standing two-foot -> standing single-leg",
          "notes": "Draw the metatarsal heads toward the heel WITHOUT curling the toes; this is the active arch that keeps every WCS step rolling through the foot instead of landing flat. Haas: the intrinsic group must feel active to create support.",
          "role": "prehab"
        },
        {
          "name": "Big-Toe Abduction",
          "sets": "3",
          "reps": "10-12, hold 2-4 counts",
          "intensity": "bodyweight",
          "progression": "add count length; add standing",
          "notes": "Strengthens abductor hallucis to defend the medial arch against collapse/pronation on every weight shift. A weak medial arch is the upstream cause of many lower-leg overuse injuries.",
          "role": "prehab"
        },
        {
          "name": "Resisted Ankle Inversion (Tibialis Posterior)",
          "sets": "3",
          "reps": "10-12 pointed and flexed",
          "intensity": "light band",
          "progression": "increase band tension; vary tempo (in fast/out slow then reverse)",
          "notes": "Haas 'Inversion Press' -> Resisted Inversion. Tib-post lifts the arch and resists pronation, giving cushioned landings and a stable single-leg base.",
          "role": "prehab"
        },
        {
          "name": "Resisted Ankle Eversion (Peroneals / Winging)",
          "sets": "3",
          "reps": "10-12 pointed and flexed",
          "intensity": "light band",
          "progression": "increase band tension",
          "notes": "Peroneus longus/brevis are the lateral half of the 'stirrup' - the direct anti-ankle-sprain insurance for pivots and off-balance recoveries on a crowded floor.",
          "role": "prehab"
        },
        {
          "name": "Seated Calf Raise (Soleus Pump)",
          "sets": "3",
          "reps": "15-30",
          "intensity": "light load on thighs (~5 lb each)",
          "progression": "raise reps before raising load (soleus is fatigue-resistant)",
          "notes": "Knee bent 90 deg targets the soleus - high type-I fiber content drives balance and keeps you from falling forward; HIGH reps to build endurance for a long night.",
          "role": "accessory"
        },
        {
          "name": "Standing Calf Raises (Releve)",
          "sets": "3",
          "reps": "10-15",
          "intensity": "bodyweight",
          "progression": "two-foot -> single-leg -> 'up on two, down on one' eccentric",
          "notes": "Align tibia over 2nd/3rd toe, no sickling. Trains the push-off and the controlled lower (Haas: most people spend all effort going up and let gravity drop them - that is where injuries happen).",
          "role": "main"
        },
        {
          "name": "Calf Stretch Hands Against Wall",
          "sets": "2",
          "reps": "2 min per side",
          "intensity": "mobility",
          "progression": "test-retest dorsiflexion depth",
          "notes": "Starrett: missing dorsiflexion forces an open/turned-out foot and collapsed ankle. Restore gastroc/heel-cord length so the ankle can roll cleanly through each step.",
          "role": "mobility"
        }
      ]
    },
    "Balance": {
      "focus": "Own a small base: weight transfer onto one leg with the pelvis stacked over the standing foot, glute control for the anchor settle, and balance trained on increasingly compliant surfaces.",
      "ex": [
        {
          "name": "Single-Leg Balance (Airplane Balance regression)",
          "sets": "3 each side",
          "reps": "10-30 sec",
          "intensity": "bodyweight",
          "progression": "floor eyes-open -> eyes-closed -> pillow; add a small demi-plie",
          "notes": "Haas: put weight between ball of foot and heel, use the intrinsic foot muscles, keep knee over 2nd toe. Stack pelvis/sacrum over the standing foot - the literal definition of WCS balance on one foot.",
          "role": "main"
        },
        {
          "name": "Single Leg Glute Bridge",
          "sets": "3 each side",
          "reps": "8-10, hold 5 sec at top",
          "intensity": "bodyweight",
          "progression": "add band around knee (cue glute, resist valgus) per seed; then add load",
          "notes": "Glute max/medius for the anchor and posterior-chain control; the band teaches lateral hip stability that protects the knee on direction changes.",
          "role": "main"
        },
        {
          "name": "Touchdown Single-Leg Squat (off low box)",
          "sets": "3 each side",
          "reps": "10",
          "intensity": "bodyweight",
          "progression": "2-4 in box -> 8-12 in; add 3-sec pause; add band around knee (seed progression)",
          "notes": "Hips back, chest forward, balance over mid-foot, knee tracks toes. Trains controlled single-leg lowering = the eccentric demand of a slot weight change.",
          "role": "main"
        },
        {
          "name": "Step-up with Knee Raise",
          "sets": "3 each side",
          "reps": "8-10",
          "intensity": "bodyweight",
          "progression": "raise box height; pause at top in balance",
          "notes": "Concentric weight transfer onto one leg with a balanced finish - rehearses stepping into a new weighted foot under control.",
          "role": "accessory"
        },
        {
          "name": "Cossack Squat",
          "sets": "2-3 each side",
          "reps": "5-8, 5-sec pause at bottom",
          "intensity": "bodyweight",
          "progression": "box-supported -> full -> band around knee (seed)",
          "notes": "Lateral loading and adductor/hip range for side-to-side travel; keep full-foot pressure, no rolling to the edge.",
          "role": "accessory"
        },
        {
          "name": "Balance Board / Disc Holds",
          "sets": "3 each side",
          "reps": "20-30 sec",
          "intensity": "bodyweight",
          "progression": "two-foot -> single-leg -> add catch/pass or band tug",
          "notes": "Reactive ankle/hip stabilization on an unstable surface, prepping the Airplane-on-disc work in the Performance block.",
          "role": "accessory"
        }
      ]
    },
    "Core": {
      "focus": "Hold center against a partner's pull: anti-rotation and anti-lateral-flexion bracing, contra-body rotation from the thoracic spine, and the scapular/frame endurance to keep a quiet, tall posture all night.",
      "ex": [
        {
          "name": "Pallof Press",
          "sets": "3 each side",
          "reps": "8-10, 2-3 sec hold",
          "intensity": "light-moderate band/cable",
          "progression": "tall-kneeling -> split-stance -> single-leg stance",
          "notes": "The signature anti-rotation drill: resist the cable's twist exactly as you resist a partner's lead while keeping your own center. Brace ribs-down, neutral spine (Starrett midline stabilization).",
          "role": "main"
        },
        {
          "name": "Side Bridge",
          "sets": "3 each side",
          "reps": "20-40 sec",
          "intensity": "bodyweight",
          "progression": "from knees -> full -> top-leg raised",
          "notes": "Haas 'Side Lift': anti-lateral-flexion through the obliques/QL; press the down shoulder-blade down and stay long - the lateral-chain stiffness that keeps the torso from collapsing toward your partner.",
          "role": "main"
        },
        {
          "name": "Plank",
          "sets": "3",
          "reps": "30-45 sec",
          "intensity": "bodyweight",
          "progression": "add Plank-and-Pike on a ball (Haas) for anti-extension + scapular control",
          "notes": "Anti-extension brace with scapular stability - protects the low back and builds the postural endurance behind a tall frame.",
          "role": "accessory"
        },
        {
          "name": "Cable Russian Twists (Oblique Lift / Trunk Twist)",
          "sets": "3 each side",
          "reps": "8-10 controlled",
          "intensity": "light",
          "progression": "slow tempo -> standing contra-body pattern",
          "notes": "Trained rotation from the thoracic spine WITHOUT twisting the pelvis (Haas cue) = clean contra-body movement instead of leaking force through the low back.",
          "role": "accessory"
        },
        {
          "name": "Face Pull",
          "sets": "3",
          "reps": "12-15",
          "intensity": "light band/cable",
          "progression": "add Scapular Pull-Ups for grip + scapular endurance",
          "notes": "Builds lower-trap/rear-delt and scapular control for a long-lasting upright frame; counters the rounded posture of desk life and a night of connection.",
          "role": "accessory"
        },
        {
          "name": "Prone Spinal Brace (Multifidi)",
          "sets": "2-3",
          "reps": "5-6 breaths, hold each",
          "intensity": "bodyweight",
          "progression": "lengthen holds; progress to bird-dog",
          "notes": "Haas: isometrically wake up the deep multifidi like rubber cords along the spine for segmental low-back stability under rotation.",
          "role": "prehab"
        }
      ]
    },
    "Mobility": {
      "focus": "Supple hips for the anchor settle and quick direction changes, restored ankle/calf range, and active glute/deep-rotator control. Run as the morning-after-dancing recovery day AND as the daily mobility dose - 2 min per side, test-retest.",
      "ex": [
        {
          "name": "Kneeling Hip Flexor (Couch Stretch progression)",
          "sets": "1-2",
          "reps": "2 min per side",
          "intensity": "mobility",
          "progression": "kneeling lunge -> rear shin up the wall (full Couch Stretch)",
          "notes": "Starrett's premier hip-flexor/quad opener; posterior pelvic tilt first (don't hyperextend the low back). Open hip extension so the anchor can settle without arching.",
          "role": "mobility"
        },
        {
          "name": "90/90 Hip Switches",
          "sets": "2",
          "reps": "8-10 switches per side",
          "intensity": "mobility",
          "progression": "passive holds -> active lift-offs",
          "notes": "Internal and external hip rotation - the rotational range behind WCS turns and direction changes. Keep both sit-bones grounded.",
          "role": "mobility"
        },
        {
          "name": "Piriformis-SMR",
          "sets": "1",
          "reps": "2 min per side",
          "intensity": "ball/foam",
          "progression": "ball -> add hip rotation under the ball (Starrett Glute/Hip Capsule smash)",
          "notes": "Release deep hip rotators/glutes (Area 7) that tighten from holding the anchor and pivoting; restores clean hip rotation.",
          "role": "mobility"
        },
        {
          "name": "Calves-SMR + Ankle Circles",
          "sets": "1",
          "reps": "2 min calf smash per side; 10 circles each way",
          "intensity": "ball/foam",
          "progression": "calf smash -> add ankle floss/eversion-inversion under pressure (Starrett Area 13/14)",
          "notes": "Heel-cord and calf stiffness steals dorsiflexion; smashing it back to suppleness keeps the foot able to roll instead of going flat.",
          "role": "mobility"
        },
        {
          "name": "Cat Stretch (Thoracic mobility)",
          "sets": "2",
          "reps": "8-10 slow",
          "intensity": "mobility",
          "progression": "add open-book thoracic rotation",
          "notes": "Free the thoracic spine so rotation comes from the mid-back (frame) and not the lumbar spine - supports the contra-body work.",
          "role": "mobility"
        },
        {
          "name": "Heel Squeeze (Deep Rotator / Lower Glute Activation)",
          "sets": "2",
          "reps": "10-12, 6-count holds",
          "intensity": "bodyweight",
          "progression": "add band; progress to Single-Leg Bridge",
          "notes": "Haas prone heel-squeeze in neutral pelvis fires the deep rotators and lower glute max - re-activate after mobilizing so new range is controllable.",
          "role": "prehab"
        }
      ]
    }
  },
  "Performance": {
    "Foot": {
      "focus": "Same stirrup and arch qualities, now under load, on one leg, and with eccentric landing control - the dynamic foot/ankle of a fast night of dancing.",
      "ex": [
        {
          "name": "Single-Leg Foot Doming on Balance Disc",
          "sets": "3 each side",
          "reps": "20-30 sec active arch",
          "intensity": "bodyweight, unstable",
          "progression": "floor -> disc -> eyes closed",
          "notes": "Intrinsic-foot control while the surface tries to roll the arch - directly trains holding the arch through a live weight change.",
          "role": "prehab"
        },
        {
          "name": "Banded Ankle Inversion + Eversion (Stirrup Circuit)",
          "sets": "3",
          "reps": "12-15 each direction, pointed and flexed",
          "intensity": "moderate band",
          "progression": "heavier band; fast-in/slow-out tempo changes",
          "notes": "Tib-post + peroneals together = the full stirrup. Vary velocity (Haas) to mimic the unpredictable demands of a crowded floor recovery.",
          "role": "prehab"
        },
        {
          "name": "Single-Leg Standing Calf Raise (Eccentric)",
          "sets": "4 each side",
          "reps": "8-10, 3-sec lower",
          "intensity": "bodyweight -> light dumbbell",
          "progression": "up on two/down on one -> single-leg full -> add load",
          "notes": "Haas eccentric releve: 'go up with two feet, return down with one.' Builds the controlled landing that defines no-flat-step weight transfer.",
          "role": "main"
        },
        {
          "name": "Seated Calf Raise (Soleus Endurance)",
          "sets": "3",
          "reps": "25-30",
          "intensity": "moderate load on thighs",
          "progression": "raise load only after 30 clean reps",
          "notes": "Keep the slow-twitch soleus durable for the back half of a 4-hour social - the muscle that keeps you upright and balanced.",
          "role": "accessory"
        },
        {
          "name": "Toe Isolations (Toes 2-5)",
          "sets": "3",
          "reps": "10-12",
          "intensity": "light band",
          "progression": "all toes -> one toe at a time",
          "notes": "Haas: keep big toe extended, push off through toes 2-5 so you stop overusing the big toe - a more even, springy push-off.",
          "role": "prehab"
        },
        {
          "name": "Lateral Ankle Smash & Floss + Calf Stretch",
          "sets": "1-2",
          "reps": "2 min per side",
          "intensity": "mobility",
          "progression": "test-retest a deep single-leg squat for dorsiflexion",
          "notes": "Starrett Area 14: free the lateral malleolus so it slides back for full dorsiflexion - critical after any old ankle sprain. Test-retest each time.",
          "role": "mobility"
        }
      ]
    },
    "Balance": {
      "focus": "Reactive single-leg stability and weight transfer on unstable surfaces, with glute power for direction changes and anchor settles.",
      "ex": [
        {
          "name": "Airplane Balance (on disc/compliant surface)",
          "sets": "3 each side",
          "reps": "20-30 sec with small demi-plie",
          "intensity": "bodyweight, unstable",
          "progression": "floor -> pillow/sand -> disc -> add partner perturbation",
          "notes": "Haas whole-body single-leg balance: flat back, arms wide, weight between ball and heel, intrinsic foot active. The full-expression standing-leg control for slot anchors.",
          "role": "main"
        },
        {
          "name": "DNS Star (Side Plank Clamshell Squat)",
          "sets": "3 each side",
          "reps": "5-10",
          "intensity": "bodyweight",
          "progression": "clamshell hold 5s -> top-leg raised 5s -> full drop-squat-drive (seed)",
          "notes": "Lateral-chain + hip internal-rotation control under a single-leg load; protects the knee against valgus on direction changes (Squat University seed).",
          "role": "main"
        },
        {
          "name": "Single-Leg High Box Squat",
          "sets": "3 each side",
          "reps": "6-8, 2-sec pause",
          "intensity": "bodyweight -> light load",
          "progression": "lower the box over time toward a Pistol Squat; add load",
          "notes": "Deeper single-leg strength and control for low anchors; pelvis stacked over the foot, knee tracks toes.",
          "role": "main"
        },
        {
          "name": "Attitude on Disc (single-leg glute/hamstring)",
          "sets": "3 each side",
          "reps": "8",
          "intensity": "bodyweight, unstable",
          "progression": "floor -> disc; add ankle band",
          "notes": "Haas: drive hip extension from glute max/hamstrings on an unstable base while bracing deep abs - posterior-chain control for travel and anchor recovery.",
          "role": "accessory"
        },
        {
          "name": "Single-Leg Hop Progression (controlled landings)",
          "sets": "3 each side",
          "reps": "5-6 stick-landings",
          "intensity": "low, controlled",
          "progression": "in-place stick -> forward/lateral stick -> small box",
          "notes": "Reactive landing onto a stable single-leg base. Keep volume low and only on fresh legs, far from a dance night. Emphasize a quiet, balanced catch.",
          "role": "accessory"
        }
      ]
    },
    "Core": {
      "focus": "Anti-rotation and contra-body strength under more load and from dance-specific stances, plus sustained frame/grip endurance.",
      "ex": [
        {
          "name": "Pallof Press With Rotation",
          "sets": "3 each side",
          "reps": "8-10",
          "intensity": "moderate band/cable",
          "progression": "split-stance -> single-leg stance; slow eccentric back to center",
          "notes": "Press out, control a rotation, return to center without the pelvis twisting - holding your own axis while moving against a partner's pull.",
          "role": "main"
        },
        {
          "name": "Side Bridge with Top-Leg Raise",
          "sets": "3 each side",
          "reps": "20-40 sec",
          "intensity": "bodyweight",
          "progression": "full side bridge -> top-leg raised -> add reach-through rotation",
          "notes": "Progressed anti-lateral-flexion + hip abduction; the lateral stiffness to stay centered through pulls and momentum changes.",
          "role": "main"
        },
        {
          "name": "Plank and Pike (stability ball)",
          "sets": "3",
          "reps": "8-10",
          "intensity": "bodyweight",
          "progression": "knees-on-ball -> shins -> add pike-to-plank tempo",
          "notes": "Haas: deep-ab + hip-flexor pike with scapular depression/adduction - anti-extension and scapular control for a resilient upright frame.",
          "role": "accessory"
        },
        {
          "name": "Scapular Pull-Up",
          "sets": "3",
          "reps": "8-12",
          "intensity": "bodyweight",
          "progression": "scap pull-ups -> band-assisted pull-ups",
          "notes": "Scapular control + grip/forearm endurance for maintaining frame and connection over a long night.",
          "role": "accessory"
        },
        {
          "name": "Standing Contra-Body Trunk Twist (cable/band)",
          "sets": "3 each side",
          "reps": "10",
          "intensity": "light-moderate",
          "progression": "add side-bend-into-rotation (Haas Trunk Twist) through full thoracic range",
          "notes": "Rotation through the thoracic spine with a quiet pelvis; rehearses contra-body movement under resistance.",
          "role": "accessory"
        },
        {
          "name": "Bird Dog (anti-rotation hold)",
          "sets": "3 each side",
          "reps": "6-8, 3-sec holds",
          "intensity": "bodyweight",
          "progression": "add band between opposite hand/foot for anti-rotation load",
          "notes": "Cross-body stability with a neutral braced spine (Starrett one-joint rule) - low-back insurance and the contra-body coordination WCS lives on.",
          "role": "prehab"
        }
      ]
    },
    "Mobility": {
      "focus": "Deeper hip opening, capsule mobilization, and glute re-activation; keep the test-retest discipline so range converts into controllable movement.",
      "ex": [
        {
          "name": "Couch Stretch",
          "sets": "1-2",
          "reps": "2 min per side",
          "intensity": "mobility",
          "progression": "wall-supported -> add a contract-relax",
          "notes": "Starrett: no less than 2 min per hip. Full hip-flexor/quad length so the anchor settles deep without the low back compensating into extension.",
          "role": "mobility"
        },
        {
          "name": "Banded Hip Distraction (flexion + external rotation)",
          "sets": "1",
          "reps": "2 min per side",
          "intensity": "band",
          "progression": "test-retest a deep squat/anchor position",
          "notes": "Starrett: create space in the hip capsule (Area 7) to restore end-range without impingement - the joint-level fix when stretching alone stalls.",
          "role": "mobility"
        },
        {
          "name": "Adductor Smash / 90/90 Hamstring",
          "sets": "1-2",
          "reps": "2 min per side",
          "intensity": "ball + stretch",
          "progression": "smash -> active straight-leg raise retest",
          "notes": "Open adductors and hamstrings (Area 9/10) for lateral travel and the wide base of Cossack-style direction changes.",
          "role": "mobility"
        },
        {
          "name": "Peroneals Stretch + Posterior Tibialis Stretch",
          "sets": "2",
          "reps": "30-45 sec per side",
          "intensity": "mobility",
          "progression": "add Foot-SMR underfoot",
          "notes": "Balance the stirrup: keep both sides of the lower-leg supple so neither pulls the ankle out of neutral; restores clean foot roll.",
          "role": "mobility"
        },
        {
          "name": "Open-Book Thoracic Rotation",
          "sets": "2",
          "reps": "8-10 per side",
          "intensity": "mobility",
          "progression": "add reach-and-hold at end range",
          "notes": "Mid-back rotation feeds frame posture and contra-body movement, sparing the lumbar spine.",
          "role": "mobility"
        },
        {
          "name": "Single Leg Glute Bridge (re-activation)",
          "sets": "2 each side",
          "reps": "10, 5-sec holds",
          "intensity": "bodyweight + band",
          "progression": "band around knee (resist valgus) per seed; then load",
          "notes": "Close the recovery day by re-grooving glute control over the newly opened hip so range is owned, not just borrowed.",
          "role": "prehab"
        }
      ]
    }
  }
};

  /* ---------------- state ---------------- */
  var PROGKEYS = CONFIG.programs.map(function (p) { return p.key; });
  var DAYKEYS = CONFIG.days.map(function (d) { return d.key; });

  var state = { program: PROGKEYS[0], day: DAYKEYS[0], layout: 'expanded',
                week: 1, checks: {}, expanded: null, howToOpen: false,
                menuOpen: false, stuck: false };

  try {
    var raw = localStorage.getItem(CONFIG.lsKey);
    if (raw) {
      var s = JSON.parse(raw);
      if (s && typeof s === 'object') {
        if (s.program && PROGKEYS.indexOf(s.program) >= 0) state.program = s.program;
        if (s.day && DAYKEYS.indexOf(s.day) >= 0) state.day = s.day;
        if (s.layout) state.layout = s.layout;
        if (s.week) state.week = s.week;
        if (s.checks && typeof s.checks === 'object') state.checks = s.checks;
      }
    }
  } catch (e) {}

  function persist() {
    try {
      localStorage.setItem(CONFIG.lsKey, JSON.stringify({
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
  function dayMeta(key) {
    for (var i = 0; i < CONFIG.days.length; i++) if (CONFIG.days[i].key === key) return CONFIG.days[i];
    return { key: key, label: key, sub: '' };
  }
  function progMeta(key) {
    for (var i = 0; i < CONFIG.programs.length; i++) if (CONFIG.programs[i].key === key) return CONFIG.programs[i];
    return { key: key, label: key };
  }
  function dayData(p, d) { return (DATA[p] && DATA[p][d]) || { focus: '', ex: [] }; }
  function exList(p, d) { return dayData(p, d).ex || []; }

  function fmtPresc(sets, reps) {
    var sl = '';
    if (sets) { sl = /^\d+(-\d+)?$/.test(sets) ? prettify(sets) + ' set' + (sets === '1' ? '' : 's') : prettify(sets); }
    var rl = reps ? prettify(reps) : '';
    var parts = [sl, rl].filter(Boolean);
    return parts.length ? parts.join('   ·   ') : 'As prescribed';
  }
  // Checks keyed by exercise NAME (stable across reorders), unique within a day.
  function checkKey(p, d, name) { return p + '|' + d + '|' + name; }
  function countDone(p, d) {
    var list = exList(p, d), done = 0;
    for (var i = 0; i < list.length; i++) { if (state.checks[checkKey(p, d, list[i].name)]) done++; }
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
    p.innerHTML = '<div class="rot-howto__inner">' + CONFIG.howto + '</div>';
    return p;
  }

  function buildMenu() {
    var m = h('div', 'rot-menu');
    var label = h('div', 'rot-menu__label');
    label.innerHTML = CONFIG.menuLabel + ' &mdash; ' + progMeta(state.program).label;
    m.appendChild(label);

    var prog = h('div', 'rot-prog');
    CONFIG.programs.forEach(function (p) {
      var b = h('button', 'rot-prog__btn' + (p.key === state.program ? ' is-active' : ''));
      b.type = 'button'; b.textContent = p.label;
      b.addEventListener('click', function () { selectProgram(p.key); });
      prog.appendChild(b);
    });
    m.appendChild(prog);

    if (CONFIG.programs[state.program] || state.program) {
      var pm = progMeta(state.program);
      if (pm.note) { var pn = h('div', 'rot-menu__note'); pn.textContent = pm.note; m.appendChild(pn); }
    }

    var wk = h('div', 'rot-week');
    var wl = h('span', 'rot-week__label'); wl.textContent = CONFIG.weekLabel;
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
    var kicker = h('span', 'rot-kicker'); kicker.innerHTML = CONFIG.kicker;
    var howBtn = h('button', 'rot-howto-toggle'); howBtn.type = 'button';
    var howLbl = h('span', 'rot-howto-toggle__label'); howLbl.textContent = CONFIG.howtoLabel;
    var howChev = h('span', 'rot-howto-toggle__chev'); howChev.textContent = state.howToOpen ? '⌃' : '⌄';
    howBtn.appendChild(howLbl); howBtn.appendChild(howChev);
    // The how-to and program menu are mutually exclusive — opening one closes
    // the other so the dropdown never paints over the panel below it.
    howBtn.addEventListener('click', function () {
      state.howToOpen = !state.howToOpen; if (state.howToOpen) state.menuOpen = false; render();
    });
    left.appendChild(kicker); left.appendChild(howBtn);

    var menuBtn = h('button', 'rot-menu-btn'); menuBtn.type = 'button';
    menuBtn.setAttribute('aria-label', 'Program menu');
    menuBtn.textContent = state.menuOpen ? '✕' : '☰';
    menuBtn.addEventListener('click', function () {
      state.menuOpen = !state.menuOpen; if (state.menuOpen) state.howToOpen = false; render();
    });

    bar.appendChild(left); bar.appendChild(menuBtn);
    header.appendChild(bar);
    if (state.howToOpen) header.appendChild(buildHowTo());
    if (state.menuOpen) header.appendChild(buildMenu());
    return header;
  }

  function buildDayTabs() {
    var tabs = h('div', 'rot-days');
    CONFIG.days.forEach(function (dm) {
      var d = dm.key;
      var c = countDone(state.program, d);
      var complete = c.total > 0 && c.done === c.total;
      var active = d === state.day;
      var b = h('button', 'rot-day' + (active ? ' is-active' : '')); b.type = 'button';
      var l = h('span', 'rot-day__label'); l.textContent = dm.label;
      var bd = h('span', 'rot-day__badge' + (complete ? ' is-complete' : ''));
      bd.innerHTML = complete ? 'done &#10003;' : (c.done + '/' + c.total);
      b.appendChild(l); b.appendChild(bd);
      b.addEventListener('click', function () { selectDay(d); });
      tabs.appendChild(b);
    });
    return tabs;
  }

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
    num.innerHTML = progMeta(state.program).label + '&nbsp;&nbsp;&middot;&nbsp;&nbsp;'
      + 'Day ' + (DAYKEYS.indexOf(state.day) + 1);
    var title = h('div', 'rot-dayhead__title'); title.textContent = dayMeta(state.day).label;
    var sub = h('div', 'rot-dayhead__sub'); sub.textContent = dayData(state.program, state.day).focus || dayMeta(state.day).sub;
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
    var label = h('span', 'rot-stuck__label');
    label.textContent = progMeta(state.program).label + ' · ' + dayMeta(state.day).label;
    var count = h('span', 'rot-stuck__count'); count.textContent = c.done + '/' + c.total;
    left.appendChild(label); left.appendChild(count);
    var right = h('div', 'rot-stuck__right');
    var reset = h('button', 'rot-stuck__reset'); reset.type = 'button'; reset.textContent = 'Reset';
    reset.addEventListener('click', function () { resetDay(); });
    var menu = h('button', 'rot-stuck__menu'); menu.type = 'button';
    menu.setAttribute('aria-label', 'Program menu');
    menu.textContent = state.menuOpen ? '✕' : '☰';
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

  function roleBadge(role) {
    var r = CONFIG.roles && CONFIG.roles[role];
    if (!r) return null;
    var b = h('span', 'rot-ex__role');
    b.setAttribute('title', r.label);
    b.setAttribute('aria-label', r.label);
    b.textContent = r.sym;
    return b;
  }

  function buildList() {
    var list = exList(state.program, state.day);
    var wrap = h('div', 'rot-list');
    list.forEach(function (ex) {
      var name = ex.name, key = checkKey(state.program, state.day, name);
      var done = !!state.checks[key];
      var showDetails = (state.layout === 'expanded') || (state.expanded === key);

      var card = h('div', 'rot-ex' + (done ? ' is-done' : '') + (ex.role === 'main' ? ' is-main' : ''));
      card.addEventListener('click', function () { toggleCheck(key); });

      var top = h('div', 'rot-ex__top');
      var check = h('div', 'rot-ex__check'); check.innerHTML = done ? '&#10003;' : '';
      var body = h('div', 'rot-ex__body');
      var nameRow = h('div', 'rot-ex__namerow');
      // Badge before the name so it anchors at the line start and never orphans
      // onto a wrapped line below the text it annotates.
      var rb = roleBadge(ex.role); if (rb) nameRow.appendChild(rb);
      var nm = h('span', 'rot-ex__name'); nm.textContent = name;
      nameRow.appendChild(nm);
      body.appendChild(nameRow);
      var pe = h('div', 'rot-ex__presc'); pe.textContent = fmtPresc(ex.sets, ex.reps);
      body.appendChild(pe);
      if (ex.intensity) { var it = h('div', 'rot-ex__intensity'); it.textContent = prettify(ex.intensity); body.appendChild(it); }
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
        if (ex.notes) { var nt = h('div', 'rot-ex__note'); nt.textContent = ex.notes; det.appendChild(nt); }
        if (ex.progression) {
          var pr = h('div', 'rot-ex__prog');
          pr.innerHTML = '<span class="rot-ex__prog-k">Progress</span> ' + prettify(ex.progression);
          det.appendChild(pr);
        }
        var ytWrap = h('div');
        var yt = h('a', 'rot-yt');
        yt.href = 'https://www.youtube.com/results?search_query='
          + encodeURIComponent(name.replace(/\(.*?\)/g, '').trim() + ' exercise form');
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

  function buildLegend(frag) {
    if (!CONFIG.legend || !CONFIG.legend.length) return;
    var box = h('div', 'rot-legend');
    CONFIG.legend.forEach(function (item) {
      var chip = h('span', 'rot-legend__item');
      chip.innerHTML = '<span class="rot-legend__sym">' + item.sym + '</span>' + item.txt;
      box.appendChild(chip);
    });
    frag.appendChild(box);
  }

  /* ---------------- render ---------------- */
  var mount = document.getElementById(CONFIG.mountId);
  function render() {
    if (!mount) return;
    var frag = document.createDocumentFragment();
    frag.appendChild(buildHeader());
    frag.appendChild(buildDayTabs());
    buildStickyRegion(frag);
    frag.appendChild(buildLayoutToggle());
    frag.appendChild(buildList());
    buildLegend(frag);
    mount.innerHTML = '';
    mount.appendChild(frag);
  }
  function onScroll() {
    if (!mount) return;
    var el = mount.querySelector('[data-rotation-sentinel]');
    if (!el) return;
    var stuck = el.getBoundingClientRect().top <= 0;
    // Closing the menu when the header pins avoids a stale ✕ in the compact bar
    // whose dropdown is scrolled out of view.
    if (stuck !== state.stuck) { state.stuck = stuck; if (stuck) state.menuOpen = false; render(); }
  }
  render();
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
