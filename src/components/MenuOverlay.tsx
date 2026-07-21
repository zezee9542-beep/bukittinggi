import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';
import { useTranslation } from '../hooks/useTranslation';

interface MenuOverlayProps {
  onClose: () => void;
}

export function MenuOverlay({ onClose }: MenuOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
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
    setTimeout(() => onClose(), 300);
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
    }, 280);
  };

  const navItems = [
    { path: '/', label: t('nav_home'), sub: t('nav_back_home') },
    { path: '/sejarah', label: t('nav_history'), sub: t('nav_history_sub') },
    { path: '/budaya', label: t('nav_culture'), sub: t('nav_culture_sub') },
    { path: '/kuliner', label: t('nav_culinary'), sub: 'Jelajahi Kuliner Khas' },
    { path: '/travel-planner', label: 'AI Planner', sub: 'Rencanakan Perjalananmu' },
    { path: '/peta', label: 'Peta', sub: 'Peta Warisan Budaya' },
    { path: '/game', label: 'Game', sub: 'Mainkan Sekarang' },
  ];

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${
        mounted && !closing ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      {/* ── Popup Modal Card Container ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-[420px] max-h-[85vh] overflow-y-auto bg-white rounded-[28px] sm:rounded-[36px] shadow-[0_25px_70px_rgba(0,0,0,0.38)] border border-neutral-100 p-5 sm:p-7 flex flex-col items-center justify-between transition-all duration-300 transform select-none custom-peta-scrollbar ${
          mounted && !closing ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Header inside Popup */}
        <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('/')}>
            <img
              src={logoSvg}
              alt="Bukittinggi Heritage"
              className="h-[46px] sm:h-[54px] w-auto object-contain"
            />
          </div>

          <button
            onClick={handleClose}
            type="button"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-100 hover:bg-[#6E1F1F] text-neutral-600 hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 shadow-sm"
            aria-label="Tutup menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Navigation Items List inside Popup */}
        <nav className="w-full flex flex-col gap-2 my-2" aria-label="Menu navigasi popup">
          {navItems.map(({ path, label, sub, sectionId }) => {
            const isActive = location.pathname === path && !sectionId;

            return (
              <button
                key={`${path}-${label}`}
                onClick={() => handleNavigate(path, sectionId)}
                className={`w-full flex items-center justify-between px-4 py-3 sm:py-3.5 rounded-[18px] transition-all duration-300 cursor-pointer group text-left ${
                  isActive
                    ? 'bg-[#6E1F1F] text-white shadow-md'
                    : 'hover:bg-[#F7E0E0]/40 text-[#6E1F1F]'
                }`}
              >
                <div className="flex flex-col">
                  <span className={`font-poppins font-semibold text-[15px] sm:text-[17px] leading-snug ${isActive ? 'text-white' : 'text-[#6E1F1F]'}`}>
                    {label}
                  </span>
                  <span className={`font-poppins text-[11px] sm:text-[12px] ${isActive ? 'text-white/70' : 'text-neutral-500'}`}>
                    {sub}
                  </span>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-[#6E1F1F]'
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Popup Footer */}
        <div className="w-full mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-poppins text-neutral-400">
          <span>Bukittinggi Heritage &copy; {new Date().getFullYear()}</span>
          <span className="font-medium text-[#6E1F1F]/70">Pilih Menu</span>
        </div>
      </div>
    </div>
  );
}
