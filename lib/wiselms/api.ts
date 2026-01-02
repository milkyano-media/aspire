import 'server-only';

import { WISELMS_CONFIG, validateWiseLMSConfig } from './config';
import type {
  WiseLMSApiResponse,
  WiseLMSParticipantsData,
  WiseLMSStudentReportData,
  WiseLMSCoursesData,
  WiseLMSCourse,
  StudentWithParent,
} from './types';

/**
 * Create Basic Auth header for WiseLMS API
 */
function createAuthHeader(): string {
  const credentials = `${WISELMS_CONFIG.userId}:${WISELMS_CONFIG.apiKey}`;
  return `Basic ${Buffer.from(credentials).toString('base64')}`;
}

/**
 * Base fetch wrapper for WiseLMS API with error handling
 */
async function wiseFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!validateWiseLMSConfig()) {
    throw new Error('WiseLMS API not properly configured');
  }

  const url = `https://${WISELMS_CONFIG.host}/${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: createAuthHeader(),
      'x-api-key': WISELMS_CONFIG.apiKey,
      'x-wise-namespace': WISELMS_CONFIG.namespace,
      'user-agent': WISELMS_CONFIG.userAgent,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    signal: AbortSignal.timeout(30000), // 30-second timeout
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(
      `WiseLMS API error (${response.status}): ${errorText}`
    );
  }

  return response.json();
}

/**
 * Get student report with parent data
 *
 * @param studentId - WiseLMS student ID
 * @returns Student report with parent information
 */
async function getStudentReport(studentId: string): Promise<WiseLMSStudentReportData | null> {
  try {
    const response = await wiseFetch<WiseLMSApiResponse<WiseLMSStudentReportData>>(
      `public/institutes/${WISELMS_CONFIG.instituteId}/studentReports/${studentId}`
    );

    return response.data;
  } catch (error) {
    console.error(`Failed to fetch report for student ${studentId}:`, error);
    return null;
  }
}

/**
 * Get students with parent emails from a course
 * Two-step process:
 * 1. Fetch all students enrolled in the course
 * 2. For each student, fetch their detailed report to get parent data
 *
 * @param classId - WiseLMS course/class ID
 * @returns Array of students with parent contact information
 */
export async function getStudentsWithParents(
  classId: string
): Promise<StudentWithParent[]> {
  try {
    console.log(`Fetching students with parents for class: ${classId}`);

    // Step 1: Get all students enrolled in the course
    const participantsResponse = await wiseFetch<WiseLMSApiResponse<WiseLMSParticipantsData>>(
      `user/classes/${classId}/participants?showCoTeachers=true`
    );

    // Students are in the joinedRequest array
    const students = participantsResponse.data.joinedRequest || [];

    console.log(`Found ${students.length} enrolled students in class ${classId}`);

    if (students.length === 0) {
      console.log('No students enrolled in this course');
      return [];
    }

    // Step 2: Fetch student reports to get parent data
    console.log('Fetching parent data for each student...');

    const studentsWithParents: StudentWithParent[] = [];
    let processedCount = 0;
    let studentsWithParentData = 0;

    for (const student of students) {
      processedCount++;
      console.log(`Processing student ${processedCount}/${students.length}: ${student.name}`);

      const report = await getStudentReport(student._id);

      if (!report || !report.studentReport) {
        console.log(`  - No report data available`);
        continue;
      }

      const parents = report.studentReport.parents || [];

      if (parents.length === 0) {
        console.log(`  - No parent accounts linked`);
        continue;
      }

      // Use first parent (most students have one parent)
      const parent = parents[0];
      studentsWithParentData++;

      console.log(`  - Found parent: ${parent.name} (${parent.email})`);

      studentsWithParents.push({
        studentId: student._id,
        studentName: student.name,
        studentEmail: student.email,
        parentName: parent.name,
        parentEmail: parent.email,
        parentPhone: undefined, // Not available in API
      });
    }

    console.log(
      `✅ Successfully fetched ${studentsWithParentData} students with parent data out of ${students.length} total students`
    );

    if (students.length > 0 && studentsWithParents.length === 0) {
      console.warn(
        `⚠️ Found ${students.length} students but none have parent accounts linked in WiseLMS`
      );
    }

    return studentsWithParents;
  } catch (error) {
    console.error('Failed to fetch students with parents:', error);
    throw error;
  }
}

/**
 * Get all courses from WiseLMS institute
 * Fetches LIVE courses by default
 *
 * @param classType - Type of courses to fetch (LIVE, RECORDED, ONE_TO_ONE)
 * @returns Array of WiseLMS courses
 */
export async function getCourses(
  classType: 'LIVE' | 'RECORDED' | 'ONE_TO_ONE' = 'LIVE'
): Promise<WiseLMSCourse[]> {
  try {
    if (!validateWiseLMSConfig()) {
      throw new Error('WiseLMS API not configured');
    }

    console.log(`Fetching ${classType} courses from WiseLMS...`);

    // Fetch courses from WiseLMS
    const response = await wiseFetch<WiseLMSApiResponse<WiseLMSCoursesData>>(
      `institutes/${WISELMS_CONFIG.instituteId}/classes?classType=${classType}&showCoTeachers=true`
    );

    const courses = response.data.classes || [];

    console.log(`Found ${courses.length} ${classType} courses in WiseLMS`);

    return courses;
  } catch (error) {
    console.error('Failed to fetch courses from WiseLMS:', error);
    throw error;
  }
}

/**
 * Enroll or unenroll a student in a course
 *
 * @param studentId - WiseLMS student ID (_id from user object)
 * @param courseId - WiseLMS course/class ID (_id from class object)
 * @param assign - true to enroll, false to unenroll
 * @returns Promise that resolves when operation completes
 */
export async function assignStudentToCourse(
  studentId: string,
  courseId: string,
  assign: boolean
): Promise<void> {
  try {
    console.log(
      `${assign ? 'Enrolling' : 'Unenrolling'} student ${studentId} ${
        assign ? 'in' : 'from'
      } course ${courseId}...`
    );

    const response = await wiseFetch<WiseLMSApiResponse<unknown>>(
      `institutes/${WISELMS_CONFIG.instituteId}/assignClassToStudent`,
      {
        method: 'POST',
        body: JSON.stringify({
          classId: courseId,
          userId: studentId,
          assign,
        }),
      }
    );

    console.log(
      `✅ Successfully ${assign ? 'enrolled' : 'unenrolled'} student ${studentId}`
    );
  } catch (error) {
    console.error(
      `Failed to ${assign ? 'enroll' : 'unenroll'} student ${studentId}:`,
      error
    );
    throw error;
  }
}

/**
 * Find Activities course matching a source course name
 *
 * @param sourceCourseName - Name of the source course (e.g., "Year 3", "Premium Package Year 7 - Advance B")
 * @param courses - Array of all available courses (pass in to avoid refetching)
 * @returns Matching Activities course or null if not found
 */
export function findActivitiesCourse(
  sourceCourseName: string,
  courses: WiseLMSCourse[]
): WiseLMSCourse | null {
  // Skip if source already contains "Activities" (prevent infinite loop)
  if (sourceCourseName.toLowerCase().includes('activities')) {
    console.log(
      `Source course "${sourceCourseName}" is already an Activities course, skipping`
    );
    return null;
  }

  // Skip if source contains "VCE"
  if (sourceCourseName.toUpperCase().includes('VCE')) {
    console.log(
      `Source course "${sourceCourseName}" contains VCE, skipping`
    );
    return null;
  }

  // Remove package prefixes if present
  let baseName = sourceCourseName;
  const packagePrefixes = ['Premium Package ', 'Standard Package '];

  for (const prefix of packagePrefixes) {
    if (sourceCourseName.startsWith(prefix)) {
      baseName = sourceCourseName.replace(prefix, '');
      console.log(
        `Removed "${prefix.trim()}" prefix: "${sourceCourseName}" → "${baseName}"`
      );
      break;
    }
  }

  // Look for "Activities {baseName}" pattern
  const targetName = `Activities ${baseName}`;

  const match = courses.find(
    (course) => course.name === targetName && course.published
  );

  if (match) {
    console.log(
      `Found matching Activities course: "${match.name}" (${match._id})`
    );
  } else {
    console.log(`No Activities course found for: "${targetName}"`);
  }

  return match || null;
}
