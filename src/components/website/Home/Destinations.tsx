import Link from "@/components/website/AppLink";
import DestinationCard from "@/components/website/DestinationCard";
import type { Destination } from "@/interfaces";

async function getAllDestinations(): Promise<Destination[]> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const res = await fetch(`${siteUrl}/api/destinations/web?limit=4`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch all tours");
  return res.json();
}

const Destinations = async () => {
    const destinations = await getAllDestinations();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black uppercase mb-4">Volcanoes & Waterfalls</h2>
            <p className="text-gray-600 max-w-xl">
              From the fires of Ijen to the waters of Tumpak Sewu. Discover the elemental landscapes of East Java.
            </p>
          </div>
          <Link href="/destinations" className="hidden md:block font-bold border-b-2 border-jvto-green hover:text-jvto-green transition-colors">See all destinations</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {destinations.map((dest, idx) => (
            <DestinationCard key={idx} destination={dest} />
          ))}
        </div>
        
        <div className="md:hidden mt-8 text-center">
           <Link href="/destinations" className="font-bold border-b-2 border-jvto-green hover:text-jvto-green transition-colors">See all destinations</Link>
        </div>
      </div>
    </section>
  );
};

export default Destinations;
