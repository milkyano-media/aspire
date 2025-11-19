import Link from 'next/link';

export function CourseListHero() {
  return (
    <section className="relative bg-gradient-to-br from-[#070b30] via-[#0a1045] to-[#070b30] px-4 py-20 text-white">
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
          <span className="text-white">Course List</span>
        </div>

        {/* Page Title */}
        <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
          Course List
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-lg text-white/80">
          Explore our comprehensive programs designed to help students excel
          from Year 3 to Year 10
        </p>

        {/* Stats */}
        {/* <div className="mt-8 flex flex-wrap gap-8">
          <div>
            <div className="text-3xl font-bold text-orange-500">+99</div>
            <div className="text-sm text-white/70">Certified ARAT Tutors</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-500">8+</div>
            <div className="text-sm text-white/70">Years of Experience</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-500">1000+</div>
            <div className="text-sm text-white/70">Students Enrolled</div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
