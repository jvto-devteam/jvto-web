import { type Metadata } from "next";
import Link from "@/components/website/AppLink";
import Button from "@/components/website/UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { DocumentPriorityNote } from "./document-priority-note";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import Sidebar from "./sidebar";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import { buildTgHubItemListSchema } from "@/lib/schemas/buildTravelGuideSchemas";
import {
  buildResolvedFaqSchema,
  resolveFaqsForPage,
} from "@/lib/content/resolveFaqs";
const today = new Date();

const formatted = today.toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const travelGuideData = {
  route: "/travel-guide",
  seo: {
    title:
      "Travel Guide: Booking, Safety & Practical Info | Java Volcano Tour Operator",
    metaDescription:
      "This Travel Guide is your practical handbook for traveling with Java Volcano Tour Operator (JVTO). Here you'll find clear information on bookings, payments, reschedules, health screening for Ijen, safety on tours, packing, weather-related closures, and when police escort can be arranged for groups.",
  },
  h1: "Travel Guide: Booking, Safety & Practical Info",
  hero: {
    introParagraphs: [
      "This Travel Guide is your practical handbook for traveling with Java Volcano Tour Operator (JVTO).",
      "Here you'll find clear information on bookings, payments, reschedules, health screening for Ijen, safety on tours, packing, weather-related closures, and when police escort can be arranged for groups.",
    ],
    primaryCtas: [
      {
        label: "FAQ: Short Answers to Common Questions",
        href: "/travel-guide/faq",
      },
      {
        label: "Browse private tours",
        href: "/tours",
      },
    ],
  },
  latestUpdate: {
    title: "Latest JVTO Update",
    lastUpdatedPlaceholder: "17 January 2026",
    bodyParagraphs: [
      'Check this "Latest JVTO update" card for time-sensitive operational notes before departure. This section is reserved for information your team can confirm and update routinely.',
      "For current conditions, please contact us directly via WhatsApp +62 822-4478-8833 or email hello@javavolcano-touroperator.com.",
    ],
    note: "Only publish what you can reasonably confirm at the time of update. Do not include rumours, assumptions, or unverified claims.",
  },
  operatingStatus: {
    title: "JVTO Operating Status",
    paragraphs: [
      "JVTO operates private, pre-booked tours on standard East Java routes, subject to weather, volcanic activity, and access regulations.",
      "We plan and adjust tours based on official information (including MAGMA / PVMBG) and local park management.",
      "Some viewpoints, hiking sections, or waterfall access may be temporarily restricted even when the tour program continues.",
      "Changes are handled according to Weather & Closures and Booking, Payment & Cancellation Policy.",
      "Guests should consult official travel advisories issued by their own governments in addition to this guide.",
    ],
  },
  toc: {
    title: "On This Page",
    items: [
      { id: "faq", label: "FAQ: Short Answers to Common Questions" },
      { id: "booking-information", label: "Booking & Payments" },
      { id: "ijen-health-screening", label: "Ijen Health Screening" },
      { id: "safety-on-tours", label: "Safety on Tours" },
      { id: "packing-and-fitness", label: "Packing & Fitness" },
      { id: "weather-and-closures", label: "Weather & Closures" },
      { id: "police-escort-for-groups", label: "Police Escort for Groups" },
    ],
  },
  panels: [
    {
      id: "faq",
      title: "FAQ: Short Answers to Common Questions",
      summaryParagraphs: [
        "Start here if you're not sure where to look. We answer the most common questions about private tours, what's included, payments, reschedules, and safety.",
      ],
      cta: {
        label: "Read FAQ",
        href: "/travel-guide/faq",
      },
    },
    {
      id: "booking-information",
      title: "Booking & Payments",
      summaryParagraphs: [
        "Details on how to book, deposits, final payments, Package Credit, and why we don't offer cash refunds.",
      ],
      cta: {
        label: "Read Booking Information",
        href: "/travel-guide/booking-information",
      },
    },
    {
      id: "ijen-health-screening",
      title: "Ijen Health Screening",
      summaryParagraphs: [
        "How our health checks work for Ijen night hikes, what is included for JVTO guests, and how the digital system helps prevent fake certificates.",
      ],
      cta: {
        label: "Read Ijen Health Screening",
        href: "/travel-guide/ijen-health-screening",
      },
    },
    {
      id: "safety-on-tours",
      title: "Safety on Tours",
      summaryParagraphs: [
        "How we make decisions about safety on the road, at viewpoints, and on the mountain, including how we monitor conditions and when we change plans.",
        "Understand how safety is built into JVTO's private tours.",
      ],
      cta: {
        label: "Read Safety on Tours",
        href: "/travel-guide/safety-on-tours",
      },
    },
    {
      id: "packing-and-fitness",
      title: "Packing & Fitness",
      summaryParagraphs: [
        "What to pack for Bromo, Ijen and Tumpak Sewu, what kind of fitness you need, and a few tips to keep your belongings safe.",
        "This page helps you prepare realistically for your private tour.",
      ],
      cta: {
        label: "Read Packing & Fitness",
        href: "/travel-guide/packing-and-fitness",
      },
    },
    {
      id: "weather-and-closures",
      title: "Weather & Closures",
      summaryParagraphs: [
        "How rain, fog, or volcanic activity can affect your itinerary, which sources we follow, and what happens to your booking if part of the tour is closed.",
        "East Java's volcano and waterfall routes are dynamic. Weather and volcanic activity can change quickly.",
      ],
      cta: {
        label: "Read Weather & Closures",
        href: "/travel-guide/weather-and-closures",
      },
    },
    {
      id: "police-escort-for-groups",
      title: "Police Escort for Groups",
      summaryParagraphs: [
        "When and how official traffic police escort can be arranged for large groups, and why it is always done through formal channels.",
        "In some situations, large tourist groups may benefit from official traffic police escort: when moving several vehicles together through busy routes.",
      ],
      cta: {
        label: "Read Police Escort for Groups",
        href: "/travel-guide/police-escort-for-groups",
      },
    },
  ],
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageSnapshot("/travel-guide", {
    allowDatabaseFallback: true,
  });
  const title = page.snapshot.seo.title;
  const description =
    page.snapshot.seo.description ?? travelGuideData.seo.metaDescription;
  const h1 =
    typeof page.snapshot.content.h1 === "string"
      ? page.snapshot.content.h1
      : "Travel Guide";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/travel-guide`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: siteUrl + "/assets/img/og/travel-guide.webp",
          width: 1200,
          height: 630,
          alt: h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteUrl + "/assets/img/og/travel-guide.webp"],
    },
  };
}

export default async function TravelGuideHubPage() {
  const [page, faqResolution] = await Promise.all([
    getPublicPageSnapshot("/travel-guide", {
      allowDatabaseFallback: true,
    }),
    resolveFaqsForPage("/travel-guide"),
  ]);
  const tgHubExtraSchemas = [
    buildTgHubItemListSchema(),
    buildResolvedFaqSchema(faqResolution, "/travel-guide"),
  ].filter(Boolean);

  const { hero, latestUpdate, operatingStatus, toc, panels } = travelGuideData;
  const h1 =
    typeof page.snapshot.content.h1 === "string"
      ? page.snapshot.content.h1
      : travelGuideData.h1;

  return (
    <div className="flex min-h-screen bg-background">
      <PageJsonLdCombined
        pageRow={page.pageRow}
        extraSchemas={tgHubExtraSchemas}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
      />
      <Sidebar />
      <main className="flex-1 pt-24 md:pt-36 pb-20">
        <section className="bg-jvto-navy text-white pb-16 pt-8 md:pt-12">
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <nav className="mb-6 text-sm text-white/50">
              <Link href="/" prefetch={false} className="hover:text-white transition-colors">
                Home
              </Link>
              <span className="mx-2">›</span>
              <span className="text-white/80">Travel Guide</span>
            </nav>

            <span className="inline-flex items-center gap-2 rounded-full border border-jvto-lime/30 bg-jvto-lime/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-lime mb-5">
              Essential Knowledge
            </span>

            <h1
              className="font-black text-3xl md:text-5xl text-white mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {h1}
            </h1>
            <div className="space-y-3 mb-8">
              {hero.introParagraphs.map((p, i) => (
                <p className="text-white/70 text-base md:text-lg leading-relaxed" key={i}>
                  {p}
                </p>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {hero.primaryCtas.map((cta) => (
                <Link
                  key={cta.href}
                  href={cta.href}
                  prefetch={false}
                  className={
                    cta.href.includes("tours")
                      ? "inline-block bg-jvto-orange text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-jvto-orange/90 transition-colors"
                      : "inline-block border border-white/30 text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
                  }
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="pt-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <main>
              <Card className="bg-jvto-green/5 border-jvto-green/80 border-2 mb-12">
                <CardHeader>
                  <CardTitle className="text-jvto-green font-black">
                    {latestUpdate.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none text-jvto-green">
                  <p className="font-bold">
                    Last updated: {latestUpdate.lastUpdatedPlaceholder}
                  </p>
                  <div className="mt-4">
                    {latestUpdate.bodyParagraphs.map((p, i) => (
                      <p
                        key={i}
                        className={i > 0 && p.includes(":") ? "ml-4" : ""}
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                  <p className="text-xs italic mt-4">{latestUpdate.note}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border-2 mb-12">
                <CardHeader>
                  <CardTitle className="font-black">
                    {operatingStatus.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none text-gray-700">
                  {operatingStatus.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-12">
                {panels.map((panel) => (
                  <section
                    key={panel.id}
                    id={panel.id}
                    className="scroll-mt-24"
                  >
                    <h2 className="font-black text-2xl">{panel.title}</h2>
                    <hr className="my-2" />
                    <div className="prose max-w-none text-md text-muted-foreground">
                      {panel.summaryParagraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                    {panel.cta && (
                      <div className="mt-6">
                        <Button
                          variant="outline"
                          size="sm"
                          className="p-0 flex h-auto"
                        >
                          <Link className="flex" href={panel.cta.href} prefetch={false}>
                            {panel.cta.label}{" "}
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </section>
                ))}
              </div>

              <DocumentPriorityNote />
            </main>
          </div>
        </section>
      </main>
    </div>
  );
}
