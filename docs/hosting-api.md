# Hosting the API (off Vercel)

We keep **one Vercel project** (the `booking` micro-app). The NestJS API runs
elsewhere because it needs a long-lived process and a MySQL database. The
recommended host is **Railway** (API + MySQL in a single dashboard).

Nothing here is domain-specific — any hostname works. When we have a final
domain we just point it at the service.

---

## Railway (recommended)

1. Create a project at <https://railway.app> → **New Project → Deploy from GitHub
   repo** → pick `adequatesafari`.
2. Open the service → **Settings → Source → Root Directory** = `api`.
   Railway reads [`api/railway.json`](../api/railway.json) for the build/start
   commands and health check (`/api/v1/health/live`).
3. Add the database: **New → Database → MySQL** (same project).
4. Set the API service variables (**Variables** tab):
   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | reference the MySQL service, e.g. `${{MySQL.MYSQL_URL}}` |
   | `JWT_SECRET` | a long random string (≥ 64 chars) |
   | `NODE_ENV` | `production` |
   | `CORS_ORIGINS` | your booking site origin (comma-separated) |
   | `JWT_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | `7d` / `30d` (optional) |
   | `STRIPE_*`, `MPESA_*` | optional — omit to leave payments disabled |
5. Deploy. Wait for the health check to pass.
6. Run the DB schema once (Railway service **Shell**, or locally against the
   same `DATABASE_URL`):
   ```bash
   npx prisma migrate deploy     # apply migrations
   npm run db:seed               # sample safaris + test users (idempotent)
   ```
7. Copy the service's public URL (e.g. `https://<name>.up.railway.app`).

### Point the booking app at it
In the **Vercel `booking` project → Settings → Environment Variables** set:
```
NEXT_PUBLIC_API_URL = https://<your-api-host>/api/v1
```
then redeploy. (Railway auto-deploys the API on every push to `main`.)

---

## Render (alternative)

Render works too, but it has **no managed MySQL** — you'd pair it with an
external MySQL (Aiven, Clever Cloud, PlanetScale). A Blueprint would be:

```yaml
services:
  - type: web
    name: adequatesafaris-api
    runtime: node
    rootDir: api
    buildCommand: npm ci && npx prisma generate && npm run build
    startCommand: npm run start:prod
    healthCheckPath: /api/v1/health/live
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: CORS_ORIGINS
        sync: false
```

---

## After the API is live

- Delete the old **`api` Vercel project** so only `booking` remains on Vercel.
- Remove the now-unused Vercel API env from CI (already done — `deploy-api.yml`
  only builds; it no longer deploys to Vercel).

## Notes

- Only `DATABASE_URL` and `JWT_SECRET` are required. Stripe, M-Pesa, Joomla sync,
  email, storage and analytics are optional and stay disabled until configured.
- The API listens on `PORT` (Railway injects it) at global prefix `/api`, URI
  version `v1` → e.g. `https://<host>/api/v1/...`, health at `/api/v1/health/live`.
