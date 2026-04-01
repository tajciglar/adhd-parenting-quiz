import type { APIRoute } from 'astro'
import { getStripe } from '../../lib/stripe'

interface RequestBody {
  paymentIntentId: string
  email?: string
  childName?: string
}

export const POST: APIRoute = async ({ request }) => {
  let body: RequestBody
  try {
    body = await request.json() as RequestBody
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const { paymentIntentId, email = '', childName = '' } = body

  if (!paymentIntentId) {
    return json({ error: 'paymentIntentId is required' }, 400)
  }

  try {
    const stripe = getStripe()
    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: { email, childName },
      ...(email ? { receipt_email: email } : {}),
    })
    return json({ success: true })
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
