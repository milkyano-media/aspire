import { Section } from "./ui/Section";
import { FadeInSection } from "./ui/FadeInSection";
import Image from "next/image";

export function SubjectsSection() {
  const subjects = [
    {
      title: "English",
      subtitle: "General, Language, Literature",
    },
    {
      title: "Mathematics",
      subtitle: "General, Methods, Specialist",
    },
    {
      title: "Science",
      subtitle: "Biology, Chemistry, Physics",
    },
    {
      title: "Entry",
      subtitle: "Preparation (SEAL, Scholarship Tests)",
    },
    {
      title: "Year 7-10",
      subtitle: "Academic Coaching",
    },
  ];

  return (
    <Section variant="gradient-blue" className="py-12 lg:py-20">
      <div className="space-y-6 lg:space-y-12">
        {/* Section Title */}
        <FadeInSection>
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-2xl lg:text-4xl font-extrabold text-white">
              Subjects We Support
            </h2>
            <Image
              src={"/marketing/decorative-line.svg"}
              alt="Decorative Line"
              width={83}
              height={15}
              className="mt-[-10px] ml-[135px] lg:w-[120px] lg:ml-[200px]"
            />
          </div>
        </FadeInSection>

        {/* Desktop: Two Column Layout */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
          {/* Feature Box with Image */}
          <FadeInSection delay={0.1} direction="left">
            <div className="overflow-hidden rounded-lg bg-aspire-orange">
              <div className="p-6 lg:p-8 text-center">
                <h3 className="text-2xl lg:text-3xl font-extrabold leading-6 lg:leading-8 text-white">
                  We tutor students in Years 7–12 across core VCE and academic
                  subjects:
                </h3>
              </div>
              {/* Placeholder for subjects image */}
              <div className="relative h-[245.8125px] lg:h-[400px] w-full bg-gray-700">
                <Image
                  src={"/marketing/subject/photo-3.png"}
                  alt="Image"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </FadeInSection>

          {/* Subjects List */}
          <FadeInSection delay={0.2} direction="right">
            <div className="space-y-4 pt-4 lg:pt-0">
              {subjects.map((subject, index) => (
                <div
                  key={index}
                  className="border-b border-white p-2 lg:p-4 text-center lg:text-left"
                >
                  <h4 className="text-2xl lg:text-3xl font-extrabold leading-6 text-white">
                    {subject.title}
                  </h4>
                  <p className="text-sm lg:text-base leading-6 text-white">
                    {subject.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </div>
    </Section>
  );
}
