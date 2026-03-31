import Link from "next/link";
import { ArrowRight, FileCheck2, ShieldCheck, Star } from "lucide-react";
import { proofLinks } from "@/constants";

const HomeReviewProofBanner: React.FC = () => {
  return (
    <section className="bg-white pb-20">
      <div className="container mx-auto px-6">
        <div className="grid gap-6 rounded-sm border border-[#dfe5d0] bg-[#f7f8f2] p-6 md:grid-cols-[1.15fr_0.85fr] md:p-8">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-jvto-green">
              <Star className="h-3.5 w-3.5" />
              External Reputation
            </p>
            <h2 className="mt-3 text-2xl font-black uppercase text-jvto-dark md:text-3xl">
              Reviews matter more when proof stays close by.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
              Guest praise is useful, but it should sit next to operator proof,
              not replace it. Read reviews, inspect the legal context, and then
              decide whether the route handling feels trustworthy.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={proofLinks.trustpilot}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-jvto-dark px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-black"
              >
                View Trustpilot
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/why-jvto/reviews"
                className="inline-flex items-center gap-2 border border-[#ccd6b4] px-5 py-3 text-sm font-black uppercase tracking-wide text-jvto-dark transition-colors hover:bg-white"
              >
                Review Sources
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
            <Link
              href="/verify-jvto/legal"
              className="rounded-sm border border-[#dfe5d0] bg-white p-5 transition-colors hover:border-[#b8c59a]"
            >
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-jvto-green/15 text-jvto-dark">
                <FileCheck2 className="h-5 w-5" />
              </span>
              <h3 className="text-sm font-black uppercase tracking-wide text-jvto-dark">
                Legal & Company Proof
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                PT registration, licensing context, and operator identity in one path.
              </p>
            </Link>

            <Link
              href="/verify-jvto"
              className="rounded-sm border border-[#dfe5d0] bg-white p-5 transition-colors hover:border-[#b8c59a]"
            >
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-jvto-green/15 text-jvto-dark">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h3 className="text-sm font-black uppercase tracking-wide text-jvto-dark">
                Open Proof Library
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Police, history, legal, and media verification gathered in one place.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeReviewProofBanner;
