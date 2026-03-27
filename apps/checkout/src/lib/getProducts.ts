import type Stripe from 'stripe'
import { getStripe } from './stripe'
import type { CheckoutConfig } from '../types/checkout'

// Static content Stripe doesn't store — bullets, images, descriptions
const staticContent = {
  main: {
    image: undefined as string | undefined,
    description: undefined as string | undefined,
    bullets: undefined as string[] | undefined,
    originalPrice: 4900, // $49 display-only
  },
  bump: {
    image: '/the-adhd-gameplan-book.png',
    description: 'The ADHD Game Plan includes 25 printable templates to help your child stay regulated and on track.',
    originalPrice: 5900,
    bullets: [
      'Easily plan their daily and weekly obligations',
      'Stay more focused and organized',
      'Diligently perform household chores',
      'Successfully achieve their set goals',
    ],
  },
  upsell: {
    image: undefined as string | undefined,
    description: undefined as string | undefined,
    bullets: undefined as string[] | undefined,
    originalPrice: undefined as number | undefined,
  },
}

async function fetchPrice(priceId: string) {
  const stripe = getStripe()
  const price = await stripe.prices.retrieve(priceId, { expand: ['product'] })
  const product = price.product as Stripe.Product
  return {
    name: product.name,
    price: price.unit_amount ?? 0,
    stripePriceId: priceId,
  }
}

export async function getProducts(): Promise<CheckoutConfig> {
  const priceMain   = import.meta.env.STRIPE_PRICE_MAIN as string
  const priceBump   = import.meta.env.STRIPE_PRICE_BUMP as string
  const priceUpsell = import.meta.env.STRIPE_PRICE_UPSELL as string

  const [main, bump, upsell] = await Promise.all([
    fetchPrice(priceMain),
    fetchPrice(priceBump),
    priceUpsell && !priceUpsell.startsWith('price_placeholder')
      ? fetchPrice(priceUpsell)
      : Promise.resolve({ name: 'Mastermind Group Access', price: 19700, stripePriceId: priceUpsell ?? '' }),
  ])

  return {
    main:   { id: 'main-offer',   ...main,   ...staticContent.main },
    bump:   { id: 'order-bump',   ...bump,   ...staticContent.bump },
    upsell: { id: 'upsell',       ...upsell, ...staticContent.upsell },
  }
}
