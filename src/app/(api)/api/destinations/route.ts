// src/app/api/destinations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type JsonField = any;

type DestinationPayload = {
  code?: string | null;
  name: string;

  category?: string | null;
  region?: string | null;
  province?: string | null;
  country?: string | null;

  latitude?: number | null;
  longitude?: number | null;
  altitude?: number | null;
  area_hectares?: number | null;

  terrain?: string | null;
  best_time_to_visit?: string | null;
  difficulty_level?: string | null;
  duration?: string | null;
  physical_demand?: number | null;
  cultural_depth?: number | null;
  photo_potential?: number | null;
  weather_by_season?: string | null;
  rainfall_intensity?: string | null;
  temperature_range?: string | null;
  trail_details?: string | null;

  required_gear?: JsonField;
  summary?: string | null;
  description?: string | null;
  highlight?: string | null;
  main_attractions?: JsonField;
  key_highlights?: JsonField;

  permit_required?: boolean;
  permit_details?: string | null;
  guide_required?: boolean;

  facilities?: JsonField;
  safety_notes?: JsonField;
  risk_factors?: JsonField;
  environmental_factors?: JsonField;
  emergency_contacts?: JsonField;

  physical_requirements?: string | null;
  cultural_context?: string | null;

  local_tribes?: string[];
  rituals_festivals?: JsonField;
  tips_for_visitors?: string | null;

  thumbnail_url?: string | null;
  featured_image?: string | null;
  published?: boolean;
  featured?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;

  tags?: string[];
  types?: JsonField;
  slug?: string | null;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeStringArray(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input.map((v) => String(v).trim()).filter((v) => v.length > 0);
  }
  if (typeof input === "string") {
    return input
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
  }
  return [];
}

function serializeDestination(d: any) {
  return {
    ...d,
    id: Number(d.id),

    latitude: d.latitude == null ? null : Number(d.latitude),
    longitude: d.longitude == null ? null : Number(d.longitude),
    altitude: d.altitude == null ? null : Number(d.altitude),
    area_hectares: d.area_hectares == null ? null : Number(d.area_hectares),

    physical_demand:
      d.physical_demand == null ? null : Number(d.physical_demand),
    cultural_depth: d.cultural_depth == null ? null : Number(d.cultural_depth),
    photo_potential:
      d.photo_potential == null ? null : Number(d.photo_potential),

    types: Array.isArray(d.types) ? d.types : [],
    key_highlights: Array.isArray(d.key_highlights) ? d.key_highlights : [],
    tags: Array.isArray(d.tags) ? d.tags : [],
    local_tribes: Array.isArray(d.local_tribes) ? d.local_tribes : [],

    created_at: d.created_at ? d.created_at.toISOString() : null,
    updated_at: d.updated_at ? d.updated_at.toISOString() : null,
    deleted_at: d.deleted_at ? d.deleted_at.toISOString() : null,
  };
}

// GET /api/destinations?search=ijen
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").trim();

    const where: any = {
      deleted_at: null,
    };

    if (search) {
      // simple ILIKE filtering on name/code/slug
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    const destinations = await prisma.destinations.findMany({
      where,
      orderBy: [{ name: "asc" }, { id: "asc" }],
    });

    return NextResponse.json(destinations.map(serializeDestination), {
      status: 200,
    });
  } catch (error) {
    console.error("GET /api/destinations error:", error);
    return NextResponse.json(
      { message: "Failed to fetch destinations (server error)" },
      { status: 500 }
    );
  }
}

