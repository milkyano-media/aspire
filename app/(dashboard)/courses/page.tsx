import { CourseListHero } from "@/components/aspire/Courses/CourseListHero";
import { Footer } from "@/components/aspire/Footer";
import { TutorBirdCourseWidget } from "@/components/aspire/TutorBirdCourseWidget";
import { SmoothScrollLink } from "@/components/ui/smooth-scroll-link";
import { getCourses } from "@/lib/db/queries";
import { CoursesClient } from "@/components/aspire/Courses/CoursesClient";

export default async function CoursesPage() {
  let coursesDb;
  try {
    coursesDb = await getCourses();
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new Error(
      `Failed to fetch courses: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const courses = coursesDb.map((course) => ({
    yearLevel: course.yearLevel ?? "",
    programName: course.programName ?? "",
    description: course.description ?? "",
    includes: Array.isArray(course.includes) ? course.includes : [],
    note: course.note ?? "",
    price: course.price ?? "",
    priceUnit: course.priceUnit ?? "",
    tutorBirdScriptUrl: course.tutorBirdScriptUrl ?? "",
    startDate: course.startDate ? String(course.startDate) : null,
    category: course.category ?? null,
  }));

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

      {/* Courses Grid */}
      <section className="bg-white px-4 py-16">
        <div className="mb-8">
          <TutorBirdCourseWidget />
        </div>
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#070b30] md:text-4xl">
              Our Programs
            </h2>
            <p className="text-lg text-[#697585]">
              Choose the right program for your child's year level
            </p>
          </div>

          <CoursesClient courses={courses} />
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
            className="inline-block rounded-lg bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-lg cursor-pointer"
          >
            Enroll Now
          </SmoothScrollLink>
        </div>
      </section>

      <Footer />
    </main>
  );
}
