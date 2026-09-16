#!/usr/bin/env python
"""Turn the R mark art into transparent PNG icons, one per theme.

Run with a python that has Pillow and numpy, e.g.
  ~/.venvs/astro/bin/python scripts/make-mark-icons.py

Sources (unpublished originals, kept so the icons can be regenerated):
  assets/marks/source-magenta.jpg (bright magenta, the DARK theme icon)
  assets/marks/source-violet.jpg  (deeper violet, the LIGHT theme icon)

Writes:
  assets/marks/mark-<theme>-master.png   512px, the full size master
  static/icon/icon-<theme>.png           128px, what the page ships

HOW THE BACKGROUND COMES OFF. The art was exported over near black, so every
pixel is ALREADY premultiplied: rgb = ink * coverage. Coverage is therefore
max(r, g, b) measured against the ink's OWN peak channel, not against 255: the
ink is #C145F1 (peak 241) in one file and #7B3AEC (peak 236) in the other, and
dividing by 255 would drop every flat interior to 94% coverage and repaint the
mark a shade brighter than the art. The peak is read out of the file as the most
common max-channel value under the paint.

Doing the crop, the pad and the resize in premultiplied space is the other half
of the trick: resizing straight RGBA drags the black of the empty pixels into
the glyph and leaves a dark fringe around every edge. Only the finished, resized
buffer is converted to straight alpha for the PNG.

The alpha floor drops the JPEG haze around the glyph (the source is a JPEG, so
"empty" is #010101..#0D0014 rather than a clean 0). It sits far below the
antialiased edge range, so it clips nothing visible.
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path("/Users/codenester/Projects/portfolio")
MARKS = ROOT / "assets/marks"
SHIPPED = ROOT / "static/icon"

ICON_PX = 128  # the favicon
# the mark that stands in for the R of the name in the hero. The css can ask for a
# 106.84px box at the top of the clamp, and a 3x screen needs 320px of file for it,
# so this is rounded up from there: a smaller file is upscaled and looks soft.
HERO_PX = 384
MASTER_PX = 512
PAD = 0.07  # of the longer side of the mark, so the glyph never touches the edge
ALPHA_FLOOR = 16  # of 255

# theme -> (source art, the page background the icon sits next to)
THEMES = {
    "dark": ("source-magenta.jpg", "#150d1c"),
    "light": ("source-violet.jpg", "#faf6fb"),
}


def premultiplied(path: Path) -> tuple[np.ndarray, float]:
    """RGB over black (coverage folded in) plus the ink's peak channel."""
    with Image.open(path) as im:
        a = np.asarray(im.convert("RGB")).astype(np.float32)
    mx = a.max(axis=2)
    painted = mx >= ALPHA_FLOOR
    if not painted.any():
        raise SystemExit(f"{path} has no paint above the alpha floor")

    # the flat ink tone = the most common max-channel value under the paint
    values, counts = np.unique(mx[painted].astype(np.uint8), return_counts=True)
    peak = max(float(values[counts.argmax()]), float(ALPHA_FLOOR))

    # clamp overshoot (JPEG ringing above the ink) to full coverage
    a = np.where((mx > peak)[:, :, None], a * (peak / np.maximum(mx, 1e-6))[:, :, None], a)
    a[mx < ALPHA_FLOOR] = 0.0
    return a, peak


def square_canvas(premult: np.ndarray) -> np.ndarray:
    """Tight crop of the mark, centred on a padded square of the same space."""
    coverage = premult.max(axis=2)
    ys, xs = np.nonzero(coverage > 0)
    if len(xs) == 0:
        raise SystemExit("the source is empty: nothing left after the alpha floor")
    crop = premult[ys.min() : ys.max() + 1, xs.min() : xs.max() + 1]
    ch, cw = crop.shape[:2]
    side = int(round(max(ch, cw) * (1 + 2 * PAD)))
    canvas = np.zeros((side, side, 3), np.float32)
    oy, ox = (side - ch) // 2, (side - cw) // 2
    canvas[oy : oy + ch, ox : ox + cw] = crop
    return canvas


def to_rgba(canvas: np.ndarray, size: int, peak: float) -> Image.Image:
    """Resize in premultiplied space, then split into colour + alpha."""
    resized = np.asarray(
        Image.fromarray(np.clip(canvas, 0, 255).astype("uint8")).resize((size, size), Image.LANCZOS)
    ).astype(np.float32)
    coverage = np.clip(resized.max(axis=2) / peak, 0.0, 1.0)
    rgb = np.zeros_like(resized)
    painted = coverage > 0
    rgb[painted] = np.clip(resized[painted] / coverage[painted, None], 0, 255)
    return Image.fromarray(np.dstack([rgb, coverage * 255.0]).astype("uint8"), "RGBA")


def report(im: Image.Image, target: Path, size: int, peak: float, bg: str) -> None:
    data = np.asarray(im)
    alpha = data[:, :, 3]
    solid = data[alpha >= 240][:, :3]
    ink = np.median(solid, axis=0) if solid.size else np.zeros(3)
    ys, xs = np.nonzero(alpha > 0)
    box = ""
    if len(xs):
        w = (xs.max() - xs.min() + 1) / size
        h = (ys.max() - ys.min() + 1) / size
        box = f", ink {w:.3f}w x {h:.3f}h of the square, bearing {xs.min() / size:.3f} side / {ys.min() / size:.3f} top"
    print(
        f"  {target.relative_to(ROOT)}: {size}x{size} RGBA, {(alpha > 0).mean():.1%} painted, "
        f"{int(((alpha > 0) & (alpha < 255)).sum())} antialiased px, "
        f"ink #{int(ink[0]):02X}{int(ink[1]):02X}{int(ink[2]):02X} on {bg} "
        f"(source peak {peak:.0f}), {target.stat().st_size // 1024}KB{box}"
    )


def main() -> int:
    MARKS.mkdir(parents=True, exist_ok=True)
    SHIPPED.mkdir(parents=True, exist_ok=True)

    for theme, (name, bg) in THEMES.items():
        src = MARKS / name
        if not src.exists():
            raise SystemExit(f"missing source art: {src}")
        premult, peak = premultiplied(src)
        canvas = square_canvas(premult)

        targets = (
            (MARKS / f"mark-{theme}-master.png", MASTER_PX),
            (SHIPPED / f"mark-{theme}.png", HERO_PX),
            (SHIPPED / f"icon-{theme}.png", ICON_PX),
        )
        for target, size in targets:
            rgba = to_rgba(canvas, size, peak)
            rgba.save(target, "PNG", optimize=True)
            report(rgba, target, size, peak, bg)

    print()
    print("next: ~/.venvs/astro/bin/python scripts/check-icons.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())
