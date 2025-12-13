import Link from "next/link";
import { type Metadata } from "next";
import StructuredData from "@/components/website/StructuredData";


const packingFitnessData = {
  route: "/travel-guide/packing-and-fitness",
  seo: {
    title: "Packing & Fitness for Bromo, Ijen & Tumpak Sewu | JVTO",
    metaDescription:
      "What to pack and how fit you should be for private tours to Bromo, Ijen and Tumpak Sewu. Clear expectations, simple fitness checklist, and links to our safety and health screening guides.",
  },
  h1: "Packing & Fitness for Bromo, Ijen & Tumpak Sewu",
  hero: {
    introParagraphs: [],
  },
  sections: [
    {
      id: "what-to-expect-physically-on-each-tour",
      title: "1. What to Expect Physically on Each Tour",
      paragraphs: [
        "Bromo, Ijen and Tumpak Sewu are not technical climbs, but they can be demanding:",
        "* **Long days**: early departures, late arrivals, and some night-time sections (especially Ijen).",
        "* **Altitude & temperature changes**: cool to cold nights, warm days, and wind at viewpoints.",
        "* **Uneven ground**: volcanic sand, stone steps, rocky paths, wet and sometimes slippery sections.",
        "* **Stairs & slopes**: especially at Ijen and Tumpak Sewu.",
        "This page is here to help you prepare. It is **not** a medical evaluation. For Ijen, your final clearance comes from the **health screening** we include in relevant tours and the medical staff who perform it (see `/travel-guide/ijen-health-screening`).",
      ],
    },
    {
      id: "simple-fitness-checklist-self-assessment",
      title: "2. Simple Fitness Checklist (Self-Assessment)",
      paragraphs: [
        "Before booking, ask yourself:",
        "* Can I comfortably walk **3–4 hours in a day**, including hills or stairs, with breaks?",
        "* Am I generally comfortable with **early mornings or night starts**?",
        "* Am I able to walk on **uneven or dusty ground** without losing balance easily?",
        "* For Tumpak Sewu: am I okay with **steep, sometimes wet paths** and using handholds / simple ladders?",
        "If you are unsure or have a known heart, lung, or serious mobility issue, talk to your doctor first and tell JVTO about it in your booking form. We will adjust expectations where possible and be very clear about which routes may not be suitable.",
        "For Ijen, your fitness is additionally checked through the **included health screening**, which may result in you being advised **not** to hike if it is unsafe for you.",
      ],
    },
    {
      id: "essentials-to-pack-for-all-volcano-tours",
      title: "3. Essentials to Pack for All Volcano Tours",
      paragraphs: [
        "These items are useful for most JVTO tours in East Java:",
        "* **Footwear**",
        "  * Closed, comfortable walking shoes or light hiking boots with good grip.",
        "  * Optional: light sandals for use at accommodation (not for hikes).",
        "* **Clothing**",
        "  * Base layer (t-shirt or long-sleeve, breathable).",
        "  * Warm middle layer (fleece or light sweater).",
        "  * **Windproof / waterproof outer layer** for cold mornings and possible rain.",
        "  * Comfortable trousers (avoid jeans that stay wet and heavy).",
        "  * Extra socks.",
        "* **Weather & sun**",
        "  * Hat or beanie (warm for night, cap for day).",
        "  * Light gloves for Bromo/Ijen early morning.",
        "  * Sunglasses.",
        "  * Sunscreen and simple lip balm.",
        "* **Small daypack**",
        "  * Enough space for water, snacks, camera/phone, extra layer.",
        "  * Rain cover or plastic liner.",
        "* **Personal items**",
        "  * Basic personal medication (with original packaging).",
        "  * Travel-sized toiletries.",
        "  * Power bank & charging cable.",
        "  * Copy of your passport photo page (printed or on phone).",
        "Your main luggage stays in the vehicle or accommodation at appropriate times. We tell you the best bag to carry for each day in your tour briefing.",
      ],
    },
    {
      id: "extra-items-for-mount-bromo",
      title: "4. Extra Items for Mount Bromo",
      paragraphs: [
        "For Bromo sunrise:",
        "* **More warmth**",
        "  * Night and early morning at viewpoints can be **very cold and windy**.",
        "  * Bring: extra sweater or jacket, beanie, and warm gloves.",
        "* **Dust protection**",
        "  * A simple buff, scarf or light mask can make dust and sulfur smell more comfortable.",
        "  * We still recommend stepping away if the air feels too dusty or uncomfortable.",
        "* **Electronics**",
        "  * Camera / phone with enough battery — temperatures and early wake-ups can drain batteries faster than normal.",
      ],
    },
    {
      id: "extra-items-for-ijen-crater-tours",
      title: "5. Extra Items for Ijen Crater Tours",
      paragraphs: [
        "For Ijen night hikes:",
        "* **What JVTO provides**",
        "  * Gas mask for sulfur gas.",
        "  * Basic trekking pole(s) when needed.",
        "  * Mineral water.",
        "  * Headlamp or flashlight (depending on your tour setup).",
        "  * JVTO travel t-shirt (on eligible packages).",
        "* **What you may want to bring**",
        "  * An additional scarf or buff for comfort under or around the mask.",
        "  * Thin inner gloves (if your hands get cold easily).",
        "  * Light snacks that you know your body accepts well.",
        "* **Fitness & health**",
        "  * Ijen is a **steep, sustained hike** with thin, cold air and possible sulfur gas exposure.",
        "  * If you have heart, lung, or serious circulation issues, you must tell us in advance and be honest during screening.",
        "  * Your final go/no-go decision for the hike follows the **health screening process** and current conditions (see `/travel-guide/ijen-health-screening`).",
      ],
    },
    {
      id: "extra-items-for-tumpak-sewu-waterfall",
      title: "6. Extra Items for Tumpak Sewu Waterfall",
      paragraphs: [
        "Tumpak Sewu involves steep paths, wet sections and spray from the waterfall. For this route:",
        "* **Footwear**",
        "  * Shoes with strong grip that can get wet, or",
        "  * Sports sandals with heel strap and good traction.",
        "* **Clothing**",
        "  * Quick-drying clothes; avoid heavy cotton that stays wet and cold.",
        "  * A lightweight rain jacket or poncho.",
        "* **Protection**",
        "  * Waterproof bag or dry sack for phone, camera and passport.",
        "  * Small towel and a set of dry clothes for after the hike.",
        "This route is **not ideal** for guests with serious knee, hip, or balance issues. Tell us in advance so we can advise honestly.",
      ],
    },
    {
      id: "weather-fitness-and-safety-information",
      title: "7. Weather, Fitness & Safety Information",
      paragraphs: [
        "For detailed information on:",
        "* How we handle extreme weather and volcanic alerts → see `/travel-guide/weather-and-closures`.",
        "* How we integrate **health screening** for Ijen → see `/travel-guide/ijen-health-screening`.",
        "* How we manage overall tour safety and follow official information sources → see `/travel-guide/safety-on-tours`.",
        "Packing well and understanding your own limits is part of keeping your tour safe and enjoyable. JVTO’s role is to **plan, brief, and adjust** based on real conditions and official guidance; your role is to come prepared and to tell us the truth about your health and comfort levels.",
      ],
    },
  ],
};

