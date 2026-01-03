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
          "Safety-first operational rule",
          "Vehicles and driver standards",
          "Site guides and local rules",
          "Ijen sulfur environment",
          "Emergency handling",
          "Guest responsibilities",
          "Photography and risky behavior",
          "Binding note",
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
                  This page is informational. Binding terms are defined by the
                  documents below.
                </p>
                <p className="font-semibold text-foreground mb-2">
                  Order of precedence (if there is any discrepancy):
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>
                    Official E-Voucher / Invoice (PDF) (your booking-specific
                    contract)
                  </li>
                  <li>
                    <Link
                      href="/policy/booking-cancellation"
                      className="text-primary hover:underline"
                    >
                      Booking, Payment & Cancellation Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/policy/inclusions-exclusions"
                      className="text-primary hover:underline"
                    >
                      Inclusions & Exclusions Policy
                    </Link>
                  </li>
                  <li>Travel Guide pages (informational)</li>
                </ol>
              </div>

              {/* Contact Help */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-left rounded-r-lg">
                <p className="font-semibold text-foreground mb-2">Need help?</p>
                <p className="text-sm">
                  WhatsApp{" "}
                  <a
                    href="https://wa.me/6282244788833"
                    className="text-primary hover:underline"
                  >
                    +62 822-4478-8833
                  </a>{" "}
                  or email{" "}
                  <a
                    href="mailto:hello@javavolcano-touroperator.com"
                    className="text-primary hover:underline"
                  >
                    hello@javavolcano-touroperator.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-12">
              {/* Section 1 */}
              <div id="safety-rule" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  1) Safety-first operational rule
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    JVTO may adjust routes, timings, and site choices when
                    required for safety (weather, closures, volcanic gas,
                    traffic risks).
                  </p>
                </div>
              </div>

              {/* Section 2 */}
              <div id="vehicles-standards" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  2) Vehicles and driver standards
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    Tours use private, air-conditioned vehicles with
                    professional drivers. Vehicle allocation and additional
                    vehicles depend on group size and route requirements.
                  </p>
                </div>
              </div>

              {/* Section 3 */}
              <div id="site-guides" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  3) Site guides and local rules
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    Certain sites require licensed local guides or follow local
                    authority instructions. JVTO coordinates compliance as part
                    of the tour logistics.
                  </p>
                </div>
              </div>

              {/* Section 4 */}
              <div id="ijen-environment" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  4) Ijen sulfur environment
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    Ijen is a sulfur environment. When Ijen is included, safety
                    equipment (gas mask) and trekking support are typically
                    provided as written in your voucher/package.
                  </p>
                </div>
              </div>

              {/* Section 5 */}
              <div id="emergency-handling" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  5) Emergency handling
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    JVTO crew can help coordinate basic response and logistics
                    adjustments, including assisting with local
                    clinics/hospitals where feasible. Guests should have travel
                    insurance for medical and evacuation coverage.
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div id="guest-responsibilities" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  6) Guest responsibilities
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    Guests must follow crew instructions, respect safety
                    boundaries, and disclose relevant health conditions for
                    trekking-heavy routes.
                  </p>
                </div>
              </div>

              {/* Section 7 */}
              <div id="photography-behavior" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  7) Photography and risky behavior
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    Do not attempt risky positions near cliffs, crater edges, or
                    waterfalls for photos. JVTO may restrict access to unsafe
                    areas.
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
                    For included safety gear and services, refer to the{" "}
                    <Link
                      href="/policy/inclusions-exclusions"
                      className="text-primary hover:underline"
                    >
                      Inclusions & Exclusions Policy
                    </Link>{" "}
                    and your Official E-Voucher / Invoice (PDF).
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
                      What safety equipment is provided for Ijen?
                    </h3>
                    <p className="text-muted-foreground">
                      When Ijen is included, JVTO typically provides a
                      professional gas mask suitable for sulfur conditions and
                      trekking poles. Exact inclusions must match what is
                      written on your voucher/package.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      What happens in case of a medical emergency?
                    </h3>
                    <p className="text-muted-foreground">
                      JVTO crew can help coordinate basic response and assist
                      with local clinics/hospitals where feasible. However,
                      guests must have their own travel insurance for medical
                      and evacuation coverage.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      Can JVTO cancel tours for safety reasons?
                    </h3>
                    <p className="text-muted-foreground">
                      Yes, JVTO may adjust or cancel activities when required
                      for safety due to weather, volcanic activity, closures, or
                      other risks. This follows our safety-first operational
                      rule.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      What if a guest doesn't follow safety instructions?
                    </h3>
                    <p className="text-muted-foreground">
                      Guests must follow crew instructions and respect safety
                      boundaries. JVTO may restrict access to unsafe areas or
                      activities if guests engage in risky behavior.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      Are local guides included at all sites?
                    </h3>
                    <p className="text-muted-foreground">
                      Certain sites require licensed local guides per local
                      regulations. JVTO coordinates this compliance as part of
                      the tour logistics. Check your voucher for specific
                      inclusions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Safety Checklist */}
              <div
                id="safety-checklist"
                className="scroll-mt-24 bg-green-50 border-l-4 border-green-400 p-6 rounded-lg"
              >
                <h2 className="heading-md font-black text-2xl mb-6 text-foreground">
                  Safety Checklist for Guests
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-lg mb-3 text-foreground">
                      Before Your Tour
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>
                          Purchase travel insurance with medical and evacuation
                          coverage
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>
                          Disclose relevant health conditions during booking
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Check weather and pack appropriate clothing</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>
                          Review your voucher for included safety equipment
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-3 text-foreground">
                      During Your Tour
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Always follow crew instructions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>
                          Respect safety boundaries and restricted areas
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Use provided safety equipment properly</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>
                          Report any health concerns to your guide immediately
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div
                id="important-notice"
                className="scroll-mt-24 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg"
              >
                <h3 className="font-bold text-lg mb-3 text-foreground">
                  Important Safety Notice
                </h3>
                <p className="text-muted-foreground mb-3">
                  JVTO is led by an active Tourist Police officer with
                  professional experience in tourist safety. This influences our
                  safety approach:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>
                    We plan routes with real local regulations and risk patterns
                    in mind
                  </li>
                  <li>
                    We work only with drivers, guides, and partners we can
                    brief, train, and hold accountable
                  </li>
                  <li>
                    We use documented processes instead of informal shortcuts
                  </li>
                  <li>All tours are private-only for better safety control</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Safety is a shared responsibility. JVTO commits to
                  professional standards, and we ask guests to follow
                  instructions and respect safety boundaries.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
