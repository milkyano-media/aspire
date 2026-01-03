"use client";

import { Footer } from "@/components/aspire/Footer";
import ParentForm from "@/components/aspire/Registration/ParentForm";
import RegistrationHero from "@/components/aspire/Registration/RegistrationHero";
import StudentForm from "@/components/aspire/Registration/StudentForm";
import TermAndCondition from "@/components/aspire/Registration/TermAndCondition";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowRightIcon,
  PlusCircleIcon,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useState } from "react";

interface ParentData {
  name: string;
  email: string;
  phoneNumber: string;
  relationship: string;
  address: string;
}

interface StudentData {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  schoolGrade: string;
  vceClass: string;
  schoolName: string;
  additionalDetails: string;
  preference: string;
}

export default function RegistrationPage() {
  const [students, setStudents] = useState([{ id: 1 }]);
  const [nextId, setNextId] = useState(2);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [parentData, setParentData] = useState<ParentData>({
    name: "",
    email: "",
    phoneNumber: "",
    relationship: "",
    address: "",
  });
  const [studentsData, setStudentsData] = useState<Record<number, StudentData>>(
    {
      1: {
        name: "",
        email: "",
        phoneNumber: "",
        gender: "",
        dateOfBirth: "",
        schoolGrade: "",
        vceClass: "",
        schoolName: "",
        additionalDetails: "",
        preference: "",
      },
    },
  );

  const handleAddStudent = () => {
    const newId = nextId;
    setStudents((prev) => [...prev, { id: newId }]);
    setStudentsData((prev) => ({
      ...prev,
      [newId]: {
        name: "",
        email: "",
        phoneNumber: "",
        gender: "",
        dateOfBirth: "",
        schoolGrade: "",
        vceClass: "",
        schoolName: "",
        additionalDetails: "",
        preference: "",
      },
    }));
    setNextId((prev) => prev + 1);
  };

  const handleRemoveStudent = (id: number) => {
    if (students.length > 1) {
      setStudents((prev) => prev.filter((student) => student.id !== id));
      setStudentsData((prev) => {
        const newData = { ...prev };
        delete newData[id];
        return newData;
      });
    }
  };

  const handleParentChange = (data: Partial<ParentData>) => {
    setParentData((prev) => ({ ...prev, ...data }));
  };

  const handleStudentChange = (id: number, data: Partial<StudentData>) => {
    setStudentsData((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...data },
    }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    // Validate parent data
    if (!parentData.name.trim()) {
      errors.push("Parent name is required");
    }
    if (!parentData.email.trim()) {
      errors.push("Parent email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentData.email)) {
      errors.push("Parent email is invalid");
    }
    if (!parentData.phoneNumber.trim()) {
      errors.push("Parent phone number is required");
    }
    if (!parentData.relationship) {
      errors.push("Parent relationship is required");
    }
    if (!parentData.address.trim()) {
      errors.push("Parent address is required");
    }

    // Validate each student
    students.forEach((student, index) => {
      const studentData = studentsData[student.id];
      const studentNum = index + 1;

      if (!studentData.name.trim()) {
        errors.push(`Student ${studentNum}: Name is required`);
      }
      if (!studentData.email.trim()) {
        errors.push(`Student ${studentNum}: Email is required`);
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentData.email)) {
        errors.push(`Student ${studentNum}: Email is invalid`);
      }
      if (!studentData.gender) {
        errors.push(`Student ${studentNum}: Gender is required`);
      }
      if (!studentData.dateOfBirth) {
        errors.push(`Student ${studentNum}: Date of birth is required`);
      }
      if (!studentData.schoolGrade) {
        errors.push(`Student ${studentNum}: School grade is required`);
      }
      // VCE class is required only for Year 11 (I) and Year 12 (J)
      if (
        (studentData.schoolGrade === "I" || studentData.schoolGrade === "J") &&
        !studentData.vceClass
      ) {
        errors.push(
          `Student ${studentNum}: VCE class is required for Year 11/12`,
        );
      }
      if (!studentData.schoolName.trim()) {
        errors.push(`Student ${studentNum}: School name is required`);
      }
      if (!studentData.preference) {
        errors.push(`Student ${studentNum}: Learning preference is required`);
      }
    });

    return errors;
  };

  const handleCompleteRegistration = async () => {
    // Reset previous states
    setValidationErrors([]);
    setSubmitError("");
    setSubmitSuccess(false);

    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      const studentsArray = students.map((student) => studentsData[student.id]);
      const failedStudents: number[] = [];

      // Submit each student
      for (let i = 0; i < studentsArray.length; i++) {
        const student = studentsArray[i];
        const response = await fetch("/api/wise", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student,
            parent: parentData,
          }),
        });

        if (!response.ok) {
          failedStudents.push(i + 1);
        }
      }

      if (failedStudents.length > 0) {
        setSubmitError(
          `Failed to register student(s): ${failedStudents.join(", ")}. Please try again.`,
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error(err);
      setSubmitError(
        "An error occurred while submitting the registration. Please check your connection and try again.",
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <RegistrationHero />

      <section className="w-full px-4 md:px-10 lg:px-40 py-8">
        <div className="max-w-[960px] mx-auto space-y-8">
          {/* Success Message */}
          {submitSuccess && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800 font-bold">
                Registration Successful!
              </AlertTitle>
              <AlertDescription className="text-green-700">
                All students have been successfully registered. You will receive
                a confirmation email shortly.
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {submitError && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertTitle className="text-red-800 font-bold">
                Registration Failed
              </AlertTitle>
              <AlertDescription className="text-red-700">
                {submitError}
              </AlertDescription>
            </Alert>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <AlertTitle className="text-yellow-800 font-bold">
                Please fix the following errors:
              </AlertTitle>
              <AlertDescription className="text-yellow-700">
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <ParentForm data={parentData} onChange={handleParentChange} />

          {students.map((student, index) => (
            <StudentForm
              key={student.id}
              studentNumber={index + 1}
              data={studentsData[student.id]}
              onChange={(data) => handleStudentChange(student.id, data)}
              onRemove={() => handleRemoveStudent(student.id)}
              showRemove={students.length > 1}
            />
          ))}

          <Button
            onClick={handleAddStudent}
            variant="outline"
            size="lg"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-dashed border-blue-600/40 text-blue-600 font-bold hover:bg-blue-600/5 hover:border-blue-600 transition-all group"
          >
            <PlusCircleIcon className="group-hover:scale-110 transition-transform" />
            Add Another Student
          </Button>

          <TermAndCondition
            acceptedTerms={acceptedTerms}
            onChecked={setAcceptedTerms}
          />

          <div className="flex flex-col md:flex-row gap-4 pt-4 pb-12">
            <div className="flex-grow"></div>
            <Button
              onClick={handleCompleteRegistration}
              disabled={!acceptedTerms || isSubmitting}
              size="lg"
              className="flex-1 md:flex-none w-full md:w-auto min-w-[200px] flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-blue-600/30"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Complete Registration
                  <ArrowRightIcon />
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
