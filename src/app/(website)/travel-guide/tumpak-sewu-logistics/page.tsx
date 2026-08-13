import {
  generateTravelGuideEcosystemMetadata,
  TravelGuideEcosystemPage,
} from "../EcosystemTravelGuidePage";
const ROUTE = "/travel-guide/tumpak-sewu-logistics";

export const revalidate = 300;

export function generateMetadata() {
  return generateTravelGuideEcosystemMetadata(ROUTE);
}

export default function TumpakSewuLogisticsPage() {
  return <TravelGuideEcosystemPage route={ROUTE} eyebrow="Logistics" />;
}
