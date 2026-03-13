import type { ArchetypeReportTemplate } from "./reportTemplates.js";

// ─── Pronoun Helpers ────────────────────────────────────────────────────────

interface PronounSet {
  subject: string;    // he / she / they
  possessive: string; // his / her / their
  object: string;     // him / her / them
  reflexive: string;  // himself / herself / themselves
}

function getPronounSet(gender: string): PronounSet {
  const g = gender.toLowerCase();
  if (g === "male" || g.includes("boy")) {
    return { subject: "he", possessive: "his", object: "him", reflexive: "himself" };
  }
  if (g === "female" || g.includes("girl")) {
    return { subject: "she", possessive: "her", object: "her", reflexive: "herself" };
  }
  return { subject: "they", possessive: "their", object: "them", reflexive: "themselves" };
}

/**
 * Build the placeholder → replacement map from a child's name and gender.
 */
export function buildPlaceholderMap(
  name: string,
  gender: string,
): Record<string, string> {
  const pronouns = getPronounSet(gender);

  return {
    "[NAME]": name,
    "[HE/SHE/THEY]": pronouns.subject,
    "[HIS/HER/THEIR]": pronouns.possessive,
    "[HIM/HER/THEM]": pronouns.object,
    "[HIMSELF/HERSELF/THEMSELVES]": pronouns.reflexive,
  };
}

// ─── Replacement Logic ──────────────────────────────────────────────────────

/**
 * Replace all placeholders in a single string.
 */
/**
 * Fix "they + singular verb" grammar after pronoun substitution.
 * Handles common patterns: they is→are, they has→have, they does→do,
 * they was→were, and third-person-singular -s/-es endings.
 */
function fixTheyGrammar(text: string): string {
  // Explicit irregular verbs
  let result = text
    .replace(/\bthey is\b/gi, (m) => (m[0] === "T" ? "They are" : "they are"))
    .replace(/\bthey has\b/gi, (m) => (m[0] === "T" ? "They have" : "they have"))
    .replace(/\bthey does\b/gi, (m) => (m[0] === "T" ? "They do" : "they do"))
    .replace(/\bthey was\b/gi, (m) => (m[0] === "T" ? "They were" : "they were"))
    .replace(/\bthey doesn't\b/gi, (m) => (m[0] === "T" ? "They don't" : "they don't"))
    .replace(/\bthey hasn't\b/gi, (m) => (m[0] === "T" ? "They haven't" : "they haven't"))
    .replace(/\bthey isn't\b/gi, (m) => (m[0] === "T" ? "They aren't" : "they aren't"))
    .replace(/\bthey wasn't\b/gi, (m) => (m[0] === "T" ? "They weren't" : "they weren't"));

  // Third-person singular verb endings:
  // "they rushes" → "they rush", "they watches" → "they watch",
  // "they tries" → "they try", "they carries" → "they carry",
  // "they needs" → "they need", "they feels" → "they feel"
  result = result.replace(
    /\b(they)\s+([a-z]+?)(ies|ches|shes|sses|xes|zes|s)\b/gi,
    (match, pronoun, stem, ending) => {
      const cap = pronoun[0] === "T" ? "They" : "they";
      if (ending.toLowerCase() === "ies") return `${cap} ${stem}y`;
      if (/^(ches|shes|sses|xes|zes)$/i.test(ending)) return `${cap} ${stem}${ending.slice(0, -2)}`;
      if (ending.toLowerCase() === "s") return `${cap} ${stem}`;
      return match;
    },
  );

  return result;
}

function replaceInString(text: string, data: Record<string, string>): string {
  let result = text;
  for (const [placeholder, replacement] of Object.entries(data)) {
    result = result.replaceAll(placeholder, replacement);
  }
  // Auto-capitalize first letter after sentence-ending punctuation (e.g. ". she" → ". She")
  result = result.replace(/([.!?])\s+([a-z])/g, (_, punct, letter) => `${punct} ${letter.toUpperCase()}`);

  // Fix "they + singular verb" grammar when using they/them pronouns
  if (data["[HE/SHE/THEY]"] === "they") {
    result = fixTheyGrammar(result);
  }
  return result;
}

/**
 * Recursively walk any value and replace placeholders in all strings.
 * Handles: strings, arrays, and plain objects.
 */
function replacePlaceholders(value: unknown, data: Record<string, string>): unknown {
  if (typeof value === "string") {
    return replaceInString(value, data);
  }

  if (Array.isArray(value)) {
    return value.map((item) => replacePlaceholders(item, data));
  }

  if (typeof value === "object" && value !== null) {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = replacePlaceholders(val, data);
    }
    return result;
  }

  // numbers, booleans, null — return as-is
  return value;
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Take a report template and a child's info, return a new template
 * with all [NAME], [HE/SHE/THEY], etc. replaced with real values.
 */
export function renderReportTemplate(
  template: ArchetypeReportTemplate,
  child: { name: string; gender: string },
): ArchetypeReportTemplate {
  const data = buildPlaceholderMap(child.name, child.gender);
  return replacePlaceholders(template, data) as ArchetypeReportTemplate;
}
