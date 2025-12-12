"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { X } from "lucide-react";
import { deleteCourse } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Program } from "@/lib/db/schema";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  course: (Omit<Program, 'includes'> & { includes: string[] }) | null;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  course,
}: DeleteConfirmDialogProps) {
  const [state, formAction, isPending] = useActionState(deleteCourse, {});

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

  // Handle successful deletion
  useEffect(() => {
    if ('success' in state && state.success) {
      onClose();
    }
  }, [state, onClose]);

  if (!isOpen || !course) return null;

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
        aria-label="Close dialog"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Dialog Content */}
      <div
        className="relative max-w-md w-full rounded-lg bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <h2
          id="dialog-title"
          className="mb-4 text-2xl font-bold text-[#070b30]"
        >
          Delete Course
        </h2>

        <p className="mb-6 text-[#697585]">
          Are you sure you want to delete the course{" "}
          <strong>{course.programName}</strong>? This action cannot be undone.
        </p>

        {state.error && (
          <p className="mb-4 text-sm text-red-500">{state.error}</p>
        )}

        <form action={formAction} className="flex gap-3">
          <input type="hidden" name="id" value={course.id} />
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            className="flex-1"
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </form>
      </div>
    </div>
  );
}
