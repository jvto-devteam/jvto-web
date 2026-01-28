import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import AuthorityShield from "@/components/why/AuthorityShield";
import {
  ButtonLink,
  Container,
  Divider,
  Faq,
  Grid,
  H1,
  Lead,
  Card,
  Section,
} from "@/components/ui";
import {
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  buildWebPageJsonLd,
} from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Our Story — JVTO",
  description:
    "A mission of trust, protection, and local empowerment. Timeline, operating model (DMC), and how the story supports the brand promise.",
};

export default function OurStoryPage() {
  const pathname = "/why-jvto/our-story";

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
        { name: "Our Story", path: "/why-jvto/our-story" },
      ],
    }),
  ];

  // Text preserved from: our-story.docx.pdf (as extracted)
  const openingSummary = [
    "Java Volcano Tour Operator (JVTO) was not conceived in a boardroom but on the ground — born as a direct response to safety and transparency challenges facing travelers in East Java.",
    "The founder, Mr. Sam, leveraged his unique background as an active officer in the Tourist Police Unit to build an operation anchored on one core principle: protection.",
    "What began as a local homestay committed to fair pricing has evolved into a leading tour operator with a dual mission: to provide authentic, secure experiences while empowering the local community.",
  ];

  const timeline = [
    {
      year: "2015 — Pioneering Fairness in Tourism",
      text: "Mr. Sam founded Ijen Bondowoso Homestay and introduced fair-priced transport services to address grievances of foreign tourists, setting a new standard for the region.",
    },
    {
      year: "2016 — Trailblazing Travel Experiences",
      text: "In 2016 Mr. Sam established Java Volcano Tour Operator, designing meticulously crafted travel services with a specialized emphasis on Student and Youth Tour Packages, positioning the company as a trailblazer in the area.",
    },
    {
      year: "2017 — Innovation and Excellence",
      text: "JVTO entered a phase of expansion and innovation; Mr. Sam produced diverse and unique tour packages that broadened the company’s offerings.",
    },
    {
      year: "2019 — Legal Fortification and Growth",
      text: "The formal establishment of JVTO as a PT (Limited Company) reinforced legal standing and signaled readiness to compete at a larger scale.",
    },
    {
      year: "2022 — Ambitious Expansion and Vision",
      text: "A partnership between ISIC, INDECON, HPWKI led to the further strengthening Java Volcano Tour Operator’s position as a leading force in East Java tourism.",
    },
  ];

  const dmcFunctions = [
    "Local Expertise",
    "Event Planning and Coordination",
    "Tour Operations",
    "Transportation Management",
    "Supplier Negotiation",
    "Risk Management",
    "Creative Services",
    "On-Site Coordination.",
  ];

  const brandPromiseSupport = [
    {
      q: "Emotional foundation",
      a: "The timeline and founder background create emotional trust by showing the company’s grassroots origins and personal commitment to protection.",
    },
    {
      q: "Logical foundation",
      a: "Legal registration and licensing provide objective proof of legitimacy and compliance.",
    },
    {
      q: "Community impact",
      a: "Staffing and operational choices intentionally prioritize local employment and capacity building, linking customer choices directly to community benefits.",
    },
  ];

  return (
    <Container>
      <JsonLd data={jsonLd} />

      <H1>Our Story — A Mission of Trust, Protection, and Local Empowerment</H1>
      <Lead>
        A single narrative spine: from local ground-truth operations to a
        structured, proof-backed operator model.
      </Lead>

      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/why-jvto/the-jvto-difference">
          Read “The JVTO Difference”
        </ButtonLink>
        <ButtonLink
          variant="secondary"
          href="/why-jvto/proof-transparency/legal/"
        >
          Verify legality
        </ButtonLink>
      </div>

      <AuthorityShield />

      <Divider />

      <Section title="Opening summary">
        {openingSummary.map((p, i) => (
          <p key={i} className="text-sm leading-6 text-neutral-700">
            {p}
          </p>
        ))}
      </Section>

      <Section title="Chronology of Trust and Growth — Milestone History">
        <Grid>
          {timeline.map((t, i) => (
            <Card key={i} title={t.year}>
              {t.text}
            </Card>
          ))}
        </Grid>
      </Section>

      <Section title="What JVTO Is: A Local DMC (Destination Management Company)">
        <p className="text-sm leading-6 text-neutral-700">
          JVTO operates as a Destination Management Company (DMC) — a
          professional services firm that specializes in designing and
          implementing events, activities, tours, transportation, and program
          logistics within a destination.
        </p>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="text-sm font-semibold">
            Key DMC functions listed in the source:
          </div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
            {dmcFunctions.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="Our Enduring Mission">
        <p className="text-sm leading-6 text-neutral-700">
          JVTO’s core mission is summarized as “Empowering Through Tourism.”
          This mission arises from the founder’s conviction that tourism should
          benefit East Java’s local communities.
        </p>
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
          <div className="text-sm font-semibold">
            Founder pledge (as stated in the source)
          </div>
          <div className="mt-2 text-sm leading-6 text-neutral-700">
            “We protect and guide you because our founder did this as his
            official duty.”
          </div>
        </div>
      </Section>

      <Section title="How this story supports the brand promise">
        <Faq items={brandPromiseSupport} />
      </Section>

      <Divider />

      <Section title="Next steps inside the Why JVTO ecosystem">
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/why-jvto/proof-transparency/">
            Proof Library (start here)
          </ButtonLink>
          <ButtonLink variant="secondary" href="/why-jvto/our-team">
            Meet the team
          </ButtonLink>
          <ButtonLink variant="secondary" href="/why-jvto/reviews">
            Guest voices
          </ButtonLink>
        </div>
      </Section>
    </Container>
  );
}
