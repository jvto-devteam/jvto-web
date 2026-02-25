type Cta = { label?: string; url?: string };

export default function WhyHero({
  h1,
  subhead,
  primaryCta,
  secondaryCta,
}: {
  h1: string;
  subhead?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
}) {
  return (
    <section className="rounded-2xl border p-6">
      <h1 className="text-3xl font-semibold tracking-tight">{h1}</h1>
      {subhead ? <p className="mt-3 text-base text-neutral-700">{subhead}</p> : null}

      <div className="mt-6 flex flex-wrap gap-3">
        {primaryCta?.url ? (
          <a className="rounded-xl bg-black px-4 py-2 text-white" href={primaryCta.url}>
            {primaryCta.label ?? "Learn more"}
          </a>
        ) : null}

        {secondaryCta?.url ? (
          <a className="rounded-xl border px-4 py-2" href={secondaryCta.url}>
            {secondaryCta.label ?? "Explore"}
          </a>
        ) : null}
      </div>
    </section>
  );
}