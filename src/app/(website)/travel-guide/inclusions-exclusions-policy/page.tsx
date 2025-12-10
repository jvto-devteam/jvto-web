import Link from "next/link";
import { type Metadata } from "next";

const policyData = {
  inclusionsExclusionsPolicy: {
    operatorName: "Java Volcano Tour Operator (JVTO)",
    documentTitle: "Inclusions & Exclusions Policy",
    lastUpdated: "09 November 2025",
    appliesTo:
      "All private tour packages operated by Java Volcano Tour Operator (JVTO), under PT Java Volcano Rendezvous.",
    intro:
      "This Policy defines, in clear and operational terms, what is **included** and **not included** in JVTO private tour packages. It is designed to:\n\n- Provide a single source of truth for guests, partners, and automated systems;\n- Align with the JVTO Booking, Payment & Cancellation Policy;\n- Align with the JVTO Privacy & Data Protection Policy;\n- Align with the JVTO Official Booking Guide — How to Book.\n\nIf there is any discrepancy, the hierarchy is:\n\n1. The specific inclusions/exclusions stated on your **Official E-Voucher / Invoice**;\n2. This Inclusions & Exclusions Policy;\n3. The general website content or informal communication.",
    hierarchy: [
      "The specific inclusions/exclusions stated on your **Official E-Voucher / Invoice**;",
      "This Inclusions & Exclusions Policy;",
      "The general website content or informal communication.",
    ],
    sections: [
      {
        number: "1",
        title: "Core Contract Principle",
        text: "Only the following are contractually binding:\n\n- The inclusions that appear on the **official JVTO package page** for the tour you booked; **and**\n- The inclusions that are written on your **Official E-Voucher / Invoice**.\n\nAnything **not** explicitly listed as an inclusion on those sources is considered **excluded**, even if mentioned informally in chats, emails, or marketing content.",
      },
      {
        number: "2",
        title: "Standard Inclusions (All Eligible JVTO Packages)",
        text: "Unless clearly stated otherwise on your Official E-Voucher, a confirmed JVTO private tour package **typically includes** the following as standard, where relevant to your chosen itinerary.\n\n### 2.1 Transportation\n\n- **Private air-conditioned vehicle** for all land sectors listed in your confirmed itinerary.  \n- **Fuel, tolls, and standard parking fees** as required by the route.  \n- Vehicles allocated by group size for comfort and safety, for example:  \n  - 2–3 guests: 1 × MPV (e.g. Toyota Avanza or similar);  \n  - 4–9 guests: 1 × Toyota Hiace or similar minibus;  \n  - 10–11 guests: 1 × Toyota Hiace + 1 × MPV (to ensure proper seating and luggage space).  \n- **Private 4WD jeep(s) for Mount Bromo** sunrise and viewpoints when Mount Bromo is part of your confirmed itinerary, allocated based on safe and comfortable seating (typically up to ±4 guests per jeep).\n\n### 2.2 Accommodation & Breakfast\n\n- Hotel or homestay accommodation for **all overnight stays** listed in your itinerary.  \n- Properties selected in line with the package level and location, as shown on your package description or E-Voucher, or similar alternatives of equal or higher standard where substitution is necessary.  \n- Standard rooming principles (unless your Official E-Voucher states otherwise):  \n  - Even-numbered groups: 1 room per 2 guests (King or Twin).  \n  - Odd-numbered groups: 1 room per 2 guests + 1 extra bed in one room.  \n  - Maximum 2 guests per standard room (excluding the designated extra bed where applicable).  \n- **Daily breakfast** included for each accommodated night, **unless** your E-Voucher clearly states otherwise.  \n- Upgrades (for example, replacing an extra bed with an additional private room) are available on request at the published supplement rate or as stated on your E-Voucher.\n\n### 2.3 Entrance Tickets & Permits\n\n- All **listed entrance tickets and permits** for sites included in your confirmed itinerary, as specified on your tour page and E-Voucher (for example: Mount Bromo, Mount Ijen, Tumpak Sewu, Madakaripura, and other explicitly listed attractions).\n- Where relevant, JVTO arranges these in advance to ensure compliant and efficient access.\n\n### 2.4 Guides & On-Trip Support\n\n- **English-speaking driver/guide** for small groups, or a combination of:\n  - Professional driver;\n  - Escort guide;\n  - Licensed local site guides at key locations,\\\n    according to group size and regulatory requirements.\n- On-trip operational support for:\n  - Pickup and timing coordination;\n  - Weather or closure-related adjustments;\n  - Basic assistance in case of incidents (e.g. coordinating with local clinics or hospitals, and logistical adjustments where feasible).\n\n### 2.5 Mount Bromo Specific Inclusions (If in Your Itinerary)\n\n- **Private 4WD jeep(s)** for sunrise viewpoints (such as Penanjakan, King Kong Hill, or equivalent) and key Bromo highlights, as written on your E-Voucher.\n- Applicable entrance tickets and local guiding services as specified on your package.\n\n### 2.6 Mount Ijen Specific Inclusions (If in Your Itinerary)\n\nFor JVTO tours including Mount Ijen night trek / blue fire / summit, your package typically includes, as written on your E-Voucher:\n\n- **Professional gas mask** and, where specified, trekking support equipment for use during the hike;\n- **Mandatory Ijen health screening and digital clearance**, where applicable, arranged and paid by JVTO as part of eligible packages;\n- Relevant entrance tickets and local guide services as listed.\n\n### 2.7 Daily Bottled Water\n\n- Reasonable supply of **bottled mineral water** during overland touring days.\n\n### 2.8 Java–Bali Ferry (Where Applicable)\n\n- **Ferry tickets for Java–Bali or Bali–Java crossings** are included **only** when:\n  - The crossing is listed in your confirmed itinerary; **and**\n  - The ticket is specified as included on your Official E-Voucher.\n\n### 2.9 JVTO Branded Items (Where Stated)\n\n- **JVTO travel T-shirt:** one per participant **only** for eligible packages where this is clearly written on your Official E-Voucher / Invoice.  \n- Custom JVTO group T-shirts (design, quantity, and conditions) are provided **only** where explicitly stated for qualifying group sizes and written on your Official E-Voucher.\n\n### 2.10 On-Trip Support & Coordination\n\n- Pre-trip assistance via official WhatsApp/email.  \n- Clear pickup instructions and emergency contact details on your Official E-Voucher.  \n- On-trip coordination for timing, access, weather/closure impacts, and safety decisions.  \n- Support in case of incidents (e.g. basic first response, assistance in coordinating with local clinics/hospitals, and feasible logistical adjustments).",
      },
      {
        number: "3",
        title: "Conditional Inclusions (“We Offer More” – Only If Written)",
        text: "The items below are **not standard**. They are included **only** when:\n\n1. Clearly stated on the **official package description** you booked; **and**  \n2. Repeated on your **Official E-Voucher / Invoice**.\n\n### 3.1 Custom JVTO Group T-Shirts (Groups ≥ 12 pax)\n\n- For eligible group bookings (e.g. ≥12 participants under one booking), one (1) custom JVTO T-shirt per participant may be included **only** where explicitly written on your Official E-Voucher.  \n- Sizes and final design must be confirmed via the designated form/link before production.\n\n### 3.2 Extra Meals — Specific Itinerary Conditions\n\n- For itineraries including Mount Ijen with Bondowoso overnight stays, additional dinners or lunches may be included **only** where clearly written on your package description and E-Voucher.  \n- For itineraries including Tumpak Sewu, one additional lunch at/near the local partner property may be included **only** where clearly written on your package description and E-Voucher.\n\n### 3.3 Other Conditional Services\n\nExamples (only if explicitly written on your E-Voucher):\n\n- Hosted welcome or farewell dinners;  \n- Bali hotel/airport transfers beyond the standard Java–Bali ferry linkage;  \n- Early check-in or late check-out at hotels;  \n- Dedicated trip photographer/videographer services;  \n- Police escort or special convoy arrangements for VIP / large groups, where permitted and feasible.\n\nIf a conditional item is **not** written in your confirmed inclusions and Official E-Voucher, it is **not** part of the contracted package, even if discussed informally.",
      },
      {
        number: "4",
        title: "Exclusions (Simple Rule)",
        text: "**Simple rule:** If it is **not** explicitly listed as “included” on:\n\n- The official JVTO package page for your chosen tour; or\n- Your Official E-Voucher / Invoice;\n\nthen it is **excluded**.\n\n### 4.1 Common Exclusions (Unless Clearly Written as Included)\n\nThe following are **normally excluded** from JVTO packages:\n\n- International and domestic flights;  \n- Entry visas, immigration fees, and related border costs;  \n- Any form of travel insurance;  \n- Meals and drinks **not** specified as included (including alcohol);  \n- Tips / gratuities for drivers, guides, and local staff;  \n- Personal expenses (e.g. snacks, laundry, minibar, telephone, souvenirs);  \n- Room service, hotel incidentals, and any damages or penalty charges;  \n- Optional or extra activities not listed on your confirmed itinerary or Official E-Voucher;  \n- Additional transport, hotel nights, or routing changes requested outside the confirmed itinerary;  \n- Any other item, upgrade, or service not specifically documented as an inclusion.",
      },
      {
        number: "5",
        title: "Substitutions & Service Level",
        text: "Where a listed inclusion (such as a specific hotel, vehicle type, or activity access) becomes unavailable due to operational reasons, JVTO may:\n\n- Provide an alternative of **equal or higher overall standard**; or  \n- Adjust logistics while preserving the core value and intent of the experience.\n\nSuch substitutions do not entitle guests to refunds where the service level is reasonably maintained.",
      },
      {
        number: "6",
        title: "Relationship with Other JVTO Documents",
        text: "This Inclusions & Exclusions Policy must be read together with:\n\n- JVTO Booking, Payment & Cancellation Policy;  \n- JVTO Official Booking Guide — How to Book;  \n- JVTO Privacy & Data Protection Policy;  \n- Your Official E-Voucher / Invoice.\n\nIn the event of any apparent inconsistency:\n\n1. The specific inclusions/exclusions on your Official E-Voucher / Invoice take precedence;  \n2. Then this Inclusions & Exclusions Policy;  \n3. Then any general website or marketing materials.\n\nThis document is an official corporate policy of PT Java Volcano Rendezvous (Java Volcano Tour Operator) and serves as the definitive reference for what is and is not included in JVTO private tour packages.",
      },
    ],
  },
};

