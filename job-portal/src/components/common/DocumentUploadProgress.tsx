import { useState } from "react";

export interface DocumentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateDocument = (
  file: File,
  documentType: string
): DocumentValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // File size validation (10MB max)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    errors.push("File size must be less than 10MB");
  }

  // File type validation
  const allowedTypes = {
    CV: [".pdf", ".doc", ".docx"],
    PASSPORT: [".pdf", ".jpg", ".jpeg", ".png"],
    CERTIFICATE: [".pdf", ".jpg", ".jpeg", ".png"],
    COVER_LETTER: [".pdf", ".doc", ".docx"],
    PORTFOLIO: [".pdf", ".zip", ".rar"],
    TRANSCRIPT: [".pdf", ".jpg", ".jpeg", ".png"],
    LICENSE: [".pdf", ".jpg", ".jpeg", ".png"],
    OTHER: [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"],
  };

  const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
  const allowedExtensions =
    allowedTypes[documentType as keyof typeof allowedTypes] || [];

  if (!allowedExtensions.includes(fileExtension)) {
    errors.push(
      `Invalid file type. Allowed types for ${documentType}: ${allowedExtensions.join(
        ", "
      )}`
    );
  }

  // File name validation
  if (file.name.length > 100) {
    warnings.push(
      "File name is very long. Consider renaming for better organization."
    );
  }

  // Document-specific validations
  if (documentType === "CV" && file.size < 50 * 1024) {
    warnings.push(
      "CV file seems unusually small. Please ensure it contains complete information."
    );
  }

  if (
    documentType === "PASSPORT" &&
    fileExtension === ".pdf" &&
    file.size < 100 * 1024
  ) {
    warnings.push(
      "Passport document seems unusually small. Please ensure it's clearly readable."
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

export interface DocumentUploadProgressProps {
  files: {
    file: File;
    progress: number;
    status: "uploading" | "completed" | "error";
    error?: string;
  }[];
  onRetry: (index: number) => void;
  onRemove: (index: number) => void;
}

export default function DocumentUploadProgress({
  files,
  onRetry,
  onRemove,
}: DocumentUploadProgressProps) {
  return (
    <div className="space-y-3">
      {files.map((fileInfo, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {fileInfo.file.name}
              </p>
              <p className="text-xs text-gray-500">
                {(fileInfo.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {fileInfo.status === "uploading" && (
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${fileInfo.progress}%` }}
                    />
                  </div>
                  <span className="ml-2 text-xs text-gray-500">
                    {fileInfo.progress}%
                  </span>
                </div>
              )}

              {fileInfo.status === "completed" && (
                <div className="flex items-center text-green-600">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-1 text-xs">Uploaded</span>
                </div>
              )}

              {fileInfo.status === "error" && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-red-600">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-1 text-xs">Failed</span>
                  </div>
                  <button
                    onClick={() => onRetry(index)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Retry
                  </button>
                </div>
              )}

              <button
                onClick={() => onRemove(index)}
                className="text-gray-400 hover:text-red-600"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {fileInfo.status === "error" && fileInfo.error && (
            <p className="mt-1 text-xs text-red-600">{fileInfo.error}</p>
          )}
        </div>
      ))}
    </div>
  );
}
