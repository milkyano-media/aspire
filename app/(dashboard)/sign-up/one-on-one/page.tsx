"use client";

import { Footer } from "@/components/aspire/Footer";
import { TutorBirdOneOnOneWidget } from "@/components/aspire/TutorBirdOneOnOneWidget";

export default function OneOnOneSignUpPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#070b30] to-[#0a1045] px-4 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
            One-on-One Tutoring
          </h1>
          <p className="text-lg text-white/90 md:text-xl">
            Personalized tutoring tailored to your learning needs
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-[#070b30] md:text-4xl">
            Personalized Learning Experience
          </h2>
          <p className="mb-4 text-lg leading-relaxed text-[#697585]">
            Our{" "}
            <span className="font-semibold text-[#070b30]">
              one-on-one tutoring program
            </span>{" "}
            provides individualized attention and customized lesson plans
            designed specifically for your learning style and goals.
          </p>
        </div>
      </section>

      {/* TutorBird Widget Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <TutorBirdOneOnOneWidget />
        </div>
      </section>

      <Footer />
    </main>
  );
}
