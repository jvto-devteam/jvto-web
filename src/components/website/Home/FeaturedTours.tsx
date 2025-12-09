import React from 'react';
import TourCard from '../Tours/TourCard';
import { FEATURED_TOURS } from '@/services/mockData';
import { ListTourPackage } from "@/types";

interface FeaturedToursProps {
  tours: ListTourPackage[];
}

const FeaturedTours = ({tours}:FeaturedToursProps) => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
             <span className="text-yellow-400">★★★★★</span>
             <span className="font-bold text-sm">Trustpilot</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-6">Tried & Trusted Adventures</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Much Better Adventures is consistently rated {`'Excellent'`} by our guests. Here are the top private volcano routes booked this season.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.slice(0,6).map((tour) => (
            <div key={tour.id} className="h-[500px]">
              <TourCard tour={tour} />
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a href="/tours" className="inline-block border-2 border-jvto-dark text-jvto-dark px-8 py-3 font-bold uppercase tracking-wide hover:bg-jvto-dark hover:text-white transition-all">
            See All Private Tours
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTours;