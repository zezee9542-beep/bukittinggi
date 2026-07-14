import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  opacitySpeed: number;
  color: string;
  life: number;
  maxLife: number;
}

interface FloatingParticlesProps {
  count?: number;
  colors?: string[];
  className?: string;
}

/**
 * Canvas-based floating particle system — lightweight & cross-browser.
 * Uses requestAnimationFrame for smooth 60fps rendering on all devices.
 */
export function FloatingParticles({
  count = 28,
  colors = ['#6E1F1F', '#D4A853', '#F9CE65', '#8C1D24'],
  className = '',
}: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const activeRef = useRef(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createParticle = (): Particle => {
      const canvas = canvasRef.current!;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.6 + 0.2),
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        opacitySpeed: (Math.random() * 0.005 + 0.002),
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.random() * 300 + 200,
      };
    };

    resize();
    particlesRef.current = Array.from({ length: count }, createParticle);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      if (!activeRef.current) return;
      const c = canvasRef.current;
      if (!c) return;
      const ctx2 = c.getContext('2d');
      if (!ctx2) return;

      ctx2.clearRect(0, 0, c.width, c.height);

      particlesRef.current = particlesRef.current.map((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        // Fade in / fade out
        const halfLife = p.maxLife / 2;
        if (p.life < halfLife) {
          p.opacity = Math.min(0.55, p.opacity + p.opacitySpeed);
        } else {
          p.opacity = Math.max(0, p.opacity - p.opacitySpeed);
        }

        // Draw
        ctx2.save();
        ctx2.globalAlpha = p.opacity;
        ctx2.fillStyle = p.color;
        ctx2.beginPath();
        ctx2.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx2.fill();
        ctx2.restore();

        // Respawn dead or out-of-bound particles
        if (
          p.life >= p.maxLife ||
          p.y < -10 ||
          p.x < -10 ||
          p.x > c.width + 10
        ) {
          return createParticle();
        }

        return p;
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      activeRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [count, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
