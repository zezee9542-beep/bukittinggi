import { useEffect, useRef, useState } from 'react';
import videoSrc from '../assets/Bukittinggi 4K.mp4';
import { useScrollReveal } from '../hooks/useScrollReveal';

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
      {/* Background Video — tilted for cinematic effect, scaled to avoid black edges */}
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

      {/* Cinematic Overlays - lighter and brighter to let the video shine through */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/20 z-10" />

      {/* Content Container — vertically centered, fully responsive padding */}
      <div className="relative z-20 flex items-center justify-center min-h-[inherit] w-full py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12">
        <div
          className={`w-full max-w-4xl text-center transition-all duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-12 opacity-0'
          }`}
        >
          {/* Corinthia Title — fluid responsive size */}
          <h2 className="font-corinthia text-white text-[clamp(36px,8vw,84px)] leading-tight mb-4 sm:mb-5 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] font-bold tracking-wide select-none">
            "Parijs Van Sumatra"
          </h2>

          {/* Subtext description — fluid size, never too wide */}
          <p className="font-poppins text-white/95 text-[clamp(12px,2.2vw,16px)] leading-[1.9] max-w-[min(760px,90vw)] mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] font-normal antialiased">
            Merupakan julukan yang diberikan kepada Kota Bukittinggi sebagai salah satu
            ikon pariwisata di Sumatera Barat. Julukan ini lahir dari pesona alamnya
            yang memikat, dengan liukan pegunungan yang indah, hamparan ngarai yang
            menakjubkan, serta udara sejuk khas dataran tinggi. Selain dikenal sebagai
            destinasi wisata, Bukittinggi juga menjadi tempat lahir sejumlah tokoh pendiri
            bangsa dan berkembang sebagai pusat perdagangan penting di Pulau Sumatera.
          </p>
        </div>
      </div>
    </section>
  );
}
