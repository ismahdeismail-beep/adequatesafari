# Absolute Adventure Safaris — Modernized Platform

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        JOOMLA 5 (CMS)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Content  │  │ Media    │  │ Users    │  │ SEO/Menu │        │
│  │ Articles │  │ Manager  │  │ /ACL     │  │ Structure│        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│         ▲                                                       │
│         │ REST API (com_api) / GraphQL                          │
│         ▼                                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  BOOKING      │    │ ITINERARY     │    │ AGENT PORTAL  │
│  MICRO-APP    │    │ BUILDER       │    │ MICRO-APP     │
│  (React/Next) │    │ (React/Next)  │    │ (React/Next)  │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                    ┌─────────────────┐
                    │  SHARED API     │
                    │  (NestJS/Express)│
                    │  - Auth (JWT)   │
                    │  - Payments     │
                    │  - M-Pesa/Stripe│
                    │  - Webhooks     │
                    └─────────────────┘
```

## Quick Start (AI-Accelerated)

```bash
# 1. Spin up Joomla 5 + MariaDB + Redis
docker compose -f docker/docker-compose.yml up -d

# 2. Install Joomla via CLI (headless)
docker compose exec joomla php installation/cli/joomla.php \
  --site-name="Absolute Adventure Safaris" \
  --admin-user=admin --admin-pass=changeme \
  --db-host=db --db-user=joomla --db-pass=joomla --db-name=joomla

# 3. Install required extensions via CLI
# - com_api (REST API)
# - com_contentbuilder (custom fields for safaris)
# - plg_system_jwt (JWT auth for micro-apps)

# 4. Micro-apps (Next.js) — run per app
cd micro-apps/booking && npm install && npm run dev        # :3001
# (itinerary-builder :3002, agent-portal :3003 — same pattern)

# 5. Shared API (NestJS + Prisma)
cd api && npm install && npx prisma generate && npm run start:dev   # :4000
```

## Migration Strategy (Hours, Not Weeks)

| Phase | Task | AI Tool | Time |
|-------|------|---------|------|
| 1 | Export current content (articles, categories, images) | `joomla-export` script + GPT-4o for mapping | 30 min |
| 2 | Generate Joomla 5 content types (Custom Fields for Safari: duration, parks, price, accommodation tier) | GPT-4o → YAML/JSON → CLI import | 20 min |
| 3 | Build REST API endpoints for safaris/bookings/agents | Copilot + NestJS generators | 45 min |
| 4 | Scaffold 3 micro-apps with shared component library | `create-turbo` + shadcn/ui | 30 min |
| 5 | Implement booking flow (cart → M-Pesa/Stripe → webhook → confirmation) | Copilot + Stripe/M-Pesa SDKs | 60 min |
| 6 | Itinerary builder (drag-drop parks, auto-price, PDF export) | React DnD + pdfmake | 45 min |
| 7 | Agent portal (SSO via Joomla JWT, commission reports) | NextAuth + NestJS | 30 min |
| 8 | i18n setup (next-intl, 5 languages) | GPT-4o for translation keys | 20 min |
| 9 | SEO: structured data, sitemap, meta, Core Web Vitals | next-sitemap + Lighthouse CI | 20 min |
| 10 | Deploy: Joomla on VPS, micro-apps on Vercel, API on Railway/Render | Docker + GitHub Actions | 20 min |

**Total: ~5.5 hours of focused AI-assisted dev**

## Deployment

Three surfaces, three hosts:

- **Micro-apps** → **Vercel** (one project per app, Root Directory `micro-apps/<app>`)
- **Joomla** → Docker/VPS (PHP + MySQL) — it cannot run on Vercel
- **API** → Docker/VPS (or Vercel serverless with a serverless-friendly MySQL)

Full guide — env matrix, Prisma migrate/seed, DNS, TLS, post-deploy checks:
[`docs/deployment.md`](docs/deployment.md).

CI (`.github/workflows/ci.yml`) runs on every push/PR to `main`: PHP lint, JS
syntax, and API `prisma validate` → `generate` → `build` → ESLint.

## Directory Structure

```
absolute-adventure-safari/
├── joomla-site/          # Joomla 5 installation (dockerized)
│   ├── templates/
│   │   └── absolute/     # Custom template (minimal, API-first)
│   ├── modules/
│   │   └── mod_safari_search/  # Search module for micro-apps
│   └── plugins/
│       └── plg_system_jwt/     # JWT bridge to micro-apps
├── micro-apps/
│   ├── booking/              # Next.js: public booking + payment
│   ├── itinerary-builder/    # Next.js: drag-drop itinerary designer
│   └── agent-portal/         # Next.js: B2B agent dashboard
├── api/                      # NestJS: payments, webhooks, auth, sync
├── docker/
│   ├── docker-compose.yml
│   ├── Dockerfile.joomla
│   └── Dockerfile.api
└── docs/
    ├── api-spec.md
    ├── data-model.md
    └── deployment.md
```

## Key Decisions

1. **Joomla stays** — content editors know it, SEO structure exists, multilingual core (FaLang/Joomfish) works
2. **Micro-apps own UX** — booking, itinerary builder, agent portal are React apps; Joomla is headless-ish
3. **Shared API = single source of truth** — payments, auth, webhooks, data sync live here
4. **M-Pesa + Stripe** — Kenya market needs M-Pesa; international needs Stripe
5. **Component library** — shadcn/ui + Tailwind shared across micro-apps via Turborepo

## Environment Variables

Copy [`.env.example`](.env.example) → `.env` and fill in real values. Key groups:

```env
# API / Prisma
DATABASE_URL=mysql://user:pass@host:3306/db
JWT_SECRET=changeme
PORT=4000
CORS_ORIGINS=https://www.absoluteadventuresafaris.com

# Payments
STRIPE_SECRET_KEY=sk_live_...
MPESA_CONSUMER_KEY=...

# Public URLs (also set on each Vercel project)
NEXT_PUBLIC_API_URL=https://api.absoluteadventuresafaris.com
NEXT_PUBLIC_JOOMLA_URL=https://www.absoluteadventuresafaris.com
```

## Commands

```bash
# Dev (all services)
docker compose -f docker/docker-compose.yml up -d
cd micro-apps/booking && npm run dev     # :3001
cd micro-apps/itinerary-builder && npm run dev  # :3002
cd micro-apps/agent-portal && npm run dev       # :3003
cd api && npm run start:dev              # :4000

# Build all
npm run build --workspaces

# Deploy
git push origin main  # triggers GitHub Actions
```