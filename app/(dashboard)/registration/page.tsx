"use client";

import { Footer } from "@/components/aspire/Footer";
import ParentForm from "@/components/aspire/Registration/ParentForm";
import RegistrationHero from "@/components/aspire/Registration/RegistrationHero";
import StudentForm from "@/components/aspire/Registration/StudentForm";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, ArrowRightIcon } from "lucide-react";

export default function RegistrationPage() {
  return (
    <main className="min-h-screen">
      <RegistrationHero />

      <section className="w-full px-4 md:px-10 lg:px-40 py-8">
        <div className="max-w-[960px] mx-auto space-y-8">
          <ParentForm />

          <StudentForm />

          <div className="flex flex-col md:flex-row gap-4 pt-4 pb-12">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-dashed border-blue-600/40 text-blue-600 font-bold hover:bg-blue-600/5 hover:border-blue-600 transition-all group"
            >
              <PlusCircleIcon className="group-hover:scale-110 transition-transform" />
              Add Another Student
            </Button>
            <div className="flex-grow"></div>
            <Button
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
