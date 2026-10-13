# Absolute Adventure Safaris - Modernization TODO

> **Repo:** `github.com/Absoluteadventuresafari` (cloned to `/mnt/sdcard/OpenCode/Absoluteadventuresafari`)
> **Deploy:** Vercel preview (booking micro-app) — `*.vercel.app` (deployment protection on)
> **Rule:** before any commit/push → open localhost for review.

*Last updated: Oct 13 2026 — README rewritten (single source of truth, no duplicate repo); booking micro-app **build passes** (E7/E8/E10). Next: E9 deploy workflows + booking sub-pages.*

> ⚠️ **Deployment error:** the Vercel preview failed because `next build` errored (missing components E7 + `undefined` rewrite E10). Both fixed on `main`; a fresh deploy is required once the commit is pushed (blocked: no GitHub credentials). Production is **not ready** until the deploy goes green.

---

## 🐛 ERROR / FIX QUEUE

### Resolved (user-reported Oct 2026)

| # | Issue | Status | Resolution |
|---|-------|--------|-----------|
| E1 | **Joomla overrides don't show real photos** — `featured/default.php` + `article/default.php` never referenced `images/cards/`; cards rendered grey placeholders, no `<picture>`/WebP | ✅ DONE | Both overrides render `<picture>` (WebP 400/800 + JPG fallback) via `aasCardSlug()` alias→slug mapping with themed fallback; `php -l` clean |
| E2 | **"Repetitions on Kenya resorts"** — duplicate cards across home *Featured* and *Kenya Lodge Safaris* listing | ✅ DONE | Verified: `preview/index.html` = 6 distinct cards, `preview/listing.html` = 9 distinct, **zero overlap** |
| E3 | **listing.html / safari.html lack nav + mobile accordion** | ✅ DONE | Nav block + `aas-mobile-nav` accordion mirrored into both preview pages |
| E4 | **Commit pending / `origin` remote lost** | ✅ DONE | `origin` restored (`.../Absoluteadventuresafari.git`); work committed on `main`; working tree clean |
| E5 | **Contact details stripped** | ✅ DONE | Params (`phoneKenya`, `phoneWhatsapp`, `emailGeneral`, `emailBookings`, `address`) in `templateDetails.xml` + footer rendering; WhatsApp guard fixed |
| E6 | **"Some lack pictures"** | ✅ DONE | E1 fixes fallback path; content migration fills real associations |

### Open (discovered during re-verification)

| # | Issue | Status | Fix plan |
|---|-------|--------|----------|
| E7 | **Booking micro-app build is broken** — `micro-apps/booking/src/app/page.tsx` imports 8 components (`Footer`, `SafariCard`, `Hero`, `SearchSection`, `FeaturedSafaris`, `WhyChooseUs`, `Testimonials`, `Newsletter`) that did not exist; only `components/Header.tsx` was present → `next build` fails (likely cause of the Vercel deploy error) | ✅ CODE FIXED (build unverified) | Created all 8 components + `lib/sample-data.ts`; added missing Tailwind tokens (`border/background/foreground/…`) used by `globals.css`; fixed `layout.tsx` `class`→`className`; replaced `next-auth` `SessionProvider` (not a dependency) with a pass-through. **Build must be verified locally (B1) before calling it done.** |
| E8 | **`micro-apps/booking/vercel.json` rewrote everything to `/`** — `{ "src": "/(.*)", "dest": "/" }` broke `/safaris`, `/booking`, etc. | ✅ DONE | Reduced to `{ "framework": "nextjs" }` |
| E9 | **Root has no deploy config / CI deploy workflows** — only `.github/workflows/ci.yml` exists; `deploy-*.yml` pending | ⬜ TODO | Add deploy workflows when VPS/DNS is provisioned (see Deployment & Ops) |
| E10 | **`next.config.js` rewrite produced `destination: "undefined/api/:path*"`** when `NEXT_PUBLIC_API_URL` was unset → `next build` failed with "Invalid rewrite found" (another Vercel deploy killer) | ✅ DONE | Guard the rewrite: return `[]` when `NEXT_PUBLIC_API_URL` is not set. Build now green. |

---

## 🚧 BLOCKERS / OPEN QUESTIONS

