"use client";

import { trackCTAClick } from "@/lib/gtm";

interface CourseCardProps {
  yearLevel: string;
  programName: string;
  description: string;
  includes: string[];
  note?: string;
  tutorBirdScriptUrl?: string;
  price?: string;
  priceUnit?: string;
  startDate?: string | null;
  wiseCourseId: string;
}

export function CourseCard({
  yearLevel,
  programName,
  description,
  includes,
  note,
  price,
  priceUnit,
  startDate,
  wiseCourseId,
}: CourseCardProps) {
  const handleApplyClick = () => {
    trackCTAClick("Apply Now", `course-card-${yearLevel}`);
    const wise_base_url = process.env.NEXT_PUBLIC_WISE_BASE_URL;
    window.open(
      `${wise_base_url}/courses/${wiseCourseId}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/90 to-white/70 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
      {/* Decorative gradient overlay */}
      <div className="absolute right-0 top-0 h-32 w-32 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Year Level Badge */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="inline-block rounded-full bg-[#070b30] px-4 py-2 text-sm font-semibold text-white">
          {yearLevel}
        </div>
        {startDate && (
          <div className="inline-block rounded-full bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-600">
            Starts: {formatDate(startDate)}
          </div>
        )}
      </div>

      {/* Program Name */}
      <h3 className="mb-4 text-2xl font-bold text-[#070b30]">{programName}</h3>

      {/* Description */}
      <p className="mb-6 text-base leading-relaxed text-[#697585]">
        {description}
      </p>

      {/* Includes List */}
      <div className="mb-6">
        <h4 className="mb-3 font-semibold text-[#070b30]">What's Included:</h4>
        <ul className="space-y-2">
          {includes.map((item, index) => (
            <li key={index} className="flex items-start text-[#697585]">
              <span className="mr-2 mt-1 text-orange-500">•</span>
              <span className="text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Note */}
      {note && note !== "-" && (
        <p className="mb-6 text-sm italic text-[#697585]">Note: {note}</p>
      )}

      {/* Price Section */}
      {price && (
        <div className="mb-6 flex items-baseline gap-2 border-t border-gray-200 pt-6">
          <span className="text-4xl font-bold text-[#070b30]">{price}</span>
          {priceUnit && (
            <span className="text-lg text-[#697585]">{priceUnit}</span>
          )}
        </div>
      )}

      {/* CTA Button */}
      <button
        type="button"
        className="inline-block rounded-lg bg-orange-500 px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-lg cursor-pointer"
        onClick={handleApplyClick}
      >
        Apply Now
      </button>
    </div>
  );
}
