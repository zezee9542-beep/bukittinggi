// Client for the RancakBot AI assistant. This calls our own same-origin
// `/api/chat` Vercel Serverless Function (see `api/chat.ts`) instead of
// calling Groq directly from the browser — the Groq API key only ever lives
// on the server, so it's never exposed in the public JS bundle.

export type GroqRole = 'user' | 'assistant';

export interface GroqChatMessage {
  role: GroqRole;
  content: string;
}

export type GroqLang = 'en' | 'id' | 'min';

/**
 * Sends the conversation to the `/api/chat` proxy and returns the
 * assistant's reply text. Throws on network failure or a non-2xx response —
 * callers should catch this and fall back to a local response if needed.
 */
export async function askGroq(history: GroqChatMessage[], lang: GroqLang): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history, lang }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Chat API error ${response.status}: ${errText}`);
  }

  const data: unknown = await response.json();
  const reply = (data as { reply?: string })?.reply?.trim();

  if (!reply) {
    throw new Error('Chat API returned an empty response.');
  }
  return reply;
}
