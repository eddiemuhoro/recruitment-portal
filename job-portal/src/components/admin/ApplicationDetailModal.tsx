import type { Job, JobApplication } from "../../types";

interface ApplicationDetailModalProps {
  application: JobApplication;
  job: Job | undefined;
  onClose: () => void;
  onStatusChange: (
    applicationId: string,
    status: JobApplication["status"]
  ) => void;
}

const getStatusColor = (status: JobApplication["status"]) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "reviewed":
      return "bg-blue-100 text-blue-800";
    case "accepted":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const ApplicationDetailModal = ({
  application,
  job,
  onClose,
  onStatusChange,
}: ApplicationDetailModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {application.applicant_name}
              </h2>
              <p className="text-gray-600">
                {application.email} - {application.phone}
              </p>
              <p className="text-gray-600 mt-1">Applied for: {job?.title}</p>
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
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Cover Letter
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {application.cover_letter}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Application Status
              </h3>
              <select
                className={`px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(
                  application.status
                )}`}
                value={application.status}
                onChange={(e) =>
                  onStatusChange(
                    application.id,
                    e.target.value as JobApplication["status"]
                  )
                }
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Documents ({application.documents?.length || 0})
              </h4>
              {application.documents && application.documents.length > 0 ? (
                <div className="space-y-2">
                  {application.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {doc.document_name} ({doc.document_type})
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No documents uploaded</p>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">
                Applied on:{" "}
                {new Date(application.applied_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
