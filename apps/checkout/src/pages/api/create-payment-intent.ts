import type { APIRoute } from 'astro'
import { getStripe } from '../../lib/stripe'
import { getProject, DEFAULT_PROJECT } from '../../config/projects'

interface RequestBody {
  project?: string
  selectedBumpIds: string[]  // e.g. ['anger-management', 'adhd-game-plan']
  email?: string
  childName?: string
  pdfUrl?: string
}

export const POST: APIRoute = async ({ request }) => {
  let body: RequestBody
  try {
    body = await request.json() as RequestBody
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const { project: projectId = DEFAULT_PROJECT, selectedBumpIds = [], email = '', childName = '', pdfUrl = '' } = body

  const project = getProject(projectId)

  // Calculate total from config — no extra Stripe API calls needed
  const bumpTotal = selectedBumpIds.reduce((sum, id) => {
    const bump = project.bumps.find(b => b.id === id)
    return sum + (bump?.salePrice ?? 0)
  }, 0)

  const amount = project.price + bumpTotal

  try {
    const stripe = getStripe()
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      // Store everything needed for post-payment fulfillment
      metadata: {
        project: projectId,
        email,
        childName,
        pdfUrl,
        selectedBumps: selectedBumpIds.join(','),
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
