import { useState } from "react";
import type { ApplicationDocument } from "../../types";

interface DocumentPreviewProps {
  document: ApplicationDocument;
  onClose: () => void;
}

export default function DocumentPreview({
  document,
  onClose,
}: DocumentPreviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  console.log(loading, error);

  const isImageFile = (filename: string) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(filename);
  };

  const isPdfFile = (filename: string) => {
    return /\.pdf$/i.test(filename);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-5xl w-full h-full m-4 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {document.document_name}
            </h3>
            <p className="text-sm text-gray-500">{document.document_type}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          {isPdfFile(document.document_name) ? (
            <embed
              src={document.document_url}
              type="application/pdf"
              width="100%"
              height="100%"
              className="border rounded"
            />
          ) : isImageFile(document.document_name) ? (
            <img
              src={document.document_url}
              alt={document.document_name}
              className="max-w-full h-auto mx-auto"
              onLoad={() => setLoading(false)}
              onError={() => setError(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-500">
                  Preview not available for this file type
                </p>
                <a
                  href={document.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Download to view
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
