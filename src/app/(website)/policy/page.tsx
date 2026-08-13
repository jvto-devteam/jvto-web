import {
  generatePolicyEcosystemMetadata,
  PolicyEcosystemPage,
} from "./PolicyEcosystemPage";

const ROUTE = "/policy";

export const revalidate = 300;

export async function generateMetadata() {
  return generatePolicyEcosystemMetadata(ROUTE);
}

export default async function PolicyHubPage() {
  return <PolicyEcosystemPage route={ROUTE} />;
}
