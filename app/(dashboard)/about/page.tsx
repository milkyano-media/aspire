"use client";

import { AboutUsHero } from "@/components/aspire/About/AboutUsHero";
import { TutorGallery } from "@/components/aspire/About/TutorGallery";
import { Footer } from "@/components/aspire/Footer";
import Image from "next/image";
import { Star } from "lucide-react";
import { SmoothScrollLink } from "@/components/ui/smooth-scroll-link";
import { trackCTAClick } from "@/lib/gtm";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <AboutUsHero />

      {/* About Us Description */}
      <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-6 text-3xl font-bold text-[#070b30] md:text-4xl">
              About Us
            </h2>
            <div className="mx-auto mb-4 h-1 w-20 bg-orange-500" />
          </div>
          <p className="text-center text-lg leading-relaxed text-[#697585]">
            The Aspire Education team consists exclusively of highly
            accomplished former select-entry students, representing the top 1%
            of VCE candidates from prestigious institutions such as{" "}
            <span className="font-semibold text-[#070b30]">
              Melbourne High School, Nossal, Suzanne Cory, and MacRobertson
              Girls High School
            </span>
            .
          </p>
        </div>
      </section>

      {/* Google Rating Section */}
      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center space-x-3 rounded-full bg-gradient-to-r from-orange-500/10 to-orange-500/5 px-8 py-4">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-6 w-6 fill-orange-500 text-orange-500"
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-[#070b30]">5.0</span>
            <span className="text-lg text-[#697585]">Google Rating</span>
          </div>
        </div>
      </section>

      {/* We Believe Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            {/* Image */}
            <div className="relative h-[300px] overflow-hidden rounded-2xl bg-gray-200 shadow-xl md:h-[400px]">
              <div className="flex h-full items-center justify-center text-gray-400">
                <Image
                  src="/marketing/about/about1.webp"
                  alt="We Believe"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Text Content */}
            <div>
              <h2 className="mb-4 text-3xl font-bold text-[#070b30] md:text-4xl">
                We Believe
              </h2>
              <div className="mb-6 h-1 w-16 bg-orange-500" />
              <p className="text-lg leading-relaxed text-[#697585]">
                At Aspire, we ensure the highest quality education. Our tutors
                boast{" "}
                <span className="font-semibold text-[#070b30]">
                  ATAR scores above 99.00
                </span>
                , placing them in the top 1% statewide, and have achieved a
                minimum of{" "}
                <span className="font-semibold text-[#070b30]">
                  5 superior scores on the select-entry ACER test
                </span>
                , solidifying their status as the best in the state.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Aim Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            {/* Text Content - Reversed order on desktop */}
            <div className="md:order-2">
              <h2 className="mb-4 text-3xl font-bold text-[#070b30] md:text-4xl">
                Our Aim
              </h2>
              <div className="mb-6 h-1 w-16 bg-orange-500" />
              <p className="text-lg leading-relaxed text-[#697585]">
                In overview, our aim at Aspire does not merely end at the entry
                into Melbourne's top Selective Entry Schools, but to{" "}
                <span className="font-semibold text-[#070b30]">
                  excel far beyond the entry requirements
                </span>{" "}
                and to finish as high achievers from any school, irrespective of
                Select entry or not. With{" "}
                <span className="font-semibold text-[#070b30]">
                  personalised teaching to best fit your child's study
                  requirements
                </span>
                , we Aspire to produce the brightest stars both in and outside
                of the classroom.
              </p>
            </div>

            {/* Image */}
            <div className="relative h-[300px] overflow-hidden rounded-2xl bg-gray-200 shadow-xl md:order-1 md:h-[400px]">
              <div className="flex h-full items-center justify-center text-gray-400">
                <Image
                  src="/marketing/about/about2.webp"
                  alt="Our Aim"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-gradient-to-br from-[#070b30] to-[#0a1045] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <blockquote className="text-2xl font-medium italic leading-relaxed text-white md:text-3xl">
            "Learning is the process of acquiring new understanding, knowledge,
            behaviors, skills, values, attitudes, and preferences"
          </blockquote>
        </div>
      </section>

      {/* Meet Your Tutor Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#070b30] md:text-4xl">
              Meet Your Tutor
            </h2>
            <div className="mx-auto mb-4 h-1 w-20 bg-orange-500" />
            <p className="text-lg text-[#697585]">
              Our team of highly qualified educators
            </p>
          </div>

          {/* Tutor Gallery Grid */}
          <TutorGallery />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Ready to Join Aspire?
          </h2>
          <p className="mb-8 text-lg text-white/90">
            Experience the difference that expert tutoring can make. Book your
            free trial today.
          </p>
          <SmoothScrollLink
            href="/#form"
            className="inline-block rounded-lg bg-white px-8 py-4 text-lg font-semibold text-orange-500 transition-all duration-300 hover:bg-gray-100 hover:shadow-lg cursor-pointer"
            onClick={() => trackCTAClick("Book Free Trial", "about-page-cta")}
          >
            Book Free Trial
          </SmoothScrollLink>
        </div>
      </section>

      <Footer />
    </main>
  );
}
