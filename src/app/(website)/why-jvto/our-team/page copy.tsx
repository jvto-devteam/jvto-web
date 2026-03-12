import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { ButtonLink, Container, Divider, Grid, H1, Lead, Card, Section } from "@/components/ui";
import { buildBreadcrumbJsonLd, buildItemListJsonLd, buildOrganizationJsonLd, buildWebPageJsonLd } from "@/lib/jsonld";
import { getCrewHighlights } from "@/lib/why-ssot";

export const metadata: Metadata = {
  title: "Our Team — JVTO",
  description: "Meet the local team guests mention: roles, languages, and strengths — tied to reviews and proof pages.",
};

export default function OurTeamPage() {
  const pathname = "/why-jvto/our-team";
  const crew = getCrewHighlights();

  const jsonLd = [
    buildOrganizationJsonLd(),
    buildWebPageJsonLd({ pathname, title: metadata.title as string, description: metadata.description as string }),
    buildItemListJsonLd({
      pathname,
      title: "JVTO team highlights",
      items: crew.map((c) => ({ name: `${c.name} (${c.role})`, url: pathname })),
    }),
    buildBreadcrumbJsonLd({
      pathname,
      items: [
        { name: "Home", path: "/" },
        { name: "Why JVTO", path: "/why-jvto" },
        { name: "Our Team", path: "/why-jvto/our-team" },
      ],
    }),
  ];

  return (
    <Container>
      <JsonLd data={jsonLd} />

      <H1>Our Team</H1>
      <Lead>Local execution, daily discipline. This is the human layer behind operational certainty.</Lead>

      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/why-jvto/reviews">Read guest voices</ButtonLink>
        <ButtonLink variant="secondary" href="/why-jvto/strategic-partners">
          Strategic partners (HPWKI / ISIC / INDECON)
        </ButtonLink>
      </div>

      <Divider />

      <Section title="Team highlights (from SSOT)">
        <Grid>
          {crew.map((c, i) => (
            <Card key={i} title={`${c.name} — ${c.role}`}>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Languages:</span> {c.languages}
                </div>
                <div>
                  <span className="font-semibold">Highlights:</span> {c.highlights}
                </div>
                <div className="pt-2">
                  <a className="text-sm underline underline-offset-4" href="/why-jvto/reviews">
                    See reviews →
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </Grid>
      </Section>
    </Container>
  );
}
