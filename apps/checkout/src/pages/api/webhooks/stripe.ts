import type { APIRoute } from 'astro'
import { getStripe } from '../../../lib/stripe'
import { syncContactWithTags } from '../../../lib/activecampaign'
import { sendFulfillmentEmail } from '../../../lib/email'
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

  if (email) {
    const lastName = fullName.includes(' ') ? fullName.slice(fullName.indexOf(' ') + 1) : ''
    const tags = ['ASTRO TEST PURCHASE']
    if (bumpIncluded) tags.push('ASTRO TEST BUMP')

    // Run AC sync and fulfillment email in parallel
    await Promise.all([
      syncContactWithTags({ email, firstName, lastName, country, tags }),
      sendFulfillmentEmail({ email, firstName, bumpIncluded }),
    ])
  }
}

async function handlePaymentIntentSucceeded(pi: Stripe.PaymentIntent) {
  // Newer Stripe API versions don't expand charges by default — re-fetch with expansion
  const stripe = getStripe()
  let expandedPi = pi
  try {
    expandedPi = await stripe.paymentIntents.retrieve(pi.id, { expand: ['charges'] })
  } catch {
    // Fall back to original object
  }
  const billingDetails = expandedPi.charges?.data?.[0]?.billing_details
  const email     = expandedPi.receipt_email ?? billingDetails?.email ?? ''
  const fullName  = billingDetails?.name  ?? ''
  const country   = billingDetails?.address?.country ?? ''
  const firstName = fullName.split(' ')[0] ?? fullName

  console.log('[webhook] payment_intent.succeeded', {
    intentId: pi.id,
    email,
    fullName,
    country,
  })

  if (email) {
    const lastName = fullName.includes(' ') ? fullName.slice(fullName.indexOf(' ') + 1) : ''
    await syncContactWithTags({
      email,
      firstName,
      lastName,
      country,
      tags: ['ASTRO TEST PURCHASE'],
    })
  }
}

function json(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
