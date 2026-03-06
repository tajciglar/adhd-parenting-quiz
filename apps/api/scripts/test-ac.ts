/**
 * Local AC integration test
 * Run: npx tsx scripts/test-ac.ts
 *
 * Tests every step of syncToActiveCampaign:
 *   1. Signed PDF URL generation (no file upload)
 *   2. Contact sync
 *   3. PDF_URL custom field set
 *   4. List subscription
 *   5. Tags (deduplicated, lowercased)
 */

import { readFileSync } from "fs";
import { createHmac } from "crypto";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually
const envPath = resolve(__dirname, "../.env");
const envLines = readFileSync(envPath, "utf-8").split("\n");
for (const line of envLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq).trim();
  const value = trimmed.slice(eq + 1).trim().replace(/^"|"$/g, "");
  if (!process.env[key]) process.env[key] = value;
}

const AC_API_URL = (process.env.AC_API_URL ?? "").replace(/\/$/, "");
const AC_API_KEY = process.env.AC_API_KEY ?? "";
const AC_LIST_ID = process.env.AC_LIST_ID ?? "";
const API_BASE_URL = (process.env.API_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const PDF_SIGNING_SECRET = process.env.PDF_SIGNING_SECRET ?? "dev-secret";

const TEST_EMAIL = "test-ac-integration@example.com";
const TEST_CHILD = "TestChild";
const TEST_ARCHETYPE_ID = "fox";
const TEST_ARCHETYPE_ANIMAL = "fox"; // already lowercase

if (!AC_API_URL || !AC_API_KEY) {
  console.error("❌  AC_API_URL or AC_API_KEY not set in .env");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  "Api-Token": AC_API_KEY,
};

function ok(label: string, detail?: string) {
  console.log(`  ✅  ${label}${detail ? ` — ${detail}` : ""}`);
}

function fail(label: string, detail?: string) {
  console.log(`  ❌  ${label}${detail ? ` — ${detail}` : ""}`);
}

// ── 1. Generate signed PDF URL ────────────────────────────────────────────────
function testSignedUrl(): string {
  console.log("\n1. Generate signed PDF URL");

  const payload = JSON.stringify({
    archetypeId: TEST_ARCHETYPE_ID,
    childName: TEST_CHILD,
    childGender: "Other",
  });
  const data = Buffer.from(payload).toString("base64url");
  const sig = createHmac("sha256", PDF_SIGNING_SECRET).update(data).digest("hex");
  const url = `${API_BASE_URL}/api/guest/pdf?data=${data}&sig=${sig}`;

  ok("signed URL generated", url);
  return url;
}

// ── 2. Contact sync ───────────────────────────────────────────────────────────
async function testContactSync(): Promise<string | null> {
  console.log("\n2. Contact sync (upsert)");

  const res = await fetch(`${AC_API_URL}/api/3/contact/sync`, {
    method: "POST",
    headers,
    body: JSON.stringify({ contact: { email: TEST_EMAIL } }),
  });

  const data = (await res.json()) as { contact?: { id: number | string }; errors?: unknown };

  if (!res.ok || !data.contact?.id) {
    fail("contact sync", `status=${res.status} ${JSON.stringify(data.errors ?? data)}`);
    return null;
  }

  const contactId = String(data.contact.id);
  ok("contact sync", `contactId=${contactId}`);
  return contactId;
}

// ── 3. Custom field PDF_URL ───────────────────────────────────────────────────
async function testCustomField(contactId: string, pdfUrl: string): Promise<void> {
  console.log("\n3. PDF_URL custom field");

  const searchRes = await fetch(`${AC_API_URL}/api/3/fields?search=PDF_URL`, { headers });
  const searchData = (await searchRes.json()) as {
    fields: Array<{ id: number | string; perstag: string }>;
  };

  let fieldId = String(searchData.fields.find((f) => f.perstag === "PDF_URL")?.id ?? "");

  if (!fieldId || fieldId === "undefined") {
    const createRes = await fetch(`${AC_API_URL}/api/3/fields`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        field: { type: "text", title: "PDF URL", descript: "", isrequired: "0", perstag: "PDF_URL", visible: "1" },
      }),
    });
    const createData = (await createRes.json()) as { field?: { id: number | string }; errors?: unknown };
    if (!createData.field?.id) {
      fail("create PDF_URL field", JSON.stringify(createData.errors ?? createData));
      return;
    }
    fieldId = String(createData.field.id);
    ok("created PDF_URL field", `fieldId=${fieldId}`);
  } else {
    ok("found PDF_URL field", `fieldId=${fieldId}`);
  }

  const setRes = await fetch(`${AC_API_URL}/api/3/fieldValues`, {
    method: "POST",
    headers,
    body: JSON.stringify({ fieldValue: { contact: contactId, field: fieldId, value: pdfUrl } }),
  });

  const setData = (await setRes.json()) as { fieldValue?: { id: number | string }; errors?: unknown };

  if (!setRes.ok || !setData.fieldValue?.id) {
    fail("set PDF_URL value", `status=${setRes.status} ${JSON.stringify(setData.errors ?? setData)}`);
  } else {
    ok("set PDF_URL on contact", `value=${pdfUrl.slice(0, 60)}...`);
  }
}

