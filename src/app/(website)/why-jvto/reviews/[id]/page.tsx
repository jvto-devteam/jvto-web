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
  const description =
    review.review?.slice(0, 160) ??
    `Customer review for ${packageName} with Java Volcano Tour Operator.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/why-jvto/reviews/${review.id}`,
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
  if (!productNode) {
    notFound();
  }

  const resolvedName = review.packageName;
  const resolvedSlug = review.packageSlug;
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
        description:
          review.review?.slice(0, 160) ??
          `Customer review for ${packageName} with Java Volcano Tour Operator.`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
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
