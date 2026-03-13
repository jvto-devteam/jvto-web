const BASE = "https://javavolcano-touroperator.com";

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

export function buildBreadcrumbSchema(route: string) {
  const segments = route.split("/").filter(Boolean);
  const items = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
    ...segments.map((seg, i) => {
      const path = "/" + segments.slice(0, i + 1).join("/");
      return {
        "@type": "ListItem",
        position: i + 2,
        name: humanize(seg),
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

function humanize(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
