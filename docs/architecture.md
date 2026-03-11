# Architecture

## System Overview

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Frontend   │────▶│    API Server     │────▶│  Supabase        │
│  (React/Vite)│     │    (Fastify)      │     │  PostgreSQL      │
│  Port 3000   │     │    Port 3001      │     │  Port 5432       │
└─────────────┘     └────────┬─────────┘     └──────────────────┘
                             │
                    ┌────────┴─────────┐
                    │  External Services│
                    │  Stripe, Meta CAPI│
                    │  ActiveCampaign   │
                    └──────────────────┘
```

This is the **quiz/assessment** product. It shares a Supabase PostgreSQL instance with the [Harbor AI Assistant](https://github.com/tajciglar/adhd-parenting-ai-assistant). Quiz submissions are stored in Supabase-managed tables and can be auto-imported by the AI assistant on user signup.

## Tech Stack

### Frontend (`apps/web`) — Port 3000
- **React 19** + **Vite 7**
- **Tailwind CSS v4** — CSS-based `@theme` config (no `tailwind.config.ts`)
- **Framer Motion** — step transitions, staggered animations
- **react-router-dom** — client-side routing
- **Stripe.js** — payment integration
- **Vercel Analytics** — page view tracking

### API (`apps/api`) — Port 3001
- **Fastify 5** — HTTP server with rate limiting, CORS, Helmet
- **Prisma 6** — ORM and database migrations
- **Zod** — request validation
- **Stripe SDK** — checkout sessions, webhooks
- **@supabase/supabase-js** — admin client for quiz data storage

### Database
- **PostgreSQL 16** with pgvector (Docker locally, Supabase in production)
- Prisma manages schema and migrations
- Quiz submissions stored in Supabase `quiz_submissions` table
- Funnel events stored in Supabase `funnel_events` table

### External Services
- **Supabase** — database + auth
- **Stripe** — payment processing
- **ActiveCampaign** — email marketing
- **Meta Conversions API** — ad attribution

## User Flow

```
1. User lands on /onboarding (no account required)
   └─▶ Multi-step behavioral assessment

2. User completes all questions
   └─▶ POST /api/guest/submit
       └─▶ Score responses, match archetype, store in quiz_submissions

3. User sees results page with archetype
   └─▶ /results — sales page with trait summary

4. User clicks "Get Report"
   └─▶ /checkout — Stripe payment

5. Post-purchase
   └─▶ /thank-you — confirmation + report access
   └─▶ /report — detailed PDF report
```

No authentication required for the quiz flow. Email is captured during submission for follow-up marketing.

## Project Structure

```
adhd-parenting-quiz/
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── src/
│   │       ├── server.ts            # Fastify setup, CORS, routes
│   │       ├── plugins/
│   │       │   ├── prisma.ts        # PrismaClient plugin
│   │       │   └── supabase.ts      # Auth plugin
│   │       ├── routes/
│   │       │   ├── health.ts        # Health check
│   │       │   ├── guest.ts         # Quiz submission + results
│   │       │   ├── stripe.ts        # Payment processing
│   │       │   ├── report.ts        # PDF report generation
│   │       │   └── admin.ts         # Analytics (secret-key auth)
│   │       └── services/
│   │           ├── supabaseAdmin.ts  # Supabase admin client + analytics
│   │           ├── metaCapi.ts       # Meta Conversions API
│   │           └── pdf/              # PDF generation
│   │
│   └── web/
│       ├── index.html
│       ├── vite.config.ts
│       └── src/
│           ├── App.tsx              # Router: onboarding, results, checkout, report
│           ├── index.css            # Tailwind @theme (Harbor purple palette)
│           ├── lib/
│           │   ├── supabase.ts
│           │   ├── api.ts
│           │   └── constants.ts     # Question configs
│           ├── hooks/
│           │   ├── useAuth.ts
│           │   └── useOnboarding.ts # Quiz state management
│           └── components/
│               ├── onboarding/      # Multi-step quiz UI
│               │   └── questions/   # SingleSelect, MultiSelect, etc.
│               └── ui/              # Button, ProgressBar
│
├── packages/shared/                 # Trait scoring, archetypes, templates
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.dev
└── pnpm-workspace.yaml
```

## Data Storage

### Prisma Tables (PostgreSQL)
Standard user/profile tables managed by Prisma migrations. Used for authenticated features and knowledge base.

### Supabase Tables (direct)
- **quiz_submissions** — Raw quiz data: email, child info, trait scores, archetype ID, responses
- **funnel_events** — Analytics: step completions, conversions, timestamps

The AI assistant reads from `quiz_submissions` via Supabase admin client to auto-import quiz results on user signup.

## API Endpoints

### Guest (no auth)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/guest/submit` | Submit quiz, compute scores, store results |
| GET | `/api/guest/results/:id` | Fetch submission results |
| POST | `/api/guest/capture-email` | Capture email for marketing |

### Stripe
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/stripe/create-checkout` | Create Stripe checkout session |
| POST | `/api/stripe/webhook` | Handle payment events (raw body) |

### Report
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/report/:id` | Generate/serve PDF report |

### Admin (secret-key auth)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/analytics` | Funnel analytics dashboard data |

## Environment Variables

### API (`apps/api/.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection |
| `DIRECT_URL` | Yes | Direct PostgreSQL URL (Prisma) |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `STRIPE_PRICE_ID` | Yes | Stripe price ID for report product |
| `ACTIVECAMPAIGN_API_KEY` | No | ActiveCampaign API key |
| `ACTIVECAMPAIGN_BASE_URL` | No | ActiveCampaign API URL |
| `META_PIXEL_ID` | No | Meta Pixel ID |
| `META_ACCESS_TOKEN` | No | Meta Conversions API token |
| `ADMIN_SECRET_KEY` | Yes | Secret key for admin dashboard |
| `CORS_ORIGIN` | No | Allowed origins (default: localhost) |
| `PORT` | No | API port (default: 3001) |

### Frontend (`apps/web/.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key |
| `VITE_META_PIXEL_ID` | No | Meta Pixel ID |

## Deployment

### Local (Docker Compose)
```bash
docker compose up       # PostgreSQL + API with hot reload
pnpm run dev:web        # Frontend dev server
```

### Production
- **API:** Railway — Dockerfile builds, migrations on startup
- **Frontend:** Vercel — Static Vite build
- **Database:** Supabase PostgreSQL (shared with AI assistant)
