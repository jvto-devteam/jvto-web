import type { DestinationDetail } from "@/interfaces";
import { prisma } from "@/lib/prisma";

function replaceBigInt<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_, currentValue) =>
      typeof currentValue === "bigint" ? Number(currentValue) : currentValue,
    ),
  ) as T;
}

export async function getDestinationDetailFromDatabase(
  slug: string,
): Promise<DestinationDetail | null> {
  const destination = await prisma.destinations.findUnique({
    where: { slug },
    include: {
      destination_assets: {
        include: { asset: true },
      },
    },
  });

  if (!destination) {
    return null;
  }

  return replaceBigInt(destination) as unknown as DestinationDetail;
}
