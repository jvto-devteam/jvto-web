import { notFound } from "next/navigation";
import {
  generateTravelGuideEcosystemMetadata,
  TravelGuideEcosystemPage,
} from "../EcosystemTravelGuidePage";
import {
  ECOSYSTEM_CONTENT_REVALIDATE_SECONDS,
  getEcosystemWebsiteRoutes,
} from "@/lib/ecosystemContent/website";

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
  "packing-list",
  "police-escort-for-groups",
  "rijik-monthly-closure",
  "safety-on-tours",
  "tumpak-sewu-logistics",
  "weather-and-closures",
]);

export const revalidate = ECOSYSTEM_CONTENT_REVALIDATE_SECONDS;
export const dynamicParams = false;

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
