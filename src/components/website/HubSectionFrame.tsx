import { ReactNode } from "react";

interface HubSectionFrameProps {
  eyebrow: string;
  title: string;
  description: string;
  tone?: "light" | "dark";
  children: ReactNode;
}

const toneClassMap = {
  light: {
    section:
      "border-y border-stone-200 bg-[linear-gradient(180deg,#ffffff_0%,#f7f8f3_100%)]",
    eyebrow: "text-lime-700",
    title: "text-stone-950",
    description: "text-stone-600",
    panel: "border-stone-200 bg-white",
  },
  dark: {
    section:
      "border-y border-stone-800 bg-[linear-gradient(180deg,#111111_0%,#171717_100%)]",
    eyebrow: "text-lime-300",
    title: "text-white",
    description: "text-stone-300",
    panel: "border-white/10 bg-white/5",
  },
} as const;

const HubSectionFrame = ({
  eyebrow,
  title,
  description,
  tone = "light",
  children,
}: HubSectionFrameProps) => {
  const toneClasses = toneClassMap[tone];

  return (
    <section className={toneClasses.section}>
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 lg:py-16">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="max-w-3xl">
            <p className={`text-xs font-bold uppercase tracking-[0.18em] ${toneClasses.eyebrow}`}>
              {eyebrow}
            </p>
            <h2 className={`mt-2 text-3xl font-black tracking-tight md:text-4xl ${toneClasses.title}`}>
              {title}
            </h2>
          </div>
          <p className={`max-w-2xl text-base leading-7 ${toneClasses.description}`}>
            {description}
          </p>
        </div>

        <div className={`rounded-[28px] border p-2 shadow-[0_24px_60px_rgba(15,23,0,0.08)] ${toneClasses.panel}`}>
          <div className="rounded-[22px] border border-black/5 bg-inherit p-3 md:p-4">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HubSectionFrame;
