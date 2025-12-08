"use client";

import { CourseListHero } from "@/components/aspire/Courses/CourseListHero";
import { Footer } from "@/components/aspire/Footer";
import { TutorBirdCourseWidget } from "@/components/aspire/TutorBirdCourseWidget";

export default function CoursesPage() {
  return (
    <main className="min-h-screen">
      <CourseListHero />

      {/* About Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-[#070b30] md:text-4xl">
            Why Choose Aspire Academics?
          </h2>
          <p className="mb-4 text-lg leading-relaxed text-[#697585]">
            At Aspire Academics, we believe in{" "}
            <span className="font-semibold text-[#070b30]">
              personalized teaching tailored to your child's unique study needs
            </span>
            . Our programs are designed to build confidence, enhance
            understanding, and develop critical thinking skills.
          </p>
          <p className="text-lg leading-relaxed text-[#697585]">
            Our team consists of graduates from elite Melbourne schools with
            extensive experience in selective school preparation and VCE
            success. We're committed to helping every student reach their full
            potential.
          </p>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <TutorBirdCourseWidget />
        </div>
      </section>

      <Footer />
    </main>
  );
}
