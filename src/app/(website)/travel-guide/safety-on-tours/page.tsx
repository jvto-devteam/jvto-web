import {
  generateTravelGuideEcosystemMetadata,
  TravelGuideEcosystemPage,
} from "../EcosystemTravelGuidePage";
const ROUTE = "/travel-guide/safety-on-tours";

export const revalidate = 300;

export function generateMetadata() {
  return generateTravelGuideEcosystemMetadata(ROUTE);
}

export default function SafetyOnToursPage() {
  return <TravelGuideEcosystemPage route={ROUTE} eyebrow="Safety" />;
}
