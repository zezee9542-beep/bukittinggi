/**
 * LandingTestPage.tsx
 * Halaman landing eksperimen di rute /landing.
 * Dibangun berdasarkan inspeksi Figma node #1347-1609 ("Landing Page").
 *
 * Seksi (urutan atas ke bawah sesuai Figma):
 *   1. NavbarSection        - navigasi tetap di puncak
 *   2. HeroSection          - gambar penuh + judul besar + strip galeri
 *   3. CategoryCardsSection - 4 kartu kategori wisata
 *   4. HeartSection         - "The Heart of Minangkabau" (gradien maroon)
 *   5. FeaturesSection      - bento grid fitur utama
 *   6. ParijsSection        - kutipan "Parijs Van Sumatra"
 *   7. AITeaserSection      - teaser AI Travel Planner
 *   8. RancakBotSection     - teaser RancakBot
 *   9. FooterSection        - kaki halaman
 *
 * Palet warna Figma: #6E1F1F (Red/Normal), #531717 (Red/Dark), #F9CE65/#FDD170 (Yellow)
 */

import { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

/* ── Import aset lokal ────────────────────────────────────────── */
import bgHero     from '../assets/bgg.webp';
import imgSejarah from '../assets/01.webp';
import imgBudaya  from '../assets/02.webp';
import imgKuliner from '../assets/03.webp';
import imgPeta    from '../assets/04.webp';
import imgParijs  from '../assets/son.webp';
import imgProfile from '../assets/menara.webp';
import imgStrip1  from '../assets/sawah.webp';
import imgStrip2  from '../assets/imgg.webp';
import imgStrip3  from '../assets/jek.webp';
import imgStrip4  from '../assets/rumah.webp';
import imgStrip5  from '../assets/gunung.webp';
import imgStrip6  from '../assets/bg2.webp';

/* ── Ikon SVG sebaris ─────────────────────────────────────────── */

const IconArrowUpRight = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M17 7H7M17 7V17" />
  </svg>
);

