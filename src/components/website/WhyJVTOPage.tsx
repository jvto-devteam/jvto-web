import React from "react";
import Link from "@/components/website/AppLink";
import Breadcrumbs from "./Breadcrumbs";
import {
  ScrollText,
  BadgeCheck,
  Star,
  Users,
  Leaf,
} from "lucide-react";

const hubLinks = [
  {
    title: "Our Story",
    description:
      "From a local homestay to a police-led, licensed tour operator.",
    link: "/why-jvto/our-story",
    icon: ScrollText,
  },
  {
    title: "The JVTO Difference",
    description:
      "The 7 pillars of our service: safety, transparency, and community.",
    link: "/why-jvto/the-jvto-difference",
    icon: BadgeCheck,
  },
  {
    title: "Reviews",
    description:
      "Read uncensored feedback on Google, TripAdvisor, and Trustpilot.",
    link: "/why-jvto/reviews",
    icon: Star,
  },
  {
    title: "Our Team",
    description:
      "Meet the local guides and experts who make your journey unforgettable.",
    link: "/why-jvto/our-team",
    icon: Users,
  },
  {
    title: "Community Standards",
    description:
      "Our commitment to local hiring, Indecon alignment, and responsible tourism.",
    link: "/why-jvto/community-standards",
    icon: Leaf,
  },
];

type HubLink = (typeof hubLinks)[0];

const HubCard: React.FC<HubLink> = ({
  title,
  description,
  link,
  icon: Icon,
}) => (
  <Link
    href={link}
    className="group block p-6 bg-white dark:bg-background-dark rounded-2xl shadow-card hover:shadow-cardHover border border-ink-neutral-200 dark:border-ink-neutral-700 hover:border-primary dark:hover:border-primary transition-all transform hover:-translate-y-1"
  >
    <div className="flex items-start gap-4">
      <div className="bg-primary/10 text-primary p-3 rounded-lg">
        <Icon size={26} strokeWidth={1.75} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-ink-primary dark:text-white">
          {title}
        </h3>
        <p className="mt-1 text-sm text-ink-neutral-700 dark:text-ink-neutral-200">
          {description}
        </p>
        <div className="mt-3 text-sm font-semibold text-primary">
          Learn More{" "}
          <span className="transform transition-transform group-hover:translate-x-1 inline-block">
            →
          </span>
        </div>
      </div>
    </div>
  </Link>
);

const WhyJVTOPage: React.FC = () => {
  const breadcrumbCrumbs = [
    { name: "Home", path: "/" },
    { name: "Why JVTO", path: "/why-jvto" },
  ];

  return (
    <>
      <div className="bg-background-light dark:bg-ink-primary pt-20">
        {/* HERO */}
        <header className="relative py-20 md:py-32 bg-ink-primary text-white text-center">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage:
                "url('https://storage.googleapis.com/aai-web-samples/pro-code/JVTO/mr-sam-tourist-group.jpg')",
            }}
          />
          <div className="relative container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              Why Travel with JVTO
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
              A central hub to verify our licenses, safety standards, public
              reviews, and local impact.
            </p>
          </div>
        </header>

        {/* CONTENT */}
        <main className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Breadcrumbs crumbs={breadcrumbCrumbs} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hubLinks.map((item) => (
                <HubCard key={item.title} {...item} />
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 text-center p-6 bg-white dark:bg-background-dark rounded-2xl border border-ink-neutral-200 dark:border-ink-neutral-700">
              <p className="text-lg font-semibold text-ink-primary dark:text-white">
                Ready to explore East Java with a trusted partner?
              </p>
              <Link
                href="/tours"
                className="mt-4 inline-block px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-opacity-90 transition-all"
              >
                Browse Our Private Tours
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default WhyJVTOPage;
