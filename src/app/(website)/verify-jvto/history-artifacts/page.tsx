import { getDocsByGroup } from "@/lib/data-loader";
import VerifyJvtoClient from "../VerifyJvtoClient";
import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { buildVerifySubpageSchema } from "../schema";
import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";

const fallbackSeo = {
  title: "Verify: History Artifacts",
  h1: "History Artifacts",
  description:
    "Historical records and artifacts related to JVTO's operations and legacy.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/verify-jvto/history-artifacts", fallbackSeo);
  return buildWebsiteMetadata({
    title: seo.title,
    description: seo.description,
    path: "/verify-jvto/history-artifacts",
    image: "/assets/img/og/verify-jvto.webp",
    imageAlt: seo.h1,
  });
}

export default async function HistoryArtifactsPage() {
  const seo = await getPageSeo("/verify-jvto/history-artifacts", fallbackSeo);
  const docs = getDocsByGroup("historyArtifacts");
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
        route: "/verify-jvto/history-artifacts",
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
            pathname: "/verify-jvto/history-artifacts",
            title: seo.title,
            description: seo.description,
            breadcrumbLabel: seo.h1,
            docs,
          }),
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
