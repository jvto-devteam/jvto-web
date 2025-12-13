import React from "react";
import Link from "next/link";
import { contactInfo } from "@/constants";
import Breadcrumbs from "./Breadcrumbs";
import {
  HelpCircle,
  ReceiptText,
  HeartPulse,
  ShieldCheck,
  Backpack,
  CloudLightning,
  Car,
  ArrowRight,
} from "lucide-react";

/* ---------------- GUIDE LINKS ---------------- */

const guideLinks = [
  {
    title: "FAQ",
    description:
      "Find answers to common questions about booking, safety, and logistics.",
    link: "/travel-guide/faq",
    icon: HelpCircle,
  },
  {
    title: "Booking, Payment & Cancellation",
    description: "Our policies on payments, cancellations, and reschedules.",
    link: "/travel-guide/booking-information",
    icon: ReceiptText,
  },
  {
    title: "Ijen Health Screening",
    description:
      "Learn about the mandatory health check and our digital verification system.",
    link: "/travel-guide/ijen-health-screening",
    icon: HeartPulse,
  },
  {
    title: "Safety on Tours",
    description:
      "Our commitment to safety, from vehicle checks to guide training.",
    link: "/travel-guide/safety-on-tours",
    icon: ShieldCheck,
  },
  {
    title: "Packing & Fitness",
    description: "What to bring and how to prepare for your volcano adventure.",
    link: "/travel-guide/packing-and-fitness",
    icon: Backpack,
  },
  {
    title: "Weather & Closures",
    description:
      "How we handle itinerary changes due to weather or volcanic activity.",
    link: "/travel-guide/weather-and-closures",
    icon: CloudLightning,
  },
  {
    title: "Police Escort for Groups",
    description:
      "The legal process for arranging official escorts for large groups.",
    link: "/travel-guide/police-escort-for-groups",
    icon: Car,
  },
] as const;

/* ---------------- GUIDE CARD ---------------- */

interface GuideCardProps {
  title: string;
  description: string;
  link: string;
  icon: React.ElementType;
}

const GuideCard: React.FC<GuideCardProps> = ({
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
      <div className="bg-primary/10 text-primary p-3 rounded-lg shrink-0">
        <Icon size={24} strokeWidth={1.75} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-ink-primary dark:text-white">
          {title}
        </h3>
        <p className="mt-1 text-sm text-ink-neutral-700 dark:text-ink-neutral-200">
          {description}
        </p>
        <div className="mt-3 text-sm font-semibold text-primary flex items-center gap-1">
          Read More
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </div>
  </Link>
);

/* ---------------- PAGE ---------------- */

const TravelGuidePage: React.FC = () => {
  const breadcrumbCrumbs = [
    { name: "Home", path: "/" },
    { name: "Travel Guide", path: "/travel-guide" },
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark">
      {/* HERO */}
      <header className="relative py-28 md:py-48 bg-ink-primary text-white text-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto-format=fit=crop')",
          }}
        />
        <div className="relative container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            Travel Guide & Help Center
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
            Essential information to help you plan your East Java adventure with
            confidence.
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumbs crumbs={breadcrumbCrumbs} />
          </div>

          {/* Guide List */}
          <div className="grid grid-cols-1 gap-6">
            {guideLinks.map((item) => (
              <GuideCard key={item.title} {...item} />
            ))}
          </div>

          {/* CTA */}
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
  );
};

export default TravelGuidePage;
