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
      className="relative min-h-[580px] sm:min-h-[680px] md:min-h-[760px] lg:min-h-[100vh] w-full overflow-hidden bg-white"
      aria-label="Hero Bukittinggi Heritage"
    >
      {/* ── Floating Particles Layer ── */}
      <FloatingParticles
        count={22}
        colors={['#6E1F1F', '#D4A853', '#F9CE65', '#8C1D24', '#c8955a']}
        className="z-[5]"
      />

      {/* ── Background Image with Ken Burns + Parallax ── */}
      <div
        className="absolute inset-0 z-0 overflow-hidden"
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

      {/* ── Subtle gradient vignette overlay ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.18) 100%)',
        }}
      />

      {/* ── Big Title Text: BUKITTINGGI (Layer 1 - in front of background) ── */}
      <div
        className="absolute inset-x-0 top-[28%] sm:top-[26%] md:top-[24%] lg:top-[22%] z-10 flex justify-center pointer-events-none px-4 transition-all duration-[1200ms] delay-200 ease-out"
        style={{
          transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
          opacity: isVisible ? 0.92 : 0,
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

      {/* ── Foreground Image: gunung.webp (Layer 2) with float animation ── */}
      <div
        className="absolute left-1/2 bottom-[12%] sm:bottom-[10%] md:bottom-[8%] lg:bottom-[4%] z-20 pointer-events-none transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
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

      {/* ── Soft White Gradient Fade at the bottom (Layer 3) ── */}
      <div
        className="absolute inset-x-0 bottom-0 z-30 h-[22%] sm:h-[26%] pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, #ffffff 0%, rgba(255, 255, 255, 0.94) 22%, rgba(255, 255, 255, 0.4) 65%, transparent 100%)',
        }}
      />

      {/* ── Scroll Down Indicator ── */}
      {isVisible && (
        <div
          className="absolute bottom-[10%] sm:bottom-[8%] left-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none animate-fade-in"
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
    </section>
  );
}
