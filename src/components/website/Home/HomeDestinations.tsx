"use client";

import DestinationCard from "@/components/website/DestinationCard";
import type { Destination } from "@/interfaces";
import { useEffect, useRef, useState } from "react";

interface HomeDestinationsProps {
  destinations: Destination[];
}

const HomeDestinations: React.FC<HomeDestinationsProps> = ({
  destinations,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [shouldRenderCards, setShouldRenderCards] = useState(false);

  useEffect(() => {
    if (shouldRenderCards || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRenderCards(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [shouldRenderCards]);

  if (!destinations.length) return null;

  return (
    <div ref={sectionRef} className="bg-gray-900 md:pt-8 md:pb-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 ml-4 md:ml-0">
          <ul className="flex items-center space-x-6">
            <li className="text-white font-bold border-b-2 border-jvto-green pb-1 cursor-pointer">
              DESTINATIONS
            </li>
          </ul>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {shouldRenderCards
            ? destinations.map((dest) => (
                <div key={dest.id} className="flex-shrink-0 w-56">
                  <DestinationCard isHome={true} destination={dest} />
                </div>
              ))
            : destinations.map((dest) => (
                <div
                  key={dest.id}
                  className="flex-shrink-0 w-56 aspect-[3/4] rounded-sm bg-white/10 animate-pulse"
                  aria-hidden="true"
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default HomeDestinations;
