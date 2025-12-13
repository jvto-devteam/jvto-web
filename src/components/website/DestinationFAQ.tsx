import React from "react";
import { ChevronDown } from "lucide-react";
import { FAQ } from "@/types";

interface FAQItemProps {
  faq: FAQ;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border-b border-ink-neutral-200 dark:border-ink-neutral-700">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left py-4 px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-ink-primary dark:text-white">
          {faq.question}
        </span>

        <ChevronDown
          className={`h-5 w-5 text-ink-neutral-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          aria-hidden="true"
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="pb-4 px-1 text-ink-neutral-700 dark:text-ink-neutral-200">
          <p>{faq.answer}</p>
        </div>
      </div>
    </div>
  );
};

interface DestinationFAQProps {
  faqs: FAQ[];
}

const DestinationFAQ: React.FC<DestinationFAQProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0); // open first by default

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <div className="max-w-3xl">
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          faq={faq}
          isOpen={openIndex === index}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
};

export default DestinationFAQ;
