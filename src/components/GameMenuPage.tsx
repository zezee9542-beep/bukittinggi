/**
 * GameMenuPage.tsx — Halaman Hub Menu Permainan
 *
 * Halaman ini berfungsi sebagai pusat (hub) navigasi untuk semua permainan
 * yang tersedia di aplikasi Bukittinggi Heritage.
 *
 * Rute: /game
 *
 * Struktur halaman mengacu pada desain Figma node #536-19 "Halaman - Kuliner":
 * https://www.figma.com/design/6GmusBiaoRHmm20A1qslEm/Bukittinggi-Heritage?node-id=536-19
 *
 * Untuk menambahkan permainan baru di masa mendatang, cukup tambahkan
 * entri baru ke dalam array DAFTAR_GAME di bawah ini.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Aset gambar kartu flip — digunakan sebagai thumbnail preview di kartu game
import img111 from '../assets/111.png';
import img222 from '../assets/222.png';
import img333 from '../assets/333.png';
import img444 from '../assets/444.png';
import img555 from '../assets/555.png';
import img666 from '../assets/666.png';
import logoSvg from '../assets/logo.svg';

// Aset gambar pariwisata untuk preview Word Search
import gadangImage from '../assets/gadang.svg';
import gunungImage from '../assets/gunung.webp';
import rumahImage from '../assets/rumah.webp';
import sawahImage from '../assets/sawah.webp';
import menaraImage from '../assets/menara.webp';
import bggImage from '../assets/bgg.webp';

// ─────────────────────────────────────────────────────────────────────────────
// TOKEN WARNA — hasil inspeksi Figma node #536-19 (read-only)
// ─────────────────────────────────────────────────────────────────────────────
const MAROON = '#6E1F1F';  // Foundation/Red/Normal
const GOLD   = '#F9CE65';  // Foundation/Yellow/Normal
const CREAM  = '#F1E9E9';  // Foundation/Red/Light — latar kartu preview
const DARK   = '#444651';  // fill_39581b88 — warna teks deskripsi

// ─────────────────────────────────────────────────────────────────────────────
// TIPE DATA — struktur permainan yang mudah diperluas
// ─────────────────────────────────────────────────────────────────────────────
interface GameEntry {
  /** ID unik game, digunakan untuk aria-label dan key */
  id: string;
  /** Nama game yang ditampilkan di kartu */
  nama: string;
  /** Deskripsi singkat game (maks. ~180 karakter) */
  deskripsi: string;
  /** Rute React Router yang dituju saat klik "Mulai Main" */
  rute: string;
  /** Array path gambar untuk thumbnail preview kartu flip (maks. 6 item) */
  previewGambar: string[];
  /** Status ketersediaan: 'tersedia' = aktif, 'segera' = coming soon */
  status: 'tersedia' | 'segera';
  /** Label kategori seperti "Memori", "Kuis", "Puzzle" */
  kategori: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DAFTAR GAME — tambahkan entri baru di sini untuk memperluas menu
