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

    // --- NEW: marketing fields ---
    const perfect_for: string[] = Array.isArray(body.perfect_for)
      ? body.perfect_for.map((v: any) => String(v).trim()).filter(Boolean)
      : [];

    const highlights_bullets: string[] = Array.isArray(body.highlights_bullets)
      ? body.highlights_bullets
          .map((v: any) => String(v).trim())
          .filter(Boolean)
      : [];

    const safety_positioning: string | null =
      typeof body.safety_positioning === "string" &&
      body.safety_positioning.trim()
        ? body.safety_positioning.trim()
        : null;

    const unique_selling_points: string[] = Array.isArray(
      body.unique_selling_points
    )
      ? body.unique_selling_points
          .map((v: any) => String(v).trim())
          .filter(Boolean)
      : [];

    const includesRaw = Array.isArray(body.includes) ? body.includes : [];
    const excludesRaw = Array.isArray(body.excludes) ? body.excludes : [];

    const includeIds = includesRaw
      .map((v: any) => Number(v))
      .filter((id) => Number.isInteger(id) && id > 0)
      .map((id) => BigInt(id));

    const excludeIds = excludesRaw
      .map((v: any) => Number(v))
      .filter((id) => Number.isInteger(id) && id > 0)
      .map((id) => BigInt(id));

    const addonsRaw = Array.isArray(body.addons) ? body.addons : [];

    const addonIds = addonsRaw
      .map((v: any) => Number(v))
      .filter((id) => Number.isInteger(id) && id > 0)
      .map((id) => BigInt(id));

    const faqsRaw = Array.isArray(body.faqs) ? body.faqs : [];

    const faqIds = faqsRaw
      .map((v: any) => Number(v))
      .filter((id) => Number.isInteger(id) && id > 0)
      .map((id) => BigInt(id));
    // ASSET GALLERY
    const assetsRaw = Array.isArray(body.asset_ids) ? body.asset_ids : [];

    const assetIds = assetsRaw
      .map((v: any) => Number(v))
      .filter((id) => Number.isInteger(id) && id > 0)
      .map((id) => BigInt(id));
    let primaryAssetId: bigint | null = null;
    if (typeof body.primary_asset_id === "number") {
      const num = body.primary_asset_id;
      if (Number.isInteger(num) && num > 0) {
        const big = BigInt(num);
        // optional: pastikan dia ada di assetIds
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

    // ---- NEW: price_tiers array → package_prices nested create ----
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

        // title & activity boleh tetap, tapi sekarang akan diisi otomatis dari route jika perlu
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

    // 🔴 NEW: derive package_destinations from used routes
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

    const created = await prisma.packages.create({
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
        is_publish: true,
        perfect_for,
        highlights_bullets,
        safety_positioning,
        unique_selling_points,
        // Nested create ke package_prices
        package_prices: {
          create: priceTiersInput.map((pt) => ({
            price_tier_id: pt.price_tier_id,
            price: pt.price,
            // optional: set created_at/updated_at kalau mau
          })),
        },
        package_includes: {
          create: includeIds.map((itemId) => ({
            item_include_id: itemId,
          })),
        },

        package_excludes: {
          create: excludeIds.map((itemId) => ({
            item_exclude_id: itemId,
          })),
        },
        package_addons: {
          create: addonIds.map((addonId) => ({
            addon_id: addonId,
          })),
        },
        package_assets: {
          create: assetIds.map((assetId) => ({
            asset_id: assetId,
            is_primary: primaryAssetId != null && assetId === primaryAssetId,
          })),
        },
        package_itinerary_days: {
          create: itineraryDaysInput.map((d) => ({
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
          })),
        },
        package_destinations: {
          create: packageDestinationsInput.map((d) => ({
            destination_id: d.destination_id,
            sort_order: d.sort_order,
          })),
        },
        package_faqs: {
          create: faqIds.map((faqId) => ({
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
        id: Number(created.id),
        name: created.name,
        code: created.code,
        slug: created.slug,
        short_label: created.short_label,
        start_destination_id: created.start_destination_id
          ? Number(created.start_destination_id)
          : null,
        end_destination_id: created.end_destination_id
          ? Number(created.end_destination_id)
          : null,
        duration_id: created.duration_id ? Number(created.duration_id) : null,
        description: created.description,
        physicality: created.physicality,
        is_publish: created.is_publish ?? true,
        perfect_for: created.perfect_for ?? [],
        highlights_bullets: created.highlights_bullets ?? [],
        safety_positioning: created.safety_positioning,
        unique_selling_points: created.unique_selling_points ?? [],
        created_at: created.created_at,
        updated_at: created.updated_at,
        package_prices: created.package_prices.map((p) => ({
          id: Number(p.id),
          price: p.price,
          price_tier_id: p.price_tier_id ? Number(p.price_tier_id) : null,
        })),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/packages error:", error);
    return NextResponse.json(
      { message: "Failed to create package (server error)" },
      { status: 500 }
    );
  }
}
// PUT /api/packages/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idNum = Number(params.id);
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

    // --- NEW: marketing fields ---
    const perfect_for: string[] = Array.isArray(body.perfect_for)
      ? body.perfect_for.map((v: any) => String(v).trim()).filter(Boolean)
      : [];

    const highlights_bullets: string[] = Array.isArray(body.highlights_bullets)
      ? body.highlights_bullets
          .map((v: any) => String(v).trim())
          .filter(Boolean)
      : [];

    const safety_positioning: string | null =
      typeof body.safety_positioning === "string" &&
      body.safety_positioning.trim()
        ? body.safety_positioning.trim()
        : null;

    const unique_selling_points: string[] = Array.isArray(
      body.unique_selling_points
    )
      ? body.unique_selling_points
          .map((v: any) => String(v).trim())
          .filter(Boolean)
      : [];

    const includesRaw = Array.isArray(body.includes) ? body.includes : [];
    const excludesRaw = Array.isArray(body.excludes) ? body.excludes : [];

    const includeIds = includesRaw
      .map((v: any) => Number(v))
      .filter((id) => Number.isInteger(id) && id > 0)
      .map((id) => BigInt(id));

    const excludeIds = excludesRaw
      .map((v: any) => Number(v))
      .filter((id) => Number.isInteger(id) && id > 0)
      .map((id) => BigInt(id));

    const addonsRaw = Array.isArray(body.addons) ? body.addons : [];

    const addonIds = addonsRaw
      .map((v: any) => Number(v))
      .filter((id) => Number.isInteger(id) && id > 0)
      .map((id) => BigInt(id));
    const faqsRaw = Array.isArray(body.faqs) ? body.faqs : [];

    const faqIds = faqsRaw
      .map((v: any) => Number(v))
      .filter((id) => Number.isInteger(id) && id > 0)
      .map((id) => BigInt(id));

    // ASSET GALLERY
    const assetsRaw = Array.isArray(body.asset_ids) ? body.asset_ids : [];

    const assetIds = assetsRaw
      .map((v: any) => Number(v))
      .filter((id) => Number.isInteger(id) && id > 0)
      .map((id) => BigInt(id));

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

        // title & activity boleh tetap, tapi sekarang akan diisi otomatis dari route jika perlu
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

    // 🔴 NEW: derive package_destinations from used routes (same logic as POST)
    const routeIdsUsed = Array.from(
      new Set(
        itineraryDaysInput
          .map((d) => d.route_id)
          .filter((id): id is bigint => id !== null)
      )
    );

    let packageDestinationsInput: {
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
        // [Inference] kalau mau tetap auto publish:
        is_publish: body.is_publish === false ? false : true,
        perfect_for,
        highlights_bullets,
        safety_positioning,
        unique_selling_points,

        package_prices: {
          deleteMany: {},
          create: priceTiersInput.map((pt) => ({
            price_tier_id: pt.price_tier_id,
            price: pt.price,
          })),
        },
        package_includes: {
          deleteMany: {},
          create: includeIds.map((itemId) => ({
            item_include_id: itemId,
          })),
        },
        package_excludes: {
          deleteMany: {},
          create: excludeIds.map((itemId) => ({
            item_exclude_id: itemId,
          })),
        },
        package_addons: {
          deleteMany: {},
          create: addonIds.map((addonId) => ({
            addon_id: addonId,
          })),
        },
        package_assets: {
          deleteMany: {},
          create: assetIds.map((assetId) => ({
            asset_id: assetId,
            is_primary: primaryAssetId != null && assetId === primaryAssetId,
          })),
        },
        package_itinerary_days: {
          deleteMany: {},
          create: itineraryDaysInput.map((d) => ({
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
          })),
        },
        package_destinations: {
          deleteMany: {},
          create: packageDestinationsInput.map((d) => ({
            destination_id: d.destination_id,
            sort_order: d.sort_order,
          })),
        },
        package_faqs: {
          deleteMany: {},
          create: faqIds.map((faqId) => ({
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
        perfect_for: updated.perfect_for ?? [],
        highlights_bullets: updated.highlights_bullets ?? [],
        safety_positioning: updated.safety_positioning,
        unique_selling_points: updated.unique_selling_points ?? [],
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