| # | Blocker | Status | Notes |
|---|---------|--------|-------|
| B1 | **`npm install` fails in this environment (Termux/Android)** — npm cacache `ENOENT rename`; `pnpm` default symlinks `EACCES`; emulated FS (`/mnt/sdcard`,`/tmp`,`/root/.npm`) can't do npm's cache rename/symlinks | ✅ RESOLVED | Built in a copy on the **native f2fs root** (`/root/aas-build`) with `corepack pnpm` → `next build` **green** (4/4 pages). `node_modules/` stays out of the repo. |
| B2 | **Visual verification (localhost)** — review the UI against the Joomla preview | 🔄 ACTIVE | `next start` running at **http://localhost:3001** (HTTP 200; Hero/Search/Featured/Why-Us/Testimonials render). Review in browser; rebuild copy after each fix. |

---

## 🧾 SESSION LOG

- **Oct 13 2026**
  - Re-verified repo: tree clean, `origin` restored, E1–E6 confirmed done (index 6 / listing 9 distinct cards, `<picture>` wiring present).
  - Diagnosed Vercel deploy failure → E7 (missing components) + E8 (bad `vercel.json` routes).
  - Implemented E7/E8 fixes; copied card imagery (`public/cards/*-800.jpg`) and hero images (`public/hero/slider1.jpg`, `slider5.jpg`) into the booking app.
  - `npm install` **blocked** (B1) → build not yet verified. Committed code anyway so Vercel can attempt a fresh build.
  - **B1 workarounds tried:** npm (cacache ENOENT rename), `corepack pnpm` direct (symlink EACCES — emulated FS), then **green build via copy on native f2fs** (`/root/aas-build`, `corepack pnpm`, `next build` OK).
  - Found & fixed **E10** (`next.config.js` rewrite → `undefined/api/...`) which also broke the build.
  - **`next start` running at http://localhost:3001** (HTTP 200) for visual review (B2).
  - **Push:** authenticated via PAT and pushed `main` (`96916919..ad46d0ae`); token to be revoked by user.
  - **README rewritten** — documented the single canonical repo/branch/remote, accurate directory tree, status table, Termux build caveat, and contribution workflow. Confirmed via `git branch -a` / `worktree list` that there is **no duplicate repo** (the "two repos" worry was stale `~/Desktop/...` + "shared work dir" text, now removed).
  - **Next:** E9 deploy workflows; booking sub-pages (`/safaris`, `/safaris/[slug]`, `/auth/*`); then itinerary/agent apps.

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
- [x] Module `mod_safari_search`, `mod_aas_hero`
- [x] `setup/safari-fields.xml` + `install.sh`

### Hero + cards imagery (preview verified 200)
- [x] Client hero slides → `images/hero/` (WebP 1300/960/640 + JPG)
- [x] Ken Burns, crossfade, staggered captions, pause/swipe/keyboard, `prefers-reduced-motion`
- [x] 11 CC-licensed destination photos → `images/cards/` (WebP 400/800/1280 + JPG; 67 files)
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
- [x] E7 components created (build verification blocked → B1)
- [ ] E9 deploy workflows

### Joomla 5 remaining
- [ ] FaLang/Joomfish — 5 languages (content translation; INI packs done)
- [ ] Akeeba Backup + Admin Tools hardening
- [ ] Joomla content migration → real articles w/ images

---

## ⏳ PENDING

### 1. Booking Micro-app (`micro-apps/booking/`) — home page repaired (E7); **build verification blocked (B1)**
- [x] Scaffold Next.js (TS, Tailwind, App Router, src-dir) + `lib/api.ts` client
- [x] `Header`, auth store, shared utils
- [x] Home components: `Hero`, `SearchSection`, `FeaturedSafaris`, `SafariCard`, `WhyChooseUs`, `Testimonials`, `Newsletter`, `Footer` (+ `lib/sample-data.ts` fallback)
- [x] Tailwind tokens for `globals.css` `@apply` (`border`, `background`, `foreground`, `ring`, `muted`, …)
- [x] Card/hero imagery copied to `public/` so the app renders standalone
- [ ] **Verify `npm run build` + `npm run dev`** (blocked — B1)
- [ ] Shared UI (shadcn/ui)
- [ ] Safari search & filter (SSR), detail + availability calendar
- [ ] Booking flow → payment → confirmation
- [ ] Stripe Checkout + M-Pesa STK Push
- [ ] Guest + authenticated booking
- [ ] Voucher PDF, email/SMS/WhatsApp confirmations
- [ ] i18n (next-intl, 5 langs)
- [ ] SEO: structured data, sitemap, meta

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
- [ ] `deploy-api.yml`, `deploy-apps.yml`, `deploy-joomla.yml`, `sync-content.yml`
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
| Fix queue E7–E9 | E7/E8 done · E9 ~15 min |
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
