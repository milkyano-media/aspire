import { Section } from "./ui/Section";
import { FileText, Tag } from "lucide-react";
import Image from "next/image";
import { FadeInSection } from "./ui/FadeInSection";

export function AboutSection() {
  return (
    <Section variant="dark-blue" className="py-12">
      <div className="space-y-6 mx-auto max-w-4xl">
        {/* Section Title */}
        <FadeInSection>
          <div className="flex flex-col items-center">
            <h2 className="text-2xl lg:text-4xl font-extrabold text-white">
              At Aspire
            </h2>
            <Image
              src={"/marketing/about/at-aspire-decorative-line.svg"}
              alt="Decorative Line"
              width={150}
              height={15}
              className="mt-[3px] lg:w-[200px]"
            />
          </div>
        </FadeInSection>

        {/* Image with gradient overlay */}
        <FadeInSection delay={0.2} direction="left">
          <div className="flex flex-col lg:flex-row rounded-xl overflow-hidden">
            <div className="relative h-[500px] w-full overflow-hidden">
              {/* Placeholder for image */}
              <div className="absolute inset-0 bg-gray-600">
                <Image
                  src={"/marketing/about/bg-photo-2.png"}
                  alt="About Aspire"
                  fill
                />
              </div>
              {/* Gradient overlay */}
              <div className="h-[100px] z-30 absolute inset-x-0 bg-gradient-to-t from-white via-white/60 to-transparent bottom-0" />
              <div className="flex justify-center">
                <div className="max-w-[430px] absolute bottom-[-20px] lg:bottom-[-15px] mb-auto">
                  <Image
                    src="/marketing/about/photo-2.png"
                    alt="About Aspire"
                    width={1372}
                    height={1480}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8 bg-white p-8 w-[100%]">
              {/* Philosophy Text */}
              <p className="text-center lg:text-left text-sm lg:text-base leading-tight lg:leading-relaxed text-aspire-text-dark">
                We <strong className="text-aspire-blue">believe</strong>{" "}
                tutoring should go beyond worksheets. That's why we offer a
                structured, in-person{" "}
                <strong className="text-aspire-blue">
                  learning experience tailored to each student.
                </strong>{" "}
                Whether it's English, Maths, Science, or general academic
                support, we match students with tutors who understand their
                pace, learning style, and{" "}
                <strong className="text-aspire-blue">goals.</strong>
              </p>

              {/* Feature Badges */}
              <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
                {/* No Hidden Fees */}
                <div className="flex flex-col items-center space-y-1">
                  <FileText className="h-[45px]  w-[45px]  text-aspire-orange" />
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-aspire-blue text-center">
                    No Hidden Fees
                  </h3>
                </div>

                {/* No Confusing Pricing */}
                <div className="flex flex-col items-center space-y-1">
                  <Tag className="h-[45px]  w-[45px] text-aspire-orange" />
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-aspire-blue text-center">
                    No Confusing Pricing
                  </h3>
                </div>

                {/* Separator */}
                <div className="mx-auto h-[1px] w-full lg:w-full lg:col-span-2 bg-aspire-blue" />

                {/* Bottom Text */}
                <p className="text-center lg:text-left text-sm lg:text-base text-aspire-text-dark lg:col-span-2">
                  A physical location in Truganina. <br />
                  <strong className="text-aspire-blue">Aspire</strong> is the
                  smarter way to get tutoring that works.
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </Section>
  );
}
