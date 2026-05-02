import React from "react";
import SEO from "./SEO";
import Breadcrumbs from "./Breadcrumbs";
import ProofLedger from "./ProofLedger";
import { contactInfo, proofLinks } from "@/constants";
import Link from "next/link";

const VerifyJVTOPage: React.FC = () => {
  const breadcrumbCrumbs = [
    { name: "Home", path: "/" },
    { name: "Verify JVTO", path: "/verify-jvto" },
  ];

  return (
    <>
      <div className="bg-background-light dark:bg-background-dark pt-20">
        <header className="py-12 bg-white dark:bg-ink-primary">
          <div className="container mx-auto px-4">
            <Breadcrumbs crumbs={breadcrumbCrumbs} />
            <div className="mt-4 max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-black text-ink-primary dark:text-white">
                Verify JVTO – Legal Registration & Official Proof
              </h1>
              <p className="mt-4 text-lg text-ink-neutral-500 dark:text-ink-neutral-200">
                In an industry where many operators are unregulated, we provide
                verifiable proof of our legal standing, office location, and
                safety leadership.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/travel-guide"
                  className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  Looking for operational rules? See the Travel Guide{" "}
                  <span className="material-symbols-outlined text-base">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 md:py-16 space-y-12">
          {/* Quick Summary */}
          <section className="bg-white dark:bg-ink-primary p-6 rounded-sm shadow-sm border border-ink-neutral-200 dark:border-ink-neutral-700">
            <h2 className="text-xl font-bold text-ink-primary dark:text-white mb-4">
              Quick Verification Summary
            </h2>
            <ul className="grid md:grid-cols-2 gap-4">
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-green-500">
                  check_circle
                </span>
                <span className="text-ink-neutral-700 dark:text-ink-neutral-200">
                  <strong>Registered PT:</strong> PT Java Volcano Rendezvous
                  (AHU-Registered)
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-green-500">
                  check_circle
                </span>
                <span className="text-ink-neutral-700 dark:text-ink-neutral-200">
                  <strong>Licensed:</strong> NIB & TDUP 1102230032918
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-green-500">
                  check_circle
                </span>
                <span className="text-ink-neutral-700 dark:text-ink-neutral-200">
                  <strong>Physical Office:</strong> Bondowoso, East Java
                  (Verifiable on Maps)
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-green-500">
                  check_circle
                </span>
                <span className="text-ink-neutral-700 dark:text-ink-neutral-200">
                  <strong>Police-Led:</strong> Founder is active-duty Tourist
                  Police (East Java)
                </span>
              </li>
            </ul>
          </section>

          {/* Proof Ledger Component */}
          <ProofLedger />

          {/* Office Proof */}
          <section className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-2xl font-bold text-ink-primary dark:text-white mb-4">
                Physical Office Verification
              </h2>
              <p className="text-ink-neutral-700 dark:text-ink-neutral-200 mb-6">
                Unlike freelance agents who operate from mobile phones, we
                maintain a staffed headquarters. You are welcome to visit us.
              </p>
              <div className="p-4 bg-ink-neutral-50 dark:bg-background-dark rounded-sm border border-ink-neutral-200 dark:border-ink-neutral-700">
                <p className="font-semibold text-ink-primary dark:text-white">
                  {contactInfo.officeAddress}
                </p>
                <div className="mt-4 flex gap-4">
                  <a
                    href={proofLinks.officeMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary font-semibold hover:underline"
                  >
                    <span className="material-symbols-outlined">map</span>
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>
            <div className="rounded-sm overflow-hidden shadow-lg border border-ink-neutral-200 dark:border-ink-neutral-700">
              <img
                src="https://javavolcano-touroperator.com/legal/office-photo.jpg"
                alt="JVTO Office Exterior in Bondowoso"
                className="w-full h-auto object-cover aspect-video"
              />
              <div className="p-3 bg-white dark:bg-ink-primary text-xs text-center text-ink-neutral-500">
                Actual photo of JVTO Headquarters in Bondowoso
              </div>
            </div>
          </section>

          {/* Tourist Police Context */}
          <section className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-sm border border-blue-200 dark:border-blue-800">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-full text-blue-600 dark:text-blue-300">
                <span className="material-symbols-outlined text-4xl">
                  local_police
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-ink-primary dark:text-white mb-3">
                  Tourist Police Leadership Context
                </h2>
                <p className="text-ink-neutral-700 dark:text-ink-neutral-200 mb-4">
                  Our founder, Mr. Sam, holds active warrants (SPRIN) as a
                  Tourist Police officer. We display these documents in the
                  ledger above to substantiate our{" "}
                  {`"Police-Led Safety Culture."`}
                </p>
                <div className="p-4 bg-white dark:bg-background-dark rounded-sm border border-blue-100 dark:border-blue-700 text-sm">
                  <p className="font-semibold text-ink-primary dark:text-white mb-1">
                    Important Clarification:
                  </p>
                  <p className="text-ink-neutral-600 dark:text-ink-neutral-300">
                    These documents verify the {`founder's`} background and our
                    capability to coordinate with authorities.{" "}
                    <strong>
                      They do NOT mean every tour comes with a police escort.
                    </strong>{" "}
                    An official police escort {`("Patwal")`} is a specific,
                    premium service for large groups that must be arranged
                    separately.
                  </p>
                  <Link
                    href="/travel-guide/police-escort-for-groups"
                    className="mt-2 inline-block text-primary hover:underline"
                  >
                    Read how Group Escorts work →
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* External Validation */}
          <section>
            <h2 className="text-2xl font-bold text-ink-primary dark:text-white mb-6">
              How to Cross-Check Us Externally
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <a
                href={proofLinks.tripadvisor}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 bg-white dark:bg-ink-primary rounded-sm shadow-card hover:shadow-cardHover transition-all border border-ink-neutral-200 dark:border-ink-neutral-700"
              >
                <img
                  src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg"
                  alt="TripAdvisor"
                  className="h-8 mb-4 dark:invert"
                />
                <p className="text-sm text-ink-neutral-600 dark:text-ink-neutral-300">
                  Read traveller reviews and see photos posted by guests.
                </p>
              </a>
              <a
                href={proofLinks.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 bg-white dark:bg-ink-primary rounded-sm shadow-card hover:shadow-cardHover transition-all border border-ink-neutral-200 dark:border-ink-neutral-700"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"
                  alt="Google"
                  className="h-8 mb-4"
                />
                <p className="text-sm text-ink-neutral-600 dark:text-ink-neutral-300">
                  Verify our office location and recent reviews on Google Maps.
                </p>
              </a>
              <a
                href={proofLinks.trustpilot}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 bg-white dark:bg-ink-primary rounded-sm shadow-card hover:shadow-cardHover transition-all border border-ink-neutral-200 dark:border-ink-neutral-700"
              >
                <img
                  src="https://cdn.trustpilot.net/brand-assets/4.3.0/logo-wordmark/light-bg/logo-black.svg"
                  alt="Trustpilot"
                  className="h-8 mb-4 dark:invert"
                />
                <p className="text-sm text-ink-neutral-600 dark:text-ink-neutral-300">
                  Check our independent rating on Trustpilot.
                </p>
              </a>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default VerifyJVTOPage;
