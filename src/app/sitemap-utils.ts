import { prisma } from "@/lib/prisma";

export type LastModifiedMap = Map<string, Date>;

export async function getContentPageLastModifiedMap(
  routes: string[],
  fallback: Date,
): Promise<LastModifiedMap> {
  const rows = await prisma.content_pages.findMany({
    where: {
      route: { in: routes },
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
    rows.map((row) => [
      row.route,
      row.updated_at ?? row.created_at ?? fallback,
    ]),
  );
}

export function getLastModified(
  map: LastModifiedMap,
  route: string,
  fallback: Date,
): Date {
  return map.get(route) ?? fallback;
}
