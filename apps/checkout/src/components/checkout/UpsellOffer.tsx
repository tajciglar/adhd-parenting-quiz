import { useState } from 'react'
import type { UpsellOfferProps } from '../../types/checkout'

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export default function UpsellOffer({ product, paymentIntentId, acceptUrl, declineUrl }: UpsellOfferProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleAccept() {
    setState('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/upsell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId, priceId: product.stripePriceId }),
      })
      const data = await res.json() as { success?: boolean; error?: string; requires_action?: boolean; client_secret?: string }
      if (!res.ok) throw new Error(data.error ?? 'Charge failed')

      if (data.success) {
        window.location.href = acceptUrl
        return
      }

      if (data.requires_action && data.client_secret) {
        const { loadStripe } = await import('@stripe/stripe-js')
        const publishableKey = document.querySelector<HTMLMetaElement>('meta[name="stripe-key"]')?.content ?? ''
        const stripe = await loadStripe(publishableKey)
        if (!stripe) throw new Error('Stripe failed to load')
        const { error: confirmError } = await stripe.confirmCardPayment(data.client_secret)
        if (confirmError) throw new Error(confirmError.message ?? 'Authentication failed')
        window.location.href = acceptUrl
        return
      }

      throw new Error(data.error ?? 'Charge failed')
    } catch (err) {
      setState('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {state === 'error' && (
        <p style={{
          color: 'var(--color-danger-dark)',
          fontSize: 'var(--text-sm)',
          textAlign: 'center',
          background: 'rgba(208,1,27,0.06)',
          border: '1px solid var(--color-danger)',
          borderRadius: 8,
          padding: '10px 14px',
        }}>
          {errorMsg}
        </p>
      )}

      <button
        onClick={handleAccept}
        disabled={state === 'loading'}
        className="btn-cta"
        style={{ fontSize: 17, padding: '16px 24px' }}
      >
        {state === 'loading'
          ? 'Processing…'
          : `✅ Yes! Add Sanity School To My Order — ${formatPrice(product.price)}`}
      </button>

      <button
        onClick={() => { window.location.href = declineUrl }}
        disabled={state === 'loading'}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-text-muted)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          textDecoration: 'underline',
          padding: '8px 0',
          textAlign: 'center',
        }}
      >
        No thanks, I'll find a different solution on my own.
      </button>

      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 4 }}>
        By clicking the button above, {formatPrice(product.price)} will be automatically added to your order.
      </p>
    </div>
  )
}
