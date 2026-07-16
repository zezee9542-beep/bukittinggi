import * as React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import chtPng from '../assets/cht.png';
import enterPng from '../assets/enter.png';
import { useMode } from '../context/ModeContext';
import { useTranslation } from '../hooks/useTranslation';
import { askAi, type AiChatMessage } from '../lib/aiClient';

// Inject float keyframe + tilt styles once
const FLOAT_STYLE = `
@keyframes rancakbotFloat {
  0%   { transform: translateY(0px) rotate(-1deg); }
  30%  { transform: translateY(-8px) rotate(0.5deg); }
  60%  { transform: translateY(-5px) rotate(-0.5deg); }
  100% { transform: translateY(0px) rotate(-1deg); }
}
.rancakbot-float {
  animation: rancakbotFloat 3.8s ease-in-out infinite;
  transform-origin: bottom center;
}
.rancakbot-tilting {
  animation: none !important;
}
@keyframes hiPop {
  0%   { opacity: 0; transform: translateX(-50%) scale(0.6) translateY(10px); }
  60%  { opacity: 1; transform: translateX(-50%) scale(1.05) translateY(-2px); }
  80%  { transform: translateX(-50%) scale(0.97) translateY(0px); }
  100% { opacity: 1; transform: translateX(-50%) scale(1) translateY(0px); }
}
@keyframes hiFade {
  0%   { opacity: 1; }
  80%  { opacity: 1; }
  100% { opacity: 0; }
}
.rancakbot-hi {
  animation: hiPop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards, hiFade 2s ease 1s forwards;
  pointer-events: none;
}
model-viewer {
  outline: none !important;
  border: none !important;
  --poster-color: transparent !important;
}
model-viewer:focus, model-viewer:focus-visible {
  outline: none !important;
  border: none !important;
}
`;

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string; alt?: string; 'auto-rotate'?: boolean;
          'camera-controls'?: boolean; 'disable-zoom'?: boolean;
          'shadow-intensity'?: string; 'environment-image'?: string;
          'auto-rotate-delay'?: string; 'interaction-prompt'?: string;
          loading?: string; reveal?: string; style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// TRANSLATION COMMAND DETECTION
// ─────────────────────────────────────────────────────────────────────────────

const LANG_EN_KEYWORDS = ['english', 'inggris', 'bahasa inggris', 'english language'];
const LANG_ID_KEYWORDS = ['indonesia', 'bahasa indonesia', 'indonesian', 'melayu', 'indo'];
const LANG_MIN_KEYWORDS = ['minang', 'minangkabau', 'bahasa minang', 'bahaso minang'];
const CHANGE_VERBS = ['ubah', 'ganti', 'change', 'translate', 'switch', 'jadikan', 'buat', 'tampilkan', 'gunakan', 'pakai', 'set', 'turn', 'make', 'kembalikan', 'balik'];

