// app/tours/page.tsx (Server Component)
import { prisma } from "@/lib/prisma";
import ToursClient from "./ToursClient";

export default async function ToursPage() {
  const packages = await prisma.packages.findMany({
    include: {
      package_categories: true,
      durations: true,
      start_destination: true,
      end_destination: true,
      package_images: {
        orderBy: { sort_order: "asc" },
        take: 1,
      },
      package_prices: { 
        include: { price_tiers: true },
        orderBy: { price: "asc" },
      },
    },
    where: { is_publish: true },
  });

  const durations = await prisma.durations.findMany({
    orderBy: { name: "asc" },
    take:6
  });

  const destinations = await prisma.destinations.findMany({
    orderBy: { name: "asc" },
  });

  // Get unique start cities from packages
  const startCities = Array.from(
    new Set(packages.map((pkg) => pkg.start_destination?.name).filter(Boolean))
  ) as string[];

  // Serialize ALL data using the same method as the working example
  const serializedPackages = JSON.parse(
    JSON.stringify(packages, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  const serializedDurations = JSON.parse(
    JSON.stringify(durations, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  const serializedDestinations = JSON.parse(
    JSON.stringify(destinations, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  return (
    <ToursClient
      packages={serializedPackages}
      durations={serializedDurations}
      destinations={serializedDestinations}
      startCities={startCities}
    />
  );
}