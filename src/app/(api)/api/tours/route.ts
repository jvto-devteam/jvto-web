// Migrated 2026-08-18: was a raw Prisma dump with a hardcoded `take: 2` limit on both
// packages and destinations (no internal caller found — looked like a debug/dev leftover,
// not a real production contract). Now sources all 17 packages + 5 destinations from
// ekosistem, no artificial limit.
import { getEcosystemPackagesList } from "@/lib/ecosystemContent/tourPackageDetail";
import {
  getEcosystemDestinationDetail,
  getEcosystemDestinationRoutes,
} from "@/lib/ecosystemContent/destinationDetail";

export async function GET() {
  const [packages, destinationRoutes] = await Promise.all([
    getEcosystemPackagesList(),
    getEcosystemDestinationRoutes(),
  ]);

  const destinations = (
    await Promise.all(
      destinationRoutes.map((r) => getEcosystemDestinationDetail(r.slug)),
    )
  ).filter(Boolean);

  const durations = Array.from(
    new Map(
      packages.map((p) => [
        `${p.duration.day}D${p.duration.night}N`,
        { day: p.duration.day, night: p.duration.night, name: `${p.duration.day}D${p.duration.night}N` },
      ]),
    ).values(),
  );

  return Response.json({ packages, durations, destinations });
}
