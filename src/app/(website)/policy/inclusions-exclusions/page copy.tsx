// src/app/(website)/policy/inclusions-exclusions/page.tsx
import Link from "@/components/website/AppLink";
import { type Metadata } from "next";
import Sidebar from "../sidebar";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "JVTO — Inclusions & Exclusions Policy",
  description:
    "Official Inclusions & Exclusions Policy for Java Volcano Tour Operator (JVTO).",
  openGraph: {
    title: "JVTO — Inclusions & Exclusions Policy",
    description:
      "Official Inclusions & Exclusions Policy for Java Volcano Tour Operator (JVTO).",
    url: `${siteUrl}/policy/inclusions-exclusions`,
    siteName: "Java Volcano Tour Operator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteUrl + "/assets/img/og/include-exclude.webp",
        width: 1200,
        height: 630,
        alt: "Inclusions Exclusions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JVTO — Inclusions & Exclusions Policy",
    description:
      "Official Inclusions & Exclusions Policy for Java Volcano Tour Operator (JVTO).",
    images: [siteUrl + "/assets/img/og/include-exclude.webp"],
  },
};

export default function InclusionsExclusionsPolicyPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 pt-24 md:pt-36 pb-20">
        <section>
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Breadcrumb Navigation */}
            <nav className="mb-4  text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link href="/policy" className="hover:text-primary">
                Policy
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground font-medium">
                Inclusion Exclusion Policy
              </span>
            </nav>

            {/* Header Section */}
            <div className=" mb-12">
              <h1 className="font-black text-2xl md:text-5xl">
                JVTO — Inclusions & Exclusions Policy
              </h1>
              <p className="mt-4 text-sm text-muted-foreground">
                Last updated: 17 January 2026
              </p>
            </div>

            <div className="prose prose-lg max-w-none mx-auto text-muted-foreground">
              {/* Applies To Section */}
              <p className="border-l-4 border-primary pl-4 italic bg-accent p-4 rounded-r-lg">
                This policy defines what is included and not included in JVTO
                private tour packages. Only inclusions written on your specific
                Official E-Voucher / Invoice (PDF) are contractually binding.
              </p>

              {/* Contractual Rule Section */}
              <div className="mb-8">
                <h2 className="heading-md mt-12 mb-4 text-foreground">
                  Contractual Rule (Write-it-to-Bind-it)
                </h2>
                <div>
                  <p className="mb-4">
                    In this policy, "Official Tour Voucher" refers to your
                    Official E-Voucher / Invoice (PDF) issued by JVTO after
                    successful payment.
                  </p>
                  <p className="mb-4">Only inclusions that appear on:</p>
                  <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li>
                      the official JVTO package page for your chosen tour;
                      and/or
                    </li>
                    <li>your Official E-Voucher / Invoice (PDF)</li>
                  </ul>
                  <p className="mb-4">
                    are legally binding components of your package.
                  </p>
                  <p className="mb-4">
                    If it is not written in your confirmed inclusions and
                    voucher, it is not part of the contracted package, even if
                    discussed informally.
                  </p>
                </div>
              </div>

              {/* Standard Inclusions Section */}
              <div className="mb-8">
                <h2 className="heading-md mt-12 mb-4 text-foreground">
                  Standard Inclusions (All Eligible JVTO Packages)
                </h2>
                <div>
                  <p className="mb-6">
                    Unless stated otherwise on your Official E-Voucher / Invoice
                    (PDF), a confirmed JVTO private tour package typically
                    includes:
                  </p>

                  <h3 className="text-xl font-bold mt-6 mb-2 text-foreground">
                    Transportation
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 mb-6">
                    <li>
                      Private air-conditioned vehicle for all land sectors
                      listed in your confirmed itinerary
                    </li>
                    <li>
                      Fuel, tolls, and standard parking fees as per itinerary
                    </li>
                    <li>
                      Vehicle allocation by group size (comfort and safety):
                      <ul className="list-disc pl-5 mt-2">
                        <li>
                          2–3 guests: 1 × MPV (e.g., Toyota Avanza or similar)
                        </li>
                        <li>
                          4–9 guests: 1 × Toyota Hiace (or similar 16-seat
                          minibus)
                        </li>
                        <li>
                          10–11 guests: 1 × Toyota Hiace + 1 × MPV (for seating
                          and luggage space)
                        </li>
                      </ul>
                    </li>
                    <li>
                      4WD Jeep at Mount Bromo (when Bromo is included):
                      <ul className="list-disc pl-5 mt-2">
                        <li>
                          Private jeep(s) for sunrise and crater viewpoints
                        </li>
                        <li>Max. ±4 guests per jeep for comfort and safety</li>
                      </ul>
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold mt-6 mb-2 text-foreground">
                    Accommodation
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 mb-6">
                    <li>
                      Hotel / homestay accommodation for all overnight stays
                      listed in your itinerary
                    </li>
                    <li>
                      Standard allocation (unless otherwise stated on your
                      voucher):
                      <ul className="list-disc pl-5 mt-2">
                        <li>
                          Even-numbered groups: 1 room per 2 guests (King or
                          Twin)
                        </li>
                        <li>
                          Odd-numbered groups: 1 room per 2 guests + 1 extra bed
                          in one room
                        </li>
                      </ul>
                    </li>
                    <li>
                      Rooming principles:
                      <ul className="list-disc pl-5 mt-2">
                        <li>
                          Maximum 2 guests per standard room (excluding the
                          designated extra bed where applicable)
                        </li>
                        <li>
                          King beds for couples or guests preferring more space
                        </li>
                        <li>Twin beds for guests sharing a room</li>
                      </ul>
                    </li>
                    <li>
                      Upgrade option (subject to request and availability):
                      replacing an extra bed with an additional private room may
                      be available at a published supplement (as per voucher)
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold mt-6 mb-2 text-foreground">
                    Professional Crew
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 mb-6">
                    <li>
                      Licensed, vetted crew adjusted by group size and route:
                      <ul className="list-disc pl-5 mt-2">
                        <li>
                          2–3 guests: 1 × driver-guide (English-speaking) +
                          licensed local site guides where required
                        </li>
                        <li>
                          4–11 guests: 1 × professional driver + 1 × escort
                          guide + licensed local site guides at key locations
                        </li>
                        <li>
                          Additional drivers allocated when extra vehicles are
                          used
                        </li>
                      </ul>
                    </li>
                    <li>
                      Crew duties include: safe driving, time management,
                      coordination with hotels/jeeps/ferries/park authorities,
                      and basic route explanations and guest support
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold mt-6 mb-2 text-foreground">
                    Tickets, Permits & Local Logistics
                  </h3>
                  <p className="mb-4">
                    All listed entrance tickets and environmental/park permits
                    connected to your confirmed itinerary, where applicable,
                    such as:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 mb-6">
                    <li>Mount Bromo National Park access</li>
                    <li>
                      Mount Ijen (including regular entrance and applicable
                      summit/crater access where legally permitted)
                    </li>
                    <li>Madakaripura Waterfall</li>
                    <li>Tumpak Sewu Waterfall</li>
                    <li>Other named attractions in your confirmed program</li>
                    <li>
                      Local retribution / standard local fees where explicitly
                      built into the package
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold mt-6 mb-2 text-foreground">
                    Mount Ijen Safety & Trekking Support (When Ijen is Included)
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 mb-6">
                    <li>
                      Professional gas mask (rated for sulfur environment) for
                      each participating guest
                    </li>
                    <li>
                      Trekking poles (shared or individual, depending on
                      configuration)
                    </li>
                    <li>
                      Mandatory Ijen medical check & digital/printed clearance
                      arranged by JVTO, conducted by licensed medical personnel
                      at an approved facility or at your hotel in the Bondowoso
                      area (included in the package for itineraries that visit
                      Ijen)
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold mt-6 mb-2 text-foreground">
                    Meals & Water
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 mb-6">
                    <li>
                      Daily bottled mineral water in the vehicle for overland
                      sectors
                    </li>
                    <li>Hotel breakfasts for each included overnight stay</li>
                    <li>
                      Any additional included meals (e.g., set dinners or
                      lunches) are included only when explicitly stated on the
                      official package page and/or your Official E-Voucher /
                      Invoice (PDF)
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold mt-6 mb-2 text-foreground">
                    Java-Bali Ferry (Where Applicable)
                  </h3>
                  <p className="mb-4">
                    Ferry tickets for Java-Bali or Bali-Java sectors when:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 mb-6">
                    <li>the crossing is listed in your itinerary; and</li>
                    <li>the ticket is specified as included on your voucher</li>
                  </ul>

                  <h3 className="text-xl font-bold mt-6 mb-2 text-foreground">
                    JVTO Branded Inclusions & Group Extras
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 mb-6">
                    <li>
                      1 × JVTO travel T-shirt per participant for eligible
                      packages (standard JVTO design; size selection via
                      "Complete Your Details")
                    </li>
                    <li>
                      Custom JVTO Group T-shirt (where explicitly included): for
                      groups of ≥12 guests in a single booking, if written on
                      your package/voucher; 1 × custom design T-shirt per
                      person; sizes and final design must be confirmed before
                      production
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold mt-6 mb-2 text-foreground">
                    On-Trip Support & Coordination
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 mb-6">
                    <li>Pre-trip assistance via official WhatsApp/email</li>
                    <li>
                      Clear pickup instructions and emergency contact numbers on
                      your Official E-Voucher / Invoice (PDF)
                    </li>
                    <li>
                      On-trip coordination for timing, weather/closure
                      adjustments, and safety decisions
                    </li>
                    <li>
                      Support in case of incident (basic first response,
                      coordination with local clinics/hospitals, and logistics
                      adjustments where feasible)
                    </li>
                  </ul>
                </div>
              </div>

              {/* Conditional Inclusions Section */}
              <div className="mb-8">
                <h2 className="heading-md mt-12 mb-4 text-foreground">
                  "We Offer More" — Conditional Inclusions (Only If Written)
                </h2>
                <div>
                  <p className="mb-4">
                    The following are included only when clearly stated on both:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 mb-6">
                    <li>the official package description you booked; and</li>
                    <li>your Official E-Voucher / Invoice (PDF)</li>
                  </ul>

                  <p className="mb-4">Conditional inclusions may include:</p>
                  <ul className="list-disc pl-5 space-y-2 mb-6">
                    <li>
                      Custom JVTO group T-shirts (design, quantity, eligibility
                      conditions)
                    </li>
                    <li>
                      Additional hosted meals (e.g., dinner in Bondowoso before
                      Ijen; lunch after Tumpak Sewu; special farewell dinner)
                    </li>
                    <li>
                      Bali hotel/airport transfers beyond the standard ferry
                      crossing
                    </li>
                    <li>Early check-in / late check-out at hotels</li>
                    <li>Dedicated photographer/videographer services</li>
                    <li>
                      Police escort or special convoy arrangements for VIP/large
                      groups (subject to availability and regulation)
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold mt-6 mb-2 text-foreground">
                    Extra meals — specific itinerary conditions (only if
                    written)
                  </h3>
                  <p className="mb-4">
                    For Ijen + Bondowoso overnight itineraries:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 mb-6">
                    <li>
                      Dinner at the Bondowoso hotel before the Ijen night trek
                    </li>
                    <li>
                      Lunch at the Bondowoso hotel after returning from Ijen
                    </li>
                  </ul>

                  <p className="mb-4">For itineraries including Tumpak Sewu:</p>
                  <ul className="list-disc pl-5 space-y-2 mb-6">
                    <li>
                      One additional lunch at/near Yanto Homestay (or equivalent
                      local partner) after the Tumpak Sewu program
                    </li>
                  </ul>
                </div>
              </div>

              {/* Exclusions Section */}
              <div className="mb-8">
                <h2 className="heading-md mt-12 mb-4 text-foreground">
                  Exclusions (Simple Principle)
                </h2>
                <div>
                  <p className="mb-6">
                    To keep things clear: anything that is not explicitly listed
                    as an inclusion on the official package page and on your
                    Official E-Voucher / Invoice (PDF) is excluded.
                  </p>

                  <p className="mb-4">
                    Common examples of not included items (unless clearly
                    written as included for your specific booking):
                  </p>
                  <ul className="list-disc pl-5 space-y-2 mb-6">
                    <li>International / domestic flights and entry visas</li>
                    <li>Travel insurance of any kind</li>
                    <li>Meals not specified (including alcohol)</li>
                    <li>Tips/gratuities for guides and drivers</li>
                  </ul>
                </div>
              </div>

              {/* Discrepancies Section */}
              <div className="mb-8">
                <h2 className="heading-md mt-12 mb-4 text-foreground">
                  Discrepancies
                </h2>
                <div>
                  <p className="mb-4">
                    This policy is designed to integrate with your Official
                    E-Voucher / Invoice (PDF). In the event of any discrepancy,
                    the version referenced on your booking confirmation and
                    voucher will apply.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
