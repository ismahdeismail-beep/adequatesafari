# Live-site catalogue recon — adequatesafari.com

Crawled from the WordPress sitemaps on **2026-10-13**.

- Source A: `https://adequatesafari.com/tour-sitemap.xml` → **124 tours**
- Source B: `https://adequatesafari.com/tour_category-sitemap.xml` → **49 categories**

This document is the reference for the repository's representative catalogue
(`api/prisma/seed.ts` + `micro-apps/booking/src/lib/sample-data.ts`). We are
**not** mirroring all 124 tours; we seed one curated entry per missing service
category (≈20 tours) with real itineraries, evergreen titles and
always-ahead departure dates.

---

## Sitemap facts

- **124 tour pages**, all under `/tour/<slug>/`.
- Tour slugs are populated with **dated, seasonal editions** (e.g. `mapema-ndio-best-christmas-in-dubai-2026-dep-1`, `2026-usa-world-cup-experience`, `april-school-holiday-break-in-dubai-2026`). These go stale between seasons.
- **49 categories** covering duration bands (1–4 / 5–8 / 9–20 days), price bands (budget / mid-range / luxury / residents / non-residents), themes (valentine, romantic, honeymoon, engagement, birthday, babymoon, Christmas, Easter, school holiday), format (group-joining, corporate, departures, cruise/water, road-trips, adventure, cultural, religious, sports-event) and destinations (Kenya, Tanzania, Uganda, international).

---

## Category taxonomy (49)

```
1-4-days                 1-4-days-tanzania-safaris      3-days-masai-mara-deals
5-8-days                 5-8-days-tanzania-safaris      9-20-days
adequate-specials        adventure-tours                babymoon-gateways
birthday-gateways        budget-safaris                 christmas-deals
city-sightseeing-tours   city-tours                     corporate-deals
cruise-water-tours       cultural-heritage-tours        departures
engagement-holidays      family-kid-friendly-tours      honeymoon-holiday
international            kenya-safaris                  kilifi-holiday-deals
local                    luxury-private-tours           luxury-safaris
malindi-holiday-deals    mara-christmas-deals           masai-mara-easter-group-joining
masai-mara-group-joining-deals                          mid-range
mombasa-flight-deals     mombasa-holiday-deals          mombasa-sgr-deals
nature-wildlife-tours    non-residents                  religious-spiritual-tours
residents                road-trips-overland-tours      romatic-gateaways
school-holiday-trips     sports-event-tours             tanzania-safaris
themed-holidays          uganda-safaris                 uganda-short-stay-safaris1-4-days
valentine-gateways       watamu-holiday-deals
```

---

## Tour list by service family

### 1. Kenya safaris — inland parks (~38 tours)
Flagships: `10-day-classic-kenya-safari-experience`, `14-days-kenya-tanzania-com`,
`5-days-kenya-big-5-safari`, `6-days-great-migration-safari`, `7-days-kenya-major-parks-safari`,
`8-days-great-kenya-safari-circuit`, `8-days-kenya-highlands-to-savannah-safari`,
plus Amboseli cluster (`3-days-amboseli-safari`, `4-days-amboseli-pure-adventure`,
`4-day-tsavo-east-amboseli-pure-safari`), Mara flying (`3-day-masai-mara-flying-safari`,
`5-days-masai-mara-pure-luxury-flying-safari`), Ol Pejeta–Nakuru–Mara
(`6-days-ol-pejeta-lake-nakuru-and-masai-mara-safari`), Christmas bush breaks
(`3-days-bush-christmas-holiday`, `3-days-christmas-bush-holiday`,
`3-days-christmas-eve-in-amboseli`).

**Repo status:** well covered (7 of the 10 seeded tours are Kenya parks).
No new inland Kenya park tour is needed; the gap is Kenya **coast** + **local staycations** (below).

