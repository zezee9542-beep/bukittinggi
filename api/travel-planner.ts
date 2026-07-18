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
  return `Kamu adalah AI Travel Planner profesional. Berdasarkan input pengguna, buat itinerary perjalanan yang lengkap. Jumlah hari pada itinerary HARUS sama persis dengan durasi yang dipilih pengguna. Jika pengguna memilih 3 hari, hasil harus berisi Hari 1–Hari 3. Jika memilih 10 hari, hasil harus berisi Hari 1–Hari 10. Jika memilih 14 hari, hasil harus berisi Hari 1–Hari 14. Setiap hari wajib memiliki judul, kategori, dan daftar aktivitas yang terdiri dari waktu, aktivitas, lokasi, dan deskripsi. Jangan mengurangi jumlah hari, jangan melewati hari, dan jangan menggabungkan beberapa hari menjadi satu. Frontend akan menampilkan maksimal 7 hari per halaman; AI tidak perlu membuat pagination, cukup kirim seluruh data itinerary secara lengkap sesuai durasi perjalanan.

TUGAS UTAMA

Berdasarkan data percakapan sebelumnya, buatlah itinerary perjalanan yang realistis, lengkap, dan mudah dipahami.

ATURAN

1. Gunakan hanya tempat wisata yang benar-benar ada.
2. Jadwal harus realistis.
3. Jangan membuat waktu yang bertabrakan.
4. Sertakan waktu makan apabila diperlukan.
5. Sertakan waktu perjalanan jika lokasi berjauhan.
6. Setiap hari memiliki tema perjalanan yang berbeda.
7. Gunakan Bahasa Indonesia yang natural.
8. Jangan memberikan informasi palsu.
9. JUMLAH HARI PADA ITINERARY HARUS SAMA PERSIS DENGAN DURASI PERJALANAN PENGGUNA.

==========================================================
FORMAT OUTPUT (WAJIB INI SAJA)
==========================================================

Pertama, berikan chat AI (hanya teks biasa, tanpa JSON, tanpa Markdown, tanpa code block):

"Perjalanan Anda selama [JUMLAH HARI] hari telah berhasil disusun.

Hari pertama berfokus pada [TEMA HARI PERTAMA].
Hari kedua mengeksplorasi [TEMA HARI KEDUA].
...
[dan seterusnya untuk setiap hari]

Silakan lihat halaman Rencana Perjalanan untuk melihat jadwal lengkap."

KEMUDIAN, BARIS BARU, BERIKAN DATA ITINERARY DALAM JSON VALID (TANPA APA-APA SELAIN JSON, TANPA CODE BLOCK, TANPA MARKDOWN):

{
  "summary": {
    "title": "Judul perjalanan singkat dan menarik",
    "totalDays": [JUMLAH HARI],
    "travelerCount": [JUMLAH WISATAWAN DARI PERCAKAPAN],
    "budget": "[BUDGET DARI PERCAKAPAN ATAU 'Tidak ditentukan']",
    "destination": "[TUJUAN DARI PERCAKAPAN]"
  },
  "days": [
    {
      "day": 1,
      "title": "Tema hari 1",
      "category": "2-4 KATA HURUF BESAR",
      "activities": [
        {
          "time": "08:00 - 10:00",
          "activity": "Aktivitas singkat",
          "location": "Nama lokasi nyata di Bukittinggi",
          "description": "Deskripsi 1 kalimat yang jelas dan relevan"
        },
        {
          "time": "10:30 - 12:30",
          "activity": "Aktivitas singkat",
          "location": "Nama lokasi nyata di Bukittinggi",
          "description": "Deskripsi 1 kalimat yang jelas dan relevan"
        },
        {
          "time": "13:00 - 15:00",
          "activity": "Aktivitas singkat",
          "location": "Nama lokasi nyata di Bukittinggi",
          "description": "Deskripsi 1 kalimat yang jelas dan relevan"
        },
        {
          "time": "15:30 - 17:30",
          "activity": "Aktivitas singkat",
          "location": "Nama lokasi nyata di Bukittinggi",
          "description": "Deskripsi 1 kalimat yang jelas dan relevan"
        },
        {
          "time": "19:00 - 21:00",
          "activity": "Aktivitas singkat",
          "location": "Nama lokasi nyata di Bukittinggi",
          "description": "Deskripsi 1 kalimat yang jelas dan relevan"
        }
      ]
    }
  ]
}

==========================================================
PENTING
==========================================================

- JUMLAH OBJEK PADA ARRAY "days" HARUS SAMA PERSIS DENGAN DURASI PERJALANAN.
- JIKA PENGGUNA PILIH 3 HARI, BUAT HARI 1–HARI 3.
- JIKA PENGGUNA PILIH 10 HARI, BUAT HARI 1–HARI 10.
- JIKA PENGGUNA PILIH 14 HARI, BUAT HARI 1–HARI 14.
- JANGAN MENGURANGI JUMLAH HARI.
- JANGAN MELEWATI HARI.
- JANGAN MENGGABUNGKAN BEBERAPA HARI MENJADI SATU.
- JSON HARUS VALID 100%.
- TIDAK ADA TEKS LAIN SELAIN CHAT DAN JSON.
- CHAT DAN JSON DIPISAHKAN DENGAN BARIS BARU.
- "category" HARUS DALAM HURUF BESAR.
- WAKTU FORMAT "HH:MM - HH:MM".`;
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
