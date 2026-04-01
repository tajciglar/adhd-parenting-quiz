import { getProject, DEFAULT_PROJECT } from '../config/projects'
import type { CheckoutConfig } from '../types/checkout'

export async function getProducts(projectId?: string): Promise<CheckoutConfig> {
  const project = getProject(projectId ?? DEFAULT_PROJECT)
  return { project }
}