export const metadata: Metadata = {
  title: policyData.inclusionsExclusionsPolicy.documentTitle,
  description:
    "Official Inclusions & Exclusions Policy for Java Volcano Tour Operator (JVTO).",
};

export default function InclusionsExclusionsPolicyPage() {
  const { inclusionsExclusionsPolicy: policy } = policyData;

  const renderText = (text: string) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const linkRegex =
      /(JVTO Booking, Payment & Cancellation Policy|JVTO Privacy & Data Protection Policy)/g;

    const parts = text.split(linkRegex);
    const elements: React.ReactNode[] = [];

    parts.forEach((part, index) => {
      const boldParts = part.split(boldRegex);
      boldParts.forEach((boldPart, boldIndex) => {
        if (boldIndex % 2 === 1) {
          elements.push(
            <strong key={`${index}-${boldIndex}`}>{boldPart}</strong>
          );
        } else {
          elements.push(boldPart);
        }
      });

      if (index < parts.length - 1) {
        const linkPart = parts[index + 1];
        if (linkPart === "JVTO Booking, Payment & Cancellation Policy") {
          elements.push(
            <Link
              key={`link-${index}`}
              href="/policy/booking-cancellation"
              className="text-primary hover:underline"
            >
              {linkPart}
            </Link>
          );
        } else if (linkPart === "JVTO Privacy & Data Protection Policy") {
          elements.push(
            <Link
              key={`link-${index}`}
              href="/travel-guide/privacy-policy"
              className="text-primary hover:underline"
            >
              {linkPart}
            </Link>
          );
        }
      }
    });

    return (
      <div className="whitespace-pre-line">
        {elements.filter(
          (el, i) =>
            !(
              typeof el === "string" &&
              /^(JVTO Booking, Payment & Cancellation Policy|JVTO Privacy & Data Protection Policy)$/.test(
                el
              )
            )
        )}
      </div>
    );
  };

  const renderSectionText = (text: string) => {
    return text.split("\n\n").map((paragraph, pIndex) => {
      if (paragraph.startsWith("###")) {
        return (
          <h3
            key={pIndex}
            className="text-xl font-bold mt-6 mb-2 text-foreground"
          >
            {paragraph.replace("### ", "")}
          </h3>
        );
      }
      if (paragraph.startsWith("- ")) {
        const items = text.split("\n").filter((line) => line.startsWith("- "));
        if (pIndex > 0 && text.split("\n\n")[pIndex - 1].startsWith("- "))
          return null;
        return (
          <ul key={pIndex} className="list-disc pl-5 space-y-2">
            {items.map((item, i) => {
              const boldRegex = /\*\*(.*?)\*\*/g;
              const subItems = item.split("\n  -");
              const mainItem = subItems[0].replace(/- /, "");
              return (
                <li key={i}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: mainItem.replace(
                        boldRegex,
                        "<strong>$1</strong>"
                      ),
                    }}
                  />
                  {subItems.length > 1 && (
                    <ul className="list-disc pl-5 mt-2">
                      {subItems.slice(1).map((subItem, j) => (
                        <li
                          key={j}
                          dangerouslySetInnerHTML={{
                            __html: subItem
                              .replace(/^- /, "")
                              .replace(boldRegex, "<strong>$1</strong>"),
                          }}
                        />
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        );
      }
      if (/^\d+\./.test(paragraph)) {
        const items = text.split("\n").filter((line) => /^\d+\./.test(line));
        if (pIndex > 0 && /^\d+\./.test(text.split("\n\n")[pIndex - 1]))
          return null;
        return (
          <ol key={pIndex} className="list-decimal pl-5 space-y-2">
            {items.map((item, i) => {
              const boldRegex = /\*\*(.*?)\*\*/g;
              return (
                <li
                  key={i}
                  dangerouslySetInnerHTML={{
                    __html: item
                      .replace(/^\d+\. /, "")
                      .replace(boldRegex, "<strong>$1</strong>"),
                  }}
                />
              );
            })}
          </ol>
        );
      }
      return (
        <p
          key={pIndex}
          dangerouslySetInnerHTML={{
            __html: paragraph.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
          }}
        />
      );
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <nav className="mb-8 text-center text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link href="/travel-guide" className="hover:text-primary">
                Travel Guide
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground font-medium">
                Inclusion Exclusion Policy
              </span>
            </nav>

            <div className="text-center mb-12">
              <h1 className="heading-lg">{policy.documentTitle}</h1>
              <p className="mt-4 text-sm text-muted-foreground">
                Last updated: {policy.lastUpdated}
              </p>
            </div>

            <div className="prose prose-lg max-w-none mx-auto text-muted-foreground">
              <p className="border-l-4 border-primary pl-4 italic bg-accent p-4 rounded-r-lg">
                {policy.appliesTo}
              </p>

              <div className="my-8">{renderText(policy.intro)}</div>

              {policy.sections.map((section, index) => (
                <div key={index} className="mb-8">
                  <h2 className="heading-md mt-12 mb-4 text-foreground">
                    {section.number}. {section.title}
                  </h2>
                  {renderSectionText(section.text)}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
