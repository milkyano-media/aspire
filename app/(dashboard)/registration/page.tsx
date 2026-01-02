"use client";

import { Footer } from "@/components/aspire/Footer";
import ParentForm from "@/components/aspire/Registration/ParentForm";
import RegistrationHero from "@/components/aspire/Registration/RegistrationHero";
import StudentForm from "@/components/aspire/Registration/StudentForm";
import TermAndCondition from "@/components/aspire/Registration/TermAndCondition";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, PlusCircleIcon } from "lucide-react";
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

          <TermAndCondition
            acceptedTerms={acceptedTerms}
            onChecked={setAcceptedTerms}
          />

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
              disabled={!acceptedTerms}
              size="lg"
              className="flex-1 md:flex-none w-full md:w-auto min-w-[200px] flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-blue-600/30"
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
