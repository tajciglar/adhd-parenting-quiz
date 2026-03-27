import type { APIRoute } from 'astro'
import { getStripe } from '../../lib/stripe'

interface RequestBody {
  bumpIncluded: boolean
}

export const POST: APIRoute = async ({ request }) => {
  const stripe = getStripe()
  const publicUrl = import.meta.env.PUBLIC_URL as string

  let body: RequestBody
  try {
    body = await request.json() as RequestBody
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const { bumpIncluded } = body

  const priceMain = import.meta.env.STRIPE_PRICE_MAIN as string
  const priceBump = import.meta.env.STRIPE_PRICE_BUMP as string

  if (!priceMain) {
    return json({ error: 'Stripe price IDs not configured' }, 500)
  }

  const lineItems: { price: string; quantity: number }[] = [
    { price: priceMain, quantity: 1 },
  ]

  if (bumpIncluded && priceBump) {
    lineItems.push({ price: priceBump, quantity: 1 })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      ui_mode: 'embedded',
      line_items: lineItems,
      return_url: `${publicUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        bumpIncluded: String(bumpIncluded),
      },
      payment_intent_data: {
        setup_future_usage: 'off_session',
      },
    })

    return json({ clientSecret: session.client_secret })
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
