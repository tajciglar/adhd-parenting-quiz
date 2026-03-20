import { createHmac, randomUUID } from "crypto";
import type { FastifyInstance } from "fastify";
import { getAllReportTemplates } from "@adhd-parenting-quiz/shared";
import { getAnalytics, resetAnalytics, checkRescoreMismatches, applyRescore, applyRescoreAndResend, getRescoredPdfLinks, getSupabaseAdmin, allRows } from "../services/supabaseAdmin.js";

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
            .insert({ id: randomUUID(), archetype_id: archetypeId, template });
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

  // ── GET /api/admin/export-submissions ─────────────────────────────────
  // Export: email, caregiver_type, child_age_range, archetype_id, trait_scores
  fastify.get("/admin/export-submissions", async (request, reply) => {
    try {
      const sb = getSupabaseAdmin();
      if (!sb) return reply.status(503).send({ error: "Supabase not configured" });

      const rows = await allRows<{
        id: string;
        email: string;
        caregiver_type: string | null;
        child_age_range: string | null;
        archetype_id: string;
        trait_scores: Record<string, unknown>;
        created_at: string;
      }>(
        sb,
        "quiz_submissions",
        "id, email, caregiver_type, child_age_range, archetype_id, trait_scores, created_at",
        (q: any) => q.order("created_at", { ascending: false }),
      );

      const { format } = request.query as { format?: string };

      if (format === "csv") {
        const header = "email,caregiver_type,child_age_range,archetype_id,trait_scores,created_at";
        const csvRows = rows.map((r) =>
          [
            r.email ?? "",
            r.caregiver_type ?? "",
            r.child_age_range ?? "",
            r.archetype_id ?? "",
            JSON.stringify(r.trait_scores ?? {}).replace(/,/g, ";"),
            r.created_at ?? "",
          ].join(",")
        );
        reply
          .header("Content-Type", "text/csv")
          .header("Content-Disposition", "attachment; filename=submissions.csv");
        return reply.send([header, ...csvRows].join("\n"));
      }

      return reply.send({ count: rows.length, rows });
    } catch (err) {
      request.log.error({ err }, "admin.export_submissions.failed");
      return reply.status(500).send({ error: "Failed to export submissions" });
    }
  });
}
