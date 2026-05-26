import Image from "next/image";
import Link from "@/components/website/AppLink";

export default function HomeFounder() {
  return (
    <section aria-labelledby="founder-heading" className="bg-jvto-navy py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative mx-auto md:mx-0 w-full max-w-sm md:max-w-none">
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden">
              <Image
                src="/founder/mr-sam-tourist-police-portrait-optimized.webp"
                alt="Bripka Agung Sambuko in official Tourist Police uniform, founder of Java Volcano Tour Operator"
                fill
                sizes="(max-width: 768px) 80vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 bg-jvto-green px-4 py-2 rounded-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-jvto-navy">
                Active Duty Officer
              </p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-jvto-green mb-3">
              Founder Spotlight
            </p>
            <h2
              id="founder-heading"
              className="font-black text-2xl md:text-3xl text-white mb-4 leading-tight"
            >
              Bripka Agung Sambuko
            </h2>
            <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-6">
              Tourist Police Officer &middot; Ditpamobvit East Java &middot; Est. 2015
            </p>

            <div className="space-y-4 mb-8">
              <p className="text-white/70 text-sm leading-relaxed">
                An active officer of the Indonesian Tourist Police (Ditpamobvit, East Java)
                who founded PT Java Volcano Rendezvous to bring police-grade safety
                standards to private volcano touring.
              </p>
              <p className="text-white/70 text-sm leading-relaxed">
                Police credentials (SPRIN POLPAR, SPRIN WAL-TRAVEL 2024) and independent
                press coverage (Detik.com, Radar Jember) verify identity and active
                deployment. Not a marketing claim.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-sm p-4">
                <p className="text-white font-black text-lg leading-none mb-1">Since 2015</p>
                <p className="text-white/40 text-xs">Operating in East Java</p>
              </div>
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-sm p-4">
                <p className="text-white font-black text-lg leading-none mb-1">14 Crew</p>
                <p className="text-white/40 text-xs">7 guides, 7 drivers</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/why-jvto/our-story"
                className="bg-jvto-green text-jvto-navy font-bold uppercase tracking-wider px-6 py-3 rounded-sm text-sm text-center hover:brightness-95 transition-all"
              >
                Read Our Story
              </Link>
              <Link
                href="/verify-jvto/police-safety"
                className="border-2 border-white/30 text-white font-bold uppercase tracking-wider px-6 py-3 rounded-sm text-sm text-center hover:border-white/60 transition-colors"
              >
                Verify Credentials
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
