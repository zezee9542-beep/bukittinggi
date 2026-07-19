import { useState, useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

// ── Assets ─────────────────────────────────────────────────────────
import sonBg from '../assets/son.png';
import gradientBg from '../assets/14.png';
import foodIcon from '../assets/food.png';
import leafBig from '../assets/leaf.png';
import leaf1 from '../assets/leaf (1).png';
import leaf2 from '../assets/leaf (2).png';
import leaf3 from '../assets/leaf (3).png';
import makanPlate from '../assets/makan.png';
import piringImg from '../assets/piring.png';
import pringImg from '../assets/pring.png';
import groupText from '../assets/Group.png';
import group6 from '../assets/Group 6.png';
import group7 from '../assets/Group 7.png';
import coverBg from '../assets/cover.png';
import daunSvg from '../assets/daun.png';
import cardImg from '../assets/card.png';

// ── Icons & Culinary Assets ────────────────────────────────────────
import mknIcon from '../assets/mkn.png';
import mnsIcon from '../assets/mns.png';
import drnkIcon from '../assets/drnk.png';

import img111 from '../assets/111.png';
import img222 from '../assets/222.png';
import img333 from '../assets/333.png';
import img444 from '../assets/444.png';
import img555 from '../assets/555.png';
import img666 from '../assets/666.png';
import img777 from '../assets/777.png';
import img888 from '../assets/888.png';

import img889 from '../assets/889.png';
import img890 from '../assets/890.png';
import img891 from '../assets/891.png';
import img892 from '../assets/892.png';
import img893 from '../assets/893.png';
import img894 from '../assets/894.png';
import img895 from '../assets/895.png';
import img896 from '../assets/896.png';

import img123 from '../assets/123.png';
import img124 from '../assets/124.png';
import img125 from '../assets/125.png';
import img126 from '../assets/126.png';

interface KulinerItem {
  id: string;
  title: string;
  description: string;
  image: string;
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
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal<HTMLElement>({ threshold: 0.01 });
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });
  const { ref: decorationRef, isVisible: decorationVisible } = useScrollReveal<HTMLElement>({ threshold: 0.2 });
  const { ref: gameRef, isVisible: gameVisible } = useScrollReveal<HTMLElement>({ threshold: 0.15 });
  const [activeCategory, setActiveCategory] = useState<'makanan' | 'manisan' | 'minuman'>('makanan');
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayCategory, setDisplayCategory] = useState(activeCategory);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
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

  return (
    /*
      [LAYER 0 - PALING BELAKANG] bg putih
      [LAYER 1] cover.png di atas bg putih
    */
    <div className="kuliner-page relative min-h-[250vh] overflow-x-hidden select-none">

      {/* ── [LAYER 0] White background — paling belakang ── */}
      <div className="pointer-events-none absolute inset-0 z-[-2] bg-white" />

      {/* ── [LAYER 1] cover.png — di depan bg putih, di belakang konten ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[-1]"
        style={{
          backgroundImage: `url(${coverBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* ═══════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════ */}
      {/* overflow-hidden on mobile stops decorative elements from blocking scroll */}
      <section ref={heroRef} className="relative z-10 mt-[76px] h-[460px] w-full overflow-hidden sm:h-[520px] md:mt-0 md:h-auto md:overflow-visible">

        {/* ── [LAYER 1] SON.PNG ── */}
        <img
          src={sonBg}
          alt=""
          className="relative z-[1] block h-full w-full -translate-y-2 scale-[1.03] object-cover object-[center_42%] md:-mt-[4%] md:h-auto md:translate-y-0 md:scale-100 md:object-contain"
        />

        {/* ── [LAYER 2] 14.PNG (Overlay Gradient Merah) — raised up on mobile ── */}
        <div
          className="absolute inset-0 z-[2] -translate-y-8 scale-[1.03] md:-mt-[4%] md:translate-y-0 md:scale-100"
          style={{
            backgroundImage: `url(${gradientBg})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* ── [LAYER 3] KONTEN ELEMEN HERO ── */}

        {/* Judul: "Cita Rasa Bukittinggi" */}
        <div
          className={`absolute left-1/2 top-[19%] z-10 w-full -translate-x-1/2 -translate-y-1/2 px-4 text-center transition-all duration-1000 delay-150 ease-out md:top-[42%] ${
            heroVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-90'
          }`}
        >
          <h1
            className="font-poppins font-medium text-white tracking-wide"
            style={{
              fontSize: 'clamp(1.45rem, 4.2vw, 3.5rem)',
              textShadow: '0 4px 14px rgba(0,0,0,0.5)',
            }}
          >
            Cita Rasa Bukittinggi
          </h1>
        </div>

        {/* Top Right Floating Badge */}
        <div
          className={`absolute right-4 top-4 z-10 flex items-center gap-2 rounded-[12px] px-3 py-2 shadow-md transition-[opacity,transform] duration-500 ease-out sm:right-5 sm:top-5 sm:gap-2.5 sm:px-4 sm:py-2.5 md:right-[6%] md:top-[118px] md:gap-3 md:rounded-[14px] md:px-5 md:py-3 ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
          }`}
          style={{
            background: 'rgba(105, 32, 32, 0.45)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.08)',
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
              style={{ filter: 'brightness(0) invert(1)' }}
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

        {/* Left Large Leaf (leaf.png) */}
        <div
          className={`absolute left-[-8%] top-[35%] z-20 w-[86px] pointer-events-none transition-all duration-[1400ms] delay-0 ease-out sm:w-[110px] md:left-[-2%] md:top-[25%] md:w-[clamp(120px,18vw,240px)] ${
            heroVisible ? 'opacity-100 rotate-0 translate-x-0' : 'opacity-0 -rotate-45 -translate-x-8'
          }`}
        >
          <img
            src={leafBig}
            alt=""
            className="w-full h-auto object-contain filter drop-shadow(0 6px 12px rgba(0,0,0,0.3))"
          />
        </div>

        {/* Leaf (1).png - Right of title */}
        <div
          className={`absolute right-[4%] top-[42%] z-20 w-[48px] pointer-events-none transition-all duration-[1500ms] delay-200 ease-out sm:w-[60px] md:right-[15%] md:top-[48%] md:w-[clamp(60px,10vw,120px)] ${
            heroVisible ? 'opacity-100 rotate-15 scale-100' : 'opacity-0 rotate-90 scale-75'
          }`}
        >
          <img
            src={leaf1}
            alt=""
            className="w-full h-auto object-contain filter drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
            style={{ transform: 'rotate(15deg)' }}
          />
        </div>

        {/* ── INTERSEKSI ELEMEN UTAMA (PIRING MAKANAN) — lowered on mobile ── */}
        <div
          className="pointer-events-none absolute bottom-[-5%] left-1/2 z-30 flex w-[88%] max-w-[430px] -translate-x-1/2 flex-col items-center md:bottom-[-20%] md:w-[clamp(350px,55vw,680px)] md:max-w-none"
        >
          {/* Container Piring */}
          <div className={`relative w-full transition-all duration-[1200ms] delay-400 ease-out ${
            heroVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-[0.85]'
          }`}>
            <img
              src={makanPlate}
              alt="Nasi Kapau"
              className="w-full h-auto object-contain mx-auto"
              style={{
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.35))',
              }}
            />

            {/* Small Leaf - Left of makan.png, centered */}
            <div
              className={`absolute z-40 pointer-events-none transition-all duration-[1300ms] delay-350 ease-out ${
                heroVisible ? 'opacity-90 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
              style={{
                left: '-3%',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 'clamp(50px, 7vw, 90px)',
              }}
            >
              <img src={leaf2} alt="" className="w-full h-auto object-contain" style={{ transform: 'rotate(-20deg)' }} />
            </div>
          </div>
        </div>

        {/* ── TEKS MELENGKUNG (Group.png) — lowered on mobile ── */}
        <div
          className={`pointer-events-none absolute bottom-[-12%] left-1/2 z-[35] w-[86%] max-w-[390px] -translate-x-1/2 transition-all duration-[1100ms] delay-550 ease-out sm:w-[92%] md:bottom-[-20%] md:w-[clamp(350px,55vw,680px)] md:max-w-none ${
            heroVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-12'
          }`}
        >
          <img
            src={groupText}
            alt="Cita Rasa Minang · Kaya Rempah"
            className="w-full h-auto object-contain mx-auto"
          />
        </div>

        {/* Bottom Left Leaf (leaf (3).png) */}
        <div
          className={`absolute bottom-[-4%] left-[-4%] z-30 w-[72px] pointer-events-none transition-all duration-[1600ms] delay-450 ease-out sm:w-[90px] md:bottom-[-12%] md:left-[-1%] md:w-[clamp(85px,12vw,160px)] ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <img src={leaf3} alt="" className="w-full h-auto object-contain" style={{ transform: 'rotate(-12deg)' }} />
        </div>

        {/* Bottom Right Leaf (leaf (1).png) */}
        <div
          className={`absolute bottom-[-4%] right-[-4%] z-30 w-[72px] pointer-events-none transition-all duration-[1550ms] delay-500 ease-out sm:w-[90px] md:bottom-[-12%] md:right-[-1%] md:w-[clamp(85px,12vw,160px)] ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <img src={leaf1} alt="" className="w-full h-auto object-contain" />
        </div>

      </section>

      {/* ── AREA SECTION BAWAH ── */}
      <div ref={sectionRef} className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-44 pb-0 sm:px-6 sm:pt-52 md:px-12 md:pt-64 lg:px-16">

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
                className={`bg-white rounded-[20px] p-4 flex flex-col justify-between transition-[opacity,transform] duration-[400ms] hover:-translate-y-1 ${
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
        {/* White Background Layer at the bottom (proportional to container height) */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-white pointer-events-none z-0 top-[82%] sm:top-[75%]"
        />

        {/* Background Image: Group 7 (Wavy Pink Area) — matches the white top threshold */}
        <img
          src={group7}
          alt="Group 7"
          className="absolute top-0 left-0 w-full h-[82%] sm:h-auto object-cover pointer-events-none"
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
            <div
              className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden mb-4 sm:mb-6 flex-shrink-0 mx-auto h-[180px] sm:h-[330px] w-full"
              style={{
                maxWidth: '538px',
                boxShadow: 'inset 0 4px 12px rgba(68, 70, 81, 0.4), 0 8px 24px rgba(68, 70, 81, 0.15)',
              }}
            >
              <img
                src={cardImg}
                alt="Memori Kuliner Minang Card"
                className="w-full h-full"
                style={{ objectFit: 'cover', objectPosition: 'center', transform: 'scale(1.35)' }}
              />
              {/* Inner shadow overlay */}
              <div
                className="absolute inset-0 rounded-[20px] sm:rounded-[24px] pointer-events-none"
                style={{
                  boxShadow: 'inset 0 8px 20px rgba(68, 70, 81, 0.4)',
                }}
              />
            </div>

            {/* Title — smaller on mobile */}
            <h2 className="font-poppins font-medium text-[#000000] text-[20px] sm:text-[28px] mb-2 sm:mb-3 leading-snug tracking-tight">
              Memori Kuliner Minang
            </h2>

            {/* Description — smaller on mobile */}
            <p className="font-poppins font-normal text-[#444651] text-[12px] sm:text-[14.5px] leading-relaxed mb-4 sm:mb-6">
              Uji daya ingatmu dengan mencocokkan kartu nama dan gambar kuliner khas Bukittinggi. Temukan seluruh pasangan yang sesuai untuk mempelajari berbagai hidangan tradisional dengan cara yang lebih menyenangkan.
            </p>

            {/* Button — smaller on mobile */}
            <button
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

        {/* pring.png — bottom-left corner decoration, z-10 (in front of background), pushed further down */}
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


    </div>
  );
}
