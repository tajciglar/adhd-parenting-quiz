import { useState } from 'react'
import type { OrderBumpProps } from '../../types/checkout'

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export default function OrderBump({
  product,
  defaultChecked = false,
  checkboxLabel,
  onToggle,
}: OrderBumpProps) {
  const [checked, setChecked] = useState(defaultChecked)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setChecked(e.target.checked)
    onToggle(e.target.checked)
  }

  const label = checkboxLabel ?? `Yes! I Want ${product.name}`

  return (
    <div style={{
      border: `2px dashed var(--color-border-bump)`,
      borderRadius: 'var(--radius-card)',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes bump-arrow {
          0%, 100% { transform: translateX(0); }
          50%       { transform: translateX(5px); }
        }
        .bump-arrow {
          animation: bump-arrow 0.7s ease-in-out infinite;
          display: inline-block;
        }
      `}</style>

      {/* ── HEADER — light orange background ── */}
      <div style={{ background: 'rgba(112,64,202,0.08)', padding: 'var(--space-card)' }}>
        

        {/* Arrow + checkbox + label | prices */}
        <label style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
          cursor: 'pointer',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flex: 1 }}>
            <span
              className="bump-arrow"
              style={{ color: 'var(--color-accent)', fontSize: 18, lineHeight: 1, marginTop: 2, flexShrink: 0 }}
            >▶</span>
            <input
              type="checkbox"
              checked={checked}
              onChange={handleChange}
              style={{
                width: 18, height: 18, flexShrink: 0,
                accentColor: 'var(--color-primary)',
                marginTop: 2, cursor: 'pointer',
              }}
            />
            <span style={{
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--color-text-primary)',
              lineHeight: 1.3,
            }}>
              {label}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, gap: 2 }}>
            {product.originalPrice && (
              <span style={{
                fontSize: 'var(--text-base)',
                color: 'var(--color-danger)',
                textDecoration: 'line-through',
                fontWeight: 'var(--weight-medium)',
              }}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--color-success)',
            }}>
              {formatPrice(product.price)}
            </span>
          </div>
        </label>
      </div>

      {/* ── CONTENT — white background ── */}
      <div style={{ background: '#ffffff', padding: 'var(--space-card)' }}>
        <div className="bump-content">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              style={{ width: 130, flexShrink: 0, borderRadius: 'var(--radius-thumb)', objectFit: 'cover' }}
            />
          )}

          <div style={{ flex: 1 }}>
            {product.description && (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-body)', marginBottom: 10, lineHeight: 1.5 }}>
                {product.description}
              </p>
            )}

            {product.bullets && product.bullets.length > 0 && (
              <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {product.bullets.map((bullet, i) => (
                  <li key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-body)', lineHeight: 1.4 }}>
                    {bullet}
                  </li>
                ))}
              </ul>
            )}

            {product.originalPrice && (
              <div style={{ marginTop: 12 }}>
                <span style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-saving)',
                  fontWeight: 'var(--weight-bold)',
                  background: 'rgba(9,178,156,0.1)',
                  padding: '3px 10px',
                  borderRadius: 4,
                }}>
                  You save {formatPrice(product.originalPrice - product.price)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
