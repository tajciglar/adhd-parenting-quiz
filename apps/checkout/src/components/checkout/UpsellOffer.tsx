import { useState } from 'react'
import type { UpsellOfferProps } from '../../types/checkout'

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export default function UpsellOffer({ product, paymentIntentId, onAccept, onDecline }: UpsellOfferProps) {
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
        onAccept()
        return
      }

      // 3DS required — open Stripe's authentication flow
      if (data.requires_action && data.client_secret) {
        const { loadStripe } = await import('@stripe/stripe-js')
        const publishableKey = document.querySelector<HTMLMetaElement>('meta[name="stripe-key"]')?.content ?? ''
        const stripe = await loadStripe(publishableKey)
        if (!stripe) throw new Error('Stripe failed to load')
        const { error: confirmError } = await stripe.confirmCardPayment(data.client_secret)
        if (confirmError) throw new Error(confirmError.message ?? 'Authentication failed')
        onAccept()
        return
      }

      throw new Error(data.error ?? 'Charge failed')
    } catch (err) {
      setState('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <div style={{
      background: 'var(--color-bg-surface)',
      border: `2px solid var(--color-primary)`,
      borderRadius: 'var(--radius-card)',
      padding: 'var(--space-card)',
      maxWidth: 560,
      margin: '0 auto',
    }}>
      <div style={{
        display: 'inline-block',
        background: 'var(--color-accent)',
        color: '#fff',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '3px 10px',
        borderRadius: 4,
        marginBottom: 14,
      }}>
        Wait — Special One-Time Offer
      </div>

      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            maxWidth: 200,
            display: 'block',
            margin: '0 auto 16px',
            borderRadius: 'var(--radius-thumb)',
          }}
        />
      )}

      <h2 style={{
        fontSize: 'var(--text-2xl)',
        fontWeight: 'var(--weight-bold)',
        color: 'var(--color-text-primary)',
        marginBottom: 8,
        textAlign: 'center',
      }}>
        {product.name}
      </h2>

      {product.description && (
        <p style={{
          fontSize: 'var(--text-base)',
          color: 'var(--color-text-body)',
          textAlign: 'center',
          marginBottom: 16,
          lineHeight: 1.6,
        }}>
          {product.description}
        </p>
      )}

      <div style={{
        textAlign: 'center',
        marginBottom: 24,
      }}>
        {product.originalPrice && (
          <span style={{
            color: 'var(--color-danger)',
            textDecoration: 'line-through',
            fontSize: 'var(--text-lg)',
            marginRight: 8,
          }}>
            {formatPrice(product.originalPrice)}
          </span>
        )}
        <span style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--weight-bold)',
          color: 'var(--color-primary)',
        }}>
          {formatPrice(product.price)}
        </span>
      </div>

      {state === 'error' && (
        <p style={{
          color: 'var(--color-danger-dark)',
          fontSize: 'var(--text-sm)',
          textAlign: 'center',
          marginBottom: 12,
        }}>
          {errorMsg}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={handleAccept}
          disabled={state === 'loading'}
          className="btn-cta"
        >
          {state === 'loading' ? 'Processing…' : `Yes! Add ${product.name} — ${formatPrice(product.price)}`}
        </button>

        <button
          onClick={onDecline}
          disabled={state === 'loading'}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: '8px 0',
          }}
        >
          No thanks, I don't want this offer
        </button>
      </div>
    </div>
  )
}
