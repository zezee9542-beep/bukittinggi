import { useState } from 'react';
import { EditorialIntro } from './components/EditorialIntro';
import { HeroSection } from './components/HeroSection';
import { Navigation } from './components/Navigation';
import { HistoryPage } from './components/HistoryPage';
import { BudayaPage } from './components/BudayaPage';
import { ParijsSection } from './components/ParijsSection';
import { HeritageSection } from './components/HeritageSection';
import menaraSvg from './assets/menara.webp';

type Page = 'home' | 'history' | 'budaya';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-white">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="transition-all duration-500 overflow-x-hidden w-full">
        {currentPage === 'home' ? (
          <>
            {/* Home wrapper — relative container for Hero + Editorial */}
            <div className="relative overflow-x-hidden">



              <HeroSection />
              <EditorialIntro />
            </div>
            <ParijsSection />
            <HeritageSection />
          </>
        ) : currentPage === 'history' ? (
          <HistoryPage />
        ) : (
          <BudayaPage />
        )}
      </main>
    </div>
  );
}

export default App;
