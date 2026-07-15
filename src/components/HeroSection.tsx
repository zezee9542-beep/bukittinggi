import { useScrollReveal } from '../hooks/useScrollReveal';
import { useParallax } from '../hooks/useParallax';
import { FloatingParticles } from './FloatingParticles';
import imggWebp from '../assets/imgg.webp';
import gunungWebp from '../assets/gunung.webp';

export function HeroSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const parallaxY = useParallax(0.25);

  return (
    <section
      ref={ref}
      className="relative w-full bg-white pt-24 sm:pt-28 md:pt-32 pb-12 md:pb-16 flex justify-center items-center overflow-visible px-3 sm:px-4 md:px-5"
      aria-label="Hero Bukittinggi Heritage"
    >
      {/* ── The Card Container (Responsive horizontal padding for aesthetic gaps) ── */}
      <div 
        className="relative w-full max-w-[1440px] h-[480px] sm:h-[580px] md:h-[680px] lg:h-[80vh] min-h-[460px] overflow-visible"
      >
        {/* ── 1. Outside Text (z-0, behind the card - colored steel blue) ── */}
        <div
          className="absolute inset-x-0 top-0 z-0 flex justify-center pointer-events-none px-4 transition-all duration-[1200ms] delay-200 ease-out"
          style={{
            transform: isVisible
              ? 'translateY(-50%)'
              : 'translateY(calc(-50% + 15px))',
            opacity: isVisible ? 0.75 : 0,
          }}
        >
          <h1
            className="font-cormorant font-semibold tracking-[0.08em] select-none text-center uppercase"
            style={{
              fontSize: 'clamp(44px, 11vw, 156px)',
              lineHeight: '1.0',
              color: '#829fb9', // Soft steel blue matching mockup sky tone
              textShadow: '0 2px 10px rgba(130, 159, 185, 0.15)',
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

        {/* ── 2. Background Image Card (z-10, rounded corners: 32px on all corners) ── */}
        <div className="absolute inset-0 rounded-[32px] overflow-hidden z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.03),_0_12px_30px_rgba(0,0,0,0.03)] border border-neutral-100 border-b-0">
          
          {/* Background Image with Ken Burns + Parallax */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ transform: `translateY(${parallaxY * 0.35}px)` }}
          >
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

          {/* Subtle gradient vignette overlay */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.18) 100%)',
            }}
          />

          {/* Floating Particles Layer inside the card */}
          <FloatingParticles
            count={22}
            colors={['#6E1F1F', '#D4A853', '#F9CE65', '#8C1D24', '#c8955a']}
            className="z-[5] rounded-[32px]"
          />

          {/* ── 3. Inside Text (z-10, on top of background inside card - colored white) ── */}
          <div
            className="absolute inset-x-0 top-0 z-10 flex justify-center pointer-events-none px-4 transition-all duration-[1200ms] delay-200 ease-out"
            style={{
              transform: isVisible
                ? 'translateY(-50%)'
                : 'translateY(calc(-50% + 15px))',
              opacity: isVisible ? 0.75 : 0,
            }}
          >
            <h1
              className={`font-cormorant font-semibold text-white tracking-[0.08em] select-none text-center uppercase ${
                isVisible ? 'animate-text-glow' : ''
              }`}
              style={{
                fontSize: 'clamp(44px, 11vw, 156px)',
                lineHeight: '1.0',
                textShadow:
                  '0 0 35px rgba(255, 255, 255, 0.45), 0 0 10px rgba(255, 255, 255, 0.25), 0 4px 20px rgba(0,0,0,0.1)',
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

          {/* Soft White Gradient Fade at the bottom inside the card */}
          <div
            className="absolute inset-x-0 bottom-0 z-30 h-[25%] sm:h-[30%] pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, #ffffff 0%, rgba(255, 255, 255, 0.94) 22%, rgba(255, 255, 255, 0.4) 65%, transparent 100%)',
              borderRadius: '0 0 32px 32px',
            }}
          />
        </div>

        {/* ── 4. Foreground Image: gunung.webp (z-20, sits on top of the card) ── */}
        <div
          className="absolute left-1/2 bottom-[8%] sm:bottom-[6%] md:bottom-[4%] z-20 pointer-events-none transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: isVisible
              ? 'translateX(-50%) translateY(0) scale(1)'
              : 'translateX(-50%) translateY(32px) scale(0.96)',
            opacity: isVisible ? 1 : 0,
            width: 'clamp(280px, 82vw, 880px)',
          }}
        >
          <img
            src={gunungWebp}
            alt="Gunung Foreground"
            className={`w-full h-auto object-contain select-none filter drop-shadow-[0_16px_48px_rgba(0,0,0,0.2)] ${
              isVisible ? 'animate-float-slow' : ''
            }`}
            draggable={false}
          />
        </div>

        {/* ── 5. Outer Bottom Fade to fully hide the bottom edge of the card and blend with background ── */}
        <div
          className="absolute inset-x-0 -bottom-2 z-30 h-[90px] pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, #ffffff 0%, rgba(255, 255, 255, 0.98) 45%, transparent 100%)',
          }}
        />

        {/* ── Scroll Down Indicator inside the card ── */}
        {isVisible && (
          <div
            className="absolute bottom-6 left-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none animate-fade-in"
            style={{ transform: 'translateX(-50%)', animationDelay: '1.5s' }}
          >
            <span
              className="font-poppins text-[10px] tracking-[0.22em] uppercase text-[#6E1F1F]/60 select-none"
            >
              Scroll
            </span>
            <div className="flex flex-col items-center gap-[3px] animate-scroll-bounce">
              <div className="w-[1.5px] h-5 bg-[#6E1F1F]/40 rounded-full" />
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                className="text-[#6E1F1F]/40"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
