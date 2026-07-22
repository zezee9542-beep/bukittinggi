import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

// ── Assets ─────────────────────────────────────────────────────────
import sonBg from '../assets/son.webp';
import gradientBg from '../assets/14.webp';
import foodIcon from '../assets/food.webp';
import leafBig from '../assets/leaf.webp';
import leaf1 from '../assets/leaf (1).webp';
import leaf2 from '../assets/leaf (2).webp';
import makanPlate from '../assets/makan.webp';
import piringImg from '../assets/piring.webp';
import pringImg from '../assets/pring.webp';
import groupText from '../assets/Group.webp';
import group6 from '../assets/Group 6 (1).webp';
import group7 from '../assets/Group 7 (1).webp';
import coverBg from '../assets/cover.webp';
import daunSvg from '../assets/daun.webp';
import { KulinerSkeleton } from '../components/ui/PageSkeletons';

import { GameCardPreviewStack } from '../components/GameCardPreviewStack';

// ── Icons & Culinary Assets ────────────────────────────────────────
import mknIcon from '../assets/mkn.webp';
import mnsIcon from '../assets/mns.webp';
import drnkIcon from '../assets/drnk.webp';

import img111 from '../assets/111.webp';
import img222 from '../assets/222.webp';
import img333 from '../assets/333.webp';
import img444 from '../assets/444.webp';
import img555 from '../assets/555.webp';
import img666 from '../assets/666.webp';
import img777 from '../assets/777.webp';
import img888 from '../assets/888.webp';

import img889 from '../assets/889.webp';
import img890 from '../assets/890.webp';
import img891 from '../assets/891.webp';
import img892 from '../assets/892.webp';
import img893 from '../assets/893.webp';
import img894 from '../assets/894.webp';
import img895 from '../assets/895.webp';
import img896 from '../assets/896.webp';

import img123 from '../assets/123.webp';
import img124 from '../assets/124.webp';
import img125 from '../assets/125.webp';
import img126 from '../assets/126.webp';

interface KulinerItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

// ── Falling Leaves Background Animation Configuration ───────────────
const FALLING_LEAVES_CONFIG = [
  { id: 1, image: leaf1, left: 3, size: 34, duration: 11, delay: -1.2, swayWidth: 45, opacity: 0.85 },
  { id: 2, image: leaf2, left: 12, size: 26, duration: 9.5, delay: -6.1, swayWidth: -35, opacity: 0.75 },
  { id: 3, image: daunSvg, left: 22, size: 40, duration: 13, delay: -3.5, swayWidth: 50, opacity: 0.9 },
  { id: 4, image: daunSvg, left: 31, size: 30, duration: 10.5, delay: -8.8, swayWidth: -40, opacity: 0.8 },
  { id: 5, image: leaf1, left: 42, size: 38, duration: 12, delay: -2.8, swayWidth: 38, opacity: 0.85 },
  { id: 6, image: leaf2, left: 53, size: 28, duration: 8.8, delay: -5.5, swayWidth: -45, opacity: 0.7 },
  { id: 7, image: leaf1, left: 63, size: 36, duration: 14, delay: -10.3, swayWidth: 55, opacity: 0.9 },
  { id: 8, image: daunSvg, left: 74, size: 32, duration: 11.2, delay: -4.2, swayWidth: -38, opacity: 0.8 },
  { id: 9, image: leaf1, left: 84, size: 42, duration: 13.5, delay: -7.1, swayWidth: 42, opacity: 0.85 },
  { id: 10, image: leaf2, left: 93, size: 25, duration: 9.8, delay: -1.0, swayWidth: -30, opacity: 0.75 },
  { id: 11, image: leaf2, left: 8, size: 35, duration: 12.5, delay: -9.0, swayWidth: 48, opacity: 0.85 },
  { id: 12, image: daunSvg, left: 18, size: 29, duration: 10.8, delay: -3.2, swayWidth: -42, opacity: 0.8 },
  { id: 13, image: leaf1, left: 28, size: 44, duration: 15, delay: -11.8, swayWidth: 52, opacity: 0.9 },
  { id: 14, image: leaf2, left: 48, size: 32, duration: 11.5, delay: -7.6, swayWidth: -36, opacity: 0.75 },
  { id: 15, image: leaf1, left: 58, size: 37, duration: 13.2, delay: -2.2, swayWidth: 46, opacity: 0.85 },
  { id: 16, image: daunSvg, left: 69, size: 31, duration: 9.2, delay: -5.0, swayWidth: -40, opacity: 0.8 },
  { id: 17, image: leaf1, left: 79, size: 36, duration: 12.8, delay: -8.7, swayWidth: 44, opacity: 0.85 },
  { id: 18, image: leaf2, left: 89, size: 38, duration: 14.5, delay: -12.9, swayWidth: -48, opacity: 0.9 },
];

