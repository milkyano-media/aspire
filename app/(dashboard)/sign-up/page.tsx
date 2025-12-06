"use client";

import { Footer } from "@/components/aspire/Footer";
import { useEffect, useRef, useState } from "react";

export default function SignInPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Skip if already initialized or container doesn't exist
    if (isInitialized.current || !containerRef.current) return;

    // Check if container already has content
    if (containerRef.current.children.length > 0) return;

    // Mark as initialized before loading
    isInitialized.current = true;

    // Create and inject the TutorBird script
    const script = document.createElement("script");
    script.src =
      "https://app.tutorbird.com/Widget/v4/Widget.ashx?settings=eyJTY2hvb2xJRCI6InNjaF9wV1RKVCIsIldlYnNpdGVJRCI6Indic181ZnZKViIsIldlYnNpdGVCbG9ja0lEIjoid2JiX2NZNDlKdyJ9";
    script.async = true;

    // Hide loading spinner when script loads
    script.onload = () => {
      setIsLoading(false);
    };

    // Also hide on error to prevent infinite loading
    script.onerror = () => {
      setIsLoading(false);
    };

    containerRef.current.appendChild(script);

    // Cleanup function
    return () => {
      // Don't cleanup - let the widget persist
      // This prevents re-initialization on StrictMode remount
    };
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-[#002366]">
            Book a Free Trial Now
          </h2>
          <div className="mb-6 h-0.5 w-16 bg-[#002366]" />

          {/* Loading Spinner */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#002366] border-t-transparent" />
            </div>
          )}

          {/* TutorBird Widget Container */}
          <div
            ref={containerRef}
            className={`w-full ${isLoading ? "hidden" : ""}`}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
