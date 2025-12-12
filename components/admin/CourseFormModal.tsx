"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { X } from "lucide-react";
import { createCourse, updateCourse } from "@/app/admin/actions";
import { CourseForm } from "./CourseForm";
import { Program } from "@/lib/db/schema";

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: (Omit<Program, 'includes'> & { includes: string[] }) | null;
}

export function CourseFormModal({
  isOpen,
  onClose,
  course,
}: CourseFormModalProps) {
  const action = course ? updateCourse : createCourse;
  const [state, formAction, isPending] = useActionState(action, {});

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Handle successful creation/update
  useEffect(() => {
    if ('success' in state && state.success && isOpen) {
      onClose();
    }
  }, [state, onClose, isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={handleOverlayClick}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Close modal"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Modal Content */}
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title" className="mb-6 text-2xl font-bold text-[#070b30]">
          {course ? "Edit Course" : "Create Course"}
        </h2>

        <form action={formAction}>
          <CourseForm
            course={course}
            isPending={isPending}
            error={state.error}
          />
        </form>
      </div>
    </div>
  );
}
