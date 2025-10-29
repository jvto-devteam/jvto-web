import { prisma } from "@/lib/prisma";

export default async function ToursPage() {
  const packages = await prisma.packages.findMany({
    include: {
      package_categories: true,
      durations: true,
    },
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
              <a href={`api/product/${pkg.slug}`}>
                <h2 className="text-lg font-semibold">{pkg.name}</h2>
                <p className="text-sm text-gray-600">
                  Category: {pkg.package_categories?.name || "-"}
                </p>
                <p className="text-sm text-gray-600">
                  Duration: {pkg.durations?.name || "-"}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
