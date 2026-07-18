import { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeritagePremiumCardProps {
  title: string;
  img: string;
  isVisible: boolean;
  revealDelay: number;
  width: string;
  height: string;
  borderRadius: string;
}

export function HeritagePremiumCard({
  title,
  img,
  isVisible,
  revealDelay,
  width,
  height,
  borderRadius,
}: HeritagePremiumCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 'idle' | 'opening' | 'open' | 'closing'
  const [phase, setPhase] = useState<'idle' | 'opening' | 'open' | 'closing'>('idle');
  const openTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Parallax tracking (desktop only — touch devices skip this)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const clearTimers = () => {
    if (openTimer.current)  clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  // Helper to detect touch devices
  const checkIsMobile = () => {
    return window.innerWidth < 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  };

  const handleMouseEnter = useCallback(() => {
    if (checkIsMobile()) return;
    clearTimers();
    setPhase('opening');
    openTimer.current = setTimeout(() => setPhase('open'), 950);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (checkIsMobile()) return;
    clearTimers();
    setPhase('closing');
    closeTimer.current = setTimeout(() => setPhase('idle'), 850);
  }, []);

  const getPath = useCallback(() => {
    switch (title.toLowerCase()) {
      case 'sejarah':
        return '/sejarah';
      case 'budaya':
        return '/budaya';
      case 'kuliner':
        return '/kuliner';
      default:
        return null;
    }
  }, [title]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    if (!checkIsMobile()) {
      // For desktop, navigate directly
      const path = getPath();
      if (path) {
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    
    // Stop event bubbling to prevent page side-effects
    e.stopPropagation();
    
    clearTimers();
    if (phase === 'idle' || phase === 'closing') {
      setPhase('opening');
      openTimer.current = setTimeout(() => setPhase('open'), 950);
    } else {
      const path = getPath();
      if (path) {
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setPhase('closing');
        closeTimer.current = setTimeout(() => setPhase('idle'), 850);
      }
    }
  }, [phase, navigate, getPath]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (checkIsMobile()) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  // ── Derived state ────────────────────────────────────────────────────
  const isHovered = phase === 'opening' || phase === 'open';
  const imgClass  =
    phase === 'opening' ? 'img-tear-open' :
    phase === 'closing' ? 'img-tear-close' :
    phase === 'open'    ? 'img-tear-open-static' : '';

  // Image clip for the "fully open" static phase (no animation playing — image is fully hidden)
  const openStaticClip = 'polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)';

  // Parallax offsets (reset to 0 on mobile)
  const isMobile = checkIsMobile();
  const imgX = isMobile ? 0 : (mousePos.x - 0.5) * 14;
  const imgY = isMobile ? 0 : (mousePos.y - 0.5) * 14;
  const ctaX = isMobile ? 0 : (mousePos.x - 0.5) * 5;
  const ctaY = isMobile ? 0 : (mousePos.y - 0.5) * 5;

  return (
    <div
      ref={cardRef}
      className="relative cursor-pointer select-none"
      onClick={handleCardClick}
      style={{
        width,
        height,
        borderRadius,
        // Card lift — spring overshoot on enter
        transform: isVisible
          ? isHovered
            ? isMobile
              ? 'translateY(-6px)'
              : 'translateY(-10px) scale(1.015)'
            : 'translateY(0) scale(1)'
          : 'translateY(48px) scale(0.95)',
        opacity: isVisible ? 1 : 0,
        transitionDelay: isVisible ? `${revealDelay}ms` : '0ms',
        transition: isHovered
          ? 'transform 700ms cubic-bezier(0.34,1.4,0.64,1), opacity 1000ms ease, box-shadow 450ms ease, border-color 300ms ease'
          : 'transform 850ms cubic-bezier(0.16,1,0.3,1), opacity 1000ms ease, box-shadow 600ms ease, border-color 400ms ease',
        boxShadow: isHovered
          ? '0 28px 70px rgba(0,0,0,0.42), 0 4px 20px rgba(0,0,0,0.18)'
          : '0 6px 32px rgba(0,0,0,0.22)',
        // Thin black border
        border: isHovered
          ? '1px solid rgba(0,0,0,0.35)'
          : '1px solid rgba(0,0,0,0.15)',
        overflow: 'hidden',
        willChange: 'transform, box-shadow',
        isolation: 'isolate',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >

      {/* ═══ LAYER 0 (z-0): Budaya-style deep red background ════════════════ */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: '#3A0D0D',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 350ms ease',
        }}
        aria-hidden="true"
      >
        {/* Film-grain noise texture */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.055,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '130px 130px',
          }}
        />
        {/* Radial light spot */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 40% 35%, rgba(255,255,255,0.07) 0%, transparent 65%)',
          }}
        />
        {/* Bottom vignette */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent)',
          }}
        />
      </div>

      {/* ═══ LAYER 1 (z-10): Improved Premium CTA content ════════ */}
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-6"
        style={{
          transform: isHovered
            ? `translate(${ctaX}px, ${ctaY}px)`
            : 'translate(0px, 0px)',
          transition: 'transform 350ms cubic-bezier(0.16,1,0.3,1)',
        }}
        aria-hidden={!isHovered}
      >
        {/* Compass icon with golden ring & subtle glow */}
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered
              ? 'rotate(15deg) scale(1.1) translateY(0)'
              : 'rotate(-10deg) scale(0.75) translateY(8px)',
            transition: isHovered
              ? 'opacity 450ms ease 120ms, transform 650ms cubic-bezier(0.34,1.56,0.64,1) 120ms'
              : 'opacity 200ms ease, transform 350ms ease',
            marginBottom: '16px',
            width: '46px',
            height: '46px',
            border: '1.5px solid rgba(249,206,101,0.3)',
            background: 'rgba(249,206,101,0.05)',
            boxShadow: '0 0 15px rgba(249,206,101,0.1)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="13" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2"/>
            <path
              d="M16 8L18.5 13.5L24 16L18.5 18.5L16 24L13.5 18.5L8 16L13.5 13.5L16 8Z"
              fill="url(#goldGradient)"
            />
            <defs>
              <linearGradient id="goldGradient" x1="8" y1="8" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFEAA7" />
                <stop offset="50%" stopColor="#F9CE65" />
                <stop offset="100%" stopColor="#D4A853" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Headline */}
        <h4
          className="font-cormorant text-white font-bold text-center leading-tight tracking-[0.03em]"
          style={{
            fontSize: 'clamp(20px, 2.3vw, 28px)',
            marginBottom: '10px',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
            transition: isHovered
              ? 'opacity 500ms ease 200ms, transform 650ms cubic-bezier(0.16,1,0.3,1) 200ms'
              : 'opacity 180ms ease, transform 280ms ease',
          }}
        >
          Apakah Anda<br />Siap Menjelajah?
        </h4>

        {/* Shimmer golden divider line */}
        <div
          style={{
            height: '1.5px',
            width: isHovered ? '60px' : '0px',
            background: 'linear-gradient(to right, transparent, #FFEAA7, #F9CE65, #D4A853, transparent)',
            marginBottom: '14px',
            transition: isHovered
              ? 'width 550ms cubic-bezier(0.16,1,0.3,1) 280ms'
              : 'width 200ms ease',
          }}
        />

        {/* Subtitle */}
        <p
          className="font-poppins text-white/70 text-center"
          style={{
            fontSize: 'clamp(10.5px, 1.15vw, 12.5px)',
            lineHeight: '1.7',
            letterSpacing: '0.04em',
            marginBottom: '22px',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(16px)',
            transition: isHovered
              ? 'opacity 500ms ease 250ms, transform 650ms cubic-bezier(0.16,1,0.3,1) 250ms'
              : 'opacity 150ms ease, transform 250ms ease',
          }}
        >
          Temukan cerita menarik<br />di balik destinasi ini.
        </p>

        {/* Explore button with gold hover accents */}
        <div
          className="font-poppins font-semibold uppercase text-[#FFEAA7] flex items-center gap-2.5 px-6 py-3 rounded-full"
          style={{
            fontSize: 'clamp(9px, 0.85vw, 11px)',
            letterSpacing: '0.24em',
            border: '1px solid rgba(249,206,101,0.35)',
            background: 'rgba(255,255,255,0.06)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(16px)',
            transition: isHovered
              ? 'opacity 500ms ease 320ms, transform 650ms cubic-bezier(0.16,1,0.3,1) 320ms, border-color 300ms ease'
              : 'opacity 120ms ease, transform 200ms ease',
          }}
        >
          Explore
          <span
            style={{
              display: 'inline-block',
              animation: isHovered ? 'arrowBounce 1.3s ease-in-out infinite' : 'none',
            }}
          >
            →
          </span>
        </div>

        {/* Mobile touch close hint */}
        <span
          className="md:hidden block mt-4 text-[9px] font-poppins text-white/30 tracking-[0.2em] uppercase transition-opacity duration-300"
          style={{ opacity: isHovered ? 1 : 0 }}
        >
          (Ketuk untuk tutup)
        </span>
      </div>

      {/* ═══ LAYER 2 (z-20): Image with CSS keyframe tear animation ══════
          To eliminate subpixel white margins/edges during resizing/animations,
          the image width and height is set to 102% with a -1% positioning offset.
          When in 'idle' phase, clip-path is explicitly set to 'none'.
      ══════════════════════════════════════════════════════════════════ */}
      <div
        className={imgClass}
        style={{
          position: 'absolute',
          inset: '-1%',
          zIndex: 20,
          pointerEvents: 'none',
          willChange: 'clip-path',
          ...(phase === 'open' ? { clipPath: openStaticClip, animation: 'none' } : {}),
          ...(phase === 'idle' ? { clipPath: 'none' } : {}),
        }}
        aria-hidden="true"
      >
        <img
          src={img}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover select-none"
          loading="lazy"
          draggable={false}
          style={{
            transform: `scale(${isHovered ? 1.06 : 1.0}) translate(${imgX}px, ${imgY}px)`,
            transition: isHovered
              ? 'transform 800ms cubic-bezier(0.16,1,0.3,1)'
              : 'transform 900ms cubic-bezier(0.16,1,0.3,1)',
            willChange: 'transform',
          }}
        />
        {/* Permanent bottom gradient for label readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(80,0,10,0.90) 0%, rgba(80,0,10,0.38) 35%, transparent 62%)',
          }}
        />
      </div>

      {/* ═══ LAYER 3 (z-30): Card label — fades out as tear opens ════════ */}
      <div
        className="absolute z-30 left-[8%] right-[8%] bottom-[8%] flex flex-col items-start text-left pointer-events-none"
        style={{
          opacity: isHovered ? 0 : 1,
          transform: isHovered ? 'translateY(10px)' : 'translateY(0)',
          transition: isHovered
            ? 'opacity 280ms ease, transform 350ms ease'
            : 'opacity 500ms ease 200ms, transform 600ms cubic-bezier(0.16,1,0.3,1) 200ms',
        }}
      >
        <h3
          className="font-corinthia text-white font-bold leading-none select-none mb-1"
          style={{ fontSize: 'clamp(36px, 4.5vw, 54px)' }}
        >
          {title}
        </h3>
        {/* Gold divider line */}
        <div
          className="w-[84%] my-2"
          style={{ height: '1.5px', background: 'rgba(212,168,83,0.6)' }}
        />
        <p className="font-poppins text-white/90 text-[11px] md:text-[12px] font-semibold tracking-[0.18em] flex items-center gap-1.5 uppercase leading-none">
          Mulai Jelajah
          <span className="text-[13px] font-normal">↗</span>
        </p>
      </div>

      {/* ═══ LAYER 4 (z-40): One-shot shine sweep (on opening) ══════════ */}
      {phase === 'opening' && (
        <div
          className="absolute inset-0 z-40 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '110%',
              width: '40%',
              height: '200%',
              background:
                'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.10) 50%, transparent 80%)',
              transform: 'skewX(-12deg)',
              animation: 'shinePass 700ms cubic-bezier(0.16,1,0.3,1) forwards',
            }}
          />
        </div>
      )}
    </div>
  );
}
