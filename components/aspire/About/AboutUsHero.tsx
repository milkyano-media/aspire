import Link from 'next/link';
import Image from 'next/image';

export function AboutUsHero() {
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
          <span className="text-white">About Us</span>
        </div>

        {/* Page Title */}
        <h1 className="mb-8 text-4xl font-bold md:text-5xl lg:text-6xl">
          About Us
        </h1>

        {/* Hero Images Grid */}
        {/* <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          
          <div className="relative h-[300px] overflow-hidden rounded-2xl bg-gray-800 md:h-[400px]">
            <div className="flex h-full items-center justify-center text-white/50">
              <Image
                src="/marketing/about/about-1.jpg"
                alt="Aspire Academics Tutoring"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="relative h-[300px] overflow-hidden rounded-2xl bg-gray-800 md:h-[400px]">
            <div className="flex h-full items-center justify-center text-white/50">
              <Image
                src="/marketing/about/about-2.jpg"
                alt="Students Learning"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
