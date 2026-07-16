// Vercel Serverless Function — server-side proxy for the RancakBot AI
// assistant. This is what keeps the Gemini API key off the public browser
// bundle: the key only ever lives in this function's environment (set as a
// Vercel Project Environment Variable), never in client-side code.
import type { VercelRequest, VercelResponse } from '@vercel/node';

type Role = 'user' | 'assistant';

interface IncomingMessage {
  role: Role;
  content: string;
}

type Lang = 'en' | 'id' | 'min';

const GEMINI_ENDPOINT_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-3.1-flash-lite';

const LANGUAGE_NAMES: Record<Lang, string> = {
  en: 'English',
  id: 'Bahasa Indonesia',
  min: 'Bahasa Minangkabau (informal and warm — feel free to use words like "ambo", "dunsanak", "rancak", "bana")',
};

function buildSystemPrompt(lang: Lang): string {
  return `You are "RancakBot", the friendly AI heritage assistant embedded in the Bukittinggi Cultural Heritage Hub website. You help visitors learn about Bukittinggi and Minangkabau culture: history (Jam Gadang, Fort de Kock, PDRI), food (Rendang, Nasi Kapau, Sanjai), attractions (Ngarai Sianok / Sianok Canyon, the Japanese Tunnel / Lobang Jepang), and culture (Rumah Gadang, Tari Piring, adat/customs).

Rules:
- Always reply in ${LANGUAGE_NAMES[lang]}, regardless of what language earlier turns used.
- Keep answers concise and warm — roughly 2 to 5 sentences — and feel free to use a relevant emoji here and there (📍🍜🏞️🏛️).
- If the question is unrelated to Bukittinggi/Minangkabau heritage, answer briefly and politely, then steer the conversation back toward local history, culture, food, or attractions.
- Stay in character as RancakBot; never say you are a generic AI language model.`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server misconfigured: GEMINI_API_KEY is not set.' });
    return;
  }

  const body = (req.body ?? {}) as { messages?: IncomingMessage[]; lang?: Lang };
  const { messages } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Request body must include a non-empty "messages" array.' });
    return;
  }

  const lang: Lang = body.lang === 'en' || body.lang === 'min' ? body.lang : 'id';
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  // Gemini's `contents` array uses role "model" for assistant turns (not
  // "assistant"), and has no top-level "system" role — system instructions
  // go in a separate `system_instruction` field.
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  try {
    const geminiRes = await fetch(`${GEMINI_ENDPOINT_BASE}/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: buildSystemPrompt(lang) }] },
        contents,
        generationConfig: { temperature: 0.6, maxOutputTokens: 500 },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text().catch(() => '');
      res.status(geminiRes.status).json({ error: `Gemini API error: ${errText}` });
      return;
    }

    const data: unknown = await geminiRes.json();
    const parts = (data as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    })?.candidates?.[0]?.content?.parts;

    const reply = parts?.map(p => p.text ?? '').join('').trim();

    if (!reply) {
      res.status(502).json({ error: 'Gemini API returned an empty response.' });
      return;
    }

    res.status(200).json({ reply });
  } catch (err) {
    console.error('RancakBot proxy error:', err);
    res.status(500).json({ error: 'Unexpected server error while contacting Gemini.' });
  }
}
