// app/api/destinations/web/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_DESTINATION_DETAILS } from "@/data/mockData";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // ── Mock mode ──────────────────────────────────────────────────────────
    if (process.env.NEXT_PUBLIC_IS_FIREBASE === "true") {
      const mock = MOCK_DESTINATION_DETAILS.find((d) => d.slug === slug);
      if (!mock)
        return NextResponse.json(
          { message: "Destinasi tidak ditemukan (Mock)" },
          { status: 404 },
        );
      return NextResponse.json(mock, { status: 200 });
    }

    // ── DB query ───────────────────────────────────────────────────────────
    const dest = await prisma.destinations.findFirst({
      where: {
        slug,
        published: true,
        deleted_at: null,
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
        cultural_context: true,
        tips_for_visitors: true,

        // Geo
        latitude: true,
        longitude: true,
        altitude: true,
        region: true,
        province: true,
        country: true,

        // Key info
        difficulty_level: true,
        temperature_range: true,
        best_time_to_visit: true,
        permit_required: true,
        permit_details: true,
        guide_required: true,
        physical_requirements: true,

        // Rich content (JSONB)
        main_attractions: true,
        key_highlights: true,
        required_gear: true,
        facilities: true,
        safety_notes: true,
        risk_factors: true,
        environmental_factors: true,
        emergency_contacts: true,
        rituals_festivals: true,

        // SEO
        seo_title: true,
        seo_description: true,

        // Taxonomy
        tags: true,
        types: true,
        local_tribes: true,

        // Schema.org JSON-LD — complete, stored per destination
        schema_json: true,

        // Timestamps
        created_at: true,
        updated_at: true,

        // Banner via destination_assets
        destination_assets: {
          where: { asset: { type: "image" } },
          include: { asset: true },
        },
      },
    });

    if (!dest) {
      return NextResponse.json(
        { message: "Destinasi tidak ditemukan atau belum dipublikasikan" },
        { status: 404 },
      );
    }

    // ── Serialize ──────────────────────────────────────────────────────────
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

    const payload = {
      id: Number(dest.id),
      name: dest.name,
      slug: dest.slug,
      short_slug: dest.short_slug ?? null,
      featured: dest.featured ?? false,

      banner: {
        url: primaryAsset?.url ?? "",
        alt: primaryAsset?.description ?? dest.name,
      },

      summary: dest.summary ?? null,
      highlight: dest.highlight ?? null,
      description: dest.description ?? null,
      cultural_context: dest.cultural_context ?? null,
      tips_for_visitors: dest.tips_for_visitors ?? null,

      geo: {
        latitude: dest.latitude ? Number(dest.latitude) : null,
        longitude: dest.longitude ? Number(dest.longitude) : null,
        altitude: dest.altitude ?? null,
        region: dest.region ?? null,
        province: dest.province ?? null,
        country: dest.country ?? "Indonesia",
      },

      keyInfo: {
        difficulty_level: dest.difficulty_level ?? null,
        temperature_range: dest.temperature_range ?? null,
        best_time_to_visit: dest.best_time_to_visit ?? null,
        permit_required: dest.permit_required ?? false,
        permit_details: dest.permit_details ?? null,
        guide_required: dest.guide_required ?? false,
        physical_requirements: dest.physical_requirements ?? null,
      },

      main_attractions: safeJson(dest.main_attractions),
      key_highlights: safeJson(dest.key_highlights),
      required_gear: safeJson(dest.required_gear),
      facilities: safeJson(dest.facilities),
      safety_notes: safeJson(dest.safety_notes),
      risk_factors: safeJson(dest.risk_factors),
      environmental_factors: safeJson(dest.environmental_factors),
      emergency_contacts: safeJson(dest.emergency_contacts),
      rituals_festivals: safeJson(dest.rituals_festivals),

      seo: {
        title: dest.seo_title ?? null,
        description: dest.seo_description ?? null,
      },

      tags: dest.tags ?? [],
      types: safeJson(dest.types),
      local_tribes: dest.local_tribes ?? [],

      // schema_json sudah complete dari DB — @graph tanpa @context
      schema_json: dest.schema_json ?? null,

      created_at: dest.created_at?.toISOString() ?? null,
      updated_at: dest.updated_at?.toISOString() ?? null,
    };

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("[/api/destinations/web/[slug]] error:", error);
    return NextResponse.json(
      {
        message: "Gagal mengambil detail destinasi",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
