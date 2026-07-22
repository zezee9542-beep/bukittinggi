import { HeroSection } from '../components/HeroSection';
import { FeatureSection } from '../components/FeatureSection';
import { ParijsSection } from '../components/ParijsSection';
import { AITravelPlannerSection } from '../components/AITravelPlannerSection';
import { BukittinggiMapSection } from '../components/BukittinggiMapSection';
import { AITravelPlannerPromoCard } from '../components/AITravelPlannerPromoCard';
import { HeritageSection } from '../components/HeritageSection';
import { ScrollSection } from '../components/ScrollSection';

export function HomePage() {
  return (
    <div className="relative overflow-x-hidden w-full">
      {/* Hero Section */}
      <HeroSection />

      {/* Feature Section */}
      <ScrollSection>
        <FeatureSection />
      </ScrollSection>

      {/* Parijs Section */}
      <ScrollSection>
        <ParijsSection />
      </ScrollSection>

      {/* AI Travel Planner Section */}
      <AITravelPlannerSection />

      {/* Bukittinggi Map Section */}
      <BukittinggiMapSection />

      {/* AI Travel Planner Promo Card */}
      <AITravelPlannerPromoCard />

      {/* Heritage Section */}
      <HeritageSection />
    </div>
  );
}

export default HomePage;
