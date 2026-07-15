import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { EditorialIntro } from './components/EditorialIntro';
import { HeroSection } from './components/HeroSection';
import { Navigation } from './components/Navigation';
import { HistoryPage } from './components/HistoryPage';
import { BudayaPage } from './components/BudayaPage';
import { ParijsSection } from './components/ParijsSection';
import { HeritageSection } from './components/HeritageSection';
import { RancakBotWidget } from './components/RancakBotWidget';


function HomePage() {
  return (
    <>
      {/* Home wrapper — relative container for Hero + Editorial */}
      <div className="relative overflow-x-hidden">
        <HeroSection />
        <EditorialIntro />
      </div>
      <ParijsSection />
      <HeritageSection />
    </>
  );
}

function App() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitioning, setTransitioning] = useState(false);
  const isFirstMount = useRef(true);

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
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-white">
      <Navigation />
      <main
        className={`overflow-x-hidden w-full ${
          transitioning ? 'page-exit' : 'page-enter'
        }`}
        key={displayLocation.pathname}
      >
        <Routes location={displayLocation}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sejarah" element={<HistoryPage />} />
          <Route path="/budaya" element={<BudayaPage />} />
        </Routes>
      </main>
      <RancakBotWidget />
    </div>
  );
}

export default App;
