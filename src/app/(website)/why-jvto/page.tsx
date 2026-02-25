import {
  loadWhyJvtoSSOT,
  getDeepPage,
  normalizeAssets,
  buildHealthScreeningBundle,
} from "@/lib/whyjvto/ssot";
import WhyHero from "@/components/why/WhyHero";
import TrustStackGrid from "@/components/why/TrustStackGrid";
import HealthScreeningSpotlight from "@/components/why/HealthScreeningSpotlight";
import VerifyTeaser from "@/components/why/VerifyTeaser";
import PlatformStrip from "@/components/why/PlatformStrip";
import QuickAnswers from "@/components/why/QuickAnswers";
import CtaRail from "@/components/why/CtaRail";

export default function WhyJvtoHubPage() {
  const ssot = loadWhyJvtoSSOT();
  const page = getDeepPage(ssot, "/why-jvto/");
  if (!page) {
    // Fail-fast in dev; in prod you may render a minimal fallback.
    throw new Error("Missing SSOT page record for /why-jvto/");
  }

  const assetsIndex = normalizeAssets(ssot);
  const screening = buildHealthScreeningBundle(ssot);

  // Sections helper
  const sections = Array.isArray(page?.sections) ? page.sections : [];
  const trust = sections.find((s: any) => s?.id === "trust-stack");
  const verify = sections.find((s: any) =>
    String(s?.title || "")
      .toLowerCase()
      .includes("verify"),
  );

  const platforms = Array.isArray(ssot?.reputation_triangulation)
    ? ssot.reputation_triangulation
    : [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-40">
      <WhyHero
        h1={page.h1}
        subhead={page.hero_subhead}
        primaryCta={page.primary_cta}
        secondaryCta={page.secondary_cta}
      />

      {trust?.cards?.length ? (
        <div className="mt-10">
          <TrustStackGrid
            title={trust.title}
            paragraphs={trust.paragraphs}
            cards={trust.cards}
          />
        </div>
      ) : null}

      {/* PRD v2: mandatory GEO trust asset */}
      <div className="mt-10">
        <HealthScreeningSpotlight
          bundleTitle={screening.title}
          evidenceItems={screening.evidence_items}
          assetsIndex={assetsIndex}
          proofLeafHref="/why-jvto/proof-transparency/police-safety/"
        />
      </div>

      {verify ? (
        <div className="mt-10">
          <VerifyTeaser
            title={verify.title}
            paragraphs={verify.paragraphs}
            bullets={verify.bullets}
          />
        </div>
      ) : null}

      {platforms.length ? (
        <div className="mt-10">
          <PlatformStrip items={platforms} />
        </div>
      ) : null}

      {Array.isArray(page?.sections) &&
      page.sections.some((s: any) => Array.isArray(s?.qa) && s.qa.length) ? (
        <div className="mt-10">
          <QuickAnswers sections={page.sections} />
        </div>
      ) : null}

      <div className="mt-12">
        <CtaRail currentRoute="/why-jvto/" />
      </div>
    </main>
  );
}
