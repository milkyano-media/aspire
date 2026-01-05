/**
 * TypeScript interfaces for WiseLMS API responses
 */

export interface WiseLMSParent {
  _id: string;
  email: string;
  name: string;
}

export interface WiseLMSStudent {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string;
  uuid: string;
  joinedOn?: string;
  activated?: boolean;
  parents: WiseLMSParent[];
}

export interface WiseLMSApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface WiseLMSParticipantsData {
  _id: string;
  userId: string;
  pendingRequest: WiseLMSStudent[];
  joinedRequest: WiseLMSStudent[];
  coTeachers: Array<{
    _id: string;
    name: string;
    profilePicture?: string;
  }>;
  instituteId: string;
}

/**
 * WiseLMS Student Report (detailed student data including parents)
 */
export interface WiseLMSStudentReport {
  user: {
    _id: string;
    name: string;
    email: string;
    parentIds: string[];
    profilePicture?: string;
  };
  parents: Array<{
    _id: string;
    email: string;
    name: string;
    profilePicture?: string;
  }>;
  institute: {
    _id: string;
    name: string;
  };
  classrooms: Array<{
    _id: string;
    name: string;
    subject: string;
  }>;
}

export interface WiseLMSStudentReportData {
  studentReport: WiseLMSStudentReport;
}

/**
 * WiseLMS Course/Class data
 */
export interface WiseLMSCourse {
  _id: string;
  name: string;
  subject: string;
  classType: 'LIVE' | 'RECORDED' | 'ONE_TO_ONE';
  classNumber: number;
  thumbnail: string;
  published: boolean;
  createdAt: string;
  pendingRequest: string[];
  joinedRequest: string[];
  coTeachers: Array<{
    _id: string;
    name: string;
    profilePicture: string;
  }>;
}

export interface WiseLMSCoursesData {
  classes: WiseLMSCourse[];
  hiddenClasses: WiseLMSCourse[];
  pendingClasses: WiseLMSCourse[];
}

/**
 * Simplified student data with parent email for email composer
 */
export interface StudentWithParent {
  studentId: string;
  studentName: string;
  studentEmail: string;
  parentName: string;
  parentEmail: string;
  parentPhone?: string;
  courseName?: string; // NEW: For email personalization
}

/**
 * WiseLMS Teacher data structure
 */
export interface WiseLMSTeacher {
  _id: string;
  instituteId: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    profilePicture?: string;
    activated?: boolean;
  };
  relation: string;
  status: string;
  joinedOn: string;
  updatedAt: string;
  classes?: string[];
}

export interface WiseLMSTeachersData {
  teachers: WiseLMSTeacher[];
}

/**
 * WiseLMS Webhook Events
 */
export interface WiseLMSWebhookClassroom {
  _id: string;
  name: string;
  subject?: string;
  classNumber?: number;
}

export interface WiseLMSWebhookStudent {
  _id: string;
  name: string;
  email?: string;
}

export interface StudentAddedToClassroomPayload {
  classroom: WiseLMSWebhookClassroom;
  student: WiseLMSWebhookStudent;
}

export interface StudentRemovedFromClassroomPayload {
  classroom: WiseLMSWebhookClassroom;
  student: WiseLMSWebhookStudent;
  remove: boolean;
}

export type WiseLMSWebhookEvent =
  | {
      event: 'StudentAddedToClassroomEvent';
      payload: StudentAddedToClassroomPayload;
    }
  | {
      event: 'StudentRemovedFromClassroomEvent';
      payload: StudentRemovedFromClassroomPayload;
    };

/**
 * 1:1 Consultation Course Creation
 */
export interface CreateOneToOneCoursePayload {
  name: string;
  subject: string;
  adminId: string;
  teacherIds: string[];
  studentIds: string[];
}

export interface CreateCourseResponse {
  _id: string;
  name: string;
  subject: string;
  classType: string;
  published: boolean;
}

export interface ArchiveCourseResponse {
  success: boolean;
  message: string;
}
