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

    // ---------- helper numeric ----------
    const patchNumberField = (field: keyof typeof data, value: unknown) => {
      if (value === undefined) return;
      if (value === null || value === "") {
        data[field] = null;
      } else {
        const n = Number(value);
        if (!Number.isNaN(n)) {
          data[field] = n;
        }
      }
    };

    // ---------- BASIC TEXT FIELDS ----------
    if (typeof body.name === "string") {
      const name = body.name.trim();
      if (name) data.name = name; // jangan overwrite dengan string kosong
    }

    if (typeof body.code === "string") {
      const v = body.code.trim();
      data.code = v || null;
    }

    if (typeof body.category === "string") {
      const v = body.category.trim();
      data.category = v || null;
    }

    if (typeof body.region === "string") {
      const v = body.region.trim();
      data.region = v || null;
    }

    if (typeof body.province === "string") {
      const v = body.province.trim();
      data.province = v || null;
    }

    if (typeof body.country === "string") {
      const v = body.country.trim();
      data.country = v || null;
    }

    if (typeof body.terrain === "string") {
      const v = body.terrain.trim();
      data.terrain = v || null;
    }

    if (typeof body.best_time_to_visit === "string") {
      const v = body.best_time_to_visit.trim();
      data.best_time_to_visit = v || null;
    }

    if (typeof body.difficulty_level === "string") {
      const v = body.difficulty_level.trim();
      data.difficulty_level = v || null;
    }

    if (typeof body.duration === "string") {
      const v = body.duration.trim();
      data.duration = v || null;
    }

    if (typeof body.weather_by_season === "string") {
      const v = body.weather_by_season.trim();
      data.weather_by_season = v || null;
    }

    if (typeof body.rainfall_intensity === "string") {
      const v = body.rainfall_intensity.trim();
      data.rainfall_intensity = v || null;
    }

    if (typeof body.temperature_range === "string") {
      const v = body.temperature_range.trim();
      data.temperature_range = v || null;
    }

    if (typeof body.trail_details === "string") {
      const v = body.trail_details.trim();
      data.trail_details = v || null;
    }

    if (typeof body.summary === "string") {
      const v = body.summary.trim();
      data.summary = v || null;
    }

    if (typeof body.description === "string") {
      const v = body.description.trim();
      data.description = v || null;
    }

    if (typeof body.highlight === "string") {
      const v = body.highlight.trim();
      data.highlight = v || null;
    }

    if (typeof body.physical_requirements === "string") {
      const v = body.physical_requirements.trim();
      data.physical_requirements = v || null;
    }

    if (typeof body.cultural_context === "string") {
      const v = body.cultural_context.trim();
      data.cultural_context = v || null;
    }

    if (typeof body.tips_for_visitors === "string") {
      const v = body.tips_for_visitors.trim();
      data.tips_for_visitors = v || null;
    }

    if (typeof body.permit_details === "string") {
      const v = body.permit_details.trim();
      data.permit_details = v || null;
    }

    if (typeof body.thumbnail_url === "string") {
      const v = body.thumbnail_url.trim();
      data.thumbnail_url = v || null;
    }

    if (typeof body.featured_image === "string") {
      const v = body.featured_image.trim();
      data.featured_image = v || null;
    }

    if (typeof body.seo_title === "string") {
      const v = body.seo_title.trim();
      data.seo_title = v || null;
    }

    if (typeof body.seo_description === "string") {
      const v = body.seo_description.trim();
      data.seo_description = v || null;
    }

    if (typeof body.slug === "string") {
      const s = body.slug.trim();
      // kalau slug kosong, dan ada name di body atau di data, generate dari situ
      if (s) {
        data.slug = s;
      } else if (data.name) {
        data.slug = slugify(data.name);
      }
      // kalau tidak, biarkan slug tidak di-set
    }

    // ---------- BOOLEAN ----------
    if (typeof body.permit_required === "boolean") {
      data.permit_required = body.permit_required;
    }

    if (typeof body.guide_required === "boolean") {
      data.guide_required = body.guide_required;
    }

    if (typeof body.published === "boolean") {
      data.published = body.published;
    }

    if (typeof body.featured === "boolean") {
      data.featured = body.featured;
    }

    // ---------- NUMERIC ----------
    patchNumberField("latitude", body.latitude);
    patchNumberField("longitude", body.longitude);
    patchNumberField("altitude", body.altitude);
    patchNumberField("area_hectares", body.area_hectares);
    patchNumberField("physical_demand", body.physical_demand);
    patchNumberField("cultural_depth", body.cultural_depth);
    patchNumberField("photo_potential", body.photo_potential);

    // ---------- STRING-ARRAY (TEXT[]) / LIST JSON ----------
    if (body.types !== undefined) {
      data.types = normalizeStringArray(body.types);
    }

    if (body.key_highlights !== undefined) {
      data.key_highlights = normalizeStringArray(body.key_highlights);
    }

    if (body.tags !== undefined) {
      data.tags = normalizeStringArray(body.tags);
    }

    if (body.local_tribes !== undefined) {
      data.local_tribes = normalizeStringArray(body.local_tribes);
    }

    // ---------- JSON FIELDS LANGSUNG ----------
    // (asumsinya body sudah kirim dalam bentuk JSON yang valid)
    if (body.required_gear !== undefined) {
      data.required_gear = body.required_gear;
    }
    if (body.main_attractions !== undefined) {
      data.main_attractions = body.main_attractions;
    }
    if (body.facilities !== undefined) {
      data.facilities = body.facilities;
    }
    if (body.safety_notes !== undefined) {
      data.safety_notes = body.safety_notes;
    }
    if (body.risk_factors !== undefined) {
      data.risk_factors = body.risk_factors;
    }
    if (body.environmental_factors !== undefined) {
      data.environmental_factors = body.environmental_factors;
    }
    if (body.emergency_contacts !== undefined) {
      data.emergency_contacts = body.emergency_contacts;
    }
    if (body.rituals_festivals !== undefined) {
      data.rituals_festivals = body.rituals_festivals;
    }

    // ---------- VALIDASI: tidak ada field ----------
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
