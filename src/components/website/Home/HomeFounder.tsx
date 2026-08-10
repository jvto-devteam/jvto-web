import Image from "next/image";
import Link from "@/components/website/AppLink";
import { ExternalLink, ShieldCheck } from "lucide-react";
import Section from "@/components/design/Section";

const PRESS_URL =
  "https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin";
const PRESS_SCREENSHOT =
  "/press/screencapture-news-detik-berita-jawa-timur-d-5492690-suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin-2026-01-14-02_48_41.webp";

// PKG-11a: the founder block is the page's one full-bleed portrait moment, so it
// keeps a bespoke heading (display scale + chip) instead of the SectionHeading
// spec line. The press embed is restyled as an evidence plate — hairline frame,
// raised surface, mono attribution — so it reads as filed proof, not a pull quote.
export default function HomeFounder() {
  return (
    <Section surface="navy" labelledBy="founder-heading" className="overflow-hidden">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
        {/* Portrait */}
        <div className="relative mx-auto w-full max-w-sm md:mx-0 md:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-jvto-navy-raise shadow-jvto-card-hover ring-1 ring-white/10">
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
                background:
                  "linear-gradient(180deg, transparent 46%, rgba(7,16,25,0.88) 100%)",
              }}
              aria-hidden="true"
            />
            <div className="absolute right-6 bottom-6 left-6 z-10 text-white">
              <div className="mb-3 flex items-center gap-3">
                <span className="h-0.5 w-8 bg-jvto-orange" aria-hidden="true" />
                <span className="font-mono text-[10px] font-bold tracking-[0.24em] text-jvto-orange uppercase">
                  Founder &amp; Active Officer
                </span>
              </div>
              <p className="font-jvto-heading mb-1 text-2xl leading-tight font-black md:text-3xl">
                Agung Sambuko <span className="font-light opacity-80">(Mr. Sam)</span>
              </p>
              <p className="text-xs font-light text-jvto-on-navy md:text-sm">
                Bripka Agung Sambuko — Bondowoso Tourist Police (Polpar)
              </p>
            </div>
          </div>

          <div className="absolute top-6 -right-3 hidden max-w-[220px] items-center gap-3 rounded-sm bg-white px-4 py-3 shadow-jvto-card-hover sm:flex">
            <ShieldCheck
              size={22}
              className="flex-shrink-0 text-jvto-navy"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs leading-tight font-black text-jvto-navy">
                Official Safety Authority
              </p>
              <p className="mt-0.5 text-[10px] leading-snug text-jvto-ink-soft">
                Directly monitored by Police standards.
              </p>
            </div>
          </div>
        </div>

        {/* Copy + evidence plate */}
        <div>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-jvto-orange/45 bg-jvto-orange/10 px-4 py-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full bg-jvto-orange"
              aria-hidden="true"
            />
            <span className="text-[10px] font-bold tracking-[0.15em] text-jvto-orange uppercase">
              Verified Media Spotlight
            </span>
          </span>

          <h2
            id="founder-heading"
            className="font-jvto-heading mb-8 text-[2rem] leading-[1.02] font-black tracking-[-0.025em] text-white md:text-5xl"
          >
            Duty over profit,
            <br />
            <em className="font-medium text-jvto-orange italic">not just marketing.</em>
          </h2>

          <figure className="mb-6 rounded-sm border border-white/12 bg-jvto-navy-raise/70 p-6">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-lg font-black tracking-tight">
                <span style={{ color: "#EE2E22" }}>detik</span>
                <span className="font-light text-white/90">news</span>
              </span>
              <ExternalLink size={16} className="text-jvto-on-navy-dim" aria-hidden="true" />
            </div>

            <div className="relative mb-5 aspect-video overflow-hidden rounded-sm bg-jvto-navy ring-1 ring-white/10">
              <Image
                src={PRESS_SCREENSHOT}
                alt="Detik.com article screenshot — Suka Duka Polisi Pariwisata Bondowoso"
                fill
                sizes="(max-width: 768px) 90vw, 40vw"
                className="object-cover"
              />
            </div>

            <blockquote className="mb-3 border-l-2 border-jvto-orange pl-4 text-base leading-relaxed font-light text-white italic">
              &ldquo;The important thing is that the people who travel are safe.&rdquo;
            </blockquote>
            <figcaption className="font-mono text-[10px] tracking-[0.2em] text-jvto-on-navy-dim uppercase">
              — Bripka Agung Sambuko, detik.com (2021)
            </figcaption>
            <a
              href={PRESS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="jvto-focus-dark mt-4 inline-flex items-center gap-1.5 rounded-sm text-xs font-bold text-jvto-on-navy transition-colors hover:text-white"
            >
              Read original article <ExternalLink size={12} aria-hidden="true" />
            </a>
          </figure>

          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="rounded-sm border border-white/12 bg-jvto-navy-raise/70 p-4">
              <p className="font-jvto-heading mb-1 text-2xl leading-none font-black text-white">
                100%
              </p>
              <p className="text-xs text-jvto-on-navy-dim">Police-led operations</p>
            </div>
            <div className="rounded-sm border border-white/12 bg-jvto-navy-raise/70 p-4">
              <p className="font-jvto-heading mb-1 text-2xl leading-none font-black text-white">
                24/7
              </p>
              <p className="text-xs text-jvto-on-navy-dim">Safety monitoring</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/why-jvto/our-story"
              className="jvto-focus-dark rounded-sm bg-jvto-lime px-6 py-3 text-center text-sm font-bold tracking-wider text-jvto-navy uppercase transition-all duration-200 hover:-translate-y-0.5 hover:brightness-95"
            >
              Read Our Story
            </Link>
            <Link
              href="/verify-jvto/police-safety"
              className="jvto-focus-dark rounded-sm border-2 border-white/35 px-6 py-3 text-center text-sm font-bold tracking-wider text-white uppercase transition-colors duration-200 hover:border-white/70 hover:bg-white/[0.06]"
            >
              Verify Credentials
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
