import StructuredData from "@/components/website/StructuredData";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/website/UI/Button";
import { companyHistory } from "@/lib/legal";
import { type Metadata } from "next";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  title: "Police-Led Safety & Our Story | JVTO",
  description:
    "How JVTO grew from a local homestay into a tourist police-led, registered East Java travel company with real health screening and community partnerships.",
  openGraph: {
    title: "Police-Led Safety & Our Story | JVTO",
    description:
      "How JVTO grew from a local homestay into a tourist police-led, registered East Java travel company with real health screening and community partnerships.",
    url: `${siteUrl}/why-jvto/our-story`,
    siteName: "Java Volcano Tour Operator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteUrl + "/assets/img/og/our-story.webp",
        width: 1200,
        height: 630,
        alt: "Our Story",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Police-Led Safety & Our Story | JVTO",
    description:
      "How JVTO grew from a local homestay into a tourist police-led, registered East Java travel company with real health screening and community partnerships.",
    images: [siteUrl + "/assets/img/og/our-story.webp"],
  },
};

export default function PoliceLedSafetyPage() {
  const sections = [
    {
      title: "1. From Local Roots to Licensed Operator",
      content: [
        "Before JVTO existed as a registered travel company, our founder Agung (“Mr. Sam”) welcomed guests as a local host and organiser around Kawah Ijen. Early visitors stayed in a small homestay and booked simple private trips. Those years built the core approach we still follow: host like a local, brief like a professional, and respect the mountain. To stay accountable, the business was formalized as a registered Indonesian travel company (PT Java Volcano Rendezvous).",
      ],
      images: companyHistory.awards_and_recognition,
      cta: {
        text: "Verify Business Registration & Licence",
        href: "/verify-jvto",
      },
    },
    {
      title: "2. A Culture Shaped by the Tourist Police",
      content: [
        "Alongside building JVTO, Mr. Sam serves in the tourist police environment in East Java. This role brings daily exposure to real cases involving tourists (unsafe vehicles, fake papers, scams, accidents), and a practical understanding of how routes, checkpoints, and emergencies work in reality.",
        "This experience shapes how JVTO operates:",
        "- We design tours around real regulations and conditions, not just photo spots.",
        "- We select partners we can document and stand behind.",
        "- For large groups, we can help coordinate official traffic police escort on specific segments when allowed by law.",
      ],
    },
    {
      title: "3. Innovation Driven by Safety: Ijen Health Screening",
      content: [
        "Seeing incidents around Ijen – including unfit hikers and fake health certificates – pushed JVTO to support a stronger approach. Together with partners, we helped implement a digital health screening process for Ijen night hikes, with checks performed by trained medical staff and results verifiable by QR code at the gate.",
        "For JVTO guests, this screening is included in Ijen tours. If you are not cleared, we find a safer alternative plan. The system is also available publicly to help raise standards for all.",
      ],
      cta: {
        text: "How Ijen Health Screening Works",
        href: "/travel-guide/ijen-health-screening",
      },
    },
    {
      title: "4. What This Means for You",
      isCentered: true,
      content: [
        "When you choose JVTO, you are travelling with a tourist police-led team that understands real risks, a registered travel company you can verify, and a private tour model with clear inclusions and real health screening.",
      ],
      cta: {
        text: "See What's Included",
        href: "/policy/inclusions-exclusions",
        variant: "outline",
      },
    },
  ];

  const renderParagraphs = (paragraphs: string[]) => {
    const elements: JSX.Element[] = [];
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc pl-5 my-4">
            {listItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    for (const p of paragraphs) {
      if (p.startsWith("- ")) {
        listItems.push(p.substring(2));
      } else {
        flushList();
        elements.push(<p key={elements.length}>{p}</p>);
      }
    }

    flushList();
    return elements;
  };

  const ourStorySchema = {
    "@context": "https://schema.org",
    "@graph": [
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
        hasPart: [
          {
            "@id":
              "https://javavolcano-touroperator.com/why-jvto/our-story#webpage",
          },
        ],
      },
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
          ratingValue: "4.9",
          reviewCount: "112",
        },
        mainEntityOfPage: {
          "@id":
            "https://javavolcano-touroperator.com/why-jvto/our-story#webpage",
        },
      },
      {
        "@type": "AboutPage",
        "@id":
          "https://javavolcano-touroperator.com/why-jvto/our-story#webpage",
        url: "https://javavolcano-touroperator.com/why-jvto/our-story",
        name: "Our Story – From Local Host to Tourist Police-Led Volcano Tours",
        headline:
          "Our Story – From Local Host to Tourist Police-Led Volcano Tours",
        description:
          "Learn how a local host in East Java became a registered Indonesian travel company led by an active Tourist Police officer, with real Ijen health screening and private, all-inclusive volcano tours.",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/#website",
        },
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          "@id":
            "https://javavolcano-touroperator.com/why-jvto/community-standards#primaryimage",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        inLanguage: "en",
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        text: "Before JVTO existed as a registered travel company, our founder Agung (“Mr. Sam”) welcomed guests as a local host and organiser around Kawah Ijen. Early visitors stayed in a small homestay and booked simple private trips. Those years built the core approach we still follow: host like a local, brief like a professional, and respect the mountain. To stay accountable, the business was formalized as a registered Indonesian travel company (PT Java Volcano Rendezvous).",
        relatedLink: [
          "https://javavolcano-touroperator.com/why-jvto/the-jvto-difference",
          "https://javavolcano-touroperator.com/why-jvto/reviews",
          "https://javavolcano-touroperator.com/travel-guide",
          "https://javavolcano-touroperator.com/travel-guide/booking-information",
        ],
        mainEntity: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        breadcrumb: {
          "@id":
            "https://javavolcano-touroperator.com/why-jvto/our-story#breadcrumb",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://javavolcano-touroperator.com/why-jvto/our-story#breadcrumb",
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
            name: "Why JVTO",
            item: "https://javavolcano-touroperator.com/why-jvto",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Our Story",
            item: "https://javavolcano-touroperator.com/why-jvto/our-story",
          },
        ],
      },
    ],
  };
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StructuredData data={ourStorySchema} />

      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <nav className="mb-8 text-sm text-muted-foreground">
              <Link href="/why-jvto" className="hover:text-primary">
                Why JVTO
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground font-medium">Our Story</span>
            </nav>

            <div className="text-center mb-12">
              <h1 className="font-black uppercase text-4xl md:text-5xl tracking-tight">
                Police-Led Safety & Our Story
              </h1>
            </div>

            <div className="prose prose-lg max-w-none mx-auto text-muted-foreground space-y-12">
              {sections.map((section, secIndex) => (
                <section
                  key={secIndex}
                  className={section.isCentered ? "text-center not-prose" : ""}
                >
                  <h2 className="font-black uppercase text-3xl tracking-tight mt-12 mb-4 text-foreground">
                    {section.title}
                  </h2>

                  {section.isCentered ? (
                    <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
                      {section.content[0]}
                    </p>
                  ) : (
                    renderParagraphs(section.content)
                  )}

                  {section.images && (
                    <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                      {section.images.map((item, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="relative aspect-video w-full overflow-hidden rounded-sm">
                              <img
                                src={item.url}
                                alt={item.alt_text}
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                            </div>
                            <p className="text-sm text-center mt-2 text-muted-foreground">
                              {item.caption}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {section.cta && (
                    <div
                      className={`mt-6 ${
                        section.isCentered ? "flex justify-center gap-4" : ""
                      }`}
                    >
                      <Button
                        variant={(section.cta.variant as any) || "default"}
                      >
                        <Link href={section.cta.href}>{section.cta.text}</Link>
                      </Button>
                    </div>
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
