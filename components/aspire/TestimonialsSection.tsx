"use client";

import { Section } from "./ui/Section";
import { StarRating } from "./ui/StarRating";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "Parent of Year 10 student",
    rating: 4,
    quote:
      "My son started actually enjoying his Maths sessions. Big shift from last year's struggles",
  },
  {
    id: 2,
    name: "Parent of Year 8 student",
    rating: 5,
    quote:
      "The personalized attention made all the difference. My daughter's confidence in English has soared!",
  },
  {
    id: 3,
    name: "Parent of Year 11 student",
    rating: 5,
    quote:
      "Excellent tutoring service! My son improved his grades significantly in just one term.",
  },
  {
    id: 4,
    name: "Parent of Year 9 student",
    rating: 4,
    quote:
      "The tutors are patient and knowledgeable. Highly recommend Aspire Academics!",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [desktopIndex, setDesktopIndex] = useState(0);

  // Ensure component is mounted before starting auto-play
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToDesktopNext = () => {
    setDesktopIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToDesktopPrevious = () => {
    setDesktopIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  // Auto-play functionality for mobile
  useEffect(() => {
    if (!isMounted || isPaused) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, isMounted]);

  // Auto-play functionality for desktop carousel
  useEffect(() => {
    if (!isMounted) return;

    const interval = setInterval(() => {
      goToDesktopNext();
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(interval);
  }, [desktopIndex, isMounted]);

  const currentTestimonial = testimonials[currentIndex];

  // Get 3 testimonials starting from desktopIndex (with wrapping)
  const getVisibleTestimonials = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      result.push(testimonials[(desktopIndex + i) % testimonials.length]);
    }
    return result;
  };

  return (
    <Section variant="white" className="py-12">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-2xl lg:text-4xl font-extrabold text-aspire-blue">
            Testimonials
          </h2>
          <Image
            src={"/marketing/decorative-line.svg"}
            alt="Decorative Line"
            width={90}
            height={15}
            className="mt-[-10px]"
          />
        </div>

        {/* Mobile Carousel - Only visible on mobile */}
        <div className="lg:hidden">
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Left navigation button */}
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 z-10 flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-full border-2 border-gray-300 bg-white transition-all hover:border-aspire-blue hover:text-white active:border-aspire-blue active:bg-aspire-blue/20"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Main card */}
            <div className="mx-16 rounded-[20px] border border-gray-300 bg-white p-6 transition-all duration-300">
              <div className="space-y-4">
                <p className="text-center text-sm font-extrabold text-black">
                  {currentTestimonial.name}
                </p>
                <StarRating
                  rating={currentTestimonial.rating}
                  className="justify-center"
                />
                <p className="text-center text-sm leading-[14px] text-black">
                  {currentTestimonial.quote}
                </p>
              </div>
            </div>

            {/* Right navigation button */}
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 z-10 flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-full border-2 border-gray-300 bg-white transition-all hover:border-aspire-blue hover:text-white active:border-aspire-blue active:bg-aspire-blue/20"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Carousel indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-6 bg-aspire-blue"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Carousel - Only visible on desktop */}
        <div className="hidden lg:block relative">
          {/* Left gradient overlay */}
          <div className="absolute left-15 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

          {/* Right gradient overlay */}
          <div className="absolute right-15 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Left navigation button */}
          <button
            onClick={goToDesktopPrevious}
            className="absolute left-4 top-1/2 z-20 flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full border-2 border-gray-300 bg-white transition-all hover:border-aspire-blue hover:bg-aspire-blue hover:text-white shadow-lg"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Carousel container */}
          <div className="overflow-hidden px-16">
            <div
              className="grid grid-cols-3 gap-6 transition-all duration-700 ease-in-out"
              style={{
                transform: `translateX(0%)`,
              }}
            >
              {getVisibleTestimonials().map((testimonial, idx) => (
                <div
                  key={`${testimonial.id}-${desktopIndex}-${idx}`}
                  className="rounded-[20px] border border-gray-300 bg-white p-6 h-[170px]"
                >
                  <div className="space-y-4">
                    <p className="text-center text-sm font-extrabold text-black">
                      {testimonial.name}
                    </p>
                    <StarRating
                      rating={testimonial.rating}
                      className="justify-center"
                    />
                    <p className="text-center text-sm leading-[14px] text-black">
                      {testimonial.quote}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right navigation button */}
          <button
            onClick={goToDesktopNext}
            className="absolute right-4 top-1/2 z-20 flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full border-2 border-gray-300 bg-white transition-all hover:border-aspire-blue hover:bg-aspire-blue hover:text-white shadow-lg"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Rating footer */}
        <p className="text-center text-sm text-gray-400">
          Rated 4.9/5 by local parents
        </p>
      </div>
    </Section>
  );
}
