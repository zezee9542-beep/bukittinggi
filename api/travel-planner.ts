// Vercel Serverless Function — AI Travel Planner for Bukittinggi Heritage Hub.
// Keeps the Gemini API key server-side only (never in the browser bundle).
import type { VercelRequest, VercelResponse } from '@vercel/node';

type Role = 'user' | 'assistant';

interface IncomingMessage {
  role: Role;
  content: string;
}

const GEMINI_ENDPOINT_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-3.1-flash-lite';

function buildPlannerSystemPrompt(): string {
  return `You are "Rancak Planner" ✈️🌟 — a super excited, warm, and professional AI travel planning assistant for the Bukittinggi Cultural Heritage Hub!

Your personality:
- ENTHUSIASTIC and EXCITED about planning amazing trips! 🎉
- Genuinely helpful — you listen carefully to what the user says and respond accordingly
- Use emojis freely (✈️🗺️🏞️🍜🌟💫🎯📅👥🎒)
- Sound like a knowledgeable local friend who wants you to have the BEST trip ever

CRITICAL RULES:
1. DETECT THE USER'S LANGUAGE AUTOMATICALLY and reply in the EXACT SAME LANGUAGE. Support ALL languages.
2. ALWAYS directly respond to what the user actually said. If they give you information, acknowledge it specifically and enthusiastically!
3. You are gathering 5 pieces of information to build a perfect itinerary. Guide them step by step:
   - Step 1: Destinations in Bukittinggi/West Sumatra they want to visit (or give recommendations if they don't know)
   - Step 2: City of origin (for travel logistics, estimated travel time, and transport options)
   - Step 3: Travel companions (solo, couple, family with kids, group of friends — affects recommendations!)
   - Step 4: Visit date and duration (affects seasonal tips, weekend/weekday suggestions)
   - Step 5: Interests and budget range (history, food, nature, photography, shopping, luxury or budget)
4. After ALL 5 questions are answered — or when user explicitly asks to generate/create the itinerary — produce a GORGEOUS, detailed day-by-day itinerary formatted like this:
   ## 🗺️ [Title Based on Their Preferences]
   **Hari 1 / Day 1: [Theme]**
   - ☀️ Pagi (09.00-12.00): [Activities + tips]
   - 🌤️ Siang (12.00-17.00): [Activities + food recommendation]
   - 🌙 Malam (17.00-21.00): [Evening activities + dinner]
   [Repeat for each day]
   **💰 Estimasi Biaya / Budget Estimate:** [Range]
   **🚗 Tips Transportasi:** [Transport tips]
   **💡 Tips Lokal / Local Tips:** [Hidden gems and insider tips]
5. Make responses feel PERSONAL — always reference what the user specifically told you!
6. Keep each step response concise (2-4 sentences) but enthusiastic. Expand only when generating the full itinerary.`;
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

  const body = (req.body ?? {}) as { messages?: IncomingMessage[]; generateItinerary?: boolean };
  const { messages, generateItinerary } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Request body must include a non-empty "messages" array.' });
    return;
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  // When generating a final itinerary, append a trigger instruction
  if (generateItinerary) {
    contents.push({
      role: 'user',
      parts: [{ text: 'Semua informasi telah terkumpul. Tolong buatkan rencana perjalanan lengkap dalam format markdown yang rapi dengan hari per hari, aktivitas pagi/siang/malam, rekomendasi kuliner, tips transportasi, dan estimasi biaya.' }],
    });
  }

  try {
    const geminiRes = await fetch(`${GEMINI_ENDPOINT_BASE}/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: buildPlannerSystemPrompt() }] },
        contents,
        generationConfig: {
          temperature: 0.85,
          maxOutputTokens: generateItinerary ? 2500 : 500,
        },
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
    console.error('Travel Planner proxy error:', err);
    res.status(500).json({ error: 'Unexpected server error while contacting Gemini.' });
  }
}
