const BASE = "https://javavolcano-touroperator.com";

export function buildBreadcrumbSchema(route: string, labels?: Record<string, string>) {
  const segments = route.split("/").filter(Boolean);

  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${BASE}/`,
    },
  ];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const path = "/" + segments.slice(0, i + 1).join("/");

    items.push({
      "@type": "ListItem",
      position: i + 2,
      name: labels?.[path] ?? labels?.[seg] ?? humanize(seg),
      item: `${BASE}${path}`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

function humanize(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}