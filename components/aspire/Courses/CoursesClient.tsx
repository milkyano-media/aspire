"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CourseCard } from "@/components/aspire/Courses/CourseCard";
import { CourseSignupModal } from "@/components/aspire/Courses/CourseSignupModal";
import { Button } from "@/components/ui/button";

interface Course {
  yearLevel: string;
  programName: string;
  description: string;
  includes: string[];
  note?: string;
  price?: string;
  priceUnit?: string;
  tutorBirdScriptUrl?: string;
  startDate?: string | null;
  category?: string | null;
}

interface CoursesClientProps {
  courses: Course[];
}

type PackageFilter = "STANDARD" | "PREMIUM" | "VCE";

export function CoursesClient({ courses }: CoursesClientProps) {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedPackages, setSelectedPackages] = useState<Set<PackageFilter>>(
    new Set()
  );
  const router = useRouter();

  const handleCourseApplyClick = (courseIndex: number) => {
    const course = filteredCourses[courseIndex];
    const originalIndex = courses.findIndex(
      (c) =>
        c.programName === course.programName && c.yearLevel === course.yearLevel
    );
    const originalCourse = courses[originalIndex];
    const currentDate = new Date();

    // Check if start_date exists and current date is greater than start_date
    if (originalCourse.startDate) {
      const startDate = new Date(originalCourse.startDate);
      if (currentDate > startDate) {
        // Redirect to /trial
        router.push("/trial");
        return;
      }
    }

    // Otherwise, show modal
    setSelectedCourse(originalIndex);
  };

  const handleModalClose = () => {
    setSelectedCourse(null);
  };

  const togglePackage = (packageType: PackageFilter) => {
    setSelectedPackages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(packageType)) {
        newSet.delete(packageType);
      } else {
        newSet.add(packageType);
      }
      return newSet;
    });
  };

  // Filter courses based on selected packages
  const filteredCourses =
    selectedPackages.size === 0
      ? courses
      : courses.filter((course) => {
          const category = course.category?.toUpperCase();
          return selectedPackages.has(category as PackageFilter);
        });

  return (
    <>
      {/* Package Filter Button Group */}
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {(["STANDARD", "PREMIUM", "VCE"] as const).map((packageType) => (
          <Button
            key={packageType}
            onClick={() => togglePackage(packageType)}
            variant={selectedPackages.has(packageType) ? "default" : "outline"}
            size="lg"
            className={`transition-all ${
              selectedPackages.has(packageType)
                ? "bg-[#070b30] text-white hover:bg-[#070b30]/90"
                : "border-[#070b30]/20 text-[#070b30] hover:bg-[#070b30]/5"
            }`}
          >
            {packageType}
          </Button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {filteredCourses.map((course, index) => (
          <CourseCard
            key={index}
            {...course}
            courseIndex={index}
            onApplyClick={handleCourseApplyClick}
          />
        ))}
      </div>

      {/* Course Signup Modal */}
      {selectedCourse !== null &&
        courses[selectedCourse].tutorBirdScriptUrl && (
          <CourseSignupModal
            isOpen={true}
            courseTitle={courses[selectedCourse].programName}
            tutorBirdScriptUrl={courses[selectedCourse].tutorBirdScriptUrl}
            onClose={handleModalClose}
          />
        )}
    </>
  );
}