// ── 4. List subscription ──────────────────────────────────────────────────────
async function testListSubscription(contactId: string): Promise<void> {
  console.log("\n4. List subscription");

  if (!AC_LIST_ID) {
    console.log("  ⚠️   AC_LIST_ID not set — skipping");
    return;
  }

  const res = await fetch(`${AC_API_URL}/api/3/contactLists`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      contactList: { list: Number(AC_LIST_ID), contact: contactId, status: 1 },
    }),
  });

  const data = (await res.json()) as { contactList?: { id: number | string }; errors?: unknown };

  if (!res.ok || !data.contactList?.id) {
    fail("list subscription", `status=${res.status} ${JSON.stringify(data.errors ?? data)}`);
  } else {
    ok("subscribed to list", `listId=${AC_LIST_ID} contactListId=${data.contactList.id}`);
  }
}

// ── 5. Tags (deduplicated + lowercased) ───────────────────────────────────────
async function testTags(contactId: string): Promise<void> {
  console.log("\n5. Tags (deduplicated, lowercased)");

  const tagNames = [
    ...new Set(
      ["onboarding-completed", TEST_ARCHETYPE_ID, TEST_ARCHETYPE_ANIMAL]
        .filter(Boolean)
        .map((t) => t.toLowerCase()),
    ),
  ];

  console.log(`  Tags to apply: ${tagNames.join(", ")}`);

  for (const tagName of tagNames) {
    const searchRes = await fetch(
      `${AC_API_URL}/api/3/tags?search=${encodeURIComponent(tagName)}`,
      { headers },
    );
    const searchData = (await searchRes.json()) as {
      tags: Array<{ id: number | string; tag: string }>;
    };

    let tagId = String(searchData.tags.find((t) => t.tag === tagName)?.id ?? "");

    if (!tagId || tagId === "undefined") {
      const createRes = await fetch(`${AC_API_URL}/api/3/tags`, {
        method: "POST",
        headers,
        body: JSON.stringify({ tag: { tag: tagName, tagType: "contact", description: "" } }),
      });
      const createData = (await createRes.json()) as { tag?: { id: number | string }; errors?: unknown };
      if (!createData.tag?.id) {
        fail(`create tag "${tagName}"`, JSON.stringify(createData.errors ?? createData));
        continue;
      }
      tagId = String(createData.tag.id);
    }

    const applyRes = await fetch(`${AC_API_URL}/api/3/contactTags`, {
      method: "POST",
      headers,
      body: JSON.stringify({ contactTag: { contact: contactId, tag: tagId } }),
    });

    const applyData = (await applyRes.json()) as { contactTag?: { id: number | string }; errors?: unknown };

    if (!applyRes.ok || !applyData.contactTag?.id) {
      fail(`apply tag "${tagName}"`, `status=${applyRes.status} ${JSON.stringify(applyData.errors ?? applyData)}`);
    } else {
      ok(`tag "${tagName}"`, `tagId=${tagId}`);
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🧪  AC Integration Test`);
  console.log(`    API: ${AC_API_URL}`);
  console.log(`    Email: ${TEST_EMAIL}`);
  console.log(`    List: ${AC_LIST_ID || "(not set)"}`);

  const pdfUrl = testSignedUrl();
  const contactId = await testContactSync();

  if (!contactId) {
    console.log("\n❌  Stopping — contact sync failed.");
    process.exit(1);
  }

  await testCustomField(contactId, pdfUrl);
  await testListSubscription(contactId);
  await testTags(contactId);

  console.log("\n✅  Done. Check your AC account:");
  console.log(`    Contacts → search "${TEST_EMAIL}"`);
  console.log(`    Verify: tags (onboarding-completed, fox), PDF_URL field with signed URL\n`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
