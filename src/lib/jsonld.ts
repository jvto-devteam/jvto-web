import { absUrl, BASE_URL, getOrg } from "@/lib/why-ssot";

type JsonLd = Record<string, unknown>;

export function buildOrganizationJsonLd(): JsonLd {
  const org = getOrg();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: org.brand_name,
    legalName: org.legal_name,
    url: BASE_URL,
    email: org.contact_email,
    telephone: org.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: org.address_line,
      addressCountry: "ID",
    },
    founder: org.founder_name
      ? {
          "@type": "Person",
          name: org.founder_name,
          jobTitle: org.founder_title,
        }
      : undefined,
  };
}

export function buildWebPageJsonLd(params: {
  pathname: string;
  title: string;
  description?: string;
}): JsonLd {
  const { pathname, title, description } = params;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absUrl(pathname)}#webpage`,
    url: absUrl(pathname),
    name: title,
    description,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
  };
}

export function buildBreadcrumbJsonLd(params: {
  pathname: string;
  items: Array<{ name: string; path: string }>;
}): JsonLd {
  const { items } = params;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  };
}

export function buildHowToJsonLd(params: {
  pathname: string;
  title: string;
  steps: Array<{ name: string; text: string }>;
}): JsonLd {
  const { pathname, title, steps } = params;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${absUrl(pathname)}#howto`,
    name: title,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function buildItemListJsonLd(params: {
  pathname: string;
  title: string;
  items: Array<{ name: string; url: string }>;
}): JsonLd {
  const { pathname, title, items } = params;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${absUrl(pathname)}#itemlist`,
    name: title,
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      url: it.url,
    })),
  };
}
