import { siteContent } from '../data/stories';
import { useScrollReveal } from '../hooks/useScrollReveal';
import menaraPng from '../assets/menara.webp';
import earthPng from '../assets/earth.png';

export function EditorialIntro() {
  const { intro } = siteContent;
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="relative z-20 bg-white py-16 md:py-36 min-h-[650px] md:min-h-[850px] overflow-hidden flex items-center border-none shadow-none"
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
        className={`absolute top-[-30px] bottom-[-40px] left-[-4%] md:left-[-1%] lg:left-[2%] w-full md:w-[44%] lg:w-[42%] flex items-end justify-center pointer-events-none transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? 'translate-x-0 opacity-15 md:opacity-100' : '-translate-x-16 opacity-0'
        }`}
        style={{ zIndex: 10 }}
      >
        <img
          src={menaraPng}
          alt="Jam Gadang Tower"
          className="w-auto h-full max-h-none object-contain select-none filter drop-shadow-[0_16px_40px_rgba(0,0,0,0.12)] scale-110 origin-bottom"
          draggable={false}
        />
      </div>

      {/* ── Layout container with text aligned to the Right ── */}
      <div className="relative mx-auto flex flex-col md:flex-row items-center justify-end w-full max-w-[1280px] px-6 md:px-12 z-20">
        
        {/* Spacer for absolute left tower */}
        <div className="hidden md:block md:w-[35%] lg:w-[32%] flex-shrink-0" />

        {/* Right column: Content Text Block */}
        <div
          className={`flex-1 flex flex-col items-center md:items-start text-center md:text-left pt-6 md:pt-10 transition-all duration-[1300ms] delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
              className="font-corinthia text-[52px] sm:text-[72px] md:text-[124px] font-bold leading-none"
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
            className={`font-cormorant mt-4 mb-5 text-[20px] sm:text-[26px] md:text-[46px] font-bold tracking-[0.15em] text-[#6E1F1F] leading-tight transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}
            style={{ transitionDelay: '250ms' }}
          >
            {intro.heading}
          </h2>

          {/* Paragraph description - centered text inside container, left-aligned on md */}
          <div className="w-full max-w-[620px] mx-auto md:mx-0 leading-relaxed text-neutral-800 text-center md:text-left flex flex-col items-center md:items-start">
            {intro.paragraphs.map((paragraph, idx) => (
              <p
                key={paragraph.slice(0, 24)}
                className={`font-poppins mb-4 text-[13px] sm:text-[14px] md:text-[18px] font-normal leading-[1.75] text-[#222222] last:mb-0 transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: `${350 + idx * 120}ms` }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Button "Profil Bukittinggi" */}
          <div
            className={`mt-8 flex justify-center w-full md:justify-end md:pr-16 transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: '550ms' }}
          >
            <button
              className="w-[220px] h-[52px] rounded-[12px] bg-[#6E1F1F] text-white font-poppins font-medium text-[18px] flex items-center justify-center gap-2 hover:bg-[#521616] active:scale-[0.98] transition-all duration-300 shadow-md cursor-pointer"
              style={{ width: '220px', height: '52px', borderRadius: '12px' }}
            >
              Profil Bukittinggi <span className="text-[22px] leading-none mb-[2px]">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Earth background image at bottom right */}
      <img
        src={earthPng}
        alt="Earth Background"
        className="absolute bottom-[-20px] right-0 pointer-events-none z-0 w-[1050px] h-[155px] object-right-bottom object-cover"
        style={{ width: '1050px', height: '155px', maxWidth: 'none' }}
      />
    </section>

  );
}
