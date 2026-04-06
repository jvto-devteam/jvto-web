import whyJvtoSsot from "@/content/why-jvto-ssot.json";

type SsotSection = {
  id?: string;
  title?: string;
  paragraphs?: string[];
  bullets?: string[];
  cards?: Array<{
    title?: string;
    summary?: string;
    link?: string;
  }>;
};

type SsotPage = {
  route: string;
  h1?: string;
  hero_subhead?: string;
  intro_paragraphs?: string[];
  sections?: SsotSection[];
};

type ContentPageLike = {
  route: string;
  lang: string;
  seo: Record<string, unknown>;
  content: Record<string, unknown>;
  created_at?: null;
  updated_at?: null;
};

const pages = ((whyJvtoSsot as { pages?: SsotPage[] }).pages ?? []).filter(Boolean);

function normalizeRoute(route: string) {
  if (!route.startsWith("/")) return `/${route.replace(/^\/+/, "")}`;
  return route;
}

function withTrailingSlashVariants(route: string) {
  const normalized = normalizeRoute(route);
  return normalized.endsWith("/")
    ? [normalized, normalized.slice(0, -1)]
    : [normalized, `${normalized}/`];
}

function sectionToMarkdown(section: SsotSection) {
  const lines: string[] = [];

  if (section.paragraphs?.length) {
    lines.push(...section.paragraphs);
  }

  if (section.bullets?.length) {
    if (lines.length) lines.push("");
    lines.push(...section.bullets.map((bullet) => `- ${bullet}`));
  }

  if (section.cards?.length) {
    if (lines.length) lines.push("");
    lines.push(
      ...section.cards.map((card) => {
        const title = card.title?.trim() || "More";
        const summary = card.summary?.trim() || "";
        const href = card.link?.trim();
        if (href) {
          return `- [${title}](${href})${summary ? `: ${summary}` : ""}`;
        }
        return `- ${title}${summary ? `: ${summary}` : ""}`;
      }),
    );
  }

  return lines.join("\n");
}

export function getWhyJvtoSsotFallback(route: string): ContentPageLike | null {
  const variants = withTrailingSlashVariants(route);
  const page = pages.find((entry) => variants.includes(normalizeRoute(entry.route)));

  if (!page) return null;

  const introParagraphs = page.intro_paragraphs?.filter(Boolean) ?? [];
  const description = page.hero_subhead ?? introParagraphs[0] ?? page.h1 ?? "Why JVTO";

  return {
    route: normalizeRoute(route),
    lang: "en",
    seo: {
      title: page.h1 ?? "Why JVTO",
      description,
    },
    content: {
      h1: page.h1 ?? "Why JVTO",
      hero_subhead: page.hero_subhead ?? null,
      lede: introParagraphs,
      sections:
        page.sections?.map((section, index) => ({
          id:
            section.id ??
            section.title
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "") ??
            `section-${index + 1}`,
          title: section.title ?? `Section ${index + 1}`,
          summary: section.paragraphs?.[0] ?? null,
          body_md: sectionToMarkdown(section),
        })) ?? [],
    },
    created_at: null,
    updated_at: null,
  };
}
