"use client";

import { CourseListHero } from '@/components/aspire/Courses/CourseListHero';
import { CourseCard } from '@/components/aspire/Courses/CourseCard';
import { Footer } from '@/components/aspire/Footer';
import { SmoothScrollLink } from '@/components/ui/smooth-scroll-link';

const courses = [
  {
    yearLevel: 'Year 3 & 4',
    programName: 'SAP (Selective Achievement Program)',
    description:
      "A customised, intensive program to make sure that your child has a head start with a tailored curriculum for primary students run by accomplished tutors.",
    includes: [
      'Maths and English',
      'Detailed topic booklets',
      'Thousands of questions with worked solutions',
      'Frequent tests and mock exams',
      'Email support outside class hours',
      'Parent communication',
      'Teacher feedback',
    ],
    note: 'Separate classes for Year 3 and Year 4',
  },
  {
    yearLevel: 'Year 5 & 6',
    programName: 'SAP (Selective Achievement Program)',
    description:
      'Concentrates material preparing children for secondary schooling, covering current and next-year content across three disciplines through exams and assessments.',
    includes: [
      'Maths, English, and Science',
      'Detailed topic booklets',
      'Thousands of questions with worked solutions',
      'Frequent tests and mock exams',
      'Email support outside class hours',
      'Parent communication',
      'Teacher feedback',
    ],
    note: 'Separate classes for Year 5 and Year 6',
  },
  {
    yearLevel: 'Year 7',
    programName: 'Selective/Scholarship',
    description:
      'A highly tailored, intensive program for entry into Melbourne Select Entry or Scholarship schools, run by head tutor Deep Bhowmik, covering all examinable areas.',
    includes: [
      'Mathematics, numerical reasoning, reading comprehension, verbal reasoning, writing',
      'Detailed topic booklets',
      'Thousands of questions with worked solutions',
      'Frequent tests and mock exams',
      'Email support',
      '3-hour intensive personalized classes',
      'Head start for selective school entry',
    ],
  },
  {
    yearLevel: 'Year 8',
    programName: 'Selective/Scholarship',
    description:
      'A specially designed, intense curriculum ensuring strong education for Melbourne Select Entry or Scholarship school placement, led by Deep Bhowmik with detailed coverage.',
    includes: [
      'Maths and English',
      'Detailed topic booklets',
      'Thousands of questions with worked solutions',
      'Termly exams',
      'Email support',
      '3-hour classes',
    ],
  },
  {
    yearLevel: 'Year 9',
    programName: 'SAP (Selective Achievement Program)',
    description:
      'Customized curriculum providing accelerated education for individual school courses and VCE preparation, with tailored classes addressing student needs and difficulties.',
    includes: [
      'Maths, English, and Science',
      'Detailed topic booklets',
      'Thousands of questions with worked solutions',
      'Frequent tests and mock exams',
      'Email support',
      'Parent communication',
      'Teacher feedback',
    ],
  },
  {
    yearLevel: 'Year 10',
    programName: 'SAP (Selective Achievement Program)',
    description:
      'Extensively modified course equipping students with tools to achieve optimal VCE results through comprehensive preparation.',
    includes: [
      'Maths and English',
      'Detailed topic booklets',
      'Thousands of questions with worked solutions',
      'Termly exams',
      'Email support',
      '3-hour classes',
    ],
  },
];

export default function CoursesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <CourseListHero />

      {/* About Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-[#070b30] md:text-4xl">
            Why Choose Aspire Academics?
          </h2>
          <p className="mb-4 text-lg leading-relaxed text-[#697585]">
            At Aspire Academics, we believe in{' '}
            <span className="font-semibold text-[#070b30]">
              personalized teaching tailored to your child's unique study needs
            </span>
            . Our programs are designed to build confidence, enhance understanding,
            and develop critical thinking skills.
          </p>
          <p className="text-lg leading-relaxed text-[#697585]">
            Our team consists of graduates from elite Melbourne schools with extensive
            experience in selective school preparation and VCE success. We're committed
            to helping every student reach their full potential.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#070b30] md:text-4xl">
              Our Programs
            </h2>
            <p className="text-lg text-[#697585]">
              Choose the right program for your child's year level
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {courses.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-gradient-to-br from-[#070b30] to-[#0a1045] px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-lg text-white/80">
            Join hundreds of students who have achieved excellence with Aspire
            Academics. Book your free consultation today.
          </p>
          <SmoothScrollLink
            href="/#form"
            className="inline-block rounded-lg bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-lg"
          >
            Enroll Now
          </SmoothScrollLink>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
