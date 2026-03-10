import React from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import ReportDocument from "./src/services/pdf/reportDocument.js";
import { getReportTemplate } from "../../packages/shared/src/reportTemplates.js";
import { renderReportTemplate } from "../../packages/shared/src/templateRenderer.js";
import fs from "fs";

const archetypes = ["fox", "hummingbird", "koala", "meerkat", "stallion", "tiger"];

async function generatePdf(archetypeId: string) {
  const tpl = getReportTemplate(archetypeId);
  if (!tpl) { console.error(`No ${archetypeId} template`); return; }

  const childName = "Taj";
  const childGender = "Female";

  // Use the same renderReportTemplate used in production
  // to properly replace [NAME], [HE/SHE/THEY], [HIS/HER/THEIR], etc.
  const rendered = renderReportTemplate(tpl, {
    name: childName,
    gender: childGender,
  });

  const doc = React.createElement(ReportDocument, {
    report: rendered,
    childName,
  }) as unknown as React.ReactElement<DocumentProps>;

  const buf = await renderToBuffer(doc);
  const path = `/tmp/wildprint-${archetypeId}.pdf`;
  fs.writeFileSync(path, buf);
  console.log(`✓ ${archetypeId}: ${path} (${buf.length} bytes)`);
}

async function main() {
  const target = process.argv[2];
  if (target) {
    await generatePdf(target);
  } else {
    for (const id of archetypes) {
      await generatePdf(id);
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); });
