"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const tutors = [
  {
    id: 1,
    image: "/marketing/about/tutor1.webp",
    alt: "Rafid Haider - Chemistry Tutor",
  },
  {
    id: 2,
    image: "/marketing/about/tutor2.webp",
    alt: "Tasneem Muntasir - Chemistry Tutor",
  },
  {
    id: 3,
    image: "/marketing/about/tutor3.webp",
    alt: "Yaseen - Math Tutor",
  },
  {
    id: 4,
    image: "/marketing/about/tutor4.webp",
    alt: "Ananya - Biology Tutor",
  },
];

export function TutorGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        selectedImage === 0 ? tutors.length - 1 : selectedImage - 1,
      );
    }
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        selectedImage === tutors.length - 1 ? 0 : selectedImage + 1,
      );
    }
  };

  return (
    <>
      {/* Tutor Gallery Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {tutors.map((tutor, index) => (
          <button
            key={tutor.id}
            onClick={() => openLightbox(index)}
            className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-lg transition-all duration-300 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/50"
          >
            <div className="relative h-[300px]">
              <Image
                src={tutor.image}
                alt={tutor.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            {/* Overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[#070b30]/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="text-sm font-semibold text-white">
                Click to view
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Image Container */}
          <div
            className="relative h-[80vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={tutors[selectedImage].image}
              alt={tutors[selectedImage].alt}
              fill
              className="object-contain"
              quality={100}
            />
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
            {selectedImage + 1} / {tutors.length}
          </div>
        </div>
      )}
    </>
  );
}
