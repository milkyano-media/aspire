"use client";

import { useState } from "react";
import { Section } from "./ui/Section";
import { FadeInSection } from "./ui/FadeInSection";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Do you offer online tutoring?",
      answer:
        "No, we focus exclusively on in-person tutoring at our Truganina location. We believe face-to-face learning creates better outcomes.",
    },
    {
      question: "What's the cost?",
      answer:
        "We offer transparent, flat-rate monthly pricing with no hidden fees. Contact us for current rates and package options.",
    },
    {
      question: "Can I meet the tutor before committing?",
      answer:
        "Absolutely! We offer a free trial session so you can meet your tutor and experience our approach before making any commitment.",
    },
  ];

  return (
    <Section variant="light-blue" className="py-12 lg:py-20">
      <div className="space-y-6 lg:space-y-12 max-w-4xl mx-auto">
        {/* Section Title */}
        <FadeInSection>
          <h2 className="text-center text-2xl lg:text-4xl font-bold text-aspire-text-dark">
            Still Have Questions?
          </h2>
        </FadeInSection>

        {/* FAQ List */}
        <div className="space-y-4 lg:space-y-6 w-[calc(100%-6rem)] lg:w-full mx-auto">
          {faqs.map((faq, index) => (
            <FadeInSection key={index} delay={0.1 + index * 0.1}>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full border-b border-gray-300 pb-4 lg:pb-6 text-left transition-all hover:border-aspire-blue"
              >
                <div className="flex items-start justify-between gap-4 lg:gap-6">
                  <p className="flex-1 text-sm lg:text-lg font-bold text-[#01588d]">
                    {faq.question}
                  </p>
                  <ChevronDown
                    className={`h-6 w-6 lg:h-8 lg:w-8 flex-shrink-0 text-[#01588d] transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {openIndex === index && (
                  <p className="mt-2 lg:mt-4 text-sm lg:text-base text-aspire-text-dark leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </button>
            </FadeInSection>
          ))}
        </div>
      </div>
    </Section>
  );
}
