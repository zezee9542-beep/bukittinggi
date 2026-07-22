import { useEffect, useRef, useState } from 'react';
import Mascot3D from './Mascot3D';

interface MascotLauncherProps {
  hidden?: boolean;
  onClick: () => void;
}

export default function MascotLauncher({ hidden = false, onClick }: MascotLauncherProps) {
  const modelHostRef = useRef<HTMLSpanElement>(null);
  const [isNearFooter, setIsNearFooter] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll detection: Hide bubble during scroll, show when scroll stops
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Auto-hide bubble when scroll reaches the footer area
  useEffect(() => {
    const checkFooterScroll = () => {
      const footer = document.querySelector('footer');
      if (footer) {
        const rect = footer.getBoundingClientRect();
        // Hide if top of footer enters viewport or is near bottom
        if (rect.top <= window.innerHeight + 20) {
          setIsNearFooter(true);
          return;
        }
      }
      setIsNearFooter(false);
    };

    window.addEventListener('scroll', checkFooterScroll, { passive: true });
    checkFooterScroll();
    return () => window.removeEventListener('scroll', checkFooterScroll);
  }, []);

  useEffect(() => {
    const host = modelHostRef.current;
    if (!host) return;

    const keepOnlyCurrentCanvas = () => {
      const canvases = Array.from(host.querySelectorAll('canvas'));
      canvases.forEach((canvas, index) => {
        const isCurrent = index === canvases.length - 1;
        canvas.style.display = isCurrent ? 'block' : 'none';
        canvas.setAttribute('aria-hidden', isCurrent ? 'false' : 'true');
      });
    };

    keepOnlyCurrentCanvas();
    const observer = new MutationObserver(keepOnlyCurrentCanvas);
    return () => observer.disconnect();
  }, []);

  return (
    // Wrapper layout matches Figma specs: flex items-start with gap 10px
    <div
      className="group fixed bottom-5 right-3 z-[65] flex items-start gap-[10px] transition-all duration-500 ease-in-out pointer-events-none opacity-100 translate-y-0 scale-100"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Buka RancakBot"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Interactive Pill Badge - Hides when scrolling, near footer, or when chat panel is open */}
      <div 
        className={`flex h-[50px] md:h-[60px] items-center pl-[18px] pr-[20px] rounded-[20px] rounded-br-none bg-[#531717] border border-[#F9CE65] shadow-lg transition-all duration-500 ease-in-out cursor-pointer ${
          hidden || isNearFooter || isScrolling ? 'opacity-0 scale-90 -translate-x-4 pointer-events-none' : 'opacity-100 scale-100 translate-x-0 pointer-events-auto'
        }`}
      >
        <span className="relative mr-[10px] flex h-[11px] w-[11px]">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00B242] opacity-75"></span>
          <span className="relative inline-flex h-full w-full rounded-full bg-[#00B242]"></span>
        </span>
        <span className="font-poppins text-[14px] md:text-[16px] font-normal leading-[1.8em] text-[#DED8E1] whitespace-nowrap">
          Tanya Ambo RancakBot
        </span>
      </div>

      {/* 3D Mascot Container */}
      <div className="relative mt-[18px] md:mt-[23px] w-[80px] h-[106px] md:w-[104px] md:h-[138px] transition-transform duration-200 ease-out hover:scale-[1.05] active:scale-[0.95] cursor-pointer pointer-events-auto">
        <span className="sr-only">Buka RancakBot</span>
        <span ref={modelHostRef} className="relative block h-full w-full">
          <Mascot3D />
        </span>
      </div>
    </div>
  );
}
