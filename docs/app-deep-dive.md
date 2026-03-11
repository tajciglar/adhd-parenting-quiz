# Wildprint App — Deep Dive Learning Guide

> A lesson-by-lesson walkthrough of every system in your app.
> Each lesson ends with "What could break?" so you can debug confidently.

---

## Lesson 1: How a User Gets From Start to Finish

### The Route Map

```
User visits parenting-quiz.com
        ↓
   App.tsx catches all routes
        ↓
   / → redirects to /onboarding
        ↓
┌─────────────────────────────────────────────────┐
│  /onboarding (OnboardingPage.tsx)               │
│                                                 │
│  Steps 1-5:  Basic info collection              │
│      ↓                                          │
│  IntroScreen: "Let's find [Name]'s Wildprint"   │
│      ↓                                          │
│  Steps 7-43: Likert quiz (6 categories)         │
│      ↓                                          │
│  CalculatingScreen: animation → email capture   │
│      ↓                                          │
│  POST /api/guest/submit                         │
│      ↓                                          │
│  navigate("/thank-you")                         │
└─────────────────────────────────────────────────┘
        ↓
   /thank-you (ThankYouPage.tsx)
```

### How Lazy Loading Works

Every page is wrapped in `lazyWithRetry()`:

```typescript
// App.tsx
const OnboardingPage = lazyWithRetry(
  () => import("./components/onboarding/OnboardingPage")
);
```

**What this does:** Instead of loading ALL JavaScript upfront, each page is a
separate chunk (file) that loads only when the user navigates to that route.

**The retry logic:** When Vercel deploys a new version, old chunk filenames
become invalid. If a user had the old HTML cached, their browser tries to load
a chunk that no longer exists. `lazyWithRetry`:

1. First attempt fails → sets `sessionStorage.chunk_reload = "1"`
2. Reloads the page (gets fresh HTML with new chunk names)
3. If it fails again → removes the flag and shows the real error

### What Could Break?

| Symptom | Cause | Fix |
|---------|-------|-----|
| White screen on navigation | Chunk failed to load | Hard refresh (Ctrl+Shift+R) |
| Page redirects to /onboarding unexpectedly | `location.state` is null (user refreshed) | This is by design — state only lives in memory |
| Infinite reload loop | `lazyWithRetry` bug | Clear sessionStorage → `chunk_reload` |

---

## Lesson 2: Where Data Lives (The 4 Storage Layers)

This is the #1 thing to understand for debugging.

### Layer 1: React State (volatile — lost on refresh)

```
OnboardingPage:
  ├── showIntro          boolean   "show the intro screen?"
  ├── showCalculating    boolean   "show the calculating animation?"
  ├── showHalfway        boolean   "show halfway encouragement?"
  ├── interstitialCategory  string | null   "which interstitial?"
  └── (from useOnboarding hook):
      ├── currentStep    number    "which question are we on?"
      ├── responses      object    "all answers so far"
      └── direction      number    "animation direction (1=forward, -1=back)"
```

**Key insight:** If the user refreshes mid-quiz, React state is gone. BUT the
`useOnboarding` hook saves to sessionStorage, so progress is restored.

### Layer 2: Session Storage (survives refresh, lost on tab close)

```
┌─────────────────────────┬────────────────────────────────────────────┐
│ Key                     │ What it stores                             │
├─────────────────────────┼────────────────────────────────────────────┤
│ harbor_onboarding       │ { currentStep, responses } — quiz progress │
│ wildprint_childName     │ "Luka" — for ThankYouPage                 │
│ wildprint_email         │ "parent@email.com"                        │
│ wildprint_childGender   │ "Boy" / "Girl" / "Non-binary"             │
│ wildprint_session_id    │ "1710000000_abc123" — funnel correlation   │
│ admin_key               │ Admin dashboard secret                    │
│ chunk_reload            │ "1" during retry, removed after           │
└─────────────────────────┴────────────────────────────────────────────┘
```