export const metadata: Metadata = {
  title: packingFitnessData.seo.title,
  description: packingFitnessData.seo.metaDescription,
};

const renderTextWithLinks = (text: string) => {
  const parts = text.split(
    /(`\/travel-guide\/[a-z-]+`|\/travel-guide\/[a-z-]+)/g
  );
  return parts.map((part, index) => {
    const isLink = part.match(/^\/?travel-guide\/[a-z-]+$/);
    if (isLink) {
      return (
        <Link key={index} href={part} className="text-primary hover:underline">
          {part}
        </Link>
      );
    }
    const isCodeLink = part.match(/^`(\/travel-guide\/[a-z-]+)`$/);
    if (isCodeLink) {
      return (
        <Link
          key={index}
          href={isCodeLink[1]}
          className="text-primary hover:underline"
        >
          {isCodeLink[1]}
        </Link>
      );
    }
    // Handle **bold** text
    const boldParts = part.split(/\*\*(.*?)\*\*/g);
    return boldParts.map((boldPart, boldIndex) => {
      if (boldIndex % 2 === 1) {
        return <strong key={`${index}-${boldIndex}`}>{boldPart}</strong>;
      }
      return boldPart;
    });
  });
};

const renderParagraphs = (paragraphs: string[]) => {
  const elements: JSX.Element[] = [];
  let listItems: { text: string; indent: number }[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul
          key={`list-${elements.length}`}
          className="list-disc pl-5 my-4 space-y-2"
        >
          {listItems.map((item, i) => (
            <li
              key={i}
              className={item.indent > 0 ? `ml-${item.indent * 4}` : ""}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: item.text.replace(
                    /\*\*(.*?)\*\*/g,
                    "<strong>$1</strong>"
                  ),
                }}
              />
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (const p of paragraphs) {
    const listItemMatch = p.match(/^(\s*\*)\s(.*)/);
    if (listItemMatch) {
      const indent = (listItemMatch[1].length - 1) / 2;
      listItems.push({ text: listItemMatch[2], indent });
    } else {
      flushList();
      elements.push(<p key={elements.length}>{renderTextWithLinks(p)}</p>);
    }
  }

  flushList();
  return elements;
};

export default function PackingAndFitnessPage() {
  const { h1, sections } = packingFitnessData;
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
        articleBody:
          "What to pack and how fit you should be for private tours to Bromo, Ijen and Tumpak Sewu. Clear expectations, simple fitness checklist, and links to our safety and health screening guides.",
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StructuredData data={pageSchema} />

      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16 bg-accent border-b">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <nav className="mb-8 text-center text-sm text-muted-foreground">
              <Link href="/travel-guide" className="hover:text-primary">
                Travel Guide
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground font-medium">
                Packing & Fitness
              </span>
            </nav>
            <h1 className="heading-lg mb-6 font-black text-2xl md:text-5xl">
              {h1}
            </h1>
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
