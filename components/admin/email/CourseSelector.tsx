"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { WiseLMSCourse } from "@/lib/wiselms/types";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  GraduationCap,
  Users,
  BookOpen,
  Check,
  Loader2,
  X,
} from "lucide-react";

interface CourseSelectorProps {
  courses: WiseLMSCourse[];
  selectedCourseId: string | null;
  onCourseSelect: (courseId: string) => void;
  isLoading?: boolean;
}

const classTypeConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  LIVE: {
    label: "Live",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
  },
  RECORDED: {
    label: "Recorded",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  ONE_TO_ONE: {
    label: "1:1",
    color: "text-violet-700",
    bg: "bg-violet-50 border-violet-200",
  },
};

/**
 * CourseSelector - Modern searchable combobox for course selection
 * Filters courses from WiseLMS that have "Activities" or "VCE" in name
 */
export function CourseSelector({
  courses,
  selectedCourseId,
  onCourseSelect,
  isLoading = false,
}: CourseSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter courses to only show those with "Activities", "VCE", or "Mock" in name
  const studentCourses = useMemo(
    () =>
      courses.filter(
        (course) =>
          course.name.includes("Activities") ||
          course.name.includes("VCE") ||
          course.name.toLowerCase().includes("mock"),
      ),
    [courses],
  );

  // Filter by search query
  const filteredCourses = useMemo(() => {
    if (!search.trim()) return studentCourses;
    const query = search.toLowerCase();
    return studentCourses.filter(
      (course) =>
        course.name.toLowerCase().includes(query) ||
        course.subject?.toLowerCase().includes(query),
    );
  }, [studentCourses, search]);

  // Get the currently selected course object
  const selectedCourse = useMemo(
    () => studentCourses.find((c) => c._id === selectedCourseId) ?? null,
    [studentCourses, selectedCourseId],
  );

  // Focus search input when popover opens
  useEffect(() => {
    if (open) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearch("");
    }
  }, [open]);

  const handleSelect = (courseId: string) => {
    onCourseSelect(courseId);
    setOpen(false);
    setSearch("");
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-[#002366]/70">
          Select Course
        </Label>
        <div className="relative max-w-xl">
          <div className="flex items-center gap-3 w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/80 text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading courses from WiseLMS...</span>
          </div>
          {/* Skeleton shimmer */}
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-[#002366]/70">
        Select Course
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a course"
            className="group relative flex items-center justify-between w-full max-w-xl px-4 py-3 border border-gray-200 rounded-xl bg-white text-left transition-all duration-200 hover:border-[#002366]/30 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#002366]/20 focus:border-[#002366]/40 data-[state=open]:border-[#002366]/40 data-[state=open]:shadow-md data-[state=open]:ring-2 data-[state=open]:ring-[#002366]/20"
          >
            {selectedCourse ? (
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#002366]/5 text-[#002366]">
                  <GraduationCap className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {selectedCourse.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {selectedCourse.subject && (
                      <span className="text-xs text-gray-500">
                        {selectedCourse.subject}
                      </span>
                    )}
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 h-4 font-medium border ${classTypeConfig[selectedCourse.classType]?.bg || ""} ${classTypeConfig[selectedCourse.classType]?.color || "text-gray-600"}`}
                    >
                      {classTypeConfig[selectedCourse.classType]?.label ||
                        selectedCourse.classType}
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-gray-400">
                <Search className="h-4 w-4" />
                <span className="text-sm">Search and select a course...</span>
              </div>
            )}
            <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl border-gray-200 shadow-xl overflow-hidden"
          align="start"
          sideOffset={6}
        >
          {/* Search Input */}
          <div className="relative border-b border-gray-100 bg-gray-50/50">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-3 text-sm bg-transparent outline-none placeholder:text-gray-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Course List */}
          <div className="max-h-[280px] overflow-y-auto overscroll-contain">
            {filteredCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-500">
                  No courses found
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {search
                    ? "Try a different search term"
                    : "No matching courses available"}
                </p>
              </div>
            ) : (
              <div className="py-1.5">
                <AnimatePresence mode="popLayout">
                  {filteredCourses.map((course, index) => {
                    const isSelected = course._id === selectedCourseId;
                    const typeConfig = classTypeConfig[course.classType];
                    const studentCount = course.joinedRequest?.length ?? 0;

                    return (
                      <motion.button
                        key={course._id}
                        type="button"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{
                          duration: 0.15,
                          delay: index * 0.02,
                        }}
                        onClick={() => handleSelect(course._id)}
                        className={`relative flex items-center gap-3 w-full px-3 py-2.5 mx-1.5 rounded-lg text-left transition-colors duration-150 cursor-pointer ${
                          isSelected
                            ? "bg-[#002366]/5"
                            : "hover:bg-gray-50 active:bg-gray-100"
                        }`}
                        style={{
                          width: "calc(100% - 12px)",
                        }}
                      >
                        {/* Course Icon */}
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            isSelected
                              ? "bg-[#002366] text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <GraduationCap className="h-4 w-4" />
                        </div>

                        {/* Course Info */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm truncate ${isSelected ? "font-semibold text-[#002366]" : "font-medium text-gray-800"}`}
                          >
                            {course.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {course.subject && (
                              <span className="text-xs text-gray-500 truncate">
                                {course.subject}
                              </span>
                            )}
                            {typeConfig && (
                              <Badge
                                variant="outline"
                                className={`text-[10px] px-1.5 py-0 h-4 font-medium border ${typeConfig.bg} ${typeConfig.color}`}
                              >
                                {typeConfig.label}
                              </Badge>
                            )}
                            {studentCount > 0 && (
                              <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                                <Users className="h-3 w-3" />
                                {studentCount}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Selected Check */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#002366] text-white"
                          >
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer */}
          {filteredCourses.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-2 bg-gray-50/50">
              <p className="text-[11px] text-gray-400">
                {filteredCourses.length}{" "}
                {filteredCourses.length === 1 ? "course" : "courses"}
                {search ? " matching" : " available"}
              </p>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {!isLoading && studentCourses.length === 0 && (
        <p className="text-sm text-amber-600">
          No courses found with &quot;Activities&quot;, &quot;VCE&quot;, or
          &quot;Mock&quot; in the name. Courses are loaded from WiseLMS.
        </p>
      )}
    </div>
  );
}
