import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Derives packageActivitySnapshots.json — a small, PII-free public projection of
 * itinerary ACTIVITY + MOVEMENT structure — from the already-published
 * packageDetailSnapshots.json. Pure transform: no DB, build-time safe, deterministic.
 *
 * Ownership boundaries (NOT emitted here):
 *   - meal_codes / hotel_label / overnight_status -> llm-wiki package-operational-days.json
 *   - cost / price / hotel rate / room type       -> new-backoffice (later)
 *
 * See src/lib/publicContent/generated/README.md.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const SOURCE_PATH = path.join(
  repoRoot,
  "src/lib/publicContent/generated/packageDetailSnapshots.json",
);
const OUTPUT_PATH = path.join(
  repoRoot,
  "src/lib/publicContent/generated/packageActivitySnapshots.json",
);

const SCHEMA_VERSION = "jvto-web-package-activity-snapshots/v1";
const SOURCE_BASIS = "packageDetailSnapshots.itineraryDays.activities";

const ITEM_KEYS = ["package_id", "slug", "day", "day_title", "activities"];
const ACTIVITY_KEYS = [
  "activity_order",
  "activity_type",
  "activity_name",
  "time_window",
  "duration_minutes",
  "from_label",
  "to_label",
  "destination_label",
  "source_basis",
];

/** Absent key OR empty string -> null. Never invent a value. */
function nz(value) {
  return value === undefined || value === null || value === "" ? null : value;
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

/** Pure: same input -> byte-identical output. No Date.now / no DB. */
function build(source) {
  const items = [];

  for (const entry of source.items ?? []) {
    const product = entry?.payload?.product ?? {};
    const packageId = nz(product.packageId);
    const slug = nz(product.slug);
    const itineraryDays = product.itineraryDays ?? [];

    for (const day of itineraryDays) {
      const activities = (day.activities ?? []).map((activity, index) => {
        const isTravel = activity.type === "TravelAction";
        return {
          activity_order: index + 1,
          activity_type: nz(activity.type),
          activity_name: nz(activity.name),
          time_window: nz(activity.timeWindow),
          duration_minutes: nz(activity.durationMinutes),
          from_label: nz(activity.fromLocation),
          to_label: nz(activity.toLocation),
          destination_label: nz(
            isTravel ? activity.destination : activity.location,
          ),
          source_basis: SOURCE_BASIS,
        };
      });

      items.push({
        package_id: packageId,
        slug,
        day: nz(day.day),
        day_title: nz(day.title),
        activities,
      });
    }
  }

  return {
    schema_version: SCHEMA_VERSION,
    generated_at: source.generatedAt ?? null,
    source: "jvto-web",
    items,
  };
}

function sameKeys(obj, expected) {
  const keys = Object.keys(obj);
  return (
    keys.length === expected.length && expected.every((k) => k in obj)
  );
}

function validate(output, source) {
  // Coverage: every source package WITH non-empty itineraryDays is represented.
  const sourceWithDays = (source.items ?? []).filter(
    (e) => (e?.payload?.product?.itineraryDays ?? []).length > 0,
  );
  const sourcePackageIds = new Set(
    sourceWithDays.map((e) => e?.payload?.product?.packageId),
  );
  const outputPackageIds = new Set(output.items.map((i) => i.package_id));
  for (const id of sourcePackageIds) {
    if (!outputPackageIds.has(id)) {
      throw new Error(`Coverage gap: source package "${id}" missing from output`);
    }
  }
  const expectedDayCount = sourceWithDays.reduce(
    (sum, e) => sum + e.payload.product.itineraryDays.length,
    0,
  );
  if (output.items.length !== expectedDayCount) {
    throw new Error(
      `Day count mismatch: output ${output.items.length} vs source ${expectedDayCount}`,
    );
  }

  // Stable key sets + contiguous 1-based activity_order per day.
  for (const item of output.items) {
    if (!sameKeys(item, ITEM_KEYS)) {
      throw new Error(
        `Unexpected item keys for ${item.slug} day ${item.day}: ${Object.keys(item).join(",")}`,
      );
    }
    item.activities.forEach((activity, index) => {
      if (!sameKeys(activity, ACTIVITY_KEYS)) {
        throw new Error(
          `Unexpected activity keys (${item.slug} d${item.day} #${index + 1}): ${Object.keys(activity).join(",")}`,
        );
      }
      if (
        !Number.isInteger(activity.activity_order) ||
        activity.activity_order !== index + 1
      ) {
        throw new Error(
          `Non-contiguous activity_order at ${item.slug} day ${item.day}: got ${activity.activity_order}, expected ${index + 1}`,
        );
      }
    });
  }

  // No cost/PII KEYS: guaranteed by the fixed key whitelist above. Belt-and-suspenders
  // VALUE scan for genuine leak signals only (email / phone / currency) — NOT generic
  // words like "hotel"/"meal" which are legitimate activity-name content.
  const serialized = JSON.stringify(output);
  const piiPatterns = [
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i, // email
    /\+62\d/, // Indonesian phone
    /wa\.me/i, // WhatsApp link
    /\bRp\s?\d/, // IDR price "Rp 1.000.000"
    /\bIDR\s?\d/i, // IDR price
  ];
  for (const pattern of piiPatterns) {
    const match = serialized.match(pattern);
    if (match) {
      throw new Error(`PII/cost leak detected (${pattern}): "${match[0]}"`);
    }
  }

  return { expectedDayCount };
}

const sourceRaw = fs.readFileSync(SOURCE_PATH, "utf8");
const source = JSON.parse(sourceRaw);

// Determinism self-check: build twice, assert byte-identical.
const output = build(source);
const outputAgain = build(source);
if (JSON.stringify(output) !== JSON.stringify(outputAgain)) {
  throw new Error("Determinism self-check failed: two builds differ");
}

validate(output, source);

writeJson(OUTPUT_PATH, output);

const packageCount = new Set(output.items.map((i) => i.package_id)).size;
const dayCount = output.items.length;
const activityCount = output.items.reduce(
  (sum, i) => sum + i.activities.length,
  0,
);

console.log(`Output:          ${OUTPUT_PATH}`);
console.log(`Schema version:  ${SCHEMA_VERSION}`);
console.log(`Generated at:    ${output.generated_at} (inherited from source)`);
console.log(`Package count:   ${packageCount}`);
console.log(`Day count:       ${dayCount}`);
console.log(`Activity count:  ${activityCount}`);
console.log(`No cost/PII fields: PASS`);
console.log(`Deterministic:     PASS`);
