import type { HealthScreeningEvidenceItem, NormalizedAsset } from "@/lib/whyjvto/ssot";

function pickVerifyUrl(item: HealthScreeningEvidenceItem): string | undefined {
  return item.verification_url || (Array.isArray(item.verification_urls) ? item.verification_urls[0] : undefined);
}

export default function HealthScreeningSpotlight({
  bundleTitle,
  evidenceItems,
  assetsIndex,
  proofLeafHref,
}: {
  bundleTitle: string;
  evidenceItems: HealthScreeningEvidenceItem[];
  assetsIndex: Map<string, NormalizedAsset>;
  proofLeafHref: string;
}) {
  // “Micro-cards” strategy: take up to 4 strongest evidence items in SSOT order.
  const micro = evidenceItems.slice(0, 4).map((it) => {
    const verifyUrl = pickVerifyUrl(it);
    const slugs = Array.isArray(it.evidence_asset_slugs) ? it.evidence_asset_slugs : [];
    const previews = slugs
      .map((slug) => assetsIndex.get(slug))
      .filter(Boolean) as NormalizedAsset[];
    return { it, verifyUrl, previews };
  });

  return (
    <section className="rounded-2xl border p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{bundleTitle}</h2>
          <p className="mt-2 text-sm text-neutral-700">
            Official requirement + verifiable medical authority + proof output.
          </p>
        </div>
        <div className="flex gap-2">
          <a className="rounded-xl border px-3 py-2 text-sm" href={proofLeafHref}>
            View screening proof
          </a>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {micro.map(({ it, verifyUrl, previews }, idx) => (
          <div key={idx} className="rounded-2xl border p-5">
            <div className="text-sm font-semibold">{it.title ?? "Evidence"}</div>
            {it.claim ? <p className="mt-2 text-sm text-neutral-700">{it.claim}</p> : null}

            <div className="mt-4 flex flex-wrap gap-2">
              {verifyUrl ? (
                <a className="rounded-xl bg-black px-3 py-2 text-sm text-white" href={verifyUrl} target="_blank" rel="noreferrer">
                  Verify official source
                </a>
              ) : null}
              <a className="rounded-xl border px-3 py-2 text-sm" href={proofLeafHref}>
                Open evidence library
              </a>
            </div>

            {/* Published-only previews (assetsIndex already filtered) */}
            {previews.length ? (
              <div className="mt-4 space-y-2">
                {previews.slice(0, 3).map((a) => (
                  <a
                    key={a.id}
                    className="block rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50"
                    href={a.primary_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {a.title}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}