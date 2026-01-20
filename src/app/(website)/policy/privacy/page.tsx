// src/app/(website)/policy/privacy/page.tsx
import Link from "next/link";
import { type Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Privacy Policy | Java Volcano Tour Operator",
  description:
    "Official Privacy Policy for Java Volcano Tour Operator (JVTO). Learn how we protect and handle your personal data.",
  openGraph: {
    title: "Privacy Policy | Java Volcano Tour Operator",
    description:
      "Official Privacy Policy for Java Volcano Tour Operator (JVTO). Learn how we protect and handle your personal data.",
    url: `${siteUrl}/policy/privacy`,
    siteName: "Java Volcano Tour Operator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteUrl + "/assets/img/og/privacy-policy.webp",
        width: 1200,
        height: 630,
        alt: "Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Java Volcano Tour Operator",
    description:
      "Official Privacy Policy for Java Volcano Tour Operator (JVTO). Learn how we protect and handle your personal data.",
    images: [siteUrl + "/assets/img/og/privacy-policy.webp"],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Breadcrumb Navigation */}
            <nav className="mb-8 text-center text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link href="/policy" className="hover:text-primary">
                Policy
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground font-medium">
                Privacy Policy
              </span>
            </nav>

            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="font-black text-2xl md:text-5xl mb-4">
                Privacy Policy
              </h1>
              <p className="text-sm text-muted-foreground">
                Last Updated: 17 January 2026
              </p>
              <p className="mt-4 text-lg text-foreground">
                This policy explains what personal data JVTO collects, why it is
                collected, how it is used, and when it may be shared to operate
                your tour booking and comply with applicable requirements.
              </p>
            </div>

            <div className="prose prose-lg max-w-none mx-auto text-muted-foreground">
              {/* Section 1 */}
              <div className="mb-8">
                <h2 className="heading-md text-2xl mb-4 text-foreground">
                  1. What Data We Collect
                </h2>
                <p className="mb-4">
                  JVTO may collect the following categories of data, depending
                  on your booking and itinerary requirements:
                </p>

                <h3 className="text-xl font-bold mt-6 mb-2 text-foreground">
                  Contact and booking details (lead guest):
                </h3>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>WhatsApp/mobile number</li>
                  <li>
                    Booking references and tour details needed to deliver
                    services
                  </li>
                </ul>

                <h3 className="text-xl font-bold mt-6 mb-2 text-foreground">
                  Participant details (where required):
                </h3>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Guest list for accommodation and permits</li>
                  <li>
                    Passport/ID details and date of birth where required for
                    permits, tickets, or legal compliance
                  </li>
                  <li>
                    Pickup/drop-off details, rooming preferences, and
                    operational notes required to deliver services
                  </li>
                </ul>

                <h3 className="text-xl font-bold mt-6 mb-2 text-foreground">
                  Safety and logistics information (where relevant):
                </h3>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>
                    Dietary needs and relevant health information provided by
                    you for safety planning and operational coordination (only
                    where necessary)
                  </li>
                </ul>
              </div>

              {/* Section 2 */}
              <div className="mb-8">
                <h2 className="heading-md text-2xl mb-4 text-foreground">
                  2. Why We Collect and Use Your Data
                </h2>
                <p className="mb-4">JVTO uses personal data to:</p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>
                    Issue and deliver your Official E-Voucher / Invoice (PDF)
                    and manage your booking
                  </li>
                  <li>
                    Coordinate logistics before and during your tour (pickup
                    timing, accommodation, vehicles, guides, route planning)
                  </li>
                  <li>Provide customer support and operational assistance</li>
                  <li>
                    Meet legal, permit, ticketing, and accommodation
                    registration requirements where applicable
                  </li>
                  <li>
                    Support safety processes and emergency response coordination
                    where needed
                  </li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="mb-8">
                <h2 className="heading-md text-2xl mb-4 text-foreground">
                  3. When We Share Your Data
                </h2>
                <p className="mb-4">
                  JVTO shares personal data only when required to deliver the
                  booked services or comply with applicable requirements. This
                  may include sharing necessary details with:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>
                    Accommodation partners (for check-in/registration and
                    rooming)
                  </li>
                  <li>
                    Drivers, escort guides, local site guides, and operational
                    teams (for coordination and guest support)
                  </li>
                  <li>
                    Ticketing/permit partners and local authorities where
                    permits or entry requirements apply
                  </li>
                  <li>
                    Medical screening providers or approved facilities where
                    mandatory screening applies (e.g., where required by
                    authorities for specific sites)
                  </li>
                </ul>
                <p className="mb-4">
                  JVTO does not share data beyond what is necessary for the
                  specific operational purpose.
                </p>
              </div>

              {/* Section 4 */}
              <div className="mb-8">
                <h2 className="heading-md text-2xl mb-4 text-foreground">
                  4. Payment Data
                </h2>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>
                    Card payments are processed through a secure checkout and
                    authorised payment gateway.
                  </li>
                  <li>
                    JVTO does not store full card numbers, CVV codes, or online
                    banking passwords.
                  </li>
                </ul>
              </div>

              {/* Section 5 */}
              <div className="mb-8">
                <h2 className="heading-md text-2xl mb-4 text-foreground">
                  5. Data Protection and Access
                </h2>
                <p className="mb-4">
                  JVTO applies internal controls to protect personal data and
                  limits access to authorised personnel and partners only when
                  needed for service delivery.
                </p>
              </div>

              {/* Section 6 */}
              <div className="mb-8">
                <h2 className="heading-md text-2xl mb-4 text-foreground">
                  6. Contact
                </h2>
                <p className="mb-4">
                  For privacy or data-related requests, contact:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg my-4">
                  <p className="font-semibold">
                    PT Java Volcano Rendezvous (JVTO)
                  </p>
                  <p>
                    Jl. Khairil Anwar No.102 A, Badean, Bondowoso, East Java
                    68214, Indonesia.
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">WhatsApp:</span> +62
                    822-4478-8833
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    hello@javavolcano-touroperator.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
