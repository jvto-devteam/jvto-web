// src/app/(website)/verify-jvto/legal/page.tsx
import { getDocsByGroup } from "@/lib/data-loader";
import VerifyJvtoClient from "../VerifyJvtoClient";
import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { buildVerifySubpageSchema } from "../schema";
import {
  buildVerifyFaqSchema,
  LEGAL_DIGITAL_DOCUMENTS,
} from "@/lib/schemas/buildVerifySchemas";
import { LEGAL_FAQS } from "@/lib/verifyFaqs";

const fallbackSeo = {
  title: "Verify: Legal Documents",
  h1: "Legal Documents",
  description:
    "Verify NIB, TDUP, and official business registrations of PT Java Volcano Rendezvous.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/verify-jvto/legal", fallbackSeo);
  return { title: seo.title, description: seo.description };
}

export default async function LegalPage() {
  const seo = await getPageSeo("/verify-jvto/legal", fallbackSeo);
  const docs = getDocsByGroup("legal");
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
        route: "/verify-jvto/legal",
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
            pathname: "/verify-jvto/legal",
            title: seo.title,
            description: seo.description,
            breadcrumbLabel: seo.h1,
            docs,
          }),
          // AEO/GEO port (2026-04-29): canonical DigitalDocument chain (NIB/TDUP/HPWKI)
          // with DefinedTerm cross-refs (#term-nib/#term-tdup/#term-hpwki) + canonical Q&A.
          // Per cluster_role_contracts.md Cluster 4 /legal MH.
          ...LEGAL_DIGITAL_DOCUMENTS,
          buildVerifyFaqSchema(LEGAL_FAQS, "legal"),
        ]}
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
