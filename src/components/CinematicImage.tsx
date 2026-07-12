import { useEffect, useState, type CSSProperties } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import type { TimelineStory } from '../types';

interface CinematicImageProps {
  story: TimelineStory;
  index: number;
  totalItems: number;
  progress: number;
}

export function CinematicImage({ story, index, totalItems, progress }: CinematicImageProps) {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  const isFirst = index === 0;
  const isEven = index % 2 === 0;

  // Activation threshold: node is at exactly the index fraction of the timeline line
  const threshold = totalItems > 1 ? index / (totalItems - 1) : 0;
  const isActivated = progress >= threshold;

  // Desktop image reveal: once visible, stays visible (one-shot for the image pan)
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  useEffect(() => {
    if (isVisible && !hasBeenVisible) setHasBeenVisible(true);
  }, [isVisible, hasBeenVisible]);

  // Ease-in-out multi-stop gradient — much smoother than linear.
  // Only applies on DESKTOP where images overlap each other.
  const smoothTop = [
    'transparent 0%',
    'rgba(0,0,0,0.04) 3%',
    'rgba(0,0,0,0.15) 7%',
    'rgba(0,0,0,0.36) 11%',
    'rgba(0,0,0,0.64) 16%',
    'rgba(0,0,0,0.85) 20%',
    'black 24%',
  ].join(', ');

  const smoothBottom = [
    'black 76%',
    'rgba(0,0,0,0.85) 80%',
    'rgba(0,0,0,0.64) 84%',
    'rgba(0,0,0,0.36) 89%',
    'rgba(0,0,0,0.15) 93%',
    'rgba(0,0,0,0.04) 97%',
    'transparent 100%',
  ].join(', ');

  const getMaskStyle = () => {
    const mask = `linear-gradient(to bottom, ${smoothTop}, ${smoothBottom})`;
    return { maskImage: mask, WebkitMaskImage: mask };
  };

  // Mobile: animate when progress line reaches/leaves this item (bidirectional)
  const mobileRevealStyle = {
    opacity: isActivated ? 1 : 0,
    transform: isActivated ? 'translateY(0px)' : 'translateY(32px)',
    transition: 'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)',
  };

  // ─── Card style: matches reference design ───────────────────────────────────
  // Almost no background color — ultra-thin frosted glass, translucent white.
  // Text is dark so it reads clearly against the landscape image behind.
  const cardStyle: CSSProperties = {
    background: 'rgba(255, 255, 255, 0.38)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: '1px solid rgba(255, 255, 255, 0.55)',
    borderRadius: '16px',
    boxShadow: '0 2px 16px rgba(0, 0, 0, 0.08)',
  };

  return (
    <article
      ref={ref}
      className={`relative z-20 w-full ${!isFirst ? 'md:-mt-[14%]' : ''}`}
    >

      {/* ══════════════════════════════════════════════
          DESKTOP LAYOUT (md+): cinematic overlap
      ══════════════════════════════════════════════ */}
      <div
        className="hidden md:block w-full"
        style={{
          opacity: hasBeenVisible ? 1 : 0,
          transform: hasBeenVisible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1), transform 1000ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Desktop Node dot — centered on the article height */}
        <div
          className="timeline-dot absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[32]
            w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center pointer-events-none"
          style={{
            borderColor: isActivated ? '#6E1F1F' : '#b0a0a0',
            background: isActivated ? '#6E1F1F' : '#FAF8F5',
            boxShadow: isActivated ? '0 0 0 7px rgba(110,31,31,0.12)' : 'none',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: isActivated ? '10px' : '8px',
              height: isActivated ? '10px' : '8px',
              background: isActivated ? '#fff' : '#b0a0a0',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>

        {/* Desktop Connector line (axis → card) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 z-[32] h-[1.5px] pointer-events-none"
          style={{
            left: isEven ? 'calc(50% + 11px)' : 'auto',
            right: isEven ? 'auto' : 'calc(50% + 11px)',
            width: isActivated ? '36px' : '0px',
            background: '#6E1F1F',
            opacity: isActivated ? 1 : 0,
            transformOrigin: isEven ? 'left' : 'right',
            transition: isActivated
              ? 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, opacity 0.3s ease 0.1s'
              : 'width 0.25s ease, opacity 0.25s ease',
          }}
        />

        {/* Desktop Info Card — bidirectional: visible when isActivated, hidden when not */}
        <div
          className={`absolute z-40 pointer-events-auto top-1/2
            ${isEven
              ? 'left-[calc(50%+56px)] right-auto w-[360px] lg:w-[420px]'
              : 'right-[calc(50%+56px)] left-auto w-[360px] lg:w-[420px]'
            }
          `}
          style={{
            opacity: isActivated ? 1 : 0,
            transform: isActivated
              ? 'translateY(-50%) translateX(0px)'
              : isEven
                ? 'translateY(-50%) translateX(18px)'
                : 'translateY(-50%) translateX(-18px)',
            transition: isActivated
              ? 'opacity 600ms ease 0.05s, transform 800ms cubic-bezier(0.16, 1, 0.3, 1) 0.05s'
              : 'opacity 300ms ease, transform 400ms ease',
          }}
        >
          <div style={cardStyle} className="p-5 md:p-6">
            {/* Title — rich burgundy, reads well on translucent card over nature image */}
            <h3 className="font-cormorant text-[17px] sm:text-[20px] md:text-[23px] font-bold leading-snug mb-3 text-[#5C1A1A]">
              {story.title}
            </h3>
            {/* Body — deep neutral, high contrast on almost-clear glass */}
            <p className="font-poppins text-[12.5px] sm:text-[13px] leading-[1.85] text-[#1a1210]">
              {story.description}
            </p>
            {story.quote && (
              <blockquote className="mt-4 pr-4 border-r-2 border-[#6E1F1F]/50 font-poppins text-[12px] leading-relaxed text-[#6E1F1F]/80 italic font-medium text-right">
                {story.quote}
              </blockquote>
            )}
          </div>
        </div>

        {/* Desktop Image — full cinematic with mask */}
        <div
          className="relative w-full overflow-hidden bg-transparent"
          style={getMaskStyle()}
        >
          <img
            src={story.imagePath}
            alt={story.alt}
            width={story.width}
            height={story.height}
            loading="lazy"
            decoding="async"
            className="w-full h-auto block transition-all duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: hasBeenVisible ? 'scale(1)' : 'scale(1.06)',
              filter: hasBeenVisible ? 'blur(0px)' : 'blur(8px)',
              opacity: hasBeenVisible ? 1 : 0,
            }}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MOBILE LAYOUT (<md): dot on LEFT axis, image + text on RIGHT
      ══════════════════════════════════════════════ */}
      <div className="flex md:hidden flex-col w-full pb-10">

        {/* Mobile: Dot */}
        <div
          className="timeline-dot md:hidden absolute left-[20px] top-6 z-[32]
            w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center pointer-events-none"
          style={{
            borderColor: isActivated ? '#6E1F1F' : '#b0a0a0',
            background: isActivated ? '#6E1F1F' : '#FAF8F5',
            boxShadow: isActivated ? '0 0 0 7px rgba(110,31,31,0.12)' : 'none',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: isActivated ? '10px' : '8px',
              height: isActivated ? '10px' : '8px',
              background: isActivated ? '#fff' : '#b0a0a0',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>

        {/* Mobile: Image */}
        <div
          className="relative w-full pl-[52px] pr-4"
          style={mobileRevealStyle}
        >
          <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.18)]">
            <img
              src={story.imagePath}
              alt={story.alt}
              width={story.width}
              height={story.height}
              loading="lazy"
              decoding="async"
              className="w-full h-auto block transition-all duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: isActivated ? 'scale(1)' : 'scale(1.06)',
                filter: isActivated ? 'blur(0px)' : 'blur(6px)',
                opacity: isActivated ? 1 : 0,
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Mobile: Info card */}
        <div
          className="pl-[52px] pr-4 mt-4 pointer-events-auto"
          style={{
            ...mobileRevealStyle,
            transitionDelay: isActivated ? '80ms' : '0ms',
          }}
        >
          <div style={cardStyle} className="p-5">
            <h3 className="font-cormorant text-[20px] font-bold text-[#5C1A1A] leading-snug mb-3">
              {story.title}
            </h3>
            <p className="font-poppins text-[13px] leading-[1.85] text-[#1a1210]">
              {story.description}
            </p>
            {story.quote && (
              <blockquote className="mt-4 pr-4 border-r-2 border-[#6E1F1F]/60 font-poppins text-[12px] leading-relaxed text-[#6E1F1F]/80 italic font-medium text-right">
                {story.quote}
              </blockquote>
            )}
          </div>
        </div>
      </div>

    </article>
  );
}
