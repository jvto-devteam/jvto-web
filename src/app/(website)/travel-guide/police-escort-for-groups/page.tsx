import Link from "next/link";
import { type Metadata } from "next";
import StructuredData from "@/components/website/StructuredData";

const policeEscortData = {
  route: "/travel-guide/police-escort-for-groups",
  seo: {
    title:
      "Official Traffic Police Escort for Tourist Groups in East Java | JVTO",
    metaDescription:
      "Learn how official traffic police escort can be coordinated for larger tourist groups in East Java, when it is appropriate, and how JVTO handles requests and written approvals.",
  },
  h1: "Traffic Police Escort for Tourist Groups in East Java",
  hero: {
    introParagraphs: [
      "This page explains how official traffic police escort can be coordinated for certain larger groups travelling with JVTO in East Java – what it is for, when it is appropriate, and how requests are handled through formal channels.",
      "It is not a guarantee that every group will receive an escort, and it is not an offer of unofficial or informal privileges.",
    ],
  },
  sections: [
    {
      id: "what-is-traffic-police-escort",
      title: "1. What “Traffic Police Escort” Means in Practice",
      paragraphs: [
        "In this context, a traffic police escort is a legally authorised road convoy support provided by the official traffic police unit, for example:",
        "- One or more marked police vehicles guiding a convoy on specific segments.",
        "- Assistance with safe convoy movement through certain junctions or routes.",
        "The purpose is:",
        "- To manage convoy movement more safely for large groups.",
        "- To reduce confusion and risk on complex or busy road sections.",
        "It is not:",
        "- A license to ignore traffic laws.",
        "- A guarantee of higher speeds.",
        "- An informal favour sold as a “special trick”.",
      ],
    },
    {
      id: "when-can-escort-be-considered",
      title: "2. When Can a Traffic Police Escort Be Considered?",
      paragraphs: [
        "JVTO generally considers requesting traffic police escort only when:",
        "- The group is significantly larger than a typical private tour (for example, around 18 guests or more).",
        "- There will be multiple vehicles moving together in convoy.",
        "- The route includes specific segments where coordinated movement is safer – for example, from a given toll exit to accommodation in Bondowoso or similar cases.",
        "Even when these conditions are met:",
        "- An escort is never automatic.",
        "- All requests must pass through the formal process of the relevant traffic police unit.",
        "- Approval depends on law, regulations, availability and operational priorities of the police, not only on JVTO or the guest.",
      ],
    },
    {
      id: "how-requests-are-made",
      title: "3. How Requests Are Made & Approved",
      paragraphs: [
        "When a group programme seems suitable for an escort, JVTO can:",
        "- Discuss the idea with the group organiser during the planning stage.",
        "- Prepare the necessary route and timing information.",
        "- Submit a formal request through the relevant traffic police channels.",
        "If the traffic police unit approves:",
        "- They will issue the relevant written order or confirmation for the escort.",
        "- JVTO will reflect the escort arrangement in the group itinerary and Official E-Voucher.",
        "If the request is not approved:",
        "- The tour proceeds without escort.",
        "- JVTO will still apply its own convoy and safety procedures within the limits of normal traffic rules.",
      ],
    },
    {
      id: "costs-and-inclusions",
      title: "4. Costs & What Is Included (If Approved)",
      paragraphs: [
        "Where an escort is approved, there may be additional costs, which can include:",
        "- Fees or charges associated with the police escort service.",
        "- Adjustments to vehicle and crew planning.",
        "Any such costs:",
        "- Are discussed with the group organiser in advance.",
        "- Are stated in writing as part of the group quotation.",
        "- Are included in the Official E-Voucher / Invoice if the group confirms the programme.",
        "There is no “cash-on-the-road” payment for unofficial escort services offered by JVTO. All charges related to escort services are documented and part of the formal booking where applicable.",
      ],
    },
    {
      id: "what-escort-does-and-does-not-do",
      title: "5. What an Escort Is Meant to Do – And What It Is Not",
      paragraphs: [
        "An official traffic police escort is meant to:",
        "- Support the safe and orderly movement of a convoy on approved segments.",
        "- Coordinate with JVTO and drivers on timing and route.",
        "It is not intended to:",
        "- Break or bypass road safety regulations.",
        "- Turn a convoy into a race.",
        "- Guarantee a specific travel time in all conditions.",
        "Even with escort vehicles, all standard safety expectations still apply, including respecting speed limits where possible, wearing seat belts and following instructions from police officers and JVTO crew.",
      ],
    },
    {
      id: "guest-and-group-behaviour",
      title: "6. Behaviour Expectations for Groups with Escort",
      paragraphs: [
        "If your group programme includes an approved escort:",
        "- Guests must follow instructions from both JVTO staff and traffic police officers.",
        "- Drivers remain responsible for safe driving and cannot be forced by guests to drive aggressively.",
        "- Guests should stay in assigned vehicles and avoid behaviour that distracts drivers or police.",
        "Inappropriate behaviour towards police officers, JVTO staff, other road users or local communities is not acceptable and may lead to changes in how the convoy is managed.",
      ],
    },
    {
      id: "relationship-with-tourist-police-experience",
      title: "7. How JVTO’s Tourist Police Experience Fits Into This",
      paragraphs: [
        "JVTO’s founder has professional experience in tourist and traffic safety in East Java.",
        "This experience helps JVTO:",
        "- Understand how and when escort services can be requested legally.",
        "- Communicate with the relevant police units in a structured, documented way.",
        "- Design group routes that respect regulations and local realities.",
        "However:",
        "- JVTO does not promise that escort will always be available.",
        "- JVTO does not offer unofficial, unapproved escort services.",
        "- All escort services described here are subject to formal approval by the traffic police unit, not only by JVTO or the guest.",
      ],
    },
    {
      id: "document-hierarchy-and-questions",
      title: "8. Where to Check Your Group’s Exact Arrangement",
      paragraphs: [
        "If your group has discussed escort options with JVTO, the final, binding details will always appear in:",
        "1. Your Official E-Voucher / Invoice for the group programme.",
        "2. Any written confirmation issued by JVTO referencing escort arrangements.",
        "If escort is not mentioned in these documents, you should assume that your programme will run without traffic police escort.",
        "For questions about escort possibilities for a future group itinerary, please contact JVTO using the official channels listed on this site.",
      ],
    },
  ],
};

