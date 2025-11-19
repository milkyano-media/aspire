import { Phone, Mail, MapPin } from "lucide-react";
import { FadeInSection } from "./ui/FadeInSection";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-gray-700 bg-[#052e4d] text-white">
      {/* Logo and Tagline */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16 sm:px-6 lg:px-8">
        <div className="space-y-8 lg:space-y-12">
          {/* Logo */}
          <FadeInSection>
            <div className="flex justify-center">
              <div className="text-center max-w-3xl">
                <div className="mb-2 lg:mb-4 flex items-center justify-center gap-2">
                  <Image
                    src="/logo.svg"
                    alt="Aspire Academics Logo"
                    width={82}
                    height={82}
                    className="lg:w-[100px] lg:h-[100px]"
                  />
                </div>
                <p className="text-lg lg:text-xl leading-relaxed">
                  Learning is the process of acquiring new understanding,
                  knowledge, behaviors, skills, values, attitudes, and
                  preferences
                </p>
              </div>
            </div>
          </FadeInSection>

          {/* Contact Us Section */}
          <div className="space-y-6 lg:space-y-8">
            <FadeInSection delay={0.1}>
              <div className="text-center">
                <h3 className="mb-4 text-2xl lg:text-3xl font-semibold">
                  Contact Us
                </h3>
                <div className="mx-auto h-[4px] w-[85px] lg:w-[120px] bg-aspire-orange" />
              </div>
            </FadeInSection>

            {/* Contact Info */}
            <div className="space-y-4 w-fit mx-auto grid justify-start lg:grid-cols-3 lg:gap-12 lg:space-y-0">
              {/* Phone */}
              <FadeInSection delay={0.2}>
                <div className="flex gap-4 lg:flex-col lg:items-center lg:text-center lg:gap-3">
                  <Phone className="h-6 w-6 lg:h-8 lg:w-8 text-aspire-orange" />
                  <a
                    href="tel:+61452092360"
                    className="text-lg lg:text-xl hover:text-aspire-orange transition-colors"
                  >
                    +61 452 092 360
                  </a>
                </div>
              </FadeInSection>

              {/* Email */}
              <FadeInSection delay={0.3}>
                <div className="flex items-center justify-center gap-4 lg:flex-col lg:items-center lg:text-center lg:gap-3">
                  <Mail className="h-6 w-6 lg:h-8 lg:w-8 text-aspire-orange" />
                  <a
                    href="mailto:info@aspireacademics.au"
                    className="text-lg lg:text-xl hover:text-aspire-orange transition-colors"
                  >
                    info@aspireacademics.au
                  </a>
                </div>
              </FadeInSection>

              {/* Address */}
              <FadeInSection delay={0.4}>
                <div className="flex gap-4 lg:flex-col lg:items-center lg:text-center lg:gap-3">
                  <MapPin className="mt-1 lg:mt-0 h-6 w-6 lg:h-8 lg:w-8 text-aspire-orange flex-shrink-0" />
                  <p className="text-lg lg:text-xl">
                    Unit 15, 150 Palmers Road
                    <br />
                    Truganina 3029
                  </p>
                </div>
              </FadeInSection>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-aspire-medium-blue py-[40px] lg:py-[50px] px-[90px]">
        <p className="text-center text-sm lg:text-base font-bold">
          © Copyright 2025 AspireAcademics.au Designed by Milkyano Digital
        </p>
      </div>
    </footer>
  );
}
