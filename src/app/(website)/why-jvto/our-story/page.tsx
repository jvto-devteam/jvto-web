import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/website/UI/Button";
import { companyHistory } from "@/lib/legal";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Police-Led Safety & Our Story | JVTO",
  description:
    "How JVTO grew from a local homestay into a tourist police-led, registered East Java travel company with real health screening and community partnerships.",
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
        href: "/travel-guide/inclusions-exclusions-policy",
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
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
