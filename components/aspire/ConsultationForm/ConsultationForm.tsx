"use client";

import { useEffect, useRef } from "react";

export function ConsultationForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

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

    containerRef.current.appendChild(script);

    // Cleanup function
    return () => {
      // Don't cleanup - let the widget persist
      // This prevents re-initialization on StrictMode remount
    };
  }, []);

  return (
    <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold text-[#002366]">
        Get Your Free Consultation Today
      </h2>
      <div className="mb-6 h-0.5 w-16 bg-[#002366]" />

      {/* TutorBird Widget Container */}
      <div ref={containerRef} className="w-full" />
    </div>
  );
}
