import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';
import { MenuOverlay } from './MenuOverlay';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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

  const navLinks = [
    { label: 'Beranda', path: '/' },
    { label: 'Sejarah', path: '/sejarah' },
    { label: 'Budaya', path: '/budaya' },
    { label: 'Kuliner', path: '/', targetId: 'heritage-heading' },
    { label: 'Pariwisata', path: '/', targetId: 'heritage-heading' },
    { label: 'Peta', path: '/', targetId: 'heritage-heading' },
  ];

  return (
    <>
      <header
        className={`fixed z-50 inset-x-0 mx-auto bg-white/95 backdrop-blur-md flex items-center justify-between transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          isScrolled
            ? 'top-4 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] max-w-[1200px] h-[58px] rounded-full px-8 border border-neutral-200/80'
            : 'top-0 w-full h-[76px] px-6 md:px-12 border-b border-neutral-100'
        }`}
        style={{
          transform: navVisible
            ? navMounted ? 'translateY(0)' : 'translateY(-100%)'
            : 'translateY(-150%)',
          transition: navMounted
            ? 'transform 0.4s cubic-bezier(0.2,0.8,0.2,1), width 0.3s ease, top 0.3s ease, height 0.3s ease, border-radius 0.3s ease'
            : 'transform 0.55s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: isScrolled ? '0 4px 32px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)' : 'none',
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
            style={{ display: 'block' }}
          />
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Navigasi utama">
          {navLinks.map((link, idx) => {
            const isPageActive = location.pathname === link.path && !link.targetId;
            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.path, link.targetId)}
                className={`relative font-poppins text-[15px] tracking-wide font-medium py-1.5 transition-colors duration-300 cursor-pointer magnetic-link ripple-btn ${
                  isPageActive ? 'text-[#6E1F1F] font-semibold' : 'text-[#6E1F1F]/70 hover:text-[#6E1F1F]'
                }`}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {link.label}
                {isPageActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6E1F1F] rounded-full animate-line-grow" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Side: Toggle Switch + Mobile Menu Trigger */}
        <div className="flex items-center gap-6">
          {/* Custom Theme Toggle Switch (Light/Dark Indicator) */}
          <div className="relative flex items-center gap-2">
            <span className="hidden sm:inline font-poppins text-[11px] uppercase tracking-wider font-semibold text-[#6E1F1F]/60 select-none">
              {darkMode ? 'Gelap' : 'Terang'}
            </span>
            <button
              onClick={toggleDarkMode}
              type="button"
              className={`relative w-14 h-[28px] rounded-full transition-all duration-300 focus:outline-none cursor-pointer flex items-center p-1 shadow-inner border ${
                darkMode 
                  ? 'bg-[#1e0505] border-[#F9CE65]/40' 
                  : 'bg-neutral-200 border-neutral-300'
              }`}
              title="Ganti Tema (Terang/Gelap)"
              aria-label="Ganti Tema (Terang/Gelap)"
            >
              {/* Sun icon */}
              <span 
                className={`absolute left-2 text-[10px] transition-opacity duration-300 pointer-events-none select-none ${
                  darkMode ? 'opacity-0' : 'opacity-100'
                }`}
              >
                ☀️
              </span>
              {/* Moon icon */}
              <span 
                className={`absolute right-2 text-[10px] transition-opacity duration-300 pointer-events-none select-none ${
                  darkMode ? 'opacity-100' : 'opacity-0'
                }`}
              >
                🌙
              </span>
              {/* Slider Knob */}
              <div
                className={`w-5 h-5 rounded-full shadow-md transition-all duration-300 ease-out transform ${
                  darkMode 
                    ? 'translate-x-[26px] bg-[#F9CE65]' 
                    : 'translate-x-0 bg-white'
                }`}
              />
            </button>
          </div>

          {/* Mobile Hamburger menu trigger */}
          <button
            onClick={() => setIsMenuOpen(true)}
            type="button"
            className="lg:hidden flex items-center justify-center p-1.5 text-[#6E1F1F] transition-transform active:scale-95 cursor-pointer hover:scale-110"
            aria-label="Buka menu"
            style={{ transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
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

