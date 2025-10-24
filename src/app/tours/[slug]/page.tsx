// app/tours/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import PackageDetail from "./PackageDetail";

export default async function TourDetailPage({ params }) {
  const pkg = await prisma.packages.findFirst({
    where: { slug: params.slug },
    include: {
      order_channels:true,
      durations:true,
      start_destination: true,
      end_destination: true,      
      package_addons: { include: { addons: true } },
      package_categories: true,
      package_destinations: { include: { destinations: true } },
      package_excludes: { include: {item_excludes: true}},
      package_hotel_options: {
        orderBy:{ day_no:'asc' }, include: { hotels: true } 
      },
      package_images: true,
      package_includes: { include: {item_includes: true}},
      package_itinerary_days: {
        orderBy:{ day_no:'asc' },
        include: { package_itinerary_day_details: true },
      },
      package_prices: { include: { price_tiers: true } },
    },
  });

  if (!pkg) return <p>Package not found</p>;

  const serializedPkg = JSON.parse(
    JSON.stringify(pkg, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  return <PackageDetail pkg={serializedPkg} />;
}
