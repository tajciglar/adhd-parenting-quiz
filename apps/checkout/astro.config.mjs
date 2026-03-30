import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'

export default defineConfig({
  integrations: [react()],
  output: 'server',
  adapter: vercel(),
  // Prevent Vercel from issuing 301 redirects on API routes (e.g. trailing-slash redirects
  // that break Stripe webhook POST requests and cause 301 ERR in the Stripe dashboard)
  trailingSlash: 'never',
  server: {
    port: 4321,
  },
})
