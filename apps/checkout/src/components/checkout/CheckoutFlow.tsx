import { useState, useEffect } from 'react'
import OrderBump from './OrderBump'
import StripeElementsCheckout from './StripeElementsCheckout'
import type { CheckoutConfig } from '../../types/checkout'

interface CheckoutFlowProps {
  config: CheckoutConfig
  publishableKey: string
  email?: string
  childName?: string
  archetype?: string
  gender?: string
  fbp?: string
  fbc?: string
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

function GuaranteeCard({ className }: { className?: string }) {
  return (
    <div className={`card${className ? ` ${className}` : ''}`}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <img
          src="/money-back-guarantee.webp"
          alt="14-day money-back guarantee"
          style={{ width: '20%', minWidth: 56, flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)', marginBottom: 4 }}>
            14-Day Money-Back Guarantee
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-body)', lineHeight: 1.6 }}>
            If the report doesn't feel like it was written specifically about your child, email us in the next 14 days and we'll refund you, no questions asked.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutFlow({ config, publishableKey, email = '', childName: childNameProp = '', archetype = '', gender = '', fbp = '', fbc = '' }: CheckoutFlowProps) {
  const [bumpIncluded, setBumpIncluded] = useState(false)

  const [params, setParams] = useState({ childName: childNameProp, animalType: archetype })

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    setParams({
      childName:  p.get('childName')  ?? childNameProp,
      animalType: p.get('archetype')  ?? archetype,
    })
  }, [])

  const total = config.main.price + (bumpIncluded ? config.bump.price : 0)

  const mainProductLabel = params.childName && params.animalType
    ? `${params.childName}'s Full ADHD Personality Type Report — ${params.animalType}`
    : config.main.name

  return (
    <div className="checkout-grid">
      {/* ── LEFT COLUMN ────────────────────────────────────────── */}
      <div className="checkout-col-left">

        {/* Order Summary */}
        <div className="card">
          <h2 className="section-heading">Order Summary:</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8,
              paddingBottom: bumpIncluded ? 10 : 0,
              borderBottom: bumpIncluded ? '1px solid var(--color-border-subtle)' : 'none',
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-medium)' }}>{mainProductLabel}</p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Instant digital delivery</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, gap: 2 }}>
                {config.main.originalPrice && (
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-danger)', textDecoration: 'line-through', fontWeight: 'var(--weight-medium)' }}>
                    {formatPrice(config.main.originalPrice)}
                  </span>
                )}
                <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
                  {formatPrice(config.main.price)}
                </span>
              </div>
            </div>

            {bumpIncluded && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-medium)', flex: 1 }}>{config.bump.name}</p>
                <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)', flexShrink: 0 }}>
                  {formatPrice(config.bump.price)}
                </span>
              </div>
            )}

            {bumpIncluded && config.bump.originalPrice && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--color-danger)' }}>You Save:</span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-danger)', fontWeight: 'var(--weight-medium)' }}>
                  -{formatPrice(config.bump.originalPrice - config.bump.price)}
                </span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--color-border-subtle)' }}>
              <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)' }}>Total</span>
              <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)' }}>{formatPrice(total)} USD</span>
            </div>
          </div>
        </div>

        {/* Order bump */}
        <OrderBump
          product={config.bump}
          onToggle={setBumpIncluded}
          checkboxLabel="I want my child to become more organized, focused, and productive."
        />

        {/* 14-day guarantee — desktop only */}
        <GuaranteeCard className="desktop-only" />

      </div>

      {/* ── RIGHT COLUMN ───────────────────────────────────────── */}
      <div className="checkout-col-right">

        {/* Stripe Elements checkout */}
        <div className="card">
          <StripeElementsCheckout
            bumpIncluded={bumpIncluded}
            publishableKey={publishableKey}
            returnUrl={(() => {
              const base = typeof window !== 'undefined' ? window.location.origin : ''
              const p = new URLSearchParams()
              if (email)          p.set('email', email)
              if (params.childName) p.set('childName', params.childName)
              if (gender)         p.set('gender', gender)
              if (fbp)            p.set('_fbp', fbp)
              if (fbc)            p.set('_fbc', fbc)
              return `${base}/upsell?${p.toString()}`
            })()}
          />
        </div>

        {/* 14-day guarantee — mobile only */}
        <GuaranteeCard className="mobile-only" />

      </div>
    </div>
  )
}
