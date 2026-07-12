import { useEffect, useRef, useState } from 'react';

/**
 * Tracks scroll progress (0–1) through a referenced container.
 * - 0  = container bottom just entered the viewport from below
 * - 1  = container top has scrolled fully past the viewport top
 *
 * Using (rect.height + vh) as the total range gives a natural pace:
 * progress fills as the user scrolls through the visible portion of the timeline.
 */
export function useTimelineProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // scrolled = 0 when top of container is at bottom of viewport
      // scrolled = rect.height + vh when container has fully exited viewport top
      const scrolled = vh - rect.top;
      const total = rect.height + vh;

      const raw = scrolled / total;
      setProgress(Math.min(1, Math.max(0, raw)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { ref, progress };
}
