import {
  EcosystemContentPage,
  generateEcosystemContentMetadata,
} from "../../_ecosystem/EcosystemContentPage";
import {
  buildJvtoTravelCreditAnnouncementSchema,
  buildPolicyWebPageSchema,
  POLICY_SLUG_MENTIONS,
} from "@/lib/schemas/buildPolicySchemas";

const SLUG = "booking-payment-cancellation";
const ROUTE = `/policy/${SLUG}`;

export const revalidate = 300;

export async function generateMetadata() {
  return generateEcosystemContentMetadata(ROUTE);
}

export default function BookingPaymentCancellationPage() {
  return (
    <EcosystemContentPage
      route={ROUTE}
      sectionLabel="Policy"
      eyebrow="Policy - Booking"
      navBase="/policy"
      extraSchemas={[
        buildPolicyWebPageSchema({
          subpath: SLUG,
          name: "Booking, Payment & Cancellation Policy - JVTO",
          description:
            "How bookings are confirmed, what payment is due and when, and exactly what happens if plans change.",
          mentionsTermIds: POLICY_SLUG_MENTIONS[SLUG] ?? [],
        }),
        buildJvtoTravelCreditAnnouncementSchema(),
      ]}
      cta={{
        title: "Questions before you book?",
        primaryHref: "/tours",
        primaryLabel: "Explore tours",
        secondaryHref: "https://wa.me/6282244788833",
        secondaryLabel: "Contact WhatsApp",
      }}
    />
  );
}
