# Absolute Adventure Safaris - Modernization TODO

## ✅ COMPLETED (Foundation - ~30 min)

### Infrastructure & Architecture
- [x] Project structure created (`~/Desktop/absolute adventure safari/`)
- [x] Git repository initialized
- [x] **README.md** - Architecture overview, migration strategy, commands
- [x] **docker/docker-compose.yml** - Full stack (Joomla 5, MariaDB, Redis, Nginx, API, 3x Next.js apps)
- [x] **docker/Dockerfile.joomla** - PHP 8.3 + Apache + extensions + opcache
- [x] **docker/Dockerfile.api** - NestJS multi-stage build
- [x] **docker/Dockerfile.nextjs** - Next.js standalone output
- [x] **docker/nginx/nginx.conf** - Main config with upstreams, rate limiting, gzip
- [x] **docker/nginx/conf.d/default.conf** - SSL, subdomains, security headers, HSTS
- [x] **.env.example** - All environment variables documented
- [x] **docs/data-model.md** - Complete data model (8 entities, SQL, JSONB structures)
- [x] **docs/api-spec.md** - Full REST API spec (endpoints, auth, webhooks, SDK)
- [x] **docs/export_joomla.py** - Python script to export current Joomla content
- [x] **api/package.json** - NestJS dependencies with Prisma, Stripe, M-Pesa, JWT, Swagger

## 🔄 IN PROGRESS / NEXT (Core API - ~60 min)

### API Implementation (NestJS + Prisma)
- [ ] `api/prisma/schema.prisma` - Database schema matching data-model.md
- [ ] `api/src/main.ts` - Bootstrap with Swagger, Helmet, Throttler, CORS
- [ ] `api/src/config/` - Configuration modules (database, jwt, stripe, mpesa, email)
- [ ] `api/src/common/` - Guards, interceptors, pipes, filters, decorators
- [ ] `api/src/modules/auth/` - JWT auth, register, login, refresh, password reset
- [ ] `api/src/modules/users/` - User profiles, preferences, loyalty
- [ ] `api/src/modules/safaris/` - Catalog, availability, search, filters
- [ ] `api/src/modules/bookings/` - CRUD, hold inventory, pricing, vouchers
- [ ] `api/src/modules/payments/` - Stripe + M-Pesa integration, webhooks
- [ ] `api/src/modules/itinerary/` - Sessions, pricing, PDF export, convert to booking
- [ ] `api/src/modules/agents/` - Agent auth, bookings, commissions, clients
- [ ] `api/src/modules/sync/` - Joomla webhook receivers, data synchronization
- [ ] `api/prisma/seed.ts` - Seed parks, tiers, sample safaris, test agent

### Joomla 5 Modernization
- [ ] Custom template `absolute/` (minimal, API-first, Tailwind via CDN)
- [ ] Custom fields for Safari content type (duration, price, parks, tier, etc.)
- [ ] Plugin `plg_system_jwt` - JWT bridge for micro-app SSO
- [ ] Plugin `plg_content_api_sync` - Push content changes to API via queue
- [ ] Module `mod_safari_search` - Search form for micro-apps
- [ ] FaLang/Joomfish setup for 5 languages (en, de, fr, zh, es)
- [ ] Akeeba Backup + Admin Tools security hardening

## ⏳ PENDING (Micro-apps - ~90 min each)

### 1. Booking Micro-app (`micro-apps/booking/`)
- [ ] `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir`
- [ ] Shared UI components (shadcn/ui via Turborepo)
- [ ] Safari search & filter page (SSR)
- [ ] Safari detail page with availability calendar
- [ ] Booking flow: details → payment → confirmation
- [ ] Stripe Checkout + M-Pesa STK Push integration
- [ ] Guest + authenticated booking
- [ ] Voucher PDF download
- [ ] Email/SMS/WhatsApp confirmations
- [ ] i18n (next-intl) for 5 languages
- [ ] SEO: structured data, sitemap, meta tags

### 2. Itinerary Builder (`micro-apps/itinerary-builder/`)
- [ ] Drag-drop day planner (React DnD / @dnd-kit)
- [ ] Park/accommodation selector with live pricing
- [ ] Preferences panel (pace, budget, interests)
- [ ] Real-time price calculation (API)
- [ ] PDF itinerary export (pdfmake)
- [ ] "Book This Itinerary" → booking micro-app handoff
- [ ] Save/resume sessions (localStorage + API)
- [ ] Shareable links
- [ ] Mobile-responsive