### 2. Kenya coast deals (~21 tours)
Diani: `3-days-diani-deals`, `3-days-diani-sgr-deals`, `3-days-diani-flying-package`,
`5-days-diani-flying-deals`, `5-days-diani-sgr-deals`, `easter-holiday-in-diani`.
Mombasa: `3-days-mombasa-all-inclusive-deals`, `3-days-mombasa-package`,
`3-days-mombasa-flying-package`, `5-days-mombasa-sgr-deals`, `5-days-mombasa-flying`,
`easter-holiday-in-mombasa-2026`.
Watamu–Kilifi–Malindi: `3-days-watamu-kilifi-malindi-sgr`,
`3-days-watamu-malindi-kilifi-flight-deals`, `5-days-watamu-kilifi-malindi-sgr`,
`5-days-watamu-kilifi-malindi-flight`, `4-days-easter-holiday-in-watamukilifi-malindi`.
Coastal seasonal: `5-days-coast-christmas-flying-package-2026`, `5-days-family-christmas-in-coast`.

**Gap → seed:** `diani-beach-escape` (3 d) — representative coast entry, themed Christmas + Easter.

### 3. Local staycations & self-drive (~6 tours)
`2-days-nairobi-staycations-deals`, `2-days-kenya-great-lakes-staycation`,
`2-days-laikipia-nanyuki-self-drive-deals`, `2-days-lake-nakuru-self-drive`,
`2-days-l-elementaita-self-drive`, `2-days-mount-kenya-self-drive-deals`.

**Gap → seed:** `nairobi-staycation` (2 d), `great-lakes-staycation` (2 d).

### 4. Masai Mara group-joining / daily departures (~3 tours)
`3-days-masai-mara-group-joining-deals`, `3-days-masai-mara-easter-deals`,
category `masai-mara-easter-group-joining`.

**Gap → seed:** `masai-mara-group-joining` (3 d) — group departure + Easter theme.

### 5. Tanzania (~6 tours)
`3-day-budget-serengeti-safari-package`, `5-days-jewel-of-tanzania-mid-range`,
`7-days-best-of-tanzania-luxury-safari`, `8-days-lemosho-down-mweka-kilimanjaro-route`,
`14-days-kenya-tanzania-com` (+ Zanzibar below).

**Gap → seed:** `serengeti-classic-safari` (6 d), `kilimanjaro-lemosho-climb` (8 d).
Existing seed already covers Ngorongoro/Tarangire + Zanzibar.

### 6. Uganda (~1 tour + category)
`3-days-gorilla-trekking-safari` (categories `uganda-safaris`, `uganda-short-stay-safaris1-4-days`).

**Gap → seed:** `bwindi-gorilla-trekking` (3 d).

### 7. Zanzibar (~2 tours)
`5-days-tropical-escape-to-zanzibar`, `6-days-best-of-zanzibar-safari`.
**Repo status:** covered (`zanzibar-beach` seed + `zanzibar-beach-extension` in booking demo).

### 8. Islands — Indian Ocean & beyond (~4 tours)
Mauritius `5-days-4-nights-mauritius-escape` • Maldives `5-days-maldives-experience` •
Seychelles `5-days-enchanting-tropical-island-of-seychelles` • Bali
`5-days-4-nights-discover-the-magic-of-bali`, `5-days-tropical-vibes-in-bali`.

**Gap → seed:** `mauritius-island-escape` (5 d), `maldives-island-escape` (5 d),
`seychelles-island-escape` (5 d), `bali-island-escape` (5 d).

### 9. International — city & country tours (~28 tours)
- **Dubai / Abu Dhabi** (~15): `5-days-4-nights-dubai-excursion`, `7-days-dubai-abu-dhabi-combo`,
  `5-days-2025-winter-in-dubai`, school-holiday editions, Christmas editions.
- **Europe** (3): `7-days-ultimate-europe-tour`, `11-days-europe-epic-tour`,
  `8-days-ultimate-cruise-group-departure-europe`.
- **Turkey** (2): `timeless-10-days-turkey-experience`, `istanbul-cappadocia-antalya-8-days-7-nights`.
- **Thailand** (3): `5-days-thailand-pattaya-bangkok-escape`, `7-days-christmas-in-thailanddep-8`,
  `thailand-september-special-departure`.
- **Malaysia / Singapore** (6): `10-days-kuala-lumpur-singapore-cruise-getaway`,
  `kuala-lumpur-school-edutour-5-days-4-nights`, `summer-in-malaysia-2025`,
  `8-day-christmas-holiday-in-malaysia-and-singaporedep-9`, `christmas-combo-in-malaysia-dubaidep-8`,
  `malaysia-singapore-birthday-tour-with-simon-kabu`.
