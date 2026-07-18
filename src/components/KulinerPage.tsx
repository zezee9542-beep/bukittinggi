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
import groupText from '../assets/Group.png';  
import group6 from '../assets/Group 6.png';  
import group7 from '../assets/Group 7.png';  
import coverBg from '../assets/cover.png';    

// ── Icons & Culinary Assets ────────────────────────────────────────
import mknIcon from '../assets/mkn.png';
import mnsIcon from '../assets/mns.png';
import drnkIcon from '../assets/drnk.png';

import katupekImg from '../assets/katupek_kapau.png';
import itiakImg from '../assets/itiak_lado_mudo.png';
import tambusuImg from '../assets/gulai_tambusu.png';
import cancangImg from '../assets/gulai_cancang.png';
import dendengImg from '../assets/dendeng_batokok.png';
import tunjangImg from '../assets/gulai_tunjang.png';
import apopImg from '../assets/ayam_pop.png';
import kapauImg from '../assets/gulai_kapau.png';

import galamaiImg from '../assets/galamai.png';
import wajikImg from '../assets/wajik.png';
import karakKaliangImg from '../assets/karak_kaliang.png';
import barehRandangImg from '../assets/bareh_randang.png';

import tehTaluaImg from '../assets/teh_talua.png';
import esTebakImg from '../assets/es_tebak.png';
import kopiAiaNdakImg from '../assets/kopi_aia_ndak.png';
import jusPinangImg from '../assets/jus_pinang.png';

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
      description: 'Ketupat dengan kuah gulai nangka, sayuran rebus, bihun, dan siraman bumbu pecel khas',
      image: katupekImg,
    },
    {
      id: 'mak-2',
      title: 'Itiak Lado Mudo',
      description: 'Daging bebek yang dimasak dengan racikan rempah dan cabai hijau keriting.',
      image: itiakImg,
    },
    {
      id: 'mak-3',
      title: 'Gulai Tambusu',
      description: 'Daging usus sapi diisi dengan adonan telur dan tahu, dimasak dengan racikan rempah.',
      image: tambusuImg,
    },
    {
      id: 'mak-4',
      title: 'Gulai Cancang',
      description: 'Potongan daging, tetelan, jeroan sapi/kambing yang dicincang dimasak rempah',
      image: cancangImg,
    },
    {
      id: 'mak-5',
      title: 'Dendeng Batokok',
      description: 'Daging sapi pipih berbumbu rempah khas Minang dengan sambal pedas menggugah.',
      image: dendengImg,
    },
    {
      id: 'mak-6',
      title: 'Gulai Tunjang',
      description: 'Tunjang sapi empuk dimasak dalam kuah gulai kaya rempah khas.',
      image: tunjangImg,
    },
    {
      id: 'mak-7',
      title: 'Ayam Pop',
      description: 'Ayam khas Minang yang direbus dalam air kelapa sebelum disajikan.',
      image: apopImg,
    },
    {
      id: 'mak-8',
      title: 'Gulai Kapau',
      description: 'Masakan berkuah santan dari Kapau yang disajikan bersama aneka lauk.',
      image: kapauImg,
    },
  ],
  manisan: [
    {
      id: 'mns-1',
      title: 'Galamai',
      description: 'Camilan manis sejenis dodol khas Minangkabau dengan tekstur kenyal dari kelapa dan gula aren.',
      image: galamaiImg,
    },
    {
      id: 'mns-2',
      title: 'Wajik Ketan',
      description: 'Kue ketan tradisional bercita rasa manis gula merah khas masakan rumah gadang.',
      image: wajikImg,
    },
    {
      id: 'mns-3',
      title: 'Karak Kaliang',
      description: 'Camilan khas berbahan ubi kayu dengan bentuk angka delapan yang manis dan renyah.',
      image: karakKaliangImg,
    },
    {
      id: 'mns-4',
      title: 'Bareh Randang',
      description: 'Makanan manis beraroma harum dari olahan tepung beras yang disangrai dengan air gula.',
      image: barehRandangImg,
    },
  ],
  minuman: [
    {
      id: 'drk-1',
      title: 'Teh Talua',
      description: 'Minuman teh legendaris khas Minang dengan campuran kuning telur bebek dan susu manis.',
      image: tehTaluaImg,
    },
    {
      id: 'drk-2',
      title: 'Es Tebak',
      description: 'Es campur khas Bukittinggi dengan tebak tepung beras, cincau, tape, dan sirup merah.',
      image: esTebakImg,
    },
    {
      id: 'drk-3',
      title: 'Kopi Aia Ndak',
      description: 'Kopi daun legendaris (kawa daun) khas pegunungan Minang yang diseduh hangat tradisional.',
      image: kopiAiaNdakImg,
    },
    {
      id: 'drk-4',
      title: 'Jus Pinang',
      description: 'Minuman tradisional penambah stamina khas Minang dari perasan buah pinang muda pilihan.',
      image: jusPinangImg,
    },
  ],
};

