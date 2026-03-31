import { createHmac, randomUUID } from "crypto";
import type { FastifyInstance } from "fastify";
import { getAllReportTemplates } from "@adhd-parenting-quiz/shared";
import { getAnalytics, resetAnalytics, checkRescoreMismatches, applyRescore, applyRescoreAndResend, getRescoredPdfLinks, getSupabaseAdmin, allRows, fetchPdfUrlMismatches, applyPdfUrlFix, getAnalyticsResetAt } from "../services/supabaseAdmin.js";

function generatePdfUrl(opts: { archetypeId: string; childName: string; childGender?: string }): string {
  const baseUrl = (process.env.API_BASE_URL ?? "http://localhost:3000").trim().replace(/\/$/, "");
  const secret = process.env.PDF_SIGNING_SECRET ?? "dev-secret";
  const payload = JSON.stringify({
    archetypeId: opts.archetypeId,
    childName: opts.childName,
    childGender: opts.childGender ?? "",
  });
  const data = Buffer.from(payload).toString("base64url");
  const sig = createHmac("sha256", secret).update(data).digest("hex");
  return `${baseUrl}/api/guest/pdf?data=${data}&sig=${sig}`;
}

export default async function adminRoutes(fastify: FastifyInstance) {
  // Simple secret-key auth for admin endpoints
  fastify.addHook("onRequest", async (request, reply) => {
    if (!request.url.startsWith("/api/admin")) return;

    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      return reply.status(503).send({ error: "Admin panel not configured" });
    }

    const key = request.headers["x-admin-key"];
    if (key !== adminSecret) {
      return reply.status(401).send({ error: "Invalid admin key" });
    }
  });

  // ── GET /api/admin/analytics ──────────────────────────────────────────────
  fastify.get("/admin/analytics", async (request, reply) => {
    const { days } = request.query as { days?: string };
    const numDays = Math.min(Math.max(Number(days) || 7, 1), 90);

    try {
      const analytics = await getAnalytics(numDays);
      return reply.send(analytics);
    } catch (err) {
      request.log.error({ err }, "admin.analytics.query_failed");
      return reply.status(500).send({ error: "Failed to fetch analytics" });
    }
  });

  // ── GET /api/admin/daily-step-dropoff ────────────────────────────────────
  fastify.get("/admin/daily-step-dropoff", async (request, reply) => {
    const { date } = request.query as { date?: string };
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return reply.status(400).send({ error: "date query param required (YYYY-MM-DD)" });
    }

    try {
      const sb = getSupabaseAdmin();
      if (!sb) return reply.status(503).send({ error: "Database not configured" });

      // Respect analytics reset cutoff
      const resetAt = await getAnalyticsResetAt();
      const dayStart = `${date}T00:00:00.000Z`;
      const dayEnd = `${date}T23:59:59.999Z`;

      // If the reset cutoff is after this day's end, return empty
      if (resetAt && resetAt > dayEnd) {
        return reply.send({ date, stepDropoff: [] });
      }

      const effectiveStart = resetAt && resetAt > dayStart ? resetAt : dayStart;

      // Paginated fetch to avoid Supabase 1000-row default limit
      const rows = await allRows<{ session_id: string; step_number: number | null }>(
        sb,
        "funnel_events",
        "session_id, step_number",
        (q: any) =>
          q.not("step_number", "is", null)
            .gte("created_at", effectiveStart)
            .lte("created_at", dayEnd)
            .not("is_test", "eq", true),
      );

      // Count unique sessions per step
      const stepSessions = new Map<number, Set<string>>();
      for (const row of rows) {
        if (row.step_number == null) continue;
        if (!stepSessions.has(row.step_number)) stepSessions.set(row.step_number, new Set());
        stepSessions.get(row.step_number)!.add(row.session_id);
      }

      const sortedSteps = [...stepSessions.entries()]
        .map(([step, sessions]) => ({ step, views: sessions.size }))
        .sort((a, b) => a.step - b.step);

      // Also count quiz_submissions for this day as the last step (server-side confirmed email)
      const { count: submissionCount } = await sb
        .from("quiz_submissions")
        .select("id", { count: "exact", head: true })
        .gte("created_at", effectiveStart)
        .lte("created_at", dayEnd)
        .eq("is_test", false);

      const stepDropoff = sortedSteps.map((item, i) => {
        const prev = i > 0 ? sortedSteps[i - 1].views : item.views;
        const dropoffRate = prev > 0 ? Number((((prev - item.views) / prev) * 100).toFixed(1)) : 0;
        return { ...item, dropoffRate };
      });

      // Inject step 47 (Supabase submission) after the last tracked step
      if (submissionCount != null && submissionCount > 0) {
        const prev = sortedSteps.length > 0 ? sortedSteps[sortedSteps.length - 1].views : submissionCount;
        const dropoffRate = prev > 0 ? Number((((prev - submissionCount) / prev) * 100).toFixed(1)) : 0;
        stepDropoff.push({ step: 47, views: submissionCount, dropoffRate });
      }

      return reply.send({ date, stepDropoff });
    } catch (err) {
      request.log.error({ err }, "admin.daily_step_dropoff.failed");
      return reply.status(500).send({ error: "Failed to fetch daily step dropoff" });
    }
  });

  // ── GET /api/admin/version-dropoff ──────────────────────────────────────
  // V1 = before Mar 26 (childName was basic-info step 5-6, shown at start of quiz)
  // V2 = from Mar 26  (childName moved to processing screen popup: step 43 = screen reached, step 44 = name submitted)
  fastify.get("/admin/version-dropoff", async (request, reply) => {
    const { version } = request.query as { version?: string };
    const v = version === "v1" ? "v1" : version === "v2n" ? "v2n" : "v2";
    const V2_CUTOFF = '2026-03-26T00:00:00.000Z';
    // When we first started tracking the processing screen (step 43)
    const NAME_TRACKING_START = '2026-03-30T13:53:00.000Z';

    try {
      const sb = getSupabaseAdmin();
      if (!sb) return reply.status(503).send({ error: "Database not configured" });

      const resetAt = await getAnalyticsResetAt();
      const epoch = '1970-01-01T00:00:00.000Z';
      const now = new Date().toISOString();

      let rangeStart: string;
      let rangeEnd: string;

      if (v === "v1") {
        rangeStart = resetAt ?? epoch;
        rangeEnd = V2_CUTOFF;
      } else if (v === "v2n") {
        // V2 with name tracking — only sessions from after we added step 43 tracking
        rangeStart = resetAt && resetAt > NAME_TRACKING_START ? resetAt : NAME_TRACKING_START;
        rangeEnd = now;
      } else {
        rangeStart = resetAt && resetAt > V2_CUTOFF ? resetAt : V2_CUTOFF;
        rangeEnd = now;
      }

      // If range is empty (e.g. reset is after V2_CUTOFF for v1), return empty
      if (rangeStart >= rangeEnd) {
        return reply.send({ version: v, stepDropoff: [] });
      }

      // Count all event types with a step_number — V1 uses answer_submitted, V2 also has step_viewed
      const rows = await allRows<{ session_id: string; step_number: number | null }>(
        sb,
        "funnel_events",
        "session_id, step_number",
        (q) => q
          .not("step_number", "is", null)
          .eq("is_test", false)
          .gte("created_at", rangeStart)
          .lt("created_at", rangeEnd),
      );

      // Count unique sessions per step
      const stepSessions = new Map<number, Set<string>>();
      for (const row of rows) {
        if (row.step_number == null) continue;
        if (!stepSessions.has(row.step_number)) stepSessions.set(row.step_number, new Set());
        stepSessions.get(row.step_number)!.add(row.session_id);
      }

      const sortedSteps = [...stepSessions.entries()]
        .map(([step, sessions]) => ({ step, views: sessions.size }))
        .sort((a, b) => a.step - b.step);

      const stepDropoff = sortedSteps.map((item, i) => {
        const prev = i > 0 ? sortedSteps[i - 1].views : item.views;
        const dropoffRate = prev > 0 ? Number((((prev - item.views) / prev) * 100).toFixed(1)) : 0;
        return { ...item, dropoffRate };
      });

      return reply.send({ version: v, stepDropoff });
    } catch (err) {
      request.log.error({ err }, "admin.version_dropoff.failed");
      return reply.status(500).send({ error: "Failed to fetch version dropoff" });
    }
  });

  // ── GET /api/admin/rescore-check ─────────────────────────────────────────
  fastify.get("/admin/rescore-check", async (request, reply) => {
    try {
      const result = await checkRescoreMismatches();
      return reply.send(result);
    } catch (err) {
      request.log.error({ err }, "admin.rescore_check.failed");
      return reply.status(500).send({ error: "Failed to check mismatches" });
    }
  });

  // ── POST /api/admin/rescore ────────────────────────────────────────────
  fastify.post("/admin/rescore", async (request, reply) => {
    try {
      const result = await applyRescore();
      request.log.info(result, "admin.rescore.applied");
      return reply.send(result);
    } catch (err) {
      request.log.error({ err }, "admin.rescore.failed");
      return reply.status(500).send({ error: "Failed to apply rescore" });
    }
  });

  // ── GET /api/admin/rescore-links ──────────────────────────────────────
  // Read-only: returns mismatches with new correct PDF URLs — does NOT update DB.
  fastify.get("/admin/rescore-links", async (request, reply) => {
    try {
      const result = await getRescoredPdfLinks(
        (archetypeId, childName, childGender) =>
          generatePdfUrl({ archetypeId, childName, childGender }),
      );
      return reply.send(result);
    } catch (err) {
      request.log.error({ err }, "admin.rescore_links.failed");
      return reply.status(500).send({ error: "Failed to generate corrected PDF links" });
    }
  });

  // ── POST /api/admin/rescore-resend ────────────────────────────────────
  // Rescores all mismatched submissions, updates Supabase with correct archetype
  // and a new signed PDF URL. Returns the list so you can manually send the links.
  fastify.post("/admin/rescore-resend", async (request, reply) => {
    try {
      const result = await applyRescoreAndResend(
        (archetypeId, childName, childGender) =>
          generatePdfUrl({ archetypeId, childName, childGender }),
      );
      request.log.info({ updated: result.updated }, "admin.rescore_resend.done");
      return reply.send(result);
    } catch (err) {
      request.log.error({ err }, "admin.rescore_resend.failed");
      return reply.status(500).send({ error: "Failed to rescore and generate new PDF links" });
    }
  });

  // ── GET /api/admin/pdf-url-check ─────────────────────────────────────────
  // Read-only: find submissions where pdf_url encodes a different archetype than archetype_id.
  // Useful after a rescore that updated archetype_id but left pdf_url unchanged.
  fastify.get("/admin/pdf-url-check", async (request, reply) => {
    try {
      const result = await fetchPdfUrlMismatches();
      return reply.send(result);
    } catch (err) {
      request.log.error({ err }, "admin.pdf_url_check.failed");
      return reply.status(500).send({ error: "Failed to check pdf url mismatches" });
    }
  });

  // ── POST /api/admin/resync-ac-urls ────────────────────────────────────────
  // Fixes pdf_url in Supabase AND updates the PDF_URL custom field in AC for all
  // submissions where pdf_url encodes the wrong archetype (e.g. after a rescore).
  fastify.post("/admin/resync-ac-urls", async (request, reply) => {
    const apiUrl = process.env.AC_API_URL?.replace(/\/$/, "");
    const apiKey = process.env.AC_API_KEY;

    // Fix Supabase pdf_url first
    const result = await applyPdfUrlFix(
      (archetypeId, childName, childGender) =>
        generatePdfUrl({ archetypeId, childName, childGender }),
    ).catch((err: unknown) => {
      request.log.error({ err }, "admin.resync_ac_urls.fix_failed");
      return null;
    });

    if (!result) return reply.status(500).send({ error: "Failed to fix pdf_url in database" });

    // If AC is not configured, return DB-only results
    if (!apiUrl || !apiKey) {
      return reply.send({ ...result, acUpdated: 0, acNote: "AC not configured" });
    }

    const headers = { "Content-Type": "application/json", "Api-Token": apiKey };

    // Find the PDF_URL field id once
    let fieldId = "";
    try {
      const searchRes = await fetch(`${apiUrl}/api/3/fields?limit=100`, { headers });
      const searchData = (await searchRes.json()) as { fields: Array<{ id: number | string; perstag: string }> };
      fieldId = String(searchData.fields.find((f) => f.perstag.replace(/%/g, "") === "PDF_URL")?.id ?? "");
    } catch (err) {
      request.log.error({ err }, "admin.resync_ac_urls.field_lookup_failed");
      return reply.send({ ...result, acUpdated: 0, acNote: "Failed to look up PDF_URL field in AC" });
    }

    if (!fieldId || fieldId === "undefined") {
      return reply.send({ ...result, acUpdated: 0, acNote: "PDF_URL field not found in AC" });
    }

    let acUpdated = 0;
    for (const change of result.changes) {
      try {
        // Look up contact by email
        const contactRes = await fetch(`${apiUrl}/api/3/contact/sync`, {
          method: "POST",
          headers,
          body: JSON.stringify({ contact: { email: change.email } }),
        });
        if (!contactRes.ok) continue;
        const contactData = (await contactRes.json()) as { contact: { id: number | string } };
        const contactId = String(contactData.contact.id);

        // Update PDF_URL field
        const fvRes = await fetch(`${apiUrl}/api/3/fieldValues`, {
          method: "POST",
          headers,
          body: JSON.stringify({ fieldValue: { contact: contactId, field: fieldId, value: change.newPdfUrl } }),
        });
        if (fvRes.ok) acUpdated++;
        else request.log.warn({ email: change.email, status: fvRes.status }, "admin.resync_ac_urls.field_value_failed");
      } catch (err) {
        request.log.error({ err, email: change.email }, "admin.resync_ac_urls.contact_update_failed");
      }
    }

    request.log.info({ dbUpdated: result.updated, acUpdated }, "admin.resync_ac_urls.done");
    return reply.send({ ...result, acUpdated });
  });

  // ── POST /api/admin/reset ───────────────────────────────────────────────
  fastify.post("/admin/reset", async (request, reply) => {
    try {
      const result = await resetAnalytics();
      request.log.info(result, "admin.analytics.reset");
      return reply.send(result);
    } catch (err) {
      request.log.error({ err }, "admin.analytics.reset_failed");
      return reply.status(500).send({ error: "Failed to reset analytics" });
    }
  });

  // ── POST /api/admin/sync-templates ────────────────────────────────────
  // Upsert all report templates from shared package into the Supabase report_templates table
  fastify.post("/admin/sync-templates", async (request, reply) => {
    try {
      const sb = getSupabaseAdmin();
      if (!sb) return reply.status(503).send({ error: "Supabase not configured" });

      const templates = getAllReportTemplates();
      const results: Array<{ archetypeId: string; status: string }> = [];

      for (const [archetypeId, template] of Object.entries(templates)) {
        // Check if row exists
        const { data: existing } = await sb
          .from("report_templates")
          .select("id")
          .eq("archetype_id", archetypeId)
          .limit(1);

        if (existing?.length) {
          // Update
          const { error } = await sb
            .from("report_templates")
            .update({ template, updated_at: new Date().toISOString() })
            .eq("archetype_id", archetypeId);
          results.push({ archetypeId, status: error ? `error: ${error.message}` : "updated" });
        } else {
          // Insert
          const { error } = await sb
            .from("report_templates")
            .insert({ id: randomUUID(), archetype_id: archetypeId, template, updated_at: new Date().toISOString(), created_at: new Date().toISOString() });
          results.push({ archetypeId, status: error ? `error: ${error.message}` : "created" });
        }
      }

      const synced = results.filter((r) => !r.status.startsWith("error")).length;
      request.log.info({ synced, total: results.length }, "admin.sync_templates.done");
      return reply.send({ synced, total: results.length, results });
    } catch (err) {
      request.log.error({ err }, "admin.sync_templates.failed");
      return reply.status(500).send({ error: "Failed to sync templates" });
    }
  });

  // ── GET /api/admin/export-csv ─────────────────────────────────────────
  // Full CSV export of all submissions
  fastify.get("/admin/export-csv", async (request, reply) => {
    try {
      const sb = getSupabaseAdmin();
      if (!sb) return reply.status(503).send({ error: "Supabase not configured" });

      const rows = await allRows<{
        id: string;
        email: string;
        child_name: string | null;
        child_gender: string | null;
        caregiver_type: string | null;
        child_age_range: string | null;
        adhd_journey: string | null;
        archetype_id: string;
        trait_scores: Record<string, number> | null;
        paid: boolean;
        pdf_url: string | null;
        created_at: string;
      }>(
        sb,
        "quiz_submissions",
        "id, email, child_name, child_gender, caregiver_type, child_age_range, adhd_journey, archetype_id, trait_scores, paid, pdf_url, created_at",
        (q: any) => q.order("created_at", { ascending: false }),
      );

      // CSV helper: quote fields that contain commas/quotes/newlines
      const esc = (v: string) => {
        if (v.includes(",") || v.includes('"') || v.includes("\n")) {
          return `"${v.replace(/"/g, '""')}"`;
        }
        return v;
      };

      const header = "email,child_name,child_gender,caregiver_type,child_age_range,adhd_journey,archetype_id,paid,trait_scores,pdf_url,created_at";
      const csvRows = rows.map((r) =>
        [
          esc(r.email ?? ""),
          esc(r.child_name ?? ""),
          esc(r.child_gender ?? ""),
          esc(r.caregiver_type ?? ""),
          esc(r.child_age_range ?? ""),
          esc(r.adhd_journey ?? ""),
          esc(r.archetype_id ?? ""),
          r.paid ? "yes" : "no",
          esc(r.trait_scores ? JSON.stringify(r.trait_scores) : ""),
          esc(r.pdf_url ?? ""),
          esc(r.created_at ?? ""),
        ].join(","),
      );

      const date = new Date().toISOString().slice(0, 10);
      reply
        .header("Content-Type", "text/csv; charset=utf-8")
        .header("Content-Disposition", `attachment; filename="submissions-${date}.csv"`);
      return reply.send([header, ...csvRows].join("\n"));
    } catch (err) {
      request.log.error({ err }, "admin.export_csv.failed");
      return reply.status(500).send({ error: "Failed to export submissions" });
    }
  });
}
