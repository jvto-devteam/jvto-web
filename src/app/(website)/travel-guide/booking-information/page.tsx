import StructuredData from "@/components/website/StructuredData";
import Link from "next/link";
import { type Metadata } from "next";

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
                  <strong>Note:</strong> This Travel Guide is for information and trip planning. For binding terms (payments, cancellations, refunds/credits), please refer to the official policies and your <strong>Official E-Voucher / Invoice (PDF)</strong>. If anything differs, the E-Voucher/Invoice and the Policy pages take precedence.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose max-w-none space-y-12">
              {/* Section 1 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  1) Private Tours Only & Official Channels
                </h2>
                <p className="text-muted-foreground mb-4">
                  JVTO operates <strong>private, all-inclusive tours</strong> (no shared/open trips, and not a transport-only service).
                </p>
                <p className="text-muted-foreground mb-4">
                  To keep your booking safe:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
                  <li>
                    Use the official website and secure checkout:{" "}
                    <a href="https://javavolcano-touroperator.com" className="text-primary hover:underline">
                      https://javavolcano-touroperator.com
                    </a>
                  </li>
                  <li>
                    Use only the official contacts:
                    <ul className="list-disc pl-5 mt-2">
                      <li>WhatsApp: +62 822-4478-8833</li>
                      <li>Email: hello@javavolcano-touroperator.com</li>
                    </ul>
                  </li>
                  <li>
                    Do not send payment to personal accounts. If you receive any payment instruction that does not match JVTO's official details, contact us first via the official WhatsApp/email.
                  </li>
                </ul>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  2) How a JVTO Booking Works (Simple Flow)
                </h2>
                <ol className="list-decimal pl-5 space-y-4 text-muted-foreground">
                  <li>
                    <strong>Choose your tour</strong> on the official website (starting point, duration, route).
                  </li>
                  <li>
                    <strong>Submit your details</strong> at checkout:
                    <ul className="list-disc pl-5 mt-2">
                      <li>Lead guest full name</li>
                      <li>Verified email address</li>
                      <li>Active WhatsApp/mobile number</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Pay the required amount</strong> (deposit or full payment depending on lead time).
                  </li>
                  <li>
                    <strong>Receive your Official E-Voucher / Invoice (PDF)</strong> by email.
                    <ul className="list-disc pl-5 mt-2">
                      <li>This document is your formal booking confirmation and the final contract for your specific itinerary (dates, pickup, inclusions written on the voucher).</li>
                    </ul>
                  </li>
                </ol>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  3) Payments — Deposit, Balance & Methods
                </h2>
                
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  Deposit and short-notice rule
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
                  <li>
                    Standard booking: <strong>20% deposit</strong> of the total package price at checkout.
                  </li>
                  <li>
                    Short notice booking: if <strong>Day 1 is less than 14 days</strong> from the time of booking, JVTO may require <strong>up to 100% full payment</strong> at checkout.
                  </li>
                </ul>

                <h3 className="text-xl font-bold mb-3 text-foreground">
                  Balance settlement deadlines (if only 20% deposit was paid initially)
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
                  <li>
                    <strong>Credit / Debit card:</strong> balance must be paid no later than <strong>5 calendar days before Day 1</strong>.
                  </li>
                  <li>
                    <strong>Bank transfer / Wise:</strong> balance must be received no later than <strong>3 calendar days before Day 1</strong>.
                  </li>
                  <li>
                    <strong>Cash (IDR only):</strong> allowed only if explicitly approved in writing; settled at the JVTO office before departure on Day 1.
                  </li>
                </ul>

                <h3 className="text-xl font-bold mb-3 text-foreground">
                  Payment security and currency
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Card payments are processed via JVTO's secure checkout and authorised payment gateway.</li>
                  <li>The contracted currency is <strong>IDR</strong> unless otherwise stated in writing for a specific product/promotion.</li>
                </ul>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  4) Changes, Amendments & Rescheduling (Guest-Initiated)
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Any request to amend dates, pickup points, names, or itinerary elements should be made through the official contacts.</li>
                  <li>Changes are subject to availability and third-party rules (hotels, parks, jeep providers).</li>
                  <li>Any additional costs (if applicable) will be communicated in writing before confirmation.</li>
                </ul>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 5 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  5) Cancellations, Travel Credit & No-Show (Guest-Initiated)
                </h2>
                
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  Cancellation ≥ 48 hours before Day 1
                </h3>
                <p className="text-muted-foreground mb-4">
                  If a guest cancels <strong>48 hours or more before Day 1 (local Indonesia time)</strong>:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
                  <li>JVTO issues <strong>JVTO Travel Credit equal to 100% of payments received</strong> for the cancelled services.</li>
                  <li>No rebooking/administration fee is charged when using valid Travel Credit.</li>
                </ul>

                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {`Cancellation < 48 hours before Day 1`}
                </h3>
                <p className="text-muted-foreground mb-4">
                  If a guest cancels <strong>less than 48 hours before Day 1</strong>:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
                  <li>Up to <strong>100% of the total package price may be forfeited</strong>.</li>
                  <li><strong>No Travel Credit or cash refund</strong> is normally provided.</li>
                </ul>

                <h3 className="text-xl font-bold mb-3 text-foreground">
                  No-show & same-day cancellation
                </h3>
                <p className="text-muted-foreground mb-4">
                  Situations such as not appearing at pickup, refusing to depart after crew/vehicles are deployed, or cancelling on the same day are treated as no-show/same-day cancellation:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
                  <li>Up to <strong>100% of the total package price is forfeited</strong>.</li>
                  <li><strong>No refund or Travel Credit</strong> is provided for unused services.</li>
                </ul>

                <h3 className="text-xl font-bold mb-3 text-foreground">
                  Skipping activities / leaving early
                </h3>
                <p className="text-muted-foreground">
                  If a guest chooses to skip activities or end the tour early for personal reasons, the full package price remains payable and no partial refund or discount applies.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 6 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  6) What's Typically Included (Quick Reference)
                </h2>
                <p className="text-muted-foreground mb-4">
                  Your exact inclusions depend on your chosen package and what is written on your voucher, but eligible JVTO private tour packages typically include:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
                  <li>Private AC transport + fuel/tolls/standard parking (itinerary-based)</li>
                  <li>Bromo 4WD jeep (when Bromo is included)</li>
                  <li>Accommodation for overnight stays listed in the itinerary</li>
                  <li>Professional crew (driver, guide/escort guide, and required licensed local guides)</li>
                  <li>Entrance tickets/permits for the attractions listed in your itinerary</li>
                  <li>Ijen safety gear (gas mask, trekking poles) and a mandatory pre-hike health screening (when Ijen is included)</li>
                  <li>Daily bottled water in the vehicle and hotel breakfasts</li>
                </ul>
                <p className="text-muted-foreground">
                  For the full definitions (and what is excluded unless written), see:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>
                    <strong>Inclusions & Exclusions Policy:</strong>{' '}
                    <Link href="/policy/inclusions-exclusions" className="text-primary hover:underline">
                      /policy/inclusions-exclusions
                    </Link>
                  </li>
                  <li>
                    <strong>Booking, Payment & Cancellation Policy:</strong>{' '}
                    <Link href="/policy/booking-payment-cancellation" className="text-primary hover:underline">
                      /policy/booking-payment-cancellation
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 7 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  7) Need Help Before Booking?
                </h2>
                <p className="text-muted-foreground mb-4">
                  Send your preferred dates, group size, and starting point to:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>WhatsApp: +62 822-4478-8833</li>
                  <li>Email: hello@javavolcano-touroperator.com</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}