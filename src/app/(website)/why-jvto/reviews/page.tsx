import {
  EcosystemContentPage,
  generateEcosystemContentMetadata,
} from "../../_ecosystem/EcosystemContentPage";

const ROUTE = "/why-jvto/reviews";

export const revalidate = 300;

export async function generateMetadata() {
  return generateEcosystemContentMetadata(ROUTE);
}

export default function ReviewsPage() {
  return (
    <EcosystemContentPage
      route={ROUTE}
      sectionLabel="Why JVTO"
      eyebrow="Why JVTO - Reviews"
      navBase="/why-jvto"
      cta={{
        title: "Read the proof behind the promise.",
        primaryHref: "/verify-jvto",
        primaryLabel: "Verify JVTO",
        secondaryHref: "/why-jvto/our-team",
        secondaryLabel: "Crew profiles",
      }}
    />
  );
}
