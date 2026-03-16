import { getDocsByGroup } from "@/lib/data-loader";
import VerifyJvtoClient from "../VerifyJvtoClient";
import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/getPageSeo";
import StructuredData from "@/components/website/StructuredData";
import { buildVerifySubpageSchema } from "../schema";

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
  return (
    <>
      <StructuredData
        data={buildVerifySubpageSchema({
          pathname: "/verify-jvto/press-recognition",
          title: seo.title,
          description: seo.description,
          breadcrumbLabel: seo.h1,
          docs,
        })}
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
