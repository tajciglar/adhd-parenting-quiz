import type { FastifyInstance } from "fastify";
import { createHmac } from "crypto";
import { getSupabaseAdmin, insertQuizSubmission } from "../services/supabaseAdmin.js";

// ── Helpers ──────────────────────────────────────────────────────────────────

async function addAcPurchaseTag(email: string, firstName: string, lastName: string): Promise<boolean> {
  const apiUrl = process.env.AC_API_URL?.replace(/\/$/, "");
  const apiKey = process.env.AC_API_KEY;
  if (!apiUrl || !apiKey) return false;

  const headers = { "Content-Type": "application/json", "Api-Token": apiKey };

  try {
    // 1. Sync contact (create or update)
    const syncRes = await fetch(`${apiUrl}/api/3/contact/sync`, {
      method: "POST",
      headers,
      body: JSON.stringify({ contact: { email, firstName, lastName } }),
    });
    if (!syncRes.ok) return false;

    const syncData = (await syncRes.json()) as { contact: { id: number | string } };
    const contactId = String(syncData.contact.id);

    // 2. Find or create the "WC Purchase" tag
    const TAG_NAME = "WC Purchase";
    const tagSearchRes = await fetch(`${apiUrl}/api/3/tags?search=${encodeURIComponent(TAG_NAME)}`, { headers });
    if (!tagSearchRes.ok) return false;
    const tagSearchData = (await tagSearchRes.json().catch(() => ({ tags: [] }))) as { tags: Array<{ id: number | string; tag: string }> };
    let tagId = String(tagSearchData.tags.find((t) => t.tag === TAG_NAME)?.id ?? "");

    if (!tagId || tagId === "undefined") {
      const createRes = await fetch(`${apiUrl}/api/3/tags`, {
        method: "POST",
        headers,
        body: JSON.stringify({ tag: { tag: TAG_NAME, tagType: "contact", description: "" } }),
      });
      if (!createRes.ok) return false;
      const createData = (await createRes.json().catch(() => ({}))) as { tag?: { id: number | string } };
      if (createData.tag?.id) tagId = String(createData.tag.id);
    }

    if (!tagId || tagId === "undefined") return false;

    // 3. Apply tag to contact
    const applyRes = await fetch(`${apiUrl}/api/3/contactTags`, {
      method: "POST",
      headers,
      body: JSON.stringify({ contactTag: { contact: contactId, tag: tagId } }),
    });
    return applyRes.ok;
  } catch {
    return false;
  }
}

/**
 * Fetch the PDF_URL custom field value for a contact in AC.
 * Returns null if the contact doesn't exist or has no PDF_URL set.
 */
async function getAcPdfUrl(email: string): Promise<string | null> {
  const apiUrl = process.env.AC_API_URL?.replace(/\/$/, "");
  const apiKey = process.env.AC_API_KEY;
  if (!apiUrl || !apiKey) return null;

  const headers = { "Content-Type": "application/json", "Api-Token": apiKey };

  try {
    // 1. Look up contact by email
    const contactRes = await fetch(`${apiUrl}/api/3/contacts?email=${encodeURIComponent(email)}&limit=1`, { headers });
    if (!contactRes.ok) return null;
    const contactData = (await contactRes.json().catch(() => ({ contacts: [] }))) as { contacts: Array<{ id: string }> };
    if (!contactData.contacts?.length) return null;
    const contactId = String(contactData.contacts[0].id);

    // 2. Get all field values for this contact
    const fieldsRes = await fetch(`${apiUrl}/api/3/contacts/${contactId}/fieldValues`, { headers });
    if (!fieldsRes.ok) return null;
    const fieldsData = (await fieldsRes.json().catch(() => ({ fieldValues: [] }))) as {
      fieldValues: Array<{ field: string; value: string }>;
    };

    // 3. Find PDF_URL field id
    const fieldListRes = await fetch(`${apiUrl}/api/3/fields?limit=100`, { headers });
    if (!fieldListRes.ok) return null;
    const fieldListData = (await fieldListRes.json().catch(() => ({ fields: [] }))) as {
      fields: Array<{ id: number | string; perstag: string }>;
    };
    const pdfField = fieldListData.fields.find((f) => f.perstag.replace(/%/g, "") === "PDF_URL");
    if (!pdfField) return null;

    const fieldId = String(pdfField.id);
    const match = fieldsData.fieldValues.find((fv) => String(fv.field) === fieldId);
    return match?.value || null;
  } catch {
    return null;
  }
}

/**
 * Decode a signed PDF URL back to its payload.
 * Returns null if the URL is not a valid signed URL from this system.
 */
