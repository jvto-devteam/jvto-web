import Hero from '@/components/Hero';
import FeaturedTours from '@/components/FeaturedTours';
import Newsletter from '@/components/Newsletter';

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <FeaturedTours />
      <Newsletter />
    </main>
  );
}

