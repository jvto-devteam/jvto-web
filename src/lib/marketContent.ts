// src/lib/marketContent.ts — STRUCTURAL layout/offer inputs + JSON-LD builder for the
// /markets/* geographic landing pages.
//
// Milestone 2 (2026-08-09): the evergreen NARRATIVE, SEO, canonical, and FAQ for
// `/markets/singapore` and `/markets/malaysia` moved to the content/ Git SSOT
// (`content/pages/markets/*.json` + `content/faqs/markets-*.json`). What remains here is
// only what the content plane does not own: the per-market package/offer table (IDR prices)
// that feeds both the visible comparison table and the `ItemList` → `Offer` JSON-LD, plus the
// package-nav CTA list. Do NOT re-add page copy here — edit content/pages/markets/*.json.
//
// All IDR prices are the canonical direct-template rates (per person, based on 2 travelers).
import { ORG_ID } from '@/lib/seo/jsonld/builders';

const BASE_URL = 'https://javavolcano-touroperator.com';

export interface MarketPackage {
  name: string;
  /** Absolute site path to the tour-detail page, e.g. /tours/from-bali/bromo-ijen-3d2n */
  path: string;
  startFinish: string;
  duration: string;
  bestFor: string;
  /** Per person, based on 2 travelers, in IDR. */
  priceIdr: number;
  priceLabel: string;
}

/**
 * Non-narrative inputs a market page still needs from code: the country/demonym labels used
 * by layout chrome, the priced package table, and the package-nav CTAs. Every sentence of
 * page copy lives in content/pages/markets/<key>.json.
 */
export interface MarketStructure {
  key: 'singapore' | 'malaysia';
  country: string;
  demonym: string;
  route: string;
  packages: MarketPackage[];
  primaryCtas: { label: string; href: string }[];
}

export const SINGAPORE_MARKET: MarketStructure = {
  key: 'singapore',
  country: 'Singapore',
  demonym: 'Singaporean',
  route: '/markets/singapore',
  packages: [
    {
      name: '3 Day Bromo & Ijen Volcano Discovery',
      path: '/tours/from-bali/bromo-ijen-3d2n',
      startFinish: 'Bali → Bali',
      duration: '3D2N',
      bestFor: 'Bali holiday add-on',
      priceIdr: 4050000,
      priceLabel: 'IDR 4,050,000 / person (2 pax)',
    },
    {
      name: '3 Day Ijen, Bromo & Madakaripura',
      path: '/tours/from-bali/ijen-bromo-madakaripura-3d2n',
      startFinish: 'Bali → Surabaya',
      duration: '3D2N',
      bestFor: 'Bali arrival, Surabaya departure',
      priceIdr: 4050000,
      priceLabel: 'IDR 4,050,000 / person (2 pax)',
    },
    {
      name: '3 Day Ijen, Bromo & Madakaripura',
      path: '/tours/from-surabaya/ijen-bromo-madakaripura-3d2n',
      startFinish: 'Surabaya → Surabaya',
      duration: '3D2N',
      bestFor: 'Classic East Java loop',
      priceIdr: 3570000,
      priceLabel: 'IDR 3,570,000 / person (2 pax)',
    },
    {
      name: '4 Day Ijen, Papuma, Tumpak Sewu & Bromo',
      path: '/tours/from-bali/ijen-papuma-tumpak-sewu-bromo-4d3n',
      startFinish: 'Bali → Surabaya',
      duration: '4D3N',
      bestFor: 'Full photo circuit, no backtracking',
      priceIdr: 4900000,
      priceLabel: 'IDR 4,900,000 / person (2 pax)',
    },
  ],
  primaryCtas: [
    { label: '3D2N Bromo & Ijen from Bali', href: '/tours/from-bali/bromo-ijen-3d2n' },
    { label: '3D2N Ijen, Bromo & Madakaripura from Surabaya', href: '/tours/from-surabaya/ijen-bromo-madakaripura-3d2n' },
    { label: 'See all Bali-origin tours', href: '/tours/from-bali' },
  ],
};

export const MALAYSIA_MARKET: MarketStructure = {
  key: 'malaysia',
  country: 'Malaysia',
  demonym: 'Malaysian',
  route: '/markets/malaysia',
  packages: [
    {
      name: '2 Day Ijen Blue Fire Expedition',
      path: '/tours/from-surabaya/ijen-2d1n',
      startFinish: 'Surabaya → Surabaya',
      duration: '2D1N',
      bestFor: 'Short trip, Ijen-focused',
      priceIdr: 2300000,
      priceLabel: 'IDR 2,300,000 / person (2 pax)',
    },
    {
      name: '3 Day Ijen, Bromo & Madakaripura',
      path: '/tours/from-surabaya/ijen-bromo-madakaripura-3d2n',
      startFinish: 'Surabaya → Surabaya',
      duration: '3D2N',
      bestFor: 'Classic volcano + waterfall loop',
      priceIdr: 3570000,
      priceLabel: 'IDR 3,570,000 / person (2 pax)',
    },
    {
      name: '3 Day Bromo & Ijen Volcano Discovery',
      path: '/tours/from-bali/bromo-ijen-3d2n',
      startFinish: 'Bali → Bali',
      duration: '3D2N',
      bestFor: 'Bali holiday add-on',
      priceIdr: 4050000,
      priceLabel: 'IDR 4,050,000 / person (2 pax)',
    },
    {
      name: '4 Day Ijen, Papuma, Tumpak Sewu & Bromo',
      path: '/tours/from-surabaya/ijen-papuma-tumpak-sewu-bromo-4d3n',
      startFinish: 'Surabaya → Surabaya',
      duration: '4D3N',
      bestFor: 'Full coast + waterfall + volcano circuit',
      priceIdr: 4550000,
      priceLabel: 'IDR 4,550,000 / person (2 pax)',
    },
  ],
  primaryCtas: [
    { label: '3D2N Ijen, Bromo & Madakaripura from Surabaya', href: '/tours/from-surabaya/ijen-bromo-madakaripura-3d2n' },
    { label: '3D2N Bromo & Ijen from Bali', href: '/tours/from-bali/bromo-ijen-3d2n' },
    { label: 'See all Surabaya-origin tours', href: '/tours/from-surabaya' },
  ],
};

/**
 * Per-market JSON-LD extras: an ItemList of recommended TouristTrip packages, each carrying a
 * structured Offer (IDR price, per-person unit spec) so generative engines can quote
 * "3D2N Bromo Ijen from Bali price" directly. FAQPage is emitted separately by the page from
 * the content/ FAQ set; WebPage + BreadcrumbList come from PageJsonLdCombined.
 */
export function buildMarketSchemas(market: MarketStructure): Record<string, unknown>[] {
  const pageUrl = `${BASE_URL}${market.route}`;
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${pageUrl}#recommended-tours`,
    name: `Recommended JVTO volcano tours for ${market.country} travelers`,
    numberOfItems: market.packages.length,
    itemListElement: market.packages.map((pkg, i) => {
      const url = `${BASE_URL}${pkg.path}`;
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'TouristTrip',
          '@id': url,
          name: pkg.name,
          url,
          provider: { '@id': ORG_ID },
          offers: {
            '@type': 'Offer',
            url,
            price: String(pkg.priceIdr),
            priceCurrency: 'IDR',
            availability: 'https://schema.org/InStock',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: String(pkg.priceIdr),
              priceCurrency: 'IDR',
              referenceQuantity: { '@type': 'QuantitativeValue', value: '1', unitText: 'person' },
              description: 'Per person, based on 2 travelers',
            },
          },
        },
      };
    }),
  };
  return [itemList];
}
