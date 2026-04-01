import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

interface StripeElementsCheckoutProps {
  selectedBumpIds: string[]
  publishableKey: string
  returnUrl: string
  project: string
  email: string
  childName: string
  pdfUrl: string
}

interface ContactInfo {
  email: string
  name: string
}

// ── Inner form (must be inside <Elements>) ──────────────────────
function CheckoutForm({ returnUrl }: { returnUrl: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [contact, setContact] = useState<ContactInfo>({ email: '', name: '' })
  const [showExpressOr, setShowExpressOr] = useState(false)

  // Pre-fill from URL params
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    setContact({
      email: p.get('email') ?? '',
      name: p.get('childName') ? '' : '',  // name not in URL, start blank
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setStatus('submitting')
    setErrorMsg('')

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
        payment_method_data: {
          billing_details: {
            name: contact.name || undefined,
            email: contact.email || undefined,
          },
        },
      },
      redirect: 'if_required',
    })

    if (result.error) {
      setErrorMsg(result.error.message ?? 'Payment failed')
      setStatus('error')
    } else {
      const piId = result.paymentIntent?.id
      const url = piId ? `${returnUrl}&payment_intent=${piId}` : returnUrl
      window.location.href = url
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#FFFFFF',
    border: '1px solid rgba(26,26,26,0.18)',
    borderRadius: 8,
    fontFamily: 'Inter, sans-serif',
    fontSize: 15,
    color: '#1A1A1A',
    padding: '10px 12px',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: '#1A1A1A',
    marginBottom: 4,
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* ── Express checkout (Apple Pay / Google Pay) ── */}
      <ExpressCheckoutElement
        onConfirm={async (event) => {
          if (!stripe || !elements) return
          setStatus('submitting')
          setErrorMsg('')

          const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
              return_url: returnUrl,
              payment_method_data: {
                billing_details: {
                  name: event.billingDetails?.name ?? contact.name ?? undefined,
                  email: event.billingDetails?.email ?? contact.email ?? undefined,
                },
              },
            },
            redirect: 'if_required',
          })

          if (result.error) {
            setErrorMsg(result.error.message ?? 'Payment failed')
            setStatus('error')
          } else {
            const piId = result.paymentIntent?.id
            const url = piId ? `${returnUrl}&payment_intent=${piId}` : returnUrl
            window.location.href = url
          }
        }}
        onReady={({ availablePaymentMethods }) => {
          if (availablePaymentMethods && Object.values(availablePaymentMethods).some(Boolean)) {
            setShowExpressOr(true)
          }
        }}
        options={{
          buttonType: { applePay: 'buy', googlePay: 'buy' },
          buttonHeight: 48,
        }}
      />

      {/* "Or" divider — only shown when express methods are available */}
      {showExpressOr && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          margin: '16px 0',
        }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(26,26,26,0.12)' }} />
          <span style={{ fontSize: 13, color: '#777', fontFamily: 'Inter, sans-serif' }}>Or pay with card</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(26,26,26,0.12)' }} />
        </div>
      )}

      {/* ── Contact information ── */}
      <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={labelStyle}>Email address</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={contact.email}
            onChange={e => setContact(c => ({ ...c, email: e.target.value }))}
            style={inputStyle}
            onFocus={e => {
              e.target.style.borderColor = '#7040CA'
              e.target.style.boxShadow = '0 0 0 3px rgba(112,64,202,0.18)'
            }}
            onBlur={e => {
              e.target.style.borderColor = 'rgba(26,26,26,0.18)'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>
        <div>
          <label style={labelStyle}>Full name</label>
          <input
            type="text"
            required
            placeholder="Jane Smith"
            value={contact.name}
            onChange={e => setContact(c => ({ ...c, name: e.target.value }))}
            style={inputStyle}
            onFocus={e => {
              e.target.style.borderColor = '#7040CA'
              e.target.style.boxShadow = '0 0 0 3px rgba(112,64,202,0.18)'
            }}
            onBlur={e => {
              e.target.style.borderColor = 'rgba(26,26,26,0.18)'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>
      </div>

      {/* ── Stripe PaymentElement ── */}
      <PaymentElement
        options={{
          layout: 'tabs',
          fields: {
            billingDetails: {
              name: 'never',
              email: 'never',
            },
          },
        }}
      />

      {status === 'error' && (
        <div style={{
          marginTop: 12,
          padding: '10px 14px',
          background: 'rgba(208,1,27,0.06)',
          border: '1px solid var(--color-danger)',
          borderRadius: 8,
          fontSize: 'var(--text-sm)',
          color: 'var(--color-danger-dark)',
        }}>
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || status === 'submitting'}
        style={{
          marginTop: 20,
          width: '100%',
          padding: '14px 24px',
          background: status === 'submitting' ? 'var(--color-primary-hover)' : 'var(--color-primary)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-button)',
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--weight-bold)',
          fontFamily: 'var(--font-primary)',
          cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          transition: 'background 0.15s',
        }}
      >
        {status === 'submitting' ? (
          <>
            <span style={{
              display: 'inline-block',
              width: 16,
              height: 16,
              border: '2px solid rgba(255,255,255,0.4)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            Processing…
          </>
        ) : (
          <>🔒 Pay Now</>
        )}
      </button>

      <p style={{
        marginTop: 10,
        textAlign: 'center',
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-muted)',
      }}>
        Secured by Stripe · 256-bit SSL encryption
      </p>
    </form>
  )
}

// ── Outer component — manages PaymentIntent + stripePromise ─────
export default function StripeElementsCheckout({
  selectedBumpIds,
  publishableKey,
  returnUrl,
  project,
  email,
  childName,
  pdfUrl,
}: StripeElementsCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [stripePromise] = useState(() => loadStripe(publishableKey))

  useEffect(() => {
    let cancelled = false
    setClientSecret(null)
    setError('')

    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project, selectedBumpIds, email, childName, pdfUrl }),
    })
      .then(r => r.json())
      .then((data: { clientSecret?: string; error?: string }) => {
        if (cancelled) return
        if (data.error) throw new Error(data.error)
        setClientSecret(data.clientSecret ?? null)
      })
      .catch(err => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to initialise payment')
      })

    return () => { cancelled = true }
  }, [selectedBumpIds.join(','), project, email, childName, pdfUrl])

  if (error) {
    return (
      <div style={{
        padding: 16,
        background: 'rgba(208,1,27,0.06)',
        border: '1px solid var(--color-danger)',
        borderRadius: 8,
        fontSize: 'var(--text-sm)',
        color: 'var(--color-danger-dark)',
      }}>
        <strong>Payment setup failed:</strong> {error}
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{
          display: 'inline-block',
          width: 28, height: 28,
          border: '3px solid rgba(112,64,202,0.2)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary:         '#7040CA',
            colorBackground:      '#FFFFFF',
            colorText:            '#1A1A1A',
            colorDanger:          '#E15334',
            colorTextSecondary:   '#777777',
            fontFamily:           'Inter, sans-serif',
            fontSizeBase:         '15px',
            spacingUnit:          '4px',
            borderRadius:         '8px',
          },
          rules: {
            '.Input': {
              border:    '1px solid rgba(26,26,26,0.18)',
              boxShadow: 'none',
              padding:   '10px 12px',
            },
            '.Input:focus': {
              border:    '1px solid #7040CA',
              boxShadow: '0 0 0 3px rgba(112,64,202,0.18)',
            },
            '.Label': {
              fontSize:   '13px',
              fontWeight: '500',
              color:      '#1A1A1A',
            },
            '.Tab': {
              border:    '1px solid rgba(26,26,26,0.12)',
              boxShadow: 'none',
            },
            '.Tab--selected': {
              border:    '1px solid #7040CA',
              boxShadow: '0 0 0 3px rgba(112,64,202,0.12)',
            },
          },
        },
      }}
    >
      <CheckoutForm returnUrl={returnUrl} />
    </Elements>
  )
}
