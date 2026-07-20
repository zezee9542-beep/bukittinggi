import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { EditorialIntro } from './components/EditorialIntro';
import { HeroSection } from './components/HeroSection';
import { FeatureSection } from './components/FeatureSection';
import { Navigation } from './components/Navigation';
import { HistoryPage } from './components/HistoryPage';
import { BudayaPage } from './components/BudayaPage';
import { KulinerPage } from './components/KulinerPage';
import { TravelPlannerPage } from './components/TravelPlannerPage';
import { GameFlipPage } from './components/GameFlipPage';
import { GameMenuPage } from './components/GameMenuPage';
import { ParijsSection } from './components/ParijsSection';
import { HeritageSection } from './components/HeritageSection';
import { RancakBotWidget } from './components/RancakBotWidget';
import MascotLauncher from './components/MascotLauncher';
import { useMode } from './context/ModeContext';
import { AITravelPlannerSection } from './components/AITravelPlannerSection';
import { ProfilBukittinggiPage } from './components/ProfilBukittinggiPage';
import { PetaPage } from './components/PetaPage';
import { LandingTestPage } from './components/LandingTestPage';

// Import assets to prefetch for butter-smooth page switching (using compressed WebP)
import bggImage from './assets/bgg.webp';
import gadangImage from './assets/gadang.svg';
import jekImage from './assets/jek.webp';
import okeImage from './assets/oke.webp';
import iconPopulasi from './assets/Icon.png';
import iconKetinggian from './assets/Icon (1).png';
import iconIklim from './assets/Icon (2).png';
import iconGunung from './assets/Icon (3).png';
import iconGroup2 from './assets/Group (2).svg';
import sonBg from './assets/son.webp';
import gradientBg from './assets/14.webp';
import makanPlate from './assets/makan.webp';
import coverBg from './assets/cover.webp';
import group7 from './assets/Group 7.png';
import pringImg from './assets/pring.webp';
import piringImg from './assets/piring.webp';
import leafBig from './assets/leaf.png';
import leaf1 from './assets/leaf (1).png';
import leaf2 from './assets/leaf (2).png';
import leaf3 from './assets/leaf (3).png';
import grid1 from './assets/01.webp';
import grid2 from './assets/02.webp';
import grid3 from './assets/03.webp';
import grid4 from './assets/04.webp';
import grid5 from './assets/05.webp';
import grid6 from './assets/06.webp';
import rect2 from './assets/Rectangle 1385 (2).svg';
import rect3 from './assets/Rectangle 1385 (3).svg';
import rect4 from './assets/Rectangle 1385 (4).svg';
import rect5 from './assets/Rectangle 1385 (5).svg';
import rect6 from './assets/Rectangle 1385 (6).svg';
import rect7 from './assets/Rectangle 1385 (7).svg';
import rect8 from './assets/Rectangle 1385 (8).svg';
import minNGSrc from './assets/minNG.svg';
import sawahPng from './assets/sawah.webp';

function HomePage() {
  return (
    <>
      {/* Home wrapper — relative container for Hero + Editorial */}
      <div className="relative overflow-x-clip">
        <HeroSection />
        <FeatureSection />
        <EditorialIntro />
      </div>
      <ParijsSection />
      <AITravelPlannerSection />
      <HeritageSection />
    </>
  );
}

function App() {
  const location = useLocation();
  // Sembunyikan bot pada halaman yang memerlukan fokus penuh (game dan travel planner)
  const showRancakBot = location.pathname !== '/travel-planner'
    && location.pathname !== '/game'
    && location.pathname !== '/game/flip';
  const [isRancakBotPanelOpen, setIsRancakBotPanelOpen] = useState(false);

  const openRancakBot = () => window.dispatchEvent(new Event('open-rancak-bot'));

  useEffect(() => {
    const handleVisibility = (event: Event) => {
      const detail = (event as CustomEvent<{ open: boolean }>).detail;
      setIsRancakBotPanelOpen(Boolean(detail?.open));
    };
    window.addEventListener('rancakbot:visibility', handleVisibility);
    return () => window.removeEventListener('rancakbot:visibility', handleVisibility);
  }, []);
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitioning, setTransitioning] = useState(false);
  const isFirstMount = useRef(true);
  const { setMode } = useMode();

  // Non-blocking background prefetch for non-critical assets after initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      const assetsToPreload = [
        bggImage, gadangImage, jekImage, okeImage,
        iconPopulasi, iconKetinggian, iconIklim, iconGunung, iconGroup2,
        sonBg, gradientBg, makanPlate, coverBg, group7, pringImg, piringImg,
        leafBig, leaf1, leaf2, leaf3,
        grid1, grid2, grid3, grid4, grid5, grid6,
        rect2, rect3, rect4, rect5, rect6, rect7, rect8,
        minNGSrc, sawahPng
      ];

      assetsToPreload.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Reset to heritage mode on navigating away from home page
  useEffect(() => {
    if (location.pathname !== '/') {
      setMode('heritage');
    }
  }, [location.pathname, setMode]);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (location.pathname !== displayLocation.pathname) {
      setTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        setTransitioning(false);
      }, 300); // match page transition exit duration
      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-white">
      {location.pathname !== '/profil-bukittinggi' && <Navigation />}
      <main
        className={`overflow-x-clip w-full ${
          transitioning ? 'page-exit' : 'page-enter'
        }`}
        key={displayLocation.pathname}
      >
        <Routes location={displayLocation}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sejarah" element={<HistoryPage />} />
          <Route path="/budaya" element={<BudayaPage />} />
          <Route path="/kuliner" element={<KulinerPage />} />
          <Route path="/travel-planner" element={<TravelPlannerPage />} />
          <Route path="/profil-bukittinggi" element={<ProfilBukittinggiPage />} />
          <Route path="/peta" element={<PetaPage />} />
          {/* ── Rute Permainan ──────────────────────────────────────────── */}
          {/* /game       → Hub menu permainan (GameMenuPage)               */}
          {/* /game/flip  → Permainan kartu flip kuliner (GameFlipPage)      */}
          <Route path="/game" element={<GameMenuPage />} />
          <Route path="/game/flip" element={<GameFlipPage />} />
          
          {/* ── Rute Eksperimen Landing Page ───────────────────────────── */}
          <Route path="/landing" element={<LandingTestPage />} />
        </Routes>
      </main>
      {/* [Refactor]: Merged MascotLauncher and RancakBotWidget display logic from both branches */}
      {showRancakBot && location.pathname !== '/profil-bukittinggi' && location.pathname !== '/peta' && (
        <>
          <RancakBotWidget />
          <MascotLauncher hidden={isRancakBotPanelOpen} onClick={openRancakBot} />
        </>
      )}

    </div>
  );
}

export default App;
