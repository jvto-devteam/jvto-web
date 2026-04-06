import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export type BlogSummary = {
  id: number;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  cover_image: string | null;
  created_at: string;
};

export type BlogDetail = BlogSummary & {
  content: string;
};

const getBlogListCached = unstable_cache(
  async (): Promise<BlogSummary[]> => {
    try {
      const rows = await prisma.blogs.findMany({
        where: { status: "published" },
        include: { category: true },
        orderBy: { created_at: "desc" },
      });

      return rows.map((b) => ({
        id: Number(b.id),
        title: b.title,
        slug: b.slug,
        category: b.category?.name ?? "General",
        tags: b.tags ?? [],
        cover_image: b.cover_image ?? null,
        created_at: b.created_at?.toISOString() ?? "",
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[blogs] fallback to empty list: ${message}`);
      return [];
    }
  },
  ["blog-list"],
  { revalidate: 3600, tags: ["blogs"] },
);

export async function getBlogList(): Promise<BlogSummary[]> {
  return getBlogListCached();
}

const getBlogBySlugCached = unstable_cache(
  async (slug: string): Promise<BlogDetail | null> => {
    try {
      const row = await prisma.blogs.findFirst({
        where: { slug, status: "published" },
        include: { category: true },
      });

      if (!row) return null;

      return {
        id: Number(row.id),
        title: row.title,
        slug: row.slug,
        category: row.category?.name ?? "General",
        tags: row.tags ?? [],
        cover_image: row.cover_image ?? null,
        content: row.content,
        created_at: row.created_at?.toISOString() ?? "",
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[blogs] fallback to null for slug=${slug}: ${message}`);
      return null;
    }
  },
  ["blog-detail"],
  { revalidate: 3600, tags: ["blogs"] },
);

export async function getBlogBySlug(slug: string): Promise<BlogDetail | null> {
  return getBlogBySlugCached(slug);
}
