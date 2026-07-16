// Thin client for Groq's OpenAI-compatible Chat Completions API.
// Used by RancakBotWidget to power the AI Heritage Assistant.

export type GroqRole = 'user' | 'assistant';

export interface GroqChatMessage {
  role: GroqRole;
  content: string;
}

export type GroqLang = 'en' | 'id' | 'min';

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

const LANGUAGE_NAMES: Record<GroqLang, string> = {
  en: 'English',
  id: 'Bahasa Indonesia',
  min: 'Bahasa Minangkabau (informal and warm — feel free to use words like "ambo", "dunsanak", "rancak", "bana")',
};

function buildSystemPrompt(lang: GroqLang): string {
  return `You are "RancakBot", the friendly AI heritage assistant embedded in the Bukittinggi Cultural Heritage Hub website. You help visitors learn about Bukittinggi and Minangkabau culture: history (Jam Gadang, Fort de Kock, PDRI), food (Rendang, Nasi Kapau, Sanjai), attractions (Ngarai Sianok / Sianok Canyon, the Japanese Tunnel / Lobang Jepang), and culture (Rumah Gadang, Tari Piring, adat/customs).

Rules:
- Always reply in ${LANGUAGE_NAMES[lang]}, regardless of what language earlier turns used.
- Keep answers concise and warm — roughly 2 to 5 sentences — and feel free to use a relevant emoji here and there (📍🍜🏞️🏛️).
- If the question is unrelated to Bukittinggi/Minangkabau heritage, answer briefly and politely, then steer the conversation back toward local history, culture, food, or attractions.
- Stay in character as RancakBot; never say you are a generic AI language model.`;
}

/**
 * Sends the conversation to Groq and returns the assistant's reply text.
 * Throws on network failure, a non-2xx response, or a missing API key —
 * callers should catch this and fall back to a local response if needed.
 */
export async function askGroq(history: GroqChatMessage[], lang: GroqLang): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GROQ_API_KEY is not set — add it to your .env file.');
  }

  const model = import.meta.env.VITE_GROQ_MODEL || DEFAULT_MODEL;

  const response = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: buildSystemPrompt(lang) }, ...history],
      temperature: 0.6,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Groq API error ${response.status}: ${errText}`);
  }

  const data: unknown = await response.json();
  const reply = (data as { choices?: { message?: { content?: string } }[] })
    ?.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error('Groq API returned an empty response.');
  }
  return reply;
}
