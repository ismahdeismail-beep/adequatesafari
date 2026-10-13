# Adequate Safaris — Modernized Platform

> **Canonical repository:** this GitHub repository — `adequatesafari` (one repo, one `main` branch, one remote).
> **Single source of truth. There is exactly one repo, one `main` branch, one remote (`origin`).**
> Do **not** create parallel copies/clones or edit from other folders — work here only.
> Task status & next steps live in [`TODO.md`](TODO.md).

---

## ⚠️ Repo policy (read first)

- **One repo, one branch.** `origin` points to this repository's GitHub remote (`adequatesafari`), branch `main`.
- **No second working copy.** Older docs referenced `~/Desktop/adequatesafaris` and a separate "shared work dir" — those no longer exist and must not be recreated.
- **One worktree.** `git worktree list` should show only this checkout.
- **Commit small and often.** After any change: run a build/verify, then commit. Don't leave `main` dirty for long.
- **Never commit build output or deps.** `node_modules/`, `.next/`, `dist/`, `.env` are gitignored.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        JOOMLA 5 (CMS)                           │
│  Content · Media · Users/ACL · SEO/Menu                         │
│         ▲                                                       │
│         │ REST (com_api) / JWT bridge                           │
│         ▼                                                       │
└─────────────────────────────────────────────────────────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  BOOKING      │    │ ITINERARY     │    │ AGENT PORTAL  │
│  MICRO-APP    │    │ BUILDER       │    │ MICRO-APP     │
│  (Next.js)    │    │ (Next.js)     │    │ (Next.js)     │
└───────────────┘    └───────────────┘    └───────────────┘
        └─────────────────────┼─────────────────────┘
                              ▼
                    ┌─────────────────┐
                    │  SHARED API     │
                    │  (NestJS/Prisma)│
                    │  Auth · Payments│
                    │  M-Pesa·Stripe  │
                    │  Webhooks·Sync  │
                    └─────────────────┘
```

## Status at a glance

| Area | State |
|------|-------|
| Joomla 5 template, modules, plugins | ✅ built (`php -l` clean) |
| Card/hero imagery + preview pages | ✅ done (index 6 / listing 9 distinct cards) |
| Shared API (auth/users/safaris/bookings/payments/agents/sync/webhooks/health) | ✅ builds green |
| Booking micro-app | 🟡 home page builds & renders; search/detail/booking flow pending |
| Itinerary builder / Agent portal | ⬜ not started |
| Deployment (workflows, VPS, DNS/TLS) | ⬜ pending |

Full breakdown → [`TODO.md`](TODO.md).

---

## Directory Structure

```
adequatesafaris/
├── README.md                 # this file
├── TODO.md                   # task board + session log (keep updated)
├── .env.example              # every env var the stack needs
├── .github/workflows/ci.yml  # PHP lint + JS syntax + API validate/build/lint
├── joomla-site/              # Joomla 5 site
│   └── templates/adequate/   #   custom API-first template (+ images/, html/ overrides)
│   └── modules/              #   mod_adq_hero, mod_safari_search
│   └── plugins/              #   plg_system_jwt, plg_content_api_sync
├── api/                      # NestJS + Prisma shared API
│   ├── prisma/schema.prisma  #   12 models + seed
│   └── src/modules/          #   auth, users, safaris, bookings, payments,
│                             #   agents, sync, webhooks, health
├── micro-apps/
│   └── booking/              # Next.js 14 (App Router, Tailwind) public booking app
├── docker/                   # docker-compose + Dockerfiles (Joomla/API/Next) + nginx
├── docs/                     # api-spec, data-model, deployment, analysis, sitemap
└── preview/                  # static Joomla template preview (serve.py)
```

---

## Quick Start

```bash
# 0. Local preview of the Joomla template (no install needed)
python3 preview/serve.py 8080            # http://localhost:8080/

# 1. Booking micro-app (Next.js)
cd micro-apps/booking
npm install
npm run dev                              # http://localhost:3001
npm run build                             # production build (must stay green)

# 2. Shared API (NestJS + Prisma)
cd api
npm install
npx prisma generate && npx prisma migrate dev && npm run db:seed
npm run start:dev                        # http://localhost:4000 (Swagger at /docs)

