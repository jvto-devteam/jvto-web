import {
  EcosystemContentPage,
  generateEcosystemContentMetadata,
} from "../../_ecosystem/EcosystemContentPage";
import {
  buildPolicyWebPageSchema,
  POLICY_SLUG_MENTIONS,
} from "@/lib/schemas/buildPolicySchemas";

const SLUG = "inclusions-exclusions";
const ROUTE = `/policy/${SLUG}`;

export const revalidate = 300;

export async function generateMetadata() {
  return generateEcosystemContentMetadata(ROUTE);
}

export default function InclusionsExclusionsPage() {
  return (
    <EcosystemContentPage
      route={ROUTE}
      sectionLabel="Policy"
      eyebrow="Policy - Inclusions"
      navBase="/policy"
      extraSchemas={[
        buildPolicyWebPageSchema({
          subpath: SLUG,
          name: "Inclusions & Exclusions Policy - JVTO",
          description:
            "What is and is not included in a confirmed JVTO private tour package.",
          mentionsTermIds: POLICY_SLUG_MENTIONS[SLUG] ?? [],
        }),
      ]}
      cta={{
        title: "Know exactly what is included.",
        primaryHref: "/tours",
        primaryLabel: "Explore tours",
        secondaryHref: "/policy/booking-payment-cancellation",
        secondaryLabel: "Booking policy",
      }}
    />
  );
}
