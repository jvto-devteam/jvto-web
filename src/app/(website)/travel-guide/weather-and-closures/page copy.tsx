import { prisma } from "@/lib/prisma";
import StructuredData from "@/components/website/StructuredData";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { stripHtml } from "@/utils/stripHtml";

export const metadata: Metadata = {
  title: "Weather, Volcanic Alerts & Closures | JVTO",
  description:
    "How we handle itinerary changes due to weather, volcanic activity, or other unforeseen closures. Your safety is our priority.",
};

// Konstanta slug untuk halaman ini
const PAGE_SLUG = "travel-guide/weather-and-closures";

// Helper function untuk mengambil data (digunakan di Page dan Metadata)
async function getPolicyData() {
  const policy = await prisma.policy_documents.findUnique({
    where: {
      slug: PAGE_SLUG,
    },
  });

  return policy;
}

export default async function WeatherAndClosures() {
  // 2. Ambil data dari database
  const policy = await getPolicyData();

  // 3. Jika data tidak ditemukan di DB, return 404
  if (!policy) {
    notFound();
  }

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
          "https://javavolcano-touroperator.com/travel-guide/weather-and-closures#webpage",
        url: "https://javavolcano-touroperator.com/travel-guide/weather-and-closures",
        name: "Weather, Volcano Alerts & Closures",
        description:
          "How weather and volcanic activity can affect your Bromo, Ijen and Tumpak Sewu tour with JVTO, and how we handle timetable changes, reroutes, closures and Travel Credit.",
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
            "https://javavolcano-touroperator.com/travel-guide/weather-and-closures#breadcrumb",
        },
        mainEntity: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/weather-and-closures#article",
        },
        relatedLink: [
          "https://javavolcano-touroperator.com/travel-guide/booking-information",
          "https://javavolcano-touroperator.com/travel-guide/faq",
          "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening",
          "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness",
          "https://javavolcano-touroperator.com/travel-guide/safety-on-tours",
          "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups",
        ],
      },

      {
        "@type": "BreadcrumbList",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/weather-and-closures#breadcrumb",
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
            name: "Weather, Volcano Alerts & Closures",
            item: "https://javavolcano-touroperator.com/travel-guide/weather-and-closures",
          },
        ],
      },

      {
        "@type": "Article",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/weather-and-closures#article",
        headline: "Weather, Volcano Alerts & Closures",
        description:
          "How weather and volcanic activity can affect your Bromo, Ijen and Tumpak Sewu tour with JVTO, and how we handle timetable changes, reroutes, closures and Travel Credit.",
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
            "https://javavolcano-touroperator.com/travel-guide/weather-and-closures#webpage",
        },
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        articleSection: [
          "Why Conditions Can Change Quickly",
          "Rain Patterns: What to Expect (Without Overpromising)",
          "Volcano Activity & Official Alerts",
          "Types of Changes You Might Experience",
          "How This Links to Booking Information & Travel Credit",
          "Your Role as a Guest",
          "Quick FAQ",
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
        articleBody: stripHtml(policy.content),
      },

      {
        "@type": "FAQPage",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/weather-and-closures#faq",
        inLanguage: "en",
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/#website",
        },
        mainEntityOfPage: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/weather-and-closures#webpage",
        },
        mainEntity: [
          {
            "@type": "Question",
            name: "What happens if Bromo or Ijen is closed on my travel dates?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We follow official instructions. Where possible, we will reroute to alternative viewpoints or destinations, or adjust the pacing of your trip. The financial treatment follows the rules in our Booking Information and policy.",
            },
          },
          {
            "@type": "Question",
            name: "If the volcano is “on alert”, will you still run the tour?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "It depends on the alert level, hazard zones, and permissions. Some alerts allow controlled access; others require full closure. We decide based on official guidance, not marketing promises.",
            },
          },
          {
            "@type": "Question",
            name: "Can you guarantee that we will see sunrise or blue fire?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Weather, visibility, and volcanic activity are outside our control.",
            },
          },
          {
            "@type": "Question",
            name: "If it rains, will our tour be cancelled?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Light rain rarely cancels a tour but may change timings, viewpoints, or comfort levels.",
            },
          },
          {
            "@type": "Question",
            name: "Can I get a full cash refund if a volcano is closed?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Refunds and Travel Credit follow our official Booking & Cancellation Policy.",
            },
          },
        ],
      },
    ],
  };
  return (
    <div className="flex flex-col min-h-screen bg-background py-20">
      {/* Inject JSON-LD Schema */}
      <StructuredData data={pageSchema} />

      <main className="flex-grow">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Header Section: Mengambil Title & Intro dari DB */}
            <div className="text-center mb-12">
              <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                {policy.title}
              </h1>

              {/* Optional: Menggunakan meta description sebagai intro text jika ada */}
              <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                How we handle itinerary changes due to weather, volcanic
                activity, or other unforeseen closures. Your safety is our
                priority.{" "}
              </p>
            </div>

            {/* Content Section: Render HTML dari Database */}
            <div
              className="prose prose-lg max-w-none mx-auto text-muted-foreground prose-headings:font-headline prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: policy.content }}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
