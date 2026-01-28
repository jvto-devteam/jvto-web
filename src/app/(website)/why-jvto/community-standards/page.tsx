import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import {
  ButtonLink,
  Container,
  Divider,
  Grid,
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
  title: "Community Standards — JVTO",
  description:
    "Practical standards that keep trips respectful, safer, and more sustainable: small groups, refill-first water, waste carry-out, and fair local suppliers.",
};

export default function CommunityStandardsPage() {
  const pathname = "/why-jvto/community-standards";

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
        { name: "Community Standards", path: "/why-jvto/community-standards" },
      ],
    }),
  ];

  const standards = [
    {
      title: "Indecon membership context",
      text: "Community standards are reinforced by external sustainability context and networks (see Strategic Partners).",
    },
    {
      title: "Refill-first water",
      text: "Prioritize refill and practical hydration planning to reduce single-use waste where feasible.",
    },
    {
      title: "Waste carry-out",
      text: "If it goes in, it comes out. We keep the route cleaner than we found it.",
    },
    {
      title: "Small groups",
      text: "Smaller groups reduce friction, improve decision-making speed, and limit impact on sensitive areas.",
    },
    {
      title: "Fair local suppliers",
      text: "Local suppliers are selected for reliability and fairness — pricing and treatment are part of the standard.",
    },
  ];

  return (
    <Container>
      <JsonLd data={jsonLd} />

      <H1>Community Standards</H1>
      <Lead>
        Simple rules that reduce friction and protect the destination.
        Practical, not performative.
      </Lead>

      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/why-jvto/strategic-partners">
          Strategic partners
        </ButtonLink>
        <ButtonLink variant="secondary" href="/why-jvto/proof-transparency/">
          Proof Library
        </ButtonLink>
      </div>

      <Divider />

      <Section title="Standards we operate by">
        <Grid>
          {standards.map((s, i) => (
            <Card key={i} title={s.title}>
              {s.text}
            </Card>
          ))}
        </Grid>
      </Section>

      <Section title="Where this fits in the ecosystem">
        <Notice title="Navigation">
          <div className="mt-2 flex flex-wrap gap-3">
            <a className="underline underline-offset-4" href="/why-jvto/">
              Back to Why JVTO hub →
            </a>
            <a
              className="underline underline-offset-4"
              href="/why-jvto/strategic-partners"
            >
              Partners & verification layer →
            </a>
          </div>
        </Notice>
      </Section>
    </Container>
  );
}
