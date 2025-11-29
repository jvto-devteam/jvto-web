import React from "react";
import Link from "next/link";
import { contactInfo } from "@/constants";
import Breadcrumbs from "./Breadcrumbs";

const guideLinks = [
  {
    title: "FAQ",
    description:
      "Find answers to common questions about booking, safety, and logistics.",
    link: "/travel-guide/faq",
    icon: "quiz",
  },
  {
    title: "Booking, Payment & Cancellation",
    description: "Our policies on payments, cancellations, and reschedules.",
    link: "/travel-guide/booking-information",
    icon: "receipt_long",
  },
  {
    title: "Ijen Health Screening",
    description:
      "Learn about the mandatory health check and our digital verification system.",
    link: "/travel-guide/ijen-health-screening",
    icon: "health_and_safety",
  },
  {
    title: "Safety on Tours",
    description:
      "Our commitment to safety, from vehicle checks to guide training.",
    link: "/travel-guide/safety-on-tours",
    icon: "local_police",
  },
  {
    title: "Packing & Fitness",
    description: "What to bring and how to prepare for your volcano adventure.",
    link: "/travel-guide/packing-and-fitness",
    icon: "fitness_center",
  },
  {
    title: "Weather & Closures",
    description:
      "How we handle itinerary changes due to weather or volcanic activity.",
    link: "/travel-guide/weather-and-closures",
    icon: "thunderstorm",
  },
  {
    title: "Police Escort for Groups",
    description:
      "The legal process for arranging official escorts for large groups.",
    link: "/travel-guide/police-escort-for-groups",
    icon: "directions_car",
  },
];

const GuideCard: React.FC<(typeof guideLinks)[0]> = ({
  title,
  description,
  link,
  icon,
}) => (
  <Link
    href={link}
    className="group block p-6 bg-white dark:bg-background-dark rounded-2xl shadow-card hover:shadow-cardHover border border-ink-neutral-200 dark:border-ink-neutral-700 hover:border-primary dark:hover:border-primary transition-all transform hover:-translate-y-1"
  >
    <div className="flex items-start gap-4">
      <div className="bg-primary/10 text-primary p-3 rounded-lg">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <h3 className="text-lg font-bold text-ink-primary dark:text-white">
          {title}
        </h3>
        <p className="mt-1 text-sm text-ink-neutral-700 dark:text-ink-neutral-200">
          {description}
        </p>
        <div className="mt-3 text-sm font-semibold text-primary">
          Read More{" "}
          <span className="transform transition-transform group-hover:translate-x-1 inline-block">
            →
          </span>
        </div>
      </div>
    </div>
  </Link>
);

const TravelGuidePage: React.FC = () => {
  const breadcrumbCrumbs = [
    { name: "Home", path: "/" },
    { name: "Travel Guide", path: "/travel-guide" },
  ];
  return (
    <>
      <div className="bg-background-light dark:bg-background-dark">
        <header className="relative py-28 md:py-48 bg-ink-primary text-white text-center">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto-format=fit=crop')`,
            }}
          ></div>
          <div className="relative container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              Travel Guide & Help Center
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
              Essential information to help you plan your East Java adventure
              with confidence.
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Breadcrumbs crumbs={breadcrumbCrumbs} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {guideLinks.map((link) => (
                <GuideCard key={link.title} {...link} />
              ))}
            </div>

            <div className="mt-12 text-center p-6 bg-white dark:bg-background-dark rounded-2xl border border-ink-neutral-200 dark:border-ink-neutral-700">
              <p className="text-lg font-semibold text-ink-primary dark:text-white">
                Still have questions?
              </p>
              <p className="mt-1 text-ink-neutral-700 dark:text-ink-neutral-200">
                Our team is ready to help. Contact us directly for a quick
                response.
              </p>
              <a
                href={contactInfo.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-opacity-90 transition-all"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default TravelGuidePage;
