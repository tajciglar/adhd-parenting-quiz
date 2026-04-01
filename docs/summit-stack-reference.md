# Summit / Course Checkout — Technical Stack Reference

Internal reference for developers building and extending checkout pages in this monorepo. Based on the production `adhd-parenting` checkout app.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Project Configuration (Source of Truth)](#2-project-configuration-source-of-truth)
3. [Payment Flow — End to End](#3-payment-flow--end-to-end)
4. [Stripe](#4-stripe)
5. [Brevo (Transactional Email)](#5-brevo-transactional-email)
6. [ActiveCampaign (CRM)](#6-activecampaign-crm)
7. [Bunny.net (CDN / PDF Storage)](#7-bunnynet-cdn--pdf-storage)
8. [Environment Variables](#8-environment-variables)
9. [Strapi Integration (Future)](#9-strapi-integration-future)
10. [Checklist: Adding a New Summit](#10-checklist-adding-a-new-summit)

---

## 1. Architecture Overview

```
monorepo/
  apps/
    checkout/   — Astro app, deployed on Vercel (SSR via @astrojs/vercel)
    api/        — Fastify API (separate service — NOT used by checkout payment flow)
```

The checkout app handles everything: static pages, API routes, Stripe webhooks. The Fastify `apps/api` service is for the quiz/backend and is unrelated to the checkout payment stack.

**Request path:**

```
Sales page → /checkout?project=...&email=...&childName=...&pdfUrl=...
           → CheckoutFlow (React, client-side)
           → /api/create-payment-intent  (Astro API route, server-side)
           → Stripe
           → /api/webhooks/stripe        (Astro API route, server-side)
           → Brevo (email) + ActiveCampaign (CRM)
           → /thank-you?email=...&childName=...
```

### URL Parameters

| Param | Required | Description |
|---|---|---|
| `project` | No (defaults to `adhd-parenting`) | Project ID, must match a key in `projects.ts` |
| `email` | No | Pre-fills the email field in the checkout form |
| `childName` | No | Used in order summary label and delivery email |
| `pdfUrl` | Yes (for delivery) | Bunny CDN URL of the main PDF to deliver post-purchase |
| `archetype` | No | Displayed in order summary label |
| `gender` | No | Passed through to thank-you page |

---

## 2. Project Configuration (Source of Truth)

**File:** `apps/checkout/src/config/projects.ts`

This is the only file that needs to change when adding a new project. No other files need to be touched.

### TypeScript Interfaces

```typescript
export interface BumpConfig {
  id: string               // slug, used in metadata and tags
  name: string
  stripePriceId: string
  regularPrice: number     // cents (displayed as crossed-out price)
  salePrice: number        // cents (charged amount)
  pdfUrl: string           // Bunny CDN URL — delivered via Brevo email
  image?: string           // path under /public/images/
  description: string      // supports \n\n for paragraph breaks
  bullets: string[]
  checkboxLabel: string    // CTA text on the bump checkbox
}

export interface ProjectConfig {
  id: string
  name: string
  stripePriceId: string
  price: number            // cents
  originalPrice?: number   // cents — shown as crossed-out if set
  bumps: BumpConfig[]
}
```

### Adding a Project

```typescript
'my-summit': {
  id: 'my-summit',
  name: 'My Summit Main Product',
  stripePriceId: 'price_xxx',
  price: 2700,
  originalPrice: 4900,
  bumps: [
    {
      id: 'bonus-workbook',
      name: 'Bonus Workbook',
      stripePriceId: 'price_yyy',
      regularPrice: 4700,
      salePrice: 900,
      pdfUrl: 'https://wcc-files.b-cdn.net/bonus-workbook.pdf',
      image: '/images/bonus-workbook.png',
      description: 'Short description.\n\nSecond paragraph.',
      bullets: ['Benefit one', 'Benefit two'],
      checkboxLabel: 'Yes! Add the Bonus Workbook to my order.',
    },
  ],
},
```

The `getProject(id)` helper falls back to `DEFAULT_PROJECT` if the ID is not found — set `DEFAULT_PROJECT` to the primary project.

---

## 3. Payment Flow — End to End

### Step-by-Step

1. `CheckoutFlow.tsx` mounts. Reads URL params (`email`, `childName`, `pdfUrl`, `archetype`, `gender`).
2. `StripeElementsCheckout` mounts inside `CheckoutFlow`. Immediately calls `/api/create-payment-intent` with the current `selectedBumpIds`, `project`, and whatever context is available (email may be empty at this point).
3. Stripe returns a `clientSecret`. The `<Elements>` provider and `<PaymentElement>` render.
4. User fills in their email, name, and card details. They may also toggle order bumps — each toggle re-creates the PaymentIntent (the `useEffect` dependency array includes `selectedBumpIds.join(',')`).
5. On form submit — **before** calling `stripe.confirmPayment()` — the client calls `/api/update-payment-intent` to write the current email and childName into the PaymentIntent metadata. This is critical because the email field is typed after the PI is created.
6. `stripe.confirmPayment()` fires with `redirect: 'if_required'`. On success, the client manually redirects to the return URL with `?payment_intent=...` appended.
7. Stripe fires `payment_intent.succeeded` webhook to `/api/webhooks/stripe`.
8. Webhook handler reads metadata, calls Brevo (email delivery) and ActiveCampaign (CRM tagging).

### Critical: Email Timing Bug

The PaymentIntent is created on component mount — before the user has typed anything. The email is only known at submit time. Always call `/api/update-payment-intent` immediately before `stripe.confirmPayment()`:

```typescript
const piId = clientSecret.split('_secret_')[0]
await fetch('/api/update-payment-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ paymentIntentId: piId, email: contact.email, childName }),
})
// THEN call stripe.confirmPayment()
```

If this step is skipped, the webhook receives a PaymentIntent with an empty `email` in metadata and no delivery email is sent.

---

## 4. Stripe

### Setup

- Use **PaymentIntents** (not Checkout Sessions). Full control over UI and metadata.
- Stripe API version: `2025-02-24.acacia` (pinned in `src/lib/stripe.ts`)
- One Stripe Price per product, one per bump. No dynamic price creation.

### API Routes

**`POST /api/create-payment-intent`**

- Calculates total: `project.price + sum(selectedBumps[].salePrice)`
- All pricing is from `projects.ts` config — no Stripe Price lookups at runtime
- Stores fulfillment data in metadata:

```typescript
metadata: {
  project: projectId,
  email,           // may be empty — updated before confirm
  childName,
  pdfUrl,
  selectedBumps: selectedBumpIds.join(','),   // comma-separated bump IDs
}
```

**`POST /api/update-payment-intent`**

- Accepts `{ paymentIntentId, email, childName }`
- Updates metadata with final email and childName
- Also sets `receipt_email` so Stripe sends its own receipt

### Webhook: `payment_intent.succeeded`

Handler at `apps/checkout/src/pages/api/webhooks/stripe.ts`.

**Getting billing details — use `latest_charge`, not `charges`:**

```typescript
// CORRECT
const expandedPi = await stripe.paymentIntents.retrieve(pi.id, {
  expand: ['latest_charge'],
})
const latestCharge = expandedPi.latest_charge as Stripe.Charge | null
const billingDetails = latestCharge?.billing_details

// WRONG — charges is deprecated
expand: ['charges']
```

**Email resolution order** (first non-empty wins):

```typescript
const email = pi.metadata.email
           || expandedPi.receipt_email
           || billingDetails?.email
           || ''
```

**Idempotency:** The handler maintains an in-memory `Set<string>` of processed event IDs to skip duplicates within the same serverless function instance. For persistent deduplication across cold starts, use a database or KV store.

**Webhook secret:** Must be set as `STRIPE_WEBHOOK_SECRET`. The signing secret from the Stripe CLI (`whsec_...` from `stripe listen`) differs from the production endpoint secret. Set the correct secret per environment in Vercel.

To register a new production endpoint: Stripe Dashboard → Developers → Webhooks → Add endpoint → event: `payment_intent.succeeded`.

---

## 5. Brevo (Transactional Email)

### Purpose

Delivers PDFs to the customer immediately after payment. Not used for marketing sequences (that is ActiveCampaign's role).

### API

```
POST https://api.brevo.com/v3/smtp/email
Headers: api-key: <BREVO_API_KEY>
```

### Email Content

Email HTML is built in code (`src/lib/brevo.ts`) — no Brevo template system is used. The email includes:

- A branded header with the product name
- A primary CTA button linking to `mainPdfUrl`
- A section for bump PDFs (rendered only if bumps were purchased)
- Support contact and money-back guarantee note

To customise for a new summit, update `sendDeliveryEmail` and `buildEmailHtml` in `brevo.ts` — or parameterise the subject and header copy by project.

### Sender Setup

1. Add and verify the sender domain/email in Brevo: **Settings → Senders & Domains**
2. Set `BREVO_SENDER_EMAIL` to a verified address
3. Set `BREVO_SENDER_NAME` to the display name (e.g. `"Strategic Parenting"`)

### Critical: Brevo IP Blocking

Vercel serverless functions use a rotating pool of outbound IPs. There is no static IP available on any Vercel plan. If Brevo's IP blocking is enabled, all emails from Vercel will be rejected.

**Fix: Deactivate IP blocking in Brevo.**
Brevo Dashboard → Security → Authorized IPs → Deactivate blocking.

This setting is account-level — one change covers all projects.

---

## 6. ActiveCampaign (CRM)

### Purpose

Marketing automation only — syncs contacts, subscribes to list, applies purchase tags. Not used for PDF delivery.

### Operations (in order, all in `src/lib/activecampaign.ts`)

1. **Create/update contact** — `POST /api/3/contact/sync`
2. **Subscribe to list** — `POST /api/3/contactLists` with `{ list, contact, status: 1 }`
3. **For each tag:** search → create if missing → apply

### Tag Naming Convention

Tags are applied in the webhook handler (`src/pages/api/webhooks/stripe.ts`):

```typescript
const tags = ['ADHD Personality Report']
if (selectedBumps.includes('anger-management')) tags.push('Bump: Anger Management')
if (selectedBumps.includes('adhd-game-plan'))   tags.push('Bump: ADHD Game Plan')
```

For new summits, add a block like this to `handlePaymentSucceeded`, keyed on `projectId`.

### Critical: Always Check `res.ok` Before `.json()`

ActiveCampaign returns HTTP 503 with an HTML body on rate limits and errors. Calling `.json()` on an HTML response throws and swallows the real error:

```typescript
// WRONG
const data = await res.json()

// CORRECT
if (!res.ok) {
  const body = await res.text()
  console.error('[AC] request failed:', res.status, body)
  return
}
const data = await res.json()
```

### Skipping Internal Addresses

The integration skips contacts whose email includes `@wecreatecourses` to avoid polluting the CRM with test purchases.

---

## 7. Bunny.net (CDN / PDF Storage)

### Storage Zone

- Zone name: `wcc-files` (shared across all projects — no per-summit zone needed)
- Pull zone hostname: `wcc-files.b-cdn.net`
- No custom hostname required

### PDF URL Format

```
https://wcc-files.b-cdn.net/<filename>.pdf
```

Keep filenames descriptive and unique across all projects (no directory structure is required, but you can use path prefixes if preferred):

```
https://wcc-files.b-cdn.net/anger-management-adventures-strategicparenting.pdf
https://wcc-files.b-cdn.net/the-adhd-game-plan-strategicparenting.pdf
```

### Uploading PDFs

Use the Bunny dashboard (Storage → wcc-files → Upload) or the Bunny Storage API. After uploading, paste the CDN URL into `projects.ts` as the `pdfUrl` for the relevant product or bump.

### Access

PDFs served via the CDN are publicly accessible by URL (no signed URLs are used). Keep URLs opaque enough that they are not guessable — do not use short or predictable filenames for paid content.

---

## 8. Environment Variables

Set in Vercel project settings (Settings → Environment Variables). All are required for production.

| Variable | Where Used |
|---|---|
| `STRIPE_SECRET_KEY` | All Stripe API calls (server-side) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification |
| `PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-side Stripe.js init |
| `BREVO_API_KEY` | Brevo SMTP API authentication |
| `BREVO_SENDER_EMAIL` | Must match a verified Brevo sender |
| `BREVO_SENDER_NAME` | Display name in From header |
| `AC_API_URL` | ActiveCampaign account API URL (e.g. `https://youracccount.api-us1.com`) |
| `AC_API_KEY` | ActiveCampaign API key |
| `AC_LIST_ID` | AC list ID to subscribe new purchasers to |

### Local Development

Use a `.env` file at `apps/checkout/.env` (not committed). For Stripe webhooks locally, use the Stripe CLI:

```bash
stripe listen --forward-to localhost:4321/api/webhooks/stripe
```

The CLI prints a local webhook signing secret (`whsec_...`). Set this as `STRIPE_WEBHOOK_SECRET` in your local `.env`. Do not use the local CLI secret in production.

---

## 9. Strapi Integration (Future)

When a CMS is needed to manage products without code deploys:

- Create a `Project` content type in Strapi with fields matching `ProjectConfig`
- Create a `Bump` component or relation for the bumps array
- Store `stripePriceId`, `pdfUrl` (Bunny URL), prices, and copy as Strapi fields
- At build time or request time, fetch from Strapi API and map to `ProjectConfig` shape
- Use Bunny as Strapi's upload provider, or keep Bunny separate and store just the CDN URL as a text field in Strapi

The `getProject()` function in `projects.ts` is the single call site to replace — swap it to fetch from Strapi and the rest of the checkout flow is unchanged.

Tags driven by Strapi: add a `acTags` field to the `Project` content type and read it in the webhook handler instead of hardcoding tag names.

---

## 10. Checklist: Adding a New Summit

### Stripe

- [ ] Create a Price for the main product (`price_xxx`)
- [ ] Create a Price for each bump product (`price_yyy`, `price_zzz`, ...)
- [ ] Note all Price IDs

### Bunny

- [ ] Upload the main product PDF to the `wcc-files` storage zone
- [ ] Upload each bump PDF to the `wcc-files` storage zone
- [ ] Note all CDN URLs (`https://wcc-files.b-cdn.net/...`)

### Code

- [ ] Add an entry to `apps/checkout/src/config/projects.ts` using the interfaces above
- [ ] Paste in all Stripe Price IDs and Bunny CDN URLs
- [ ] Add tag logic to the webhook handler (`src/pages/api/webhooks/stripe.ts`) — inside `handlePaymentSucceeded`, add a block for the new `projectId` that pushes appropriate AC tags
- [ ] If the delivery email subject/body is project-specific, parameterise `sendDeliveryEmail` in `src/lib/brevo.ts`

### Vercel / Deployment

- [ ] Confirm all environment variables are set (see Section 8)
- [ ] Deploy to Vercel
- [ ] Register a production webhook endpoint in Stripe Dashboard pointing to `https://<your-domain>/api/webhooks/stripe`, event: `payment_intent.succeeded`
- [ ] Copy the webhook signing secret from Stripe Dashboard and set it as `STRIPE_WEBHOOK_SECRET` in Vercel

### Brevo

- [ ] Confirm `BREVO_SENDER_EMAIL` is verified in Brevo
- [ ] Confirm IP blocking is deactivated (Brevo → Security → Authorized IPs)

### Test End-to-End

- [ ] Open `/checkout?project=<new-id>&email=test@example.com&childName=TestChild&pdfUrl=<encoded-url>`
- [ ] Complete a test payment with Stripe test card `4242 4242 4242 4242`
- [ ] Confirm redirect to `/thank-you`
- [ ] Confirm delivery email arrives with correct PDF links
- [ ] Confirm contact and tags appear in ActiveCampaign
- [ ] Test with one or more bumps selected

### Link

- [ ] Update the sales page CTA to link to `/checkout?project=<new-id>&email=...&childName=...&pdfUrl=...`
