import 'dotenv/config';

const GEMINI_ENDPOINT_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const apiKey = process.env.GEMINI_API_KEY;
const model = 'gemini-3.1-flash-lite';

function buildItineraryPrompt() {
  return `You are "Rancak Planner" — a professional AI travel planner for the Bukittinggi Cultural Heritage Hub.

YOUR TASK: Output ONLY the machine-readable itinerary format below. NO other text, NO greetings, NO explanations, NO extra characters, NO markdown.

EXACT OUTPUT FORMAT (FOLLOW THIS 100%):
##JUDUL:[Judul perjalanan]
##RINGKASAN:[2-3 kalimat ringkasan]
##ESTIMASI:[Estimasi biaya dalam Rupiah]
##TIPS:[1 tips transportasi]

##HARI:1
##JUDUL_HARI:[Tema hari 1]
##FOKUS:[2-4 KATA HURUF BESAR]
08:00-10:00|[Aktivitas singkat]|[Nama lokasi]|[Deskripsi 1 kalimat]
10:30-12:30|[Aktivitas singkat]|[Nama lokasi]|[Deskripsi 1 kalimat]
13:00-15:00|[Aktivitas singkat]|[Nama lokasi]|[Deskripsi 1 kalimat]
15:30-17:30|[Aktivitas singkat]|[Nama lokasi]|[Deskripsi 1 kalimat]
19:00-21:00|[Aktivitas singkat]|[Nama lokasi]|[Deskripsi 1 kalimat]

##HARI:2
##JUDUL_HARI:[Tema hari 2]
##FOKUS:[2-4 KATA HURUF BESAR]
08:00-10:00|[Aktivitas singkat]|[Nama lokasi]|[Deskripsi 1 kalimat]
10:30-12:30|[Aktivitas singkat]|[Nama lokasi]|[Deskripsi 1 kalimat]
13:00-15:00|[Aktivitas singkat]|[Nama lokasi]|[Deskripsi 1 kalimat]
15:30-17:30|[Aktivitas singkat]|[Nama lokasi]|[Deskripsi 1 kalimat]
19:00-21:00|[Aktivitas singkat]|[Nama lokasi]|[Deskripsi 1 kalimat]

[ULANGI ##HARI UNTUK SETIAP HARI YANG DIMINTA USER]

RULES TIDAK DAPAT DILANGGAR:
1. TIDAK ADA TEKS SELAIN FORMAT DI ATAS
2. SETIAP BARIS AKTIVITAS: HH:MM-HH:MM|Aktivitas|Lokasi|Deskripsi
3. HANYA GUNAKAN SATU PIPA | SEBAGAI PEMISAH (TANPA SPASI)
4. EXACT 5 AKTIVITAS PER HARI
5. JUDUL HARI DAN FOKUS WAJIB ADA
6. SEMUA TULISAN DALAM BAHASA INDONESIA
7. NAMA LOKASI HARUS NYATA DI BUKITTINGGI/SUMATERA BARAT`;
}

async function testItinerary() {
  if (!apiKey || apiKey.includes('GANTI_DENGAN')) {
    console.error('❌ ERROR: Silakan ganti GEMINI_API_KEY di file .env dengan API key asli Anda!');
    return;
  }

  console.log('🔑 API Key loaded:', apiKey.substring(0, 10) + '...');
  console.log('🚀 Testing Itinerary Generation...');

  try {
    const response = await fetch(`${GEMINI_ENDPOINT_BASE}/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: buildItineraryPrompt() }] },
        contents: [
          { role: 'user', parts: [{ text: 'Saya ingin rencana perjalanan 3 hari di Bukittinggi dengan minat sejarah dan kuliner.' }] },
          { role: 'user', parts: [{ text: 'Semua informasi sudah terkumpul! Tolong buatkan rencana perjalanan lengkap dan mendetail dalam format yang rapi dengan hari per hari, aktivitas pagi/siang/sore/malam, rekomendasi kuliner spesifik, tips transportasi, estimasi biaya, dan tips lokal yang menarik. Buat itinerary yang sangat personal sesuai semua informasi yang sudah saya berikan!' }] }
        ],
        generationConfig: { temperature: 0.25, maxOutputTokens: 6000 }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      return;
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log('\n✅ AI Berhasil Menghasilkan Itinerary!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Respon AI Mentah:');
    console.log(reply);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testItinerary();
