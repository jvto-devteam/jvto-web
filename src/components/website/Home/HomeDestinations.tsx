import DestinationCard from "@/components/website/DestinationCard";
import type { Destination } from "@/interfaces";

interface HomeDestinationsProps {
  destinations: Destination[];
}

const HomeDestinations: React.FC<HomeDestinationsProps> = ({
  destinations,
}) => {
  if (!destinations.length) return null;

  return (
    <div className="bg-gray-900 md:pt-8 md:pb-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 ml-4 md:ml-0">
          <ul className="flex items-center space-x-6">
            <li className="text-white font-bold border-b-2 border-jvto-green pb-1 cursor-pointer">
              DESTINATIONS
            </li>
          </ul>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {destinations.map((dest) => (
            <div key={dest.id} className="flex-shrink-0 w-56">
              <DestinationCard isHome={true} destination={dest} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeDestinations;
