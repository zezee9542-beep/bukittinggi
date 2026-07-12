import { useEffect } from 'react';
import logoSvg from '../assets/logo.svg';

type Page = 'home' | 'history' | 'budaya';

interface MenuOverlayProps {
  onClose: () => void;
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

export function MenuOverlay({ onClose, onNavigate, currentPage }: MenuOverlayProps) {
  // Prevent scrolling on body when overlay is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#FAF8F5]/98 backdrop-blur-xl animate-fade-in">
      {/* Header matching the Navigation bar position */}
      <div className="mx-auto flex h-[100px] w-full max-w-[924px] items-center justify-between px-4 mt-[21px]">
        <div className="flex items-center pl-6">
          <img
            src={logoSvg}
            alt="Bukittinggi Heritage"
            className="h-[76px] w-auto object-contain"
          />
        </div>
        <button
          onClick={onClose}
          type="button"
          className="mr-6 flex items-center gap-3 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] cursor-pointer"
          aria-label="Tutup menu"
        >
          <span className="font-cormorant text-[22px] font-bold tracking-wide text-[#6E1F1F]">
            TUTUP
          </span>
          <span className="flex h-[24px] w-[24px] items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:rotate-90">
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

      {/* Menu items container */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <nav className="flex flex-col gap-8 md:gap-11" aria-label="Menu navigasi overlay">
          {/* Link 1: Beranda */}
          <button
            onClick={() => onNavigate('home')}
            className="group flex flex-col items-center focus:outline-none cursor-pointer"
          >
            <span className={`font-cormorant text-[36px] md:text-[52px] font-bold tracking-[0.2em] transition-all duration-500 group-hover:scale-105 ${
              currentPage === 'home' ? 'text-[#6E1F1F]' : 'text-[#6E1F1F]/60'
            }`}>
              BERANDA
            </span>
            <span className="font-poppins mt-2 text-[12px] md:text-[14px] font-normal tracking-wider text-neutral-500 uppercase transition-all duration-500 group-hover:text-[#6E1F1F]/80">
              Kembali ke Halaman Utama
            </span>
            <span className={`mt-3 h-[2px] bg-[#6E1F1F] transition-all duration-500 ${
              currentPage === 'home' ? 'w-12' : 'w-0 group-hover:w-8'
            }`} />
          </button>

          {/* Link 2: Sejarah */}
          <button
            onClick={() => onNavigate('history')}
            className="group flex flex-col items-center focus:outline-none cursor-pointer"
          >
            <span className={`font-cormorant text-[36px] md:text-[52px] font-bold tracking-[0.2em] transition-all duration-500 group-hover:scale-105 ${
              currentPage === 'history' ? 'text-[#6E1F1F]' : 'text-[#6E1F1F]/60'
            }`}>
              SEJARAH
            </span>
            <span className="font-poppins mt-2 text-[12px] md:text-[14px] font-normal tracking-wider text-neutral-500 uppercase transition-all duration-500 group-hover:text-[#6E1F1F]/80">
              Menelusuri Linimasa Sejarah
            </span>
            <span className={`mt-3 h-[2px] bg-[#6E1F1F] transition-all duration-500 ${
              currentPage === 'history' ? 'w-12' : 'w-0 group-hover:w-8'
            }`} />
          </button>

          {/* Link 3: Budaya */}
          <button
            onClick={() => onNavigate('budaya')}
            className="group flex flex-col items-center focus:outline-none cursor-pointer"
          >
            <span className={`font-cormorant text-[36px] md:text-[52px] font-bold tracking-[0.2em] transition-all duration-500 group-hover:scale-105 ${
              currentPage === 'budaya' ? 'text-[#6E1F1F]' : 'text-[#6E1F1F]/60'
            }`}>
              BUDAYA
            </span>
            <span className="font-poppins mt-2 text-[12px] md:text-[14px] font-normal tracking-wider text-neutral-500 uppercase transition-all duration-500 group-hover:text-[#6E1F1F]/80">
              Warisan Budaya Minangkabau
            </span>
            <span className={`mt-3 h-[2px] bg-[#6E1F1F] transition-all duration-500 ${
              currentPage === 'budaya' ? 'w-12' : 'w-0 group-hover:w-8'
            }`} />
          </button>
        </nav>
      </div>

      {/* Decorative footer */}
      <div className="pb-12 text-center text-[11px] font-poppins tracking-[0.15em] text-neutral-400 uppercase">
        Bukittinggi Heritage &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
