import { supabase } from "./supabase";

const API_URL = import.meta.env.VITE_API_URL || "";
const GUEST_ID_STORAGE_KEY = "harbor_guest_id";

// Cache the token to avoid calling getSession() on every request.
// Supabase sessions are long-lived; we cache for 30s and refresh on auth changes.
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

// Listen for auth state changes to invalidate cache
supabase.auth.onAuthStateChange(() => {
  cachedToken = null;
  tokenExpiresAt = 0;
});

async function getToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  cachedToken = session.access_token;
  // Cache for 30 seconds (token itself is valid much longer)
  tokenExpiresAt = now + 30_000;
  return session.access_token;
}

function getGuestId(): string {
  if (typeof window === "undefined") return "server";

  let guestId = window.localStorage.getItem(GUEST_ID_STORAGE_KEY);
  if (guestId) return guestId;

  guestId = crypto.randomUUID();
  window.localStorage.setItem(GUEST_ID_STORAGE_KEY, guestId);
  return guestId;
}

type AuthMode = "required" | "optional" | "none";
interface RequestOptions {
  auth?: AuthMode;
}

async function request(
  method: string,
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<unknown> {
  const authMode = options?.auth ?? "required";
  const headers: Record<string, string> = {
    "x-guest-id": getGuestId(),
  };

  if (authMode !== "none") {
    try {
      const token = await getToken();
      headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      if (authMode === "required") {
        throw error;
      }
    }
  }

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(
      (error as { error?: string }).error || `API error: ${res.status}`,
    );
  }

  return res.json();
}

export const api = {
  get: (path: string, options?: RequestOptions) =>
    request("GET", path, undefined, options),
  patch: (path: string, body: unknown, options?: RequestOptions) =>
    request("PATCH", path, body, options),
  post: (path: string, body?: unknown, options?: RequestOptions) =>
    request("POST", path, body, options),
  put: (path: string, body: unknown, options?: RequestOptions) =>
    request("PUT", path, body, options),
  delete: (path: string, options?: RequestOptions) =>
    request("DELETE", path, undefined, options),
};
