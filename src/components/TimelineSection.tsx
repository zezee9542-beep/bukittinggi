import { culturalStories, siteContent } from '../data/stories';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { CinematicImage } from './CinematicImage';

export function TimelineSection() {
  const { timeline } = siteContent;
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="relative bg-white pb-28 pt-10 md:pb-36 md:pt-14"
      aria-labelledby="timeline-heading"
    >
      <div className="relative mx-auto w-full max-w-[1512px] px-6">
        <header
          className={`relative z-20 mb-12 text-center transition-all duration-[800ms] ease-[cubic-bezier(0.32,0.72,0,1)] md:mb-16 ${
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-12 opacity-0 blur-sm'
          }`}
        >
          <h2
            id="timeline-heading"
            className="font-cormorant mb-5 text-[34px] font-bold leading-tight text-[#8C1D24] md:text-[54px]"
          >
            {timeline.heading}
          </h2>
          <p className="font-poppins mx-auto max-w-2xl px-4 text-[14px] font-normal leading-relaxed text-neutral-600 md:text-[16px]">
            {timeline.description}
          </p>
        </header>
      </div>

      <div className="relative z-20 flex flex-col w-full">
        {culturalStories.map((story, index) => (
          <CinematicImage
            key={story.id}
            story={story}
            index={index}
            totalItems={culturalStories.length}
            progress={1}
          />
        ))}
      </div>
    </section>
  );
}
