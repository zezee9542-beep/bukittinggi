import { useState, useEffect, useRef } from 'react';
import { EditorialIntro } from './components/EditorialIntro';
import { HeroSection } from './components/HeroSection';
import { Navigation } from './components/Navigation';
import { HistoryPage } from './components/HistoryPage';
import { BudayaPage } from './components/BudayaPage';
import { ParijsSection } from './components/ParijsSection';
import { HeritageSection } from './components/HeritageSection';

type Page = 'home' | 'history' | 'budaya';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [displayPage, setDisplayPage] = useState<Page>('home');
  const [transitioning, setTransitioning] = useState(false);
  const prevPage = useRef<Page>('home');

  const handleSetPage = (page: Page) => {
    if (page === currentPage) return;
    setTransitioning(true);
    prevPage.current = currentPage;
    // After exit anim (280ms), swap content and fade in
    setTimeout(() => {
      setDisplayPage(page);
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      setTransitioning(false);
    }, 300);
  };

  // Keep displayPage in sync on first render
  useEffect(() => {
    setDisplayPage(currentPage);
  }, []);

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-white">
      <Navigation currentPage={currentPage} setCurrentPage={handleSetPage} />
      <main
        className={`overflow-x-hidden w-full ${
          transitioning ? 'page-exit' : 'page-enter'
        }`}
        key={displayPage}
      >
        {displayPage === 'home' ? (
          <>
            {/* Home wrapper — relative container for Hero + Editorial */}
            <div className="relative overflow-x-hidden">
              <HeroSection />
              <EditorialIntro />
            </div>
            <ParijsSection />
            <HeritageSection />
          </>
        ) : displayPage === 'history' ? (
          <HistoryPage />
        ) : (
          <BudayaPage />
        )}
      </main>
    </div>
  );
}

export default App;
