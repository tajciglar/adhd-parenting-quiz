import type { BumpConfig } from '../../config/projects'

interface OrderBumpProps {
  bump: BumpConfig
  checked: boolean
  onToggle: (id: string, checked: boolean) => void
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export default function OrderBump({ bump, checked, onToggle }: OrderBumpProps) {
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
        .bump-arrow { animation: bump-arrow 0.7s ease-in-out infinite; display: inline-block; }
      `}</style>

      {/* Header */}
      <div style={{ background: 'rgba(112,64,202,0.08)', padding: 'var(--space-card)' }}>
        <label style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
          cursor: 'pointer',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flex: 1 }}>
            <span className="bump-arrow" style={{ color: 'var(--color-accent)', fontSize: 18, lineHeight: 1, marginTop: 2, flexShrink: 0 }}>▶</span>
            <input
              type="checkbox"
              checked={checked}
              onChange={e => onToggle(bump.id, e.target.checked)}
              style={{ width: 18, height: 18, flexShrink: 0, accentColor: 'var(--color-primary)', marginTop: 2, cursor: 'pointer' }}
            />
            <span style={{
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--color-text-primary)',
              lineHeight: 1.3,
            }}>
              {bump.checkboxLabel}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, gap: 2 }}>
            <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-danger)', textDecoration: 'line-through', fontWeight: 'var(--weight-medium)' }}>
              {formatPrice(bump.regularPrice)}
            </span>
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-success)' }}>
              {formatPrice(bump.salePrice)}
            </span>
          </div>
        </label>
      </div>

      {/* Content */}
      <div style={{ background: '#ffffff', padding: 'var(--space-card)' }}>
        <div className="bump-content">
          {bump.image && (
            <img
              src={bump.image}
              alt={bump.name}
              style={{ width: 130, flexShrink: 0, borderRadius: 'var(--radius-thumb)', objectFit: 'cover' }}
            />
          )}
          <div style={{ flex: 1 }}>
            {bump.description && (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-body)', marginBottom: 10, lineHeight: 1.5 }}>
                {bump.description}
              </p>
            )}
            {bump.bullets.length > 0 && (
              <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {bump.bullets.map((bullet, i) => (
                  <li key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-body)', lineHeight: 1.4 }}>
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
            <div style={{ marginTop: 12 }}>
              <span style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-saving)',
                fontWeight: 'var(--weight-bold)',
                background: 'rgba(9,178,156,0.1)',
                padding: '3px 10px',
                borderRadius: 4,
              }}>
                You save {formatPrice(bump.regularPrice - bump.salePrice)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
