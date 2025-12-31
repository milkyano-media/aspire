"use client";

import { useState, useMemo } from "react";
import { Program } from "@/lib/db/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CourseFormModal } from "./CourseFormModal";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

type CourseWithIncludes = Omit<Program, "includes"> & { includes: string[] };

type SortField = "courseOrder" | "category" | "price" | "startDate";
type SortDirection = "asc" | "desc" | null;

export function CourseTable({ courses }: { courses: CourseWithIncludes[] }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalKey, setCreateModalKey] = useState(0);
  const [editingCourse, setEditingCourse] = useState<CourseWithIncludes | null>(
    null,
  );
  const [deletingCourse, setDeletingCourse] =
    useState<CourseWithIncludes | null>(null);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedCourses = useMemo(() => {
    if (!sortField || !sortDirection) {
      return courses;
    }

    return [...courses].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "courseOrder":
          aValue = a.courseOrder ?? Number.MAX_SAFE_INTEGER;
          bValue = b.courseOrder ?? Number.MAX_SAFE_INTEGER;
          break;
        case "category":
          aValue = a.category ?? "";
          bValue = b.category ?? "";
          break;
        case "price":
          aValue = a.price ?? 0;
          bValue = b.price ?? 0;
          break;
        case "startDate":
          aValue = a.startDate ? new Date(a.startDate).getTime() : 0;
          bValue = b.startDate ? new Date(b.startDate).getTime() : 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [courses, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    return <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Courses</h2>
        <Button
          onClick={() => {
            setCreateModalKey((prev) => prev + 1);
            setIsCreateModalOpen(true);
          }}
        >
          Create Course
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("courseOrder")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Order
                  <SortIcon field="courseOrder" />
                </Button>
              </TableHead>
              <TableHead>Year Level</TableHead>
              <TableHead>Program Name</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("category")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Category
                  <SortIcon field="category" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("price")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Price
                  <SortIcon field="price" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("startDate")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Start Date
                  <SortIcon field="startDate" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  No courses found. Create your first course!
                </TableCell>
              </TableRow>
            ) : (
              sortedCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.courseOrder ?? "-"}</TableCell>
                  <TableCell>{course.yearLevel}</TableCell>
                  <TableCell>{course.programName}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                        course.category === "PREMIUM"
                          ? "bg-orange-100 text-orange-700"
                          : course.category === "VCE"
                            ? "bg-purple-100 text-purple-700"
                            : course.category === "SELECTIVE ENTRY"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {course.category || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {course.price} {course.priceUnit}
                  </TableCell>
                  <TableCell>
                    {course.startDate
                      ? new Date(course.startDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCourse(course)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeletingCourse(course)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CourseFormModal
        key={`create-${createModalKey}`}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        course={null}
      />

      <CourseFormModal
        key={editingCourse?.id || "edit"}
        isOpen={!!editingCourse}
        onClose={() => setEditingCourse(null)}
        course={editingCourse}
      />

      <DeleteConfirmDialog
        key={deletingCourse?.id || "delete"}
        isOpen={!!deletingCourse}
        onClose={() => setDeletingCourse(null)}
        course={deletingCourse}
      />
    </div>
  );
}
