"use client";

import { useState, useEffect } from "react";
import { StudentWithParent } from "@/lib/wiselms/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface StudentSelectionTableProps {
  students: StudentWithParent[];
  onSelectionChange: (parentEmails: string[]) => void;
}

/**
 * StudentSelectionTable - Checkbox table for selecting students
 * Allows admin to select which students' parents will receive emails
 */
export function StudentSelectionTable({
  students,
  onSelectionChange,
}: StudentSelectionTableProps) {
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(
    new Set()
  );

  // Update parent selection whenever selectedStudentIds changes
  useEffect(() => {
    const selectedParentEmails = students
      .filter((student) => selectedStudentIds.has(student.studentId))
      .map((student) => student.parentEmail);

    onSelectionChange(selectedParentEmails);
  }, [selectedStudentIds, students, onSelectionChange]);

  const handleSelectAll = () => {
    if (selectedStudentIds.size === students.length) {
      // Deselect all
      setSelectedStudentIds(new Set());
    } else {
      // Select all
      setSelectedStudentIds(new Set(students.map((s) => s.studentId)));
    }
  };

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudentIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  // Determine select-all checkbox state
  const allSelected = students.length > 0 && selectedStudentIds.size === students.length;
  const someSelected = selectedStudentIds.size > 0 && selectedStudentIds.size < students.length;

  // Checkbox state: true | false | "indeterminate"
  const selectAllCheckboxState = allSelected ? true : someSelected ? "indeterminate" : false;

  if (students.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No students with parent emails found in this course.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {selectedStudentIds.size} of {students.length} parent(s) selected
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
        >
          {allSelected ? "Deselect All" : "Select All"}
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectAllCheckboxState}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all students"
                  />
                </TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Student Email</TableHead>
                <TableHead>Parent Name</TableHead>
                <TableHead>Parent Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.studentId}>
                  <TableCell>
                    <Checkbox
                      checked={selectedStudentIds.has(student.studentId)}
                      onCheckedChange={() =>
                        handleToggleStudent(student.studentId)
                      }
                      aria-label={`Select ${student.studentName}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {student.studentName}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {student.studentEmail}
                  </TableCell>
                  <TableCell className="font-medium">
                    {student.parentName}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {student.parentEmail}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