function decodePdfUrl(pdfUrl: string): { archetypeId: string; childName: string; childGender: string } | null {
  try {
    const url = new URL(pdfUrl);
    const data = url.searchParams.get("data");
    if (!data) return null;
    const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as {
      archetypeId: string;
      childName: string;
      childGender?: string;
    };
    if (!payload.archetypeId || !payload.childName) return null;
    return {
      archetypeId: payload.archetypeId,
      childName: payload.childName,
      childGender: payload.childGender ?? "Other",
    };
  } catch {
    return null;
  }
}

// ── Route ─────────────────────────────────────────────────────────────────────

export default async function woocommerceRoutes(fastify: FastifyInstance) {
  // POST /api/wc/webhook
  // WooCommerce → Settings → Advanced → Webhooks
  //   Topic:   Order updated  (or Order completed)
  //   URL:     https://adhd-ai-assistantapi-production-89b1.up.railway.app/api/wc/webhook
  //   Secret:  value of WC_WEBHOOK_SECRET env var on Railway
  fastify.post(
    "/wc/webhook",
    { config: { rawBody: true } },
    async (request, reply) => {
      // ── Signature verification (optional but recommended) ──────────────────
      const secret = process.env.WC_WEBHOOK_SECRET;
      if (secret) {
        const signature = request.headers["x-wc-webhook-signature"] as string | undefined;
        if (!signature) {
          request.log.warn("wc.webhook: missing signature header");
          return reply.status(401).send({ error: "Missing signature" });
        }
        const rawBody = (request as unknown as { rawBody: Buffer }).rawBody;
        const expected = createHmac("sha256", secret).update(rawBody).digest("base64");
        if (signature !== expected) {
          request.log.warn("wc.webhook: invalid signature");
          return reply.status(401).send({ error: "Invalid signature" });
        }
      }

      const body = request.body as {
        status?: string;
        billing?: {
          email?: string;
          first_name?: string;
          last_name?: string;
        };
        meta_data?: Array<{ key: string; value: string }>;
        id?: number;
      };

      const status = body?.status ?? "";
      const email = body?.billing?.email ?? "";
      const firstName = body?.billing?.first_name ?? "";
      const lastName = body?.billing?.last_name ?? "";
      const orderId = body?.id;

      request.log.info({ orderId, email, status }, "wc.webhook.received");

      // Only process completed/processing orders
      if (!["completed", "processing"].includes(status)) {
        return reply.send({ received: true, skipped: true, reason: `status=${status}` });
      }

      if (!email) {
        request.log.warn({ orderId }, "wc.webhook: no billing email");
        return reply.send({ received: true, skipped: true, reason: "no email" });
      }

      // ── Supabase: mark paid or rescue missing submission ───────────────────
      const sb = getSupabaseAdmin();
      if (sb) {
        // Check if a submission already exists for this email
        const { data: existing } = await sb
          .from("quiz_submissions")
          .select("id, pdf_url")
          .eq("email", email)
          .maybeSingle();

        if (existing) {
          // Submission exists — just mark paid
          const { error } = await sb
            .from("quiz_submissions")
            .update({ paid: true })
            .eq("email", email);
          if (error) {
            request.log.error({ err: error, email }, "wc.webhook.supabase_mark_paid_failed");
          } else {
            request.log.info({ email }, "wc.webhook.supabase_marked_paid");
          }
        } else {
          // No submission found — buyer's quiz submission was lost (e.g. network drop).
          // Try to rescue by fetching their PDF URL from AC and decoding the payload.
          request.log.warn({ email, orderId }, "wc.webhook.submission_missing — attempting rescue");

          const pdfUrl = await getAcPdfUrl(email);
          if (pdfUrl) {
            const decoded = decodePdfUrl(pdfUrl);
            if (decoded) {
              const rescued = await insertQuizSubmission({
                email,
                child_name: decoded.childName,
                child_gender: decoded.childGender,
                archetype_id: decoded.archetypeId,
                trait_scores: {},
                responses: {},
                pdf_url: pdfUrl,
                is_test: false,
              }).catch(() => null);
              // Mark paid immediately after insert
              if (rescued) {
                await sb.from("quiz_submissions").update({ paid: true }).eq("email", email);
                request.log.info({ email, archetypeId: decoded.archetypeId }, "wc.webhook.submission_rescued");
              } else {
                request.log.error({ email }, "wc.webhook.rescue_insert_failed");
              }
            } else {
              request.log.warn({ email, pdfUrl }, "wc.webhook.rescue_pdf_url_not_decodable");
            }
          } else {
            // No PDF URL in AC either — submission was truly lost before AC sync
            request.log.error({ email, orderId }, "wc.webhook.rescue_no_pdf_url_in_ac");
          }
        }
      }

      // ── Add "WC Purchase" tag in AC ────────────────────────────────────────
      const tagged = await addAcPurchaseTag(email, firstName, lastName);
      request.log.info({ email, tagged }, "wc.webhook.ac_tag_applied");

      return reply.send({ received: true, email, tagged });
    },
  );
}
