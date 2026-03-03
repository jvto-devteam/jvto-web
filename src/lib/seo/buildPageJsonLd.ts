const BASE = "https://javavolcano-touroperator.com";

function humanize(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function buildWebPageSchema(args: {
  route: string;
  title: string;
  description?: string;
  lang?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
}) {
  const url = `${BASE}${args.route}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: args.title,
    description: args.description,
    inLanguage: args.lang ?? "en",
    datePublished: args.datePublished,
    dateModified: args.dateModified,
    primaryImageOfPage: args.image
      ? { "@type": "ImageObject", url: args.image }
      : undefined,
  };
}

export function buildBreadcrumbSchema(
  route: string,
  labels?: Record<string, string>,
) {
  const segments = route.split("/").filter(Boolean);

  const items = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
    ...segments.map((seg, i) => {
      const path = "/" + segments.slice(0, i + 1).join("/");
      return {
        "@type": "ListItem",
        position: i + 2,
        name: labels?.[path] ?? labels?.[seg] ?? humanize(seg),
        item: `${BASE}${path}`,
      };
    }),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

export function buildFAQSchema(faq?: { q: string; a: string }[]) {
  if (!faq?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a },
    })),
  };
}

function normalizeJsonLd(v: any): any[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean);
  if (typeof v === "object") return [v];
  return [];
}

export function buildPageJsonLd(row: {
  route: string;
  lang: string;
  seo: any;
  content: any;
  created_at: Date;
  updated_at: Date;
}) {
  const seo = row.seo ?? {};
  const content = row.content ?? {};

  const title = seo.title ?? content.h1 ?? row.route;
  const description = seo.description ?? content.excerpt ?? undefined;
  const image = seo.ogImage ?? seo.image ?? undefined;

  const labels = seo.breadcrumb_labels as Record<string, string> | undefined;

  const base = [
    buildWebPageSchema({
      route: row.route,
      title,
      description,
      lang: row.lang,
      datePublished: row.created_at?.toISOString?.(),
      dateModified: row.updated_at?.toISOString?.(),
      image,
    }),
    buildBreadcrumbSchema(row.route, labels),
    buildFAQSchema(content.faq),
  ].filter(Boolean);

  const extra = normalizeJsonLd(seo.schema_jsonld);

  return [...base, ...extra];
}
