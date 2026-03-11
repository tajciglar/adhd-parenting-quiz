# Harbor — ADHD Parenting Quiz

Free behavioral assessment for parents of children with ADHD. Generates a personalized trait profile and archetype match, then offers a paid detailed report and upsell into the [Harbor AI Assistant](https://github.com/tajciglar/adhd-parenting-ai-assistant).

## How It Works

1. Parent completes a multi-step behavioral assessment (no account required)
2. Responses are scored across trait dimensions (e.g., focus, emotional regulation, social skills)
3. System matches the child to one of several behavioral archetypes
4. Parent sees a results/sales page with their child's archetype
5. Paid checkout (Stripe) unlocks a detailed PDF report
6. Quiz data is stored in Supabase for potential import into the AI assistant

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Frontend   │────▶│    API Server     │────▶│  Supabase        │
│  (React/Vite)│     │    (Fastify)      │     │  PostgreSQL      │
│  Port 3000   │     │    Port 3001      │     │  + quiz_submissions
└─────────────┘     └────────┬─────────┘     │  + funnel_events │
                             │                └──────────────────┘
                             │
                    ┌────────┴─────────┐
                    │  Stripe (payments)│
                    │  Meta CAPI (ads)  │
                    │  ActiveCampaign   │
                    └──────────────────┘
```

**Shared database:** This quiz and the [Harbor AI Assistant](https://github.com/tajciglar/adhd-parenting-ai-assistant) share the same Supabase PostgreSQL instance. When a quiz user later signs up for the AI chatbot, their quiz results are auto-imported.

## Quick Start

### Prerequisites

- Node.js 22+
- [pnpm](https://pnpm.io/) 10+
- Docker & Docker Compose

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

**API** — create `apps/api/.env`:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/adhd_assistant
DIRECT_URL=postgresql://postgres:postgres@localhost:5432/adhd_assistant

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# Email (ActiveCampaign)
ACTIVECAMPAIGN_API_KEY=your-key
ACTIVECAMPAIGN_BASE_URL=https://your-account.api-us1.com

# Analytics
META_PIXEL_ID=your-pixel-id
META_ACCESS_TOKEN=your-token

# Admin
ADMIN_SECRET_KEY=your-secret-key

# Server
CORS_ORIGIN=http://localhost:3000,http://localhost:3002,http://localhost:5173
HOST=0.0.0.0
PORT=3001
```

**Frontend** — create `apps/web/.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_META_PIXEL_ID=your-pixel-id
```

### 3. Start database + API

```bash
docker compose up
```

Starts PostgreSQL 16 (with pgvector) on port 5432 and the API on port 3001 with hot reload.

### 4. Start frontend

```bash
pnpm run dev:web
```

Vite dev server at **http://localhost:3000**.

### 5. Open the app

Visit [http://localhost:3000](http://localhost:3000). The quiz starts immediately — no account required.

## Project Structure

```
apps/
├── api/                   # Fastify API server
│   ├── prisma/            # Schema + migrations
│   └── src/
│       ├── routes/
│       │   ├── guest.ts   # Quiz submission, results, email capture
│       │   ├── stripe.ts  # Payment processing, webhooks
│       │   ├── report.ts  # PDF report generation
│       │   ├── admin.ts   # Analytics dashboard (secret-key auth)
│       │   └── health.ts  # Health check
│       └── services/
│           ├── supabaseAdmin.ts  # Supabase admin client + analytics
│           ├── metaCapi.ts       # Meta Conversions API
│           └── pdf/              # PDF report generation
├── web/                   # React frontend
│   └── src/
│       ├── components/
│       │   └── onboarding/  # Multi-step quiz UI
│       │       └── questions/  # SingleSelect, MultiSelect, etc.
│       ├── hooks/
│       │   └── useOnboarding.ts  # Quiz state management
│       └── lib/
│           └── constants.ts  # Question configs
packages/
└── shared/                # Trait scoring, archetypes, report templates
    └── src/
        ├── scoring.ts     # computeTraitProfile, matchArchetype
        ├── archetypes.ts  # Archetype definitions
        ├── categories.ts  # Assessment category configs
        └── templates.ts   # Report template rendering
```

## Frontend Routes

| Path | Description |
|------|-------------|
| `/onboarding` | Multi-step quiz (default entry point) |
| `/results` | Sales page with archetype reveal |
| `/checkout` | Stripe payment |
| `/report` | Detailed PDF report (post-purchase) |
| `/thank-you` | Post-purchase confirmation |
| `/admin` | Analytics dashboard (secret-key protected) |

## API Endpoints

### Guest (no auth required)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/guest/submit` | Submit quiz responses, compute scores |
| GET | `/api/guest/results/:id` | Get submission results |
| POST | `/api/guest/capture-email` | Capture email for follow-up |

### Stripe

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/stripe/create-checkout` | Create Stripe checkout session |
| POST | `/api/stripe/webhook` | Handle payment webhooks |

### Report

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/report/:id` | Generate PDF report |

### Admin

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/analytics` | Funnel analytics (secret-key auth) |

## Scoring System

The quiz collects responses across behavioral categories, then:

1. **Score each category** — Likert-scale responses mapped to numeric values
2. **Normalize scores** — Scale to 0-100 range with intensity labels
3. **Match archetype** — Find the closest behavioral archetype from predefined set
4. **Generate trait profile** — JSON with scores, archetype ID, and archetype metadata

This trait profile is stored in `quiz_submissions` and can be imported by the AI assistant.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `docker compose up` | Start PostgreSQL + API (dev) |
| `pnpm run dev:web` | Start frontend dev server |
| `pnpm run dev:api` | Start API without Docker |
| `pnpm run build:shared` | Build shared package |
| `pnpm run build:web` | Production frontend build |
| `pnpm run build:api` | Production API build |

## Tech Stack

- **Frontend:** React 19, Vite 7, Tailwind CSS v4, Framer Motion, Stripe.js
- **API:** Fastify 5, Prisma 6, Zod, Stripe SDK
- **Database:** PostgreSQL 16 (Supabase)
- **Payments:** Stripe Checkout
- **Email:** ActiveCampaign
- **Analytics:** Meta Conversions API, Vercel Analytics
- **PDF:** @react-pdf/renderer
- **Deployment:** Railway (API), Vercel (frontend)

## Related

- [Harbor AI Assistant](https://github.com/tajciglar/adhd-parenting-ai-assistant) — The AI chatbot that uses quiz results for personalized guidance
