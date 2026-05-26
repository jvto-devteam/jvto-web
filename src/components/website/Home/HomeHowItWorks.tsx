const STEPS = [
  {
    number: "01",
    title: "Choose Your Package",
    description:
      "Browse 16 private routes by departure city. Surabaya or Bali, 1 to 6 days.",
  },
  {
    number: "02",
    title: "Book Online",
    description:
      "Select dates, complete checkout, and pay your deposit. Takes under 5 minutes.",
  },
  {
    number: "03",
    title: "We Pick You Up",
    description:
      "Your private guide and vehicle arrive at your hotel. No terminals, no shared groups.",
  },
] as const;

export default function HomeHowItWorks() {
  return (
    <section aria-labelledby="how-it-works-heading" className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-jvto-muted mb-2">
          Process
        </p>
        <h2
          id="how-it-works-heading"
          className="font-black text-2xl md:text-3xl text-jvto-navy mb-12 md:mb-16"
        >
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {STEPS.map((step, index) => (
            <div key={step.number} className="flex md:flex-col gap-4 md:gap-0">
              <div className="flex items-center flex-shrink-0 md:mb-5">
                <span
                  className="text-4xl md:text-5xl font-black text-jvto-navy/10 leading-none"
                  aria-hidden="true"
                >
                  {step.number}
                </span>
                {index < STEPS.length - 1 && (
                  <div className="hidden md:block flex-1 border-t border-jvto-navy/10 ml-4" />
                )}
              </div>
              <div>
                <p className="font-bold text-jvto-navy text-sm md:text-base mb-1.5">
                  <span className="sr-only">Step {index + 1}: </span>
                  {step.title}
                </p>
                <p className="text-jvto-muted text-sm leading-relaxed max-w-xs">
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