**When is `harbor_onboarding` set?** Every time the user answers a question,
the `useOnboarding` hook calls `sessionStorage.setItem("harbor_onboarding", ...)`.

**When is it cleared?** After successful submission in CalculatingScreen:
`clearOnboardingStorage()`.

### Layer 3: Location State (React Router — in-memory only)

```typescript
navigate("/results", {
  state: { report, email, childName, childGender, submissionId }
});
```

**Critical:** This only exists while navigating. If the user refreshes
`/results`, `location.state` is `null` → the page redirects to `/`.

Currently `/results` (SalesPage) is bypassed, but when you re-enable it,
remember: **location state = one-time delivery, not persistent storage.**

### Layer 4: The Database (Supabase — permanent)

After submission, everything is saved to `quiz_submissions`:

```
┌────────────────────┬────────────────────────────────────────────┐
│ Column             │ Example                                    │
├────────────────────┼────────────────────────────────────────────┤
│ email              │ "parent@email.com" (unique)                │
│ child_name         │ "Luka"                                     │
│ archetype_id       │ "tiger"                                    │
│ trait_scores       │ {"inattentive":2.4,"hyperactive":1.8,...}  │
│ responses          │ {"caregiverType":"Mom","inattentive_0":2}  │
│ pdf_url            │ signed URL for on-demand PDF generation    │
│ paid               │ false (set to true by Stripe webhook)      │
└────────────────────┴────────────────────────────────────────────┘
```

### What Could Break?

| Symptom | Cause | Fix |
|---------|-------|-----|
| Quiz resets on refresh | `harbor_onboarding` missing or corrupted | Check sessionStorage in DevTools |
| ThankYouPage shows "your child" instead of name | `wildprint_childName` not set | Check CalculatingScreen sets it before navigating |
| Admin dashboard empty | `admin_key` wrong or missing | Re-enter the secret |

---

## Lesson 3: The Scoring System

### How Answers Become Scores

```
Step 1: User answers Likert questions (0-3 scale)
        "Not really"=0  "Sometimes"=1  "Often"=2  "Always"=3

Step 2: Answers stored as: { inattentive_0: 2, inattentive_1: 3, ... }
        Key format: {categoryId}_{questionIndex}

Step 3: computeScores() averages each category:
        inattentive: (2+3+1+2+3+2+1) / 7 = 2.0
        hyperactive:  (1+1+2+0+1+1+2) / 7 = 1.14
        sensory:      (3+2+3+2+3+2+3) / 7 = 2.57
        emotional:    (2+3+2+3+2+3) / 6 = 2.5
        exec_func:    (1+2+1+2+1+2) / 6 = 1.5
        social:       (1+0+1+1+0+1) / 6 = 0.67

Step 4: Sort by score (highest first):
        1. sensory      2.57
        2. emotional    2.50
        3. inattentive  2.00
        4. exec_func    1.50
        5. hyperactive  1.14
        6. social       0.67

Step 5: Take top 2 → ["sensory", "emotional"]

Step 6: Find archetype with those dimensions → no exact match
        Fallback: find archetype containing both → still no match
        Fallback: first archetype → "koala"
```

### The Archetype Table

```
┌──────────────┬─────────────────────┬──────────────────────────────┐
│ ID           │ Animal              │ Top-2 Categories             │
├──────────────┼─────────────────────┼──────────────────────────────┤
│ hummingbird  │ Flash Hummingbird   │ inattentive + hyperactive    │
│ meerkat      │ Observing Meerkat   │ inattentive + sensory        │
│ tiger        │ Fierce Tiger        │ inattentive + emotional      │
│ koala        │ Dreamy Koala        │ inattentive + exec_function  │
│ stallion     │ Bold Stallion       │ emotional + exec_function    │
│ fox          │ Clever Fox          │ exec_function + social       │
└──────────────┴─────────────────────┴──────────────────────────────┘
```

