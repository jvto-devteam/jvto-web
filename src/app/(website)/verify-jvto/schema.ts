import type { Doc } from "@/lib/data-loader";
import { BASE_URL } from "@/lib/site";

const SITE_URL = BASE_URL;

type VerifyPageSchemaInput = {
  pathname: string;
  title: string;
  description: string;
  breadcrumbLabel: string;
  docs: Doc[];
};

export function buildVerifySubpageSchema({
  pathname,
  title,
  description,
  breadcrumbLabel,
  docs,
}: VerifyPageSchemaInput) {
  const pageUrl = `${SITE_URL}${pathname}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: title,
        description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Verify JVTO",
            item: `${SITE_URL}/verify-jvto`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: breadcrumbLabel,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#documents`,
        name: `${breadcrumbLabel} documents`,
        numberOfItems: docs.length,
        itemListElement: docs.map((doc, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "DigitalDocument",
            name: doc.official_title || doc.caption,
            description: doc.narrative_context || doc.caption,
            url: doc.url,
            ...(doc.preview?.url ? { image: doc.preview.url } : {}),
            ...(doc.sha256 ? { sha256: doc.sha256 } : {}),
            ...(doc.last_verified ? { dateModified: doc.last_verified } : {}),
          },
        })),
      },
    ],
  };
}
