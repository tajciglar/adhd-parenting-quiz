import mammoth from "mammoth";

interface ParsedEntry {
  category: string;
  title: string;
  content: string;
}

/**
 * Parse a .docx file into knowledge base entries using heading structure:
 * - H1 headings → category
 * - H2 headings → entry title
 * - Content between headings → entry content (plain text)
 *
 * If no H1 found, uses the filename as the category.
 * If no H2 found, treats each paragraph block as a separate entry.
 */
export async function parseDocxToEntries(
  buffer: ArrayBuffer,
  fileName: string,
): Promise<ParsedEntry[]> {
  const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
  const html = result.value;

  // Parse HTML into a temporary DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const elements = Array.from(doc.body.children);

  const entries: ParsedEntry[] = [];
  const fallbackCategory = fileName.replace(/\.docx?$/i, "").trim() || "General";

  let currentCategory = "";
  let currentTitle = "";
  let contentParts: string[] = [];

  function flushEntry() {
    const content = contentParts.join("\n\n").trim();
    if (currentTitle && content) {
      entries.push({
        category: currentCategory || fallbackCategory,
        title: currentTitle,
        content,
      });
    }
    contentParts = [];
  }

  for (const el of elements) {
    const tag = el.tagName.toLowerCase();
    const text = (el.textContent || "").trim();

    if (!text) continue;

    if (tag === "h1") {
      // Flush previous entry before changing category
      flushEntry();
      currentCategory = text;
      currentTitle = "";
    } else if (tag === "h2") {
      // Flush previous entry before starting a new one
      flushEntry();
      currentTitle = text;
    } else if (tag === "h3" || tag === "h4") {
      // Sub-headings become part of content with emphasis
      contentParts.push(`**${text}**`);
    } else {
      // Regular content (paragraphs, lists, etc.)
      contentParts.push(text);
    }
  }

  // Flush the last entry
  flushEntry();

  // Fallback: if no H2 headings were found, try splitting on bold/strong lines
  if (entries.length === 0 && elements.length > 0) {
    currentCategory = fallbackCategory;
    let paragraphs: string[] = [];

    for (const el of elements) {
      const text = (el.textContent || "").trim();
      if (!text) continue;

      // If the element is short and all bold, treat as a title
      const isBold =
        el.querySelector("strong, b") !== null &&
        el.textContent === el.querySelector("strong, b")?.textContent;

      if (isBold && text.length < 200) {
        // Flush previous
        if (currentTitle && paragraphs.length > 0) {
          entries.push({
            category: currentCategory,
            title: currentTitle,
            content: paragraphs.join("\n\n").trim(),
          });
          paragraphs = [];
        }
        currentTitle = text;
      } else {
        paragraphs.push(text);
      }
    }

    // Flush last
    if (currentTitle && paragraphs.length > 0) {
      entries.push({
        category: currentCategory,
        title: currentTitle,
        content: paragraphs.join("\n\n").trim(),
      });
    }
  }

  return entries;
}
