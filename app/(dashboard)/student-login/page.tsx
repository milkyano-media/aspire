"use client";

import { useEffect, useRef } from "react";
import { Footer } from "@/components/aspire/Footer";

export default function StudentLoginPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Skip if already initialized or container doesn't exist
    if (isInitialized.current || !containerRef.current) return;

    // Check if container already has content
    if (containerRef.current.children.length > 0) return;

    // Mark as initialized before loading
    isInitialized.current = true;

    // Create and inject the TutorBird login script
    const script = document.createElement("script");
    script.src =
      "https://app.tutorbird.com/Widget/v4/Widget.ashx?settings=eyJTY2hvb2xJRCI6InNjaF9wV1RKVCIsIldlYnNpdGVJRCI6Indic181ZnZKViIsIldlYnNpdGVCbG9ja0lEIjoid2JiX2NZcFNKZCJ9";
    script.async = true;

    containerRef.current.appendChild(script);

    // Cleanup function
    return () => {
      // Don't cleanup - let the widget persist
      // This prevents re-initialization on StrictMode remount
    };
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#070b30] via-[#0a1145] to-[#070b30] px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Student Portal Login
          </h1>
          <p className="text-lg text-white/80 md:text-xl">
            Access your learning dashboard, track progress, and connect with
            your tutors
          </p>
        </div>
      </section>

      {/* Login Widget Section */}
      <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-[#002366]">
            Login to Your Account
          </h2>
          <div className="mb-6 h-0.5 w-16 bg-[#002366]" />

          {/* TutorBird Login Widget Container */}
          <div ref={containerRef} className="w-full" />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
