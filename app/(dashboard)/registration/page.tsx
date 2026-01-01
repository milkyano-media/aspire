"use client";

import { Footer } from "@/components/aspire/Footer";
import ParentForm from "@/components/aspire/Registration/ParentForm";
import RegistrationHero from "@/components/aspire/Registration/RegistrationHero";
import StudentForm from "@/components/aspire/Registration/StudentForm";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircleIcon, ArrowRightIcon, FileTextIcon } from "lucide-react";
import { useState } from "react";

interface ParentData {
  name: string;
  email: string;
  phoneNumber: string;
}

interface StudentData {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  schoolGrade: string;
  vceClass: string;
}

export default function RegistrationPage() {
  const [students, setStudents] = useState([{ id: 1 }]);
  const [nextId, setNextId] = useState(2);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [parentData, setParentData] = useState<ParentData>({
    name: "",
    email: "",
    phoneNumber: "",
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

  const handleCompleteRegistration = async () => {
    try {
      const studentsArray = students.map((student) => studentsData[student.id]);

      for (const student of studentsArray) {
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
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen">
      <RegistrationHero />

      <section className="w-full px-4 md:px-10 lg:px-40 py-8">
        <div className="max-w-[960px] mx-auto space-y-8">
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

          {/* Terms & Conditions */}
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <CardHeader className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <FileTextIcon className="text-blue-600 h-5 w-5" />
                Terms & Conditions, Payment Policy & Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm leading-relaxed space-y-4">
                <div>
                  <h3 className="font-bold text-base mb-2">Aspire Academics</h3>
                  <h4 className="font-semibold mb-1">
                    Terms & Conditions, Payment Policy & Privacy Policy
                  </h4>
                  <p className="text-gray-600 text-xs mb-3">
                    Last updated: 1 January 2026
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">
                    1. About Aspire Academics
                  </h4>
                  <p className="text-gray-700">
                    Aspire Academics provides academic tutoring services for
                    students from Year 3 to Year 12, including English,
                    Mathematics, Selective Entry & Scholarship preparation, and
                    VCE subjects.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">
                    2. LMS Access & Onboarding
                  </h4>
                  <p className="text-gray-700">
                    Access to the Aspire Academics Learning Management System
                    (LMS) is granted only after successful enrolment and
                    payment. LMS access may be restricted or suspended if
                    payment obligations are not met.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">3. Packages & Services</h4>
                  <p className="text-gray-700">
                    Aspire Academics offers Standard and Premium packages.
                    Premium packages include additional resources and
                    eligibility to book one one-on-one consultation per week.
                    Package benefits are non-transferable.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">4. Payment Policy</h4>
                  <p className="text-gray-700">
                    All fees are payable termly and in advance. Payment must be
                    made in full before the commencement of each term to confirm
                    enrolment and maintain LMS access.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">5. Payment Methods</h4>
                  <p className="text-gray-700">
                    Payments may be made online through the LMS via Stripe, by
                    credit or debit card, or via EFTPOS at the Aspire Academics
                    centre.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">
                    6. Attendance, Missed Classes & Credit Policy
                  </h4>
                  <p className="text-gray-700">
                    Aspire Academics does not offer refunds. If a student misses
                    up to two classes in a term, those classes will be credited
                    to the following term. If three or more classes are missed,
                    only two will be credited.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">
                    7. One-on-One Consultations (Premium Package)
                  </h4>
                  <p className="text-gray-700">
                    Premium students are entitled to one one-on-one consultation
                    per week. Unused consultations expire weekly and do not
                    carry over.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">8. Notice Period</h4>
                  <p className="text-gray-700">
                    A minimum of one week's notice prior to the end of term is
                    required if a student will not continue into the following
                    term.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">
                    9. Behaviour & Communication
                  </h4>
                  <p className="text-gray-700">
                    All LMS communication must remain respectful and
                    appropriate. Aspire Academics reserves the right to restrict
                    access if misuse occurs.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">10. Privacy Policy</h4>
                  <p className="text-gray-700">
                    Personal information is collected solely to deliver services
                    and operate the LMS. Aspire Academics does not sell or
                    distribute personal data.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">
                    11. Technology Disclaimer
                  </h4>
                  <p className="text-gray-700">
                    Aspire Academics is not liable for temporary LMS outages,
                    maintenance, or third-party system issues.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">12. Acceptance</h4>
                  <p className="text-gray-700">
                    By enrolling, accessing the LMS, or selecting 'I Agree', you
                    confirm acceptance of these Terms & Conditions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) =>
                    setAcceptedTerms(checked as boolean)
                  }
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  I agree to the Terms & Conditions, Payment Policy and Privacy
                  Policy
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row gap-4 pt-4 pb-12">
            <Button
              onClick={handleAddStudent}
              variant="outline"
              size="lg"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-dashed border-blue-600/40 text-blue-600 font-bold hover:bg-blue-600/5 hover:border-blue-600 transition-all group"
            >
              <PlusCircleIcon className="group-hover:scale-110 transition-transform" />
              Add Another Student
            </Button>
            <div className="flex-grow"></div>
            <Button
              onClick={handleCompleteRegistration}
              size="lg"
              className="flex-1 md:flex-none w-full md:w-auto min-w-[200px] flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all"
            >
              Complete Registration
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
