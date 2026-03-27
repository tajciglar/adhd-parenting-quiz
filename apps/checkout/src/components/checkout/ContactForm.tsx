import { useState } from 'react'
import type { ContactInfo } from '../../types/checkout'

interface ContactFormProps {
  onSubmit: (info: ContactInfo) => void
  loading?: boolean
}

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'IE', name: 'Ireland' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'SG', name: 'Singapore' },
]

function validate(data: ContactInfo): Partial<Record<keyof ContactInfo, string>> {
  const errors: Partial<Record<keyof ContactInfo, string>> = {}
  if (!data.firstName.trim()) errors.firstName = 'First name is required'
  if (!data.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Enter a valid email address'
  }
  if (!data.country) errors.country = 'Please select your country'
  return errors
}

export default function ContactForm({ onSubmit, loading = false }: ContactFormProps) {
  const [form, setForm] = useState<ContactInfo>({ firstName: '', email: '', country: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInfo, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof ContactInfo, boolean>>>({})

  function handleChange(field: keyof ContactInfo, value: string) {
    const next = { ...form, [field]: value }
    setForm(next)
    if (touched[field]) {
      setErrors(validate(next))
    }
  }

  function handleBlur(field: keyof ContactInfo) {
    setTouched(t => ({ ...t, [field]: true }))
    setErrors(validate(form))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const allTouched = { firstName: true, email: true, country: true }
    setTouched(allTouched)
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      onSubmit(form)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label className="form-label" htmlFor="cf-firstName">First Name</label>
          <input
            id="cf-firstName"
            type="text"
            autoComplete="given-name"
            className={`form-input${errors.firstName ? ' error' : ''}`}
            value={form.firstName}
            onChange={e => handleChange('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')}
            placeholder="Jane"
          />
          {errors.firstName && (
            <p style={{ color: 'var(--color-danger-dark)', fontSize: 'var(--text-xs)', marginTop: 4 }}>
              {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label className="form-label" htmlFor="cf-email">Email Address</label>
          <input
            id="cf-email"
            type="email"
            autoComplete="email"
            className={`form-input${errors.email ? ' error' : ''}`}
            value={form.email}
            onChange={e => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            placeholder="jane@example.com"
          />
          {errors.email && (
            <p style={{ color: 'var(--color-danger-dark)', fontSize: 'var(--text-xs)', marginTop: 4 }}>
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="form-label" htmlFor="cf-country">Country</label>
          <select
            id="cf-country"
            className={`form-input${errors.country ? ' error' : ''}`}
            value={form.country}
            onChange={e => handleChange('country', e.target.value)}
            onBlur={() => handleBlur('country')}
          >
            <option value="">Select your country…</option>
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
          {errors.country && (
            <p style={{ color: 'var(--color-danger-dark)', fontSize: 'var(--text-xs)', marginTop: 4 }}>
              {errors.country}
            </p>
          )}
        </div>

        <button type="submit" className="btn-cta" disabled={loading}>
          {loading ? 'Loading…' : 'Continue to Payment →'}
        </button>
      </div>
    </form>
  )
}
