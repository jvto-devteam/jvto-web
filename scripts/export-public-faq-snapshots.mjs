import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "../src/generated/prisma/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const OUTPUT_PATH = path.join(
  repoRoot,
  "src/lib/publicContent/generated/faqSnapshots.json",
);

const prisma = new PrismaClient();

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

try {
  const categories = await prisma.category_faqs.findMany({
    where: {
      is_active: true,
      faqs: {
        some: {
          is_published: true,
        },
      },
    },
    orderBy: {
      sort_order: "asc",
    },
    include: {
      faqs: {
        where: {
          is_published: true,
        },
        orderBy: {
          sort_order: "asc",
        },
      },
    },
  });

  const uncategorizedFaqs = await prisma.faqs.findMany({
    where: {
      is_published: true,
      category_id: null,
    },
    orderBy: {
      sort_order: "asc",
    },
  });

  const normalized = categories.map((category) => ({
    id: Number(category.id),
    name: category.name ?? "",
    slug: category.slug ?? "",
    sort_order: category.sort_order ?? 0,
    is_active: category.is_active ?? true,
    faqs: category.faqs.map((faq) => ({
      id: Number(faq.id),
      question: faq.question ?? "",
      answer: faq.answer ?? "",
      category_id: faq.category_id != null ? Number(faq.category_id) : null,
      sort_order: faq.sort_order ?? 0,
    })),
  }));

  if (uncategorizedFaqs.length > 0) {
    normalized.push({
      id: 9999,
      name: "General / Others",
      slug: "general",
      sort_order: 9999,
      is_active: true,
      faqs: uncategorizedFaqs.map((faq) => ({
        id: Number(faq.id),
        question: faq.question ?? "",
        answer: faq.answer ?? "",
        category_id: null,
        sort_order: faq.sort_order ?? 0,
      })),
    });
  }

  writeJson(OUTPUT_PATH, {
    generatedAt: new Date().toISOString(),
    categories: normalized.filter((category) => category.faqs.length > 0),
  });

  console.log(`Wrote FAQ snapshot to ${OUTPUT_PATH}`);
} finally {
  await prisma.$disconnect();
}
