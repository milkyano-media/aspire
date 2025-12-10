"use client";

import { Footer } from "@/components/aspire/Footer";
import { TutorBirdCourseWidget } from "@/components/aspire/TutorBirdCourseWidget";
import { SmoothScrollLink } from "@/components/ui/smooth-scroll-link";
import Link from "next/link";

export default function TrialPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#070b30] via-[#0a1045] to-[#070b30] px-4 py-20 text-white">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-white/70 transition-colors hover:text-white"
            >
              Home
            </Link>
            <span className="text-white/50">/</span>
            <span className="text-white">Trial Class Sign-Up</span>
          </div>

          {/* Page Title */}
          <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
            Book Your Trial Class
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-lg text-white/80">
            Experience our teaching excellence firsthand. Sign up for a trial
            class and discover how Aspire Academics can help your child achieve
            their academic goals.
          </p>
        </div>
      </section>

      {/* Trial Sign-Up Form Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#070b30] md:text-4xl">
              Start Your Learning Journey Today
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[#697585]">
              Fill out the form below to register for your trial class. Our team
              will contact you shortly to confirm your booking and answer any
              questions you may have.
            </p>
          </div>

          {/* TutorBird Form */}
          <div className="mx-auto max-w-4xl">
            <TutorBirdCourseWidget />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-[#070b30] md:text-4xl">
            What to Expect in Your Trial Class
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Benefit 1 */}
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                  <svg
                    className="h-8 w-8 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#070b30]">
                Expert Teaching
              </h3>
              <p className="text-[#697585]">
                Experience our proven teaching methods with accomplished tutors
                from elite Melbourne schools.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                  <svg
                    className="h-8 w-8 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#070b30]">
                Personalized Assessment
              </h3>
              <p className="text-[#697585]">
                We'll assess your child's current level and identify areas for
                improvement to create a tailored learning plan.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                  <svg
                    className="h-8 w-8 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#070b30]">
                Meet Our Community
              </h3>
              <p className="text-[#697585]">
                Join hundreds of students who have achieved excellence through
                our comprehensive programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-[#070b30] md:text-4xl">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold text-[#070b30]">
                What should my child bring to the trial class?
              </h3>
              <p className="text-[#697585]">
                Just bring a notebook, pen, and a willingness to learn! We'll
                provide all the necessary materials and resources for the trial
                class.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold text-[#070b30]">
                How long is the trial class?
              </h3>
              <p className="text-[#697585]">
                Trial classes are typically 60-90 minutes, depending on the
                program. This gives us enough time to assess your child's level
                and showcase our teaching methodology.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold text-[#070b30]">
                When will I hear back after signing up?
              </h3>
              <p className="text-[#697585]">
                Our team will contact you within 24 hours to schedule your trial
                class at a time that works best for you and your child.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#070b30] to-[#0a1045] px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Have Questions?
          </h2>
          <p className="mb-8 text-lg text-white/80">
            If you have any questions about our trial classes or programs, we're
            here to help. Book a consultation or explore our courses.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <SmoothScrollLink
              href="/#form"
              className="inline-block rounded-lg bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-lg cursor-pointer"
            >
              Book Consultation
            </SmoothScrollLink>
            <Link
              href="/courses"
              className="inline-block rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-[#070b30]"
            >
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
