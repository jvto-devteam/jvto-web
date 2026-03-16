import { getDocsByGroup } from "@/lib/data-loader";
import VerifyJvtoClient from "../VerifyJvtoClient";
import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/getPageSeo";

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
  return (
    <VerifyJvtoClient
      initialDocs={docs}
      groupTitle={seo.h1}
      heroTitle={seo.h1}
      heroDescription={seo.description}
    />
  );
}
