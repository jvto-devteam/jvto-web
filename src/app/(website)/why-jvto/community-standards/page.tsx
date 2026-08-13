import {
  EcosystemContentPage,
  generateEcosystemContentMetadata,
} from "../../_ecosystem/EcosystemContentPage";

const ROUTE = "/why-jvto/community-standards";

export const revalidate = 300;

export async function generateMetadata() {
  return generateEcosystemContentMetadata(ROUTE);
}

export default function CommunityStandardsPage() {
  return (
    <EcosystemContentPage
      route={ROUTE}
      sectionLabel="Why JVTO"
      eyebrow="Why JVTO - Standards"
      navBase="/why-jvto"
    />
  );
}
