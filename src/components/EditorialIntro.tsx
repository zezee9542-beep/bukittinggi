import { siteContent } from '../data/stories';
import { useScrollReveal } from '../hooks/useScrollReveal';
import menaraPng from '../assets/menara.png';

export function EditorialIntro() {
  const { intro } = siteContent;
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="relative z-20 bg-white py-16 md:py-36 min-h-[650px] md:min-h-[850px] overflow-hidden flex items-center"
      aria-labelledby="intro-heading"
    >
      {/* ── Decorative background circles — subtle depth ── */}
      <div
        className="absolute -top-20 -right-20 w-[320px] h-[320px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(110,31,31,0.04) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-10 -left-16 w-[260px] h-[260px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(212,168,83,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* ── Tall Jam Gadang tower image (menara.png) stretching from top to bottom ── */}
      <div
        className={`absolute top-0 bottom-0 left-0 md:left-[4%] lg:left-[8%] w-full md:w-[42%] flex items-end justify-center pointer-events-none transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? 'translate-x-0 opacity-15 md:opacity-100' : '-translate-x-16 opacity-0'
        }`}
        style={{ zIndex: 10 }}
      >
        <img
          src={menaraPng}
          alt="Jam Gadang Tower"
          className="w-auto h-full max-h-none object-contain select-none filter drop-shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
          draggable={false}
        />
      </div>

      {/* ── Layout container with text aligned to the Right ── */}
      <div className="relative mx-auto flex flex-col md:flex-row items-center justify-end w-full max-w-[1280px] px-6 md:px-12 z-20">
        
        {/* Spacer for absolute left tower */}
        <div className="hidden md:block md:w-[45%] lg:w-[42%] flex-shrink-0" />

        {/* Right column: Content Text Block */}
        <div
          className={`flex-1 flex flex-col items-center md:items-start text-center md:text-left transition-all duration-[1300ms] delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible
              ? 'translate-y-0 opacity-100 blur-0'
              : 'translate-y-6 opacity-0 blur-[3px]'
          }`}
        >
          {/* Cursive script title with double underline style */}
          <div
            className={`relative mb-4 inline-block transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <span
              className="font-corinthia text-[82px] sm:text-[98px] md:text-[124px] font-bold leading-none"
              style={{ color: '#6E1F1F' }}
            >
              {intro.scriptTitle}
            </span>
            {/* Double underline decoration */}
            <div className="absolute left-0 bottom-[-6px] w-full flex flex-col gap-[3px]">
              <div className="h-[2px] bg-[#6E1F1F]/60 w-full" />
              <div className="h-[2px] bg-[#6E1F1F]/60 w-full" />
            </div>
          </div>

          {/* Subtitle - capitalized, bold cormorant */}
          <h2
            id="intro-heading"
            className={`font-cormorant mt-6 mb-8 text-[28px] sm:text-[36px] md:text-[46px] font-bold tracking-[0.15em] text-[#6E1F1F] leading-tight transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}
            style={{ transitionDelay: '250ms' }}
          >
            {intro.heading}
          </h2>

          {/* Paragraph description - centered text inside container */}
          <div className="w-full max-w-[620px] mx-auto md:mx-0 leading-relaxed text-neutral-800 text-center flex flex-col items-center">
            {intro.paragraphs.map((paragraph, idx) => (
              <p
                key={paragraph.slice(0, 24)}
                className={`font-poppins mb-6 text-[15px] sm:text-[16px] md:text-[18px] font-normal leading-[1.85] text-[#222222] last:mb-0 transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: `${350 + idx * 120}ms` }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Staggered decorative bottom separator line */}
          <div
            className={`mt-10 flex justify-center w-full md:justify-start transition-all duration-[800ms] delay-200 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '600ms' }}
            aria-hidden="true"
          >
            <div className="h-[1.5px] w-24 bg-[#6E1F1F]/20" />
          </div>
        </div>
      </div>
    </section>

  );
}
