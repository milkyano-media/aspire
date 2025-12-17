import { Section } from "./ui/Section";
import { FadeInSection } from "./ui/FadeInSection";
import Image from "next/image";

export function WhyAspireSection() {
  const benefits = [
    {
      title: "In-Person Learning",
      description: "Real classrooms = better focus, real mentorship.",
    },
    {
      title: "Simple Pricing",
      description: "One flat rate, no surprises.",
    },
    {
      title: "Custom Learning Paths",
      description: "Tailored plans that grow with the student.",
    },
  ];

  return (
    <Section
      variant="gradient-blue-top"
      className="py-12 lg:py-20 bg-[#0144AB]"
    >
      <div className="space-y-6 lg:space-y-12 max-w-5xl mx-auto">
        {/* Section Title */}
        <FadeInSection>
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-2xl lg:text-4xl font-extrabold text-white">
              Why Aspire?
            </h2>
            <Image
              src={"/marketing/decorative-line.svg"}
              alt="decorative line"
              width={80}
              height={20}
              className="mt-[-10px] ml-[45px] lg:w-[120px] lg:ml-[80px]"
            />
          </div>
        </FadeInSection>

        {/* Content Box */}
        <FadeInSection delay={0.1}>
          <div className="overflow-hidden rounded-lg shadow-xl">
            {/* Header */}
            <div className="bg-aspire-blue p-6 lg:p-10">
              <h3 className="text-center text-2xl lg:text-3xl font-extrabold leading-6 lg:leading-9 text-white">
                Why Parents and Students Choose Aspire
              </h3>
            </div>

            {/* Benefits List */}
            <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0 bg-white p-6 lg:p-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center lg:space-y-3">
                  <h4 className="text-lg lg:text-xl font-extrabold leading-5 lg:leading-6 text-aspire-blue">
                    {benefit.title}
                  </h4>
                  <p className="text-sm lg:text-base text-aspire-text-dark">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>
      </div>
    </Section>
  );
}
