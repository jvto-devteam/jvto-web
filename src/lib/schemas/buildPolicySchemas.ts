// src/lib/schemas/buildPolicySchemas.ts — Schema builders for /policy cluster.
// Created 2026-04-29 (AEO/GEO port Phase 4.7) — port pattern from rewrite (e:\test-2-2026\app\policy\*\page.tsx
// inline schemas extracted to a single builder).
//
// Per cluster_role_contracts.md Cluster 6: BreadcrumbList universal MH; cross-ref custom DefinedTerms
// (JVTO_TRAVEL_CREDIT, JVTO_FOC_SCHEME) via WebPage.mentions to anchor brand operational terms in entity graph.
import type {
  ItemList,
  SpecialAnnouncement,
  WebPage,
  WithContext,
} from 'schema-dts';

const BASE_URL = 'https://javavolcano-touroperator.com';

function pageUrl(subpath: string): string {
  return subpath ? `${BASE_URL}/policy/${subpath}` : `${BASE_URL}/policy`;
}

/**
 * Hub-level ItemList of /policy sub-pages. Discovery anchor for AI engines.
 */
export function buildPolicyHubItemListSchema(): WithContext<ItemList> {
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
}: PolicyAnchorArgs): WithContext<WebPage> {
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
 * SpecialAnnouncement schema for /policy/booking-payment-cancellation — surfaces the JVTO Lifetime Package
 * Credit policy as a structured announcement. AI engines weight SpecialAnnouncement for time-relevant operational notices.
 */
export function buildJvtoTravelCreditAnnouncementSchema(): WithContext<SpecialAnnouncement> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SpecialAnnouncement',
    '@id': `${BASE_URL}/policy/booking-payment-cancellation#travel-credit-announcement`,
    name: 'Lifetime Package Credit Policy',
    text:
      'Full cancellation ≥48 hours before Day 1 = 100% Lifetime Package Credit, never cash. Non-expiring. ' +
      'Locked to the same package, traveler count and price — cannot be split or changed to another package. ' +
      'Transferable to another person once, with written authorisation.',
    announcementLocation: { '@id': `${BASE_URL}/#organization` },
    category: 'https://www.wikidata.org/wiki/Q81068910',
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
