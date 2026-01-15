// app/why-jvto/reviews/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Avatar from "@/components/website/Avatar";
import { Star } from "lucide-react";
import StructuredData from "@/components/website/StructuredData";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ReviewDetailPage({ params }: PageProps) {
  const { id } = await params;

  const reviewId = BigInt(id);

  const review = await prisma.reviews.findUnique({
    where: { id: reviewId },
    include: {
      package: true,
    },
  });

  if (!review) {
    notFound();
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: review.package?.name ?? "Java Volcano Tour Package",
    brand: {
      "@type": "Brand",
      name: "Java Volcano Tour Operator",
    },
    url: review.package?.slug
      ? `https://javavolcano-touroperator.com/${review.package.slug}`
      : "https://javavolcano-touroperator.com/tours",

    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.star ?? 5,
        bestRating: 5,
        worstRating: 1,
      },
      author: {
        "@type": "Person",
        name: review.customer_name,
      },
      reviewBody: review.review,
      datePublished: review.date.toISOString(),
      publisher: {
        "@type": "Organization",
        name: "Java Volcano Tour Operator",
      },
    },
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-40">
      {/* Header */}
      <StructuredData data={schema} />

      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Customer Review</h1>

        <p className="text-sm text-gray-500 mt-2">
          Posted on{" "}
          {review.date.toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>

      {/* Reviewer */}
      <section className="flex items-center gap-4 mb-6">
        <Avatar
          name={review.customer_name}
          photo={review.profile_photo}
          size={56}
        />
        <div>
          <p className="font-bold text-slate-800">{review.customer_name}</p>
          <p className="text-sm text-gray-500">via {review.platform}</p>
        </div>
      </section>

      {/* Rating */}
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

      {/* Review Content */}
      <article className="prose prose-slate max-w-none mb-10">
        <p>{review.review}</p>
      </article>

      {/* Product / Package */}
      {review.package && (
        <section className="border rounded-xl p-6 bg-gray-50">
          <h2 className="font-bold text-lg mb-2">Related Tour Package</h2>

          <p className="font-semibold text-slate-800">{review.package.name}</p>

          {review.package.slug && (
            <a
              href={`https://javavolcano-touroperator.com/tours/${review.package.slug}`}
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
