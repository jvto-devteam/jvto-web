import Hero from '@/components/website/Home/Hero';
import Features from '@/components/website/Home/Features';
import LevelSelector from '@/components/website/Home/LevelSelector';
import FeaturedTours from '@/components/website/Home/FeaturedTours';
import WhyJVTO from '@/components/website/Home/WhyJVTO';
import Testimonials from '@/components/website/Home/Testimonials';
import Destinations from '@/components/website/Home/Destinations';
import TravelGuideTeaser from '@/components/website/Home/TravelGuideTeaser';

const Home: React.FC = () => {
  return (
    <main>
      <Hero />
      <Features />
      <LevelSelector />
      <FeaturedTours />
      <WhyJVTO />
      <Testimonials />
      <Destinations />
      <TravelGuideTeaser />
    </main>
  );
};

export default Home;