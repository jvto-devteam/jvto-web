import Image from "next/image";
import Link from "next/link";
import Button from "../UI/Button";
import {
  Activity,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Star,
  Waves,
} from "lucide-react";

interface HeroProps {
  title?: string;
  description?: string;
}

const highlights = [
  "Private tours only",
  "Licensed Indonesian operator",
  "No shared groups",
  "Ijen screening before night trek",
];

const auditSteps = [
  {
    id: "LEGAL",
    title: "Legal Entity",
    status: "Verified",
    Icon: FileCheck2,
  },
  {
    id: "POLICE",
    title: "Police Liaison",
    status: "Active",
    Icon: ShieldCheck,
  },
  {
    id: "MEDICAL",
    title: "Health Protocol",
    status: "Ready",
    Icon: Activity,
  },
];

const Hero: React.FC<HeroProps> = ({
  title = "Tourist Police-Led Private Volcano Tours in East Java",
  description = "Private Bromo, Ijen & Tumpak Sewu tours from Surabaya or Bali. Licensed Indonesian operator, police-led safety culture, all-inclusive packages, and Ijen health screening included.",
}) => {
  return (
    <section className="relative overflow-hidden bg-authority-navy text-white">
      <div className="absolute inset-0">
        <Image
          src="/founder/mr-sam-tourist-police-portrait.png"
          alt="Agung Sambuko, Tourist Police-led founder of JVTO"
          fill
          priority
          sizes="100vw"
          quality={75}
          className="object-cover object-top grayscale"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,53,0.22),transparent_30%),linear-gradient(90deg,rgba(15,23,42,0.96)_0%,rgba(15,23,42,0.9)_42%,rgba(15,23,42,0.55)_68%,rgba(15,23,42,0.82)_100%)]" />
        <div className="grid-pattern absolute inset-0 opacity-20" />
      </div>

      <div className="relative z-10 border-b border-white/10 bg-black/30">
        <div className="container mx-auto flex flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="status-live" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-safety-orange">
              60s Fast Audit
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:gap-6">
            {auditSteps.map(({ id, title, status, Icon }) => (
              <div key={id} className="inline-flex items-center gap-2 text-white/90">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/8">
                  <Icon className="h-4 w-4 text-verified-bright" />
                </span>
                <div className="leading-tight">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                    {title}
                  </p>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-verified-bright">
                    {status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto min-h-[calc(100svh-73px)] px-6 pt-16 pb-14 lg:flex lg:items-end lg:pt-28 lg:pb-20">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="max-w-3xl">
            <div className="tech-badge mb-6">
              <ShieldCheck className="h-4 w-4" />
              Tourist Police-Led Private Tours
            </div>

            <h1 className="max-w-4xl text-4xl font-black uppercase tracking-[-0.04em] text-white md:text-6xl lg:text-7xl">
              {title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/90 backdrop-blur"
                >
                  <CheckCircle2 className="h-4 w-4 text-verified-bright" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Button to="/tours" variant="primary" size="lg" className="shadow-[0_18px_40px_rgba(163,230,53,0.2)]">
                Browse Private Tours
              </Button>
              <Button
                to="/verify-jvto"
                variant="outline"
                size="lg"
                className="border-white/20 bg-white/6 text-white hover:border-white hover:bg-white hover:!text-authority-navy"
              >
                Open Verify JVTO
              </Button>
              <Button
                to="/travel-guide/weather-and-closures"
                variant="ghost"
                size="lg"
                className="border border-white/15 bg-black/15 text-white hover:bg-white/10"
              >
                Route Conditions
              </Button>
            </div>

            <div className="mt-10 inline-flex flex-wrap items-center gap-3 border-t border-white/10 pt-6 text-sm text-white/80">
              <span className="inline-flex items-center gap-2">
                <Waves className="h-4 w-4 text-safety-orange" />
                MAGMA-aware route context
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-white/35 sm:block" />
              <span>Prepare &amp; Book support built in</span>
              <span className="hidden h-1 w-1 rounded-full bg-white/35 sm:block" />
              <span>Proof before payment</span>
            </div>
          </div>

          <div className="lg:justify-self-end">
            <div className="bento-card max-w-xl border-white/12 bg-white/8 p-7 text-white backdrop-blur-xl lg:ml-auto lg:bg-white/6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-300">
                    Operator Proof Path
                  </p>
                  <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">
                    Verify before you pay.
                  </h2>
                </div>
                <span className="verified-badge">Ready</span>
              </div>

              <div className="space-y-4 border-t border-white/10 pt-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
                      Legal Identity
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-200">
                      PT Java Volcano Rendezvous with visible verification routes and policy path.
                    </p>
                  </div>
                  <Link href="/verify-jvto/legal" className="text-sm font-black uppercase tracking-[0.15em] text-verified-bright transition hover:text-white">
                    Open
                  </Link>
                </div>
                <div className="flex items-start justify-between gap-4 border-t border-white/8 pt-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
                      Health Screening
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-200">
                      Doctor-backed Ijen screening before night ascent decisions are finalized.
                    </p>
                  </div>
                  <Link href="/travel-guide/ijen-health-screening" className="text-sm font-black uppercase tracking-[0.15em] text-verified-bright transition hover:text-white">
                    Read
                  </Link>
                </div>
                <div className="flex items-start justify-between gap-4 border-t border-white/8 pt-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
                      Reviews & Trust
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-200">
                      External review signal plus operator context, not anonymous brochure copy.
                    </p>
                  </div>
                  <Link href="/why-jvto/reviews" className="text-sm font-black uppercase tracking-[0.15em] text-verified-bright transition hover:text-white">
                    Check
                  </Link>
                </div>
              </div>

              <Link
                href="https://www.trustpilot.com/review/javavolcano-touroperator.com"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/20 px-4 py-3 text-white transition-colors hover:bg-black/30"
                aria-label="Read JVTO reviews on Trustpilot"
              >
                <span className="font-bold underline">Excellent</span>
                <span className="inline-flex items-center gap-1 text-verified-bright">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </span>
                <span className="text-sm text-white/80">Trustpilot reviews</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
