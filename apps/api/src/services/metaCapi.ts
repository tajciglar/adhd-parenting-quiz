/**
 * Shared Meta Conversions API (CAPI) utility.
 * Used by guest.ts (Lead event) and woocommerce.ts (Purchase event).
 */

export interface MetaEventOpts {
  eventName: string;
  eventId: string;
  email: string;
  sourceUrl?: string;
  clientIp?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
  customData?: Record<string, unknown>;
  logger: {
    error: (obj: unknown, msg: string) => void;
    warn: (msg: string) => void;
  };
}

export async function sendMetaEvent(opts: MetaEventOpts): Promise<void> {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const pixelId = process.env.META_PIXEL_ID;
  if (!accessToken || !pixelId) return;

  try {
    const userData: Record<string, unknown> = {};

    if (opts.email) {
      const encoder = new TextEncoder();
      const data = encoder.encode(opts.email.toLowerCase().trim());
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashedEmail = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      userData.em = [hashedEmail];
    }
    if (opts.clientIp) userData.client_ip_address = opts.clientIp;
    if (opts.userAgent) userData.client_user_agent = opts.userAgent;
    if (opts.fbc) userData.fbc = opts.fbc;
    if (opts.fbp) userData.fbp = opts.fbp;

    const eventPayload: Record<string, unknown> = {
      event_name: opts.eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: opts.eventId,
      action_source: "website",
      user_data: userData,
    };
    if (opts.sourceUrl) eventPayload.event_source_url = opts.sourceUrl;
    if (opts.customData) eventPayload.custom_data = opts.customData;

    const res = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ data: [eventPayload] }),
      },
    );

    if (!res.ok) {
      const err = await res.json();
      opts.logger.warn(`Meta CAPI ${opts.eventName} failed: ${JSON.stringify(err)}`);
    }
  } catch (err) {
    opts.logger.error({ err }, `meta_capi.${opts.eventName.toLowerCase()}_failed`);
  }
}
