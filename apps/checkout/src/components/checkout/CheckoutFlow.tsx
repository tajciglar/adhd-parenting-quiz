import { useState, useEffect } from 'react'
import OrderBump from './OrderBump'
import StripeElementsCheckout from './StripeElementsCheckout'
import type { ProjectConfig } from '../../config/projects'

interface CheckoutFlowProps {
  project: ProjectConfig
  publishableKey: string
  email?: string
  childName?: string
  archetype?: string
  gender?: string
  pdfUrl?: string
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

export default function CheckoutFlow({
  project,
  publishableKey,
  email: emailProp = '',
  childName: childNameProp = '',
  archetype = '',
  gender = '',
  pdfUrl: pdfUrlProp = '',
  fbp = '',
  fbc = '',
}: CheckoutFlowProps) {
  // Track selected bump IDs independently
  const [selectedBumpIds, setSelectedBumpIds] = useState<string[]>([])

  const [params, setParams] = useState({
    childName: childNameProp,
    animalType: archetype,
    email: emailProp,
    pdfUrl: pdfUrlProp,
  })

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    setParams({
      childName:  p.get('childName')  ?? childNameProp,
      animalType: p.get('archetype')  ?? archetype,
      email:      p.get('email')      ?? emailProp,
      pdfUrl:     p.get('pdfUrl')     ?? pdfUrlProp,
    })
  }, [])

  function handleBumpToggle(id: string, checked: boolean) {
    setSelectedBumpIds(prev =>
      checked ? [...prev, id] : prev.filter(b => b !== id)
    )
  }

  const bumpTotal = selectedBumpIds.reduce((sum, id) => {
    const bump = project.bumps.find(b => b.id === id)
    return sum + (bump?.salePrice ?? 0)
  }, 0)

  const total = project.price + bumpTotal

  const mainProductLabel = params.childName && params.animalType
    ? `${params.childName}'s Full ADHD Personality Type Report — ${params.animalType}`
    : project.name

  const returnUrl = (() => {
    const base = typeof window !== 'undefined' ? window.location.origin : ''
    const p = new URLSearchParams()
    if (params.email)     p.set('email', params.email)
    if (params.childName) p.set('childName', params.childName)
    if (gender)           p.set('gender', gender)
    if (fbp)              p.set('_fbp', fbp)
    if (fbc)              p.set('_fbc', fbc)
    return `${base}/thank-you?${p.toString()}`
  })()

  return (
    <div className="checkout-grid">
      {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
      <div className="checkout-col-left">

        {/* Order Summary */}
        <div className="card">
          <h2 className="section-heading">Order Summary:</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Main product row */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8,
              paddingBottom: selectedBumpIds.length > 0 ? 10 : 0,
              borderBottom: selectedBumpIds.length > 0 ? '1px solid var(--color-border-subtle)' : 'none',
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-medium)' }}>{mainProductLabel}</p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Instant digital delivery</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, gap: 2 }}>
                {project.originalPrice && (
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-danger)', textDecoration: 'line-through', fontWeight: 'var(--weight-medium)' }}>
                    {formatPrice(project.originalPrice)}
                  </span>
                )}
                <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
                  {formatPrice(project.price)}
                </span>
              </div>
            </div>

            {/* Selected bump rows */}
            {selectedBumpIds.map(id => {
              const bump = project.bumps.find(b => b.id === id)
              if (!bump) return null
              return (
                <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-medium)', flex: 1 }}>{bump.name}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, gap: 2 }}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-danger)', textDecoration: 'line-through' }}>
                      {formatPrice(bump.regularPrice)}
                    </span>
                    <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
                      {formatPrice(bump.salePrice)}
                    </span>
                  </div>
                </div>
              )
            })}

            {/* Total savings */}
            {selectedBumpIds.length > 0 && (() => {
              const saved = selectedBumpIds.reduce((s, id) => {
                const b = project.bumps.find(x => x.id === id)
                return s + ((b?.regularPrice ?? 0) - (b?.salePrice ?? 0))
              }, 0)
              return (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--color-danger)' }}>You Save:</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-danger)', fontWeight: 'var(--weight-medium)' }}>
                    -{formatPrice(saved)}
                  </span>
                </div>
              )
            })()}

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--color-border-subtle)' }}>
              <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)' }}>Total</span>
              <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)' }}>{formatPrice(total)} USD</span>
            </div>
          </div>
        </div>

        {/* Render all bumps */}
        {project.bumps.map(bump => (
          <OrderBump
            key={bump.id}
            bump={bump}
            checked={selectedBumpIds.includes(bump.id)}
            onToggle={handleBumpToggle}
          />
        ))}

        <GuaranteeCard className="desktop-only" />
      </div>

      {/* ── RIGHT COLUMN ────────────────────────────────────────── */}
      <div className="checkout-col-right">
        <div className="card">
          <StripeElementsCheckout
            selectedBumpIds={selectedBumpIds}
            publishableKey={publishableKey}
            returnUrl={returnUrl}
            project={project.id}
            email={params.email}
            childName={params.childName}
            pdfUrl={params.pdfUrl}
          />
        </div>

        <GuaranteeCard className="mobile-only" />
      </div>
    </div>
  )
}
