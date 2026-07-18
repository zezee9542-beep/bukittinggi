// Test the itinerary parser with the sample AI response we just got!
const sampleAiResponse = `##JUDUL:Jejak Sejarah dan Cita Rasa Minangkabau
##RINGKASAN:Menjelajahi warisan kolonial dan budaya Minangkabau melalui situs bersejarah serta kuliner autentik Bukittinggi. Perjalanan ini dirancang untuk memberikan pengalaman mendalam bagi pecinta sejarah dan penikmat kuliner lokal.
##ESTIMASI:Rp 1.500.000
##TIPS:Gunakan jasa ojek daring atau sewa motor untuk mobilitas lebih fleksibel di jalanan Bukittinggi yang sempit.

##HARI:1
##JUDUL_HARI:Jantung Kota dan Sejarah Kolonial
##FOKUS:WISATA SEJARAH KOTA
08:00-10:00|Sarapan Nasi Kapau|Los Lambuang|Menikmati nasi kapau autentik dengan lauk gulai tunjang yang legendaris.
10:30-12:30|Menjelajahi Terowongan|Lubang Jepang|Menelusuri lorong bawah tanah peninggalan tentara Jepang di masa perang dunia kedua.
13:00-15:00|Makan Siang Sate|Sate Mak Syukur|Mencicipi sate padang dengan bumbu kental khas yang sangat populer di kawasan ini.
15:30-17:30|Mengunjungi Ikon Kota|Jam Gadang|Berfoto di depan menara jam bersejarah yang menjadi simbol utama kota Bukittinggi.
19:00-21:00|Makan Malam Tradisional|Restoran Simpang Raya|Menikmati hidangan rendang dan ayam pop dengan pemandangan malam kota yang syahdu.

##HARI:2
##JUDUL_HARI:Budaya Minang dan Panorama Alam
##FOKUS:BUDAYA DAN ALAM
08:00-10:00|Melihat Arsitektur|Rumah Gadang Baanjuang|Mengamati detail arsitektur tradisional Minangkabau di dalam area Taman Marga Satwa.
10:30-12:30|Menyeberangi Jembatan|Jembatan Limpapeh|Berjalan melintasi jembatan gantung yang menghubungkan Taman Marga Satwa dan Benteng Fort de Kock.
13:00-15:00|Makan Siang Ikan|Pondok Ikan Bakar|Menikmati ikan bakar bumbu rempah khas Minang di dekat area Ngarai Sianok.
15:30-17:30|Menikmati Pemandangan|Panorama Ngarai Sianok|Melihat keindahan lembah curam yang membelah kota dengan latar belakang Gunung Singgalang.
19:00-21:00|Camilan Malam|Martabak Kubang|Mencicipi martabak kubang yang gurih dengan isian daging sapi melimpah.

##HARI:3
##JUDUL_HARI:Eksplorasi Warisan dan Oleh-oleh
##FOKUS:WISATA BELANJA KULINER
08:00-10:00|Sarapan Bubur Kampiun|Pasar Atas|Mencicipi bubur kampiun yang merupakan perpaduan berbagai jenis bubur manis khas Minang.
10:30-12:30|Belanja Kerajinan|Pasar Atas Bukittinggi|Membeli kerajinan tangan lokal dan kain songket khas Sumatera Barat sebagai kenang-kenangan.
13:00-15:00|Makan Siang Dendeng|Dendeng Batokok Balado|Menikmati dendeng sapi yang dipukul-pukul dengan sambal lado merah yang pedas.
15:30-17:30|Membeli Oleh-oleh|Toko Sanjai Ummi Aufa|Membeli keripik sanjai berbagai rasa sebagai oleh-oleh wajib khas Bukittinggi.
19:00-21:00|Makan Malam Penutup|Soto Padang H. St. Mangkuto|Menikmati soto padang dengan kuah kaldu yang kaya rempah sebagai penutup perjalanan.`;

function parseItineraryText(text) {
  console.log('🔍 Parsing text...');
  const meta = {};
  const parsedDays = [];

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
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

        const waktu = rawWaktu.replace(/\./g, ':').replace(/[–—]/g, '-').replace(/\s*-\s*/g, ' - ');

        currentDay.activities.push({ waktu, aktivitas, lokasi, deskripsi });
        console.log('  ✅ Added activity:', { waktu, aktivitas, lokasi, deskripsi });
        continue;
      }
    }
  }

  if (currentDay) parsedDays.push(currentDay);

  console.log('\n✅ Final Parsed Days:', parsedDays);
  console.log('✅ Final Meta:', meta);
  return { days: parsedDays, meta };
}

// Run the test!
console.log('🧪 Testing Parser...\n');
parseItineraryText(sampleAiResponse);
console.log('\n🎉 Parser Test Complete!');
