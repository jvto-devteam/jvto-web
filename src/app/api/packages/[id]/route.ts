// app/api/packages/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializePackageDetail(pkg: any) {
  const prices = (pkg.package_prices || []).filter(
    (p: any) => typeof p.price === "number"
  );

  const includeIds = (pkg.package_includes || [])
    .map((pi: any) =>
      pi.item_include_id != null ? Number(pi.item_include_id) : null
    )
    .filter((id: number | null) => id != null);

  const excludeIds = (pkg.package_excludes || [])
    .map((pe: any) =>
      pe.item_exclude_id != null ? Number(pe.item_exclude_id) : null
    )
    .filter((id: number | null) => id != null);

  const addonIds = (pkg.package_addons || [])
    .map((pa: any) => (pa.addon_id != null ? Number(pa.addon_id) : null))
    .filter((id: number | null) => id != null);

  const assetIds = (pkg.package_assets || [])
    .map((pa: any) => (pa.asset_id != null ? Number(pa.asset_id) : null))
    .filter((id: number | null) => id != null);

  const primaryAsset =
    (pkg.package_assets || []).find((pa: any) => pa.is_primary) || null;

  return {
    id: Number(pkg.id),
    code: pkg.code,
    slug: pkg.slug,
    name: pkg.name,
    short_label: pkg.short_label,

    start_destination_id: pkg.start_destination_id
      ? Number(pkg.start_destination_id)
      : null,
    end_destination_id: pkg.end_destination_id
      ? Number(pkg.end_destination_id)
      : null,
    duration_id: pkg.duration_id ? Number(pkg.duration_id) : null,

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

    description: pkg.description,
    physicality: pkg.physicality,
    is_publish: pkg.is_publish ?? true,

    // price tiers untuk form
    price_tiers: prices.map((p: any) => ({
      price_tier_id: p.price_tier_id ? Number(p.price_tier_id) : null,
      price: p.price,
    })),

    includes: includeIds,
    excludes: excludeIds,
    addons: addonIds,

    asset_ids: assetIds,
    primary_asset_id: primaryAsset?.asset_id
      ? Number(primaryAsset.asset_id)
      : null,

    itinerary_days: (pkg.package_itinerary_days || [])
      .sort((a: any, b: any) => a.day_no - b.day_no)
      .map((d: any) => ({
        day_no: d.day_no,
        activity_start_id: d.activity_start_id
          ? Number(d.activity_start_id)
          : null,
        activity_end_id: d.activity_end_id ? Number(d.activity_end_id) : null,
        title: d.title,
        activity: d.activity,
        hotel_id: d.hotel_id ? Number(d.hotel_id) : null,
        meal_breakfast: !!d.meal_breakfast,
        meal_lunch: !!d.meal_lunch,
        meal_dinner: !!d.meal_dinner,
      })),

    created_at: pkg.created_at,
    updated_at: pkg.updated_at,
  };
}

// GET /api/packages/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idNum = Number(params.id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const pkg = await prisma.packages.findUnique({
      where: { id: BigInt(idNum) },
      include: {
        start_destination: true,
        end_destination: true,
        durations: true,
        package_prices: true,
        package_includes: true,
        package_excludes: true,
        package_addons: true,
        package_assets: true,
        package_itinerary_days: true,
      },
    });

    if (!pkg) {
      return NextResponse.json({ message: "Package not found" }, { status: 404 });
    }

    const payload = serializePackageDetail(pkg);
    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("GET /api/packages/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch package (server error)" },
      { status: 500 }
    );
  }
}
