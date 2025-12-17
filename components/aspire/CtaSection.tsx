"use client";

import { Button } from "@/components/ui/button";
import { Section } from "./ui/Section";
import { FadeInSection } from "./ui/FadeInSection";
import { SmoothScrollLink } from "@/components/ui/smooth-scroll-link";
import { trackCTAClick } from "@/lib/gtm";

interface CtaSectionProps {
  title: string;
  description?: string;
  buttonText?: string;
}

export function CtaSection({
  title,
  description,
  buttonText = "Book a Free Class",
}: CtaSectionProps) {
  return (
    <Section variant="dark-blue" className="py-12 lg:py-20 bg-[#00245C]">
      <FadeInSection>
        <div className="flex flex-col items-center space-y-6 lg:space-y-8 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl lg:text-4xl font-bold leading-tight lg:leading-tight text-white px-4">
            {title}
          </h2>

          {description && (
            <p className="max-w-[278px] lg:max-w-2xl text-center text-sm lg:text-lg leading-[12px] lg:leading-relaxed text-white">
              {description}
            </p>
          )}

          <SmoothScrollLink href="/#form">
            <Button
              size="lg"
              className="h-[58px] lg:h-[70px] w-[224px] lg:w-[280px] rounded-md bg-aspire-orange text-lg lg:text-xl font-bold text-white hover:bg-orange-600 transition-all hover:scale-105"
              onClick={() => trackCTAClick(buttonText, "cta-section")}
            >
              {buttonText}
            </Button>
          </SmoothScrollLink>
        </div>
      </FadeInSection>
    </Section>
  );
}
