/* ============================================================
   The Barbell Rotation — interactive strength card (WST Blog)
   Auto-generated from fitscrape program.json by gen_blog_data.py.
   Dependency-free vanilla JS. Renders into #rotation.
   State persists to localStorage key "wst-rotation-v3".
   ============================================================ */
(function () {
  'use strict';

  var CONFIG = {
  "mountId": "rotation",
  "lsKey": "wst-rotation-v3",
  "kicker": "Training &middot; Barbell Rotation",
  "howtoLabel": "How to read the card",
  "menuLabel": "Currently running",
  "weekLabel": "Week of block",
  "programs": [
    {
      "key": "A",
      "label": "A",
      "note": "Foundation — the competition lifts, moderate volume, technique + base strength."
    },
    {
      "key": "B",
      "label": "B",
      "note": "Accumulation — lift variants + accessory volume pushed toward MRV for hypertrophy."
    },
    {
      "key": "C",
      "label": "C",
      "note": "Intensity / Peak — tougher variants, heavier and lower-rep, then re-test."
    }
  ],
  "days": [
    {
      "key": "Squat",
      "label": "Squat",
      "sub": "Lower · squat-focused"
    },
    {
      "key": "Bench",
      "label": "Bench",
      "sub": "Upper · horizontal press"
    },
    {
      "key": "Deadlift",
      "label": "Deadlift",
      "sub": "Lower · hinge / deadlift"
    },
    {
      "key": "Overhead",
      "label": "Overhead",
      "sub": "Upper · vertical press"
    }
  ],
  "roles": {
    "main": {
      "sym": "⭐",
      "label": "Main lift"
    },
    "finisher": {
      "sym": "🔚",
      "label": "Finisher"
    }
  },
  "legend": [
    {
      "sym": "⭐",
      "txt": "Main lift"
    },
    {
      "sym": "🔚",
      "txt": "Finisher / core"
    }
  ],
  "howto": "<div class=\"rot-howto__desc\">Three rotations &mdash; <b>A</b>, <b>B</b>, <b>C</b> &mdash; on one Lower/Upper barbell split. Each is a ~5&ndash;6 week block; finish one, then rotate: A grooves the competition lifts, B swaps in variants and piles on hypertrophy volume, C goes heavy and peaks. Same four days each block &mdash; <b>Squat &middot; Bench &middot; Deadlift &middot; Overhead</b>, main barbell lift first while you&rsquo;re fresh. Tap an exercise to tick it off; checks are saved, per rotation.</div><div class=\"rot-howto__block rot-howto__block--sep\"><div class=\"rot-howto__term\">5/3/1+ (wave)</div><div class=\"rot-howto__def\">The main lift runs a three-week 5/3/1 wave off a Training Max (90% of your 1RM). The <b>+</b> is an AMRAP top set &mdash; go for max reps leaving 1&ndash;2 in the tank. Add weight to the TM after each wave.</div></div><div class=\"rot-howto__block\"><div class=\"rot-howto__term\">% TM &middot; RPE &middot; RIR</div><div class=\"rot-howto__def\">Load cues. <b>% TM</b> is percent of Training Max; <b>RPE</b> is how hard the set felt (7&ndash;9); <b>RIR</b> is reps left in reserve. Pick a weight that lands in the cue with strict form.</div></div><div class=\"rot-howto__block\"><div class=\"rot-howto__term\">Double progression</div><div class=\"rot-howto__def\">For accessories: work the rep range; when you hit the top of the range on every set, add the smallest load and drop back to the bottom. Open the <b>Progress</b> line on any exercise for its specific rule.</div></div><div class=\"rot-howto__block rot-howto__block--sep\"><div class=\"rot-howto__term rot-howto__term--muted\">Running the rotation</div><div class=\"rot-howto__def\">4 lifting days a week (e.g. Mon / Tue / Thu / Fri), each pattern hit ~2&times;. Stay on one rotation ~5&ndash;6 weeks, deload, then advance A &rarr; B &rarr; C &mdash; every pass the Training Maxes are higher and new lift variants rotate in. <b>New novice?</b> Run linear progression first (see the closing note).</div></div>"
};

  var DATA = {
  "A": {
    "Squat": {
      "focus": "Back squat strength + posterior-chain and quad base",
      "ex": [
        {
          "name": "Barbell Squat",
          "sets": "3",
          "reps": "5/3/1+ (wave)",
          "intensity": "65-95% TM per 5/3/1 week, last set AMRAP @ ~1-2 RIR",
          "progression": "5/3/1 wave; +10 lb to TM each completed wave",
          "notes": "High-bar, full depth, brace before unrack. Sub: Goblet Squat if mobility-limited.",
          "role": "main"
        },
        {
          "name": "Romanian Deadlift",
          "sets": "3-4",
          "reps": "8-10",
          "intensity": "RPE 7-8 / 2-3 RIR",
          "progression": "Double progression 8->10 across all sets, then add load; ramp 3->4 sets over the block",
          "notes": "Soft knees, push hips back, bar drags the thighs; stop at mid-shin stretch.",
          "role": "accessory"
        },
        {
          "name": "Barbell Lunge",
          "sets": "3",
          "reps": "10 per leg",
          "intensity": "RPE 7-8",
          "progression": "Double progression; add load when 3x10/leg clean",
          "notes": "Long stride to bias glutes. Sub: Dumbbell Lunges or Split Squats.",
          "role": "accessory"
        },
        {
          "name": "Lying Leg Curls",
          "sets": "3",
          "reps": "10-15",
          "intensity": "RPE 8-9 / 1-2 RIR",
          "progression": "Double progression 10->15, then add load",
          "notes": "Hamstring volume to balance all the hip-hinge. Full ROM, controlled.",
          "role": "accessory"
        },
        {
          "name": "Standing Calf Raises",
          "sets": "3",
          "reps": "12-15",
          "intensity": "RPE 9 / 0-1 RIR",
          "progression": "Double progression; pause at top and bottom",
          "notes": "Small muscle, short rest (~60s).",
          "role": "accessory"
        },
        {
          "name": "Hanging Leg Raise",
          "sets": "3",
          "reps": "10-15",
          "intensity": "RPE 8",
          "progression": "Add reps then add ankle weight (treat abs as strength work, not endless crunches)",
          "notes": "No swing; posterior pelvic tilt. Sub: Plank for time.",
          "role": "finisher"
        }
      ]
    },
    "Bench": {
      "focus": "Bench strength with matched horizontal + vertical pulling",
      "ex": [
        {
          "name": "Barbell Bench Press - Medium Grip",
          "sets": "3",
          "reps": "5/3/1+ (wave)",
          "intensity": "65-95% TM, last set AMRAP @ 1-2 RIR",
          "progression": "5/3/1 wave; +5 lb to TM each completed wave",
          "notes": "Shoulder blades retracted/depressed, leg drive, touch lower chest.",
          "role": "main"
        },
        {
          "name": "Barbell Shoulder Press",
          "sets": "5",
          "reps": "10",
          "intensity": "~50% bench TM (BBB supplemental)",
          "progression": "FSL/BBB; ramp 3->5 sets across the block (MEV->MRV)",
          "notes": "Strict, ribs down, bar over mid-foot at lockout.",
          "role": "accessory"
        },
        {
          "name": "Bent Over Barbell Row",
          "sets": "4",
          "reps": "8-10",
          "intensity": "RPE 7-8",
          "progression": "Double progression then add load; matches bench pressing volume",
          "notes": "Torso ~45deg, pull to lower ribs, no jerking. Sub: One-Arm Dumbbell Row.",
          "role": "accessory"
        },
        {
          "name": "Wide-Grip Lat Pulldown",
          "sets": "3",
          "reps": "10-12",
          "intensity": "RPE 8",
          "progression": "Double progression 10->12 then add load",
          "notes": "Drive elbows down, pull to collarbone. Sub: Pullups (band-assist if needed).",
          "role": "accessory"
        },
        {
          "name": "Side Lateral Raise",
          "sets": "3",
          "reps": "12-15",
          "intensity": "RPE 8-9",
          "progression": "Double progression; strict, no swing",
          "notes": "Side-delt balance for healthy pressing shoulders. Short rest.",
          "role": "accessory"
        },
        {
          "name": "Triceps Pushdown",
          "sets": "3",
          "reps": "12-15",
          "intensity": "RPE 9 / 0-1 RIR",
          "progression": "Double progression; failure permissible here (isolation)",
          "notes": "Elbows pinned; this is where Helms allows training near failure.",
          "role": "finisher"
        }
      ]
    },
    "Deadlift": {
      "focus": "Deadlift strength + glute and posterior-chain overload",
      "ex": [
        {
          "name": "Barbell Deadlift",
          "sets": "3",
          "reps": "5/3/1+ (wave)",
          "intensity": "65-95% TM, last set AMRAP @ 1-2 RIR",
          "progression": "5/3/1 wave; +10 lb to TM each completed wave. Pull heavy only ~1x/week per Rippetoe.",
          "notes": "Bar over mid-foot, slack pulled out, neutral spine; reset each rep.",
          "role": "main"
        },
        {
          "name": "Front Barbell Squat",
          "sets": "3-4",
          "reps": "5",
          "intensity": "RPE 7-8 (~80% of front-squat 5RM)",
          "progression": "Add 5 lb when all sets x5 clean; ramp 3->4 sets",
          "notes": "Elbows high, upright torso — quad/upper-back work that spares the low back after deadlifts.",
          "role": "accessory"
        },
        {
          "name": "Barbell Hip Thrust",
          "sets": "3",
          "reps": "10-12",
          "intensity": "RPE 8",
          "progression": "Double progression then add load",
          "notes": "Full lockout, ribs down, 1s glute squeeze at top.",
          "role": "accessory"
        },
        {
          "name": "Split Squats",
          "sets": "3",
          "reps": "8-10 per leg",
          "intensity": "RPE 7-8",
          "progression": "Double progression; add load each leg",
          "notes": "Vertical shin on front leg, control the descent. Sub: Step-up with Knee Raise.",
          "role": "accessory"
        },
        {
          "name": "Glute Ham Raise",
          "sets": "3",
          "reps": "8-12",
          "intensity": "RPE 8",
          "progression": "Add reps then add weight/band; regress to Natural Glute Ham Raise",
          "notes": "Heavy hamstring/erector-spinae work. Sub: Hyperextensions (Back Extensions).",
          "role": "accessory"
        },
        {
          "name": "Plank",
          "sets": "3",
          "reps": "30-60 sec",
          "intensity": "RPE 8",
          "progression": "Add time then add plate on back",
          "notes": "Anti-extension brace that carries over to the deadlift. Sub: Cable Crunch.",
          "role": "finisher"
        }
      ]
    },
    "Overhead": {
      "focus": "Overhead press strength + vertical pulling and arms",
      "ex": [
        {
          "name": "Barbell Shoulder Press",
          "sets": "3",
          "reps": "5/3/1+ (wave)",
          "intensity": "65-95% TM, last set AMRAP @ 1-2 RIR",
          "progression": "5/3/1 wave; +5 lb to TM each completed wave",
          "notes": "Strict overhead, glutes tight, head through at lockout.",
          "role": "main"
        },
        {
          "name": "Incline Dumbbell Press",
          "sets": "4",
          "reps": "8-12",
          "intensity": "RPE 7-8",
          "progression": "Double progression then add load; ramp 3->4 sets",
          "notes": "~30deg bench, full stretch at bottom. Upper-chest balance for bench.",
          "role": "accessory"
        },
        {
          "name": "Chin-Up",
          "sets": "3",
          "reps": "AMRAP (target 8-12)",
          "intensity": "Bodyweight to RPE 9",
          "progression": "Rippetoe rule: when you exceed 15 reps/set, add weight and work to fail at 5-7",
          "notes": "Full hang to chin over bar. Sub: assisted/band if <5 reps.",
          "role": "accessory"
        },
        {
          "name": "Seated Cable Rows",
          "sets": "3",
          "reps": "10-12",
          "intensity": "RPE 8",
          "progression": "Double progression then add load",
          "notes": "Tall chest, squeeze shoulder blades, no torso heave.",
          "role": "accessory"
        },
        {
          "name": "Face Pull",
          "sets": "3",
          "reps": "15-20",
          "intensity": "RPE 8",
          "progression": "Double progression; prioritize quality over load",
          "notes": "Rear-delt/scap-health work that offsets all the pressing. Short rest.",
          "role": "accessory"
        },
        {
          "name": "Barbell Curl",
          "sets": "3",
          "reps": "10-12",
          "intensity": "RPE 9 / 0-1 RIR",
          "progression": "Double progression; failure OK (isolation)",
          "notes": "Audience-favorite arm work, kept subordinate to the compounds. Sub: Hammer Curls.",
          "role": "finisher"
        }
      ]
    }
  },
  "B": {
    "Squat": {
      "focus": "Front-squat variant + high-volume quad/hamstring hypertrophy (MEV->MRV)",
      "ex": [
        {
          "name": "Front Barbell Squat",
          "sets": "3",
          "reps": "5/3/1+ (wave)",
          "intensity": "65-95% of front-squat TM, last set AMRAP",
          "progression": "5/3/1 wave on a front-squat TM; +10 lb/wave. Directed variation off Rotation A's back squat.",
          "notes": "New stimulus: more quad/upper-back, upright torso. Keeps squatting heavy while sparing the pattern.",
          "role": "main"
        },
        {
          "name": "Romanian Deadlift",
          "sets": "5",
          "reps": "10",
          "intensity": "~50-60% / RPE 7-8 (BBB volume)",
          "progression": "BBB 5x10; ramp 3->5 sets across the block toward MRV",
          "notes": "Hamstring/glute hypertrophy block. Controlled eccentric.",
          "role": "accessory"
        },
        {
          "name": "Leg Press",
          "sets": "3-4",
          "reps": "12-15",
          "intensity": "RPE 8-9",
          "progression": "Double progression 12->15 then add load",
          "notes": "High-SFR quad volume with low axial fatigue (Israetel). Full ROM, knees track toes.",
          "role": "accessory"
        },
        {
          "name": "Split Squat with Dumbbells",
          "sets": "3",
          "reps": "10-12 per leg",
          "intensity": "RPE 8",
          "progression": "Double progression; add load each leg",
          "notes": "Elevate rear foot for more range if able. Sub: Dumbbell Lunges.",
          "role": "accessory"
        },
        {
          "name": "Seated Leg Curl",
          "sets": "3",
          "reps": "12-15",
          "intensity": "RPE 9 / 0-1 RIR",
          "progression": "Double progression then add load",
          "notes": "Different hamstring length than lying curl — varies the stimulus.",
          "role": "accessory"
        },
        {
          "name": "Seated Calf Raise",
          "sets": "4",
          "reps": "15-20",
          "intensity": "RPE 9",
          "progression": "Double progression; pause at top",
          "notes": "Biases soleus (vs standing). Short rest.",
          "role": "finisher"
        }
      ]
    },
    "Bench": {
      "focus": "Bench strength held + BBB pressing volume and balanced pulling",
      "ex": [
        {
          "name": "Barbell Bench Press - Medium Grip",
          "sets": "3",
          "reps": "5/3/1+ (wave)",
          "intensity": "65-95% TM, AMRAP top set",
          "progression": "5/3/1 wave; +5 lb/wave",
          "notes": "Carry the AMRAP rep PRs from Rotation A forward at a higher TM.",
          "role": "main"
        },
        {
          "name": "Incline Dumbbell Press",
          "sets": "5",
          "reps": "10",
          "intensity": "RPE 7-8 (BBB volume)",
          "progression": "BBB 5x10; ramp sets 3->5 toward MRV",
          "notes": "Upper-chest hypertrophy supplemental. Full stretch.",
          "role": "accessory"
        },
        {
          "name": "One-Arm Dumbbell Row",
          "sets": "4",
          "reps": "10-12",
          "intensity": "RPE 8",
          "progression": "Double progression; add load each arm",
          "notes": "Unilateral pulling matches the pressing volume and fixes L/R imbalance.",
          "role": "accessory"
        },
        {
          "name": "Wide-Grip Lat Pulldown",
          "sets": "3",
          "reps": "12-15",
          "intensity": "RPE 8-9",
          "progression": "Double progression then add load",
          "notes": "Lat width. Drive elbows to ribs.",
          "role": "accessory"
        },
        {
          "name": "Side Lateral Raise",
          "sets": "4",
          "reps": "15-20",
          "intensity": "RPE 9",
          "progression": "Double progression; partials allowed at the end",
          "notes": "Higher delt volume in the hypertrophy block. Short rest.",
          "role": "accessory"
        },
        {
          "name": "EZ-Bar Skullcrusher",
          "sets": "3",
          "reps": "10-12",
          "intensity": "RPE 9 / 0-1 RIR",
          "progression": "Double progression; failure OK",
          "notes": "Long-head triceps for bench carryover. Sub: Triceps Pushdown.",
          "role": "finisher"
        }
      ]
    },
    "Deadlift": {
      "focus": "Pull variant + glute/hamstring/posterior hypertrophy",
      "ex": [
        {
          "name": "Sumo Deadlift",
          "sets": "3",
          "reps": "5/3/1+ (wave)",
          "intensity": "65-95% of a sumo TM, AMRAP top set",
          "progression": "5/3/1 wave on a sumo TM; +10 lb/wave. Variant of Rotation A's conventional pull.",
          "notes": "More quad/adductor and upright torso. Sub: Trap Bar Deadlift if sumo mobility is poor.",
          "role": "main"
        },
        {
          "name": "Good Morning",
          "sets": "3-4",
          "reps": "8-10",
          "intensity": "RPE 7 (start light)",
          "progression": "Add 5 lb when all sets clean; ramp 3->4 sets",
          "notes": "Direct erector/hamstring strength — adds a 3rd hinge variant the old program lacked. Brace hard.",
          "role": "accessory"
        },
        {
          "name": "Barbell Hip Thrust",
          "sets": "4",
          "reps": "12-15",
          "intensity": "RPE 8",
          "progression": "Double progression then add load",
          "notes": "High-volume glute work, full lockout.",
          "role": "accessory"
        },
        {
          "name": "Dumbbell Lunges",
          "sets": "3",
          "reps": "12 per leg",
          "intensity": "RPE 8",
          "progression": "Double progression; add load",
          "notes": "Walking or stationary. Sub: Step-up with Knee Raise.",
          "role": "accessory"
        },
        {
          "name": "Lying Leg Curls",
          "sets": "3",
          "reps": "12-15",
          "intensity": "RPE 9",
          "progression": "Double progression then add load",
          "notes": "Keeps weekly hamstring sets high alongside the RDL day.",
          "role": "accessory"
        },
        {
          "name": "Cable Crunch",
          "sets": "3",
          "reps": "12-15",
          "intensity": "RPE 9",
          "progression": "Double progression — loaded ab work, not endless crunches (Rippetoe)",
          "notes": "Round the spine, hips fixed. Sub: Hanging Leg Raise.",
          "role": "finisher"
        }
      ]
    },
    "Overhead": {
      "focus": "Press variant + vertical pulling volume and arms",
      "ex": [
        {
          "name": "Arnold Dumbbell Press",
          "sets": "4",
          "reps": "8-10",
          "intensity": "RPE 7-8",
          "progression": "Double progression then add load; ramp 3->4 sets",
          "notes": "Dumbbell overhead variant of the barbell press — more ROM and front/side delt. Sub: Barbell Shoulder Press.",
          "role": "main"
        },
        {
          "name": "Seated Cable Rows",
          "sets": "5",
          "reps": "10",
          "intensity": "RPE 7-8 (BBB volume)",
          "progression": "BBB 5x10; ramp 3->5 sets toward MRV",
          "notes": "Mid-back volume to balance overhead pressing. Squeeze and control.",
          "role": "accessory"
        },
        {
          "name": "Pullups",
          "sets": "3",
          "reps": "AMRAP (target 8-12)",
          "intensity": "Bodyweight to RPE 9",
          "progression": "Add weight once >15 reps/set (Rippetoe)",
          "notes": "Overhand. Sub: Wide-Grip Lat Pulldown.",
          "role": "accessory"
        },
        {
          "name": "Face Pull",
          "sets": "4",
          "reps": "15-20",
          "intensity": "RPE 8",
          "progression": "Double progression; quality first",
          "notes": "More rear-delt/scap volume in the hypertrophy block.",
          "role": "accessory"
        },
        {
          "name": "Hammer Curls",
          "sets": "3",
          "reps": "10-12",
          "intensity": "RPE 9",
          "progression": "Double progression; failure OK",
          "notes": "Brachialis/brachioradialis. Sub: Barbell Curl.",
          "role": "accessory"
        },
        {
          "name": "Triceps Pushdown",
          "sets": "3",
          "reps": "15-20",
          "intensity": "RPE 9 / 0 RIR",
          "progression": "Double progression; metabolite finisher",
          "notes": "Short rest, chase the pump (Israetel high-rep isolation).",
          "role": "finisher"
        }
      ]
    }
  },
  "C": {
    "Squat": {
      "focus": "Heavy squat-strength variant + single-leg and posterior overload",
      "ex": [
        {
          "name": "Box Squat",
          "sets": "5",
          "reps": "3",
          "intensity": "RPE 8-9 (~80-90% TM), last set AMRAP optional",
          "progression": "Work up to a heavy 3 each week, +5-10 lb when all 5x3 are crisp; 1s pause on the box",
          "notes": "Builds out-of-the-hole strength and teaches a vertical shin. Sub: pause Barbell Squat (3s in the hole).",
          "role": "main"
        },
        {
          "name": "Deficit Deadlift",
          "sets": "3",
          "reps": "5",
          "intensity": "RPE 7-8 (~70-80% of deadlift TM)",
          "progression": "Add 5-10 lb when all 3x5 clean",
          "notes": "Stand on a 1-2in plate to overload the bottom; carries to the standard pull. Sub: Barbell Deadlift.",
          "role": "accessory"
        },
        {
          "name": "Step-up with Knee Raise",
          "sets": "3",
          "reps": "8-10 per leg",
          "intensity": "RPE 8",
          "progression": "Double progression; raise box height or add load",
          "notes": "Knee-dominant single-leg strength and balance. Sub: Split Squats.",
          "role": "accessory"
        },
        {
          "name": "Glute Ham Raise",
          "sets": "3",
          "reps": "6-10",
          "intensity": "RPE 8-9",
          "progression": "Add weight/band as reps climb",
          "notes": "Heavy eccentric hamstring strength. Sub: Natural Glute Ham Raise or Lying Leg Curls.",
          "role": "accessory"
        },
        {
          "name": "Standing Calf Raises",
          "sets": "4",
          "reps": "10-12",
          "intensity": "RPE 9",
          "progression": "Double progression; heavier/lower reps this block",
          "notes": "Pause top and bottom.",
          "role": "accessory"
        },
        {
          "name": "Barbell Ab Rollout",
          "sets": "3",
          "reps": "8-12",
          "intensity": "RPE 8",
          "progression": "Increase ROM then add range/load",
          "notes": "Heavy anti-extension to protect the spine under the peaking loads. Sub: Plank.",
          "role": "finisher"
        }
      ]
    },
    "Bench": {
      "focus": "Heavy lockout-strength pressing + heavy pulling",
      "ex": [
        {
          "name": "Close-Grip Barbell Bench Press",
          "sets": "5",
          "reps": "3",
          "intensity": "RPE 8-9 (~85% TM)",
          "progression": "Heavy triples, +5 lb when all 5x3 clean; overloads triceps/lockout to drive the comp bench",
          "notes": "Shoulder-width grip, elbows tucked. Sub: Pin Presses for a dead-stop variant.",
          "role": "main"
        },
        {
          "name": "Pin Presses",
          "sets": "3",
          "reps": "5",
          "intensity": "RPE 8",
          "progression": "Add 5 lb when all sets clean",
          "notes": "Dead-stop from mid-chest pins — kills the stretch reflex, builds the sticking point. Sub: Floor Press.",
          "role": "accessory"
        },
        {
          "name": "T-Bar Row with Handle",
          "sets": "4",
          "reps": "6-8",
          "intensity": "RPE 8",
          "progression": "Double progression then add load; heavier/lower reps this block",
          "notes": "Heavy mid-back to match the heavy pressing. Sub: Bent Over Barbell Row.",
          "role": "accessory"
        },
        {
          "name": "Chin-Up",
          "sets": "4",
          "reps": "5-6 (weighted)",
          "intensity": "RPE 8-9",
          "progression": "Add weight as 4x6 becomes easy (Rippetoe weighted-chin progression)",
          "notes": "Weighted, lower-rep strength focus. Sub: Wide-Grip Lat Pulldown heavy.",
          "role": "accessory"
        },
        {
          "name": "Face Pull",
          "sets": "3",
          "reps": "15-20",
          "intensity": "RPE 8",
          "progression": "Double progression; maintain shoulder health under heavy loads",
          "notes": "Keep this in every block — insurance for the pressing volume.",
          "role": "accessory"
        },
        {
          "name": "Triceps Pushdown",
          "sets": "3",
          "reps": "10-12",
          "intensity": "RPE 9",
          "progression": "Double progression; failure OK",
          "notes": "Direct lockout work. Sub: EZ-Bar Skullcrusher.",
          "role": "finisher"
        }
      ]
    },
    "Deadlift": {
      "focus": "Peak deadlift strength + heavy posterior chain and single-leg",
      "ex": [
        {
          "name": "Barbell Deadlift",
          "sets": "3",
          "reps": "5/3/1+ (wave, peak)",
          "intensity": "Wk3 works up to 1+ @ 95% TM; treat the AMRAP single as a strength test",
          "progression": "Final 5/3/1 wave of the macrocycle; use AMRAP to estimate a new 1RM, then reset TMs +higher for the next A block",
          "notes": "This is where the loop pays off — heavier than the last pass. Reset between reps.",
          "role": "main"
        },
        {
          "name": "Front Barbell Squat",
          "sets": "3",
          "reps": "3-5",
          "intensity": "RPE 8 (~80-85%)",
          "progression": "Add 5-10 lb when all sets clean",
          "notes": "Heavy quad/brace work that supports the deadlift without re-fatiguing the back-squat pattern.",
          "role": "accessory"
        },
        {
          "name": "Barbell Hip Thrust",
          "sets": "3",
          "reps": "6-8",
          "intensity": "RPE 8-9",
          "progression": "Double progression; heavier/lower reps",
          "notes": "Heavy lockout glute drive for the deadlift. Pause at top.",
          "role": "accessory"
        },
        {
          "name": "Split Squat with Dumbbells",
          "sets": "3",
          "reps": "6-8 per leg",
          "intensity": "RPE 8",
          "progression": "Double progression; add load each leg",
          "notes": "Lower-rep, heavier single-leg strength. Sub: Barbell Lunge.",
          "role": "accessory"
        },
        {
          "name": "Natural Glute Ham Raise",
          "sets": "3",
          "reps": "6-10",
          "intensity": "RPE 8",
          "progression": "Add reps then band/plate resistance",
          "notes": "Posterior-chain insurance. Sub: Lying Leg Curls.",
          "role": "accessory"
        },
        {
          "name": "Hanging Leg Raise",
          "sets": "3",
          "reps": "10-15",
          "intensity": "RPE 8",
          "progression": "Add reps then ankle weight",
          "notes": "Controlled, no swing. Sub: Cable Crunch.",
          "role": "finisher"
        }
      ]
    },
    "Overhead": {
      "focus": "Peak overhead strength + heavy pulling and arms",
      "ex": [
        {
          "name": "Push Press",
          "sets": "5",
          "reps": "3",
          "intensity": "RPE 8 (loads above strict-press TM)",
          "progression": "Add 5 lb when all 5x3 clean; leg drive lets you overload the overhead lockout",
          "notes": "Dip-drive vertical, finish strict overhead. Sub: Barbell Shoulder Press heavy.",
          "role": "main"
        },
        {
          "name": "Floor Press",
          "sets": "3",
          "reps": "5",
          "intensity": "RPE 8",
          "progression": "Add 5 lb when all sets clean",
          "notes": "Dead-stop horizontal pressing, triceps-biased; spares the shoulder. Sub: Close-Grip Barbell Bench Press.",
          "role": "accessory"
        },
        {
          "name": "Bent Over Barbell Row",
          "sets": "4",
          "reps": "6-8",
          "intensity": "RPE 8",
          "progression": "Double progression then add load; heavy/lower-rep",
          "notes": "Strict torso angle, build the back that supports every pull.",
          "role": "accessory"
        },
        {
          "name": "Wide-Grip Lat Pulldown",
          "sets": "3",
          "reps": "8-10",
          "intensity": "RPE 8-9",
          "progression": "Double progression then add load",
          "notes": "Heavier lat work this block. Sub: Pullups.",
          "role": "accessory"
        },
        {
          "name": "Side Lateral Raise",
          "sets": "3",
          "reps": "12-15",
          "intensity": "RPE 8-9",
          "progression": "Double progression",
          "notes": "Keep delt balance through the peak. Short rest.",
          "role": "accessory"
        },
        {
          "name": "Barbell Curl",
          "sets": "3",
          "reps": "8-10",
          "intensity": "RPE 9",
          "progression": "Double progression; failure OK",
          "notes": "Heavier curls to close the macrocycle. Sub: Hammer Curls.",
          "role": "finisher"
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
