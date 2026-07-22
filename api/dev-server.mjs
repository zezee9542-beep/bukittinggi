// Local development API server.
// Run this alongside `npm run dev` so that fetch('/api/chat') and
// fetch('/api/travel-planner') work during local development.
// Vite's proxy (see vite.config.ts) forwards /api/* → http://localhost:3001/api/*
//
// Usage:
//   node --env-file=.env api/dev-server.mjs
//
// Or via npm script: "dev:api" defined in package.json

import http from 'http';

const GEMINI_ENDPOINT_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

function buildRancakBotPrompt() {
  return `You are "RancakBot" 🤩 — the friendly, ultra-concise AI guide for Bukittinggi Cultural Heritage Hub!

STRICT LENGTH RULE (MUST FOLLOW):
- Keep responses EXTREMELY SHORT & DIRECT (MAXIMUM 1-2 SHORT SENTENCES OR 2 TINY BULLET POINTS TOTAL).
- NEVER write long paragraphs or multi-point lists. Be super concise!

Personality:
- Friendly, warm, and helpful with a local Minang touch (📍🍜🏞️🏛️✨)
- Automatically match the user's language (Indonesian, English, or Minangkabau).

Scope:
- Exclusively answer about Bukittinggi, Minangkabau culture, food, history, and tourism.
- Politely refuse off-topic requests in 1 short sentence and redirect to Bukittinggi.`;
}

function buildTravelPlannerChatPrompt() {
  return `You are "Rancak Planner" ✈️🌟 — a super excited, warm, and professional AI travel planning assistant for the Bukittinggi Cultural Heritage Hub!

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
}

function buildTravelPlannerItineraryPrompt() {
  return `You are RancakBot AI, seorang AI Travel Planner profesional yang khusus membantu pengguna menyusun itinerary wisata di Bukittinggi dan Sumatera Barat.

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
- JSON HARUS VALID 100%.
- TIDAK ADA TEKS LAIN SELAIN CHAT DAN JSON.
- CHAT DAN JSON DIPISAHKAN DENGAN BARIS BARU.
- "category" HARUS DALAM HURUF BESAR.
- WAKTU FORMAT "HH:MM - HH:MM".`;
}

async function callGemini(systemPrompt, messages, generationConfigOverrides = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const response = await fetch(`${GEMINI_ENDPOINT_BASE}/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 800,
        ...generationConfigOverrides
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  const rawReply = parts?.map(p => p.text ?? '').join('').trim();
  if (!rawReply) throw new Error('Gemini returned empty response');
  return rawReply;
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const send = (status, body) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
  };

  try {
    const body = await readBody(req);
    const { messages, generateItinerary } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      send(400, { error: 'messages array required' });
      return;
    }

    let systemPrompt;
    let finalMessages = [...messages];
    let generationConfig = {};

    if (req.url === '/api/chat') {
      systemPrompt = buildRancakBotPrompt();
    } else if (req.url === '/api/travel-planner') {
      if (generateItinerary) {
        systemPrompt = buildTravelPlannerItineraryPrompt();
        generationConfig = { temperature: 0.25, maxOutputTokens: 6000 };
        finalMessages.push({
          role: 'user',
          content: 'Semua informasi sudah terkumpul! Tolong buatkan rencana perjalanan lengkap dan mendetail dalam format yang rapi dengan hari per hari, aktivitas pagi/siang/sore/malam, rekomendasi kuliner spesifik, tips transportasi, estimasi biaya, dan tips lokal yang menarik. Buat itinerary yang sangat personal sesuai semua informasi yang sudah saya berikan!'
        });
      } else {
        systemPrompt = buildTravelPlannerChatPrompt();
      }
    } else {
      send(404, { error: 'Not found' });
      return;
    }

    const rawReply = await callGemini(systemPrompt, finalMessages, generationConfig);
    // Clean up any accidental markdown the model might add
    const reply = rawReply
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/^#+\s*/gm, '');
    send(200, { reply });

  } catch (err) {
    console.error('Dev API error:', err.message);
    send(500, { error: err.message });
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`✅ Local API server running at http://localhost:${PORT}`);
  console.log(`   /api/chat          → RancakBot AI`);
  console.log(`   /api/travel-planner → AI Travel Planner`);
  console.log(`   API Key: ${process.env.GEMINI_API_KEY ? '✓ Loaded' : '✗ MISSING!'}`);
});
