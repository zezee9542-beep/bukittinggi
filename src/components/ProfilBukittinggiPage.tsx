import { useNavigate } from 'react-router-dom';
import { useMode } from '../context/ModeContext';
import bggImage from '../assets/bgg.webp';
import gadangImage from '../assets/gadang.svg';

// Import Stat Icons
import iconPopulasi from '../assets/Icon.png';
import iconKetinggian from '../assets/Icon (1).png';
import iconIklim from '../assets/Icon (2).png';
import iconGunung from '../assets/Icon (3).png';

// Import Geografis Assets
import iconGroup2 from '../assets/Group (2).svg';
import jekImage from '../assets/jek.webp';
import okeImage from '../assets/oke.webp';

export function ProfilBukittinggiPage() {
  const navigate = useNavigate();
  const { musicPlaying, setMusicPlaying } = useMode();

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      {/* ── Custom Navbar ── */}
      <nav className="w-full bg-white h-[76px] px-6 md:px-12 flex items-center justify-between border-b border-[#f5f5f5] z-50">
        {/* Back button — black, Poppins regular */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 font-poppins font-normal text-[16px] text-black cursor-pointer hover:opacity-70 transition-opacity"
        >
          ← Kembali
        </button>

        {/* Right: Sounds toggle */}
        <div className="flex items-center gap-3">
          <span className="font-poppins text-[15px] font-medium text-neutral-500">Sounds</span>
          <button
            onClick={() => setMusicPlaying(!musicPlaying)}
            className="relative w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 focus:outline-none"
            style={{ backgroundColor: musicPlaying ? '#5E1D1D' : '#D6B8B3' }}
            title={musicPlaying ? 'Turn Music Off' : 'Turn Music On'}
            aria-label="Toggle Sounds"
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${
                musicPlaying ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </nav>

      {/* ── Hero Section — fills viewport exactly so elements are immediately visible ── */}
      <section
        className="flex-1 w-full relative flex items-end pb-10 md:pb-16 px-6 md:px-16 overflow-hidden bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${bggImage})`,
          backgroundPosition: 'center 78%',
          minHeight: 'calc(100vh + 60px)',
        }}
      >
        {/* Gradient scrim — strengthens toward bottom so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none z-0" />

        {/* Content row — both columns aligned to bottom */}
        <div className="relative z-10 w-full max-w-[1280px] mx-auto flex flex-col md:flex-row items-end justify-between gap-10 md:gap-6">

          {/* ── LEFT: Location label + Title + Dataran Tinggi pill ── */}
          <div className="flex flex-col items-start text-left max-w-[560px]">
            {/* "SUMATERA BARAT, INDONESIA" — Poppins regular, #FFDAD5, uppercase spaced */}
            <span className="font-poppins font-normal text-[#FFDAD5] tracking-[0.22em] text-[12px] sm:text-[13px] uppercase mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              SUMATERA BARAT, INDONESIA
            </span>

            {/* Title — Noto Serif Bold, white, line break after "Tinggi" matching design */}
            <h1
              className="font-noto font-bold text-white leading-[1.15] mb-5 drop-shadow-[0_4px_18px_rgba(0,0,0,0.5)]"
              style={{ fontSize: 'clamp(1.9rem, 4.2vw, 3.4rem)' }}
            >
              Bukittinggi: Permata Dataran Tinggi<br />
              dari Minangkabau
            </h1>

            {/* "Dataran Tinggi" pill — 117×26, blur, border & fill color #7D2D26 */}
            <div
              className="flex items-center justify-center rounded-full backdrop-blur-[6px]"
              style={{
                width: '117px',
                height: '26px',
                backgroundColor: 'rgba(125, 45, 38, 0.45)',
                boxShadow: '0 0 0 1px #7D2D26',
              }}
            >
              <span className="font-poppins font-medium text-[11px] text-[#FFDAD5] leading-none select-none">
                Dataran Tinggi
              </span>
            </div>
          </div>

          {/* ── RIGHT: Image frame 463×342 — bottom-right of hero ── */}
          <div
            className="flex-shrink-0 relative"
            style={{ width: 'min(463px, 100%)', height: '342px' }}
          >
            {/* "Luas 25,24 km²" badge — top-right corner of frame, #F9CE65 bg, #531717 text */}
            <div
              className="absolute -top-5 right-4 z-20 flex items-center justify-center px-5 py-2 rounded-[14px] shadow-[0_6px_18px_rgba(0,0,0,0.18)]"
              style={{ backgroundColor: '#F9CE65' }}
            >
              <span
                className="font-poppins font-medium text-[13px]"
                style={{ color: '#531717' }}
              >
                Luas 25,24 km²
              </span>
            </div>

            {/* Frame with rounded corners, drop shadow, inner shadow overlay */}
            <div
              className="w-full h-full rounded-[20px] overflow-hidden relative"
              style={{ boxShadow: '0 14px 32px rgba(0,0,0,0.30)' }}
            >
              <img
                src={gadangImage}
                alt="Rumah Gadang Bukittinggi"
                className="w-full h-full object-cover select-none"
                draggable={false}
              />
              {/* Inner shadow overlay */}
              <div
                className="absolute inset-0 pointer-events-none rounded-[20px]"
                style={{ boxShadow: 'inset 0 8px 26px rgba(0,0,0,0.40)' }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* ── Tentang Section ── */}
      <section className="w-full bg-white py-16 md:py-24 px-6 md:px-16">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* Left Side: 2x2 Grid of Red Stat Cards (631C1C) */}
          <div className="grid grid-cols-2 gap-2 w-full max-w-[390px] sm:max-w-[450px] flex-shrink-0">
            
            {/* Card 1: Populasi */}
            <div className="bg-[#631C1C] rounded-[20px] p-4 flex flex-col items-start justify-center text-left w-full h-[135px] sm:h-[150px] shadow-md">
              <img src={iconPopulasi} alt="Populasi" className="h-5 w-auto object-contain mb-2" />
              <span className="font-manrope font-normal text-white text-[12px] sm:text-[13px] leading-tight">
                Populasi
              </span>
              <span className="font-noto font-semibold text-white text-[19px] sm:text-[22px] leading-tight my-0.5">
                126,000+
              </span>
              <span className="font-manrope font-normal text-white/70 text-[9px] sm:text-[10px] leading-tight">
                Pada tahun 2025
              </span>
            </div>

            {/* Card 2: Ketinggian */}
            <div className="bg-[#631C1C] rounded-[20px] p-4 flex flex-col items-start justify-center text-left w-full h-[135px] sm:h-[150px] shadow-md">
              <img src={iconKetinggian} alt="Ketinggian" className="h-5 w-auto object-contain mb-2" />
              <span className="font-manrope font-normal text-white text-[12px] sm:text-[13px] leading-tight">
                Ketinggian
              </span>
              <span className="font-noto font-semibold text-white text-[19px] sm:text-[22px] leading-tight my-0.5">
                930m
              </span>
              <span className="font-manrope font-normal text-white/70 text-[9px] sm:text-[10px] leading-tight">
                Di atas permukaan laut
              </span>
            </div>

            {/* Card 3: Iklim */}
            <div className="bg-[#631C1C] rounded-[20px] p-4 flex flex-col items-start justify-center text-left w-full h-[135px] sm:h-[150px] shadow-md">
              <img src={iconIklim} alt="Iklim" className="h-5 w-auto object-contain mb-2" />
              <span className="font-manrope font-normal text-white text-[12px] sm:text-[13px] leading-tight">
                Iklim
              </span>
              <span className="font-noto font-semibold text-white text-[19px] sm:text-[22px] leading-tight my-0.5">
                16 - 25°C
              </span>
              <span className="font-manrope font-normal text-white/70 text-[9px] sm:text-[10px] leading-tight">
                Pegunungan Tropis Sejuk
              </span>
            </div>

            {/* Card 4: Gunung Berapi */}
            <div className="bg-[#631C1C] rounded-[20px] p-4 flex flex-col items-start justify-center text-left w-full h-[135px] sm:h-[150px] shadow-md">
              <img src={iconGunung} alt="Gunung Berapi" className="h-5 w-auto object-contain mb-2" />
              <span className="font-manrope font-normal text-white text-[12px] sm:text-[13px] leading-tight">
                Gunung Berapi
              </span>
              <span className="font-noto font-semibold text-white text-[19px] sm:text-[22px] leading-tight my-0.5">
                2 Aktif
              </span>
              <span className="font-manrope font-normal text-white/70 text-[9px] sm:text-[10px] leading-tight">
                Merapi & Singgalang
              </span>
            </div>

          </div>

          {/* Right Side: Title & Description */}
          <div className="flex-1 flex flex-col items-start text-left">
            <h2 className="font-cormorant font-bold text-[#6E1F1F] text-[32px] sm:text-[40px] md:text-[48px] leading-tight mb-6">
              Tentang Bukittinggi
            </h2>
            <p className="font-poppins font-normal text-[#363D4F] text-[15px] sm:text-[16px] md:text-[18px] leading-[1.8] max-w-[680px]">
              Bukittinggi merupakan kota terbesar kedua di Sumatera Barat yang terletak sekitar 91 kilometer dari Padang. Berada di jalur strategis yang menghubungkan wilayah utara, timur, dan selatan Pulau Sumatra, kota ini memiliki peran penting dalam sejarah and perkembangan kawasan. Bukittinggi resmi menjadi daerah otonom pada tahun 1956 dan menetapkan <strong className="font-bold text-[#363D4F]">22 Desember 1784</strong> sebagai hari jadinya.
            </p>
          </div>

        </div>
      </section>

      {/* ── Kondisi Geografis Section ── */}
      <section className="w-full bg-[#fcfcfc] pt-10 pb-16 md:pt-14 md:pb-24 px-6 md:px-16">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          
          {/* Left Side: Text Items */}
          <div className="flex-1 flex flex-col items-start text-left">
            <h2 className="font-cormorant font-bold text-[#6E1F1F] text-[32px] sm:text-[40px] md:text-[48px] leading-tight mb-8">
              Kondisi Geografis
            </h2>
            
            <div className="flex flex-col gap-4 md:gap-5.5 max-w-[680px]">
              
              {/* Item 1 */}
              <div className="flex items-start gap-4">
                <img src={iconGroup2} alt="bullet" className="w-5 h-5 object-contain flex-shrink-0 mt-1" />
                <p className="font-poppins font-normal text-[#363D4F] text-[15px] sm:text-[16px] leading-[1.7]">
                  <strong className="font-bold text-[#363D4F]">Letak & Ketinggian :</strong> Terletak di rangkaian Pegunungan Bukit Barisan pada ketinggian 909–941 mdpl, dengan dikelilingi Gunung Marapi dan Gunung Singgalang.
                </p>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-4">
                <img src={iconGroup2} alt="bullet" className="w-5 h-5 object-contain flex-shrink-0 mt-1" />
                <p className="font-poppins font-normal text-[#363D4F] text-[15px] sm:text-[16px] leading-[1.7]">
                  <strong className="font-bold text-[#363D4F]">Topografi & Iklim :</strong> Memiliki bentang alam berbukit dan berlembah dengan ikon alam berupa Ngarai Sianok yang membentang di sisi kota. Suhu udara berkisar antara 16,1–24,9°C
                </p>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-4">
                <img src={iconGroup2} alt="bullet" className="w-5 h-5 object-contain flex-shrink-0 mt-1" />
                <p className="font-poppins font-normal text-[#363D4F] text-[15px] sm:text-[16px] leading-[1.7]">
                  <strong className="font-bold text-[#363D4F]">Wilayah Administratif :</strong> Memiliki luas wilayah sekitar 25,24 km² dan terbagi menjadi 3 kecamatan serta 24 kelurahan. Secara administratif, seluruh wilayah Bukittinggi dikelilingi oleh Kabupaten Agam.
                </p>
              </div>

            </div>
          </div>

          {/* Right Side: Landscape image with Maps overlay (Fully Responsive) */}
          <div className="flex-shrink-0 relative w-full max-w-[420px] aspect-[420/430] mt-8 lg:mt-0">
            {/* Main Landscape Frame (jek.png) with inner shadow */}
            <div className="w-[90%] h-[95%] rounded-[24px] overflow-hidden relative ml-auto shadow-[0_12px_28px_rgba(0,0,0,0.15)]">
              <img src={jekImage} alt="Ngarai Sianok" className="w-full h-full object-cover select-none" draggable={false} />
              {/* Inner shadow overlay */}
              <div
                className="absolute inset-0 pointer-events-none rounded-[24px]"
                style={{ boxShadow: 'inset 0 8px 24px rgba(0, 0, 0, 0.35)' }}
              />
            </div>

            {/* Map Overlay (oke.png) overlapping bottom-left */}
            <div className="absolute bottom-0 left-0 z-10 w-[55%] max-w-[240px] rounded-[16px] overflow-hidden border-2 border-[#6E1F1F] bg-white p-1 shadow-[0_12px_24px_rgba(0,0,0,0.2)]">
              <img src={okeImage} alt="Peta Administratif" className="w-full h-auto object-contain rounded-[10px]" draggable={false} />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
