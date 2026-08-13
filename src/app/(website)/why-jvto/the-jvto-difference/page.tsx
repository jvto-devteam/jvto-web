import {
  EcosystemContentPage,
  generateEcosystemContentMetadata,
} from "../../_ecosystem/EcosystemContentPage";

const ROUTE = "/why-jvto/the-jvto-difference";

export const revalidate = 300;

export async function generateMetadata() {
  return generateEcosystemContentMetadata(ROUTE);
}

export default function TheJvtoDifferencePage() {
  return (
    <EcosystemContentPage
      route={ROUTE}
      sectionLabel="Why JVTO"
      eyebrow="Why JVTO - Difference"
      navBase="/why-jvto"
      cta={{
        title: "Proof you can check.",
        primaryHref: "/verify-jvto",
        primaryLabel: "Verify JVTO",
        secondaryHref: "/why-jvto/our-team",
        secondaryLabel: "Meet the team",
      }}
    />
  );
}
