import { useScrollReveal } from '../hooks/useScrollReveal';
import imggWebp from '../assets/imgg.webp';
import gunungWebp from '../assets/gunung.webp';

export function HeroSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="relative min-h-[580px] sm:min-h-[680px] md:min-h-[760px] lg:min-h-[100vh] w-full overflow-hidden bg-white"
      aria-label="Hero Bukittinggi Heritage"
    >
      {/* ── Background Image: imgg.webp (Layer 0 - full screen at the very back) ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={imggWebp}
          alt="Bukittinggi Landscape"
          className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
          fetchPriority="high"
          decoding="sync"
          draggable={false}
        />
      </div>

      {/* ── Big Title Text: BUKITTINGGI (Layer 1 - in front of background) ── */}
      <div 
        className="absolute inset-x-0 top-[28%] sm:top-[26%] md:top-[24%] lg:top-[22%] z-10 flex justify-center pointer-events-none px-4 transition-all duration-[1200ms] delay-200 ease-out"
        style={{
          transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
          opacity: isVisible ? 0.92 : 0,
        }}
      >
        <h1
          className="font-cormorant font-semibold text-white tracking-[0.08em] select-none text-center uppercase"
          style={{ 
            fontSize: 'clamp(44px, 11vw, 156px)', 
            lineHeight: '1.0',
            textShadow: '0 0 35px rgba(255, 255, 255, 0.45), 0 0 10px rgba(255, 255, 255, 0.25), 0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          BUKITTINGGI
        </h1>
      </div>

      {/* ── Foreground Image: gunung.webp (Layer 2 - placed at the very front) ── */}
      <div 
        className="absolute left-1/2 bottom-[12%] sm:bottom-[10%] md:bottom-[8%] lg:bottom-[4%] z-20 pointer-events-none transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: isVisible ? 'translateX(-50%) translateY(0) scale(1)' : 'translateX(-50%) translateY(32px) scale(0.96)',
          opacity: isVisible ? 1 : 0,
          width: 'clamp(280px, 82vw, 880px)',
        }}
      >
        <img
          src={gunungWebp}
          alt="Gunung Foreground"
          className="w-full h-auto object-contain select-none filter drop-shadow-[0_16px_48px_rgba(0,0,0,0.2)]"
          draggable={false}
        />
      </div>

      {/* ── Soft White Gradient Fade/Mist at the bottom (Layer 3) ── */}
      <div
        className="absolute inset-x-0 bottom-0 z-30 h-[22%] sm:h-[26%] pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #ffffff 0%, rgba(255, 255, 255, 0.94) 22%, rgba(255, 255, 255, 0.4) 65%, transparent 100%)'
        }}
      />
    </section>
  );
}
