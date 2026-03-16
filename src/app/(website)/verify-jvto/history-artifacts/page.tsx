import { getDocsByGroup } from "@/lib/data-loader";
import VerifyJvtoClient from "../VerifyJvtoClient";
import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/getPageSeo";

const fallbackSeo = {
  title: "Verify: History Artifacts",
  h1: "History Artifacts",
  description:
    "Historical records and artifacts related to JVTO's operations and legacy.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/verify-jvto/history-artifacts", fallbackSeo);
  return { title: seo.title, description: seo.description };
}

export default async function HistoryArtifactsPage() {
  const seo = await getPageSeo("/verify-jvto/history-artifacts", fallbackSeo);
  const docs = getDocsByGroup("historyArtifacts");
  return (
    <VerifyJvtoClient
      initialDocs={docs}
      groupTitle={seo.h1}
      heroTitle={seo.h1}
      heroDescription={seo.description}
    />
  );
}
