import React from "react";
import Link from "@/components/website/AppLink";
import { CheckCircle2, Globe } from "lucide-react";

const IjenHealthScreeningSection = () => (
  <section className="py-16 md:py-24 bg-white dark:bg-background-dark">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center bg-blue-50 dark:bg-blue-900/30 p-8 rounded-sm border border-blue-200 dark:border-blue-700">
        
        {/* Content */}
        <div>
          <h2 className="text-3xl font-bold text-ink-primary dark:text-white">
            Real Ijen Health Screening: Included for JVTO Guests
          </h2>

          <p className="mt-4 text-ink-neutral-700 dark:text-ink-neutral-200">
            Kawah Ijen is a night hike with sulfur gas and altitude. JVTO includes
            a real health screening for guests on Ijen tours, delivered by trained
            medical teams, with digital records that can be checked at the gate.
            This reduces fake letters and helps prevent avoidable emergencies.
          </p>

          <ul className="mt-4 space-y-3 text-ink-neutral-700 dark:text-ink-neutral-200">
            <li className="flex gap-2 items-start">
              <CheckCircle2
                className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>
                <strong>JVTO guests:</strong> screening is part of your package.
              </span>
            </li>

            <li className="flex gap-2 items-start">
              <Globe
                className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>
                <strong>Other travelers:</strong> can access the same digital
                system at{" "}
                <a
                  href="https://health.mountijen.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline"
                >
                  health.mountijen.com
                </a>
                .
              </span>
            </li>
          </ul>

          <Link
            href="/travel-guide/ijen-health-screening"
            className="mt-6 inline-block font-semibold text-primary bg-primary/5 hover:bg-primary/10 transition-colors px-6 py-3 rounded-sm"
          >
            How Ijen Screening Works →
          </Link>
        </div>

        {/* Image */}
        <div>
          <img
            src="https://javavolcano-touroperator.com/screening/ijen-screening-hotel-01.jpeg"
            alt="Nurse checks blood pressure during Ijen pre-ascent screening at hotel lobby."
            className="rounded-sm shadow-md w-full object-cover"
          />
        </div>

      </div>
    </div>
  </section>
);

export default IjenHealthScreeningSection;
