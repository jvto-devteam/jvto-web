import Link from "next/link";
import { type Metadata } from "next";
import StructuredData from "@/components/website/StructuredData";

export const metadata: Metadata = {
  title: "Packing & Fitness — Bromo, Ijen & Tumpak Sewu | JVTO Travel Guide",
  description:
    "What to pack and fitness requirements for Bromo, Ijen, and Tumpak Sewu tours. Essential packing list and fitness guidance for volcano hikes.",
};

export default function PackingAndFitnessPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  // 4. Siapkan Schema.org Data secara dinamis
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
        logo: "https://javavolcano-touroperator.com/assets/img/jvto-color.png",
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
        paymentAccepted: "Credit Card, Bank Transfer",
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
        name: "Packing & Fitness Guide for Bromo, Ijen & Tumpak Sewu",
        description:
          "What to pack and how fit you should realistically be for private tours to Bromo, Ijen and Tumpak Sewu with JVTO. Clothing layers, footwear, fitness levels and practical tips for safer, more comfortable trips.",
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
            name: "Packing & Fitness Guide for Bromo, Ijen & Tumpak Sewu",
            item: "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness",
          },
        ],
      },

      {
        "@type": "Article",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness#article",
        headline: "Packing & Fitness Guide for Bromo, Ijen & Tumpak Sewu",
        description:
          "What to pack and how fit you should realistically be for private tours to Bromo, Ijen and Tumpak Sewu with JVTO. Clothing layers, footwear, fitness levels and practical tips for safer, more comfortable trips.",
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
          "Why This Guide Matters",
          "Temperatures & Conditions in Short",
          "Clothing: Layers Work Best",
          "Footwear, Small Gear & Valuables",
          "Special Note for Silver Jewellery at Ijen",
          "Fitness Levels by Destination",
          "Who Should Consider a Gentler Itinerary",
          "During the Tour: Tell Your Crew How You Feel",
          "Quick Packing Checklist",
          "Related Pages",
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
        articleBody: `
Packing & Fitness — Bromo, Ijen & Tumpak Sewu

This page helps you prepare realistically for your private tour. We cover what to pack, how fit you should be for each destination, and a few practical tips to protect your belongings.

General Clothing & Essentials
For all routes (Bromo, Ijen, waterfalls), we recommend light, quick-drying layers, a warm jacket or fleece, long trousers or leggings, comfortable walking shoes with good grip, a small daypack, sunscreen, a light rain jacket, and personal medication. Your main luggage stays in the car or hotel; you only carry what you need for the activity.

Bromo — Packing & Fitness
Packing: Warm layers (early morning can feel near 5–10°C), hat, gloves, scarf, and comfortable shoes for sand and dust.
Fitness: Suitable for most guests with basic mobility. You should be able to step in and out of the jeep, walk short distances, and climb modest stairs.

Ijen — Packing & Fitness
Packing: Warm layers, long sleeves and trousers, good hiking shoes, a light headlamp (often provided), and an optional spare mask for dust.
Fitness: The trail is a sustained uphill walk. You should be able to walk uphill at a steady pace for 1–2 hours. Guests with heart, lung, or circulation conditions should consult a doctor. Final permission depends on the Ijen health screening.

Tumpak Sewu — Packing & Fitness
Packing: Clothing and shoes that can get wet, water shoes for river sections, a small towel, and a change of clothes.
Fitness: The trail is steep with stairs, rocks, and wet surfaces. You should be comfortable with balance and using ropes or handholds. Not recommended for guests with serious knee, ankle, or balance issues.

Private Tour & Crew Support
Because your tour is private, your JVTO crew is focused on your group. You can ask for extra stops. If you feel tired or unwell, tell the crew early — they can slow the pace or offer alternatives. Please do not hesitate to speak up.

Valuables & Jewellery
We recommend minimizing valuables. Avoid wearing expensive jewellery on hikes and waterfall days. Water, mud, and tight spaces make it easy for items to be dropped or lost. At Ijen, volcanic gases can tarnish silver, so we strongly recommend not wearing it.        
        `,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StructuredData data={pageSchema} />
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
                Packing & Fitness
              </span>
            </nav>
            <div className="text-center mb-12">
              <h1 className="font-black uppercase text-4xl md:text-5xl tracking-tight">
                Packing & Fitness — Bromo, Ijen & Tumpak Sewu
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                This page helps you prepare realistically for your private tour.
                We cover what to pack, how fit you should be for each
                destination, and a few practical tips to protect your
                belongings.
              </p>
            </div>

            <div className="prose prose-lg max-w-none mx-auto text-muted-foreground">
              <h2 className="font-black uppercase text-3xl tracking-tight mt-12 mb-4 text-foreground">
                General Clothing & Essentials
              </h2>
              <p>
                For all routes (Bromo, Ijen, waterfalls), we recommend: light,
                quick-drying layers, a warm jacket or fleece, long trousers or
                leggings, comfortable walking shoes with good grip, a small
                daypack, sunscreen, a light rain jacket, personal medication.
                Your main luggage stays in the car/hotel; you only carry what
                you need for the activity.
              </p>

              <h2 className="font-black uppercase text-3xl tracking-tight mt-12 mb-4 text-foreground">
                Bromo — Packing & Fitness
              </h2>
              <p>
                <strong>Packing:</strong> Warm layers (early morning can feel
                near 5–10°C), hat, gloves, scarf. Comfortable shoes for sand and
                dust. <br />
                <strong>Fitness:</strong> Suitable for most guests with basic
                mobility. You should be able to step in and out of the jeep,
                walk short distances, and climb modest stairs.
              </p>

              <h2 className="font-black uppercase text-3xl tracking-tight mt-12 mb-4 text-foreground">
                Ijen — Packing & Fitness
              </h2>
              <p>
                <strong>Packing:</strong> Warm layers, long sleeves and
                trousers, good hiking shoes, a light headlamp (often provided),
                and an optional spare mask for dust. <br />
                <strong>Fitness:</strong> The trail is a sustained uphill walk.
                You should be able to walk uphill at a steady pace for 1–2
                hours. Guests with heart, lung, or circulation conditions should
                consult a doctor. Final permission depends on the{" "}
                <Link href="/travel-guide/ijen-health-screening">
                  Ijen health screening
                </Link>
                .
              </p>

              <h2 className="font-black uppercase text-3xl tracking-tight mt-12 mb-4 text-foreground">
                Tumpak Sewu — Packing & Fitness
              </h2>
              <p>
                <strong>Packing:</strong> Clothing and shoes that can get wet,
                water shoes for river sections, a small towel, and a change of
                clothes. <br />
                <strong>Fitness:</strong> The trail is steep with stairs, rocks,
                and wet surfaces. You should be comfortable with balance and
                using ropes/handholds. Not recommended for guests with serious
                knee, ankle, or balance issues.
              </p>

              <h2 className="font-black uppercase text-3xl tracking-tight mt-12 mb-4 text-foreground">
                Private Tour & Crew Support
              </h2>
              <p>
                Because your tour is private, your JVTO crew is focused on your
                group. You can ask for extra stops. If you feel tired or unwell,
                tell the crew early — they can slow the pace or offer
                alternatives. Please do not hesitate to speak up.
              </p>

              <h2 className="font-black uppercase text-3xl tracking-tight mt-12 mb-4 text-foreground">
                Valuables & Jewellery
              </h2>
              <p>
                We recommend minimizing valuables. Avoid wearing expensive
                jewellery on hikes and waterfall days. Water, mud, and tight
                spaces make it easy for items to be dropped or lost. At Ijen,
                volcanic gases can tarnish silver, so we strongly recommend not
                wearing it.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
