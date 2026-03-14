import Link from "next/link";
import { type Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import StructuredData from "@/components/website/StructuredData";
import Sidebar from "../sidebar";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title:
    "Ijen Health Screening – Real Checks, Digital Proof & QR | Java Volcano Tour Operator",
  description:
    "Learn how Ijen health screening works with JVTO: real checks by trained staff, digital records with QR codes, and a public tool for non-JVTO travellers.",
  openGraph: {
    title:
      "Ijen Health Screening – Real Checks, Digital Proof & QR | Java Volcano Tour Operator",
    description:
      "Learn how Ijen health screening works with JVTO: real checks by trained staff, digital records with QR codes, and a public tool for non-JVTO travellers.",
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
    title:
      "Ijen Health Screening – Real Checks, Digital Proof & QR | Java Volcano Tour Operator",
    description:
      "Learn how Ijen health screening works with JVTO: real checks by trained staff, digital records with QR codes, and a public tool for non-JVTO travellers.",
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
        description:
          "Learn how Ijen health screening works with JVTO: real checks by trained staff, digital records with QR codes, and a public tool for non-JVTO travellers.",
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
        description:
          "Learn how Ijen health screening works with JVTO: real checks by trained staff, digital records with QR codes, and a public tool for non-JVTO travellers.",
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
          "For JVTO Guests – What We Include",
          "For Non-JVTO Travellers – Using the Public Digital Tool",
          "At the Ijen Gate – How the QR Is Used",
          "If the Screening Says 'Not Recommended to Hike'",
          "What This Screening Is – And What It Is Not",
          "Data & Privacy",
          "Quick Questions About Ijen Screening",
        ],
        articleBody:
          "Information about Ijen health screening procedures, safety equipment, digital QR verification, and operational guidelines for Mount Ijen hikes with JVTO.",
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
            name: "Is Ijen health screening mandatory?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Screening is stated as standard for JVTO guests attempting the Ijen night hike, and non-JVTO visitors are strongly encouraged to use official screening channels; local authorities may require proof at certain times.",
            },
            inLanguage: "en",
            lastReviewed: "2025-12-05",
            dateModified: "2025-12-05",
          },
          {
            "@type": "Question",
            name: "Does screening guarantee that nothing will happen?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No; screening reduces risk but does not guarantee outcomes, and access may still change due to conditions.",
            },
            inLanguage: "en",
            lastReviewed: "2025-12-05",
            dateModified: "2025-12-05",
          },
          {
            "@type": "Question",
            name: "Does screening affect my insurance?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Screening is a safety/verification step and not a replacement for travel insurance; guests remain responsible for arranging appropriate coverage.",
            },
            inLanguage: "en",
            lastReviewed: "2025-12-05",
            dateModified: "2025-12-05",
          },
          {
            "@type": "Question",
            name: "What happens if the screening says 'Not Recommended to Hike'?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Do not hike if screening suggests it is unsafe. JVTO will discuss alternatives in line with the Booking, Payment & Cancellation Policy and your Official E-Voucher.",
            },
            inLanguage: "en",
            lastReviewed: "2025-12-05",
            dateModified: "2025-12-05",
          },
          {
            "@type": "Question",
            name: "How is the QR code used at the Ijen gate?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Gate staff may verify that screening occurred by checking the QR code. This is for safety traceability to ensure screening is real and reduce falsified documents.",
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
    <div className="flex min-h-screen bg-background">
      <StructuredData data={pageSchema} />

      <Sidebar />

      <main className="flex-1 pt-24 md:pt-36 pb-20">
        <section className="bg-accent border-b">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Breadcrumb Navigation */}
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
                Ijen Health Screening
              </span>
            </nav>

            {/* Main Header */}
            <div className=" mb-12">
              <h1 className="font-black text-2xl md:text-5xl mb-6">
                Ijen Health Screening – Real Checks, Digital Proof
              </h1>

              {/* Disclaimer Box */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left rounded-r-lg">
                <p className="text-sm italic mb-2">
                  <strong>Note:</strong> This Travel Guide is for information
                  and trip planning. For binding terms (payments, cancellations,
                  refunds/credits), please refer to the official policies and
                  your <strong>Official E-Voucher / Invoice (PDF)</strong>. If
                  anything differs, the E-Voucher/Invoice and the Policy pages
                  take precedence.
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
                  1) Why Ijen Health Screening Matters
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Ijen screening exists because Kawah Ijen is demanding and
                    exposure conditions can be risky.
                  </strong>{" "}
                  Kawah Ijen is a night hike with steep sections, cold
                  temperatures, and possible sulfur gas exposure.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Ijen screening also exists to reduce fake or incomplete
                    checks.
                  </strong>{" "}
                  In the past, some visitors reached the gate without real
                  screening or with fake letters, putting visitors, local teams,
                  and authorities at risk.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    JVTO supports a system where screening is real and
                    verifiable.
                  </strong>{" "}
                  Guests attempt the hike only after a real screening, and
                  results can be checked digitally to prove screening occurred.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  2) For JVTO Guests – What We Include
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Ijen night-hike tours include screening as part of your JVTO
                    package.
                  </strong>{" "}
                  If your tour includes the Ijen night hike, your package
                  includes a health screening before the hike.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Expect screening to follow a practical, documented workflow.
                  </strong>{" "}
                  Screening typically happens before departure for the night
                  hike at a partner accommodation or clinic, performed by
                  trained medical staff, and includes basic measurements and
                  relevant questions.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Expect digital recording and QR linkage.</strong> The
                  result is recorded in a secure digital system and linked to a
                  QR code.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Use your E-Voucher and briefing for exact timing and
                    requirements.
                  </strong>{" "}
                  Your Official E-Voucher and daily briefing will show
                  where/when screening occurs and what you need to prepare.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  3) For Non-JVTO Travellers – Using the Public Digital Tool
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Non-JVTO travellers can use the same workflow through a
                    public tool.
                  </strong>{" "}
                  The digital screening workflow is described as available for
                  other travellers through a public web tool.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Follow the register → screen → QR clearance flow.
                  </strong>{" "}
                  You register basic details and intended hiking time, attend
                  screening with a participating provider, and if cleared,
                  receive a QR-linked clearance that gate staff can verify.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Use the official access instructions for the tool.
                  </strong>{" "}
                  For access to the public tool, follow information on
                  health.mountijen.com or as communicated by local authorities
                  and official providers.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  4) At the Ijen Gate – How the QR Is Used
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Expect gate staff to verify that screening occurred.
                  </strong>{" "}
                  Staff may ask if you completed screening and may check
                  clearance via QR code or reference.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Treat QR verification as safety traceability, not
                    bureaucracy.
                  </strong>{" "}
                  The purpose is to ensure screening is real and traceable,
                  reduce falsified letters, and help identify guests who may not
                  be fit for a demanding hike.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 5 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  5) If the Screening Says "Not Recommended to Hike"
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Do not hike if screening suggests it is unsafe.
                  </strong>{" "}
                  JVTO will not force the hike and will respect screening
                  results.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Expect itinerary alternatives to follow policy and your
                    E-Voucher.
                  </strong>{" "}
                  JVTO will discuss alternatives in line with the Booking,
                  Payment & Cancellation Policy and your Official E-Voucher.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Do not assume screening outcomes automatically produce
                    refunds.
                  </strong>{" "}
                  Health-related decisions are serious and may affect what is
                  possible, but they do not automatically mean a full refund.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 6 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  6) What This Screening Is – And What It Is Not
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Use screening as a practical risk filter and verification
                    step.
                  </strong>{" "}
                  It helps identify basic risks before a demanding night hike
                  and provides a verifiable record that screening took place.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Do not treat screening as a guarantee or full medical
                    evaluation.
                  </strong>{" "}
                  It is not a hospital admission, full medical check-up, or
                  guarantee of safety, and conditions can still change quickly.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 7 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  7) Data & Privacy
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Treat screening data as limited to what is required for
                    clearance.
                  </strong>{" "}
                  The system records only the information required to operate
                  the screening and clearance process.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Use the dedicated Privacy Policy for details when finalised.
                  </strong>{" "}
                  Details on collection, retention, and protection are described
                  as belonging in a dedicated Privacy Policy once finalised.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* FAQ Section */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-foreground">
                  8) Quick Questions About Ijen Screening
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg text-left font-bold text-foreground hover:text-primary">
                      Q1. Is Ijen health screening mandatory?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        <strong>
                          Screening is stated as standard for JVTO guests
                          attempting the Ijen night hike,
                        </strong>{" "}
                        and non-JVTO visitors are strongly encouraged to use
                        official screening channels; local authorities may
                        require proof at certain times.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-lg text-left font-bold text-foreground hover:text-primary">
                      Q2. Does screening guarantee that nothing will happen?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        <strong>No;</strong> screening reduces risk but does not
                        guarantee outcomes, and access may still change due to
                        conditions.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-lg text-left font-bold text-foreground hover:text-primary">
                      Q3. Does screening affect my insurance?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        <strong>
                          Screening is a safety/verification step and not a
                          replacement for travel insurance;
                        </strong>{" "}
                        guests remain responsible for arranging appropriate
                        coverage.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-lg text-left font-bold text-foreground hover:text-primary">
                      What happens if the screening says "Not Recommended to
                      Hike"?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        <strong>
                          Do not hike if screening suggests it is unsafe.
                        </strong>{" "}
                        JVTO will discuss alternatives in line with the Booking,
                        Payment & Cancellation Policy and your Official
                        E-Voucher. Health-related decisions do not automatically
                        mean a full refund.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-lg text-left font-bold text-foreground hover:text-primary">
                      How is the QR code used at the Ijen gate?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        <strong>
                          Gate staff may verify that screening occurred by
                          checking the QR code.
                        </strong>{" "}
                        This is for safety traceability to ensure screening is
                        real and traceable, reduce falsified letters, and help
                        identify guests who may not be fit for a demanding hike.
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
