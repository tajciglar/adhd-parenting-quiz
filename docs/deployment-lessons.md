# Deployment Lessons Learned

Issues encountered during the first Vercel + Railway + Supabase deployment, and how they were fixed.

---

## 1. CORS — Missing `https://` Protocol

**Symptom:** Browser console shows `Access-Control-Allow-Origin header contains invalid value 'example.vercel.app'`

**Root cause:** The `CORS_ORIGIN` environment variable on Railway was set to `adhd-ai-assistant-web.vercel.app` without the `https://` prefix. The browser requires the origin header to include the full protocol.

**Fix:** Set `CORS_ORIGIN` to `https://adhd-ai-assistant-web.vercel.app`. We also added a safety net in `server.ts` that auto-prepends `https://` if the protocol is missing.

**Rule:** Environment variables for URLs/origins must always include the protocol (`https://`).

---

## 2. Vercel SPA Routing — 404 on Client-Side Routes

**Symptom:** Navigating directly to `/onboarding` or `/chat` returns a 404 page from Vercel.

**Root cause:** Vercel serves static files. When a user navigates to `/onboarding`, Vercel looks for an actual file at that path. Since this is a Single Page Application (SPA) where React Router handles routing client-side, there's no file at `/onboarding` — only `index.html` at the root.

**Fix:** Added a rewrite rule in `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This tells Vercel to serve `index.html` for all routes, letting React Router handle the routing.

**Rule:** Every SPA deployed to Vercel needs this rewrite. Without it, only the root `/` path works — all other routes 404.

---

## 3. Vercel Monorepo — Output Directory Not Found

**Symptom:** Vercel build succeeds but deployment fails with `No Output Directory named "dist" found`.

**Root cause:** In a monorepo, Vite outputs to `apps/web/dist`, but Vercel looks for `dist` at the root by default.

**Fix:** Created `vercel.json` at the project root:
```json
{
  "buildCommand": "pnpm run build:shared && pnpm --filter web build",
  "outputDirectory": "apps/web/dist",
  "installCommand": "pnpm install",
  "framework": "vite"
}
```

**Rule:** For monorepos, always set `outputDirectory` to the actual path of the build output (e.g., `apps/web/dist`).

---

## 4. Shared Package Not Built — `dist/` Missing

**Symptom:** Vite fails with `Failed to resolve entry for package "@adhd-ai-assistant/shared"`. The package.json points to `dist/index.js` but the `dist/` folder doesn't exist.

**Root cause:** `packages/shared` is a TypeScript package that compiles to `dist/`. In development and CI, it needs to be built before consumers (web, api) can use it.

**Fix:** Updated root `package.json` scripts to auto-build shared before starting dev servers:
```json
{
  "build:shared": "pnpm --filter @adhd-ai-assistant/shared build",
  "dev:api": "pnpm run build:shared && pnpm --filter @adhd-ai-assistant/api dev",
  "dev:web": "pnpm run build:shared && pnpm --filter web dev"
}
```

Also updated `vercel.json` buildCommand and `Dockerfile.dev` to include shared build step.

**Rule:** When a workspace package compiles to `dist/`, ensure it's built before consumers run. Add it to dev scripts, CI, and Docker builds.

---

## 5. Docker — pgvector Extension Missing

**Symptom:** Prisma migration fails with `ERROR: could not open extension control file "/usr/share/postgresql/16/extension/vector.control"`.

**Root cause:** The `postgres:16-alpine` Docker image doesn't include the pgvector extension. The migration creates a `vector` column for RAG knowledge chunks.

**Fix:** Changed the Docker Compose database image from `postgres:16-alpine` to `pgvector/pgvector:pg16`.

**Rule:** If your schema uses pgvector, use the `pgvector/pgvector` Docker image. On Supabase, enable the extension via Dashboard → SQL Editor → `CREATE EXTENSION IF NOT EXISTS vector;`.

---

## 6. Production Dockerfile — Missing Prisma Migrations

**Symptom:** API starts but database schema is out of date. New tables/columns don't exist.

**Root cause:** The production Dockerfile `CMD` only started the API server but didn't run pending migrations.

**Fix:** Changed the CMD to run migrations before starting:
```dockerfile
CMD ["sh", "-c", "cd apps/api && npx prisma migrate deploy && cd /app && pnpm --filter @adhd-ai-assistant/api start"]
```

**Rule:** Production containers should run `prisma migrate deploy` on startup, before the app starts. This applies pending migrations without prompting.

---

## 7. Slow API Response Times (4+ seconds)

**Symptom:** "Waiting for server response" takes 4.55 seconds per onboarding save.

**Root causes (multiple):**

### a) Auth token verified on every request
The `authenticate` middleware called `supabase.auth.getUser(token)` on every API request — a network round-trip to Supabase's auth servers each time.

**Fix:** Added a 60-second in-memory cache for verified tokens in `supabase.ts`. After the first verification, subsequent requests with the same token skip the Supabase call.

### b) Too many sequential DB queries per save
Each onboarding PATCH triggered 4-5 queries sequentially: find user → find profile with children → maybe create records → update child → refetch profile for response.

**Fix:**
- Used `upsert` + `$transaction` for profile creation (1 query instead of 3 on first load)
- Removed the redundant refetch after update — built the response from in-memory data
- Used `Promise.all()` to run parent + child updates in parallel

### c) Frontend calling `getSession()` on every API request
The `api.ts` helper called `supabase.auth.getSession()` before every fetch.

**Fix:** Added a 30-second client-side cache for the auth token, invalidated on auth state changes.

### d) No code splitting
All route components (Auth, Onboarding, Chat, Admin) loaded upfront in a single bundle.

**Fix:**
- Added `React.lazy()` + `Suspense` for route-level code splitting
- Added Vite `manualChunks` to split react/supabase into separate vendor bundles

**Rule:** Cache auth tokens (both client and server side). Minimize DB round-trips per request. Use `Promise.all()` for independent queries. Code-split routes.

---

## 8. Railway Cold Starts — Slow First Request

**Symptom:** First request after a period of inactivity takes 1-4+ seconds, even for a simple OPTIONS preflight (350ms+).

**Root cause:** Railway sleeps idle services to save resources. When a request comes in, it has to wake up the container (cold start), which adds significant latency.

**Fix:**
- Set `sleepApplication = false` in `railway.toml` to keep the service always awake
- Added `maxAge: 3600` to CORS config so browsers cache preflight responses for 1 hour (fewer OPTIONS requests)
- Excluded OPTIONS requests from rate limiter (`allowList`) since they don't need it

**Rule:** For production APIs that need fast responses, disable Railway sleep. The tradeoff is slightly higher cost but eliminates cold start latency.

**Note:** If you're on Railway's free/hobby tier, sleeping may be forced. In that case, you can set up an external cron job (e.g., UptimeRobot, cron-job.org) to ping `/health` every 5 minutes to keep the service warm.

---

## 9. Region Mismatch — API and Database on Different Continents

**Symptom:** Every API request takes 2-5+ seconds despite optimized code. Even simple queries are slow.

**Root cause:** Railway (API server) was deployed in **Asia** while Supabase (database) was in **EU West**. Every database query had to travel across continents (~250ms round-trip per query). With 2-3 queries per request + auth verification, this added 1-3+ seconds of pure network latency.

**Fix:** Changed Railway region to EU West to match Supabase. Request times dropped from 2-5s to ~100-300ms.

**Rule:** Always deploy your API server in the same region as your database. This is the single biggest performance factor for any web app. Check regions before deploying:
- Supabase: Dashboard → Settings → General → Region
- Railway: Service → Settings → Region
- Vercel: Automatically uses CDN, but serverless functions use the region you set

---

## Environment Variables Checklist

### Vercel (Frontend)
| Variable | Example | Notes |
|----------|---------|-------|
| `VITE_API_URL` | `https://your-app-api-production.up.railway.app` | Must include `https://`. Baked into JS bundle at build time. |
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | From Supabase dashboard |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` | From Supabase dashboard |

### Railway (API)
| Variable | Example | Notes |
|----------|---------|-------|
| `DATABASE_URL` | `postgresql://...` | Supabase connection string (Settings → Database → Connection string → URI) |
| `SUPABASE_URL` | `https://xxx.supabase.co` | Same as frontend |
| `SUPABASE_ANON_KEY` | `eyJ...` | Same as frontend |
| `CORS_ORIGIN` | `https://your-app-web.vercel.app` | **Must include `https://`** |
| `OPENAI_API_KEY` | `sk-...` | For AI chat responses |
| `NODE_ENV` | `production` | Set automatically by Railway |
| `PORT` | (auto) | Railway assigns this automatically |

### Supabase
- Enable pgvector: SQL Editor → `CREATE EXTENSION IF NOT EXISTS vector;`
- Auth: Email/password enabled, no OAuth providers needed

---

## Deployment Flow

1. Push to `main` → Vercel auto-deploys frontend, Railway auto-deploys API
2. Railway runs `Dockerfile` → builds → runs `prisma migrate deploy` → starts server
3. Vercel runs `vercel.json` buildCommand → outputs to `apps/web/dist`
4. Frontend hits API via `VITE_API_URL` env var
5. API authenticates via Supabase, queries Supabase PostgreSQL via Prisma
