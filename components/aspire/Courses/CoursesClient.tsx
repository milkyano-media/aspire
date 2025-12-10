"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CourseCard } from "@/components/aspire/Courses/CourseCard";
import { CourseSignupModal } from "@/components/aspire/Courses/CourseSignupModal";

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
}

interface CoursesClientProps {
  courses: Course[];
}

export function CoursesClient({ courses }: CoursesClientProps) {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const router = useRouter();

  const handleCourseApplyClick = (courseIndex: number) => {
    const course = courses[courseIndex];
    const currentDate = new Date();

    // Check if start_date exists and current date is greater than start_date
    if (course.startDate) {
      const startDate = new Date(course.startDate);
      if (currentDate > startDate) {
        // Redirect to /trial
        router.push("/trial");
        return;
      }
    }

    // Otherwise, show modal
    setSelectedCourse(courseIndex);
  };

  const handleModalClose = () => {
    setSelectedCourse(null);
  };

  return (
    <>
      {/* Courses Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {courses.map((course, index) => (
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
