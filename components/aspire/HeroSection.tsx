import { Button } from "@/components/ui/button";
import { Section } from "./ui/Section";
import { GradientOverlay } from "./ui/GradientOverlay";
import Image from "next/image";
import { FadeInSection } from "./ui/FadeInSection";

export function HeroSection() {
  return (
    <Section variant="dark-blue" className="relative py-12">
      {/* Background gradient decoration */}
      <div className="absolute left-1/2 top-1/2 h-[532px] lg:h-[900px] w-[532px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-white/10 to-transparent opacity-50" />

      <div className="relative z-10 space-y-6">
        {/* Content Frame */}
        <div className="flex flex-col items-center space-y-8 text-center">
          {/* Headline */}
          <FadeInSection delay={0.2} duration={0.8}>
            <h1 className="text-[48px] md:text-7xl text-center font-extrabold leading-[40px] md:leading-[60px] max-w-3xl">
              <span className="text-aspire-orange">
                Tutoring That Gets Real Results
              </span>{" "}
              Not Just Homework Help
            </h1>
          </FadeInSection>

          {/* Arrow decoration */}
          <FadeInSection delay={0.4} direction="down" duration={0.6}>
            <div className="mx-auto flex h-[51px] w-[81px] items-center justify-center">
              <Image
                src="/marketing/hero/arrow.svg"
                alt="decorative arrow"
                width={81}
                height={51}
              />
            </div>
          </FadeInSection>

          {/* Subheading */}
          <FadeInSection delay={0.6} duration={0.8}>
            <p
              className="mx-auto max-w-[367px] text-center text-2xl leading-[29.4px] text-white"
              style={{ fontSize: "24.5px" }}
            >
              <span className="text-aspire-orange font-bold">
                Helping students
              </span>{" "}
              across all core <strong>VCE and high school</strong> subjects,
              right here in <strong>Truganina</strong>. <strong>Book</strong>{" "}
              your <strong>free trial</strong> and meet your{" "}
              <strong>future tutor</strong>.
            </p>
          </FadeInSection>
        </div>

        {/* CTA and Location Info */}
        <FadeInSection delay={0.8} duration={0.6}>
          <div className="flex flex-col items-center space-y-4 pt-8">
            <Button
              size="lg"
              className="h-[58px] w-[224px] rounded-md bg-aspire-orange text-lg font-bold text-white hover:bg-aspire-orange/90"
            >
              Book a Free Class
            </Button>

            <p className="max-w-[367px] text-center text-sm text-white">
              Located at 150 Palmers Rd, Truganina. In-person lessons.
              <br />
              No lock-ins.
            </p>
          </div>
        </FadeInSection>

        {/* Hero Image */}
        <FadeInSection delay={1.0} duration={0.8}>
          <div className="relative mt-8 h-[280px] md:h-[800px] w-full overflow-hidden rounded-lg">
            <Image src={"/marketing/hero/photo-1.png"} alt="Hero Image" fill />
            <div className="absolute inset-0 bg-gradient-to-t from-aspire-dark-blue via-transparent to-transparent" />
            {/* Placeholder for hero image - will be replaced with actual image */}
            <div className="h-full w-full bg-gray-700" />
          </div>
        </FadeInSection>
      </div>
    </Section>
  );
}
