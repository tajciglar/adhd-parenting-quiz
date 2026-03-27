export interface Product {
  id: string
  name: string
  price: number           // in cents
  stripePriceId: string
  image?: string
  description?: string
  originalPrice?: number
  bullets?: string[]
}

export interface OrderBumpProps {
  product: Product
  defaultChecked?: boolean
  badgeText?: string
  checkboxLabel?: string
  onToggle: (checked: boolean) => void
}

export interface UpsellOfferProps {
  product: Product
  sessionId: string
  onAccept: () => void
  onDecline: () => void
}

export interface CheckoutConfig {
  main: Product
  bump: Product
  upsell: Product
}

export interface ContactInfo {
  firstName: string
  email: string
  country: string
}

export interface Testimonial {
  quote: string
  author: string
}
