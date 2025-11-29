import React from 'react';
import { destinationsData } from '@/data/destinations';
import DestinationCard from './DestinationCard';

const DestinationsPage = () => {

  return (
    <>
      <div className="bg-background-light dark:bg-ink-primary">
        <header className="relative  py-28 md:py-48 bg-ink-primary text-white text-center">
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{backgroundImage: `url('https://images.unsplash.com/photo-1549638363-e38714de1e6e?q=80&w=1200&auto-format=fit=crop')`}}></div>
          <div className="relative container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold">Destinations</h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">Discover the breathtaking landscapes and cultural gems of East Java.</p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinationsData.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default DestinationsPage;