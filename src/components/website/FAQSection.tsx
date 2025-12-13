"use client";

import React, { useState } from "react";
import { ChevronDown, Copy, Check } from "lucide-react";
import { SectionCopy, FAQ } from "@/types";
import StructuredData from "./StructuredData";

interface FAQItemProps {
  faq: FAQ;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ faq, isOpen, onClick }) => {
  const [copyStatus, setCopyStatus] = useState<"Copy" | "Copied!" | "Copy Failed">(
    "Copy"
  );

  const handleCopy = () => {
    navigator.clipboard
      .writeText(faq.answer)
      .then(() => {
        setCopyStatus("Copied!");
        setTimeout(() => setCopyStatus("Copy"), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        setCopyStatus("Copy Failed");
        setTimeout(() => setCopyStatus("Copy"), 2000);
      });
  };

  return (
    <div className="border-b border-ink-neutral-200 dark:border-ink-neutral-700">
      {/* Question */}
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left py-5 px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-ink-primary dark:text-white">
          {faq.question}
        </span>

        <ChevronDown
          className={`h-5 w-5 text-ink-neutral-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Answer */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="pb-5 px-2 text-ink-neutral-700 dark:text-ink-neutral-200">
          <p>{faq.answer}</p>

          {/* Copy Button */}
          <div className="mt-4 text-right">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-ink-neutral-300 dark:border-ink-neutral-600 text-ink-neutral-500 dark:text-ink-neutral-400 hover:bg-ink-neutral-100 dark:hover:bg-ink-neutral-700 transition-colors"
              aria-live="polite"
            >
              {copyStatus === "Copied!" ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
              {copyStatus}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FAQSectionProps {
  copy: SectionCopy;
  faqs: FAQ[];
  imageUrl?: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({ copy, faqs, imageUrl }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const faqContent = (
    <div>
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

  return (
    <section className="py-12 md:py-24 bg-white dark:bg-background-dark">
      <StructuredData data={faqSchema} />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary font-semibold tracking-wide uppercase">
            {copy.overline}
          </p>
          <h2 className="text-3xl font-bold text-ink-primary dark:text-white mt-1">
            {copy.title}
          </h2>
          <p className="mt-2 text-ink-neutral-500 dark:text-ink-neutral-200 max-w-2xl mx-auto">
            {copy.subhead}
          </p>
        </div>

        {/* Content */}
        {imageUrl ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-6xl mx-auto items-start">
            <div className="lg:col-span-3">{faqContent}</div>
            <div className="lg:col-span-2 hidden lg:block">
              <img
                src={imageUrl}
                alt="A friendly JVTO guide ready to answer your questions"
                className="rounded-2xl shadow-lg w-full h-auto object-cover aspect-[3/4]"
              />
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">{faqContent}</div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
