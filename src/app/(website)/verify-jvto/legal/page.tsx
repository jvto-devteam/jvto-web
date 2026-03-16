// src/app/(website)/verify-jvto/legal/page.tsx
import { getDocsByGroup } from "@/lib/data-loader";
import VerifyJvtoClient from "../VerifyJvtoClient";
import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/getPageSeo";
import StructuredData from "@/components/website/StructuredData";
import { buildVerifySubpageSchema } from "../schema";

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
  return (
    <>
      <StructuredData
        data={buildVerifySubpageSchema({
          pathname: "/verify-jvto/legal",
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
