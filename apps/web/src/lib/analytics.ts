const SESSION_KEY = "wildprint_session_id";
const TEST_MODE_KEY = "wildprint_test_mode";
const API_URL = import.meta.env.VITE_API_URL || "";

/** Call once on app init to capture ?test=true from the URL into sessionStorage */
export function initTestMode(): void {
  const params = new URLSearchParams(window.location.search);
  if (params.get("test") === "true") {
    sessionStorage.setItem(TEST_MODE_KEY, "1");
  }
}

/** Returns true when the current session is a test session */
export function isTestMode(): boolean {
  return sessionStorage.getItem(TEST_MODE_KEY) === "1";
}

export function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/**
 * Fire-and-forget POST to /api/guest/track.
 * Never throws — tracking failures shouldn't break the UX.
 * Skips tracking entirely on localhost.
 */
export function trackFunnelEvent(
  eventType: "step_viewed" | "quiz_completed" | "checkout_started" | "purchase_completed" | "answer_submitted" | "optin_completed" | "optin_thankyou" | "wp_checkout_redirect",
  stepNumber?: number,
  metadata?: Record<string, unknown>,
): void {
  try {
    // Skip tracking on localhost
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;

    const body: Record<string, unknown> = {
      sessionId: getSessionId(),
      eventType,
    };
    if (stepNumber != null) body.stepNumber = stepNumber;
    if (metadata) body.metadata = metadata;
    if (isTestMode()) body.isTest = true;

    fetch(`${API_URL}/api/guest/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {
      // silently ignore tracking failures
    });
  } catch {
    // silently ignore
  }
}
