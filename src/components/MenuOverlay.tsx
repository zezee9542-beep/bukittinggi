import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';

interface MenuOverlayProps {
  onClose: () => void;
}

export function MenuOverlay({ onClose }: MenuOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Prevent scrolling on body when overlay is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => setMounted(true), 30);
    return () => {
      document.body.style.overflow = '';
      clearTimeout(t);
    };
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 420);
  };

  const handleNavigate = (path: string) => {
    setClosing(true);
    setTimeout(() => {
      navigate(path);
      onClose();
    }, 380);
  };

  const navItems = [
    { path: '/', label: 'BERANDA', sub: 'Kembali ke Halaman Utama' },
    { path: '/sejarah', label: 'SEJARAH', sub: 'Menelusuri Linimasa Sejarah' },
    { path: '/budaya', label: 'BUDAYA', sub: 'Warisan Budaya Minangkabau' },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      style={{
        background: '#FAF8F5',
        opacity: mounted && !closing ? 1 : 0,
        transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Animated background geometric decoration */}
      <div
        className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(110,31,31,0.06) 0%, transparent 70%)',
          transform: mounted && !closing ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-45deg)',
          transition: 'transform 0.8s cubic-bezier(0.34,1.56,0.64,1)',
          transitionDelay: '100ms',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -left-20 w-[320px] h-[320px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(212,168,83,0.07) 0%, transparent 70%)',
          transform: mounted && !closing ? 'scale(1)' : 'scale(0)',
          transition: 'transform 0.8s cubic-bezier(0.34,1.56,0.64,1)',
          transitionDelay: '200ms',
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <div
        className="mx-auto flex h-[100px] w-full max-w-[924px] items-center justify-between px-4 mt-[21px]"
        style={{
          opacity: mounted && !closing ? 1 : 0,
          transform: mounted && !closing ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)',
          transitionDelay: '80ms',
        }}
      >
        <div className="flex items-center pl-6">
          <img
            src={logoSvg}
            alt="Bukittinggi Heritage"
            className="h-[76px] w-auto object-contain"
          />
        </div>
        <button
          onClick={handleClose}
          type="button"
          className="mr-6 flex items-center gap-3 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] cursor-pointer hover:scale-105"
          aria-label="Tutup menu"
        >
          <span className="font-cormorant text-[22px] font-bold tracking-wide text-[#6E1F1F]">
            TUTUP
          </span>
          <span
            className="flex h-[24px] w-[24px] items-center justify-center hover:rotate-90"
            style={{ transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6E1F1F"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </span>
        </button>
      </div>

      {/* Animated horizontal rule */}
      <div
        className="mx-auto w-full max-w-[924px] px-10"
        style={{
          opacity: mounted && !closing ? 1 : 0,
          transition: 'opacity 0.4s ease',
          transitionDelay: '150ms',
        }}
        aria-hidden="true"
      >
        <div
          className="h-[1px] shimmer-line"
          style={{
            transform: mounted && !closing ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left center',
            transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)',
            transitionDelay: '150ms',
          }}
        />
      </div>

      {/* Menu items container */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <nav className="flex flex-col gap-8 md:gap-11" aria-label="Menu navigasi overlay">
          {navItems.map(({ path, label, sub }, idx) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => handleNavigate(path)}
                className="group flex flex-col items-center focus:outline-none cursor-pointer"
                style={{
                  opacity: mounted && !closing ? 1 : 0,
                  transform:
                    mounted && !closing
                      ? 'translateX(0)'
                      : `translateX(${idx % 2 === 0 ? '-' : ''}40px)`,
                  transition:
                    'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                  transitionDelay: `${200 + idx * 100}ms`,
                }}
              >
                <span
                  className={`font-cormorant text-[36px] md:text-[52px] font-bold tracking-[0.2em] transition-all duration-500 group-hover:scale-105 group-hover:tracking-[0.28em] ${
                    isActive ? 'text-[#6E1F1F]' : 'text-[#6E1F1F]/60'
                  }`}
                >
                  {label}
                </span>
                <span className="font-poppins mt-2 text-[12px] md:text-[14px] font-normal tracking-wider text-neutral-500 uppercase transition-all duration-500 group-hover:text-[#6E1F1F]/80 group-hover:tracking-[0.22em]">
                  {sub}
                </span>
                <span
                  className={`mt-3 h-[2px] bg-[#6E1F1F] transition-all duration-500 ${
                    isActive ? 'w-12' : 'w-0 group-hover:w-8'
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Decorative footer */}
      <div
        className="pb-12 text-center text-[11px] font-poppins tracking-[0.15em] text-neutral-400 uppercase"
        style={{
          opacity: mounted && !closing ? 1 : 0,
          transform: mounted && !closing ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          transitionDelay: '500ms',
        }}
      >
        Bukittinggi Heritage &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}

