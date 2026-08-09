import Image from "next/image";
import Section from "@/components/design/Section";

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

// PKG-11a: the whole tile used to sit at opacity-50, which dragged the meta
// line (a real rating figure) to roughly 2.4:1. The restraint now lives on the
// logo alone — grayscale + partial opacity, resolving on hover/focus — while
// the figures stay at full-strength mono.
export default function HomePartners() {
  return (
    <Section
      surface="off"
      density="band"
      label="Partners and platforms"
      className="border-t border-jvto-border"
    >
      <p className="mb-10 text-center font-mono text-[10px] font-bold tracking-[0.22em] text-jvto-ink-soft uppercase">
        Listed &amp; Verified On
      </p>

      <ul className="flex flex-wrap items-start justify-center gap-x-10 gap-y-8 md:gap-x-14">
        {PARTNERS.map((partner) => (
          <li key={partner.name} className="flex-shrink-0">
            <a
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              className="jvto-focus group flex flex-col items-center gap-2.5 rounded-sm px-2 py-1"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                className="h-7 w-auto object-contain opacity-60 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0 md:h-8"
              />
              <span className="font-mono text-[9px] font-bold tracking-[0.15em] text-jvto-ink-soft uppercase">
                {partner.meta}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
