import {
  EcosystemContentPage,
  generateEcosystemContentMetadata,
} from "../../_ecosystem/EcosystemContentPage";
import {
  buildPolicyWebPageSchema,
  POLICY_SLUG_MENTIONS,
} from "@/lib/schemas/buildPolicySchemas";

const SLUG = "privacy";
const ROUTE = `/policy/${SLUG}`;

export const revalidate = 300;

export async function generateMetadata() {
  return generateEcosystemContentMetadata(ROUTE);
}

export default function PrivacyPolicyPage() {
  return (
    <EcosystemContentPage
      route={ROUTE}
      sectionLabel="Policy"
      eyebrow="Policy - Privacy"
      navBase="/policy"
      extraSchemas={[
        buildPolicyWebPageSchema({
          subpath: SLUG,
          name: "Privacy & Data Protection Policy - JVTO",
          description:
            "What personal data JVTO collects, why, how it is used, and when it may be shared.",
          mentionsTermIds: POLICY_SLUG_MENTIONS[SLUG] ?? [],
        }),
      ]}
      cta={{
        title: "Your data, handled carefully.",
        primaryHref: "/policy",
        primaryLabel: "All policies",
        secondaryHref: "https://wa.me/6282244788833",
        secondaryLabel: "Contact WhatsApp",
      }}
    />
  );
}
