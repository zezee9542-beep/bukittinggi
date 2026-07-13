import { useState, useEffect, useRef } from 'react';
import frameSvg from '../assets/frame.svg';
import gadangSvg from '../assets/gadang.svg';
import segitigaSvg from '../assets/segitiga.svg';
import { useScrollReveal } from '../hooks/useScrollReveal';
import mapsSvg from '../assets/maps.svg';
import tigaSvg from '../assets/tiga.svg';
import budaya4kVideo from '../assets/Budaya 4k.mp4';

// Grid card images — Panduan Budaya section
import grid1 from '../assets/01.webp';
import grid2 from '../assets/02.webp';
import grid3 from '../assets/03.webp';
import grid4 from '../assets/04.webp';
import grid5 from '../assets/05.webp';
import grid6 from '../assets/06.webp';

// Carousel slide images
import rect2 from "../assets/Rectangle 1385 (2).svg";
import rect3 from "../assets/Rectangle 1385 (3).svg";
import rect4 from "../assets/Rectangle 1385 (4).svg";
import rect5 from "../assets/Rectangle 1385 (5).svg";
import rect6 from "../assets/Rectangle 1385 (6).svg";
import rect7 from "../assets/Rectangle 1385 (7).svg";
import rect8 from "../assets/Rectangle 1385 (8).svg";

interface SlideData {
  id: number;
  label: string;
  title: string;
  img: string;
  lead: string;
  bullets: string[];
}

const slides: SlideData[] = [
  {
    id: 1,
    label: 'CIEK ( 1 )',
    title: 'Rumah Gadang',
    img: gadangSvg,
    lead: 'Rumah adat masyarakat Minangkabau yang menjadi simbol persatuan, kebersamaan, dan warisan leluhur.',
    bullets: [
      'Dikenali dari atap bergonjong yang menyerupai tanduk kerbau, ikon khas budaya Minangkabau.',
      'Menjadi tempat bermusyawarah, berkumpulnya keluarga besar, serta penyelenggaraan berbagai upacara adat.',
      'Mencerminkan filosofi hidup masyarakat Minang yang menjunjung tinggi adat, kekeluargaan, dan gotong royong.',
    ],
  },
  {
    id: 2,
    label: 'DUO ( 2 )',
    title: 'Tari Piring',
    img: rect2,
    lead: 'Tarian tradisional Minangkabau yang melambangkan rasa syukur, kegembiraan, dan semangat kebersamaan masyarakat. Gerakannya terinspirasi dari kehidupan agraris dan tradisi masyarakat Minang.',
    bullets: [
      'Penari membawakan dua piring di kedua tangan dengan gerakan cepat, lincah, dan penuh keseimbangan.',
      'Diiringi denting piring, talempong, saluang, dan gendang yang menciptakan irama khas Minangkabau.',
      'Pada puncak pertunjukan, piring dipecahkan dan para penari menari di atas pecahannya dengan langkah yang mantap dan penuh keberanian.',
    ],
  },
  {
    id: 3,
    label: 'TIGO ( 3 )',
    title: 'Talempong',
    img: rect3,
    lead: 'Alat musik tradisional Minangkabau yang menghadirkan harmoni melalui dentingan nada yang khas dan merdu. Talempong menjadi bagian penting dalam berbagai upacara adat dan pertunjukan budaya.',
    bullets: [
      'Terdiri dari beberapa gong kecil berbahan logam yang dimainkan dengan cara dipukul menggunakan pemukul kayu.',
      'Mengiringi berbagai pertunjukan tradisional, seperti Tari Piring, Tari Pasambahan, hingga penyambutan tamu kehormatan.',
      'Setiap dentingannya menyatu dengan irama saluang dan gendang, menciptakan suasana yang hangat dan penuh makna.',
    ],
  },
  {
    id: 4,
    label: 'AMPEK ( 4 )',
    title: 'Randai',
    img: rect4,
    lead: 'Seni pertunjukan khas Minangkabau yang memadukan cerita, musik, tari, dan gerakan silat dalam satu panggung yang hidup. Randai menjadi media untuk menyampaikan nilai-nilai adat, nasihat, dan kisah rakyat dari generasi ke generasi.',
    bullets: [
      'Dibawakan secara berkelompok dalam formasi melingkar, melambangkan persatuan dan kebersamaan masyarakat Minangkabau.',
      'Menggabungkan dialog, dendang, musik tradisional, serta gerakan yang terinspirasi dari silek atau silat Minangkabau.',
      'Mengangkat kisah legenda, sejarah, dan cerita rakyat yang sarat akan pesan moral dan kearifan hidup.',
    ],
  },
  {
    id: 5,
    label: 'LIMO ( 5 )',
    title: 'Saluang',
    img: rect5,
    lead: 'Alunan seruling khas Minangkabau yang menghadirkan suasana syahdu, menjadi pengiring cerita, nasihat, dan ungkapan perasaan masyarakat sejak dahulu.',
    bullets: [
      'Terbuat dari bambu tipis atau talang, menghasilkan nada lembut yang khas dan mudah dikenali.',
      'Sering dimainkan bersama dendang Minang, mengiringi pantun, kisah kehidupan, hingga petuah yang diwariskan secara lisan.',
      'Alunannya yang mendayu mampu menghadirkan suasana haru, tenang, dan penuh makna bagi para pendengarnya.',
    ],
  },
  {
    id: 6,
    label: 'ANAM ( 6 )',
    title: 'Pakaian Tradisional',
    img: rect6,
    lead: 'Pakaian adat Minangkabau yang anggun dan sarat makna filosofis, mencerminkan kepribadian dan kehormatan pemakainya.',
    bullets: [
      'Dilengkapi hiasan kepala Suntiang yang megah bagi pengantin wanita Minangkabau.',
      'Menggunakan kain songket hasil tenunan tangan dengan benang emas berkualitas tinggi.',
      'Setiap detail jahitan pakaian melambangkan tanggung jawab, kehormatan, dan kesopanan.',
    ],
  },
  {
    id: 7,
    label: 'TUJUAH ( 7 )',
    title: 'Bela Diri Silek',
    img: rect7,
    lead: 'Seni bela diri tradisional Minangkabau yang melatih ketangkasan fisik serta kekuatan spiritual dan nilai-nilai moral luhur.',
    bullets: [
      'Gerakan silat yang luwes dan dinamis, terinspirasi dari gerakan alam sekitar.',
      'Mengutamakan pertahanan diri serta perdamaian daripada penyerangan aktif.',
      'Diwariskan di sasaran (gelanggang) sebagai wadah pembentukan karakter pemuda.',
    ],
  },
  {
    id: 8,
    label: 'LAPAN ( 8 )',
    title: 'Songket Tenun',
    img: rect8,
    lead: 'Karya seni tenun khas Minangkabau yang memiliki keindahan motif geometris rumit serta bernilai sejarah seni tinggi.',
    bullets: [
      'Ditenun secara tradisional menggunakan benang emas dan perak asli.',
      'Setiap motif tenunan menyimpan sejarah, status sosial, dan falsafah hidup Minang.',
      'Menjadi pakaian kehormatan dalam upacara adat penting dan perayaan resmi.',
    ],
  },
];

