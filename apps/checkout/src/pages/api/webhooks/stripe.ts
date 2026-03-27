import type { APIRoute } from 'astro'
import { getStripe } from '../../../lib/stripe'
import type Stripe from 'stripe'

// In-memory idempotency guard for the POC.
// Replace with a database check (e.g. a processed_events table) in production.
const processedEvents = new Set<string>()

export const POST: APIRoute = async ({ request }) => {
  const stripe = getStripe()
  const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET as string

  if (!webhookSecret) {
    return json({ error: 'Webhook secret not configured' }, 500)
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return json({ error: 'Missing stripe-signature header' }, 400)
  }

  let event: Stripe.Event
  try {
    const rawBody = await request.text()
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook verification failed'
    return json({ error: message }, 400)
  }

  // Idempotency — skip already-processed events
  if (processedEvents.has(event.id)) {
    return json({ received: true, skipped: true })
  }
  processedEvents.add(event.id)

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      await handleCheckoutCompleted(session)
      break
    }
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent
      await handlePaymentIntentSucceeded(pi)
      break
    }
    default:
      break
  }

  return json({ received: true })
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const stripe = getStripe()
  const details = session.customer_details

  const email     = details?.email ?? ''
  const fullName  = details?.name  ?? ''
  const country   = details?.address?.country ?? ''
  const firstName = fullName.split(' ')[0] ?? fullName

  const bumpIncluded = session.metadata?.bumpIncluded === 'true'

  // Retrieve payment method for future upsell charges
  let paymentMethodId: string | null = null
  if (session.payment_intent) {
    try {
      const pi = await stripe.paymentIntents.retrieve(session.payment_intent as string)
      paymentMethodId = pi.payment_method as string | null
    } catch {
      // Non-fatal
    }
  }

  console.log('[webhook] checkout.session.completed', {
    sessionId: session.id,
    email,
    fullName,
    country,
    bumpIncluded,
    paymentMethodId,
  })

  // Send to ActiveCampaign
  if (email) {
    await syncToActiveCampaign({ email, firstName, fullName, country })
  }
}

async function handlePaymentIntentSucceeded(pi: Stripe.PaymentIntent) {
  const email     = pi.receipt_email ?? (pi.payment_method_data as Record<string, unknown> | undefined)?.['billing_details'] as string ?? ''
  const billingDetails = pi.charges?.data?.[0]?.billing_details
  const fullName  = billingDetails?.name  ?? ''
  const country   = billingDetails?.address?.country ?? ''
  const firstName = fullName.split(' ')[0] ?? fullName
  const bumpIncluded = pi.metadata?.bumpIncluded === 'true'

  console.log('[webhook] payment_intent.succeeded', {
    intentId: pi.id,
    email,
    fullName,
    country,
    bumpIncluded,
  })

  if (email) {
    await syncToActiveCampaign({ email, firstName, fullName, country })
  }
}

const PURCHASE_TAG = 'ADHD Personality Type'

async function syncToActiveCampaign({
  email,
  firstName,
  fullName,
  country,
}: {
  email: string
  firstName: string
  fullName: string
  country: string
}) {
  const acApiUrl = (import.meta.env.AC_API_URL as string | undefined)?.replace(/\/$/, '')
  const acApiKey = import.meta.env.AC_API_KEY as string | undefined

  if (!acApiUrl || !acApiKey) {
    console.warn('[AC] AC_API_URL or AC_API_KEY not set — skipping ActiveCampaign sync')
    return
  }

  const headers = {
    'Api-Token': acApiKey,
    'Content-Type': 'application/json',
  }

  const lastName = fullName.includes(' ') ? fullName.slice(fullName.indexOf(' ') + 1) : ''

  try {
    // 1. Create or update contact
    const res = await fetch(`${acApiUrl}/api/3/contact/sync`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        contact: {
          email,
          firstName,
          lastName,
          ...(country ? { fieldValues: [{ field: 'COUNTRY', value: country }] } : {}),
        },
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error('[AC] Failed to sync contact:', res.status, body)
      return
    }

    const contactData = (await res.json()) as { contact: { id: number | string } }
    const contactId = String(contactData.contact.id)
    console.log('[AC] Contact synced:', email, 'id:', contactId)

    // 2. Find or create the purchase tag
    const tagSearchRes = await fetch(
      `${acApiUrl}/api/3/tags?search=${encodeURIComponent(PURCHASE_TAG)}`,
      { headers },
    )
    const tagSearchData = (await tagSearchRes.json()) as {
      tags: Array<{ id: number | string; tag: string }>
    }

    let tagId = String(
      tagSearchData.tags.find((t) => t.tag === PURCHASE_TAG)?.id ?? '',
    )

    if (!tagId || tagId === 'undefined') {
      const createTagRes = await fetch(`${acApiUrl}/api/3/tags`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ tag: { tag: PURCHASE_TAG, tagType: 'contact', description: '' } }),
      })
      const createTagData = (await createTagRes.json()) as { tag?: { id: number | string } }
      if (createTagData.tag?.id) tagId = String(createTagData.tag.id)
    }

    // 3. Apply the tag to the contact
    if (tagId && tagId !== 'undefined') {
      await fetch(`${acApiUrl}/api/3/contactTags`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ contactTag: { contact: contactId, tag: tagId } }),
      })
      console.log('[AC] Tag applied:', PURCHASE_TAG, 'to contact:', email)
    }
  } catch (err) {
    console.error('[AC] Error syncing contact:', err)
  }
}

function json(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
