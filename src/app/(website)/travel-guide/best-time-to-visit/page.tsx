import {
  generateTravelGuideEcosystemMetadata,
  TravelGuideEcosystemPage,
} from "../EcosystemTravelGuidePage";
import { ECOSYSTEM_CONTENT_REVALIDATE_SECONDS } from "@/lib/ecosystemContent/website";

const ROUTE = "/travel-guide/best-time-to-visit";

export const revalidate = ECOSYSTEM_CONTENT_REVALIDATE_SECONDS;

export function generateMetadata() {
  return generateTravelGuideEcosystemMetadata(ROUTE);
}

export default function BestTimeToVisitPage() {
  return <TravelGuideEcosystemPage route={ROUTE} eyebrow="Seasonal Planning" />;
}
