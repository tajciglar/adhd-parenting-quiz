import type { APIRoute } from 'astro'
import { getStripe } from '../../../lib/stripe'
import { syncContactWithTags } from '../../../lib/activecampaign'
import { sendDeliveryEmail } from '../../../lib/brevo'
import { getProject } from '../../../config/projects'
import type Stripe from 'stripe'

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

  if (processedEvents.has(event.id)) {
    return json({ received: true, skipped: true })
  }
  processedEvents.add(event.id)

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    await handlePaymentSucceeded(pi)
  }

  return json({ received: true })
}

async function handlePaymentSucceeded(pi: Stripe.PaymentIntent) {
  const stripe = getStripe()

  // Re-fetch with charges expanded to get billing details
  let expandedPi = pi
  try {
    expandedPi = await stripe.paymentIntents.retrieve(pi.id, { expand: ['charges'] })
  } catch {
    // Fall back to original
  }

  const billingDetails = expandedPi.charges?.data?.[0]?.billing_details
  const email     = pi.metadata.email || expandedPi.receipt_email || billingDetails?.email || ''
  const fullName  = billingDetails?.name || ''
  const country   = billingDetails?.address?.country || ''
  const firstName = fullName.split(' ')[0] || fullName
  const lastName  = fullName.includes(' ') ? fullName.slice(fullName.indexOf(' ') + 1) : ''

  // Read fulfillment data from PaymentIntent metadata
  const projectId    = pi.metadata.project || 'adhd-parenting'
  const childName    = pi.metadata.childName || 'your child'
  const pdfUrl       = pi.metadata.pdfUrl || ''
  const selectedBumps = (pi.metadata.selectedBumps || '').split(',').filter(Boolean)

  console.log('[webhook] payment_intent.succeeded', { intentId: pi.id, email, projectId, childName, selectedBumps })

  // ── 1. Brevo — send delivery email with PDF links ────────────────────────
  if (email && pdfUrl) {
    const project = getProject(projectId)
    const bumpDetails = selectedBumps
      .map(id => project.bumps.find(b => b.id === id))
      .filter((b): b is NonNullable<typeof b> => Boolean(b))
      .map(b => ({ name: b.name, pdfUrl: b.pdfUrl }))

    await sendDeliveryEmail({
      toEmail: email,
      toName: firstName || email,
      childName,
      mainPdfUrl: pdfUrl,
      bumps: bumpDetails,
    }).catch(err => console.error('[Brevo] delivery email failed:', err))
  } else {
    console.warn('[webhook] skipping Brevo — missing email or pdfUrl', { email, pdfUrl: !!pdfUrl })
  }

  // ── 2. AC — apply tags for marketing automation ──────────────────────────
  if (email) {
    const tags = ['ADHD Personality Report']
    if (selectedBumps.includes('anger-management')) tags.push('Bump: Anger Management')
    if (selectedBumps.includes('adhd-game-plan')) tags.push('Bump: ADHD Game Plan')

    await syncContactWithTags({ email, firstName, lastName, country, tags })
      .catch(err => console.error('[AC] tag sync failed:', err))
  }
}

function json(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
