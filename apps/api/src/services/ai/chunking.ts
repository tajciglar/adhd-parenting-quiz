export interface TextChunk {
  chunkIndex: number;
  text: string;
  tokenCount: number;
}

const MAX_TOKENS_PER_CHUNK = 700;
const OVERLAP_TOKENS = 100;
const CHARS_PER_TOKEN_ESTIMATE = 4;
const WORDS_PER_TOKEN_ESTIMATE = 0.75;

function estimateTokenCount(text: string): number {
  return Math.max(1, Math.ceil(text.length / CHARS_PER_TOKEN_ESTIMATE));
}

export function splitIntoChunks(rawText: string): TextChunk[] {
  const text = rawText.trim().replace(/\s+/g, " ");
  if (!text) return [];

  const words = text.split(" ");
  const maxWords = Math.floor(MAX_TOKENS_PER_CHUNK * WORDS_PER_TOKEN_ESTIMATE);
  const overlapWords = Math.floor(OVERLAP_TOKENS * WORDS_PER_TOKEN_ESTIMATE);
  const stride = Math.max(1, maxWords - overlapWords);

  const chunks: TextChunk[] = [];

  for (let start = 0; start < words.length; start += stride) {
    const end = Math.min(words.length, start + maxWords);
    const chunkText = words.slice(start, end).join(" ").trim();
    if (!chunkText) continue;

    chunks.push({
      chunkIndex: chunks.length,
      text: chunkText,
      tokenCount: estimateTokenCount(chunkText),
    });

    if (end >= words.length) break;
  }

  return chunks;
}