**Important:** Not all category combos have an archetype. The matching function
tries exact match → contains match → fallback to first archetype.

### Where Scoring Runs

**Both client AND server compute scores:**
- **Client** (`CalculatingScreen`): `computeTraitProfile(responses)` → used to
  show the archetype reveal animation
- **Server** (`guest.ts`): Same function → used to generate the report and store
  `trait_scores` in the database

They use the **same shared function** from `packages/shared/src/assessment.ts`,
so results are always identical.

### What Could Break?

| Symptom | Cause | Fix |
|---------|-------|-----|
| "Report template not found" | Archetype matched but no template exists | Check `reportTemplates.ts` has a template for that ID |
| Wrong archetype for user | Scoring logic or question order changed | Check `trait_scores` in Supabase — top 2 determine match |
| All users get same archetype | Questions might all map to same category | Check `ASSESSMENT_CATEGORIES` question assignments |

---

## Lesson 4: The API — What Happens on the Server

### The Submit Endpoint (POST /api/guest/submit)

This is the most important endpoint. Here's every step:

```
Client sends:
{
  email: "parent@email.com",
  responses: { caregiverType: "Mom", inattentive_0: 2, ... },
  childName: "Luka",
  childGender: "Boy",
  fbp: "fb.1.1234...",     ← Facebook browser ID (for ad tracking)
  fbc: "fb.1.1234...",     ← Facebook click ID
  eventSourceUrl: "https://parenting-quiz.com/onboarding"
}
```

**Step 1: Duplicate check**
```
→ Look up email in ActiveCampaign
→ Check if contact has "adhd quiz wildprint" tag
→ If yes: return 409 { error: "already_submitted" }
→ If AC is down or not configured: skip check (allow submission)
```

**Step 2: Score & match**
```
→ computeTraitProfile(responses)
→ Returns: { scores: {...}, archetypeId: "tiger" }
```

**Step 3: Load & render report**
```
→ getReportTemplate("tiger")
→ renderReportTemplate(template, { name: "Luka", gender: "Boy" })
→ Replaces all {childName}, {pos}, {obj}, {sub} placeholders
```

**Step 4: Generate signed PDF URL**
```
→ Encode { archetypeId, childName, childGender } as base64
→ Sign with HMAC-SHA256 using PDF_SIGNING_SECRET
→ URL: /api/guest/pdf?data=BASE64&sig=HMAC_SIGNATURE
```

This URL is **stateless** — the PDF is generated on-demand every time someone
clicks it. No files are stored.

**Step 5: Fire-and-forget background tasks**
```
→ Meta CAPI: Send "Lead" event (for Facebook ad attribution)
→ ActiveCampaign: Create contact, set PDF_URL, subscribe to list, apply tag
→ Supabase: Insert quiz_submissions row
```

These use `void asyncFunction()` — they run in the background and don't block
the response to the user. If any fail, the user still gets their result.

**Step 6: Return response**
```
{
  report: { title: "THE FIERCE TIGER", innerVoiceQuote: "...", ... },
  submissionId: "uuid-here"
}
```

### Security Features

```
Rate Limits:
  /api/guest/submit  → 5 per hour per IP (prevent abuse)
  /api/guest/track   → 100 per minute per IP
  Global             → 100 per minute per IP

CORS:
  Only allows requests from origins in CORS_ORIGIN env var
  e.g., "https://www.parenting-quiz.com,https://parenting-quiz.com"

Stripe Webhook:
  Verifies signature using STRIPE_WEBHOOK_SECRET
  Raw body required (not parsed JSON)

Admin:
  x-admin-key header must match ADMIN_SECRET env var

PDF URLs:
  HMAC-SHA256 signed — can't be forged without PDF_SIGNING_SECRET
```

### What Could Break?

