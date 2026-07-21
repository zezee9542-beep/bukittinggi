import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

export function ScrollSection({
  children,
  className = '',
  delay = 0,
  threshold = 0.08,
}: ScrollSectionProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold });

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-10 scale-[0.98]'
      } ${className}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}

export default ScrollSection;
