import 'dotenv/config';

const GEMINI_ENDPOINT_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const apiKey = process.env.GEMINI_API_KEY;
const model = 'gemini-3.1-flash-lite';

async function testAi() {
  if (!apiKey || apiKey.includes('GANTI_DENGAN')) {
    console.error('❌ ERROR: Silakan ganti GEMINI_API_KEY di file .env dengan API key asli Anda!');
    console.log('📝 Dapatkan API key di: https://aistudio.google.com/app/apikey');
    return;
  }

  console.log('🔑 API Key loaded:', apiKey.substring(0, 10) + '...');
  console.log('🚀 Testing Gemini API...');

  try {
    const response = await fetch(`${GEMINI_ENDPOINT_BASE}/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: 'Kamu adalah RancakBot, panduan wisata Bukittinggi yang ramah!'
          }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: 'Apa tempat wisata terkenal di Bukittinggi?' }]
          }
        ],
        generationConfig: { temperature: 0.8, maxOutputTokens: 300 }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      return;
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log('\n✅ AI Berhasil Merespon!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🤖 RancakBot:', reply);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testAi();
