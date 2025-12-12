"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Program } from "@/lib/db/schema";

interface CourseFormProps {
  course?: (Omit<Program, 'includes'> & { includes: string[] }) | null;
  isPending: boolean;
  error?: string;
}

export function CourseForm({ course, isPending, error }: CourseFormProps) {
  return (
    <div className="space-y-4">
      {/* Hidden ID for edit mode */}
      {course && <input type="hidden" name="id" value={course.id} />}

      {/* Course Order */}
      <div>
        <Label htmlFor="courseOrder">Display Order</Label>
        <Input
          id="courseOrder"
          name="courseOrder"
          type="number"
          defaultValue={course?.courseOrder?.toString() || ""}
          placeholder="e.g., 1, 2, 3..."
          disabled={isPending}
        />
        <p className="mt-1 text-sm text-gray-500">
          Controls the order courses appear on the public page (lower numbers first)
        </p>
      </div>

      {/* Year Level */}
      <div>
        <Label htmlFor="yearLevel">Year Level</Label>
        <Input
          id="yearLevel"
          name="yearLevel"
          defaultValue={course?.yearLevel || ""}
          placeholder="e.g., Year 3"
          disabled={isPending}
        />
      </div>

      {/* Program Name */}
      <div>
        <Label htmlFor="programName">
          Program Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="programName"
          name="programName"
          defaultValue={course?.programName || ""}
          placeholder="e.g., SAP (Selective Achievement Program)"
          required
          disabled={isPending}
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          defaultValue={course?.description || ""}
          placeholder="Brief description of the course..."
          disabled={isPending}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Includes (semicolon-separated) */}
      <div>
        <Label htmlFor="includes">
          What's Included (separate with semicolons)
        </Label>
        <textarea
          id="includes"
          name="includes"
          defaultValue={course?.includes.join(";") || ""}
          placeholder="e.g., Maths and English;Detailed topic booklets;Frequent tests"
          disabled={isPending}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <p className="mt-1 text-sm text-gray-500">
          Separate each item with a semicolon (;)
        </p>
      </div>

      {/* Note */}
      <div>
        <Label htmlFor="note">Note</Label>
        <Input
          id="note"
          name="note"
          defaultValue={course?.note || ""}
          placeholder="e.g., Separate classes for Year 5 and Year 6"
          disabled={isPending}
        />
      </div>

      {/* Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            defaultValue={course?.price || ""}
            placeholder="e.g., $450"
            disabled={isPending}
          />
        </div>
        <div>
          <Label htmlFor="priceUnit">Price Unit</Label>
          <Input
            id="priceUnit"
            name="priceUnit"
            defaultValue={course?.priceUnit || ""}
            placeholder="e.g., per term"
            disabled={isPending}
          />
        </div>
      </div>

      {/* TutorBird Script URL */}
      <div>
        <Label htmlFor="tutorBirdScriptUrl">TutorBird Script URL</Label>
        <Input
          id="tutorBirdScriptUrl"
          name="tutorBirdScriptUrl"
          type="url"
          defaultValue={course?.tutorBirdScriptUrl || ""}
          placeholder="https://app.tutorbird.com/Widget/v4/..."
          disabled={isPending}
        />
      </div>

      {/* Start Date */}
      <div>
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          name="startDate"
          type="date"
          defaultValue={course?.startDate || ""}
          disabled={isPending}
        />
      </div>

      {/* Category */}
      <div>
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          name="category"
          defaultValue={course?.category || ""}
          disabled={isPending}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select category</option>
          <option value="STANDARD">Standard</option>
          <option value="PREMIUM">Premium</option>
          <option value="VCE">VCE</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending
          ? course
            ? "Updating..."
            : "Creating..."
          : course
          ? "Update Course"
          : "Create Course"}
      </Button>
    </div>
  );
}
