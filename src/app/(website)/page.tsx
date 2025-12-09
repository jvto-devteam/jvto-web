import Hero from "@/components/website/Home/Hero";
import Features from "@/components/website/Home/Features";
import LevelSelector from "@/components/website/Home/LevelSelector";
import FeaturedTours from "@/components/website/Home/FeaturedTours";
import WhyJVTO from "@/components/website/Home/WhyJVTO";
import Testimonials from "@/components/website/Home/Testimonials";
import Destinations from "@/components/website/Home/Destinations";
import TravelGuideTeaser from "@/components/website/Home/TravelGuideTeaser";
import { ListTourPackage } from "@/types";
import type { Destination } from "@/interfaces";

async function getAllDestinations(): Promise<Destination[]> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const res = await fetch(`${siteUrl}/api/destinations/web`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch all tours");
  return res.json();
}
async function getAllTours(): Promise<ListTourPackage[]> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const res = await fetch(`${siteUrl}/api/packages/web?from=4`, {
    // Tanpa ?from untuk fetch semua tours
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch all tours");
  return res.json();
}

const Home = async () => {
  const destinations = await getAllDestinations();
  const tours = await getAllTours();

  return (
    <main>
      <Hero />
      <Features />
      <LevelSelector />
      <FeaturedTours tours={tours} />
      <WhyJVTO />
      <Testimonials />
      <Destinations destinations={destinations} />
      <TravelGuideTeaser />
    </main>
  );
};

export default Home;
