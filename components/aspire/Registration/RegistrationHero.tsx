import Link from "next/link";

export default function RegistrationHero() {
  return (
    <section className="relative bg-[#002A6A] px-4 py-20 text-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center space-x-2 text-sm">
          <Link
            href="/"
            className="text-white/70 transition-colors hover:text-white"
          >
            Home
          </Link>
          <span className="text-white/50">/</span>
          <span className="text-white">Registration</span>
        </div>

        {/* Page Title */}
        <h1 className="mb-8 text-4xl font-bold md:text-5xl lg:text-6xl">
          Registration
        </h1>
      </div>
    </section>
  );
}
