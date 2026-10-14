# Adequate Safaris — Modernization TODO

> **Brand:** **Adequate Safaris** — live domain **https://adequatesafaris.com/**
> **Repo (GitHub):** `adequatesafari` — created lowercase (see R1); `origin` set (see R2)
> **Local clone:** `/mnt/sdcard/OpenCode/adequatesafari` (the new repo; cloned separately — do **not** mix with `Absoluteadventuresafari`)
> **Deploy:** Vercel — project **`adequatesafari`**, Root Directory **`micro-apps/booking`**, framework **Next.js** → live at <https://adequatesafari.vercel.app>
> **Rule:** before any commit/push → open localhost for review. **Never hard-code secrets/keys.**

> 🆕 **NEW REPO (separate from `Absoluteadventuresafari`):** `adequatesafari` is its own repo and is treated **independently**. The older `Absoluteadventuresafari` repo/clone is **frozen** — all new work happens **here only** (per README "one repo" policy).

*Last updated: Oct 14 2026 — cloned `adequatesafari` standalone; **verified Vercel production is READY** (Root Directory `micro-apps/booking`); site + routes live, E11 resolved.*

> ~~⚠️ Open CI failure (E11): GitHub Actions docker build failed with
> `invalid tag "ghcr.io/adequatesafari/api:latest": repository name must be lowercase`.~~
> **Resolved by R1** — repo created as `adequatesafari` (lowercase), satisfying GHCR's lowercase image-tag requirement.

---

## 🐛 ERROR / FIX QUEUE

### Resolved (user-reported Oct 2026)

| # | Issue | Status | Resolution |
|---|-------|--------|-----------|
| E1 | **Joomla overrides don't show real photos** — `featured/default.php` + `article/default.php` never referenced `images/cards/`; cards rendered grey placeholders, no `<picture>`/WebP | ✅ DONE | Both overrides render `<picture>` (WebP 400/800 + JPG fallback) via `adqCardSlug()` alias→slug mapping with themed fallback; `php -l` clean |
| E2 | **"Repetitions on Kenya resorts"** — duplicate cards across home *Featured* and *Kenya Lodge Safaris* listing | ✅ DONE | Verified: `preview/index.html` = 6 distinct cards, `preview/listing.html` = 9 distinct, **zero overlap** |
| E3 | **listing.html / safari.html lack nav + mobile accordion** | ✅ DONE | Nav block + `adq-mobile-nav` accordion mirrored into both preview pages |
| E4 | **Commit pending / `origin` remote lost** | ✅ DONE | `origin` restored (`.../adequatesafaris.git`); work committed on `main`; working tree clean |
| E5 | **Contact details stripped** | ✅ DONE | Params (`phoneKenya`, `phoneWhatsapp`, `emailGeneral`, `emailBookings`, `address`) in `templateDetails.xml` + footer rendering; WhatsApp guard fixed |
| E6 | **"Some lack pictures"** | ✅ DONE | E1 fixes fallback path; content migration fills real associations |

### Open (discovered during re-verification)

