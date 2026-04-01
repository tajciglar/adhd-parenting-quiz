# Production Checklist — ADHD Parenting Quiz Checkout Flow

**Audit date:** 2026-04-01
**Branch:** `test/astro-checkout`
**Audited files:** `apps/web` (OnboardingPage, EmailCaptureScreen, SalesPage, api.ts), `apps/api` (server.ts, guest.ts), `apps/checkout` (CheckoutFlow, StripeElementsCheckout, create-payment-intent, update-payment-intent, webhooks/stripe, brevo.ts, activecampaign.ts, supabase.ts, projects.ts, checkout.astro, thank-you.astro)

---

## Section 1: Flow Audit — Issues Found

### 🔴 CRITICAL (will break in production)

---

#### CRITICAL-1: `/api/guest/submit` is never called — `pdfUrl` is always empty

**Where:** `apps/web/src/components/onboarding/OnboardingPage.tsx` — the `onSubmit` callback for `EmailCaptureScreen` (lines 145–165)

**What it is:**
The architecture doc says "Email capture → `OnboardingPage.tsx` calls `/api/guest/submit` (3 retries) → saves to `quiz_submissions`, generates PDF, returns `pdfUrl` → stored in `sessionStorage`". This call **does not exist** in the code. The `onSubmit` callback only stores data in `sessionStorage` and calls `navigate("/results")`. There is no `api.post("/api/guest/submit", ...)` anywhere in the web app.

**Impact:**
- `sessionStorage.getItem("wildprint_pdfUrl")` in `SalesPage.tsx` (line 314) always returns `""` (empty string).
- `pdfUrl` passed to the Astro checkout URL is always empty.
- `create-payment-intent` stores `pdfUrl: ""` in PaymentIntent metadata.
- The webhook falls through to the Supabase fallback (`getPdfUrlByEmail`).
- The Supabase fallback can only work if data was inserted into `quiz_submissions` from somewhere — but since `guest/submit` is never called, `quiz_submissions` will also be empty for new users.
- Result: webhook finds no pdfUrl, **skips the Brevo delivery email entirely** → users pay but receive no report.

**Suggested fix:**
Add the `/api/guest/submit` call to the `onSubmit` callback in `OnboardingPage.tsx`, before `navigate("/results")`. Store the returned `pdfUrl` in `sessionStorage` under `wildprint_pdfUrl`. Implement 3 retries with exponential backoff. Handle the `409 already_submitted` case by reading `pdfUrl` from the response body.

---

#### CRITICAL-2: `VITE_CHECKOUT_URL` on Railway still points to WooCommerce

**Where:** `apps/web` Railway environment variable

