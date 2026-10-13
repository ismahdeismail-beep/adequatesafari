#!/usr/bin/env python3
"""
Generate Adequate Safaris brand assets (images/ + booking app icons/OG).
Run from repo root:  python3 docs/make_brand_assets.py
Outputs:
  images/social/og-cover.jpg       1200x630  (hero photo + wordmark)
  images/social/og-cover-alt.jpg   1200x630  (brand graphic)
  images/brand/icon-512.png        (green tile, gold "A")
  images/brand/icon-192.png
  images/brand/apple-touch-icon.png (180)
  images/brand/icon-32.png / icon-16.png
  images/brand/favicon.ico         (multi-size)
Also copies icons + og-cover into micro-apps/booking/app (Next auto-discovery)
and updates joomla-site/templates/adequate/favicon.ico.
"""
import os
import shutil
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(REPO)

SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
HERO = "joomla-site/templates/adequate/images/hero/slider1.jpg"

GREEN = "#1a5f3a"
DARK = "#0d2d1a"
GOLD = "#d9c27a"

BRAND = os.path.join("images", "brand")
SOCIAL = os.path.join("images", "social")
os.makedirs(BRAND, exist_ok=True)
os.makedirs(SOCIAL, exist_ok=True)


def run(cmd):
    print("  $ " + " ".join(str(c) for c in cmd))
    subprocess.run([str(c) for c in cmd], check=True)


def og_cover(src, out):
    run(["magick", src, "-resize", "1200x630^", "-gravity", "center", "-extent", "1200x630",
         "-fill", DARK, "-colorize", "58%",
         "-gravity", "west",
         "-font", SERIF, "-pointsize", "64", "-fill", "white", "-annotate", "+96+235", "Adequate Safaris",
         "-font", SANS, "-pointsize", "22", "-fill", GOLD, "-annotate", "+98+295", "KENYA  \u00b7  TANZANIA  \u00b7  UGANDA",
         "-stroke", GOLD, "-strokewidth", "3", "-draw", "line 96,180 320,180", out])


def og_alt(out):
    run(["magick", "-size", "1200x630", "xc:" + DARK,
         "-fill", GREEN, "-draw", "circle 600,240 600,120",
         "-fill", GOLD, "-font", SERIF, "-pointsize", "150", "-gravity", "center", "-annotate", "+0-60", "A",
         "-fill", "white", "-font", SERIF, "-pointsize", "52", "-annotate", "+0+140", "Adequate Safaris",
         "-fill", GOLD, "-font", SANS, "-pointsize", "20", "-annotate", "+0+200", "K E N Y A    \u00b7    T A N Z A N I A    \u00b7    U G A N D A",
         out])


def icon(size, out, radius):
    rs = int(size * radius)
    fs = int(size * 0.62)
    run(["magick", "-size", f"{size}x{size}", "xc:none",
         "-fill", GREEN, "-draw", f"roundrectangle 0,0,{size-1},{size-1},{rs},{rs}",
         "-fill", GOLD, "-font", SERIF, "-pointsize", str(fs), "-gravity", "center", "-annotate", "+0+%d" % int(size * 0.04), "A",
         out])


def main():
    print("[1/4] social OG covers")
    og_cover(HERO, os.path.join(SOCIAL, "og-cover.jpg"))
    og_alt(os.path.join(SOCIAL, "og-cover-alt.jpg"))

    print("[2/4] icons")
    icon(512, os.path.join(BRAND, "icon-512.png"), 0.20)
    icon(192, os.path.join(BRAND, "icon-192.png"), 0.20)
    icon(180, os.path.join(BRAND, "apple-touch-icon.png"), 0.22)
    icon(32, os.path.join(BRAND, "icon-32.png"), 0.24)
    icon(16, os.path.join(BRAND, "icon-16.png"), 0.25)

    print("[3/4] favicon.ico (multi-size)")
    run(["magick", os.path.join(BRAND, "icon-16.png"), os.path.join(BRAND, "icon-32.png"),
         os.path.join(BRAND, "icon-192.png"), os.path.join(BRAND, "favicon.ico")])

    print("[4/4] wiring copies")
    # Joomla template favicon
    shutil.copy(os.path.join(BRAND, "favicon.ico"), "joomla-site/templates/adequate/favicon.ico")
    # Next.js App Router auto-discovery: app/favicon.ico, app/icon.png, app/apple-icon.png
    appdir = os.path.join("micro-apps", "booking", "app")
    os.makedirs(appdir, exist_ok=True)
    shutil.copy(os.path.join(BRAND, "favicon.ico"), os.path.join(appdir, "favicon.ico"))
    shutil.copy(os.path.join(BRAND, "icon-192.png"), os.path.join(appdir, "icon.png"))
    shutil.copy(os.path.join(BRAND, "apple-touch-icon.png"), os.path.join(appdir, "apple-icon.png"))
    # OG image for booking metadata
    pub = os.path.join("micro-apps", "booking", "public")
    os.makedirs(pub, exist_ok=True)
    shutil.copy(os.path.join(SOCIAL, "og-cover.jpg"), os.path.join(pub, "og-cover.jpg"))
    print("done")


if __name__ == "__main__":
    sys.exit(main())