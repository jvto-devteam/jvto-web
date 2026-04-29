import { getDocsByGroup } from "@/lib/data-loader";
import VerifyJvtoClient from "../VerifyJvtoClient";
import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { buildVerifySubpageSchema } from "../schema";
import { POLICE_SAFETY_DIGITAL_DOCUMENTS } from "@/lib/schemas/buildVerifySchemas";
import { resolveFaqsForPage, buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";

const fallbackSeo = {
  title: "Verify: Police Authority & Safety Protocols",
  h1: "Police & Safety",
  description:
    "Forensic evidence of Tourist Police integration, health screening, and operational safety.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/verify-jvto/police-safety", fallbackSeo);
  return { title: seo.title, description: seo.description };
}

export default async function PoliceSafetyPage() {
  const seo = await getPageSeo("/verify-jvto/police-safety", fallbackSeo);
  const docs = getDocsByGroup("policeSafety");
  // Phase 5 (2026-04-29): canonical FAQ via resolver. /verify-jvto/police-safety has 0 narrative_claims
  // → falls through to POLICE_SAFETY_FAQS canonical (3 Q) → suppresses CMS FAQ.
  const faqResolution = await resolveFaqsForPage("/verify-jvto/police-safety");
  const faqResolvedNode = buildResolvedFaqSchema(faqResolution, "/verify-jvto/police-safety");
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
        route: "/verify-jvto/police-safety",
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
            pathname: "/verify-jvto/police-safety",
            title: seo.title,
            description: seo.description,
            breadcrumbLabel: seo.h1,
            docs,
          }),
          // AEO/GEO port (2026-04-29): canonical DigitalDocument chain (SPRIN-POLPAR + SPRIN-WAL-TRAVEL)
          // cross-ref to founder (#agung-sambuko). Per cluster_role_contracts.md Cluster 4 /police-safety MH.
          ...POLICE_SAFETY_DIGITAL_DOCUMENTS,
          // Phase 5: resolver-driven canonical FAQ.
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
