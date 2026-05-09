// @ts-nocheck
import { BulletLinks, Card, Grid, Section } from "@/components/ui";
import type { SSOTPage } from "@/lib/why-ssot";

export default function SSOTRenderer({ page }: { page: SSOTPage }) {
  return (
    <>
      {page.intro_paragraphs?.length ? (
        <div className="mt-6 space-y-3 text-sm leading-6 text-neutral-700">
          {page.intro_paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : null}

      {page.sections?.map((s, i) => (
        <Section key={i} title={s.title} id={s.id}>
          {s.paragraphs?.length ? (
            <div className="space-y-3 text-sm leading-6 text-neutral-700">
              {s.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          ) : null}

          {s.bullets?.length ? <BulletLinks items={s.bullets} /> : null}

          {s.cards?.length ? (
            <Grid>
              {s.cards.map((c, k) => (
                <Card key={k} title={c.title} href={c.link}>
                  {c.summary}
                </Card>
              ))}
            </Grid>
          ) : null}
        </Section>
      ))}
    </>
  );
}
