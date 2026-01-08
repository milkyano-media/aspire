import { NextRequest, NextResponse } from "next/server";
import { WISELMS_CONFIG } from "@/lib/wiselms/config";
import {
  getCourses,
  assignStudentToCourse,
  findActivitiesCourse,
  isPremiumPackageCourse,
  createOneToOneCourse,
  archiveOneToOneCourse,
  findOneToOneCourseForStudent,
} from "@/lib/wiselms/api";
import type {
  WiseLMSWebhookEvent,
  StudentAddedToClassroomPayload,
  StudentRemovedFromClassroomPayload,
} from "@/lib/wiselms/types";
import { sendEnrollmentEmail } from "@/lib/email/service";

const webhookSecret = WISELMS_CONFIG.webhookSecret;

interface RegistrationDataField {
  questionId: string;
  answer: string;
}

interface RegistrationData {
  fields: RegistrationDataField[];
}

interface Parent {
  name: string;
  email?: string;
}

interface Student {
  name: string;
  email?: string;
}

interface StudentReport {
  registrationData: RegistrationData;
  parents?: Parent[];
  user: Student;
}
interface StudentDetail {
  studentReport: StudentReport;
}

interface StudentDetailResponse {
  status: number;
  message: string;
  data: StudentDetail;
}

/**
 * WiseLMS Webhook Handler
 *
 * Auto-enrolls/unenrolls students in Activities courses based on their
 * enrollment in regular courses.
 *
 * Events handled:
 * - StudentAddedToClassroomEvent: Enrolls student in matching Activities course
 * - StudentRemovedFromClassroomEvent: Unenrolls student from matching Activities course
 */
