import { ConsultationForm } from "@/components/aspire/ConsultationForm/ConsultationForm";
import { Footer } from "@/components/aspire/Footer";

export default function SignInPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <ConsultationForm onSuccess={() => {}} />
      </div>
      <Footer />
    </>
  );
}
