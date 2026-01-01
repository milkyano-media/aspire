"use client";

import { Footer } from "@/components/aspire/Footer";
import ParentForm from "@/components/aspire/Registration/ParentForm";
import RegistrationHero from "@/components/aspire/Registration/RegistrationHero";
import StudentForm from "@/components/aspire/Registration/StudentForm";
import { Button } from "@/components/ui/button";
import { CirclePlusIcon, MoveRightIcon } from "lucide-react";

export default function RegistrationPage() {
  return (
    <main className="min-h-screen">
      <RegistrationHero />

      <section className="px-4 py-16 flex flex-col gap-3">
        <ParentForm />

        <StudentForm />

        <div className="flex justify-between">
          <Button variant="dotted" size="lg" className="text-blue-950">
            <CirclePlusIcon className="text-blue-950" /> Add Another Student
          </Button>
          <Button size="lg" className="bg-blue-950 hover:bg-blue-900">
            Complete Registration <MoveRightIcon />
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
