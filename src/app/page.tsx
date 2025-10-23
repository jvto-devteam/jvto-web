import Hero from '@/components/Hero';
import FeaturedTours from '@/components/FeaturedTours';
import Newsletter from '@/components/Newsletter';
import { prisma } from "@/lib/prisma";

export default async function Home() {
    const packages = await prisma.packages.findMany({
      include: {
        package_categories: true,
        durations: true,         
      },      
    });
  console.log(packages);
  return (
    <main className="flex flex-col">
      <Hero />
      <FeaturedTours />
      <Newsletter />
    </main>
  );
}