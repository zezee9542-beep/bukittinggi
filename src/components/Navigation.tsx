import { useState, useEffect, useRef } from 'react';
import { siteContent } from '../data/stories';
import logoSvg from '../assets/logo.svg';
import { MenuOverlay } from './MenuOverlay';

type Page = 'home' | 'history' | 'budaya';

interface NavigationProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

export function Navigation({ currentPage, setCurrentPage }: NavigationProps) {
  const { nav } = siteContent;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // ── Scroll-aware navbar visibility ──────────────────────────────────────────
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const HIDE_THRESHOLD = 80;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

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

  const handleNavClick = (page: Page, sectionId?: string) => {
    setCurrentPage(page);
    if (sectionId) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Beranda', page: 'home' as Page },
    { label: 'Sejarah', page: 'history' as Page },
    { label: 'Budaya', page: 'budaya' as Page },
    { label: 'Kuliner', page: 'home' as Page, targetId: 'heritage-heading' },
    { label: 'Pariwisata', page: 'home' as Page, targetId: 'heritage-heading' },
    { label: 'Peta', page: 'home' as Page, targetId: 'heritage-heading' },
  ];

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100 flex items-center justify-between px-6 md:px-12 h-[76px] transition-transform duration-300"
        style={{
          transform: navVisible ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        {/* Left Side: Logo */}
        <div className="flex items-center">
          <img
            src={logoSvg}
            alt="Bukittinggi Heritage"
            className="h-[52px] sm:h-[60px] w-auto object-contain cursor-pointer"
            onClick={() => handleNavClick('home')}
          />
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Navigasi utama">
          {navLinks.map((link) => {
            const isPageActive = currentPage === link.page && !link.targetId;
            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.page, link.targetId)}
                className={`relative font-poppins text-[15px] tracking-wide font-medium py-1.5 transition-colors duration-300 cursor-pointer ${
                  isPageActive ? 'text-[#6E1F1F] font-semibold' : 'text-[#6E1F1F]/70 hover:text-[#6E1F1F]'
                }`}
              >
                {link.label}
                {isPageActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6E1F1F] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Side: Toggle Switch + Mobile Menu Trigger */}
        <div className="flex items-center gap-6">
          {/* Custom Pill Dark Mode Toggle Switch */}
          <button
            onClick={toggleDarkMode}
            type="button"
            className="relative w-12 h-[26px] rounded-full bg-[#6E1F1F] transition-colors duration-300 focus:outline-none cursor-pointer flex items-center p-0.5"
            aria-label="Toggle Dark Mode"
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ease-out transform ${
                darkMode ? 'translate-x-[22px]' : 'translate-x-0'
              }`}
            />
          </button>

          {/* Mobile Hamburger menu trigger */}
          <button
            onClick={() => setIsMenuOpen(true)}
            type="button"
            className="lg:hidden flex items-center justify-center p-1.5 text-[#6E1F1F] transition-transform active:scale-95 cursor-pointer"
            aria-label="Buka menu"
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
          currentPage={currentPage}
          onClose={() => setIsMenuOpen(false)}
          onNavigate={(page) => {
            setCurrentPage(page);
            setIsMenuOpen(false);
          }}
        />
      )}
    </>
  );
}

