// src/lib/schemas/buildPolicySchemas.ts — Schema builders for /policy cluster.
// Created 2026-04-29 (AEO/GEO port Phase 4.7) — port pattern from rewrite (e:\test-2-2026\app\policy\*\page.tsx
// inline schemas extracted to a single builder).
//
// Per cluster_role_contracts.md Cluster 6: BreadcrumbList universal MH; cross-ref custom DefinedTerms
// (JVTO_TRAVEL_CREDIT, JVTO_FOC_SCHEME) via WebPage.mentions to anchor brand operational terms in entity graph.
import type { NarrativeClaim } from '@/lib/queries/narrativeClaims';

const BASE_URL = 'https://javavolcano-touroperator.com';

function pageUrl(subpath: string): string {
  return subpath ? `${BASE_URL}/policy/${subpath}` : `${BASE_URL}/policy`;
}

/**
 * Hub-level ItemList of /policy sub-pages. Discovery anchor for AI engines.
 */
export function buildPolicyHubItemListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${BASE_URL}/policy#sub-pages`,
    name: 'JVTO Policies — Index',
    numberOfItems: 3,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        url: `${BASE_URL}/policy/booking-payment-cancellation`,
        name: 'Booking, Payment & Cancellation Policy',
      },
      {
        '@type': 'ListItem',
        position: 2,
        url: `${BASE_URL}/policy/inclusions-exclusions`,
        name: 'Inclusions & Exclusions Policy',
      },
      {
        '@type': 'ListItem',
        position: 3,
        url: `${BASE_URL}/policy/privacy`,
        name: 'Privacy Policy',
      },
    ],
  };
}

interface PolicyAnchorArgs {
  /** Sub-slug (e.g. 'booking-payment-cancellation'). Empty string for hub. */
  subpath: string;
  /** Page name used in schema. */
  name: string;
  /** Page description used in schema. */
  description: string;
  /** Globally-injected DefinedTerm @id paths to cross-ref via mentions. e.g. ['/#term-jvto-foc-scheme']. */
  mentionsTermIds?: string[];
}

/**
 * Brand-anchor WebPage schema with `mentions` cross-refs to globally-injected DefinedTerms.
 * Emitted with `@id: ${url}#policy-anchor` so it does NOT collide with live's PageJsonLdCombined
 * WebPage (@id: ${url}#webpage). Two complementary nodes — same dual-source pattern as homepage FAQPage.
 */
export function buildPolicyWebPageSchema({
  subpath,
  name,
  description,
  mentionsTermIds,
}: PolicyAnchorArgs) {
  const url = pageUrl(subpath);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#policy-anchor`,
    url,
    name,
    description,
    isPartOf: { '@id': `${BASE_URL}/#organization` },
    ...(mentionsTermIds?.length
      ? { mentions: mentionsTermIds.map((id) => ({ '@id': `${BASE_URL}${id}` })) }
      : {}),
  };
}

/**
 * SpecialAnnouncement schema for /policy/booking-payment-cancellation — surfaces the JVTO Travel Credit
 * policy as a structured announcement. AI engines weight SpecialAnnouncement for time-relevant operational notices.
 */
export function buildJvtoTravelCreditAnnouncementSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SpecialAnnouncement',
    '@id': `${BASE_URL}/policy/booking-payment-cancellation#travel-credit-announcement`,
    name: 'JVTO Travel Credit Policy',
    text:
      'Cancellation ≥48 hours before Day 1 = 100% JVTO Travel Credit. Non-expiring. Transferable. ' +
      'IDR-denominated. No rebooking fee. Applies to any JVTO private tour.',
    announcementLocation: { '@id': `${BASE_URL}/#organization` },
    category: 'https://www.wikidata.org/wiki/Q81068910',
  };
}

/**
 * FAQPage from narrative_claims wired to a policy page (primary_page='/policy/...').
 * Empty input → returns null. Mirrors why-jvto / travel-guide pattern.
 */
export function buildPolicyFaqSchema(claims: NarrativeClaim[], subpath: string) {
  const usable = claims.filter((c) => c.pillar && c.core_claim);
  if (!usable.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl(subpath)}#faq`,
    mainEntity: usable.map((c) => ({
      '@type': 'Question',
      name: c.pillar as string,
      acceptedAnswer: { '@type': 'Answer', text: c.core_claim as string },
    })),
  };
}

/**
 * Per-slug DefinedTerm @id mapping. Single source of truth for slug → mentions cross-ref translation.
 * Adding a new term cross-ref = one entry here, no per-page edit.
 */
export const POLICY_SLUG_MENTIONS: Record<string, string[]> = {
  'booking-payment-cancellation': [
    '/#term-jvto-travel-credit',
    '/#term-jvto-foc-scheme',
  ],
  'inclusions-exclusions': ['/#term-jvto-foc-scheme'],
  privacy: [],
};
