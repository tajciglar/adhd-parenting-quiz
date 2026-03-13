import type { FastifyInstance } from "fastify";
import { getAllReportTemplates } from "@adhd-parenting-quiz/shared";
import { getAnalytics, resetAnalytics, checkRescoreMismatches, applyRescore, getSupabaseAdmin, allRows } from "../services/supabaseAdmin.js";

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
  // Upsert all report templates from shared package into the DB
  fastify.post("/admin/sync-templates", async (request, reply) => {
    try {
      const templates = getAllReportTemplates();
      const results: Array<{ archetypeId: string; status: string }> = [];

      for (const [archetypeId, template] of Object.entries(templates)) {
        await fastify.prisma.reportTemplate.upsert({
          where: { archetypeId },
          create: { archetypeId, template: template as any },
          update: { template: template as any },
        });
        results.push({ archetypeId, status: "synced" });
      }

      request.log.info({ count: results.length }, "admin.sync_templates.done");
      return reply.send({ synced: results.length, results });
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
