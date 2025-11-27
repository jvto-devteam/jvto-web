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
    .filter((id: number | null): id is number => id != null);

  const excludeIds = (pkg.package_excludes || [])
    .map((pe: any) =>
      pe.item_exclude_id != null ? Number(pe.item_exclude_id) : null
    )
    .filter((id: number | null): id is number => id != null);

  const addonIds = (pkg.package_addons || [])
    .map((pa: any) => (pa.addon_id != null ? Number(pa.addon_id) : null))
    .filter((id: number | null): id is number => id != null);

  const assetIds = (pkg.package_assets || [])
    .map((pa: any) => (pa.asset_id != null ? Number(pa.asset_id) : null))
    .filter((id: number | null): id is number => id != null);

  const primaryAsset =
    (pkg.package_assets || []).find((pa: any) => pa.is_primary) || null;

  const faqIds = (pkg.package_faqs || [])
    .map((pf: any) => (pf.faq_id != null ? Number(pf.faq_id) : null))
    .filter((id: number | null): id is number => id != null);

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

    // marketing fields
    perfect_for: Array.isArray(pkg.perfect_for) ? pkg.perfect_for : [],
    highlights_bullets: Array.isArray(pkg.highlights_bullets)
      ? pkg.highlights_bullets
      : [],
    safety_positioning: pkg.safety_positioning ?? null,
    unique_selling_points: Array.isArray(pkg.unique_selling_points)
      ? pkg.unique_selling_points
      : [],

    traveler_requirements: pkg.traveler_requirements ?? null,
    tags: Array.isArray(pkg.tags) ? pkg.tags : [],
    operational_complexity_note: pkg.operational_complexity_note ?? null,
    first_day_last_pickup_guidance: pkg.first_day_last_pickup_guidance ?? null,
    last_day_safe_flight_note: pkg.last_day_safe_flight_note ?? null,

    health_requirements: Array.isArray(pkg.health_requirements)
      ? pkg.health_requirements
      : [],
    environmental_risks: Array.isArray(pkg.environmental_risks)
      ? pkg.environmental_risks
      : [],
    safety_mitigation: Array.isArray(pkg.safety_mitigation)
      ? pkg.safety_mitigation
      : [],
    handover_notes: Array.isArray(pkg.handover_notes) ? pkg.handover_notes : [],
    emergency_protocols: Array.isArray(pkg.emergency_protocols)
      ? pkg.emergency_protocols
      : [],

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

    // untuk edit FAQ
    faqs: faqIds,

    itinerary_days: (pkg.package_itinerary_days || [])
      .sort((a: any, b: any) => a.day_no - b.day_no)
      .map((d: any) => ({
        day_no: d.day_no,
        route_id: d.route_id ? Number(d.route_id) : null,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = Number(id);

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
        package_faqs: true,
      },
    });

    if (!pkg) {
      return NextResponse.json(
        { message: "Package not found" },
        { status: 404 }
      );
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

// PUT /api/packages/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = Number(id);

    if (!Number.isInteger(idNum) || idNum <= 0) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();

    const name = (body.name || "").trim();
    if (!name) {
      return NextResponse.json(
        { message: "Field 'name' wajib diisi" },
        { status: 400 }
      );
    }

    // optional string fields
    const code =
      typeof body.code === "string" && body.code.trim()
        ? body.code.trim()
        : null;

    const slug =
      typeof body.slug === "string" && body.slug.trim()
        ? body.slug.trim()
        : null;

    const short_label =
      typeof body.short_label === "string" && body.short_label.trim()
        ? body.short_label.trim()
        : null;

    const description =
      typeof body.description === "string" && body.description.trim()
        ? body.description.trim()
        : null;

    const physicality =
      typeof body.physicality === "string" && body.physicality.trim()
        ? body.physicality.trim()
        : null;
    const traveler_requirements =
      typeof body.traveler_requirements === "string" &&
      body.traveler_requirements.trim()
        ? body.traveler_requirements.trim()
        : null;

    const tags = Array.isArray(body.tags)
      ? body.tags
          .map((v: any) => String(v).trim())
          .filter((v: string) => v.length > 0)
      : [];

    const operational_complexity_note =
      typeof body.operational_complexity_note === "string" &&
      body.operational_complexity_note.trim()
        ? body.operational_complexity_note.trim()
        : null;

    const first_day_last_pickup_guidance =
      typeof body.first_day_last_pickup_guidance === "string" &&
      body.first_day_last_pickup_guidance.trim()
        ? body.first_day_last_pickup_guidance.trim()
        : null;

    const last_day_safe_flight_note =
      typeof body.last_day_safe_flight_note === "string" &&
      body.last_day_safe_flight_note.trim()
        ? body.last_day_safe_flight_note.trim()
        : null;

    const health_requirements = Array.isArray(body.health_requirements)
      ? body.health_requirements
          .map((v: any) => String(v).trim())
          .filter((v: string) => v.length > 0)
      : [];

    const environmental_risks = Array.isArray(body.environmental_risks)
      ? body.environmental_risks
          .map((v: any) => String(v).trim())
          .filter((v: string) => v.length > 0)
      : [];

    const safety_mitigation = Array.isArray(body.safety_mitigation)
      ? body.safety_mitigation
          .map((v: any) => String(v).trim())
          .filter((v: string) => v.length > 0)
      : [];

    const handover_notes = Array.isArray(body.handover_notes)
      ? body.handover_notes
          .map((v: any) => String(v).trim())
          .filter((v: string) => v.length > 0)
      : [];

    const emergency_protocols = Array.isArray(body.emergency_protocols)
      ? body.emergency_protocols
          .map((v: any) => String(v).trim())
          .filter((v: string) => v.length > 0)
      : [];

    const perfect_for = Array.isArray(body.perfect_for)
      ? body.perfect_for
          .map((v: any) => String(v).trim())
          .filter((v: string) => v.length > 0)
      : [];

    const highlights_bullets = Array.isArray(body.highlights_bullets)
      ? body.highlights_bullets
          .map((v: any) => String(v).trim())
          .filter((v: string) => v.length > 0)
      : [];

    const safety_positioning =
      typeof body.safety_positioning === "string" &&
      body.safety_positioning.trim()
        ? body.safety_positioning.trim()
        : null;

    const unique_selling_points = Array.isArray(body.unique_selling_points)
      ? body.unique_selling_points
          .map((v: any) => String(v).trim())
          .filter((v: string) => v.length > 0)
      : [];

    // includes / excludes
    const includesRaw = Array.isArray(body.includes) ? body.includes : [];
    const excludesRaw = Array.isArray(body.excludes) ? body.excludes : [];

    const includeIds = includesRaw
      .map((v: any) => Number(v))
      .filter((id: number) => Number.isInteger(id) && id > 0)
      .map((id: number) => BigInt(id));

    const excludeIds = excludesRaw
      .map((v: any) => Number(v))
      .filter((id: number) => Number.isInteger(id) && id > 0)
      .map((id: number) => BigInt(id));

    // addons
    const addonsRaw = Array.isArray(body.addons) ? body.addons : [];
    const addonIds = addonsRaw
      .map((v: any) => Number(v))
      .filter((id: number) => Number.isInteger(id) && id > 0)
      .map((id: number) => BigInt(id));

    // assets
    const assetsRaw = Array.isArray(body.asset_ids) ? body.asset_ids : [];
    const assetIds = assetsRaw
      .map((v: any) => Number(v))
      .filter((id: number) => Number.isInteger(id) && id > 0)
      .map((id: number) => BigInt(id));

    // faqs
    const faqsRaw = Array.isArray(body.faqs) ? body.faqs : [];
    const faqIds = faqsRaw
      .map((v: any) => Number(v))
      .filter((id: number) => Number.isInteger(id) && id > 0)
      .map((id: number) => BigInt(id));

    // primary asset
    let primaryAssetId: bigint | null = null;
    if (typeof body.primary_asset_id === "number") {
      const num = body.primary_asset_id;
      if (Number.isInteger(num) && num > 0) {
        const big = BigInt(num);
        if (assetIds.includes(big)) {
          primaryAssetId = big;
        }
      }
    }

    // FK wajib
    const start_destination_id_raw = body.start_destination_id;
    const end_destination_id_raw = body.end_destination_id;
    const duration_id_raw = body.duration_id;

    if (
      typeof start_destination_id_raw !== "number" ||
      typeof end_destination_id_raw !== "number" ||
      typeof duration_id_raw !== "number"
    ) {
      return NextResponse.json(
        {
          message:
            "start_destination_id, end_destination_id, dan duration_id wajib diisi (number).",
        },
        { status: 400 }
      );
    }

    const start_destination_id = BigInt(start_destination_id_raw);
    const end_destination_id = BigInt(end_destination_id_raw);
    const duration_id = BigInt(duration_id_raw);

    // price tiers
    const rawPriceTiers = Array.isArray(body.price_tiers)
      ? body.price_tiers
      : [];

    const priceTiersInput = rawPriceTiers
      .map((item: any) => {
        const tierId = Number(item.price_tier_id);
        const price = Number(item.price);

        if (
          !Number.isFinite(tierId) ||
          tierId <= 0 ||
          !Number.isFinite(price) ||
          price <= 0
        ) {
          return null;
        }

        return {
          price_tier_id: BigInt(tierId),
          price: Math.floor(price),
        };
      })
      .filter(Boolean) as { price_tier_id: bigint; price: number }[];

    if (priceTiersInput.length === 0) {
      return NextResponse.json(
        {
          message:
            "Minimal 1 price tier valid (price_tier_id & price > 0) wajib dikirim.",
        },
        { status: 400 }
      );
    }

    // itinerary days
    const rawItineraryDays = Array.isArray(body.itinerary_days)
      ? body.itinerary_days
      : [];

    const itineraryDaysInput = rawItineraryDays
      .map((item: any) => {
        const day_no = Number(item.day_no);
        const hotel_id = item.hotel_id;
        const route_id = item.route_id;

        const dayNoValid = Number.isInteger(day_no) && day_no > 0;
        if (!dayNoValid) return null;

        const title =
          typeof item.title === "string" && item.title.trim()
            ? item.title.trim()
            : `Day ${day_no}`;

        const activity =
          typeof item.activity === "string" && item.activity.trim()
            ? item.activity.trim()
            : null;

        return {
          day_no,
          route_id: typeof route_id === "number" ? BigInt(route_id) : null,
          hotel_id: typeof hotel_id === "number" ? BigInt(hotel_id) : null,
          title,
          activity,
          meal_breakfast: !!item.meal_breakfast,
          meal_lunch: !!item.meal_lunch,
          meal_dinner: !!item.meal_dinner,
        };
      })
      .filter(Boolean) as {
      day_no: number;
      route_id: bigint | null;
      hotel_id: bigint | null;
      title: string;
      activity: string | null;
      meal_breakfast: boolean;
      meal_lunch: boolean;
      meal_dinner: boolean;
    }[];

    // derive package_destinations from used routes
    const routeIdsUsed = Array.from(
      new Set(
        itineraryDaysInput
          .map((d) => d.route_id)
          .filter((id): id is bigint => id !== null)
      )
    );

    const packageDestinationsInput: {
      destination_id: bigint;
      sort_order: number;
    }[] = [];

    if (routeIdsUsed.length > 0) {
      const routeDests = await prisma.route_destinations.findMany({
        where: {
          route_id: {
            in: routeIdsUsed,
          },
        },
        orderBy: {
          sequence: "asc",
        },
      });

      const seen = new Set<string>();
      for (const rd of routeDests) {
        const key = rd.destination_id.toString();
        if (seen.has(key)) continue;
        seen.add(key);

        packageDestinationsInput.push({
          destination_id: rd.destination_id,
          sort_order: packageDestinationsInput.length + 1,
        });
      }
    }

    const updated = await prisma.packages.update({
      where: { id: BigInt(idNum) },
      data: {
        code,
        slug,
        name,
        short_label,
        start_destination_id,
        end_destination_id,
        duration_id,
        description,
        physicality,
        is_publish: body.is_publish === false ? false : true,
        perfect_for,
        highlights_bullets,
        safety_positioning,
        unique_selling_points,

        traveler_requirements,
        tags,
        operational_complexity_note,
        first_day_last_pickup_guidance,
        last_day_safe_flight_note,
        health_requirements,
        environmental_risks,
        safety_mitigation,
        handover_notes,
        emergency_protocols,
        package_prices: {
          deleteMany: {},
          create: priceTiersInput.map(
            (pt: { price_tier_id: bigint; price: number }) => ({
              price_tier_id: pt.price_tier_id,
              price: pt.price,
            })
          ),
        },
        package_includes: {
          deleteMany: {},
          create: includeIds.map((itemId: bigint) => ({
            item_include_id: itemId,
          })),
        },
        package_excludes: {
          deleteMany: {},
          create: excludeIds.map((itemId: bigint) => ({
            item_exclude_id: itemId,
          })),
        },
        package_addons: {
          deleteMany: {},
          create: addonIds.map((addonId: bigint) => ({
            addon_id: addonId,
          })),
        },
        package_assets: {
          deleteMany: {},
          create: assetIds.map((assetId: bigint) => ({
            asset_id: assetId,
            is_primary: primaryAssetId != null && assetId === primaryAssetId,
          })),
        },
        package_itinerary_days: {
          deleteMany: {},
          create: itineraryDaysInput.map(
            (d: {
              day_no: number;
              route_id: bigint | null;
              hotel_id: bigint | null;
              title: string;
              activity: string | null;
              meal_breakfast: boolean;
              meal_lunch: boolean;
              meal_dinner: boolean;
            }) => ({
              day_no: d.day_no,
              activity_start_id: null,
              activity_end_id: null,
              route_id: d.route_id,
              title: d.title,
              activity: d.activity,
              hotel_id: d.hotel_id,
              meal_breakfast: d.meal_breakfast,
              meal_lunch: d.meal_lunch,
              meal_dinner: d.meal_dinner,
            })
          ),
        },
        package_destinations: {
          deleteMany: {},
          create: packageDestinationsInput.map(
            (d: { destination_id: bigint; sort_order: number }) => ({
              destination_id: d.destination_id,
              sort_order: d.sort_order,
            })
          ),
        },
        package_faqs: {
          deleteMany: {},
          create: faqIds.map((faqId: bigint) => ({
            faq_id: faqId,
          })),
        },
      },
      include: {
        package_prices: true,
      },
    });

    return NextResponse.json(
      {
        id: Number(updated.id),
        name: updated.name,
        code: updated.code,
        slug: updated.slug,
        short_label: updated.short_label,
        start_destination_id: updated.start_destination_id
          ? Number(updated.start_destination_id)
          : null,
        end_destination_id: updated.end_destination_id
          ? Number(updated.end_destination_id)
          : null,
        duration_id: updated.duration_id ? Number(updated.duration_id) : null,
        description: updated.description,
        physicality: updated.physicality,
        is_publish: updated.is_publish ?? true,
        created_at: updated.created_at,
        updated_at: updated.updated_at,
        package_prices: updated.package_prices.map((p) => ({
          id: Number(p.id),
          price: p.price,
          price_tier_id: p.price_tier_id ? Number(p.price_tier_id) : null,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/packages/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to update package (server error)" },
      { status: 500 }
    );
  }
}