# 3. Full stack via Docker (Joomla + MariaDB + Redis + Nginx + API)
docker compose -f docker/docker-compose.yml up -d
```

> **Note on this environment (Termux/Android):** `npm install` fails here (emulated FS
> can't do npm's cache rename/symlinks). Build/verify from a copy on a native filesystem
> (`/root/adq-build`) using `corepack pnpm`, or rely on Vercel CI. See `TODO.md` → Blockers.

---

## Booking micro-app (`micro-apps/booking/`)

- Next.js 14 (App Router, `src/`), TypeScript, Tailwind, Zustand, Axios, react-hook-form + Zod.
- Home page composes `Hero`, `SearchSection`, `FeaturedSafaris`, `WhyChooseUs`, `Testimonials`, `Newsletter`, `Footer`.
- API client: `src/lib/api.ts` (`NEXT_PUBLIC_API_URL`). Falls back to `src/lib/sample-data.ts` when the API is unreachable, so it renders standalone.
- Deploy: **Vercel**, project **Root Directory `micro-apps/booking`**, framework preset **Next.js** (`micro-apps/booking/vercel.json` = `{ "framework": "nextjs" }`). The Root Directory is a Vercel project setting, so no repo-root `vercel.json` is needed.
- The `/api/backend/*` rewrite is only registered when `NEXT_PUBLIC_API_URL` is set.

## Shared API (`api/`)

- NestJS + Prisma (MySQL). Modules: auth, users, safaris, bookings, payments (Stripe + M-Pesa), agents, sync (Joomla webhooks), webhooks, health.
- Swagger UI at `/docs`; global response envelope `{ success, data, meta }`.
- Deploy: Docker/VPS (needs a real MySQL). Not Vercel-friendly as-is.

## Joomla 5 (`joomla-site/`)

- Custom `templateDetails.xml` params (colors, API URLs, social, contact).
- Overrides: `html/mod_menu` (recursive menu), `html/com_content/article` (safari detail), `html/com_content/featured` (listing) — all render `<picture>` WebP/JPG cards.
- `mod_adq_hero` (carousel), `mod_safari_search`, `plg_system_jwt` (SSO bridge), `plg_content_api_sync`.
- Cannot run on Vercel — deploy via Docker/VPS.

---

## Environment Variables

Copy [`.env.example`](.env.example) → `.env` and fill in real values. Key groups:

```env
# API / Prisma
DATABASE_URL=mysql://user:pass@host:3306/db
JWT_SECRET=changeme
PORT=4000
CORS_ORIGINS=https://www.adequatesafaris.com

# Payments
STRIPE_SECRET_KEY=sk_live_...
MPESA_CONSUMER_KEY=...

# Public URLs (also set on each Vercel project)
NEXT_PUBLIC_API_URL=https://api.adequatesafaris.com
NEXT_PUBLIC_JOOMLA_URL=https://www.adequatesafaris.com
```

## Deployment

Three surfaces, three hosts:

- **Micro-apps** → **Vercel** (one project per app; project Root Directory set to `micro-apps/booking`).
- **Joomla** → Docker/VPS (PHP + MySQL).
- **API** → Docker/VPS (or Vercel serverless with a serverless-friendly MySQL).

Full guide — env matrix, Prisma migrate/seed, DNS, TLS, post-deploy checks: [`docs/deployment.md`](docs/deployment.md).

CI (`.github/workflows/ci.yml`) runs on every push/PR to `main`: PHP lint, JS syntax, and API `prisma validate` → `generate` → `build` → ESLint.

## Commands

```bash
# Dev
docker compose -f docker/docker-compose.yml up -d
cd micro-apps/booking && npm run dev             # :3001
cd api && npm run start:dev                       # :4000

# Verify (same as CI)
find joomla-site -name '*.php' -print0 | xargs -0 -n1 php -l
cd api && npx prisma validate && npm run build && npx eslint "src/**/*.ts"
cd micro-apps/booking && npm run type-check && npm run build

# Deploy
git push origin main                               # triggers CI / Vercel
```

## Key Decisions

1. **Joomla stays** — editors know it, SEO structure exists, multilingual core works.
2. **Micro-apps own UX** — booking/itinerary/agent portal are React apps; Joomla is headless-ish.
3. **Shared API = single source of truth** — payments, auth, webhooks, data sync live here.
4. **M-Pesa + Stripe** — Kenya market needs M-Pesa; international needs Stripe.
5. **Component library** — Tailwind + shared conventions across micro-apps.

## Contributing workflow

1. Read [`TODO.md`](TODO.md); pick the top open item.
2. Make the change **in this repo only**.
3. Verify (build/lint/preview) before committing.
4. `git add` only intended files; commit with a clear message.
5. Update `TODO.md` status + session log, then push `main`.
