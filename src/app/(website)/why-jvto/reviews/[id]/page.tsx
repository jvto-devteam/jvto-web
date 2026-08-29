// app/why-jvto/reviews/[id]/page.tsx
// Migrated 2026-08-18: package name/slug resolved from ekosistem instead of the Prisma
// `packages` relation.
// Migrated 2026-08-19 (Phase 2 of the Google Reviews migration): the review record
// itself now also comes from jvto-ekosistem's reviews.json instead of Prisma —
// packageSlug/packageName are already baked onto each review record there, so the
// separate Prisma packages lookup this page used to do is no longer needed at all.
// `id` here is the numeric id preserved verbatim from Prisma's `reviews.id` at
// export time — it is the same id this page's URL and JSON-LD `#review-{id}`
// @id have always used, never renumbered.
import { notFound } from "next/navigation";
import Avatar from "@/components/website/Avatar";
import { Star } from "lucide-react";
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from "next";
import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";
import { getEcosystemReviewById } from "@/lib/ecosystemContent/reviews";
import { getEcosystemReviewSchema, nodeTypes } from "@/lib/ecosystemContent/schema";
import { getPublicCrew } from "@/lib/people/canonicalPeople";
import {
  buildOrganizationJsonLd,
  toOrganizationReferenceOnly,
  buildWebSiteJsonLd,
} from "@/lib/seo/jsonld/builders";

export const revalidate = 1800;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";

