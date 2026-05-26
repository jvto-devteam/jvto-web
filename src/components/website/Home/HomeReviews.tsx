import Link from "@/components/website/AppLink";
import { TESTIMONIALS } from "@/lib/jvtoReviews";

const PLATFORMS = [
  {
    name: "Trustpilot",
    rating: "4.8",
    stars: 5,
    count: 51,
    url: "https://trustpilot.com/review/javavolcano-touroperator.com",
  },
  {
    name: "Google Maps",
    rating: "4.9",
    stars: 5,
    count: 123,
    url: "https://www.google.com/maps?cid=1266403973589689021",
  },
  {
    name: "TripAdvisor",
    rating: "4.95",
    stars: 5,
    count: 21,
    url: "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
  },
] as const;

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-jvto-green text-sm">★</span>
      ))}
    </div>
  );
}

export default function HomeReviews() {
  const testimonials = TESTIMONIALS.slice(0, 3);
  const totalReviews = PLATFORMS.reduce((sum, p) => sum + p.count, 0);

  return (
    <section aria-labelledby="reviews-heading" className="bg-jvto-off py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-14">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-jvto-muted mb-2">
            Tried & Trusted
          </p>
          <h2
            id="reviews-heading"
            className="font-black text-2xl md:text-3xl text-jvto-navy mb-2"
          >
            {totalReviews}+ Verified Reviews
          </h2>
          <p className="text-jvto-muted text-sm">
            Every rating links to the original platform profile.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {PLATFORMS.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-sm border border-jvto-border p-6 text-center hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(13,27,42,0.12)] transition-all duration-200 group"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-jvto-muted mb-2">
                {platform.name}
              </p>
              <p className="text-4xl font-black text-jvto-navy leading-none mb-2">
                {platform.rating}
              </p>
              <div className="flex justify-center mb-2">
                <StarRow count={platform.stars} />
              </div>
              <p className="text-jvto-muted text-xs font-semibold mb-3">
                {platform.count} reviews
              </p>
              <span className="text-jvto-green text-xs font-bold uppercase tracking-wider group-hover:underline">
                Read reviews ↗
              </span>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <blockquote
              key={i}
              className="bg-white rounded-sm border border-jvto-border p-6"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className="text-jvto-green text-xs">★</span>
                ))}
              </div>
              <p className="text-jvto-navy/80 text-sm leading-relaxed mb-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <footer>
                <p className="text-jvto-navy font-bold text-sm">{t.name}</p>
                <p className="text-jvto-muted text-xs">{t.location}</p>
              </footer>
            </blockquote>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/why-jvto/reviews"
            className="text-sm font-bold text-jvto-muted hover:text-jvto-navy transition-colors"
          >
            Read all reviews <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
