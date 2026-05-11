// src/lib/schemas/buildInsightsSchemas.ts
// Schema builders for /insights/[slug] cluster — BlogPosting + Article per STRATEGIC_REFERENCE §8.
// Author cross-refs /#agung-sambuko (FOUNDER_SCHEMA, global); publisher /#organization (ORG_SCHEMA, global).

const BASE_URL = 'https://javavolcano-touroperator.com';

interface InsightsArticleArgs {
  slug: string;
  headline: string;
  description: string;
  datePublished: string; // ISO string
  dateModified: string;  // ISO string
  category?: string;
}

export function buildInsightsBlogPostingSchema({
  slug,
  headline,
  description,
  datePublished,
  dateModified,
  category,
}: InsightsArticleArgs) {
  const articleUrl = `${BASE_URL}/insights/${slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': ['BlogPosting', 'Article'],
    '@id': `${articleUrl}#blogpost`,
    headline,
    description,
    url: articleUrl,
    datePublished,
    dateModified,
    inLanguage: 'en',
    ...(category ? { articleSection: category } : {}),
    author: { '@id': `${BASE_URL}/#agung-sambuko` },
    publisher: { '@id': `${BASE_URL}/#organization` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    isPartOf: {
      '@type': 'Blog',
      '@id': `${BASE_URL}/insights`,
      name: 'JVTO Insights — Safety, Planning & East Java',
      url: `${BASE_URL}/insights`,
    },
  };
}

export function buildInsightsBreadcrumbSchema(slug: string, headline: string) {
  const articleUrl = `${BASE_URL}/insights/${slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Insights', item: `${BASE_URL}/insights` },
      { '@type': 'ListItem', position: 3, name: headline, item: articleUrl },
    ],
  };
}
