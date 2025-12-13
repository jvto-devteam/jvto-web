import Link from "next/link";
import { type Metadata } from "next";
import StructuredData from "@/components/website/StructuredData";

const weatherData = {
  route: "/travel-guide/weather-and-closures",
  seo: {
    title: "Weather, Volcano Alerts & Closures – How JVTO Handles Changes",
    metaDescription:
      "Understand how weather, volcanic activity and closures can affect private Bromo, Ijen and Tumpak Sewu tours with JVTO, and how alternative plans and Travel Credit work.",
  },
  h1: "Weather, Volcano Alerts & Closures",
  hero: {
    introParagraphs: [
      "Volcanoes and waterfalls are part of a changing natural environment. This page explains how weather, volcanic activity and access closures can affect your private tour, and how JVTO responds when plans need to change.",
      "It is a plain-language summary. For legal details and specific cases, your Official E-Voucher and the Booking, Payment & Cancellation Policy remain the final reference.",
    ],
  },
  sections: [
    {
      id: "factors-that-can-change-itinerary",
      title: "1. Factors That Can Change a Volcano or Waterfall Tour",
      paragraphs: [
        "Routes to Mount Bromo, Kawah Ijen and Tumpak Sewu are influenced by:",
        "- Weather – heavy rain, fog, strong winds, lightning.",
        "- Volcanic activity – ash, gas emissions, increased alert status.",
        "- Landslides, floods or road damage.",
        "- Forest fires or smoke.",
        "- Religious or cultural ceremonies.",
        "- Temporary government or park regulations.",
      ],
    },
    {
      id: "how-jvto-monitors-conditions",
      title: "2. How JVTO Monitors Conditions & Decides on Changes",
      paragraphs: [
        "JVTO uses:",
        "- Local guide and driver reports from Bromo, Ijen and Tumpak Sewu areas.",
        "- Information from park authorities and local government.",
        "- Updates linked to volcanic alert levels, gas readings and weather.",
        "When conditions are clearly unsafe or access is formally restricted, JVTO adjusts plans in line with:",
        "- Local regulations.",
        "- Safety considerations for guests and crew.",
        "- The options allowed under the Booking, Payment & Cancellation Policy.",
      ],
    },
    {
      id: "partial-vs-full-closures",
      title: "3. Partial Closures vs Full Closures",
      paragraphs: [
        "Not all changes are the same. Some examples:",
        "- Partial closure at Bromo:",
        "  - Certain viewpoints or the sea of sand may be off-limits.",
        "  - Other viewpoints or areas may remain open.",
        "- Partial closure at Ijen:",
        "  - Access to the crater floor or blue fire area may be restricted.",
        "  - Hikes may be limited to safer viewpoints higher up.",
        "- Partial closure at Tumpak Sewu:",
        "  - Lower levels or specific paths may be closed after heavy rain.",
        "  - Only upper viewpoints may be open.",
        "- Full closure:",
        "  - Entire sites or access routes can be closed for safety, ceremonies or official orders.",
        "In partial closures, JVTO will typically adapt the program to what is still legally and safely accessible, while keeping the main structure of your tour.",
      ],
    },
    {
      id: "alternative-routes-and-adjustments",
      title: "4. Alternative Routes & Adjustments",
      paragraphs: [
        "When a closure or restriction affects your itinerary, JVTO will:",
        "- Inform you as early as reasonably possible.",
        "- Propose alternative viewpoints, routes or activities where they exist and fit the conditions.",
        "- Explain how any changes relate to the Booking, Payment & Cancellation Policy and your Official E-Voucher.",
        "Examples of adjustments can include:",
        "- Moving a viewpoint or timing on the same day.",
        "- Reordering certain stops within the same trip.",
        "- Changing the ratio between volcanoes, waterfalls and cultural stops.",
        "Some alternatives may not fully match the original experience but are chosen to keep your trip running safely and legally.",
      ],
    },
    {
      id: "blue-fire-sunrise-visibility",
      title: "5. Blue Fire, Sunrise Views & Visibility",
      paragraphs: [
        "Phenomena such as blue fire at Ijen and specific sunrise views at Bromo depend on:",
        "- Wind direction and gas levels.",
        "- Cloud and fog.",
        "- Park regulations and crowd control.",
        "JVTO plans itineraries based on the best available local knowledge, but:",
        "- Blue fire sightings are never guaranteed.",
        "- Perfect sunrise conditions cannot be promised.",
        "- Some viewpoints may be closed or narrowed to control risk.",
        "Screenshots or photos on the website and social media are examples of past conditions, not promises for your specific date.",
      ],
    },
    {
      id: "closures-travel-credit-force-majeure",
      title: "6. Closures, Travel Credit & External Events",
      paragraphs: [
        "When closures or external events (for example, volcanic alerts, landslides, floods or government bans) make it impossible or unsafe to run part or all of a planned activity, JVTO:",
        "- Aligns decisions with local authorities and safety guidance.",
        "- Applies the options described in your Booking, Payment & Cancellation Policy and Official E-Voucher.",
        "Depending on timing and the exact situation, this may include:",
        "- Continuing with a modified route.",
        "- Applying JVTO Travel Credit for affected services, where applicable.",
        "- Other solutions described in the policy.",
        "This page does not describe every scenario; it explains the principles that guide how JVTO responds in practice.",
      ],
    },
    {
      id: "guest-role-uncertain-conditions",
      title: "7. Your Role as a Guest During Uncertain Conditions",
      paragraphs: [
        "You can help keep the whole group safe by:",
        "- Reading pre-tour briefings and health notes carefully.",
        "- Following instructions from guides, drivers and local authorities on site.",
        "- Allowing reasonable flexibility when weather or volcano conditions change plans.",
        "If you have specific questions about how a closure or alert could affect an upcoming tour, please contact JVTO using the official channels listed on this website.",
      ],
    },
    {
      id: "document-hierarchy-reminder",
      title: "8. Which Document Wins if There Is a Difference?",
      paragraphs: [
        "If there is ever a difference between this page and your booking documents, the order of priority is:",
        "1. The specific terms on your Official E-Voucher / Invoice.",
        "2. The Booking, Payment & Cancellation Policy.",
        "3. The Inclusions & Exclusions Policy.",
        "4. General website text and informal communication.",
      ],
    },
  ],
};