function detectTranslateCommand(q: string): 'en' | 'id' | 'min' | null {
  const hasVerb = CHANGE_VERBS.some(v => q.includes(v));
  const toEn   = LANG_EN_KEYWORDS.some(k => q.includes(k));
  const toId   = LANG_ID_KEYWORDS.some(k => q.includes(k));
  const toMin  = LANG_MIN_KEYWORDS.some(k => q.includes(k));

  // Also catch imperative patterns like "translate to english", "speak english"
  const imperativeEn = /\b(speak|talk|respond|reply|answer)\s+(in\s+)?english\b/.test(q);
  const imperativeId = /\b(speak|talk|respond|reply|answer)\s+(in\s+)?(bahasa\s+)?indonesia(n)?\b/.test(q);

  if ((hasVerb && toEn) || imperativeEn) return 'en';
  if ((hasVerb && toId) || imperativeId) return 'id';
  if (hasVerb && toMin) return 'min';
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGE DETECTION (for auto-responding in user's language)
// ─────────────────────────────────────────────────────────────────────────────

const EN_WORDS = ['what', 'where', 'when', 'who', 'how', 'why', 'tell', 'about', 'please', 'thank', 'is ', 'are ', 'can ', 'do ', 'did ', 'have', 'want', 'need', 'help', 'history', 'culture', 'food', 'place', 'visit', 'travel', 'city', 'tourist', 'attraction', 'the ', 'you ', 'your'];
const MIN_WORDS = ['ambo', 'dunsanak', 'awak', 'ang ', 'inyo', 'apo ', 'rancak', 'bana ', 'jo ', 'nan ', 'pado', 'taun', 'iyo', 'indak', 'ndak', 'caro', 'samo', 'alah', 'alun', 'den ', 'kaba ', 'uda ', 'uni '];

type Lang = 'en' | 'id' | 'min';

function detectInputLang(text: string): Lang {
  const q = text.toLowerCase();
  const enScore  = EN_WORDS.filter(w => q.includes(w)).length;
  const minScore = MIN_WORDS.filter(w => q.includes(w)).length;
  if (enScore >= 2)  return 'en';
  if (minScore >= 1) return 'min';
  return 'id';
}

// ─────────────────────────────────────────────────────────────────────────────
// KNOWLEDGE BASE — precise, topic-specific answers
// ─────────────────────────────────────────────────────────────────────────────

interface Topic {
  keywords: string[];
  en: string;
  id: string;
  min: string;
}

const TOPICS: Topic[] = [
  {
    keywords: ['jam gadang', 'clock tower', 'menara jam', 'big clock'],
    en: "Jam Gadang is Bukittinggi's iconic clock tower, built in 1926 by architect Yazid Rajo Mangkuto. It was a gift from the Dutch Queen to the city's secretary Rookmaaker. Its clock mechanism is extremely rare — built by Vortmann of Germany, equivalent to Big Ben in London. Uniquely, the Roman numeral 4 is written as IIII, not IV.",
    id: "Jam Gadang adalah ikon utama Bukittinggi, dibangun tahun 1926 oleh arsitek Yazid Rajo Mangkuto. Jam ini hadiah dari Ratu Belanda untuk Rookmaaker (sekretaris kota). Mesin jamnya sangat langka — buatan Vortmann dari Jerman, setara Big Ben di London. Keunikannya: angka Romawi 4 ditulis IIII, bukan IV!",
    min: "Jam Gadang adolah ikon utamo Bukittinggi nan dibangun pado taun 1926 dek arsitek Yazid Rajo Mangkuto. Jam ko hadiah dari Ratu Belanda untuak Rookmaaker. Mesin jamnyo sangaik langka buatan Vortmann dari Jerman — setaro jo mesin Big Ben di London!",
  },
  {
    keywords: ['ngarai sianok', 'sianok canyon', 'sianok gorge', 'ngarai', 'canyon'],
    en: "Sianok Canyon is a stunning 100-meter deep gorge stretching 15 km, with the Batang Sianok river flowing at its base. It's a habitat for long-tailed macaques and exotic plants — a must-visit natural wonder of Bukittinggi.",
    id: "Ngarai Sianok adalah lembah curam dengan tebing batu setinggi 100 meter, membentang 15 km. Di dasarnya mengalir Batang Sianok. Pemandangannya sangat indah dan menjadi habitat kera ekor panjang serta tanaman eksotis.",
    min: "Ngarai Sianok adolah lembah curam jo tebing batu setinggi 100 meter nan membentang 15 km. Di dasarnyo mangalia Batang Sianok. Pemandangannyo sangaik rancak dan manjadi habitat karo ikua panjang jo tanaman eksotis.",
  },
  {
    keywords: ['lobang jepang', 'lubang jepang', 'japanese tunnel', 'tunnel jepang'],
    en: "The Japanese Tunnel is a 1.4 km underground military tunnel built by the Japanese army in 1942–1945 using forced laborers (romusha). It has dozens of rooms including ammo storage, prison cells, and escape routes leading to Sianok Canyon.",
    id: "Lobang Jepang adalah terowongan militer bawah tanah sepanjang 1,4 km yang dibangun tentara Jepang tahun 1942–1945 menggunakan romusha. Ada puluhan ruangan: ruang amunisi, penjara, dan pintu pelarian ke Ngarai Sianok.",
    min: "Lobang Jepang adolah terowongan pertahanan bawah tanah spanjang 1.4 km nan dibangun tentara Jepang taun 1942-1945. Punyo puluhan ruangan takah ruang amunisi, penjaro, jo pintu palarian ka Ngarai Sianok.",
  },
  {
    keywords: ['rendang', 'randang'],
    en: "Rendang is Minangkabau's most famous dish — voted the world's most delicious food by CNN. Beef is slow-cooked with coconut milk and rich spices for hours until the sauce caramelizes into a dark, intensely flavorful coating.",
    id: "Rendang Minangkabau adalah masakan terlezat di dunia versi CNN! Daging dimasak perlahan bersama santan dan bumbu rempah khas selama berjam-jam hingga kuahnya kering dan berwarna hitam kecokelatan.",
    min: "Randang Minangkabau marupokan masakan tarlazat di dunia versi CNN! Dibuek dari daging nan dimasak lambek jo santan sarato bumbu rempah salamo bajam-jam sampai kuahnyo kariang.",
  },
  {
    keywords: ['keripik sanjai', 'sanjai', 'keripik', 'chips'],
    en: "Sanjai Chips are crispy cassava chips from the Sanjai area of Bukittinggi — available in three flavors: plain, salty (yellow), and spicy-sweet (balado). The #1 must-buy souvenir from Bukittinggi!",
    id: "Keripik Sanjai adalah keripik singkong khas dari daerah Sanjai, Bukittinggi. Ada tiga rasa: tawar (original), asin (kuning), dan pedas manis (balado). Oleh-oleh wajib dari Bukittinggi!",
    min: "Karupuak Sanjai adolah keripik singkong khas dari daerah Sanjai, Bukittinggi. Ado tigo raso utamo: tawar (original), asin (kuniang), jo padeh manih (balado). Iko oleh-oleh wajib Bukittinggi!",
  },
  {
    keywords: ['nasi kapau', 'kapau'],
    en: "Nasi Kapau is a rice dish from Nagari Kapau near Bukittinggi, similar to Nasi Padang but served with distinctive long-handled ladles (tanduak). The signature is jackfruit curry with green beans, bamboo shoots, and the specialty gulai tambunsu (stuffed beef intestine with egg)!",
    id: "Nasi Kapau adalah nasi rames khas Nagari Kapau dekat Bukittinggi. Bedanya dari nasi padang: gulai nangkanya dicampur kacang panjang, kol, dan rebung, disajikan dengan sendok panjang (tanduak). Lauk andalannya gulai tambunsu!",
    min: "Nasi Kapau adolah nasi rames khas Nagari Kapau, dakek Bukittinggi. Bedanyo jo nasi padang biaso adolah gulai nangkonyo nan khas jo kacang panjang, kol, rebung, disajikan jo sendok panjang (tanduak).",
  },
  {
    keywords: ['itik lado mudo', 'itiak lado mudo', 'itik', 'itiak', 'bebek', 'duck'],
    en: "Itiak Lado Mudo (Green Chili Duck) from Koto Gadang is a must-try! Duck slow-cooked in a rich green chili sauce — savory, spicy, and the flavor penetrates to the bone.",
    id: "Itiak Lado Mudo Koto Gadang adalah olahan bebek dengan balutan lado mudo (cabai hijau keriting) khas Koto Gadang. Rasanya sangat gurih, pedas, dan meresap sampai ke tulang. Wajib coba!",
    min: "Itiak Lado Mudo Koto Gadang adolah olahan itiak jo balutan lado mudo khas Koto Gadang. Rasonyo sangaik gurih, padeh, dan marasok sampai ka tulang.",
  },
  {
    keywords: ['dadiah', 'yogurt kerbau', 'buffalo yogurt'],
    en: "Dadiah is traditional Minangkabau yogurt made from pure buffalo milk fermented inside bamboo for 1–2 days. Usually eaten with ampiang (rice crackers) and palm sugar syrup.",
    id: "Dadiah adalah yogurt tradisional Minangkabau dari susu kerbau murni yang difermentasi dalam bambu selama 1–2 hari. Biasanya dimakan dengan ampiang (emping beras) dan juruh gula merah.",
    min: "Dadiah adolah yogurt tradisional Minangkabau nan terbuat dari susu kabau murni nan difermentasi di dalam bambu salamo 1-2 hari. Biasonyo dimakan jo ampiang jo juruh gula merah.",
  },
  {
    keywords: ['rumah gadang', 'rumah adat', 'gonjong', 'traditional house'],
    en: "Rumah Gadang is the Minangkabau traditional house with a distinctive curved roof resembling buffalo horns (called Gonjong). Remarkably, it's built without metal nails — using wooden pegs only — making it flexible and earthquake-resistant.",
    id: "Rumah Gadang adalah rumah adat Minangkabau dengan atap melengkung menyerupai tanduk kerbau (disebut Gonjong). Dibangun tanpa paku besi, hanya menggunakan pasak kayu, sehingga lentur dan tahan gempa!",
    min: "Rumah Gadang adolah rumah adat Minangkabau nan atapnyo manyarupoi tanduak kabau (disabuik Gonjong). Dibangun tanpa paku basi, memakai pasak kayu sajo, sahinggo lentur dan tahan gampo!",
  },
  {
    keywords: ['matrilineal', 'garis ibu', 'sistem kekerabatan', 'kinship'],
    en: "Minangkabau society follows a matrilineal system — the world's largest matrilineal society — where family lineage and inherited ancestral property (pusako tinggi) pass through the mother's side.",
    id: "Masyarakat Minangkabau menganut sistem matrilineal — sistem matrilineal terbesar di dunia — di mana garis keturunan dan warisan harta pusako tinggi ditarik dari pihak ibu.",
    min: "Masyarakat Minangkabau manuruik sistem matrilineal — sistem matrilineal tarbesar di dunia — di mana garis keturunan dan pewarisan harta pusako tinggi ditarik dari pihak ibu.",
  },
  {
    keywords: ['tari piring', 'plate dance', 'tarian minang'],
    en: "Tari Piring (Plate Dance) is a traditional Minangkabau dance where performers carry plates on their palms and swing them dynamically. At the end, the dancers step on broken glass plates without getting hurt!",
    id: "Tari Piring adalah tari tradisional Minangkabau di mana penari membawa piring di telapak tangan dan mengayunkannya secara dinamis. Di akhir tari, penari menginjak pecahan piring kaca tanpa terluka!",
    min: "Tari Piring (Tari Piriang) adolah tari tradisonal Minangkabau katiko penari membawa piring di telapak tangan sarato diayunkan sacaro dinamis. Di akhia tari, penari ka mainjak pecahan piring kaco tanpa taluko!",
  },
  {
    keywords: ['fort de kock', 'benteng', 'fortress'],
    en: "Fort de Kock was built by Captain Bouwer in 1825 during the Padri War as a defense base for the Dutch East Indies army. Today the surrounding area is a beautiful city park, connected by the Limpapeh Bridge to the Zoo.",
    id: "Benteng Fort de Kock dibangun oleh Kapten Bouwer pada tahun 1825 saat Perang Padri sebagai pertahanan Hindia Belanda. Kini areanya menjadi taman kota yang indah, terhubung Jembatan Limpapeh ke Kebun Binatang.",
    min: "Benteng Fort de Kock dibangun dek Kapten Bouwer pado taun 1825 maso Perang Padri sabagai pertahanan Belanda. Kini aranyo lah manjadi taman kota nan rancak jo dihubungkan jo Jembatan Limpapeh ka Kebun Binatang.",
  },
  {
    keywords: ['perang padri', 'padri war', 'padri'],
    en: "The Padri War (1803–1838) was a conflict in West Sumatra that initially started between the Padri (Islamic scholars) and the Adat (traditional) groups, before ultimately uniting against Dutch colonizers. The main figure was Tuanku Imam Bonjol.",
    id: "Perang Padri (1803–1838) adalah konflik di Sumatra Barat yang bermula antara Kaum Padri (ulama) dan Kaum Adat, sebelum bersatu melawan Belanda. Tokoh utamanya adalah Tuanku Imam Bonjol.",
    min: "Perang Padri (1803-1838) adolah perang di Sumatra Barat nan awalnyo dimulai antaro Kaum Padri (ulama) jo Kaum Adat, sabalun akhianyo bagabuang malawan panjajah Belanda.",
  },
  {
    keywords: ['bung hatta', 'hatta', 'proklamator', 'vice president', 'wakil presiden'],
    en: "Bukittinggi is the birthplace of Dr. Mohammad Hatta (Bung Hatta), Proclamator and first Vice President of the Republic of Indonesia. You can visit his Birth House on Jalan Kampuang Dalam.",
    id: "Bukittinggi adalah tanah kelahiran Dr. Mohammad Hatta (Bung Hatta), Proklamator dan Wakil Presiden pertama RI. Kunjungi Rumah Kelahiran Bung Hatta di Jalan Kampuang Dalam.",
    min: "Bukittinggi marupokan tanah kalahiran Dr. Mohammad Hatta (Bung Hatta), Proklamator dan Wakil Presiden pertamo RI. Dunsanak bisa mangunjuangi Rumah Kalahiran Bung Hatta di Jalan Kampuang Dalam.",
  },
  {
    keywords: ['pdri', 'pemerintahan darurat', 'emergency government', 'ibu kota darurat'],
    en: "Bukittinggi served as the capital of the Emergency Government of the Republic of Indonesia (PDRI) from December 1948 to June 1949, under Mr. Syafruddin Prawiranegara, when Yogyakarta fell to the Dutch.",
    id: "Bukittinggi pernah menjadi Ibu Kota Negara Indonesia saat PDRI (Pemerintahan Darurat RI) dari Desember 1948 hingga Juni 1949 di bawah Mr. Syafruddin Prawiranegara, ketika Yogyakarta jatuh ke tangan Belanda.",
    min: "Bukittinggi pernah manjadi Ibu Kota Nagara Indonesia pado maso PDRI dari Desember 1948 hinggo Juni 1949 di bawah pimpinan Mr. Syafruddin Prawiranegara, katiko Yogyakarta jatuah ka tangan Belanda.",
  },
  {
    keywords: ['janjang koto gadang', 'janjang', 'great wall sumatra', 'koto gadang'],
    en: "Janjang Koto Gadang (Great Wall of Sumatra) is a long concrete stairway connecting Bukittinggi to Koto Gadang through the Sianok Canyon. The view from the suspension bridge at the top is absolutely breathtaking!",
    id: "Janjang Koto Gadang (Great Wall of Sumatra) adalah tangga beton panjang yang menghubungkan Bukittinggi ke Koto Gadang melewati celah Ngarai Sianok. Pemandangan dari atas jembatan gantungnya luar biasa indah!",
    min: "Janjang Koto Gadang (Great Wall of Sumatra) adolah tangga beton panjang nan manghubungkan Bukittinggi jo Koto Gadang malewati celah Ngarai Sianok. Pemandangan dari ateh jembatan gantuangnyo luar biaso rancak!",
  },
  {
    keywords: ['kebun binatang', 'kinantan', 'zoo', 'taman marga satwa', 'tmsbk'],
    en: "Taman Marga Satwa dan Budaya Kinantan (TMSBK) was established in 1900 by the Dutch — one of the oldest zoos in Indonesia. It contains the Baanjuang Traditional House and the Zoology Museum.",
    id: "Taman Marga Satwa dan Budaya Kinantan (TMSBK) didirikan tahun 1900 oleh Belanda — salah satu kebun binatang tertua di Indonesia. Di dalamnya ada Rumah Adat Baanjuang dan Museum Zoologi.",
    min: "Taman Marga Satwa dan Budaya Kinantan (TMSBK) dibangun pado taun 1900 dek Belanda. Iko salah satu kebun binatang tatuoan di Indonesia. Di dalamnyo terdapat Rumah Adat Baanjuang jo Museum Zoologi.",
  },
  {
    keywords: ['cuaca', 'suhu', 'weather', 'temperature', 'climate', 'dingin', 'cold', 'udara'],
    en: "Bukittinggi is famous for its cool, refreshing climate at over 900 meters above sea level, surrounded by Mount Marapi and Singgalang. Average temperatures range from 16°C to 24°C. It often gets foggy and rainy in the afternoons — bring a jacket!",
    id: "Bukittinggi dikenal dengan udaranya yang sejuk dan dingin karena berada di ketinggian >900 mdpl, dikelilingi Gunung Marapi dan Singgalang. Suhu rata-rata 16°C–24°C. Sering berkabut dan hujan di sore hari, siapkan jaket!",
    min: "Bukittinggi dikenal jo udaranyo nan sejuk dan cenderuang dingin karano barado di katinggian >900 mdpl dikelilingi Gunuang Marapi jo Singgalang. Suhu rato-rato 16°C–24°C, dan sering turun kabut jo hujan di sore hari. Siapkan jaket!",
  },
  {
    keywords: ['adat basandi', 'adat basandi syarak', 'filosofi', 'falsafah minang', 'philosophy'],
    en: "The Minangkabau life philosophy is 'Adat Basandi Syarak, Syarak Basandi Kitabullah' — meaning Minang customs are based on Islamic law, and Islamic law is based on the Quran. It reflects the harmony of tradition and religion.",
    id: "Filosofi hidup orang Minang adalah 'Adat Basandi Syarak, Syarak Basandi Kitabullah' — artinya adat Minangkabau sejalan dan didasarkan pada ajaran Islam yang bersumber dari Al-Qur'an.",
    min: "Filsafat hidup urang Minang adolah 'Adat Basandi Syarak, Syarak Basandi Kitabullah' — artinyo adat Minangkabau sejalan jo didasarkan pado ajaran Islam nan basumber dari Al-Qur'an.",
  },
  {
    keywords: ['pantun', 'puisi', 'poem', 'pantuang'],
    en: 'A little pantun for you:\n\n"Limpapeh rumah nan gadang,\nMinangkabau elok budi jo bahaso.\nWelcome to beautiful Bukittinggi,\nA heritage city that captures your heart." 🌾',
    id: 'Sedikit pantun untuk Anda:\n\n"Limpapeh rumah nan gadang,\nMinangkabau elok budi jo bahaso.\nSelamat datang di Bukittinggi yang indah,\nKota warisan yang memikat hati." 🌾',
    min: 'Badendang kito saketek dunsanak:\n\n"Limpapeh rumah nan gadang,\nMinangkabau elok budi jo bahaso.\nSelamat datang di Bukittinggi nan gadang,\nKota wisata elok nan mambuek suko." 🌾',
  },
  {
    keywords: ['wisata', 'destinasi', 'tourism', 'attraction', 'visit', 'travel', 'berkunjung', 'tempat wisata'],
    en: "Top Bukittinggi attractions: Jam Gadang (iconic clock tower), Sianok Canyon, Japanese Tunnel, Koto Gadang Stairway (Great Wall of Sumatra), Kinantan Zoo, Fort de Kock, and Limpapeh Bridge. Which one would you like to know more about?",
    id: "Destinasi unggulan Bukittinggi: Jam Gadang, Ngarai Sianok, Lobang Jepang, Janjang Koto Gadang (Great Wall), Taman Kinantan, Benteng Fort de Kock, dan Jembatan Limpapeh. Mana yang ingin Anda ketahui lebih lanjut?",
    min: "Destinasi unggulan Bukittinggi: Jam Gadang, Ngarai Sianok, Lobang Jepang, Janjang Koto Gadang, Taman Kinantan, Benteng Fort de Kock, jo Jembatan Limpapeh. Nan mano nan nio Dunsanak tanyokan labiah lanjut?",
  },
  {
    keywords: ['kuliner', 'makanan', 'food', 'eat', 'makan', 'menu', 'masakan', 'cuisine'],
    en: "Must-try Bukittinggi cuisine: Nasi Kapau at Pasar Ateh, Itiak Lado Mudo (green chili duck) from Koto Gadang, Sanjai Balado chips, Ampiang Dadiah (buffalo yogurt), and Kawa Daun coffee. Which dish would you like to know more about?",
    id: "Kuliner wajib dicoba di Bukittinggi: Nasi Kapau di Pasar Ateh, Itiak Lado Mudo Koto Gadang, Keripik Sanjai Balado, Ampiang Dadiah, dan Kopi Kawa Daun. Hidangan mana yang ingin Anda ketahui lebih lanjut?",
    min: "Kuliner khas Bukittinggi nan wajib dicubo: Nasi Kapau di Pasa Ateh, Itiak Lado Mudo Koto Gadang, Karupuak Sanjai Balado, Ampiang Dadiah, jo Kopi Kawa Daun. Nan mano nan nio Dunsanak tanyokan?",
  },
  {
    keywords: ['budaya', 'culture', 'adat', 'tradisi', 'tradition', 'minangkabau', 'minang'],
    en: "Minangkabau culture is unique with its matrilineal kinship system (world's largest), iconic Rumah Gadang with curved Gonjong roofs, the philosophy 'Adat Basandi Syarak', and arts like Tari Piring (Plate Dance) and Silek (Minang martial arts).",
    id: "Kebudayaan Minangkabau unik dengan sistem kekerabatan Matrilineal (terbesar di dunia), Rumah Gadang beratap Gonjong, filosofi 'Adat Basandi Syarak, Syarak Basandi Kitabullah', serta kesenian Tari Piring dan Silek (Silat Minang).",
    min: "Kebudayaan Minangkabau sangaik unik jo sistem Matrilineal (tarbesar di dunia), arsitektur Rumah Gadang beratap Gonjong, falsafah 'Adat Basandi Syarak', sarato kesenian Tari Piring jo Silek.",
  },
  {
    keywords: ['sejarah', 'history', 'historical', 'asal usul', 'origin'],
    en: "Bukittinggi has a rich history: originally a traditional Agam market, it became a Dutch colonial stronghold (Fort de Kock, 1825), birthplace of Proclamator Bung Hatta, and the capital of the Emergency Government of Indonesia (PDRI) in 1948–1949.",
    id: "Bukittinggi punya sejarah panjang: awalnya pasar tradisional Agam, menjadi benteng kolonial Belanda (Fort de Kock, 1825), tanah kelahiran Bung Hatta, dan pernah menjadi ibu kota Pemerintahan Darurat RI (PDRI) tahun 1948–1949.",
    min: "Bukittinggi punyo sajarah nan panjang: awalnyo pasa tradisional Agam, manjadi benteng kolonial Belanda (Fort de Kock, 1825), tanah kalahiran Bung Hatta, jo pernah manjadi ibu kota PDRI taun 1948–1949.",
  },
  {
    keywords: ['siapa kamu', 'who are you', 'nama kamu', 'rancakbot', 'your name', 'siapo kau', 'what are you'],
    en: "I'm Ambo RancakBot, your AI guide to Bukittinggi! I can help with history, tourist attractions, local food, culture, and more. Ask me anything about Bukittinggi!",
    id: "Ambo adalah RancakBot, asisten AI yang dirancang untuk mengenalkan wisata, budaya, kuliner, dan sejarah Kota Bukittinggi. Tanyakan apa saja, inshaAllah ambo jawab!",
    min: "Ambo adolah RancakBot, asisten AI pintar nan didesain khusus untuak mengenalkan pariwisata, budaya, kuliner, dan sajarah Kota Bukittinggi. Tanyolah apo se ka ambo!",
  },
  {
    keywords: ['halo', 'hai', 'hello', 'hi', 'hey', 'assalamualaikum', 'selamat', 'good morning', 'good afternoon', 'good evening', 'apo kaba', 'apa kabar'],
    en: "Hello! Welcome to Ambo RancakBot — your guide to Bukittinggi. Ask me about history, food, attractions, or culture. How can I help you today?",
    id: "Halo! Selamat datang di Ambo RancakBot — pemandu wisata Bukittinggi Anda. Tanya apapun tentang sejarah, kuliner, wisata, atau budaya Bukittinggi!",
    min: "Assalamualaikum, Dunsanak! Apo kaba? Ambo RancakBot siap mambantu informasi tentang Bukittinggi jo budayo Minangkabau. Ado nan bisa ambo bantu?",
  },
  {
    keywords: ['terima kasih', 'thank you', 'thanks', 'terimakasih', 'makasih', 'syukran', 'tarimo kasih'],
    en: "You're welcome! Happy to help. Feel free to ask anything else about Bukittinggi!",
    id: "Sama-sama! Senang bisa membantu. Ada hal lain yang ingin ditanyakan tentang Bukittinggi?",
    min: "Samo-samo Dunsanak! Sanang bana ambo bisa mambantu. Ado hal lain nan nio Dunsanak tanyokan?",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN RESPONSE GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

function generateAiResponse(userText: string, lang: Lang): string {
  const q = userText.toLowerCase();

  // Find matching topic — return the MOST SPECIFIC match (most keyword hits)
  let bestMatch: Topic | null = null;
  let bestScore = 0;

  for (const topic of TOPICS) {
    const score = topic.keywords.filter(kw => q.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = topic;
    }
  }

  if (bestMatch && bestScore > 0) {
    return bestMatch[lang];
  }

  // If no match found — return a clear "I don't understand" message
  const FALLBACK: Record<Lang, string> = {
    en: `I'm sorry, I didn't quite understand your question about "${userText}". Could you rephrase it or ask about one of these topics? 📍 **History** (Jam Gadang, Fort de Kock, PDRI) | 🍜 **Food** (Rendang, Nasi Kapau, Sanjai) | 🏞️ **Attractions** (Sianok Canyon, Japanese Tunnel) | 🏛️ **Culture** (Rumah Gadang, Tari Piring)`,
    id: `Maaf, ambo kurang memahami pertanyaan tentang "${userText}". Bisa diperjelas? Atau tanyakan salah satu topik berikut: 📍 **Sejarah** (Jam Gadang, Fort de Kock, PDRI) | 🍜 **Kuliner** (Rendang, Nasi Kapau, Sanjai) | 🏞️ **Wisata** (Ngarai Sianok, Lobang Jepang) | 🏛️ **Budaya** (Rumah Gadang, Tari Piring)`,
    min: `Maaf Dunsanak, ambo kurang paham pertanyaan tentang "${userText}". Bisa diperjelas? Atau tanyo salah satu topik: 📍 **Sajarah** | 🍜 **Kuliner** | 🏞️ **Wisata** | 🏛️ **Budayo**`,
  };
  return FALLBACK[lang];
}


// ─── 3D Character with tilt + drag + hi ─────────────────────────────────────
function TiltableCharacter({
  onClick,
  bubbleText,
  pos,
  setPos,
  showBubble = true,
  isFixed = true,
  isOpen = false,
}: {
  onClick: () => void;
  bubbleText: string;
  pos: { bottom: number; right: number };
  setPos: React.Dispatch<React.SetStateAction<{ bottom: number; right: number }>>;
  showBubble?: boolean;
  isFixed?: boolean;
  isOpen?: boolean;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isTilting, setIsTilting] = useState(false);
  const [showHi, setShowHi] = useState(false);
  const dragging = useRef(false);
  const dragStart = useRef({ mx: 0, my: 0, bottom: 0, right: 0 });
  const hiTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasDragged = useRef(false);

  const clickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyTilt = (clientX: number, clientY: number) => {
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = clientX - cx;
    const dy = clientY - cy;

    // Calculate angle in degrees for 360-degree Y rotation
    const angleRad = Math.atan2(dx, -dy);
    const angleDeg = angleRad * (180 / Math.PI);

    // Calculate X tilt (limited lookup/lookdown tilt)
    const ny = dy / (window.innerHeight / 2);
    const tiltX = Math.max(-25, Math.min(25, -ny * 25));

    setTilt({
      x: tiltX,
      y: angleDeg,
    });
    setIsTilting(true);
  };

  const resetTilt = () => {
    setTilt({ x: 0, y: 0 });
    setIsTilting(false);
  };

  // Mouse events
  const onMouseMove = (e: React.MouseEvent) => {
    if (dragging.current) return;
    applyTilt(e.clientX, e.clientY);
  };
  const onMouseLeave = () => { if (!dragging.current) resetTilt(); };

  // Touch events for tilt (single finger)
  const onTouchMove = (e: React.TouchEvent) => {
    if (dragging.current) return;
    const t = e.touches[0];
    if (t) applyTilt(t.clientX, t.clientY);
  };
  const onTouchEnd = () => { if (!dragging.current) resetTilt(); };

  const handleDoubleClickAction = () => {
    setShowHi(false);
    requestAnimationFrame(() => {
      setShowHi(true);
      if (hiTimer.current) clearTimeout(hiTimer.current);
      hiTimer.current = setTimeout(() => setShowHi(false), 2500);
    });
  };

  const handleSingleClickAction = () => {
    onClick();
  };

  // Click → single/double click handler
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasDragged.current) {
      return;
    }
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      handleDoubleClickAction();
    } else {
      clickTimeout.current = setTimeout(() => {
        clickTimeout.current = null;
        handleSingleClickAction();
      }, 220);
    }
  };

  const startDrag = (clientX: number, clientY: number) => {
    dragging.current = true;
    dragStart.current = {
      mx: clientX,
      my: clientY,
      bottom: pos.bottom,
      right: pos.right,
    };
  };

  useEffect(() => {
    let moved = false;
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      moved = true;
      const dx = e.clientX - dragStart.current.mx;
      const dy = e.clientY - dragStart.current.my;

      const isDesktop = window.innerWidth >= 768;
      const maxRight = isDesktop
        ? (isOpen ? window.innerWidth - 490 : window.innerWidth - 120)
        : (isOpen ? window.innerWidth - 90 : window.innerWidth - 90);
      const maxBottom = isDesktop
        ? (isOpen ? window.innerHeight - 520 : window.innerHeight - 130)
        : (isOpen ? window.innerHeight - 520 : window.innerHeight - 100);

      setPos({
        right: Math.max(0, Math.min(maxRight, dragStart.current.right - dx)),
        bottom: Math.max(0, Math.min(maxBottom, dragStart.current.bottom - dy)),
      });
    };
    const onMouseUp = () => {
      if (moved) {
        hasDragged.current = true;
        setTimeout(() => {
          hasDragged.current = false;
        }, 50);
      }
      dragging.current = false;
      moved = false;
      resetTilt();
    };
    const onTouchMoveDoc = (e: TouchEvent) => {
      if (!dragging.current) return;
      const t = e.touches[0];
      if (!t) return;
      moved = true;
      const dx = t.clientX - dragStart.current.mx;
      const dy = t.clientY - dragStart.current.my;

      const isDesktop = window.innerWidth >= 768;
      const maxRight = isDesktop
        ? (isOpen ? window.innerWidth - 490 : window.innerWidth - 120)
        : (isOpen ? window.innerWidth - 90 : window.innerWidth - 90);
      const maxBottom = isDesktop
        ? (isOpen ? window.innerHeight - 520 : window.innerHeight - 130)
        : (isOpen ? window.innerHeight - 520 : window.innerHeight - 100);

      setPos({
        right: Math.max(0, Math.min(maxRight, dragStart.current.right - dx)),
        bottom: Math.max(0, Math.min(maxBottom, dragStart.current.bottom - dy)),
      });
    };
    const onTouchEndDoc = () => {
      if (moved) {
        hasDragged.current = true;
        setTimeout(() => {
          hasDragged.current = false;
        }, 50);
      }
      dragging.current = false;
      moved = false;
      resetTilt();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMoveDoc, { passive: true });
    window.addEventListener('touchend', onTouchEndDoc);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMoveDoc);
      window.removeEventListener('touchend', onTouchEndDoc);
    };
  }, [isOpen, setPos]);

  const tiltStyle: React.CSSProperties = {
    perspective: '400px',
    perspectiveOrigin: '50% 50%',
    width: '100%',
    height: '100%',
  };

  const innerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
    transition: isTilting ? 'transform 80ms linear' : 'transform 600ms cubic-bezier(0.16,1,0.3,1)',
    transformStyle: 'preserve-3d',
    willChange: 'transform',
  };

  return (
    <div
      style={{
        position: isFixed ? 'fixed' : undefined,
        zIndex: 50,
        bottom: isFixed ? `${pos.bottom}px` : undefined,
        right: isFixed ? `${pos.right}px` : undefined,
        cursor: dragging.current ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
      }}
      ref={wrapperRef}
      className={isFixed
        ? "w-[80px] h-[90px] md:w-[115px] md:h-[125px]"
        : "w-full h-full"
      }
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX, e.clientY); }}
      onTouchStart={(e) => {
        const t = e.touches[0];
        if (t) startDrag(t.clientX, t.clientY);
      }}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={handleClick}
    >
      {/* Tanya Ambo Rancak Bot Bubble — moves with character, positioned beside/above head on desktop */}
      {showBubble && bubbleText && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          className="hidden md:flex absolute items-center gap-3 px-5 py-3.5 bg-[#4A0808] border-[1.5px] border-[#F9CE65] shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] cursor-pointer"
          style={{
            right: 'calc(100% + 14px)',
            bottom: '35%',
            borderRadius: '24px 24px 0px 24px',
            whiteSpace: 'nowrap',
            zIndex: 49,
          }}
        >
          <div className="relative flex-shrink-0 w-[11px] h-[11px] rounded-full bg-[#00B242]">
            <div className="absolute inset-0 rounded-full bg-[#00B242] animate-ping opacity-70" />
          </div>
          <span className="font-poppins text-white text-[13px] font-semibold tracking-wide leading-none">{bubbleText}</span>
        </div>
      )}

      {/* Hi bubble */}
      {showHi && (
        <div
          className="rancakbot-hi absolute z-[60] pointer-events-none"
          style={{
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#4A0808',
            border: '1.5px solid #F9CE65',
            borderRadius: '14px 14px 14px 2px',
            padding: '6px 14px',
            whiteSpace: 'nowrap',
            color: '#F9CE65',
            fontSize: '14px',
            fontWeight: 700,
            fontFamily: 'Poppins, sans-serif',
            boxShadow: '0 4px 18px rgba(0,0,0,0.35)',
          }}
        >
          Hai! 👋
        </div>
      )}

      {/* Perspective tilt wrapper */}
      <div style={tiltStyle}>
        <div style={innerStyle}>
          <div
            className={`w-full h-full ${!isTilting ? 'rancakbot-float' : 'rancakbot-tilting'}`}
          >
            <model-viewer
              src="/textured.glb" alt="RancakBot 3D Avatar"
              auto-rotate camera-controls={false} disable-zoom
              shadow-intensity="0.8" environment-image="neutral"
              auto-rotate-delay="0" interaction-prompt="none"
              loading="lazy" reveal="auto"
              style={{ width: '100%', height: '100%', background: 'transparent', outline: 'none' }}
            >
              <div slot="poster" className="absolute inset-0 flex items-center justify-center bg-transparent">
                <img src={chtPng} className="w-[28px] h-[28px] animate-pulse opacity-50 brightness-0 invert" alt="Loading" />
              </div>
            </model-viewer>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RancakBotWidget() {
  const [pos, setPos] = useState<{ bottom: number; right: number }>({ bottom: 20, right: 12 });
  const [wantsOpen, setWantsOpen] = useState(false);
  const [mounted, setMounted]     = useState(false);
  const [visible, setVisible]     = useState(false);
  const [messages, setMessages]   = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping]   = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setLanguage } = useMode();
  const { t } = useTranslation();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (document.getElementById('rancakbot-style')) return;
    const el = document.createElement('style');
    el.id = 'rancakbot-style';
    el.textContent = FLOAT_STYLE;
    document.head.appendChild(el);
  }, []);

  const openModal = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setWantsOpen(true);
    setMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  const closeModal = useCallback(() => {
    setWantsOpen(false);
    setVisible(false);
    closeTimerRef.current = setTimeout(() => setMounted(false), 380);
  }, []);

  const handleSend = useCallback((text: string) => {
    if (!text.trim()) return;
    const userMessage: ChatMessage = { sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Site-language switch commands stay local — they control the app UI,
    // not something the AI model should be asked about.
    const translateCmd = detectTranslateCommand(text.toLowerCase());
    if (translateCmd) {
      setTimeout(() => {
        if (translateCmd === 'en') {
          setLanguage('en');
          setMessages(prev => [...prev, { sender: 'bot', text: "✅ Done! The website has been switched to **English**. All pages are now in English. Say 'switch to Indonesian' to switch back anytime!" }]);
        } else if (translateCmd === 'id') {
          setLanguage('id');
          setMessages(prev => [...prev, { sender: 'bot', text: "✅ Selesai! Website telah dikembalikan ke **Bahasa Indonesia**. Semua halaman sekarang dalam Bahasa Indonesia." }]);
        } else {
          setMessages(prev => [...prev, { sender: 'bot', text: "Maaf Dunsanak, untuak saat ko ambo hanya mendukung Bahasa Indonesia dan Bahasa Inggris sebagai bahasa antarmuka. Namun ambo bisa menjawab dalam Bahasa Minang!" }]);
        }
        setIsTyping(false);
      }, 900);
      return;
    }

    const lang = detectInputLang(text);

    // Ask the real Groq-hosted model for a reply, falling back to the local
    // keyword-based knowledge base if the request fails (no API key, offline,
    // rate-limited, etc.) so the widget still works either way.
    void (async () => {
      const minDelay = new Promise(resolve => setTimeout(resolve, 600));
      try {
        const history: AiChatMessage[] = [...messages, userMessage]
          .slice(-12)
          .map(m => ({ role: m.sender === 'user' ? 'user' as const : 'assistant' as const, content: m.text }));

        const [reply] = await Promise.all([askAi(history, lang), minDelay]);
        setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      } catch (err) {
        console.error('RancakBot: AI request failed, using local knowledge base instead.', err);
        await minDelay;
        setMessages(prev => [...prev, { sender: 'bot', text: generateAiResponse(text, lang) }]);
      } finally {
        setIsTyping(false);
      }
    })();
  }, [setLanguage, messages]);

  const QUICK = [
    { q: t('bot_quick1') },
    { q: t('bot_quick2') },
    { q: t('bot_quick3') },
    { q: t('bot_quick4') },
  ];

  return (
    <>
      {/* ── CLOSED STATE ── */}
      {!wantsOpen && (
        <TiltableCharacter
          onClick={openModal}
          bubbleText={t('bot_bubble')}
          pos={pos}
          setPos={setPos}
          showBubble={true}
          isFixed={true}
          isOpen={false}
        />
      )}

      {/* ── OPEN STATE ── */}
      {mounted && (
        <div
          className="fixed z-50 flex flex-row items-end select-none pointer-events-none max-w-[calc(100vw-24px)]"
          style={{
            gap: '12px',
            bottom: `${pos.bottom}px`,
            right: `${pos.right}px`,
          }}
        >
          <div
            className="pointer-events-auto flex flex-col rounded-[24px] overflow-hidden border-[1.5px] border-[#F9CE65] shadow-[0_24px_55px_rgba(0,0,0,0.55)] w-[calc(100vw-24px)] sm:w-[360px] h-[70vh] max-h-[510px] sm:h-[510px]"
            style={{
              background: '#3E0F0F',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0px) scale(1)' : 'translateY(24px) scale(0.96)',
              transition: visible
                ? 'opacity 350ms cubic-bezier(0.16,1,0.3,1), transform 350ms cubic-bezier(0.16,1,0.3,1)'
                : 'opacity 300ms ease-in, transform 300ms ease-in',
              transformOrigin: 'bottom right',
            }}
          >
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between bg-[#350A0A] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center rounded-full w-[44px] h-[44px] border border-[#F9CE65] flex-shrink-0" style={{ background: 'rgba(249,206,101,0.06)' }}>
                  <img src={chtPng} alt="Chat" className="w-[20px] h-[20px] object-contain" style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(4) hue-rotate(10deg)' }} />
                  <div className="absolute bottom-[1px] right-[1px] w-[10px] h-[10px] rounded-full border-[1.5px] border-[#350A0A] bg-[#00B242]">
                    <div className="absolute inset-0 rounded-full bg-[#00B242] animate-ping opacity-75" />
                  </div>
                </div>
                <div>
                  <h5 className="font-cormorant font-bold text-[#F9CE65] text-[17px] leading-none tracking-wide">Ambo RancakBot</h5>
                  <span className="text-[9px] font-poppins text-white/60 tracking-[0.12em] uppercase mt-1 block">{t('bot_subtitle')}</span>
                </div>
              </div>
              <button onClick={closeModal} className="text-white/60 hover:text-white transition-colors cursor-pointer text-[16px] focus:outline-none flex-shrink-0" aria-label={t('bot_close')}>✕</button>
            </div>

            <div className="h-[1px] bg-[#F9CE65]/25 flex-shrink-0" />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#380C0C]">
              <div className="max-w-[92%] px-5 py-4 text-[13px] font-poppins leading-relaxed text-white/90 bg-[#4A0E0E] border border-[#F9CE65]/20" style={{ borderRadius: '18px 18px 18px 0px' }}>
                {t('bot_welcome')}
              </div>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[82%] px-4 py-2.5 text-[13px] leading-relaxed font-poppins ${msg.sender === 'user' ? 'bg-[#F9CE65] text-[#2A0606] font-medium' : 'bg-[#4A0E0E] text-white/90 border border-[#F9CE65]/15'}`}
                    style={{ borderRadius: msg.sender === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0' }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-1.5 bg-[#4A0E0E] border border-[#F9CE65]/15 px-4 py-3 w-[58px] justify-center" style={{ borderRadius: '16px 16px 16px 0px' }}>
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="h-[1px] bg-[#F9CE65]/20 flex-shrink-0" />

            {/* Quick suggestions */}
            <div className="px-4 py-2 bg-[#320808] flex flex-wrap gap-1.5 flex-shrink-0">
              {QUICK.map((qa, idx) => (
                <button key={idx} onClick={() => handleSend(qa.q)}
                  className="text-[10px] font-poppins bg-[#4A0E0E]/40 hover:bg-[#4A0E0E] text-[#FFEAA7]/80 hover:text-[#FFEAA7] border border-[#F9CE65]/15 rounded-full px-2.5 py-1 cursor-pointer transition-all duration-150 focus:outline-none">
                  {qa.q}
                </button>
              ))}
            </div>

            <div className="h-[1px] bg-[#F9CE65]/20 flex-shrink-0" />

            {/* Input */}
            <div className="p-4 bg-[#350A0A] flex-shrink-0">
              <form onSubmit={e => { e.preventDefault(); handleSend(inputText); }}
                className="flex items-center gap-3 border-[1.5px] border-[#F9CE65] rounded-[16px] px-4 py-2.5 bg-[#3E0F0F] pr-14 sm:pr-4">
                <input type="text" value={inputText} onChange={e => setInputText(e.target.value)}
                  placeholder={t('bot_placeholder')}
                  className="flex-1 bg-transparent border-none text-[13px] text-white placeholder-white/40 focus:outline-none font-poppins" />
                <button type="submit"
                  className="flex-shrink-0 flex items-center justify-center bg-[#F9CE65] hover:bg-[#FFEAA7] rounded-[10px] w-[36px] h-[30px] transition-colors cursor-pointer focus:outline-none"
                  aria-label={t('bot_send')}>
                  <img src={enterPng} alt="Send" className="w-[14px] h-[14px] object-contain" />
                </button>
              </form>
            </div>
          </div>

          {/* 3D Character */}
          <div
            className="pointer-events-auto cursor-pointer flex-shrink-0 absolute sm:relative bottom-0 right-0 sm:bottom-auto sm:right-auto z-50 w-[75px] h-[85px] sm:w-[115px] sm:h-[125px]"
            style={{ margin: '0' }}
          >
            <TiltableCharacter
              onClick={closeModal}
              bubbleText=""
              pos={pos}
              setPos={setPos}
              showBubble={false}
              isFixed={false}
              isOpen={true}
            />
          </div>
        </div>
      )}
    </>
  );
}
