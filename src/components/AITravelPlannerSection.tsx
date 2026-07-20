import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import bukittinggiSvg from '../assets/Bukittinggi.svg';
import menaraWebp from '../assets/menara.webp';
import earthPng from '../assets/earth.webp';
import ppPng from '../assets/pp.webp';

export const AITravelPlannerSection: React.FC = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="relative z-20 bg-white pt-36 sm:pt-48 md:pt-60 w-full overflow-hidden flex flex-col items-center border-none outline-none"
    >
      {/* ════ Floating Premium Card (Sized to fit larger typography & earth.png) ════ */}
      <div className="w-full max-w-[1000px] px-4 sm:px-6 relative z-30 -mb-[180px] sm:-mb-[220px] md:-mb-[250px]">
        <div
          className={`relative w-full min-h-[440px] sm:min-h-[490px] lg:h-[520px] rounded-[28px] sm:rounded-[38px] shadow-[0_22px_55px_rgba(0,0,0,0.35)] overflow-visible transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ backgroundColor: '#5C1616' }}
        >
          {/* Decorative Earth Image in bottom-right corner — Significantly Larger */}
          <img
            src={earthPng}
            alt=""
            className="absolute bottom-0 right-0 w-[110%] sm:w-[95%] lg:w-[88%] h-auto object-contain pointer-events-none opacity-65 z-0 rounded-br-[28px] sm:rounded-br-[38px] select-none scale-105 origin-bottom-right"
            draggable={false}
          />

          {/* ── Left Image: Jam Gadang Tower (menara.webp) ── */}
          <div className="absolute left-[-42px] sm:left-[-32px] lg:left-[-42px] bottom-0 z-30 pointer-events-none flex items-end">
            <img
              src={menaraWebp}
              alt="Jam Gadang Bukittinggi"
              className="w-[250px] sm:w-[335px] md:w-[390px] lg:w-[430px] h-auto object-contain select-none drop-shadow-[0_16px_35px_rgba(0,0,0,0.38)]"
              draggable={false}
              style={{
                marginBottom: '-4px',
              }}
            />
          </div>

          {/* ── Right Content Area — Larger Typography ── */}
          <div className="relative z-20 flex flex-col justify-center items-start h-full min-h-[inherit] pt-8 pb-7 sm:pt-10 sm:pb-9 px-6 sm:px-10 md:pl-[250px] lg:pl-[290px] md:pr-10 lg:pr-12 text-left">
            
            {/* Title: Bukittinggi.svg — Larger */}
            <div className="mb-2 sm:mb-2.5">
              <img
                src={bukittinggiSvg}
                alt="Bukittinggi"
                className="h-[54px] sm:h-[74px] lg:h-[90px] w-auto object-contain object-left select-none"
                draggable={false}
              />
            </div>

            {/* Subtitle: Poppins Medium — Larger */}
            <h2 className="font-poppins font-medium text-white text-[23px] sm:text-[32px] lg:text-[40px] tracking-tight leading-tight mb-3 sm:mb-3.5">
              The Heart Of Minangkabau
            </h2>

            {/* Description: Poppins Regular — Significantly Larger */}
            <p className="font-poppins font-normal text-white text-[13.5px] sm:text-[15.5px] lg:text-[17px] leading-[1.8] max-w-[600px] mb-5 sm:mb-6 text-white/95">
              Bukittinggi adalah permata di dataran tinggi Sumatera Barat, dikenal dengan udara sejuk, panorama alam yang memikat, dan budaya Minangkabau yang memikat. Sebagai salah satu kota bersejarah dan destinasi wisata unggulan di Indonesia, Di pusat kota berdiri Jam Gadang, ikon kebanggaan yang menjadi simbol sejarah dan warisan masyarakatnya.
            </p>

            {/* Call-to-Action Button */}
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

      {/* ── Full Width Image pp.png ── */}
      <div
        className={`w-full border-none outline-none transition-all duration-800 ease-out relative z-10 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <img
          src={ppPng}
          alt="AI Travel Planner Feature"
          className="w-full h-auto block border-none outline-none select-none pointer-events-none"
          draggable={false}
        />
      </div>

      {/* ── Clean Bottom Section with background #6E1F1F ── */}
      <div 
        className="w-full py-16 sm:py-24 md:py-32 border-none outline-none"
        style={{ backgroundColor: '#6E1F1F' }}
      />
    </section>
  );
};

export default AITravelPlannerSection;
