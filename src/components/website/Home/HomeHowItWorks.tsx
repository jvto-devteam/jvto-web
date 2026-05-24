// src/components/website/Home/HomeHowItWorks.tsx
const STEPS = [
  {
    number: "01",
    title: "Choose Your Route",
    description: "Browse 16 private packages by departure city or destination.",
  },
  {
    number: "02",
    title: "Confirm via WhatsApp",
    description:
      "Message us — we reply within 2 hours. Confirm dates, group size, and pickup.",
  },
  {
    number: "03",
    title: "Meet Your Guide",
    description:
      "Your private guide meets you at your hotel. No terminals, no buses, no strangers.",
  },
] as const;

export default function HomeHowItWorks() {
  return (
    <section aria-labelledby="how-it-works-heading" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-jvto-navy/40 mb-2">
          Process
        </p>
        <h2
          id="how-it-works-heading"
          className="font-black text-3xl md:text-4xl text-jvto-navy mb-12"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          How It Works
        </h2>

        <div className="flex flex-col md:flex-row md:items-start gap-10 md:gap-0">
          {STEPS.map((step, index) => (
            <div key={step.number} className="flex md:flex-col items-start gap-4 md:gap-0 flex-1">
              <div className="flex items-center w-full md:mb-6">
                <div
                  className="w-12 h-12 rounded-full bg-jvto-navy text-white font-black text-lg flex items-center justify-center flex-shrink-0"
                  aria-hidden="true"
                >
                  {step.number}
                </div>
                {index < STEPS.length - 1 && (
                  <div className="hidden md:block flex-1 border-t-2 border-jvto-navy/20 mx-4" />
                )}
              </div>
              <div className="flex-1 md:flex-none md:pr-8">
                <p className="font-black text-jvto-navy text-base mb-1">
                  <span className="sr-only">Step {index + 1}: </span>
                  {step.title}
                </p>
                <p className="text-jvto-navy/60 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
