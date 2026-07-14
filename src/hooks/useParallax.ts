import { useEffect, useRef, useState } from 'react';

/**
 * Returns a parallax Y offset (px) that moves at the given speed factor
 * as the user scrolls. speed=0.5 means element moves at half scroll speed.
 * Works well cross-browser including iOS Safari.
 */
export function useParallax(speed = 0.3) {
  const [offsetY, setOffsetY] = useState(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    const handleScroll = () => {
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        setOffsetY(window.scrollY * speed);
        rafId.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [speed]);

  return offsetY;
}
