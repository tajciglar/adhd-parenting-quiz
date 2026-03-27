import type { APIRoute } from 'astro'
import { getStripe } from '../../lib/stripe'

interface RequestBody {
  bumpIncluded: boolean
}

export const POST: APIRoute = async ({ request }) => {
  const stripe = getStripe()

  let body: RequestBody
  try {
    body = await request.json() as RequestBody
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const priceMain = import.meta.env.STRIPE_PRICE_MAIN as string
  const priceBump = import.meta.env.STRIPE_PRICE_BUMP as string

  if (!priceMain) {
    return json({ error: 'Stripe price IDs not configured' }, 500)
  }

  try {
    // Fetch live prices from Stripe
    const mainPrice = await stripe.prices.retrieve(priceMain)
    const mainAmount = mainPrice.unit_amount ?? 0

    let bumpAmount = 0
    if (body.bumpIncluded && priceBump) {
      const bumpPrice = await stripe.prices.retrieve(priceBump)
      bumpAmount = bumpPrice.unit_amount ?? 0
    }

    const amount = mainAmount + bumpAmount

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: mainPrice.currency ?? 'usd',
      setup_future_usage: 'off_session',
      metadata: {
        bumpIncluded: String(body.bumpIncluded),
      },
    })

    return json({ clientSecret: paymentIntent.client_secret })
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
