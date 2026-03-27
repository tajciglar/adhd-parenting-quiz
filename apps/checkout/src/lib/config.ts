function requireEnv(key: string): string {
  const value = import.meta.env[key]
  if (!value) throw new Error(`Missing required env var: ${key}`)
  return value as string
}

export const config = {
  stripe: {
    secretKey:     requireEnv('STRIPE_SECRET_KEY'),
    webhookSecret: requireEnv('STRIPE_WEBHOOK_SECRET'),
    priceMain:     requireEnv('STRIPE_PRICE_MAIN'),
    priceBump:     requireEnv('STRIPE_PRICE_BUMP'),
    priceUpsell:   requireEnv('STRIPE_PRICE_UPSELL'),
  },
  publicUrl: requireEnv('PUBLIC_URL'),
}
