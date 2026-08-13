import {
  EcosystemContentPage,
  generateEcosystemContentMetadata,
} from "../../_ecosystem/EcosystemContentPage";

const ROUTE = "/why-jvto/our-story";

export const revalidate = 300;

export async function generateMetadata() {
  return generateEcosystemContentMetadata(ROUTE);
}

export default function OurStoryPage() {
  return (
    <EcosystemContentPage
      route={ROUTE}
      sectionLabel="Why JVTO"
      eyebrow="Why JVTO - Story"
      navBase="/why-jvto"
    />
  );
}
