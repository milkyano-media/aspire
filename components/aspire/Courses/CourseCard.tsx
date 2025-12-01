"use client";

import { SmoothScrollLink } from '@/components/ui/smooth-scroll-link';

interface CourseCardProps {
  yearLevel: string;
  programName: string;
  description: string;
  includes: string[];
  note?: string;
}

export function CourseCard({
  yearLevel,
  programName,
  description,
  includes,
  note,
}: CourseCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/90 to-white/70 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
      {/* Decorative gradient overlay */}
      <div className="absolute right-0 top-0 h-32 w-32 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Year Level Badge */}
      <div className="mb-4 inline-block rounded-full bg-[#070b30] px-4 py-2 text-sm font-semibold text-white">
        {yearLevel}
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
      {note && (
        <p className="mb-6 text-sm italic text-[#697585]">
          Note: {note}
        </p>
      )}

      {/* CTA Button */}
      <SmoothScrollLink
        href="/#form"
        className="inline-block rounded-lg bg-orange-500 px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-lg"
      >
        Apply Now
      </SmoothScrollLink>
    </div>
  );
}
