import { useEffect } from 'react';
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
import coverBg from '../assets/cover.png';    

export function KulinerPage() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal<HTMLElement>({ threshold: 0.01 });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    /* 
      [LAYER 0 - PALING BELAKANG] 
      cover.png sebagai background dasar seluruh halaman
    */
    <div 
      className="relative min-h-screen overflow-x-hidden select-none"
      style={{
        backgroundImage: `url(${coverBg})`,
        backgroundSize: 'cover',
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
          className="w-full h-auto block relative z-[1] -mt-[8%]" 
        />

        {/* ── [LAYER 2] 14.PNG (Overlay Gradient Merah) ── */}
        <div
          className="absolute inset-0 z-[2] -mt-[8%]"
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
          className={`absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 z-10 text-center w-full px-4 transition-all duration-700 delay-100 ${
            heroVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
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
          className={`absolute top-[8%] right-[5%] sm:right-[6%] z-10 flex items-center gap-2.5 rounded-[12px] px-4 py-2.5 shadow-md transition-all duration-700 delay-200 ${
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
        
        {/* Left Large Leaf (leaf.png) -> DITURUNKAN KE TOP-[35%] */}
        <div
          className={`absolute left-[-2%] top-[35%] z-20 pointer-events-none transition-all duration-[1200ms] ${
            heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}
          style={{ width: 'clamp(120px, 18vw, 240px)' }}
        >
          <img 
            src={leafBig} 
            alt="" 
            className="w-full h-auto object-contain filter drop-shadow(0 6px 12px rgba(0,0,0,0.3))" 
          />
        </div>

        {/* Small Leaf - Kanan Judul */}
        <div
          className={`absolute z-20 pointer-events-none transition-all duration-[1200ms] delay-150 ${
            heroVisible ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
          style={{ right: '12%', top: '25%', width: 'clamp(65px, 9vw, 120px)' }}
        >
          <img src={leaf2} alt="" className="w-full h-auto object-contain filter drop-shadow(0 4px 8px rgba(0,0,0,0.2)) blur-[1px]" style={{ transform: 'rotate(25deg)' }} />
        </div>

        {/* Small Leaf - Di bawah badge */}
        <div
          className={`absolute z-20 pointer-events-none transition-all duration-[1200ms] delay-200 ${
            heroVisible ? 'opacity-85 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ right: '5%', top: '38%', width: 'clamp(50px, 7vw, 95px)' }}
        >
          <img src={leaf2} alt="" className="w-full h-auto object-contain filter drop-shadow(0 4px 8px rgba(0,0,0,0.18))" style={{ transform: 'rotate(-15deg) scaleX(-1)' }} />
        </div>

        {/* ── INTERSEKSI ELEMEN UTAMA (PIRING MAKANAN & TEKS MEPEt) ── */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center"
          style={{
            width: 'clamp(310px, 45vw, 550px)',
            bottom: '-22%', 
          }}
        >
          {/* Container Piring */}
          <div className={`relative w-full transition-all duration-700 delay-300 ${
            heroVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
          }`}>
            <img
              src={makanPlate}
              alt="Nasi Kapau"
              className="w-full h-auto object-contain mx-auto"
              style={{
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.35))',
              }}
            />

            {/* Small Leaf Near Food Plate */}
            <div
              className="absolute z-40 pointer-events-none"
              style={{ left: '2%', bottom: '16%', width: '18%' }}
            >
              <img src={leaf3} alt="" className="w-full h-auto object-contain" style={{ transform: 'rotate(12deg)' }} />
            </div>
          </div>

          {/* Teks Melengkung (Group.png) */}
          <div
            className={`w-[85%] -mt-3 sm:-mt-4 transition-all duration-700 delay-500 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <img
              src={groupText}
              alt="Cita Rasa Minang · Kaya Rempah"
              className="w-full h-auto object-contain mx-auto"
            />
          </div>
        </div>

        {/* Bottom Right Leaf (leaf (1).png) */}
        <div
          className="absolute z-30 pointer-events-none"
          style={{ right: '-1%', bottom: '-12%', width: 'clamp(85px, 12vw, 160px)' }}
        >
          <img src={leaf1} alt="" className="w-full h-auto object-contain filter drop-shadow(0 6px 10px rgba(0,0,0,0.2))" />
        </div>

      </section>

      {/* ── AREA SECTON BAWAH (BERLATAR MARBLE PUTIH) ── */}
      <div className="w-full min-h-[400px] pt-44 relative z-10">
        {/* Sisa konten halaman */}
      </div>

    </div>
  );
}