import StructuredData from "@/components/website/StructuredData";
import Link from "next/link";
import { type Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Safety on JVTO Tours",
  description:
    "Safety guidelines and procedures for JVTO tours. Learn about vehicle standards, safety equipment, guest responsibilities, and emergency handling.",
  openGraph: {
    title: "Safety on JVTO Tours",
    description:
      "Safety guidelines and procedures for JVTO tours. Learn about vehicle standards, safety equipment, guest responsibilities, and emergency handling.",
    url: `${siteUrl}/travel-guide/safety-on-tours`,
    siteName: "Java Volcano Tour Operator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteUrl + "/assets/img/og/safety-tours.webp",
        width: 1200,
        height: 630,
        alt: "Safety on Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Safety on JVTO Tours",
    description:
      "Safety guidelines and procedures for JVTO tours. Learn about vehicle standards, safety equipment, guest responsibilities, and emergency handling.",
    images: [siteUrl + "/assets/img/og/safety-tours.webp"],
  },
};

export default function SafetyOnToursPage() {
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
          "https://javavolcano-touroperator.com/travel-guide/safety-on-tours#webpage",
        url: "https://javavolcano-touroperator.com/travel-guide/safety-on-tours",
        name: "Safety on JVTO Tours",
        description:
          "Safety guidelines and procedures for JVTO tours. Learn about vehicle standards, safety equipment, guest responsibilities, and emergency handling.",
        inLanguage: "en",
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
        breadcrumb: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/safety-on-tours#breadcrumb",
        },
        mainEntity: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/safety-on-tours#article",
        },
        image: {
          "@type": "ImageObject",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/safety-on-tours#breadcrumb",
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
            item: "https://javavolcano-touroperator.com/travel-guide/",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Safety on Tours",
            item: "https://javavolcano-touroperator.com/travel-guide/safety-on-tours",
          },
        ],
      },
      {
        "@type": "Article",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/safety-on-tours#article",
        headline: "Safety on JVTO Tours",
        description:
          "Safety guidelines and procedures for JVTO tours. Learn about vehicle standards, safety equipment, guest responsibilities, and emergency handling.",
        inLanguage: "en",
        url: "https://javavolcano-touroperator.com/travel-guide/safety-on-tours",
        isPartOf: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/safety-on-tours#webpage",
        },
        author: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        mainEntityOfPage: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/safety-on-tours#webpage",
        },
        articleSection: [
          "Safety Comes First",
          "Ijen Safety (When Ijen Is Included)",
          "Driving & Logistics Safety",
          "Guest Responsibilities (Practical)",
          "Official References"
        ],
        articleBody:
          "Safety guidelines and procedures for JVTO tours. Learn about vehicle standards, safety equipment, guest responsibilities, and emergency handling.",
        image: {
          "@type": "ImageObject",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
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
              "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups",
            name: "Police Escort for Groups",
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
                Safety on Tours
              </span>
            </nav>

            {/* Main Header */}
            <div className="text-center mb-12">
              <h1 className="font-black text-2xl md:text-5xl mb-6">
                Safety on JVTO Tours
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
                  1) Safety Comes First
                </h2>
                <p className="text-muted-foreground">
                  JVTO operates with safety and legal access as the priority. Routes may be adjusted if conditions change.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  2) Ijen Safety (When Ijen Is Included)
                </h2>
                <p className="text-muted-foreground mb-4">
                  Eligible Ijen routes typically include:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
                  <li>sulfur-rated gas mask for each guest,</li>
                  <li>trekking support (poles depending on configuration),</li>
                  <li>a mandatory pre-hike health screening arranged by JVTO.</li>
                </ul>
                <p className="text-muted-foreground">
                  Always follow on-site instructions for gas mask use and movement around the crater area.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  3) Driving & Logistics Safety
                </h2>
                <p className="text-muted-foreground mb-4">
                  Your assigned crew coordinates:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>safe driving practices,</li>
                  <li>timing to avoid unsafe conditions where possible,</li>
                  <li>coordination with jeep operators, hotels, and local authorities.</li>
                </ul>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  4) Guest Responsibilities (Practical)
                </h2>
                <p className="text-muted-foreground mb-4">
                  Guests are expected to:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
                  <li>be on time for pickups,</li>
                  <li>follow safety instructions at sites,</li>
                  <li>disclose relevant limitations (fitness/health concerns) before the tour where applicable.</li>
                </ul>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 5 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  5) Official References
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>
                    Inclusions & Exclusions:{' '}
                    <Link href="/policy/inclusions-exclusions" className="text-primary hover:underline">
                      /policy/inclusions-exclusions
                    </Link>
                  </li>
                  <li>
                    Booking Policy:{' '}
                    <Link href="/policy/booking-payment-cancellation" className="text-primary hover:underline">
                      /policy/booking-payment-cancellation
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* FAQ Section */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-foreground">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      What safety equipment is provided for Ijen?
                    </h3>
                    <p className="text-muted-foreground">
                      When Ijen is included, JVTO typically provides a sulfur-rated gas mask for each guest and trekking support (poles depending on configuration).
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      What happens in case of a medical emergency?
                    </h3>
                    <p className="text-muted-foreground">
                      JVTO crew can help coordinate basic response and assist with local clinics/hospitals where feasible. However, guests must have their own travel insurance for medical and evacuation coverage.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      Can JVTO cancel tours for safety reasons?
                    </h3>
                    <p className="text-muted-foreground">
                      Yes, JVTO may adjust routes or activities when required for safety due to weather, volcanic activity, closures, or other risks. Safety is our priority.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      What if a guest doesn't follow safety instructions?
                    </h3>
                    <p className="text-muted-foreground">
                      Guests must follow crew instructions and respect safety boundaries. JVTO may restrict access to unsafe areas or activities if guests engage in risky behavior.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      What is the health screening for Ijen?
                    </h3>
                    <p className="text-muted-foreground">
                      When Ijen is included, JVTO arranges a mandatory pre-hike health screening by trained medical staff to ensure guests are fit for the trek. This typically includes basic measurements and questions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}