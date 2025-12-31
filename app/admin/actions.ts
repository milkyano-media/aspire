"use server";

import { z } from "zod";
import { validatedAction, ActionState } from "@/lib/auth/middleware";
import {
  createCourse as dbCreateCourse,
  updateCourse as dbUpdateCourse,
  deleteCourse as dbDeleteCourse,
} from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

// Admin key validation (simple === check, no user auth required)
const adminKeySchema = z.object({
  key: z.string().min(1, "Admin key is required"),
});

export const validateAdminKey = validatedAction(
  adminKeySchema,
  async (data, formData): Promise<ActionState> => {
    const { key } = data;
    const expectedKey = process.env.ADMIN_SECRET_KEY;

    if (!expectedKey) {
      return { error: "Admin key not configured" };
    }

    if (key !== expectedKey) {
      return { error: "Invalid admin key" };
    }

    return { success: "Authenticated" };
  },
);

// Zod schema for course validation
const courseSchema = z.object({
  yearLevel: z.string().optional(),
  programName: z.string().min(1, "Program name is required"),
  description: z.string().optional(),
  includes: z.string().optional(), // Will be semicolon-separated
  note: z.string().optional(),
  price: z.string().optional(),
  priceUnit: z.string().optional(),
  startDate: z.string().optional(), // Date string from input
  category: z
    .enum(["STANDARD", "PREMIUM", "VCE", "SELECTIVE ENTRY"])
    .optional(),
  courseOrder: z.coerce.number().optional(),
  wiseCourseId: z.string().min(1, "Store Course ID is required"),
});

export const createCourse = validatedAction(
  courseSchema,
  async (data, formData): Promise<ActionState> => {
    try {
      await dbCreateCourse({
        ...data,
        startDate: data.startDate || null,
      });

      revalidatePath("/admin");
      revalidatePath("/courses");

      return { success: "Course created successfully" };
    } catch (error) {
      console.error("Error creating course:", error);
      return { error: "Failed to create course" };
    }
  },
);

const updateCourseSchema = courseSchema.extend({
  id: z.coerce.number(),
});

export const updateCourse = validatedAction(
  updateCourseSchema,
  async (data, formData): Promise<ActionState> => {
    try {
      const { id, ...updateData } = data;

      await dbUpdateCourse(id, {
        ...updateData,
        startDate: updateData.startDate || null,
      });

      revalidatePath("/admin");
      revalidatePath("/courses");

      return { success: "Course updated successfully" };
    } catch (error) {
      console.error("Error updating course:", error);
      return { error: "Failed to update course" };
    }
  },
);

const deleteCourseSchema = z.object({
  id: z.coerce.number(),
});

export const deleteCourse = validatedAction(
  deleteCourseSchema,
  async (data, formData): Promise<ActionState> => {
    try {
      await dbDeleteCourse(data.id);

      revalidatePath("/admin");
      revalidatePath("/courses");

      return { success: "Course deleted successfully" };
    } catch (error) {
      console.error("Error deleting course:", error);
      return { error: "Failed to delete course" };
    }
  },
);
