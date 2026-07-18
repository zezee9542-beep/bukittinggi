// Test the itinerary parser with the exact raw AI response we just got!
const sampleAiResponse = `##JUDUL:Jejak Sejarah dan Cita Rasa Bukittinggi
##RINGKASAN:Perjalanan tiga hari ini mengeksplorasi warisan kolonial, budaya Minangkabau, dan kekayaan kuliner otentik di jantung Sumatera Barat. Anda akan mengunjungi situs bersejarah ikonik serta mencicipi hidangan legendaris lokal.      
##ESTIMASI:Rp2.500.000
##TIPS:Gunakan layanan ojek online atau sewa mobil harian untuk mobilitas yang lebih fleksibel di area perbukitan.

##HARI:1
##JUDUL_HARI:Menelusuri Ikon Kota
##FOKUS:SEJARAH DAN LANDMARK
08:00-10:00|Sarapan Nasi Kapau|Los Lambuang|Menikmati nasi kapau otentik dengan aneka lauk khas Minang.
10:30-12:30|Eksplorasi Jam Gadang|Taman Jam Gadang|Melihat menara jam bersejarah dan berfoto di area taman pusat kota.
13:00-15:00|Wisata Sejarah|Lubang Jepang|Menelusuri terowongan pertahanan bawah tanah peninggalan masa pendudukan Jepang.
15:30-17:30|Jalan Santai|Taman Panorama|Menikmati pemandangan Ngarai Sianok yang memukau dari ketinggian.
19:00-21:00|Makan Malam Sate|Sate Mak Syukur|Menikmati sate Padang legendaris dengan kuah kental yang kaya rempah.

##HARI:2
##JUDUL_HARI:Warisan Budaya Minangkabau
##FOKUS:BUDAYA DAN ARSITEKTUR
08:00-10:00|Sarapan Bubur Kampiun|Pasar Atas|Mencicipi bubur manis khas Minang yang terdiri dari berbagai campuran bahan.
10:30-12:30|Wisata Budaya|Rumah Gadang Baanjuang|Mempelajari arsitektur tradisional dan koleksi sejarah di Museum Kebudayaan.
13:00-15:00|Makan Siang Dendeng|Dendeng Batokok Balado|Menikmati dendeng sapi yang dipukul dan disiram sambal lado merah.
15:30-17:30|Belanja Oleh-oleh|Pasar Atas|Membeli kerajinan tangan dan makanan ringan khas seperti keripik sanjai.
19:00-21:00|Makan Malam Ikan|Ikan Bakar Sianok|Menikmati ikan air tawar segar dengan bumbu rempah khas di tepi lembah.

##HARI:3
##JUDUL_HARI:Eksplorasi Alam Sekitar
##FOKUS:ALAM DAN KULINER
08:00-10:00|Sarapan Lontong Sayur|Lontong Sayur Bukittinggi|Menikmati lontong dengan kuah gulai paku yang gurih dan pedas.
10:30-12:30|Wisata Alam|Janjang Saribu|Berjalan menyusuri tangga bersejarah dengan pemandangan lembah yang hijau.
13:00-15:00|Makan Siang Itiak Lado Mudo|Ngarai Sianok|Mencicipi masakan khas itik lado mudo yang sangat populer di kawasan ini.
15:30-17:30|Kunjungan Museum|Museum Rumah Kelahiran Bung Hatta|Melihat rumah masa kecil proklamator Indonesia yang penuh nilai sejarah.
19:00-21:00|Makan Malam Penutup|Martabak Kubang|Menikmati martabak telur khas Minang dengan kuah cuka yang segar.`;

function parseItineraryText(text) {
  console.log('🔍 PARSING TEXT:', text.substring(0, 500) + '...');
  const meta = {};
  const parsedDays = [];

  const lines = text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);
  let currentDay = null;

  for (const line of lines) {
    if (/^##JUDUL\s*:/i.test(line) && !/^##JUDUL_HARI\s*:/i.test(line)) {
      meta.judul = line.replace(/^##JUDUL\s*:/i, '').trim();
      console.log('✅ Parsed JUDUL:', meta.judul);
      continue;
    }
    if (/^##RINGKASAN\s*:/i.test(line)) {
      meta.ringkasan = line.replace(/^##RINGKASAN\s*:/i, '').trim();
      console.log('✅ Parsed RINGKASAN:', meta.ringkasan);
      continue;
    }
    if (/^##ESTIMASI\s*:/i.test(line)) {
      meta.estimasi = line.replace(/^##ESTIMASI\s*:/i, '').trim();
      console.log('✅ Parsed ESTIMASI:', meta.estimasi);
      continue;
    }
    if (/^##TIPS\s*:/i.test(line)) {
      meta.tips = line.replace(/^##TIPS\s*:/i, '').trim();
      console.log('✅ Parsed TIPS:', meta.tips);
      continue;
    }

    if (/^##HARI\s*:\s*\d+/i.test(line)) {
      if (currentDay) parsedDays.push(currentDay);
      const dayNumStr = line.replace(/^##HARI\s*:/i, '').trim();
      const dayNum = parseInt(dayNumStr, 10);
      currentDay = {
        dayNumber: isNaN(dayNum) ? parsedDays.length + 1 : dayNum,
        title: `Hari ${isNaN(dayNum) ? parsedDays.length + 1 : dayNum}`,
        fokus: 'RENCANA PERJALANAN',
        activities: [],
      };
      console.log('✅ Starting day:', currentDay.dayNumber);
      continue;
    }
    if (/^##JUDUL_HARI\s*:/i.test(line) && currentDay) {
      currentDay.title = line.replace(/^##JUDUL_HARI\s*:/i, '').trim() || currentDay.title;
      console.log('✅ Set day title:', currentDay.title);
      continue;
    }
    if (/^##FOKUS\s*:/i.test(line) && currentDay) {
      currentDay.fokus = line.replace(/^##FOKUS\s*:/i, '').trim().toUpperCase() || 'RENCANA PERJALANAN';
      console.log('✅ Set day fokus:', currentDay.fokus);
      continue;
    }

    if (currentDay && !line.startsWith('##')) {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 4) {
        const rawWaktu = parts[0];
        const aktivitas = parts[1];
        const lokasi = parts[2];
        const deskripsi = parts.slice(3).join(' | ');

        const waktu = rawWaktu
          .replace(/\./g, ':')
          .replace(/[–—]/g, '-')
          .replace(/\s*-\s*/g, ' - ');

        currentDay.activities.push({ waktu, aktivitas, lokasi, deskripsi });
        console.log('  ✅ Added activity:', { waktu, aktivitas, lokasi, deskripsi });
        continue;
      }
    }
  }

  if (currentDay) parsedDays.push(currentDay);

  console.log('\n✅ Final parsed days:', parsedDays.map(d => ({
    dayNumber: d.dayNumber,
    title: d.title,
    fokus: d.fokus,
    activities: d.activities.length,
  })));
  console.log('✅ Final meta:', meta);
  return { days: parsedDays, meta };
}

// Run the test!
console.log('🧪 Testing Parser with real AI response...\n');
const result = parseItineraryText(sampleAiResponse);
console.log('\n🎉 Parser Test Complete!');
console.log(`Total days: ${result.days.length}`);
console.log(`First day title: ${result.days[0]?.title}`);
console.log(`First day activities: ${result.days[0]?.activities.map(a => a.aktivitas).join(', ')}`);
