import { useMode } from '../context/ModeContext';

// ── Full bilingual string dictionary ─────────────────────────────────────────

const translations = {
  id: {
    // Navigation
    nav_home: 'Beranda',
    nav_history: 'Sejarah',
    nav_culture: 'Budaya',
    nav_culinary: 'Kuliner',
    nav_tourism: 'Pariwisata',
    nav_map: 'Peta',
    nav_close: 'TUTUP',
    nav_back_home: 'Kembali ke Halaman Utama',
    nav_history_sub: 'Menelusuri Linimasa Sejarah',
    nav_culture_sub: 'Warisan Budaya Minangkabau',

    // Hero
    hero_scroll: 'Scroll',
    hero_tagline: 'Jelajahi Warisan Budaya Minangkabau',

    // Editorial / Intro
    editorial_title: 'Kota Wisata di Atas Awan',
    editorial_desc: 'Bukittinggi, permata Sumatra Barat yang berdiri megah di ketinggian 930 meter dpl — kota bersejarah dengan budaya Minangkabau yang kaya, kuliner legendaris, dan panorama alam yang memukau.',
    editorial_btn: 'Jelajahi Sekarang',

    // Heritage Section
    heritage_title: 'Jelajahi Warisan Bukittinggi',
    heritage_subtitle: 'Temukan keindahan budaya, sejarah, dan alam kota Bukittinggi yang tak ternilai',
    heritage_culture: 'Budaya',
    heritage_history: 'Sejarah',
    heritage_nature: 'Alam',
    heritage_culinary: 'Kuliner',
    heritage_explore: 'Jelajahi',

    // History Page
    history_title: 'Sejarah Bukittinggi',
    history_subtitle: 'Perjalanan panjang kota bersejarah di jantung Minangkabau',

    // Budaya Page
    culture_title: 'Budaya Minangkabau',
    culture_subtitle: 'Warisan adat dan budaya yang hidup turun-temurun',

    // Footer / copyright
    footer_copy: 'Bukittinggi Heritage',

    // RancakBot
    bot_bubble: 'Tanya Ambo RancakBot',
    bot_placeholder: 'Apa yang ingin anda ketahui...',
    bot_subtitle: 'ASISTEN ONLINE 24/7 BERBASIS AI',
    bot_close: 'Tutup',
    bot_send: 'Kirim',
    bot_welcome: 'Apo Kaba, Dunsanak! Ambo RancakBot siap membantu informasi wisata, budaya, sejarah, dan kuliner Bukittinggi. Ketik "ubah ke bahasa inggris" untuk mengubah seluruh bahasa website!',
    bot_quick1: 'Sejarah Jam Gadang?',
    bot_quick2: 'Kuliner wajib Bukittinggi?',
    bot_quick3: 'Rekomendasi wisata alam?',
    bot_quick4: 'Budaya Minangkabau?',
  },
  en: {
    // Navigation
    nav_home: 'Home',
    nav_history: 'History',
    nav_culture: 'Culture',
    nav_culinary: 'Culinary',
    nav_tourism: 'Tourism',
    nav_map: 'Map',
    nav_close: 'CLOSE',
    nav_back_home: 'Back to Home',
    nav_history_sub: 'Explore the Historical Timeline',
    nav_culture_sub: 'Minangkabau Cultural Heritage',

    // Hero
    hero_scroll: 'Scroll',
    hero_tagline: 'Explore the Heritage of Minangkabau',

    // Editorial / Intro
    editorial_title: 'A City Above the Clouds',
    editorial_desc: 'Bukittinggi, the gem of West Sumatra standing majestically at 930 meters above sea level — a historic city with rich Minangkabau culture, legendary cuisine, and breathtaking natural panoramas.',
    editorial_btn: 'Explore Now',

    // Heritage Section
    heritage_title: 'Explore Bukittinggi\'s Heritage',
    heritage_subtitle: 'Discover the priceless beauty of culture, history, and nature in Bukittinggi',
    heritage_culture: 'Culture',
    heritage_history: 'History',
    heritage_nature: 'Nature',
    heritage_culinary: 'Culinary',
    heritage_explore: 'Explore',

    // History Page
    history_title: 'History of Bukittinggi',
    history_subtitle: 'A long journey of a historic city at the heart of Minangkabau',

    // Budaya Page
    culture_title: 'Minangkabau Culture',
    culture_subtitle: 'Cultural heritage and traditions passed down through generations',

    // Footer / copyright
    footer_copy: 'Bukittinggi Heritage',

    // RancakBot
    bot_bubble: 'Ask Ambo RancakBot',
    bot_placeholder: 'What would you like to know...',
    bot_subtitle: 'AI ONLINE ASSISTANT 24/7',
    bot_close: 'Close',
    bot_send: 'Send',
    bot_welcome: "Hello! I'm Ambo RancakBot, your AI guide to Bukittinggi. Ask me about history, culture, food, or attractions. Say 'switch to Indonesian' to switch back anytime!",
    bot_quick1: 'History of Jam Gadang?',
    bot_quick2: 'Must-try local food?',
    bot_quick3: 'Best tourist attractions?',
    bot_quick4: 'Minangkabau culture?',
  },
} as const;

export type TranslationKey = keyof typeof translations.id;

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useTranslation() {
  const { language } = useMode();
  const t = (key: TranslationKey): string => translations[language][key] ?? translations.id[key];
  return { t, language };
}
