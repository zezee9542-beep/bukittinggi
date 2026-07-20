import React from 'react';
import { useNavigate } from 'react-router-dom';
import hamaSvg from '../assets/hama.svg';
import fotJpeg from '../assets/fot.jpeg';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleOpenBot = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new Event('open-rancak-bot'));
  };

  return (
    <footer
      className="w-full relative z-30 pt-16 pb-10 px-6 sm:px-10 md:px-14 lg:px-20 text-white overflow-hidden border-none outline-none"
      style={{ backgroundColor: '#5F1712' }}
    >
      <div className="relative z-20 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16">
        
        {/* ── Left Column: Logo (hama.svg), Tagline, Socials, Copyright ── */}
        <div className="flex-1 flex flex-col items-start max-w-[360px]">
          {/* Logo Brand using hama.svg */}
          <div
            onClick={() => navigate('/')}
            className="cursor-pointer select-none mb-4 group"
          >
            <img
              src={hamaSvg}
              alt="Bukittinggi Heritage Logo"
              className="h-[65px] sm:h-[78px] w-auto object-contain transition-transform group-hover:scale-105 duration-300"
            />
          </div>

          {/* Tagline */}
          <p className="font-poppins font-normal text-white/85 text-[13.5px] sm:text-[14px] leading-[1.65] mb-6">
            Menelusuri jejak sejarah, budaya, dan pesona Bukittinggi dalam satu pengalaman digital.
          </p>

          {/* Social Media Buttons */}
          <div className="flex items-center gap-3 mb-8">
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#F9CE65] hover:bg-[#ffe39c] text-[#5F1712] flex items-center justify-center transition-transform hover:scale-110 duration-200 shadow-md"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* Email */}
            <a
              href="mailto:info@bukittinggiheritage.id"
              className="w-9 h-9 rounded-full bg-[#F9CE65] hover:bg-[#ffe39c] text-[#5F1712] flex items-center justify-center transition-transform hover:scale-110 duration-200 shadow-md"
              aria-label="Email"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>

            {/* Youtube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#F9CE65] hover:bg-[#ffe39c] text-[#5F1712] flex items-center justify-center transition-transform hover:scale-110 duration-200 shadow-md"
              aria-label="Youtube"
            >
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <span className="font-poppins text-[12.5px] text-white/50">
            © 2024 Bukittinggi Heritage
          </span>
        </div>

        {/* ── Center Column: Navigasi Links (2 Columns) ── */}
        <div className="flex-1 max-w-[420px] w-full">
          <h3 className="font-poppins font-semibold text-white text-[18px] sm:text-[19px] mb-5 tracking-tight">
            Navigasi
          </h3>
          <div className="grid grid-cols-2 gap-y-3.5 gap-x-8 text-[14px] sm:text-[15px] font-poppins text-white/80">
            {/* Column 1 */}
            <div className="flex flex-col gap-3.5">
              <span onClick={() => navigate('/')} className="hover:text-[#F9CE65] transition-colors cursor-pointer select-none">
                Beranda
              </span>
              <span onClick={handleOpenBot} className="hover:text-[#F9CE65] transition-colors cursor-pointer select-none">
                Ambo Rancakbot
              </span>
              <span onClick={() => navigate('/travel-planner')} className="hover:text-[#F9CE65] transition-colors cursor-pointer select-none">
                AI Travel Planner
              </span>
              <span onClick={() => navigate('/game')} className="hover:text-[#F9CE65] transition-colors cursor-pointer select-none">
                Game
              </span>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-3.5">
              <span onClick={() => navigate('/sejarah')} className="hover:text-[#F9CE65] transition-colors cursor-pointer select-none">
                Sejarah
              </span>
              <span onClick={() => navigate('/budaya')} className="hover:text-[#F9CE65] transition-colors cursor-pointer select-none">
                Budaya
              </span>
              <span onClick={() => navigate('/kuliner')} className="hover:text-[#F9CE65] transition-colors cursor-pointer select-none">
                Kuliner
              </span>
              <span onClick={() => navigate('/peta')} className="hover:text-[#F9CE65] transition-colors cursor-pointer select-none">
                Peta & Wisata
              </span>
            </div>
          </div>
        </div>

        {/* ── Right Column: Card Image hai.png with Inner Shadow & Legal Links ── */}
        <div className="flex-1 flex flex-col items-end max-w-[420px] w-full">
          {/* Card Container fitted 100% perfectly with image aspect ratio */}
          <div className="relative w-full aspect-[16/9.5] sm:aspect-[16/9] rounded-[24px] overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.35)] border border-white/10 mb-4 group select-none bg-[#3D1212]">
            {/* Image hai.png */}
            <img
              src={fotJpeg}
              alt="Jam Gadang Bukittinggi"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none"
              draggable={false}
            />
            {/* Inner Shadow Effect on Card */}
            <div
              className="absolute inset-0 pointer-events-none rounded-[24px]"
              style={{
                boxShadow: 'inset 0px 0px 25px 5px rgba(0, 0, 0, 0.5)',
              }}
            />
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-6 text-[12.5px] font-poppins text-white/65">
            <span className="hover:text-white transition-colors cursor-pointer">
              Terms of service
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              Privacy policy
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
