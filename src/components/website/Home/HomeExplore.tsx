import Image from "next/image";
import Link from "@/components/website/AppLink";

const TILES = [
  {
    title: "Destinations",
    subtitle: "Bromo, Ijen, Tumpak Sewu & more",
    href: "/destinations",
    image: "/assets/img/hero/ijen.jpg",
  },
  {
    title: "Travel Guide",
    subtitle: "Packing, fitness & what to expect",
    href: "/travel-guide",
    image: "/assets/img/hero/surabaya.jpg",
  },
  {
    title: "Our Team",
    subtitle: "14 crew, 7 guides, 7 drivers",
    href: "/why-jvto/our-team",
    image: "/assets/img/hero/home.webp",
  },
  {
    title: "Verify JVTO",
    subtitle: "Licences, credentials & press",
    href: "/verify-jvto",
    image: "/assets/img/hero/bali.jpg",
  },
  {
    title: "Student Deals",
    subtitle: "ISIC-verified discounts",
    href: "/student-deals",
    image: "/assets/img/hero/home-lite.webp",
  },
] as const;

export default function HomeExplore() {
  return (
    <section aria-labelledby="explore-heading" className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-jvto-muted mb-2">
          Explore
        </p>
        <h2
          id="explore-heading"
          className="font-black text-2xl md:text-3xl text-jvto-navy mb-10"
        >
          More to Discover
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-[180px] gap-3">
          {TILES.map((tile, i) => (
            <Link
              key={tile.title}
              href={tile.href}
              className={`group relative rounded-sm overflow-hidden ${i === 0 ? "sm:row-span-2" : ""}`}
            >
              <Image
                src={tile.image}
                alt={tile.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-jvto-navy/80 via-jvto-navy/30 to-jvto-navy/10 group-hover:from-jvto-navy/90 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white font-black text-base md:text-lg leading-tight mb-0.5">
                  {tile.title}
                </p>
                <p className="text-white/60 text-xs">
                  {tile.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
