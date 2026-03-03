const OPENAI_BASE_URL = "https://api.openai.com/v1";
const REQUEST_TIMEOUT_MS = 20_000;

export const OPENAI_CHAT_MODEL = process.env.OPENAI_CHAT_MODEL ?? "gpt-4o-mini";
export const OPENAI_EMBED_MODEL =
  process.env.OPENAI_EMBED_MODEL ?? "text-embedding-3-small";

interface ChatCompletionMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatCompletionResponse {
  choices?: Array<{ message?: { content?: string } }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

interface EmbeddingsResponse {
  data?: Array<{ embedding?: number[] }>;
  usage?: {
    prompt_tokens?: number;
    total_tokens?: number;
  };
}

function getApiKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return key;
}

async function postOpenAI<T>(path: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${OPENAI_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`OpenAI ${path} failed (${res.status}): ${errorText}`);
    }

    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function createEmbeddings(input: string[]): Promise<number[][]> {
  const payload = {
    model: OPENAI_EMBED_MODEL,
    input,
  };
  const data = await postOpenAI<EmbeddingsResponse>("/embeddings", payload);
  return (data.data ?? []).map((item) => item.embedding ?? []);
}

export async function createChatCompletion(
  messages: ChatCompletionMessage[],
): Promise<{ content: string; usage?: ChatCompletionResponse["usage"] }> {
  const payload = {
    model: OPENAI_CHAT_MODEL,
    temperature: 0.2,
    messages,
  };
  const data = await postOpenAI<ChatCompletionResponse>(
    "/chat/completions",
    payload,
  );
  const content = data.choices?.[0]?.message?.content?.trim() ?? "";
  return {
    content,
    usage: data.usage,
  };
}

