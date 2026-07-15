import { useState, useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useParallax } from '../hooks/useParallax';
import { FloatingParticles } from './FloatingParticles';
import imggWebp from '../assets/imgg.webp';
import gunungWebp from '../assets/gunung.webp';
import imagePng from '../assets/image.png';
import imageCopyPng from '../assets/image copy.png';
import rumahPng from '../assets/rumah.png';
import { useMode } from '../context/ModeContext';

export function HeroSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const parallaxY = useParallax(0.25);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const { mode } = useMode();

  const isExplorer = mode === 'explorer';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Shared slow, elegant crossfade transition
  const FADE = '1.35s cubic-bezier(0.25, 1, 0.25, 1)';

  // ── Explorer colors ──────────────────────────────────────────────
  const explorerTextColor  = '#F0A040';
  const explorerGlow = [
    '0 0 120px rgba(255,170,60,0.9)',
    '0 0 50px rgba(249,140,30,0.7)',
    '0 0 20px rgba(249,120,20,0.5)',
    '0 4px 24px rgba(0,0,0,0.5)',
  ].join(', ');

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: '#ffffff' }}
      aria-label={isExplorer ? 'Explorer Bukittinggi Heritage' : 'Hero Bukittinggi Heritage'}
    >
      {/* ════════════════════════════════════════════════════════
          SHARED CARD STRUCTURE — same layout for both modes,
          only the images and colors differ.
      ════════════════════════════════════════════════════════ */}
      <div className="relative pt-24 sm:pt-28 md:pt-32 pb-12 md:pb-16 flex justify-center items-center px-3 sm:px-4 md:px-5">

        {/* ── Card Container ── */}
        <div className="relative w-full max-w-[1440px] h-[480px] sm:h-[580px] md:h-[680px] lg:h-[80vh] min-h-[460px] overflow-visible">

          {/* ── 1. BUKITTINGGI outside text (under card, always) ── */}
          <div
            className="absolute inset-x-0 top-0 z-0 flex justify-center pointer-events-none px-4"
            style={{
              transform: isVisible ? 'translateY(-50%)' : 'translateY(calc(-50% + 15px))',
              opacity: isVisible ? 0.75 : 0,
              transition: 'transform 1200ms ease 200ms, opacity 1200ms ease 200ms',
            }}
          >
            <h1
              className="font-cormorant font-semibold tracking-[0.08em] select-none text-center uppercase"
              style={{
                fontSize: 'clamp(44px, 11vw, 156px)',
                lineHeight: '1.0',
                color: isExplorer ? explorerTextColor : '#829fb9',
                textShadow: isExplorer
                  ? explorerGlow
                  : '0 2px 10px rgba(130, 159, 185, 0.15)',
                transition: `color ${FADE}, text-shadow ${FADE}`,
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

            {/* Background image — crossfades between explorer (image.png / image copy.png) and heritage (imgg.webp) */}
            <div
              className="absolute inset-0 overflow-hidden bg-[#FAF8F5]"
              style={{ transform: `translateY(${parallaxY * 0.35}px)` }}
            >
              {/* Heritage background */}
              <img
                src={imggWebp}
                alt="Bukittinggi Heritage Landscape"
                className="absolute inset-0 h-[110%] w-full object-cover select-none pointer-events-none animate-ken-burns"
                fetchPriority="high"
                decoding="sync"
                draggable={false}
                style={{
                  top: '-5%',
                  opacity: isExplorer ? 0 : 1,
                  transform: isExplorer ? 'scale(1.05)' : 'scale(1)',
                  transition: `opacity ${FADE}, transform ${FADE}`,
                }}
              />
              {/* Explorer background (Mobile) */}
              {isMobile && (
                <img
                  src={imageCopyPng}
                  alt="Bukittinggi Explorer Sunset Sky Mobile"
                  className="absolute inset-0 h-[110%] w-full object-cover select-none pointer-events-none"
                  fetchPriority="high"
                  decoding="async"
                  draggable={false}
                  style={{
                    top: '-5%',
                    opacity: isExplorer ? 1 : 0,
                    transform: isExplorer ? 'scale(1)' : 'scale(1.05)',
                    transition: `opacity ${FADE}, transform ${FADE}`,
                  }}
                />
              )}
              {/* Explorer background (Desktop) */}
              {!isMobile && (
                <img
                  src={imagePng}
                  alt="Bukittinggi Explorer Sunset Sky Desktop"
                  className="absolute inset-0 h-[110%] w-full object-cover select-none pointer-events-none"
                  fetchPriority="high"
                  decoding="async"
                  draggable={false}
                  style={{
                    top: '-5%',
                    opacity: isExplorer ? 1 : 0,
                    transform: isExplorer ? 'scale(1)' : 'scale(1.05)',
                    transition: `opacity ${FADE}, transform ${FADE}`,
                  }}
                />
              )}
            </div>

            {/* Radial vignette */}
            <div
              className="absolute inset-0 z-[1] pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.18) 100%)' }}
            />

            {/* Floating particles — desktop only, heritage only */}
            {!isMobile && !isExplorer && (
              <FloatingParticles count={22} colors={['#6E1F1F', '#D4A853', '#F9CE65', '#8C1D24', '#c8955a']} className="z-[5] rounded-[32px]" />
            )}

            {/* BUKITTINGGI inside card — crossfades color */}
            <div
              className="absolute inset-x-0 top-0 z-10 flex justify-center pointer-events-none px-4"
              style={{
                transform: isVisible ? 'translateY(-50%)' : 'translateY(calc(-50% + 15px))',
                opacity: isVisible ? 0.75 : 0,
                transition: 'transform 1200ms ease 200ms, opacity 1200ms ease 200ms',
              }}
            >
              <h1
                className={`font-cormorant font-semibold tracking-[0.08em] select-none text-center uppercase ${isVisible ? 'animate-text-glow' : ''}`}
                style={{
                  fontSize: 'clamp(44px, 11vw, 156px)',
                  lineHeight: '1.0',
                  color: isExplorer ? explorerTextColor : '#ffffff',
                  textShadow: isExplorer
                    ? explorerGlow
                    : '0 0 35px rgba(255,255,255,0.45), 0 0 10px rgba(255,255,255,0.25), 0 4px 20px rgba(0,0,0,0.1)',
                  transition: `color ${FADE}, text-shadow ${FADE}`,
                }}
              >
                {'BUKITTINGGI'.split('').map((char, i) => (
                  <span key={i} className="char-animate inline-block" style={{ animationDelay: `${i * 55 + 300}ms` }}>
                    {char}
                  </span>
                ))}
              </h1>
            </div>

            {/* Bottom white fade — same for both modes */}
            <div
              className="absolute inset-x-0 bottom-0 z-30 h-[25%] sm:h-[30%] pointer-events-none"
              style={{
                background: 'linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.94) 22%, rgba(255,255,255,0.4) 65%, transparent 100%)',
                borderRadius: '0 0 32px 32px',
              }}
            />
          </div>

          {/* ── 3. Foreground Image — Heritage Mode (gunung.webp) ── */}
          <div
            className="absolute left-1/2 z-20 pointer-events-none"
            style={{
              bottom: isMobile ? '12%' : '8%',
              transform: isVisible
                ? 'translateX(-50%) translateY(0) scale(1)'
                : 'translateX(-50%) translateY(32px) scale(0.96)',
              opacity: isVisible && !isExplorer ? 1 : 0,
              pointerEvents: !isExplorer ? 'auto' : 'none',
              transition: `transform 1400ms cubic-bezier(0.16,1,0.3,1), opacity ${FADE}, bottom 0.5s ease`,
              width: isMobile ? 'clamp(320px, 94vw, 440px)' : 'clamp(280px, 82vw, 880px)',
            }}
          >
            <img
              src={gunungWebp}
              alt="Gunung Foreground"
              className={`w-full h-auto object-contain select-none filter drop-shadow-[0_16px_48px_rgba(0,0,0,0.2)] ${isVisible ? 'animate-float-slow' : ''}`}
              draggable={false}
              style={{
                transform: !isExplorer ? 'scale(1)' : 'scale(0.95)',
                transition: `transform ${FADE}`,
              }}
            />
          </div>

          {/* ── 3b. Foreground Image — Explorer Mode (rumah.png) ── */}
          <div
            className="absolute left-1/2 z-20 pointer-events-none"
            style={{
              bottom: isMobile ? '12%' : '-15%',
              transform: isVisible
                ? 'translateX(-50%) translateY(0) scale(1)'
                : 'translateX(-50%) translateY(32px) scale(0.96)',
              opacity: isVisible && isExplorer ? 1 : 0,
              pointerEvents: isExplorer ? 'auto' : 'none',
              transition: `transform 1400ms cubic-bezier(0.16,1,0.3,1), opacity ${FADE}, bottom 0.5s ease`,
              width: isMobile ? 'clamp(320px, 94vw, 440px)' : 'clamp(480px, 60vw, 720px)',
            }}
          >
            <img
              src={rumahPng}
              alt="Rumah Gadang Floating Island"
              className="w-full h-auto object-contain select-none filter drop-shadow-[0_20px_60px_rgba(249,120,20,0.35)] animate-float-slow"
              draggable={false}
              style={{
                transform: isExplorer ? 'scale(1)' : 'scale(0.95)',
                transition: `transform ${FADE}`,
              }}
            />
          </div>

          {/* ── 4. Outer Bottom Fade ── */}
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
              <span
                className="font-poppins text-[10px] tracking-[0.22em] uppercase select-none"
                style={{
                  color: isExplorer ? 'rgba(249,206,101,0.7)' : 'rgba(110,31,31,0.6)',
                  transition: `color ${FADE}`,
                }}
              >
                Scroll
              </span>
              <div className="flex flex-col items-center gap-[3px] animate-scroll-bounce">
                <div
                  className="w-[1.5px] h-5 rounded-full"
                  style={{
                    background: isExplorer ? 'rgba(249,206,101,0.5)' : 'rgba(110,31,31,0.4)',
                    transition: `background ${FADE}`,
                  }}
                />
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"
                  style={{ color: isExplorer ? 'rgba(249,206,101,0.5)' : 'rgba(110,31,31,0.4)', transition: `color ${FADE}` }}
                >
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