| Symptom | Cause | Fix |
|---------|-------|-----|
| CORS error in console | Domain not in CORS_ORIGIN | Add domain to Railway env var |
| 409 "already_submitted" | Email already has AC tag | Use different email, or remove tag in AC |
| 500 on submit | Missing env var (SUPABASE, AC, etc.) | Check Railway logs + env vars |
| PDF link returns 403 | PDF_SIGNING_SECRET changed since URL was generated | Regenerate URL |
| AC sync fails silently | AC_API_KEY wrong or expired | Check Railway logs for AC errors |

---

## Lesson 5: ActiveCampaign — The Email System

### What Happens on Quiz Submission

```
syncToActiveCampaign() runs these steps:

1. CREATE/UPDATE CONTACT
   POST /api/3/contact/sync
   Body: { contact: { email: "parent@email.com" } }
   → Returns contactId

2. SET PDF_URL CUSTOM FIELD
   First: GET /api/3/fields?limit=100 → find field with perstag "PDF_URL"
   If not found: POST /api/3/fields → create it
   Then: POST /api/3/fieldValues
   Body: { fieldValue: { contact: contactId, field: fieldId, value: "https://..." } }

3. SUBSCRIBE TO LIST
   POST /api/3/contactLists
   Body: { contactList: { list: AC_LIST_ID, contact: contactId, status: 1 } }
   ⚠️  If AC_LIST_ID is not set, this step is SKIPPED

4. APPLY TAG
   Search: GET /api/3/tags?search=adhd quiz wildprint
   If not found: POST /api/3/tags → create it
   Apply: POST /api/3/contactTags
   Body: { contactTag: { contact: contactId, tag: tagId } }
```

### Tags in Your System

```
"adhd quiz wildprint"   → Applied on quiz submission
                           Used for: duplicate detection, automation trigger

"wildprint-purchased"   → Applied after Stripe payment
                           Used for: segmenting buyers vs non-buyers
```

### How to Set Up AC Automation

```
Trigger:  "Tag is added" → "adhd quiz wildprint"
          (NOT "subscribes to list" — that may not fire for existing contacts)

Action:   Send email
          Use personalization: %PDF_URL% for the download link

Conditions (optional):
  - Exclude contacts with tag "wildprint-purchased" (if you want separate flows)
```

### What Could Break?

| Symptom | Cause | Fix |
|---------|-------|-----|
| Automation doesn't fire | Trigger is "subscribes to list" but contact already on list | Change trigger to "Tag is added" |
| Automation doesn't fire | AC_LIST_ID not set → contact not on any list | Set AC_LIST_ID on Railway |
| Automation doesn't fire | Automation is in Draft/Inactive state | Activate it in AC |
| PDF link in email broken | PDF_SIGNING_SECRET changed | Check env var hasn't changed |
| No contacts appearing in AC | AC_API_KEY or AC_API_URL wrong | Check Railway logs for errors |

---

## Lesson 6: The Onboarding Flow — Screen by Screen

### The Step System

```
useOnboarding() hook manages:
  ├── currentStep (number)
  ├── responses (object)
  ├── goNext() → currentStep + 1
  ├── goBack() → currentStep - 1
  ├── saveAnswer(key, value) → updates responses + saves to sessionStorage
  └── direction (1 or -1, for animation direction)

Steps 1-5:  BasicInfoQuestions (from assessment.ts)
            Each has: key, label, type (text/emoji-select), options
            Rendered by: StepRenderer.tsx

Step 6:     Not a real step — triggers IntroScreen overlay

Steps 7-43: LikertStepConfig (from assessment.ts)
            Generated by: ASSESSMENT_CATEGORIES.flatMap(questions)
            Each has: categoryId, questionIndex, questionText
            Key format: "{categoryId}_{index}" e.g. "inattentive_0"
```

### Screen Transitions (OnboardingPage.tsx)

