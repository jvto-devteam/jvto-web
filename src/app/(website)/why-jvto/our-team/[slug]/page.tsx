// app/(website)/why-jvto/our-team/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/website/AppLink";
import { Globe, ShieldCheck, Star, Instagram, Facebook } from "lucide-react";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import {
  getPublicCrewByCode,
  getPublicCrewCodes,
} from "@/lib/people/canonicalPeople";
import { crewJobTitle, buildTeamProfileSchema } from "@/lib/schemas/buildTeamSchemas";
import { getCrewFeaturedReviews } from "@/lib/people/crewReviews";
import { getWhyJvtoOptimizedImageSrc } from "@/lib/assets/whyJvtoImageVariants";
import { loadEcosystemPage, staticRouteCanonical } from "@/lib/ecosystemContent/staticPageAdapter";

const WHY_JVTO_NAV = [
  { href: "/why-jvto", label: "Why JVTO overview" },
  { href: "/why-jvto/the-jvto-difference", label: "The JVTO Difference" },
  { href: "/why-jvto/reviews", label: "Reviews" },
  { href: "/why-jvto/our-story", label: "Our Story" },
  { href: "/why-jvto/our-team", label: "Our Team" },
  { href: "/why-jvto/community-standards", label: "Community Standards" },
];

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const codes = await getPublicCrewCodes();
  return codes.map((slug) => ({ slug }));
}

/** Bio fields (about/phone/social/highlights/photo_url) live in the why-jvto
 * content file, not the canonical people record. Matched by first-name slug —
 * the same convention jvto-ekosistem people-and-crew/people.json's `code` field already uses. */
async function getCrewBio(slug: string) {
  const page = await loadEcosystemPage("/why-jvto/our-team");
  if (!page || page.format !== "structured") return null;
  for (const section of page.sections ?? []) {
    for (const block of (section as any).blocks ?? []) {
      if (block.type !== "crew_grid") continue;
      const item = (block.items as any[]).find(
        (m) => m.name.trim().toLowerCase().split(/\s+/)[0] === slug,
      );
      if (item) return item as {
        about?: string | null;
        phone?: string | null;
        facebook?: string | null;
        instagram?: string | null;
        highlights?: string[];
        photo_url?: string | null;
      };
    }
  }
  return null;
}

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

function Stars({ count }: { count: number }) {
  return (
    <span className="inline-flex gap-0.5 text-[#F5A623]" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} fill={i < count ? "currentColor" : "none"} strokeWidth={i < count ? 0 : 1.5} />
      ))}
    </span>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = await getPublicCrewByCode(slug);
  if (!member) return { title: "Team Member Not Found" };
  const page = await loadEcosystemPage(`/why-jvto/our-team/${slug}`);
  const jobTitle = crewJobTitle(member.role);
  const title = page?.meta.browserTitle ?? page?.meta.title ?? `${member.name} — JVTO ${jobTitle}`;
  const description =
    page?.meta.description ??
    `${member.name} is a KTA-holding JVTO ${jobTitle.toLowerCase()} for East Java volcano tours (Bromo, Ijen, Tumpak Sewu).`;
  return {
    title,
    description,
    alternates: { canonical: staticRouteCanonical(`/why-jvto/our-team/${slug}`) },
  };
}

