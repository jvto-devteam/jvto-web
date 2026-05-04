import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

const partners = [
  {
    key: "trustpilot",
    image: { src: "/assets/img/icons/trustpilot-icon.webp", alt: "Trustpilot", size: 26 },
    name: "Trustpilot",
    sub: "4.8 ★ · 47+ reviews",
    href: "https://www.trustpilot.com/review/javavolcano-touroperator.com",
    external: true,
  },
  {
    key: "hpwki",
    abbr: "HPWKI",
    name: "Ijen Guide Association",
    sub: "BBKSDA supervised",
    href: "https://ahu.go.id/sabh/perkumpulan/qrcode/?kode=NjAyNDAxMjczNTEwMTM2MV8wXzA3IEZlYnJ1YXJpIDIwMjRfMjcgSmFudWFyeSAyMDI0",
    external: true,
  },
  {
    key: "isic",
    abbr: "ISIC",
    name: "Student Discount Partner",
    sub: "Provider ID 259268",
    href: "/isic/student-package",
    external: false,
  },
  {
    key: "indecon",
    abbr: "INDECON",
    name: "Ecotourism Network",
    sub: "Spotlight member",
    href: "https://www.indecon.id/spotlight-networks/java-volcano-tour-operator",
    external: true,
  },
] as const;

function PartnerItem(p: (typeof partners)[number]) {
  return (
    <div className="flex items-center gap-2.5 group">
      {"image" in p ? (
        <Image
          src={p.image.src}
          alt={p.image.alt}
          width={p.image.size}
          height={p.image.size}
          className="object-contain opacity-60 group-hover:opacity-100 transition-opacity"
        />
      ) : (
        <span className="text-[10px] font-black text-jvto-green bg-jvto-green/10 px-1.5 py-0.5 rounded-sm leading-none shrink-0">
          {p.abbr}
        </span>
      )}
      <div>
        <p className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors leading-none">
          {p.name}
        </p>
        <p className="text-[9px] text-slate-600 mt-0.5 leading-none">{p.sub}</p>
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
          {partners.map((p, i) => (
            <Fragment key={p.key}>
              {i > 0 && (
                <div
                  className="hidden md:block h-6 w-px bg-slate-800 mx-6"
                  aria-hidden
                />
              )}
              {p.external ? (
                <a href={p.href} target="_blank" rel="noopener noreferrer">
                  <PartnerItem {...p} />
                </a>
              ) : (
                <Link href={p.href}>
                  <PartnerItem {...p} />
                </Link>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