const IconArrowRight = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const IconStar = ({ size = 20, color = '#F9CE65' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const IconCheck = ({ size = 12, color = '#775800' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconChat = ({ size = 22, color = '#531717' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    <path d="M9 10h.01M12 10h.01M15 10h.01"/>
  </svg>
);

/* Hook: useScrollReveal — animasi fade-up via IntersectionObserver */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 650ms cubic-bezier(0.16,1,0.3,1), transform 650ms cubic-bezier(0.16,1,0.3,1)';
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        observer.unobserve(el);
      }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* 1. NavbarSection — navbar putih tetap di puncak, frame #1347:1750 */
const NavbarSection = () => {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white"
      style={{ boxShadow: '0px 0px 40px 0px rgba(0,0,0,0.25)' }}>
      <div className="max-w-[1512px] mx-auto px-8 h-[72px] md:h-[90px] flex items-center justify-between">
        <button className="font-corinthia text-3xl font-bold text-[#6E1F1F] leading-none cursor-pointer bg-transparent border-none"
          onClick={() => navigate('/')} aria-label="Kembali ke beranda">
          Bukittinggi
        </button>
        <nav className="hidden md:flex items-center gap-8" aria-label="Navigasi utama">
          <div className="flex flex-col items-center gap-0.5">
            <Link to="/" className="text-[#6E1F1F] font-poppins font-semibold text-base leading-none">Beranda</Link>
            <div className="h-px w-full bg-[#6E1F1F]" />
          </div>
          <Link to="/sejarah" className="text-[#444651]/80 font-poppins text-base hover:text-[#6E1F1F] transition-colors">Jelajahi</Link>
          <Link to="/travel-planner" className="text-[#444651]/80 font-poppins text-base hover:text-[#6E1F1F] transition-colors">AI Travel Planner</Link>
          <Link to="/peta" className="text-[#444651]/80 font-poppins text-base hover:text-[#6E1F1F] transition-colors">Peta</Link>
          <Link to="/game" className="text-[#444651]/80 font-poppins text-base hover:text-[#6E1F1F] transition-colors">Game</Link>
        </nav>
        <span className="hidden md:block text-[#444651]/70 font-poppins text-base">Sounds</span>
        <button className="md:hidden flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer"
          aria-label="Buka menu" onClick={() => navigate('/')}>
          <span className="w-6 h-0.5 bg-[#6E1F1F] block rounded-full" />
          <span className="w-6 h-0.5 bg-[#6E1F1F] block rounded-full" />
          <span className="w-6 h-0.5 bg-[#6E1F1F] block rounded-full" />
        </button>
      </div>
    </header>
  );
};

/* 2. HeroSection — hero penuh layar + strip foto galeri, frame #1347:1728 + #1384:6196 */
const HeroSection = () => {
  const navigate = useNavigate();
  const photoStrip = [
    { src: imgStrip6, alt: 'Pemandangan Bukittinggi' },
    { src: imgStrip2, alt: 'Keindahan alam' },
    { src: imgSejarah, alt: 'Warisan sejarah' },
    { src: imgStrip3, alt: 'Budaya lokal' },
    { src: imgStrip4, alt: 'Rumah adat' },
    { src: imgStrip5, alt: 'Gunung Bukittinggi' },
    { src: imgStrip1, alt: 'Sawah Minangkabau' },
  ];
  return (
    <section className="relative w-full min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={bgHero} alt="" aria-hidden="true" className="w-full h-full object-cover" style={{ borderRadius: '32px' }} />
        <div className="absolute inset-0 bg-black/20" style={{ borderRadius: '32px' }} />
      </div>
      <div className="relative z-10 flex flex-col justify-between min-h-screen pt-24 md:pt-28 pb-6">
        <div className="px-8 md:px-14 flex-1 flex items-center">
          <h1 className="font-poppins font-medium text-white leading-none select-none"
            style={{ fontSize: 'clamp(52px, 11vw, 180px)', letterSpacing: '-0.02em' }}>
            Bukittinggi.
          </h1>
        </div>
        {/* Strip galeri horisontal */}
        <div className="w-full overflow-x-auto mt-4 px-8 pb-2" style={{ scrollbarWidth: 'none' }}>
          <div className="flex gap-4" style={{ width: 'max-content' }}>
            {photoStrip.map((photo, i) => (
              <div key={i} onClick={() => navigate('/')}
                className="relative flex-shrink-0 overflow-hidden cursor-pointer hover:brightness-110 transition-all duration-300"
                style={{ width: '213px', height: '279px', borderRadius: '16px', marginTop: i % 2 !== 0 ? '24px' : '0',
                  boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25), inset 0px 4px 4px 0px rgba(0,0,0,0.25)' }}>
                <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
        <button className="absolute bottom-8 right-8 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/35 transition-colors"
          aria-label="Gulir ke atas" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};

/* 3. CategoryCardsSection — 4 kartu: Sejarah, Budaya, Kuliner, Peta Wisata */
/* Sesuai frame #1347:1614 (heading) + #1347:1618 (4 kartu 320x450px) */
const CategoryCardsSection = () => {
  const navigate = useNavigate();
  const ref = useScrollReveal();
  const categories = [
    { title: 'Sejarah',     href: '/sejarah',  img: imgSejarah  },
    { title: 'Budaya',      href: '/budaya',   img: imgBudaya   },
    { title: 'Kuliner',     href: '/kuliner',  img: imgKuliner  },
    { title: 'Peta Wisata', href: '/peta',     img: imgPeta     },
  ];
  return (
    <section className="w-full bg-white py-20 md:py-28 px-4 md:px-8">
      <div ref={ref} className="max-w-[1352px] mx-auto">
        {/* Judul — Poppins Medium 64px, warna #6E1F1F, text #1347:1615 */}
        <h2 className="font-poppins font-medium text-[#6E1F1F] text-center leading-tight mb-5"
          style={{ fontSize: 'clamp(28px, 4.2vw, 64px)' }}>
          Jelajahi Warisan Bukittinggi
        </h2>
        {/* Subjudul — Poppins Regular 24px, text #1347:1616 */}
        <p className="font-poppins font-normal text-black/80 text-center max-w-[1051px] mx-auto leading-[1.8em] mb-10"
          style={{ fontSize: 'clamp(15px, 1.5vw, 24px)' }}>
          Dari jejak sejarah hingga keindahan alam, setiap sudut Bukittinggi menyimpan cerita yang menunggu untuk ditemukan.
        </p>
        {/* Garis dekorasi kuning — sesuai EL-5264fe0f (stroke #F9CE65, backdrop-filter blur) */}
        <div className="flex justify-center mb-16">
          <div className="h-px w-48 md:w-64 bg-[#F9CE65]" style={{ backdropFilter: 'blur(15px)' }} />
        </div>
        {/* Grid 4 kartu */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, idx) => (
            <div key={cat.title}
              className="relative overflow-hidden cursor-pointer group"
              style={{ borderRadius: '24px', aspectRatio: '320 / 450',
                boxShadow: '0px 8px 32px 0px rgba(0,0,0,0.10)', animationDelay: idx * 80 + 'ms' }}
              onClick={() => navigate(cat.href)}
              role="link" tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(cat.href)}
              aria-label={'Jelajahi ' + cat.title}>
              <img src={cat.img} alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              {/* Gradien maroon bawah — EL-1bfec18b */}
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, rgba(88,25,25,0) 67%, rgba(88,25,25,0.2) 74%, rgba(88,25,25,0.6) 80%, rgba(88,25,25,1) 97%)',
                  border: '1px solid rgba(110,31,31,0.75)', borderRadius: '24px' }} />
              {/* Judul — Corinthia Bold 64px, sesuai style_1b53304c */}
              <h3 className="absolute font-corinthia font-bold text-white"
                style={{ bottom: '20%', left: '7.5%', fontSize: 'clamp(30px, 3.5vw, 64px)', lineHeight: '1.1' }}>
                {cat.title}
              </h3>
              {/* Label + garis dekorasi — EL-5264fe0f + EL-d75eccbb */}
              <div className="absolute" style={{ bottom: '12%', left: '7.5%' }}>
                <div className="h-px bg-[#F9CE65] w-28 mb-2 opacity-80" />
                <span className="font-poppins font-medium text-white tracking-[0.12em] uppercase"
                  style={{ fontSize: '10px', lineHeight: '1.8em' }}>
                  Mulai Jelajah
                </span>
              </div>
              {/* Tombol panah — EL-e2188b67 (40x40px) */}
              <div className="absolute flex items-center justify-center rounded-full bg-white/15 backdrop-blur-sm group-hover:bg-white/25 transition-colors"
                style={{ bottom: '9%', right: '7%', width: '40px', height: '40px' }}>
                <IconArrowUpRight size={18} color="white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* 4. HeartSection — "The Heart of Minangkabau", frame #1360:3262 + #1360:3593 */
const HeartSection = () => {
  const navigate = useNavigate();
  const ref = useScrollReveal();
  return (
    <section className="w-full bg-[#FAF9F6] py-20 md:py-28 px-4 md:px-8 flex justify-center">
      <div ref={ref} className="max-w-[1115px] w-full flex flex-col md:flex-row overflow-hidden"
        style={{ borderRadius: '24px', boxShadow: '0px 18px 40px 0px rgba(99,77,77,0.25)',
          background: 'linear-gradient(135deg, rgba(110,31,31,1) 0%, rgba(83,23,23,1) 100%)',
          border: '1px solid rgba(68,70,81,0.2)' }}>
        {/* Kolom teks kiri */}
        <div className="flex-1 p-10 md:p-14 lg:p-16 flex flex-col justify-center z-10">
          {/* Judul kursif bergaris bawah — Corinthia Bold 96px, UNDERLINE, text #1360:3266 */}
          <h3 className="font-corinthia font-bold text-white leading-none mb-4"
            style={{ fontSize: 'clamp(42px, 6vw, 96px)', textDecoration: 'underline',
              textDecorationColor: 'rgba(255,255,255,0.4)', textUnderlineOffset: '6px' }}>
            Bukittinggi
          </h3>
          {/* Heading utama — Poppins Medium 64px, text #1360:3264 */}
          <h2 className="font-poppins font-medium text-white leading-tight mb-6"
            style={{ fontSize: 'clamp(22px, 3.5vw, 64px)' }}>
            The Heart Of Minangkabau
          </h2>
          {/* Paragraf — Poppins Regular 24px opacity 80%, text #1360:3265 */}
          <p className="font-poppins font-normal text-white/80 leading-[1.8em] mb-10"
            style={{ fontSize: 'clamp(14px, 1.3vw, 24px)', maxWidth: '867px' }}>
            Bukittinggi adalah permata di dataran tinggi Sumatera Barat, dikenal dengan udara sejuk,
            panorama alam yang memikat, dan budaya Minangkabau yang memikat. Sebagai salah satu kota
            bersejarah dan destinasi wisata unggulan di Indonesia, di pusat kota berdiri Jam Gadang,
            ikon kebanggaan yang menjadi simbol sejarah dan warisan masyarakatnya.
          </p>
          {/* Tombol — bg putih, radius 16px, frame #1360:3269 */}
          <button onClick={() => navigate('/profil-bukittinggi')}
            className="inline-flex items-center gap-3 bg-white text-[#531717] font-poppins font-medium rounded-2xl hover:bg-gray-100 active:scale-[0.98] transition-all"
            style={{ padding: '16px 24px', fontSize: 'clamp(16px, 1.5vw, 24px)', lineHeight: '1.3em', alignSelf: 'flex-start' }}>
            Profil Bukittinggi
            <IconArrowRight size={22} color="#531717" />
          </button>
        </div>
        {/* Kolom foto kanan — rect #1360:3267 */}
        <div className="md:w-[40%] relative min-h-[320px] md:min-h-0">
          <img src={imgProfile} alt="Menara Jam Gadang Bukittinggi"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ borderRadius: '0 24px 24px 0' }} />
        </div>
      </div>
    </section>
  );
};

/* 5. FeaturesSection — bento grid 4 kartu, frame #1384:6212, teks #1360:3425-3428 */
const FeaturesSection = () => {
  const ref = useScrollReveal();
  const features = [
    { bg: '#FDEBEC', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9F2F2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>, title: 'Jelajahi Destinasi', desc: 'Temukan objek wisata, kawasan bersejarah, dan sudut-sudut tersembunyi kota Bukittinggi yang menakjubkan.' },
    { bg: '#EDF3EC', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#346538" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title: 'Budaya & Tradisi', desc: 'Kenali kekayaan budaya Minangkabau dari tarian adat, rumah gadang, hingga upacara lokal yang kaya makna.' },
    { bg: '#E1F3FE', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1F6C9F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></svg>, title: 'AI Heritage Assistant', desc: 'Tanyakan apa saja kepada Ambo RancakBot dan temukan kisah serta sejarah Bukittinggi lebih mendalam.' },
    { bg: '#FBF3DB', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#956400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, title: 'AI Travel Planner', desc: 'Buat rencana perjalanan personal berdasarkan jumlah hari, anggaran, dan minat wisata Anda secara otomatis.' },
  ];
  return (
    <section className="w-full bg-white py-20 md:py-28 px-4 md:px-8 relative overflow-hidden">
      {/* Dekorasi elips blur — ELLIPSE #1384:6185 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 pointer-events-none"
        style={{ width: '1016px', height: '534px', borderRadius: '50%',
          background: 'linear-gradient(139deg, rgba(110,31,31,0.17) 6%, rgba(254,203,197,0.17) 54%)',
          filter: 'blur(67px)' }} aria-hidden="true" />
      {/* Dekorasi bintang kanan atas — frame #1384:6197 */}
      <div className="absolute top-[74px] right-[75px] w-16 h-16 rounded-full flex items-center justify-center pointer-events-none"
        style={{ background: 'rgba(255,218,213,0.3)', boxShadow: '0px 0px 32px 0px rgba(255,218,213,0.5), inset 0px 0px 24px 0px rgba(255,175,164,1)' }}
        aria-hidden="true">
        <IconStar size={18} color="white" />
      </div>
      {/* Dekorasi bintang kiri bawah — frame #1384:6201 */}
      <div className="absolute bottom-[60px] left-[118px] w-16 h-16 rounded-full flex items-center justify-center pointer-events-none"
        style={{ background: 'rgba(255,218,213,0.3)', boxShadow: '0px 0px 32px 0px rgba(255,218,213,0.5), inset 0px 0px 24px 0px rgba(255,175,164,1)' }}
        aria-hidden="true">
        <IconStar size={18} color="white" />
      </div>
      <div ref={ref} className="max-w-[1139px] mx-auto relative z-10">
        {/* Label "Fitur Utama" — Inter Medium 12px #C7A551, text #1360:3425 */}
        <div className="flex justify-center mb-3">
          <span className="font-poppins font-medium uppercase tracking-wider"
            style={{ fontSize: '12px', lineHeight: '20.4px', color: '#C7A551' }}>
            Fitur Utama
          </span>
        </div>
        {/* Heading dengan "Bukittinggi" berlatar merah — text #1360:3426 + rect #1360:3427 */}
        <div className="text-center mb-20 font-poppins font-medium"
          style={{ fontSize: 'clamp(24px, 3.8vw, 57.75px)', lineHeight: '1.35',
            letterSpacing: '-0.028em', color: '#060B13' }}>
          Temukan Kisah di Setiap Sudut&nbsp;
          <span className="text-white inline-block"
            style={{ backgroundColor: '#6E1F1F', borderRadius: '50px', padding: '0 20px' }}>
            Bukittinggi
          </span>
        </div>
        {/* Grid 4 kartu bento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat, i) => (
            <div key={i} className="bg-white flex flex-col p-8 hover:-translate-y-1 transition-transform duration-200"
              style={{ borderRadius: '24px', border: '1px solid #EAEAEA',
                boxShadow: '0px 8px 40px 0px rgba(6,11,19,0.08), inset 0px 4px 8px 0px rgba(0,0,0,0.08)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-8 flex-shrink-0"
                style={{ backgroundColor: feat.bg }}>
                {feat.icon}
              </div>
              <h3 className="font-poppins font-medium text-[#111] text-xl mb-3">{feat.title}</h3>
              <p className="font-poppins text-[#787774] leading-relaxed text-sm flex-1">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* 6. ParijsSection — kutipan "Parijs Van Sumatra", frame #1347:1660 */
const ParijsSection = () => {
  const ref = useScrollReveal();
  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden" style={{ minHeight: '850px' }}>
      <div className="absolute inset-0">
        <img src={imgParijs} alt="Suasana malam Bukittinggi" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
      </div>
      <div ref={ref} className="relative z-10 text-center max-w-[907px] px-6 md:px-12 py-20">
        {/* Teks kutipan — Corinthia Bold 96px, text #1347:1662 */}
        <h2 className="font-corinthia font-bold text-white leading-tight mb-6"
          style={{ fontSize: 'clamp(44px, 7vw, 96px)' }}>
          "Parijs Van Sumatra"
        </h2>
        {/* Garis dekorasi kuning — EL-5264fe0f #1347:1664 */}
        <div className="h-px bg-[#F9CE65] w-36 mx-auto mb-10" style={{ backdropFilter: 'blur(15px)' }} />
        {/* Paragraf — Poppins Italic 24px, text #1347:1663 */}
        <p className="font-poppins italic text-white/90 leading-[1.8em]"
          style={{ fontSize: 'clamp(15px, 1.5vw, 24px)' }}>
          Merupakan julukan bagi Bukittinggi sebagai salah satu ikon pariwisata di Sumatera Barat.
          Sebutan ini mencerminkan keindahan alam, kesejukan udara, serta pesona kota yang
          menjadikannya pusat aktivitas dan destinasi unggulan di masanya.
        </p>
      </div>
    </section>
  );
};

/* 7. AITeaserSection — teaser AI Travel Planner, frame #1360:3501 */
const AITeaserSection = () => {
  const navigate = useNavigate();
  const ref = useScrollReveal();
  const aiFeatures = [
    'Rencana perjalanan disesuaikan dengan jumlah hari',
    'Rekomendasi kuliner berdasarkan preferensi Anda',
    'Panduan budaya Minangkabau terintegrasi',
  ];
  const timeline = [
    { time: 'Hari 1 - 06:00', act: 'Sunrise di Ngarai Sianok' },
    { time: 'Hari 1 - 09:00', act: 'Jam Gadang & Pasar Atas' },
    { time: 'Hari 2 - 08:00', act: 'Sarapan di warung Kapau tradisional' },
    { time: 'Hari 2 - 14:00', act: 'Tour Benteng Fort de Kock' },
  ];
  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: '#6E1F1F', minHeight: '982px' }}>
      {/* Dekorasi bintang glowing — frame #1384:6157 */}
      <div className="absolute top-[107px] left-[225px] w-16 h-16 rounded-full flex items-center justify-center pointer-events-none"
        style={{ background: 'rgba(249,206,101,0.2)', boxShadow: '0px 0px 32px 0px rgba(249,206,101,0.49), inset 0px 0px 24px 0px rgba(249,206,101,1)' }}
        aria-hidden="true">
        <IconStar size={20} color="white" />
      </div>
      <div ref={ref} className="max-w-[1280px] mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Kolom teks kiri */}
        <div className="lg:w-1/2 flex flex-col z-10">
          {/* Label AI — frame "Background" #1360:3508, bg #394C3E, radius pill */}
          <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 self-start"
            style={{ backgroundColor: '#394C3E', borderRadius: '9999px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A7BCA9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span className="text-[#A7BCA9] font-poppins font-medium text-sm">Powered by Generative AI</span>
          </div>
          <h2 className="font-poppins font-medium text-white leading-tight mb-6"
            style={{ fontSize: 'clamp(26px, 3.5vw, 52px)' }}>
            AI Travel Planner<br />
            <span className="text-[#F9CE65]">Cerdas &amp; Personal</span>
          </h2>
          <p className="font-poppins text-white/75 leading-relaxed mb-8"
            style={{ fontSize: 'clamp(14px, 1.3vw, 20px)' }}>
            Katakan selamat tinggal pada itinerari yang generik. AI kami memahami nuansa budaya
            Minangkabau, mengoptimalkan waktu kunjungan ke Jam Gadang, dan menemukan permata
            kuliner tersembunyi sesuai selera Anda.
          </p>
          <ul className="space-y-4 mb-10">
            {aiFeatures.map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-white/90 font-poppins"
                style={{ fontSize: 'clamp(13px, 1.1vw, 17px)' }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#FDD170' }}>
                  <IconCheck size={11} color="#775800" />
                </div>
                {feat}
              </li>
            ))}
          </ul>
          {/* Tombol — frame "Button" #1360:3526, bg #FDD170, radius 12px */}
          <button onClick={() => navigate('/travel-planner')}
            className="inline-flex items-center gap-3 font-poppins font-medium active:scale-[0.98] transition-all self-start"
            style={{ backgroundColor: '#FDD170', color: '#531717', padding: '14px 24px', fontSize: '16px', lineHeight: '24px', borderRadius: '12px' }}>
            Mulai Rencanakan
            <IconArrowRight size={18} color="#531717" />
          </button>
        </div>
        {/* Panel UI mockup kanan — frame #1360:3530 + #1360:3531 */}
        <div className="lg:w-1/2 flex justify-center w-full">
          <div className="w-full max-w-[608px] p-8"
            style={{ backgroundColor: '#FAF9F6', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', minHeight: '505px' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#EAEAEA]" />
                <div className="w-3 h-3 rounded-full bg-[#EAEAEA]" />
                <div className="w-3 h-3 rounded-full bg-[#EAEAEA]" />
              </div>
              <div className="flex-1 text-center">
                <span className="font-poppins font-medium text-[#531717] text-sm">AI Travel Planner</span>
              </div>
            </div>
            <div className="bg-[#EFEEEB] rounded-2xl rounded-tr-sm p-4 text-sm text-[#1A1C1A] font-poppins mb-4 max-w-[82%] ml-auto">
              Saya ingin mengunjungi Bukittinggi 2 hari. Rekomendasikan itinerari terbaik!
            </div>
            <div className="p-5 rounded-2xl rounded-tl-sm text-sm font-poppins mb-6"
              style={{ backgroundColor: 'rgba(95,23,18,0.06)', border: '1px solid rgba(95,23,18,0.1)' }}>
              <p className="text-[#5F1712] font-semibold mb-3 text-xs">Berikut itinerari 2 hari terbaik:</p>
              <div className="border-l-2 border-dashed border-[#DBC1BD] ml-3 pl-5 py-1 space-y-4">
                {timeline.map((item, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: i === 0 ? '#5F1712' : '#DBC1BD' }} />
                    <span className="text-[#5F1712] font-semibold text-xs block mb-0.5">{item.time}</span>
                    <span className="text-[#554240] text-xs">{item.act}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-[#F4F3F0] rounded-full py-3 pl-4 pr-12 text-sm text-gray-400 font-poppins">
                Ketik pertanyaan Anda...
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#5F1712' }}>
                <IconArrowRight size={14} color="white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* 8. RancakBotSection — teaser RancakBot, frame #1402:1475 (layout cermin) */
const RancakBotSection = () => {
  const navigate = useNavigate();
  const ref = useScrollReveal();
  const botFeatures = [
    'Informasi sejarah dan budaya Minangkabau',
    'Rekomendasi destinasi berdasarkan minat',
    'Jawaban kontekstual dalam Bahasa Indonesia',
  ];
  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: '#6E1F1F', minHeight: '906px' }}>
      {/* Dekorasi bintang — EL-66b80db2 + EL-e5b59def */}
      <div className="absolute top-[46px] left-[40%] w-16 h-16 rounded-full flex items-center justify-center pointer-events-none"
        style={{ background: 'rgba(249,206,101,0.2)', boxShadow: '0px 0px 32px 0px rgba(249,206,101,0.49), inset 0px 0px 24px 0px rgba(249,206,101,1)' }}
        aria-hidden="true">
        <IconStar size={20} color="white" />
      </div>
      <div className="absolute bottom-[70px] right-[80px] w-16 h-16 rounded-full flex items-center justify-center pointer-events-none"
        style={{ background: 'rgba(249,206,101,0.2)', boxShadow: '0px 0px 32px 0px rgba(249,206,101,0.49), inset 0px 0px 24px 0px rgba(249,206,101,1)' }}
        aria-hidden="true">
        <IconStar size={20} color="white" />
      </div>
      {/* Tata letak cermin: foto kiri, teks kanan */}
      <div ref={ref} className="max-w-[1280px] mx-auto px-6 py-24 flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
        {/* Kolom teks kanan */}
        <div className="lg:w-1/2 flex flex-col z-10">
          {/* Label — text #1402:1482: Poppins Medium 16px */}
          <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 self-start"
            style={{ backgroundColor: 'rgba(249,206,101,0.5)', borderRadius: '9999px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#531717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <span className="font-poppins font-medium text-[#531717] text-base">Didukung Teknologi AI</span>
          </div>
          {/* Judul — Poppins Medium 40px, text #1402:1483 */}
          <h2 className="font-poppins font-medium text-white leading-none mb-6"
            style={{ fontSize: 'clamp(24px, 3vw, 40px)', lineHeight: '40px' }}>
            Tanya Ambo RancakBot
          </h2>
          {/* Deskripsi — Poppins Regular 18px opacity 78%, text #1402:1485 */}
          <p className="font-poppins text-white/80 leading-[1.625] mb-8"
            style={{ fontSize: 'clamp(13px, 1.2vw, 18px)', maxWidth: '567px' }}>
            Tidak menemukan informasi yang Anda cari? Tanyakan langsung kepada Ambo RancakBot
            dan dapatkan jawaban yang lebih personal, lengkap, dan sesuai kebutuhan Anda.
          </p>
          <ul className="space-y-4 mb-10">
            {botFeatures.map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-white/90 font-poppins"
                style={{ fontSize: 'clamp(13px, 1.1vw, 16px)' }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#FDD170' }}>
                  <IconCheck size={11} color="#775800" />
                </div>
                {feat}
              </li>
            ))}
          </ul>
          {/* Tombol "Mulai Bertanya" — frame "Button" #1402:1496, text #1402:1497 */}
          <button
            onClick={() => { navigate('/'); setTimeout(() => window.dispatchEvent(new Event('open-rancak-bot')), 400); }}
            className="inline-flex items-center gap-3 font-poppins font-medium active:scale-[0.98] transition-all self-start"
            style={{ backgroundColor: '#FDD170', color: '#531717', padding: '14px 24px', fontSize: '16px', lineHeight: '24px', borderRadius: '12px' }}>
            Mulai Bertanya
            <IconChat size={20} color="#531717" />
          </button>
        </div>
        {/* Panel foto kiri — rect #1402:1476 */}
        <div className="lg:w-1/2 flex justify-center w-full">
          <div className="relative w-full max-w-[608px] overflow-hidden"
            style={{ borderRadius: '24px', backgroundColor: '#FFFFFF', border: '1px solid rgba(68,70,81,0.2)',
              boxShadow: '0px 18px 40px 0px rgba(111,134,157,0.36), inset 0px 16px 40px 0px rgba(0,0,0,0.25)', minHeight: '500px' }}>
            <img src={imgProfile} alt="Ambo RancakBot" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.55 }} />
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, rgba(80,8,10,0.88) 0%, rgba(95,23,18,0.72) 100%)' }} />
            <div className="relative z-10 p-10 flex flex-col justify-between h-full min-h-[500px]">
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <IconChat size={26} color="white" />
              </div>
              <div>
                <h3 className="font-corinthia font-bold text-white mb-3"
                  style={{ fontSize: 'clamp(36px, 4vw, 56px)' }}>
                  Ambo RancakBot
                </h3>
                <p className="font-poppins text-white/80 text-base leading-relaxed">
                  Asisten cerdas berbasis AI untuk menjawab semua pertanyaan tentang Bukittinggi
                  — dari sejarah, budaya, kuliner, hingga panduan wisata lokal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* 9. FooterSection — kaki halaman sederhana */
const FooterSection = () => (
  <footer className="bg-white border-t border-[#EAEAEA] py-8 px-8">
    <div className="max-w-[1352px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
      <span className="font-corinthia font-bold text-[#6E1F1F] text-2xl">Bukittinggi Heritage</span>
      <p className="font-poppins text-[#787774] text-sm">
        &copy; 2025 Bukittinggi Heritage &middot; Halaman eksperimen rute /landing
      </p>
      <Link to="/" className="font-poppins text-[#6E1F1F] text-sm font-medium hover:underline">
        &larr; Kembali ke beranda
      </Link>
    </div>
  </footer>
);

/* ════════════════════════════════════════════════════════════════
   Komponen Utama: LandingTestPage
   Merakit semua seksi. Rute /landing — tidak mengubah rute /.
   ════════════════════════════════════════════════════════════════ */
export const LandingTestPage = () => {
  /* Gulir ke puncak secara instan saat halaman dimuat */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  return (
    <div className="w-full bg-white font-poppins text-[#111] overflow-x-hidden">
      {/* Navbar tetap di puncak */}
      <NavbarSection />
      <main>
        {/* Hero besar dengan strip galeri */}
        <HeroSection />
        {/* 4 kartu kategori wisata */}
        <CategoryCardsSection />
        {/* "The Heart of Minangkabau" */}
        <HeartSection />
        {/* Bento grid fitur utama */}
        <FeaturesSection />
        {/* Kutipan "Parijs Van Sumatra" */}
        <ParijsSection />
        {/* AI Travel Planner teaser */}
        <AITeaserSection />
        {/* RancakBot teaser */}
        <RancakBotSection />
      </main>
      <FooterSection />
    </div>
  );
};

export default LandingTestPage;
