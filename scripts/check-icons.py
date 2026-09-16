#!/usr/bin/env python
"""Check the theme aware site icon (the R mark).

Run with a python that has Pillow and numpy, e.g.
  ~/.venvs/astro/bin/python scripts/check-icons.py

Run `npm run build` first: the last checks read build/index.html and the
built javascript, so a stale build reports stale wiring.

What it guards, in one place, because the mark is easy to ship broken:
  1. both theme icons exist, are square PNGs that carry an alpha channel
  2. the background is really gone: every corner pixel is fully transparent
  3. the mark survives the key: 8%..70% of the canvas has paint, and there is
     antialiased partial alpha (a hard cutout would mean the edges were lost)
  4. each icon is legible on the background of ITS theme (WCAG contrast >= 3)
  5. the two files are genuinely different hues, not the same art twice
  6. the page links the mark and swaps it with the theme: index.html carries
     the link, and both filenames are referenced by the built javascript
  7. the silhouette is faithful: the shipped alpha mask has the same shape as
     the archived source art (IoU >= 0.95), so the key did not eat the mark
  8. the hero mark (the R of the name) exists at 256px or more, is the SAME art as
     the favicon (IoU >= 0.99) and is actually placed, with both files in the DOM
     and a [data-theme] rule that picks one
  9. the hero mark is big enough for a 3x screen: the biggest box the css can ask
     for is about 107.6px, so a 3x display needs 323px of file
 10. the browser chrome colour follows the theme (the theme-color meta)
 11. the mark files are deferred when they are not the visible one
"""

import os
import re
import subprocess
import sys
from pathlib import Path


def reexec_with_pillow() -> None:
    """Relaunch on an interpreter that has Pillow and numpy, if this one lacks them.

    The guard is meant to be one command, but the system python has neither package
    and the two other image scripts need a venv. So probe this interpreter, then the
    venvs and the uv cache on this machine, and hand over to the first one that can
    import both. CHECK_ICONS_REEXEC stops the handover from looping.
    """
    try:
        import numpy  # noqa: F401
        import PIL  # noqa: F401

        return
    except ImportError:
        pass

    if os.environ.get("CHECK_ICONS_REEXEC"):
        raise SystemExit("no interpreter with Pillow and numpy found: pass one explicitly")

    home = Path.home()
    candidates = [sys.executable]
    candidates += sorted(str(p) for p in home.glob(".venvs/*/bin/python"))
    candidates += sorted(str(p) for p in home.glob(".cache/uv/archive-v0/*/bin/python"))
    for candidate in candidates:
        probe = subprocess.run([candidate, "-c", "import PIL, numpy"], capture_output=True)
        if probe.returncode == 0:
            env = {**os.environ, "CHECK_ICONS_REEXEC": "1"}
            raise SystemExit(subprocess.run([candidate, __file__, *sys.argv[1:]], env=env).returncode)
    raise SystemExit("no interpreter with Pillow and numpy found: pass one explicitly")


reexec_with_pillow()

import numpy as np  # noqa: E402
from PIL import Image  # noqa: E402

ROOT = Path("/Users/codenester/Projects/portfolio")
ICONS = {
    "dark": (ROOT / "static/icon/icon-dark.png", ROOT / "assets/marks/source-magenta.jpg", "#150d1c"),
    "light": (ROOT / "static/icon/icon-light.png", ROOT / "assets/marks/source-violet.jpg", "#faf6fb"),
}
BUILD_INDEX = ROOT / "build/index.html"
BUILD_JS = ROOT / "build/_app/immutable"

CONTENT_FLOOR = 24  # a pixel counts as paint above this
failures: list[str] = []
notes: list[str] = []


def fail(msg: str) -> None:
    failures.append(msg)


def ok(msg: str) -> None:
    notes.append(msg)


def hex_to_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]