const gridItems = [
  {
    title: 'Adat Basandi Syarak',
    img: grid1,
    desc: 'Masyarakat Minangkabau menjunjung tinggi nilai adat dan agama dalam kehidupan sehari-hari.'
  },
  {
    title: 'Hormati Tempat Ibadah',
    img: grid2,
    desc: 'Gunakan pakaian yang sopan dan jaga ketenangan saat mengunjungi masjid atau kawasan religius.'
  },
  {
    title: 'Menghargai Tradisi Lokal',
    img: grid3,
    desc: 'Jangan menyentuh properti adat atau peralatan pertunjukan tanpa izin.'
  },
  {
    title: 'Bertutur Santun',
    img: grid4,
    desc: 'Keramahan dan sopan santun merupakan bagian penting dari budaya Minangkabau.'
  },
  {
    title: 'Dukung Umkm Lokal',
    img: grid5,
    desc: 'Belanja produk lokal membantu melestarikan ekonomi dan budaya masyarakat.'
  },
  {
    title: 'Jaga Kebersihan Alam',
    img: grid6,
    desc: 'Ngarai Sianok dan berbagai destinasi alam merupakan warisan yang harus dijaga.'
  },
];

const SCROLL_THRESHOLD = 120;

export function BudayaPage() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal<HTMLElement>();
  const { ref: featureRef, isVisible: featureVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal<HTMLElement>();
  const { ref: footerRef, isVisible: footerVisible } = useScrollReveal<HTMLElement>();

  // Carousel section element ref (used for wheel-lock boundary detection)
  const containerRef = useRef<HTMLElement>(null);
  // Video ref for manual loop control (prevents black flash on loop boundary)
  const videoRef = useRef<HTMLVideoElement>(null);
  // Carousel slide index (integer 0-7)
  const [activeSlide, setActiveSlide] = useState(0);
  const activeSlideRef = useRef(0);

  // Scroll accumulator — tracks partial scroll momentum before triggering a slide change
  const scrollAccRef = useRef(0);

  // Whether the carousel section is currently the active scroll-jacker
  const isLockedRef = useRef(false);

  // Touch swipe state
  const touchStartRef = useRef({ x: 0, y: 0, slide: 0 });
  const isSwipingRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      slide: activeSlideRef.current,
    };
    isSwipingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const start = touchStartRef.current;
    if (!touch || !start) return;

    const deltaX = start.x - touch.clientX;
    const deltaY = start.y - touch.clientY;

    // Prefer horizontal swipe
    if (!isSwipingRef.current && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 8) {
      isSwipingRef.current = true;
    }

    if (isSwipingRef.current) {
      if (e.cancelable) e.preventDefault();
      // Map 60% of screen width = 1 slide
      const screenW = window.innerWidth;
      const rawSlide = start.slide + deltaX / (screenW * 0.6);
      const clamped = Math.max(0, Math.min(slides.length - 1, rawSlide));
      activeSlideRef.current = clamped;
      setActiveSlide(clamped);
    }
  };

  const handleTouchEnd = () => {
    if (isSwipingRef.current) {
      const snapped = Math.max(0, Math.min(slides.length - 1, Math.round(activeSlideRef.current)));
      activeSlideRef.current = snapped;
      setActiveSlide(snapped);
      isSwipingRef.current = false;
    }
  };

  /**
   * Snapping Wheel-event scroll-lock:
   * Advances directly to the next/prev slide on wheel scroll with a cooldown.
   */
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const section = containerRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const cur = activeSlideRef.current;
      const curInt = Math.round(cur);

      const middleInView = rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;

      const goingDownAndNotEnd = e.deltaY > 0 && curInt < slides.length - 1;
      const goingUpAndNotStart = e.deltaY < 0 && curInt > 0;

      const shouldLock = middleInView && (goingDownAndNotEnd || goingUpAndNotStart);

      if (shouldLock) {
        e.preventDefault();
        
        if (Math.abs(rect.top) > 1) {
          window.scrollTo({
            top: window.scrollY + rect.top,
            behavior: 'auto',
          });
        }
        
        isLockedRef.current = true;
      } else {
        isLockedRef.current = false;
        scrollAccRef.current = 0;
        return;
      }

      scrollAccRef.current += e.deltaY;

      if (e.deltaY > 0) {
        if (scrollAccRef.current >= SCROLL_THRESHOLD) {
          const next = Math.min(slides.length - 1, curInt + 1);
          scrollAccRef.current = 0;
          activeSlideRef.current = next;
          setActiveSlide(next);
        }
      } else {
        if (scrollAccRef.current <= -SCROLL_THRESHOLD) {
          const next = Math.max(0, curInt - 1);
          scrollAccRef.current = 0;
          activeSlideRef.current = next;
          setActiveSlide(next);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && Math.round(activeSlideRef.current) < slides.length - 1) {
          // Snap page to carousel section top when it enters view
          section.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
        }
      },
      { threshold: 0.95 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // SCROLL button — advance one slide
  const handleNextSlide = () => {
    const cur = Math.round(activeSlideRef.current);
    if (cur < slides.length - 1) {
      const next = cur + 1;
      activeSlideRef.current = next;
      setActiveSlide(next);
    }
  };

  const activeSlideInt = Math.min(Math.max(0, Math.round(activeSlide)), slides.length - 1);
  const progressPercent = ((activeSlideInt + 1) / slides.length) * 100;

  return (
    <div className="relative min-h-screen bg-[#3A0D0D] text-white overflow-x-hidden">

      {/* ── Hero Section ── */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{ minHeight: '100svh' }}
        aria-labelledby="budaya-heading"
      >
        <video
          ref={videoRef}
          src={budaya4kVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            // Preemptively loop 0.25 seconds before the video ends to avoid a black flash/gap
            if (v.duration && v.currentTime >= v.duration - 0.25) {
              v.currentTime = 0;
              void v.play().catch(() => {});
            }
          }}
          onEnded={(e) => {
            const v = e.currentTarget;
            v.currentTime = 0;
            void v.play().catch(() => {});
          }}
        />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />
        {/* Warm reddish-brown tint matching design reference */}
        <div className="absolute inset-0 bg-[#6B1C0C]/35 mix-blend-multiply z-10 pointer-events-none" />
        {/* Bottom fade — very low, only last strip */}
        <div
          className="absolute inset-x-0 bottom-0 z-20 pointer-events-none"
          style={{
            height: '25%',
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(58,13,13,0.40) 40%, rgba(58,13,13,0.85) 75%, #3A0D0D 100%)',
          }}
        />

        <div
          className={`relative z-30 flex flex-col items-center justify-end text-center w-full px-6 pb-20 md:pb-28 transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            heroVisible ? 'translate-y-0 opacity-100 scale-100 blur-none' : 'translate-y-10 opacity-0 scale-[0.98] blur-[3px]'
          }`}
          style={{ minHeight: '100svh' }}
        >
          <h1
            id="budaya-heading"
            className="font-cormorant font-bold uppercase leading-none tracking-[0.05em] mb-4 w-full"
            style={{ fontSize: 'clamp(28px, 4.5vw, 52px)' }}
          >
            <span className="text-white">WARISAN </span>
            <span style={{ color: '#D4A853' }}>BUKITTINGGI</span>
          </h1>

          <div
            className="mx-auto mb-5"
            style={{
              width: 'clamp(100px, 16vw, 200px)',
              height: '1.5px',
              background:
                'linear-gradient(to right, transparent, #D4A853 25%, #D4A853 75%, transparent)',
            }}
          />

          <p
            className="font-cormorant italic text-white/85 max-w-lg mx-auto leading-relaxed mb-8 w-full"
            style={{ fontSize: 'clamp(14px, 1.6vw, 17px)' }}
          >
            "Menelusuri tradisi, seni dan filsafat hidup yang telah membentuk identitas Minangkabau
            selama berabad-abad."
          </p>

          <img
            src={frameSvg}
            alt="Ornamen dekoratif"
            className="mx-auto w-auto opacity-90"
            style={{ height: 22 }}
          />
        </div>
      </section>

      {/* ── Featured Carousel Section — Full Scroll-Jacked (slides 1-8) ── */}
      <section
        ref={containerRef}
        className="relative w-full bg-[#3A0D0D] flex flex-col items-center justify-center"
        style={{ minHeight: '100svh' }}
        aria-labelledby="carousel-title-label"
      >
        <div
          ref={featureRef}
          className={`w-full max-w-[1160px] mx-auto px-6 overflow-hidden transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            featureVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-[0.98]'
          }`}
        >
          {/* ── Slide Track ── */}
          <div
            className="flex"
            style={{
              transform: `translateX(-${activeSlide * 100}%)`,
              transition: isSwipingRef.current
                ? 'none'
                : 'transform 700ms cubic-bezier(0.16,1,0.3,1)',
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {slides.map((slide, idx) => (
              <article
                key={slide.id}
                className="w-full flex-shrink-0 flex flex-col md:flex-row gap-6 md:gap-10 items-start justify-start"
                style={{ width: '100%' }}
              >
                {/* ── LEFT Image ── */}
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="w-full md:w-[695px] h-auto md:h-[521px] object-cover rounded-[24px] shadow-[0_16px_56px_rgba(0,0,0,0.45)] flex-shrink-0"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />

                {/* ── RIGHT Content ── */}
                <div className="flex-1 flex flex-col justify-start min-w-0 pt-2 gap-4">
                  <p
                    className="font-poppins uppercase tracking-[0.28em]"
                    style={{ color: '#F9CE65', fontSize: 11, fontWeight: 500 }}
                  >
                    {slide.label}
                  </p>

                  <h2
                    id={idx === activeSlideInt ? 'carousel-title-label' : undefined}
                    className="font-cormorant font-bold text-white leading-tight"
                    style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
                  >
                    {slide.title}
                  </h2>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-[2px] rounded-full" style={{ background: '#F9CE65' }} />
                    <p
                      className="font-poppins italic text-white leading-relaxed"
                      style={{ fontSize: 'clamp(13px, 1.2vw, 15px)' }}
                    >
                      {slide.lead}
                    </p>
                  </div>

                  <ul className="space-y-3.5">
                    {slide.bullets.map((detail, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <img
                          src={segitigaSvg}
                          alt=""
                          aria-hidden="true"
                          className="flex-shrink-0 mt-[4px]"
                          style={{ width: 14, height: 16 }}
                        />
                        <span
                          className="font-poppins italic text-white leading-relaxed"
                          style={{ fontSize: 'clamp(11px, 1vw, 13px)' }}
                        >
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          {/* ── Progress Bar + Controls ── */}
          <div
            className={`mx-auto mt-10 flex items-center justify-between gap-4 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              featureVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            <span
              className="font-poppins font-medium flex-shrink-0 select-none tabular-nums"
              style={{ color: '#F9CE65', fontSize: 13, letterSpacing: '0.08em' }}
            >
              0{activeSlideInt + 1}/08
            </span>

            <div className="relative h-[1.5px] flex-1 bg-white/10 rounded-full">
              <div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{
                  width: `${progressPercent}%`,
                  background: '#F9CE65',
                  transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
                  boxShadow: '0 0 8px rgba(249,206,101,0.5)',
                }}
              />
            </div>

            <button
              onClick={handleNextSlide}
              type="button"
              disabled={activeSlideInt >= slides.length - 1}
              className="font-poppins uppercase tracking-[0.22em] flex-shrink-0 cursor-pointer focus:outline-none transition-all duration-300 hover:scale-105 active:scale-95 select-none disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: '#F9CE65', fontSize: 12, fontWeight: 500 }}
              aria-label="Slide berikutnya"
            >
              {activeSlideInt < slides.length - 1 ? 'SCROLL ↓' : 'SELESAI'}
            </button>
          </div>
        </div>
      </section>


      {/* ── Panduan Budaya Grid Section ── */}
      <section
        ref={gridRef}
        className="w-full px-4 md:px-6 pt-16 pb-20 md:pt-24 md:pb-28 flex justify-center"
        aria-labelledby="budaya-panduan"
      >
        <div
          className={`w-full max-w-[1387px] bg-[#652626] rounded-[40px] md:rounded-[64px] px-4 py-8 md:px-8 md:pt-10 md:pb-8 flex flex-col justify-start transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            gridVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-[0.98]'
          }`}
        >
          {/* Guide Pill Button Container */}
          <div className="w-full max-w-[1323px] mx-auto flex flex-col items-start mb-4 md:mb-5">
            {/* Guide Pill Button */}
            <div className="inline-flex items-center gap-3.5 px-8 py-3.5 rounded-full border-[1.5px] border-[#F9CE65] text-white font-poppins font-semibold tracking-[0.2em] text-[13px] sm:text-[14px] uppercase select-none">
              <img src={mapsSvg} alt="Guide Icon" className="w-4.5 h-4.5 sm:w-5 sm:h-5 object-contain brightness-0 invert opacity-100" />
              <span className="leading-none mt-[1px]">GUIDE</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 w-full max-w-[1323px] mx-auto mb-3 md:mb-4">
            <div className="text-left">
              <h2
                id="budaya-panduan"
                className="font-corinthia font-bold leading-none inline-block border-b-2 border-[#D4A853] pb-1"
                style={{ color: '#D4A853', fontSize: 'clamp(64px, 7vw, 104px)' }}
              >
                Panduan Budaya
              </h2>
              <p
                className="font-cormorant font-medium uppercase tracking-[0.15em] mt-2.5 text-white"
                style={{ fontSize: 'clamp(20px, 2.4vw, 34px)', lineHeight: 1.2 }}
              >
                KENALI BUDAYA SEBELUM BERKUNJUNG
              </p>
            </div>
            {/* Gold line on the right side from the mockup */}
            <div className="hidden md:block w-[140px] h-[1.5px] bg-[#D4A853] mb-4 opacity-85" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1323px] mx-auto mt-0 mb-0">
            {gridItems.map((item, idx) => (
              <div key={item.title} className="flex justify-center sm:block">
                <div className="w-full max-w-[420px] sm:max-w-none">
                  <GridCard item={item} index={idx} isVisible={gridVisible} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        ref={footerRef}
        className="relative mx-auto w-full max-w-5xl px-6 pt-16 pb-32 text-center"
      >
        <div
          className={`transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            footerVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-[0.98]'
          }`}
        >
          <h2
            className="font-corinthia font-bold leading-none select-none whitespace-normal md:whitespace-nowrap overflow-visible"
            style={{ color: '#FFFFFF', fontSize: 'clamp(28px, 3.5vw, 52px)' }}
          >
            "Adat Basandi Syarak,<br className="block md:hidden" /> Syarak Basandi Kitabullah"
          </h2>
          <div
            className="mx-auto mt-5 mb-5"
            style={{ width: 64, height: '1px', background: '#D4A853', opacity: 0.55 }}
          />
          <p
            className="font-poppins italic text-white/80 leading-relaxed max-w-2xl mx-auto px-4 md:px-0"
            style={{ fontSize: 'clamp(13px, 1.4vw, 15px)' }}
          >
            Falsafah yang menjadi landasan utama kehidupan masyarakat Minangkabau. Nilai-nilai adat dijalankan selaras dengan ajaran agama, sehingga budaya dan spiritualitas berjalan berdampingan dalam kehidupan sehari-hari.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <img
              src={tigaSvg}
              alt="Ornamen Tiga 1"
              className="opacity-70"
              style={{ width: 22, height: 22 }}
            />
            <img
              src={tigaSvg}
              alt="Ornamen Tiga 2"
              className="opacity-40"
              style={{ width: 16, height: 16 }}
            />
            <img
              src={tigaSvg}
              alt="Ornamen Tiga 3"
              className="opacity-20"
              style={{ width: 11, height: 11 }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}

function GridCard({
  item,
  index,
  isVisible,
}: {
  item: { title: string; img: string; desc: string };
  index: number;
  isVisible: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className={[
        'group relative w-full overflow-hidden cursor-pointer select-none',
        'border-[1.5px] border-[#F9CE65] bg-[#2D0606]',
        'transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02]',
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-[0.97]',
        mobileOpen ? 'mobile-active' : '',
      ].join(' ')}
      style={{
        transitionDelay: `${index * 150}ms`,
        aspectRatio: '413 / 552',
        borderRadius: '5.81% 0 5.81% 0 / 4.35% 0 4.35% 0',
      }}
      onClick={() => setMobileOpen((v) => !v)}
    >
      {/* Background photo */}
      <img
        src={item.img}
        alt={item.title}
        className="absolute pointer-events-none select-none max-w-none transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        style={{
          width: '120.0%',
          height: 'auto',
          top: '-6.00%',
          left: '-9.50%',
        }}
        loading="lazy"
        draggable={false}
      />

      {/* ── Resting Gradient Overlay: matching #652626 background but transparent enough to see the photo ── */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none transition-opacity duration-500"
        style={{
          height: '42%',
          background: 'linear-gradient(to top, rgba(101, 38, 38, 0.85) 0%, rgba(101, 38, 38, 0.45) 50%, transparent 100%)',
          borderRadius: '0 0 5.81% 0 / 0 0 4.35% 0',
        }}
      />

      {/* ── Active Gradient Overlay: deeper, but still transparent to reveal photo details ── */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100 group-[.mobile-active]:opacity-100"
        style={{
          height: '56%',
          background: 'linear-gradient(to top, rgba(101, 38, 38, 0.95) 0%, rgba(101, 38, 38, 0.82) 25%, rgba(101, 38, 38, 0.4) 65%, transparent 100%)',
          borderRadius: '0 0 5.81% 0 / 0 0 4.35% 0',
        }}
      />

      {/* ── Content: Title + Gold Line + Description stacked inside one flex container ── */}
      <div className="absolute inset-x-[8%] bottom-[7%] z-10 flex flex-col items-start text-left pointer-events-none w-[84%]">
        
        {/* Title — Cormorant Garamond Bold Italic */}
        <h3
          className="font-cormorant font-bold italic text-white leading-tight"
          style={{ fontSize: 'clamp(20px, 3.2vw, 30px)' }}
        >
          {item.title}
        </h3>

        {/* Revealed Divider & Description Container */}
        <div
          className={[
            'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] w-full flex flex-col items-start',
            'max-h-0 opacity-0 overflow-hidden mt-0',
            'group-hover:max-h-[160px] group-hover:opacity-100 group-hover:mt-[3%]',
            'group-[.mobile-active]:max-h-[160px] group-[.mobile-active]:opacity-100 group-[.mobile-active]:mt-[3%]',
          ].join(' ')}
        >
          {/* Gold divider line (tight to title) */}
          <div
            className="h-[1.5px] bg-[#D4A853] w-[50%] mb-[3.5%]"
          />

          {/* Description — Poppins Regular */}
          <p
            className="font-poppins font-normal text-white/95 leading-relaxed"
            style={{ fontSize: 'clamp(11.5px, 1.4vw, 13.5px)' }}
          >
            {item.desc}
          </p>

          {/* Mobile hint */}
          <span className="md:hidden block mt-[4%] text-[9px] font-poppins text-white/30 tracking-widest uppercase">
            (Ketuk untuk tutup)
          </span>
        </div>
      </div>
    </div>
  );
}

export default BudayaPage;

