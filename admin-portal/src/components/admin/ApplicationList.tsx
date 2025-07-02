import { useState, useEffect } from "react";
import type { JobApplication, ApplicationDocument } from "../../types";
import AIScoreCircle from "./AIScoreCircle";
import DocumentPreview from "../common/DocumentPreview";

interface ApplicationListProps {
  applications: JobApplication[];
  onStatusChange: (id: string, status: JobApplication["status"]) => void;
}

export default function ApplicationList({
  applications,
  onStatusChange,
}: ApplicationListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewDocument, setPreviewDocument] =
    useState<ApplicationDocument | null>(null);

  const getDocumentTypeLabel = (docType: string): string => {
    const labels: Record<string, string> = {
      cv: "CV/Resume",
      passport: "Passport",
      birth_certificate: "Birth Certificate",
      kcse_certificate: "KCSE Certificate",
      kcpe_certificate: "KCPE Certificate",
      certificate_of_good_conduct: "Certificate of Good Conduct",
      academic_transcripts: "Academic Transcripts",
      professional_certificate: "Professional Certificate",
      work_permit: "Work Permit",
      police_clearance: "Police Clearance",
      medical_certificate: "Medical Certificate",
      other: "Other Documents",
    };
    return labels[docType] || docType;
  };

  useEffect(() => {
    console.log("ApplicationList received applications:", applications);
  }, [applications]);

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div
          key={application.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm font-medium">
                      {application.applicant_name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {application.applicant_name}
                  </h3>
                  <p className="text-sm text-gray-500">{application.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">AI Score:</span>
                  <AIScoreCircle
                    score={application.ai_score || 0}
                    status={application.status}
                  />
                </div>
                <select
                  value={application.status}
                  onChange={(e) =>
                    onStatusChange(
                      application.id,
                      e.target.value as JobApplication["status"]
                    )
                  }
                  className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  onClick={() =>
                    setExpandedId(
                      expandedId === application.id ? null : application.id
                    )
                  }
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className={`h-5 w-5 transform ${
                      expandedId === application.id ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {expandedId === application.id && (
            <div className="border-t border-gray-200 px-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Contact Information
                  </h4>
                  <dl className="mt-2 space-y-1">
                    <div>
                      <dt className="text-sm text-gray-500">Phone</dt>
                      <dd className="text-sm text-gray-900">
                        {application.phone}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Email</dt>
                      <dd className="text-sm text-gray-900">
                        {application.email}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Skills</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {application.skills?.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900">
                  Cover Letter
                </h4>
                <p className="mt-2 text-sm text-gray-500">
                  {application.cover_letter}
                </p>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900">
                  Documents ({application.documents?.length || 0})
                </h4>
                {application.documents && application.documents.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {application.documents.map((document) => (
                      <div
                        key={document.id}
                        className="flex items-center justify-between p-2 border border-gray-200 rounded-md bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {document.document_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {getDocumentTypeLabel(document.document_type)} •
                              Uploaded{" "}
                              {new Date(
                                document.uploaded_at
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setPreviewDocument(document)}
                            className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg
                              className="mr-1 h-3 w-3 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            Preview
                          </button>
                          <a
                            href={document.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg
                              className="mr-1 h-3 w-3 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">
                    No documents uploaded
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {previewDocument && (
        <DocumentPreview
          document={previewDocument}
          onClose={() => setPreviewDocument(null)}
        />
      )}
    </div>
  );
}
