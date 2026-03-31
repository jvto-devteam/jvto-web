import Image from "next/image";
import Link from "next/link";
import Button from "../UI/Button";
import { CheckCircle2, ShieldCheck, Star, Waves } from "lucide-react";

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

const Hero: React.FC<HeroProps> = ({
  title = "Tourist Police-Led Private Volcano Tours in East Java",
  description = "Private Bromo, Ijen & Tumpak Sewu tours from Surabaya or Bali. Licensed Indonesian operator, police-led safety culture, all-inclusive packages, and Ijen health screening included.",
}) => {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/assets/img/hero/home.webp"
          alt="East Java volcano landscape used on the JVTO homepage"
          fill
          priority
          sizes="100vw"
          quality={75}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101820] via-[#101820]/30 to-black/15" />
      </div>

      <div className="relative z-10 container mx-auto flex min-h-[90vh] items-center px-6 pt-28 pb-16 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-white/90 backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-jvto-green" />
            Tourist Police-Led Private Tours
          </div>

          <h1 className="mx-auto max-w-5xl text-3xl font-black leading-tight uppercase tracking-tight md:text-6xl">
            {title}
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-gray-200 md:text-xl">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-white/90">
            {highlights.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-2 backdrop-blur"
              >
                <CheckCircle2 className="h-4 w-4 text-jvto-green" />
                {item}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button to="/tours" variant="primary" size="lg">
              Explore Private Tours
            </Button>
            <Button
              to="/verify-jvto"
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:!text-black"
            >
              Verify JVTO
            </Button>
            <Button
              to="/contact"
              variant="ghost"
              size="lg"
              className="border border-white/20 text-white hover:bg-white/10"
            >
              Contact JVTO
            </Button>
          </div>

          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-3 rounded-sm border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/85 backdrop-blur">
            <span className="inline-flex items-center gap-2">
              <Waves className="h-4 w-4 text-jvto-green" />
              MAGMA-aware route context
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-white/35 sm:block" />
            <span>Prepare &amp; Book support built in</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/35 sm:block" />
            <span>Proof before payment</span>
          </div>

          <Link
            href="https://www.trustpilot.com/review/javavolcano-touroperator.com"
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur transition-colors hover:bg-white/15"
            aria-label="Read JVTO reviews on Trustpilot"
          >
            <span className="font-bold underline">Excellent</span>
            <span className="inline-flex items-center gap-1 text-jvto-green">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
            </span>
            <span className="text-sm text-white/85">Trustpilot reviews</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
