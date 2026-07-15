import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';
import { MenuOverlay } from './MenuOverlay';
import { useMode } from '../context/ModeContext';
import { useTranslation } from '../hooks/useTranslation';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { mode, musicPlaying, setMusicPlaying } = useMode();
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // ── Scroll-aware navbar visibility ──────────────────────────────────────────
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const [navMounted, setNavMounted] = useState(false);

  // Mount animation
  useEffect(() => {
    const t = setTimeout(() => setNavMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const HIDE_THRESHOLD = 80;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
  
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        setIsScrolled(currentY > 20);

        if (currentY <= HIDE_THRESHOLD) {
          setNavVisible(true);
        } else if (delta > 4) {
          setNavVisible(false);
        } else if (delta < -4) {
          setNavVisible(true);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (path: string, sectionId?: string) => {
    if (location.pathname === path) {
      if (sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate(path);
      if (sectionId) {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 350);
      } else {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 320);
      }
    }
  };

  const { t } = useTranslation();

  const navLinks = [
    { label: t('nav_home'), path: '/' },
    { label: t('nav_history'), path: '/sejarah' },
    { label: t('nav_culture'), path: '/budaya' },
    { label: t('nav_culinary'), path: '/', targetId: 'heritage-heading' },
    { label: t('nav_tourism'), path: '/', targetId: 'heritage-heading' },
    { label: t('nav_map'), path: '/', targetId: 'heritage-heading' },
  ];

  const isExplorer = mode === 'explorer';

  // Shared structural classes — background/color handled via inline style for smooth CSS transition
  const headerClass = isScrolled
    ? 'fixed z-50 inset-x-0 mx-auto backdrop-blur-md top-4 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] max-w-[1200px] h-[58px] rounded-full px-8 border'
    : 'fixed z-50 inset-x-0 mx-auto top-0 w-full h-[76px] px-6 md:px-12 border-b';

  const smoothTransition = [
    'background-color 0.65s cubic-bezier(0.4,0,0.2,1)',
    'border-color 0.65s cubic-bezier(0.4,0,0.2,1)',
    'box-shadow 0.65s cubic-bezier(0.4,0,0.2,1)',
    'color 0.65s cubic-bezier(0.4,0,0.2,1)',
    'transform 0.4s cubic-bezier(0.2,0.8,0.2,1)',
    'top 0.3s ease',
    'width 0.3s ease',
    'height 0.3s ease',
    'border-radius 0.3s ease',
  ].join(', ');

  // Inline styles for smooth bg/color/border transitions
  const headerStyle: React.CSSProperties = {
    transition: navMounted ? smoothTransition : 'transform 0.55s cubic-bezier(0.16,1,0.3,1)',
    ...(isExplorer
      ? isScrolled
        ? { backgroundColor: 'rgba(30,5,5,0.78)', borderColor: 'rgba(249,206,101,0.2)', color: '#FFEAA7', boxShadow: '0 4px 32px rgba(0,0,0,0.45)' }
        : { backgroundColor: 'transparent', borderColor: 'transparent', color: '#FFEAA7' }
      : isScrolled
        ? { backgroundColor: 'rgba(255,255,255,0.95)', borderColor: 'rgba(229,229,229,0.8)', color: '#6E1F1F', boxShadow: '0 4px 32px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)' }
        : { backgroundColor: '#ffffff', borderColor: '#f5f5f5', color: '#6E1F1F' }
    ),
  };

  return (
    <>
      <header
        className={`flex items-center justify-between ${headerClass}`}
        style={{
          ...headerStyle,
          transform: navVisible
            ? navMounted ? 'translateY(0)' : 'translateY(-100%)'
            : 'translateY(-150%)',
        }}
      >
        {/* Left Side: Logo with hover spring */}
        <div className="flex items-center">
          <img
            src={logoSvg}
            alt="Bukittinggi Heritage"
            className={`w-auto object-contain cursor-pointer transition-all duration-500 hover-spring ${
              isScrolled ? 'h-[40px] sm:h-[44px]' : 'h-[52px] sm:h-[60px]'
            }`}
            onClick={() => handleNavClick('/')}
            style={{
              display: 'block',
              filter: isExplorer ? 'brightness(0) invert(1)' : 'none',
              transition: 'filter 0.65s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Navigasi utama">
          {navLinks.map((link, idx) => {
            const isPageActive = location.pathname === link.path && !link.targetId;
            const activeColor = isExplorer ? 'text-[#F9CE65]' : 'text-[#6E1F1F]';
            const inactiveColor = isExplorer ? 'text-[#FFEAA7]/75 hover:text-[#F9CE65]' : 'text-[#6E1F1F]/70 hover:text-[#6E1F1F]';
            const lineColor = isExplorer ? 'bg-[#F9CE65]' : 'bg-[#6E1F1F]';

            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.path, link.targetId)}
                className={`relative font-poppins text-[15px] tracking-wide font-medium py-1.5 transition-colors duration-300 cursor-pointer magnetic-link ripple-btn ${
                  isPageActive ? `${activeColor} font-semibold` : inactiveColor
                }`}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {link.label}
                {isPageActive && (
                  <span className={`absolute bottom-0 left-0 w-full h-[2px] ${lineColor} rounded-full animate-line-grow`} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Side: Toggle Switch + Mobile Menu Trigger */}
        <div className="flex items-center gap-6">
          {/* Custom Mode Toggle Pill (ON / OFF) — shown on all pages */}
          <div className="relative flex items-center">
            <button
              onClick={() => setMusicPlaying(!musicPlaying)}
              type="button"
              className={`relative flex items-center bg-[#1E0505]/80 border border-[#F9CE65]/35 rounded-full p-[3px] h-[34px] sm:h-[38px] w-[54px] sm:w-[94px] cursor-pointer focus:outline-none transition-all duration-300 shadow-lg ${
                musicPlaying ? 'justify-end' : 'justify-start'
              }`}
              title={musicPlaying ? 'Turn Music & Explorer Off' : 'Turn Music & Explorer On'}
              aria-label="Toggle Mode & Music"
            >
              <div
                className={`h-full aspect-square rounded-full transition-all duration-300 flex items-center justify-center ${
                  musicPlaying
                    ? 'bg-gradient-to-r from-[#F9CE65] to-[#D4A853] text-[#1E0505] shadow-[0_2px_8px_rgba(249,206,101,0.45)]'
                    : 'bg-[#6E1F1F] text-white shadow-[0_2px_8px_rgba(110,31,31,0.45)]'
                }`}
              >
                {musicPlaying ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-6z"/>
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73l6 6L21 20l-9-9-7.73-8.01L4.27 3zM14 7h6V3h-6v4z"/>
                  </svg>
                )}
              </div>

              {/* Label Text - Hidden on mobile */}
              <span
                className={`absolute text-[11px] font-bold font-poppins tracking-wider select-none uppercase pointer-events-none transition-all duration-300 hidden sm:inline ${
                  musicPlaying
                    ? 'left-[14px] text-[#F9CE65]'
                    : 'right-[14px] text-white/50'
                }`}
              >
                {musicPlaying ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>

          {/* Mobile Hamburger menu trigger */}
          <button
            onClick={() => setIsMenuOpen(true)}
            type="button"
            className={`lg:hidden flex items-center justify-center p-1.5 transition-transform active:scale-95 cursor-pointer hover:scale-110`}
            aria-label="Buka menu"
            style={{
              transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              color: isExplorer ? '#FFEAA7' : '#6E1F1F'
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <MenuOverlay
          onClose={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}

