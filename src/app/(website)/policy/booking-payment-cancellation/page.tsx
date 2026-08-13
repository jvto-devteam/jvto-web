import {
  generatePolicyEcosystemMetadata,
  PolicyEcosystemPage,
} from "../PolicyEcosystemPage";

const ROUTE = "/policy/booking-payment-cancellation";

export const revalidate = 300;

export function generateMetadata() {
  return generatePolicyEcosystemMetadata(ROUTE);
}

export default function BookingPaymentCancellationPage() {
  return <PolicyEcosystemPage route={ROUTE} />;
}
