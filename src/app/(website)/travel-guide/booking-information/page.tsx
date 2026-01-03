import StructuredData from "@/components/website/StructuredData";
import Link from "next/link";
import { type Metadata } from "next";
import Button from "@/components/website/UI/Button";
import { Check, ArrowRight } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Booking Information – How JVTO Private Tours Work",
  description: "Learn how private Bromo and Ijen tours with JVTO are booked, paid and changed. Clear rules on deposits, balance payments, cancellations and Travel Credit.",
  openGraph: {
    title: "Booking Information – How JVTO Private Tours Work",
    description: "Learn how private Bromo and Ijen tours with JVTO are booked, paid and changed. Clear rules on deposits, balance payments, cancellations and Travel Credit.",
    url: `${siteUrl}/travel-guide/booking-information`,
    siteName: "Java Volcano Tour Operator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteUrl + "/assets/img/og/booking-information.webp",
        width: 1200,
        height: 630,
        alt: "Booking Information",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Booking Information – How JVTO Private Tours Work",
    description: "Learn how private Bromo and Ijen tours with JVTO are booked, paid and changed. Clear rules on deposits, balance payments, cancellations and Travel Credit.",
    images: [siteUrl + "/assets/img/og/booking-information.webp"],
  },
};

export default function BookingInformationPage() {
  // Schema.org Data
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": "https://javavolcano-touroperator.com/#organization",
        name: "Java Volcano Tour Operator (JVTO)",
        alternateName: "JVTO",
        url: "https://javavolcano-touroperator.com",
        description:
          "Java Volcano Tour Operator (JVTO) is a registered Indonesian travel company based in Bondowoso and led by an active Tourist Police officer. We design private, all-inclusive itineraries to Mount Bromo, Ijen Crater and Tumpak Sewu with clear safety rules, transparent pricing and real local impact.",
        logo: "https://legacy.javavolcano-touroperator.com/assets/img/jvto-color.png",
        image: [
          siteUrl + "/assets/img/jvto-color.png",
          siteUrl + "/assets/img/hero/home.webp",
        ],
        email: "hello@javavolcano-touroperator.com",
        telephone: "+62 822-4478-8833",
        address: {
          "@type": "PostalAddress",
          streetAddress:
            "Jl. Khairil Anwar No.102 A, Badean, Kec. Bondowoso, Kabupaten Bondowoso, Jawa Timur 68214",
          postalCode: "68214",
          addressLocality: "Bondowoso",
          addressRegion: "East Java",
          addressCountry: "ID",
        },
        areaServed: [
          {
            "@type": "AdministrativeArea",
            name: "East Java",
          },
          {
            "@type": "Country",
            name: "Indonesia",
          },
          {
            "@type": "City",
            name: "Surabaya",
          },
          {
            "@type": "Place",
            name: "Bali",
          },
        ],
        identifier: [
          {
            "@type": "PropertyValue",
            name: "Business and tourism licence number",
            value: "1102230032918",
          },
        ],
        sameAs: [
          "https://maps.app.goo.gl/Hw9NjJdSRTuwWj6HA",
          "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
          "https://www.trustpilot.com/review/javavolcano-touroperator.com",
        ],
        founder: {
          "@type": "Person",
          name: "Agung Sambuko",
          alternateName: "Mr. Sam",
          jobTitle: "Founder & CEO",
          knowsAbout: [
            "TouristSafety",
            "EastJavaTourism",
            "VolcanoTrekking",
            "LogisticsManagement",
          ],
          description:
            "Founder of JVTO; active-duty Tourist Police officer in East Java; Supervisor in HPWKI.",
        },
        priceRange: "IDR 1.000.000 - IDR 9.050.000",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Saturday",
            opens: "07:30",
            closes: "17:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Sunday",
            opens: "08:00",
            closes: "17:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Monday",
            opens: "08:00",
            closes: "21:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Tuesday",
            opens: "08:00",
            closes: "21:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Wednesday",
            opens: "08:00",
            closes: "21:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Thursday",
            opens: "08:00",
            closes: "21:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Friday",
            opens: "08:00",
            closes: "21:00",
          },
        ],
        geo: {
          "@type": "GeoCoordinates",
          latitude: -7.9161788,
          longitude: 113.8085868,
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+62 822-4478-8833",
            email: "hello@javavolcano-touroperator.com",
            contactType: "customer support",
          },
        ],
        foundingDate: "2016-01-01",
        currenciesAccepted: "IDR",
        paymentAccepted: ["Credit Card", "Bank Transfer"],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "102",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://javavolcano-touroperator.com/#website",
        url: "https://javavolcano-touroperator.com",
        name: "Java Volcano Tour Operator",
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        inLanguage: "en",
      },
      {
        "@type": "WebPage",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/booking-information#webpage",
        url: "https://javavolcano-touroperator.com/travel-guide/booking-information",
        name: "Booking Information – How JVTO Private Tours Work",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/#website",
        },
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        datePublished: "2025-12-01",
        dateModified: "2025-12-01",
        lastReviewed: "2025-12-01",
        inLanguage: "en",
        description:
          "This page is a plain-language summary of the official JVTO Booking, Payment & Cancellation Policy and the Inclusions & Exclusions Policy. Your Official E-Voucher / Invoice is always the primary contract for your specific booking.",
        breadcrumb: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/booking-information#breadcrumb",
        },
        mainEntity: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/booking-information#booking-information",
        },
      },
      {
        "@type": "CreativeWork",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/booking-information#booking-information",
        url: "https://javavolcano-touroperator.com/travel-guide/booking-information",
        name: "Booking Information – How JVTO Private Tours Work",
        description:
          "This page is a plain-language summary of the official JVTO Booking, Payment & Cancellation Policy and the Inclusions & Exclusions Policy. Your Official E-Voucher / Invoice is always the primary contract for your specific booking.",
        provider: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        inLanguage: "en",
        isPartOf: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/booking-information#webpage",
        },
        mainEntityOfPage: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/booking-information#webpage",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/booking-information#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://javavolcano-touroperator.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Travel Guide",
            item: "https://javavolcano-touroperator.com/travel-guide",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Booking Information – How JVTO Private Tours Work",
            item: "https://javavolcano-touroperator.com/travel-guide/booking-information",
          },
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StructuredData data={schemaData} />

      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16 bg-accent border-b">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Breadcrumb Navigation */}
            <nav className="mb-8 text-center text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link href="/travel-guide" className="hover:text-primary">
                Travel Guide
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground font-medium">
                Booking Information
              </span>
            </nav>

            {/* Main Header */}
            <div className="text-center mb-12">
              <h1 className="font-black text-2xl md:text-5xl mb-6">
                Booking Information – How JVTO Private Tours Work
              </h1>
              
              {/* Disclaimer Box */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left rounded-r-lg">
                <p className="text-sm italic mb-2">
                  This page is informational. Binding terms are defined by the documents below.
                </p>
                <p className="font-semibold text-foreground mb-2">
                  Order of precedence (if there is any discrepancy):
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>Official E-Voucher / Invoice (PDF) (your booking-specific contract)</li>
                  <li>
                    <Link href="/policy/booking-cancellation" className="text-primary hover:underline">
                      Booking, Payment & Cancellation Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/policy/inclusions-exclusions" className="text-primary hover:underline">
                      Inclusions & Exclusions Policy
                    </Link>
                  </li>
                  <li>Travel Guide pages (informational)</li>
                </ol>
              </div>

              {/* Contact Help */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-left rounded-r-lg">
                <p className="font-semibold text-foreground mb-2">
                  Need help?
                </p>
                <p className="text-sm">
                  WhatsApp <a href="https://wa.me/6282244788833" className="text-primary hover:underline">+62 822-4478-8833</a> or email <a href="mailto:hello@javavolcano-touroperator.com" className="text-primary hover:underline">hello@javavolcano-touroperator.com</a>.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-12">
              {/* Section 1 */}
              <div id="private-tours-only" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  1) Private tours only & official channels
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    JVTO operates <span className="font-semibold">private, all-inclusive tours</span>.
                  </p>
                  <p>
                    For payment and booking safety, only use official channels:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>
                      Website (secure checkout): <a href="https://javavolcano-touroperator.com" className="text-primary hover:underline">https://javavolcano-touroperator.com</a>
                    </li>
                    <li>
                      WhatsApp: <a href="https://wa.me/6282244788833" className="text-primary hover:underline">+62 822-4478-8833</a>
                    </li>
                    <li>
                      Email: <a href="mailto:hello@javavolcano-touroperator.com" className="text-primary hover:underline">hello@javavolcano-touroperator.com</a>
                    </li>
                  </ul>
                  <p>
                    If you receive payment instructions that do not match JVTO's official channels, verify with JVTO before paying.
                  </p>
                </div>
              </div>

              {/* Section 2 */}
              <div id="confirmed-booking" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  2) What counts as a confirmed booking
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    A booking is confirmed only when:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>the required deposit or full payment is successfully processed; and</li>
                    <li>JVTO issues your <span className="font-semibold">Official E-Voucher / Invoice (PDF)</span>.</li>
                  </ul>
                  <p>
                    Screenshots, informal chat messages, or a quotation alone are not a confirmed booking.
                  </p>
                </div>
              </div>

              {/* Section 3 */}
              <div id="payments-summary" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  3) Payments: deposit, short notice, and balance deadlines (summary)
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-sm italic mb-2">
                      This section is a <span className="font-semibold">plain-English summary</span>. For binding terms, refer to the <Link href="/policy/booking-cancellation" className="text-primary hover:underline">Booking, Payment & Cancellation Policy</Link> and your <span className="font-semibold">Official E-Voucher / Invoice (PDF)</span>.
                    </p>
                  </div>
                  
                  <h3 className="text-xl font-bold mt-6 mb-2 text-foreground">
                    Deposit / full payment logic
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>
                      Standard bookings (Day 1 is <span className="font-semibold">14 days or more</span> from booking): <span className="font-semibold">20% deposit</span>
                    </li>
                    <li>
                      Short notice (Day 1 is <span className="font-semibold">less than 14 days</span> from booking): JVTO may require <span className="font-semibold">up to 100% (full payment)</span>.
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold mt-6 mb-2 text-foreground">
                    Balance payment deadlines (before Day 1)
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>Credit/debit card: <span className="font-semibold">5 days</span> before Day 1</li>
                    <li>Bank transfer / Wise: <span className="font-semibold">3 days</span> before Day 1</li>
                    <li>Cash (IDR) at JVTO office: only by written exception and must be paid before departure on Day 1.</li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div id="cancellations-travel-credit" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  4) Cancellations & travel credit (summary)
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-sm italic mb-2">
                      This section is a <span className="font-semibold">plain-English summary</span>. For binding terms, refer to the <Link href="/policy/booking-cancellation" className="text-primary hover:underline">Booking, Payment & Cancellation Policy</Link> and your <span className="font-semibold">Official E-Voucher / Invoice (PDF)</span>.
                    </p>
                  </div>
                  
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>
                      Guest cancellations <span className="font-semibold">48 hours or more</span> before Day 1: <span className="font-semibold">no cash refund</span>; JVTO issues <span className="font-semibold">travel credit</span> equivalent to payments received.
                    </li>
                    <li>
                      Guest cancellations <span className="font-semibold">less than 48 hours</span> before Day 1: up to <span className="font-semibold">100% forfeiture</span> (including no-show).
                    </li>
                  </ul>
                  
                  <p className="font-semibold text-foreground">
                    Travel credit rules (summary):
                  </p>
                  <p>
                    non-expiring and can be transferred/gifted with written confirmation from JVTO.
                  </p>
                </div>
              </div>

              {/* Section 5 */}
              <div id="inclusions-policy" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  5) Inclusions are written into your voucher
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    JVTO uses a "write-it-to-bind-it" approach:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>what is included is what is written on the official package page and/or your <span className="font-semibold">Official E-Voucher / Invoice (PDF)</span>;</li>
                    <li>if it is not written, it is not part of the contracted inclusions.</li>
                  </ul>
                  
                  <p>
                    For the complete list of inclusions/exclusions and conditional inclusions, see the <Link href="/policy/inclusions-exclusions" className="text-primary hover:underline">Inclusions & Exclusions Policy</Link>.
                  </p>

                  <h3 className="text-xl font-bold mt-8 mb-4 text-foreground">
                    Technical snapshot (typical inclusions — only if written on your voucher/package)
                  </h3>

                  <h4 className="font-bold text-lg mt-6 mb-2 text-foreground">
                    Transport
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>Private air-conditioned vehicle + driver + fuel + tolls + standard parking (as per itinerary).</li>
                    <li>
                      Vehicle allocation by group size:
                      <ul className="list-disc pl-5 mt-2">
                        <li>2–3 guests: 1 × MPV (e.g., Toyota Avanza or similar)</li>
                        <li>4–9 guests: 1 × Toyota Hiace (or similar 16-seat minibus)</li>
                        <li>10–11 guests: 1 × Toyota Hiace + 1 × MPV (to ensure proper seating and luggage space)</li>
                      </ul>
                    </li>
                    <li>Mount Bromo (when included): private 4WD jeep(s) for viewpoints; max ±4 guests per jeep.</li>
                  </ul>

                  <h4 className="font-bold text-lg mt-6 mb-2 text-foreground">
                    Accommodation
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>Overnight stays as listed in the itinerary.</li>
                    <li>
                      Standard rooming:
                      <ul className="list-disc pl-5 mt-2">
                        <li>Even-numbered groups: 1 room per 2 guests (King or Twin)</li>
                        <li>Odd-numbered groups: 1 room per 2 guests + 1 extra bed in one room</li>
                      </ul>
                    </li>
                    <li>Upgrade option: replace the extra bed with an additional private room (supplement applies; see your voucher).</li>
                  </ul>

                  <h4 className="font-bold text-lg mt-6 mb-2 text-foreground">
                    Tickets, permits & logistics
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>Entrance tickets/permits for the named attractions in your confirmed itinerary.</li>
                  </ul>

                  <h4 className="font-bold text-lg mt-6 mb-2 text-foreground">
                    Ijen (when included)
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>Gas mask suitable for sulfur conditions + trekking poles.</li>
                    <li>Mandatory medical check & clearance arranged by JVTO (Bondowoso area).</li>
                  </ul>

                  <h4 className="font-bold text-lg mt-6 mb-2 text-foreground">
                    Meals
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>Bottled mineral water during overland sectors + hotel breakfasts.</li>
                    <li>Extra meals (e.g., Bondowoso dinner/lunch for Ijen schedule, Tumpak Sewu lunch) are included only if written on your voucher/package.</li>
                  </ul>

                  <h4 className="font-bold text-lg mt-6 mb-2 text-foreground">
                    Brand extras (where eligible and written)
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>JVTO travel T-shirt per participant for eligible packages (size selection via details link).</li>
                    <li>Custom group T-shirt (≥12 guests in one booking) only if written.</li>
                  </ul>

                  <h4 className="font-bold text-lg mt-6 mb-2 text-foreground">
                    Ferry (where applicable)
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>Java–Bali ferry tickets only if the crossing is listed in your itinerary and written as included on your voucher.</li>
                  </ul>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6 rounded-r-lg">
                    <h4 className="font-bold text-lg mb-2 text-foreground">
                      Common exclusions (unless explicitly written as included)
                    </h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Flights and visas</li>
                      <li>Travel insurance</li>
                      <li>Meals not specified (including alcohol)</li>
                      <li>Tips/gratuities</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 6 */}
              <div id="booking-checklist" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  6) Practical booking checklist (what we need from you)
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    To prepare permits, rooms, vehicles, and crew scheduling, JVTO may request:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>lead guest full name and contact</li>
                    <li>passport details (where required for permits)</li>
                    <li>rooming preferences</li>
                    <li>dietary constraints (if applicable)</li>
                    <li>pickup/drop-off details (flight/train/hotel information)</li>
                  </ul>
                  <p>
                    Provide details as early as possible, and no later than the timeframe requested in JVTO's "Complete Your Details" link (if issued).
                  </p>
                </div>
              </div>

              {/* Section 7 */}
              <div id="payment-security" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  7) Payment security & anti-fraud reminders
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    For your security:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>Do not share sensitive card data in chat.</li>
                    <li>Pay only via JVTO's secure checkout or official accounts stated in the policy.</li>
                    <li>JVTO staff should not request payments to personal accounts.</li>
                  </ul>
                </div>
              </div>

              {/* Section 8 */}
              <div id="final-note" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  8) Final note
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    If there is any discrepancy, your <span className="font-semibold">Official E-Voucher / Invoice (PDF)</span> is the final booking-specific reference, followed by the <Link href="/policy/booking-cancellation" className="text-primary hover:underline">Booking, Payment & Cancellation Policy</Link> and the <Link href="/policy/inclusions-exclusions" className="text-primary hover:underline">Inclusions & Exclusions Policy</Link>.
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