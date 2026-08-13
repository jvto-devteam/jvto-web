import {
  generateTravelGuideEcosystemMetadata,
  TravelGuideEcosystemPage,
} from "../EcosystemTravelGuidePage";
import { ECOSYSTEM_CONTENT_REVALIDATE_SECONDS } from "@/lib/ecosystemContent/website";

const ROUTE = "/travel-guide/weather-and-closures";

export const revalidate = ECOSYSTEM_CONTENT_REVALIDATE_SECONDS;

export function generateMetadata() {
  return generateTravelGuideEcosystemMetadata(ROUTE);
}

export default function WeatherAndClosuresPage() {
  return <TravelGuideEcosystemPage route={ROUTE} eyebrow="Conditions" />;
}
