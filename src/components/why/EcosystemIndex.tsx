import Link from "next/link";
import { WHY_JVTO_ECOSYSTEM_LINKS } from "@/lib/why-ecosystem";
import { Card, Grid, Section } from "@/components/ui";

const GROUPS: Array<"Core" | "Proof & Transparency" | "Related"> = [
  "Core",
  "Proof & Transparency",
  "Related",
];

export default function EcosystemIndex() {
  return (
    <>
      {GROUPS.map((group) => {
        const items = WHY_JVTO_ECOSYSTEM_LINKS.filter((x) => x.group === group);
        return (
          <Section key={group} title={group === "Core" ? "Why JVTO Ecosystem" : group}>
            <Grid>
              {items.map((it) => (
                <Card key={it.href} title={it.title} href={it.href}>
                  {it.description}
                  <div className="mt-3">
                    <span className="inline-flex rounded-lg bg-neutral-100 px-2 py-1 font-mono text-xs text-neutral-900 ring-1 ring-inset ring-neutral-200">
                      {it.href.endsWith("/") ? it.href : `${it.href}`}
                    </span>
                  </div>
                </Card>
              ))}
            </Grid>

            {/* Optional compact list below cards */}
            <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="text-sm font-semibold text-neutral-900">All links (compact)</div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
                {items.map((it) => (
                  <li key={it.href}>
                    <Link className="underline underline-offset-4" href={it.href}>
                      {it.href}
                    </Link>
                    <span className="text-neutral-500"> — {it.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        );
      })}
    </>
  );
}
