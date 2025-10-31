import { prisma } from "@/lib/prisma";

export default async function ToursPage() {
  const packages = await prisma.packages.findMany({
    include: {
      package_categories: true,
      durations: true,
      start_destination: true,
      end_destination: true,
      package_images: true,
      package_prices: { include: { price_tiers: true } },
    },
    where: { is_publish: true },
  });
  const durations = await prisma.durations.findMany({
    orderBy: { name: "asc" },
  });
  const destinations = await prisma.destinations.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Tours</h1>

      {packages.length === 0 ? (
        <p>No packages found.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {packages.map((pkg) => (
            <li
              key={pkg.id}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold mb-2">{pkg.name}</h2>
              <p className="text-sm text-gray-600">
                Category: {pkg.package_categories?.name || "-"}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                Duration: {pkg.durations?.name || "-"}
              </p>

              <div className="flex gap-3">
                {/* Link to view API */}
                <a
                  href={`api/product/${pkg.slug}`}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  View Product JSON
                </a>
                <a
                  href={`api/trip/${pkg.slug}`}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  View Trip JSON
                </a>

                {/* Link to download product JSON */}
                <a
                  href={`api/product/${pkg.slug}?download=true`}
                  className="text-green-600 hover:underline"
                >
                  Download Product JSON
                </a>

                {/* Link to download trip JSON */}
                <a
                  href={`api/trip/${pkg.slug}?download=true`}
                  className="text-green-600 hover:underline"
                >
                  Download Trip JSON
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
