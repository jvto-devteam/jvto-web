// app/(website)/why-jvto/our-team/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/website/AppLink";
import { Home, Globe, ShieldCheck, Star, Instagram, Facebook } from "lucide-react";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import SidebarDesktop from "../../SidebarDesktop";
import { WHY_MENU } from "../../sidebarMenu";
import { WHY_JVTO_STYLES } from "../../whyJvtoTokens";
import {
  getPublicCrewByCode,
  getPublicCrewCodes,
} from "@/lib/people/canonicalPeople";
import { crewJobTitle, buildTeamProfileSchema } from "@/lib/schemas/buildTeamSchemas";
import { getCrewFeaturedReviews } from "@/lib/people/crewReviews";
import { getWhyJvtoOptimizedImageSrc } from "@/lib/assets/whyJvtoImageVariants";
import { loadStaticPage, staticRouteCanonical } from "@/lib/static-content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublicCrewCodes().map((slug) => ({ slug }));
}

/** Bio fields (about/phone/social/highlights/photo_url) live in the why-jvto
 * content file, not the canonical people record. Matched by first-name slug —
 * the same convention content/entities/people.json's `code` field already uses. */
function getCrewBio(slug: string) {
  const page = loadStaticPage("/why-jvto/our-team");
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
      };
    }
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = getPublicCrewByCode(slug);
  if (!member) return { title: "Team Member Not Found" };
  const jobTitle = crewJobTitle(member.role);
  const title = `${member.name} — JVTO ${jobTitle}`;
  const description = `${member.name} is a KTA-holding JVTO ${jobTitle.toLowerCase()} for East Java volcano tours (Bromo, Ijen, Tumpak Sewu).`;
  return {
    title,
    description,
    alternates: { canonical: staticRouteCanonical(`/why-jvto/our-team/${slug}`) },
  };
}

function Stars({ count }: { count: number }) {
  return (
    <span className="jw-stars" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} fill={i < count ? "currentColor" : "none"} strokeWidth={i < count ? 0 : 1.5} />
      ))}
    </span>
  );
}

