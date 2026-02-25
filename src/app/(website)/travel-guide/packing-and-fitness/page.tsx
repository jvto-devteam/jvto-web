import Link from "next/link";
import { type Metadata } from "next";
import StructuredData from "@/components/website/StructuredData";
import Sidebar from "../sidebar";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Packing & Fitness for Bromo, Ijen & Tumpak Sewu | JVTO",
  description:
    "What to pack and how fit you should be for private tours to Bromo, Ijen and Tumpak Sewu. Clear expectations, simple fitness checklist, and links to our safety and health screening guides.",
  openGraph: {
    title: "Packing & Fitness for Bromo, Ijen & Tumpak Sewu | JVTO",
    description:
      "What to pack and how fit you should be for private tours to Bromo, Ijen and Tumpak Sewu. Clear expectations, simple fitness checklist, and links to our safety and health screening guides.",
    url: `${siteUrl}/travel-guide/packing-and-fitness`,
    siteName: "Java Volcano Tour Operator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteUrl + "/assets/img/og/travel-guide.webp",
        width: 1200,
        height: 630,
        alt: "Packing and Fitness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Packing & Fitness for Bromo, Ijen & Tumpak Sewu | JVTO",
    description:
      "What to pack and how fit you should be for private tours to Bromo, Ijen and Tumpak Sewu. Clear expectations, simple fitness checklist, and links to our safety and health screening guides.",
    images: [siteUrl + "/assets/img/og/travel-guide.webp"],
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
          "What to pack and how fit you should be for private tours to Bromo, Ijen and Tumpak Sewu. Clear expectations, simple fitness checklist, and links to our safety and health screening guides.",
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
          "What to pack and how fit you should be for private tours to Bromo, Ijen and Tumpak Sewu. Clear expectations, simple fitness checklist, and links to our safety and health screening guides.",
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
          "What to Expect Physically on Each Tour",
          "Simple Fitness Checklist (Self-Assessment)",
          "Essentials to Pack for All Volcano Tours",
          "Extra Items for Mount Bromo",
          "Extra Items for Ijen Crater Tours",
          "Extra Items for Tumpak Sewu Waterfall",
          "Weather, Fitness & Safety Information",
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
                Packing & Fitness
              </span>
            </nav>

            {/* Main Header */}
            <div className=" mb-12">
              <h1 className="font-black text-2xl md:text-5xl mb-6">
                Packing & Fitness for Bromo, Ijen & Tumpak Sewu
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
                  1) What to Expect Physically on Each Tour
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Expect these routes to be non-technical but physically
                    demanding.
                  </strong>{" "}
                  Bromo, Ijen, and Tumpak Sewu are not technical climbs, but
                  they can still involve long days, early departures, night-time
                  sections (especially Ijen), altitude and temperature changes,
                  uneven ground, stairs, and steep slopes.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Use this guide for preparation, not medical clearance.
                  </strong>{" "}
                  This page helps you prepare but is not a medical evaluation,
                  and final Ijen clearance comes from the included health
                  screening and the medical staff who perform it.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  2) Simple Fitness Checklist (Self-Assessment)
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>Use a basic self-check before booking.</strong> Ask
                  yourself if you can walk 3–4 hours with breaks, handle early
                  mornings or night starts, walk on uneven or dusty ground
                  without losing balance easily, and manage steep wet paths and
                  handholds at Tumpak Sewu.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Consult a doctor and inform JVTO early if you have serious
                    concerns.
                  </strong>{" "}
                  If you are unsure or have a known heart, lung, or serious
                  mobility issue, talk to your doctor first and tell JVTO in
                  your booking form.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Expect Ijen screening to affect go/no-go decisions.
                  </strong>{" "}
                  For Ijen, fitness is additionally checked through screening,
                  which may result in you being advised not to hike if it is
                  unsafe.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  3) Essentials to Pack for All Volcano Tours
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Pack footwear, layers, and a small daypack as baseline
                    essentials.
                  </strong>{" "}
                  Useful items include closed walking shoes or light hiking
                  boots with good grip, breathable layers, warm mid-layer,
                  windproof/waterproof outer layer, trousers suitable for wet
                  conditions, extra socks, and a daypack with rain cover.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Pack basic weather and sun items for changing conditions.
                  </strong>{" "}
                  Bring a hat or beanie, light gloves, sunglasses, sunscreen,
                  and lip balm.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Keep personal items practical and secure.</strong>{" "}
                  Bring essential medication, toiletries, a power bank, and a
                  copy of your passport photo page (printed or on phone).
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Expect main luggage to stay in vehicle/hotel during
                    activities.
                  </strong>{" "}
                  You carry only what you need for each activity as advised in
                  briefings.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  4) Extra Items for Mount Bromo
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Pack extra warmth and dust comfort items for sunrise.
                  </strong>{" "}
                  Bring additional warm layers, beanie, gloves, and consider a
                  buff/scarf/light mask for dust and smell comfort.
                </p>
                <p className="text-muted-foreground">
                  <strong>Expect cold mornings to affect batteries.</strong>{" "}
                  Bring enough battery for camera/phone; cold and early wake-ups
                  can drain batteries faster.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 5 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  5) Extra Items for Ijen Crater Tours
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Use JVTO-provided gear but bring comfort items if helpful.
                  </strong>{" "}
                  JVTO provides gas masks, trekking poles when needed, mineral
                  water, and depending on setup, a headlamp/flashlight.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Bring items that improve comfort under night conditions.
                  </strong>{" "}
                  Consider a scarf/buff, thin inner gloves, and light snacks you
                  tolerate well.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Treat Ijen as a steep, sustained hike with variable gas
                    exposure.
                  </strong>{" "}
                  Be honest about heart/lung/circulation issues and follow
                  screening and current-condition decisions.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 6 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  6) Extra Items for Tumpak Sewu Waterfall
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>Prepare for wet, steep, and slippery terrain.</strong>{" "}
                  Bring shoes with strong grip that can get wet or sports
                  sandals with heel strap and traction, quick-drying clothes, a
                  poncho/rain jacket, waterproof protection for valuables, and
                  dry clothes for after the hike.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Avoid this route if serious mobility issues apply unless
                    discussed.
                  </strong>{" "}
                  This route is not ideal for serious knee/hip/balance issues;
                  inform JVTO in advance.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 7 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  7) Weather, Fitness & Safety Information
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Use the related Travel Guide pages for closure, screening,
                    and safety procedures.
                  </strong>{" "}
                  See:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
                  <li>
                    <Link
                      href="/travel-guide/weather-and-closures"
                      className="text-primary hover:underline"
                    >
                      /travel-guide/weather-and-closures
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/travel-guide/ijen-health-screening"
                      className="text-primary hover:underline"
                    >
                      /travel-guide/ijen-health-screening
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/travel-guide/safety-on-tours"
                      className="text-primary hover:underline"
                    >
                      /travel-guide/safety-on-tours
                    </Link>
                  </li>
                </ul>
                <p className="text-muted-foreground">
                  <strong>Treat preparation as shared responsibility.</strong>{" "}
                  Packing well and knowing your limits support safety and
                  enjoyment, while JVTO plans, briefs, and adjusts based on
                  conditions and official guidance.
                </p>
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
                      JVTO before booking to assess suitability.
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
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
