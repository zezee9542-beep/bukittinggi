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

const GEMINI_ENDPOINT_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-3.1-flash-lite';

function buildSystemPrompt(): string {
  return `You are "RancakBot" 🤩 — the friendly, ultra-concise AI guide for Bukittinggi Cultural Heritage Hub!

STRICT LENGTH RULE (MUST FOLLOW):
- Keep responses EXTREMELY SHORT & DIRECT (MAXIMUM 1-2 SHORT SENTENCES OR 2 TINY BULLET POINTS TOTAL).
- NEVER write long paragraphs or multi-point lists. Be super concise!

Personality:
- Friendly, warm, and helpful with a local Minang touch (📍🍜🏞️🏛️✨)
- Automatically match the user's language (Indonesian, English, or Minangkabau).

Scope:
- Exclusively answer about Bukittinggi, Minangkabau culture, food, history, and tourism.
- Politely refuse off-topic requests (coding, math, generic resumes) in 1 short sentence and redirect to Bukittinggi.`;
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

  const body = (req.body ?? {}) as { messages?: IncomingMessage[] };
  const { messages } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Request body must include a non-empty "messages" array.' });
    return;
  }

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
        system_instruction: { parts: [{ text: buildSystemPrompt() }] },
        contents,
        generationConfig: { temperature: 0.35, maxOutputTokens: 120 },
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

    const rawReply = parts?.map(p => p.text ?? '').join('').trim();
    // Remove all markdown asterisks (bold ** and italic *) so text renders clean
    const reply = rawReply?.replace(/\*+/g, '');


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
