import Image from "next/image";

const PARTNERS = [
  {
    name: "Trustpilot",
    logo: "/assets/img/icons/trustpilot-icon.webp",
    href: "https://www.trustpilot.com/review/javavolcano-touroperator.com",
    width: 120,
    height: 32,
    meta: "4.8 · 51 verified",
  },
  {
    name: "Tripadvisor",
    logo: "/assets/img/icons/tripadvisor-icon.png",
    href: "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
    width: 120,
    height: 32,
    meta: "4.95 · 21 reviews",
  },
  {
    name: "Google",
    logo: "/assets/img/icons/google-icon.png",
    href: "https://www.google.com/maps?cid=1266403973589689021",
    width: 80,
    height: 28,
    meta: "4.90 · 123 reviews",
  },
  {
    name: "ISIC",
    logo: "/assets/img/icons/isic-logo.png",
    href: "https://www.isic.org/discounts/?providerId=259268",
    width: 60,
    height: 32,
    meta: "Provider 259268",
  },
  {
    name: "Klook",
    logo: "/assets/img/icons/klook-icon.png",
    href: "https://www.klook.com",
    width: 80,
    height: 28,
    meta: "Listed operator",
  },
  {
    name: "Indecon",
    logo: "/assets/img/icons/indecon-logo.png",
    href: "https://www.indecon.id/spotlight-networks/java-volcano-tour-operator",
    width: 100,
    height: 28,
    meta: "Ecotourism-aligned",
  },
] as const;

export default function HomePartners() {
  return (
    <section aria-label="Partners and platforms" className="bg-white py-12 md:py-16 border-t border-jvto-border">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-jvto-muted text-center mb-8">
          Listed &amp; Verified On
        </p>

        <div className="flex flex-wrap items-start justify-center gap-x-10 gap-y-8 md:gap-x-14">
          {PARTNERS.map((partner) => (
            <a
              key={partner.name}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 opacity-50 hover:opacity-90 transition-opacity duration-200 flex-shrink-0"
              title={partner.name}
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                className="h-7 md:h-8 w-auto object-contain"
              />
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-jvto-muted">
                {partner.meta}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
