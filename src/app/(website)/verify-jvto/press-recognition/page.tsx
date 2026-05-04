import { getDocsByGroup } from "@/lib/data-loader";
import VerifyJvtoClient from "../VerifyJvtoClient";
import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { buildVerifySubpageSchema } from "../schema";
import { resolveFaqsForPage, buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";

export const revalidate = 86400;

const fallbackSeo = {
  title: "Verify: Press Recognition",
  h1: "Press Recognition",
  description:
    "Media coverage and recognition received by JVTO in various publications and platforms.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/verify-jvto/press-recognition", fallbackSeo);
  return { title: seo.title, description: seo.description };
}

export default async function PressRecognitionPage() {
  const seo = await getPageSeo("/verify-jvto/press-recognition", fallbackSeo);
  const docs = getDocsByGroup("pressRecognition");
  // Phase 5 (2026-04-29): canonical FAQ via resolver. /verify-jvto/press-recognition has 1 narrative_claim wired
  // → narrative_claims overrides PRESS_RECOGNITION_FAQS canonical → suppresses CMS FAQ.
  const faqResolution = await resolveFaqsForPage("/verify-jvto/press-recognition");
  const faqResolvedNode = buildResolvedFaqSchema(faqResolution, "/verify-jvto/press-recognition");
  const pageRow = seo.row
    ? {
        route: seo.row.route,
        lang: seo.row.lang,
        seo: seo.row.seo,
        content: seo.row.content,
        created_at: seo.row.created_at,
        updated_at: seo.row.updated_at,
      }
    : {
        route: "/verify-jvto/press-recognition",
        lang: "en",
        seo: {
          title: seo.title,
          description: seo.description,
        },
        content: {
          h1: seo.h1,
        },
      };
  return (
    <>
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[
          buildVerifySubpageSchema({
            pathname: "/verify-jvto/press-recognition",
            title: seo.title,
            description: seo.description,
            breadcrumbLabel: seo.h1,
            docs,
          }),
          // Phase 5 (2026-04-29): resolver-driven canonical FAQ. Per cluster_role_contracts.md Cluster 4 /press-recognition MH.
          faqResolvedNode,
        ]}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
      />
      <VerifyJvtoClient
        initialDocs={docs}
        groupTitle={seo.h1}
        heroTitle={seo.h1}
        heroDescription={seo.description}
      />
    </>
  );
}
