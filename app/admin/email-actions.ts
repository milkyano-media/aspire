"use server";

import { z } from "zod";
import { validatedAction, ActionState } from "@/lib/auth/middleware";
import { getStudentsWithParents, getCourses } from "@/lib/wiselms/api";
import { sendBulkCustomEmail } from "@/lib/email/service";
import type { StudentWithParent, WiseLMSCourse } from "@/lib/wiselms/types";

/**
 * Fetch all courses from WiseLMS
 */
export async function fetchWiseLMSCourses(): Promise<ActionState> {
  try {
    const courses = await getCourses('LIVE');

    return {
      success: "Courses fetched successfully",
      data: courses,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching courses from WiseLMS:", errorMessage);

    return {
      error: `Failed to fetch courses: ${errorMessage}`,
    };
  }
}

/**
 * Fetch students with parent emails from a WiseLMS course
 */
const fetchStudentsSchema = z.object({
  wiseCourseId: z.string().min(1, "Course ID is required"),
});

export const fetchCourseStudents = validatedAction(
  fetchStudentsSchema,
  async (data, formData): Promise<ActionState> => {
    try {
      const students = await getStudentsWithParents(data.wiseCourseId);

      // Return students data in the success message as JSON
      // ActionState can include data in the success field
      return {
        success: "Students fetched successfully",
        data: students,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching students from WiseLMS:", errorMessage);

      return {
        error: `Failed to fetch students: ${errorMessage}`,
      };
    }
  }
);

/**
 * Send bulk custom email to parent email addresses
 */
const sendBulkEmailSchema = z.object({
  recipients: z.preprocess(
    (val) => (typeof val === 'string' ? JSON.parse(val) : val),
    z
      .array(z.string().email("Invalid email address"))
      .min(1, "At least one recipient is required")
      .max(100, "Maximum 100 recipients allowed per send")
  ),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject must be 200 characters or less"),
  htmlBody: z.string().min(1, "Email body is required"),
  attachments: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }
      return val || [];
    },
    z.array(
      z.object({
        filename: z.string(),
        content: z.string(), // Base64 encoded
        contentType: z.string(),
      })
    ).optional().default([])
  ),
});

export const sendBulkParentEmail = validatedAction(
  sendBulkEmailSchema,
  async (data, formData): Promise<ActionState> => {
    try {
      console.log(
        `Sending bulk email to ${data.recipients.length} parent(s)...`
      );

      const result = await sendBulkCustomEmail(
        data.recipients,
        data.subject,
        data.htmlBody,
        data.attachments
      );

      if (result.success) {
        return {
          success: `Successfully sent emails to ${result.successCount} of ${data.recipients.length} parent(s)`,
        };
      } else {
        // Partial or complete failure
        const failedCount = result.failedEmails.length;
        const successCount = result.successCount;

        if (successCount > 0) {
          // Partial success
          return {
            error: `Sent to ${successCount} parent(s), but failed to send to ${failedCount} parent(s)`,
            data: { failedEmails: result.failedEmails },
          };
        } else {
          // Complete failure
          return {
            error: `Failed to send emails to all ${failedCount} parent(s)`,
            data: { failedEmails: result.failedEmails },
          };
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error sending bulk emails:", errorMessage);

      return {
        error: `Failed to send emails: ${errorMessage}`,
      };
    }
  }
);
