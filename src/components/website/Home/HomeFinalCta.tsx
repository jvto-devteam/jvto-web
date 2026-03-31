import Link from "next/link";
import { ArrowRight, MessageCircle, Search } from "lucide-react";

const HomeFinalCta: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#101820] py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(160,188,78,0.16),transparent_30%)]" />

      <div className="container relative z-10 mx-auto px-6 text-center">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-jvto-green">
          JVTO · East Java Private Tours
        </p>
        <h2 className="mt-4 text-4xl font-black uppercase leading-tight md:text-6xl">
          Browse routes.
          <br />
          Check the proof.
          <br />
          <span className="text-jvto-green">Book with confidence.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-300">
          The right flow is simple: explore the route, verify the operator, then
          move into booking with support pages already connected to the decision.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
          <Link
            href="/tours"
            className="inline-flex items-center justify-center gap-2 bg-jvto-green px-7 py-4 text-sm font-black uppercase tracking-widest text-jvto-dark transition-colors hover:bg-white"
          >
            <Search className="h-4 w-4" />
            View All Tours
          </Link>
          <Link
            href="/verify-jvto"
            className="inline-flex items-center justify-center gap-2 border border-white/20 px-7 py-4 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-white/10"
          >
            Open Proof Library
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/travel-guide"
            className="inline-flex items-center justify-center gap-2 border border-white/20 px-7 py-4 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-white/10"
          >
            Prepare &amp; Book
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 border border-white/20 px-7 py-4 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4" />
            Ask JVTO
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeFinalCta;
