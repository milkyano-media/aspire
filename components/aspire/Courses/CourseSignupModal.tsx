'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface CourseSignupModalProps {
  isOpen: boolean;
  courseTitle: string;
  tutorBirdScriptUrl?: string;
  onClose: () => void;
  children?: React.ReactNode;
}

export function CourseSignupModal({
  isOpen,
  courseTitle,
  tutorBirdScriptUrl,
  onClose,
  children,
}: CourseSignupModalProps) {
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const isInitializedRef = useRef(false);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle script injection (only if no children and tutorBirdScriptUrl is provided)
  useEffect(() => {
    if (!isOpen || !widgetContainerRef.current || children || !tutorBirdScriptUrl) {
      return;
    }

    if (isInitializedRef.current) {
      return;
    }

    const script = document.createElement('script');
    script.src = tutorBirdScriptUrl;
    script.async = true;

    widgetContainerRef.current.appendChild(script);
    scriptRef.current = script;
    isInitializedRef.current = true;

    return () => {
      // Clean up on modal close
      if (scriptRef.current?.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
        scriptRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, [isOpen, tutorBirdScriptUrl, children]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the overlay, not its children
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
        <h2 id="modal-title" className="mb-4 text-2xl font-bold text-[#070b30]">
          {courseTitle}
        </h2>

        {/* Render children if provided, otherwise TutorBird Widget Container */}
        {children ? (
          <div className="flex w-full items-center justify-center">{children}</div>
        ) : (
          <div ref={widgetContainerRef} className="w-full" />
        )}
      </div>
    </div>
  );
}
