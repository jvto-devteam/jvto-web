// src/lib/ecosystemContent/markets.ts
// Fetches the canonical /markets/<country> geographic-landing-page content from
// jvto-ekosistem's rendered public-website output
// (5-experience-engine/public-website/pages/markets__<country>.website-output.json).
// This is RENDERED output, not a raw source file — same file family as the
// travel-guide/policy/why-jvto pages consumed via ecosystemContent/website.ts's
// getEcosystemWebsitePage (see that file's readLocalJson/fetchJson helpers for the
// established local-read + `/api/website/page` fetch convention for this file family).
// The render_contract on the ekosistem output explicitly marks
// `website_should_not_resolve_raw_sources: true`, so this adapter never reads
// 1-knowledge-and-evidence-core/markets/<country>.source.json directly.
//
// Replaces the local hardcoded constants that used to live in
// src/lib/marketContent.ts / src/lib/marketFaqs.ts (both deleted as part of this
// migration), so there is exactly one place market-landing-page content is edited.
// The MarketContent type family and buildMarketSchemas JSON-LD builder that used to
// live in marketContent.ts move here with it — MarketPageSections.tsx and both
// markets/*/page.tsx files now import them from this module.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ORG_ID, buildJavaIslandPlaceNode, JAVA_ISLAND_PLACE_ID } from "@/lib/seo/jsonld/builders";
import type { QaPair } from "@/lib/tourFaqs";

const DEFAULT_ECOSYSTEM_BASE_URL = "https://ekosistem.javavolcano-touroperator.com";
const DEFAULT_REVALIDATE_SECONDS = 300;
const BASE_URL = "https://javavolcano-touroperator.com";

const REVALIDATE_SECONDS = Number(
  process.env.JVTO_EKOSYSTEM_CONTENT_REVALIDATE_SECONDS ?? DEFAULT_REVALIDATE_SECONDS,
);

export type MarketCountry = "singapore" | "malaysia";

type MarketFaqItem = { question: string; answer: string };

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

export interface EntryChoice {
  flightPlan: string;
  start: string;
  why: string;
  route: string;
}

export interface MarketReview {
  quote: string;
  author: string;
  platform: string;
}

export interface TrustRow {
  signal: string;
  detail: string;
}

export interface MarketContent {
  key: "singapore" | "malaysia";
  country: string;
  demonym: string;
  route: string;
  title: string;
  description: string;
  h1: string;
  /** Optional local-language support line (Bahasa for Malaysia). */
  supportLine?: string;
  subheadline: string;
  credibilityLine: string;
  lead: string;
  entryHeading: string;
  entryChoices: EntryChoice[];
  entryNote: string;
  packagesHeading: string;
  packagesIntro: string;
  packages: MarketPackage[];
  inclusions: string[];
  notIncluded: string;
  logistics: QaPair[];
  trustRows: TrustRow[];
  reviewsHeading: string;
  reviews: MarketReview[];
  faqs: QaPair[];
  primaryCtas: { label: string; href: string }[];
  trustLinks: { label: string; href: string }[];
}

// Minimal shape of the rendered website-output.json this adapter reads — only the
// fields markets.ts consumes, not the full EcosystemWebsitePage contract from website.ts.
interface MarketWebsiteOutput {
  route: string;
  page: {
    content?: {
      payload?: Omit<MarketContent, "faqs">;
    };
    faq?: {
      payload?: {
        items?: MarketFaqItem[];
      };
    } | null;
  };
}

function outputRelativePath(country: MarketCountry): string {
  return path.join(
    "5-experience-engine",
    "public-website",
    "pages",
    `markets__${country}.website-output.json`,
  );
}

function ecosystemContentRoot(): string {
  return (
    process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ??
    path.resolve(process.cwd(), "..", "jvto-ekosistem")
  );
}

async function readLocal(country: MarketCountry): Promise<MarketWebsiteOutput | null> {
  try {
    const raw = await readFile(
      path.join(ecosystemContentRoot(), outputRelativePath(country)),
      "utf8",
    );
    return JSON.parse(raw) as MarketWebsiteOutput;
  } catch {
    return null;
  }
}

async function fetchRemote(country: MarketCountry): Promise<MarketWebsiteOutput | null> {
  const configuredBase = process.env.JVTO_EKOSYSTEM_CONTENT_BASE_URL?.trim();
  const baseUrl = configuredBase || DEFAULT_ECOSYSTEM_BASE_URL;

  try {
    const url = new URL("/api/website/page", baseUrl);
    url.searchParams.set("route", `/markets/${country}`);

    const response = await fetch(url, {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["jvto-ekosistem-content", "jvto-ekosistem-markets"],
      },
    });
    if (!response.ok) return null;

    const body = (await response.json()) as { payload?: MarketWebsiteOutput };
    if (!body.payload) return null;
    return body.payload;
  } catch {
    return null;
  }
}

function toMarketContent(output: MarketWebsiteOutput): MarketContent | null {
  const payload = output.page.content?.payload;
  if (!payload) return null;

  const faqItems = output.page.faq?.payload?.items ?? [];
  const faqs = faqItems
    .filter((item) => item.question && item.answer)
    .map((item) => ({ question: item.question, answer: item.answer }));

  return { ...payload, faqs } as MarketContent;
}

/**
 * Canonical /markets/<country> landing-page content from ekosistem's rendered
 * public-website output. Local sibling-directory read first (dev, same-server
 * deploys), HTTP fetch to the ekosistem origin as fallback. Returns null if
 * neither source is reachable, or the payload is missing/malformed — callers
 * decide how to handle that (page.tsx calls notFound()).
 */
export async function getEcosystemMarket(country: MarketCountry): Promise<MarketContent | null> {
  const local = await readLocal(country);
  if (local) return toMarketContent(local);

  const remote = await fetchRemote(country);
  if (remote) return toMarketContent(remote);

  return null;
}

/**
 * Per-market JSON-LD extras: an ItemList of recommended TouristTrip packages, each carrying a
 * structured Offer (IDR price, per-person unit spec) so generative engines can quote
 * "3D2N Bromo Ijen from Bali price" directly. FAQPage is built separately by the page from
 * `content.faqs` (see the markets singapore/malaysia page.tsx files); WebPage + BreadcrumbList
 * come from PageJsonLdCombined. Ported unchanged from the pre-migration src/lib/marketContent.ts.
 */
export async function buildMarketSchemas(content: MarketContent): Promise<Record<string, unknown>[]> {
  const pageUrl = `${BASE_URL}${content.route}`;
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageUrl}#recommended-tours`,
    name: `Recommended JVTO volcano tours for ${content.country} travelers`,
    numberOfItems: content.packages.length,
    // GEO audit Priority 3 (2026-08-15): disambiguate "Java" (island vs
    // programming language) — these tours all take place on the island.
    mentions: { "@id": JAVA_ISLAND_PLACE_ID },
    itemListElement: content.packages.map((pkg, i) => {
      const url = `${BASE_URL}${pkg.path}`;
      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "TouristTrip",
          "@id": url,
          name: pkg.name,
          url,
          provider: { "@id": ORG_ID },
          offers: {
            "@type": "Offer",
            url,
            price: String(pkg.priceIdr),
            priceCurrency: "IDR",
            availability: "https://schema.org/InStock",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: String(pkg.priceIdr),
              priceCurrency: "IDR",
              referenceQuantity: { "@type": "QuantitativeValue", value: "1", unitText: "person" },
              description: "Per person, based on 2 travelers",
            },
          },
        },
      };
    }),
  };
  return [itemList, await buildJavaIslandPlaceNode()];
}
