import {
  EcosystemContentPage,
  generateEcosystemContentMetadata,
} from "../_ecosystem/EcosystemContentPage";
import { buildPolicyHubItemListSchema } from "@/lib/schemas/buildPolicySchemas";

const ROUTE = "/policy";

export const revalidate = 300;

export async function generateMetadata() {
  return generateEcosystemContentMetadata(ROUTE, "website");
}

export default function PolicyHubPage() {
  return (
    <EcosystemContentPage
      route={ROUTE}
      sectionLabel="Policy"
      eyebrow="Policy Hub"
      navBase="/policy"
      extraSchemas={[buildPolicyHubItemListSchema()]}
      cta={{
        title: "Clear terms before you book.",
        primaryHref: "/tours",
        primaryLabel: "Explore tours",
        secondaryHref: "/travel-guide/booking-information",
        secondaryLabel: "Booking guide",
      }}
    />
  );
}
