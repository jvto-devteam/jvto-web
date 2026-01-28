import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import {
  ButtonLink,
  Container,
  Divider,
  Grid,
  Grid3,
  H1,
  Lead,
  Card,
  Section,
  Notice,
} from "@/components/ui";
import {
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  buildWebPageJsonLd,
} from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "The JVTO Difference — Three Pillars of Unrivaled Trust",
  description:
    "Consolidated narrative: protection & legitimacy, no hidden fees, and local DMC execution. Includes safety gear, transport configs, accommodation rules, and Ijen health certificate service details.",
};

export default function DifferencePage() {
  const pathname = "/why-jvto/the-jvto-difference";

  const jsonLd = [
    buildOrganizationJsonLd(),
    buildWebPageJsonLd({
      pathname,
      title: metadata.title as string,
      description: metadata.description as string,
    }),
    buildBreadcrumbJsonLd({
      pathname,
      items: [
        { name: "Home", path: "/" },
        { name: "Why JVTO", path: "/why-jvto/" },
        { name: "The JVTO Difference", path: "/why-jvto/the-jvto-difference" },
      ],
    }),
  ];

  // Extracted from: the-jvto-difference.docx.pdf (kept as-is in meaning/data)
  const pillars = [
    {
      title: "Pillar 1 — Total Protection & Official Legitimacy",
      bullets: [
        "JVTO is a legally established PT (Limited Company) and holds an official Tourism Business Registration License (TDUP) from the Government of the Republic of Indonesia. This verifies compliance, stability, and accountability.",
        "JVTO maintains a brick-and-mortar office in East Java. The physical office serves as an operational hub and a place where clients can visit to discuss travel plans, ask questions, or resolve issues in person.",
        "VVIP Police Escort (premium upgrade): an exclusive upgrade available only to existing volcano tour customers. Benefits include unquestionable security, priority access (optimized routes), and emergency response capability. Named security officers include SONNY and ROCKY.",
        "Complimentary Police Escort (large groups): provided at no additional cost for large groups; generally offered for groups of 20 passengers and above to improve traffic flow and logistics.",
      ],
    },
    {
      title: "Pillar 2 — Transparency, No Hidden Fees",
      bullets: [
        "JVTO enforces a No Hidden Costs policy. Quoted prices include essential items so customers know exactly what they pay for.",
        "All park entrance fees (e.g., Bromo, Ijen) with no weekend surcharges.",
        "Mandatory safety equipment (gas masks, trekking poles) and Ijen Volcano Health Certificate Service (Regulatory Compliance & JVTO Offerings)",
        "All ground logistics: private transport, accommodation, tolls, and parking.",
        "Complimentary mineral water and travel T-shirts.",
      ],
    },
    {
      title: "Pillar 3 — Local DMC Expertise & Community Empowerment",
      bullets: [
        "JVTO operates as a DMC with deep local knowledge that enables authentic itineraries and complex logistical management that other operators may not provide.",
        "The team is intentionally staffed by “local boys” from communities near Mount Ijen. JVTO’s founder, Mr. Sam, provides professional training and stable careers for local staff, making these guides both economic beneficiaries and authentic cultural ambassadors.",
        "When customers travel with JVTO, they directly support local livelihoods.",
      ],
    },
  ];

  const transportConfigs = [
    {
      title: "MPV — 1–3 Pax (7 Seat Capacity)",
      text: "Licensed driver, ideal for small groups.",
    },
    {
      title: "Toyota Hiace — 4–9 Pax (16 Seat Capacity)",
      text: "Professional guide, spacious for medium groups.",
    },
    {
      title: "Hiace + MPV — 10–11 Pax (23 Total Seat Capacity)",
      text: "Additional vehicle for larger groups.",
    },
    {
      title: "4WD Jeep (Bromo Access) — 4 Passenger Capacity",
      text: "Specialized for crater access, all-terrain vehicle (ATV).",
    },
  ];

  const accommodationRules = [
    "Included amenities: Daily Breakfast, Air Conditioning, Hot Shower, and Wi-Fi.",
    "Bed options: King beds (couples) or Twin beds (singles/friends).",
    "Room allocation rules: even party sizes receive 1 room per 2 pax (King or Twin); odd party sizes receive 1 room per 2 pax plus 1 extra bed.",
    "Upgrade option: replace an extra bed with a separate room for IDR 275,000 per room per night.",
  ];

  const ijenRegulatory = [
    "Effective date: Starting January 6, 2024, all hikers must present an official health certificate before accessing Ijen Crater Nature Park.",
    "Legal basis: BBKSDA Circular No. SE.35/K2/BIDTEK.1/KSA/1/2024.",
    "Verification point: Certificate checked at the Paltuding Basecamp entrance.",
    "Note on foreign certificates: Foreign health certificates are generally not accepted; certificates must be issued by Indonesian medical professionals or approved local health services.",
  ];

  const ijenService = [
    "The medical checkup fee is included in tour packages.",
    "Professional medical screening performed at the hotel the night before the tour to avoid queues and Paltuding delays. Estimated time ~5 minutes per person.",
    "Recommended booking 24–48 hours in advance (or 3–5 days during peak season: June–August).",
    "Typically between 6–9 PM the evening before the Ijen tour.",
    "Assessment components: vital signs, medical history review, physical fitness evaluation, cardiovascular check (blood pressure, heart rate), and respiratory function (lung check, important for sulfur gas exposure).",
    "Medical risk exclusions: Severe heart disease, uncontrolled asthma, severe respiratory conditions, or uncontrolled high blood pressure may prevent certification. If serious conditions are found, JVTO will advise against the hike.",
    "Required items for check: passport or ID card, current medications, and records of existing medical conditions (especially heart or respiratory issues).",
    "Consequences of no certificate: long waiting times, risk of missing the blue flame viewing, or potential entry denial at Paltuding checkpoint.",
  ];

  return (
    <Container>
      <JsonLd data={jsonLd} />

      <H1>The JVTO Difference: Three Pillars of Unrivaled Trust.</H1>
      <Lead>
        In a travel market crowded with virtual operators and hidden costs, JVTO
        provides tangible proof of commitment to safety, financial transparency,
        and community impact.
      </Lead>

      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/why-jvto/proof-transparency/">
          Open Proof Library
        </ButtonLink>
        <ButtonLink
          variant="secondary"
          href="/travel-guide/ijen-health-screening"
        >
          Ijen health screening (digital innovation)
        </ButtonLink>
      </div>

      <Divider />

      <Section title="The three pillars">
        <Grid>
          {pillars.map((p, i) => (
            <Card key={i} title={p.title}>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                {p.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section title="All-Inclusive Features and Details">
        <Grid3>
          <Card title="Safety gear (included)">
            Trekking pole — stability support for hikes. Medical aid kit — basic
            first aid supplies. Gas mask — protection against volcanic fumes
            (noted specifically for Ijen Crater).
          </Card>
          <Card title="Entrance fees (included)">
            All entrance/admission fees to included destinations are covered by
            JVTO (weekdays, weekends, public holidays as listed).
          </Card>
          <Card title="Travel T-shirt (included)">
            High-quality cotton blend, breathable and comfortable for tropical
            trekking; regular fit (sizing up suggested for looser fit). Sizes XS
            → XXL; size preference collected during booking.
          </Card>
        </Grid3>
      </Section>

      <Section title="Transportation — Vehicle Configurations (as listed)">
        <Grid>
          {transportConfigs.map((c, i) => (
            <Card key={i} title={c.title}>
              {c.text}
            </Card>
          ))}
        </Grid>
      </Section>

      <Section title="Accommodation (standards & upgrade)">
        <Card>
          <ul className="list-disc space-y-2 pl-5">
            {accommodationRules.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </Card>
      </Section>

      <Section title="Ijen Volcano Health Certificate Service (Regulatory Compliance & JVTO Offerings)">
        <Notice title="Official Requirement (regulation)">
          <ul className="mt-2 list-disc space-y-2 pl-5">
            {ijenRegulatory.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </Notice>

        <Notice title="JVTO’s Hotel Health Check Service (what JVTO provides)">
          <ul className="mt-2 list-disc space-y-2 pl-5">
            {ijenService.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </Notice>

        <div className="mt-4 flex flex-wrap gap-3">
          <ButtonLink href="/travel-guide/ijen-health-screening">
            See the digital screening page
          </ButtonLink>
          <ButtonLink
            variant="secondary"
            href="/why-jvto/proof-transparency/police-safety/"
          >
            Police & safety proof
          </ButtonLink>
        </div>
      </Section>
    </Container>
  );
}
