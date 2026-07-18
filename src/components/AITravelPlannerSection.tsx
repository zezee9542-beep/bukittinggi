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
        <h2 className="font-poppins font-semibold text-[#3D0000] text-[2rem] md:text-[2.4rem] mb-10 text-center tracking-tight">
          AI Travel Planner
        </h2>

        {/* Outer wrapper — gives bottom space for the overflowing images */}
        <div className="relative pb-16 sm:pb-20">
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
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[480px]">

              {/* ── LEFT: Mockup images ── */}
              <div
                className="relative flex items-end justify-start overflow-visible"
                style={{ minHeight: '480px', paddingTop: '24px', paddingLeft: '24px', paddingBottom: 0 }}
              >
                {/* ss.png — main table, overflows bottom */}
                <div
                  className="relative z-10"
                  style={{
                    width: '78%',
                    marginLeft: '16px',
                    marginBottom: '-50px',
                  }}
                >
                  <img
                    src={ssImage}
                    alt="Travel Planner Table"
                    className="w-full h-auto object-cover rounded-[14px] shadow-2xl"
                  />
                </div>

                {/* Calendar.png — centered vertically, overlapping right side of ss.png (bigger, no white border) */}
                <div
                  className="absolute z-20"
                  style={{
                    width: '44%',
                    right: '24px',
                    top: '50%',
                    transform: 'translateY(-50%)',
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
              <div className="flex items-center justify-center py-8 pr-8 pl-4 lg:pl-6">
                <img
                  src={contentRightSvg}
                  alt="AI Travel Planner Steps"
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: '480px' }}
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
