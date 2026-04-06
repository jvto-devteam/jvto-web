import { Activity, FileCheck2, ShieldCheck, Stethoscope } from "lucide-react";

const differentiators = [
  {
    title: "Police Leadership",
    copy: "Founded and led with Tourist Police context, not anonymous outsourced branding.",
    Icon: ShieldCheck,
  },
  {
    title: "Medical Protocols",
    copy: "Ijen routes connect to real screening guidance before night ascent decisions are made.",
    Icon: Stethoscope,
  },
  {
    title: "Proof Before Payment",
    copy: "Verification, policy, and operator identity stay visible before deposit decisions.",
    Icon: FileCheck2,
  },
  {
    title: "Private Route Handling",
    copy: "Pickup logic, longer transfers, and route seriousness are built around private operations.",
    Icon: Activity,
  },
] as const;

const HomeDifferentiators = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {differentiators.map(({ title, copy, Icon }) => (
            <article
              key={title}
              className="rounded-[28px] border border-[#e7ebdd] bg-[#f8faf4] p-7"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-safety-orange shadow-[0_10px_20px_rgba(15,23,42,0.06)]">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-6 text-xl font-black uppercase tracking-tight text-authority-navy">
                {title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#5d6a5a]">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeDifferentiators;
