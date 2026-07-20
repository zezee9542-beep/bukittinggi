import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import ssPng from '../assets/ss.png';
import calendarPng from '../assets/Calendar.png';
import pdfSvg from '../assets/pdf.svg';

export const AITravelPlannerPromoCard: React.FC = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });

  const steps = [
    { num: 1, text: 'Beri tahu tujuan wisata' },
    { num: 2, text: 'Asal Perjalanan' },
    { num: 3, text: 'Teman Perjalanan' },
    { num: 4, text: 'Waktu Kunjungan' },
    { num: 5, text: 'Minat Perjalanan' },
  ];

  return (
    <section
      ref={ref}
      className="w-full relative z-30 py-20 sm:py-28 lg:py-32 px-4 sm:px-6 md:px-8 bg-white flex flex-col items-center justify-center border-none outline-none overflow-hidden"
    >
      {/* ── Section Title: AI Travel Planner ✨ ── */}
      <div
        className={`flex items-center justify-center gap-3 mb-12 sm:mb-16 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h2 className="font-poppins font-semibold text-[32px] sm:text-[40px] lg:text-[46px] text-[#531717] tracking-tight">
          AI Travel Planner
        </h2>
        <span className="text-[32px] sm:text-[40px] text-[#F9CE65] animate-pulse">✨</span>
      </div>

      {/* ── Main Dark Red Container & Floating Badge Wrapper ── */}
      <div
        className={`relative w-full max-w-[1020px] transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        {/* Dark Red Rounded Card (#5F1712 / #531717) */}
        <div
          className="relative w-full min-h-[440px] lg:h-[470px] rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between shadow-[0_25px_65px_rgba(0,0,0,0.4)] overflow-visible"
          style={{ backgroundColor: '#5F1712' }}
        >
          {/* ── Left Side: Stacked Document (ss.png) & Calendar (Calendar.png) ── */}
          <div className="relative w-full lg:w-[490px] h-[320px] sm:h-[370px] lg:h-[400px] flex items-center justify-center flex-shrink-0 mb-8 lg:mb-0">
            {/* 1. Paper Document Screenshot (ss.png) */}
            <div className="absolute left-0 top-0 sm:top-2 w-[85%] sm:w-[88%] lg:w-[90%] h-auto z-10 transform -rotate-1 origin-bottom-left">
              <img
                src={ssPng}
                alt="Itinerary Document Mockup"
                className="w-full h-auto object-contain rounded-[20px] sm:rounded-[24px] shadow-[0_20px_45px_rgba(0,0,0,0.38)] select-none pointer-events-none"
                draggable={false}
              />
            </div>

            {/* 2. Overlapping Calendar Image (Calendar.png) */}
            <div className="absolute right-0 sm:right-2 bottom-0 sm:bottom-2 w-[52%] sm:w-[50%] lg:w-[52%] h-auto z-20 transform rotate-1 origin-bottom-right">
              <img
                src={calendarPng}
                alt="Interactive Calendar Popover"
                className="w-full h-auto object-contain rounded-[18px] sm:rounded-[22px] shadow-[0_22px_50px_rgba(0,0,0,0.45)] select-none pointer-events-none"
                draggable={false}
              />
            </div>
          </div>

          {/* ── Right Side: 5 Step Items List ── */}
          <div className="flex-1 flex flex-col justify-center items-start gap-5 sm:gap-6 lg:pl-10 text-left w-full">
            {steps.map((step) => (
              <div key={step.num} className="flex items-center gap-4 group cursor-pointer select-none">
                {/* Step Circle: #F9CE65 background, #531717 text */}
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-poppins font-bold text-[16px] sm:text-[17px] shadow-md flex-shrink-0 transition-transform group-hover:scale-110 duration-300"
                  style={{ backgroundColor: '#F9CE65', color: '#531717' }}
                >
                  {step.num}
                </div>
                {/* Step Label: Poppins Medium 17px/18px White */}
                <span className="font-poppins font-medium text-white text-[16px] sm:text-[18px] lg:text-[19px] tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                  {step.text}
                </span>
              </div>
            ))}
          </div>

          {/* Floating Badge (Overlapping Right Side of Card) */}
          <div className="absolute right-[-15px] sm:right-[-25px] lg:right-[-45px] top-[40%] sm:top-[38%] bg-white rounded-[22px] shadow-[0_20px_45px_rgba(0,0,0,0.22)] p-3.5 sm:p-4.5 flex items-center gap-3.5 z-30 border border-neutral-100 transform rotate-[7deg] select-none hover:rotate-0 transition-transform duration-300">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 border border-red-100">
              <img src={pdfSvg} alt="PDF" className="w-6 h-6 object-contain" />
            </div>
            <div className="flex flex-col text-left pr-2">
              <span className="font-poppins font-bold text-[13px] sm:text-[14px] leading-tight" style={{ color: '#531717' }}>
                Gratis Unduh
              </span>
              <span className="font-poppins font-bold text-[13px] sm:text-[14px] leading-tight" style={{ color: '#531717' }}>
                Rundown PDF
              </span>
            </div>
          </div>
        </div>

        {/* ── Bottom Right CTA Button: Mulai → ── */}
        <div className="w-full flex justify-end mt-6">
          <button
            onClick={() => navigate('/travel-planner')}
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-[14px] font-poppins font-medium text-[16px] text-white hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-xl cursor-pointer select-none"
            style={{ backgroundColor: '#531717' }}
          >
            <span>Mulai</span>
            <span className="group-hover:translate-x-1 transition-transform duration-300 text-[18px]">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AITravelPlannerPromoCard;
