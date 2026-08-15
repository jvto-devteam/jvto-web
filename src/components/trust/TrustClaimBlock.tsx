import { getEcosystemTrustClaims } from "@/lib/ecosystemContent/trustClaims";

type Props = {
  heading?: string;
  className?: string;
};

export default async function TrustClaimBlock({
  heading = "Trust Claims",
  className = "",
}: Props) {
  const { claims: trustClaims } = await getEcosystemTrustClaims();
  return (
    <section
      data-trust-block="claims"
      className={`bg-white text-jvto-navy py-12 px-6 md:px-10 ${className}`}
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8">{heading}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trustClaims.map((claim) => {
            const tags = claim.tags ?? [];
            return (
              <article
                key={claim.id}
                className="border border-jvto-navy/10 rounded-lg p-5 bg-jvto-off"
              >
                <header className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-semibold text-jvto-navy">
                    {claim.name}
                  </h3>
                  <span className="text-xs text-jvto-navy/50 font-mono">
                    {claim.id}
                  </span>
                </header>
                <p className="mt-3 text-sm text-jvto-navy/80">
                  {claim.narrative.short}
                </p>
                <footer className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-jvto-navy/60">
                  <span>Evidence: {claim.evidence.length}</span>
                  <span>Last verified: {claim.last_verified}</span>
                </footer>
                {tags.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <li
                        key={tag}
                        className="text-[11px] uppercase tracking-wide bg-jvto-navy/5 text-jvto-navy/70 rounded px-2 py-0.5"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
