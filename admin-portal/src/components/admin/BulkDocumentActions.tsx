import { useState } from "react";
import type { JobApplication } from "../../types";

interface BulkDocumentActionsProps {
  selectedApplications: string[];
  applications: JobApplication[];
  onBulkDownload: (applicationIds: string[]) => void;
  onBulkExport: (applicationIds: string[]) => void;
}

export default function BulkDocumentActions({
  selectedApplications,
  applications,
  onBulkDownload,
  onBulkExport,
}: BulkDocumentActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const selectedApps = applications.filter((app) =>
    selectedApplications.includes(app.id)
  );
  const totalDocuments = selectedApps.reduce(
    (total, app) => total + (app.documents?.length || 0),
    0
  );

  const handleBulkDownload = async () => {
    setIsLoading(true);
    try {
      await onBulkDownload(selectedApplications);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkExport = async () => {
    setIsLoading(true);
    try {
      await onBulkExport(selectedApplications);
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedApplications.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-blue-900">
            {selectedApplications.length} application
            {selectedApplications.length > 1 ? "s" : ""} selected
          </h3>
          <p className="text-xs text-blue-700">
            {totalDocuments} document{totalDocuments !== 1 ? "s" : ""} total
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleBulkDownload}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg
              className="-ml-1 mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {isLoading ? "Preparing..." : "Download All"}
          </button>

          <button
            onClick={handleBulkExport}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            <svg
              className="-ml-1 mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}
