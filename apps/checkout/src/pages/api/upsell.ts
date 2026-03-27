import type { APIRoute } from 'astro'
import { getStripe } from '../../lib/stripe'

interface RequestBody {
  sessionId: string
  priceId: string
}

export const POST: APIRoute = async ({ request }) => {
  const stripe = getStripe()

  let body: RequestBody
  try {
    body = await request.json() as RequestBody
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const { sessionId, priceId } = body

  if (!sessionId || !priceId) {
    return json({ error: 'sessionId and priceId are required' }, 400)
  }

  try {
    // Retrieve the completed checkout session to get customer + payment method
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    })

    if (session.payment_status !== 'paid') {
      return json({ error: 'Session not paid' }, 400)
    }

    const customerId = session.customer as string | null
    const pi = session.payment_intent as import('stripe').Stripe.PaymentIntent | null
    const paymentMethodId = pi?.payment_method as string | null

    if (!customerId || !paymentMethodId) {
      return json({ error: 'Missing customer or payment method on session' }, 400)
    }

    // Retrieve price to get the amount
    const price = await stripe.prices.retrieve(priceId)
    const amount = price.unit_amount
    const currency = price.currency

    if (!amount) {
      return json({ error: 'Price has no unit amount' }, 400)
    }

    // One-click off-session charge
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      payment_method: paymentMethodId,
      confirm: true,
      off_session: true,
      metadata: {
        upsell: 'true',
        priceId,
        originalSessionId: sessionId,
      },
    })

    if (paymentIntent.status === 'succeeded') {
      return json({ success: true })
    }

    return json({ error: `Unexpected status: ${paymentIntent.status}` }, 400)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error'
    return json({ error: message }, 500)
  }
}

function json(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