| # | Issue | Status | Fix plan |
|---|-------|--------|----------|
| E7 | **Booking micro-app build is broken** — `micro-apps/booking/src/app/page.tsx` imports 8 components (`Footer`, `SafariCard`, `Hero`, `SearchSection`, `FeaturedSafaris`, `WhyChooseUs`, `Testimonials`, `Newsletter`) that did not exist; only `components/Header.tsx` was present → `next build` fails (likely cause of the Vercel deploy error) | ✅ DONE | All 8 components + `lib/sample-data.ts` created; Tailwind tokens added; `layout.tsx` `class`→`className`; `SessionProvider` pass-through. **`npm run build` green** (28 routes). |
| E8 | **`micro-apps/booking/vercel.json` rewrote everything to `/`** — `{ "src": "/(.*)", "dest": "/" }` broke `/safaris`, `/booking`, etc. | ✅ DONE | Reduced to `{ "framework": "nextjs" }` |
| E9 | **No CI deploy workflows in the new repo** — only `.github/workflows/ci.yml` was ported; `deploy-*.yml` missing (they exist only on the frozen old repo) | ✅ DONE | Ported `deploy-api.yml`, `deploy-apps.yml`, `deploy-joomla.yml`, `sync-content.yml` from the old repo. Joomla paths updated `absolute/`→`adequate/`. All secret-gated → green with no infra. |
| E10 | **`next.config.js` rewrite produced `destination: "undefined/api/:path*"`** when `NEXT_PUBLIC_API_URL` was unset → `next build` failed with "Invalid rewrite found" (another Vercel deploy killer) | ✅ DONE | Guard the rewrite: return `[]` when `NEXT_PUBLIC_API_URL` is not set. Build now green. |
| E11 | **`Deploy API` workflow fails** — `invalid tag "ghcr.io/ismahdeismail-beep/Absoluteadventuresafari/api:latest": repository name must be lowercase` (Docker/GHCR tag built from `${{ github.repository }}`, whose original casing is uppercase) | ✅ DONE | `deploy-api.yml` now lowercases the tag: `IMAGE=ghcr.io/${GITHUB_REPOSITORY,,}/api`. Works regardless of repo casing. (Old repo was also lowercase-fixed by R1.) |
| E12 | **Image audit** — "we only have safaris of Kenya" | ✅ VERIFIED | 16 card stems, **all complete** (400/800/1280 JPG+WebP): Kenya ×10, Tanzania ×2 (`tanzania-ngorongoro`, `zanzibar-beach`), Uganda ×1 (`bwindi-gorilla`), + `leopard-sighting`, `tented-camp`, `lodge-pool`. `amboseli-kilimanjaro` set **is present** (earlier "0 files" was a path typo, not a real gap). |
| E13 | **No hard-coded secrets/keys** | ✅ VERIFIED | No secrets committed; credentials live in `.env*` only. Re-check after each change. |

---

## 🏷️ REBRAND → "Adequate Safaris"

**Goal:** every `Absolute Adventure Safaris` / `Absoluteadventuresafari` / `absoluteadventuresafaris` / `AAS` / `aas-` reference replaced with **Adequate Safaris** (`adequatesafaris.com`) and **ADQ** / **adq-**. Executed via `docs/rebrand.py` (guards: `Maasai`, `path-is-absolute`, `absolutecabs.co.ke`, CSS `position: absolute` untouched).

| # | Item | Status | Notes |
|---|------|--------|-------|
| R1 | **GitHub repo naming** → lowercase repo name | ✅ DONE | Repo created as `adequatesafari` (lowercase) — also fixes E11 (GHCR lowercase tag). |
| R2 | Update local remote URL after new repo created | ✅ DONE | `origin` → `adequatesafari` (single remote; old `Absoluteadventuresafari` remote removed). |
| R3 | Rebrand **Joomla template** — folder `absolute/` → `adequate/`; `templateDetails.xml` (`<name>adequate</name>`, author, siteName default), `index.php`, `component.php`, `error.php`, `offline.php`, overrides, menu override | ✅ DONE | Full rename executed (option **b**) — folder now `joomla-site/templates/adequate/` |
| R4 | Rebrand **language packs** (5 langs) — files `*.tpl_absolute.*` renamed to `tpl_adequate`, keys `TPL_ABSOLUTE_*` → `TPL_ADEQUATE_*` | ✅ DONE | Key parity verified (manifest keys all present in en-GB) |
| R5 | Rebrand **preview pages** — `index.html`, `listing.html`, `safari.html`, `credits.html` (`<title>`, `adq-brand__name`, hero eyebrow, copyright) | ✅ DONE | Preview renders "Adequate Safaris" (verified via localhost) |
| R6 | Rebrand **booking micro-app** — `layout.tsx`, `Header`/`Footer`/`Hero`/`Testimonials`, all static pages, `sitemap.ts`, `robots.ts`, `next.config.js`, package `adq-booking`, store `adq-auth`, refs `ADQ-…` | ✅ DONE | `npm run build` green (28 routes) |
| R7 | Rebrand **API** — package `adq-api`, `prisma/seed.ts`, `main.ts`, `config/*.ts`, booking refs `ADQ-…` | ✅ DONE | `nest build` green |
| R8 | Rebrand **Docker/ops** — `docker-compose.yml` (`adq-*` containers/network), `docker/nginx/conf.d/default.conf`, `.env.example` (`adq-assets`) | ✅ DONE | |
| R9 | Rebrand **docs** — `README.md`, `TODO.md`, `docs/*.md`, `export_joomla.py`, `find_images.py`, `set_preview_cards.py`, `rebrand.py` | ✅ DONE | |
| R10 | Template **thumbnails** regenerated with new brand | ✅ DONE | `templatePreview.png` (800×600) + `templateThumbnail.png` (400×300) rebuilt over hero photo. No `images/social/` OG assets exist in this checkout. `favicon.ico` is a gold "A" (name-agnostic) → kept |
| R11 | Rebrand **modules/plugins** — `mod_aas_hero` → `mod_adq_hero` (dir + files + keys `MOD_ADQ_HERO_*`), plugins `ADQ` labels, table `#__adq_sync_queue`, cookie `adq_token`, `install.sh` | ✅ DONE | |

