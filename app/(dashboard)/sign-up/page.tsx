"use client";

import { Footer } from "@/components/aspire/Footer";
import { ConsultationForm } from "@/components/aspire/ConsultationForm/ConsultationForm";
import { SuccessScreen } from "@/components/aspire/ConsultationForm/SuccessScreen";
import { useState } from "react";

export default function SignInPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSuccess = () => {
    setIsSuccess(true);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
        {isSuccess ? (
          <SuccessScreen />
        ) : (
          <ConsultationForm onSuccess={handleSuccess} />
        )}
      </div>
      <Footer />
    </>
  );
}
