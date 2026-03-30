import type { APIRoute } from 'astro'
import { getStripe } from '../../lib/stripe'
import type Stripe from 'stripe'

interface RequestBody {
  paymentIntentId: string
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

  const { paymentIntentId, priceId } = body

  if (!paymentIntentId || !priceId) {
    return json({ error: 'paymentIntentId and priceId are required' }, 400)
  }

  try {
    // Retrieve original PaymentIntent with payment method expanded
    const originalPI = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['payment_method'],
    })

    if (originalPI.status !== 'succeeded') {
      return json({ error: 'Original payment not completed' }, 400)
    }

    const pm = originalPI.payment_method as Stripe.PaymentMethod | null
    if (!pm) {
      return json({ error: 'No payment method found on original payment' }, 400)
    }

    // Get billing details from the payment method
    const email = pm.billing_details?.email ?? ''
    const name  = pm.billing_details?.name  ?? ''

    // Create a customer and attach the payment method so Stripe allows reuse
    const customer = await stripe.customers.create({
      ...(email ? { email } : {}),
      ...(name  ? { name  } : {}),
      payment_method: pm.id,
    })

    // Retrieve price
    const price = await stripe.prices.retrieve(priceId)
    const amount = price.unit_amount
    const currency = price.currency

    if (!amount) {
      return json({ error: 'Price has no unit amount' }, 400)
    }

    // Charge off-session — customer + attached payment method
    const upsellPI = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customer.id,
      payment_method: pm.id,
      confirm: true,
      off_session: true,
      metadata: {
        upsell: 'true',
        priceId,
        originalPaymentIntentId: paymentIntentId,
      },
    })

    if (upsellPI.status === 'succeeded') {
      return json({ success: true })
    }

    // 3DS required — return client_secret for frontend to handle
    if (upsellPI.status === 'requires_action') {
      return json({ requires_action: true, client_secret: upsellPI.client_secret })
    }

    return json({ error: `Unexpected status: ${upsellPI.status}` }, 400)
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