export async function POST(request: NextRequest) {
  console.log("📥 Received WiseLMS webhook request");

  // Step 1: Log authorization header (for debugging)
  const authHeader = request.headers.get("authorization");
  console.log("📝 Authorization header received:", authHeader || "None");

  // Verify webhook authentication if secret is configured
  if (webhookSecret && authHeader !== webhookSecret) {
    console.error(
      "❌ Webhook authentication failed - Expected:",
      webhookSecret,
      "Received:",
      authHeader,
    );
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Step 2: Parse webhook payload
  let event: WiseLMSWebhookEvent;

  try {
    event = await request.json();
    console.log(`📋 Event type: ${event.event}`);
  } catch (error) {
    console.error("❌ Failed to parse webhook payload:", error);
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  // Step 3: Validate event structure
  if (!event.event || !event.payload) {
    console.error("❌ Invalid event structure");
    return NextResponse.json(
      { error: "Invalid event structure" },
      { status: 400 },
    );
  }

  // Step 4: Process event
  try {
    switch (event.event) {
      case "StudentAddedToClassroomEvent":
        await handleStudentAdded(event.payload);
        break;

      case "StudentRemovedFromClassroomEvent":
        await handleStudentRemoved(event.payload);
        break;

      default:
        // TypeScript knows this is unreachable, but we keep it for safety
        console.log(`ℹ️ Unhandled event type: ${(event as any).event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    // Log error but return 200 to prevent webhook retries
    // WiseLMS should not retry if Activities course doesn't exist
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Error processing webhook:", errorMessage);

    // Return 200 OK to acknowledge receipt even on error
    // This prevents WiseLMS from retrying for expected failures
    // (e.g., Activities course doesn't exist)
    return NextResponse.json({
      received: true,
      error: errorMessage,
    });
  }
}

function getParent(studentDetailJson: StudentDetailResponse) {
  const registrationDataParentNameIndex =
    studentDetailJson.data.studentReport.registrationData.fields.findIndex(
      (field) => field.questionId === "z3xugv7s",
    );
  let parentName =
    studentDetailJson.data.studentReport.registrationData.fields[
      registrationDataParentNameIndex
    ].answer;
  if (
    studentDetailJson.data.studentReport.parents &&
    studentDetailJson.data.studentReport.parents.length > 0
  ) {
    parentName = studentDetailJson.data.studentReport.parents[0].name;
  }

  return parentName;
}

function getParentEmail(
  studentDetailJson: StudentDetailResponse,
): string | null {
  // First check if parents array has email
  if (
    studentDetailJson.data.studentReport.parents &&
    studentDetailJson.data.studentReport.parents.length > 0 &&
    studentDetailJson.data.studentReport.parents[0].email
  ) {
    return studentDetailJson.data.studentReport.parents[0].email;
  }

  // Fallback: Check registration data fields for parent email
  // This questionId might need to be adjusted based on your WiseLMS form structure
  const registrationDataParentEmailIndex =
    studentDetailJson.data.studentReport.registrationData.fields.findIndex(
      (field) => field.questionId === "khfnust3" || field.answer.includes("@"),
    );

  if (registrationDataParentEmailIndex !== -1) {
    return studentDetailJson.data.studentReport.registrationData.fields[
      registrationDataParentEmailIndex
    ].answer;
  }

  return null;
}

/**
 * Handle student added to classroom event
 * Enrolls student in matching Activities course
 */
async function handleStudentAdded(
  payload: StudentAddedToClassroomPayload,
): Promise<void> {
  const { classroom, student } = payload;

  console.log(
    `👤 Student added: ${student.name} (${student._id}) → Course: ${classroom.name} (${classroom._id})`,
  );

  // Fetch all courses to find matching Activities course
  const courses = await getCourses("LIVE");

  // Find matching Activities course
  const activitiesCourse = findActivitiesCourse(classroom.name, courses);

  if (activitiesCourse) {
    // Enroll student in Activities course
    await assignStudentToCourse(
      student._id,
      activitiesCourse._id,
      true, // assign = true (enroll)
    );

    // get student detail
    const studentDetail = await fetch(
      `https://${WISELMS_CONFIG.host}/public/institutes/${WISELMS_CONFIG.instituteId}/studentReports/${student._id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${WISELMS_CONFIG.authentication}`,
          "x-api-key": WISELMS_CONFIG.apiKey,
          "x-wise-namespace": WISELMS_CONFIG.namespace,
          "Content-Type": "application/json",
          "User-Agent": WISELMS_CONFIG.userAgent,
        },
      },
    );
    if (!studentDetail.ok) {
      console.error("Failde to fetch student detail");
      return;
    }
    const studentDetailJson: StudentDetailResponse = await studentDetail.json();
    const parentName = getParent(studentDetailJson);
    const studentName = studentDetailJson.data.studentReport.user.name;
    const parentEmail = getParentEmail(studentDetailJson);

    // send email for mobile apps
    if (parentEmail) {
      try {
        await sendEnrollmentEmail(parentEmail, parentName, studentName);
        console.log(`📧 Enrollment email sent successfully to: ${parentEmail}`);
      } catch (error) {
        // Log error but don't fail the webhook
        console.error(
          `⚠️ Failed to send enrollment email to ${parentEmail}:`,
          error instanceof Error ? error.message : "Unknown error",
        );
      }
    } else {
      console.log(
        `⚠️ No parent email found for student ${studentName} - skipping enrollment email`,
      );
    }

    console.log(
      `✅ Successfully enrolled ${student.name} in ${activitiesCourse.name}`,
    );
  } else {
    console.log(
      `⚠️ No Activities course found for "${classroom.name}" - skipping enrollment`,
    );
  }

  // NEW: 1:1 Consultation course creation for Premium Package
  if (isPremiumPackageCourse(classroom.name)) {
    console.log(`🎓 Premium Package enrollment detected: ${classroom.name}`);

    // Check if 1:1 course already exists for this student
    const existingCourse = findOneToOneCourseForStudent(
      student._id,
      student.name,
      courses,
    );

    if (existingCourse) {
      console.log(
        `⚠️ 1:1 course already exists: ${existingCourse.name} (${existingCourse._id})`,
      );
      return;
    }

    // Create new 1:1 consultation course
    const courseId = await createOneToOneCourse(student._id, student.name);
    console.log(
      `✅ Created 1:1 consultation course for ${student.name} (${courseId})`,
    );
  }
}

/**
 * Handle student removed from classroom event
 * Unenrolls student from matching Activities course
 */
async function handleStudentRemoved(
  payload: StudentRemovedFromClassroomPayload,
): Promise<void> {
  const { classroom, student } = payload;

  console.log(
    `👤 Student removed: ${student.name} (${student._id}) ← Course: ${classroom.name} (${classroom._id})`,
  );

  // Fetch all courses to find matching Activities course
  const courses = await getCourses("LIVE");

  // Find matching Activities course
  const activitiesCourse = findActivitiesCourse(classroom.name, courses);

  if (activitiesCourse) {
    // Unenroll student from Activities course
    await assignStudentToCourse(
      student._id,
      activitiesCourse._id,
      false, // assign = false (unenroll)
    );

    console.log(
      `✅ Successfully unenrolled ${student.name} from ${activitiesCourse.name}`,
    );
  } else {
    console.log(
      `⚠️ No Activities course found for "${classroom.name}" - skipping unenrollment`,
    );
  }

  // NEW: Archive 1:1 Consultation course for Premium Package removal
  if (isPremiumPackageCourse(classroom.name)) {
    console.log(`🎓 Premium Package removal detected: ${classroom.name}`);

    // Find the student's 1:1 course
    const oneToOneCourse = findOneToOneCourseForStudent(
      student._id,
      student.name,
      courses,
    );

    if (!oneToOneCourse) {
      console.log(
        `⚠️ No 1:1 course found for ${student.name} - skipping archive`,
      );
      return;
    }

    // Archive the course
    await archiveOneToOneCourse(oneToOneCourse._id);
    console.log(
      `✅ Archived 1:1 consultation course for ${student.name} (${oneToOneCourse._id})`,
    );
  }
}
