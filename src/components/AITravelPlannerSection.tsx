import React from 'react';
import rectangleBg from '../assets/Rectangle.jpg';
import ssImage from '../assets/ss.png';
import calendarImage from '../assets/Calendar.png';
import contentRightSvg from '../assets/Content Right.svg';

export const AITravelPlannerSection: React.FC = () => {
  return (
    <section
      className="py-14 px-4 md:px-8 lg:px-16"
    >
      <div className="max-w-[1150px] mx-auto">
        {/* Section Title */}
        <h2 className="font-poppins font-semibold text-[#3D0000] text-[1.5rem] sm:text-[2rem] md:text-[2.4rem] mb-10 text-center tracking-tight">
          AI Travel Planner
        </h2>

        {/* Outer wrapper — gives bottom space for the overflowing images */}
        <div className="relative pb-12 sm:pb-16">
          {/* ── Card (Extended) ── */}
          <div className="relative rounded-[24px] shadow-xl overflow-visible">
            {/* Dark-red background */}
            <div
              className="absolute inset-0 rounded-[24px] overflow-hidden"
              style={{
                backgroundImage: `url(${rectangleBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            {/* Card content */}
            <div className="relative z-10 grid grid-cols-1 gap-0 lg:grid-cols-2">

              {/* ── LEFT: Mockup images ── */}
              <div className="relative flex min-h-[280px] items-end justify-center overflow-visible px-5 pt-7 sm:min-h-[325px] sm:px-8 lg:min-h-[360px] lg:justify-start lg:px-0 lg:pt-8">
                {/* ss.png — main table, overflows bottom */}
                <div
                  className="relative z-10"
                  className="relative z-10 mb-[-28px] w-[88%] sm:mb-[-34px] sm:w-[76%] lg:mb-[-36px] lg:ml-6 lg:w-[76%]"
                >
                  <img
                    src={ssImage}
                    alt="Travel Planner Table"
                    className="h-auto w-full rounded-[14px] object-cover shadow-2xl"
                  />
                </div>

                {/* Calendar.png — centered vertically, overlapping right side of ss.png (bigger, no white border) */}
                <div
                  className="absolute z-20 hidden lg:block"
                  style={{
                    width: '46%',
                    left: '72%',
                    top: '54%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <img
                    src={calendarImage}
                    alt="Calendar"
                    className="w-full h-auto object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* ── RIGHT: Content Right SVG image (stepper text visual) ── */}
              <div className="flex items-center justify-center px-5 py-6 lg:px-8 lg:py-5">
                <img
                  src={contentRightSvg}
                  alt="AI Travel Planner Steps"
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: '355px' }}
                  draggable={false}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
