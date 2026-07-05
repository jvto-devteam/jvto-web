// app/(website)/destinations/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import type { Destination } from "@/interfaces";
import { JsonLd } from "@/components/seo/JsonLd";
import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";
import { getPublicDestinationList } from "@/lib/publicContent/destinationListSnapshot";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  buildBreadcrumbJsonLd,
  buildDestinationsCollectionJsonLd,
} from "@/lib/seo/jsonld/builders";
import { getPageSeo } from "@/lib/content/getPageSeo";
import Link from "@/components/website/AppLink";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://javavolcano-touroperator.com";
const ROUTE = "/destinations";
export const revalidate = 3600;

// ─── Design-reference feature copy (docs/design-reference/destinations.html) ───
// Curated per-destination narrative for the alternating feature rows. Keyed by slug so
// the page still degrades gracefully (falls back to live DB fields) if a destination is
// added/removed from the published set. Elevation values for Ijen/Bromo are the
// CANONICAL_FACTS.md-locked figures (Kawah Ijen 2,386 m · Bromo 2,329 m) — these
// intentionally do NOT match the DB `geo.altitude` value for Ijen (2,769 m, a different
// summit/trailhead reference point), per facts-lock precedence over data/spec.
type HubCategory = "volcano" | "waterfall" | "coastal";

interface HubFeatureCopy {
  category: HubCategory;
  regionLabel: string;
  diffLine: string;
  elevation: string;
  description: string;
  chips: string[];
  warm: boolean;
}

const HUB_FEATURE_COPY: Record<string, HubFeatureCopy> = {
  "ijen-crater": {
    category: "volcano",
    regionLabel: "Banyuwangi",
    diffLine: "Active stratovolcano · Moderate–High",
    elevation: "2,386 m",
    description:
      "The world's highest-volume acidic crater lake sits inside an active stratovolcano. Pre-dawn, sulfuric gases ignite at the crater floor — a blue-fire phenomenon visible in suitable weather, subject to weather and gas activity and never guaranteed. You share the trail with sulfur miners carrying 70–90 kg loads.",
    chips: ["Blue fire (weather permitting)", "Acidic crater lake", "Sulfur miners", "Night hike"],
    warm: true,
  },
  "mount-bromo": {
    category: "volcano",
    regionLabel: "Probolinggo",
    diffLine: "Tengger caldera · Easy–Moderate",
    elevation: "2,329 m",
    description:
      "Bromo sits inside the vast Tengger caldera — a volcanic sea of sand framed by sheer walls. The Penanjakan viewpoint at 2,770 m is one of Southeast Asia's most photographed scenes. Access is by 4WD jeep across the caldera floor at 03:00.",
    chips: ["Penanjakan sunrise", "Sea of sand", "4WD jeep traverse", "Smoking crater"],
    warm: false,
  },
  "tumpak-sewu-waterfall": {
    category: "waterfall",
    regionLabel: "Lumajang",
    diffLine: "Multi-tiered curtain · Moderate",
    elevation: "~120 m",
    description:
      "A curved cliff face sends dozens of streams over its edge in a continuous curtain drop — Java's Niagara. Most visitors stand at the rim. Those who descend the ~300 steps stand at the base, surrounded by mist. Guides assess fitness before the descent begins.",
    chips: ["Java's Niagara", "Rim viewpoint", "Canyon descent", "Fitness-assessed"],
    warm: false,
  },
  "madakaripura-waterfall": {
    category: "waterfall",
    regionLabel: "Probolinggo",
    diffLine: "Tallest in Java · Easy–Moderate",
    elevation: "~100 m",
    description:
      "A narrow canyon walls you in for ~1.5 km before the gorge opens into a horseshoe of falling water. Bring a raincoat — the spray reaches everywhere. The site is said to be where Gajah Mada, the 14th-century Majapahit prime minister, spent his final days.",
    chips: ["Tallest waterfall in Java", "Canyon walk", "Horseshoe curtain", "Gajah Mada heritage"],
    warm: true,
  },
  "papuma-beach": {
    category: "coastal",
    regionLabel: "Jember",
    diffLine: "Coastal headland · Easy",
    elevation: "~86 m cape",
    description:
      "The only coastal stop on a JVTO East Java circuit. After Ijen's night hike, Papuma resets the pace — white sand, offshore rock formations, and a short headland walk rising to ~86 m with views along the coast. Positioned between the volcano and waterfall legs on Papuma-family packages.",
    chips: ["White-sand beach", "Cape headland", "Offshore rock formations", "Coastal contrast"],
    warm: false,
  },
};

