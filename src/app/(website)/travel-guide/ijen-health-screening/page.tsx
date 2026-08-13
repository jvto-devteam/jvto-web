import {
  generateTravelGuideEcosystemMetadata,
  TravelGuideEcosystemPage,
} from "../EcosystemTravelGuidePage";
const ROUTE = "/travel-guide/ijen-health-screening";

export const revalidate = 300;

export function generateMetadata() {
  return generateTravelGuideEcosystemMetadata(ROUTE);
}

export default function IjenHealthScreeningPage() {
  return <TravelGuideEcosystemPage route={ROUTE} />;
}
