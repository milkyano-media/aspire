"use client";

import {
  useState,
  useActionState,
  useCallback,
  useEffect,
  startTransition,
} from "react";
import { StudentWithParent, WiseLMSCourse } from "@/lib/wiselms/types";
import {
  fetchCourseStudents,
  sendBulkParentEmail,
  fetchWiseLMSCourses,
} from "@/app/admin/email-actions";
import { CourseSelector } from "./CourseSelector";
import { StudentSelectionTable } from "./StudentSelectionTable";
import { EmailEditor } from "./EmailEditor";
import { EmailPreview } from "./EmailPreview";
import { SendEmailButton } from "./SendEmailButton";
import { FileAttachment, AttachmentFile } from "./FileAttachment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast, Toaster } from "sonner";

interface EmailComposerTabProps {
  userRole: string;
}

/**
 * EmailComposerTab - Main orchestrator for email composition workflow
 * Progressive disclosure UI with 4 steps:
 * 1. Select course (from WiseLMS)
 * 2. Select students/recipients
 * 3. Compose email
 * 4. Send
 */
export function EmailComposerTab({ userRole }: EmailComposerTabProps) {
  // WiseLMS courses
  const [courses, setCourses] = useState<WiseLMSCourse[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  // Step 1: Course selection
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Step 2: Student data & selection
  const [students, setStudents] = useState<StudentWithParent[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<
    StudentWithParent[]
  >([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Step 3: Email composition
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Step 4: Send email
  const [sendState, sendAction, isSending] = useActionState(
    sendBulkParentEmail,
    {},
  );

  // Fetch courses from WiseLMS on mount
  useEffect(() => {
    async function loadCourses() {
      setIsLoadingCourses(true);
      setCoursesError(null);

      try {
        const result = await fetchWiseLMSCourses();

        if ("error" in result && result.error) {
          setCoursesError(result.error);
          setCourses([]);
        } else if (
          "success" in result &&
          result.success &&
          "data" in result &&
          result.data
        ) {
          setCourses(result.data as WiseLMSCourse[]);
          setCoursesError(null);
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";
        setCoursesError(`Failed to load courses: ${errorMsg}`);
        setCourses([]);
      } finally {
        setIsLoadingCourses(false);
      }
    }

    loadCourses();
  }, []);

  // Handle course selection
  const handleCourseSelect = async (wiseCourseId: string) => {
    setSelectedCourseId(wiseCourseId);
    setIsLoadingStudents(true);
    setFetchError(null);
    setStudents([]);
    setSelectedRecipients([]);

    // Find course name from selected course
    const selectedCourse = courses.find((c) => c._id === wiseCourseId);
    const courseName = selectedCourse?.name || "Course";

    try {
      // Create FormData for the action
      const formData = new FormData();
      formData.append("wiseCourseId", wiseCourseId);

      const result = await fetchCourseStudents({}, formData);

      if ("error" in result && result.error) {
        setFetchError(result.error);
        setStudents([]);
      } else if (
        "success" in result &&
        result.success &&
        "data" in result &&
        result.data
      ) {
        // Add courseName to each student
        const studentsWithCourse = (result.data as StudentWithParent[]).map(
          (student) => ({
            ...student,
            courseName: courseName,
          }),
        );
        setStudents(studentsWithCourse);
        setFetchError(null);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setFetchError(`Failed to fetch students: ${errorMsg}`);
      setStudents([]);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  // Handle recipient selection change
  const handleSelectionChange = useCallback(
    (recipients: StudentWithParent[]) => {
      setSelectedRecipients(recipients);
    },
    [],
  );

  // Handle send email
  const handleSendEmail = () => {
    const formData = new FormData();
    formData.append("recipients", JSON.stringify(selectedRecipients));
    formData.append("subject", emailSubject);
    formData.append("htmlBody", emailBody);
    formData.append("attachments", JSON.stringify(attachments));

    startTransition(() => {
      sendAction(formData);
    });
  };

  // Reset form on successful send and show toast notifications
  useEffect(() => {
    if ("success" in sendState && sendState.success) {
      // Show success toast
      toast.success(sendState.success, {
        duration: 5000,
        position: "top-right",
      });

      // Reset form after successful send
      setEmailSubject("");
      setEmailBody("");
      setAttachments([]);
      setSelectedRecipients([]);
      // Keep course and students loaded for convenience
    } else if ("error" in sendState && sendState.error) {
      // Show error toast
      toast.error(sendState.error, {
        duration: 5000,
        position: "top-right",
      });
    }
  }, [sendState]);

  // Check if form is ready to send
  const canSend =
    selectedRecipients.length > 0 &&
    emailSubject.trim() !== "" &&
    emailBody.trim() !== "";

  return (
    <div className="space-y-8">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-[#002366]">Email Composer</h2>
        <p className="text-gray-600 mt-1">
          {userRole === "admin"
            ? "Send custom emails to parents of students enrolled in courses"
            : "Send custom emails to parents in your assigned courses"}
        </p>
      </div>

      {/* Step 1: Course Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#002366] text-white font-semibold text-sm">
            1
          </div>
          <h3 className="text-lg font-semibold text-[#002366]">
            Select Course
          </h3>
        </div>

        {coursesError && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{coursesError}</span>
          </div>
        )}

        <CourseSelector
          courses={courses}
          selectedCourseId={selectedCourseId}
          onCourseSelect={handleCourseSelect}
          isLoading={isLoadingCourses}
        />
      </div>

      {/* Step 2: Student Selection (shown when course selected) */}
      {selectedCourseId && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#002366] text-white font-semibold text-sm">
              2
            </div>
            <h3 className="text-lg font-semibold text-[#002366]">
              Select Recipients
            </h3>
          </div>

          {isLoadingStudents && (
            <div className="flex items-center gap-2 text-gray-600 py-8">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading students from WiseLMS...</span>
            </div>
          )}

          {fetchError && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{fetchError}</span>
            </div>
          )}

          {!isLoadingStudents && !fetchError && students.length > 0 && (
            <StudentSelectionTable
              students={students}
              onSelectionChange={handleSelectionChange}
            />
          )}
        </div>
      )}

      {/* Step 3: Email Composition (shown when recipients selected) */}
      {selectedRecipients.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#002366] text-white font-semibold text-sm">
              3
            </div>
            <h3 className="text-lg font-semibold text-[#002366]">
              Compose Email
            </h3>
          </div>

          <div className="space-y-4">
            {/* Subject Line */}
            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject Line</Label>
              <Input
                id="email-subject"
                type="text"
                placeholder="Enter email subject..."
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                maxLength={200}
                className="max-w-2xl"
              />
              <p className="text-xs text-gray-500">
                {emailSubject.length}/200 characters
              </p>
            </div>

            {/* Email Body Editor */}
            <div className="space-y-2">
              <Label>Email Body</Label>
              <EmailEditor
                content={emailBody}
                onChange={setEmailBody}
                placeholder="Write your email message here..."
              />
            </div>

            {/* File Attachments */}
            <div className="space-y-2">
              <Label>Attachments (Optional)</Label>
              <FileAttachment
                attachments={attachments}
                onAttachmentsChange={setAttachments}
                maxFiles={5}
                maxSizeMB={10}
              />
            </div>

            {/* Preview Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPreviewOpen(true)}
              disabled={!emailSubject || !emailBody}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Email
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Send Email (shown when email composed) */}
      {canSend && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#002366] text-white font-semibold text-sm">
              4
            </div>
            <h3 className="text-lg font-semibold text-[#002366]">Send Email</h3>
          </div>

          <div className="space-y-4">
            {/* Success Message */}
            {"success" in sendState && sendState.success && (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span>{sendState.success}</span>
              </div>
            )}

            {/* Error Message */}
            {"error" in sendState && sendState.error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{sendState.error}</span>
              </div>
            )}

            {/* Send Button */}
            <SendEmailButton
              recipientCount={selectedRecipients.length}
              onSend={handleSendEmail}
              isPending={isSending}
            />
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      <EmailPreview
        subject={emailSubject}
        htmlBody={emailBody}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        sampleRecipient={
          selectedRecipients.length > 0
            ? {
                parentName: selectedRecipients[0].parentName,
                studentName: selectedRecipients[0].studentName,
                courseName: selectedRecipients[0].courseName,
                studentEmail: selectedRecipients[0].studentEmail,
                parentEmail: selectedRecipients[0].parentEmail,
              }
            : {
                parentName: "John Smith",
                studentName: "Emma Smith",
                courseName: "VCE Mathematics",
                studentEmail: "emma.smith@example.com",
                parentEmail: "john.smith@example.com",
              }
        }
      />

      {/* Toast Notifications */}
      <Toaster richColors position="top-right" />
    </div>
  );
}
