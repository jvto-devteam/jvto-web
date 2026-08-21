import { notFound } from "next/navigation";
import {
  generateTravelGuideEcosystemMetadata,
  TravelGuideEcosystemPage,
} from "../EcosystemTravelGuidePage";
import { getEcosystemWebsiteRoutes } from "@/lib/ecosystemContent/website";

type Props = {
  params: Promise<{ slug: string }>;
};

const FOLDER_ROUTED_SLUGS = new Set([
  "best-time-to-visit",
  "booking-information",
  "faq",
  "ijen-health-screening",
  "mount-bromo-logistics",
  "packing-and-fitness",
  "police-escort-for-groups",
  "rijik-monthly-closure",
  "safety-on-tours",
  "tumpak-sewu-logistics",
  "weather-and-closures",
]);

export const revalidate = 300;
// dynamicParams = true (2026-08-21). See why-jvto/our-team/[slug] for the full
// account: with false, any path evicted from the cache 404s instead of
// re-rendering, because Next no longer holds the build-time param list at
// runtime. These routes are all in ekosistem's revalidation set, so every
// ekosistem deploy could evict them and turn live pages into 404s. Unknown
// slugs still 404 through the notFound() guard below, which checks the real
// content source rather than the build list.
export const dynamicParams = true;

export async function generateStaticParams() {
  const index = await getEcosystemWebsiteRoutes();
  return (index.routes ?? [])
    .map((item) => item.route)
    .filter((route) => route.startsWith("/travel-guide/"))
    .map((route) => route.replace("/travel-guide/", ""))
    .filter((slug) => !slug.includes("/") && !FOLDER_ROUTED_SLUGS.has(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return generateTravelGuideEcosystemMetadata(`/travel-guide/${slug}`);
}

export default async function TravelGuideDynamicPage({ params }: Props) {
  const { slug } = await params;
  if (FOLDER_ROUTED_SLUGS.has(slug)) return notFound();
  return <TravelGuideEcosystemPage route={`/travel-guide/${slug}`} />;
}
