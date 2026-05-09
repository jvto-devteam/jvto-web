import React from "react";
import Link from "@/components/website/AppLink";
import {
  BookOpen,
  HeartPulse,
  CloudLightning,
  Backpack,
  ShieldCheck,
} from "lucide-react";

const TravelGuideTeaser: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-ink-neutral-50 dark:bg-background-dark border-t border-ink-neutral-200 dark:border-ink-neutral-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
          
          {/* LEFT CONTENT */}
          <div className="md:w-1/2">
            <span className="text-primary font-bold tracking-wider uppercase text-sm">
              The Rulebook
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-ink-primary dark:text-white mt-2">
              The Travel Guide & Help Center
            </h2>

            <p className="mt-4 text-lg text-ink-neutral-700 dark:text-ink-neutral-300">
              We believe in total transparency. Our Travel Guide is the{" "}
              <strong>Single Source of Truth</strong> for our policies. Before you
              book, know exactly how cancellations, safety protocols, and health
              requirements work.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/travel-guide"
                className="px-6 py-3 bg-ink-primary dark:bg-white text-white dark:text-ink-primary font-semibold rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
              >
                Open the Guide
                <BookOpen size={20} strokeWidth={1.75} />
              </Link>

              <Link
                href="/travel-guide/booking-information"
                className="px-6 py-3 border border-ink-neutral-300 dark:border-ink-neutral-600 text-ink-primary dark:text-white font-semibold rounded-lg hover:bg-ink-neutral-200 dark:hover:bg-ink-neutral-800 transition-all"
              >
                Booking Policies
              </Link>
            </div>
          </div>

          {/* RIGHT QUICK LINKS */}
          <div className="md:w-5/12 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            
            <Link
              href="/travel-guide/ijen-health-screening"
              className="p-4 bg-white dark:bg-ink-primary rounded-xl shadow-sm hover:shadow-md transition-shadow border border-ink-neutral-200 dark:border-ink-neutral-700 flex flex-col gap-2"
            >
              <HeartPulse className="text-primary" size={28} strokeWidth={1.75} />
              <span className="font-bold text-ink-primary dark:text-white">
                Ijen Health Screening
              </span>
            </Link>

            <Link
              href="/travel-guide/weather-and-closures"
              className="p-4 bg-white dark:bg-ink-primary rounded-xl shadow-sm hover:shadow-md transition-shadow border border-ink-neutral-200 dark:border-ink-neutral-700 flex flex-col gap-2"
            >
              <CloudLightning className="text-primary" size={28} strokeWidth={1.75} />
              <span className="font-bold text-ink-primary dark:text-white">
                Weather & Closures
              </span>
            </Link>

            <Link
              href="/travel-guide/packing-and-fitness"
              className="p-4 bg-white dark:bg-ink-primary rounded-xl shadow-sm hover:shadow-md transition-shadow border border-ink-neutral-200 dark:border-ink-neutral-700 flex flex-col gap-2"
            >
              <Backpack className="text-primary" size={28} strokeWidth={1.75} />
              <span className="font-bold text-ink-primary dark:text-white">
                Packing & Fitness
              </span>
            </Link>

            <Link
              href="/travel-guide/police-escort-for-groups"
              className="p-4 bg-white dark:bg-ink-primary rounded-xl shadow-sm hover:shadow-md transition-shadow border border-ink-neutral-200 dark:border-ink-neutral-700 flex flex-col gap-2"
            >
              <ShieldCheck className="text-primary" size={28} strokeWidth={1.75} />
              <span className="font-bold text-ink-primary dark:text-white">
                Group Escorts
              </span>
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelGuideTeaser;
