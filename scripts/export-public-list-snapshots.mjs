import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "../src/generated/prisma/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const PACKAGE_OUTPUT_PATH = path.join(
  repoRoot,
  "src/lib/publicContent/generated/packageListSnapshot.json",
);
const DESTINATION_OUTPUT_PATH = path.join(
  repoRoot,
  "src/lib/publicContent/generated/destinationListSnapshot.json",
);

const prisma = new PrismaClient();

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function serializePackage(pkg) {
  const imageAssets = (pkg.package_assets ?? [])
    .filter((pa) => pa.asset?.type === "image")
    .map((pa) => ({
      url: pa.asset?.url || "",
      alt: pa.asset?.description || "",
      isPrimary: pa.is_primary === true,
    }));

  const primaryImage =
    imageAssets.find((img) => img.isPrimary) || imageAssets[0] || null;

  const validPrices = (pkg.package_prices ?? [])
    .map((p) => p.price)
    .filter((price) => typeof price === "number" && price > 0);

  const startFrom = validPrices.length > 0 ? Math.min(...validPrices) : 0;
  const excludedDestinationIds = new Set([3, 4]);

  return {
    id: Number(pkg.id),
    name: pkg.name,
    startDestination: pkg.start_destination?.name ?? null,
    endDestination: pkg.end_destination?.name ?? null,
    duration: {
      day: Number(pkg.durations?.day) || 0,
      night: Number(pkg.durations?.night) || 0,
    },
    banner: {
      url: primaryImage?.url || "/fallback-banner.jpg",
      alt: primaryImage?.alt || pkg.name || "Package banner",
    },
    keyExperiences: (pkg.package_destinations ?? [])
      .filter((pd) => !excludedDestinationIds.has(Number(pd.destination_id)))
      .map(
        (dest) => dest.destinations?.activities?.[0]?.activity_name ?? "",
      )
      .filter(Boolean),
    images: primaryImage
      ? [{ url: primaryImage.url, alt: primaryImage.alt }]
      : [{ url: "/fallback-banner.jpg", alt: pkg.name || "Package banner" }],
    startFrom,
    slug: pkg.slug || "",
    physicality: pkg.physicality || "",
    tags: Array.isArray(pkg.tags)
      ? pkg.tags.map((s) => s?.trim()).filter((s) => s && s.length > 0)
      : [],
    highlights: Array.isArray(pkg.highlights_bullets)
      ? pkg.highlights_bullets
          .map((s) => s?.trim())
          .filter((s) => s && s.length > 0)
      : [],
    snapshotMeta: {
      packageCategoryId:
        pkg.package_category_id != null ? Number(pkg.package_category_id) : null,
      startDestinationId:
        pkg.start_destination_id != null ? Number(pkg.start_destination_id) : null,
      durationId: pkg.duration_id != null ? Number(pkg.duration_id) : null,
    },
  };
}

function safeJson(val, fallback = []) {
  if (!val) return fallback;
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return val;
}

function serializeDestination(dest) {
  const primaryAsset =
    (dest.destination_assets ?? []).find(
      (da) => da.asset?.type === "image" && da.type === "primary",
    )?.asset ?? null;
  const primaryLocation = (dest.locations ?? [])[0] ?? null;

  return {
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
    geo: {
      latitude: primaryLocation?.latitude ? Number(primaryLocation.latitude) : null,
      longitude: primaryLocation?.longitude ? Number(primaryLocation.longitude) : null,
      altitude: dest.altitude ?? null,
    },
    keyInfo: {
      difficulty_level: dest.difficulty_level ?? null,
      temperature_range: dest.temperature_range ?? null,
      best_time_to_visit: dest.best_time_to_visit ?? null,
      permit_required: dest.permit_required ?? false,
      permit_details: dest.permit_details ?? null,
      physical_requirements: dest.physical_requirements ?? null,
    },
    main_attractions: safeJson(dest.main_attractions),
    key_highlights: safeJson(dest.key_highlights),
    seo: {
      title: dest.seo_title ?? null,
      description: dest.seo_description ?? null,
    },
    tags: dest.tags ?? [],
    schema_json: dest.schema_json ?? null,
  };
}

try {
  const generatedAt = new Date().toISOString();

  const packages = await prisma.packages.findMany({
    where: {
      is_publish: true,
      package_category_id: { in: [1, 2] },
    },
    include: {
      start_destination: true,
      end_destination: true,
      durations: true,
      package_prices: {
        include: { price_tiers: true },
        orderBy: { price: "asc" },
      },
      package_destinations: {
        include: {
          destinations: {
            include: { activities: true, destination_gears: true },
          },
        },
        orderBy: { sort_order: "asc" },
      },
      package_assets: { include: { asset: true } },
    },
    orderBy: { id: "asc" },
  });

  const destinations = await prisma.destinations.findMany({
    where: {
      published: true,
      deleted_at: null,
      id: { notIn: [3, 4] },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      short_slug: true,
      featured: true,
      summary: true,
      highlight: true,
      description: true,
      altitude: true,
      difficulty_level: true,
      temperature_range: true,
      best_time_to_visit: true,
      permit_required: true,
      permit_details: true,
      physical_requirements: true,
      main_attractions: true,
      key_highlights: true,
      seo_title: true,
      seo_description: true,
      tags: true,
      schema_json: true,
      destination_assets: {
        where: { asset: { type: "image" } },
        include: { asset: true },
      },
      // latitude/longitude live on `locations` now (destinations.latitude/longitude was
      // dropped as a duplicate) — the unique partial index on locations(destination_id)
      // WHERE type='destination' guarantees at most one match here.
      locations: {
        where: { type: "destination" },
        select: { latitude: true, longitude: true },
        take: 1,
      },
    },
    orderBy: { id: "asc" },
  });

  writeJson(PACKAGE_OUTPUT_PATH, {
    generatedAt,
    items: packages.map(serializePackage),
  });

  writeJson(DESTINATION_OUTPUT_PATH, {
    generatedAt,
    items: destinations.map(serializeDestination),
  });

  console.log(
    `Wrote ${packages.length} package list snapshots to ${PACKAGE_OUTPUT_PATH}`,
  );
  console.log(
    `Wrote ${destinations.length} destination list snapshots to ${DESTINATION_OUTPUT_PATH}`,
  );
} finally {
  await prisma.$disconnect();
}
