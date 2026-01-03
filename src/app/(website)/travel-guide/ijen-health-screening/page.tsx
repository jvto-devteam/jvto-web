import Link from "next/link";
import { type Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import StructuredData from "@/components/website/StructuredData";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Ijen Health Screening – Real Checks, Digital Proof",
  description: "Learn about Ijen health screening with JVTO: real checks by trained staff, digital/printed clearance (as required by the local process), and safety procedures for Mount Ijen hikes.",
  openGraph: {
    title: "Ijen Health Screening – Real Checks, Digital Proof",
    description: "Learn about Ijen health screening with JVTO: real checks by trained staff, digital/printed clearance (as required by the local process), and safety procedures for Mount Ijen hikes.",
    url: `${siteUrl}/travel-guide/ijen-health-screening`,
    siteName: "Java Volcano Tour Operator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteUrl + "/assets/img/og/ijen-health-screening.webp",
        width: 1200,
        height: 630,
        alt: "Ijen Health Screening",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ijen Health Screening – Real Checks, Digital Proof",
    description: "Learn about Ijen health screening with JVTO: real checks by trained staff, digital/printed clearance (as required by the local process), and safety procedures for Mount Ijen hikes.",
    images: [siteUrl + "/assets/img/og/ijen-health-screening.webp"],
  },
};

