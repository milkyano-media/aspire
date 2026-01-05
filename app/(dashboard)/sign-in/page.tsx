import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/queries";
import { SignInForm } from "@/components/auth/SignInForm";

export default async function SignInPage() {
  const user = await getUser();

  if (user) {
    // Redirect authenticated users based on role
    if (user.role === 'admin' || user.role === 'teacher') {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#070b30]">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