- **Cape Town / South Africa** (3): `5-days-family-vacation-in-cape-town`,
  `cape-town-family-vacation`, `6-days-christmas-in-capetowndep-9`.
- **Jordan / Israel** (3): `8-days-timeless-treasures-of-jordan`,
  `9-days-jordan-the-holy-land-pilgrimage`, `jordan-israel-8-days-7-nights`.
- **Egypt** (1): `9-days-nile-easter-holiday-experience`.
- **China Canton Fair** (2): `10-days-canton-fair-chinaphase-1-2`, `10-days-canton-fair-chinaphase-23`.
- **USA World Cup 2026** (1): `2026-usa-world-cup-experience`.

**Gap → seed:** one per family — `dubai-city-escape` (5 d), `europe-epic-tour` (7 d),
`turkey-istanbul-cappadocia` (8 d), `thailand-bangkok-pattaya` (5 d),
`kuala-lumpur-singapore` (8 d), `cape-town-family-vacation` (5 d),
`jordan-timeless-treasures` (8 d), `egypt-nile-cruise` (8 d).

### 10. Corporate deals (category only — no dedicated tour URL)
Category `corporate-deals` exists but has no `/tour/` entry in the sitemap.

**Gap → seed:** `corporate-team-retreat` (2 d) — Kenya lodge/camp team retreat.

### 11. Themed holidays (categories, no dedicated "always-on" tours)
```
valentine-gateways  romatic-gateaways  honeymoon-holiday
engagement-holidays birthday-gateways babymoon-gateways
christmas-deals     mara-christmas-deals  school-holiday-trips
```
Live implementation = seasonal **editions** of other tours (dated slugs). The
repository implements themes differently and better: **evergreen tour titles +
auto-rolling seasonal departure windows** (see `seed.ts` "always-ahead" engine) —
Christmas/New Year/Easter/Valentine/school-holiday departures are computed from
today each seed run and always land in the future, so content can never go stale.

---

## Seeded representative catalogue (21 new tours = 20 service entries + 1 seasonal flagship)

| # | Slug | Dest. | Days | Themes in seed |
|---|---|---|---|---|
| 1 | `diani-beach-escape` | Kenya coast | 3 | CHRISTMAS, EASTER |
| 2 | `serengeti-classic-safari` | Tanzania | 6 | — |
| 3 | `kilimanjaro-lemosho-climb` | Tanzania | 8 | — |
| 4 | `bwindi-gorilla-trekking` | Uganda | 3 | — |
| 5 | `nairobi-staycation` | Kenya (city) | 2 | SCHOOL_HOLIDAY |
| 6 | `great-lakes-staycation` | Kenya (Rift Valley) | 2 | — |
| 7 | `masai-mara-group-joining` | Kenya (Mara) | 3 | GROUP_DEPARTURE, EASTER |
| 8 | `mauritius-island-escape` | Mauritius | 5 | — |
| 9 | `maldives-island-escape` | Maldives | 5 | — |
| 10 | `seychelles-island-escape` | Seychelles | 5 | — |
| 11 | `bali-island-escape` | Bali / Indonesia | 5 | — |
| 12 | `dubai-city-escape` | Dubai / UAE | 5 | — |
| 13 | `europe-epic-tour` | Europe | 7 | — |
| 14 | `turkey-istanbul-cappadocia` | Turkey | 8 | — |
| 15 | `thailand-bangkok-pattaya` | Thailand | 5 | — |
| 16 | `kuala-lumpur-singapore` | Malaysia / Singapore | 8 | — |
| 17 | `cape-town-family-vacation` | South Africa | 5 | — |
| 18 | `jordan-timeless-treasures` | Jordan | 8 | — |
| 19 | `egypt-nile-cruise` | Egypt | 8 | — |
| 20 | `corporate-team-retreat` | Kenya | 2 | — |

Plus one explicit seasonal flagship: **`christmas-bush-holiday`** (Masai Mara, 3 d,
themes CHRISTMAS + NEW_YEAR) to showcase the rolling holiday windows.

> Example of the seasonal-date problem we avoid: `mapema-ndio-best-christmas-in-dubai-2026-dep-1`
> is permanently frozen on one past season. Our equivalent is `dubai-city-escape`
> with a Christmas-window departure that re-rolls every year.