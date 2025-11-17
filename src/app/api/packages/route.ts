import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializePackage(pkg: any) {
  const prices = (pkg.package_prices || []).filter(
    (p: any) => typeof p.price === "number"
  );

  const minPrice =
    prices.length > 0
      ? prices.reduce(
          (min: number, p: any) => (p.price < min ? p.price : min),
          prices[0].price
        )
      : null;

  return {
    id: Number(pkg.id),
    name: pkg.name,

    // penting buat filter tab
    start_destination_id: pkg.start_destination_id
      ? Number(pkg.start_destination_id)
      : null,

    start_destination: pkg.start_destination
      ? {
          id: Number(pkg.start_destination.id),
          name: pkg.start_destination.name,
        }
      : null,

    end_destination: pkg.end_destination
      ? {
          id: Number(pkg.end_destination.id),
          name: pkg.end_destination.name,
        }
      : null,

    duration: pkg.durations
      ? {
        id: Number(pkg.durations.id),
        name: pkg.durations.name,
        day: pkg.durations.day,
        night: pkg.durations.night,
      }
      : null,

    start_from_price: minPrice,
    created_at: pkg.created_at,
    updated_at: pkg.updated_at,
  };
}

// GET /api/packages
export async function GET(_req: NextRequest) {
  try {
    const packages = await prisma.packages.findMany({
      where: {
        deleted_at: null,
        is_publish: true,
        // From Surabaya (4) + From Bali (3)
        start_destination_id: {
          in: [BigInt(3), BigInt(4)],
        },
      },
      orderBy: [
        // order by duration (day) asc
        {
          durations: {
            day: "asc",
          },
        },
        {
          created_at: "desc",
        },
      ],
      include: {
        start_destination: true,
        end_destination: true,
        durations: true,
        package_prices: true,
      },
    });

    const payload = packages.map(serializePackage);

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("GET /api/packages error:", error);
    return NextResponse.json(
      { message: "Failed to fetch packages (server error)" },
      { status: 500 }
    );
  }
}
