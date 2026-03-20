/**
 * Generate PDFs for all 25 archetypes into /tmp/adhd-reports/
 * Usage: cd apps/api && npx tsx gen-all-pdfs.ts
 */
import { writeFileSync, mkdirSync } from "fs";
import {
  getReportTemplate,
  renderReportTemplate,
  ARCHETYPES,
} from "@adhd-parenting-quiz/shared";
import type { ArchetypeReportTemplate } from "@adhd-parenting-quiz/shared";
import { generateReportPdf } from "./src/services/pdf/generateReportPdf.js";

const OUT_DIR = "/tmp/adhd-reports";
mkdirSync(OUT_DIR, { recursive: true });

// All archetype IDs including girl variants
const ALL_IDS = ARCHETYPES.map((a) => a.id);

async function main() {
  console.log(`Generating ${ALL_IDS.length} PDFs into ${OUT_DIR}/\n`);

  for (const id of ALL_IDS) {
    const raw = getReportTemplate(id);
    if (!raw) {
      console.log(`⚠️  ${id} — no report template, skipping`);
      continue;
    }

    // Use girl name for girl variants
    const isGirlVariant = ["swan", "bunny", "tender_hedgehog", "hidden_firefly"].includes(id);
    const childName = isGirlVariant ? "Emma" : "Taj";
    const gender = isGirlVariant ? "A Girl" : "A Boy";

    const rendered = renderReportTemplate(raw, { name: childName, gender });

    try {
      const pdf = await generateReportPdf(
        rendered as unknown as ArchetypeReportTemplate,
        { name: childName },
      );
      const filename = `${id}.pdf`;
      writeFileSync(`${OUT_DIR}/${filename}`, pdf);
      console.log(`✅ ${id} — ${filename} (${(pdf.length / 1024).toFixed(0)} KB)`);
    } catch (err) {
      console.error(`❌ ${id} — FAILED:`, (err as Error).message);
    }
  }

  console.log(`\nDone! Open with: open ${OUT_DIR}/`);
}

main().catch(console.error);