export default function IjenHealthScreeningPage() {
  const pageSchema = {
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
          ratingValue: 4.9,
          reviewCount: 102,
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://javavolcano-touroperator.com/#website",
        url: "https://javavolcano-touroperator.com",
        name: "Java Volcano Tour Operator (JVTO)",
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        inLanguage: "en",
      },
      {
        "@type": "WebPage",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#webpage",
        url: "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening",
        name: "Ijen Health Screening – Real Checks, Digital Proof",
        headline: "Ijen Health Screening – Real Checks, Digital Proof",
        description: "Learn about Ijen health screening with JVTO: real checks by trained staff, digital/printed clearance (as required by the local process), and safety procedures for Mount Ijen hikes.",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/#website",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        image: {
          "@id": siteUrl + "/assets/img/hero/home.webp#primaryimage",
        },
        primaryImageOfPage: {
          "@id": siteUrl + "/assets/img/hero/home.webp#primaryimage",
        },
        breadcrumb: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#breadcrumb",
        },
        mainEntity: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#article",
        },
        hasPart: [
          {
            "@id":
              "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#faq",
          },
        ],
        relatedLink: [
          "https://javavolcano-touroperator.com/travel-guide/booking-information",
          "https://javavolcano-touroperator.com/travel-guide/faq",
          "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness",
          "https://javavolcano-touroperator.com/travel-guide/safety-on-tours",
          "https://javavolcano-touroperator.com/travel-guide/weather-and-closures",
          "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups",
        ],
        inLanguage: "en",
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        lastReviewed: "2025-12-05",
        about: {
          "@id":
            "https://javavolcano-touroperator.com/destinations/ijen-crater#destination",
        },
      },
      {
        "@type": "ImageObject",
        "@id": siteUrl + "/assets/img/hero/home.webp#primaryimage",
        url: siteUrl + "/assets/img/hero/home.webp",
        inLanguage: "en",
      },
      {
        "@type": "Article",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#article",
        headline: "Ijen Health Screening – Real Checks, Digital Proof",
        description: "Learn about Ijen health screening with JVTO: real checks by trained staff, digital/printed clearance (as required by the local process), and safety procedures for Mount Ijen hikes.",
        mainEntityOfPage: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#webpage",
        },
        image: {
          "@id": siteUrl + "/assets/img/hero/home.webp#primaryimage",
        },
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/#website",
        },
        author: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        articleSection: [
          "Why there is a health screening",
          "What JVTO typically arranges",
          "What you must do as a guest",
          "Safety equipment for Ijen",
          "If Ijen access is restricted or closed",
          "Timing realities (night trek)",
          "What counts as included meals around Ijen",
          "Binding note",
        ],
        articleBody: "Information about Ijen health screening procedures, safety equipment, and operational guidelines for Mount Ijen hikes with JVTO.",
        inLanguage: "en",
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        about: {
          "@id":
            "https://javavolcano-touroperator.com/destinations/ijen-crater#destination",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#breadcrumb",
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
            name: "Ijen Health Screening – Real Checks, Digital Proof",
            item: "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is Ijen health screening mandatory for JVTO guests?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, when Ijen is included in your itinerary, health screening is a mandatory operational step for safety reasons.",
            },
            inLanguage: "en",
            lastReviewed: "2025-12-05",
            dateModified: "2025-12-05",
          },
          {
            "@type": "Question",
            name: "What happens if Ijen is closed due to weather or gas conditions?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "JVTO may adjust the plan for safety. The remedy depends on the Booking, Payment & Cancellation Policy and specific services already committed.",
            },
            inLanguage: "en",
            lastReviewed: "2025-12-05",
            dateModified: "2025-12-05",
          },
          {
            "@type": "Question",
            name: "Are meals around Ijen included?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Some itineraries include specific meals around Bondowoso/Ijen schedules, but these are only included if written on your package page and/or voucher.",
            },
            inLanguage: "en",
            lastReviewed: "2025-12-05",
            dateModified: "2025-12-05",
          },
        ],
        inLanguage: "en",
      },
      {
        "@type": "TouristAttraction",
        "@id":
          "https://javavolcano-touroperator.com/destinations/ijen-crater#destination",
        name: "Ijen Crater",
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StructuredData data={pageSchema} />

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
                Ijen Health Screening
              </span>
            </nav>

            {/* Main Header */}
            <div className="text-center mb-12">
              <h1 className="font-black text-2xl md:text-5xl mb-6">
                Ijen Health Screening – Real Checks, Digital Proof
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
              <div id="why-screening" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  1) Why there is a health screening
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    Mount Ijen access may require a health clearance process for visitor safety. JVTO treats this as a mandatory operational step when Ijen is included in your itinerary.
                  </p>
                </div>
              </div>

              {/* Section 2 */}
              <div id="jvto-arranges" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  2) What JVTO typically arranges (when Ijen is included)
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    When Ijen is included, JVTO typically arranges:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>the mandatory medical check by licensed medical personnel; and</li>
                    <li>digital/printed clearance as required by the local process.</li>
                  </ul>
                  <p>
                    This is included in eligible Ijen itineraries unless stated otherwise on your voucher.
                  </p>
                </div>
              </div>

              {/* Section 3 */}
              <div id="guest-responsibilities" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  3) What you must do as a guest
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    Be honest about relevant health conditions and follow on-site instructions. If screening is required, participation may depend on meeting the minimum health requirements.
                  </p>
                </div>
              </div>

              {/* Section 4 */}
              <div id="safety-equipment" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  4) Safety equipment for Ijen (when Ijen is included)
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    When Ijen is included, JVTO typically provides:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>a gas mask suitable for sulfur conditions; and</li>
                    <li>trekking poles (shared or individual depending on configuration).</li>
                  </ul>
                  <p>
                    Exact inclusions must match what is written on your voucher/package.
                  </p>
                </div>
              </div>

              {/* Section 5 */}
              <div id="access-restrictions" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  5) If Ijen access is restricted or closed
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    If Ijen access is restricted (e.g., closures, hazardous gas, weather), JVTO may adjust the plan for safety. The remedy (alternative route/partial refund/travel credit) depends on the Booking, Payment & Cancellation Policy and the specific services already committed.
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div id="timing-realities" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  6) Timing realities (night trek)
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    Ijen (especially blue-fire schedules) may require overnight departures and early-morning returns. JVTO coordinates timing with local conditions and safety considerations.
                  </p>
                </div>
              </div>

              {/* Section 7 */}
              <div id="included-meals" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  7) What counts as included meals around Ijen
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    Some itineraries include specific meals around Bondowoso/Ijen schedules, but these are <span className="font-semibold">only included if written</span> on your package page and/or voucher.
                  </p>
                </div>
              </div>

              {/* Section 8 */}
              <div id="binding-note" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  8) Binding note
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    If there is any discrepancy, your Official E-Voucher / Invoice (PDF) is the booking-specific contract. For legal terms, refer to the <Link href="/policy/booking-cancellation" className="text-primary hover:underline">Booking, Payment & Cancellation Policy</Link>.
                  </p>
                </div>
              </div>

              {/* FAQ Section */}
              <div id="faq" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg text-left font-bold text-foreground hover:text-primary">
                      Is Ijen health screening mandatory for JVTO guests?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        Yes, when Ijen is included in your itinerary, health screening is a mandatory operational step for safety reasons.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-lg text-left font-bold text-foreground hover:text-primary">
                      What happens if Ijen is closed due to weather or gas conditions?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        JVTO may adjust the plan for safety. The remedy depends on the Booking, Payment & Cancellation Policy and specific services already committed.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-lg text-left font-bold text-foreground hover:text-primary">
                      Are meals around Ijen included?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        Some itineraries include specific meals around Bondowoso/Ijen schedules, but these are only included if written on your package page and/or voucher.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-lg text-left font-bold text-foreground hover:text-primary">
                      What safety equipment is provided for Ijen?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        When Ijen is included, JVTO typically provides a gas mask suitable for sulfur conditions and trekking poles. Exact inclusions must match what is written on your voucher/package.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-lg text-left font-bold text-foreground hover:text-primary">
                      What should I do if I have health concerns?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        Be honest about relevant health conditions and follow on-site instructions. If screening is required, participation may depend on meeting the minimum health requirements. Consult with your doctor before booking if you have concerns.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}