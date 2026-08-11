// src/app/(website)/verify-jvto/police-safety/page.tsx
//
// PACKAGE 06 (2026-08-06): served from the static-content SSOT
// (content/pages/verify-jvto/police-safety.json). Copy, SEO, and FAQ come from
// content/; this file keeps only layout + the JSON-LD projection. The evidence
// locker (VerifyJvtoClient + getDocsByGroup) remains its own Master_Dataset SSOT.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VerifyJvtoClient from "../VerifyJvtoClient";
import VerifyNarrative, { staticPageRow, buildStaticFaqSchema } from "../verifyShared";
import { getDocsByGroup } from "@/lib/data-loader";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { buildVerifySubpageSchema } from "../schema";
import { POLICE_SAFETY_DIGITAL_DOCUMENTS } from "@/lib/schemas/buildVerifySchemas";
import { loadStaticPage, staticRouteCanonical } from "@/lib/static-content";

export const revalidate = 86400;

const ROUTE = "/verify-jvto/police-safety";
const BREADCRUMB_LABEL = "Police & Safety";

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published") return { title: "Page Not Found" };
  return {
    title: page.meta.browserTitle ?? page.meta.title,
    description: page.meta.description,
    alternates: { canonical: staticRouteCanonical(ROUTE) },
  };
}

export default async function VerifyPoliceSafetyPage() {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published" || !page.sections?.length) {
    return notFound();
  }

  const docs = getDocsByGroup("policeSafety");
  const faqItems = page.faq ?? [];
  const faqNode = faqItems.length ? buildStaticFaqSchema(ROUTE, faqItems) : null;

  const extraSchemas = [
    buildVerifySubpageSchema({
      pathname: ROUTE,
      title: page.meta.title,
      description: page.meta.description,
      breadcrumbLabel: BREADCRUMB_LABEL,
      docs,
    }),
    ...POLICE_SAFETY_DIGITAL_DOCUMENTS,
    faqNode,
  ].filter(Boolean);

  return (
    <>
      <PageJsonLdCombined
        pageRow={staticPageRow(page)}
        extraSchemas={extraSchemas}
        suppressCmsFaq
      />
      <VerifyJvtoClient
        initialDocs={docs}
        heroTitle={page.meta.title}
        heroDescription={page.lede?.[0]}
      />
      <VerifyNarrative page={page} />
    </>
  );
}
