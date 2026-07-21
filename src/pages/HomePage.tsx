import { HeroSection } from '../components/HeroSection';
import { FeatureSection } from '../components/FeatureSection';
import { ParijsSection } from '../components/ParijsSection';
import { AITravelPlannerSection } from '../components/AITravelPlannerSection';
import { BukittinggiMapSection } from '../components/BukittinggiMapSection';
import { AITravelPlannerPromoCard } from '../components/AITravelPlannerPromoCard';
import { HeritageSection } from '../components/HeritageSection';
import { useScrollReveal } from '../hooks/useScrollReveal';

function ScrollSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.08 });
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-[0.98]'
      } ${className}`}
    >
      {children}
    </div>
  );
}

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
      <ScrollSection>
        <AITravelPlannerSection />
      </ScrollSection>

      {/* Bukittinggi Map Section */}
      <ScrollSection>
        <BukittinggiMapSection />
      </ScrollSection>

      {/* AI Travel Planner Promo Card */}
      <ScrollSection>
        <AITravelPlannerPromoCard />
      </ScrollSection>

      {/* Heritage Section */}
      <ScrollSection>
        <HeritageSection />
      </ScrollSection>
    </div>
  );
}

export default HomePage;
