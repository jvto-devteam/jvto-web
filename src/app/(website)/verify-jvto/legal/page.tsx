// src/app/(website)/verify-jvto/legal/page.tsx
//
// PACKAGE 06 (2026-08-06): served from the static-content SSOT
// (content/pages/verify-jvto/legal.json). Copy, SEO, and FAQ come from content/;
// this file keeps only layout + the JSON-LD projection. The evidence locker
// (VerifyJvtoClient + getDocsByGroup) remains its own Master_Dataset SSOT.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VerifyJvtoClient from "../VerifyJvtoClient";
import VerifyNarrative, { staticPageRow, buildStaticFaqSchema } from "../verifyShared";
import { getDocsByGroup } from "@/lib/data-loader";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { buildVerifySubpageSchema } from "../schema";
import { LEGAL_DIGITAL_DOCUMENTS, DOCTOR_SCHEMA } from "@/lib/schemas/buildVerifySchemas";
import { BBKSDA_REGULATION_SCHEMA } from "@/lib/schemas/entityGraph";
import { loadStaticPage } from "@/lib/static-content";

export const revalidate = 86400;

const ROUTE = "/verify-jvto/legal";
const BREADCRUMB_LABEL = "Legal & Licenses";

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published") return { title: "Page Not Found" };
  return {
    title: page.meta.browserTitle ?? page.meta.title,
    description: page.meta.description,
  };
}

export default async function VerifyLegalPage() {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published" || !page.sections?.length) {
    return notFound();
  }

  const docs = getDocsByGroup("legal");
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
    ...LEGAL_DIGITAL_DOCUMENTS,
    DOCTOR_SCHEMA,
    BBKSDA_REGULATION_SCHEMA,
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
