import { useState, useRef, useEffect } from 'react';
import imgSejarah from '../assets/11.webp';
import imgBudaya from '../assets/12.webp';
import imgKuliner from '../assets/13.webp';
import imgPariwisata from '../assets/14.webp';
import imgPeta from '../assets/15.webp';
import { useScrollReveal } from '../hooks/useScrollReveal';

export function HeritageSection() {
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.05 });
  const [activeMobileIdx, setActiveMobileIdx] = useState(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const cards = [
    { title: 'Sejarah', img: imgSejarah },
    { title: 'Budaya', img: imgBudaya },
    { title: 'Kuliner', img: imgKuliner },
    { title: 'Pariwisata', img: imgPariwisata },
    { title: 'Peta', img: imgPeta },
  ];

  // Track active slide index during scroll swipe on mobile
  const handleScroll = () => {
    const container = mobileScrollRef.current;
    if (!container) return;

    const children = container.children;
    if (!children || children.length === 0) return;

    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    let closestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = i;
      }
    }
    setActiveMobileIdx(closestIdx);
  };

  // Smooth scroll container to target card when clicking dots
  const scrollToCard = (idx: number) => {
    const container = mobileScrollRef.current;
    if (!container) return;

    const children = container.children;
    if (children && children[idx]) {
      const child = children[idx] as HTMLElement;
      container.scrollTo({
        left: child.offsetLeft - (container.offsetWidth - child.offsetWidth) / 2,
        behavior: 'smooth',
      });
      setActiveMobileIdx(idx);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative z-20 bg-white py-16 md:py-28 overflow-hidden"
      aria-labelledby="heritage-heading"
    >
      {/* Heading */}
      <div
        className={`text-center mb-10 md:mb-16 px-6 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? 'translate-y-0 opacity-100 blur-0 scale-100' : 'translate-y-8 opacity-0 blur-[3px] scale-[0.98]'
        }`}
      >
        <h2
          id="heritage-heading"
          className="font-cormorant text-[#6E1F1F] text-[28px] sm:text-[40px] md:text-[48px] font-bold tracking-[0.15em] uppercase mb-4"
        >
          JELAJAHI WARISAN BUKITTINGGI
        </h2>
        <p className="font-poppins text-neutral-600 text-[14px] sm:text-[16px] max-w-2xl mx-auto leading-relaxed">
          Dari jejak sejarah hingga keindahan alam, setiap sudut Bukittinggi menyimpan cerita yang menunggu untuk ditemukan.
        </p>
      </div>

      {/* ── MOBILE: Horizontal swipe scroll ── */}
      <div className="md:hidden">
        <div
          ref={mobileScrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar touch-scroll scroll-smooth"
          style={{
            paddingLeft: '1.25rem',
            paddingRight: '1.25rem',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {cards.map((card, idx) => (
            <div key={card.title} className="snap-center flex-shrink-0">
              <div
                className="relative overflow-hidden transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  width: 'clamp(220px, 68vw, 290px)',
                  height: 'clamp(293px, 90vw, 386px)',
                  transitionDelay: `${idx * 80}ms`,
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.97)',
                  opacity: isVisible ? 1 : 0,
                  borderRadius: '18px 0px 18px 18px', // Top-Right corner 0px
                  border: '1.5px solid #F9CE65',
                  boxShadow: '0 6px 28px rgba(0,0,0,0.25)',
                }}
              >
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover select-none transition-transform duration-700 ease-out hover:scale-105"
                  loading="lazy"
                  draggable={false}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-[#6E1F1F] via-[#6E1F1F]/40 to-transparent"
                    style={{ borderRadius: '0px 0px 18px 18px' }}
                  />
                  
                  {/* Content Container (Title + Gold Divider Line + MULAI JELAJAH) */}
                  <div className="absolute left-[8%] right-[8%] bottom-[8%] flex flex-col items-start text-left pointer-events-none">
                    <h3 className="font-corinthia text-white text-[36px] font-bold leading-none select-none">
                      {card.title}
                    </h3>
                    <div className="w-[84%] h-[1px] bg-[#D4A853]/60 my-2" />
                    <p className="font-poppins text-white/95 text-[10px] font-semibold tracking-[0.18em] flex items-center gap-1 uppercase leading-none">
                      Mulai Jelajah <span className="text-[12px] font-normal">↗</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Swipe indicator dots */}
        <div className="flex justify-center items-center gap-2 mt-5">
          {cards.map((card, idx) => {
            const isActive = idx === activeMobileIdx;
            return (
              <button
                key={card.title}
                onClick={() => scrollToCard(idx)}
                type="button"
                className={`transition-all duration-300 rounded-full focus:outline-none cursor-pointer ${
                  isActive
                    ? 'w-4 h-2 bg-[#6E1F1F]'
                    : 'w-2 h-2 bg-[#6E1F1F]/30 hover:bg-[#6E1F1F]/70'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* ── DESKTOP/TABLET: Grid layout ── */}
      <div className="hidden md:block mx-auto max-w-[1512px] px-6">
        <div className="flex flex-col items-center gap-4">
          {/* Row 1 */}
          <div className="flex flex-wrap justify-center gap-4 w-full">
            {cards.slice(0, 3).map((card, idx) => (
              <div
                key={card.title}
                className="relative overflow-hidden transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02]"
                style={{
                  width: 'clamp(320px, 28vw, 477px)',
                  height: 'clamp(413px, 36vw, 616px)',
                  transitionDelay: `${idx * 130}ms`,
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(48px) scale(0.95)',
                  opacity: isVisible ? 1 : 0,
                  borderRadius: '24px 0px 24px 24px', // Top-Right corner 0px
                  border: '1.5px solid #F9CE65',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.28)',
                }}
              >
                <img src={card.img} alt={card.title} className="w-full h-full object-cover select-none" loading="lazy" draggable={false} />
                <div className="absolute inset-0 pointer-events-none">
                  <div 
                    className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-[#6E1F1F] via-[#6E1F1F]/40 to-transparent" 
                    style={{ borderRadius: '0px 0px 24px 24px' }} 
                  />
                  {/* Content Container (Title + Gold Divider Line + MULAI JELAJAH) */}
                  <div className="absolute left-[8%] right-[8%] bottom-[8%] flex flex-col items-start text-left pointer-events-none">
                    <h3 className="font-corinthia text-white text-[46px] md:text-[54px] font-bold leading-none select-none mb-1">
                      {card.title}
                    </h3>
                    <div className="w-[84%] h-[1px] bg-[#D4A853]/60 my-2" />
                    <p className="font-poppins text-white/95 text-[11px] md:text-[12px] font-semibold tracking-[0.18em] flex items-center gap-1.5 uppercase leading-none">
                      Mulai Jelajah <span className="text-[13px] md:text-[15px] font-normal">↗</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Row 2 */}
          <div className="flex flex-wrap justify-center gap-4 w-full">
            {cards.slice(3, 5).map((card, idx) => (
              <div
                key={card.title}
                className="relative overflow-hidden transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02]"
                style={{
                  width: 'clamp(320px, 28vw, 477px)',
                  height: 'clamp(413px, 36vw, 616px)',
                  transitionDelay: `${(idx + 3) * 130}ms`,
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(48px) scale(0.95)',
                  opacity: isVisible ? 1 : 0,
                  borderRadius: '24px 0px 24px 24px', // Top-Right corner 0px
                  border: '1.5px solid #F9CE65',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.28)',
                }}
              >
                <img src={card.img} alt={card.title} className="w-full h-full object-cover select-none" loading="lazy" draggable={false} />
                <div className="absolute inset-0 pointer-events-none">
                  <div 
                    className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-[#6E1F1F] via-[#6E1F1F]/40 to-transparent" 
                    style={{ borderRadius: '0px 0px 24px 24px' }} 
                  />
                  {/* Content Container (Title + Gold Divider Line + MULAI JELAJAH) */}
                  <div className="absolute left-[8%] right-[8%] bottom-[8%] flex flex-col items-start text-left pointer-events-none">
                    <h3 className="font-corinthia text-white text-[46px] md:text-[54px] font-bold leading-none select-none mb-1">
                      {card.title}
                    </h3>
                    <div className="w-[84%] h-[1px] bg-[#D4A853]/60 my-2" />
                    <p className="font-poppins text-white/95 text-[11px] md:text-[12px] font-semibold tracking-[0.18em] flex items-center gap-1.5 uppercase leading-none">
                      Mulai Jelajah <span className="text-[13px] md:text-[15px] font-normal">↗</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
