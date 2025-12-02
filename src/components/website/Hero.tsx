import Link from "next/link";
import Image from "next/image";
import { HeroCopy } from "@/types";

interface HeroProps {
  heroCopy: HeroCopy;
}

const Hero: React.FC<HeroProps> = ({ heroCopy }) => {
  const parts = heroCopy.title.split(/(Bromo & Ijen tours)/i);

  return (
    <section className="relative bg-ink-primary min-h-[100vh] md:h-[90vh] md:min-h-[700px] flex items-center">
      {/* Image Background */}
      <Image
        src="/assets/img/hero/home.webp"
        alt="Tourist Police-led JVTO guide and guests watching sunrise over Mount Bromo from a private jeep"
        fill // menggantikan absolute + inset-0 + w-full + h-full
        className="object-cover z-0"
        sizes="100vw" // sesuaikan jika gambar tidak full-width (misal: "(max-width: 768px) 100vw, 50vw")
        priority // optional: gunakan jika gambar ini LCP (above the fold)
        quality={85} // optional: default 75, kamu set 85 sesuai URL asli
      />
      {/* Overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to right, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.6) 40%, rgba(15, 23, 42, 0) 70%)",
        }}
      ></div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="flex">
          <div className="md:w-1/2 lg:w-7/12 text-center md:text-left">
            <p
              className="mt-6 text-lg md:text-xl text-ink-neutral-200 animate-slide-in-up max-w-xl mx-auto md:mx-0"
              style={{ animationDelay: "100ms" }}
            >
              {heroCopy.kicker}
            </p>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold tracking-tighter text-white animate-slide-in-up leading-tight  mx-auto md:mx-0">
              {parts.length === 3 ? (
                <>
                  {parts[0]}
                  <span className="relative inline-block whitespace-nowrap">
                    <span className="absolute inset-x-[-0.2em] inset-y-[-0.2em] bg-scribble-green bg-cover bg-center bg-no-repeat"></span>
                    <span className="relative text-ink-primary">
                      {parts[1]}
                    </span>
                  </span>
                  {parts[2]}
                </>
              ) : (
                heroCopy.title
              )}
            </h1>

            {/* Subheadline */}
            <p
              className="mt-2 md:text-lg text-md text-white animate-slide-in-up max-w-3xl mx-auto md:mx-0"
              style={{ animationDelay: "100ms" }}
            >
              {heroCopy.subhead}
            </p>

            {/* CTAs */}
            <div
              className="mt-10 animate-fade-in"
              style={{ animationDelay: "300ms" }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <Link
                  href="/tours"
                  className="w-full sm:w-auto text-center px-8 py-4 rounded-xl bg-primary text-white font-bold text-base transition-all duration-300 shadow-[0_4px_12px_rgba(255,106,61,0.3)] hover:bg-[#E65A2F] hover:shadow-[0_6px_16px_rgba(255,106,61,0.4)] hover:-translate-y-0.5 active:bg-[#CC4F29] active:translate-y-0 active:shadow-[0_2px_6px_rgba(255,106,61,0.3)]"
                >
                  {heroCopy.ctaPrimary}
                </Link>
                <Link
                  href="/plan-my-trip"
                  className="w-full sm:w-auto text-center px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold border border-white/30 text-base transition-all duration-300 hover:bg-white/20 hover:border-white/50 active:bg-white/15 active:scale-[0.98]"
                >
                  {heroCopy.ctaSecondary}
                </Link>
              </div>
            </div>
            <p
              className="mb-3 mt-15 animate-fade-in"
              style={{ animationDelay: "200ms" }}
            >
              <a
                href="/why-jvto/the-jvto-difference"
                className="text-white underline underline-offset-4 hover:text-orange-300 transition"
              >
                Why This Is Verified →
              </a>
            </p>

            <p
              className="text-white max-w-2xl opacity-90 leading-relaxed animate-fade-in"
              style={{ animationDelay: "200ms" }}
            >
              Every trip is private for your group only. No shared buses, no
              mix-and-match strangers, and no surprise “local fees” on arrival.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
