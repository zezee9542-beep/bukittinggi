import { useEffect, useRef } from 'react';
import Mascot3D from './Mascot3D';

interface MascotLauncherProps {
  hidden?: boolean;
  onClick: () => void;
}

export default function MascotLauncher({ hidden = false, onClick }: MascotLauncherProps) {
  const modelHostRef = useRef<HTMLSpanElement>(null);

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
    observer.observe(host, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    // Wrapper layout matches Figma specs: flex items-start with gap 10px
    <div
      className={`group fixed bottom-5 right-3 z-[65] flex items-start gap-[10px] transition-all duration-500 ease-in-out pointer-events-none
        ${hidden 
          ? 'opacity-0 translate-y-10 md:opacity-100 md:translate-y-0' 
          : 'opacity-100 translate-y-0'}
      `}
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
      {/* Interactive Pill Badge - Exact Figma dimensions and styling */}
      {/* bg-[#531717] with #F9CE65 border and custom border radius (flat bottom-right) */}
      {/* 
        [Refactor]: pointer-events-auto and cursor-pointer applied strictly to the Pill Badge and Mascot.
        Parent div uses pointer-events-none to prevent invisible flex-gap/layout space from intercepting clicks 
        (menghindari tumpang tindih hitbox yang menutupi area input chat).
      */}
      <div 
        className={`flex h-[50px] md:h-[60px] items-center pl-[18px] pr-[20px] rounded-[20px] rounded-br-none bg-[#531717] border border-[#F9CE65] shadow-lg transition-all duration-500 ease-in-out cursor-pointer
          ${hidden ? 'opacity-0 scale-90 -translate-x-4 pointer-events-none' : 'opacity-100 scale-100 translate-x-0 pointer-events-auto'}`}
      >
        <span className="relative mr-[10px] flex h-[11px] w-[11px]">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00B242] opacity-75"></span>
          <span className="relative inline-flex h-full w-full rounded-full bg-[#00B242]"></span>
        </span>
        <span className="font-poppins text-[14px] md:text-[16px] font-normal leading-[1.8em] text-[#DED8E1] whitespace-nowrap">
          Tanya Ambo RancakBot
        </span>
      </div>

      {/* 3D Mascot Container - mt-[23px] positions it vertically below the badge top edge perfectly as per Figma */}
      <div className="relative mt-[18px] md:mt-[23px] w-[80px] h-[106px] md:w-[104px] md:h-[138px] transition-transform duration-200 ease-out hover:scale-[1.05] active:scale-[0.95] cursor-pointer pointer-events-auto">
        <span className="sr-only">Buka RancakBot</span>
        <span ref={modelHostRef} className="relative block h-full w-full">
          <Mascot3D />
        </span>
      </div>
    </div>
  );
}
