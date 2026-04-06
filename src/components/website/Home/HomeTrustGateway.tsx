import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileCheck2, ShieldCheck, Star } from "lucide-react";
import { homepageTrustGatewayDoctrine } from "@/lib/homepage/homepageDoctrine";

const HomeTrustGateway = () => {
  const founder = homepageTrustGatewayDoctrine.founder;

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 rounded-sm border border-[#dfe5d0] bg-[#f7f8f2] p-6 md:p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="relative flex justify-center lg:justify-start">
              <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-sm border border-[#dfe5d0] shadow-xl">
                <Image
                  src={founder.imageSrc}
                  alt={founder.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
                  <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-white/90 backdrop-blur">
                    <ShieldCheck className="h-3.5 w-3.5 text-jvto-green" />
                    {founder.kicker}
                  </span>
                  <p className="mb-1 text-lg font-bold uppercase text-white">
                    {founder.name}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-jvto-green">
                    {founder.role}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-jvto-green">
                <Star className="h-3.5 w-3.5" />
                {homepageTrustGatewayDoctrine.eyebrow}
              </p>

              <h2 className="mt-4 text-3xl font-black uppercase leading-tight text-jvto-dark md:text-4xl">
                {homepageTrustGatewayDoctrine.title}
              </h2>

              <div className="mt-6 space-y-5 text-base leading-7 text-gray-600">
                {founder.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                {homepageTrustGatewayDoctrine.actions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={
                      action.variant === "primary"
                        ? "inline-flex items-center gap-2 bg-jvto-dark px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-black"
                        : "inline-flex items-center gap-2 border border-[#ccd6b4] px-6 py-3 text-sm font-black uppercase tracking-wide text-jvto-dark transition-colors hover:bg-white"
                    }
                  >
                    {action.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {homepageTrustGatewayDoctrine.cards.map((card) => (
              <div
                key={card.title}
                className="rounded-sm border border-[#dfe5d0] bg-white p-5"
              >
                <p className="text-xs font-black uppercase tracking-[0.2em] text-jvto-green">
                  {card.kicker}
                </p>
                <h3 className="mt-3 text-xl font-black uppercase leading-tight text-jvto-dark">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">{card.copy}</p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={card.primary.href}
                    target={card.primary.external ? "_blank" : undefined}
                    rel={card.primary.external ? "noreferrer" : undefined}
                    className="inline-flex items-center gap-2 bg-jvto-dark px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-black"
                  >
                    {card.primary.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={card.secondary.href}
                    className="inline-flex items-center gap-2 border border-[#ccd6b4] px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-jvto-dark transition-colors hover:bg-[#f7f8f2]"
                  >
                    {card.secondary.label}
                  </Link>
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-sm border border-[#e6ead8] bg-[#f7f8f2] p-4">
                  {card.kicker === "Independent Reviews" ? (
                    <Star className="mt-0.5 h-5 w-5 text-jvto-green" />
                  ) : (
                    <FileCheck2 className="mt-0.5 h-5 w-5 text-jvto-green" />
                  )}
                  <p className="text-sm leading-6 text-gray-600">
                    {card.kicker === "Independent Reviews"
                      ? "Guest praise matters more when it sits next to a source path you can inspect."
                      : "Proof works best when it stays separate from slogans and can be checked directly."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeTrustGateway;
