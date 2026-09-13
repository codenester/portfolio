#!/usr/bin/env python
"""Make 4:5 portrait-card crops of the source photo for the portfolio.

Run with a python that has Pillow, e.g.
  ~/.cache/uv/archive-v0/<hash>/bin/python scripts/make-portrait-crops.py [variant]

Writes three candidate crops (all 4:5, EXIF/GPS stripped) plus a gallery page at
/tmp/pf-crops, and installs one of them as static/img/profile.jpg — variant
defaults to A-frame, pass e.g. `B-tight` or `C-chest` to install that one.
"""

import json
import os
import sys
from pathlib import Path

from PIL import Image, ImageOps

SRC = Path("/Users/codenester/Projects/portfolio/assets/profile-src.jpg")
SITE_OUT = Path("/Users/codenester/Projects/portfolio/static/img/profile.jpg")
GALLERY = Path("/tmp/pf-crops")

src = ImageOps.exif_transpose(Image.open(SRC)).convert("RGB")
W, H = src.size

# Face geometry read off the photo: eyes ~30% down, face centre ~52% across.
EYE_Y = 0.30
FACE_X = 0.52
ASPECT = 4 / 5  # w / h

# (name, crop height in px, vertical start in px, description)
CANDIDATES = [
    ("A-frame", H, 0, "Full frame — head to waist, ruins visible"),
    ("B-tight", 825, 20, "Tighter — head and chest, less background"),
    ("C-chest", 700, 40, "Chest-up — face-forward, most cropping"),
]


def crop_for(name: str, ch: int, y0: int) -> tuple[Image.Image, tuple[int, int, int, int]]:
    ch = min(ch, H)
    cw = int(round(ch * ASPECT))
    if cw > W:  # cannot be wider than the source
        cw = W
        ch = int(round(cw / ASPECT))
    x0 = int(round(FACE_X * W - cw / 2))
    x0 = max(0, min(x0, W - cw))
    y0 = max(0, min(y0, H - ch))
    return src.crop((x0, y0, x0 + cw, y0 + ch)), (x0, y0, cw, ch)


GALLERY.mkdir(parents=True, exist_ok=True)
report = []
for name, ch, y0, desc in CANDIDATES:
    img, box = crop_for(name, ch, y0)
    out = GALLERY / f"{name}.jpg"
    img.save(out, "JPEG", quality=88, optimize=True, progressive=True)  # no exif= -> stripped
    eye_pct = round((EYE_Y * H - box[1]) / box[3] * 100)
    report.append(
        {
            "name": name,
            "file": str(out),
            "size": f"{img.width}x{img.height}",
            "box": box,
            "eyes_at_pct_from_top": eye_pct,
            "kb": round(out.stat().st_size / 1024),
            "desc": desc,
        }
    )

# install the chosen crop on the site (argv[1], default A-frame)
wanted = sys.argv[1] if len(sys.argv) > 1 else CANDIDATES[0][0]
chosen = next((c for c in CANDIDATES if c[0] == wanted), None)
if chosen is None:
    raise SystemExit(f"unknown variant {wanted!r}; choose from {[c[0] for c in CANDIDATES]}")
best, box = crop_for(*chosen[:3])
best.save(SITE_OUT, "JPEG", quality=88, optimize=True, progressive=True)
installed = {
    "variant": chosen[0],
    "file": str(SITE_OUT),
    "size": f"{best.width}x{best.height}",
    "kb": round(SITE_OUT.stat().st_size / 1024),
}

# gallery page so the choice is one look, not a loop of messages
cards = "\n".join(
    f"""      <figure>
        <img src="{r['name']}.jpg" alt="{r['name']}">
        <figcaption><b>{r['name']}</b> · {r['size']} · {r['kb']} KB · eyes {r['eyes_at_pct_from_top']}% from top<br><span>{r['desc']}</span></figcaption>
      </figure>"""
    for r in report
)
(GALLERY / "index.html").write_text(
    f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Portrait crop candidates</title>
<style>
  body {{ margin:0; padding:40px; background:#faf6fb; color:#191023;
         font:16px/1.5 'Manrope',system-ui,-apple-system,sans-serif; }}
  h1 {{ font-size:24px; margin:0 0 6px; }}
  p.lead {{ color:#71607f; margin:0 0 28px; }}
  .row {{ display:flex; gap:32px; flex-wrap:wrap; align-items:flex-start; }}
  figure {{ margin:0; width:300px; }}
  img {{ display:block; width:300px; aspect-ratio:4/5; object-fit:cover;
         border:1px solid rgba(25,16,35,.2); border-radius:14px; background:#f5eefa; }}
  figcaption {{ margin-top:10px; font-size:12.5px; line-height:1.5; color:#443551; }}
  figcaption span {{ color:#71607f; }}
</style></head>
<body>
  <h1>Portrait crop candidates — 4:5 card</h1>
  <p class="lead">All three are the same width in the layout (300&nbsp;px). Pick one and I'll install it.</p>
  <div class="row">
{cards}
  </div>
</body></html>
"""
)

print(json.dumps({"source": f"{W}x{H}", "installed": installed, "candidates": report}, indent=2))
