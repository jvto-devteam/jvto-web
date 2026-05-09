import { prisma } from "@/lib/prisma";
import { getPublicPageSnapshotUpdatedAt } from "@/lib/publicContent/pageSnapshots";

export type LastModifiedMap = Map<string, Date>;

export async function getContentPageLastModifiedMap(
  routes: string[],
  fallback: Date,
): Promise<LastModifiedMap> {
  const snapshotEntries = routes
    .map((route) => {
      const updatedAt = getPublicPageSnapshotUpdatedAt(route);
      return updatedAt ? [route, new Date(updatedAt)] : null;
    })
    .filter((entry): entry is [string, Date] => entry !== null);

  const snapshotRoutes = new Set(snapshotEntries.map(([route]) => route));
  const remainingRoutes = routes.filter((route) => !snapshotRoutes.has(route));

  if (!remainingRoutes.length) {
    return new Map(snapshotEntries);
  }

  const rows = await prisma.content_pages.findMany({
    where: {
      route: { in: remainingRoutes },
      lang: "en",
      is_active: true,
    },
    select: {
      route: true,
      updated_at: true,
      created_at: true,
    },
  });

  return new Map(
    [
      ...snapshotEntries,
      ...rows.map((row) => [
        row.route,
        row.updated_at ?? row.created_at ?? fallback,
      ] as [string, Date]),
    ],
  );
}

export function getLastModified(
  map: LastModifiedMap,
  route: string,
  fallback: Date,
): Date {
  return map.get(route) ?? fallback;
}
