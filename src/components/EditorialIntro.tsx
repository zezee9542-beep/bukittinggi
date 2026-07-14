import { siteContent } from '../data/stories';
import { useScrollReveal } from '../hooks/useScrollReveal';

export function EditorialIntro() {
  const { intro } = siteContent;
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="relative z-20 bg-white pb-24 pt-28 md:pb-32 md:pt-36 overflow-hidden"
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

      <div className="relative mx-auto flex w-full max-w-6xl flex-row items-center px-6 z-20">
        {/* Spacer to push content right, clear of the tower in the left corner */}
        <div className="hidden md:block md:w-[280px] lg:w-[380px] xl:w-[460px] flex-shrink-0" />

        {/* Right side content */}
        <div
          className={`flex-1 flex flex-col items-center text-center transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible
              ? 'translate-y-0 opacity-100 blur-0'
              : 'translate-y-4 opacity-0 blur-[2px]'
          }`}
        >
          {/* Script Title — with shimmer gold effect */}
          <div
            className={`mb-4 inline-block border-b border-[#6E1F1F]/40 pb-2 px-6 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <span
              className="font-corinthia text-[64px] font-bold leading-none md:text-[86px]"
              style={{ color: '#6E1F1F' }}
            >
              {intro.scriptTitle}
            </span>
          </div>

          {/* Animated divider line */}
          <div
            className={`h-[1.5px] mb-6 shimmer-line transition-all duration-[1000ms] ${
              isVisible ? 'w-24 opacity-100' : 'w-0 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
            aria-hidden="true"
          />

          <h2
            id="intro-heading"
            className={`font-cormorant mb-6 text-[24px] font-bold tracking-[0.1em] text-[#6E1F1F] md:text-[34px] leading-tight transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}
            style={{ transitionDelay: '250ms' }}
          >
            {intro.heading}
          </h2>

          <div className="max-w-[520px] mx-auto leading-relaxed text-neutral-700 flex flex-col items-center">
            {intro.paragraphs.map((paragraph, idx) => (
              <p
                key={paragraph.slice(0, 24)}
                className={`font-poppins mb-4 text-[14px] font-normal leading-[1.8] text-inherit md:text-[15px] last:mb-0 transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: `${350 + idx * 120}ms` }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Ornament icons with staggered float animation */}
          <div
            className={`mt-10 flex items-center justify-center gap-4 transition-all duration-[800ms] delay-200 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '600ms' }}
            aria-hidden="true"
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <svg
                key={index}
                width="28"
                height="21"
                viewBox="0 0 32 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#6E1F1F] animate-ornament"
                style={{ animationDelay: `${index * 400}ms` }}
              >
                <path
                  d="M16 12C18.5 10 22 7 24 2C24.5 5.5 23 9 20.5 11.5C24.5 12 28 14 29.5 15.5C25.5 16.5 21 17 16 17C11 17 6.5 16.5 2.5 15.5C4 14 7.5 12 11.5 11.5C9 9 7.5 5.5 8 2C10 7 13.5 10 16 12Z"
                  fill="currentColor"
                />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
