import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { ButtonLink, Container, Divider, Grid, H1, Lead, Card, Section, Notice } from "@/components/ui";
import { buildBreadcrumbJsonLd, buildOrganizationJsonLd, buildWebPageJsonLd } from "@/lib/jsonld";
import { getReviewPlatforms } from "@/lib/why-ssot";

export const metadata: Metadata = {
  title: "ISIC Student Deals — JVTO",
  description:
    "Student verification and fair pricing context: Alive Verify API handshake concept, and the practical reason JVTO uses it.",
};

export default function ISICStudentDealsPage() {
  const pathname = "/student-deals/isic";
  const platforms = getReviewPlatforms();
  const isicListing = platforms.find((p) => p.platform.startsWith("ISIC"))?.url;

  const jsonLd = [
    buildOrganizationJsonLd(),
    buildWebPageJsonLd({ pathname, title: metadata.title as string, description: metadata.description as string }),
    buildBreadcrumbJsonLd({
      pathname,
      items: [
        { name: "Home", path: "/" },
        { name: "Student Deals", path: "/student-deals" },
        { name: "ISIC", path: "/student-deals/isic" },
      ],
    }),
  ];

  return (
    <Container>
      <JsonLd data={jsonLd} />

      <H1>ISIC Student Deals</H1>
      <Lead>Fair pricing for verified students, designed to be transparent and structured.</Lead>

      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/why-jvto/strategic-partners">Why this partnership exists</ButtonLink>
        <ButtonLink variant="secondary" href="/why-jvto">
          Back to Why JVTO hub
        </ButtonLink>
      </div>

      <Divider />

      <Section title="What ISIC signals (market context)">
        <Card>
          ISIC is positioned as a globally recognized proof of student status. For youth travel and budget-sensitive
          travelers, it acts as a legitimacy and fairness signal.
        </Card>
      </Section>

      <Section title="How verification works (concept)">
        <Notice title="Alive Verify API (as described)">
          When a student enters their card number, the system performs a real-time “handshake” with the global ISIC
          database to validate active status.
        </Notice>
      </Section>

      <Section title="Why it matters in the Why JVTO ecosystem">
        <Grid>
          <Card title="Fair pricing, structurally enforced">
            Student pricing is not treated as a vague promise. It is structured around verification.
          </Card>
          <Card title="Digital maturity signal">
            Implementing verification via API is positioned as a differentiator versus fully manual operators.
          </Card>
        </Grid>
      </Section>

      {isicListing ? (
        <Section title="Official ISIC listing (direct)">
          <a className="break-all underline underline-offset-4" href={isicListing} target="_blank" rel="noreferrer">
            {isicListing}
          </a>
        </Section>
      ) : null}
    </Container>
  );
}
