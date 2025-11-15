// src/app/api/destinations/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseId(idParam: string) {
  const n = Number(idParam);
  if (!idParam || Number.isNaN(n) || n <= 0) return null;
  return BigInt(n);
}

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

// GET /api/destinations/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseId(idParam);

  if (!id) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    const dest = await prisma.destinations.findUnique({
      where: { id },
    });

    if (!dest || dest.deleted_at) {
      return NextResponse.json(
        { message: "Destination not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeDestination(dest), { status: 200 });
  } catch (error) {
    console.error("GET /api/destinations/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch destination (server error)" },
      { status: 500 }
    );
  }
}

// PATCH /api/destinations/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseId(idParam);

  if (!id) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const data: any = {};

    if (typeof body.name === "string") {
      const name = body.name.trim();
      if (name) data.name = name;
    }

    if (typeof body.code === "string") {
      data.code = body.code.trim() || null;
    }

    if (typeof body.thumbnail_url === "string") {
      data.thumbnail_url = body.thumbnail_url.trim() || null;
    }

    if (typeof body.description === "string") {
      data.description = body.description;
    }

    if (typeof body.weather_by_season === "string") {
      data.weather_by_season = body.weather_by_season;
    }

    if (typeof body.rainfall_intensity === "string") {
      data.rainfall_intensity = body.rainfall_intensity;
    }

    if (typeof body.trail_details === "string") {
      data.trail_details = body.trail_details;
    }

    if (typeof body.required_gear === "string") {
      data.required_gear = body.required_gear;
    }

    if (typeof body.difficulty_level === "string") {
      data.difficulty_level = body.difficulty_level;
    }

    if (typeof body.environmental_factors === "string") {
      data.environmental_factors = body.environmental_factors;
    }

    if (typeof body.physical_requirements === "string") {
      data.physical_requirements = body.physical_requirements;
    }

    if (typeof body.main_attractions === "string") {
      data.main_attractions = body.main_attractions;
    }

    if (typeof body.best_time_to_visit === "string") {
      data.best_time_to_visit = body.best_time_to_visit;
    }

    if (typeof body.tips_for_visitors === "string") {
      data.tips_for_visitors = body.tips_for_visitors;
    }

    if (typeof body.highlight === "string") {
      data.highlight = body.highlight;
    }

    if (typeof body.slug === "string") {
      const s = body.slug.trim();
      data.slug = s || (data.name ? slugify(data.name) : undefined);
    }

    // numeric fields
    if (body.lat !== undefined) {
      if (body.lat === null || body.lat === "") {
        data.lat = null;
      } else {
        const n = Number(body.lat);
        if (!Number.isNaN(n)) data.lat = n;
      }
    }

    if (body.long !== undefined) {
      if (body.long === null || body.long === "") {
        data.long = null;
      } else {
        const n = Number(body.long);
        if (!Number.isNaN(n)) data.long = n;
      }
    }

    if (body.elevation_m !== undefined) {
      if (body.elevation_m === null || body.elevation_m === "") {
        data.elevation_m = null;
      } else {
        const n = Number(body.elevation_m);
        if (!Number.isNaN(n)) data.elevation_m = n;
      }
    }

    // arrays (json)
    if (body.types !== undefined) {
      data.types = normalizeStringArray(body.types);
    }
    if (body.key_highlights !== undefined) {
      data.key_highlights = normalizeStringArray(body.key_highlights);
    }
    if (body.safety_advisory !== undefined) {
      data.safety_advisory = normalizeStringArray(body.safety_advisory);
    }

    if (typeof body.temperature_range === "string") {
      data.temperature_range = body.temperature_range;
    }

    if (typeof body.terrain === "string") {
      data.terrain = body.terrain;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 }
      );
    }

    data.updated_at = new Date();

    const updated = await prisma.destinations.update({
      where: { id },
      data,
    });

    return NextResponse.json(serializeDestination(updated), { status: 200 });
  } catch (error) {
    console.error("PATCH /api/destinations/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to update destination (server error)" },
      { status: 500 }
    );
  }
}

// DELETE /api/destinations/[id]  (soft delete => set deleted_at)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseId(idParam);

  if (!id) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    const deleted = await prisma.destinations.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return NextResponse.json(
      { message: "Destination deleted", id: Number(deleted.id) },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/destinations/[id] error:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Destination not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Failed to delete destination (server error)" },
      { status: 500 }
    );
  }
}
