import {
  generatePolicyEcosystemMetadata,
  PolicyEcosystemPage,
} from "../PolicyEcosystemPage";

const ROUTE = "/policy/inclusions-exclusions";

export const revalidate = 300;

export function generateMetadata() {
  return generatePolicyEcosystemMetadata(ROUTE);
}

export default function InclusionsExclusionsPage() {
  return <PolicyEcosystemPage route={ROUTE} />;
}
