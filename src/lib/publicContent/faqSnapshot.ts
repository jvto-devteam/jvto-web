import { cache } from "react";
import { prisma } from "@/lib/prisma";
import faqSnapshotsJson from "./generated/faqSnapshots.json";
import {
  canUsePublishedSnapshotDatabaseFallback,
  logPublicContentOnce,
} from "./runtime";
import type {
  PublicFaqCategory,
  PublicFaqSnapshotCollection,
} from "./types";

const faqSnapshots = faqSnapshotsJson as PublicFaqSnapshotCollection;

async function getFaqCategoriesFromDatabase(): Promise<PublicFaqCategory[]> {
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
      category_id:
        faq.category_id != null ? Number(faq.category_id) : null,
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

  return normalized.filter((category) => category.faqs.length > 0);
}

export function getPublicFaqSnapshotCollection() {
  return faqSnapshots;
}

export const getPublicFaqCategories = cache(
  async (): Promise<PublicFaqCategory[]> => {
    if (faqSnapshots.categories.length > 0) {
      return faqSnapshots.categories.filter((category) => category.faqs.length > 0);
    }

    if (!canUsePublishedSnapshotDatabaseFallback()) {
      logPublicContentOnce(
        "strict-missing-faq-snapshot",
        "error",
        '[publicContent] Missing FAQ snapshot for "/travel-guide/faq" in strict mode.',
      );
      return [];
    }

    try {
      const categories = await getFaqCategoriesFromDatabase();
      logPublicContentOnce(
        "database-fallback-faq-snapshot",
        "warn",
        '[publicContent] Using FAQ database fallback for "/travel-guide/faq". Generate a FAQ snapshot before production cutover.',
      );
      return categories;
    } catch (error) {
      logPublicContentOnce(
        "faq-snapshot-fallback-error",
        "error",
        `[publicContent] Failed FAQ fallback: ${error instanceof Error ? error.message : String(error)}`,
      );
      return [];
    }
  },
);
