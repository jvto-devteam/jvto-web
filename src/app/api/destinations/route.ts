// src/app/api/destinations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type DestinationPayload = {
  code?: string | null;
  name: string;
  thumbnail_url?: string | null;
  description?: string | null;
  weather_by_season?: string | null;
  rainfall_intensity?: string | null;
  trail_details?: string | null;
  required_gear?: string | null;
  difficulty_level?: string | null;
  environmental_factors?: string | null;
  physical_requirements?: string | null;
  main_attractions?: string | null;
  best_time_to_visit?: string | null;
  tips_for_visitors?: string | null;
  slug?: string | null;
  highlight?: string | null;

  types?: string[]; // normalized
  lat?: number | null;
  long?: number | null;
  elevation_m?: number | null;
  key_highlights?: string[];
  temperature_range?: string | null;
  terrain?: string | null;
  safety_advisory?: string[];
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
    return input
      .map((v) => String(v).trim())
      .filter((v) => v.length > 0);
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
    lat: typeof d.lat === "number" ? d.lat : d.lat == null ? null : Number(d.lat),
    long: typeof d.long === "number" ? d.long : d.long == null ? null : Number(d.long),
    elevation_m:
      typeof d.elevation_m === "number"
        ? d.elevation_m
        : d.elevation_m == null
        ? null
        : Number(d.elevation_m),

    types: Array.isArray(d.types) ? d.types : [],
    key_highlights: Array.isArray(d.key_highlights) ? d.key_highlights : [],
    safety_advisory: Array.isArray(d.safety_advisory) ? d.safety_advisory : [],

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
      orderBy: [
        { name: "asc" },
        { id: "asc" },
      ],
    });

    return NextResponse.json(
      destinations.map(serializeDestination),
      { status: 200 }
    );
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

    const thumbnail_url =
      typeof body.thumbnail_url === "string" && body.thumbnail_url.trim()
        ? body.thumbnail_url.trim()
        : null;

    const slugInput =
      typeof body.slug === "string" && body.slug.trim()
        ? body.slug.trim()
        : slugify(name);

    const payload: DestinationPayload = {
      code,
      name,
      thumbnail_url,
      description: typeof body.description === "string" ? body.description : null,
      weather_by_season:
        typeof body.weather_by_season === "string"
          ? body.weather_by_season
          : null,
      rainfall_intensity:
        typeof body.rainfall_intensity === "string"
          ? body.rainfall_intensity
          : null,
      trail_details:
        typeof body.trail_details === "string" ? body.trail_details : null,
      required_gear:
        typeof body.required_gear === "string" ? body.required_gear : null,
      difficulty_level:
        typeof body.difficulty_level === "string"
          ? body.difficulty_level
          : null,
      environmental_factors:
        typeof body.environmental_factors === "string"
          ? body.environmental_factors
          : null,
      physical_requirements:
        typeof body.physical_requirements === "string"
          ? body.physical_requirements
          : null,
      main_attractions:
        typeof body.main_attractions === "string"
          ? body.main_attractions
          : null,
      best_time_to_visit:
        typeof body.best_time_to_visit === "string"
          ? body.best_time_to_visit
          : null,
      tips_for_visitors:
        typeof body.tips_for_visitors === "string"
          ? body.tips_for_visitors
          : null,
      slug: slugInput,
      highlight:
        typeof body.highlight === "string" ? body.highlight : null,

      types: normalizeStringArray(body.types),
      key_highlights: normalizeStringArray(body.key_highlights),
      safety_advisory: normalizeStringArray(body.safety_advisory),
      temperature_range:
        typeof body.temperature_range === "string"
          ? body.temperature_range
          : null,
      terrain: typeof body.terrain === "string" ? body.terrain : null,
    };

    // numeric fields
    if (body.lat !== undefined && body.lat !== null && body.lat !== "") {
      const n = Number(body.lat);
      if (!Number.isNaN(n)) payload.lat = n;
    }

    if (body.long !== undefined && body.long !== null && body.long !== "") {
      const n = Number(body.long);
      if (!Number.isNaN(n)) payload.long = n;
    }

    if (
      body.elevation_m !== undefined &&
      body.elevation_m !== null &&
      body.elevation_m !== ""
    ) {
      const n = Number(body.elevation_m);
      if (!Number.isNaN(n)) payload.elevation_m = n;
    }

    const created = await prisma.destinations.create({
      data: {
        ...payload,
        types: payload.types ?? [],
        key_highlights: payload.key_highlights ?? [],
        safety_advisory: payload.safety_advisory ?? [],
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
