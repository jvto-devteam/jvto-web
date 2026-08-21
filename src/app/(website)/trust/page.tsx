import type { Metadata } from "next";
import Link from "next/link";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import TrustClaimBlock from "@/components/trust/TrustClaimBlock";
import TrustFaqBlock from "@/components/trust/TrustFaqBlock";
import { getEcosystemPageSeo } from "@/lib/content/getEcosystemPageSeo";
import { getEcosystemTrustClaims } from "@/lib/ecosystemContent/trustClaims";
import {
  buildTrustFaqPageSchema,
  touristTripSchema,
  trustManifest,
} from "@/lib/trust-bundle-schema";

export const revalidate = 86400;

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";

const fallbackSeo = {
  title: "Trust Bundle — Claims, Evidence, and Verification",
  h1: "Trust Bundle.",
  description:
    "Single-page index of JVTO's verifiable trust claims, evidence registry, and structured AEO/GEO signals. Compiled from the JVTO knowledge wiki.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getEcosystemPageSeo("/trust", fallbackSeo);
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${siteUrl}/trust`,
      languages: { en: `${siteUrl}/trust`, "x-default": `${siteUrl}/trust` },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${siteUrl}/trust`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `${siteUrl}/assets/img/og/default.jpg`,
          width: 1200,
          height: 630,
          alt: seo.h1,
        },
      ],
    },
  };
}

export default async function TrustPage() {
  const seo = await getEcosystemPageSeo("/trust", fallbackSeo);
  const pageRow = seo.row ?? {
    route: "/trust",
    lang: "en",
    seo: { title: seo.title, description: seo.description },
    content: { h1: seo.h1 },
  };

  const { claims: trustClaimsForByline, faq: trustFaqItems } =
    await getEcosystemTrustClaims();
  // Derived, not hand-maintained. trustManifest is a frozen snapshot whose own
  // comment says it must be updated by hand — so the byline read "Compiled
  // 2026-07-07" indefinitely, on a page whose entire premise is that the
  // verification is current, and its "18 evidence items" went stale the moment
  // the evidence set changed. These come from the live record instead.
  const claimCount = trustClaimsForByline.length;
  const evidenceCount = trustClaimsForByline.reduce(
    (total, claim) => total + (claim.evidence?.length ?? 0),
    0,
  );
  // The OLDEST date, deliberately. For a bundle, "last verified" honestly means
  // "every claim here has been checked at least since X" — taking the newest
  // would let one freshly-reviewed claim make the whole set look current.
  const lastVerified = trustClaimsForByline
    .map((claim) => claim.last_verified)
    .filter(Boolean)
    .sort()[0];
  const faqPageSchema = buildTrustFaqPageSchema(trustFaqItems);

  const touristTrips = Array.isArray(touristTripSchema)
    ? touristTripSchema
    : [touristTripSchema];

  const extraSchemas = [faqPageSchema, ...touristTrips];

  return (
    <>
      <PageJsonLdCombined
        pageRow={pageRow}
        extraSchemas={extraSchemas}
        suppressCmsFaq={true}
      />

      <header className="bg-jvto-navy text-white py-16 px-6 md:px-10 pt-32 mt-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-jvto-lime mb-3">
            Trust Bundle · v{trustManifest.compiler_version}
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
            {seo.h1}
          </h1>
          <p className="mt-5 text-base md:text-lg text-white/80 max-w-2xl">
            {seo.description}
          </p>
          <p className="mt-3 text-xs text-white/50">
            {claimCount} claims · {evidenceCount} evidence items
            {lastVerified ? ` · last verified ${lastVerified}` : ""}
          </p>
        </div>
      </header>

      <TrustClaimBlock heading="Claims We Stand Behind" />
      <TrustFaqBlock heading="Quick Answers" />

      <section className="bg-jvto-navy text-white py-12 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-semibold">
            Want the underlying proof?
          </h2>
          <p className="mt-3 text-white/80">
            The Verify hub holds the document evidence — NIB, TDUP, HPWKI, police credentials, and press coverage.
          </p>
          <Link
            href="/verify-jvto"
            className="inline-block mt-6 bg-jvto-orange text-jvto-navy font-semibold px-6 py-3 rounded hover:bg-jvto-lime transition-colors"
          >
            Open Verification Hub →
          </Link>
        </div>
      </section>
    </>
  );
}
