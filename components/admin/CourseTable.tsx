"use client";

import { useState } from "react";
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

type CourseWithIncludes = Program & { includes: string[] };

export function CourseTable({
  courses,
}: {
  courses: CourseWithIncludes[];
}) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalKey, setCreateModalKey] = useState(0);
  const [editingCourse, setEditingCourse] =
    useState<CourseWithIncludes | null>(null);
  const [deletingCourse, setDeletingCourse] =
    useState<CourseWithIncludes | null>(null);

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
              <TableHead>ID</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Year Level</TableHead>
              <TableHead>Program Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500">
                  No courses found. Create your first course!
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.id}</TableCell>
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
                          : "bg-blue-100 text-blue-700"
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