```
When user answers and moves forward:

if (currentStep === TOTAL_STEPS)
  → Show CalculatingScreen

else if (currentStep === BASIC_INFO_COUNT)
  → Show IntroScreen ("Let's find [Name]'s Wildprint")

else if (currentStep === HALFWAY_STEP)
  → Show HalfwayScreen (after sensory category)

else if (INTERSTITIAL_TRIGGER_STEPS.has(currentStep))
  → Show InterstitialScreen (after inattentive, emotional, exec_function)

else
  → Just go to next step
```

### Pronoun Interpolation

When rendering question text, `interpolate()` in StepRenderer replaces:

```
Template: "Gets so lost in {pos} own thoughts {sub} {dont} notice time passing."

Boy:      "Gets so lost in his own thoughts he doesn't notice time passing."
Girl:     "Gets so lost in her own thoughts she doesn't notice time passing."
Non-binary: "Gets so lost in their own thoughts they don't notice time passing."
```

Available placeholders:
```
{childName}  →  "Luka"
{pos}        →  his / her / their
{obj}        →  him / her / them
{sub}        →  he / she / they
{is}         →  is / is / are
{was}        →  was / was / were
{dont}       →  doesn't / doesn't / don't
```

### What Could Break?

| Symptom | Cause | Fix |
|---------|-------|-----|
| Question shows "{pos}" literally | interpolate() not called or gender not set | Check StepRenderer passes responses |
| "he don't" instead of "he doesn't" | Using `{sub} don't` instead of `{sub} {dont}` | Use verb placeholder |
| Halfway screen at wrong position | HALFWAY_STEP calculation wrong | Check `ASSESSMENT_CATEGORIES.slice(0, 3)` |
| Interstitial not showing | Category not in INTERSTITIAL_TRIGGER_STEPS filter | Add to the if condition |
| Can't scroll on quiz page | overflow-hidden on wrapper | Use overflow-y-auto + min-h instead of h |

---

## Lesson 7: Analytics & Tracking

### Funnel Events (Your Own Analytics)

```
analytics.ts generates a session ID once per browser session:
  wildprint_session_id = "{timestamp}_{random}"

Every event sends to POST /api/guest/track:
{
  sessionId: "1710000000_abc123",
  eventType: "step_viewed",
  stepNumber: 7,
  metadata: { questionKey: "inattentive_0" }
}

Stored in Supabase: funnel_events table
Read by: /api/admin/analytics endpoint → AdminDashboard
```

**Events tracked:**
- `step_viewed` — every step the user sees
- `answer_submitted` — every answer (with questionKey + value)
- `quiz_completed` — after email submission
- `optin_completed` — CTA click on sales page
- `optin_thankyou` — thank you page loaded
- `checkout_started` — when checkout was active
- `purchase_completed` — Stripe webhook

### Meta Pixel (Facebook Ads)

```
Client-side (fbq.ts):
  fbq("track", "ViewContent")  → quiz start + results page
  fbq("track", "Lead")         → email capture + thank you page

Server-side (metaCapi.ts):
  "Lead" event     → after /api/guest/submit
  "Purchase" event → after Stripe webhook

Both use the same eventId for deduplication — Meta ignores
duplicates so you don't double-count conversions.
```

**Facebook cookies:**
- `_fbp` — Facebook browser ID (auto-generated, stored in localStorage)
- `_fbc` — Facebook click ID (from `?fbclid=` URL param when user clicks an ad)

These are sent to the server so Meta CAPI events can be matched to the
correct user.

### What Could Break?

| Symptom | Cause | Fix |
|---------|-------|-----|
| Admin dashboard shows 0 events | API URL wrong or CORS blocking /api/guest/track | Check browser console for errors |
| Meta Pixel not firing | VITE_FB_PIXEL_ID not set | Check Vercel env vars |
| Meta CAPI events not appearing | META_ACCESS_TOKEN expired | Regenerate in Meta Events Manager |
| Duplicate conversions | eventId dedup not working | Check generateEventId() is consistent |

---

## Lesson 8: Environment Variables — The Full List

### Frontend (Vercel Dashboard)

