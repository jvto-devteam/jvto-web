import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

type LogoSpec =
  | { kind: "image"; src: string; alt: string; width: number; height: number }
  | { kind: "abbr"; text: string };

interface Partner {
  key: string;
  logo: LogoSpec;
  name: string;
  sub: string;
  href: string;
  external: boolean;
}

const partners: Partner[] = [
  {
    key: "trustpilot",
    logo: { kind: "image", src: "/assets/img/icons/trustpilot-icon.webp", alt: "Trustpilot", width: 26, height: 26 },
    name: "Trustpilot",
    sub: "4.8 ★ · 51 reviews",
    href: "https://www.trustpilot.com/review/javavolcano-touroperator.com",
    external: true,
  },
  {
    key: "hpwki",
    logo: { kind: "abbr", text: "HPWKI" },
    name: "Ijen Guide Association",
    sub: "BBKSDA supervised",
    href: "https://ahu.go.id/sabh/perkumpulan/qrcode/?kode=NjAyNDAxMjczNTEwMTM2MV8wXzA3IEZlYnJ1YXJpIDIwMjRfMjcgSmFudWFyeSAyMDI0",
    external: true,
  },
  {
    key: "isic",
    logo: { kind: "image", src: "/assets/img/icons/isic-logo.png", alt: "ISIC", width: 50, height: 20 },
    name: "Student Discount Partner",
    sub: "Provider ID 259268",
    href: "/isic/student-package",
    external: false,
  },
  {
    key: "indecon",
    logo: { kind: "image", src: "/assets/img/icons/indecon-logo.png", alt: "INDECON", width: 57, height: 20 },
    name: "Ecotourism Network",
    sub: "Spotlight member",
    href: "https://www.indecon.id/spotlight-networks/java-volcano-tour-operator",
    external: true,
  },
];

function PartnerLogo({ logo }: { logo: LogoSpec }) {
  if (logo.kind === "image") {
    return (
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        className="object-contain opacity-60 group-hover:opacity-100 transition-opacity shrink-0"
      />
    );
  }
  return (
    <span className="text-[10px] font-black text-jvto-lime bg-jvto-lime/10 px-1.5 py-0.5 rounded-sm leading-none shrink-0">
      {logo.text}
    </span>
  );
}

type PartnerItemProps = Pick<Partner, "logo" | "name" | "sub">;

function PartnerItem({ logo, name, sub }: PartnerItemProps) {
  return (
    <div className="flex items-center gap-2.5 group">
      <PartnerLogo logo={logo} />
      <div>
        <p className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors leading-none">
          {name}
        </p>
        <p className="text-[9px] text-slate-600 mt-0.5 leading-none">{sub}</p>
      </div>
    </div>
  );
}

export default function TrustBar() {
  return (
    <div className="bg-slate-900 border-t border-slate-800 py-7">
      <div className="container mx-auto px-6">
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-700 text-center mb-5">
          Certified &amp; Partnered With
        </p>
        <div className="flex flex-wrap items-center justify-center gap-y-4 gap-x-6 md:gap-x-0">
          {partners.map((partner, i) => {
            const { key, ...partnerProps } = partner;
            return (
            <Fragment key={key}>
              {i > 0 && (
                <div
                  className="hidden md:block h-6 w-px bg-slate-800 mx-6"
                  aria-hidden
                />
              )}
              {partnerProps.external ? (
                <a href={partnerProps.href} target="_blank" rel="noopener noreferrer">
                  <PartnerItem {...partnerProps} />
                </a>
              ) : (
                <Link href={partnerProps.href}>
                  <PartnerItem {...partnerProps} />
                </Link>
              )}
            </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
