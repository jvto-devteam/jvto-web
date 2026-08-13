import {
  generateTravelGuideEcosystemMetadata,
  TravelGuideEcosystemPage,
} from "../EcosystemTravelGuidePage";
const ROUTE = "/travel-guide/best-time-to-visit";

export const revalidate = 300;

export function generateMetadata() {
  return generateTravelGuideEcosystemMetadata(ROUTE);
}

export default function BestTimeToVisitPage() {
  return <TravelGuideEcosystemPage route={ROUTE} eyebrow="Seasonal Planning" />;
}
