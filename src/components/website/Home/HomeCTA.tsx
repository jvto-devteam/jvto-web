import Link from "@/components/website/AppLink";

export default function HomeCTA() {
  return (
    <section aria-labelledby="cta-heading" className="bg-jvto-navy py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
        <h2
          id="cta-heading"
          className="font-black text-3xl md:text-4xl text-white mb-4"
        >
          Ready to Explore East Java?
        </h2>
        <p className="text-white/60 text-base max-w-md mx-auto mb-10 leading-relaxed">
          WhatsApp us with your dates. We respond within 2 hours and build
          your itinerary.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="https://wa.me/6282244788833"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-jvto-green text-jvto-navy font-bold uppercase tracking-wider px-8 py-3.5 rounded-sm text-sm text-center hover:brightness-95 transition-all"
          >
            Book via WhatsApp
          </Link>
          <Link
            href="/tours"
            className="border-2 border-white/30 text-white font-bold uppercase tracking-wider px-8 py-3.5 rounded-sm text-sm text-center hover:border-white/60 transition-colors"
          >
            Browse All Tours
          </Link>
        </div>
      </div>
    </section>
  );
}
