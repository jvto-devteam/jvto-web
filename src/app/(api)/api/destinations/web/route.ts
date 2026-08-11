// app/api/destinations/web/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_DESTINATIONS } from "@/data/mockData";
import { getPublicDestinationList } from "@/lib/publicContent/destinationListSnapshot";

// ─── Serializer ───────────────────────────────────────────────────────────────

function serializeDestination(dest: any) {
  // Gunakan relasi yang sama persis dengan versi original
  const primaryAsset =
    (dest.destination_assets ?? []).find(
      (da: any) => da.asset?.type === "image" && da.type === "primary",
    )?.asset ?? null;

  const safeJson = (val: any, fallback: any = []) => {
    if (!val) return fallback;
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return fallback;
      }
    }
    return val;
  };

  return {
    // Core
    id: Number(dest.id),
    name: dest.name,
    slug: dest.slug,
    short_slug: dest.short_slug ?? null,
    featured: dest.featured ?? false,

    // Banner — sama persis dengan versi original
    banner: {
      url: primaryAsset?.url ?? "",
      alt: primaryAsset?.description ?? dest.name,
    },

    // Content
    summary: dest.summary ?? null,
    highlight: dest.highlight ?? null,
    description: dest.description ?? null,

    // Geo
    geo: {
      altitude: dest.altitude ?? null,
    },

    // Key info
    keyInfo: {
      difficulty_level: dest.difficulty_level ?? null,
      temperature_range: dest.temperature_range ?? null,
      best_time_to_visit: dest.best_time_to_visit ?? null,
      permit_required: dest.permit_required ?? false,
      permit_details: dest.permit_details ?? null,
      physical_requirements: dest.physical_requirements ?? null,
    },

    // Rich content
    main_attractions: safeJson(dest.main_attractions),

    // SEO
    seo: {
      title: dest.seo_title ?? null,
      description: dest.seo_description ?? null,
    },

    // Taxonomy
    tags: dest.tags ?? [],

    // Schema.org JSON-LD lengkap dari DB — tinggal inject ke @graph
    schema_json: dest.schema_json ?? null,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseLimit(raw: string | null): number | undefined {
  if (!raw) return undefined;
  const n = Number(raw.trim());
  return isNaN(n) || n <= 0 ? undefined : n;
}

// ─── GET Handler ──────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseLimit(searchParams.get("limit"));
  const featured = searchParams.get("featured") === "true";

  // Mock mode
  if (process.env.NEXT_PUBLIC_IS_FIREBASE === "true") {
    const data = limit
      ? MOCK_DESTINATIONS.slice(0, limit)
      : [...MOCK_DESTINATIONS];
    return NextResponse.json(data, { status: 200 });
  }

  if (process.env.PUBLIC_CONTENT_USE_SNAPSHOT_LISTS !== "false") {
    const data = getPublicDestinationList({ featured, limit });
    return NextResponse.json(data, { status: 200 });
  }

  try {
    const destinations = await prisma.destinations.findMany({
      where: {
        published: true,
        deleted_at: null,
        id: { notIn: [3, 4] },
        ...(featured && { featured: true }),
      },
      select: {
        // Core
        id: true,
        name: true,
        slug: true,
        short_slug: true,
        featured: true,

        // Content
        summary: true,
        highlight: true,
        description: true,

        // Geo
        altitude: true,

        // Key info
        difficulty_level: true,
        temperature_range: true,
        best_time_to_visit: true,
        permit_required: true,
        permit_details: true,
        physical_requirements: true,

        // Rich content
        main_attractions: true,

        // SEO
        seo_title: true,
        seo_description: true,

        // Taxonomy
        tags: true,

        // Schema.org JSON-LD lengkap per destination
        schema_json: true,

        // Banner — relasi yang sama dengan versi original
        destination_assets: {
          where: { asset: { type: "image" } },
          include: { asset: true },
        },
      },
      orderBy: { id: "asc" },
      ...(limit !== undefined && { take: limit }),
    });

    const payload = destinations.map(serializeDestination);
    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    // Detail error di log agar mudah debug
    console.error("[/api/destinations/web] error:", error);
    return NextResponse.json(
      {
        message: "Gagal mengambil data destinasi",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
