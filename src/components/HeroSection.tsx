import { useState, useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import imggWebp from '../assets/imgg.webp';
import gunungWebp from '../assets/gunung.webp';

export function HeroSection() {
  const { ref: revealRef, isVisible } = useScrollReveal<HTMLElement>();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax calculations
  const maxScroll = 500;
  const clampedScroll = Math.min(scrollY, maxScroll);

  const bgY = clampedScroll * 0.08;
  const textY = -clampedScroll * 0.35;
  const textScale = Math.max(0.85, 1 - clampedScroll * 0.0004);
  const textOpacity = isVisible ? Math.max(0, 0.92 - clampedScroll / 380) : 0;
  const islandY = clampedScroll * 0.22;

  return (
    <section
      ref={revealRef}
      className="relative w-full bg-white overflow-hidden pb-12 flex flex-col justify-start"
      aria-label="Hero Bukittinggi Heritage"
    >
      {/* ── Floating Canvas Wrapper (Layer Container with rounded corners) ── */}
      <div 
        className="relative w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-[1400px] mx-auto h-[clamp(460px,78vh,780px)] rounded-[32px] md:rounded-[48px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.16)] bg-[#0d0f12] mt-[100px]"
      >
        {/* ── Background Image (Layer 0) ── */}
        <div 
          className="absolute inset-0 z-0 scale-105 pointer-events-none select-none transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(0, ${bgY}px, 0)`,
          }}
        >
          <img
            src={imggWebp}
            alt="Bukittinggi Landscape Background"
            className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
            fetchPriority="high"
            decoding="sync"
            draggable={false}
          />
        </div>

        {/* ── Big Title Text: BUKITTINGGI (Layer 1 - centered behind foreground) ── */}
        <div 
          className="absolute inset-x-0 top-[28%] sm:top-[26%] md:top-[22%] z-10 flex justify-center pointer-events-none px-4 transition-all duration-[1200ms] delay-100 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: `translate3d(0, ${isVisible ? textY : textY + 24}px, 0) scale(${textScale})`,
            opacity: textOpacity,
          }}
        >
          <h1
            className="font-cormorant font-semibold text-white tracking-[0.08em] select-none text-center uppercase"
            style={{ 
              fontSize: 'clamp(40px, 10.5vw, 150px)', 
              lineHeight: '1.0',
              textShadow: '0 0 35px rgba(255, 255, 255, 0.40), 0 0 10px rgba(255, 255, 255, 0.20), 0 8px 32px rgba(0,0,0,0.15)'
            }}
          >
            BUKITTINGGI
          </h1>
        </div>

        {/* ── Foreground Image: Floating Island (Layer 2) ── */}
        <div 
          className="absolute left-1/2 bottom-[4%] sm:bottom-[3%] md:bottom-[2%] z-20 pointer-events-none transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: isVisible 
              ? `translate3d(-50%, ${islandY}px, 0) scale(1)` 
              : `translate3d(-50%, ${islandY + 40}px, 0) scale(0.96)`,
            opacity: isVisible ? 1 : 0,
            width: 'clamp(280px, 80vw, 860px)',
          }}
        >
          <img
            src={gunungWebp}
            alt="Rumah Gadang Floating Island"
            className="w-full h-auto object-contain select-none filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            draggable={false}
          />
        </div>

        {/* ── Inner Bottom Gradient Fade (Masks the bottom edge inside the canvas) ── */}
        <div
          className="absolute inset-x-0 bottom-0 z-30 h-[28%] pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.90) 25%, rgba(255,255,255,0.40) 65%, transparent 100%)'
          }}
        />
      </div>
    </section>
  );
}
