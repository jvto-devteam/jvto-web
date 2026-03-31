import type { Metadata } from "next";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { ButtonLink, Container, Divider, Grid, H1, Lead, Card, Section, Notice } from "@/components/ui";
import { getReviewPlatforms } from "@/lib/why-ssot";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";

const fallbackSeo = {
  title: "ISIC Student Deals — JVTO",
  h1: "ISIC Student Deals",
  description:
    "Student verification and fair pricing context: Alive Verify API handshake concept, and the practical reason JVTO uses it.",
};

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/student-deals/isic", fallbackSeo);
  return buildWebsiteMetadata({
    title: seo.title,
    description: seo.description,
    path: "/student-deals/isic",
    imageAlt: seo.h1,
  });
}

export default async function ISICStudentDealsPage() {
  const seo = await getPageSeo("/student-deals/isic", fallbackSeo);
  const pageRow = seo.row
    ? {
        route: seo.row.route,
        lang: seo.row.lang,
        seo: seo.row.seo,
        content: seo.row.content,
        created_at: seo.row.created_at,
        updated_at: seo.row.updated_at,
      }
    : {
        route: "/student-deals/isic",
        lang: "en",
        seo: {
          title: seo.title,
          description: seo.description,
        },
        content: {
          h1: seo.h1,
        },
      };
  const platforms = getReviewPlatforms();
  const isicListing = platforms.find((p) => p.platform.startsWith("ISIC"))?.url;

  return (
    <Container>
      <PageJsonLdCombined pageRow={pageRow as any} />

      <H1>{seo.h1}</H1>
      <Lead>{seo.description}</Lead>

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