**What it is:**
`SalesPage.tsx` line 316 reads `import.meta.env.VITE_CHECKOUT_URL`. If this env var is unset (which it is on `main`, per the known context), the buy button calls `navigate("/thank-you")` (the web app's internal /thank-you, not the checkout flow). If it points to WooCommerce, users will land on the old WooCommerce checkout instead of the Astro checkout.

**Impact:**
The entire Astro checkout flow is bypassed in production. Users either hit WooCommerce or an internal thank-you page with no payment taken.

**Suggested fix:**
Set `VITE_CHECKOUT_URL=https://quiz-checkout.vercel.app/checkout` on Railway for the `apps/web` service before going live.

---

#### CRITICAL-3: In-memory deduplication set in webhook handler leaks memory and does nothing across requests

**Where:** `apps/checkout/src/pages/api/webhooks/stripe.ts` line 9

**What it is:**
```ts
const processedEvents = new Set<string>()
```
This `Set` lives in the module scope of a Vercel serverless function. In serverless environments, each invocation may run in a separate container — the `Set` is never shared across invocations and resets to empty on every cold start. It offers no real idempotency protection against duplicate webhook delivery and will grow unbounded in warm container instances.

**Impact:**
- Stripe retries webhooks on non-2xx responses (or network errors). If the same `payment_intent.succeeded` fires twice in quick succession in the same warm container, deduplication works. But across cold starts (the typical case), the same event will be processed twice — sending two delivery emails and applying tags twice. Tag duplication is harmless but the double Brevo email is a user-facing problem.
- Over time, if a container stays warm and processes many events, the `Set` grows unbounded.

**Suggested fix:**
Use a persistent store for idempotency (e.g., a Supabase `processed_webhook_events` table with the event ID as a unique key, inserted before processing, with a DB-level unique constraint to reject duplicates). Alternatively, make the Brevo call and AC call idempotent by checking whether a `purchase_completed` record already exists for the PaymentIntent ID before processing.

---

#### CRITICAL-4: `update-payment-intent` overwrites all existing metadata with only `email` and `childName`

**Where:** `apps/checkout/src/pages/api/update-payment-intent.ts` lines 26–29

**What it is:**
```ts
await stripe.paymentIntents.update(paymentIntentId, {
  metadata: { email, childName },
  ...
})
```
Stripe's `metadata` update is a **full replace** — any metadata key not included in the update payload is deleted. When `update-payment-intent` is called before payment confirmation, it overwrites the PaymentIntent metadata with only `{ email, childName }`, deleting `project`, `pdfUrl`, and `selectedBumps` that were stored in `create-payment-intent`.

**Impact:**
The webhook handler reads `pi.metadata.project`, `pi.metadata.pdfUrl`, and `pi.metadata.selectedBumps` — all will be empty strings after the update. This means:
- Bump tags are never applied in AC (`selectedBumps` is empty).
- `pdfUrl` from the PI metadata is lost (though the Supabase fallback would kick in, but only if CRITICAL-1 is also fixed).
- `project` defaults to `'adhd-parenting'` which is fine for now, but will break when multiple projects are added.

**Suggested fix:**
Fetch the existing metadata first, then merge, passing the complete merged object to `stripe.paymentIntents.update`. Alternatively, only update specific fields by passing the full original metadata alongside the new values.

---

#### CRITICAL-5: Express Checkout (Apple Pay / Google Pay) skips the `update-payment-intent` call

**Where:** `apps/checkout/src/components/checkout/StripeElementsCheckout.tsx` lines 115–142 (`onConfirm` handler for `ExpressCheckoutElement`)

**What it is:**
The `handleSubmit` function for the standard card form calls `/api/update-payment-intent` to sync `email` and `childName` into PI metadata before confirming. The `onConfirm` handler for `ExpressCheckoutElement` (Apple Pay / Google Pay) calls `stripe.confirmPayment` directly without calling `update-payment-intent`.

**Impact:**
For Apple Pay / Google Pay users, the PaymentIntent metadata will contain only whatever was passed at creation time from URL params. If the user changed their email in the form, it won't be synced. More critically, combined with CRITICAL-4, if standard card flow overwrites metadata, the same concern applies to express flow but without even the email sync.

**Suggested fix:**
Add the `update-payment-intent` call inside `onConfirm`, using the email from `event.billingDetails?.email ?? contact.email`, before calling `stripe.confirmPayment`.

---

### 🟡 MEDIUM (edge cases that will affect some users)

---

#### MEDIUM-1: Race condition between `update-payment-intent` and `stripe.confirmPayment`

**Where:** `apps/checkout/src/components/checkout/StripeElementsCheckout.tsx` lines 58–78

**What it is:**
The `update-payment-intent` call uses `.catch(() => {})` — it is non-blocking. If this call fails silently (network timeout, Stripe API error), `stripe.confirmPayment` still proceeds with stale metadata. Combined with CRITICAL-4 (metadata overwrite), a race condition exists: Stripe could capture the charge while the metadata update is still in flight or has failed, and the webhook fires before the metadata is fully settled.

**Impact:**
Under poor network conditions or Stripe rate limits, the delivery email may fire with missing `email` or `childName` fields in metadata. The Supabase fallback covers `pdfUrl` but not `email` or `childName`.

**Suggested fix:**
`await` the `update-payment-intent` call and handle the error by showing a soft warning (not blocking payment). Use `await` with a timeout rather than a fire-and-forget `.catch(() => {})`.

---

#### MEDIUM-2: `pdfUrl` passed via URL query string — tamper risk

**Where:** `apps/web/src/components/SalesPage.tsx` lines 318–332 and `apps/checkout/src/pages/api/create-payment-intent.ts` lines 38–45

**What it is:**
The `pdfUrl` (which is a signed Railway URL) is passed as a plain query parameter in the redirect URL to the Astro checkout. Any user can modify this URL to substitute any arbitrary `pdfUrl` (e.g., a different user's signed PDF URL if they can construct one).

**Impact:**
Low risk since the PDF URL is already HMAC-signed at the Railway API level — a tampered URL would fail the signature check. However, if an attacker has a valid signed URL for any report (e.g., from their own submission), they could purchase and receive a different person's report. This is a medium risk because the signed URLs are deterministic (same archetypeId + childName + secret = same URL).

**Suggested fix:**
Validate the `pdfUrl` in `create-payment-intent` to confirm it starts with the known Railway API base URL. Optionally, bind the `pdfUrl` to the email address at generation time.

---

#### MEDIUM-3: `already_submitted` 409 response — pdfUrl written to sessionStorage but `wildprint_pdfUrl` is never read on retry

**Where:** Architecture description says "409 returns existing pdfUrl from DB", but since the API call is never made (CRITICAL-1), this path never executes. When CRITICAL-1 is fixed, the 409 pdfUrl returned must be stored in sessionStorage before navigate, or the user who re-submits will still have no pdfUrl.

**Impact:**
Returning users (who re-do the quiz with the same email) will hit 409, but if the pdfUrl from the 409 response is not stored in sessionStorage, they'll proceed to checkout with an empty pdfUrl. The Supabase fallback will then be the only recovery path.

**Suggested fix:**
Ensure the 409 handler stores `response.pdfUrl` into `sessionStorage.setItem("wildprint_pdfUrl", pdfUrl)` before navigating to results.

---

#### MEDIUM-4: Thank-you page has no payment confirmation — users can access it directly

**Where:** `apps/checkout/src/pages/thank-you.astro` lines 1–59

**What it is:**
The thank-you page only reads `childName`, `email`, and `gender` from URL query parameters. There is no check that a payment actually succeeded (e.g., verifying a `payment_intent` query param against Stripe). Anyone can navigate to `/thank-you?childName=Test&email=test@test.com` and see the success screen.

**Impact:**
Technically, no harm done — the delivery email only fires from the webhook on confirmed payment. However, this means users who abandon at the Stripe card entry form can accidentally land on a thank-you-looking page if they manually type the URL or if a browser history redirect occurs. More importantly, there's no server-side confirmation that the user actually paid before showing "your report is on its way".

**Suggested fix:**
Read `payment_intent` from URL params (Stripe appends this after redirect). Make a lightweight Stripe PI retrieval call (or pass a hash/token) to confirm `status === 'succeeded'` before rendering the thank-you content, or at minimum show a generic "processing" message and redirect only after webhook confirmation.

---

#### MEDIUM-5: `CheckoutFlow` re-creates a new PaymentIntent every time `selectedBumpIds` changes

**Where:** `apps/checkout/src/components/checkout/StripeElementsCheckout.tsx` lines 304–325, dependency array line 325

**What it is:**
The `useEffect` that calls `create-payment-intent` has `[selectedBumpIds.join(','), project, email, childName, pdfUrl]` as its dependency array. Every time a user checks or unchecks an order bump, a new PaymentIntent is created. The old PaymentIntent is abandoned (never cancelled). The `cancelled` flag prevents the UI from accepting stale responses, but abandoned PIs accumulate in the Stripe dashboard.

**Impact:**
- Stripe dashboard will be cluttered with many cancelled/abandoned PaymentIntents.
- Rate limiting: if a user toggles bumps rapidly, multiple API calls fire in quick succession.
- Stripe charges are not created until `confirmPayment` is called, so there is no financial risk, but abandoned PIs count against Stripe's API rate limits.

**Suggested fix:**
Use Stripe's `paymentIntents.update` to change the amount when bumps are toggled, rather than creating a new PI each time. The initial PI is created on mount; subsequent bump changes call an update endpoint.

---

#### MEDIUM-6: Supabase client instantiated on every webhook invocation (no singleton)

**Where:** `apps/checkout/src/lib/supabase.ts` lines 3–12

**What it is:**
`getSupabase()` calls `createClient(url, key)` every time it is called. In a serverless context this may or may not reuse a connection pool depending on the Supabase SDK version, but there is no module-level singleton. This could result in excessive TCP connections.

**Impact:**
Low performance risk in serverless (connections are short-lived anyway), but a consistent pattern with `getStripe()` (which does cache via `_stripe`) would be safer.

**Suggested fix:**
Add a module-level singleton like `getStripe` does, or use `createClient` with the `auth: { persistSession: false }` option at minimum.

---

#### MEDIUM-7: `childName` defaulted to `'your child'` in webhook if missing from metadata

**Where:** `apps/checkout/src/pages/api/webhooks/stripe.ts` line 68

**What it is:**
```ts
const childName = pi.metadata.childName || 'your child'
```
Due to CRITICAL-4 (metadata overwrite), `childName` will always be present from `update-payment-intent`. But if `update-payment-intent` failed silently (MEDIUM-1), the webhook would use `'your child'` as the name in the delivery email, producing a generic/impersonal email instead of the personalised one.

**Impact:**
The delivery email subject and heading would say "your child's ADHD Personality Report" instead of the actual child's name. Poor user experience.

**Suggested fix:**
This is a downstream effect of CRITICAL-4 and MEDIUM-1. Fix those first. Additionally, expand `billing_details.name` fallback to extract a possible first name as secondary fallback.

---

#### MEDIUM-8: AC tag search uses `?search=` which is a partial match

**Where:** `apps/checkout/src/lib/activecampaign.ts` lines 80–89 and `apps/api/src/routes/guest.ts` lines 162–196

**What it is:**
ActiveCampaign's `/api/3/tags?search=` endpoint does a **prefix/partial match**, not an exact match. The code then does a second exact-match filter: `tagSearchData.tags.find(t => t.tag === tagName)`. This is correct, but if there are many tags in the account with similar names (e.g., "Bump: Anger Management" and "Bump: Anger Management Adventures"), the partial match could return up to 20 results (AC default limit), and the tag might not be in the result set if the account has many matching tags and the correct one is beyond page 1.

**Impact:**
If the AC account has many tags with similar prefixes, the intended tag might not be found in the first 20 results, leading to a duplicate tag being created rather than the existing one being reused.

**Suggested fix:**
After searching, if the exact tag is not found, create it — this is already handled. But add `&limit=100` to the search query to reduce the chance of missing the existing tag.

---

#### MEDIUM-9: No CORS headers on Astro API routes — Stripe webhook could fail from non-Vercel IPs

**Where:** `apps/checkout/astro.config.mjs` and Astro API routes

**What it is:**
No CORS configuration is visible in the Astro config or API route handlers. The Stripe webhook endpoint does not need CORS headers (it's server-to-server), but the `create-payment-intent` and `update-payment-intent` routes are called from the browser (from the same Vercel domain), so same-origin applies and no CORS is needed. However, if the checkout is ever loaded cross-origin (e.g., in an iframe), this will break.

**Impact:**
Low risk for current architecture. Noted for completeness.

---

### 🟢 MINOR (nice to have)

---

#### MINOR-1: Bump `stripePriceId` fields exist in config but are never used

**Where:** `apps/checkout/src/config/projects.ts` lines 19, 48, 55

**What it is:**
`BumpConfig` and `ProjectConfig` have `stripePriceId` fields, but `create-payment-intent` calculates amounts directly from `salePrice` in cents — it never uses Stripe Price IDs. This is intentional (simpler), but the unused fields add confusion.

**Suggested fix:**
Either remove the `stripePriceId` fields from the config or add a comment explaining why they're included (e.g., for future subscription/invoice use).

---

#### MINOR-2: `CountdownTimer` in SalesPage uses `sessionStorage` for persistence but timer has no visual indication when expired

**Where:** `apps/web/src/components/SalesPage.tsx` lines 23–73

**What it is:**
When the 10-minute timer reaches zero, it stops updating but the UI doesn't communicate that the offer has "expired" (e.g., by hiding the countdown, showing a message, or locking the price). The CTA button and pricing remain unchanged.

**Suggested fix:**
On `timeLeft === 0`, update the countdown bar to show "Offer expired" or similar. This improves conversion integrity.

---

#### MINOR-3: `returnUrl` is built before user can change email in checkout form

**Where:** `apps/checkout/src/components/checkout/CheckoutFlow.tsx` lines 92–101

**What it is:**
`returnUrl` is computed once from `params.email` at render time. If the user changes their email in the `CheckoutForm`, the updated email is not reflected in the `returnUrl` (which is passed to `stripe.confirmPayment` as `return_url`). The thank-you page therefore shows the original pre-filled email.

**Suggested fix:**
Pass a callback or state updater from `CheckoutForm` back up to `CheckoutFlow` to allow `returnUrl` to be updated when the email field changes, or omit email from the return URL and instead read it from PI metadata on the thank-you page.

---

#### MINOR-4: `OnboardingPage.tsx` comment refers to "3 retries" and `/api/guest/submit` which do not exist

**Where:** Architecture description and code comments

**What it is:**
The flow description (and implied comment "pdfUrl is already in sessionStorage from email capture step" in `SalesPage.tsx` line 313) refers to an API call that was never implemented. The comment is misleading.

**Suggested fix:**
Once the API call is implemented (see CRITICAL-1), update the comment to accurately describe the retry logic.

---

#### MINOR-5: Brevo email HTML contains hard-coded support email

**Where:** `apps/checkout/src/lib/brevo.ts` line 103

**What it is:**
`info@adhdparenting.com` is hard-coded in the email HTML. If the support address changes, it must be updated in code.

**Suggested fix:**
Move the support email to an environment variable or the project config.

---

#### MINOR-6: `getProject` silently falls back to DEFAULT_PROJECT for unknown project IDs

**Where:** `apps/checkout/src/config/projects.ts` lines 105–108

**What it is:**
```ts
const project = PROJECTS[id] ?? PROJECTS[DEFAULT_PROJECT]
```
If an unknown `project` param is passed (typo, old bookmark, etc.), the user silently sees the default project's checkout instead of an error.

**Suggested fix:**
Log a warning when falling back, or return an error if the project is unknown and the caller is an API route (to make configuration mistakes visible quickly).

---

#### MINOR-7: `thank-you.astro` uses JSX comment syntax `{/* */}` inside Astro templates

**Where:** `apps/checkout/src/pages/thank-you.astro` lines 15, 43

**What it is:**
Lines like `{/* Success card */}` use JSX comment syntax. In Astro's template syntax, comments should use `<!-- -->`. JSX comments inside `{}` evaluate to a string `undefined` in Astro's renderer, which may or may not produce visible output depending on the Astro version. This is cosmetic but could surface as literal text in some Astro versions.

**Suggested fix:**
Replace `{/* ... */}` with `<!-- ... -->` in `.astro` files.

---

## Section 2: Production Checklist

### Stripe

- [ ] **Stripe** Confirm that `STRIPE_SECRET_KEY` on Vercel is the **live** key (starts with `sk_live_`), not the test key
- [ ] **Stripe** Confirm that `PUBLIC_STRIPE_PUBLISHABLE_KEY` on Vercel is the **live** publishable key (starts with `pk_live_`)
- [ ] **Stripe** Register the live Stripe webhook endpoint: `https://quiz-checkout.vercel.app/api/webhooks/stripe` — event: `payment_intent.succeeded`
- [ ] **Stripe** Copy the live webhook signing secret from the Stripe dashboard into `STRIPE_WEBHOOK_SECRET` on Vercel
- [ ] **Stripe** Confirm both bump `stripePriceId` values in `projects.ts` correspond to live Stripe prices (or remove the fields if unused)
- [ ] **Stripe** Enable Apple Pay domain verification for `quiz-checkout.vercel.app` in the Stripe dashboard (required for Apple Pay to show in `ExpressCheckoutElement`)
- [ ] **Stripe** Test a full payment with a real card in live mode before public launch (not just test mode)
- [x] **Stripe** Fix CRITICAL-4: `update-payment-intent.ts` now merges metadata — fixed ✅

### Vercel (apps/checkout)

- [ ] **Vercel** Set all required env vars in the Vercel project for `apps/checkout`:
  - `STRIPE_SECRET_KEY` (live)
  - `STRIPE_WEBHOOK_SECRET` (live webhook secret)
  - `PUBLIC_STRIPE_PUBLISHABLE_KEY` (live)
  - `BREVO_API_KEY`
  - `BREVO_SENDER_EMAIL`
  - `BREVO_SENDER_NAME`
  - `AC_API_URL`
  - `AC_API_KEY`
  - `AC_LIST_ID`
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_KEY`
- [ ] **Vercel** Confirm `trailingSlash: 'never'` in `astro.config.mjs` is deployed (prevents Stripe webhook 301 redirect loop)
- [ ] **Vercel** Verify the Vercel deployment domain matches the webhook endpoint registered in Stripe (`quiz-checkout.vercel.app`)
- [ ] **Vercel** Confirm the Vercel project is deploying from the `test/astro-checkout` branch, not `main`
- [ ] **Vercel** Test that `/api/webhooks/stripe` returns 200 to a Stripe CLI `stripe trigger payment_intent.succeeded` test event on the deployed URL

### Railway (apps/web + apps/api)

- [ ] **Railway** Set `VITE_CHECKOUT_URL=https://quiz-checkout.vercel.app/checkout` on the `apps/web` Railway service — **this is the switch that routes live traffic to the new checkout**
- [ ] **Railway** Confirm `CORS_ORIGIN` on `apps/api` includes the Astro checkout domain if any cross-origin calls are made from `quiz-checkout.vercel.app` to the Railway API (currently not needed — web app only calls its own API — but verify)
- [ ] **Railway** Confirm `API_BASE_URL` on `apps/api` is set to the live Railway URL (used to construct `pdfUrl` in `generatePdfUrl`)
- [ ] **Railway** Confirm `PDF_SIGNING_SECRET` on `apps/api` is set to a strong random value (not the default `'dev-secret'`)
- [x] **Railway** CRITICAL-1 fixed: `OnboardingPage.tsx` synced from main with full submit+retry logic ✅

### ActiveCampaign

- [ ] **ActiveCampaign** Confirm the AC automation exists: trigger = "ADHD Personality Type" tag added → removes "ADHD Personality Type Opt-In" tag (or confirm the email step in the automation is disabled)
- [ ] **ActiveCampaign** Confirm the tags "ADHD Personality Type", "Bump: Anger Management", "Bump: ADHD Game Plan", and "ADHD Personality Type Opt-In" all exist in the AC account before going live (to prevent redundant tag creation on first purchase)
- [ ] **ActiveCampaign** Confirm `AC_LIST_ID` is set to the correct list ID that triggers the post-purchase automation sequence
- [ ] **ActiveCampaign** Confirm the `PDF_URL` custom field exists in AC and is mapped correctly in the automation to deliver the report link
- [ ] **ActiveCampaign** Remove the `"astro test optin"` debug tag from the `syncToActiveCampaign` call in `apps/api/src/routes/guest.ts` (line 159) before production launch
- [ ] **ActiveCampaign** Test end-to-end: submit the quiz with a test email → verify contact appears in AC with correct tags and `PDF_URL` field populated

### Brevo

- [ ] **Brevo** Deactivate IP blocking / allowlisting in Brevo account settings — Vercel uses dynamic IPs; IP restrictions will block all delivery email sends
- [ ] **Brevo** Verify sender domain `BREVO_SENDER_EMAIL` is authenticated (SPF + DKIM) in Brevo
- [ ] **Brevo** Send a test delivery email manually via the Brevo API (or by triggering a test webhook) to confirm HTML renders correctly and PDF links are clickable
- [ ] **Brevo** Confirm Brevo transactional email plan supports the expected monthly send volume
- [ ] **Brevo** Verify that Brevo does not have sandbox/test mode enabled (which silently accepts but doesn't send emails)

### Bunny CDN

- [ ] **Bunny** Confirm both bump PDF URLs are publicly accessible without authentication:
  - `https://wcc-files.b-cdn.net/Anger-Management-Adventures-StrategicParenting.pdf`
  - `https://wcc-files.b-cdn.net/the-adhd-game-plan-strategicparenting.pdf`
- [ ] **Bunny** Test both URLs in an incognito browser window to confirm no auth wall or 403
- [ ] **Bunny** Confirm the Bunny CDN pull zone for `wcc-files.b-cdn.net` has HTTPS enabled and is not restricted to specific referrer domains
- [ ] **Bunny** Optionally enable token authentication on the bump PDFs to prevent direct link sharing (low priority)

### Code (must be fixed before launch)

- [x] **Code** Fix CRITICAL-1: `OnboardingPage.tsx` synced from main — full submit+retry logic at email capture ✅
- [x] **Code** Fix CRITICAL-4: `update-payment-intent.ts` now fetches and merges existing PI metadata ✅
- [x] **Code** Fix CRITICAL-5: `update-payment-intent` call added inside `ExpressCheckoutElement.onConfirm` ✅
- [x] **Code** Fix CRITICAL-3: removed in-memory Set, replaced with `paid` flag check in `quiz_submissions` ✅
- [x] **Code** Fix MEDIUM-1: `update-payment-intent` call is now properly awaited with try/catch ✅
- [x] **Code** Fix MEDIUM-3: `OnboardingPage` 409 handler stores `pdfUrl` from response before navigating ✅
- [x] **Code** Fix MINOR-7: replaced `{/* */}` JSX comments with `<!-- -->` in `thank-you.astro` ✅
- [x] **Code** Removed `"astro test optin"` debug tag from `guest.ts` ✅
- [x] **Code** 409 is non-retryable in `OnboardingPage` retry loop — `pdfUrl` extracted from error response ✅

### Testing

- [ ] **Testing** Run a full end-to-end test in Stripe test mode: quiz → email capture → results page → buy button → checkout → pay with test card `4242 4242 4242 4242` → verify thank-you page loads with correct name/email
- [ ] **Testing** Verify the webhook fires and the delivery email arrives in the test email inbox (check Railway logs for `[Brevo] Delivery email sent to:` and `[webhook] payment_intent.succeeded`)
- [ ] **Testing** Test with Stripe 3DS card `4000 0027 6000 3184` to confirm 3DS redirect works and webhook fires correctly after authentication
- [ ] **Testing** Test Apple Pay / Google Pay flow (Express Checkout) end-to-end on a real iOS or macOS device with a test card configured in Wallet
- [ ] **Testing** Test the "bump toggle" flow: select both bumps → verify order summary shows correct total → pay → verify both bump PDFs are included in the delivery email
- [ ] **Testing** Test the pdfUrl Supabase fallback: submit quiz, clear `wildprint_pdfUrl` from sessionStorage manually, proceed to checkout → pay → verify email still delivers (fallback working)
- [ ] **Testing** Test duplicate webhook delivery: use the Stripe CLI to replay a `payment_intent.succeeded` event → verify only one email is sent (idempotency check working)
- [ ] **Testing** Test from a new browser tab (no sessionStorage) to confirm the checkout still works via the Supabase pdfUrl fallback when the quiz was completed in a different session
- [ ] **Testing** Confirm Stripe webhook signature verification rejects requests with an incorrect/missing `stripe-signature` header (returns 400)
- [ ] **Testing** Smoke test in production immediately after launch: do one live $0.50 test purchase (if Stripe allows) or a real purchase and immediately refund it
