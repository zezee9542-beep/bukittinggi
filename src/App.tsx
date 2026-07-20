import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { WordSearchGamePage } from './components/WordSearchGamePage';
import { RancakBotWidget } from './components/RancakBotWidget';
import MascotLauncher from './components/MascotLauncher';
import { useMode } from './context/ModeContext';

// Pages
import { HomePage } from './pages/HomePage';
import { HistoryPage } from './pages/HistoryPage';
import { BudayaPage } from './pages/BudayaPage';
import { KulinerPage } from './pages/KulinerPage';
import { TravelPlannerPage } from './pages/TravelPlannerPage';
import { GameFlipPage } from './pages/GameFlipPage';
import { GameMenuPage } from './components/GameMenuPage';
import { ProfilBukittinggiPage } from './pages/ProfilBukittinggiPage';
import { PetaPage } from './pages/PetaPage';
import { LandingTestPage } from './components/LandingTestPage';

function App() {
  const location = useLocation();
  const isGameplayRoute = location.pathname.startsWith('/game/');
  // Sembunyikan bot pada halaman yang memerlukan fokus penuh (active gameplay dan travel planner)
  const showRancakBot = location.pathname !== '/travel-planner' && !isGameplayRoute;
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
      {location.pathname !== '/profil-bukittinggi' && !isGameplayRoute && <Navigation />}
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
          {/* /game/word-search → Permainan Cari Kata Wisata                 */}
          <Route path="/game" element={<GameMenuPage />} />
          <Route path="/game/flip" element={<GameFlipPage />} />
          <Route path="/game/word-search" element={<WordSearchGamePage />} />
          
          {/* ── Rute Eksperimen Landing Page ───────────────────────────── */}
          <Route path="/landing" element={<LandingTestPage />} />
        </Routes>
      </main>
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
