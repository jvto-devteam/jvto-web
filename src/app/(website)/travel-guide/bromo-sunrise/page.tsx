import type { Metadata } from "next";
import { getContentPage } from "@/lib/content/getContentPage";
import { AGENT_GUIDES } from "@/lib/content/agentGuides";
import { AgentGuideBody } from "../AgentGuide";

const SLUG = "bromo-sunrise";
const guide = AGENT_GUIDES[SLUG];
const ROUTE = guide.route;

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const row = await getContentPage(ROUTE, "en");
  const seo = (row?.seo as Record<string, any> | null) ?? {};
  return {
    title: seo.title ?? `${guide.title} | JVTO`,
    description: seo.description ?? guide.description,
  };
}

export default async function Page() {
  const row = await getContentPage(ROUTE, "en");
  const pageRow = row ?? {
    route: ROUTE,
    lang: "en",
    seo: { title: `${guide.title} | JVTO`, description: guide.description },
    content: { h1: guide.h1 },
  };
  return <AgentGuideBody guide={guide} pageRow={pageRow as any} />;
}
