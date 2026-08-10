// src/app/(website)/trust/page.tsx
//
// MILESTONE 2 (2026-08-09): served from the static-content SSOT
// (content/pages/trust/index.json) for its evergreen narrative, SEO, and canonical.
//
// THE TRUST BUNDLE STAYS A PRODUCER ARTIFACT. Every claim card, every quick-answer
// Q&A, the compiler version, the compiled-on date, and the input counts still render
// from the synced llm-wiki bundle (src/data/trust-bundle via @/lib/trust-bundle) —
// nothing from that bundle was copied into content/. content/ owns only the page's own
// copy: title/description, the two block headings, and the verify-hub CTA.
//
// FAQ: the single FAQPage node on this route is the bundle's own `faqPageSchema`, and
// the visible Q&A (TrustFaqBlock) renders from the same bundle array — one source for
// HTML + JSON-LD. `suppressCmsFaq` keeps PageJsonLdCombined from adding a second one.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import TrustClaimBlock from "@/components/trust/TrustClaimBlock";
import TrustFaqBlock from "@/components/trust/TrustFaqBlock";
import {
  loadStaticPage,
  staticRouteCanonical,
  type StaticPage,
} from "@/lib/static-content";
import {
  faqPageSchema,
  touristTripSchema,
  trustManifest,
} from "@/lib/trust-bundle";

export const revalidate = 86400;

const ROUTE = "/trust";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";

// ─── Content access helpers (throw at build so missing copy fails SSG rather than
//     silently dropping narrative — parity with the destinations/why-jvto hubs). ───
type Section = NonNullable<StaticPage["sections"]>[number];

function requireSection(page: StaticPage, id: string): Section {
  const sec = page.sections?.find((s) => s.id === id);
  if (!sec) {
    throw new Error(
      `/trust: required section "${id}" missing from content/pages/trust/index.json`,
    );
  }
  return sec;
}

function sectionText(sec: Section, key: string): string {
  const v = (sec as Record<string, unknown>)[key];
  if (typeof v !== "string" || v.length === 0) {
    throw new Error(`/trust: section "${sec.id}" is missing text field "${key}"`);
  }
  return v;
}

function gridItems<T>(sec: Section, role: string): T[] {
  const block = (sec.blocks ?? []).find(
    (b) => b.type === "grid" && (b as Record<string, unknown>).role === role,
  );
  if (!block) {
    throw new Error(`/trust: section "${sec.id}" is missing its grid block (role="${role}")`);
  }
  return (block as { items: unknown[] }).items as T[];
}

/** Minimal PageRowLike so PageJsonLdCombined emits WebPage/breadcrumbs for a static page. */
function staticPageRow(page: StaticPage) {
  return {
    route: page.meta.route,
    lang: "en",
    seo: {
      title: page.meta.browserTitle ?? page.meta.title,
      description: page.meta.description,
      schema_type: page.meta.schemaTypes.find((t) => t !== "WebPage") ?? null,
    },
    content: { h1: page.meta.title },
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published") return { title: "Page Not Found" };
  const title = page.meta.browserTitle ?? page.meta.title;
  const description = page.meta.description;
  return {
    title,
    description,
    alternates: { canonical: staticRouteCanonical(ROUTE) },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${ROUTE}`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `${siteUrl}/assets/img/og/default.jpg`,
          width: 1200,
          height: 630,
          alt: page.meta.title,
        },
      ],
    },
  };
}

export default async function TrustPage() {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published" || !page.sections?.length) {
    return notFound();
  }

  const bundle = requireSection(page, "bundle");
  const cta = requireSection(page, "cta");
  const headings = new Map(
    gridItems<{ key: string; heading: string }>(bundle, "block-headings").map((h) => [
      h.key,
      h.heading,
    ]),
  );
  const blockHeading = (key: string): string => {
    const heading = headings.get(key);
    if (!heading) {
      throw new Error(`/trust: section "bundle" has no block heading for "${key}"`);
    }
    return heading;
  };
  const ctaLinks = gridItems<{ key: string; href: string; label: string }>(cta, "cta-links");

  // Producer data — unchanged: schemas + claims + FAQ all come from the trust bundle.
  const touristTrips = Array.isArray(touristTripSchema)
    ? touristTripSchema
    : [touristTripSchema];

  const extraSchemas = [faqPageSchema, ...touristTrips];

  return (
    <>
      <PageJsonLdCombined
        pageRow={staticPageRow(page)}
        extraSchemas={extraSchemas}
        suppressCmsFaq={true}
      />

      <header className="bg-jvto-navy text-white py-16 px-6 md:px-10 pt-32 mt-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-jvto-lime mb-3">
            {sectionText(bundle, "eyebrow_label")} · v{trustManifest.compiler_version}
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
            {page.meta.title}
          </h1>
          <p className="mt-5 text-base md:text-lg text-white/80 max-w-2xl">
            {page.lede?.[0] ?? page.meta.description}
          </p>
          <p className="mt-3 text-xs text-white/50">
            Compiled {trustManifest.compiled_at.slice(0, 10)} from {trustManifest.inputs.claims} claims,{" "}
            {trustManifest.inputs.evidence} evidence items, {trustManifest.inputs.entities} entities.
          </p>
        </div>
      </header>

      <TrustClaimBlock heading={blockHeading("claims")} />
      <TrustFaqBlock heading={blockHeading("faq")} />

      <section className="bg-jvto-navy text-white py-12 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-semibold">
            {sectionText(cta, "title")}
          </h2>
          <p className="mt-3 text-white/80">
            {sectionText(cta, "body_text")}
          </p>
          {ctaLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="inline-block mt-6 bg-jvto-orange text-jvto-navy font-semibold px-6 py-3 rounded hover:bg-jvto-lime transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
