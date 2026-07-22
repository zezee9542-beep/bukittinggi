import { useState, useRef, useEffect, type MouseEvent as ReactMouseEvent } from 'react';
import frameSvg from '../assets/frame.webp';
import gadangSvg from '../assets/gadang.webp';
import segitigaSvg from '../assets/segitiga.webp';
import { useScrollReveal } from '../hooks/useScrollReveal';
import mapsSvg from '../assets/maps.webp';
import tigaSvg from '../assets/tiga.webp';
import budaya4kVideo from '../assets/Budaya_720p.webm';
import { BudayaSkeleton } from '../components/ui/PageSkeletons';

// Custom left/right navigation cursors shown once the intro scroll-through is complete
const PREV_SLIDE_CURSOR =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='19' fill='rgba(0,0,0,0.35)' stroke='%23F9CE65' stroke-width='1.5'/%3E%3Cpath d='M23 12l-8 8 8 8' fill='none' stroke='%23F9CE65' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\") 20 20, w-resize";
const NEXT_SLIDE_CURSOR =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='19' fill='rgba(0,0,0,0.35)' stroke='%23F9CE65' stroke-width='1.5'/%3E%3Cpath d='M17 12l8 8-8 8' fill='none' stroke='%23F9CE65' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\") 20 20, e-resize";

// Grid card images — Panduan Budaya section
import grid1 from '../assets/01.webp';
import grid2 from '../assets/02.webp';
import grid3 from '../assets/03.webp';
import grid4 from '../assets/04.webp';
import grid5 from '../assets/05.webp';
import grid6 from '../assets/06.webp';