export default async function CrewMemberPage({ params }: Props) {
  const { slug } = await params;
  const member = getPublicCrewByCode(slug);
  if (!member) notFound();

  const bio = getCrewBio(slug);
  const reviews = getCrewFeaturedReviews(slug);
  const jobTitle = crewJobTitle(member.role);
  const route = `/why-jvto/our-team/${slug}`;

  const pageRow = {
    route,
    lang: "en",
    seo: { title: `${member.name} — JVTO ${jobTitle}` },
    content: {},
  };

  return (
    <>
      <style>{WHY_JVTO_STYLES}</style>

      <div className="jw-root" style={{ display: "flex", minHeight: "100vh", background: "#ffffff" }}>
        <SidebarDesktop currentPath="/why-jvto/our-team" />
        <PageJsonLdCombined
          pageRow={pageRow as any}
          extraSchemas={[buildTeamProfileSchema(member)]}
          suppressCmsFaq
        />

        <main
          className="pt-30 md:pt-40"
          style={{ flex: 1, paddingBottom: "6rem", fontFamily: "'Inter', system-ui, sans-serif", color: "#0D1B2A" }}
        >
          <div className="container mx-auto px-4 max-w-6xl" style={{ margin: "0 auto", padding: "0 1.5rem" }}>
            {/* ── Breadcrumb ── */}
            <nav className="jw-crumbs" style={{ marginTop: 0 }}>
              <Link href="/" prefetch={false}><Home size={13} /></Link>
              <span className="jw-sep">/</span>
              <Link href="/why-jvto" prefetch={false}>Why JVTO</Link>
              <span className="jw-sep">/</span>
              <Link href="/why-jvto/our-team" prefetch={false}>Our Team</Link>
              <span className="jw-sep">/</span>
              <span className="jw-here">{member.name}</span>
            </nav>

            {/* ── Interior hero ── */}
            <header className="jw-hero" style={{ marginBottom: "2.5rem" }}>
              <div className="jw-hero-inner">
                <div className="jw-hero-eyebrow-row">
                  <span className="jw-eyebrow-pill">Our Team</span>
                  <span className="jw-eyebrow-meta">{jobTitle}</span>
                </div>
                <h1 className="jw-hero-h1" style={{ maxWidth: "26ch" }}>{member.name}</h1>
                {bio?.about && <p className="jw-hero-lede">{bio.about}</p>}
              </div>
            </header>

            <div className="jw-article-layout">
              <aside className="jw-article-side hidden md:block">
                <div className="jw-side-label">Why JVTO</div>
                <ul>
                  {WHY_MENU.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        prefetch={false}
                        className={item.href === "/why-jvto/our-team" ? "jw-active" : ""}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/verify-jvto" prefetch={false} className="jw-inline-link">
                  Open proof library →
                </Link>
              </aside>

              <div style={{ minWidth: 0 }}>
                {/* ── Profile section ── */}
                <section style={{ marginBottom: "3.5rem" }}>
                  <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                    <div style={{ width: 96, height: 96, borderRadius: "50%", overflow: "hidden", background: "var(--jw-off)", flexShrink: 0, border: "2px solid var(--jw-border)" }}>
                      {member.image?.src && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getWhyJvtoOptimizedImageSrc(member.image.src) ?? member.image.src}
                          alt={member.image.alt}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 220 }}>
                      {member.specialties.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem", marginBottom: ".75rem" }}>
                          {member.specialties.map((s) => (
                            <span key={s} className="jw-inline-link" style={{ padding: ".25rem .65rem", fontSize: ".72rem" }}>{s}</span>
                          ))}
                        </div>
                      )}
                      {bio?.highlights && bio.highlights.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem", marginBottom: ".75rem" }}>
                          {bio.highlights.map((h) => (
                            <span key={h} style={{ fontSize: ".72rem", color: "var(--jw-muted)", background: "var(--jw-off)", border: "1px solid var(--jw-border)", borderRadius: "999px", padding: ".2rem .6rem" }}>{h}</span>
                          ))}
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".82rem", color: "var(--jw-muted)" }}>
                        <Globe size={14} />
                        {member.languages.join(", ")}
                        {(bio?.instagram || bio?.facebook) && (
                          <span style={{ display: "inline-flex", gap: ".5rem", marginLeft: ".5rem" }}>
                            {bio.instagram && (
                              <a href={bio.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${member.name}`} style={{ color: "var(--jw-navy)" }}>
                                <Instagram size={15} />
                              </a>
                            )}
                            {bio.facebook && (
                              <a href={bio.facebook} target="_blank" rel="noopener noreferrer" aria-label={`Facebook ${member.name}`} style={{ color: "var(--jw-navy)" }}>
                                <Facebook size={15} />
                              </a>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* KTA membership credential */}
                  <div className="jw-cred">
                    <span className="jw-cred-label">
                      <ShieldCheck size={12} style={{ display: "inline", marginRight: 4, verticalAlign: -2 }} />
                      {member.kta.credentialType} — {member.kta.credentialState}
                    </span>
                    <span className="jw-cred-text">
                      Issued by {member.kta.issuer}, supervised by BBKSDA Jawa Timur. This is a membership credential, not a government licence.
                    </span>
                  </div>
                </section>

                {/* ── Featured reviews ── */}
                {reviews.length > 0 && (
                  <section style={{ marginBottom: "3.5rem" }}>
                    <div className="jw-section-head">
                      <h2 className="jw-section-h2">Reviews naming {member.name}</h2>
                      <p className="jw-section-sub">
                        Guest reviews from Google that specifically mention {member.name} by name, with the original guest media.
                      </p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
                      {reviews.map((r) => (
                        <div key={r.reviewId} className="jw-verify-card" style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Stars count={r.star} />
                            <span style={{ fontSize: ".72rem", color: "var(--jw-muted)" }}>{r.date}</span>
                          </div>
                          <p style={{ fontSize: ".85rem", color: "var(--jw-navy)", lineHeight: 1.6, margin: 0 }}>
                            &ldquo;{r.reviewExcerpt}&rdquo;
                          </p>
                          <div style={{ fontSize: ".75rem", color: "var(--jw-muted)" }}>
                            — {r.reviewerName}
                            {r.package && (
                              <>
                                {" · "}
                                <Link href={`/${r.package.slug}`} prefetch={false} style={{ color: "var(--jw-orange)" }}>
                                  {r.package.name}
                                </Link>
                              </>
                            )}
                          </div>
                          {r.media.length > 0 && (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: ".35rem", marginTop: ".25rem" }}>
                              {r.media.slice(0, 4).map((m) => {
                                const src = m.thumbnailUrl || m.videoUrl;
                                if (!src) return null;
                                return (
                                  <div key={m.id} style={{ position: "relative", aspectRatio: "1", borderRadius: "8px", overflow: "hidden", background: "var(--jw-off)" }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={src}
                                      alt={m.thumbnailLabel || `Guest photo — review for ${member.name}`}
                                      loading="lazy"
                                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                    {m.type === "video" && (
                                      <div style={{ position: "absolute", top: 4, left: 4, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "9px", fontWeight: 700, textTransform: "uppercase", borderRadius: "999px", padding: "1px 6px" }}>
                                        Video
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {r.originalReviewUrl && (
                            <a href={r.originalReviewUrl} target="_blank" rel="noopener noreferrer" className="jw-inline-link" style={{ fontSize: ".72rem", alignSelf: "flex-start" }}>
                              View on Google →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ── Cross-cluster links ── */}
                <div style={{ borderTop: "1px solid var(--jw-border)", paddingTop: "1.5rem", display: "flex", flexWrap: "wrap", gap: "1rem", fontSize: ".85rem" }}>
                  <Link href="/why-jvto/our-team" className="jw-inline-link">Full team overview →</Link>
                  <Link href="/why-jvto/reviews" className="jw-inline-link">All reviews →</Link>
                  <Link href="/tours" className="jw-inline-link">Book a tour →</Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
