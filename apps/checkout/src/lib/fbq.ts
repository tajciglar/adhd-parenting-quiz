declare global {
  interface Window {
    fbq?: (action: string, event: string, data?: Record<string, unknown>) => void
  }
}

export function generateEventId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2)}`
}

export function trackPixelEvent(
  eventName: string,
  data: Record<string, unknown> = {},
  eventId?: string,
) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, { ...data, ...(eventId ? { event_id: eventId } : {}) })
  }
}

/** Read _fbp / _fbc from URL params (passed from quiz) or cookies */
export function getFbpFromUrl(): { fbp: string; fbc: string } {
  if (typeof window === 'undefined') return { fbp: '', fbc: '' }
  const p = new URLSearchParams(window.location.search)
  return {
    fbp: p.get('_fbp') ?? '',
    fbc: p.get('_fbc') ?? '',
  }
}
