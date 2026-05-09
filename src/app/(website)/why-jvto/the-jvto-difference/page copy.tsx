import Link from "@/components/website/AppLink";
import { Check } from "lucide-react";
import Button from "@/components/website/UI/Button";
import { type Metadata } from "next";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title:
    "The JVTO Difference – Tourist Police-Led, Private & Transparent Tours",
  description:
    "The standards behind JVTO: tourist police-led safety culture, registered Indonesian travel company, private all-inclusive tours, real Ijen health screening, local guides and student fairness.",
  openGraph: {
    title: "The JVTO Difference – Tourist Police-Led, Private & Transparent Tours",
    description:
      "The standards behind JVTO: tourist police-led safety culture, registered Indonesian travel company, private all-inclusive tours, real Ijen health screening, local guides and student fairness.",
    url: `${siteUrl}/why-jvto/the-jvto-difference`,
    siteName: "Java Volcano Tour Operator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteUrl + "/assets/img/og/the-jvto-difference.webp",
        width: 1200,
        height: 630,
        alt: "The JVTO Difference",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The JVTO Difference – Tourist Police-Led, Private & Transparent Tours",
    description:
      "The standards behind JVTO: tourist police-led safety culture, registered Indonesian travel company, private all-inclusive tours, real Ijen health screening, local guides and student fairness.",
    images: [siteUrl + "/assets/img/og/the-jvto-difference.webp"],
  },
};