// Carousel slide images
import rect2 from "../assets/Rectangle 1385 (2).webp";
import rect3 from "../assets/Rectangle 1385 (3).webp";
import rect4 from "../assets/Rectangle 1385 (4).webp";
import rect5 from "../assets/Rectangle 1385 (5).webp";
import rect6 from "../assets/Rectangle 1385 (6).webp";
import rect7 from "../assets/Rectangle 1385 (7).webp";
import rect8 from "../assets/Rectangle 1385 (8).webp";

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
    title: 'Silek Minang',
    img: rect6,
    lead: 'Seni bela diri tradisional Minangkabau yang mengajarkan ketangkasan, kedisiplinan, dan penghormatan terhadap adat. Silek menjadi bagian penting dalam pembentukan karakter masyarakat Minang.',
    bullets: [
      'Berawal sebagai bekal untuk menjaga diri dan melindungi nagari, sekaligus menjadi sarana pembentukan budi pekerti dan kepribadian.',
      'Gerakannya terinspirasi dari alam dan kehidupan sekitar, mengutamakan kelincahan, keseimbangan, serta kemampuan membaca situasi.',
      'Menjadi dasar berbagai kesenian Minangkabau, termasuk gerakan yang ditampilkan dalam pertunjukan Randai.',
    ],
  },
  {
    id: 7,
    label: 'TUJUAH ( 7 )',
    title: 'Merantau',
    img: rect7,
    lead: 'Tradisi yang mengajarkan keberanian untuk meninggalkan kampung halaman demi mencari ilmu, pengalaman, dan kehidupan yang lebih baik. Bagi masyarakat Minangkabau, merantau merupakan bagian dari proses pendewasaan diri.',
    bullets: [
      'Menumbuhkan kemandirian, kemampuan beradaptasi, serta semangat untuk terus belajar dari lingkungan yang baru.',
      'Berlandaskan falsafah "Alam Takambang Jadi Guru", bahwa setiap perjalanan dan pengalaman adalah sumber pembelajaran hidup',
      'Meski menempuh perjalanan jauh, para perantau tetap membawa nilai, adat, dan identitas Minangkabau ke mana pun mereka pergi.',
    ],
  },
  {
    id: 8,
    label: 'LAPAN ( 8 )',
    title: 'Baralek Adat',
    img: rect8,
    lead: 'Perayaan pernikahan adat Minangkabau yang menjadi simbol persatuan dua keluarga besar, sekaligus wujud penghormatan terhadap adat dan tradisi yang diwariskan turun-temurun.',
    bullets: [
      'Bukan sekadar pesta, tetapi sebuah peristiwa adat yang melibatkan keluarga, kaum, dan masyarakat dalam semangat kebersamaan.',
      'Dimeriahkan dengan busana adat yang megah, arak-arakan tradisional, serta berbagai prosesi yang sarat makna budaya.',
      'Sebuah warisan budaya yang menghidupkan filosofi Minang: "Barek samo dipikul, ringan samo dijinjiang" — berat sama dipikul, ringan sama dijinjiang.',
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


export function BudayaPage() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal<HTMLElement>();
  const { ref: featureRef, isVisible: featureVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal<HTMLElement>();
  const { ref: footerRef, isVisible: footerVisible } = useScrollReveal<HTMLElement>();

  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Scroll progress maps directly to a fractional horizontal slide position.
  const [activeSlide, setActiveSlide] = useState(0);
  const activeSlideRef = useRef(0);

  // Whether the user has already scrolled all the way through slides 1-8 once.
  // This enables cursor-driven navigation without disabling later wheel/touch
  // passes through the carousel in either direction.
  const [hasCompletedIntro, setHasCompletedIntro] = useState(false);
  const hasCompletedIntroRef = useRef(false);


  // Which half of the slide area the cursor is hovering (for the left/right
  // navigation cursor shown once the intro pass is complete).
  const [hoverSide, setHoverSide] = useState<'prev' | 'next' | null>(null);

  // ── Native vertical-scroll → horizontal-carousel mapping ─────────────────
  // The outer track supplies natural vertical travel; the inner scene is
  // sticky for that interval. No wheel prevention or programmatic pinning is
  // needed, so momentum, trackpads, touch, and browser navigation stay stable.
  useEffect(() => {
    const clampSlide = (v: number) => Math.max(0, Math.min(slides.length - 1, v));
    let rafId = 0;
    const section = sectionRef.current;
    if (!section) return;

    const updateFromScroll = () => {
      rafId = 0;
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, (window.scrollY - section.offsetTop) / travel));
      const nextSlide = clampSlide(progress * (slides.length - 1));
      activeSlideRef.current = nextSlide;
      setActiveSlide(nextSlide);
      const completed = progress >= 0.999;
      if (completed && !hasCompletedIntroRef.current) {
        hasCompletedIntroRef.current = true;
        setHasCompletedIntro(true);
      }
    };

    const requestUpdate = () => {
      if (!rafId) rafId = requestAnimationFrame(updateFromScroll);
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    requestUpdate();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [isLoading]);

  const activeSlideInt = Math.min(slides.length - 1, Math.round(activeSlide));
  const slideProgress  = Math.max(0, Math.min(1, activeSlide / (slides.length - 1)));
  const progressPercent = ((activeSlide + 1) / slides.length) * 100;

  const goToSlide = (next: number) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, next));
    const section = sectionRef.current;
    if (!section) return;
    const travel = Math.max(1, section.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: section.offsetTop + (clamped / (slides.length - 1)) * travel,
      behavior: 'smooth',
    });
  };

  // SCROLL button advances the native vertical track by one slide interval.
  const handleNextSlide = () => {
    if (activeSlideInt >= slides.length - 1) return;
    goToSlide(activeSlideInt + 1);
  };

  // Cursor-driven left/right navigation — only active once the intro pass is done
  const handleSlideAreaMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!hasCompletedIntro) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverSide(e.clientX - rect.left < rect.width / 2 ? 'prev' : 'next');
  };

  const handleSlideAreaMouseLeave = () => {
    if (hasCompletedIntro) setHoverSide(null);
  };

  const handleSlideAreaClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!hasCompletedIntro) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = e.clientX - rect.left < rect.width / 2;
    goToSlide(isLeftHalf ? activeSlideInt - 1 : activeSlideInt + 1);
  };

  const slideAreaCursor = !hasCompletedIntro
    ? undefined
    : hoverSide === 'prev'
      ? PREV_SLIDE_CURSOR
      : hoverSide === 'next'
        ? NEXT_SLIDE_CURSOR
        : 'default';

  if (isLoading) {
    return <BudayaSkeleton />;
  }

  return (
    <div className="relative min-h-screen bg-[#3A0D0D] text-white overflow-x-clip animate-in fade-in duration-500">
      {/* ── Hero Section ── */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{ minHeight: '90svh' }}
        aria-labelledby="budaya-heading"
      >
        <video
          ref={videoRef}
          src={budaya4kVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
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
          className={`relative z-30 flex flex-col items-center justify-center text-center w-full px-6 transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            heroVisible ? 'translate-y-0 opacity-100 scale-100 blur-none' : 'translate-y-10 opacity-0 scale-[0.98] blur-[3px]'
          }`}
          style={{ minHeight: '90svh' }}
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

      {/* ── Native vertical track with a sticky horizontal carousel ── */}
      <section
        ref={sectionRef}
        className="relative w-full bg-[#3A0D0D]"
        style={{ height: `calc(100dvh + ${(slides.length - 1) * 35}dvh)` }}
      >
        <div className="sticky top-24 h-[calc(100dvh-6rem)] overflow-hidden flex flex-col items-center justify-center">
          <div
            ref={featureRef}
            className="w-full max-w-[1240px] mx-auto px-4 md:px-6 overflow-hidden"
          >
            {/* ── Slide Viewport — locked to scroll during the intro pass, cursor-driven afterwards ── */}
            <div
              className="overflow-hidden py-2"
              style={{ cursor: slideAreaCursor }}
              onMouseMove={handleSlideAreaMouseMove}
              onMouseLeave={handleSlideAreaMouseLeave}
              onClick={handleSlideAreaClick}
            >
            <div
              className="flex"
              style={{
                transform: `translateX(-${slideProgress * 100 * (slides.length - 1)}%)`,
                transition: 'none',
                willChange: 'transform',
              }}
            >
              {slides.map((slide, idx) => (
                <article
                  key={slide.id}
                  className="w-full flex-shrink-0 flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-start justify-start px-4 md:px-12"
                  style={{ width: '100%' }}
                >
                  {/* ── LEFT Image (Static - No scroll entrance animation) ── */}
                  <img
                    src={slide.img}
                    alt={slide.title}
                    className="w-full md:w-[480px] lg:w-[540px] h-auto md:h-[420px] lg:h-[460px] object-cover rounded-[24px] shadow-[0_16px_56px_rgba(0,0,0,0.45)] flex-shrink-0"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />

                  {/* ── RIGHT Content (Animated Text & Elements on Scroll) ── */}
                  <div className={`flex-1 flex flex-col justify-start min-w-0 pt-1 md:pt-2 gap-4 md:gap-5 transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    featureVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}>
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

                    <div className="flex gap-4 my-1">
                      <div className="flex-shrink-0 w-[2px] rounded-full" style={{ background: '#F9CE65' }} />
                      <p
                        className="font-poppins italic text-white/95 leading-relaxed"
                        style={{ fontSize: 'clamp(13px, 1.2vw, 15px)' }}
                      >
                        {slide.lead}
                      </p>
                    </div>

                    <ul className="space-y-3 mt-1">
                      {slide.bullets.map((detail, i) => (
                        <li key={i} className="flex items-start gap-3.5">
                          <img
                            src={segitigaSvg}
                            alt=""
                            aria-hidden="true"
                            className="flex-shrink-0 mt-[5px]"
                            style={{ width: 13, height: 15 }}
                          />
                          <span
                            className="font-poppins italic text-white/90 leading-relaxed"
                            style={{ fontSize: 'clamp(11.5px, 1vw, 13.5px)' }}
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
            </div>

            {/* ── Progress Bar + Controls ── */}
            <div
              className={`w-full max-w-[1160px] mx-auto mt-16 md:mt-24 flex items-center gap-5 px-6 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
                    transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1)',
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
          </div>{/* end featureRef div */}
        </div>{/* end sticky scene */}
      </section>


      <section
        ref={gridRef}
        className="w-full px-4 md:px-6 pt-10 pb-14 md:pt-16 md:pb-20 flex justify-center"
        aria-labelledby="budaya-panduan"
      >
        <div
          className={`w-full max-w-[1160px] bg-[#652626] rounded-[32px] md:rounded-[48px] px-4 py-6 md:px-8 md:pt-8 md:pb-6 flex flex-col justify-start transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            gridVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-[0.98]'
          }`}
        >
          {/* Guide Pill Button Container */}
          <div className="w-full max-w-[1100px] mx-auto flex flex-col items-start mb-3 md:mb-4">
            {/* Guide Pill Button */}
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border-[1.5px] border-[#F9CE65] text-white font-poppins font-semibold tracking-[0.2em] text-[12px] sm:text-[13px] uppercase select-none">
              <img src={mapsSvg} alt="Guide Icon" className="w-4 h-4 object-contain brightness-0 invert opacity-100" />
              <span className="leading-none mt-[1px]">GUIDE</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 w-full max-w-[1100px] mx-auto mb-3 md:mb-4">
            <div className="text-left">
              <h2
                id="budaya-panduan"
                className="font-corinthia font-bold leading-none inline-block border-b-2 border-[#D4A853] pb-1"
                style={{ color: '#D4A853', fontSize: 'clamp(48px, 5.5vw, 80px)' }}
              >
                Panduan Budaya
              </h2>
              <p
                className="font-cormorant font-medium uppercase tracking-[0.15em] mt-2 text-white"
                style={{ fontSize: 'clamp(16px, 2vw, 26px)', lineHeight: 1.2 }}
              >
                KENALI BUDAYA SEBELUM BERKUNJUNG
              </p>
            </div>
            {/* Gold line on the right side from the mockup */}
            <div className="hidden md:block w-[120px] h-[1.5px] bg-[#D4A853] mb-3 opacity-85" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-[1100px] mx-auto mt-0 mb-0">
            {gridItems.map((item, idx) => (
              <div key={item.title} className="flex justify-center sm:block">
                <div className="w-full max-w-[400px] sm:max-w-none">
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
          <div className="mt-4 flex items-center justify-center">
            <img
              src={tigaSvg}
              alt="Ornaments"
              className="opacity-85"
              style={{ width: 164, height: 22 }}
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
        'transition-transform duration-500 ease-out hover:scale-[1.02]',
        mobileOpen ? 'mobile-active' : '',
      ].join(' ')}
      style={{
        aspectRatio: '413 / 552',
        borderRadius: '5.81% 0 5.81% 0 / 4.35% 0 4.35% 0',
      }}
      onClick={() => setMobileOpen((v) => !v)}
    >
      {/* Background photo (Static - No scroll entrance animation) */}
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

      {/* ── Resting Gradient Overlay: matching #8A1A1A background but transparent enough to see the photo ── */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none transition-opacity duration-500"
        style={{
          height: '42%',
          background: 'linear-gradient(to top, rgba(138, 26, 26, 0.85) 0%, rgba(138, 26, 26, 0.4) 50%, transparent 100%)',
          borderRadius: '0 0 5.81% 0 / 0 0 4.35% 0',
        }}
      />

      {/* ── Active Gradient Overlay: deeper, richer red gradient to make text stand out ── */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100 group-[.mobile-active]:opacity-100"
        style={{
          height: '56%',
          background: 'linear-gradient(to top, rgba(138, 26, 26, 0.98) 0%, rgba(125, 20, 20, 0.85) 25%, rgba(110, 15, 15, 0.4) 65%, transparent 100%)',
          borderRadius: '0 0 5.81% 0 / 0 0 4.35% 0',
        }}
      />

      {/* ── Content: Title + Gold Line + Description (Animated Text on Scroll) ── */}
      <div 
        className={`absolute inset-x-[8%] bottom-[7%] z-10 flex flex-col items-start text-left pointer-events-none w-[84%] transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
        style={{ transitionDelay: `${index * 150}ms` }}
      >
        
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
