# Deployment

Adequate Safaris has three deployable surfaces. They map to different
hosts on purpose.

| Surface | Path | Recommended host | Notes |
|---|---|---|---|
| Joomla 5 (CMS + public site) | `joomla-site/` | VPS / Docker (PHP 8.3 + MySQL) | **Cannot run on Vercel** — PHP + MySQL |
| Shared API (NestJS + Prisma) | `api/` | Docker/VPS, Railway, Render (or Vercel serverless) | Needs a reachable MySQL/MariaDB |
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

## 2. API → Docker / VPS (or serverless)

Local / VPS with Docker:

```bash
cp .env.example .env               # fill in DATABASE_URL, JWT_SECRET, Stripe, M-Pesa
docker compose -f docker/docker-compose.yml up -d --build api
```

Database migrations + seed (run once per environment):

```bash
cd api
npx prisma migrate deploy          # apply migrations
npm run db:seed                    # sample safaris + test users (idempotent)
```

Requirements:

- `DATABASE_URL` (Prisma reads this exact name). MySQL/MariaDB.
  The schema uses `Json` columns (MySQL-compatible) — do **not** switch to
  Postgres without also changing the datasource provider.
- `JWT_SECRET`, Stripe and M-Pesa keys as per `.env.example`.

> **Vercel/serverless note:** NestJS can run on Vercel but Prisma + MySQL needs a
> serverless-friendly MySQL (e.g. PlanetScale) and connection pooling. If you go
> this route, deploy the API as its own Vercel project with Root Directory
> `api/`. Docker/VPS is the lower-risk default.

---

## 3. Joomla → Docker / VPS

```bash
docker compose -f docker/docker-compose.yml up -d db joomla nginx
```

- Image: `docker/Dockerfile.joomla` (PHP 8.3 + Apache + extensions + opcache).
- Reverse proxy / TLS: `docker/nginx/` (upstreams, SSL, HSTS, rate limits).
- Install the template by zipping `joomla-site/templates/adequate/` and uploading
  it via **System → Install → Extensions**, or drop it into the Joomla tree.
- Template params (contact details, social, micro-app URLs, colours) are set in
  **System → Site Templates → adequate → Options**.

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