// ─────────────────────────────────────────────────────────────────────────────
const DAFTAR_GAME: GameEntry[] = [
  {
    id: 'flip-kuliner',
    nama: 'Memori Kuliner Minang',
    deskripsi:
      'Uji daya ingatmu dengan mencocokkan kartu kuliner khas Bukittinggi. Temukan seluruh pasangan yang sesuai untuk mempelajari berbagai hidangan tradisional dengan cara yang lebih menyenangkan.',
    rute: '/game/flip',
    previewGambar: [img111, img222, img333, img444, img555, img666],
    status: 'tersedia',
    kategori: 'Memori',
  },
  {
    id: 'word-search-wisata',
    nama: 'Cari Kata Wisata',
    deskripsi:
      'Temukan nama-nama destinasi wisata ikonis di Bukittinggi yang tersembunyi di dalam grid huruf. Tantang ketelitianmu!',
    rute: '/game/word-search',
    previewGambar: [gadangImage, gunungImage, rumahImage, sawahImage, menaraImage, bggImage],
    status: 'tersedia',
    kategori: 'Puzzle',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-KOMPONEN: GameCard — Kartu UI Satu Permainan
// Mengacu pada kartu Figma #1153:1537 (ukuran 616×668, borderRadius 36px)
// ─────────────────────────────────────────────────────────────────────────────
function GameCard({ game, onPlay }: { game: GameEntry; onPlay: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="relative w-full h-full max-w-[616px] mx-auto flex flex-col"
      aria-labelledby={`game-title-${game.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Kartu luar — latar putih, bayangan inset, radius 36px */}
      {/* Referensi Figma: #1153:1514 (RECTANGLE 616×668, bg putih, border abu, radius 36px) */}
      <div
        className="relative bg-white overflow-hidden transition-all duration-500 flex flex-col flex-1 h-full"
        style={{
          borderRadius: 36,
          boxShadow: hovered
            ? `0px 32px 80px ${MAROON}38, inset 0px 4px 4px rgba(0,0,0,0.06)`
            : 'inset 0px 4px 4px rgba(0,0,0,0.12)',
          border: '3px solid rgba(68,70,81,0.2)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        }}
      >
        {/* ── Area Preview Atas ──────────────────────────────────────────────── */}
        {/* Referensi Figma: #1153:1522 (568×330, fill CREAM, inset shadow, radius 36px) */}
        <div
          className="relative mx-6 mt-[29px] flex items-center justify-center overflow-hidden"
          style={{
            backgroundColor: CREAM,
            border: '3px solid rgba(68,70,81,0.2)',
            borderRadius: 36,
            minHeight: 280,
            boxShadow: 'inset 0px 4px 12px rgba(0,0,0,0.25)',
          }}
        >
          {/* Glow kuning elips di tengah (Figma: ELLIPSE #1153:1505, blur 150px, opacity 0.5) */}
          <div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              width: 227,
              height: 295,
              background: GOLD,
              borderRadius: '50%',
              filter: 'blur(150px)',
              opacity: 0.5,
            }}
          />

          {/* ── Tampilan 3 Kartu Flip Berjajar ───────────────────────────────── */}
          {/* Referensi Figma: grup kartu #1153:1516 dan #1153:1517 dan #1150:1493 */}
          <div className="relative flex items-center justify-center w-full px-6 py-8 gap-3 sm:gap-5">
            {/* Kartu kiri — menghadap ke belakang, miring ke kiri */}
            <div
              aria-hidden="true"
              className="relative flex-shrink-0 rounded-[21px] overflow-hidden shadow-lg"
              style={{
                width: 'clamp(100px, 14vw, 148px)',
                height: 'clamp(140px, 19vw, 204px)',
                backgroundColor: MAROON,
                border: `3px solid ${GOLD}`,
                transform: 'rotate(-8deg) translateY(14px)',
                zIndex: 1,
              }}
            >
              <img
                src={game.previewGambar[0] || logoSvg}
                alt=""
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Kartu tengah — menghadap ke depan, gambar kuliner terlihat */}
            <div
              className="relative flex-shrink-0 overflow-hidden"
              style={{
                width: 'clamp(120px, 16vw, 168px)',
                height: 'clamp(160px, 21vw, 228px)',
                backgroundColor: MAROON,
                border: `4px solid ${GOLD}`,
                borderRadius: 21,
                zIndex: 10,
                boxShadow: `0 20px 40px ${MAROON}55`,
              }}
            >
              <img
                src={game.previewGambar[2] || game.previewGambar[0]}
                alt={game.nama}
                className="w-full h-full object-cover"
              />
              {/* Overlay ringan agar kontras terjaga */}
              <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.06)' }} />
            </div>

            {/* Kartu kanan — menghadap ke belakang, miring ke kanan */}
            <div
              aria-hidden="true"
              className="relative flex-shrink-0 rounded-[21px] overflow-hidden shadow-lg"
              style={{
                width: 'clamp(100px, 14vw, 148px)',
                height: 'clamp(140px, 19vw, 204px)',
                backgroundColor: MAROON,
                border: `3px solid ${GOLD}`,
                transform: 'rotate(8deg) translateY(14px)',
                zIndex: 1,
              }}
            >
              <img
                src={game.previewGambar[1] || logoSvg}
                alt=""
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          </div>
        </div>

        {/* ── Area Teks dan Tombol ───────────────────────────────────────────── */}
        <div className="px-6 pt-5 pb-8 flex flex-col flex-1">
          {/* Badge kategori */}
          <span
            className="font-poppins text-xs font-medium rounded-full px-3 py-1 inline-block mb-3"
            style={{ backgroundColor: CREAM, color: MAROON }}
          >
            {game.kategori}
          </span>

          {/* Judul game — Poppins Medium ~36px (Figma: #1153:1524, fontSize 36, weight 500) */}
          <h2
            id={`game-title-${game.id}`}
            className="font-poppins font-medium text-black leading-tight mb-4"
            style={{ fontSize: 'clamp(22px, 3.5vw, 36px)' }}
          >
            {game.nama}
          </h2>

          {/* Deskripsi game — Poppins Regular ~18px (Figma: #1153:1528, fontSize 18, weight 400) */}
          <p
            className="font-poppins leading-relaxed mb-7"
            style={{
              color: `${DARK}cc`,
              fontSize: 'clamp(13px, 1.5vw, 18px)',
            }}
          >
            {game.deskripsi}
          </p>

          {/* ── Tombol CTA (Figma: #1153:1512, bg MAROON, radius 16px, px-24 py-16) ── */}
          <div className="mt-auto">
            {game.status === 'tersedia' ? (
              <button
                id={`btn-play-${game.id}`}
                type="button"
                onClick={onPlay}
                className="group w-full flex items-center justify-center gap-3 font-poppins font-medium text-white transition-all duration-300 active:scale-[0.97]"
                style={{
                  backgroundColor: MAROON,
                  borderRadius: 16,
                  padding: '16px 24px',
                  fontSize: 'clamp(16px, 2vw, 24px)',
                  boxShadow: `0 8px 24px ${MAROON}44`,
                  transform: hovered ? 'scale(1.03)' : 'scale(1)',
                }}
                aria-label={`Mulai bermain ${game.nama}`}
              >
              Mulai Main
              {/* Ikon panah atas (Figma: lucide:arrow-up #1153:1535, 24×24) */}
              <svg
                aria-hidden="true"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:-translate-y-1"
              >
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          ) : (
            /* Tombol non-aktif untuk game yang belum tersedia */
            <div
              className="inline-flex items-center gap-2 font-poppins font-medium rounded-[16px] select-none"
              style={{
                backgroundColor: '#E8E8E8',
                color: '#999',
                padding: '16px 24px',
                fontSize: 'clamp(16px, 2vw, 24px)',
              }}
            >
              Segera Hadir
            </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KOMPONEN UTAMA: GameMenuPage
// Dipasang pada rute /game oleh App.tsx
// ─────────────────────────────────────────────────────────────────────────────
export function GameMenuPage() {
  const navigate = useNavigate();
  // State untuk trigger animasi masuk (fade + slide dari atas)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  /**
   * Navigasikan pengguna ke halaman game yang dipilih.
   * Jika rute adalah '/game/flip', kita arahkan ke komponen GameFlipPage
   * yang sudah ada di rute /game/flip (ditambahkan di App.tsx).
   */
  function handlePlay(rute: string) {
    navigate(rute);
  }

  return (
    <div
      className="relative min-h-screen w-full font-poppins overflow-x-clip"
      style={{ backgroundColor: '#faf8f7' }}
    >
      {/* ── Latar gradien maroon (Figma: IMAGE-SVG #1071:2123, gradient merah ke transparan) ── */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: 560,
          background: `linear-gradient(180deg,
            ${MAROON} 0%,
            ${MAROON}e8 15%,
            ${MAROON}c0 45%,
            ${MAROON}60 68%,
            transparent 100%)`,
          zIndex: 0,
        }}
      />

      {/* ── Ornamen blur kuning kiri atas (seperti leaf nodes di Figma) ── */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          left: -40,
          top: 80,
          width: 200,
          height: 200,
          background: `radial-gradient(circle, ${GOLD}50 0%, transparent 70%)`,
          filter: 'blur(35px)',
          opacity: 0.4,
          zIndex: 1,
        }}
      />
      {/* ── Ornamen blur kuning kanan ── */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          right: -20,
          top: 200,
          width: 160,
          height: 160,
          background: `radial-gradient(circle, ${GOLD}44 0%, transparent 70%)`,
          filter: 'blur(28px)',
          opacity: 0.35,
          zIndex: 1,
        }}
      />

      {/* ── Konten Utama ─────────────────────────────────────────────────────── */}
      <div
        className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ zIndex: 2 }}
      >
        {/* ── Bagian Header — judul halaman di atas latar maroon ──────────────── */}
        <header
          className="pt-[100px] pb-12 text-center"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Label kecil bertinta emas di atas judul */}
          <p
            className="font-poppins uppercase tracking-[0.3em] text-xs sm:text-sm mb-3"
            style={{ color: GOLD }}
          >
            Pusat Permainan
          </p>

          {/* Judul utama — Poppins Medium 64px (Figma: EL-a4188c0e, 64px weight 500) */}
          <h1
            className="font-poppins font-medium text-white leading-tight mb-4"
            style={{ fontSize: 'clamp(28px, 5.5vw, 64px)' }}
          >
            Cita Rasa Bukittinggi
          </h1>

          {/* Garis dekoratif emas */}
          <div
            aria-hidden="true"
            className="mx-auto mb-5"
            style={{
              height: '1.5px',
              width: 200,
              background: `linear-gradient(to right, transparent, ${GOLD} 25%, ${GOLD} 75%, transparent)`,
            }}
          />

          {/* Subjudul */}
          <p
            className="font-poppins text-white/75 max-w-md mx-auto"
            style={{ fontSize: 'clamp(13px, 1.4vw, 17px)' }}
          >
            Jelajahi dan pelajari warisan budaya Bukittinggi melalui
            permainan interaktif yang seru dan edukatif.
          </p>
        </header>

        {/* ── Grid Kartu Game ─────────────────────────────────────────────────── */}
        {/*
         * Setiap item di DAFTAR_GAME dirender sebagai satu GameCard.
         * Untuk menambahkan game baru, cukup tambahkan objek baru ke DAFTAR_GAME.
         */}
        <main className="pb-20 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch" id="daftar-game">
          {DAFTAR_GAME.map((game, idx) => (
            <div
              key={game.id}
              className="w-full"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${idx * 130 + 220}ms,
                             transform 0.7s cubic-bezier(0.16,1,0.3,1) ${idx * 130 + 220}ms`,
              }}
            >
              <GameCard game={game} onPlay={() => handlePlay(game.rute)} />
            </div>
          ))}

          {/* Pesan fallback jika array kosong */}
          {DAFTAR_GAME.length === 0 && (
            <p className="font-poppins text-gray-400 py-20 text-center">
              Belum ada permainan yang tersedia. Nantikan pembaruan berikutnya!
            </p>
          )}
        </main>

        {/* ── Footer info jumlah game ───────────────────────────────────────── */}
        <footer
          className="pb-12 text-center"
          style={{
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.8s ease 700ms',
          }}
        >
          <p className="font-poppins text-sm" style={{ color: `${DARK}70` }}>
            {DAFTAR_GAME.filter((g) => g.status === 'tersedia').length} permainan tersedia
            {DAFTAR_GAME.filter((g) => g.status === 'segera').length > 0 &&
              ` · ${DAFTAR_GAME.filter((g) => g.status === 'segera').length} segera hadir`}
          </p>
        </footer>
      </div>
    </div>
  );
}
