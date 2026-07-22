import { useScrollReveal } from '../hooks/useScrollReveal';
import { useNavigate } from 'react-router-dom';
import group12Png from '../assets/Group 12.webp';
import searPng from '../assets/sear.webp';
import chPng from '../assets/ch.webp';
import simPng from '../assets/sim.webp';

export function FeatureSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const navigate = useNavigate();

  const features = [
    {
      id: 'jelajahi',
      title: 'Jelajahi Bukittinggi',
      description: 'Jelajahi destinasi wisata, sejarah, budaya, kuliner yang menjadikan Bukittinggi istimewa.',
      action: () => navigate('/sejarah'),
      icon: (
        <img src={searPng} alt="Jelajahi Icon" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />
      ),
    },
    {
      id: 'assistant',
      title: 'AI Heritage Assistant',
      description: 'Tanyakan apa saja dan temukan kisah, budaya, serta sejarah Bukittinggi lebih mendalam.',
      action: () => {
        window.dispatchEvent(new CustomEvent('open-rancak-bot'));
      },
      icon: (
        <img src={chPng} alt="Assistant Icon" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />
      ),
    },
    {
      id: 'planner',
      title: 'AI Travel Planner',
      description: 'Buat rencana perjalanan personal berdasarkan jumlah hari dan budget Anda.',
      action: () => navigate('/travel-planner'),
      icon: (
        <img src={simPng} alt="Travel Planner Icon" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />
      ),
    },
    {
      id: 'game',
      title: 'Jelajahi & Mainkan',
      description: 'Pelajari Bukittinggi dengan berbagai tantangan dan permainan interaktif.',
      action: () => navigate('/game'),
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#6E1F1F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="6" y1="12" x2="10" y2="12" />
          <line x1="8" y1="10" x2="8" y2="14" />
          <circle cx="15" cy="13" r="1" fill="currentColor" />
          <circle cx="18" cy="11" r="1" fill="currentColor" />
          <rect x="2" y="6" width="20" height="12" rx="5" />
        </svg>
      ),
    },
  ];

  return (
    <section
      ref={ref}
      className="relative bg-white pt-24 sm:pt-32 pb-32 sm:pb-40 overflow-hidden flex flex-col items-center justify-center border-none shadow-none"
      aria-labelledby="features-heading"
    >
      {/* ── Keyframe Animations for Floating Group 12.webp Particles ── */}
      <style>{`
        @keyframes floatOrb1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
      `}</style>

      {/* ── Soft Blurred Eclipse Gradient Aura ── */}
      <div
        className="absolute top-[4%] sm:top-[6%] left-1/2 -translate-x-1/2 w-[550px] sm:w-[820px] md:w-[980px] h-[340px] sm:h-[450px] pointer-events-none select-none z-0 rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(110, 31, 31, 0.15) 0%, rgba(254, 203, 197, 0.52) 59%, transparent 80%)',
          filter: 'blur(80px)',
        }}
      />

      {/* ── Floating Ball Particles (Slightly smaller Group 12.webp image asset moved higher up) ── */}
      <div className="absolute top-[2%] sm:top-[4%] inset-x-0 pointer-events-none z-10 overflow-hidden flex items-center justify-center px-4">
        <img
          src={group12Png}
          alt="Floating Particles Group 12"
          className="w-full max-w-[950px] sm:max-w-[1120px] h-auto object-contain select-none opacity-95 animate-[floatOrb1_6s_ease-in-out_infinite]"
        />
      </div>

      <div className="relative z-20 mx-auto flex w-full max-w-[1440px] flex-col items-center px-4 sm:px-8 md:px-12 mt-6 sm:mt-10">

        {/* Subtitle Label */}
        <span
          className={`font-poppins text-[11px] font-semibold tracking-[0.28em] uppercase mb-4 transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ color: '#D4A853' }}
        >
          Fitur Utama
        </span>

        {/* Headline with Maroon Pill Badge */}
        <h2
          id="features-heading"
          className={`font-poppins text-center font-bold text-[#111111] leading-tight mb-12 sm:mb-16 transition-all duration-700 delay-100 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
          style={{ fontSize: 'clamp(28px, 4.5vw, 46px)' }}
        >
          <span className="block mb-2 sm:mb-3">Temukan Kisah di Setiap</span>
          <span className="inline-flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            <span>Sudut</span>
            <span
              className="text-white font-bold px-6 sm:px-8 py-1.5 sm:py-2.5 rounded-full inline-block shadow-md"
              style={{
                backgroundColor: '#6E1F1F',
                fontSize: '0.92em',
                letterSpacing: '0.01em',
              }}
            >
              Bukittinggi
            </span>
          </span>
        </h2>

        {/* ── 4 Feature Cards Grid ── */}
        <div
          className={`relative z-20 mx-auto w-full max-w-[1340px] transition-all duration-700 delay-200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="grid grid-cols-1 justify-items-center gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <div
                key={feature.id}
                onClick={feature.action}
                className={`group flex min-h-[260px] sm:min-h-[280px] w-full max-w-[310px] flex-col items-center justify-start rounded-[24px] sm:rounded-[28px] border border-neutral-100/90 bg-white/95 backdrop-blur-sm px-6 py-8 text-center shadow-[0_10px_35px_rgba(110,31,31,0.04)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_22px_45px_rgba(110,31,31,0.09)] hover:border-amber-200 select-none cursor-pointer ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{
                  transitionDelay: `${250 + idx * 120}ms`,
                }}
              >
                {/* Soft Red Circle Icon Container */}
                <div className="mb-5 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#FCE8E6] transition-transform duration-300 group-hover:scale-110 shadow-sm flex-shrink-0">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="mb-2.5 text-center font-poppins font-bold text-[#1a1a1a] text-lg sm:text-[19px]">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="font-poppins text-neutral-500 text-xs sm:text-[13px] leading-relaxed max-w-[250px] mx-auto text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default FeatureSection;
