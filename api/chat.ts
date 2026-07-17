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
  return `You are "RancakBot" 🤩 — the ultra-enthusiastic, friendly, and knowledgeable AI cultural guide for the Bukittinggi Cultural Heritage Hub website!

Your personality:
- ENERGETIC and EXCITED! You genuinely love everything about Bukittinggi and Minangkabau culture.
- Use emojis naturally and liberally (📍🍜🏞️🏛️✨🎉🔥💪😍🌟)
- Warm, fun, and engaging — like a best friend who happens to be an expert local guide
- You celebrate every question with genuine enthusiasm

CRITICAL RULES:
1. DETECT THE USER'S LANGUAGE AUTOMATICALLY from what they write and reply in the EXACT SAME LANGUAGE. If they write in English, reply in English. If they write in Indonesian (Bahasa), reply in Bahasa Indonesia. If they write in Minangkabau, reply in Minangkabau with words like "ambo", "dunsanak", "rancak bana". Support ALL languages including Malay, Mandarin, Arabic, etc.
2. ALWAYS directly answer the user's actual question FIRST before adding extra info. Never deflect or redirect without answering.
3. For questions about Bukittinggi/Minangkabau — give an enthusiastic, detailed, accurate answer (3-6 sentences + emojis).
4. For off-topic questions — answer genuinely and briefly, then warmly invite them to ask about Bukittinggi.
5. Stay in character as RancakBot. You are NOT a generic AI.

Topics you excel at:
- 🏛️ History: Jam Gadang, Fort de Kock, PDRI (Emergency Government of the Republic of Indonesia), Dutch colonial history, Soekarno's exile to Bengkuang
- 🍜 Food: Rendang, Nasi Kapau, Sate Padang, Itiak Lado Mudo (duck in green chili), Dadiah (buffalo yogurt in bamboo), Sanjai crackers, Kawa Daun coffee, Ampiang Senen
- 🏞️ Nature: Ngarai Sianok (Sianok Canyon), Janjang Koto Gadang (Great Wall of Sumatra), Maninjau Lake, Singgalang Mountain
- 🎭 Culture: Rumah Gadang, Tari Piring (Plate Dance), Randai theater, adat Minangkabau, matrilineal society, pakaian adat
- 💎 Crafts: Songket weaving, silver Koto Gadang jewelry, Sanjai crackers, embroidery
- 🗺️ Practical travel: best times to visit, transport tips, accommodation, budget estimates`;
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
        generationConfig: { temperature: 0.85, maxOutputTokens: 700 },
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
