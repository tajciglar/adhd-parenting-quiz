import { getProject, DEFAULT_PROJECT } from '../config/projects'
import type { CheckoutConfig } from '../types/checkout'

export async function getProducts(projectId?: string): Promise<CheckoutConfig> {
  const project = getProject(projectId ?? DEFAULT_PROJECT)

  // Upsell price ID comes from env so it can be overridden without a deploy
  const upsellPriceId = (import.meta.env.STRIPE_PRICE_UPSELL as string | undefined) ?? ''

  return { project, upsellPriceId }
}
