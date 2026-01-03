import Link from "next/link";
import { type Metadata } from "next";
import StructuredData from "@/components/website/StructuredData";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Packing & Fitness for Bromo, Ijen & Tumpak Sewu",
  description:
    "Essential packing list and fitness guidelines for Bromo, Ijen, and Tumpak Sewu tours. Practical tips for cold weather, night treks, and waterfall hikes.",
  openGraph: {
    title: "Packing & Fitness for Bromo, Ijen & Tumpak Sewu",
    description:
      "Essential packing list and fitness guidelines for Bromo, Ijen, and Tumpak Sewu tours. Practical tips for cold weather, night treks, and waterfall hikes.",
    url: `${siteUrl}/travel-guide/packing-and-fitness`,
    siteName: "Java Volcano Tour Operator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteUrl + "/assets/img/og/packing-fitness.webp",
        width: 1200,
        height: 630,
        alt: "Packing and Fitness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Packing & Fitness for Bromo, Ijen & Tumpak Sewu",
    description:
      "Essential packing list and fitness guidelines for Bromo, Ijen, and Tumpak Sewu tours. Practical tips for cold weather, night treks, and waterfall hikes.",
    images: [siteUrl + "/assets/img/og/packing-fitness.webp"],
  },
};

export default function PackingAndFitnessPage() {
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
          { "@type": "AdministrativeArea", name: "East Java" },
          { "@type": "Country", name: "Indonesia" },
          { "@type": "City", name: "Surabaya" },
          { "@type": "Place", name: "Bali" },
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
        name: "Java Volcano Tour Operator (JVTO)",
        description:
          "Java Volcano Tour Operator (JVTO) is a registered Indonesian travel company based in Bondowoso and led by an active Tourist Police officer. We design private, all-inclusive itineraries to Mount Bromo, Ijen Crater and Tumpak Sewu with clear safety rules, transparent pricing and real local impact.",
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        inLanguage: "en",
      },

      {
        "@type": "WebPage",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness#webpage",
        url: "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness",
        name: "Packing & Fitness for Bromo, Ijen & Tumpak Sewu",
        description:
          "Essential packing list and fitness guidelines for Bromo, Ijen, and Tumpak Sewu tours. Practical tips for cold weather, night treks, and waterfall hikes.",
        inLanguage: "en",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/#website",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        image: [
          siteUrl + "/assets/img/jvto-color.png",
          siteUrl + "/assets/img/hero/home.webp",
        ],
        breadcrumb: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness#breadcrumb",
        },
        mainEntity: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness#article",
        },
        relatedLink: [
          "https://javavolcano-touroperator.com/travel-guide/booking-information",
          "https://javavolcano-touroperator.com/travel-guide/faq",
          "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening",
          "https://javavolcano-touroperator.com/travel-guide/safety-on-tours",
          "https://javavolcano-touroperator.com/travel-guide/weather-and-closures",
          "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups",
        ],
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        about: [
          {
            "@type": "TouristAttraction",
            name: "Mount Bromo",
            url: "https://javavolcano-touroperator.com/destinations/mount-bromo",
          },
          {
            "@type": "TouristAttraction",
            name: "Ijen Crater",
            url: "https://javavolcano-touroperator.com/destinations/ijen-crater",
          },
          {
            "@type": "TouristAttraction",
            name: "Tumpak Sewu Waterfall",
            url: "https://javavolcano-touroperator.com/destinations/tumpak-sewu-waterfall",
          },
        ],
      },

      {
        "@type": "BreadcrumbList",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness#breadcrumb",
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
            name: "Packing & Fitness for Bromo, Ijen & Tumpak Sewu",
            item: "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness",
          },
        ],
      },

      {
        "@type": "Article",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness#article",
        headline: "Packing & Fitness for Bromo, Ijen & Tumpak Sewu",
        description:
          "Essential packing list and fitness guidelines for Bromo, Ijen, and Tumpak Sewu tours. Practical tips for cold weather, night treks, and waterfall hikes.",
        inLanguage: "en",
        author: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        image: [
          siteUrl + "/assets/img/jvto-color.png",
          siteUrl + "/assets/img/hero/home.webp",
        ],
        mainEntityOfPage: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness#webpage",
        },
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        articleSection: [
          "Temperature and terrain basics",
          "Essential packing list (practical)",
          "Ijen-specific (night/early trek)",
          "Waterfall-specific (Tumpak Sewu/Madakaripura)",
          "Fitness and pace",
          "Families and seniors",
          "Binding note",
        ],
        about: [
          {
            "@type": "TouristAttraction",
            name: "Mount Bromo",
            url: "https://javavolcano-touroperator.com/destinations/mount-bromo",
          },
          {
            "@type": "TouristAttraction",
            name: "Ijen Crater",
            url: "https://javavolcano-touroperator.com/destinations/ijen-crater",
          },
          {
            "@type": "TouristAttraction",
            name: "Tumpak Sewu Waterfall",
            url: "https://javavolcano-touroperator.com/destinations/tumpak-sewu-waterfall",
          },
        ],
        articleBody:
          "Essential packing list and fitness guidelines for Bromo, Ijen, and Tumpak Sewu tours. Practical tips for cold weather, night treks, and waterfall hikes.",
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
                Packing & Fitness
              </span>
            </nav>

            {/* Main Header */}
            <div className="text-center mb-12">
              <h1 className="font-black text-2xl md:text-5xl mb-6">
                Packing & Fitness for Bromo, Ijen & Tumpak Sewu
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
              <div id="temperature-basics" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  1) Temperature and terrain basics
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    Expect cold mornings at high elevations and wet/slippery
                    paths at waterfalls. Fitness and footwear matter more than
                    most travellers expect.
                  </p>
                </div>
              </div>

              {/* Section 2 */}
              <div id="essential-packing" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  2) Essential packing list (practical)
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>Recommended items:</p>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>warm jacket / thermal layer</li>
                    <li>rain jacket / poncho</li>
                    <li>comfortable walking shoes with grip</li>
                    <li>small daypack</li>
                    <li>personal medications</li>
                    <li>headlamp (optional but helpful for early starts)</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div id="ijen-specific" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  3) Ijen-specific (night/early trek)
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>Recommended for Ijen:</p>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>warm layers for night wind</li>
                    <li>gloves / beanie (optional)</li>
                    <li>energy snack (optional)</li>
                  </ul>
                  <p>
                    Gas mask and trekking support are typically provided when
                    Ijen is included, as written in your voucher/package.
                  </p>
                </div>
              </div>

              {/* Section 4 */}
              <div id="waterfall-specific" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  4) Waterfall-specific (Tumpak Sewu/Madakaripura)
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>Bring:</p>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>quick-dry clothes</li>
                    <li>sandals/river shoes (optional)</li>
                    <li>phone waterproof protection (optional)</li>
                  </ul>
                  <p>
                    Local conditions may require adapting the route for safety.
                  </p>
                </div>
              </div>

              {/* Section 5 */}
              <div id="fitness-pace" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  5) Fitness and pace
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    JVTO will support pacing, but each guest must assess their
                    own fitness. Inform JVTO in advance about health concerns
                    that could affect trekking.
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div id="families-seniors" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  6) Families and seniors
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    Some itineraries are suitable for mixed ages, but certain
                    hikes may not be appropriate for everyone. JVTO can advise
                    on alternatives depending on your route.
                  </p>
                </div>
              </div>

              {/* Section 7 */}
              <div id="binding-note" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  7) Binding note
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    For what equipment and logistics are included, refer to the{" "}
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
                      How cold does it get at Bromo sunrise?
                    </h3>
                    <p className="text-muted-foreground">
                      Temperatures at Bromo viewpoints can drop to 5-10°C
                      (41-50°F), and with wind chill it can feel even colder.
                      Layered clothing, a warm jacket, beanie, and gloves are
                      essential.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      What type of shoes are best?
                    </h3>
                    <p className="text-muted-foreground">
                      For Bromo and Ijen: closed walking shoes or light hiking
                      boots with good grip. For Tumpak Sewu: shoes that can get
                      wet with excellent traction, or sport sandals with heel
                      straps.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      Do I need to bring my own gas mask for Ijen?
                    </h3>
                    <p className="text-muted-foreground">
                      No, when Ijen is included in your tour, JVTO typically
                      provides a professional gas mask suitable for sulfur
                      conditions. This is included as written on your
                      voucher/package.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      What if I'm not very fit?
                    </h3>
                    <p className="text-muted-foreground">
                      JVTO aims to support guests with various fitness levels
                      and pacing. However, guests should be able to walk 3–4
                      hours with breaks (typical range depends on the
                      itinerary). If you have concerns, please discuss them with
                      JVTO before booking to assess suitability.{" "}
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      Can children join these tours?
                    </h3>
                    <p className="text-muted-foreground">
                      Some itineraries are family-friendly, but certain hikes
                      (especially Ijen night trek and Tumpak Sewu) may not be
                      suitable for young children. JVTO can advise on
                      age-appropriate alternatives.
                    </p>
                  </div>
                </div>
              </div>

              {/* Packing Checklist */}
              <div
                id="checklist"
                className="scroll-mt-24 bg-gray-50 p-6 rounded-lg"
              >
                <h2 className="heading-md font-black text-2xl mb-6 text-foreground">
                  Quick Packing Checklist
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-lg mb-3 text-foreground">
                      Clothing & Protection
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Warm jacket / thermal layer</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Rain jacket / poncho</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Comfortable walking trousers</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Extra socks</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Beanie / gloves (for Bromo/Ijen)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Sunglasses & sunscreen</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-3 text-foreground">
                      Gear & Essentials
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Walking shoes with good grip</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Small daypack</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Headlamp / flashlight</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Personal medications</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Power bank & charging cable</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Passport copy (printed/digital)</span>
                      </li>
                    </ul>
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
