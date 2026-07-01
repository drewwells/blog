#!/usr/bin/env python3
"""gen_blog_data.py — regenerate a blog post's DATA blob from fitscrape program.json.

This is the REAL generator the post JS headers refer to. It reads an *authored*
fitscrape ``program.json`` and rewrites the ``var DATA = { ... };`` block inside a
target post's JS bundle. Per-exercise movement-reference images
(``imgStart`` / ``imgFinish`` / ``imgLabel`` / ``imgApprox``) flow through from
program.json verbatim, so regenerating can never drop them — the image mapping is
owned upstream in fitscrape, not hand-authored in the blog.

Deterministic; no LLM. The hand-authored CONFIG (kicker, legend, howto, program
notes, day labels) and the render code in the JS file are left untouched.

Usage:
    scripts/gen_blog_data.py anchored-and-springy [--program PATH] [--check]

``--check`` regenerates in-memory and diffs against the current file without
writing — exit 0 if identical, 1 if it would change (use in CI / dry-runs).
"""
import argparse
import difflib
import json
import sys
from collections import OrderedDict
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
# fitscrape lives as a sibling local repo (no remote); allow override via --program.
DEFAULT_FITSCRAPE = Path.home() / "src" / "fitscrape"

# Per-post wiring: which fitscrape program feeds the post, and how its authored
# rotation/day names shorten to the compact keys the post JS uses. These are blog
# presentation concerns, so they live here (not in fitscrape).
POSTS = {
    "anchored-and-springy": {
        "program": "data/dancer/program.json",
        # rotation name (program.json) -> program key (post JS)
        "program_keys": {
            "Foundation (Weeks 1-4)": "Foundation",
            "Performance (Weeks 5-8+)": "Performance",
        },
        # day name (program.json) -> day key (post JS)
        "day_keys": {
            "Ankle & Foot": "Foot",
            "Single-leg & Balance": "Balance",
            "Core & Posture (anti-rotation)": "Core",
            "Hip Mobility / Recovery (daily 10-15 min menu)": "Mobility",
        },
    },
    "the-rotation": {
        "program": "data/strength/program.json",
        # rotations A/B/C keep their names as keys
        "program_keys": {"A": "A", "B": "B", "C": "C"},
        # day names vary per rotation (Lower A (Squat focus) vs (Front-squat
        # accumulation)...), so keys are POSITIONAL: a list indexed by day order.
        "day_keys": ["Squat", "Bench", "Deadlift", "Overhead"],
    },
}

# Exercise fields carried from program.json into the DATA blob, in order.
# 'pattern' is intentionally dropped; the img* fields are appended when present.
EX_FIELDS = ("name", "sets", "reps", "intensity", "progression", "notes", "role")
IMG_FIELDS = ("imgStart", "imgFinish", "imgLabel", "imgApprox")


def build_data(program: dict, spec: dict) -> "OrderedDict":
    """program.json -> the DATA mapping {program: {day: {focus, ex: [...]}}}."""
    out = OrderedDict()
    day_keys = spec["day_keys"]
    for rot in program["rotations"]:
        pkey = spec["program_keys"][rot["rotation"]]
        out[pkey] = OrderedDict()
        for idx, day in enumerate(rot["days"]):
            # day_keys is either a name->key dict or a positional list
            dkey = day_keys[idx] if isinstance(day_keys, list) else day_keys[day["day"]]
            ex_list = []
            for ex in day["exercises"]:
                e = OrderedDict()
                for f in EX_FIELDS:
                    if f in ex:
                        e[f] = ex[f]
                for f in IMG_FIELDS:           # present only for matched movements
                    if f in ex:
                        e[f] = ex[f]
                ex_list.append(e)
            out[pkey][dkey] = OrderedDict(focus=day.get("focus", ""), ex=ex_list)
    return out


def splice_data_block(src: str, data: "OrderedDict") -> str:
    """Replace the existing ``var DATA = {...};`` block, preserving everything else."""
    marker = "var DATA = "
    start = src.index(marker)
    brace = start + len(marker)
    depth = 0
    i = brace
    while i < len(src):
        c = src[i]
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                break
        i += 1
    # i is the closing brace; expect a trailing ';'
    end = i + 1
    if src[end:end + 1] == ";":
        end += 1
    blob = marker + json.dumps(data, indent=2, ensure_ascii=False) + ";"
    return src[:start] + blob + src[end:]


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("post", choices=sorted(POSTS), help="post slug to regenerate")
    ap.add_argument("--program", help="override path to fitscrape program.json")
    ap.add_argument("--fitscrape", default=str(DEFAULT_FITSCRAPE),
                    help="fitscrape repo root (default: ~/src/fitscrape)")
    ap.add_argument("--check", action="store_true",
                    help="diff only; exit 1 if the file would change")
    args = ap.parse_args()

    spec = POSTS[args.post]
    prog_path = Path(args.program) if args.program else Path(args.fitscrape) / spec["program"]
    if not prog_path.exists():
        sys.stderr.write(f"program.json not found: {prog_path}\n")
        return 2
    program = json.loads(prog_path.read_text())

    js_path = REPO / "public" / "posts" / args.post / f"{args.post.split('-')[0]}.js"
    # the JS filename isn't always the first slug token; resolve the single .js in the dir
    if not js_path.exists():
        js_files = sorted((REPO / "public" / "posts" / args.post).glob("*.js"))
        if len(js_files) != 1:
            sys.stderr.write(f"cannot resolve post JS in {js_path.parent}: {js_files}\n")
            return 2
        js_path = js_files[0]

    src = js_path.read_text()
    data = build_data(program, spec)
    new_src = splice_data_block(src, data)

    if args.check:
        if new_src == src:
            sys.stderr.write(f"OK: {js_path.name} DATA blob is up to date.\n")
            return 0
        diff = difflib.unified_diff(src.splitlines(True), new_src.splitlines(True),
                                    js_path.name, js_path.name + " (regenerated)")
        sys.stdout.writelines(diff)
        sys.stderr.write(f"\nDIFF: {js_path.name} would change (run without --check to apply).\n")
        return 1

    js_path.write_text(new_src)
    n = sum(len(d["ex"]) for p in data.values() for d in p.values())
    imgs = sum(1 for p in data.values() for d in p.values()
               for e in d["ex"] if "imgStart" in e)
    sys.stderr.write(f"Wrote {js_path.name}: {n} exercises, {imgs} with images, "
                     f"from {prog_path}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
