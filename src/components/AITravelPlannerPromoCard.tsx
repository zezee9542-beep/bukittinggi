import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import ssPng from '../assets/ss.webp';
import calendarPng from '../assets/Calendar.webp';
import pdfPng from '../assets/pdf.webp';

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
        className={`flex items-center justify-center gap-3 mb-12 sm:mb-16 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
      >
        <h2 className="font-poppins font-semibold text-[32px] sm:text-[40px] lg:text-[46px] text-[#531717] tracking-tight">
          AI Travel Planner
        </h2>
        <span className="text-[32px] sm:text-[40px] text-[#F9CE65] animate-pulse">✨</span>
      </div>

      {/* ── Main Dark Red Container & Floating Badge Wrapper ── */}
      <div
        className={`relative w-full max-w-[1020px] transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
      >
        {/* Dark Red Rounded Card (#5F1712 / #531717) */}
        <div
          className="relative w-full min-h-[440px] lg:h-[470px] rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between shadow-[0_25px_65px_rgba(0,0,0,0.4)] overflow-visible"
          style={{ backgroundColor: '#5F1712' }}
        >
          {/* ── Left Side: Stacked Document (ss.webp) & Calendar (Calendar.webp) ── */}
          <div className="relative w-full lg:w-[490px] h-[320px] sm:h-[370px] lg:h-[400px] flex items-center justify-center flex-shrink-0 mb-8 lg:mb-0">
            {/* 1. Paper Document Screenshot (ss.webp) — Straight */}
            <div className="absolute left-0 top-0 sm:top-2 w-[85%] sm:w-[88%] lg:w-[90%] h-auto z-10">
              <img
                src={ssPng}
                alt="Itinerary Document Mockup"
                className="w-full h-auto object-contain rounded-[20px] sm:rounded-[24px] shadow-[0_20px_45px_rgba(0,0,0,0.38)] select-none pointer-events-none"
                draggable={false}
              />
            </div>

            {/* 2. Calendar Image (Calendar.webp) — Straight, no wrapper box, shifted right */}
            <div className="absolute right-[-20px] sm:right-[-35px] lg:right-[-50px] bottom-0 sm:bottom-2 w-[54%] sm:w-[52%] lg:w-[54%] h-auto z-20">
              <img
                src={calendarPng}
                alt="Interactive Calendar Popover"
                className="w-full h-auto object-contain select-none pointer-events-none"
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

          {/* Floating pdf.webp badge — tilted right + float up-down animation */}
          <img
            src={pdfPng}
            alt="PDF"
            className="absolute right-[-35px] sm:right-[-50px] lg:right-[-70px] top-[14%] sm:top-[12%] w-[110px] sm:w-[130px] lg:w-[155px] h-auto object-contain z-30 select-none pointer-events-none animate-float-vertical drop-shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
            draggable={false}
            style={{ transform: 'rotate(6deg)', animationDuration: '3.2s' }}
          />
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
