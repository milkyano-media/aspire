import { Section } from "./ui/Section";
import { FadeInSection } from "./ui/FadeInSection";
import { NumberedBadge } from "./ui/NumberedBadge";
import Image from "next/image";

export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Book Your Free Trial",
      description: "We'll get in touch to match you with the right tutor.",
    },
    {
      number: 2,
      title: "Meet Your Tutor in Person",
      description:
        "Attend a 1-on-1 session at our Truganina centre. No pressure.",
    },
    {
      number: 3,
      title: "Start Your Learning Plan",
      description: "If it's a good fit, we build a schedule around your goals.",
    },
  ];

  return (
    <Section variant="medium-blue" className="bg-[#0144AB] py-12 lg:py-20">
      <div className="space-y-6 lg:space-y-12 max-w-6xl mx-auto">
        {/* Section Title */}
        <FadeInSection>
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-2xl lg:text-4xl font-extrabold text-white">
              Here's How It Works
            </h2>
            <Image
              src={"/marketing/decorative-line.svg"}
              alt="decorative-line"
              width={100}
              height={20}
              className="mt-[-10px] ml-[150px] lg:w-[140px] lg:ml-[220px]"
            />
          </div>
        </FadeInSection>

        {/* Steps */}
        <div className="space-y-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
          {steps.map((step, index) => (
            <FadeInSection key={step.number} delay={0.1 + index * 0.1}>
              <div className="flex flex-col items-center gap-4 rounded-[10px] bg-white p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow">
                <NumberedBadge number={step.number} className="flex-shrink-0" />
                <div className="flex-1 space-y-3 lg:space-y-4">
                  <h3 className="text-center text-base lg:text-lg font-bold leading-tight text-aspire-blue">
                    {step.title}
                  </h3>
                  <p className="text-center text-sm lg:text-base leading-tight lg:leading-relaxed text-aspire-text-dark">
                    {step.description}
                  </p>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </Section>
  );
}
