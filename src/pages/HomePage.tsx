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
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100 blur-none' : 'opacity-0 translate-y-8 scale-[0.98] blur-[2px]'
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
