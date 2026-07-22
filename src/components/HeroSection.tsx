import { useState } from 'react';
import bg4Png from '../assets/bg4.webp';
import bgMobilePng from '../assets/image copy 2.png';

// Card images ordered from a.webp to g.webp (WebP for performance)
import imgA from '../assets/a.webp';
import imgB from '../assets/b.webp';
import imgC from '../assets/c.webp';
import imgD from '../assets/d.webp';
import imgE from '../assets/e.webp';
import imgF from '../assets/f.webp';
import imgG from '../assets/g.webp';

interface HeroCardItem {
  id: string;
  title: string;
  category: string;
  image: string;
}

const BASE_CARDS: HeroCardItem[] = [
  { id: 'a', title: 'Air Terjun Lembah Anai', category: 'WISATA ALAM', image: imgA },
  { id: 'b', title: 'Ampiang Dadiah', category: 'KULINER MINANG', image: imgB },
  { id: 'c', title: 'Rumah Gadang', category: 'ARSITEKTUR', image: imgC },
  { id: 'd', title: 'Pakaian Adat Minang', category: 'BUDAYA & TRADISI', image: imgD },
  { id: 'e', title: 'Jam Gadang', category: 'IKON KOTA', image: imgE },
  { id: 'f', title: 'Tari Pasambahan', category: 'SENI PERTUNJUKAN', image: imgF },
  { id: 'g', title: 'Istano Pagaruyung', category: 'CAGAR BUDAYA', image: imgG },
];

// Duplicate items 4x for seamless infinite marquee loop
const MARQUEE_ITEMS = [...BASE_CARDS, ...BASE_CARDS, ...BASE_CARDS, ...BASE_CARDS];

export function HeroSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full bg-white pt-[82px] sm:pt-[86px] md:pt-[90px] px-1.5 sm:px-2.5 md:px-3.5 pb-16 sm:pb-20 flex justify-center overflow-visible">
      {/* Outer Hero Card Container - Enlarged background with slim gaps from navbar & sides */}
      <div className="relative w-full max-w-[1530px] h-[520px] sm:h-[620px] md:h-[700px] lg:h-[760px] rounded-[32px] sm:rounded-[40px] md:rounded-[48px] overflow-hidden shadow-2xl">
        
        {/* Mobile Background Image (image copy 2.png - block sm:hidden) */}
        <img
          src={bgMobilePng}
          alt="Bukittinggi Background Mobile"
          className="block sm:hidden absolute inset-0 w-full h-full object-cover object-top rounded-[32px] select-none pointer-events-none"
        />

        {/* Desktop Background Image (bg4.webp - hidden sm:block) */}
        <img
          src={bg4Png}
          alt="Bukittinggi Ngarai Sianok Background"
          className="hidden sm:block absolute inset-0 w-full h-full object-cover object-[center_30%] rounded-[32px] sm:rounded-[40px] md:rounded-[48px] select-none pointer-events-none"
        />

        {/* Floating Cards Gallery Row — Balanced medium card sizing positioned cleanly near bottom */}
        <div className="absolute -left-2 -right-2 sm:-left-4 sm:-right-4 md:-left-6 md:-right-6 bottom-2 sm:bottom-4 md:bottom-5 z-30 overflow-visible py-4 pointer-events-auto">
          <div className="animate-hero-marquee group flex items-center gap-3.5 sm:gap-4.5 md:gap-5.5 px-2">
            {MARQUEE_ITEMS.map((card, idx) => {
              const isEven = idx % 2 === 0;
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={`${card.id}-${idx}`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`relative flex-shrink-0 cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isEven ? 'animate-wave-odd' : 'animate-wave-even'
                  } ${
                    isHovered
                      ? 'z-40 -translate-y-3 sm:-translate-y-4 md:-translate-y-5 scale-[1.08] active:scale-100 active:-translate-y-2'
                      : 'z-20 scale-100 opacity-100'
                  }`}
                >
                  {/* Card Frame — Clean border with soft elevation shadow */}
                  <div
                    className={`relative w-[132px] sm:w-[168px] md:w-[198px] lg:w-[220px] aspect-[3/4] rounded-[18px] sm:rounded-[22px] md:rounded-[26px] overflow-hidden border-2 leading-none p-0 flex items-center justify-center transition-all duration-500 ${
                      isHovered
                        ? 'border-white shadow-[0_22px_45px_rgba(0,0,0,0.45)] ring-2 ring-white/50'
                        : 'border-white/90 shadow-[0_12px_32px_rgba(0,0,0,0.35)]'
                    }`}
                  >
                    {/* Card Image — Scaled smoothly on hover with no whitespace */}
                    <img
                      src={card.image}
                      alt={card.title}
                      className={`w-full h-full object-cover object-center block m-0 p-0 select-none transition-transform duration-700 ease-out ${
                        isHovered ? 'scale-115' : 'scale-105'
                      }`}
                      draggable={false}
                    />

                    {/* Subtle Gradient Shadow at bottom for title contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />

                    {/* Glassmorphism Title Pill Tag on Hover */}
                    <div
                      className={`absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1.5 rounded-[12px] bg-black/45 backdrop-blur-md border border-white/20 text-white text-center transition-all duration-300 ease-out pointer-events-none ${
                        isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
                      }`}
                    >
                      <span className="block font-poppins text-[10px] sm:text-[11px] font-medium tracking-tight truncate text-white">
                        {card.title}
                      </span>
                      <span className="block font-poppins text-[8px] sm:text-[9px] text-amber-200/90 uppercase tracking-wider truncate">
                        {card.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

export default HeroSection;
