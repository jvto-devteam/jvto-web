import {
  generatePolicyEcosystemMetadata,
  PolicyEcosystemPage,
} from "../PolicyEcosystemPage";

const ROUTE = "/policy/privacy";

export const revalidate = 300;

export function generateMetadata() {
  return generatePolicyEcosystemMetadata(ROUTE);
}

export default function PrivacyPage() {
  return <PolicyEcosystemPage route={ROUTE} />;
}
