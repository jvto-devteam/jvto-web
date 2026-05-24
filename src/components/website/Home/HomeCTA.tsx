// src/components/website/Home/HomeCTA.tsx
import Link from "@/components/website/AppLink";

export default function HomeCTA() {
  return (
    <section aria-labelledby="cta-heading" className="bg-jvto-navy py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
        <h2
          id="cta-heading"
          className="font-black text-4xl md:text-5xl text-white mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Ready to Book?
        </h2>
        <p className="text-white/60 text-base max-w-xl mx-auto mb-10">
          WhatsApp us — we respond within 2 hours. Tell us your dates and
          we&apos;ll build your itinerary.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="https://wa.me/6282244788833"
            className="bg-jvto-green text-jvto-navy font-black px-8 py-4 rounded-full text-base text-center hover:bg-jvto-green/90 transition-colors"
          >
            Book via WhatsApp
          </Link>
          <Link
            href="/tours"
            className="border border-white/30 text-white font-bold px-8 py-4 rounded-full text-base text-center hover:border-white/60 transition-colors"
          >
            Browse All Tours <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
