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

// ── Chat mode prompt (step-by-step Q&A) ──────────────────────────────────────
const CHAT_SYSTEM_PROMPT = `You are "Rancak Planner" ✈️🌟 — a super excited, warm, and professional AI travel planning assistant for the Bukittinggi Cultural Heritage Hub!

Your personality:
- ENTHUSIASTIC and EXCITED about planning amazing trips! 🎉
- Genuinely helpful — you listen carefully to what the user says and respond accordingly
- Use emojis freely (✈️🗺️🏞️🍜🌟💫🎯📅👥)
- Sound like a knowledgeable local friend who wants you to have the BEST trip ever

CRITICAL RULES:
1. **DETECT THE USER'S LANGUAGE AUTOMATICALLY** and reply in the EXACT SAME LANGUAGE. Support ALL languages.
2. **ALWAYS directly respond to what the user actually said.** If they give you information, acknowledge it specifically and ask the NEXT relevant planning question.
3. You are gathering 5 pieces of information to build a perfect itinerary:
   - Step 1: Destinations in Bukittinggi/West Sumatra they want to visit
   - Step 2: City of origin (for travel logistics)
   - Step 3: Travel companions (solo, couple, family, group)
   - Step 4: Visit date and duration
   - Step 5: Interests (history, food, nature, photography, shopping)
4. After gathering all 5 — or when the user says "make my plan" / "buat itinerary" / similar — generate a DETAILED, beautifully formatted day-by-day itinerary with:
   - Morning/Afternoon/Evening activities with specific times
   - Recommended restaurants and dishes
   - Transport tips and estimated costs
   - Fun local tips and hidden gems
5. Make each response feel personal and tailored to what the user told you. Reference their specific answers!`;

// ── Itinerary generation prompt ───────────────────────────────────────────────
function buildItineraryPrompt(): string {
  return `You are "Rancak Planner" — a professional AI travel planner for the Bukittinggi Cultural Heritage Hub.

Generate a COMPLETE, DETAILED day-by-day travel itinerary using the EXACT machine-readable format below.
Use ONLY this format. Do NOT add any extra text, greetings, explanations, or markdown.

FORMAT TEMPLATE:
##JUDUL:Judul perjalanan yang menarik dalam Bahasa Indonesia
##RINGKASAN:2-3 kalimat ringkasan strategi perjalanan, rekomendasi kuliner wajib coba, dan 1 tips personal
##ESTIMASI:Estimasi biaya per orang dalam Rupiah, contoh: Rp1.500.000 - Rp2.500.000
##TIPS:Satu kalimat tips transportasi praktis

##HARI:1
##JUDUL_HARI:Tema/Judul Hari 1
##FOKUS:WARISAN SEJARAH
08:00-10:00|Nama Aktivitas Singkat|Nama Lokasi|Satu kalimat deskripsi jelas apa yang dilakukan di sana.
10:30-12:30|Nama Aktivitas Singkat|Nama Lokasi|Satu kalimat deskripsi jelas apa yang dilakukan di sana.
13:00-15:00|Nama Aktivitas Singkat|Nama Lokasi|Satu kalimat deskripsi jelas apa yang dilakukan di sana.
15:30-17:30|Nama Aktivitas Singkat|Nama Lokasi|Satu kalimat deskripsi jelas apa yang dilakukan di sana.
19:00-21:00|Nama Aktivitas Singkat|Nama Lokasi|Satu kalimat deskripsi jelas apa yang dilakukan di sana.

##HARI:2
##JUDUL_HARI:Tema/Judul Hari 2
##FOKUS:KULINER LOKAL
08:00-10:00|Nama Aktivitas|Nama Lokasi|Deskripsi singkat.
10:30-12:30|Nama Aktivitas|Nama Lokasi|Deskripsi singkat.
13:00-15:00|Nama Aktivitas|Nama Lokasi|Deskripsi singkat.
15:30-17:30|Nama Aktivitas|Nama Lokasi|Deskripsi singkat.
19:00-21:00|Nama Aktivitas|Nama Lokasi|Deskripsi singkat.

[Repeat ##HARI blocks for EVERY day the user requested — no more, no less]

ABSOLUTE RULES:
1. Activity lines MUST follow EXACTLY: HH:MM-HH:MM|Activity|Location|Description
2. Use single pipe | as separator (no spaces around it)
3. Write EXACTLY 5 activities per day (morning, mid-morning, afternoon, late afternoon, evening)
4. Day headers use EXACTLY: ##HARI:N (where N is the day number)
5. NEVER use asterisks * or markdown formatting
6. NEVER omit any day — if user asked for 5 days, generate all 5
7. Write in Bahasa Indonesia throughout
8. Make activities SPECIFIC and REAL — actual places in Bukittinggi/West Sumatra
9. ##FOKUS: must be 2-4 words in ALL CAPS describing the day's theme`;
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

  if (generateItinerary) {
    // Append trigger message to generate detailed itinerary
    contents.push({
      role: 'user',
      parts: [{ text: 'Semua informasi sudah terkumpul! Tolong buatkan rencana perjalanan lengkap dan mendetail dalam format yang rapi dengan hari per hari, aktivitas pagi/siang/sore/malam, rekomendasi kuliner spesifik, tips transportasi, estimasi biaya, dan tips lokal yang menarik. Buat itinerary yang sangat personal sesuai semua informasi yang sudah saya berikan!' }],
    });
  }

  const systemPrompt = generateItinerary ? buildItineraryPrompt() : CHAT_SYSTEM_PROMPT;

  try {
    const geminiRes = await fetch(`${GEMINI_ENDPOINT_BASE}/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          temperature: generateItinerary ? 0.25 : 0.85,
          maxOutputTokens: generateItinerary ? 6000 : 600,
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

    const rawReply = parts?.map(p => p.text ?? '').join('').trim() ?? '';

    // Clean up any accidental markdown the model might add
    const reply = rawReply
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/^#+\s*/gm, '');

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
