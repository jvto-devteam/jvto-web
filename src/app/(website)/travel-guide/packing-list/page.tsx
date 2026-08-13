import {
  generateTravelGuideEcosystemMetadata,
  TravelGuideEcosystemPage,
} from "../EcosystemTravelGuidePage";
const ROUTE = "/travel-guide/packing-list";

export const revalidate = 300;

export function generateMetadata() {
  return generateTravelGuideEcosystemMetadata(ROUTE);
}

export default function PackingListPage() {
  return <TravelGuideEcosystemPage route={ROUTE} />;
}
