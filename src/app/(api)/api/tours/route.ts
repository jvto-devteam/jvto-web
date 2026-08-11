import { prisma } from "@/lib/prisma";

export async function GET() {
  const packages = await prisma.packages.findMany({
    include: {
      package_categories: true,
      durations: true,
      start_destination: true,
      end_destination: true,
      package_prices: { where: { deleted_at: null }, include: { price_tiers: true } },
    },
    where: { is_publish: true },
    take:2,
  });
  const durations = await prisma.durations.findMany({
    orderBy: { name: "asc" },
  });
  const destinations = await prisma.destinations.findMany({
    orderBy: { name: "asc" },
    take:2,
  });
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

  return Response.json({
    packages: serializedPackages,
    durations: serializedDurations,
    destinations: serializedDestinations,
  });
}