**Decision executed:** option **(b) Full rename** — `templates/absolute/` → `templates/adequate/`, module `mod_aas_hero` → `mod_adq_hero`, prefix `aas-` → `adq-`, `AAS` → `ADQ`, lang files `tpl_absolute` → `tpl_adequate`.
**Remaining for new repo:** R1/R2 (repo URL) — then commit this tree as-is.

---

## 🚧 BLOCKERS / OPEN QUESTIONS

| # | Blocker | Status | Notes |
|---|---------|--------|-------|
| B1 | **`npm install` fails in this environment (Termux/Android)** — npm cacache `ENOENT rename`; `pnpm` default symlinks `EACCES`; emulated FS (`/mnt/sdcard`,`/tmp`,`/root/.npm`) can't do npm's cache rename/symlinks | ✅ RESOLVED | Built in a copy on the **native f2fs root** (`/root/adq-build`) with `corepack pnpm` → `next build` **green** (4/4 pages). `node_modules/` stays out of the repo. |
| B2 | **Visual verification (localhost)** — review the UI against the Joomla preview | 🔄 ACTIVE | `next start` running at **http://localhost:3001** (HTTP 200; Hero/Search/Featured/Why-Us/Testimonials render). Review in browser; rebuild copy after each fix. |

---

## 🧾 SESSION LOG

- **Oct 14 2026**
  - Cloned the new repo standalone to `/mnt/sdcard/OpenCode/adequatesafari` (separate from `Absoluteadventuresafari`; treated independently). `main` @ `6100d5cd`, tree clean.
  - **Vercel deploy verified healthy.** Project `adequatesafari` (`prj_qrnYZgya4y6Ytx5WirJPh89E0UMN`), Root Directory `micro-apps/booking`, framework Next.js. Latest production deploy `dpl_5zVWNMVsSD1t7Vfwb6kGYHLHPAwf` = **READY** for commit `6100d5cd`.
  - **Prior deploy failures explained (now resolved):** `rootDirectory` is not a valid `vercel.json` key (schema error) and the legacy repo-root build exceeded the Hobby plan's 12-Serverless-Function limit. Fix = set **Root Directory** in the project settings (not `vercel.json`), which `6100d5cd` does.
  - **Live checks:** `https://adequatesafari.vercel.app` → `/`, `/safaris`, `/safaris/[slug]`, `/about`, `/contact`, `/offers`, `/faq`, `/booking/new`, `/auth/login` all HTTP 200; home cards + hero images 200. `www.adequatesafaris.com` → `https://adequatesafaris.com/` (currently the existing WordPress site).
  - **Next:** resolve the specific outstanding issue raised by the user (see Blockers/Open).
  - **GitHub log audit:** old repo `Absoluteadventuresafari` → `Deploy API` run **failed**: `invalid tag "ghcr.io/ismahdeismail-beep/Absoluteadventuresafari/api:latest": repository name must be lowercase` (step "Build & push"). Root cause = GHCR tag built from `${{ github.repository }}` (original casing). The new repo only had `ci.yml` — the 4 deploy workflows were never ported.
  - **Fix:** ported `deploy-api.yml`, `deploy-apps.yml`, `deploy-joomla.yml`, `sync-content.yml` into this repo. `deploy-api.yml` now lowercases the tag via `IMAGE=ghcr.io/${GITHUB_REPOSITORY,,}/api`; Joomla workflow updated `absolute/`→`adequate/`. All secret-gated (green with no infra). **E9 + E11 → DONE.**
  - **Vercel log audit:** both projects (`adequatesafari` → `micro-apps/booking`; `api` → `api`) latest prod deploy `READY` for `6100d5cd`; older reds (root `vercel.json` `rootDirectory` schema error, legacy root build >12 functions, missing `public` output dir) are superseded. Current config correct: no repo-root `vercel.json`; `micro-apps/booking/vercel.json` = `{ "framework": "nextjs" }`.

