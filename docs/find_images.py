#!/usr/bin/env python3
"""Search Wikimedia Commons for free-licence safari imagery.

Usage: python3 docs/find_images.py
Outputs docs/image_candidates.json with metadata + direct download URLs.
Filters: CC BY / CC BY-SA / CC0 / public domain, min 1600px wide.
"""
import json
import re
import sys
import time
import urllib.parse
import urllib.request

API = "https://commons.wikimedia.org/w/api.php"
UA = "AbsoluteAdventureSafaris-image-research/1.0 (contact: dev@absoluteadventuresafaris.com)"

QUERIES = {
    # Kenya – parks / destinations
    "tsavo-elephants": "Tsavo East National Park elephants",
    "tsavo-west-mzima": "Mzima Springs Tsavo West",
    "lake-naivasha-hippos": "Lake Naivasha hippos Kenya",
    "hellsgate-park": "Hells Gate National Park Kenya",
    "meru-national-park": "Meru National Park Kenya",
    "lake-turkana": "Lake Turkana Kenya desert",
    "lamu-island": "Lamu Island dhow Kenya",
    "shimba-hills": "Shimba Hills National Reserve",
    "diani-beach": "Diani Beach Kenya",
    "gedi-ruins": "Gedi ruins Malindi Kenya",
    "kisite-marine": "Kisite Mpunguti Marine Park",
    "nairobi-skyline": "Nairobi National Park skyline",
    "giraffe-centre": "Rothschild giraffe Kenya",
    "karen-blixen": "Karen Blixen Museum Nairobi",
    # Tanzania
    "serengeti-plains": "Serengeti National Park plains",
    "tarangire-baobab": "Tarangire National Park baobab",
    "lake-manyara": "Lake Manyara Tanzania",
    "kilimanjaro-summit": "Kilimanjaro summit Uhuru Peak",
    "stone-town-zanzibar": "Stone Town Zanzibar",
    "ngorongoro-rim": "Ngorongoro Conservation Area landscape",
    # Uganda
    "bwindi-gorilla": "Mountain gorilla Bwindi Uganda",
    "kibale-chimpanzee": "Chimpanzee Kibale Forest",
    "murchison-falls": "Murchison Falls Uganda",
    "queen-elizabeth-lions": "Tree climbing lions Queen Elizabeth Park Uganda",
    "lake-bunyonyi": "Lake Bunyonyi Uganda",
    "lake-mburo-zebras": "Lake Mburo National Park zebras",
    # Wildlife
    "leopard-sighting": "Leopard Masai Mara",
    "cheetah-masai-mara": "Cheetah Masai Mara Kenya",
    "black-rhino": "Black rhinoceros Kenya",
    "elephant-herd-amboseli": "Elephant herd Amboseli",
    "giraffe-savannah": "Masai giraffe savannah Kenya",
    "zebra-migration": "Zebra migration Serengeti",
    "hippo-river": "Hippopotamus Kenya river",
    # Culture / activity / stay
    "maasai-warriors": "Maasai warriors Kenya",
    "balloon-safari": "Hot air balloon Masai Mara",
    "game-drive-vehicle": "Safari game drive vehicle Africa",
    # Fallback lists
    "tented-camp": ["Tented safari camp Kenya", "Luxury tented camp safari",
                    "Safari tent camp Tanzania"],
    "lodge-pool": ["Safari lodge swimming pool Kenya", "Lodge swimming pool Africa",
                   "Hotel swimming pool Kenya"],
    "mount-kenya-climbers": ["Mount Kenya climbing Sirimon",
                             "Mount Kenya climbers glacier",
                             "Mount Kenya Point Lenana"],
    "samburu-warriors": "Samburu warriors Kenya",
    "swahili-dhow-sailing": ["Dhow sailing Kenya coast", "Dhow Zanzibar",
                             "Dhow Lamu harbour"],
}


OK_LIC = re.compile(r"\b(CC[ -]BY(?:-SA)?(?: \d\.\d)?|CC0|Public domain|PD)\b", re.I)


def api(params):
    params = dict(params, format="json", formatversion="2")
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def search(term, limit=14):
    if isinstance(term, list):
        merged, seen = [], set()
        for t in term:
            try:
                hits = search(t, limit=limit)
            except Exception as e:
                print(f"  ! search({t}): {e}", file=sys.stderr)
                hits = []
            for h in hits:
                if h["title"] in seen:
                    continue
                seen.add(h["title"])
                merged.append(h)
            if len(merged) >= 6:
                break
            time.sleep(0.3)
        return merged
    data = api({
        "action": "query",
        "generator": "search",
        "gsrsearch": f'filetype:bitmap {term}',
        "gsrnamespace": 6,
        "gsrlimit": limit,
        "prop": "imageinfo",
        "iiprop": "url|size|extmetadata",
        "iiurlwidth": 2000,
    })
    pages = (data.get("query") or {}).get("pages") or []
    out = []
    for p in pages:
        ii = (p.get("imageinfo") or [{}])[0]
        if not ii:
            continue
        meta = ii.get("extmetadata") or {}
        lic = (meta.get("LicenseShortName", {}) or {}).get("value", "")
        if not OK_LIC.search(lic or ""):
            continue
        w, h = ii.get("width", 0), ii.get("height", 0)
        if w < 1600 or h < 900:
            continue
        if w / max(h, 1) < 1.15:
            continue
        title = p.get("title", "").replace("File:", "")
        if re.search(r"\.(svg|gif|tif|tiff)$", title, re.I):
            continue
        author = re.sub(r"<[^>]+>", "", (meta.get("Artist", {}) or {}).get("value", "") or "")
        out.append({
            "title": title,
            "url": ii.get("thumburl") or ii.get("url"),
            "page": ii.get("descriptionurl"),
            "width": w,
            "height": h,
            "licence": lic,
            "licence_url": (meta.get("LicenseUrl", {}) or {}).get("value", ""),
            "author": author.strip()[:120],
        })
    return out


def main():
    results = {}
    for slug, term in QUERIES.items():
        try:
            hits = search(term)
        except Exception as e:
            print(f"  ! {slug}: {e}", file=sys.stderr)
            hits = []
        results[slug] = hits[:6]
        print(f"{slug:32s} {len(hits):2d} hits")
        time.sleep(0.4)

    with open("docs/image_candidates.json", "w") as f:
        json.dump(results, f, indent=1, ensure_ascii=False)
    total = sum(len(v) for v in results.values())
    print(f"\n{total} candidates → docs/image_candidates.json")


if __name__ == "__main__":
    main()