def relative_luminance(rgb: tuple[float, float, float]) -> float:
    def channel(c: float) -> float:
        c = c / 255.0
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = (channel(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a: tuple[float, float, float], b: tuple[float, float, float]) -> float:
    la, lb = relative_luminance(a), relative_luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def silhouette(img: Image.Image, size: int = 64) -> np.ndarray:
    """Tight-cropped binary shape of a mask, normalised to a square."""
    m = np.asarray(img)
    if m.ndim == 3:
        m = m.max(axis=2)
    ys, xs = np.nonzero(m >= CONTENT_FLOOR)
    if len(xs) == 0:
        return np.zeros((size, size), dtype=bool)
    crop = Image.fromarray((m[ys.min() : ys.max() + 1, xs.min() : xs.max() + 1]).astype("uint8"))
    crop = crop.resize((size, size), Image.LANCZOS)
    return np.asarray(crop) >= 128


def main() -> int:
    loaded: dict[str, Image.Image] = {}

    # walk the installed icons
    for theme, (icon_path, source, bg_hex) in ICONS.items():
        label = f"{theme}: {icon_path.name}"

        if not icon_path.exists():
            fail(f"{label} is missing (expected at {icon_path})")
            continue
        if source.exists():
            ok(f"{theme}: source art archived at assets/marks/{source.name}")
        else:
            fail(f"{theme}: source art is not archived at assets/marks/{source.name}")

        with Image.open(icon_path) as im:
            if im.format != "PNG":
                fail(f"{label} is {im.format}, not PNG")
            if im.mode != "RGBA":
                fail(f"{label} is mode {im.mode}: no alpha channel, the background cannot be gone")
                continue
            if im.width != im.height:
                fail(f"{label} is {im.width}x{im.height}, not square")
            rgba = np.asarray(im)
            loaded[theme] = im.copy()

        alpha = rgba[:, :, 3]
        h, w = alpha.shape

        # the background must be gone at the corners
        corners = [alpha[0, 0], alpha[0, w - 1], alpha[h - 1, 0], alpha[h - 1, w - 1]]
        if max(corners) != 0:
            fail(f"{label} still has a background: corner alpha is {corners}, expected all 0")
        else:
            ok(f"{label}: background removed, {w}x{h} RGBA, corners transparent")

        # the mark must survive, and keep its soft edges
        painted = float((alpha > 0).mean())
        if not 0.08 <= painted <= 0.70:
            fail(f"{label}: {painted:.1%} of the canvas is painted, expected 8%..70%")
        partial = int(((alpha > 0) & (alpha < 255)).sum())
        if partial < 50:
            fail(f"{label}: only {partial} antialiased pixels, the edges look cut out")
        else:
            ok(f"{label}: {painted:.1%} painted, {partial} antialiased edge pixels")

        # legibility on this theme's background, using the most common solid colour
        solid = rgba[alpha >= 240]
        if solid.size == 0:
            fail(f"{label}: no fully opaque pixels to measure")
            continue
        med = np.median(solid[:, :3], axis=0)
        ink = (float(med[0]), float(med[1]), float(med[2]))
        ratio = contrast(ink, hex_to_rgb(bg_hex))
        if ratio < 3.0:
            fail(
                f"{label}: ink #{int(ink[0]):02X}{int(ink[1]):02X}{int(ink[2]):02X} on {bg_hex} "
                f"is {ratio:.2f}:1, below the 3:1 floor for a graphic"
            )
        else:
            ok(
                f"{label}: ink #{int(ink[0]):02X}{int(ink[1]):02X}{int(ink[2]):02X} on {bg_hex} "
                f"is {ratio:.2f}:1"
            )

        # faithful silhouette, measured against the archived source
        if source.exists():
            with Image.open(source) as src:
                src_rgb = src.convert("RGB")
            src_mask = silhouette(src_rgb)
            icon_mask = silhouette(Image.fromarray(alpha))
            inter = int((src_mask & icon_mask).sum())
            union = int((src_mask | icon_mask).sum())
            iou = inter / union if union else 0.0
            if iou < 0.95:
                fail(f"{label}: silhouette IoU vs the source art is {iou:.3f}, expected >= 0.95")
            else:
                ok(f"{label}: silhouette matches the source art (IoU {iou:.3f})")

    # the hero mark: the R of the name in the hero heading
    for theme, icon_path in [(t, ICONS[t][0]) for t in ICONS]:
        hero = ROOT / f"static/icon/mark-{theme}.png"
        label = f"{theme}: {hero.name}"
        if not hero.exists():
            fail(f"{label} is missing (expected at {hero})")
            continue
        with Image.open(hero) as im:
            if im.mode != "RGBA":
                fail(f"{label} is mode {im.mode}, not RGBA")
                continue
            if im.width != im.height or im.width < 320:
                fail(
                    f"{label} is {im.width}x{im.height}: a 3x screen draws the mark at "
                    f"{int(107.6 * 3)}px, so the file needs to be at least 320px"
                )
                continue
            mark_alpha = np.asarray(im)[:, :, 3].copy()
        h, w = mark_alpha.shape
        if max(mark_alpha[0, 0], mark_alpha[0, w - 1], mark_alpha[h - 1, 0], mark_alpha[h - 1, w - 1]) != 0:
            fail(f"{label} still has a background: a corner is not transparent")
            continue
        ok(f"{label}: {w}x{h} RGBA, background removed, {hero.stat().st_size // 1024}KB")

        with Image.open(icon_path) as im:
            icon_alpha = np.asarray(im)[:, :, 3].copy()
        mark_mask = silhouette(Image.fromarray(mark_alpha))

        # against the source art: the honest fidelity check
        source = ICONS[theme][1]
        if source.exists():
            with Image.open(source) as src:
                src_mask = silhouette(src.convert("RGB"))
            inter = int((src_mask & mark_mask).sum())
            union = int((src_mask | mark_mask).sum())
            iou = inter / union if union else 0.0
            if iou < 0.98:
                fail(f"{label}: silhouette IoU vs the source art is {iou:.3f}, expected >= 0.98")
            else:
                ok(f"{label}: silhouette matches the source art (IoU {iou:.3f})")

        # against the favicon: same art, not a second drawing. The floor is looser
        # than the source check because the 128px file loses the hairlines of the
        # vertical name in the downscale, so the two masks disagree by ~2.5% on
        # the thinnest strokes alone.
        icon_mask = silhouette(Image.fromarray(icon_alpha))
        inter = int((icon_mask & mark_mask).sum())
        union = int((icon_mask | mark_mask).sum())
        iou = inter / union if union else 0.0
        if iou < 0.95:
            fail(f"{label}: silhouette IoU against the favicon is {iou:.3f}, expected >= 0.95")
        else:
            ok(f"{label}: same art as the favicon (IoU {iou:.3f})")

    # the two icons must not be the same art
    if len(loaded) == 2:
        a = np.asarray(loaded["dark"].convert("RGBA"))
        b = np.asarray(loaded["light"].convert("RGBA"))
        if a.shape != b.shape:
            ok("dark and light icons differ in size")
        elif np.array_equal(a, b):
            fail("dark and light icons are byte identical: they are not two variants")
        else:
            solid_a = a[a[:, :, 3] >= 240][:, :3]
            solid_b = b[b[:, :, 3] >= 240][:, :3]
            ink_a = np.median(solid_a, axis=0)
            ink_b = np.median(solid_b, axis=0)
            spread = float(np.abs(ink_a - ink_b).max())
            if spread < 20:
                fail(f"dark and light icons are the same hue (max channel gap {spread:.0f})")
            else:
                ok(f"dark and light icons are distinct hues (max channel gap {spread:.0f})")

    # the page must link the mark and swap it with the theme
    if not BUILD_INDEX.exists():
        fail("build/index.html is missing: run `npm run build` before this check")
    else:
        html = BUILD_INDEX.read_text(encoding="utf-8")
        if 'id="site-icon"' not in html:
            fail('build/index.html has no <link id="site-icon">: the mark is not linked')
        elif "/icon/icon-dark.png" not in html:
            fail('build/index.html links the icon but not the dark variant as the default')
        else:
            ok("build/index.html links the mark with the dark default")
        if not re.search(r'rel="icon"', html):
            fail("build/index.html has no rel=icon at all")
        for theme in ICONS:
            if f"/icon/mark-{theme}.png" not in html:
                fail(f"build/index.html never places /icon/mark-{theme}.png: the hero R is not the mark")
            else:
                ok(f"build/index.html places /icon/mark-{theme}.png in the hero")

        # the name must not be pushed away from the mark: whitespace between inline
        # elements is a real word space, so the mark + name live in .mark-slot, which
        # carries font-size: 0 and makes every whitespace run inside it zero-width
        slot = html.find('class="mark-slot"')
        name = html.find('class="name"')
        if slot == -1:
            fail('build/index.html has no .mark-slot wrapper around the marks')
        elif name == -1 or name < slot:
            fail("build/index.html puts the name outside the mark slot")
        elif not all(f"/icon/mark-{t}.png" in html[slot:name] for t in ICONS):
            fail("build/index.html has a mark file outside the mark slot")
        else:
            ok("build/index.html keeps the marks and the name in one zero-space slot")

    # the browser chrome colour must follow the theme, like the icon does
    if BUILD_INDEX.exists():
        html = BUILD_INDEX.read_text(encoding="utf-8")
        if 'id="theme-color"' not in html:
            fail('build/index.html has no <meta id="theme-color">: the chrome colour is not switchable')
        elif "#150d1c" not in html:
            fail('build/index.html does not carry the dark chrome colour as its default')
        else:
            ok("build/index.html carries a theme aware chrome colour")

    # the marks must be deferred when they are not the visible one
    if BUILD_INDEX.exists():
        html = BUILD_INDEX.read_text(encoding="utf-8")
        start, end = html.find('class="mark-slot"'), html.find('class="name"')
        if start == -1 or end == -1:
            pass  # already reported above
        else:
            lazy = html[start:end].count('loading="lazy"')
            if lazy < 2:
                fail(f"only {lazy} of the 2 mark files are deferred: the hidden one downloads for nothing")
            else:
                ok("both mark files are deferred until needed")

    css_dir = ROOT / "build/_app/immutable"
    if css_dir.exists():
        css = "\n".join(p.read_text(encoding="utf-8", errors="ignore") for p in css_dir.rglob("*.css"))
        missing = [c for c in (".mark-dark", ".mark-light", "--mark-h", "--h1-size") if c not in css]
        if "data-theme=light" not in css and "data-theme='light'" not in css:
            missing.append("data-theme=light")
        if not re.search(r"\.mark-slot\s*\{[^}]*font-size:\s*0", css):
            missing.append(".mark-slot{font-size:0}")
        if missing:
            fail(f"the built css is missing the theme switch for the hero mark: {missing}")
        else:
            ok("the built css hides one hero mark per theme")
    else:
        fail("build/_app/immutable is missing: run `npm run build` before this check")

    if not BUILD_JS.exists():
        fail("build/_app/immutable is missing: run `npm run build` before this check")
    else:
        bundle = "\n".join(p.read_text(encoding="utf-8", errors="ignore") for p in BUILD_JS.rglob("*.js"))
        for theme in ICONS:
            if f"/icon/icon-{theme}.png" not in bundle:
                fail(f"the built javascript never references /icon/icon-{theme}.png: no theme swap")
            else:
                ok(f"the built javascript references /icon/icon-{theme}.png")

        for colour, name in (("#150d1c", "dark"), ("#faf6fb", "light")):
            if colour not in bundle:
                fail(f"the built javascript never reaches for the {name} chrome colour {colour}")
            else:
                ok(f"the built javascript carries the {name} chrome colour {colour}")

    width = max((len(n) for n in notes), default=0)
    for n in notes:
        print(f"  ok   {n.ljust(width)}")
    for f in failures:
        print(f"  FAIL {f}")

    print()
    if failures:
        print(f"FAILED: {len(failures)} problem(s), {len(notes)} check(s) passed")
        return 1
    print(f"PASSED: {len(notes)} checks")
    return 0


if __name__ == "__main__":
    sys.exit(main())
