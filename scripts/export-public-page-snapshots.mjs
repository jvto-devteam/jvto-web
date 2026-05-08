import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "../src/generated/prisma/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const OUTPUT_PATH = path.join(
  repoRoot,
  "src/lib/publicContent/generated/dbPageSnapshots.json",
);

const STATIC_DB_ROUTES = [
  "/policy",
  "/policy/privacy",
  "/policy/inclusions-exclusions",
  "/policy/booking-payment-cancellation",
  "/travel-guide",
  "/travel-guide/booking-information",
  "/travel-guide/ijen-health-screening",
  "/travel-guide/safety-on-tours",
  "/travel-guide/packing-and-fitness",
  "/travel-guide/weather-and-closures",
  "/travel-guide/police-escort-for-groups",
  "/why-jvto",
  "/why-jvto/the-jvto-difference",
  "/why-jvto/reviews",
  "/why-jvto/our-story",
  "/why-jvto/our-team",
  "/why-jvto/community-standards",
];

function normalizeJson(value) {
  return value && typeof value === "object"
    ? JSON.parse(JSON.stringify(value))
    : value;
}

const prisma = new PrismaClient();

try {
  const rows = await prisma.content_pages.findMany({
    where: {
      route: { in: STATIC_DB_ROUTES },
      lang: "en",
      is_active: true,
    },
    select: {
      route: true,
      lang: true,
      seo: true,
      content: true,
      created_at: true,
      updated_at: true,
    },
    orderBy: { route: "asc" },
  });

  const rowMap = new Map(rows.map((row) => [row.route, row]));
  const missingRoutes = STATIC_DB_ROUTES.filter((route) => !rowMap.has(route));

  if (missingRoutes.length > 0) {
    throw new Error(
      `Missing content_pages rows for: ${missingRoutes.join(", ")}`,
    );
  }

  const generatedAt = new Date().toISOString();
  const snapshots = Object.fromEntries(
    STATIC_DB_ROUTES.map((route) => {
      const row = rowMap.get(route);
      if (!row) {
        throw new Error(`Missing route "${route}" during snapshot export.`);
      }

      return [
        route,
        {
          route: row.route,
          lang: row.lang,
          seo: normalizeJson(row.seo) ?? {},
          content: normalizeJson(row.content) ?? {},
          meta: {
            generatedAt,
            updatedAt:
              row.updated_at?.toISOString() ??
              row.created_at?.toISOString() ??
              generatedAt,
            version: "1",
            source: "content_pages_snapshot",
          },
        },
      ];
    }),
  );

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(snapshots, null, 2)}\n`);
  console.log(
    `Wrote ${Object.keys(snapshots).length} static page snapshots to ${OUTPUT_PATH}`,
  );
} finally {
  await prisma.$disconnect();
}
