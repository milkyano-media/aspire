"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, AlertTriangle } from "lucide-react";

interface SendEmailButtonProps {
  recipientCount: number;
  onSend: () => void;
  disabled?: boolean;
  isPending?: boolean;
}

/**
 * SendEmailButton - Two-step confirmation button for sending emails
 * Shows recipient count and requires confirmation before sending
 */
export function SendEmailButton({
  recipientCount,
  onSend,
  disabled = false,
  isPending = false,
}: SendEmailButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInitialClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    onSend();
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const isDisabled = disabled || recipientCount === 0 || isPending;

  if (showConfirmation) {
    return (
      <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-900">
            Send email to {recipientCount} parent(s)?
          </p>
          <p className="text-xs text-amber-700 mt-1">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-[#002366] hover:bg-[#001a4d]"
          >
            {isPending ? "Sending..." : "Confirm Send"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      type="button"
      onClick={handleInitialClick}
      disabled={isDisabled}
      className="bg-[#002366] hover:bg-[#001a4d]"
    >
      <Send className="h-4 w-4 mr-2" />
      {isPending
        ? "Sending..."
        : `Send to ${recipientCount} Parent${recipientCount !== 1 ? "s" : ""}`}
    </Button>
  );
}
