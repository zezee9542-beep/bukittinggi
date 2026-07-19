import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';
import { MenuOverlay } from './MenuOverlay';
import { useMode } from '../context/ModeContext';
import { useTranslation } from '../hooks/useTranslation';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { musicPlaying, setMusicPlaying } = useMode();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isJelajahiOpen, setIsJelajahiOpen] = useState(false);

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
    const HIDE_THRESHOLD = 120;
    const HIDE_DELTA = 10;
    const SHOW_DELTA = 7;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
  
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        // Hysteresis prevents the header from repeatedly switching between
        // full-width and compact states around a single scroll position.
        setIsScrolled((wasScrolled) => {
          if (currentY > 32) return true;
          if (currentY < 12) return false;
          return wasScrolled;
        });

        if (currentY <= HIDE_THRESHOLD) {
          setNavVisible(true);
        } else if (delta > HIDE_DELTA) {
          setNavVisible(false);
          setIsJelajahiOpen(false); // Auto close dropdown on scroll
        } else if (delta < -SHOW_DELTA) {
          setNavVisible(true);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keep navigation available whenever the user opens an interactive menu or changes page.
  useEffect(() => {
    setNavVisible(true);
    lastScrollY.current = window.scrollY;
  }, [isMenuOpen, location.pathname]);

  const handleNavClick = (path: string, sectionId?: string) => {
    setIsJelajahiOpen(false);
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

  // "Jelajahi" submenus
  const jelajahiLinks = [
    { label: t('nav_history'), path: '/sejarah' },
    { label: t('nav_culture'), path: '/budaya' },
    { label: t('nav_culinary'), path: '/kuliner' },
    { label: t('nav_tourism'), path: '/', targetId: 'heritage-heading' },
  ];

  // Shared structural classes — background/color handled via inline style for smooth CSS transition
  const headerClass = isScrolled
    ? 'fixed z-50 inset-x-0 mx-auto backdrop-blur-md top-4 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] max-w-[1200px] h-[58px] rounded-full px-8 border'
    : 'fixed z-50 inset-x-0 mx-auto top-0 w-full h-[76px] px-6 md:px-12 border-b';

  const smoothTransition = [
    'background-color 0.65s cubic-bezier(0.4,0,0.2,1)',
    'border-color 0.65s cubic-bezier(0.4,0,0.2,1)',
    'box-shadow 0.65s cubic-bezier(0.4,0,0.2,1)',
    'color 0.65s cubic-bezier(0.4,0,0.2,1)',
    'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
    'opacity 0.25s ease',
    'top 0.3s ease',
    'width 0.3s ease',
    'height 0.3s ease',
    'border-radius 0.3s ease',
  ].join(', ');

  // Inline styles for smooth bg/color/border transitions
  const headerStyle: React.CSSProperties = {
    transition: navMounted ? smoothTransition : 'transform 0.55s cubic-bezier(0.16,1,0.3,1)',
    ...(isScrolled
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
            ? navMounted ? 'translate3d(0, 0, 0)' : 'translate3d(0, -100%, 0)'
            : 'translate3d(0, -150%, 0)',
          opacity: navVisible && navMounted ? 1 : 0,
          pointerEvents: navVisible ? 'auto' : 'none',
          willChange: 'transform, opacity',
        }}
      >
        {/* Left Side: Logo with hover spring */}
        <div className="flex items-center">
          <img
            src={logoSvg}
            alt="Bukittinggi Heritage"
            className={`w-auto object-contain cursor-pointer transition-all duration-500 hover-spring active:scale-95 ${
              isScrolled ? 'h-[40px] sm:h-[44px]' : 'h-[52px] sm:h-[60px]'
            }`}
            onClick={() => handleNavClick('/')}
            style={{
              display: 'block',
              filter: 'none',
              transition: 'filter 0.65s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        </div>

        {/* Center: Desktop Navigation Links (Remastered style matching screenshot) */}
        <nav className="hidden lg:flex items-center gap-8 relative" aria-label="Navigasi utama">
          {/* Beranda Link */}
          <button
            onClick={() => handleNavClick('/')}
            className={`relative font-poppins text-[15px] tracking-wide font-medium py-1.5 transition-all duration-300 cursor-pointer active:scale-95 ${
              location.pathname === '/' ? 'text-[#6E1F1F] font-bold' : 'text-[#6E1F1F]/70 hover:text-[#6E1F1F] hover:-translate-y-0.5'
            }`}
          >
            {t('nav_home')}
            {location.pathname === '/' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6E1F1F] rounded-full animate-line-grow" />
            )}
          </button>

          {/* Jelajahi Dropdown Trigger */}
          <div
            className="relative"
            onMouseEnter={() => setIsJelajahiOpen(true)}
            onMouseLeave={() => setIsJelajahiOpen(false)}
          >
            <button
              onClick={() => setIsJelajahiOpen(!isJelajahiOpen)}
              type="button"
              className={`flex items-center gap-1.5 font-poppins text-[15px] tracking-wide font-medium py-1.5 transition-all duration-300 cursor-pointer active:scale-95 ${
                isJelajahiOpen || location.pathname === '/sejarah' || location.pathname === '/budaya'
                  ? 'text-[#6E1F1F] font-bold'
                  : 'text-[#6E1F1F]/70 hover:text-[#6E1F1F] hover:-translate-y-0.5'
              }`}
              aria-expanded={isJelajahiOpen}
              aria-haspopup="true"
            >
              <span>Jelajahi</span>
              <svg
                className={`w-3 h-3 transition-transform duration-300 ${isJelajahiOpen ? 'rotate-180' : 'rotate-0'}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {/* Dropdown Card */}
            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-white border border-neutral-200/60 rounded-2xl shadow-xl py-2.5 flex flex-col transition-all duration-300 origin-top z-50 ${
                isJelajahiOpen
                  ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
              }`}
            >
              {jelajahiLinks.map((subLink) => {
                const isSubActive = location.pathname === subLink.path && !subLink.targetId;
                return (
                  <button
                    key={subLink.label}
                    onClick={() => handleNavClick(subLink.path, subLink.targetId)}
                    className={`px-5 py-2.5 text-left font-poppins text-[14px] font-medium transition-all duration-300 hover:bg-[#F7E0E0]/30 active:scale-95 cursor-pointer ${
                      isSubActive ? 'text-[#6E1F1F] bg-[#F7E0E0]/20 font-bold' : 'text-[#6E1F1F]/70 hover:text-[#6E1F1F]'
                    }`}
                  >
                    {subLink.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Travel Planner page link */}
          <button
            onClick={() => handleNavClick('/travel-planner')}
            className={`relative font-poppins text-[15px] tracking-wide font-medium py-1.5 transition-all duration-300 cursor-pointer active:scale-95 ${
              location.pathname === '/travel-planner' ? 'text-[#6E1F1F] font-bold' : 'text-[#6E1F1F]/70 hover:text-[#6E1F1F] hover:-translate-y-0.5'
            }`}
          >
            AI Travel Planner
            {location.pathname === '/travel-planner' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6E1F1F] rounded-full animate-line-grow" />
            )}
          </button>

          {/* Peta link to PetaPage */}
          <button
            onClick={() => {
              navigate('/peta');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            className="relative font-poppins text-[15px] tracking-wide font-medium py-1.5 transition-all duration-300 cursor-pointer active:scale-95 text-[#6E1F1F]/70 hover:text-[#6E1F1F] hover:-translate-y-0.5"
          >
            Peta
            {location.pathname === '/peta' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6E1F1F] rounded-full animate-line-grow" />
            )}
          </button>

          {/* [Refactor]: Game — memory-match culinary game / coming soon notification */}
          <button
            onClick={() => handleNavClick('/game')}
            className={`relative font-poppins text-[15px] tracking-wide font-medium py-1.5 transition-all duration-300 cursor-pointer active:scale-95 ${
              location.pathname === '/game' ? 'text-[#6E1F1F] font-bold' : 'text-[#6E1F1F]/70 hover:text-[#6E1F1F] hover:-translate-y-0.5'
            }`}
          >
            Game
            {location.pathname === '/game' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6E1F1F] rounded-full animate-line-grow" />
            )}
          </button>
        </nav>

        {/* Right Side: Toggle Switch + Mobile Menu Trigger */}
        <div className="flex items-center gap-6">
          {/* Simple Clean Toggle Switch — shown on all pages */}
          <div className="relative flex items-center">
            <button
              onClick={() => setMusicPlaying(!musicPlaying)}
              className="relative w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 focus:outline-none"
              style={{
                backgroundColor: musicPlaying ? '#5E1D1D' : '#D6B8B3',
              }}
              title={musicPlaying ? 'Turn Music & Explorer Off' : 'Turn Music & Explorer On'}
              aria-label="Toggle Mode & Music"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${
                  musicPlaying ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Mobile Hamburger menu trigger */}
          <button
            onClick={() => setIsMenuOpen(true)}
            type="button"
            className="lg:hidden flex items-center justify-center p-1.5 transition-transform active:scale-95 cursor-pointer hover:scale-110"
            aria-label="Buka menu"
            style={{
              transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              color: '#6E1F1F'
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
