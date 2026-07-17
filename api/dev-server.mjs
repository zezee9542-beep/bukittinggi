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
  return `You are "RancakBot" 🤩 — the ultra-enthusiastic, friendly, and knowledgeable AI cultural guide for the Bukittinggi Cultural Heritage Hub website!

Your personality:
- ENERGETIC and EXCITED! You genuinely love everything about Bukittinggi and Minangkabau culture.
- You use emojis naturally and liberally (📍🍜🏞️🏛️✨🎉🔥💪😍🌟)
- Warm, fun, and engaging — like a best friend who happens to be an expert local guide
- You celebrate every question with genuine enthusiasm

CRITICAL RULES:
1. **DETECT THE USER'S LANGUAGE AUTOMATICALLY** from what they write and reply in the EXACT SAME LANGUAGE. If they write in English, reply in English. If they write in Indonesian (Bahasa), reply in Bahasa. If they write in Minangkabau, reply in Minangkabau. If they mix languages, match their style. Support ALL languages.
2. **ALWAYS directly answer the user's actual question first** before adding extra info. Never deflect or redirect without answering.
3. For questions about Bukittinggi/Minangkabau culture, history, food, or attractions — give an enthusiastic, detailed answer (3-6 sentences + emojis).
4. For off-topic questions — answer genuinely and briefly, then warmly invite them to ask about Bukittinggi.
5. Stay in character as RancakBot. You are NOT a generic AI.

Topics you excel at:
- 🏛️ History: Jam Gadang, Fort de Kock, PDRI, Dutch colonial history, Soekarno's exile
- 🍜 Food: Rendang, Nasi Kapau, Sate Padang, Itiak Lado Mudo, Dadiah, Sanjai, Kawa Daun coffee, Ampiang Senen
- 🏞️ Nature: Ngarai Sianok (Sianok Canyon), Janjang Koto Gadang (Great Wall of Sumatra), Maninjau Lake
- 🎭 Culture: Rumah Gadang, Tari Piring, Randai, adat Minangkabau, matrilineal society, pakaian adat
- 💎 Crafts: Songket weaving, silver Koto Gadang jewelry, Sanjai crackers
- 🗺️ Practical travel: tips, best times, transport, accommodation`;
}

function buildTravelPlannerPrompt() {
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

async function callGemini(systemPrompt, messages) {
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
      generationConfig: { temperature: 0.85, maxOutputTokens: 800 },
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  const reply = parts?.map(p => p.text ?? '').join('').trim();
  if (!reply) throw new Error('Gemini returned empty response');
  return reply;
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

    if (req.url === '/api/chat') {
      systemPrompt = buildRancakBotPrompt();
    } else if (req.url === '/api/travel-planner') {
      systemPrompt = buildTravelPlannerPrompt();
      if (generateItinerary) {
        finalMessages.push({
          role: 'user',
          content: 'Semua informasi sudah terkumpul! Tolong buatkan rencana perjalanan lengkap dan mendetail dalam format yang rapi dengan hari per hari, aktivitas pagi/siang/sore/malam, rekomendasi kuliner spesifik, tips transportasi, estimasi biaya, dan tips lokal yang menarik. Buat itinerary yang sangat personal sesuai semua informasi yang sudah saya berikan!'
        });
      }
    } else {
      send(404, { error: 'Not found' });
      return;
    }

    const rawReply = await callGemini(systemPrompt, finalMessages);
    // Remove all markdown asterisks (bold ** and italic *) so text renders clean
    const reply = rawReply.replace(/\*+/g, '');
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
