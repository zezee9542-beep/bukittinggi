import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollReveal<T extends HTMLElement>(
  options: UseScrollRevealOptions = {},
) {
  const { threshold = 0.05, rootMargin = '0px 0px 50px 0px' } = options;
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (isVisible) return;
    const node = ref.current;
    if (!node) {
      // Fallback if ref not mounted yet
      setIsVisible(true);
      return;
    }

    // Fallback timer: ensure content reveals within 400ms even if IntersectionObserver delays
    const fallbackTimer = setTimeout(() => {
      setIsVisible(true);
    }, 400);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
          clearTimeout(fallbackTimer);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [isVisible, rootMargin, threshold]);

  return { ref, isVisible };
}
