import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { ButtonLink, Container, Divider, Grid, H1, Lead, Card, Section, Notice } from "@/components/ui";
import { buildBreadcrumbJsonLd, buildItemListJsonLd, buildOrganizationJsonLd, buildWebPageJsonLd } from "@/lib/jsonld";
import { getReviewPlatforms } from "@/lib/why-ssot";

export const metadata: Metadata = {
  title: "Reviews — Guest Voices (Independently Verified)",
  description: "External platforms and real guest voices. Centralized, easy to verify, and not hidden inside marketing copy.",
};

export default function ReviewsPage() {
  const pathname = "/why-jvto/reviews";
  const platforms = getReviewPlatforms();

  const jsonLd = [
    buildOrganizationJsonLd(),
    buildWebPageJsonLd({ pathname, title: metadata.title as string, description: metadata.description as string }),
    buildItemListJsonLd({
      pathname,
      title: "Review platforms",
      items: platforms.map((p) => ({ name: p.platform, url: p.url })),
    }),
    buildBreadcrumbJsonLd({
      pathname,
      items: [
        { name: "Home", path: "/" },
        { name: "Why JVTO", path: "/why-jvto/" },
        { name: "Reviews", path: "/why-jvto/reviews" },
      ],
    }),
  ];

  return (
    <Container>
      <JsonLd data={jsonLd} />

      <H1>Guest Voices: Real Experiences, Independently Verified</H1>
      <Lead>We keep reviews easy to verify. We do not ask you to trust screenshots alone.</Lead>

      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/why-jvto/proof-transparency/">Open Proof Library</ButtonLink>
        <ButtonLink variant="secondary" href="/why-jvto/our-team">
          Meet the team
        </ButtonLink>
      </div>

      <Divider />

      <Section title="External review platforms (from SSOT)">
        <Grid>
          {platforms.map((p, i) => (
            <Card key={i} title={p.platform}>
              <a className="break-all underline underline-offset-4" href={p.url} target="_blank" rel="noreferrer">
                {p.url}
              </a>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section title="History-linked recognition">
        <Notice title="Heritage layer (proof-backed)">
          If you want the long history trail (guesthouse-era recognition and guidebook mentions), use:
          <div className="mt-3 flex flex-wrap gap-3">
            <a className="underline underline-offset-4" href="/why-jvto/proof-transparency/history-artifacts/">
              History artifacts proof →
            </a>
            <a className="underline underline-offset-4" href="/why-jvto/press-recognition">
              Press & recognition →
            </a>
          </div>
        </Notice>
      </Section>
    </Container>
  );
}
