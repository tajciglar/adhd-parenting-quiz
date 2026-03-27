import { useState, useEffect, useRef } from 'react'

interface StripeCheckoutProps {
  bumpIncluded: boolean
  publishableKey: string
}

type UIState = 'loading' | 'ready' | 'error'

export default function StripeCheckout({ bumpIncluded, publishableKey }: StripeCheckoutProps) {
  const [uiState, setUiState] = useState<UIState>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const checkoutRef = useRef<{ mount: (s: string) => void; destroy: () => void } | null>(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      // Destroy previous instance before creating a new one
      if (checkoutRef.current) {
        checkoutRef.current.destroy()
        checkoutRef.current = null
      }

      setUiState('loading')
      setErrorMsg('')

      try {
        const res = await fetch('/api/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bumpIncluded }),
        })
        if (cancelled) return

        if (!res.ok) {
          const data = await res.json().catch(() => ({})) as { error?: string }
          throw new Error(data.error ?? 'Failed to create checkout session')
        }

        const { clientSecret } = await res.json() as { clientSecret: string }
        if (cancelled) return

        const { loadStripe } = await import('@stripe/stripe-js')
        const stripe = await loadStripe(publishableKey)
        if (!stripe || cancelled) return

        const checkout = await stripe.initEmbeddedCheckout({ clientSecret })
        if (cancelled) {
          checkout.destroy()
          return
        }

        checkoutRef.current = checkout
        // Container is always in the DOM — safe to mount immediately
        checkout.mount('#stripe-checkout-container')
        setUiState('ready')
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
          setUiState('error')
        }
      }
    }

    init()

    return () => {
      cancelled = true
      if (checkoutRef.current) {
        checkoutRef.current.destroy()
        checkoutRef.current = null
      }
    }
  }, [bumpIncluded, publishableKey])

  return (
    <div style={{ position: 'relative' }}>
      {/* Container is always rendered so Stripe can mount into it */}
      <div id="stripe-checkout-container" />

      {uiState === 'loading' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: 80,
          background: 'var(--color-bg-surface)',
        }}>
          <div style={{
            width: 28, height: 28,
            border: '3px solid rgba(112,64,202,0.2)',
            borderTopColor: 'var(--color-primary)',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {uiState === 'error' && (
        <div style={{
          background: 'rgba(208,1,27,0.06)',
          border: '1px solid var(--color-danger-dark)',
          borderRadius: 8,
          padding: 16,
          color: 'var(--color-danger-dark)',
          fontSize: 'var(--text-sm)',
        }}>
          <strong>Payment setup failed:</strong> {errorMsg}
          <br />
          <button
            onClick={() => {
              setUiState('loading')
              setErrorMsg('')
            }}
            style={{
              marginTop: 10,
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