function FallingLeaves() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[15] overflow-hidden">
      {FALLING_LEAVES_CONFIG.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute -top-[140px] pointer-events-none"
          style={{
            left: `${leaf.left}%`,
            width: `${leaf.size}px`,
            height: 'auto',
            animation: `leafFallAndSway ${leaf.duration}s linear infinite`,
            animationDelay: `${leaf.delay}s`,
            '--sway-px': `${leaf.swayWidth}px`,
            '--leaf-opacity': leaf.opacity,
          } as React.CSSProperties}
        >
          <img
            src={leaf.image}
            alt=""
            className="w-full h-auto object-contain filter drop-shadow(0 2px 4px rgba(0,0,0,0.18))"
          />
        </div>
      ))}
    </div>
  );
}

interface KulinerDetailModalProps {
  item: KulinerItem;
  category: 'makanan' | 'manisan' | 'minuman';
  onClose: () => void;
}

function KulinerDetailModal({ item, category, onClose }: KulinerDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 20);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleClose = () => {
    setClosing(true);
    setMounted(false);
    setTimeout(() => {
      onClose();
    }, 350);
  };

  const categoryLabel =
    category === 'makanan'
      ? 'MAKANAN KHAS MINANG'
      : category === 'manisan'
      ? 'MANISAN & KUDAPAN TRADISIONAL'
      : 'MINUMAN KHAS BUKITTINGGI';

  const mainIngredient =
    category === 'makanan'
      ? 'Daging / Rempah'
      : category === 'manisan'
      ? 'Ketan / Pisang'
      : 'Teh / Kawa / Rempah';

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 transition-all duration-300 ${
        mounted && !closing ? 'bg-black/60 backdrop-blur-md opacity-100' : 'bg-black/0 backdrop-blur-none opacity-0'
      }`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-[28px] bg-[#FDFBF7] p-5 sm:p-8 shadow-2xl border border-[#EBE8E2] text-[#1E1E1E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button X (Top Right as in reference image) */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#333333] shadow-md border border-[#E5E5E5] transition hover:bg-gray-100 cursor-pointer font-bold"
          aria-label="Tutup Detail"
        >
          ✕
        </button>

        {/* Split Container (Membelah Dua) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
          
          {/* ── LEFT COLUMN (Membuat membelah ke kiri) ── */}
          <div
            className={`flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted && !closing
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-14'
            }`}
          >
            <div>
              {/* Category Pill Tag */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F0EEEA] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#5C584F] font-poppins mb-3 border border-[#EBE8E2]">
                <span>🌿</span> {categoryLabel}
              </div>

              {/* Title */}
              <h2 className="font-poppins font-semibold text-2xl sm:text-[34px] text-[#1E1E1E] leading-tight mb-1.5 tracking-tight">
                {item.title}
              </h2>

              {/* Location */}
              <p className="font-poppins text-xs sm:text-sm text-[#706C62] flex items-center gap-1 mb-4">
                <span>📍 Bukittinggi, Sumatera Barat</span>
              </p>

              <div className="h-[1px] w-full bg-[#EBE8E2] mb-4" />

              {/* KARAKTERISTIK Section */}
              <div className="mb-4">
                <h4 className="font-poppins text-[11px] font-bold uppercase tracking-wider text-[#827E73] mb-2.5">
                  KARAKTERISTIK
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-white border border-[#EBE8E2] rounded-[12px] p-2.5 flex items-center gap-2 font-poppins text-xs font-medium text-[#2C2A26] shadow-sm">
                    <span>🍃</span> Kaya Rempah
                  </div>
                  <div className="bg-white border border-[#EBE8E2] rounded-[12px] p-2.5 flex items-center gap-2 font-poppins text-xs font-medium text-[#2C2A26] shadow-sm">
                    <span>🔥</span> Otentik Tradisional
                  </div>
                  <div className="bg-white border border-[#EBE8E2] rounded-[12px] p-2.5 flex items-center gap-2 font-poppins text-xs font-medium text-[#2C2A26] shadow-sm">
                    <span>⭐</span> Kuliner Wajib Bukittinggi
                  </div>
                  <div className="bg-white border border-[#EBE8E2] rounded-[12px] p-2.5 flex items-center gap-2 font-poppins text-xs font-medium text-[#2C2A26] shadow-sm">
                    <span>💖</span> Manis & Gurih
                  </div>
                </div>
              </div>

              {/* BAHAN & BUMBU UTAMA Section */}
              <div className="mb-5">
                <h4 className="font-poppins text-[11px] font-bold uppercase tracking-wider text-[#827E73] mb-2.5">
                  BAHAN & BUMBU UTAMA
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-white border border-[#EBE8E2] rounded-[12px] p-2.5 flex items-center gap-2.5 font-poppins text-xs font-medium text-[#2C2A26] shadow-sm">
                    <span>🌶️</span> Rempah Minang Asli
                  </div>
                  <div className="bg-white border border-[#EBE8E2] rounded-[12px] p-2.5 flex items-center gap-2.5 font-poppins text-xs font-medium text-[#2C2A26] shadow-sm">
                    <span>🥥</span> Santan Kelapa Murni
                  </div>
                  <div className="bg-white border border-[#EBE8E2] rounded-[12px] p-2.5 flex items-center gap-2.5 font-poppins text-xs font-medium text-[#2C2A26] shadow-sm">
                    <span>🌶️</span> Cabai Keriting Pilihan
                  </div>
                  <div className="bg-white border border-[#EBE8E2] rounded-[12px] p-2.5 flex items-center gap-2.5 font-poppins text-xs font-medium text-[#2C2A26] shadow-sm">
                    <span>🍃</span> Resep Warisan Leluhur
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Metadata Stats */}
            <div className="grid grid-cols-4 gap-2 pt-4 border-t border-[#EBE8E2] text-center font-poppins">
              <div className="border-r border-[#EBE8E2] pr-1">
                <span className="block text-base mb-0.5">⏱️</span>
                <span className="block text-[10px] text-[#706C62]">Dibuat</span>
                <span className="block text-xs font-semibold text-[#1E1E1E]">30 Menit</span>
              </div>
              <div className="border-r border-[#EBE8E2] pr-1">
                <span className="block text-base mb-0.5">🍌</span>
                <span className="block text-[10px] text-[#706C62]">Bahan Utama</span>
                <span className="block text-xs font-semibold text-[#1E1E1E] truncate">{mainIngredient}</span>
              </div>
              <div className="border-r border-[#EBE8E2] pr-1">
                <span className="block text-base mb-0.5">📍</span>
                <span className="block text-[10px] text-[#706C62]">Asal</span>
                <span className="block text-xs font-semibold text-[#1E1E1E]">Bukittinggi</span>
              </div>
              <div>
                <span className="block text-base mb-0.5">⭐</span>
                <span className="block text-[10px] text-[#706C62]">Rating Kuliner</span>
                <span className="block text-xs font-semibold text-[#1E1E1E]">4.9 / 5</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (Membuat membelah ke kanan) ── */}
          <div
            className={`flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted && !closing
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-14'
            }`}
          >
            <div>
              {/* Image Frame */}
              <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden shadow-sm mb-4 border border-[#EBE8E2] group">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-medium text-[#333333] shadow-sm flex items-center gap-1.5 font-poppins">
                  <span>🥣</span> Sajian Khas Bukittinggi
                </span>
              </div>

              {/* DESKRIPSI Box */}
              <div className="bg-[#F5F3EF] rounded-[16px] p-4 border border-[#EBE8E2] mb-5">
                <h4 className="font-poppins text-[11px] font-bold uppercase tracking-wider text-[#706C62] mb-2">
                  DESKRIPSI
                </h4>
                <p className="font-poppins text-xs sm:text-sm text-[#3D3A34] leading-relaxed">
                  {item.description} Hidangan ini merupakan salah satu kekayaan kuliner kebanggaan masyarakat Minangkabau yang menyajikan keseimbangan cita rasa gurih, aroma rempah yang pekat, dan keaslian bumbu khas Bukittinggi.
                </p>
              </div>
            </div>

            {/* Tutup Detail Action Button */}
            <button
              type="button"
              onClick={handleClose}
              className="w-full bg-[#63685F] hover:bg-[#52564F] text-white font-poppins font-medium py-3.5 rounded-[16px] text-sm transition shadow-sm cursor-pointer text-center"
            >
              Tutup Detail
            </button>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}

const KULINER_DATA: Record<'makanan' | 'manisan' | 'minuman', KulinerItem[]> = {
  makanan: [
  {
    id: 'mak-1',
    title: 'Katupek Kapau',
    description:
      'Ketupat dengan kuah gulai nangka, sayuran rebus, bihun, dan siraman bumbu pecel khas.',
    image: img111,
  },
  {
    id: 'mak-2',
    title: 'Itiak Lado Mudo',
    description:
      'Daging bebek yang dimasak dengan racikan rempah dan cabai hijau keriting.',
    image: img222,
  },
  {
    id: 'mak-3',
    title: 'Gulai Tambusu',
    description:
      'Daging usus sapi diisi dengan adonan telur dan tahu, dimasak menggunakan bumbu rempah khas.',
    image: img333,
  },
  {
    id: 'mak-4',
    title: 'Gulai Cancang',
    description:
      'Potongan daging, tetelan, dan jeroan sapi atau kambing dimasak dengan kuah gulai kaya rempah.',
    image: img444,
  },
  {
    id: 'mak-5',
    title: 'Dendeng Batokok',
    description:
      'Daging sapi pipih berbumbu khas Minang dengan sambal pedas yang menggugah selera.',
    image: img555,
  },
  {
    id: 'mak-6',
    title: 'Gulai Tunjang',
    description:
      'Tunjang sapi yang dimasak hingga empuk dengan kuah santan dan rempah khas Minangkabau.',
    image: img666,
  },
  {
    id: 'mak-7',
    title: 'Ayam Pop',
    description:
      'Ayam khas Minang yang direbus dalam air kelapa hingga lembut dan gurih.',
    image: img777,
  },
  {
    id: 'mak-8',
    title: 'Gulai Kapau',
    description:
      'Masakan khas Kapau berkuah santan yang disajikan dengan beragam lauk tradisional.',
    image: img888,
  },
],
  manisan: [
  {
    id: 'mns-1',
    title: 'Bubua Kampiun',
    description: 'Kelezatan tradisional Minang dengan perpaduan bubur, kolak, dan santan.',
    image: img889,
  },
  {
    id: 'mns-2',
    title: 'Itiak Lado Mudo',
    description: 'Daging bebek yang dimasak dengan racikan rempah dan cabai hijau keriting.',
    image: img890,
  },
  {
    id: 'mns-3',
    title: 'Pisang Kapik',
    description: 'Pisang kepok dibakar lalu dipipihkan sebelum diberi taburan kelapa manis.',
    image: img891,
  },
  {
    id: 'mns-4',
    title: 'Kacimuiah',
    description: 'Jajanan tradisional dari singkong kukus dengan kelapa dan taburan gula.',
    image: img892,
  },
  {
    id: 'mns-5',
    title: 'Pinukuik',
    description: 'Kue panggang tradisional dari tepung beras yang disajikan hangat nikmat.',
    image: img893,
  },
  {
    id: 'mns-6',
    title: 'Lupis Minang',
    description: 'Kue ketan tradisional yang disajikan bersama kelapa dan gula merah.',
    image: img894,
  },
  {
    id: 'mns-7',
    title: 'Mangkuak Sayak',
    description: 'Kue kukus tradisional dengan cetakan batok kelapa dan aroma khas.',
    image: img895,
  },
  {
    id: 'mns-8',
    title: 'Lamang Tapai',
    description: 'Ketan bakar dalam bambu disajikan bersama tapai hasil fermentasi tradisional.',
    image: img896,
  },
],
  minuman: [
  {
    id: 'drk-1',
    title: 'Teh Talua',
    description:
      'Perpaduan teh panas, kuning telur, dan gula dalam satu sajian.',
    image: img123,
  },
  {
    id: 'drk-2',
    title: 'Kopi Kawa Daun',
    description:
      'Minuman tradisional dari daun kopi sangrai yang diseduh seperti teh.',
    image: img124,
  },
  {
    id: 'drk-3',
    title: 'Bandrek Minang',
    description:
      'Minuman tradisional berbahan jahe, gula aren, dan rempah pilihan khas.',
    image: img125,
  },
  {
    id: 'drk-4',
    title: 'Jus Markisa',
    description:
      'Olahan buah markisa dengan cita rasa tropis yang menyegarkan alami.',
    image: img126,
  },
],
};

export function KulinerPage() {
  const navigate = useNavigate();
  const { ref: heroRef } = useScrollReveal<HTMLElement>({ threshold: 0.01 });
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });
  const { ref: decorationRef, isVisible: decorationVisible } = useScrollReveal<HTMLElement>({ threshold: 0.2 });
  const { ref: gameRef, isVisible: gameVisible } = useScrollReveal<HTMLElement>({ threshold: 0.15 });
  const [activeCategory, setActiveCategory] = useState<'makanan' | 'manisan' | 'minuman'>('makanan');
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayCategory, setDisplayCategory] = useState(activeCategory);
  const [selectedItem, setSelectedItem] = useState<{ item: KulinerItem; category: 'makanan' | 'manisan' | 'minuman' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);


  useEffect(() => {
    if (activeCategory !== displayCategory) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayCategory(activeCategory);
        setIsAnimating(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [activeCategory, displayCategory]);

  const handleCategoryChange = (category: 'makanan' | 'manisan' | 'minuman') => {
    if (category !== activeCategory && !isAnimating) {
      setActiveCategory(category);
    }
  };

  if (isLoading) {
    return <div className="mt-[76px]"><KulinerSkeleton /></div>;
  }

  return (
    /*
      cover.webp: background dari atas sampai akhir Group 7.webp (full page via bg-cover)
      White: hanya di bawah Group 7.webp (handled di dalam game section)
    */
    <div
      className="kuliner-page relative min-h-[250vh] overflow-x-hidden select-none"
      style={{
        backgroundImage: `url(${coverBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'local',
      }}
    >
      {/* ── Falling Leaves Continuous Animation Overlay ── */}
      <FallingLeaves />

      {/* ═══════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════ */}
      {/* overflow-hidden on mobile stops decorative elements from blocking scroll */}
      <section ref={heroRef} className="relative z-10 mt-[76px] h-[500px] w-full overflow-hidden sm:h-[520px] md:mt-0 md:h-auto md:overflow-visible">

        {/* ── [LAYER 1] SON.webp (Background Utama) ── */}
        <img
          src={sonBg}
          alt=""
          className="relative z-[1] block h-full w-full -translate-y-52 sm:-translate-y-8 scale-[1.14] sm:scale-[1.03] object-cover object-[center_42%] md:-mt-[8%] md:h-auto md:-translate-y-10 md:scale-100 md:object-contain"
          style={{
            animation: 'heroBgZoomEnter 1.4s cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        />

        {/* ── [LAYER 2] 14.webp (Overlay Gradient Merah) ── */}
        <div
          className="absolute inset-0 z-[2] -translate-y-52 sm:-translate-y-8 scale-[1.14] sm:scale-[1.03] md:-mt-[8%] md:-translate-y-10 md:scale-100"
          style={{
            backgroundImage: `url(${gradientBg})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            animation: 'heroGradientFadeEnter 1.2s ease-out 0.15s both',
          }}
        />

        {/* ── [LAYER 3] KONTEN ELEMEN HERO ── */}

        {/* Judul: "Cita Rasa Bukittinggi" — Ditinggikan/Dikebawahkan Sedikit (top-[20%] md:top-[32%]) */}
        <div
          className="absolute left-1/2 top-[20%] z-25 w-full -translate-x-1/2 -translate-y-1/2 px-4 text-center md:top-[32%]"
          style={{
            animation: 'heroTitleEnter 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
          }}
        >
          <h1
            className="font-poppins font-medium text-white tracking-wide"
            style={{
              fontSize: 'clamp(1.5rem, 4.4vw, 3.6rem)',
              textShadow: '0 4px 18px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.9)',
            }}
          >
            Cita Rasa Bukittinggi
          </h1>
        </div>

        {/* Top Right Floating Badge — Animasi Masuk dari KANAN (Right) */}
        <div
          className="absolute right-4 top-3 z-20 flex items-center gap-2 rounded-[12px] px-3 py-2 shadow-md sm:right-5 sm:top-4 sm:gap-2.5 sm:px-4 sm:py-2.5 md:right-[6%] md:top-[75px] md:gap-3 md:rounded-[14px] md:px-5 md:py-3"
          style={{
            background: 'rgba(105, 32, 32, 0.45)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.08)',
            animation: 'heroBadgeEnter 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both',
          }}
        >
          <div
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[8px] sm:h-8 sm:w-8 md:h-9 md:w-9 md:rounded-[10px]"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <img
              src={foodIcon}
              alt=""
              className="h-4 w-4 object-contain md:h-5 md:w-5"
              style={{
                filter: 'brightness(0) invert(1)',
                animation: 'heroIconPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s both',
              }}
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="mb-0.5 font-poppins text-[9px] font-medium text-white sm:text-[10px] md:text-[12px]">
              Meal Planning
            </span>
            <span className="font-poppins text-[8px] text-white/75 sm:text-[9px] md:text-[11px]">
              Assistance
            </span>
          </div>
        </div>

        {/* ── DECORATIVE LEAF ELEMENTS (ATAS) ── */}

        {/* Left Large Leaf (leaf.webp) — Animasi Masuk dari SISI KIRI LUAR (Far Left) + Sway */}
        <div
          className="absolute left-[-8%] top-[18%] z-20 w-[86px] pointer-events-none sm:w-[110px] md:left-[-2%] md:top-[16%] md:w-[clamp(120px,18vw,240px)]"
          style={{
            animation: 'heroLeftLeafEnter 1.3s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both',
          }}
        >
          <img
            src={leafBig}
            alt=""
            className="w-full h-auto object-contain filter drop-shadow(0 6px 12px rgba(0,0,0,0.3))"
            style={{ animation: 'heroLeafSway 6s ease-in-out 1.5s infinite' }}
          />
        </div>

        {/* Leaf (1).webp - Right of title — Animasi Masuk dari SISI KANAN LUAR (Far Right) + Sway */}
        <div
          className="absolute right-[4%] top-[20%] z-20 w-[48px] pointer-events-none sm:w-[60px] md:right-[15%] md:top-[32%] md:w-[clamp(60px,10vw,120px)]"
          style={{
            animation: 'heroRightLeafEnter 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both',
          }}
        >
          <img
            src={leaf1}
            alt=""
            className="w-full h-auto object-contain filter drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
            style={{ animation: 'heroLeafSwayAlt 7s ease-in-out 1.7s infinite' }}
          />
        </div>

        {/* ── INTERSEKSI ELEMEN UTAMA (PIRING MAKANAN) — Pop & Bounce Masuk dari BAWAH (Bottom) ── */}
        <div
          className="pointer-events-none absolute bottom-[15%] left-1/2 z-30 flex w-[88%] max-w-[430px] -translate-x-1/2 flex-col items-center md:bottom-[-16%] md:w-[clamp(350px,55vw,680px)] md:max-w-none"
        >
          {/* Container Piring */}
          <div
            className="relative w-full"
            style={{
              animation: 'heroPlateEnter 1.4s cubic-bezier(0.34, 1.35, 0.64, 1) 0.35s both',
            }}
          >
            <img
              src={makanPlate}
              alt="Nasi Kapau"
              className="w-full h-auto object-contain mx-auto"
              style={{
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.35))',
                animation: 'plateFloating 5s ease-in-out 1.8s infinite',
              }}
            />

            {/* Small Leaf - Left of makan.webp, centered */}
            <div
              className="absolute z-40 pointer-events-none opacity-90"
              style={{
                left: '-3%',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 'clamp(50px, 7vw, 90px)',
                animation: 'heroLeftLeafEnter 1.3s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both',
              }}
            >
              <img src={leaf2} alt="" className="w-full h-auto object-contain" style={{ transform: 'rotate(-20deg)' }} />
            </div>
          </div>
        </div>

        {/* ── TEKS MELENGKUNG (Group.webp) — Animasi Masuk dari BAWAH (Bottom) ── */}
        <div
          className="pointer-events-none absolute bottom-[8%] left-1/2 z-[35] w-[86%] max-w-[390px] -translate-x-1/2 sm:w-[92%] md:bottom-[-16%] md:w-[clamp(350px,55vw,680px)] md:max-w-none"
          style={{
            animation: 'heroTextEnter 1.3s cubic-bezier(0.34, 1.3, 0.64, 1) 0.5s both',
          }}
        >
          <img
            src={groupText}
            alt="Cita Rasa Minang · Kaya Rempah"
            className="w-full h-auto object-contain mx-auto"
          />
        </div>

        {/* Bottom Left Leaf — Uses organic leaf1 asset (without cut border) */}
        <div
          className="absolute bottom-[10%] left-[-4%] z-30 w-[72px] pointer-events-none sm:w-[90px] md:bottom-[-10%] md:left-[-1%] md:w-[clamp(85px,12vw,160px)]"
          style={{
            animation: 'heroBottomLeftLeafEnter 1.5s cubic-bezier(0.34, 1.3, 0.64, 1) 0.4s both',
          }}
        >
          <img
            src={leaf1}
            alt=""
            className="w-full h-auto object-contain"
            style={{ transform: 'rotate(-25deg) scaleX(-1)' }}
          />
        </div>

        {/* Bottom Right Leaf (leaf (1).webp) — Animasi Masuk dari BAWAH KANAN (Bottom-Right) */}
        <div
          className="absolute bottom-[10%] right-[-4%] z-30 w-[72px] pointer-events-none sm:w-[90px] md:bottom-[-10%] md:right-[-1%] md:w-[clamp(85px,12vw,160px)]"
          style={{
            animation: 'heroBottomRightLeafEnter 1.5s cubic-bezier(0.34, 1.3, 0.64, 1) 0.45s both',
          }}
        >
          <img src={leaf1} alt="" className="w-full h-auto object-contain" />
        </div>

      </section>

      {/* ── AREA SECTION BAWAH ── */}
      <div ref={sectionRef} className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-32 pb-0 sm:px-6 sm:pt-44 md:px-12 md:pt-52 lg:px-16">

        {/* ── Tab Navigation with white background ── */}
        <div
          className={`inline-flex max-w-full items-end overflow-x-auto bg-white rounded-t-[24px] pt-4 pl-2 transition-[opacity,transform] duration-500 ease-out hide-scrollbar ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{
            boxShadow: '0 -4px 12px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(0,0,0,0.05)',
          }}
        >
          {(
            [
              { key: 'makanan' as const, icon: mknIcon, label: 'Makanan' },
              { key: 'manisan' as const, icon: mnsIcon, label: 'Manisan' },
              { key: 'minuman' as const, icon: drnkIcon, label: 'Minuman' },
            ]
          ).map(({ key, icon, label }) => {
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className="group relative flex items-center gap-2.5 px-5 py-3 cursor-pointer transition-all duration-300 rounded-t-[16px] flex-shrink-0"
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                }}
              >
                {/* Icon circle */}
                <div className="w-9 h-9 rounded-full bg-[#FFDAD5] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                  <img src={icon} alt={label} className="w-5 h-5 object-contain" />
                </div>
                {/* Label */}
                <span
                  className={`font-poppins text-[15px] sm:text-[16px] transition-colors duration-300 ${
                    isActive
                      ? 'font-medium text-[#6E1F1F]'
                      : 'font-normal text-[#444651] group-hover:text-[#6E1F1F]'
                  }`}
                >
                  {label}
                </span>
                {/* Red underline: only on active tab */}
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full transition-all duration-300"
                  style={{
                    background: '#6E1F1F',
                    opacity: isActive ? 1 : 0,
                    transformOrigin: 'center',
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* ── White Card Panel — wraps ONLY the cards ── */}
        <div
          className={`rounded-b-[24px] p-6 sm:p-8 transition-[opacity,transform] duration-500 delay-100 ease-out ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{
            background: '#ffffff',
            boxShadow: '0 8px 40px rgba(0,0,0,0.07), 0 -1px 0 rgba(0,0,0,0.05)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            key={displayCategory}
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 transition-[opacity,transform] duration-300 ease-out ${
              isAnimating
                ? 'opacity-0 translate-y-1'
                : 'opacity-100 translate-y-0'
            }`}
          >
            {KULINER_DATA[displayCategory].map((item, index) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem({ item, category: displayCategory })}
                className={`bg-white rounded-[20px] p-4 flex flex-col justify-between cursor-pointer transition-[opacity,transform] duration-[400ms] hover:-translate-y-1 ${
                  sectionVisible && !isAnimating
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
                style={{
                  boxShadow: 'inset 0 2px 10px rgba(74,35,29,0.08), inset 0 0 0 1px rgba(110,31,31,0.10), 0 6px 20px rgba(0,0,0,0.04)',
                  transitionDelay: `${sectionVisible && !isAnimating ? index * 60 : 0}ms`,
                  transitionTimingFunction: 'ease-out',
                }}
              >
                {/* Image Frame with drop shadow + inner shadow */}
                <div
                  className="relative w-full rounded-[14px] overflow-hidden mb-4 flex-shrink-0"
                  style={{
                    aspectRatio: '4/3',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {/* Inner shadow overlay */}
                  <div
                    className="absolute inset-0 rounded-[14px] pointer-events-none"
                    style={{ boxShadow: 'inset 0 3px 14px rgba(0,0,0,0.20)' }}
                  />
                </div>

                {/* Text content */}
                <div className="flex flex-col flex-1">
                  <h3 className="font-poppins font-medium text-[#000000] text-[17px] leading-snug mb-1.5 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="font-poppins font-normal text-[#444651] text-[12px] sm:text-[13px] leading-relaxed mb-5 line-clamp-3 min-h-[52px]">
                    {item.description}
                  </p>
                </div>

                {/* Lihat Detail Button */}
                <div className="flex justify-end w-full mt-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedItem({ item, category: displayCategory })}
                    className="bg-[#FFDAD5] text-[#6E1F1F] font-poppins font-normal text-[11px] sm:text-[12px] px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-all duration-300 hover:bg-[#f5c8c2] active:scale-95 cursor-pointer group"
                    style={{ boxShadow: '0 2px 6px rgba(110,31,31,0.10)' }}
                  >
                    Lihat Detail
                    <span className="text-[11px] font-semibold transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* ── end card panel ── */}

        {/* ── Decorative Section with Two Images ── */}
        <section
          ref={decorationRef}
          className={`w-full pt-5 sm:pt-7 pb-14 sm:pb-20 px-5 sm:px-10 lg:px-20 transition-[opacity,transform] duration-700 ease-out ${
            decorationVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Desktop & Tablet - Horizontal Layout */}
          <div className="hidden md:flex max-w-[1440px] mx-auto items-center justify-between gap-2 lg:gap-4">
            {/* Left Image */}
            <div
              className={`flex w-[50%] justify-start transition-[opacity,transform] duration-700 delay-75 ease-out will-change-transform ${
                decorationVisible ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'
              }`}
            >
              <img
                src={group6}
                alt=""
                className="h-auto w-full max-w-[680px] origin-left scale-[1.12] -translate-y-8 lg:-translate-y-12 object-contain"
              />
            </div>

            {/* Right Image - Piring */}
            <div
              className={`flex w-[47%] justify-end pr-2 lg:pr-5 transition-[opacity,transform] duration-700 delay-150 ease-out will-change-transform ${
                decorationVisible ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
              }`}
            >
              <img
                src={piringImg}
                alt=""
                className="h-auto w-full max-w-[560px] object-contain"
              />
            </div>
          </div>

          {/* Mobile - Vertical Layout */}
          <div className="md:hidden flex flex-col items-center gap-9">
            <div
              className={`flex justify-center transition-[opacity,transform] duration-700 ease-out will-change-transform ${
                decorationVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}
            >
              <img
                src={group6}
                alt=""
                className="w-[90%] max-w-[620px] h-auto -translate-y-5 scale-105 object-contain"
              />
            </div>
            <div
              className={`flex justify-center transition-[opacity,transform] duration-700 delay-150 ease-out will-change-transform ${
                decorationVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}
            >
              <img
                src={piringImg}
                alt=""
                className="w-[86%] max-w-[430px] h-auto object-contain"
              />
            </div>
          </div>
        </section>

      </div>

      {/* ── Bottom Game Card Section ── */}
      <section
        ref={gameRef}
        className="relative w-full flex flex-col items-center justify-center pt-20 pb-28 sm:pt-28 sm:pb-36 px-4 overflow-hidden min-h-[680px] sm:min-h-[800px]"
      >
        {/* Background Image: Group 7 (Wavy Pink Area) — extended to 100% height covering bottom edge */}
        <img
          src={group7}
          alt="Group 7"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ zIndex: 1 }}
        />

        {/* Content Container (z-10, behind leaf but in front of background) */}
        <div className={`relative z-10 flex w-full max-w-[360px] flex-col items-center transition-all duration-700 ease-out sm:max-w-[616px] ${
          gameVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>

          {/* Selesaikan Game Badge */}
          <div
            className="flex items-center justify-center rounded-full mb-4 sm:mb-6"
            style={{
              width: '261px',
              height: '44px',
              backgroundColor: '#FDF0CF',
            }}
          >
            <span
              className="font-poppins font-medium text-[15px]"
              style={{ color: '#C7A551' }}
            >
              Selesaikan Game
            </span>
          </div>

          {/* Main Game Card — shorter and more compact on mobile */}
          <div
            className="w-full bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 flex flex-col min-h-[480px] sm:min-h-[668px]"
            style={{
              maxWidth: '616px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
            }}
          >
            {/* Card Image Frame — smaller on mobile */}
            <GameCardPreviewStack />

            {/* Title — smaller on mobile */}
            <h2 className="font-poppins font-medium text-[#000000] text-[20px] sm:text-[28px] mb-2 sm:mb-3 leading-snug tracking-tight">
              Memori Kuliner Minang
            </h2>

            {/* Description — smaller on mobile */}
            <p className="font-poppins font-normal text-[#444651] text-[12px] sm:text-[14.5px] leading-relaxed mb-4 sm:mb-6">
              Uji daya ingatmu dengan mencocokkan kartu kuliner khas Bukittinggi. Temukan seluruh pasangan yang sesuai untuk mempelajari berbagai hidangan tradisional dengan cara yang lebih menyenangkan.
            </p>

            {/* Button — smaller on mobile */}
            <button
              onClick={() => navigate('/game')}
              className="self-end text-white font-poppins font-medium text-[13px] sm:text-[15px] px-6 sm:px-8 py-2 sm:py-3 rounded-[10px] sm:rounded-[12px] flex items-center gap-1.5 sm:gap-2 transition-all hover:bg-[#521717] active:scale-95 cursor-pointer mt-auto"
              style={{ backgroundColor: '#6E1F1F' }}
            >
              Mulai Main
              <span className="text-[14px] sm:text-[16px]">→</span>
            </button>
          </div>

        </div>

        {/* Floating leaf element — z-20 (didepan sendiri) and positioned higher up */}
        <img
          src={daunSvg}
          alt=""
          className="absolute pointer-events-none opacity-90 z-20 w-[90px] sm:w-[130px]"
          style={{
            left: '10%',
            top: '30px',
            transform: 'rotate(-25deg)',
            filter: 'blur(1.5px)',
            animation: 'float 6s ease-in-out infinite',
          }}
        />

        {/* pring.webp — bottom-left corner decoration, z-10 (in front of background), pushed further down */}
        <img
          src={pringImg}
          alt=""
          className="absolute bottom-[-20px] sm:bottom-[-60px] left-0 pointer-events-none z-10"
          style={{
            width: 'clamp(140px, 25vw, 340px)',
            height: 'auto',
            objectFit: 'contain',
            objectPosition: 'bottom left',
          }}
        />
      </section>

      {/* Render Membelah Dua Modal Detail */}
      {selectedItem && (
        <KulinerDetailModal
          item={selectedItem.item}
          category={selectedItem.category}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

export default KulinerPage;
