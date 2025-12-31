"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, X, FileIcon, AlertCircle } from "lucide-react";

export interface AttachmentFile {
  filename: string;
  content: string; // Base64 encoded
  contentType: string;
  size: number;
}

interface FileAttachmentProps {
  attachments: AttachmentFile[];
  onAttachmentsChange: (attachments: AttachmentFile[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

/**
 * FileAttachment - Component for uploading and managing email attachments
 * Converts files to base64 for transmission via server actions
 */
export function FileAttachment({
  attachments,
  onAttachmentsChange,
  maxFiles = 5,
  maxSizeMB = 10,
}: FileAttachmentProps) {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setIsUploading(true);

    try {
      const newAttachments: AttachmentFile[] = [];

      for (const file of Array.from(files)) {
        // Check file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
          setError(`File "${file.name}" is too large. Maximum size is ${maxSizeMB}MB.`);
          continue;
        }

        // Check total number of files
        if (attachments.length + newAttachments.length >= maxFiles) {
          setError(`Maximum ${maxFiles} files allowed.`);
          break;
        }

        // Read file as base64
        const base64 = await fileToBase64(file);

        newAttachments.push({
          filename: file.name,
          content: base64,
          contentType: file.type || "application/octet-stream",
          size: file.size,
        });
      }

      if (newAttachments.length > 0) {
        onAttachmentsChange([...attachments, ...newAttachments]);
      }
    } catch (err) {
      setError("Failed to upload files. Please try again.");
      console.error("File upload error:", err);
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleRemoveAttachment = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    onAttachmentsChange(newAttachments);
    setError(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label
          htmlFor="file-upload"
          className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${
            isUploading || attachments.length >= maxFiles
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <Paperclip className="h-4 w-4" />
          {isUploading ? "Uploading..." : "Attach Files"}
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileChange}
          disabled={isUploading || attachments.length >= maxFiles}
          className="hidden"
          accept="*/*"
        />
        <span className="text-xs text-gray-500">
          Max {maxFiles} files, {maxSizeMB}MB each
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FileIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {attachment.filename}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(attachment.size)} • {attachment.contentType}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveAttachment(index)}
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Convert File to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
