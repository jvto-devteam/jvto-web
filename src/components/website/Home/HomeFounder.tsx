import Image from "next/image";
import Link from "@/components/website/AppLink";
import { ExternalLink, ShieldCheck } from "lucide-react";

const PRESS_URL =
  "https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin";
const PRESS_SCREENSHOT =
  "/press/screencapture-news-detik-berita-jawa-timur-d-5492690-suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin-2026-01-14-02_48_41.webp";

export default function HomeFounder() {
  return (
    <section aria-labelledby="founder-heading" className="bg-jvto-navy py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Portrait card */}
          <div className="relative mx-auto md:mx-0 w-full max-w-sm md:max-w-none">
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-jvto-navy-mid">
              <Image
                src="/founder/mr-sam-tourist-police-portrait-optimized.webp"
                alt="Bripka Agung Sambuko — founder and active Tourist Police officer"
                fill
                sizes="(max-width: 768px) 80vw, 40vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8) 100%)",
                }}
                aria-hidden="true"
              />
              <div className="absolute bottom-6 left-6 right-6 z-10 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-0.5 bg-jvto-orange" aria-hidden="true" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-jvto-orange">
                    Founder &amp; Active Officer
                  </span>
                </div>
                <p className="font-black text-2xl md:text-3xl leading-tight mb-1">
                  Agung Sambuko <span className="font-light opacity-80">(Mr. Sam)</span>
                </p>
                <p className="text-white/70 text-xs md:text-sm font-light">
                  Bripka Agung Sambuko — Bondowoso Tourist Police (Polpar)
                </p>
              </div>
            </div>

            <div className="hidden sm:flex absolute top-6 -right-3 items-center gap-3 bg-white rounded-sm shadow-lg px-4 py-3 max-w-[220px]">
              <ShieldCheck size={22} className="text-jvto-navy flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-jvto-navy text-xs font-black leading-tight">
                  Official Safety Authority
                </p>
                <p className="text-jvto-muted text-[10px] leading-snug mt-0.5">
                  Directly monitored by Police standards.
                </p>
              </div>
            </div>
          </div>

          {/* Copy + press embed */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-jvto-orange/40 bg-jvto-orange/10 px-4 py-1.5 mb-6">
              <span
                className="w-1.5 h-1.5 rounded-full bg-jvto-orange"
                aria-hidden="true"
              />
              <span className="text-jvto-orange text-[10px] font-bold uppercase tracking-[0.15em]">
                Verified Media Spotlight
              </span>
            </span>

            <h2
              id="founder-heading"
              className="font-black text-3xl md:text-5xl leading-[1.02] text-white mb-8"
            >
              Duty over profit,
              <br />
              <em className="italic font-medium text-jvto-orange">not just marketing.</em>
            </h2>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-black text-lg tracking-tight">
                  <span style={{ color: "#EE2E22" }}>detik</span>
                  <span className="text-white/90 font-light">news</span>
                </span>
                <ExternalLink size={16} className="text-white/40" aria-hidden="true" />
              </div>

              <div className="relative aspect-video rounded-sm overflow-hidden bg-jvto-navy-mid mb-4">
                <Image
                  src={PRESS_SCREENSHOT}
                  alt="Detik.com article screenshot — Suka Duka Polisi Pariwisata Bondowoso"
                  fill
                  sizes="(max-width: 768px) 90vw, 40vw"
                  className="object-cover"
                />
              </div>

              <p className="font-light italic text-white/85 text-base leading-relaxed border-l-2 border-jvto-orange pl-4 mb-3">
                &ldquo;The important thing is that the people who travel are safe.&rdquo;
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                — Bripka Agung Sambuko, detik.com (2021)
              </p>
              <a
                href={PRESS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-white/60 hover:text-white transition-colors"
              >
                Read original article <ExternalLink size={12} aria-hidden="true" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-sm p-4">
                <p className="text-white font-black text-lg leading-none mb-1">100%</p>
                <p className="text-white/40 text-xs">Police-led operations</p>
              </div>
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-sm p-4">
                <p className="text-white font-black text-lg leading-none mb-1">24/7</p>
                <p className="text-white/40 text-xs">Safety monitoring</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/why-jvto/our-story"
                className="bg-jvto-lime text-jvto-navy font-bold uppercase tracking-wider px-6 py-3 rounded-sm text-sm text-center hover:brightness-95 transition-all"
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
