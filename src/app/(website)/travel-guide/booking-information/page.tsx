import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Booking Information | Payments, Changes & Inclusions | JVTO",
  description:
    "How JVTO tours work: booking steps, payments, cancellations, logistics, inclusions, safety, and support. Ijen health certificate is included.",
};
import StructuredData from "@/components/website/StructuredData";

export default function BookingInformationPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  // 4. Siapkan Schema.org Data secara dinamis
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
        paymentAccepted: "Credit Card, Bank Transfer",
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
        name: "Booking Information & Travel Credit — How JVTO Private Tours Work",
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
        name: "Booking Information & Travel Credit — How JVTO Private Tours Work",
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
        isBasedOn: [
          {
            "@type": "CreativeWork",
            name: "JVTO Booking, Payment & Cancellation Policy",
            url: "{{PLACEHOLDER_URL_BOOKING_POLICY_PDF}}",
          },
          {
            "@type": "CreativeWork",
            name: "JVTO Inclusions & Exclusions Policy",
            url: "{{PLACEHOLDER_URL_INCLUSIONS_EXCLUSIONS_PDF}}",
          },
          {
            "@type": "CreativeWork",
            name: "Official E-Voucher / Invoice for the Confirmed Booking",
            url: "{{PLACEHOLDER_URL_SAMPLE_E_VOUCHER}}",
          },
        ],
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
            name: "Booking Information & Travel Credit — How JVTO Private Tours Work",
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
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
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
            <div className="text-center mb-12">
              <h1 className="font-black uppercase text-4xl md:text-5xl tracking-tight">
                Booking Information — Payments, Changes & Travel Credit
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                This page explains how bookings, payments, changes, and Travel
                Credit work for private tours with JVTO. It is a plain-language
                summary of our official policies.
              </p>
            </div>

            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-black uppercase text-foreground mb-4">
                  1. How to Book a Private Tour
                </h2>
                <Card className="bg-slate-50">
                  <CardContent className="p-6">
                    <p className="text-gray-700 mb-4">
                      JVTO operates private tours only. Our primary booking
                      channel is our website.
                    </p>
                    <div className="space-y-3">
                      {[
                        "Choose a tour, dates, and group size on our website.",
                        "Contact us via WhatsApp for any questions before booking.",
                        "Secure your tour by paying the 20% deposit online.",
                        "Receive your official e-voucher and itinerary within 24 hours.",
                      ].map((step, index) => (
                        <div key={index} className="flex items-start">
                          <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                            <span className="text-primary font-semibold text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-muted-foreground">{step}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              <section>
                <h2 className="text-2xl font-black uppercase text-foreground mb-4">
                  2. Deposits & Final Payment
                </h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <h3 className="font-black uppercase text-xl tracking-tight">
                    Deposit
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      A non-refundable 20% deposit is required to secure your
                      booking.
                    </li>
                    <li>
                      Your booking is confirmed only after we receive the
                      deposit and send your e-voucher.
                    </li>
                  </ul>
                  <h3 className="font-black uppercase text-xl tracking-tight mt-6">
                    Final Payment
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      The remaining balance is due before Day 1 of your tour.
                    </li>
                    <li>
                      Payment deadlines are specified on your invoice and
                      confirmation message.
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-black uppercase text-foreground mb-4">
                  3. Inclusions & Exclusions
                </h2>
                <p className="text-muted-foreground">
                  Our packages are all-inclusive by design. For a complete list
                  of what is and {`isn't`} included, please see our dedicated
                  page.
                </p>
                <div className="mt-4">
                  <Link
                    href="/plan-your-trip/whats-included"
                    className="font-bold text-primary hover:underline"
                  >
                    View {`What's`} Included Policy &rarr;
                  </Link>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-black uppercase text-foreground mb-4">
                  4. Travel Credit (No Cash Refund Policy)
                </h2>
                <div className="prose prose-lg text-muted-foreground max-w-none">
                  <p>
                    JVTO uses a Travel Credit system instead of cash refunds.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      If you cancel your tour more than 48 hours before
                      departure, we issue Travel Credit for the amount paid.
                    </li>
                    <li>
                      Travel Credit does not expire and can be transferred to
                      another person with your written authorization.
                    </li>
                    <li>
                      We do not offer cash refunds, except where required by
                      applicable law.
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-black uppercase text-foreground mb-4">
                  5. Changes & Reschedules
                </h2>
                <div className="prose prose-lg text-muted-foreground max-w-none">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      You may request to reschedule your tour once without
                      penalty if you contact us more than 48 hours before Day 1.
                    </li>
                    <li>
                      Date changes are subject to availability. Price
                      adjustments may apply for high season.
                    </li>
                    <li>
                      Changes requested close to departure may be treated as a
                      partial cancellation, with Travel Credit rules applying.
                    </li>
                  </ul>
                </div>
              </section>

              <div className="mt-12 text-center text-sm text-muted-foreground bg-accent p-4 rounded-sm">
                <p>
                  This is a summary. For full legal terms, please see our
                  official{" "}
                  <Link
                    href="/travel-guide/booking-policy"
                    className="font-bold underline hover:text-primary"
                  >
                    Terms & Conditions
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
