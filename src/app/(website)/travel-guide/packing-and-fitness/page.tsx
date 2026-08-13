import {
  generateTravelGuideEcosystemMetadata,
  TravelGuideEcosystemPage,
} from "../EcosystemTravelGuidePage";
const ROUTE = "/travel-guide/packing-and-fitness";

export const revalidate = 300;

export function generateMetadata() {
  return generateTravelGuideEcosystemMetadata(ROUTE);
}

export default function PackingAndFitnessPage() {
  return <TravelGuideEcosystemPage route={ROUTE} eyebrow="Preparation" />;
}
