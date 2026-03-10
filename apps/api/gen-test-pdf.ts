import React from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import ReportDocument from "./src/services/pdf/reportDocument.js";
import { getReportTemplate } from "../../packages/shared/src/reportTemplates.js";
import fs from "fs";

const archetypes = ["fox", "hummingbird", "koala", "meerkat", "stallion", "tiger"];

async function generatePdf(archetypeId: string) {
  const tpl = getReportTemplate(archetypeId);
  if (!tpl) { console.error(`No ${archetypeId} template`); return; }

  const childName = "Taj";
  const rendered = {
    ...tpl,
    title: tpl.title.replace(/\[NAME\]/g, childName),
    innerVoiceQuote: tpl.innerVoiceQuote.replace(/\[NAME\]/g, childName),
    animalDescription: tpl.animalDescription.replace(/\[NAME\]/g, childName),
    aboutChild: tpl.aboutChild.replace(/\[NAME\]/g, childName),
    hiddenSuperpower: tpl.hiddenSuperpower.replace(/\[NAME\]/g, childName),
    brainSections: tpl.brainSections.map(s => ({
      title: s.title.replace(/\[NAME\]/g, childName),
      content: s.content.replace(/\[NAME\]/g, childName),
    })),
    dayInLife: {
      morning: tpl.dayInLife.morning.replace(/\[NAME\]/g, childName),
      school: tpl.dayInLife.school.replace(/\[NAME\]/g, childName),
      afterSchool: tpl.dayInLife.afterSchool.replace(/\[NAME\]/g, childName),
      bedtime: tpl.dayInLife.bedtime.replace(/\[NAME\]/g, childName),
    },
    drains: tpl.drains.map(d => d.replace(/\[NAME\]/g, childName)),
    fuels: tpl.fuels.map(f => f.replace(/\[NAME\]/g, childName)),
    overwhelm: tpl.overwhelm.replace(/\[NAME\]/g, childName),
    affirmations: tpl.affirmations.map(a => a.replace(/\[NAME\]/g, childName)),
    doNotSay: tpl.doNotSay.map(d => ({
      insteadOf: d.insteadOf.replace(/\[NAME\]/g, childName),
      tryThis: d.tryThis.replace(/\[NAME\]/g, childName),
    })),
    closingLine: tpl.closingLine.replace(/\[NAME\]/g, childName),
  };

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
