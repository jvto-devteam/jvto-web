import Link from "next/link";
import { type Metadata } from "next";
import StructuredData from "@/components/website/StructuredData";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Traffic Police Escort for Tourist Groups in East Java",
  description: "Learn about traffic police escort services for large tourist groups in East Java. When it's available, how it's arranged, and what it includes.",
  openGraph: {
    title: "Traffic Police Escort for Tourist Groups in East Java",
    description: "Learn about traffic police escort services for large tourist groups in East Java. When it's available, how it's arranged, and what it includes.",
    url: `${siteUrl}/travel-guide/police-escort-for-groups`,
    siteName: "Java Volcano Tour Operator",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: siteUrl + "/assets/img/og/police-escort.webp",
        width: 1200,
        height: 630,
        alt: "Police Escort for Groups",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Traffic Police Escort for Tourist Groups in East Java",
    description: "Learn about traffic police escort services for large tourist groups in East Java. When it's available, how it's arranged, and what it includes.",
    images: [siteUrl + "/assets/img/og/police-escort.webp"],
  },
};

export default function PoliceEscortForGroupsPage() {
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
        paymentAccepted: "Credit Card, Bank Transfer",
      },
      {
        "@type": "WebSite",
        "@id": "https://javavolcano-touroperator.com/#website",
        url: "https://javavolcano-touroperator.com",
        name: "Java Volcano Tour Operator",
        description:
          "Java Volcano Tour Operator (JVTO) is a registered Indonesian travel company based in Bondowoso and led by an active Tourist Police officer. We design private, all-inclusive itineraries to Mount Bromo, Ijen Crater and Tumpak Sewu with clear safety rules, transparent pricing and real local impact.",
        inLanguage: "en",
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
      },
      {
        "@type": "WebPage",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#webpage",
        url: "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups",
        name: "Traffic Police Escort for Tourist Groups in East Java",
        description:
          "Learn about traffic police escort services for large tourist groups in East Java. When it's available, how it's arranged, and what it includes.",
        inLanguage: "en",
        image: {
          "@type": "ImageObject",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/#website",
        },
        hasPart: [
          {
            "@id":
              "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#faq",
          },
        ],
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        breadcrumb: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#breadcrumb",
        },
        mainEntity: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#article",
        },
        relatedLink: [
          "https://javavolcano-touroperator.com/why-jvto/the-jvto-difference",
          "https://javavolcano-touroperator.com/why-jvto/reviews",
          "https://javavolcano-touroperator.com/travel-guide/booking-information",
          "https://javavolcano-touroperator.com/travel-guide/faq",
          "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening",
          "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness",
          "https://javavolcano-touroperator.com/travel-guide/safety-on-tours",
          "https://javavolcano-touroperator.com/travel-guide/weather-and-closures",
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://javavolcano-touroperator.com/",
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
            name: "Traffic Police Escort for Groups",
            item: "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups",
          },
        ],
      },
      {
        "@type": "Article",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#article",
        headline: "Traffic Police Escort for Tourist Groups in East Java",
        description:
          "Learn about traffic police escort services for large tourist groups in East Java. When it's available, how it's arranged, and what it includes.",
        inLanguage: "en",
        url: "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups",
        image: {
          "@type": "ImageObject",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        isPartOf: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#webpage",
        },
        author: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        mainEntityOfPage: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#webpage",
        },
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        articleSection: [
          "What it is (and what it is not)",
          "Is it included by default?",
          "When it may be relevant",
          "How it is arranged",
          "Limitations",
          "Timing and coordination",
          "Responsibility",
          "Binding note",
        ],
        articleBody:
          "Information about traffic police escort services for large tourist groups in East Java. When it's available, how it's arranged, and what it includes.",
        mentions: [
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening",
            name: "Ijen Health Screening",
          },
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness",
            name: "Packing & Fitness",
          },
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide/weather-and-closures",
            name: "Weather & Closures",
          },
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide/booking-information",
            name: "Booking Information",
          },
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide/safety-on-tours",
            name: "Safety On Tours",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#faq",
        url: "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups",
        inLanguage: "en",
        isPartOf: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#webpage",
        },
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        mainEntity: [
          {
            "@type": "Question",
            name: "Is police escort included in standard tour packages?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Police escort is a conditional inclusion and only applies if explicitly written on your package page and/or voucher.",
            },
          },
          {
            "@type": "Question",
            name: "Can any group request police escort?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "It may be considered for large groups with multiple vehicles, VIP movements, or routes with known congestion risks, but availability depends on local regulations and operational conditions.",
            },
          },
          {
            "@type": "Question",
            name: "Does police escort guarantee faster travel times?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Safety always overrides speed. Escort helps with coordination but does not override road laws, weather limits, or park closures.",
            },
          },
          {
            "@type": "Question",
            name: "How is police escort arranged?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "If requested, JVTO confirms feasibility, availability, required permits, pricing, and scope. Only written confirmation in your voucher counts as included.",
            },
          },
          {
            "@type": "Question",
            name: "What happens if conditions change?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Availability depends on local regulations and operational conditions. JVTO cannot promise this service unless it is confirmed in writing.",
            },
          },
        ],
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
                Police Escort for Groups
              </span>
            </nav>

            {/* Main Header */}
            <div className="text-center mb-12">
              <h1 className="font-black text-2xl md:text-5xl mb-6">
                Traffic Police Escort for Tourist Groups in East Java
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
              <div id="what-it-is" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  1) What it is (and what it is not)
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    A traffic police escort (when available and permitted) is a coordination service that may help large/VIP groups move more smoothly under certain conditions. It does not override road law, weather limits, or park closures.
                  </p>
                </div>
              </div>

              {/* Section 2 */}
              <div id="included-by-default" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  2) Is it included by default?
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    No. Police escort or special convoy arrangements are <span className="font-semibold">conditional inclusions</span> and only apply if explicitly written on your package page and/or voucher.
                  </p>
                </div>
              </div>

              {/* Section 3 */}
              <div id="when-relevant" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  3) When it may be relevant
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    It may be considered for:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>large groups with multiple vehicles</li>
                    <li>VIP movements with tight timing windows</li>
                    <li>routes with known congestion risks (subject to local reality)</li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div id="how-arranged" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  4) How it is arranged
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    If requested, JVTO will confirm:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>feasibility and availability</li>
                    <li>any required permits/coordination</li>
                    <li>pricing and scope (if applicable)</li>
                  </ul>
                  <p>
                    Only written confirmation in your voucher counts as included.
                  </p>
                </div>
              </div>

              {/* Section 5 */}
              <div id="limitations" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  5) Limitations
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    Availability depends on local regulations and operational conditions. JVTO cannot promise this service unless it is confirmed in writing.
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div id="timing-coordination" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  6) Timing and coordination
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    If included, JVTO coordinates timing and meeting points with local authorities and your vehicle convoy.
                  </p>
                </div>
              </div>

              {/* Section 7 */}
              <div id="responsibility" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  7) Responsibility
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    Guests must follow instructions from the escort and JVTO crew. Safety always overrides speed.
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
                    Your Official E-Voucher / Invoice (PDF) is the final reference for whether police escort is included.
                  </p>
                </div>
              </div>

              {/* FAQ Section */}
              <div id="faq" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      Is police escort included in standard tour packages?
                    </h3>
                    <p className="text-muted-foreground">
                      No. Police escort is a conditional inclusion and only applies if explicitly written on your package page and/or voucher.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      Can any group request police escort?
                    </h3>
                    <p className="text-muted-foreground">
                      It may be considered for large groups with multiple vehicles, VIP movements, or routes with known congestion risks, but availability depends on local regulations and operational conditions.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      Does police escort guarantee faster travel times?
                    </h3>
                    <p className="text-muted-foreground">
                      No. Safety always overrides speed. Escort helps with coordination but does not override road laws, weather limits, or park closures.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      How is police escort arranged?
                    </h3>
                    <p className="text-muted-foreground">
                      If requested, JVTO confirms feasibility, availability, required permits, pricing, and scope. Only written confirmation in your voucher counts as included.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      What happens if conditions change?
                    </h3>
                    <p className="text-muted-foreground">
                      Availability depends on local regulations and operational conditions. JVTO cannot promise this service unless it is confirmed in writing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div id="important-notice" className="scroll-mt-24 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-foreground">
                  Important Notice
                </h3>
                <p className="text-muted-foreground mb-3">
                  JVTO's founder has professional experience in tourist and traffic safety in East Java. This experience helps with:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Understanding when escort services can be requested legally</li>
                  <li>Communicating with relevant police units in a structured way</li>
                  <li>Designing group routes that respect regulations</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  However, JVTO does not promise that escort will always be available and does not offer unofficial, unapproved escort services. All escort services are subject to formal approval by traffic police.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}