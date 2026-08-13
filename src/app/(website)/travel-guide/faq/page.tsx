import {
  generateTravelGuideEcosystemMetadata,
  TravelGuideEcosystemPage,
} from "../EcosystemTravelGuidePage";
const ROUTE = "/travel-guide/faq";

export const revalidate = 300;

export function generateMetadata() {
  return generateTravelGuideEcosystemMetadata(ROUTE, "website");
}

export default function FaqPage() {
  return <TravelGuideEcosystemPage route={ROUTE} eyebrow="Reference" />;
}
