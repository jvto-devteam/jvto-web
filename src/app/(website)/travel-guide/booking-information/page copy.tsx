import StructuredData from "@/components/website/StructuredData";
import Link from "next/link";
import { type Metadata } from "next";
import Sidebar from "../sidebar";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title:
    "Booking Information – Payments, Changes & Travel Credit | Java Volcano Tour Operator",
  description:
    "Learn how private Bromo and Ijen tours with JVTO are booked, paid and changed. Clear rules on deposits, balance payments, cancellations and Travel Credit.",
  openGraph: {
    title:
      "Booking Information – Payments, Changes & Travel Credit | Java Volcano Tour Operator",
    description:
      "Learn how private Bromo and Ijen tours with JVTO are booked, paid and changed. Clear rules on deposits, balance payments, cancellations and Travel Credit.",
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
    title:
      "Booking Information – Payments, Changes & Travel Credit | Java Volcano Tour Operator",
    description:
      "Learn how private Bromo and Ijen tours with JVTO are booked, paid and changed. Clear rules on deposits, balance payments, cancellations and Travel Credit.",
    images: [siteUrl + "/assets/img/og/travel-guide.webp"],
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
        logo: "https://legacy.javavolcano-touroperator.com/assets/img/jvto-logo.png",
        image: [
          siteUrl + "/assets/img/jvto-logo.png",
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
          jobTitle: "Tourist Police Officer",
          image:
            "https://javavolcano-touroperator.com/founder/mr-sam-tourist-police-portrait.png",
          description:
            "Founder of JVTO and active member of the East Java Tourist Police Unit (Ditpamobvit), specializing in tourist safety and risk management.",
          memberOf: {
            "@type": "GovernmentOrganization",
            name: "Indonesian National Police",
            alternateName: "Kepolisian Negara Republik Indonesia",
            subOrganization: {
              "@type": "GovernmentOrganization",
              name: "Ditpamobvit (Directorate of Vital Object Security)",
            },
            sameAs: [
              "https://www.wikidata.org/wiki/Q3103954",
              "https://polri.go.id/",
            ],
          },
          knowsAbout: [
            "TouristSafety",
            "EastJavaTourism",
            "VolcanoTrekking",
            "LogisticsManagement",
          ],
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
    <>
      <StructuredData data={schemaData} />
      <div className="flex min-h-screen bg-background">
        <Sidebar />

        <main className="flex-1 pt-24 md:pt-36 pb-20">
          <section className="bg-accent border-b">
            <div className="container mx-auto px-4 max-w-4xl">
              <nav className="mb-4 text-sm text-muted-foreground">
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
              <div className="mb-12">
                <h1 className="font-black text-2xl md:text-5xl mb-6">
                  Booking Information – How JVTO Private Tours Work
                </h1>

                {/* Hero Intro */}
                <div className="prose max-w-none text-left bg-white p-6 rounded-lg shadow-sm mb-6">
                  <p className="text-muted-foreground mb-4">
                    <strong>
                      Use this page to understand how JVTO private tour bookings
                      work from deposit to Travel Credit.
                    </strong>{" "}
                    This page explains, in simple terms, how private tour
                    bookings with Java Volcano Tour Operator work—from choosing
                    a tour and paying the deposit, to final payments, changes,
                    cancellations, and Travel Credit.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>
                      Use your Official E-Voucher and the Booking, Payment &
                      Cancellation Policy as the final reference for legal
                      wording.
                    </strong>{" "}
                    This page is a plain-language summary; for anything legal or
                    detailed, your Official E-Voucher and the Booking, Payment &
                    Cancellation Policy are the final reference.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="prose max-w-none space-y-12">
                {/* Section 1 */}
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    1) Private Tours Only & Official Channels
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    <strong>
                      Book JVTO tours as private, all-inclusive packages only.
                    </strong>{" "}
                    All JVTO routes are private, all-inclusive tours—we do not
                    sell shared-group or transport-only packages.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    <strong>
                      Protect your booking by using only official JVTO channels
                      and checkout.
                    </strong>{" "}
                    Book only through the official JVTO website and secure
                    checkout, and use only the official WhatsApp number and
                    email address listed on this site.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    <strong>Verify anything unusual before paying.</strong> If
                    you ever receive a different account number, payment link,
                    or contact, pause and verify it with us via our official
                    contacts before paying.
                  </p>
                  <div className="bg-gray-50 px-4 py-2 rounded-lg mt-4">
                    <p className="text-sm text-gray-700">
                      <strong>Links:</strong>
                      <br />• Full step-by-step guide →{" "}
                      <Link
                        href="/travel-guide/faq"
                        className="text-primary hover:underline"
                      >
                        /travel-guide/faq
                      </Link>
                      {/* <br />• Official Booking Guide (PDF) → [add official
                    document link if used] */}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-300" />

                {/* Section 2 */}
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    2) How to Book a Private Tour with JVTO
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    <strong>
                      Confirm a booking by paying through secure checkout and
                      receiving an Official E-Voucher.
                    </strong>{" "}
                    Your booking is considered confirmed only when payment has
                    been processed and your Official E-Voucher has been issued
                    to your verified email address.
                  </p>

                  <h3 className="text-xl font-bold mb-3 text-foreground">
                    Step-by-step
                  </h3>
                  <ul className="list-disc pl-5 space-y-3 text-muted-foreground mb-6">
                    <li>
                      <strong>Choose your tour on the official website.</strong>{" "}
                      Select your starting point (for example, Surabaya or
                      Bali), your preferred duration (2D1N, 3D2N, 4D3N, 5D+),
                      and review the detailed itinerary, inclusions, and
                      exclusions.
                    </li>
                    <li>
                      <strong>
                        Provide lead guest contact details used for delivery and
                        support.
                      </strong>{" "}
                      Enter the full name of the lead guest, a verified email
                      address, and an active WhatsApp/mobile number so we can
                      issue your Official E-Voucher and support your booking
                      before and during the tour.
                    </li>
                    <li>
                      <strong>
                        Pay the initial deposit (or full amount if required).
                      </strong>{" "}
                      In most cases, a 20% deposit is required at checkout; if
                      Day 1 is close (for example, less than 14 days away), the
                      system may request up to 100% full payment at the time of
                      booking.
                    </li>
                    <li>
                      <strong>
                        Receive your payment confirmation and Official
                        E-Voucher.
                      </strong>{" "}
                      After a successful payment, you will see a
                      successful/complete status and receive an order
                      summary/payment receipt and your Official E-Voucher (PDF).
                      Always check the details and contact us quickly if
                      something is incorrect.
                    </li>
                    <li>
                      <strong>
                        Provide additional details after confirmation if
                        requested.
                      </strong>{" "}
                      Once confirmed, you may receive a secure link or access to
                      a My Bookings/Customer Portal to provide extra details
                      such as guest list, arrival times, room preferences,
                      dietary needs, and relevant health information.
                    </li>
                  </ul>
                  <p className="text-muted-foreground italic">
                    <strong>Use official documents for precise wording.</strong>{" "}
                    This page is a plain-language summary; for precise legal
                    wording and conditions, refer to the Official Booking Guide
                    – How to Book and the Booking, Payment & Cancellation
                    Policy.
                  </p>
                </div>

                {/* Divider */}
                <hr className="border-gray-300" />

                {/* Section 3 */}
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    3) Payments – Deposit, Balance & Accepted Methods
                  </h2>

                  <h3 className="text-xl font-bold mb-3 text-foreground">
                    3.1 Deposit
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    <strong>
                      Secure most bookings with a 20% deposit unless clearly
                      stated otherwise.
                    </strong>{" "}
                    Standard rule: a 20% deposit of the total package price is
                    required to secure a booking, unless a different amount is
                    clearly stated in writing for special products or
                    promotions.
                  </p>
                  <p className="text-muted-foreground mb-6">
                    <strong>
                      Expect up to 100% payment for close departures.
                    </strong>{" "}
                    For tours where Day 1 is less than 14 days away, the system
                    may request up to 100% full payment at checkout.
                  </p>

                  <h3 className="text-xl font-bold mb-3 text-foreground">
                    3.2 How you can pay
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    <strong>
                      Pay the initial deposit by card through secure checkout.
                    </strong>{" "}
                    The initial deposit is paid by credit/debit card only,
                    through JVTO's secure, SSL-encrypted checkout with an
                    authorised payment gateway.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    <strong>
                      Pay the remaining balance using the deadline that matches
                      your method.
                    </strong>{" "}
                    For the remaining balance (if only 20% was paid initially):
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
                    <li>
                      <strong>Card (online):</strong> pay via JVTO's secure
                      payment link no later than 5 calendar days before Day 1.
                    </li>
                    <li>
                      <strong>Bank transfer / Wise:</strong> pay to JVTO's
                      official company bank accounts no later than 3 calendar
                      days before Day 1.
                    </li>
                    <li>
                      <strong>Cash at JVTO office:</strong> possible only if
                      explicitly approved in writing at the time of booking;
                      must be settled in Indonesian Rupiah at the JVTO office
                      before departure on Day 1.
                    </li>
                  </ul>
                  <p className="text-muted-foreground mb-6">
                    <strong>
                      Expect consequences if deadlines are missed.
                    </strong>{" "}
                    If balance payment deadlines are not met, your booking may
                    be handled according to the Booking, Payment & Cancellation
                    Policy, which can include cancellation and forfeiture
                    depending on timing.
                  </p>

                  <h3 className="text-xl font-bold mb-3 text-foreground">
                    3.3 Payment security
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    <strong>
                      Use secure checkout and do not share sensitive payment
                      credentials.
                    </strong>{" "}
                    All online card payments are processed via a secure,
                    encrypted checkout using a compliant payment gateway, and
                    JVTO does not store full card numbers or CVV codes on its
                    own systems.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    <strong>
                      Treat requests for card details or passwords as invalid.
                    </strong>{" "}
                    JVTO will never ask you to send full card details or online
                    banking passwords via WhatsApp, email, or social media.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Stop and verify unusual instructions.</strong> If
                    you receive unusual payment instructions, stop and verify
                    using the official WhatsApp or email listed on this site.
                  </p>
                </div>

                {/* Divider */}
                <hr className="border-gray-300" />

                {/* Section 4 */}
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    4) Cancellations, Travel Credit & No-Show (Guest-Initiated)
                  </h2>

                  <h3 className="text-xl font-bold mb-3 text-foreground">
                    4.1 Cancel 48 hours or more before Day 1
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    <strong>
                      Receive Travel Credit instead of a cash refund when
                      cancelling early enough.
                    </strong>{" "}
                    If you cancel 48 hours or more before Day 1 (local Indonesia
                    time), any payments already received are not refunded in
                    cash.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    <strong>
                      Receive Travel Credit equal to 100% of eligible payments
                      received.
                    </strong>{" "}
                    JVTO issues Travel Credit equal to 100% of the payments
                    received for the cancelled services.
                  </p>
                  <p className="text-muted-foreground mb-6">
                    <strong>
                      Use Travel Credit with these characteristics.
                    </strong>{" "}
                    Travel Credit:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
                    <li>Issued in IDR</li>
                    <li>Non-expiring</li>
                    <li>
                      Transferable/giftable with written confirmation from JVTO
                    </li>
                    <li>
                      Applied to future JVTO private tours at prevailing rates
                      at the time of the new booking
                    </li>
                    <li>
                      No rebooking or administration fee for using valid Travel
                      Credit
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold mb-3 text-foreground">
                    4.2 Cancel less than 48 hours before Day 1
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    <strong>Expect forfeiture for late cancellations.</strong>{" "}
                    If you cancel less than 48 hours before Day 1, up to 100% of
                    the total package price may be forfeited.
                  </p>
                  <p className="text-muted-foreground mb-6">
                    <strong>
                      Do not expect Travel Credit or cash refunds for very late
                      cancellations.
                    </strong>{" "}
                    As a general rule, no Travel Credit or cash refund is
                    provided when cancelling this late.
                  </p>

                  <h3 className="text-xl font-bold mb-3 text-foreground">
                    4.3 No-show & same-day cancellation
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    <strong>
                      Treat no-shows and same-day cancellations as forfeiture
                      cases.
                    </strong>{" "}
                    Situations such as not appearing at the pickup point,
                    refusing to depart after vehicles and crew are deployed,
                    cancelling on the same day after services are prepared, or
                    voluntarily leaving after the tour starts may be treated as
                    no-show/same-day cancellation.
                  </p>
                  <p className="text-muted-foreground mb-6">
                    <strong>
                      Expect up to 100% forfeiture and no unused-service credit.
                    </strong>{" "}
                    Up to 100% of the total package price may be forfeited, and
                    no refund or Travel Credit is provided for services not
                    used.
                  </p>

                  <h3 className="text-xl font-bold mb-3 text-foreground">
                    4.4 Skipping activities or leaving early
                  </h3>
                  <p className="text-muted-foreground">
                    <strong>
                      Keep the full package payable if you skip activities for
                      personal reasons.
                    </strong>{" "}
                    If a guest chooses to skip activities or end the tour early
                    for personal reasons, no partial refund or discount applies
                    and the full package price remains payable.
                  </p>
                </div>

                {/* Divider */}
                <hr className="border-gray-300" />

                {/* Section 5 */}
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    5) Changing Your Booking (Dates, Details & Adjustments)
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    <strong>
                      Expect minor corrections to be possible and operational
                      changes to carry supplier costs.
                    </strong>{" "}
                    Some minor corrections may be possible without extra charge,
                    but changes that affect permits, tickets, accommodation
                    allocations, or transport inventory typically pass supplier
                    costs on to the guest.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Follow formal rules for reschedules.</strong>{" "}
                    Reschedule options follow the timings and rules described in
                    the Booking, Payment & Cancellation Policy and on your
                    Official E-Voucher.
                  </p>
                </div>

                {/* Divider */}
                <hr className="border-gray-300" />

                {/* Section 6 */}
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    6) Changes by JVTO & External Events
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    <strong>
                      Expect JVTO to adjust plans when required for safety,
                      compliance, or access.
                    </strong>{" "}
                    JVTO may adjust routes, timings, accommodation, or
                    activities due to volcanic activity, toxic gas, landslides,
                    floods, government restrictions, or park closures.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    <strong>
                      Expect alternatives where feasible and policy-based
                      remedies.
                    </strong>{" "}
                    JVTO prioritises safety and legal compliance, proposes
                    alternatives where feasible, and applies options described
                    in the Booking, Payment & Cancellation Policy and your
                    Official E-Voucher.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Use the policy for force majeure detail.</strong>{" "}
                    Full details of how force majeure and external events are
                    handled are described in the Booking, Payment & Cancellation
                    Policy.
                  </p>
                </div>

                {/* Divider */}
                <hr className="border-gray-300" />

                {/* Section 7 */}
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    7) Your Responsibilities & Document Hierarchy
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    <strong>
                      Provide accurate information and verify your E-Voucher.
                    </strong>{" "}
                    Provide accurate names (as per ID/passport where required),
                    contact details, arrival/departure times, and relevant
                    health information you choose to share, and review your
                    Official E-Voucher carefully.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    <strong>
                      Use only official channels and payment methods.
                    </strong>{" "}
                    Use only official channels and verified payment
                    instructions.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    <strong>
                      Follow the document hierarchy if wording differs.
                    </strong>{" "}
                    Order of precedence:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-muted-foreground mb-6">
                    <li>Official E-Voucher / Invoice (your booking)</li>
                    <li>Booking, Payment & Cancellation Policy</li>
                    <li>
                      Inclusions & Exclusions Policy and Official Booking Guide
                      – How to Book
                    </li>
                    <li>General website content or informal communication</li>
                  </ol>
                </div>

                {/* Divider */}
                <hr className="border-gray-300" />

                {/* Section 8 */}
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    8) Verification & Support
                  </h2>
                  <p className="text-muted-foreground">
                    <strong>Stop and verify if anything looks unusual.</strong>{" "}
                    If you are unsure about a link, account number, or message
                    claiming to be from JVTO: stop the payment process and
                    contact us via official WhatsApp or email listed on this
                    website.
                  </p>
                </div>
                {/* Divider */}
                <hr className="border-gray-300" />

                {/* Section 9 */}
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    9) Group Incentives (FOC) - JVTO Website Only
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    We do offer FOC (Free of Charge) incentives based on group
                    size.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Our current FOC scheme is as follows:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
                    <li>
                      <strong>18 paying pax</strong> → 1 FOC
                    </li>
                    <li>
                      <strong>35 paying pax</strong> → 2 FOC
                    </li>
                    <li>
                      <strong>50 paying pax</strong> → 3 FOC
                    </li>
                  </ul>
                  <p className="text-muted-foreground italic">
                    “Pax” refers to paying guests only.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
