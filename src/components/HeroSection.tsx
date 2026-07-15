import { useState, useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useParallax } from '../hooks/useParallax';
import { FloatingParticles } from './FloatingParticles';
import imggWebp from '../assets/imgg.webp';
import gunungWebp from '../assets/gunung.webp';
import imagePng from '../assets/image.png';
import rumahPng from '../assets/rumah.png';
import { useMode } from '../context/ModeContext';

export function HeroSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const parallaxY = useParallax(0.25);
  const [isMobile, setIsMobile] = useState(false);
  const { mode } = useMode();

  const isExplorer = mode === 'explorer';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Shared crossfade transition
  const FADE = '0.75s cubic-bezier(0.4, 0, 0.2, 1)';

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: '#ffffff',
        // Give the section its correct height when in Explorer mode so the
        // Heritage card layer below doesn't add extra invisible space.
        minHeight: isExplorer ? '100svh' : undefined,
      }}
      aria-label={isExplorer ? 'Explorer Bukittinggi Heritage' : 'Hero Bukittinggi Heritage'}
    >
      {/* ═══════════════════════════════════════════════
          EXPLORER LAYER — image.png full-bleed sunset
          + rumah.png floating island
      ═══════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 flex justify-center items-end"
        style={{
          opacity: isExplorer ? 1 : 0,
          transition: `opacity ${FADE}`,
          pointerEvents: isExplorer ? 'auto' : 'none',
          zIndex: isExplorer ? 1 : 0,
          height: '100svh',
          minHeight: '580px',
        }}
        aria-hidden={!isExplorer}
      >
        {/* Full-bleed sky background — image.png */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ transform: `translateY(${parallaxY * 0.2}px)` }}
        >
          <img
            src={imagePng}
            alt="Bukittinggi Explorer Sunset Sky"
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            fetchPriority="high"
            decoding="async"
            draggable={false}
          />
        </div>

        {/* Gradient: bottom fade to white to hide image lines and blend into next section */}
        <div
          className="absolute inset-x-0 bottom-0 z-30 h-[120px] pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #ffffff 0%, rgba(255, 255, 255, 0.98) 45%, transparent 100%)',
          }}
        />

        {/* Subtle vignette on left/right edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.15) 100%)',
            zIndex: 2,
          }}
        />

        {/* BUKITTINGGI text — bright sunset amber, fully visible */}
        <div
          className="absolute inset-x-0 top-[10%] z-[3] flex justify-center pointer-events-none px-4"
          style={{
            opacity: isExplorer && isVisible ? 1 : 0,
            transition: `opacity 1.2s ease 0.3s`,
          }}
        >
          <h1
            className="font-cormorant font-semibold tracking-[0.08em] select-none text-center uppercase"
            style={{
              fontSize: 'clamp(44px, 11vw, 156px)',
              lineHeight: '1.0',
              color: '#F0A040',
              textShadow: [
                '0 0 120px rgba(255,170,60,0.9)',
                '0 0 50px rgba(249,140,30,0.7)',
                '0 0 20px rgba(249,120,20,0.5)',
                '0 4px 24px rgba(0,0,0,0.5)',
              ].join(', '),
            }}
          >
            {'BUKITTINGGI'.split('').map((char, i) => (
              <span
                key={i}
                className="char-animate inline-block"
                style={{ animationDelay: `${i * 55 + 300}ms` }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* Floating island — rumah.png, centered, shifted lower so it sits at the base */}
        <div
          className="absolute left-1/2 z-[4] pointer-events-none"
          style={{
            bottom: isMobile ? '-22%' : '-18%',
            transform: `translateX(-50%) translateY(${isExplorer && isVisible ? 0 : 40}px)`,
            opacity: isExplorer && isVisible ? 1 : 0,
            transition: `transform 1.4s cubic-bezier(0.16,1,0.3,1) 0.1s, opacity 1s ease 0.15s`,
            width: 'clamp(260px, 74vw, 820px)',
          }}
        >
          <img
            src={rumahPng}
            alt="Rumah Gadang Floating Island"
            className="w-full h-auto object-contain select-none drop-shadow-[0_20px_60px_rgba(249,120,20,0.35)]"
            draggable={false}
            fetchPriority="high"
          />
        </div>

        {/* Scroll Down Indicator */}
        {isVisible && isExplorer && (
          <div
            className="absolute bottom-10 left-1/2 z-[5] flex flex-col items-center gap-2 pointer-events-none animate-fade-in"
            style={{ transform: 'translateX(-50%)', animationDelay: '1.2s' }}
          >
            <span
              className="font-poppins text-[10px] tracking-[0.25em] uppercase text-[#FFEAA7] select-none font-semibold"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
            >
              SCROLL
            </span>
            <div className="flex flex-col items-center gap-[3px] animate-scroll-bounce">
              <div className="w-[1.5px] h-6 bg-[#F9CE65] rounded-full shadow-lg" />
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="text-[#F9CE65]">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════
          HERITAGE LAYER — original card layout
      ═══════════════════════════════════════════════ */}
      <div
        className="relative pt-24 sm:pt-28 md:pt-32 pb-12 md:pb-16 flex justify-center items-center px-3 sm:px-4 md:px-5"
        style={{
          opacity: isExplorer ? 0 : 1,
          transition: `opacity ${FADE}`,
          pointerEvents: isExplorer ? 'none' : 'auto',
          visibility: isExplorer ? 'hidden' : 'visible',
        }}
        aria-hidden={isExplorer}
      >
        {/* ── The Card Container ── */}
        <div className="relative w-full max-w-[1440px] h-[480px] sm:h-[580px] md:h-[680px] lg:h-[80vh] min-h-[460px] overflow-visible">
          {/* ── 1. Outside Text ── */}
          <div
            className="absolute inset-x-0 top-0 z-0 flex justify-center pointer-events-none px-4 transition-all duration-[1200ms] delay-200 ease-out"
            style={{
              transform: isVisible ? 'translateY(-50%)' : 'translateY(calc(-50% + 15px))',
              opacity: isVisible ? 0.75 : 0,
            }}
          >
            <h1
              className="font-cormorant font-semibold tracking-[0.08em] select-none text-center uppercase"
              style={{
                fontSize: 'clamp(44px, 11vw, 156px)',
                lineHeight: '1.0',
                color: '#829fb9',
                textShadow: '0 2px 10px rgba(130, 159, 185, 0.15)',
              }}
            >
              {'BUKITTINGGI'.split('').map((char, i) => (
                <span key={i} className="char-animate inline-block" style={{ animationDelay: `${i * 55 + 300}ms` }}>
                  {char}
                </span>
              ))}
            </h1>
          </div>

          {/* ── 2. Background Image Card ── */}
          <div className="absolute inset-0 rounded-[32px] overflow-hidden z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.03),_0_12px_30px_rgba(0,0,0,0.03)] border border-neutral-100 border-b-0">
            <div className="absolute inset-0 overflow-hidden" style={{ transform: `translateY(${parallaxY * 0.35}px)` }}>
              <img
                src={imggWebp}
                alt="Bukittinggi Landscape"
                className="absolute inset-0 h-[110%] w-full object-cover select-none pointer-events-none animate-ken-burns"
                fetchPriority="high"
                decoding="sync"
                draggable={false}
                style={{ top: '-5%' }}
              />
            </div>
            <div
              className="absolute inset-0 z-[1] pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.18) 100%)' }}
            />
            {!isMobile && (
              <FloatingParticles count={22} colors={['#6E1F1F', '#D4A853', '#F9CE65', '#8C1D24', '#c8955a']} className="z-[5] rounded-[32px]" />
            )}
            <div
              className="absolute inset-x-0 top-0 z-10 flex justify-center pointer-events-none px-4 transition-all duration-[1200ms] delay-200 ease-out"
              style={{
                transform: isVisible ? 'translateY(-50%)' : 'translateY(calc(-50% + 15px))',
                opacity: isVisible ? 0.75 : 0,
              }}
            >
              <h1
                className={`font-cormorant font-semibold text-white tracking-[0.08em] select-none text-center uppercase ${isVisible ? 'animate-text-glow' : ''}`}
                style={{
                  fontSize: 'clamp(44px, 11vw, 156px)',
                  lineHeight: '1.0',
                  textShadow: '0 0 35px rgba(255,255,255,0.45), 0 0 10px rgba(255,255,255,0.25), 0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                {'BUKITTINGGI'.split('').map((char, i) => (
                  <span key={i} className="char-animate inline-block" style={{ animationDelay: `${i * 55 + 300}ms` }}>
                    {char}
                  </span>
                ))}
              </h1>
            </div>
            <div
              className="absolute inset-x-0 bottom-0 z-30 h-[25%] sm:h-[30%] pointer-events-none"
              style={{
                background: 'linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.94) 22%, rgba(255,255,255,0.4) 65%, transparent 100%)',
                borderRadius: '0 0 32px 32px',
              }}
            />
          </div>

          {/* ── 4. Foreground Image: gunung.webp ── */}
          <div
            className="absolute left-1/2 bottom-[8%] sm:bottom-[6%] md:bottom-[4%] z-20 pointer-events-none transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: isVisible ? 'translateX(-50%) translateY(0) scale(1)' : 'translateX(-50%) translateY(32px) scale(0.96)',
              opacity: isVisible ? 1 : 0,
              width: 'clamp(280px, 82vw, 880px)',
            }}
          >
            <img
              src={gunungWebp}
              alt="Gunung Foreground"
              className={`w-full h-auto object-contain select-none filter drop-shadow-[0_16px_48px_rgba(0,0,0,0.2)] ${isVisible ? 'animate-float-slow' : ''}`}
              draggable={false}
            />
          </div>

          {/* ── 5. Outer Bottom Fade ── */}
          <div
            className="absolute inset-x-0 -bottom-2 z-30 h-[90px] pointer-events-none"
            style={{ background: 'linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.98) 45%, transparent 100%)' }}
          />

          {/* ── Scroll Down Indicator ── */}
          {isVisible && (
            <div
              className="absolute bottom-6 left-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none animate-fade-in"
              style={{ transform: 'translateX(-50%)', animationDelay: '1.5s' }}
            >
              <span className="font-poppins text-[10px] tracking-[0.22em] uppercase text-[#6E1F1F]/60 select-none">Scroll</span>
              <div className="flex flex-col items-center gap-[3px] animate-scroll-bounce">
                <div className="w-[1.5px] h-5 bg-[#6E1F1F]/40 rounded-full" />
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="text-[#6E1F1F]/40">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* No height anchor needed — section minHeight handles Explorer sizing */}
    </section>
  );
}
