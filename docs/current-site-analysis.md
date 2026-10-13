# Current Site Analysis: adequatesafaris.com

*Analysis date: 2026-10-12*

---

## 🌳 Site Map / Information Architecture (Braintree)

```
adequatesafaris.com
│
├── 🏠 Home (SP PageBuilder landing)
│   ├── Hero Slider (5 slides with CTAs)
│   ├── Top Travel Inspirations (11 category cards)
│   ├── Featured Accommodation (3 property cards)
│   ├── Testimonials Carousel (4 reviews)
│   ├── Latest Safaris (3 recent posts)
│   └── Booking Inquiry Form (inline)
│
├── 📖 About Us
│
├── 🏨 Accommodation (featured articles listing)
│
├── 🚗 Our Cabs → absolutecabs.co.ke (external)
│
├── 📝 Book a Safari (BreezingForms form)
│
├── 📞 Contact Us
│
├── 🦁 Kenya Lodge Safaris (by duration)
│   ├── 2 Days (4 tours)
│   ├── 3 Days (8 tours)
│   ├── 4 Days (3 tours)
│   ├── 5 Days (2 tours)
│   ├── 6 Days (1 tour)
│   ├── 7 Days (2 tours)
│   ├── 8 Days (1 tour)
│   ├── 9 Days (1 tour)
│   └── 14 Days (1 tour)
│
├── 🏕️ Kenya Camping Safaris (7 tours)
│
├── ✈️ Kenya Flying Safaris
│   ├── Fly to Lamu Island (5 hotels)
│   ├── Fly to Masai Mara (9 camps/lodges)
│   ├── Wings over Kenya (1 tour)
│   ├── Fly to Samburu (3 camps)
│   ├── Fly to Amboseli (3 lodges)
│   └── Fly to Tsavo West (1 camp)
│
├── ⛰️ Mt Kenya Climb (6 routes)
│
├── 🚶 Short Excursions
│   ├── Nairobi (4 excursions)
│   └── Mombasa (9 excursions)
│
├── 🇹🇿 Tanzania Safaris
│   ├── Tanzania Lodge Safaris (8 tours)
│   ├── Tanzania Camping Safaris (1 tour)
│   └── Kilimanjaro Climb (6 routes)
│
└── 🇺🇬 Uganda Safaris
    ├── 2 Days (1 tour)
    ├── 3 Days (3 tours)
    ├── 4 Days (1 tour)
    ├── 5 Days (2 tours)
    └── 7 Days (1 tour)
```

---

## 📐 Page Layout Analysis

### **Global Layout Structure**

| Region | Description |
|--------|-------------|
| **Header** | Logo (left), Main Navigation (mega-menu style), Mobile hamburger |
| **Hero** | Unite Revolution Slider 2 (5 slides, dummy images, "Book Now" CTAs) |
| **Main Content** | SP PageBuilder sections + Joomla article/content modules |
| **Sidebar** | Right column: Booking form, Latest Safaris, Contact info |
| **Footer** | Copyright, "Designed by SmartAddons", Back-to-top link |

### **Key Page Templates**

| Template | Used By | Layout Pattern |
|----------|---------|----------------|
| **SP PageBuilder Home** | `/` | Full-width sections: Slider → Inspiration Grid → Accommodation Cards → Testimonials → Booking Form |
| **Category Blog/Featured** | Safari categories, Accommodation | Article grid with thumbnails, "Read More" links |
| **Article View** | Individual safari pages | Image + Description + Details (Duration, Locations, Type) + Social share (Tweet) |
| **BreezingForms** | Book a Safari, Contact | Multi-field form (Name, Phone, Email, Date, Instructions, Captcha) |
| **External Link** | Our Cabs | Redirects to `absolutecabs.co.ke` |

### **Navigation Patterns**
- **Mega-menu dropdown** for safari categories (3+ levels deep)
- **Duplicate menu** in mobile off-canvas + footer area
- **Breadcrumbs** absent (Joomla default not enabled)

### **Content Modules (Joomla/SP PageBuilder)**