function deriveCategory(dest: Destination): HubCategory {
  const tags = dest.tags ?? [];
  if (tags.includes("volcano")) return "volcano";
  if (tags.includes("waterfall")) return "waterfall";
  if (tags.includes("beach") || tags.includes("coastal")) return "coastal";
  return "volcano";
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

const fallbackSeo = {
  title: "East Java Destinations | Bromo, Ijen & More",
  h1: "Destinations",
  description:
    "Explore breathtaking destinations in East Java with JVTO. Discover our expert guides for Mount Bromo, Ijen Crater, Tumpak Sewu Waterfall, and more.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo(ROUTE, fallbackSeo);
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${SITE_URL}${ROUTE}`,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${SITE_URL}${ROUTE}`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/assets/img/og/destinations.webp`,
          width: 1200,
          height: 630,
          alt: seo.h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [`${SITE_URL}/assets/img/og/destinations.webp`],
    },
  };
}

// ─── Data fetching ─────────────────────────────────────────────────────────────

async function getAllDestinations(): Promise<Destination[]> {
  return getPublicDestinationList();
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function DestinationsPage() {
  const seo = await getPageSeo(ROUTE, fallbackSeo);
  const [destinations, org] = await Promise.all([
    getAllDestinations(),
    getOrganizationProfile(),
  ]);

  // Build @graph: tidak ada @context di tiap node, hanya di root
  const orgNode = buildOrganizationJsonLd(org as any, SITE_URL);
  const siteNode = buildWebSiteJsonLd(SITE_URL);
  const breadcrumb = buildBreadcrumbJsonLd(ROUTE, SITE_URL);
  const collection = buildDestinationsCollectionJsonLd(
    destinations as any,
    SITE_URL,
  );

  const schema = {
    "@context": "https://schema.org",
    "@graph": [orgNode, siteNode, collection, breadcrumb].filter(Boolean),
  };

  const volcanoCount = destinations.filter((d) => deriveCategory(d) === "volcano").length;
  const waterfallCount = destinations.filter((d) => deriveCategory(d) === "waterfall").length;
  const coastalCount = destinations.filter((d) => deriveCategory(d) === "coastal").length;

  return (
    <>
      <JsonLd data={schema} />

      {/* ── 1. HERO (interior, navy) ─────────────────────────────────── */}
      <header className="relative bg-jvto-navy text-white overflow-hidden pt-40 pb-20 md:pt-48 md:pb-24">
        <div
          className="absolute inset-0 opacity-55 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, #11253a 0%, #0d1b2a 60%, #1a3a52 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 75% 30%, rgba(232,101,10,0.18) 0%, transparent 55%), linear-gradient(180deg, rgba(13,27,42,0.45) 0%, rgba(13,27,42,0.1) 35%, rgba(13,27,42,0.9) 100%)",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-end">
            <div>
              <div className="inline-flex items-center gap-3 mb-8">
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-jvto-lime/30 bg-jvto-lime/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-lime"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-jvto-lime" aria-hidden="true" />
                  East Java Destinations
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                  File 003 / Destinations
                </span>
              </div>
              <h1
                className="text-5xl md:text-7xl lg:text-[92px] leading-[0.95] tracking-[-0.03em] font-bold mb-8"
                style={{ fontFamily: "Raleway, Inter, sans-serif" }}
              >
                {seo.h1 === "Destinations" ? (
                  <>
                    Five destinations. <em className="font-light not-italic">One</em> operator.
                  </>
                ) : (
                  seo.h1
                )}
              </h1>
              <p className="text-lg md:text-xl max-w-[38ch] text-white/78 font-light leading-relaxed">
                Every site on JVTO&apos;s East Java circuit — volcano craters, canyon waterfalls, a
                coastal headland — reached by dedicated private vehicle, BBKSDA park clearance
                already in hand.
              </p>
            </div>
            <div className="flex flex-col gap-1 pb-1">
              {[
                ["Destinations", String(destinations.length)],
                ["Active volcanoes", String(volcanoCount)],
                ["Waterfalls", String(waterfallCount)],
                ["Coastal stop", String(coastalCount)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between items-center py-3.5 border-b border-white/10 font-mono text-[11px] uppercase tracking-[0.22em] text-white/65"
                >
                  <span>{label}</span>
                  <strong className="text-white font-semibold">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. ALTERNATING DESTINATION FEATURE ROWS ─────────────────────── */}
      <section className="bg-jvto-off py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col gap-20 md:gap-28">
          {destinations.map((dest, i) => {
            const copy = HUB_FEATURE_COPY[dest.slug] ?? {
              category: deriveCategory(dest),
              regionLabel: "East Java",
              diffLine: dest.keyInfo.difficulty_level ?? "",
              elevation: dest.geo?.altitude ? `${dest.geo.altitude} m` : "",
              description: dest.summary ?? dest.description,
              chips: (dest.tags ?? []).slice(0, 4).map((t) => t.replace(/-/g, " ")),
              warm: i % 2 === 0,
            };
            const reverse = i % 2 === 1;
            const idx = String(i + 1).padStart(2, "0");

            return (
              <div
                key={dest.id}
                className={`grid gap-9 md:gap-18 items-center lg:grid-cols-[1.15fr_1fr] ${
                  reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div
                  className="relative aspect-[5/4] rounded-[40px] overflow-hidden shadow-[0_30px_60px_-25px_rgba(13,27,42,0.22)]"
                  style={{
                    background: copy.warm
                      ? "linear-gradient(135deg, #2a1810 0%, #3b1d0c 60%, #1c0f08 100%)"
                      : "linear-gradient(135deg, #11253a 0%, #0d1b2a 60%, #1a3a52 100%)",
                  }}
                >
                  <Image
                    src={dest.banner.url}
                    alt={dest.banner.alt || dest.name}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority={i < 2}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 55%, rgba(13,27,42,0.9) 100%)",
                    }}
                  />
                  {copy.elevation && (
                    <span className="absolute right-4 top-4 z-[3] rounded-full bg-white/92 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-jvto-navy backdrop-blur-sm">
                      {copy.elevation}
                    </span>
                  )}
                  <span className="absolute left-5 bottom-4 z-[3] font-mono text-[10px] uppercase tracking-[0.22em] text-white/72">
                    {idx} — {copy.regionLabel}
                  </span>
                </div>
                <div>
                  <div className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-jvto-orange">
                    {copy.diffLine}
                  </div>
                  <h2
                    className="text-4xl md:text-6xl leading-[0.98] tracking-[-0.03em] font-bold text-jvto-navy mb-5"
                    style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                  >
                    {dest.name}
                  </h2>
                  <p className="text-lg text-jvto-muted font-light leading-relaxed max-w-[48ch] mb-7">
                    {copy.description}
                  </p>
                  {copy.chips.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {copy.chips.map((chip) => (
                        <span
                          key={chip}
                          className="inline-flex items-center gap-2 rounded-full border border-jvto-border px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-navy"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-jvto-lime)" strokeWidth="3" aria-hidden="true">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`/destinations/${dest.slug}`}
                    className="inline-flex items-center gap-3 border-b border-jvto-navy pb-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-jvto-navy hover:text-jvto-orange hover:border-jvto-orange hover:gap-5 transition-all"
                  >
                    Explore {dest.name}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 3. TRANSPORT NOTE ─────────────────────────────────────────── */}
      <section className="bg-jvto-navy text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <span className="block mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-jvto-lime">
                Transport Note
              </span>
              <h2
                className="text-3xl md:text-5xl leading-[1.04] tracking-[-0.03em] font-bold mb-6"
                style={{ fontFamily: "Raleway, Inter, sans-serif" }}
              >
                Your vehicle. Your driver. <span className="text-jvto-orange">Your schedule.</span>
              </h2>
              <p className="text-white/72 text-base md:text-lg font-light leading-relaxed max-w-[46ch]">
                Every destination on this list is reached by dedicated private vehicle — AC MPV
                for smaller groups, Toyota Hiace for larger ones. No public buses. No shared
                transfers.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 rounded-[28px] border border-white/10 bg-white/[0.03] p-8">
              {[
                ["Small groups", "AC MPV · 2–3 guests"],
                ["Larger groups", "Toyota Hiace · 4–9"],
                ["Park access", "BBKSDA clearance in hand"],
                ["Shared transfers", "Never"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 mb-1.5">
                    {k}
                  </div>
                  <div className="font-semibold text-white">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. CTA ────────────────────────────────────────────────────── */}
      <section className="bg-jvto-navy text-white py-24 text-center">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2
            className="text-4xl md:text-6xl lg:text-[80px] leading-none tracking-[-0.03em] font-bold mb-10"
            style={{ fontFamily: "Raleway, Inter, sans-serif" }}
          >
            Ready for your <span className="text-jvto-orange">expedition?</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/tours"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-jvto-orange px-9 py-[18px] font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-jvto-orange-hover transition-colors"
            >
              View all tours
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-9 py-[18px] font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-white/[0.06] transition-colors"
            >
              Custom inquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