```
VITE_API_URL                    Your Railway API URL
                                e.g., https://your-app.up.railway.app

VITE_STRIPE_PUBLISHABLE_KEY     Stripe public key (pk_test_... or pk_live_...)

VITE_FB_PIXEL_ID                Meta Pixel ID (from Events Manager)
```

### Backend (Railway Dashboard)

```
# Database
SUPABASE_URL                    https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY       eyJhbG... (service role, not anon key!)

# ActiveCampaign
AC_API_URL                      https://yourname.api-us1.com
AC_API_KEY                      Your AC API key
AC_LIST_ID                      The list ID contacts get subscribed to
                                ⚠️  If missing, contacts get tagged but not listed

# Stripe
STRIPE_SECRET_KEY               sk_test_... or sk_live_...
STRIPE_WEBHOOK_SECRET           whsec_...
STRIPE_PUBLISHABLE_KEY          pk_test_... (used for PDF receipt URL)

# Meta
META_PIXEL_ID                   Your pixel ID
META_ACCESS_TOKEN               From Meta Events Manager → Settings

# Security
PDF_SIGNING_SECRET              Any random string (used for HMAC signing)
ADMIN_SECRET                    Password for /admin dashboard

# Server
CORS_ORIGIN                     Comma-separated allowed origins
                                e.g., https://www.parenting-quiz.com,https://parenting-quiz.com
API_BASE_URL                    Your Railway URL (for generating PDF URLs)
NODE_ENV                        production
PORT                            (Railway sets this automatically)
```

---

## Lesson 9: Deployment Pipeline

### Frontend (Vercel)

```
Push to GitHub
    ↓
Vercel auto-detects push
    ↓
Runs: pnpm install
    ↓
Runs: pnpm -w run build:shared    (builds packages/shared first)
    ↓
Runs: pnpm --filter web build     (runs tsc -b && vite build)
    ↓
Outputs to: apps/web/dist/
    ↓
Vercel serves dist/ with SPA rewrite (all routes → index.html)
```

### Backend (Railway)

```
Push to GitHub
    ↓
Railway auto-detects push
    ↓
Runs: pnpm install
    ↓
Runs: build command (pnpm run build:shared && pnpm --filter api build)
    ↓
Starts: node dist/server.js
    ↓
Listens on PORT (Railway-assigned)
```

### What Could Break?

| Symptom | Cause | Fix |
|---------|-------|-----|
| Vercel build fails with TS2307 | Package not resolved (pnpm hoisting) | .npmrc has shamefully-hoist=true |
| Old code still showing | Vercel cached old build | Clear build cache in Vercel settings |
| API returns 502 | Railway build failed or crashed | Check Railway deploy logs |
| API works locally but not deployed | Missing env var on Railway | Compare local .env vs Railway vars |

---

## Quick Reference: The Request Lifecycle

```
USER TAPS "Always" ON QUESTION
         ↓
1. LikertSelect fires onChange(3)
         ↓
2. StepRenderer calls onAnswer("inattentive_0", 3)
         ↓
3. useOnboarding.saveAnswer():
   - Updates responses state
   - Saves to sessionStorage
   - Fires trackFunnelEvent("answer_submitted")
   - Calls goNext()
         ↓
4. OnboardingPage checks: is it a trigger step?
   - No → render next question
   - Yes → show Interstitial/Halfway/Calculating screen
         ↓
5. (Eventually) CalculatingScreen:
   - Shows progress animation
   - Reveals archetype
   - Captures email
   - Calls POST /api/guest/submit
         ↓
6. Server:
   - Checks duplicate
   - Computes scores
   - Renders report
   - Generates PDF URL
   - Syncs to AC (background)
   - Saves to Supabase (background)
   - Returns report
         ↓
7. Client:
   - Stores name/email/gender in sessionStorage
   - Navigates to /thank-you
         ↓
8. ThankYouPage:
   - Reads from sessionStorage
   - Fires Lead pixel
   - Shows personalized thank you
```
