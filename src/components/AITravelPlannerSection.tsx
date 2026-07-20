import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import bukittinggiSvg from '../assets/Bukittinggi.svg';
import menaraWebp from '../assets/menara.webp';
import earthPng from '../assets/earth.webp';
import ppPng from '../assets/pp.webp';

// ── Assets for Ambo RancakBot Promo Card ──
import hpPng from '../assets/hp.png';
import ysPng from '../assets/ys.png';
import ctPng from '../assets/ct.png';
import jamPng from '../assets/jam.png';

export const AITravelPlannerSection: React.FC = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });

  const handleOpenBot = () => {
    window.dispatchEvent(new Event('open-rancak-bot'));
  };

  return (
    <section
      ref={ref}
      className="relative z-20 bg-white pt-36 sm:pt-48 md:pt-60 w-full overflow-hidden flex flex-col items-center border-none outline-none"
    >
      {/* ════ Floating Premium Card: Heart Of Minangkabau (menara.webp) ════ */}
      <div className="w-full max-w-[1000px] px-4 sm:px-6 relative z-30 -mb-[180px] sm:-mb-[220px] md:-mb-[250px]">
        <div
          className={`relative w-full min-h-[440px] sm:min-h-[490px] lg:h-[520px] rounded-[28px] sm:rounded-[38px] shadow-[0_22px_55px_rgba(0,0,0,0.35)] overflow-visible transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ backgroundColor: '#5C1616' }}
        >
          {/* Decorative Earth Image in bottom-right corner */}
          <img
            src={earthPng}
            alt=""
            className="absolute bottom-0 right-0 w-[110%] sm:w-[95%] lg:w-[88%] h-auto object-contain pointer-events-none opacity-65 z-0 rounded-br-[28px] sm:rounded-br-[38px] select-none scale-105 origin-bottom-right"
            draggable={false}
          />

          {/* ── Left Image: Jam Gadang Tower (menara.webp) — Background layer on mobile (<md), full on desktop (md+) ── */}
          <div className="absolute left-[-25px] sm:left-[-32px] lg:left-[-42px] bottom-0 z-0 md:z-30 pointer-events-none flex items-end opacity-25 md:opacity-100">
            <img
              src={menaraWebp}
              alt="Jam Gadang Bukittinggi"
              className="w-[200px] sm:w-[310px] md:w-[390px] lg:w-[430px] h-auto object-contain select-none drop-shadow-[0_16px_35px_rgba(0,0,0,0.38)]"
              draggable={false}
              style={{ marginBottom: '-4px' }}
            />
          </div>

          {/* ── Right Content Area ── */}
          <div className="relative z-20 flex flex-col justify-center items-start h-full min-h-[inherit] pt-8 pb-7 sm:pt-10 sm:pb-9 px-6 sm:px-10 md:pl-[250px] lg:pl-[290px] md:pr-10 lg:pr-12 text-left">
            <div className="mb-2 sm:mb-2.5">
              <img
                src={bukittinggiSvg}
                alt="Bukittinggi"
                className="h-[54px] sm:h-[74px] lg:h-[90px] w-auto object-contain object-left select-none"
                draggable={false}
              />
            </div>

            <h2 className="font-poppins font-medium text-white text-[23px] sm:text-[32px] lg:text-[40px] tracking-tight leading-tight mb-3 sm:mb-3.5">
              The Heart Of Minangkabau
            </h2>

            <p className="font-poppins font-normal text-white text-[13.5px] sm:text-[15.5px] lg:text-[17px] leading-[1.8] max-w-[600px] mb-5 sm:mb-6 text-white/95">
              Bukittinggi adalah permata di dataran tinggi Sumatera Barat, dikenal dengan udara sejuk, panorama alam yang memikat, dan budaya Minangkabau yang memikat. Sebagai salah satu kota bersejarah dan destinasi wisata unggulan di Indonesia, Di pusat kota berdiri Jam Gadang, ikon kebanggaan yang menjadi simbol sejarah dan warisan masyarakatnya.
            </p>

            <div className="w-full flex justify-end mt-1">
              <button
                onClick={() => navigate('/profil-bukittinggi')}
                className="group inline-flex items-center gap-2.5 px-7 py-3 sm:px-8 sm:py-3.5 rounded-[14px] font-poppins font-medium text-[14.5px] sm:text-[16px] text-[#5C1616] bg-white hover:bg-neutral-100 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-xl cursor-pointer border border-white/20 select-none"
              >
                <span>Profil Bukittinggi</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Full Width Image pp.png (Seamless bottom connection without gap) ── */}
      <div
        className={`w-full border-none outline-none transition-all duration-800 ease-out relative z-10 -mb-1 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <img
          src={ppPng}
          alt="AI Travel Planner Feature"
          className="w-full h-auto block border-none outline-none select-none pointer-events-none -mb-1"
          draggable={false}
        />
      </div>

      {/* ════ Section Ambo RancakBot Promo Card (Background #6E1F1F - Merged seamlessly, front-most layer) ════ */}
      <div
        className="w-full relative z-30 pt-12 sm:pt-16 md:pt-20 pb-24 sm:pb-32 lg:pb-40 px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center border-none outline-none overflow-hidden -mt-1"
        style={{ backgroundColor: '#6E1F1F' }}
      >
        {/* ── Card Container ── */}
        <div
          className={`relative w-full max-w-[1020px] min-h-[420px] lg:h-[425px] rounded-[28px] sm:rounded-[34px] bg-white shadow-[0_30px_70px_rgba(0,0,0,0.45)] overflow-visible z-40 flex flex-col md:flex-row items-center transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Watermark Layer Background (jam.png) inside card - Prominently visible in bottom-right corner */}
          <img
            src={jamPng}
            alt="Jam Gadang Motif"
            className="absolute right-0 bottom-0 w-[180px] sm:w-[240px] md:w-[280px] lg:w-[320px] h-auto object-contain pointer-events-none select-none opacity-85 z-10 rounded-br-[28px] sm:rounded-br-[34px]"
            draggable={false}
          />

          {/* ── Left Smartphone Image Container (hp.png - Responsive Mobile Stacking) ── */}
          <div className="relative md:absolute left-0 md:left-[-25px] lg:left-[-40px] bottom-0 z-50 flex items-end justify-center pointer-events-none self-center md:self-auto pt-6 md:pt-0 -mt-12 md:-mt-24">
            <img
              src={hpPng}
              alt="Ambo RancakBot App Mockup"
              className="w-[250px] sm:w-[340px] md:w-[480px] lg:w-[540px] h-auto object-contain select-none drop-shadow-[0_24px_50px_rgba(0,0,0,0.52)]"
              draggable={false}
              style={{
                marginBottom: '0px',
              }}
            />
          </div>

          {/* ── Right Content Area ── */}
          <div className="relative z-20 flex-1 flex flex-col justify-between items-start h-full py-7 sm:py-9 px-6 sm:px-10 md:pl-[410px] lg:pl-[460px] md:pr-10 lg:pr-12 text-left">
            
            {/* Top Group: Bubble & Headline & Description */}
            <div className="w-full">
              {/* 1. AI Technology Badge: bg #F9CE65, Poppins Medium text #531717 */}
              <div
                className="w-[234px] h-[40px] rounded-full flex items-center justify-center gap-2 mb-4 shadow-sm select-none"
                style={{ backgroundColor: '#F9CE65' }}
              >
                <span className="font-poppins font-semibold text-[14.5px] sm:text-[15.5px] tracking-tight" style={{ color: '#531717' }}>
                  ✨ Didukung Teknologi AI
                </span>
              </div>

              {/* 2. Headline: Poppins SemiBold 40px, color #531717 */}
              <h2
                className="font-poppins font-semibold text-[28px] sm:text-[34px] lg:text-[40px] leading-tight mb-3"
                style={{ color: '#531717' }}
              >
                Tanya Ambo RancakBot
              </h2>

              {/* 3. Description: Poppins Regular 16px, color #000000 */}
              <p
                className="font-poppins font-normal text-[14px] sm:text-[15.5px] lg:text-[16px] leading-[1.65] max-w-[550px] mb-5 text-black/85"
              >
                Tidak menemukan informasi yang Anda cari? Tanyakan langsung kepada Ambo RancakBot dan dapatkan jawaban yang lebih personal, lengkap, dan sesuai kebutuhan Anda.
              </p>

              {/* 4. Checklist Items with Icon ys.png (Poppins Medium 16px, color #531717) */}
              <div className="flex flex-col gap-2.5 mb-6">
                <div className="flex items-center gap-3">
                  <img src={ysPng} alt="Check" className="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0" />
                  <span className="font-poppins font-medium text-[14.5px] sm:text-[16px]" style={{ color: '#531717' }}>
                    Eksplorasi sejarah Bukittinggi lebih mendalam
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <img src={ysPng} alt="Check" className="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0" />
                  <span className="font-poppins font-medium text-[14.5px] sm:text-[16px]" style={{ color: '#531717' }}>
                    Rekomendasi destinasi sesuai kebutuhan Anda
                  </span>
                </div>
              </div>
            </div>

            {/* 5. CTA Button: bg #6E1F1F, radius 12px, icon ct.png */}
            <div className="w-full flex justify-end mt-2">
              <button
                onClick={handleOpenBot}
                className="group inline-flex items-center justify-center gap-2.5 px-6 py-3 sm:px-7 sm:py-3.5 rounded-[12px] font-poppins font-medium text-[15px] sm:text-[16px] text-white hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-lg cursor-pointer select-none"
                style={{ backgroundColor: '#6E1F1F' }}
              >
                <span>Mulai Bertanya</span>
                <img src={ctPng} alt="" className="w-5 h-5 object-contain transition-transform group-hover:rotate-12 duration-300" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AITravelPlannerSection;
