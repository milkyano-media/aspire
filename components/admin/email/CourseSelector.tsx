"use client";

import { WiseLMSCourse } from "@/lib/wiselms/types";
import { Label } from "@/components/ui/label";

interface CourseSelectorProps {
  courses: WiseLMSCourse[];
  selectedCourseId: string | null;
  onCourseSelect: (courseId: string) => void;
  isLoading?: boolean;
}

/**
 * CourseSelector - Dropdown to select courses with "Students" in name
 * Filters courses from WiseLMS that have "Students" (case-sensitive) in name
 */
export function CourseSelector({
  courses,
  selectedCourseId,
  onCourseSelect,
  isLoading = false,
}: CourseSelectorProps) {
  // Filter courses to only show those with "Students" in name
  const studentCourses = courses.filter((course) =>
    course.name.includes("Activities") // Case-sensitive
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = e.target.value;
    if (!courseId) {
      return;
    }

    onCourseSelect(courseId);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label htmlFor="course-select" className="text-sm font-medium">
          Select Course
        </Label>
        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
          Loading courses from WiseLMS...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="course-select" className="text-sm font-medium">
        Select Course
      </Label>
      <select
        id="course-select"
        value={selectedCourseId ?? ""}
        onChange={handleChange}
        disabled={isLoading}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#002366] focus:border-transparent bg-white disabled:bg-gray-50 disabled:text-gray-500"
      >
        <option value="">-- Select a course --</option>
        {studentCourses.length === 0 ? (
          <option value="" disabled>
            No courses with &quot;Students&quot; in name found
          </option>
        ) : (
          studentCourses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.name}
              {course.subject ? ` - ${course.subject}` : ""}
            </option>
          ))
        )}
      </select>
      {!isLoading && studentCourses.length === 0 && (
        <p className="text-sm text-amber-600">
          No courses found with &quot;Students&quot; in the name. Courses are
          loaded from WiseLMS.
        </p>
      )}
    </div>
  );
}
