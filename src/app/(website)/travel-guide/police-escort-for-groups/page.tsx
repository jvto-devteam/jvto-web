import {
  generateTravelGuideEcosystemMetadata,
  TravelGuideEcosystemPage,
} from "../EcosystemTravelGuidePage";
const ROUTE = "/travel-guide/police-escort-for-groups";

export const revalidate = 300;

export function generateMetadata() {
  return generateTravelGuideEcosystemMetadata(ROUTE);
}

export default function PoliceEscortForGroupsPage() {
  return <TravelGuideEcosystemPage route={ROUTE} />;
}
