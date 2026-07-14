import { useState, useRef } from 'react';
import imgSejarah from '../assets/11.webp';
import imgBudaya from '../assets/12.webp';
import imgKuliner from '../assets/13.webp';
import imgPariwisata from '../assets/14.webp';
import imgPeta from '../assets/15.webp';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { HeritagePremiumCard } from './HeritagePremiumCard';

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
      {/* ── Decorative background accent ── */}
      <div
        className="absolute top-0 inset-x-0 h-[1px] pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(110,31,31,0.15) 30%, rgba(212,168,83,0.3) 50%, rgba(110,31,31,0.15) 70%, transparent)',
        }}
        aria-hidden="true"
      />

      {/* Heading */}
      <div
        className={`text-center mb-10 md:mb-16 px-6 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? 'translate-y-0 opacity-100 blur-0 scale-100' : 'translate-y-8 opacity-0 blur-[3px] scale-[0.98]'
        }`}
      >
        <div
          className={`inline-flex items-center gap-2 mb-4 transition-all duration-[800ms] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          <div className="h-[1px] w-8 animate-line-grow" style={{ background: '#D4A853' }} aria-hidden="true" />
          <span className="font-poppins text-[11px] tracking-[0.28em] text-[#6E1F1F]/60 uppercase">Temukan Lebih</span>
          <div className="h-[1px] w-8 animate-line-grow" style={{ background: '#D4A853', animationDelay: '200ms' }} aria-hidden="true" />
        </div>

        <h2
          id="heritage-heading"
          className="font-cormorant text-[#6E1F1F] text-[28px] sm:text-[40px] md:text-[48px] font-bold tracking-[0.15em] uppercase mb-4"
        >
          JELAJAHI WARISAN BUKITTINGGI
        </h2>

        <div
          className={`mx-auto h-[2px] shimmer-line mb-4 transition-all duration-[1000ms] ${
            isVisible ? 'w-24 opacity-100' : 'w-0 opacity-0'
          }`}
          style={{ transitionDelay: '300ms' }}
          aria-hidden="true"
        />

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
              <HeritagePremiumCard
                title={card.title}
                img={card.img}
                isVisible={isVisible}
                revealDelay={idx * 80}
                width="clamp(220px, 68vw, 290px)"
                height="clamp(293px, 90vw, 386px)"
                borderRadius="18px 0px 18px 18px"
              />
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
                    ? 'w-4 h-2 bg-[#6E1F1F] animate-pulse-glow'
                    : 'w-2 h-2 bg-[#6E1F1F]/30 hover:bg-[#6E1F1F]/70'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* ── DESKTOP/TABLET: Grid layout with premium hover cards ── */}
      <div className="hidden md:block mx-auto max-w-[1512px] px-6">
        <div className="flex flex-col items-center gap-4">
          {/* Row 1 */}
          <div className="flex flex-wrap justify-center gap-4 w-full">
            {cards.slice(0, 3).map((card, idx) => (
              <HeritagePremiumCard
                key={card.title}
                title={card.title}
                img={card.img}
                isVisible={isVisible}
                revealDelay={idx * 130}
                width="clamp(320px, 28vw, 477px)"
                height="clamp(413px, 36vw, 616px)"
                borderRadius="24px 0px 24px 24px"
              />
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex flex-wrap justify-center gap-4 w-full">
            {cards.slice(3, 5).map((card, idx) => (
              <HeritagePremiumCard
                key={card.title}
                title={card.title}
                img={card.img}
                isVisible={isVisible}
                revealDelay={(idx + 3) * 130}
                width="clamp(320px, 28vw, 477px)"
                height="clamp(413px, 36vw, 616px)"
                borderRadius="24px 0px 24px 24px"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