function packageUrlFor(slug: string | null): string {
  if (!slug) return `${SITE_URL}/tours`;
  return slug.startsWith("tours/")
    ? `${SITE_URL}/${slug}`
    : `${SITE_URL}/tours/${slug}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const reviewId = Number(id);

  const review = Number.isFinite(reviewId)
    ? await getEcosystemReviewById(reviewId)
    : null;

  if (!review) {
    return { title: "Review Not Found" };
  }

  const packageName = review.packageName ?? "Java Volcano Tour Package";
  const title = `${review.customerName} Review | ${packageName}`;
  // review.review is "" (not null/undefined) for star-only reviews with no
  // written text — `??` doesn't catch an empty string, so it was passing
  // through as an empty meta description instead of falling back.
  const reviewExcerpt = review.review?.trim();
  const description = reviewExcerpt
    ? reviewExcerpt.slice(0, 160)
    : `Customer review for ${packageName} with Java Volcano Tour Operator.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/why-jvto/reviews/${review.id}`,
      languages: {
        en: `${SITE_URL}/why-jvto/reviews/${review.id}`,
        "x-default": `${SITE_URL}/why-jvto/reviews/${review.id}`,
      },
    },
  };
}

export default async function ReviewDetailPage({ params }: PageProps) {
  const { id } = await params;

  const reviewId = Number(id);

  const [review, org] = await Promise.all([
    Number.isFinite(reviewId) ? getEcosystemReviewById(reviewId) : Promise.resolve(null),
    getOrganizationProfile(),
  ]);

  if (!review) {
    notFound();
  }

  // Migrated (Bagian 2, 2026-08-20): the Review-nested-in-Product JSON-LD node is now
  // pre-rendered by jvto-ekosistem (scripts/generate-review-schema.mjs), one file per
  // review id, instead of being built inline here. A missing file 404s this page
  // rather than rendering without the node — either ekosistem is unreachable, or (same
  // accepted risk as booking-records) this review was just synced into reviews.json
  // but the schema regeneration step for it hasn't run yet. The visible review content
  // above/below (customerName, star, review text) comes straight from reviews.json via
  // getEcosystemReviewById and is unaffected by this migration.
  const reviewSchema = await getEcosystemReviewSchema(review.id);
  // Type-safe check: @type can be a string or an array (the sibling Organization
  // node in this same graph already uses array-form @type, e.g.
  // ["Organization", "TravelAgency", "LocalBusiness"]) — a strict `=== "Product"`
  // check would silently fail (and 404 all 217 review pages at once) if ekosistem
  // ever emitted the Product node with array-form @type too. See nodeTypes() in
  // ecosystemContent/schema.ts (same helper pattern as PageJsonLdCombined.tsx's
  // schemaTypes()).
  const productNode =
    reviewSchema?.["@graph"].find((node) => nodeTypes(node).includes("Product")) ?? null;
  // The Review lives nested inside the Product, which is the canonical shape for
  // a product review — but nothing said it is what this page is ABOUT. A page
  // whose entire purpose is to publish one review left its main entity
  // undeclared, so a reader of the graph saw a Product page that happens to
  // contain a review rather than a review page. Point mainEntity at the node
  // that already exists; do not define it twice.
  const nestedReview = (() => {
    const found = (productNode as any)?.review;
    const first = Array.isArray(found) ? found[0] : found;
    return typeof first?.["@id"] === "string" ? (first["@id"] as string) : null;
  })();

  if (!productNode) {
    notFound();
  }

  const resolvedName = review.packageName;
  const resolvedSlug = review.packageSlug;
  // The crew pages link out to these permalinks; nothing linked back, so a
  // review naming three guides was a dead end for both a reader following the
  // name and a crawler trying to connect the person to the praise. Only crew
  // still on the published roster resolve — a name that no longer belongs to
  // anyone is left as plain text rather than linked to a page that 404s.
  const roster = await getPublicCrew().catch(() => []);
  const namedCrew = (review.crewCodes ?? [])
    .map((code) => roster.find((member) => member.code === code))
    .filter((member): member is NonNullable<typeof member> => Boolean(member));
  const packageName = resolvedName ?? "Java Volcano Tour Package";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      toOrganizationReferenceOnly(buildOrganizationJsonLd(org as any, SITE_URL)),
      buildWebSiteJsonLd(SITE_URL),
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/why-jvto/reviews/${review.id}#webpage`,
        url: `${SITE_URL}/why-jvto/reviews/${review.id}`,
        name: `${review.customerName} Review | ${packageName}`,
        description: (() => {
          const excerpt = review.review?.trim();
          return excerpt
            ? excerpt.slice(0, 160)
            : `Customer review for ${packageName} with Java Volcano Tour Operator.`;
        })(),
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        ...(nestedReview ? { mainEntity: { "@id": nestedReview } } : {}),
        // The same edge the visible links make, in the graph: this page is
        // about these specific people. Their Person nodes are defined on their
        // own crew pages, where each carries an HPWKI credential and worksFor
        // JVTO — so a crawler reading a review that praises a guide by name can
        // reach the guide, and see he is staff rather than a freelancer.
        ...(namedCrew.length
          ? {
              mentions: namedCrew.map((member) => ({
                "@id": `${SITE_URL}/why-jvto/our-team/${member.code}#person`,
              })),
            }
          : {}),
      },
      productNode,
    ],
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-40">
      <StructuredData data={schema} />

      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">
          {review.customerName} Review
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          Posted on{" "}
          {new Date(review.date).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>

      <section className="flex items-center gap-4 mb-6">
        <Avatar
          name={review.customerName}
          photo={null}
          size={56}
        />
        <div>
          <p className="font-bold text-slate-800">{review.customerName}</p>
          <p className="text-sm text-gray-500">via {review.platform}</p>
        </div>
      </section>

      <section className="mb-6">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={
                i < (review.star ?? 0) ? "text-yellow-400" : "text-gray-300"
              }
            >
              <Star fill="currentColor" size={20} />
            </span>
          ))}
        </div>
      </section>

      <article className="prose prose-slate max-w-none mb-10">
        <p>{review.review}</p>
      </article>

      {namedCrew.length > 0 && (
        <section className="mb-10">
          <h2 className="font-bold text-lg mb-2">Crew named in this review</h2>
          <p className="text-sm text-gray-500 mb-3">
            Each of them is a JVTO crew member with an HPWKI climbing credential,
            not a freelancer booked for the day.
          </p>
          <ul className="flex flex-wrap gap-2">
            {namedCrew.map((member) => (
              <li key={member.code}>
                <a
                  href={`${SITE_URL}/why-jvto/our-team/${member.code}`}
                  className="inline-block border rounded-full px-4 py-1.5 text-sm font-semibold text-slate-800 hover:border-orange-500 hover:text-orange-600 transition-colors"
                >
                  {member.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {resolvedName && (
        <section className="border rounded-sm p-6 bg-gray-50">
          <h2 className="font-bold text-lg mb-2">Related Tour Package</h2>

          <p className="font-semibold text-slate-800">{resolvedName}</p>

          {resolvedSlug && (
            <a
              href={packageUrlFor(resolvedSlug)}
              className="inline-block mt-2 text-orange-600 font-semibold hover:underline"
            >
              View Tour Details →
            </a>
          )}
        </section>
      )}
    </main>
  );
}
