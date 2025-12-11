import Link from "next/link";
import Image from "next/image";
import { type Metadata } from "next";
import Button from "@/components/website/UI/Button";
import { Check } from "lucide-react";
import { operations, healthSafety } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Community Standards – Local Guides & Responsible Travel | JVTO",
  description:
    "How JVTO works with local guides, communities and networks around Bromo, Ijen and Tumpak Sewu, and what we expect from guests to keep trips fair and respectful.",
};

export default function CommunityStandardsPage() {
  const standards = [
    {
      title: "Local Guides & Jobs",
      description:
        "JVTO partners with local guides and drivers across the Bromo–Ijen–Tumpak Sewu corridor. Many are youth from the surrounding villages, trained and supported over time. This keeps knowledge and income close to the destinations themselves.",
      icon: "👥",
      color: "bg-blue-100 text-blue-600",
      images: [
        operations.team_and_activities.find(
          (i) => i.filename === "group-at-jvto-office.jpg"
        )?.url,
        operations.team_and_activities.find(
          (i) => i.filename === "guest-welcome-evening.png"
        )?.url,
      ].filter(Boolean) as string[],
      links: [{ text: "Meet our team", href: "/why-jvto/our-team" }],
    },
    {
      title: "Responsible Operations",
      description: "Practical standards, not slogans:",
      icon: "🌱",
      color: "bg-green-100 text-green-600",
      points: [
        "We keep group sizes appropriate to the environment and safety.",
        "We work with accommodations and service providers that respect basic environmental and social standards.",
        "We encourage refill-first water habits and waste reduction where possible.",
        "Our guides are briefed to avoid risky behaviour (standing on dangerous edges, ignoring closures, etc.).",
      ],
      links: [
        { text: "Safety on tours", href: "/travel-guide/safety-on-tours" },
        {
          text: "Packing and fitness",
          href: "/travel-guide/packing-and-fitness",
        },
      ],
    },
    {
      title: "Ijen Health Screening as Community Safety",
      description:
        "Ijen screening is not only a private feature but a public-safety contribution:",
      icon: "🏥",
      color: "bg-red-100 text-red-600",
      points: [
        "Screening reduces the number of unfit or unprepared visitors on the trail.",
        "The digital system makes it harder to use fraudulent documents.",
        "This supports park staff, medical teams and fellow hikers.",
      ],
      images: [
        healthSafety.screening_procedures.find(
          (i) => i.filename === "ijen-screening-hotel-01.jpeg"
        )?.url,
        healthSafety.screening_procedures.find(
          (i) => i.filename === "jvto-office-screening-2.jpg"
        )?.url,
      ].filter(Boolean) as string[],
      links: [
        {
          text: "Ijen health screening explained",
          href: "/travel-guide/ijen-health-screening",
        },
      ],
    },
    {
      title: "Students & Fair Access",
      description:
        "International students often face higher travel and ticket costs. Through ISIC, we offer student-friendly structures on selected tours so that safety and local contribution are maintained, while pricing stays fair.",
      icon: "🎓",
      color: "bg-yellow-100 text-yellow-600",
      links: [
        { text: "ISIC student package", href: "/isic/student-package" },
        { text: "FAQ", href: "/travel-guide/faq" },
      ],
    },
  ];

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
              <span className="text-foreground font-medium">Community Standards</span>
            </nav>

            <div className="text-center mb-12">
              <h1 className="font-black uppercase text-4xl md:text-5xl tracking-tight">
                Community Standards – How We Work with People & Places
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                How JVTO works with local guides, communities and networks
                around Bromo, Ijen and Tumpak Sewu, and what we expect from
                guests to keep trips fair and respectful.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="space-y-12">
              {standards.map((standard, index) => (
                <section
                  key={index}
                  className="bg-card rounded-sm border p-6 md:p-8 shadow-sm"
                >
                  <div className="md:flex items-start mb-6">
                    <div
                      className={`w-16 h-16 rounded-sm flex items-center justify-center text-3xl mr-6 mb-4 md:mb-0 ${standard.color}`}
                    >
                      {standard.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black uppercase text-foreground">
                        {standard.title}
                      </h2>
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-muted-foreground">
                      {standard.description}
                    </p>

                    {standard.points && (
                      <ul className="text-muted-foreground mt-4 space-y-2">
                        {standard.points.map((point, pointIndex) => (
                          <li key={pointIndex} className="flex items-start">
                            <Check className="w-5 h-5 text-primary mr-2 mt-1 flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {standard.images && standard.images.length > 0 && (
                    <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                      {standard.images.map((image, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="relative h-48 rounded-sm overflow-hidden"
                        >
                          <Image
                            src={image}
                            alt={`${standard.title} illustration ${
                              imgIndex + 1
                            }`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {standard.links && standard.links.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6 not-prose">
                      {standard.links.map((link, linkIndex) => (
                        <Button variant="link" key={linkIndex}>
                          <Link href={link.href}>{link.text}</Link>
                        </Button>
                      ))}
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
