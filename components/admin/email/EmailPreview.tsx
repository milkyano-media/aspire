"use client";

import { useEffect } from "react";
import { generateCustomEmailTemplate } from "@/lib/email/templates";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface EmailPreviewProps {
  subject: string;
  htmlBody: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * EmailPreview - Modal to preview email with Aspire branding
 * Shows final email as it will appear to recipients
 */
export function EmailPreview({
  subject,
  htmlBody,
  isOpen,
  onClose,
}: EmailPreviewProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  // Generate final email template with Aspire branding
  const { html } = generateCustomEmailTemplate(subject, htmlBody);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-[#002366]">
            Email Preview
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Subject Line */}
        <div className="px-4 py-3 border-b bg-gray-50">
          <div className="text-sm text-gray-600">Subject:</div>
          <div className="font-medium text-gray-900">{subject}</div>
        </div>

        {/* Email Content Preview */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-4 bg-gray-100">
          <div
            className="bg-white"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t bg-white">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
