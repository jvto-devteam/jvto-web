const PLATFORMS = [
  { name: "GetYourGuide", href: "https://www.getyourguide.com/java-volcano-tour-operator-s260697/" },
  { name: "Tripadvisor", href: "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html" },
  { name: "Trustpilot", href: "https://www.trustpilot.com/review/javavolcano-touroperator.com" },
  { name: "Google Maps", href: "https://www.google.com/maps?cid=1266403973589689021" },
  { name: "ISIC", href: "https://www.isic.org/discounts/?providerId=259268" },
  { name: "Indecon", href: "https://www.indecon.id/spotlight-networks/java-volcano-tour-operator" },
] as const;

export default function HomeTrustStrip() {
  return (
    <div className="bg-jvto-navy border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-3 flex flex-wrap items-center justify-center md:justify-start gap-x-1.5 gap-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 mr-3 flex-shrink-0">
          Listed on
        </span>
        {PLATFORMS.map(({ name, href }, index) => (
          <span key={name} className="flex items-center gap-1.5">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-white/60 hover:text-white transition-colors"
            >
              {name}
            </a>
            {index < PLATFORMS.length - 1 && (
              <span className="text-white/15 text-xs select-none" aria-hidden="true">·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
