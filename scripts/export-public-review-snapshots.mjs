import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "../src/generated/prisma/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const OUTPUT_PATH = path.join(
  repoRoot,
  "src/lib/publicContent/generated/homeReviewSnapshots.json",
);

const prisma = new PrismaClient();

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

try {
  const reviews = await prisma.reviews.findMany({
    where: {
      platform: { equals: "Trustpilot" },
    },
    orderBy: { date: "desc" },
  });

  writeJson(OUTPUT_PATH, {
    generatedAt: new Date().toISOString(),
    items: reviews.map((review) => ({
      name: review.customer_name ?? "",
      date: review.date.toISOString(),
      url: review.url || review.url_reference || "",
      stars: Number(review.star ?? 0),
      title: review.review?.substring(0, 60) ?? "",
      text: review.review ?? "",
      verified: true,
    })),
  });

  console.log(`Wrote ${reviews.length} home review snapshots to ${OUTPUT_PATH}`);
} finally {
  await prisma.$disconnect();
}