export function KulinerPage() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal<HTMLElement>({ threshold: 0.01 });
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });
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
      [LAYER 0 - PALING BELAKANG] 
      cover.png sebagai background dasar seluruh halaman
    */
    <div 
      className="relative min-h-[250vh] overflow-x-hidden select-none"
      style={{
        backgroundImage: `url(${coverBg})`,
        backgroundSize: '100% auto',
        backgroundPosition: 'center top',
        backgroundRepeat: 'repeat-y'
      }}
    >

      {/* ═══════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative w-full z-10">
        
        {/* ── [LAYER 1] SON.PNG ── */}
        <img 
          src={sonBg} 
          alt="" 
          className="w-full h-auto block relative z-[1] -mt-[4%]" 
        />

        {/* ── [LAYER 2] 14.PNG (Overlay Gradient Merah) ── */}
        <div
          className="absolute inset-0 z-[2] -mt-[4%]"
          style={{
            backgroundImage: `url(${gradientBg})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* ── [LAYER 3] KONTEN ELEMEN HERO ── */}

        {/* Judul: "Cita Rasa Bukittinggi" */}
        <div
          className={`absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 z-10 text-center w-full px-4 transition-all duration-1000 delay-150 ease-out ${
            heroVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-90'
          }`}
        >
          <h1
            className="font-poppins font-medium text-white tracking-wide"
            style={{
              fontSize: 'clamp(1.6rem, 4.2vw, 3.5rem)',
              textShadow: '0 4px 14px rgba(0,0,0,0.5)',
            }}
          >
            Cita Rasa Bukittinggi
          </h1>
        </div>

        {/* Top Right Floating Badge */}
        <div
          className={`absolute top-[8%] right-[5%] sm:right-[6%] z-10 flex items-center gap-2.5 rounded-[12px] px-4 py-2.5 shadow-md transition-all duration-800 delay-300 ease-out ${
            heroVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-12'
          }`}
          style={{
            background: 'rgba(105, 32, 32, 0.45)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div
            className="w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <img
              src={foodIcon}
              alt=""
              className="w-4 h-4 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-poppins font-medium text-white text-[10px] sm:text-[11px] mb-0.5">
              Meal Planning
            </span>
            <span className="font-poppins text-white/75 text-[9px] sm:text-[10px]">
              Assistance
            </span>
          </div>
        </div>

        {/* ── DECORATIVE LEAF ELEMENTS (ATAS) ── */}
        
        {/* Left Large Leaf (leaf.png) -> DITURUNKAN KE TOP-[25%] */}
        <div
          className={`absolute left-[-2%] top-[25%] z-20 pointer-events-none transition-all duration-[1400ms] delay-0 ease-out ${
            heroVisible ? 'opacity-100 rotate-0 translate-x-0' : 'opacity-0 -rotate-45 -translate-x-8'
          }`}
          style={{ width: 'clamp(120px, 18vw, 240px)' }}
        >
          <img 
            src={leafBig} 
            alt="" 
            className="w-full h-auto object-contain filter drop-shadow(0 6px 12px rgba(0,0,0,0.3))" 
          />
        </div>

        {/* Leaf (1).png - Right of title */}
        <div
          className={`absolute right-[15%] top-[48%] z-20 pointer-events-none transition-all duration-[1500ms] delay-200 ease-out ${
            heroVisible ? 'opacity-100 rotate-15 scale-100' : 'opacity-0 rotate-90 scale-75'
          }`}
          style={{ width: 'clamp(60px, 10vw, 120px)' }}
        >
          <img 
            src={leaf1} 
            alt="" 
            className="w-full h-auto object-contain filter drop-shadow(0 4px 8px rgba(0,0,0,0.2))" 
            style={{ transform: 'rotate(15deg)' }}
          />
        </div>



        {/* ── INTERSEKSI ELEMEN UTAMA (PIRING MAKANAN) ── */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center"
          style={{
            width: 'clamp(350px, 55vw, 680px)',
            bottom: '-20%', 
          }}
        >
          {/* Container Piring */}
          <div className={`relative w-full transition-all duration-1200 delay-400 ease-out ${
            heroVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-85'
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
                heroVisible ? 'opacity-90 rotate--20 translate-x-0' : 'opacity-0 rotate-60 -translate-x-4'
              }`}
              style={{ 
                left: '-3%', 
                top: '50%', 
                transform: 'translateY(-50%)',
                width: 'clamp(50px, 7vw, 90px)' 
              }}
            >
              <img src={leaf2} alt="" className="w-full h-auto object-contain filter drop-shadow(0 4px 8px rgba(0,0,0,0.2))" style={{ transform: 'rotate(-20deg)' }} />
            </div>

          </div>
        </div>

        {/* ── TEKS MELENGKUNG (Group.png) ── */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 z-35 pointer-events-none transition-all duration-1100 delay-550 ease-out ${
            heroVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-12'
          }`}
          style={{
            width: 'clamp(350px, 55vw, 680px)',
            bottom: '-20%', 
          }}
        >
          <img
            src={groupText}
            alt="Cita Rasa Minang · Kaya Rempah"
            className="w-full h-auto object-contain mx-auto"
          />
        </div>

        {/* Bottom Left Leaf (leaf (3).png) */}
        <div
          className={`absolute z-30 pointer-events-none transition-all duration-[1600ms] delay-450 ease-out ${
            heroVisible ? 'opacity-100 rotate--12 translate-y-0' : 'opacity-0 rotate-60 translate-y-12'
          }`}
          style={{ left: '-1%', bottom: '-12%', width: 'clamp(85px, 12vw, 160px)' }}
        >
          <img src={leaf3} alt="" className="w-full h-auto object-contain filter drop-shadow(0 6px 10px rgba(0,0,0,0.2))" style={{ transform: 'rotate(-12deg)' }} />
        </div>

        {/* Bottom Right Leaf (leaf (1).png) */}
        <div
          className={`absolute z-30 pointer-events-none transition-all duration-[1550ms] delay-500 ease-out ${
            heroVisible ? 'opacity-100 rotate-0 translate-y-0' : 'opacity-0 rotate--60 translate-y-10'
          }`}
          style={{ right: '-1%', bottom: '-12%', width: 'clamp(85px, 12vw, 160px)' }}
        >
          <img src={leaf1} alt="" className="w-full h-auto object-contain filter drop-shadow(0 6px 10px rgba(0,0,0,0.2))" />
        </div>

      </section>

      {/* ── AREA SECTION BAWAH ── */}
      <div ref={sectionRef} className="w-full pt-64 pb-0 relative z-10 px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">

        {/* ── Tab Navigation with white background ── */}
        <div className={`flex items-end bg-white rounded-t-[24px] pt-4 pl-2 transition-all duration-1000 delay-200 ease-out ${
            sectionVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
          }`} style={{
            boxShadow: '0 -4px 12px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(0,0,0,0.05)',
        }}>
          {(
            [
              { key: 'makanan' as const,  icon: mknIcon,  label: 'Makanan'  },
              { key: 'manisan' as const,  icon: mnsIcon,  label: 'Manisan'  },
              { key: 'minuman' as const,  icon: drnkIcon, label: 'Minuman'  },
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
          {/* Empty space to fill the rest */}
          <div className="flex-1 h-full bg-white pr-2"></div>
        </div>

        {/* ── White Card Panel — wraps ONLY the cards ── */}
        <div
          className={`rounded-b-[24px] p-6 sm:p-8 transition-all duration-1200 delay-400 ease-out ${
            sectionVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10'
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
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 transition-all duration-400 ease-out ${
              isAnimating 
                ? 'opacity-0 scale-95 translate-y-2' 
                : 'opacity-100 scale-100 translate-y-0'
            }`}
          >
            {KULINER_DATA[displayCategory].map((item, index) => (
              <div
                key={item.id}
                className={`bg-white rounded-[20px] p-4 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 ${
                  sectionVisible && !isAnimating
                    ? 'opacity-100 scale-100 translate-x-0 translate-y-0 rotate-0' 
                    : `opacity-0 scale-80 ${index % 2 === 0 ? '-translate-x-6' : 'translate-x-6'} translate-y-8 ${index % 3 === 0 ? '-rotate-2' : index % 3 === 1 ? 'rotate-2' : 'rotate-1'}`
                }`}
                style={{
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.07), 0 6px 20px rgba(0,0,0,0.04)',
                  transitionDelay: `${sectionVisible && !isAnimating ? index * 120 + 100 : 0}ms`,
                  transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
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
        <div className={`w-full py-16 px-4 sm:px-8 md:px-16 transition-all duration-1000 delay-600 ease-out ${
          sectionVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-12'
        }`}>
          {/* Desktop & Tablet - Horizontal Layout */}
          <div className="hidden md:flex items-center justify-between relative">
            {/* Left Image - Group 6 (Higher up) */}
            <div className="relative flex-1 flex justify-start -mt-12">
              <img 
                src={group6} 
                alt="Decorative Left" 
                className="h-auto max-w-[540px] w-full object-contain transition-all duration-1000 ease-out" 
                style={{ aspectRatio: '864 / 415' }} 
              />
            </div>
            
            {/* Whitespace in Middle */}
            <div className="w-12 md:w-24 lg:w-32"></div>
            
            {/* Right Image - Piring */}
            <div className="relative flex-1 flex justify-end pr-4 sm:pr-8">
              <img 
                src={makanPlate} 
                alt="Decorative Right" 
                className="h-auto max-w-[400px] w-full object-contain transition-all duration-1000 delay-100 ease-out" 
              />
            </div>
          </div>
          
          {/* Mobile - Vertical Layout */}
          <div className="md:hidden flex flex-col items-center gap-8">
            <img 
              src={group6} 
              alt="Decorative Top" 
              className="w-[90%] max-w-[430px] h-auto object-contain transition-all duration-1000 ease-out" 
              style={{ aspectRatio: '864 / 415' }} 
            />
            <img 
              src={makanPlate} 
              alt="Decorative Bottom" 
              className="w-[90%] max-w-[380px] h-auto object-contain transition-all duration-1000 delay-150 ease-out" 
            />
          </div>
        </div>

      </div>

      {/* ── Group 7 Image (Full Width) ── */}
      <div className={`w-full transition-all duration-1000 delay-700 ease-out ${
          sectionVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-12'
        }`}>
          <img 
            src={group7} 
            alt="Group 7" 
            className="w-full h-auto object-cover" 
          />
      </div>

    </div>
  );
}