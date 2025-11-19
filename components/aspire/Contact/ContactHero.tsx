import Link from 'next/link';

export function ContactHero() {
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
          <span className="text-white">Contact Us</span>
        </div>

        {/* Page Title */}
        <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
          Contact Us
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-lg text-white/80">
          Feel free to write us anytime. We're here to help!
        </p>
      </div>
    </section>
  );
}
