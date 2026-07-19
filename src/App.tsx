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
import { ParijsSection } from './components/ParijsSection';
import { HeritageSection } from './components/HeritageSection';
import { RancakBotWidget } from './components/RancakBotWidget';
import MascotLauncher from './components/MascotLauncher';
import { useMode } from './context/ModeContext';
import { AITravelPlannerSection } from './components/AITravelPlannerSection';


function HomePage() {
  return (
    <>
      {/* Home wrapper — relative container for Hero + Editorial */}
      <div className="relative overflow-x-hidden">
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
  const showRancakBot = location.pathname !== '/travel-planner' && location.pathname !== '/game';
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
      <Navigation />
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
          <Route path="/game" element={<GameFlipPage />} />
        </Routes>
      </main>
      {showRancakBot && (
        <>
          <RancakBotWidget />
          <MascotLauncher hidden={isRancakBotPanelOpen} onClick={openRancakBot} />
        </>
      )}
    </div>
  );
}

export default App;