export default async function CrewMemberPage({ params }: Props) {
  const { slug } = await params;
  const member = await getPublicCrewByCode(slug);
  if (!member) notFound();

  const ecosystemPage = await loadEcosystemPage(`/why-jvto/our-team/${slug}`);
  const bio = await getCrewBio(slug);
  const reviews = getCrewFeaturedReviews(slug);
  const jobTitle = crewJobTitle(member.role);
  const route = `/why-jvto/our-team/${slug}`;
  const photo = bio?.photo_url ? getWhyJvtoOptimizedImageSrc(bio.photo_url) ?? bio.photo_url : member.image?.src;

  const pageRow = {
    route,
    lang: "en",
    seo: {
      title: ecosystemPage?.meta.title ?? `${member.name} — JVTO ${jobTitle}`,
      description: ecosystemPage?.meta.description,
    },
    content: { h1: ecosystemPage?.meta.title ?? member.name },
  };

  return (
    <>
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[buildTeamProfileSchema(member)]}
        suppressCmsFaq
      />

      {/* ── Hero — navy ───────────────────────────────────────────────── */}
      <header className="bg-jvto-navy pt-24 md:pt-36 pb-32 md:pb-44 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25 bg-cover bg-center"
          style={{ backgroundImage: "url(https://javavolcano-touroperator.com/assets/img/hero/home.webp)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-jvto-navy/70" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-8">
          <nav className="mb-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            <Link href="/" prefetch={false} className="hover:text-white/70 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/why-jvto" prefetch={false} className="hover:text-white/70 transition-colors">Why JVTO</Link>
            <span>›</span>
            <Link href="/why-jvto/our-team" prefetch={false} className="hover:text-white/70 transition-colors">Our Team</Link>
            <span>›</span>
            <span className="text-white/70">{member.name}</span>
          </nav>
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Why JVTO · Our Team
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  {jobTitle}
                </span>
              </div>
              <h1
                className="text-4xl md:text-[3.75rem] font-black text-white leading-[0.98] mb-6"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                {member.name}
              </h1>
              {bio?.about && (
                <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">{bio.about}</p>
              )}
            </div>
            <div className="flex items-center gap-5 md:mt-10">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-white/10 border-2 border-white/20 flex-shrink-0">
                {photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo} alt={member.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="bg-white/[0.04] border border-white/10 rounded-[16px] p-4 flex flex-col gap-1.5">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#8CC63F]">
                  <ShieldCheck size={12} /> KTA {member.kta.credentialState}
                </span>
                <span className="text-white/70 text-[12px] flex items-center gap-1.5">
                  <Globe size={12} /> {member.languages.join(", ")}
                </span>
                {(bio?.instagram || bio?.facebook) && (
                  <span className="flex gap-2 mt-1">
                    {bio.instagram && (
                      <a href={bio.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${member.name}`} className="text-white/70 hover:text-white">
                        <Instagram size={15} />
                      </a>
                    )}
                    {bio.facebook && (
                      <a href={bio.facebook} target="_blank" rel="noopener noreferrer" aria-label={`Facebook ${member.name}`} className="text-white/70 hover:text-white">
                        <Facebook size={15} />
                      </a>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Article section — off-white ───────────────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-16 md:py-24 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[2]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.07)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 md:gap-16">
            {/* Sidebar */}
            <aside className="md:sticky md:top-28 md:self-start">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-4">
                Why JVTO
              </p>
              <nav className="space-y-0.5">
                {WHY_JVTO_NAV.map(({ href, label }) => {
                  const isActive = href === "/why-jvto/our-team";
                  return (
                    <Link
                      key={href}
                      href={href}
                      prefetch={false}
                      className={`block text-[13px] font-medium py-2 px-3 rounded-lg transition-colors ${
                        isActive ? "bg-jvto-navy text-white" : "text-[#6b7280] hover:text-jvto-navy hover:bg-white"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
              <Link
                href="/verify-jvto"
                prefetch={false}
                className="inline-flex items-center gap-1.5 mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                Open proof library <ArrowRight />
              </Link>
            </aside>

            <div className="min-w-0">
              {/* Specialties + highlights */}
              {(member.specialties.length > 0 || (bio?.highlights?.length ?? 0) > 0) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {member.specialties.map((s) => (
                    <span key={s} className="text-xs px-3 py-1 bg-white border border-[#E3E0DA] rounded-full text-jvto-navy font-medium">{s}</span>
                  ))}
                  {bio?.highlights?.map((h) => (
                    <span key={h} className="text-xs px-3 py-1 bg-white border border-[#E3E0DA] rounded-full text-[#6b7280]">{h}</span>
                  ))}
                </div>
              )}

              {/* KTA membership credential */}
              <div className="bg-white border border-[#E3E0DA] border-l-[3px] border-l-jvto-lime rounded-[12px] px-6 py-5 mb-10">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-jvto-orange block mb-2">
                  {member.kta.credentialType} — {member.kta.credentialState}
                </span>
                <p className="text-[14px] text-jvto-navy font-light leading-relaxed">
                  Issued by {member.kta.issuer}, supervised by BBKSDA Jawa Timur. This is a membership credential, not a government licence.
                </p>
              </div>

              {/* Featured reviews */}
              {reviews.length > 0 && (
                <>
                  <h2
                    className="font-black text-jvto-navy mb-2 leading-tight"
                    style={{ fontFamily: "Raleway, Inter, sans-serif", fontSize: "clamp(22px, 3vw, 34px)", letterSpacing: "-0.02em" }}
                  >
                    Reviews naming {member.name}
                  </h2>
                  <p className="text-[#6b7280] text-[15px] font-light leading-relaxed mb-8 max-w-[62ch]">
                    Guest reviews from Google that specifically mention {member.name} by name, with the original guest media.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                    {reviews.map((r) => (
                      <div key={r.reviewId} className="bg-white border border-[#E3E0DA] rounded-xl p-6 flex flex-col gap-2" style={{ boxShadow: "0 1px 8px 0 rgba(13,27,42,0.06)" }}>
                        <div className="flex items-center justify-between">
                          <Stars count={r.star} />
                          <span className="text-[11px] text-[#9ca3af] font-mono">{r.date}</span>
                        </div>
                        <p className="text-[14.5px] text-jvto-navy leading-relaxed">&ldquo;{r.reviewExcerpt}&rdquo;</p>
                        <div className="text-[13px] text-[#6b7280]">
                          — {r.reviewerName}
                          {r.package && (
                            <>
                              {" · "}
                              <Link href={`/${r.package.slug}`} prefetch={false} className="text-jvto-orange border-b border-current">
                                {r.package.name}
                              </Link>
                            </>
                          )}
                        </div>
                        {r.media.length > 0 && (
                          <div className="grid grid-cols-4 gap-1.5 mt-1">
                            {r.media.slice(0, 4).map((m) => {
                              const src = m.thumbnailUrl || m.videoUrl;
                              if (!src) return null;
                              return (
                                <div key={m.id} className="relative aspect-square rounded-lg overflow-hidden bg-[#F6F5F2]">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={src}
                                    alt={m.thumbnailLabel || `Guest photo — review for ${member.name}`}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover"
                                  />
                                  {m.type === "video" && (
                                    <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-bold uppercase rounded-full px-1.5 py-0.5">Video</div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {r.originalReviewUrl && (
                          <a href={r.originalReviewUrl} target="_blank" rel="noopener noreferrer" className="text-jvto-orange text-[12px] font-semibold border-b border-jvto-orange/40 hover:border-jvto-orange transition-colors self-start">
                            View on Google →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Cross-cluster links */}
              <div className="border-t border-[#E3E0DA] pt-6 flex flex-wrap gap-4 text-sm">
                <Link href="/why-jvto/our-team" prefetch={false} className="text-jvto-orange border-b border-current hover:opacity-75 transition-opacity">Full team overview →</Link>
                <Link href="/why-jvto/reviews" prefetch={false} className="text-jvto-orange border-b border-current hover:opacity-75 transition-opacity">All reviews →</Link>
                <Link href="/tours" prefetch={false} className="text-jvto-orange border-b border-current hover:opacity-75 transition-opacity">Book a tour →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA — navy ────────────────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-white leading-[1.02] mb-8"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            Real people. <span className="text-jvto-orange">Real credentials.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/why-jvto/reviews"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-jvto-orange text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-[#C4520A] transition-colors"
            >
              Read their reviews <ArrowRight />
            </Link>
            <Link
              href="/tours"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-white/10 transition-colors"
            >
              Book a tour
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
