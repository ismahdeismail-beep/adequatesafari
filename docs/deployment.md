# Deployment

Adequate Safaris has three deployable surfaces. They map to different
hosts on purpose.

| Surface | Path | Recommended host | Notes |
|---|---|---|---|
| Joomla 5 (CMS + public site) | `joomla-site/` | VPS / shared hosting (PHP 8.3 + MySQL) | **Cannot run on Vercel** — PHP + MySQL |
| Shared API (NestJS + Prisma) | `api/` | **Railway** (Node host + MySQL) | Keeps Vercel to a **single** project |
| Micro-apps (Next.js) | `micro-apps/*` | **Vercel** | `output: 'standalone'`, App Router |

All secrets/URLs live in `.env` (never committed). Copy `.env.example` and fill
in real values.

---

## 1. Micro-apps → Vercel

Each micro-app under `micro-apps/` is a standalone Next.js app (its own
`package.json`, `next.config.js`, `vercel.json`).

**Dashboard**

1. Import the `adequatesafaris` GitHub repo into Vercel.
2. Create one Vercel project **per app** and set **Root Directory** to the app
   folder, e.g. `micro-apps/booking`.
3. Framework preset: **Next.js** (auto-detected).
4. Add the `NEXT_PUBLIC_*` variables (production values) and deploy.

**CLI**

```bash
npm i -g vercel
vercel link   --cwd micro-apps/booking
vercel --prod --cwd micro-apps/booking
```

Environment variables to set on each Vercel project:

```
NEXT_PUBLIC_API_URL=https://api.adequatesafaris.com
NEXT_PUBLIC_JOOMLA_URL=https://www.adequatesafaris.com
NEXT_PUBLIC_BOOKING_URL=https://book.adequatesafaris.com
NEXT_PUBLIC_ITINERARY_URL=https://plan.adequatesafaris.com
NEXT_PUBLIC_AGENT_URL=https://agents.adequatesafaris.com
```

> `NEXT_PUBLIC_*` values are inlined at build time — changing them requires a
> redeploy.

---

## 2. API → Railway (off Vercel)

Single-Vercel-project policy: the API does **not** run on Vercel. Recommended
host is **Railway** (web service + MySQL in one dashboard). Step-by-step:
[hosting-api.md](hosting-api.md).

Build and run locally with plain `npm` (no Docker):

```bash
cd api
npm ci
npx prisma generate
npm run build
npm run start:prod                  # :4000 (reads DATABASE_URL, JWT_SECRET, …)
```

Database migrations + seed (run once per environment):

```bash
cd api
npx prisma migrate deploy          # apply migrations
npm run db:seed                    # sample safaris + test users (idempotent)
```

Railway auto-detects the service from `api/railway.json` (build + start + health
check `/api/v1/health/live`). Set `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`,
`CORS_ORIGINS` (+ optional Stripe/M-Pesa). Then point the booking app's
`NEXT_PUBLIC_API_URL` at `https://<api-host>/api/v1`.

Requirements:

- `DATABASE_URL` (Prisma reads this exact name). MySQL/MariaDB.
  The schema uses `Json` columns (MySQL-compatible) — do **not** switch to
  Postgres without also changing the datasource provider.
- `JWT_SECRET`, Stripe and M-Pesa keys as per `.env.example`.

> Any persistent Node host works (Railway, Render, Fly, a VPS). We keep only the
> `booking` micro-app on Vercel, so the API lives here.

---

## 3. Joomla → VPS / shared hosting (PHP + MySQL)

Docker has been removed. Run Joomla on any PHP 8.3 + MySQL host (VPS, shared
hosting, or a LAMP stack):

- Install the template by zipping `joomla-site/templates/adequate/` and uploading
  it via **System → Install → Extensions**, or drop it into the Joomla tree.
- Apply the template + plugins + modules with `joomla-site/setup/install.sh`
  (set `JOOMLA_SITE_ROOT` to your Joomla webroot — no Docker required).
- Front with Nginx or Apache; issue TLS with Let's Encrypt (Certbot), or use the
  hosting provider's auto-SSL.
- Template params (logo, contact details, social, micro-app URLs, colours) are set
  in **System → Site Templates → adequate → Options**.

---

## 4. CI (GitHub Actions)

`.github/workflows/ci.yml` runs on every push/PR to `main`:

| Job | Checks |
|---|---|
| `php` | `php -l` on every `.php` under `joomla-site/` |
| `js` | `node --check` on every `.js` under `joomla-site/` and `preview/` |
| `api` | `prisma validate` → `prisma generate` → `nest build` → ESLint |

The `api` job sets a dummy `DATABASE_URL` so Prisma can validate the schema
without a live database.

---

## 5. DNS / TLS

| Host | Purpose |
|---|---|
| `www` | Joomla public site |
| `api` | NestJS API |
| `book` / `plan` / `agents` | Vercel micro-apps |
| `cdn` | Static/media (S3/CloudFront or Cloudflare) |

Issue certificates with Let's Encrypt (Certbot) on the VPS; Vercel provisions TLS
automatically.

---

## Post-deploy checklist

- [ ] `https://api.<domain>/api/health` returns healthy.
- [ ] Each micro-app loads and reports the shared API as `up`.
- [ ] Joomla front page + a safari article render with real photos.
- [ ] Stripe and M-Pesa webhooks point at the live API URLs.
- [ ] `robots.txt` / sitemap resolve; no staging URLs leak.
