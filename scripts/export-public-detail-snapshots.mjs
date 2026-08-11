import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "../src/generated/prisma/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const DESTINATION_OUTPUT_PATH = path.join(
  repoRoot,
  "src/lib/publicContent/generated/destinationDetailSnapshots.json",
);

const prisma = new PrismaClient();

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function serializeDestinationDetail(destination) {
  return JSON.parse(
    JSON.stringify(destination, (_, value) =>
      typeof value === "bigint" ? Number(value) : value,
    ),
  );
}

try {
  const generatedAt = new Date().toISOString();

  const destinations = await prisma.destinations.findMany({
    where: {
      published: true,
      deleted_at: null,
      id: { notIn: [3, 4] },
      slug: { not: null },
    },
    include: {
      destination_assets: {
        include: { asset: true },
      },
    },
    orderBy: { id: "asc" },
  });

  const destinationItems = destinations.map((destination) => ({
    slug: destination.slug,
    updatedAt: destination.updated_at?.toISOString?.(),
    payload: serializeDestinationDetail(destination),
  }));

  writeJson(DESTINATION_OUTPUT_PATH, {
    generatedAt,
    items: destinationItems,
  });

  console.log(
    `Wrote ${destinationItems.length} destination detail snapshots to ${DESTINATION_OUTPUT_PATH}`,
  );
} finally {
  await prisma.$disconnect();
}
