// src/app/(api)/api/packages/web/route.ts
// Refactored 2026-04-29: list transform + filter logic moved to src/lib/packages/getWebPackagesList.ts.
// Server Components (tour hub pages) call the helper directly; this route still serves external clients.
import { NextRequest, NextResponse } from "next/server";
import { MOCK_PACKAGES } from "@/data/mockData";
import { getWebPackagesList } from "@/lib/packages/getWebPackagesList";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit")?.trim() || undefined;
  const fromIdParam = searchParams.get("from")?.trim() || undefined;
  const durationIdParam = searchParams.get("duration")?.trim() || undefined;
  const categoryIdParam = searchParams.get("category")?.trim() || undefined;

  const fromId =
    fromIdParam && !isNaN(Number(fromIdParam))
      ? Number(fromIdParam)
      : undefined;
  const durationId =
    durationIdParam && !isNaN(Number(durationIdParam))
      ? Number(durationIdParam)
      : undefined;
  const categoryId =
    categoryIdParam && !isNaN(Number(categoryIdParam))
      ? Number(categoryIdParam)
      : undefined;
  const limit =
    limitParam && !isNaN(Number(limitParam)) ? Number(limitParam) : undefined;

  if (process.env.NEXT_PUBLIC_IS_FIREBASE === "true") {
    let filteredPackages = [...MOCK_PACKAGES];

    if (fromId !== undefined) {
      if (fromId === 4) {
        filteredPackages = filteredPackages.filter(
          (p) => p.startDestination === "Surabaya",
        );
      } else if (fromId === 3) {
        filteredPackages = filteredPackages.filter(
          (p) => p.startDestination === "Bali",
        );
      }
    }

    if (durationId !== undefined) {
      const durationMap: Record<number, number> = {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
      };
      const expectedDays = durationMap[durationId];
      if (expectedDays) {
        filteredPackages = filteredPackages.filter(
          (p) => p.duration.day === expectedDays,
        );
      }
    }

    if (limit !== undefined) {
      filteredPackages = filteredPackages.slice(0, limit);
    }

    return NextResponse.json(filteredPackages, { status: 200 });
  }

  try {
    const payload = await getWebPackagesList({
      fromId,
      durationId,
      categoryId,
      limit,
    });

    if (!payload.length) {
      return NextResponse.json(
        { message: "Paket tidak ditemukan atau belum dipublikasikan" },
        { status: 404 },
      );
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("GET /api/packages/web error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil paket" },
      { status: 500 },
    );
  }
}
