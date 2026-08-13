import {
  generateTravelGuideEcosystemMetadata,
  TravelGuideEcosystemPage,
} from "../EcosystemTravelGuidePage";
const ROUTE = "/travel-guide/mount-bromo-logistics";

export const revalidate = 300;

export function generateMetadata() {
  return generateTravelGuideEcosystemMetadata(ROUTE);
}

export default function MountBromoLogisticsPage() {
  return <TravelGuideEcosystemPage route={ROUTE} eyebrow="Logistics" />;
}
