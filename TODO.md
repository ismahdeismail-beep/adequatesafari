# Absolute Adventure Safaris - Modernization TODO

> **Repo:** `~/Desktop/Absoluteadventuresafari` (github.com/Absoluteadventuresafari)
> **Shared work dir:** `~/Desktop/absolute adventure safari` (other session's API dev)
> **Rule:** before any commit/push → open localhost for review + stay in sync with other session.

---

## 🐛 ERROR / FIX QUEUE  ← *user-reported (Oct 2026), do these first*

| # | Issue | Status | Fix plan |
|---|-------|--------|----------|
| E1 | **Joomla overrides don't show real photos** — `featured/default.php` + `article/default.php` never reference `images/cards/`; cards render grey `.aas-card__media-placeholder`, no `<picture>`/WebP anywhere in Joomla | ✅ DONE | `featured/default.php` + `article/default.php` now render `<picture>` (WebP 400/800 + JPG fallback) via `aasCardSlug()` alias→slug mapping with themed fallback; both `php -l` clean |
| E2 | **"Repetitions on Kenya resorts"** — Masai Mara / Lake Nakuru / Amboseli / Samburu cards appear both in home *Featured* (6) and *Kenya Lodge Safaris* listing (9); nav submenu duplicates page headings | ⬜ TODO | Differentiate the two surfaces once real content is migrated: Featured = destination highlights (Kenya + Tanzania/Uganda/Zanzibar mix); Listing = full catalog w/ pagination. Keep unique titles/prices/parks per card; no identical card twice on the same page |
| E3 | **listing.html / safari.html lack the nav + mobile accordion** that index.html has (bare header, no dropdowns, no mobile menu) | ⬜ TODO | Mirror the nav block (desktop dropdowns + `aas-mobile-nav` accordion) into both preview pages; Joomla already renders menu via `mod_menu` override |
| E4 | **Commit pending** — everything still uncommitted on `main`; `origin` remote config was lost (refs `origin/main` exist but no `[remote "origin"]` in `.git/config`) | ⬜ TODO | `git remote add origin https://github.com/Absoluteadventuresafari.git`, review localhost, `git add -A && git commit` on `main` (child of `5336f60`), push fast-forward |
| E5 | Contact details (phones/emails) stripped from all files — re-add via template params later | ✅ DONE | Params (`phoneKenya`, `phoneWhatsapp`, `emailGeneral`, `emailBookings`, `address`) exist in `templateDetails.xml` + rendered conditionally in footer; fixed missing WhatsApp guard in `index.php` (rendered empty link before) |
| E6 | **Unknown subject for "some lack pictures"** — all 11 card slugs have WebP+JPG sets (67 files, verified 200 via preview), but cards *not yet migrated into Joomla content* will show fallbacks until E1 lands | ✅ DONE | E1 fixes the fallback path; content migration fills real associations |

---

## ✅ COMPLETED (verified)

### Foundation / Infrastructure
- [x] Project structure + git repo
- [x] `README.md` — architecture, migration strategy, commands
- [x] `docker/docker-compose.yml` — Joomla 5, MariaDB, Redis, Nginx, API, 3× Next.js
- [x] `docker/Dockerfile.joomla` — PHP 8.3 + Apache + extensions + opcache
- [x] `docker/Dockerfile.api` — NestJS multi-stage
- [x] `docker/Dockerfile.nextjs` — Next.js standalone
- [x] `docker/nginx/nginx.conf` + `conf.d/default.conf` — upstreams, SSL, HSTS, rate limits
- [x] `.env.example` — all env vars (DB, JWT, Stripe, M-Pesa, SMTP, S3, analytics)
- [x] `docs/data-model.md` — 8 entities, SQL, JSONB structures
- [x] `docs/api-spec.md` — full REST spec, auth, webhooks, SDK
- [x] `docs/export_joomla.py` — live Joomla content exporter
- [x] `docs/current-site-analysis.md`, `docs/visual-sitemap.md`

### Joomla 5 template (built, `php -l` clean)
- [x] `templateDetails.xml` — manifest, positions, params (colors, API URLs, features, social, contact)
- [x] `index.php` — API-first shell (header, hero module, footer, cookie consent)
- [x] `component.php`, `error.php`, `offline.php`
- [x] `css/template.css` — responsive + design tokens (color/space/radius/elevation/**motion**)
- [x] `js/template.js` — nav toggle, search drawer, cookie consent, micro-app hand-off, **mobile accordion (js-ready progressive enhancement)**
- [x] `html/mod_menu/default.php` — **recursive multi-level menu**, `has-children` fixed, ARIA toggles
- [x] `html/com_content/article/default.php` — safari detail (hero `has-image`, fields: duration/group/pricing, booking CTA)
- [x] `html/com_content/featured/default.php` — listing grid (cards, pagination, book/view CTA)
- [x] Language `en-GB` + `scss/` tokens (motion tokens mirrored)
- [x] Plugin `plg_system_jwt` — JWT bridge for micro-app SSO
- [x] Plugin `plg_content_api_sync` — push content changes to API
- [x] Module `mod_safari_search` — search form for micro-apps (php/tmpl/xml/language)
- [x] Module `mod_aas_hero` — hero carousel with controlled motion (php/tmpl/css/js/language)
- [x] `setup/safari-fields.xml` + `install.sh`

### Hero + cards imagery (built, preview verified 200)
- [x] Client hero slides → `images/hero/` (WebP 1300/960/640 + JPG fallback)
- [x] Ken Burns zoom/pan on active frame (8s), crossfade, staggered captions
- [x] Pause on hover/focus/hidden-tab; swipe; keyboard arrows; `prefers-reduced-motion`
- [x] **11 CC-licensed destination photos** → `images/cards/` (WebP 400/800/1280 + JPG, 4:3 cards & 2:1 banners; 67 files)
- [x] `images/cards/CREDITS.md` + preview `/credits.html` (attribution)
- [x] Preview pages wired with real photos: **index (6 cards)**, **listing (9 cards)**, **safari hero banner**
- [x] Animated nav dropdowns — fade+lift+micro-scale, staggered items, 2nd-level flyout, `Esc` close, `:focus-within` parity
- [x] Card hover lift + photo zoom (token-driven)
- [x] `docs/micro-interactions.md` — interaction spec (durations/easings/choreography)

### API — scaffold (synced from other session)
- [x] `api/package.json` — NestJS deps (Prisma, Stripe, JWT, Swagger, Throttler)
- [x] `api/prisma/schema.prisma` — full schema (Users, Agents, Safaris, Parks,
      Accommodations, RoomTypes, Bookings, Payments, ItinerarySessions,
      Webhooks, SyncLogs, enums)
- [x] `api/src/main.ts` — bootstrap (Swagger, Helmet, Throttler, CORS)
- [x] `api/src/app.module.ts`
- [x] `api/src/config/configuration.ts`, `config/validation.ts`
- [x] `api/src/common/filters/http-exception.filter.ts`
- [x] `api/src/common/interceptors/logging.interceptor.ts`, `transform.interceptor.ts`
- [x] `api/src/prisma/prisma.module.ts`, `prisma.service.ts`
- [x] `api/tsconfig.json` + `tsconfig.build.json` + `nest-cli.json` — NestJS build config (was missing; unblocks `nest build`, `ts-node`, CI)
- [x] `api/prisma/seed.ts` — 9 sample safaris + weekly departures, admin/agent/customer users (idempotent upserts)
- [x] `.github/workflows/ci.yml` — PHP lint + JS syntax + API install / prisma validate & generate / build / eslint
- [x] Template language packs — `de-DE`, `fr-FR`, `es-ES`, `zh-CN` (`*.tpl_absolute.ini` + `.sys.ini`, key-parity with en-GB verified)
- [x] Footer contact params wired (E5) — `phoneKenya`, `phoneWhatsapp`, `emailGeneral`, `emailBookings`, `address`; WhatsApp link guarded

---

## 🔄 IN PROGRESS

### Fix queue (E1→E6 above)
- [x] E1: `<picture>` WebP wiring in `featured/default.php` (+ themed fallback), verify hero uses card 1280 banner
- [x] E3: nav + mobile menu on `listing.html` / `safari.html`
- [x] E4: restore `origin` remote, `git add -A`, commit on `main` (rule: localhost open first)
- [x] E5: contact params re-add (+ WhatsApp guard fix)
- [ ] E2: de-duplicate Kenya cards on final content migration

### Joomla 5 remaining
- [ ] FaLang/Joomfish — 5 languages (en, de, fr, zh, es)  ← *template-level INI packs done; content translation + FaLang setup remain*
- [ ] Akeeba Backup + Admin Tools hardening
- [ ] Joomla content migration → real articles w/ images (see Content Migration)

### API — modules (delivered on `main` by other session — synced ✓)
- [x] `api/src/modules/auth/` — JWT, register, login, refresh, password reset
- [x] `api/src/modules/users/` — profiles, preferences, loyalty
- [x] `api/src/modules/safaris/` — catalog, availability, search, filters
- [x] `api/src/modules/bookings/` — CRUD, hold inventory, pricing, vouchers
- [x] `api/src/modules/payments/` — Stripe + M-Pesa, webhooks
- [x] `api/src/modules/agents/` — auth, bookings, commissions
- [x] `api/src/modules/sync/` — Joomla webhook receivers
- [x] `api/src/modules/webhooks/` + `health/`
- [ ] `api/src/modules/itinerary/` — sessions, pricing, PDF, convert
- [x] `api/prisma/seed.ts` — parks, tiers, sample safaris, test agent

---

## ⏳ PENDING

### 1. Booking Micro-app (`micro-apps/booking/`)
- [ ] Scaffold Next.js (TS, Tailwind, App Router, src-dir)
- [ ] Shared UI (shadcn/ui)
- [ ] Safari search & filter (SSR)
- [ ] Safari detail + availability calendar
- [ ] Booking flow → payment → confirmation
- [ ] Stripe Checkout + M-Pesa STK Push
- [ ] Guest + authenticated booking
- [ ] Voucher PDF
- [ ] Email/SMS/WhatsApp confirmations
- [ ] i18n (next-intl, 5 langs)
- [ ] SEO: structured data, sitemap, meta

### 2. Itinerary Builder (`micro-apps/itinerary-builder/`)
- [ ] Drag-drop day planner (@dnd-kit)
- [ ] Park/accommodation selector + live pricing
- [ ] Preferences panel
- [ ] Real-time pricing (API)
- [ ] PDF export (pdfmake)
- [ ] "Book this itinerary" handoff
- [ ] Save/resume + shareable links
- [ ] Mobile-responsive

### 3. Agent Portal (`micro-apps/agent-portal/`)
- [ ] Agent login (JWT + refresh)
- [ ] Dashboard: bookings, commissions, clients
- [ ] Booking management for clients
- [ ] Commission reports (CSV/PDF export)
- [ ] Client CRM
- [ ] White-label settings
- [ ] API key management
- [ ] Notifications

### Deployment & Ops
- [ ] `.github/workflows/ci.yml` — lint, test, type-check
- [ ] `deploy-api.yml`, `deploy-apps.yml`, `deploy-joomla.yml`, `sync-content.yml`
- [ ] VPS (Ubuntu 22.04, Docker, Nginx, Certbot)
- [ ] DNS: `www`, `api`, `book`, `plan`, `agents`, `cdn`
- [ ] SSL (Let's Encrypt + auto-renew)
- [ ] DB backups (daily + PITR)
- [ ] Monitoring (UptimeRobot, Sentry, Logtail)
- [ ] CDN (CloudFront/Cloudflare)
- [ ] Email (SendGrid/Postmark)
- [ ] Analytics (GA4 + GTM + Pixel)

### Content Migration
- [ ] Run `export_joomla.py` on live site
- [ ] Transform JSON → new data model
- [ ] Import to Joomla 5 via CLI
- [ ] Sync to API DB (prisma migrate + seed)
- [ ] Verify safaris/parks/accommodations/images (resolve E2 duplication here)
- [ ] 301 redirects for old URLs
- [ ] Test multi-language content

### Launch Checklist
- [ ] E2E booking flow (guest + agent)
- [ ] M-Pesa sandbox → production
- [ ] Stripe test → live
- [ ] Load test (k6): 100 concurrent bookings
- [ ] Security audit (OWASP, headers, rate limits)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Core Web Vitals (LCP < 2.5s, CLS < 100ms)
- [ ] GDPR/Privacy policy + cookie consent
- [ ] TOS + booking conditions
- [ ] Staff training
- [ ] Go-live + rollback plan

---

## Time Estimates (AI-Accelerated)

| Phase | Est. |
|-------|------|
| Foundation | ✅ Done |
| Fix queue E1–E6 | ~20 min |
| API Core (modules + Prisma + tests) | ~60 min |
| Joomla 5 (template, fields, plugins, i18n) | ~45 min |
| Booking App | ~90 min |
| Itinerary Builder | ~90 min |
| Agent Portal | ~90 min |
| Deployment (CI/CD, VPS, DNS, SSL) | ~30 min |
| Content Migration | ~30 min |
| **Total** | **~8 hours** |

---

## Quick Commands

```bash
# Local stack
docker compose -f docker/docker-compose.yml up -d

# API dev
cd api && npm run start:dev

# Micro-apps dev
cd micro-apps/booking && npm run dev           # :3001
cd micro-apps/itinerary-builder && npm run dev  # :3002
cd micro-apps/agent-portal && npm run dev       # :3003

# Prisma
cd api && npx prisma generate && npx prisma migrate dev && npx prisma db seed

# Export live Joomla content
ssh user@server "cd /path/to/export && python3 export_joomla.py"

# Preview after fixes
cd ~/Desktop/Absoluteadventuresafari && python3 preview/serve.py 8080   # http://localhost:8080/
```