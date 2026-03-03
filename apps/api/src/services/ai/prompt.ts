import type { RetrievedSource } from "./retrieval.js";

interface PromptInput {
  question: string;
  sources: RetrievedSource[];
  onboardingResponses: Record<string, unknown>;
  history: Array<{ role: "USER" | "ASSISTANT"; content: string }>;
}

function toAssistantRole(role: "USER" | "ASSISTANT"): "user" | "assistant" {
  return role === "USER" ? "user" : "assistant";
}

function buildProfileContext(responses: Record<string, unknown>): string {
  const childName = String(responses.childName ?? "").trim();
  const childAge = String(responses.childAge ?? "").trim();
  const diagnosis = String(responses.diagnosisStatus ?? "").trim();
  const stressors = Array.isArray(responses.stressfulAreas)
    ? responses.stressfulAreas.join(", ")
    : "";

  const lines = [
    childName && `Child name: ${childName}`,
    childAge && `Child age: ${childAge}`,
    diagnosis && `Diagnosis status: ${diagnosis}`,
    stressors && `Top stressors: ${stressors}`,
  ].filter(Boolean);

  return lines.length > 0 ? lines.join("\n") : "No parent profile context available.";
}

function buildSourceBlock(sources: RetrievedSource[]): string {
  return sources
    .map(
      (source, i) =>
        [
          `[Source ${i + 1}]`,
          `Entry ID: ${source.entryId}`,
          `Category: ${source.category}`,
          `Title: ${source.title}`,
          `Chunk Index: ${source.chunkIndex}`,
          `Content: ${source.text}`,
        ].join("\n"),
    )
    .join("\n\n");
}

export function buildGroundedPrompt({
  question,
  sources,
  onboardingResponses,
  history,
}: PromptInput): Array<{ role: "system" | "user" | "assistant"; content: string }> {
  const systemInstructions = [
    "You are Harbor, an ADHD parenting support assistant.",
    "Use ONLY the provided Knowledge Base Sources for factual claims.",
    "If the sources are insufficient, respond exactly with: I don't have enough information in your current Harbor knowledge base to answer that confidently. Please upload content about this topic so I can help.",
    "Never invent facts, references, or citations.",
    "Use a calm, practical, parent-supportive tone.",
    "Keep answers concise and actionable.",
  ].join(" ");

  const sourceContext = buildSourceBlock(sources);
  const profileContext = buildProfileContext(onboardingResponses);
  const historyContext = history.slice(-8).map((m) => ({
    role: toAssistantRole(m.role),
    content: m.content,
  }));

  return [
    { role: "system", content: systemInstructions },
    {
      role: "system",
      content: `Parent profile context (for personalization only, not factual grounding):\n${profileContext}`,
    },
    {
      role: "system",
      content: `Knowledge Base Sources:\n${sourceContext}`,
    },
    ...historyContext,
    { role: "user", content: question },
  ];
}