| Module | Position | Content |
|--------|----------|---------|
| `mod_news_show_sp2` | Sidebar/Content | Featured safaris with thumbnails |
| `mod_breezingforms` | Sidebar | Booking inquiry form |
| `mod_custom` | Footer | Contact info, Copyright |
| Unite Revolution Slider | Hero | 5 slides, all using dummy placeholder images |

---

## ⚠️ Observations & Issues

1. **Broken/Dummy Images** — All slider images point to `dummy.png` placeholders
2. **Duplicate Menu** — Full mega-menu rendered twice in HTML (desktop + mobile)
3. **Joomla 3/4 Legacy** — Uses `com_content`, `com_breezingforms`, `com_sppagebuilder`, `com_uniterevolution2`
4. **No SSL enforcement visible** — Forms post to HTTP endpoints
5. **SEO URLs disabled** — All URLs use `index.php?option=...&Itemid=...` format
6. **External dependency** — "Our Cabs" links to separate domain
7. **Mobile UX** — Mega-menu collapses but duplicates entire tree in off-canvas

---

## 🎯 Recommended IA Improvements

| Priority | Change |
|----------|--------|
| **High** | Enable SEF URLs + URL rewriting (remove `index.php?`) |
| **High** | Replace dummy slider images with real safari photography |
| **Medium** | Consolidate duplicate menu render |
| **Medium** | Add breadcrumbs on article/category pages |
| **Medium** | Group "Top Travel Inspirations" into logical regions (Kenya/Tanzania/Uganda/Activities) |
| **Low** | Add search/filter for safaris (by duration, price, destination) |
| **Low** | Implement schema.org markup for tours (Product/Event) |

---

## 🔗 Content Inventory Summary

| Content Type | Count | Notes |
|--------------|-------|-------|
| Kenya Lodge Safaris | 22 tours | Organized by duration (2-14 days) |
| Kenya Camping Safaris | 7 tours | |
| Kenya Flying Safaris | 21 lodges/camps | Grouped by destination |
| Mt Kenya Climb | 6 routes | |
| Short Excursions | 13 excursions | Nairobi (4) + Mombasa (9) |
| Tanzania Safaris | 15 tours | Lodge (8) + Camping (1) + Kilimanjaro (6) |
| Uganda Safaris | 8 tours | |
| Accommodation articles | ~30+ | Individual lodge/camp pages |
| **Total safari products** | **~92** | Across 3 countries |

---

## 🛠 Tech Stack (Current)

| Layer | Technology |
|-------|------------|
| CMS | Joomla (3.x/4.x legacy) |
| Page Builder | SP PageBuilder |
| Slider | Unite Revolution Slider 2 |
| Forms | BreezingForms |
| News/Listing | `mod_news_show_sp2` (SmartAddons) |
| Template | SmartAddons template (customized) |
| Hosting | Standard LAMP (implied) |

---

## 📋 Migration Considerations for New Platform

### Content to Preserve
- All 92+ safari tour pages with descriptions, durations, locations
- Accommodation database (30+ lodges/camps with details)
- Testimonials (4+ reviews)
- Contact information (multiple phone numbers, email)
- Pricing/itinerary details embedded in articles

### Content to Restructure
- **Flat article structure** → Structured custom content types (Safari, Accommodation, Excursion)
- **Duration-based categories** → Faceted taxonomy (Country × Duration × Style × Price)
- **Inline HTML descriptions** → Structured fields (itinerary days, inclusions, exclusions, highlights)
- **Dummy images** → Real photography + WebP optimization

### URL Migration Map (Priority)
```
/index.php?option=com_content&view=article&id=XX&Itemid=YY
  → /kenya/lodge-safaris/3-days/masai-mara-big-game
  → /tanzania/lodge-safaris/7-days/serengeti-ngorongoro
  → /uganda/gorilla-tracking/bwindi-3-days
  → /kenya/flying-safaris/masai-mara/governors-camp
  → /excursions/nairobi/national-park
  → /climbing/mt-kenya/sirimon-5-days
```

---

## 📎 Raw Data Reference

- **Homepage fetch**: `webfetch` of `https://www.adequatesafaris.com/` (markdown)
- **Menu structure**: Extracted from `<nav>` and mobile off-canvas duplicate
- **Module positions**: Inferred from HTML structure and Joomla module class names
- **Form fields**: Observed from BreezingForms rendering on homepage sidebar