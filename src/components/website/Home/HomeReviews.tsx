// src/components/website/Home/HomeReviews.tsx
import Link from "@/components/website/AppLink";
import { TESTIMONIALS } from "@/lib/jvtoReviews";

const PLATFORMS = [
  {
    name: "Trustpilot",
    rating: "4.8★",
    count: "51 reviews",
    url: "https://trustpilot.com/review/javavolcano-touroperator.com",
  },
  {
    name: "Google Maps",
    rating: "4.9★",
    count: "92 reviews",
    url: "https://www.google.com/maps?cid=1266403973589689021",
  },
  {
    name: "TripAdvisor",
    rating: "4.95★",
    count: "21 reviews",
    url: "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
  },
] as const;

export default function HomeReviews() {
  const testimonials = TESTIMONIALS.slice(0, 3);

  return (
    <section aria-labelledby="reviews-heading" className="bg-jvto-navy py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">
          Reviews
        </p>
        <h2
          id="reviews-heading"
          className="font-black text-3xl md:text-4xl text-white mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Verified Across Three Platforms
        </h2>
        <p className="text-white/60 text-base mb-12">
          Every review links to the original profile.
        </p>

        {/* Platform score cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {PLATFORMS.map((platform) => (
            <div
              key={platform.name}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
            >
              <p className="text-sm font-bold text-white/60 uppercase tracking-widest mb-3">
                {platform.name}
              </p>
              <p className="text-4xl font-black text-jvto-green mb-1">{platform.rating}</p>
              <p className="text-white/60 text-sm mb-4">{platform.count}</p>
              <Link
                href={platform.url}
                className="text-jvto-green/80 text-xs font-bold hover:text-jvto-green"
              >
                View reviews <span aria-hidden="true">↗</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <p className="text-jvto-green text-4xl font-black leading-none mb-3" aria-hidden="true">&ldquo;</p>
              <p className="text-white/80 text-sm leading-relaxed mb-4">{t.text}</p>
              <div>
                <p className="text-white font-bold text-sm">{t.name}</p>
                <p className="text-white/50 text-xs">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
