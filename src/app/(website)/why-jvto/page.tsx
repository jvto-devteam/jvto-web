import {
  EcosystemContentPage,
  generateEcosystemContentMetadata,
} from "../_ecosystem/EcosystemContentPage";

const ROUTE = "/why-jvto";

export const revalidate = 300;

export async function generateMetadata() {
  return generateEcosystemContentMetadata(ROUTE, "website");
}

export default function WhyJvtoPage() {
  return (
    <EcosystemContentPage
      route={ROUTE}
      sectionLabel="Why JVTO"
      eyebrow="Why JVTO - Hub"
      navBase="/why-jvto"
      cta={{
        title: "Verify before you book.",
        primaryHref: "/verify-jvto",
        primaryLabel: "Open proof library",
        secondaryHref: "/tours",
        secondaryLabel: "Explore tours",
      }}
    />
  );
}
