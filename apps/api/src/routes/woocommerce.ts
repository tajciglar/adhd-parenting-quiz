import type { FastifyInstance } from "fastify";
import crypto from "crypto";
import { insertFunnelEvent, getSupabaseAdmin } from "../services/supabaseAdmin.js";
import { sendMetaEvent } from "../services/metaCapi.js";

/**
 * Verify WooCommerce webhook signature.
 * WC signs with HMAC-SHA256 using the webhook secret and sends the signature
 * in the X-WC-Webhook-Signature header (base64-encoded).
 */
function verifyWcSignature(
  payload: Buffer,
  signature: string,
  secret: string,
): boolean {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected),
  );
}

export default async function woocommerceRoutes(fastify: FastifyInstance) {
  // ── POST /api/wc/webhook ──────────────────────────────────────────────────
  // WooCommerce fires this on order.completed (or order.processing for digital goods)
  fastify.post(
    "/wc/webhook",
    {
      config: {
        rateLimit: false,
        rawBody: true,
      },
    },
    async (request, reply) => {
      const wcSecret = process.env.WC_WEBHOOK_SECRET;
      if (!wcSecret) {
        request.log.error("WC_WEBHOOK_SECRET not set");
        return reply.status(500).send({ error: "Webhook not configured" });
      }

      // ── Verify signature ──────────────────────────────────────────────
      const signature = request.headers["x-wc-webhook-signature"] as string;
      if (!signature) {
        return reply
          .status(400)
          .send({ error: "Missing x-wc-webhook-signature header" });
      }

      const rawBody = (request as unknown as { rawBody: Buffer }).rawBody;
      if (!verifyWcSignature(rawBody, signature, wcSecret)) {
        request.log.error("woocommerce.webhook.signature_verification_failed");
        return reply
          .status(400)
          .send({ error: "Webhook signature verification failed" });
      }

      // ── Handle ping (WC sends a ping when you first create the webhook) ─
      const topic = request.headers["x-wc-webhook-topic"] as string;
      if (!topic || topic === "action.woocommerce_webhook_ping") {
        return reply.status(200).send({ received: true, topic: "ping" });
      }

      // ── Parse order payload ───────────────────────────────────────────
      const order = request.body as Record<string, unknown>;
      const orderId = String(order.id ?? "");
      const orderStatus = String(order.status ?? "");

      // Only process completed/processing orders
      if (!["completed", "processing"].includes(orderStatus)) {
        request.log.info(
          { orderId, orderStatus },
          "woocommerce.webhook.skipped_status",
        );
        return reply.status(200).send({ received: true, skipped: true });
      }

      // Extract billing info
      const billing = (order.billing ?? {}) as Record<string, string>;
      const customerEmail = billing.email ?? "";

      // Extract custom meta from order (passed via checkout URL params)
      // WooCommerce stores order meta in meta_data array
      // Keys match the checkout URL params: kids_name, archetype, _fbp, _fbc
      const metaData = (order.meta_data ?? []) as Array<{
        key: string;
        value: string;
      }>;
      const getMeta = (key: string) =>
        metaData.find((m) => m.key === key)?.value ?? "";

      const childName = getMeta("kids_name") || getMeta("child_name"); // fallback for old orders
      const archetypeId = getMeta("archetype");
      const fbp = getMeta("_fbp");
      const fbc = getMeta("_fbc");

      // Calculate order total
      const orderTotal = parseFloat(String(order.total ?? "0"));
      const currency = String(order.currency ?? "USD").toUpperCase();

      request.log.info(
        {
          event: "wc_purchase_completed",
          orderId,
          email: customerEmail,
          childName,
          archetypeId,
          total: orderTotal,
        },
        "woocommerce.webhook.order_completed",
      );

      // ── 1. Find and update quiz_submission by email ───────────────────
      const sb = getSupabaseAdmin();
      let submissionId: string | undefined;

      if (sb && customerEmail) {
        const { data: submissions } = await sb
          .from("quiz_submissions")
          .select("id")
          .eq("email", customerEmail.toLowerCase())
          .eq("paid", false)
          .order("created_at", { ascending: false })
          .limit(1);

        if (submissions?.length && submissions[0].id) {
          submissionId = String(submissions[0].id);
          void sb.from("quiz_submissions")
            .update({ paid: true })
            .eq("id", submissionId);
        }
      }

      // ── 2. Track purchase event in funnel_events ──────────────────────
      void insertFunnelEvent(
        `wc_${orderId}`,
        "purchase_completed",
        undefined,
        {
          submissionId,
          email: customerEmail,
          source: "woocommerce",
          orderId,
          total: orderTotal,
        },
      );

      // NOTE: AC purchase tag is now handled by WP/WooCommerce directly.
      // No need to apply it here.

      // ── 3. Server-side Meta CAPI Purchase event ───────────────────────
      if (customerEmail) {
        void sendMetaEvent({
          eventName: "Purchase",
          eventId: `purchase_wc_${orderId}`,
          email: customerEmail,
          fbc: fbc || undefined,
          fbp: fbp || undefined,
          customData: {
            value: orderTotal,
            currency,
          },
          logger: request.log,
        });
      }

      return reply.status(200).send({ received: true });
    },
  );
}
