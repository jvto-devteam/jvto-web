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
          "Why Ijen Health Screening Matters",
          "For JVTO Guests — What's Included",
          "At the Ijen Gate — What Happens",
          "Important Clarification",
          "Data & Privacy",
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
            name: "What safety equipment is provided for Ijen?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "When Ijen is included, JVTO typically provides a gas mask suitable for sulfur conditions and trekking poles.",
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
                  1) Why Ijen Health Screening Matters
                </h2>
                <p className="text-muted-foreground mb-4">
                  Kawah Ijen is a high-exertion night hike with cold temperatures and potential exposure to sulfur gas. JVTO supports a screening system so that:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
                  <li>guests attempt the hike <strong>only after a real screening</strong>, and</li>
                  <li>results can be checked digitally (when required by local providers/authorities).</li>
                </ul>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  2) For JVTO Guests — What's Included
                </h2>
                <p className="text-muted-foreground mb-4">
                  If your JVTO tour includes the <strong>Ijen night hike</strong>, your package includes a <strong>health screening before the hike</strong>.
                </p>
                <p className="text-muted-foreground mb-4">
                  What to expect:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
                  <li>
                    Screening is performed by <strong>trained medical staff</strong> following local guidelines.
                  </li>
                  <li>
                    Typical checks include simple measurements (for example <strong>blood pressure and oxygen level</strong>) plus a short set of questions.
                  </li>
                  <li>
                    You may be asked to bring a form of <strong>ID</strong> and/or fill a short form.
                  </li>
                </ul>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  3) At the Ijen Gate — What Happens
                </h2>
                <p className="text-muted-foreground">
                  At certain times, local authorities/providers may verify that screening was completed before allowing entry for the Ijen night hike.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  4) Important Clarification
                </h2>
                <p className="text-muted-foreground mb-4">
                  Screening helps reduce risk but does not guarantee that nothing will happen. Conditions at Ijen remain subject to:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
                  <li>local authority decisions,</li>
                  <li>weather and visibility conditions, and</li>
                  <li>safety assessments by JVTO and on-site teams.</li>
                </ul>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 5 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  5) Data & Privacy
                </h2>
                <p className="text-muted-foreground mb-4">
                  If any personal data is collected during screening, it is handled in line with JVTO's privacy commitments and the requirements of local providers/authorities.
                </p>
                <p className="text-muted-foreground">
                  Privacy Policy:{' '}
                  <Link href="/policy/privacy" className="text-primary hover:underline">
                    /policy/privacy
                  </Link>
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* FAQ Section */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-foreground">
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
                      What safety equipment is provided for Ijen?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        When Ijen is included, JVTO typically provides a gas mask suitable for sulfur conditions and trekking poles.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-lg text-left font-bold text-foreground hover:text-primary">
                      What should I do if I have health concerns?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        Be honest about relevant health conditions and follow on-site instructions. If screening is required, participation may depend on meeting the minimum health requirements. Consult with your doctor before booking if you have concerns.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-lg text-left font-bold text-foreground hover:text-primary">
                      What if I don't pass the health screening?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        If health screening indicates that the Ijen hike may pose a risk, JVTO staff will discuss alternative options or adjustments to the itinerary based on safety considerations and the Booking, Payment & Cancellation Policy.
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