// POST /api/destinations
export async function POST(req: NextRequest) {
  const __admin = await requireAdmin();
  if (!__admin.ok) {
    return NextResponse.json({ message: "unauthorized" }, { status: __admin.status });
  }

  try {
    const body = await req.json();

    const name = (body.name || "").trim();
    if (!name) {
      return NextResponse.json(
        { message: "Field 'name' wajib diisi" },
        { status: 400 }
      );
    }

    const code =
      typeof body.code === "string" && body.code.trim()
        ? body.code.trim()
        : null;

    const slugInput =
      typeof body.slug === "string" && body.slug.trim()
        ? body.slug.trim()
        : slugify(name);

    const thumbnail_url =
      typeof body.thumbnail_url === "string" && body.thumbnail_url.trim()
        ? body.thumbnail_url.trim()
        : null;

    const featured_image =
      typeof body.featured_image === "string" && body.featured_image.trim()
        ? body.featured_image.trim()
        : null;

    const payload: DestinationPayload = {
      code,
      name,

      category:
        typeof body.category === "string" ? body.category.trim() || null : null,
      region:
        typeof body.region === "string" ? body.region.trim() || null : null,
      province:
        typeof body.province === "string" ? body.province.trim() || null : null,
      country:
        typeof body.country === "string" ? body.country.trim() || null : null,

      terrain:
        typeof body.terrain === "string" ? body.terrain.trim() || null : null,
      best_time_to_visit:
        typeof body.best_time_to_visit === "string"
          ? body.best_time_to_visit.trim() || null
          : null,
      difficulty_level:
        typeof body.difficulty_level === "string"
          ? body.difficulty_level.trim() || null
          : null,
      duration:
        typeof body.duration === "string"
          ? body.duration.trim() || null
          : null,
      weather_by_season:
        typeof body.weather_by_season === "string"
          ? body.weather_by_season
          : null,
      rainfall_intensity:
        typeof body.rainfall_intensity === "string"
          ? body.rainfall_intensity
          : null,
      temperature_range:
        typeof body.temperature_range === "string"
          ? body.temperature_range
          : null,
      trail_details:
        typeof body.trail_details === "string" ? body.trail_details : null,

      summary: typeof body.summary === "string" ? body.summary : null,
      description:
        typeof body.description === "string" ? body.description : null,
      highlight: typeof body.highlight === "string" ? body.highlight : null,

      // JSON – pakai apa adanya kalau dikirim
      required_gear:
        body.required_gear !== undefined ? body.required_gear : undefined,
      main_attractions:
        body.main_attractions !== undefined ? body.main_attractions : undefined,
      key_highlights:
        body.key_highlights !== undefined
          ? normalizeStringArray(body.key_highlights)
          : undefined,
      facilities:
        body.facilities !== undefined ? body.facilities : undefined,
      safety_notes:
        body.safety_notes !== undefined ? body.safety_notes : undefined,
      risk_factors:
        body.risk_factors !== undefined ? body.risk_factors : undefined,
      environmental_factors:
        body.environmental_factors !== undefined
          ? body.environmental_factors
          : undefined,
      emergency_contacts:
        body.emergency_contacts !== undefined
          ? body.emergency_contacts
          : undefined,
      rituals_festivals:
        body.rituals_festivals !== undefined
          ? body.rituals_festivals
          : undefined,

      physical_requirements:
        typeof body.physical_requirements === "string"
          ? body.physical_requirements
          : null,
      cultural_context:
        typeof body.cultural_context === "string"
          ? body.cultural_context
          : null,

      // array-of-string
      local_tribes: normalizeStringArray(body.local_tribes),
      tags: normalizeStringArray(body.tags),
      types: normalizeStringArray(body.types),

      tips_for_visitors:
        typeof body.tips_for_visitors === "string"
          ? body.tips_for_visitors
          : null,

      thumbnail_url,
      featured_image,

      permit_required:
        typeof body.permit_required === "boolean"
          ? body.permit_required
          : undefined,
      guide_required:
        typeof body.guide_required === "boolean"
          ? body.guide_required
          : undefined,
      permit_details:
        typeof body.permit_details === "string"
          ? body.permit_details
          : null,

      published:
        typeof body.published === "boolean" ? body.published : undefined,
      featured:
        typeof body.featured === "boolean" ? body.featured : undefined,

      seo_title:
        typeof body.seo_title === "string" ? body.seo_title.trim() || null : null,
      seo_description:
        typeof body.seo_description === "string"
          ? body.seo_description
          : null,

      slug: slugInput,
    };

    // helper numeric (support nama baru + nama lama untuk backward compatibility)
    const numberFrom = (primary: unknown, fallback?: unknown): number | null => {
      const v = primary !== undefined ? primary : fallback;
      if (v === undefined || v === null || v === "") return null;
      const n = Number(v);
      return Number.isNaN(n) ? null : n;
    };

    // koordinat & angka
    payload.latitude = numberFrom(body.latitude, body.lat);
    payload.longitude = numberFrom(body.longitude, body.long);
    payload.altitude = numberFrom(body.altitude, body.elevation_m);
    payload.area_hectares = numberFrom(body.area_hectares);
    payload.physical_demand = numberFrom(body.physical_demand);
    payload.cultural_depth = numberFrom(body.cultural_depth);
    payload.photo_potential = numberFrom(body.photo_potential);

    const created = await prisma.destinations.create({
      data: {
        ...payload,
        // default array kalau undefined
        key_highlights: payload.key_highlights ?? [],
        tags: payload.tags ?? [],
        local_tribes: payload.local_tribes ?? [],
        types: payload.types ?? [],
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return NextResponse.json(serializeDestination(created), {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/destinations error:", error);
    return NextResponse.json(
      { message: "Failed to create destination (server error)" },
      { status: 500 }
    );
  }
}

