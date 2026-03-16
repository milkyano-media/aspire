import Link from "next/link";

export default function MockExamHero() {
  return (
    <section className="relative bg-[#002A6A] px-4 py-20 text-white">
      <div className="relative mx-auto max-w-7xl">
        
        <div className="mb-6 flex items-center space-x-2 text-sm">
          <Link href="/" className="text-white/70 hover:text-white">
            Home
          </Link>
          <span className="text-white/50">/</span>
          <span>Mock Exam Registration</span>
        </div>

        <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
          Mock Exam Registration
        </h1>
      </div>
    </section>
  );
}