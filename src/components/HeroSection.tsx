import { useState } from 'react';
import bg4Png from '../assets/bg4.webp';

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
      {/* Outer Hero Card Container - Enlarged bg4.png with slim gaps from navbar & sides */}
      <div className="relative w-full max-w-[1530px] h-[520px] sm:h-[620px] md:h-[700px] lg:h-[760px] rounded-[32px] sm:rounded-[40px] md:rounded-[48px] overflow-visible shadow-2xl">
        
        {/* Background Image bg4.png inside rounded container */}
        <img
          src={bg4Png}
          alt="Bukittinggi Ngarai Sianok Background"
          className="absolute inset-0 w-full h-full object-cover object-center rounded-[32px] sm:rounded-[40px] md:rounded-[48px] select-none pointer-events-none"
        />

        {/* Floating Cards Gallery Row - Shifted higher up & overlapping side white margins */}
        <div className="absolute -left-2 -right-2 sm:-left-4 sm:-right-4 md:-left-6 md:-right-6 bottom-6 sm:bottom-10 md:bottom-14 z-30 overflow-hidden py-8 pointer-events-auto">
          <div className="animate-hero-marquee group flex items-center gap-3.5 sm:gap-4.5 md:gap-6 px-2">
            {MARQUEE_ITEMS.map((card, idx) => {
              const isEven = idx % 2 === 0;
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={`${card.id}-${idx}`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`relative flex-shrink-0 rounded-[18px] sm:rounded-[22px] md:rounded-[26px] overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.38)] border-2 border-white/90 transition-all duration-300 transform cursor-pointer w-[115px] sm:w-[140px] md:w-[165px] lg:w-[185px] h-[160px] sm:h-[195px] md:h-[225px] lg:h-[250px] ${
                    isEven ? 'animate-wave-odd' : 'animate-wave-even'
                  } ${
                    isHovered ? 'scale-110 -translate-y-3 border-white z-40 shadow-[0_20px_45px_rgba(0,0,0,0.55)]' : 'hover:scale-105'
                  }`}
                >
                  {/* Card Image */}
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110 select-none"
                  />

                  {/* Clean Bottom Text Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 sm:p-4 flex flex-col justify-end text-white text-left pointer-events-none">
                    <span className="text-amber-400 font-extrabold text-[9px] sm:text-[11px] tracking-wider uppercase mb-0.5 drop-shadow-md">
                      {card.category}
                    </span>
                    <h3 className="text-white font-extrabold text-[11px] sm:text-xs md:text-sm leading-snug drop-shadow-md line-clamp-2">
                      {card.title}
                    </h3>
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
