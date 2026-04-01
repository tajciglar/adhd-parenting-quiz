import type { BumpConfig, ProjectConfig } from '../config/projects'

export type { BumpConfig, ProjectConfig }

export interface CheckoutConfig {
  project: ProjectConfig
  upsellPriceId: string
}

export interface OrderBumpProps {
  bump: BumpConfig
  checked: boolean
  onToggle: (id: string, checked: boolean) => void
}

export interface Testimonial {
  quote: string
  author: string
}