### 3. Agent Portal (`micro-apps/agent-portal/`)
- [ ] Agent login (JWT + refresh tokens)
- [ ] Dashboard: bookings, commissions, clients
- [ ] Booking management (view, modify, cancel for clients)
- [ ] Commission reports (filters, export CSV/PDF)
- [ ] Client CRM (contact history, preferences, loyalty)
- [ ] White-label settings (logo, colors, domain)
- [ ] API key management
- [ ] Notifications (new booking, payment, commission paid)

## 🚀 DEPLOYMENT & OPS (30 min)

### CI/CD (GitHub Actions)
- [ ] `.github/workflows/ci.yml` - Lint, test, type-check
- [ ] `.github/workflows/deploy-api.yml` - Build & push API to Railway/Render
- [ ] `.github/workflows/deploy-apps.yml` - Deploy Next.js apps to Vercel
- [ ] `.github/workflows/deploy-joomla.yml` - Deploy Joomla to VPS (rsync + DB migrate)
- [ ] `.github/workflows/sync-content.yml` - Nightly content sync Joomla → API

### Production Setup
- [ ] Provision VPS (Ubuntu 22.04, Docker, Nginx, Certbot)
- [ ] Configure DNS: `www`, `api`, `book`, `plan`, `agents`, `cdn`
- [ ] SSL certificates (Let's Encrypt + auto-renewal)
- [ ] Database backups (daily + point-in-time)
- [ ] Monitoring: UptimeRobot, Sentry, Logtail
- [ ] CDN: CloudFront/Cloudflare for images
- [ ] Email: SendGrid/Postmark transactional
- [ ] Analytics: GA4 + GTM + Facebook Pixel

## 📋 CONTENT MIGRATION (Parallel - 30 min)

- [ ] Run `export_joomla.py` on live site
- [ ] Transform exported JSON → new data model
- [ ] Import to Joomla 5 via CLI (custom fields, categories, articles)
- [ ] Sync to API database (prisma migrate + seed)
- [ ] Verify all safaris, parks, accommodations, images
- [ ] Set up 301 redirects for old URLs
- [ ] Test multi-language content

## 🎯 LAUNCH CHECKLIST

- [ ] End-to-end booking flow (guest + agent)
- [ ] M-Pesa sandbox → production switch
- [ ] Stripe test → live mode
- [ ] Load test (k6): 100 concurrent bookings
- [ ] Security audit (OWASP, headers, rate limits)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Core Web Vitals < 2.5s LCP, < 100ms CLS
- [ ] GDPR/Privacy policy + cookie consent
- [ ] Terms of service + booking conditions
- [ ] Staff training (Joomla admin, agent portal)
- [ ] Go-live checklist & rollback plan

---

## Time Estimates (AI-Accelerated)

| Phase | Tasks | Est. Time |
|-------|-------|-----------|
| Foundation | ✅ Done | 30 min |
| API Core | 12 modules + Prisma + tests | 60 min |
| Joomla 5 | Template, fields, plugins, i18n | 45 min |
| Booking App | Next.js + payments + i18n | 90 min |
| Itinerary Builder | Drag-drop + pricing + PDF | 90 min |
| Agent Portal | Dashboard + CRM + reports | 90 min |
| Deployment | CI/CD + VPS + DNS + SSL | 30 min |
| Content Migration | Export → transform → import | 30 min |
| **Total** | | **~7.5 hours** |

## Quick Commands

```bash
# Start everything locally
cd ~/Desktop/absolute\ adventure\ safari
docker compose -f docker/docker-compose.yml up -d

# View logs
docker compose -f docker/docker-compose.yml logs -f api
docker compose -f docker/docker-compose.yml logs -f joomla

# API dev
cd api && npm run start:dev

# Micro-apps dev (separate terminals)
cd micro-apps/booking && npm run dev
cd micro-apps/itinerary-builder && npm run dev
cd micro-apps/agent-portal && npm run dev

# Run export on live server
ssh user@server "cd /path/to/export && python3 export_joomla.py"

# Prisma commands
cd api && npx prisma generate && npx prisma migrate dev && npx prisma db seed
```