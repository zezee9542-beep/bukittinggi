import { useEffect, useRef, useState } from 'react';
import videoSrc from '../assets/Bukittinggi 4K.mp4';
import { useScrollReveal } from '../hooks/useScrollReveal';

const MARQUEE_TEXT = '✦ Parijs Van Sumatra ✦ Kota Wisata ✦ Minangkabau ✦ Sumatera Barat ✦ Alam Minang ✦ Warisan Budaya ✦ ';

export function ParijsSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isVisible) {
      setShouldLoadVideo(true);
    }
  }, [isVisible]);

  return (
    <section
      ref={ref}
      className="relative z-20 w-full overflow-hidden bg-neutral-900"
      style={{ minHeight: 'clamp(500px, 100svh, 900px)' }}
      aria-label="Parijs Van Sumatra Section"
    >
      {/* Background Video — tilted for cinematic effect */}
      {shouldLoadVideo ? (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{
            transform: 'rotate(-6deg) scale(1.18)',
            objectPosition: 'center center',
            transformOrigin: 'center center',
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-950" />
      )}

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/20 z-10" />

      {/* ── Animated noise texture overlay ── */}
      <div
        className="absolute inset-0 z-[11] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
          backgroundSize: '128px 128px',
        }}
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-[inherit] w-full py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12">
        <div
          className={`w-full max-w-4xl text-center transition-all duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-12 opacity-0'
          }`}
        >
          {/* Animated label pill */}
          <div
            className={`inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/20 mb-8 transition-all duration-[1000ms] ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              transitionDelay: '100ms',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-breathe"
              style={{ background: '#F9CE65' }}
              aria-hidden="true"
            />
            <span
              className="font-poppins text-[11px] tracking-[0.28em] uppercase text-white/75"
            >
              Kota Wisata Sumatera
            </span>
          </div>

          {/* Corinthia Title — shimmer gold */}
          <h2
            className={`font-corinthia text-white text-[clamp(36px,8vw,84px)] leading-tight mb-4 sm:mb-5 font-bold tracking-wide select-none transition-all duration-[1400ms] ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionDelay: '200ms',
              textShadow: '0 4px 24px rgba(0,0,0,0.5)',
            }}
          >
            <span className="shimmer-gold">"Parijs Van Sumatra"</span>
          </h2>

          {/* Gold divider with grow animation */}
          <div
            className={`mx-auto mb-6 h-[1.5px] shimmer-line transition-all duration-[1200ms] ${
              isVisible ? 'w-32 opacity-100' : 'w-0 opacity-0'
            }`}
            style={{ transitionDelay: '400ms' }}
            aria-hidden="true"
          />

          {/* Subtext description */}
          <p
            className={`font-poppins text-white/90 text-[clamp(12px,2.2vw,16px)] leading-[1.9] max-w-[min(760px,90vw)] mx-auto font-normal antialiased transition-all duration-[1400ms] ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            Merupakan julukan yang diberikan kepada Kota Bukittinggi sebagai salah satu
            ikon pariwisata di Sumatera Barat. Julukan ini lahir dari pesona alamnya
            yang memikat, dengan liukan pegunungan yang indah, hamparan ngarai yang
            menakjubkan, serta udara sejuk khas dataran tinggi. Selain dikenal sebagai
            destinasi wisata, Bukittinggi juga menjadi tempat lahir sejumlah tokoh pendiri
            bangsa dan berkembang sebagai pusat perdagangan penting di Pulau Sumatera.
          </p>
        </div>
      </div>

      {/* ── Bottom Marquee Ticker ── */}
      <div
        className={`absolute bottom-0 inset-x-0 z-30 overflow-hidden border-t border-white/10 transition-all duration-[800ms] ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          transitionDelay: '800ms',
        }}
        aria-hidden="true"
      >
        <div className="flex overflow-hidden py-3">
          <div className="marquee-track">
            <span className="marquee-content font-poppins text-[11px] sm:text-[12px] tracking-[0.25em] text-white/60 uppercase">
              {MARQUEE_TEXT} {MARQUEE_TEXT} {MARQUEE_TEXT}
            </span>
            <span className="marquee-content font-poppins text-[11px] sm:text-[12px] tracking-[0.25em] text-white/60 uppercase">
              {MARQUEE_TEXT} {MARQUEE_TEXT} {MARQUEE_TEXT}
            </span>
          </div>
        </div>
      </div>

    </section>
  );
}
