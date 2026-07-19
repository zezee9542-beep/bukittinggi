import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import rectangleBg from '../assets/Rectangle.jpg';
import ssImage from '../assets/ss.png';
import calendarSvg from '../assets/Calendar.png';
import contentRightSvg from '../assets/Content Right.svg';
import pdfPng from '../assets/pdf.png';
import starPng from '../assets/star.png';

export const AITravelPlannerSection: React.FC = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="py-14 px-4 md:px-8 lg:px-16"
    >
      <div className="max-w-[1150px] mx-auto">

        {/* ── Section Title ── */}
        <div
          className={`flex items-center justify-center gap-3 mb-10 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h2
            className="font-poppins font-semibold text-[#3D0000] text-[1.5rem] sm:text-[2rem] md:text-[2.4rem] tracking-tight"
          >
            AI Travel Planner
          </h2>
          <img
            src={starPng}
            alt=""
            className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain flex-shrink-0"
            draggable={false}
          />
        </div>

        {/* ── Card Wrapper ── */}
        <div
          className={`relative transition-all duration-700 delay-150 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* ── Card (Overflow-visible to let mockup hang outside) ── */}
          <div className="relative rounded-[28px] shadow-2xl">

            {/* Dark-red background (wrapped in absolute rounded container to keep it bounded) */}
            <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${rectangleBg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              {/* Subtle dark overlay for depth */}
              <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* ── Card Content: 2-column grid ── */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-[380px]">

              {/* ════ LEFT COLUMN: Mock UI screenshots ════ */}
              <div className="relative flex items-end justify-center overflow-visible px-6 pt-8 pb-0 sm:px-10 lg:px-0 lg:pt-10 lg:pb-0">

                {/* ss.png — itinerary table, shrunk slightly and positioned to hang outside the card bottom */}
                <div
                  className="relative z-10 w-[84%] sm:w-[74%] lg:w-[72%]"
                  style={{
                    marginBottom: '-50px', // hangs outside card bottom
                    marginLeft: 'clamp(0px, 2%, 16px)',
                    marginTop: '8px',
                  }}
                >
                  <img
                    src={ssImage}
                    alt="Travel Planner Table"
                    className="h-auto w-full rounded-[14px] object-cover shadow-2xl"
                  />
                </div>

                {/* Calendar.svg — overlapping, shifted further right and lowered slightly */}
                <div
                  className="absolute z-20 hidden lg:block"
                  style={{
                    width: '45%',
                    left: '83%',
                    top: '59%', // Lowered from 52%
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <img
                    src={calendarSvg}
                    alt="Calendar"
                    className="w-full h-auto object-contain drop-shadow-2xl"
                    draggable={false}
                  />
                </div>

              </div>


              {/* ════ RIGHT COLUMN: Content Right SVG (stepper) ════ */}
              <div className="relative flex items-center justify-center p-4 sm:p-5 lg:p-6">
                {/* Content Right.svg — restored to a larger size to match the photo */}
                <img
                  src={contentRightSvg}
                  alt="AI Travel Planner Steps"
                  className="w-full h-auto max-h-[350px] object-contain"
                  draggable={false}
                />
              </div>

            </div>

            {/* ── pdf.png — placed on the border of the bg card (scaled up to match the photo) ── */}
            <div
              className="absolute z-30 animate-pdf-float right-[-30px] sm:right-[-50px] md:right-[-70px] lg:right-[-95px]"
              style={{
                top: '25%',
                transform: 'translateY(-50%)',
              }}
            >
              <img
                src={pdfPng}
                alt="Gratis Unduh Rundown PDF"
                className="w-[150px] sm:w-[180px] md:w-[210px] lg:w-[230px] h-auto object-contain drop-shadow-2xl"
                draggable={false}
              />
            </div>


          </div>

          {/* ── Mulai button — placed below the bg card with the same color as the card ── */}
          <div className="flex justify-end mt-16 pr-4 sm:pr-8">
            <button
              onClick={() => navigate('/travel-planner')}
              className="flex items-center gap-2.5 px-8 py-3 rounded-xl font-poppins font-medium text-[16px] text-white bg-[#5F1712] hover:bg-[#4E130E] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-md cursor-pointer"
              style={{
                boxShadow: '0 4px 14px rgba(95,23,18,0.2)',
              }}
            >
              <span>Mulai</span>
              <span className="text-[16px]">→</span>
            </button>
          </div>

        </div>
      </div>

      {/* Floating animation keyframes */}
      <style>{`
        @keyframes pdfFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-pdf-float {
          animation: pdfFloat 2.8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};
