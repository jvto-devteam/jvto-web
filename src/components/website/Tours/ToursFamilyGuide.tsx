import type { TourFamilyMeta } from "@/lib/packages/tourFamily";

interface ToursFamilyGuideProps {
  eyebrow: string;
  title: string;
  copy: string;
  items: TourFamilyMeta[];
}

const ToursFamilyGuide = ({
  eyebrow,
  title,
  copy,
  items,
}: ToursFamilyGuideProps) => {
  if (!items.length) return null;

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-jvto-green">
              {eyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-black uppercase leading-tight text-jvto-dark md:text-4xl">
              {title}
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-gray-600">{copy}</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-[24px] border border-[#dce4c7] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbf1_100%)] p-6 shadow-[0_16px_36px_rgba(35,48,18,0.06)]"
            >
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-jvto-green">
                Route family
              </p>
              <h3 className="mt-3 text-lg font-black uppercase leading-tight text-jvto-dark">
                {item.label}
              </h3>
              <p className="mt-4 text-sm leading-7 text-gray-600">{item.summary}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#dce4c7] bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-jvto-dark">
                  {item.routeOrder}
                </span>
                <span className="rounded-full border border-[#dce4c7] bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-jvto-dark">
                  {item.finishLogic}
                </span>
              </div>

              <div className="mt-5 border-t border-[#e7edd9] pt-5">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-jvto-green">
                  Compare rule
                </p>
                <p className="mt-3 text-sm leading-7 text-gray-600">{item.compareNote}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToursFamilyGuide;
