import DestinationCard from "@/components/website/DestinationCard";
import type { Destination } from "@/interfaces";

async function getAllDestinations(): Promise<Destination[]> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const res = await fetch(`${siteUrl}/api/destinations/web`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch all destinations");
  return res.json();
}

const HomeDestinations: React.FC = async () => {
  const destinations = await getAllDestinations();

  return (
    <div className="bg-gray-900 md:pt-8 md:pb-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 ml-4 md:ml-0">
          <ul className="flex items-center space-x-6">
            <li className="text-white font-bold border-b-2 border-jvto-green pb-1 cursor-pointer">DESTINATIONS</li>
          </ul>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {destinations.map((dest, idx) => (
            <div key={idx} className="flex-shrink-0 w-56">
              <DestinationCard destination={dest} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeDestinations;
