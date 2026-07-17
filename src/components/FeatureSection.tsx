import { useScrollReveal } from '../hooks/useScrollReveal';
import { useNavigate } from 'react-router-dom';
import c1Icon from '../assets/c1.svg';
import c2Icon from '../assets/c2.svg';

export function FeatureSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const navigate = useNavigate();

  const features = [
    {
      icon: c1Icon,
      title: 'Jelajahi Bukittinggi',
      description:
        'Jelajahi destinasi wisata, sejarah, budaya, kuliner, dan pengalaman menarik yang menjadikan Bukittinggi istimewa.',
      action: () => navigate('/sejarah'),
    },
    {
      icon: c2Icon,
      title: 'AI Heritage Assistant',
      description:
        'Tanyakan apa saja dan temukan kisah, budaya, serta sejarah Bukittinggi lebih mendalam.',
      action: () => {
        window.dispatchEvent(new CustomEvent('open-rancak-bot'));
      },
    },
    {
      icon: c2Icon,
      title: 'AI Travel Planner',
      description:
        'Buat rencana perjalanan personal berdasarkan jumlah hari dan budget Anda.',
      action: () => navigate('/travel-planner'),
    },
  ];

  return (
    <section
      ref={ref}
      className="relative bg-white py-16 md:py-28 overflow-hidden flex items-center"
      aria-labelledby="features-heading"
    >
      <div className="relative mx-auto w-full max-w-[1280px] px-6 md:px-12 z-10 flex flex-col items-center">

        {/* Subtitle label */}
        <span
          className={`font-poppins text-[11px] font-medium tracking-[0.28em] uppercase mb-4 transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ color: '#D4A853' }}
        >
          Fitur Utama
        </span>

        {/* Main heading */}
        <h2
          id="features-heading"
          className={`font-poppins text-center font-bold text-[#1a1a1a] leading-tight mb-12 md:mb-16 transition-all duration-700 delay-100 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
          style={{ fontSize: 'clamp(26px, 5vw, 44px)' }}
        >
          <span className="block">Temukan Kisah di Setiap Sudut</span>
          <span className="inline-flex items-center mt-2">
            <span
              className="text-white font-semibold px-6 py-2 rounded-full"
              style={{
                background: '#5E1D1D',
                fontSize: '0.875em',
                letterSpacing: '0.01em',
              }}
            >
              Bukittinggi
            </span>
          </span>
        </h2>

        {/* ── Cards wrapper ── */}
        <div
          className={`relative w-full max-w-[1100px] mx-auto transition-all duration-700 delay-200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {/* ── Background soft blurred gradient ellipses — half behind card, half outside ── */}
          {/* Left blue eclipse */}
          <div
            className="absolute pointer-events-none select-none z-0"
            aria-hidden="true"
            style={{
              left: '-100px',
              top: '5%',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: '#318BD4',
              opacity: 0.40,
              filter: 'blur(75px)',
            }}
          />
          {/* Right peach eclipse */}
          <div
            className="absolute pointer-events-none select-none z-0"
            aria-hidden="true"
            style={{
              right: '-100px',
              bottom: '5%',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: '#F98272',
              opacity: 0.40,
              filter: 'blur(75px)',
            }}
          />

          {/* ── Three separate cards ── */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                onClick={feature.action}
                className={`group flex flex-col items-center text-center bg-white rounded-[24px] px-8 py-10 md:px-10 md:py-12 transition-all duration-500 border border-neutral-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] cursor-pointer select-none ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{
                  transitionDelay: `${320 + idx * 140}ms`,
                }}
              >
                {/* Circle icon background */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-400"
                  style={{ background: '#F7E0E0' }}
                >
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-7 h-7 object-contain"
                    draggable={false}
                  />
                </div>

                {/* Title */}
                <h3
                  className="font-poppins font-semibold text-[#1a1a1a] mb-4 text-center"
                  style={{ fontSize: 'clamp(16px, 1.8vw, 19.5px)' }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="font-poppins text-neutral-500 leading-[1.7] max-w-[280px] mx-auto text-center"
                  style={{ fontSize: 'clamp(12px, 1.25vw, 13.5px)' }}
                >
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
