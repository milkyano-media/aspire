import { NextRequest, NextResponse } from 'next/server';
import { WISELMS_CONFIG } from '@/lib/wiselms/config';
import {
  getCourses,
  assignStudentToCourse,
  findActivitiesCourse,
} from '@/lib/wiselms/api';
import type {
  WiseLMSWebhookEvent,
  StudentAddedToClassroomPayload,
  StudentRemovedFromClassroomPayload,
} from '@/lib/wiselms/types';

const webhookSecret = WISELMS_CONFIG.webhookSecret;

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
  console.log('📥 Received WiseLMS webhook request');

  // Step 1: Log authorization header (for debugging)
  const authHeader = request.headers.get('authorization');
  console.log('📝 Authorization header received:', authHeader || 'None');

  // Verify webhook authentication if secret is configured
  if (webhookSecret && authHeader !== webhookSecret) {
    console.error(
      '❌ Webhook authentication failed - Expected:',
      webhookSecret,
      'Received:',
      authHeader
    );
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Step 2: Parse webhook payload
  let event: WiseLMSWebhookEvent;

  try {
    event = await request.json();
    console.log(`📋 Event type: ${event.event}`);
  } catch (error) {
    console.error('❌ Failed to parse webhook payload:', error);
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 }
    );
  }

  // Step 3: Validate event structure
  if (!event.event || !event.payload) {
    console.error('❌ Invalid event structure');
    return NextResponse.json(
      { error: 'Invalid event structure' },
      { status: 400 }
    );
  }

  // Step 4: Process event
  try {
    switch (event.event) {
      case 'StudentAddedToClassroomEvent':
        await handleStudentAdded(event.payload);
        break;

      case 'StudentRemovedFromClassroomEvent':
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
      error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error processing webhook:', errorMessage);

    // Return 200 OK to acknowledge receipt even on error
    // This prevents WiseLMS from retrying for expected failures
    // (e.g., Activities course doesn't exist)
    return NextResponse.json({
      received: true,
      error: errorMessage,
    });
  }
}

/**
 * Handle student added to classroom event
 * Enrolls student in matching Activities course
 */
async function handleStudentAdded(
  payload: StudentAddedToClassroomPayload
): Promise<void> {
  const { classroom, student } = payload;

  console.log(
    `👤 Student added: ${student.name} (${student._id}) → Course: ${classroom.name} (${classroom._id})`
  );

  // Fetch all courses to find matching Activities course
  const courses = await getCourses('LIVE');

  // Find matching Activities course
  const activitiesCourse = findActivitiesCourse(classroom.name, courses);

  if (!activitiesCourse) {
    console.log(
      `⚠️ No Activities course found for "${classroom.name}" - skipping enrollment`
    );
    return;
  }

  // Enroll student in Activities course
  await assignStudentToCourse(
    student._id,
    activitiesCourse._id,
    true // assign = true (enroll)
  );

  console.log(
    `✅ Successfully enrolled ${student.name} in ${activitiesCourse.name}`
  );
}

/**
 * Handle student removed from classroom event
 * Unenrolls student from matching Activities course
 */
async function handleStudentRemoved(
  payload: StudentRemovedFromClassroomPayload
): Promise<void> {
  const { classroom, student } = payload;

  console.log(
    `👤 Student removed: ${student.name} (${student._id}) ← Course: ${classroom.name} (${classroom._id})`
  );

  // Fetch all courses to find matching Activities course
  const courses = await getCourses('LIVE');

  // Find matching Activities course
  const activitiesCourse = findActivitiesCourse(classroom.name, courses);

  if (!activitiesCourse) {
    console.log(
      `⚠️ No Activities course found for "${classroom.name}" - skipping unenrollment`
    );
    return;
  }

  // Unenroll student from Activities course
  await assignStudentToCourse(
    student._id,
    activitiesCourse._id,
    false // assign = false (unenroll)
  );

  console.log(
    `✅ Successfully unenrolled ${student.name} from ${activitiesCourse.name}`
  );
}