export default function JvtoDifferencePage() {
  const pillars = [
    {
      number: "01",
      title: "Tourist Police-Led Safety Culture",
      description:
        "JVTO is founded and led by an active tourist police officer in East Java. This influences our work in concrete ways:",
      points: [
        "Routes and timings are chosen considering real safety, traffic and local rules, not just social media trends.",
        "We stay aligned with official information about road conditions, volcanic activity and local regulations.",
        "For suitable large groups, we help coordinate official traffic police escort for specific segments, requested through proper channels and confirmed in writing.",
      ],
      links: [
        {
          text: "Police escort for groups",
          href: "/travel-guide/police-escort-for-groups",
        },
        { text: "Safety on tours", href: "/travel-guide/safety-on-tours" },
        {
          text: "Weather and closures",
          href: "/travel-guide/weather-and-closures",
        },
      ],
    },
    {
      number: "02",
      title: "Registered & Verifiable Travel Company",
      description:
        "JVTO operates as a registered Indonesian travel company based in Bondowoso. You can verify:",
      points: [
        "Business registration and tourism licence documents.",
        "Our office address on Jl. Khairil Anwar No.102 A, Bondowoso.",
        "Membership and approvals from relevant tourism bodies.",
        "Selected police and tourism assignment letters related to our operations.",
      ],
      links: [{ text: "Verify all documents", href: "/verify-jvto" }],
      note: "If you are comparing operators, we encourage you to ask everyone for this level of proof.",
    },
    {
      number: "03",
      title: "Private Tours Only, All-Inclusive by Design",
      description:
        "All JVTO itineraries are private only. We design programs to be all-inclusive and transparent, with typical inclusions such as:",
      points: [
        "Private vehicle and driver.",
        "Private 4WD jeep at Bromo where required.",
        "Listed park entrance tickets and permits.",
        "Ijen health screening for Ijen tours.",
        "Hotel breakfasts and selected main meals written in each itinerary.",
        "Bottled water, essential gear for Ijen, and a JVTO travel t-shirt.",
      ],
      links: [
        {
          text: "What's included and excluded",
          href: "/policy/inclusions-exclusions",
        },
      ],
      note: "Anything not included (for example travel insurance or personal expenses) is clearly stated.",
    },
    {
      number: "04",
      title: "Real Ijen Health Screening & Digital Proof",
      description:
        "We treat Ijen as a serious hike, not a casual walk. For tours that include Ijen, JVTO:",
      points: [
        "Includes pre-ascent health screening in the itinerary.",
        "Works with trained medical staff to perform checks before the hike.",
        "Uses a digital system so staff can verify that a real screening has taken place.",
      ],
      links: [
        {
          text: "Ijen health screening explained",
          href: "/travel-guide/ijen-health-screening",
        },
      ],
      note: "We also support the same digital process for non-JVTO guests through a public web tool, helping to reduce fake letters and improve safety for everyone.",
    },
    {
      number: "05",
      title: "Local Guides & Real Community Impact",
      description:
        "We hire and train local guides, drivers and staff from the communities along the Bromo–Ijen–Tumpak Sewu corridor. Our standards include:",
      points: [
        "Ongoing training in safety procedures, guest communication and environmental respect.",
        "Preference for accommodations and suppliers that align with responsible practices.",
        "Participation in community and network initiatives that focus on fair, sustainable tourism.",
      ],
      links: [
        { text: "Community standards", href: "/why-jvto/community-standards" },
        { text: "Safety on tours", href: "/travel-guide/safety-on-tours" },
      ],
    },
    {
      number: "06",
      title: "Fairness for Students & Future Travellers",
      description:
        "With ISIC, we support eligible international students who face higher park and travel costs:",
      points: [
        "Dedicated information and verification flow for ISIC cardholders.",
        "Access to safe, all-inclusive tours with transparent student-friendly structures, without cutting safety or quality.",
      ],
      links: [
        { text: "ISIC student package", href: "/isic/student-package" },
        { text: "FAQ", href: "/travel-guide/faq" },
      ],
    },
    {
      number: "07",
      title: "Clear Rules, Written in One Place",
      description:
        "We keep all practical rules in one place so there is no guesswork:",
      points: [
        "Booking steps, deposits, payment methods.",
        "Travel Credit and reschedules.",
        "What is included and excluded.",
        "Health and fitness expectations.",
        "Escort for groups.",
        "Weather and closures.",
      ],
      links: [
        { text: "Travel Guide", href: "/travel-guide" },
        {
          text: "Booking information",
          href: "/travel-guide/booking-information",
        },
      ],
      note: "JVTO's promise is simple: no hidden rules, no last-minute surprises.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16 bg-accent border-b">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <nav className="mb-8 text-sm text-muted-foreground">
              <Link href="/why-jvto" className="hover:text-primary">
                Why JVTO
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground font-medium">
                The JVTO Difference
              </span>
            </nav>
            <h1 className="font-black text-2xl md:text-5xl">
              The JVTO Difference – Tourist Police-Led, Private & Transparent
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              This page turns our story into clear standards. These are the
              rules we operate by so you know what to expect before you book.
            </p>
            <div className="mt-6 bg-primary/10 border border-primary/20 rounded-sm p-4 inline-block">
              <p className="text-primary font-medium text-sm md:text-base">
                Whenever you need detailed rules or conditions, please refer to
                our{" "}
                <Link
                  href="/travel-guide"
                  className="underline hover:text-primary/80"
                >
                  Travel Guide
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-12">
              {pillars.map((pillar) => (
                <div key={pillar.number} className="relative">
                  <div className="absolute -left-4 md:-left-16 top-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-lime-400 text-black rounded-sm flex items-center justify-center text-lg md:text-xl font-bold">
                      {pillar.number}
                    </div>
                  </div>

                  <div className="pl-12 md:pl-0">
                    <h2 className="font-black text-xl md:text-3xl mb-4">
                      {pillar.title}
                    </h2>

                    <div className="prose mb-4 max-w-none text-muted-foreground">
                      <p>{pillar.description}</p>
                    </div>

                    {pillar.points && (
                      <ul className="space-y-2 mb-6">
                        {pillar.points.map((point, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="w-5 h-5 text-primary mr-2 mt-1 flex-shrink-0" />
                            <span className="text-muted-foreground">
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {pillar.links && pillar.links.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {pillar.links.map((link, index) => (
                            <Button key={index} variant="outline" size="sm">
                              <Link href={link.href}>{link.text}</Link>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {pillar.note && (
                      <div className="bg-accent border-l-4 border-border p-4 mt-4">
                        <p className="text-muted-foreground text-sm">
                          {pillar.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 bg-accent border-t">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="font-black text-2xl md:text-5xl mb-4">
              Ready to Experience the Difference?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Book a private tour with a company you can verify — tourist
              police-led, registered, and community-rooted.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg">
                <Link href="/tours">Browse Private Tours</Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link href="/verify-jvto">Verify JVTO First</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
