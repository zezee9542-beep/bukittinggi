import bg4Png from '../assets/bg4.webp';
import bgMobilePng from '../assets/image copy 2.webp';

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
  return (
    <section className="relative w-full bg-white pt-[82px] sm:pt-[86px] md:pt-[90px] px-1.5 sm:px-2.5 md:px-3.5 pb-16 sm:pb-20 flex justify-center overflow-visible">
      {/* Outer Hero Card Container - Enlarged background with slim gaps from navbar & sides */}
      <div className="relative w-full max-w-[1530px] h-[520px] sm:h-[620px] md:h-[700px] lg:h-[760px] rounded-[32px] sm:rounded-[40px] md:rounded-[48px] overflow-hidden shadow-2xl">
        
        {/* Mobile Background Image (image copy 2.webp - block sm:hidden) */}
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

              return (
                <div
                  key={`${card.id}-${idx}`}
                  className={`relative flex-shrink-0 cursor-pointer transition-all duration-500 ease-out ${
                    isEven ? 'animate-wave-odd' : 'animate-wave-even'
                  }`}
                >
                  {/* Card Frame — Balanced medium size with zero whitespace */}
                  <div className="relative w-[132px] sm:w-[168px] md:w-[198px] lg:w-[220px] aspect-[3/4] rounded-[18px] sm:rounded-[22px] md:rounded-[26px] overflow-hidden border-2 border-white/95 shadow-[0_14px_36px_rgba(0,0,0,0.4)] leading-none p-0 flex items-center justify-center">
                    {/* Card Image — Scaled 105% to completely fill container with no gaps */}
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover object-center block m-0 p-0 select-none scale-105"
                      draggable={false}
                    />
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
