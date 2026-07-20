import { useEffect, useRef, useState } from 'react';
import { culturalStories, siteContent } from '../data/stories';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { CinematicImage } from '../components/CinematicImage';
import minNGSrc from '../assets/minNG.svg';

export function HistoryPage() {
  const { timeline } = siteContent;
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal<HTMLElement>();
  const { ref: footerRef, isVisible: footerVisible } = useScrollReveal<HTMLElement>();
  
  const timelineRef = useRef<HTMLDivElement | null>(null);

  // State to track scroll progress and dynamic line dimensions
  const [progress, setProgress] = useState(0);
  const [lineBounds, setLineBounds] = useState({ top: 0, height: 0 });

  useEffect(() => {
    const updateBoundsAndScroll = () => {
      const timeline = timelineRef.current;
      if (!timeline) return;

      const isMobileLayout = window.innerWidth < 768;
      const dots = Array.from(timeline.querySelectorAll('.timeline-dot')) as HTMLElement[];
      const activeDots = dots.filter((dot) => {
        // Mobile dots have 'md:hidden' class; desktop dots do NOT have it
        const hasMdHidden = dot.classList.contains('md:hidden');
        return isMobileLayout ? hasMdHidden : !hasMdHidden;
      });

      if (activeDots.length < 2) return;

      const containerRect = timeline.getBoundingClientRect();
      const firstDotRect = activeDots[0].getBoundingClientRect();
      const lastDotRect = activeDots[activeDots.length - 1].getBoundingClientRect();

      // Find node positions relative to the timeline container top
      const firstMid = (firstDotRect.top + firstDotRect.height / 2) - containerRect.top;
      const lastMid = (lastDotRect.top + lastDotRect.height / 2) - containerRect.top;
      const lineHeight = Math.max(0, lastMid - firstMid);

      setLineBounds({
        top: firstMid,
        height: lineHeight,
      });

      // Calculate progress relative to the viewport midpoint
      const rect = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const currentScrollPos = (vh / 2) - rect.top;

      if (lineHeight > 0) {
        // 0 = first node is at screen center
        // 1 = last node is at screen center
        const raw = (currentScrollPos - firstMid) / lineHeight;
        setProgress(Math.min(1, Math.max(0, raw)));
      } else {
        setProgress(0);
      }
    };

    // Initial calculation
    updateBoundsAndScroll();

    // ResizeObserver tracks height changes dynamically (responsive)
    const observer = new ResizeObserver(() => {
      updateBoundsAndScroll();
    });
    observer.observe(timelineRef.current!);

    // Listeners for scroll and resize
    window.addEventListener('scroll', updateBoundsAndScroll, { passive: true });
    window.addEventListener('resize', updateBoundsAndScroll);

    // Watch for image loads to re-calculate bounds once dimensions are known
    const images = timelineRef.current?.querySelectorAll('img');
    images?.forEach((img) => {
      if (img.complete) {
        updateBoundsAndScroll();
      } else {
        img.addEventListener('load', updateBoundsAndScroll);
      }
    });

    // Timeout safety fallback
    const timer = setTimeout(updateBoundsAndScroll, 1000);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateBoundsAndScroll);
      window.removeEventListener('resize', updateBoundsAndScroll);
      images?.forEach((img) => img.removeEventListener('load', updateBoundsAndScroll));
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] overflow-x-hidden">
      
      {/* ── Hero Section ── */}
      <section
        ref={heroRef}
        className="relative mx-auto w-full max-w-[1512px] px-6 pt-36 pb-12 sm:pt-44 md:pt-48 md:pb-16 text-center"
        aria-labelledby="history-heading"
      >
        <div
          className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 blur-sm'
          }`}
        >
          <h1
            id="history-heading"
            className="font-cormorant mb-6 text-[32px] sm:text-[44px] md:text-[56px] font-bold leading-tight text-[#6E1F1F] tracking-wider uppercase"
          >
            {timeline.heading}
          </h1>
          <p className="font-poppins mx-auto max-w-2xl px-4 text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-relaxed text-neutral-600">
            {timeline.description}
          </p>
        </div>
      </section>

      {/* ── Timeline Section ── */}
      <div ref={timelineRef} className="relative w-full pb-16">
        
        {/* ═══════════════════════════════════════
            GRAY TRACK LINE (First dot to last dot only)
        ════════════════════════════════════════ */}
        {/* Desktop */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[2px] z-30 hidden md:block pointer-events-none"
          style={{
            top: `${lineBounds.top}px`,
            height: `${lineBounds.height}px`,
            background: 'rgba(160,140,140,0.35)',
          }}
        />
        {/* Mobile — left-[30px]: center of 2px line = 31px, matching dot center (left-[20px] + 11px half-width) */}
        <div
          className="absolute left-[30px] w-[2px] z-30 md:hidden pointer-events-none"
          style={{
            top: `${lineBounds.top}px`,
            height: `${lineBounds.height}px`,
            background: 'rgba(160,140,140,0.35)',
          }}
        />

        {/* ═══════════════════════════════════════
            RED PROGRESS LINE (First dot to last dot only)
        ════════════════════════════════════════ */}
        {/* Desktop */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[2px] z-[31] hidden md:block pointer-events-none origin-top"
          style={{
            top: `${lineBounds.top}px`,
            height: `${progress * lineBounds.height}px`,
            background: 'linear-gradient(to bottom, #6E1F1F 0%, #8C1D24 100%)',
            boxShadow: '0 0 10px rgba(110,31,31,0.45)',
            transition: 'height 60ms cubic-bezier(0.1, 0.8, 0.2, 1)',
          }}
        />
        {/* Mobile progress line */}
        <div
          className="absolute left-[30px] w-[2px] z-[31] md:hidden pointer-events-none origin-top"
          style={{
            top: `${lineBounds.top}px`,
            height: `${progress * lineBounds.height}px`,
            background: 'linear-gradient(to bottom, #6E1F1F 0%, #8C1D24 100%)',
            boxShadow: '0 0 10px rgba(110,31,31,0.45)',
            transition: 'height 60ms cubic-bezier(0.1, 0.8, 0.2, 1)',
          }}
        />

        {/* ── Cinematic timeline list items ── */}
        <div className="relative z-20 flex flex-col w-full">
          {culturalStories.map((story, index) => (
            <CinematicImage
              key={story.id}
              story={story}
              index={index}
              totalItems={culturalStories.length}
              progress={progress}
            />
          ))}
        </div>
      </div>

      {/* ── Ending Footer Quote Section ── */}
      <footer
        ref={footerRef}
        className="relative mx-auto w-full max-w-3xl px-6 pt-20 pb-32 text-center"
      >
        <div
          className={`transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            footerVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {/* Quote — italic Cormorant, exact size from design */}
          <h2 className="font-cormorant text-[#6E1F1F] text-[28px] sm:text-[34px] md:text-[40px] font-bold italic tracking-wide leading-snug">
            "Sakali Aia Gadang, Sakali Tapian Barubah"
          </h2>

          {/* Horizontal burgundy line */}
          <div className="w-24 sm:w-32 h-[1px] bg-[#6E1F1F] mx-auto mt-4 mb-4" />

          {/* Subtext */}
          <p className="font-poppins text-neutral-500 text-[13px] sm:text-[14px] leading-relaxed max-w-sm mx-auto">
            Waktu terus bergerak, namun nilai-nilai yang diwariskan tetap menjadi
            penuntun perjalanan.
          </p>

          {/* Single minNG.svg icon containing the 3 mini-icons */}
          <div className="mt-8 flex items-center justify-center">
            <img src={minNGSrc} alt="Ornamen Minangkabau" className="h-6 sm:h-8 w-auto object-contain" />
          </div>
        </div>
      </footer>

    </div>
  );
}

export default HistoryPage;