const ParagraphRenderer = ({ text }: { text: string }) => {
  const parts = text.split(
    /(Booking, Payment & Cancellation Policy|The Inclusions & Exclusions Policy)/g
  );

  return (
    <>
      {parts.map((part, index) => {
        if (part === "Booking, Payment & Cancellation Policy") {
          return (
            <Link
              key={index}
              href="/policy/booking-cancellation"
              className="text-primary hover:underline"
            >
              {part}
            </Link>
          );
        }
        if (part === "The Inclusions & Exclusions Policy") {
          return (
            <Link
              key={index}
              href="/travel-guide/inclusions-exclusions-policy"
              className="text-primary hover:underline"
            >
              {part}
            </Link>
          );
        }
        return part;
      })}
    </>
  );
};

export const metadata: Metadata = {
  title: weatherData.seo.title,
  description: weatherData.seo.metaDescription,
};

const renderParagraphs = (paragraphs: string[]) => {
  const elements: JSX.Element[] = [];
  let listItems: { text: string; indent: number }[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      const ListComponent = listType;
      elements.push(
        <ListComponent
          key={`list-${elements.length}`}
          className={`list-${
            listType === "ul" ? "disc" : "decimal"
          } pl-5 space-y-2 my-4`}
        >
          {listItems.map((item, i) => (
            <li
              key={i}
              className={item.indent > 0 ? `ml-${item.indent * 4}` : ""}
            >
              <ParagraphRenderer text={item.text} />
            </li>
          ))}
        </ListComponent>
      );
      listItems = [];
      listType = null;
    }
  };

  for (const p of paragraphs) {
    const ulMatch = p.match(/^(\s*)-\s(.*)/);
    const olMatch = p.match(/^(\s*\d+\.)\s(.*)/);

    if (ulMatch) {
      if (listType === "ol") flushList();
      listType = "ul";
      const indent = (ulMatch[1].length - 1) / 2;
      listItems.push({ text: ulMatch[2], indent });
    } else if (olMatch) {
      if (listType === "ul") flushList();
      listType = "ol";
      const indent = (olMatch[1].length - 2) / 2;
      listItems.push({ text: olMatch[2], indent });
    } else {
      flushList();
      elements.push(
        <p key={elements.length}>
          <ParagraphRenderer text={p} />
        </p>
      );
    }
  }

  flushList();
  return elements;
};

export default function WeatherAndClosuresPage() {
  const { h1, hero, sections } = weatherData;

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
        articleBody:
          "Volcanoes and waterfalls are part of a changing natural environment. This page explains how weather, volcanic activity and access closures can affect your private tour, and how JVTO responds when plans need to change. It is a plain-language summary. For legal details and specific cases, your Official E-Voucher and the Booking, Payment & Cancellation Policy remain the final reference."
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
    <div className="flex flex-col min-h-screen bg-background">
      <StructuredData data={pageSchema} />

      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16 bg-accent border-b">
          <div className="container mx-auto px-4 max-w-4xl">
            <nav className="mb-8 text-sm text-center text-muted-foreground">
              <Link href="/travel-guide" className="hover:text-primary">
                Travel Guide
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground font-medium">
                Weather &amp; Closures
              </span>
            </nav>
            <div className="text-center">
              <h1 className="font-black text-2xl md:text-5xl mb-6">{h1}</h1>
              <div className="prose prose-lg mx-auto text-muted-foreground">
                {hero.introParagraphs.map((p, i) => (
                  <p key={i}>
                    <ParagraphRenderer text={p} />
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-16">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24"
                >
                  <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4">
                    {section.title}
                  </h2>
                  <div className="prose max-w-none text-muted-foreground space-y-4">
                    {renderParagraphs(section.paragraphs)}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
