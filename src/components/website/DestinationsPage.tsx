import React from 'react';
import Link from "next/link";
import StructuredData from './StructuredData';
import SEO from './SEO';
import { destinationsData } from '@/data/destinations';
import DestinationCard from './DestinationCard';

const DestinationsPage = () => {
  const baseUrl = 'https://javavolcano-touroperator.com';
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${baseUrl}/#/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Destinations',
        item: `${baseUrl}/#/destinations`,
      },
    ],
  };

  return (
    <>
      <SEO
        title="East Java Destinations | Bromo, Ijen & More | JVTO Tours"
        description="Explore breathtaking destinations in East Java with JVTO. Discover our expert guides for Mount Bromo, Ijen Crater, Tumpak Sewu Waterfall, and more."
      />
      <div className="bg-background-light dark:bg-ink-primary pt-20">
        <StructuredData data={breadcrumbSchema} />
        <header className="relative py-20 md:py-32 bg-ink-primary text-white text-center">
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