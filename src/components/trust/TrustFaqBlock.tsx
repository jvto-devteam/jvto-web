import { trustFaqItems } from "@/lib/trust-bundle";

type Props = {
  heading?: string;
  className?: string;
};

export default function TrustFaqBlock({
  heading = "Trust FAQ",
  className = "",
}: Props) {
  return (
    <section
      data-trust-block="faq"
      className={`bg-jvto-off text-jvto-navy py-12 px-6 md:px-10 ${className}`}
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">{heading}</h2>
        <dl className="space-y-6">
          {trustFaqItems.map((item) => (
            <div
              key={item.source_claim_id}
              className="border-b border-jvto-navy/10 pb-4 last:border-b-0"
            >
              <dt className="font-semibold text-jvto-navy">{item.question}</dt>
              <dd className="mt-2 text-jvto-navy/80">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
