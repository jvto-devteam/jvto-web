import Link from "next/link";
import { type Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import StructuredData from "@/components/website/StructuredData";

const ijenScreeningData = {
  route: "/travel-guide/ijen-health-screening",
  seo: {
    title:
      "Ijen Health Screening – Real Checks, Digital Proof & QR | Java Volcano Tour Operator",
    metaDescription:
      "Learn how Ijen health screening works with JVTO: real checks by trained staff, digital records with QR codes, and a public tool for non-JVTO travellers.",
  },
  h1: "Ijen Health Screening – Real Checks, Digital Proof",
  hero: {
    introParagraphs: [
      "This page explains how Ijen health screening works for JVTO guests and for other travellers using the digital system.",
      "It is a practical safety and verification step designed to support responsible night hikes at Kawah Ijen; it does not replace medical advice from your own doctor or your travel insurance.",
    ],
  },
  sections: [
    {
      id: "why-ijen-screening-matters",
      title: "1. Why Ijen Health Screening Matters",
      paragraphs: [
        "Kawah Ijen is one of East Java’s most famous experiences – but it is also a night hike with steep sections, cold temperatures and exposure to sulfur gas.",
        "In the past, some visitors reached the gate with no real health checks or with fake medical letters, putting themselves, local teams and authorities at risk.",
        "JVTO supports a system where guests attempt the hike only after a real screening, and where results can be checked digitally to prove that the screening actually happened.",
      ],
    },
    {
      id: "for-jvto-guests",
      title: "2. For JVTO Guests – What We Include",
      paragraphs: [
        "If your JVTO tour includes the Ijen night hike, your package already includes a health screening before the hike.",
        "In practice, this usually means:",
        "- Screening is done before departure for the night hike, often at a partner accommodation or clinic.",
        "- Checks are performed by trained medical staff following local guidelines.",
        "- Typical checks include simple measurements such as blood pressure, oxygen saturation and heart rate, plus a few questions about relevant conditions.",
        "- The result is recorded in a secure digital system and linked to a QR code.",
        "Your Official E-Voucher and daily briefing will show where and when your screening will take place and what you need to prepare, for example bringing ID or filling in a short form.",
        "The cost of this screening is already included in your Ijen tour price with JVTO.",
      ],
    },
    {
      id: "for-non-jvto-travellers",
      title: "3. For Non-JVTO Travellers – Using the Public Digital Tool",
      paragraphs: [
        "The same digital screening workflow that JVTO uses is also available for other travellers through a public web tool, so that more people can avoid fake certificates and incomplete checks.",
        "In simple terms:",
        "1. You register your basic details and your intended hiking time in the digital system.",
        "2. You attend a screening with a participating clinic or hotel partner.",
        "3. If you are cleared, the provider submits your result and the system generates a QR-linked clearance.",
        "Gate staff can then scan or verify this QR code to confirm that a real screening took place.",
        "For access to the public tool, follow the information on health.mountijen.com or as communicated by local authorities and official providers.",
      ],
    },
    {
      id: "at-the-gate",
      title: "4. At the Ijen Gate – What Happens With Your Screening",
      paragraphs: [
        "At the Ijen entrance, staff may:",
        "- Ask if you have completed a health screening.",
        "- Check your digital clearance via your QR code or reference.",
        "The goal is not to create extra bureaucracy, but to:",
        "- Make sure screenings are real and traceable.",
        "- Reduce the use of unverified or falsified letters.",
        "- Help identify guests who may not be fit for a high-exertion, high-altitude, gas-exposed night hike.",
      ],
    },
    {
      id: "not-cleared-to-hike",
      title: "5. If the Screening Says “Not Recommended to Hike”",
      paragraphs: [
        "Sometimes, a screening result may suggest that it is not safe for you to attempt the Ijen night hike – for example, because of very high blood pressure or other indicators.",
        "In these cases:",
        "- JVTO will not force the hike and will respect the screening result.",
        "- Our team will discuss alternative options for your itinerary in line with the Booking, Payment & Cancellation Policy and your Official E-Voucher.",
        "Health-related decisions are handled seriously and may affect what is possible on your tour, but they do not automatically mean a full refund.",
        "We strongly recommend that all guests consider their own health and fitness before booking, bring any medication they normally require, and speak to their own doctor at home if they have concerns about high-altitude or gas-exposed activities.",
      ],
    },
    {
      id: "what-screening-is-and-is-not",
      title: "6. What This Screening Is – And What It Is Not",
      paragraphs: [
        "This screening is a practical, structured step to help identify basic risks before a demanding night hike.",
        "It is also a way to give gate staff a verifiable record that a screening took place.",
        "It is not a hospital admission, a full medical check-up or a guarantee of safety.",
        "Even with screening, volcano hikes remain physically demanding, and conditions can change quickly. JVTO and local authorities may still adjust or cancel access based on weather, gas levels or other safety concerns.",
      ],
    },
    {
      id: "data-and-privacy",
      title: "7. Data & Privacy",
      paragraphs: [
        "The digital screening system records only the information required to operate the screening and clearance process.",
        "Details about what data is collected, how long it is kept and how it is protected will be described in a dedicated Privacy Policy once finalised.",
        "If you have questions about your screening data, please ask the screening provider and contact JVTO via the official channels listed on this site.",
      ],
    },
    {
      id: "quick-questions",
      title: "8. Quick Questions About Ijen Screening",
      faqs: [
        {
          question: "Is Ijen health screening mandatory?",
          answerParagraphs: [
            "For JVTO guests attempting the Ijen night hike, yes – it is built into the tour.",
            "For non-JVTO visitors, we strongly recommend screening through official channels or the digital tool. Local authorities may require proof of screening at certain times.",
          ],
        },
        {
          question: "Does screening guarantee that nothing will happen?",
          answerParagraphs: [
            "No. Screening reduces risk by identifying obvious issues, but it does not guarantee any outcome.",
            "Conditions at volcano sites can change quickly, and all activities remain subject to safety decisions by local authorities and JVTO.",
          ],
        },
        {
          question: "Does screening affect my insurance?",
          answerParagraphs: [
            "Screening is intended as a safety and verification step, not a replacement for travel insurance.",
            "You remain responsible for arranging your own travel and medical insurance that covers hiking and adventure activities, and for checking how your insurer treats pre-existing conditions.",
          ],
        },
      ],
    },
  ],
};
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  title: ijenScreeningData.seo.title,
  description: ijenScreeningData.seo.metaDescription,
  openGraph: {
    title: ijenScreeningData.seo.title,
    description: ijenScreeningData.seo.metaDescription,
    url: `${siteUrl}/travel-guide/ijen-health-screening`,
    siteName: "Java Volcano Tour Operator",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: siteUrl + "/assets/img/og/ijen-health-screening.webp",
        width: 1200,
        height: 630,
        alt: "Ijen Health Screening",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ijenScreeningData.seo.title,
    description: ijenScreeningData.seo.metaDescription,
    images: [siteUrl + "/assets/img/og/ijen-health-screening.webp"],
  },
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

export default function IjenHealthScreeningPage() {
  const { h1, hero, sections } = ijenScreeningData;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

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
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: 4.9,
          reviewCount: 102,
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://javavolcano-touroperator.com/#website",
        url: "https://javavolcano-touroperator.com",
        name: "Java Volcano Tour Operator (JVTO)",
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        inLanguage: "en",
      },
      {
        "@type": "WebPage",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#webpage",
        url: "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening",
        name: "Ijen Health Screening — Real Checks, Digital Proof for Safer Night Hikes",
        headline:
          "Ijen Health Screening — Real Checks, Digital Proof for Safer Night Hikes",
        description:
          "Learn how JVTO includes real health screening for Ijen night hikes and supports digital, QR-verified health clearance to reduce fake certificates and avoid preventable incidents.",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/#website",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        image: {
          "@id": siteUrl + "/assets/img/hero/home.webp#primaryimage",
        },
        primaryImageOfPage: {
          "@id": siteUrl + "/assets/img/hero/home.webp#primaryimage",
        },
        breadcrumb: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#breadcrumb",
        },
        mainEntity: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#article",
        },
        hasPart: [
          {
            "@id":
              "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#faq",
          },
        ],
        relatedLink: [
          "https://javavolcano-touroperator.com/travel-guide/booking-information",
          "https://javavolcano-touroperator.com/travel-guide/faq",
          "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness",
          "https://javavolcano-touroperator.com/travel-guide/safety-on-tours",
          "https://javavolcano-touroperator.com/travel-guide/weather-and-closures",
          "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups",
        ],
        inLanguage: "en",
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        lastReviewed: "2025-12-05",
        about: {
          "@id":
            "https://javavolcano-touroperator.com/destinations/ijen-crater#destination",
        },
      },
      {
        "@type": "ImageObject",
        "@id": siteUrl + "/assets/img/hero/home.webp#primaryimage",
        url: siteUrl + "/assets/img/hero/home.webp",
        inLanguage: "en",
      },
      {
        "@type": "Article",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#article",
        headline:
          "Ijen Health Screening — Real Checks, Digital Proof for Safer Night Hikes",
        description:
          "Learn how JVTO includes real health screening for Ijen night hikes and supports digital, QR-verified health clearance to reduce fake certificates and avoid preventable incidents.",
        mainEntityOfPage: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#webpage",
        },
        image: {
          "@id": siteUrl + "/assets/img/hero/home.webp#primaryimage",
        },
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/#website",
        },
        author: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        articleSection: [
          "Why Ijen Needs Real Health Screening",
          "How Health Screening Works for JVTO Guests",
          "Digital Health Clearance & QR Verification",
          "Possible Outcomes & What Happens If You Are Not Cleared",
          "What Screening Does Not Do",
          "Data & Privacy (Short Summary)",
          "Quick FAQ (On-Page)",
          "Related Pages",
        ],
        articleBody:
          "This page explains how Ijen health screening works for JVTO guests and for other travellers using the digital system. It is a practical safety and verification step designed to support responsible night hikes at Kawah Ijen; it does not replace medical advice from your own doctor or your travel insurance.",
        inLanguage: "en",
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        about: {
          "@id":
            "https://javavolcano-touroperator.com/destinations/ijen-crater#destination",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://javavolcano-touroperator.com",
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
            name: "Ijen Health Screening — Real Checks, Digital Proof for Safer Night Hikes",
            item: "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is Ijen health screening optional if I travel with JVTO?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. For JVTO tours that include the Ijen night hike, health screening is part of our standard operating procedure. We will not run the hike for guests who are not cleared.",
            },
            inLanguage: "en",
            lastReviewed: "2025-12-05",
            dateModified: "2025-12-05",
          },
          {
            "@type": "Question",
            name: "Does a \u201ccleared\u201d result mean there is no risk?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. It means that, at the time of screening, there is no obvious reason to block you based on the checks used. Natural conditions and personal responses can still change.",
            },
            inLanguage: "en",
            lastReviewed: "2025-12-05",
            dateModified: "2025-12-05",
          },
          {
            "@type": "Question",
            name: "What if I refuse to be screened?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "If you refuse mandatory screening, you will not be allowed to join the Ijen hike. The relevant costs are treated as used, and our standard Travel Credit and late cancellation rules apply.",
            },
            inLanguage: "en",
            lastReviewed: "2025-12-05",
            dateModified: "2025-12-05",
          },
          {
            "@type": "Question",
            name: "Can I get a refund if I am not cleared?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No cash refund is provided when you are not cleared to hike after screening, because the related costs have been committed. Where possible, we may arrange alternative activities, but these depend on real-time conditions.",
            },
            inLanguage: "en",
            lastReviewed: "2025-12-05",
            dateModified: "2025-12-05",
          },
          {
            "@type": "Question",
            name: "I already have a letter from my doctor. Do I still need screening?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "In most cases, yes. Local implementation requires a recognised screening process on-site or through participating providers, not just a letter carried from overseas.",
            },
            inLanguage: "en",
            lastReviewed: "2025-12-05",
            dateModified: "2025-12-05",
          },
        ],
        inLanguage: "en",
      },
      {
        "@type": "TouristAttraction",
        "@id":
          "https://javavolcano-touroperator.com/destinations/ijen-crater#destination",
        name: "Ijen Crater",
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StructuredData data={pageSchema} />

      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16 bg-accent border-b">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <nav className="mb-8 text-sm text-muted-foreground">
              <Link href="/travel-guide" className="hover:text-primary">
                Travel Guide
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground font-medium">
                Ijen Health Screening
              </span>
            </nav>
            <h1 className="font-black text-2xl md:text-5xl mb-6">{h1}</h1>
            <div className="prose prose-lg mx-auto text-muted-foreground">
              {hero.introParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
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
                    {renderParagraphs(section.paragraphs || [])}
                  </div>

                  {section.faqs && (
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full mt-6"
                    >
                      {section.faqs.map((faq, index) => (
                        <AccordionItem
                          value={`item-${section.id}-${index}`}
                          key={index}
                        >
                          <AccordionTrigger className="text-lg text-left font-bold text-foreground hover:text-primary">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="prose max-w-none text-muted-foreground space-y-4">
                              {faq.answerParagraphs.map((p, i) => (
                                <p key={i}>{p}</p>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
