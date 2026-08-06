// src/app/(website)/verify-jvto/press-recognition/page.tsx
//
// PACKAGE 06 (2026-08-06): served from the static-content SSOT
// (content/pages/verify-jvto/press-recognition.json). Copy, SEO, and FAQ come from
// content/; this file keeps only layout + the JSON-LD projection. The evidence
// locker (VerifyJvtoClient + getDocsByGroup) remains its own Master_Dataset SSOT.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VerifyJvtoClient from "../VerifyJvtoClient";
import VerifyNarrative, { staticPageRow, buildStaticFaqSchema } from "../verifyShared";
import { getDocsByGroup } from "@/lib/data-loader";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { buildVerifySubpageSchema } from "../schema";
import {
  PRESS_RECOGNITION_SCHEMAS,
  PRESS_ORGANIZATION_SUBJECTS,
} from "@/lib/schemas/buildVerifySchemas";
import { loadStaticPage } from "@/lib/static-content";

export const revalidate = 86400;

const ROUTE = "/verify-jvto/press-recognition";
const BREADCRUMB_LABEL = "Press & Recognition";

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published") return { title: "Page Not Found" };
  return {
    title: page.meta.browserTitle ?? page.meta.title,
    description: page.meta.description,
  };
}

export default async function VerifyPressRecognitionPage() {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published" || !page.sections?.length) {
    return notFound();
  }

  const docs = getDocsByGroup("pressRecognition");
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
    faqNode,
    ...PRESS_RECOGNITION_SCHEMAS,
    PRESS_ORGANIZATION_SUBJECTS,
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
