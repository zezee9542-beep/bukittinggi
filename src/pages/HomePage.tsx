import { HeroSection } from '../components/HeroSection';
import { FeatureSection } from '../components/FeatureSection';
import { EditorialIntro } from '../components/EditorialIntro';
import { ParijsSection } from '../components/ParijsSection';
import { AITravelPlannerSection } from '../components/AITravelPlannerSection';
import { HeritageSection } from '../components/HeritageSection';

export function HomePage() {
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

export default HomePage;
