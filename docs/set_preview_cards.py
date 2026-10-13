#!/usr/bin/env python3
"""Rewire the preview card grids so index and listing never repeat a photo.

Fix E2: index (6 cards) and listing (9 cards) have ZERO overlap.

Usage: python3 docs/set_preview_cards.py
"""
import os
import re
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PREVIEW = os.path.join(REPO, "preview")
CARDS = os.path.join(REPO, "joomla-site", "templates", "absolute", "images", "cards")
CARD_URL = "/templates/adequate/images/cards"

SIZES = "(min-width: 992px) 33vw, (min-width: 640px) 50vw, 100vw"

# === E2 FIX: index gets 6 distinct cards, listing gets 9 OTHER cards ===
# No stem appears on both pages.
PAGES = {
    "index.html": [
        # Kenyan highlights + new distinct subjects
        ("maasai-mara-wildebeest", "Great Migration Special",
         "Time your visit for the river crossings (July–October), when over a "
         "million wildebeest and zebra thunder across the Mara."),
        ("mount-kenya", "Mount Kenya – Sirimon Route",
         "A five-day trek to Point Lenana (4,985 m) on Africa's second-highest "
         "mountain, with acclimatisation days and mountain huts."),
        ("tented-camp", "Tented-Camp Safari",
         "3 days / 2 nights · Mid-range · From $350"),
        ("lodge-pool", "Lodge & Tented-Camp Collection",
         "Varies · Mid-range to luxury · From $120/night"),
        ("bwindi-gorilla", "Bwindi Gorilla Trekking",
         "Trek mountain gorillas in Uganda's Bwindi Impenetrable Forest — a "
         "once-in-a-lifetime hour with a habituated family."),
        ("leopard-sighting", "Leopard Photographic Safari",
         "A small-group photographic safari timed for golden light, with "
         "dedicated vehicles and room for your kit in the Mara."),
    ],
    "listing.html": [
        # Original 11 stems minus the 6 used in index, plus 3 more
        ("aberdare-range", "Aberdares & Nyeri Safari",
         "3 days / 2 nights · Mid-range · From $390"),
        ("amboseli-kilimanjaro", "Amboseli & Kilimanjaro Safari",
         "3 days / 2 nights · Mid-range · From $420"),
        ("lake-nakuru-flamingos", "Lake Nakuru – Rhino Safari",
         "3 days / 2 nights · Mid-range · From $380"),
        ("masai-mara-lion", "Masai Mara – Big Game Safari",
         "3 days / 2 nights · Mid-range · From $450"),
        ("rift-valley-bogoria", "Great Rift Valley Lakes",
         "2 days / 1 night · Mid-range · From $260"),
        ("samburu-gerenuk", "Samburu – The Gerenuk Safari",
         "3 days / 2 nights · Mid-range · From $460"),
        ("mount-kenya-climbers", "Mount Kenya – Climbing Route",
         "5-day trek to Point Lenana with acclimatisation days."),
        ("tanzania-ngorongoro", "Ngorongoro Crater & Tarangire",
         "Descend into the Ngorongoro Crater and explore Tarangire's baobab "
         "country on this four-day Tanzania lodge safari."),
        ("zanzibar-beach", "Zanzibar Beach Escape",
         "Round off your safari with white-sand beaches, spice farms and Stone "
         "Town history on Tanzania's island paradise."),
    ],
}

CARD = """\
{pad}<article class="adq-card adq-card--safari">
{pad}    <a class="adq-card__media" href="/safari.html"><picture>
{pad}        <source type="image/webp" srcset="{u}/{s}-400.webp 400w, {u}/{s}-800.webp 800w" sizes="{sizes}" />
{pad}        <img src="{u}/{s}-800.jpg" srcset="{u}/{s}-400.jpg 400w, {u}/{s}-800.jpg 800w" sizes="{sizes}" alt="{alt}" loading="lazy" decoding="async" />
{pad}    </picture></a>
{pad}    <div class="adq-card__body">
{pad}        <h2 class="adq-card__title"><a href="/safari.html">{title}</a></h2>
{pad}        <p class="adq-card__excerpt">{excerpt}</p>
{pad}        <div class="adq-card__footer">
{pad}            <a class="adq-btn adq-btn--primary adq-btn--sm" href="#">Book Now</a>
{pad}            <a class="adq-btn adq-btn--ghost adq-btn--sm" href="/safari.html">View details</a>
{pad}        </div>
{pad}    </div>
{pad}</article>"""


def render(cards, pad):
    chunks = []
    for stem, title, excerpt in cards:
        alt = re.sub(r"&", "&", title)
        chunks.append(CARD.format(
            pad=pad, u=CARD_URL, s=stem, sizes=SIZES, alt=alt,
            title=title, excerpt=excerpt,
        ))
    return "\n".join(chunks)


def main():
    # Validate all stems have the required files
    failures = 0
    for page, cards in PAGES.items():
        for stem, _, _ in cards:
            for ext in ("400.webp", "800.webp", "800.jpg"):
                p = os.path.join(CARDS, f"{stem}-{ext}")
                if not os.path.exists(p):
                    print(f"  MISSING {stem}-{ext} (needed by {page})")
                    failures += 1

    for page, cards in PAGES.items():
        path = os.path.join(PREVIEW, page)
        html = open(path, encoding="utf-8").read()
        ARTICLE_RE = re.compile(
            r'[ \t]*<article class="adq-card adq-card--safari".*?</article>',
            re.S,
        )
        matches = list(ARTICLE_RE.finditer(html))
        if not matches:
            print(f"  FAIL {page}: no card articles found")
            failures += 1
            continue
        pad = re.match(r"[ \t]*", matches[0].group(0)).group(0)
        start, end = matches[0].start(), matches[-1].end()
        new = render(cards, pad)
        html = html[:start] + new + html[end:]
        open(path, "w", encoding="utf-8").write(html)
        n_removed = len(matches)
        print(f"  {page}: {n_removed} → {len(cards)} cards rewritten")

    if failures:
        print(f"\n{failures} problem(s) — not committing")
        return 1
    print("\npreview card grids updated (E2: zero overlap)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
