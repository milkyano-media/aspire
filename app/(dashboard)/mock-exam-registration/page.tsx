"use client";

import { Footer } from "@/components/aspire/Footer";
import MockExamHero from "@/components/aspire/MockExamRegistration/MockExamHero";
import ParentForm from "@/components/aspire/Registration/ParentForm";
import MockExamStudentForm from "@/components/aspire/MockExamRegistration/MockExamStudentForm";
import TermAndCondition from "@/components/aspire/Registration/TermAndCondition";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowRightIcon,
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
  gender: string;
  yearLevel: string;
}

export default function MockExamRegistrationPage() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [studentExistingValidationError, setStudentExistingValidationError] =
    useState<string[]>([]);

  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [parentData, setParentData] = useState<ParentData>({
    name: "",
    email: "",
    phoneNumber: "",
    relationship: "",
    address: "",
  });

  const [studentData, setStudentData] = useState<StudentData>({
    name: "",
    email: "",
    gender: "",
    yearLevel: "",
  });

  const handleParentChange = (data: Partial<ParentData>) => {
    setParentData((prev) => ({ ...prev, ...data }));
  };

  const handleStudentChange = (data: Partial<StudentData>) => {
    setStudentData((prev) => ({ ...prev, ...data }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    /* Parent validation */

    if (!parentData.name.trim()) errors.push("Parent name is required");

    if (!parentData.email.trim()) {
      errors.push("Parent email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentData.email)) {
      errors.push("Parent email is invalid");
    }

    if (!parentData.phoneNumber.trim())
      errors.push("Parent phone number is required");

    if (!parentData.relationship)
      errors.push("Parent relationship is required");

    if (!parentData.address.trim())
      errors.push("Parent address is required");

    /* Student validation */

    if (!studentData.name.trim()) {
      errors.push("Student name is required");
    } else if (studentData.name.trim().length > 30) {
      errors.push("Student name must be 30 characters or less");
    }

    if (!studentData.email.trim()) {
      errors.push("Student email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentData.email)) {
      errors.push("Student email is invalid");
    }

    if (!studentData.gender) errors.push("Student gender is required");

    if (!studentData.yearLevel) errors.push("Student year level is required");

    if (
      studentData.email.trim().toLowerCase() ===
      parentData.email.trim().toLowerCase()
    ) {
      errors.push("Student email must not be the same as parent email");
    }

    return errors;
  };

  const handleSubmit = async () => {
    setValidationErrors([]);
    setSubmitError("");
    setSubmitSuccess(false);
    setStudentExistingValidationError([]);

    const errors = validateForm();

    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      /* Validate student email in WISE */

      const validateResponse = await fetch("/api/mock-exam/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      if (!validateResponse.ok) {
        const { message } = await validateResponse.json();

        setStudentExistingValidationError([
          `Student: ${message}`,
        ]);

        window.scrollTo({ top: 0, behavior: "smooth" });

        setIsSubmitting(false);
        return;
      }

      /* Submit registration */

      const response = await fetch("/api/mock-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parent: parentData,
          student: studentData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      setSubmitSuccess(true);

      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (err) {

      console.error(err);

      setSubmitError(
        "We couldn't submit your mock exam registration. Please try again later.",
      );

      window.scrollTo({ top: 0, behavior: "smooth" });

    } finally {

      setIsSubmitting(false);

    }
  };

  return (
    <main className="min-h-screen">

      <MockExamHero />

      <section className="w-full px-4 md:px-10 lg:px-40 py-8">

        <div className="max-w-[960px] mx-auto space-y-8">

          {/* Success */}

          {submitSuccess && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800 font-bold">
                Registration Submitted!
              </AlertTitle>
              <AlertDescription className="text-green-700">
                Thank you for registering for the mock exam. We will send you
                pricing and LMS details via email shortly.
              </AlertDescription>
            </Alert>
          )}

          {/* Error */}

          {submitError && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertTitle className="text-red-800 font-bold">
                Submission Failed
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

          {/* Student existing validation */}

          {studentExistingValidationError.length > 0 && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertTitle className="text-red-800 font-bold">
                Please fix the following errors:
              </AlertTitle>
              <AlertDescription className="text-red-700">
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {studentExistingValidationError.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <ParentForm data={parentData} onChange={handleParentChange} />

          <MockExamStudentForm
            data={studentData}
            onChange={handleStudentChange}
          />

          <TermAndCondition
            acceptedTerms={acceptedTerms}
            onChecked={setAcceptedTerms}
          />

          <div className="flex flex-col md:flex-row gap-4 pt-4 pb-12">

            <div className="flex-grow"></div>

            <Button
              onClick={handleSubmit}
              disabled={!acceptedTerms || isSubmitting}
              size="lg"
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 text-white font-bold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Complete Mock Exam Registration
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