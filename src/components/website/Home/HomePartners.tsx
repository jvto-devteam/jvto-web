import Image from "next/image";

const PARTNERS = [
  {
    name: "Trustpilot",
    logo: "/assets/img/icons/trustpilot-icon.webp",
    href: "https://www.trustpilot.com/review/javavolcano-touroperator.com",
    width: 120,
    height: 32,
  },
  {
    name: "Tripadvisor",
    logo: "/assets/img/icons/tripadvisor-icon.png",
    href: "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
    width: 120,
    height: 32,
  },
  {
    name: "Google",
    logo: "/assets/img/icons/google-icon.png",
    href: "https://www.google.com/maps?cid=1266403973589689021",
    width: 80,
    height: 28,
  },
  {
    name: "ISIC",
    logo: "/assets/img/icons/isic-logo.png",
    href: "https://www.isic.org/discounts/?providerId=259268",
    width: 60,
    height: 32,
  },
  {
    name: "Klook",
    logo: "/assets/img/icons/klook-icon.png",
    href: "https://www.klook.com",
    width: 80,
    height: 28,
  },
  {
    name: "Indecon",
    logo: "/assets/img/icons/indecon-logo.png",
    href: "https://www.indecon.id/spotlight-networks/java-volcano-tour-operator",
    width: 100,
    height: 28,
  },
] as const;

export default function HomePartners() {
  return (
    <section aria-label="Partners and platforms" className="bg-white py-12 md:py-16 border-t border-jvto-border">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-jvto-muted text-center mb-8">
          Listed &amp; Verified On
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14">
          {PARTNERS.map((partner) => (
            <a
              key={partner.name}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-40 hover:opacity-80 transition-opacity duration-200 flex-shrink-0"
              title={partner.name}
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                className="h-7 md:h-8 w-auto object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
