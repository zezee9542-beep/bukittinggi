import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';
import { useMode } from '../context/ModeContext';
import { useTranslation } from '../hooks/useTranslation';

interface MenuOverlayProps {
  onClose: () => void;
}

export function MenuOverlay({ onClose }: MenuOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const { mode } = useMode();

  const location = useLocation();
  const navigate = useNavigate();

  const isExplorer = mode === 'explorer';
  const { t } = useTranslation();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const id = setTimeout(() => setMounted(true), 30);
    return () => {
      document.body.style.overflow = '';
      clearTimeout(id);
    };
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 420);
  };

  const handleNavigate = (path: string, sectionId?: string) => {
    setClosing(true);
    setTimeout(() => {
      navigate(path);
      onClose();
      if (sectionId) {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 350);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 380);
  };

  const navItems: {
    path: string;
    label: string;
    sub: string;
    sectionId?: string;
  }[] = [
    { path: '/', label: t('nav_home'), sub: t('nav_back_home') },
    { path: '/sejarah', label: t('nav_history'), sub: t('nav_history_sub') },
    { path: '/budaya', label: t('nav_culture'), sub: t('nav_culture_sub') },
    { path: '/kuliner', label: t('nav_culinary'), sub: 'Jelajahi Kuliner Khas' },
    { path: '/travel-planner', label: 'AI Planner', sub: 'Rencanakan Perjalananmu' },
    { path: '/', label: 'Peta', sub: 'Peta Warisan Budaya', sectionId: 'heritage-heading' },
    { path: '/game', label: 'Game', sub: 'Mainkan Sekarang' },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      style={{
        background: isExplorer ? '#1E0505' : '#FAF8F5',
        opacity: mounted && !closing ? 1 : 0,
        transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), background-color 0.4s ease',
      }}
    >
      {/* Animated background geometric decorations */}
      <div
        className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: isExplorer
            ? 'radial-gradient(circle, rgba(249,206,101,0.06) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(110,31,31,0.06) 0%, transparent 70%)',
          transform: mounted && !closing ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-45deg)',
          transition: 'transform 0.8s cubic-bezier(0.34,1.56,0.64,1)',
          transitionDelay: '100ms',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -left-20 w-[320px] h-[320px] rounded-full pointer-events-none"
        style={{
          background: isExplorer
            ? 'radial-gradient(circle, rgba(249,206,101,0.07) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(212,168,83,0.07) 0%, transparent 70%)',
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
            style={{ filter: isExplorer ? 'brightness(0) invert(1)' : 'none' }}
          />
        </div>
        <button
          onClick={handleClose}
          type="button"
          className="mr-6 flex items-center gap-3 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] cursor-pointer hover:scale-105"
          aria-label="Tutup menu"
        >
          <span
            className="font-cormorant text-[22px] font-bold tracking-wide transition-colors duration-300"
            style={{ color: isExplorer ? '#F9CE65' : '#6E1F1F' }}
          >
            {t('nav_close')}
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
              stroke={isExplorer ? '#F9CE65' : '#6E1F1F'}
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
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
            background: isExplorer
              ? 'linear-gradient(to right, rgba(249,206,101,0) 0%, rgba(249,206,101,0.4) 50%, rgba(249,206,101,0) 100%)'
              : 'linear-gradient(to right, rgba(110,31,31,0) 0%, rgba(110,31,31,0.4) 50%, rgba(110,31,31,0) 100%)',
          }}
        />
      </div>

      {/* Menu items */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <nav className="flex flex-col gap-4 md:gap-7" aria-label="Menu navigasi overlay">
          {navItems.map(({ path, label, sub, sectionId }, idx) => {
            const isActive = location.pathname === path && !sectionId;
            const activeColor = isExplorer ? 'text-[#F9CE65]' : 'text-[#6E1F1F]';
            const inactiveColor = isExplorer
              ? 'text-[#FFEAA7]/65 hover:text-[#F9CE65]'
              : 'text-[#6E1F1F]/60 hover:text-[#6E1F1F]';
            const subtitleColor = isExplorer
              ? 'text-[#FFEAA7]/40 group-hover:text-[#FFEAA7]/70'
              : 'text-neutral-500 group-hover:text-[#6E1F1F]/80';
            const underlineColor = isExplorer ? 'bg-[#F9CE65]' : 'bg-[#6E1F1F]';

            const handleClick = () => handleNavigate(path, sectionId);

            return (
              <button
                key={`${String(path)}-${label}`}
                onClick={handleClick}
                className="group flex flex-col items-center focus:outline-none cursor-pointer"
                style={{
                  opacity: mounted && !closing ? 1 : 0,
                  transform:
                    mounted && !closing
                      ? 'translateX(0)'
                      : `translateX(${idx % 2 === 0 ? '-' : ''}40px)`,
                  transition:
                    'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                  transitionDelay: `${200 + idx * 75}ms`,
                }}
              >
                <span
                  className={`font-cormorant text-[28px] md:text-[44px] font-bold tracking-[0.2em] transition-all duration-500 group-hover:scale-105 group-hover:tracking-[0.28em] ${
                    isActive ? activeColor : inactiveColor
                  }`}
                >
                  {label}
                </span>
                <span
                  className={`font-poppins mt-1 text-[10px] md:text-[12px] font-normal tracking-wider uppercase transition-all duration-500 ${subtitleColor}`}
                >
                  {sub}
                </span>
                <span
                  className={`mt-2 h-[2px] transition-all duration-500 ${underlineColor} ${
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
        className="pb-10 text-center text-[11px] font-poppins tracking-[0.15em] uppercase"
        style={{
          opacity: mounted && !closing ? 1 : 0,
          transform: mounted && !closing ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          transitionDelay: '680ms',
          color: isExplorer ? 'rgba(255,234,167,0.4)' : '#A3A3A3',
        }}
      >
        Bukittinggi Heritage &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