export const metadata: Metadata = {
  title: policeEscortData.seo.title,
  description: policeEscortData.seo.metaDescription,
};

const renderParagraphs = (paragraphs: string[]) => {
  const elements: JSX.Element[] = [];
  let listItems: string[] = [];
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
            <li key={i}>{item}</li>
          ))}
        </ListComponent>
      );
      listItems = [];
      listType = null;
    }
  };

  for (const p of paragraphs) {
    if (p.startsWith("- ")) {
      if (listType === "ol") flushList();
      listType = "ul";
      listItems.push(p.substring(2));
    } else if (/^\d+\./.test(p)) {
      if (listType === "ul") flushList();
      listType = "ol";
      listItems.push(p.substring(p.indexOf(" ") + 1));
    } else {
      flushList();
      elements.push(<p key={elements.length}>{p}</p>);
    }
  }

  flushList();
  return elements;
};

export default function PoliceEscortForGroupsPage() {
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
        name: "Official Police Escort for Large Tourist Groups in East Java",
        description:
          "Learn when and how JVTO can coordinate official traffic police escort for large groups in East Java, and what this service does and does not include.",
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
            name: "Police Escort for Groups",
            item: "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups",
          },
        ],
      },
      {
        "@type": "Article",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#article",
        headline:
          "Official Police Escort for Large Tourist Groups in East Java",
        description:
          "Learn when and how JVTO can coordinate official traffic police escort for large groups in East Java, and what this service does and does not include.",
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
          "What \u201cPolice Escort\u201d Means in Our Context",
          "When Escort May Be Available",
          "How the Request Process Works",
          "Costs, Inclusions & Limitations",
          "Cancellation, Changes & Force Majeure",
          "Quick FAQ",
        ],
        articleBody:
          "This page explains how official traffic police escort can be coordinated for certain larger groups travelling with JVTO in East Java – what it is for, when it is appropriate, and how requests are handled through formal channels. It is not a guarantee that every group will receive an escort, and it is not an offer of unofficial or informal privileges.",
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
            name: "Can every JVTO tour get a police escort?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Escort is reserved for specific large group programs and must be approved by the relevant Traffic Police unit. Regular private tours are not escorted.",
            },
          },
          {
            "@type": "Question",
            name: "Can we decide to add escort at the last minute?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Normally no. Escort requires formal approvals, planning, and scheduling. Last-minute requests are unlikely to be accepted.",
            },
          },
          {
            "@type": "Question",
            name: "Is escort included in the standard tour price?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. If escort is approved and included, any cost is clearly shown as a separate line in your group proposal and invoice.",
            },
          },
          {
            "@type": "Question",
            name: "Does escort mean we can ignore normal road rules?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Escort is intended to improve convoy management and safety, not to bypass the law.",
            },
          },
          {
            "@type": "Question",
            name: "What happens if the police cancel our escort?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "If the escort is cancelled by the authorities, JVTO will still operate your tour using normal private vehicles. We will apply the same principles that we use for other external changes, as described in our Booking Information.",
            },
          },
        ],
      },
    ],
  };

  const { h1, hero, sections } = policeEscortData;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StructuredData data={pageSchema} />

      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16 bg-accent border-b">
          <div className="container mx-auto px-4 max-w-4xl">
            <nav className="mb-8 text-center text-sm text-muted-foreground">
              <Link href="/travel-guide" className="hover:text-primary">
                Travel Guide
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground font-medium">
                Police Escort for Groups
              </span>
            </nav>
            <div className="text-center">
              <h1 className="heading-lg mb-6 font-black text-2xl md:text-5xl">
                {h1}
              </h1>
              <div className="prose prose-lg mx-auto text-muted-foreground">
                {hero.introParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
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