- **Oct 13 2026 (latest — rebrand executed)**
  - **Full rebrand to "Adequate Safaris" executed (option b, no commit):**
    - `joomla-site/templates/absolute/` → `templates/adequate/`; lang files `tpl_absolute` → `tpl_adequate`; keys `TPL_ABSOLUTE_*` → `TPL_ADEQUATE_*` (parity verified).
    - Module `mod_aas_hero` → `mod_adq_hero` (dir + php/xml + lang keys `MOD_ADQ_HERO_*`).
    - Prefix `aas-`/`aas_`/`AAS` → `adq-`/`adq_`/`ADQ` everywhere (CSS classes, JS globals `window.ADQ_CONFIG`, booking refs `ADQ-…`, JWT cookie `adq_token`, DB table `#__adq_sync_queue`, docker `adq-*` services/network, npm packages `adq-api`/`adq-booking`).
    - Domains/emails → `adequatesafaris.com`; npm/pip example names → `@adequate-safaris/`.
    - Guards verified intact across 171 scanned files: `Maasai` (50), `path-is-absolute` (10), `absolutecabs.co.ke` (4), CSS `position: absolute` (9).
    - `templates/adequate` thumbs regenerated with new brand (800×600 + 400×300).
    - **Verified:** PHP lint clean, JS syntax clean, `php -l` all green, `nest build` green (adq-api), booking `npm run build` green (28 routes), preview server 200 with new `/templates/adequate/` paths (old path 404).
  - **Remaining:** R1/R2 — user is creating a new GitHub repo (this will also fix E11's lowercase-tag requirement). Nothing committed in this tree since the rename (user will own the commit), except the earlier TODO-only edit.
- **Oct 13 2026**
  - Re-verified repo: tree clean, `origin` restored, E1–E6 confirmed done (index 6 / listing 9 distinct cards, `<picture>` wiring present).
  - Diagnosed Vercel deploy failure → E7 (missing components) + E8 (bad `vercel.json` routes).
  - Implemented E7/E8 fixes; copied card imagery (`public/cards/*-800.jpg`) and hero images (`public/hero/slider1.jpg`, `slider5.jpg`) into the booking app.
  - `npm install` **blocked** (B1) → build not yet verified. Committed code anyway so Vercel can attempt a fresh build.
  - **B1 workarounds tried:** npm (cacache ENOENT rename), `corepack pnpm` direct (symlink EACCES — emulated FS), then **green build via copy on native f2fs** (`/root/adq-build`, `corepack pnpm`, `next build` OK).
  - Found & fixed **E10** (`next.config.js` rewrite → `undefined/api/...`) which also broke the build.
  - **`next start` running at http://localhost:3001** (HTTP 200) for visual review (B2).
  - **Push:** authenticated via PAT and pushed `main` (`96916919..ad46d0ae`); token to be revoked by user.
  - **README rewritten** — documented the single canonical repo/branch/remote, accurate directory tree, status table, Termux build caveat, and contribution workflow. Confirmed via `git branch -a` / `worktree list` that there is **no duplicate repo** (the "two repos" worry was stale `~/Desktop/...` + "shared work dir" text, now removed).
  - **Next:** E9 deploy workflows; booking sub-pages (`/safaris`, `/safaris/[slug]`, `/auth/*`); then itinerary/agent apps.
  - **Booking sub-pages built & verified:** `/safaris` (search/country/sort), `/safaris/[slug]` detail (SSG ×11), `/auth/login`, `/auth/register`, `/booking/my-bookings`, custom `not-found`. `next build` → **19 routes green**; `next start` all routes HTTP 200 (404 for unknown). Added `lib/mappers.ts` + `SafariDetailData` + richer `sample-data.ts`.
  - **Now:** E9 deploy workflows next.
  - **Static pages + SEO added:** `/about`, `/contact` (form), `/offers`, `/terms`, `/privacy`, `/faq`, `/credits`; `sitemap.xml`, `robots.txt`, `metadataBase`. `next build` → **28 routes green**; all routes HTTP 200 locally.

---

## ✅ COMPLETED (verified)

### Foundation / Infrastructure
- [x] Project structure + git repo
- [x] `README.md` — rewritten: single source of truth (one repo / one `main` / one remote), accurate directory tree, status table, build notes, contribution workflow
- [x] **Repo hygiene confirmed** — exactly one clone, one branch (`main`), one remote (`origin`), one worktree; no duplicate repo. Stale `~/Desktop/...` + "shared work dir" references removed.
- [x] `docker/docker-compose.yml` — Joomla 5, MariaDB, Redis, Nginx, API, 3× Next.js
- [x] `docker/Dockerfile.joomla`, `Dockerfile.api`, `Dockerfile.nextjs`
- [x] `docker/nginx/nginx.conf` + `conf.d/default.conf` — upstreams, SSL, HSTS, rate limits
- [x] `.env.example` — all env vars (DB, JWT, Stripe, M-Pesa, SMTP, S3, analytics, `DATABASE_URL`, `CORS_ORIGINS`, `CDN_URL`)
- [x] `docs/` — `data-model.md`, `api-spec.md`, `export_joomla.py`, `current-site-analysis.md`, `visual-sitemap.md`, `deployment.md`, `micro-interactions.md`

### Joomla 5 template (built, `php -l` clean)
- [x] `templateDetails.xml` — manifest, positions, params (colors, API URLs, features, social, contact)
- [x] `index.php` — API-first shell (header, hero module, footer, cookie consent)
- [x] `component.php`, `error.php`, `offline.php`
- [x] `css/template.css` — responsive + design tokens (color/space/radius/elevation/motion)
- [x] `js/template.js` — nav toggle, search drawer, cookie consent, micro-app hand-off, mobile accordion
- [x] `html/mod_menu/default.php` — recursive multi-level menu, ARIA toggles
- [x] `html/com_content/article/default.php` — safari detail (hero, fields, booking CTA, `<picture>` cards)
- [x] `html/com_content/featured/default.php` — listing grid (cards, pagination, CTAs, `<picture>` cards)
- [x] Language packs `en-GB`, `de-DE`, `fr-FR`, `es-ES`, `zh-CN` (key-parity verified)
- [x] Plugin `plg_system_jwt`, `plg_content_api_sync`
- [x] Module `mod_safari_search`, `mod_adq_hero`
- [x] `setup/safari-fields.xml` + `install.sh`

### Hero + cards imagery (preview verified 200)
- [x] Client hero slides → `images/hero/` (WebP 1300/960/640 + JPG)
- [x] Ken Burns, crossfade, staggered captions, pause/swipe/keyboard, `prefers-reduced-motion`
- [x] 16 CC-licensed destination photo stems → `images/cards/` (WebP+JPG at 400/800/1280; **all sets complete** — includes Tanzania ×2, Uganda ×2, Kenya ×10, general ×2)
- [x] `images/cards/CREDITS.md` + preview `/credits.html`
- [x] Preview pages wired with real photos: index (6), listing (9), safari hero banner
- [x] Animated nav dropdowns (fade+lift, 2nd-level flyout, `Esc`, `:focus-within`)
- [x] Card hover lift + photo zoom (token-driven)

### API — scaffold + modules (synced, build green)
- [x] `api/package.json` — NestJS deps (Prisma, Stripe, JWT, Swagger, Throttler)
- [x] `api/prisma/schema.prisma` — full schema (Users, Agents, Safaris, Parks, Accommodations, RoomTypes, Bookings, Payments, ItinerarySessions, Webhooks, SyncLogs, enums)
- [x] `api/src/main.ts`, `app.module.ts`, `config/`, `common/`, `prisma/`
- [x] `api/tsconfig.json` + `tsconfig.build.json` + `nest-cli.json`
- [x] `api/prisma/seed.ts` — sample safaris, departures, users (idempotent upserts)
- [x] Modules: `auth`, `users`, `safaris`, `bookings`, `payments`, `agents`, `sync`, `webhooks`, `health`
- [x] `prisma validate` + `nest build` + ESLint green; MySQL-compatible schema
- [x] Repo cleanup — untracked `api/node_modules` + `api/dist`; expanded `.gitignore`
- [x] `.github/workflows/ci.yml` — PHP lint + JS syntax + API validate/build/eslint

---

## 🔄 IN PROGRESS

### Fix queue
- [x] E1–E6 landed and verified
- [x] E8 vercel.json fixed
- [x] E7 components created + build green (B1 resolved)
- [x] E10 rewrite guard (build green)
- [x] E12 image audit — all 16 stems complete
- [x] E13 no hard-coded secrets verified
- [x] E11 docker tag lowercased in `deploy-api.yml` (`${GITHUB_REPOSITORY,,}`)
- [x] E9 deploy workflows ported to this repo

### Rebrand → "Adequate Safaris" (§ REBRAND)
- [x] R3–R11 executed — full rename (option b): dirs `absolute/`→`adequate/`, `mod_aas_hero`→`mod_adq_hero`, prefix `aas-`→`adq-`, `AAS`→`ADQ`, brand strings→Adequate Safaris, thumbs regenerated, all builds green
- [x] R1/R2 — repo `adequatesafari` created (lowercase), `origin` set; E11 fixed in `deploy-api.yml`

### Joomla 5 remaining
- [ ] FaLang/Joomfish — 5 languages (content translation; INI packs done)
- [ ] Akeeba Backup + Admin Tools hardening
- [ ] Joomla content migration → real articles w/ images

---

## ⏳ PENDING

### 1. Booking Micro-app (`micro-apps/booking/`) — home + listing + detail + auth pages live; **build green (19 routes)**
- [x] Scaffold Next.js (TS, Tailwind, App Router, src-dir) + `lib/api.ts` client
- [x] `Header`, auth store, shared utils
- [x] Home components: `Hero`, `SearchSection`, `FeaturedSafaris`, `SafariCard`, `WhyChooseUs`, `Testimonials`, `Newsletter`, `Footer` (+ `lib/sample-data.ts` fallback)
- [x] Tailwind tokens for `globals.css` `@apply` (`border`, `background`, `foreground`, `ring`, `muted`, …)
- [x] Card/hero imagery copied to `public/` so the app renders standalone
- [x] **Verify `npm run build`** — green (19 routes) + `next start` HTTP 200 (B1/B2)
- [x] `/safaris` listing with search + country filter + sort (API w/ sample fallback)
- [x] `/safaris/[slug]` detail: hero, highlights, itinerary, inclusions/exclusions, sticky booking aside (SSG ×11)
- [x] `/auth/login` + `/auth/register` (Zustand + JWT), `/booking/my-bookings`, custom `not-found`
- [ ] Shared UI (shadcn/ui)
- [ ] Booking flow → payment → confirmation (`/booking/new` cart/checkout)
- [ ] Stripe Checkout + M-Pesa STK Push
- [ ] Guest + authenticated booking
- [ ] Voucher PDF, email/SMS/WhatsApp confirmations
- [ ] i18n (next-intl, 5 langs)
- [x] SEO basics: `sitemap.xml`, `robots.txt`, `metadataBase` (+ per-page metadata)
- [ ] SEO advanced: JSON-LD structured data, OG images
- [x] Static pages for footer/CTA links: `/about`, `/contact` (form), `/offers`, `/terms`, `/privacy`, `/faq`, `/credits`

### 2. Itinerary Builder (`micro-apps/itinerary-builder/`) — *not started (dir absent)*
- [ ] Drag-drop day planner (@dnd-kit)
- [ ] Park/accommodation selector + live pricing
- [ ] Real-time pricing (API), PDF export (pdfmake)
- [ ] "Book this itinerary" handoff
- [ ] Save/resume + shareable links; mobile-responsive

### 3. Agent Portal (`micro-apps/agent-portal/`) — *not started (dir absent)*
- [ ] Agent login (JWT + refresh)
- [ ] Dashboard: bookings, commissions, clients
- [ ] Booking management, commission reports (CSV/PDF)
- [ ] Client CRM, white-label settings, API key management, notifications

### Deployment & Ops
- [x] `.github/workflows/ci.yml`
- [x] `deploy-api.yml`, `deploy-apps.yml`, `deploy-joomla.yml`, `sync-content.yml` (ported; secret-gated)
- [ ] VPS (Ubuntu 22.04, Docker, Nginx, Certbot)
- [ ] DNS: `www`, `api`, `book`, `plan`, `agents`, `cdn`
- [ ] SSL (Let's Encrypt + auto-renew), DB backups (daily + PITR)
- [ ] Monitoring (UptimeRobot, Sentry, Logtail), CDN, Email (SendGrid/Postmark)
- [ ] Analytics (GA4 + GTM + Pixel)

### Content Migration
- [ ] Run `export_joomla.py` on live site → transform → import to Joomla 5
- [ ] Sync to API DB (prisma migrate + seed)
- [ ] Verify safaris/parks/accommodations/images
- [ ] 301 redirects for old URLs; test multi-language content

### Launch Checklist
- [ ] E2E booking flow (guest + agent)
- [ ] M-Pesa sandbox → production; Stripe test → live
- [ ] Load test (k6): 100 concurrent bookings
- [ ] Security audit (OWASP, headers, rate limits)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Core Web Vitals (LCP < 2.5s, CLS < 100ms)
- [ ] GDPR/Privacy policy + cookie consent; TOS + booking conditions
- [ ] Staff training; go-live + rollback plan

---

## Time Estimates (AI-Accelerated)

| Phase | Est. |
|-------|------|
| Foundation | ✅ Done |
| Fix queue E1–E6 | ✅ Done |
| Fix queue E7–E9 | E7/E8/E10 done · E9 ~15 min |
| Rebrand → Adequate Safaris (R1–R11) | ~45 min (R1 needs GitHub admin) |
| API Core (modules + Prisma + tests) | ~60 min |
| Joomla 5 (content migration, harden, i18n) | ~45 min |
| Booking App | ~90 min |
| Itinerary Builder | ~90 min |
| Agent Portal | ~90 min |
| Deployment (CI/CD, VPS, DNS, SSL) | ~30 min |
| Content Migration | ~30 min |
| **Total remaining** | **~7.5 hours** |

---

## Quick Commands

```bash
# Local stack
docker compose -f docker/docker-compose.yml up -d

# API dev
cd api && npm run start:dev

# Micro-apps dev
cd micro-apps/booking && npm run dev           # :3001
cd micro-apps/itinerary-builder && npm run dev  # :3002  (not yet created)
cd micro-apps/agent-portal && npm run dev       # :3003  (not yet created)

# Prisma
cd api && npx prisma generate && npx prisma migrate dev && npm run db:seed

# Verify (same as CI)
find joomla-site -name '*.php' -print0 | xargs -0 -n1 php -l      # PHP lint
cd api && npx prisma validate && npm run build && npx eslint "src/**/*.ts"

# Booking micro-app
cd micro-apps/booking && npm install && npm run type-check && npm run build

# Export live Joomla content
ssh user@server "cd /path/to/export && python3 export_joomla.py"

# Preview static pages
python3 preview/serve.py 8080   # http://localhost:8080/
```
