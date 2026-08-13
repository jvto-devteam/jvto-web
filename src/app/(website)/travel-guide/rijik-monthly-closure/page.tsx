import {
  generateTravelGuideEcosystemMetadata,
  TravelGuideEcosystemPage,
} from "../EcosystemTravelGuidePage";
const ROUTE = "/travel-guide/rijik-monthly-closure";

export const revalidate = 300;

export function generateMetadata() {
  return generateTravelGuideEcosystemMetadata(ROUTE);
}

export default function RijikMonthlyClosurePage() {
  return <TravelGuideEcosystemPage route={ROUTE} />;
}
