import {
  generateTravelGuideEcosystemMetadata,
  TravelGuideEcosystemPage,
} from "../EcosystemTravelGuidePage";
const ROUTE = "/travel-guide/weather-and-closures";

export const revalidate = 300;

export function generateMetadata() {
  return generateTravelGuideEcosystemMetadata(ROUTE);
}

export default function WeatherAndClosuresPage() {
  return <TravelGuideEcosystemPage route={ROUTE} eyebrow="Conditions" />;
}
